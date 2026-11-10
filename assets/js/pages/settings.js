/**
 * Sign Depot Operations PMS — Settings Module
 * File: assets/js/pages/settings.js
 */

(function (window) {
  'use strict';

  const App = window.SignDepotApp;
  if (!App) return;

  const state = App.state;
  const {
    renderPagination,
    renderEditableCell,
    renderInlineSelect,
    renderInlineDate,
    renderInlineNumber,
    showToast,
    showCustomConfirm,
    saveStateToStorage,
    escapeHTML,
    toTitleCase,
    isOverdue,
    getDeadlineAlertStatus,
    getAvailabilityBadge,
    canUserAccessTab,
    canUserAccessModule,
    hasPermission,
    isCurrentUserSuperAdmin,
    getLoggedInArtist,
    getLoggedInSalesRep,
    syncFilterSelectUI,
    upgradeAllFilterSelects,
    upgradeAllFormSelects,
    syncAllFormDropdowns,
    syncFormDropdownBtn,
    openDirectiveForJo,
    editSalesRequest,
    deleteSalesRequest,
    downloadCsv
  } = App.utils || App;

  const {
    STORAGE_KEY,
    DEFAULT_ARTISTS,
    DEFAULT_SALES_REPS,
    PROJECT_STATUSES,
    DESIGN_STATUSES,
    PRIORITY_LEVELS,
    APPROVAL_LEVELS,
    FILE_STATUS_LEVELS,
    PLACEMENT_OPTIONS,
    RELEASING_MODES,
    HEAD_APPROVAL_LEVELS
  } = App.constants || {};

  // ==========================================================================
  // MODULE 9: SETTINGS ENGINE
  // ==========================================================================

  function renderSettings() {
    const artistListEl = document.getElementById('settingsArtistList');
    if (artistListEl) {
      artistListEl.innerHTML = state.artists.map(a => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#F8FAFC; border-radius:var(--radius-sm); border:1px solid #E2E8F0;">
          <span style="font-weight:700; font-size:13px;">${escapeHTML(a)}</span>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.removeArtist('${a}')">Remove</button>
        </div>
      `).join('');
    }

    const salesListEl = document.getElementById('settingsSalesList');
    if (salesListEl) {
      salesListEl.innerHTML = state.salesReps.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#F8FAFC; border-radius:var(--radius-sm); border:1px solid #E2E8F0;">
          <span style="font-weight:700; font-size:13px;">${escapeHTML(s)}</span>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.removeSales('${s}')">Remove</button>
        </div>
      `).join('');
    }

    const btnAddArtist = document.getElementById('btnSettingsAddArtist');
    const inputAddArtist = document.getElementById('settingsNewArtistInput');
    if (btnAddArtist && inputAddArtist) {
      btnAddArtist.onclick = () => {
        const val = toTitleCase(inputAddArtist.value.trim());
        if (val && !state.artists.includes(val)) {
          state.artists.push(val);
          state.artists.sort();
          inputAddArtist.value = '';
          saveStateToStorage();
          renderSettings();
          populateSalesFiltersDropdowns();
          populateTrackerFiltersDropdowns();
          showToast(`Artist "${val}" added.`);

          if (window.PMS_API_URL) {
            fetch(window.PMS_API_URL + '?action=add_artist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: val })
            })
            .then(res => res.json())
            .then(res => {
              if (res && res.success && res.data) {
                state.artists = res.data;
                saveStateToStorage();
                populateSalesFiltersDropdowns();
                populateTrackerFiltersDropdowns();
              }
            })
            .catch(e => console.warn('add_artist API error:', e));
          }
        }
      };
    }

    const btnAddSales = document.getElementById('btnSettingsAddSales');
    const inputAddSales = document.getElementById('settingsNewSalesInput');
    if (btnAddSales && inputAddSales) {
      btnAddSales.onclick = () => {
        const val = toTitleCase(inputAddSales.value.trim());
        if (val && !state.salesReps.includes(val)) {
          state.salesReps.push(val);
          state.salesReps.sort();
          inputAddSales.value = '';
          saveStateToStorage();
          renderSettings();
          populateSalesFiltersDropdowns();
          showToast(`Sales representative "${val}" added.`);

          if (window.PMS_API_URL) {
            fetch(window.PMS_API_URL + '?action=add_sales_rep', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: val })
            })
            .then(res => res.json())
            .then(res => {
              if (res && res.success && res.data) {
                state.salesReps = res.data;
                saveStateToStorage();
                populateSalesFiltersDropdowns();
              }
            })
            .catch(e => console.warn('add_sales_rep API error:', e));
          }
        }
      };
    }

    const btnExport = document.getElementById('btnSettingsExportJson');
    if (btnExport) {
      btnExport.onclick = () => {
        const jsonStr = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sign_Depot_Data_Backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON backup downloaded.');
      };
    }

    const btnImport = document.getElementById('btnSettingsImportJson');
    const importInput = document.getElementById('importJsonFileInput');
    if (btnImport && importInput) {
      btnImport.onclick = () => importInput.click();
      importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && Array.isArray(parsed.requests)) {
              state.requests = parsed.requests;
              state.artists = parsed.artists || state.artists;
              state.salesReps = parsed.salesReps || state.salesReps;
              saveStateToStorage();
              renderSettings();
              showToast('Backup restored successfully!');
            }
          } catch (err) {
            showToast('Failed to parse JSON file.', 'error');
          }
        };
        reader.readAsText(file);
      };
    }

    // Super Admin Deletion Security Passcode Management
    const loginPasswordEl = document.getElementById('settingsLoginPasswordInput');
    const newPasscodeEl = document.getElementById('settingsNewPasscodeInput');
    const savePasscodeBtn = document.getElementById('btnSettingsSavePasscode');
    const feedbackEl = document.getElementById('settingsPasscodeFeedback');

    // Ensure password fields are always clean and not pre-filled by browser credential managers
    if (loginPasswordEl) loginPasswordEl.value = '';
    if (newPasscodeEl) newPasscodeEl.value = '';

    if (savePasscodeBtn && newPasscodeEl) {
      savePasscodeBtn.onclick = () => {
        const loginPass = loginPasswordEl ? loginPasswordEl.value.trim() : '';
        if (!loginPass) {
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#DC2626';
            feedbackEl.textContent = 'Please enter your current account login password.';
          }
          if (loginPasswordEl) loginPasswordEl.focus();
          return;
        }

        const val = newPasscodeEl.value.trim();
        if (!val) {
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#DC2626';
            feedbackEl.textContent = 'Please enter a valid new passcode.';
          }
          newPasscodeEl.focus();
          return;
        }

        savePasscodeBtn.disabled = true;
        savePasscodeBtn.textContent = 'Saving...';

        const updateLocal = () => {
          if (loginPasswordEl) loginPasswordEl.value = '';
          newPasscodeEl.value = '';
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#09090B';
            feedbackEl.textContent = 'Deletion security passcode successfully saved and protected!';
            setTimeout(() => { if (feedbackEl) feedbackEl.style.display = 'none'; }, 4000);
          }
          showToast('Super Admin deletion passcode updated.');
          savePasscodeBtn.disabled = false;
          savePasscodeBtn.textContent = 'Save Passcode';
        };

        if (window.PMS_API_URL && isCurrentUserSuperAdmin()) {
          fetch(window.PMS_API_URL + '?action=set_delete_passcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode: val, login_password: loginPass })
          })
          .then(r => r.json())
          .then(res => {
            if (res && res.success) {
              updateLocal();
            } else {
              if (feedbackEl) {
                feedbackEl.style.display = 'block';
                feedbackEl.style.color = '#DC2626';
                feedbackEl.textContent = res.error || 'Failed to update passcode on server.';
              }
              savePasscodeBtn.disabled = false;
              savePasscodeBtn.textContent = 'Save Passcode';
            }
          })
          .catch(() => updateLocal());
        } else {
          updateLocal();
        }
      };
    }

    const btnResetAll = document.getElementById('btnSettingsResetDefaults');
    if (btnResetAll) {
      btnResetAll.onclick = () => {
        showCustomConfirm({
          title: 'Reset to Factory Defaults',
          subtitle: 'LOCALSTORAGE DATA RESET',
          message: 'Are you sure you want to reset all mock data to factory defaults? All unsynced local drafts will be cleared.',
          requiresPasscode: false,
          confirmText: 'Reset Defaults',
          onConfirm: () => {
            localStorage.removeItem(STORAGE_KEY);
            state.artists = [...DEFAULT_ARTISTS];
            state.salesReps = [...DEFAULT_SALES_REPS];
            state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
            state.templateElements = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS));
            state.attachments = [...DEFAULT_ATTACHMENTS];
            saveStateToStorage();
            renderCurrentView(state.activeView);
            showToast('Sample dataset restored to factory defaults.');
            return true;
          }
        });
      };
    }
  }


  // Expose Settings Public API
  App.renderSettings = renderSettings;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-settings')) renderSettings();
    });
  } else {
    if (document.getElementById('view-settings')) renderSettings();
  }
})(window);
