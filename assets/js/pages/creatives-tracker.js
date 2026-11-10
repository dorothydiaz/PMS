/**
 * Sign Depot Operations PMS — Creatives Tracker & Production Module
 * File: assets/js/pages/creatives-tracker.js
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
    isProjectArtistAccepted,
    getStatusBadgeClass,
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
  // MODULE 3: CREATIVES TRACKER (Google Sheets Replica with Inline Editing)
  // ==========================================================================

  function matchesTrackerDateFilter(r, filter) {
    if (!filter) return true;
    const { datePreset, dateCustom, dateColumn } = filter;
    if (!datePreset && !dateCustom) return true;

    let targetDates = [];
    if (dateColumn === 'any') {
      targetDates = [r.orderDate, r.designDeadline, r.dateUpdated, r.timestamp].filter(Boolean);
    } else if (dateColumn === 'designDeadline') {
      targetDates = [r.designDeadline].filter(Boolean);
    } else if (dateColumn === 'dateUpdated') {
      targetDates = [r.dateUpdated].filter(Boolean);
    } else {
      targetDates = [r.orderDate, r.timestamp].filter(Boolean);
    }

    if (targetDates.length === 0) return false;

    const itemDateStrs = targetDates.map(d => {
      const m = String(d).match(/\d{4}-\d{2}-\d{2}/);
      return m ? m[0] : '';
    }).filter(Boolean);

    if (itemDateStrs.length === 0) return false;

    const now = new Date();
    const formatYMD = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const todayStr = formatYMD(now);

    if (datePreset === 'today') {
      return itemDateStrs.some(ds => ds === todayStr);
    }

    if (datePreset === 'yesterday') {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const yestStr = formatYMD(yest);
      return itemDateStrs.some(ds => ds === yestStr);
    }

    if (datePreset === 'this_week') {
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const monStr = formatYMD(monday);
      const sunStr = formatYMD(sunday);
      return itemDateStrs.some(ds => ds >= monStr && ds <= sunStr);
    }

    if (datePreset === 'this_month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const prefix = `${y}-${m}`;
      return itemDateStrs.some(ds => ds.startsWith(prefix));
    }

    if (datePreset === 'custom' || (!datePreset && dateCustom)) {
      if (!dateCustom) return true;
      return itemDateStrs.some(ds => ds === dateCustom);
    }

    return true;
  }

  function renderCreativesTracker() {
    populateTrackerFiltersDropdowns();
    if (typeof App.updateDashboardKPIs === "function") App.updateDashboardKPIs();

    const myArtist = getLoggedInArtist();
    let list = [...state.requests];

    // Artist-scoped filter: if logged in as an artist, show ONLY their assigned tasks!
    if (myArtist) {
      list = list.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase());

      // Show artist banner on tracker header
      const titleWrap = document.querySelector('#view-creatives-tracker .section-title-wrap');
      if (titleWrap && !document.getElementById('artistScopedTrackerBanner')) {
        const banner = document.createElement('div');
        banner.id = 'artistScopedTrackerBanner';
        banner.style.cssText = 'display:inline-flex; align-items:center; gap:6px; background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; margin-top:6px;';
        banner.innerHTML = `<span>🎨 Filtered to Your Assigned Tasks: <strong>${escapeHTML(myArtist)}</strong></span>`;
        titleWrap.appendChild(banner);
      }
    }

    // Calculate Artist Acceptance stream counts
    const countAccepted = list.filter(r => isProjectArtistAccepted(r)).length;
    const countPending = list.filter(r => !isProjectArtistAccepted(r)).length;
    const countAll = list.length;

    const elBadgeAcc = document.getElementById('trackerBadgeCountAccepted');
    if (elBadgeAcc) elBadgeAcc.textContent = countAccepted.toLocaleString();
    const elBadgePend = document.getElementById('trackerBadgeCountPending');
    if (elBadgePend) elBadgePend.textContent = countPending.toLocaleString();
    const elBadgeAll = document.getElementById('trackerBadgeCountAll');
    if (elBadgeAll) elBadgeAll.textContent = countAll.toLocaleString();

    // Sync active acceptance tab styling
    const curAcceptanceTab = state.trackerAcceptanceTab || 'pending';
    document.querySelectorAll('.tracker-acceptance-tabs .tracker-acceptance-tab').forEach(btn => {
      const tabKey = btn.getAttribute('data-tracker-tab');
      const isAct = (tabKey === curAcceptanceTab);
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    // Apply acceptance tab stream filter
    if (curAcceptanceTab === 'accepted') {
      list = list.filter(r => isProjectArtistAccepted(r));
    } else if (curAcceptanceTab === 'pending') {
      list = list.filter(r => !isProjectArtistAccepted(r));
    }

    const { search, projectStatus, designStatus, artist, overdue, sortField, sortDir, page, perPage } = state.trackerFilter;

    // Apply KPI filter if active on Creatives Tracker
    if (state.trackerKpiFilter && state.trackerKpiFilter !== 'all') {
      const kf = state.trackerKpiFilter;
      if (kf === 'pending') {
        list = list.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
      } else if (kf === 'working') {
        list = list.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
      } else if (kf === 'approved') {
        list = list.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved');
      } else if (kf === 'revising') {
        list = list.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
      } else if (kf === 'overdue') {
        list = list.filter(r => isOverdue(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate));
      }
    }

    // Sync active KPI filter banner & card highlights on Creatives Tracker
    const kpiBanner = document.getElementById('trackerKpiFilterBanner');
    if (kpiBanner) {
      if (state.trackerKpiFilter && state.trackerKpiFilter !== 'all') {
        const labels = {
          pending: 'Pending Approval',
          working: 'Working / On-Going',
          approved: 'Approved',
          revising: 'Revising',
          overdue: 'Overdue'
        };
        const label = labels[state.trackerKpiFilter] || state.trackerKpiFilter;
        kpiBanner.style.display = 'inline-flex';
        kpiBanner.innerHTML = `
          <span>Filtered: <strong>${escapeHTML(label)}</strong> (${list.length} tasks)</span>
          <button class="clear-kpi-btn" title="Clear filter" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('all')">&times; Show All</button>
        `;
      } else {
        kpiBanner.style.display = 'none';
        kpiBanner.innerHTML = '';
      }
    }

    const trackerKpiCardMap = {
      all: document.getElementById('trackerKpiCardTotal'),
      pending: document.getElementById('trackerKpiCardPending'),
      working: document.getElementById('trackerKpiCardWorking'),
      approved: document.getElementById('trackerKpiCardApproved'),
      revising: document.getElementById('trackerKpiCardRevising'),
      overdue: document.getElementById('trackerKpiCardOverdue')
    };
    Object.entries(trackerKpiCardMap).forEach(([k, card]) => {
      if (!card) return;
      const isAct = (state.trackerKpiFilter || 'all') === k;
      card.classList.toggle('active', isAct);
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        (r.requestId && String(r.requestId).toLowerCase().includes(q)) ||
        (r.artist && String(r.artist).toLowerCase().includes(q)) ||
        (r.projectName && String(r.projectName).toLowerCase().includes(q)) ||
        (r.remarks && typeof r.remarks === 'string' && r.remarks.toLowerCase().includes(q))
      );
    }
    if (projectStatus) list = list.filter(r => r.projectStatus === projectStatus);
    if (designStatus) list = list.filter(r => r.designStatus === designStatus);
    if (!myArtist && artist) list = list.filter(r => r.artist === artist);
    if (overdue) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate);
        if (overdue === 'overdue') return info.status === 'overdue';
        if (overdue === 'today') return info.status === 'today';
        if (overdue === 'soon') return info.status === 'soon';
        if (overdue === 'ontime') return info.status === 'ontrack' || (!isOverdue(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate) && info.status !== 'soon' && info.status !== 'today');
        return true;
      });
    }

    // Apply Date Filter
    if (state.trackerFilter.datePreset || state.trackerFilter.dateCustom) {
      list = list.filter(r => matchesTrackerDateFilter(r, state.trackerFilter));
    }

    // Sort Table Rows (Default: Latest to Old based on Request ID)
    const effectiveSortField = sortField || 'requestId';
    const effectiveSortDir = sortDir || 'desc';

    list.sort((a, b) => {
      let valA = a[effectiveSortField];
      let valB = b[effectiveSortField];
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Natural Request ID sort (Latest to Old default)
      if (effectiveSortField === 'requestId' || effectiveSortField === 'id') {
        const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
        return effectiveSortDir === 'asc' ? cmp : -cmp;
      }

      // Numeric count columns
      if (['countStandard', 'countSpecial', 'countPrinting', 'revisionCount'].includes(effectiveSortField)) {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return effectiveSortDir === 'asc' ? numA - numB : numB - numA;
      }

      // Date columns (chronological)
      if (['designDeadline', 'orderDate', 'dateUpdated', 'timestamp'].includes(effectiveSortField)) {
        const timeA = (valA && valA !== 'N/A') ? new Date(valA).getTime() : 0;
        const timeB = (valB && valB !== 'N/A') ? new Date(valB).getTime() : 0;
        if (timeA && timeB && !isNaN(timeA) && !isNaN(timeB)) {
          return effectiveSortDir === 'asc' ? timeA - timeB : timeB - timeA;
        }
      }

      // Overdue severity sort
      if (effectiveSortField === 'deadlineStatus') {
        const rank = { overdue: 4, today: 3, soon: 2, ontrack: 1, completed: 0, pending_accept: -1 };
        const statusA = getDeadlineAlertStatus(a.designDeadline, a.projectStatus, a.artistAccepted, a.artistAcceptedDate, a.orderDate).status;
        const statusB = getDeadlineAlertStatus(b.designDeadline, b.projectStatus, b.artistAccepted, b.artistAcceptedDate, b.orderDate).status;
        const diff = (rank[statusA] || 0) - (rank[statusB] || 0);
        return effectiveSortDir === 'asc' ? diff : -diff;
      }

      // Alphabetical sort (A-Z or Z-A)
      const cmp = String(valA).trim().localeCompare(String(valB).trim(), undefined, { sensitivity: 'base' });
      return effectiveSortDir === 'asc' ? cmp : -cmp;
    });

    // Update Interactive Sort Badges on Table Headers
    document.querySelectorAll('#view-creatives-tracker .data-table th[data-sort]').forEach(th => {
      const f = th.getAttribute('data-sort');
      th.classList.remove('sort-asc', 'sort-desc');
      const oldPill = th.querySelector('.sort-indicator-pill');
      if (oldPill) oldPill.remove();

      if (f === effectiveSortField) {
        const isAsc = effectiveSortDir === 'asc';
        th.classList.add(isAsc ? 'sort-asc' : 'sort-desc');
        const pill = document.createElement('span');
        pill.className = 'sort-indicator-pill';
        if (f === 'requestId') {
          pill.textContent = isAsc ? '↑ Oldest' : '↓ Latest';
        } else if (['countStandard', 'countSpecial', 'countPrinting', 'revisionCount'].includes(f)) {
          pill.textContent = isAsc ? '↑ 1-9' : '↓ 9-1';
        } else if (['designDeadline', 'orderDate', 'dateUpdated'].includes(f)) {
          pill.textContent = isAsc ? '↑ Earliest' : '↓ Newest';
        } else {
          pill.textContent = isAsc ? '↑ A-Z' : '↓ Z-A';
        }
        th.appendChild(pill);
      }
    });

    // Sync sort dropdown in filter toolbar
    const sortDropdown = document.getElementById('trackerSortDropdown');
    if (sortDropdown) {
      const targetVal = `${effectiveSortField}_${effectiveSortDir}`;
      if (sortDropdown.querySelector(`option[value="${targetVal}"]`)) {
        sortDropdown.value = targetVal;
      }
    }

    const totalItems = list.length;
    const { validPage, startIndex } = renderPagination({
      infoId: 'trackerPaginationInfo',
      controlsId: 'trackerPaginationControls',
      selectIds: ['trackerFilterPerPage', 'trackerPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setTrackerPage',
      itemLabel: 'tasks'
    });

    state.trackerFilter.page = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('creativesTrackerTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding:30px; color:var(--text-muted);">No tasks match the filters.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => {
          const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate);
          let deadlineStatusBadge = '<span style="color:#10B981; font-weight:700; font-size:11px;">ON TRACK</span>';
          if (alertInfo.status === 'pending_accept') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-pending">PENDING ACCEPTANCE</span>`;
          } else if (alertInfo.status === 'overdue') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-overdue">${escapeHTML(alertInfo.diffText).toUpperCase()}</span>`;
          } else if (alertInfo.status === 'today') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-today">DUE TODAY</span>`;
          } else if (alertInfo.status === 'soon') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-soon">${escapeHTML(alertInfo.diffText).toUpperCase()}</span>`;
          }

          const isSuper = isCurrentUserSuperAdmin();
          const isAccepted = isProjectArtistAccepted(r);
          return `
            <tr data-req-id="${r.id}">
              <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color:var(--primary-green); font-weight:700; white-space:nowrap;')}</td>
              <td>${renderEditableCell(r.id, 'joNumber', r.joNumber, '', 'color:var(--accent-red); font-weight:700; white-space:nowrap;')}</td>
              <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
              <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
              <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
              <td>${renderInlineSelect(r.id, 'headApproval', r.headApproval || 'Pending', HEAD_APPROVAL_LEVELS)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countStandard', r.countStandard)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countSpecial', r.countSpecial)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countPrinting', r.countPrinting)}</td>
              <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus || 'On-going', PROJECT_STATUSES)}</td>
              <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus || 'On Queue', DESIGN_STATUSES)}</td>
              <td style="text-align:center;">
                ${deadlineStatusBadge}
              </td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
              <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
              <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
              <td style="font-size:12px; color:var(--text-secondary); white-space:nowrap;">${escapeHTML(r.orderDate || r.timestamp || 'N/A')}</td>
              <td style="font-size:12px; color:var(--text-secondary); white-space:nowrap;">${escapeHTML(r.dateUpdated || r.orderDate || 'N/A')}</td>
              <td>
                <div style="display:inline-flex; gap:5px; align-items:center; justify-content:center; white-space:nowrap;">
                  ${!isAccepted ? `
                    <button class="btn btn-primary btn-sm" onclick="window.SignDepotApp.acceptArtistProject('${r.id}')" title="Accept project and start drafting" style="font-weight:700; background:var(--primary-green); border-color:var(--primary-green); color:#fff; display:inline-flex; align-items:center; gap:4px; padding:3px 9px; font-size:11.5px; border-radius:6px; cursor:pointer;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Accept
                    </button>
                  ` : ''}
                  <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                  ${isSuper ? `
                    <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Task (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA; flex-shrink:0;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  function populateTrackerFiltersDropdowns() {
    const myArtist = getLoggedInArtist();
    const artistSelect = document.getElementById('trackerFilterArtist');
    if (artistSelect) {
      if (myArtist) {
        artistSelect.innerHTML = `<option value="${escapeHTML(myArtist)}" selected>🎨 ${escapeHTML(myArtist)} (You)</option>`;
        artistSelect.disabled = true;
        artistSelect.title = `Your account is linked to ${myArtist}. Only your assigned tasks are shown.`;
        artistSelect.style.background = '#ECFDF5';
        artistSelect.style.borderColor = '#10B981';
        artistSelect.style.color = '#065F46';
        artistSelect.style.fontWeight = '700';
      } else {
        const curVal = artistSelect.value;
        artistSelect.innerHTML = '<option value="">All Artists</option>';
        state.artists.forEach(a => {
          const titleA = toTitleCase(a);
          const opt = document.createElement('option');
          opt.value = titleA;
          opt.textContent = titleA;
          artistSelect.appendChild(opt);
        });
        if (curVal) artistSelect.value = curVal;
      }
    }

    const modalArtistSelect = document.getElementById('trackerFormArtist');
    if (modalArtistSelect) {
      const curModalArt = modalArtistSelect.value;
      modalArtistSelect.innerHTML = '<option value="">Select Artist...</option>';
      state.artists.forEach(a => {
        const titleA = toTitleCase(a);
        const opt = document.createElement('option');
        opt.value = titleA;
        opt.textContent = titleA;
        modalArtistSelect.appendChild(opt);
      });
      if (myArtist) {
        modalArtistSelect.value = toTitleCase(myArtist);
      } else if (curModalArt) {
        modalArtistSelect.value = curModalArt;
      }
    }

    upgradeAllFormSelects();
    syncAllFormDropdowns();
  }

  function resetCreativesTrackerFilters() {
    const myArtist = getLoggedInArtist();
    state.trackerFilter = {
      search: '',
      projectStatus: '',
      designStatus: '',
      artist: myArtist || '',
      overdue: '',
      datePreset: '',
      dateCustom: '',
      dateColumn: 'orderDate',
      sortField: 'requestId',
      sortDir: 'desc',
      page: 1,
      perPage: getStoredRowsPerPage()
    };
    state.trackerKpiFilter = 'all';

    const trackerSearch = document.getElementById('trackerSearchInput');
    if (trackerSearch) trackerSearch.value = '';

    ['trackerFilterProjectStatus', 'trackerFilterDesignStatus', 'trackerFilterOverdue', 'trackerFilterDatePreset'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        syncFilterSelectUI(el);
      }
    });

    const dateCol = document.getElementById('trackerFilterDateColumn');
    if (dateCol) {
      dateCol.value = 'orderDate';
      syncFilterSelectUI(dateCol);
    }

    const dateCust = document.getElementById('trackerFilterDateCustom');
    if (dateCust) {
      dateCust.value = '';
      dateCust.style.display = 'none';
    }

    const sortDropdown = document.getElementById('trackerSortDropdown');
    if (sortDropdown) {
      sortDropdown.value = 'requestId_desc';
      syncFilterSelectUI(sortDropdown);
    }

    const artEl = document.getElementById('trackerFilterArtist');
    if (artEl) {
      artEl.value = myArtist || '';
      syncFilterSelectUI(artEl);
    }

    // Reset KPI cards active state
    document.querySelectorAll('#view-creatives-tracker .kpi-card').forEach(c => {
      c.classList.remove('active');
    });
    const totalCard = document.getElementById('trackerKpiCardTotal');
    if (totalCard) totalCard.classList.add('active');

    renderCreativesTracker();
    showToast('Tracker filters have been reset.');
  }


  // ==========================================================================
  // MODULE 6: PENDING PROJECTS — ARTIST QUEUE (Directly Editable)
  // ==========================================================================

  function renderPendingArtistQueue() {
    const myArtist = getLoggedInArtist();
    const artistSelect = document.getElementById('pendingArtistSelect');
    if (artistSelect) {
      if (myArtist) {
        artistSelect.innerHTML = `<option value="${escapeHTML(myArtist)}" selected>🎨 Artist: ${escapeHTML(myArtist)} (You)</option>`;
        artistSelect.disabled = true;
        state.pendingArtistSelected = myArtist;
      } else if (artistSelect.children.length === 0) {
        state.artists.forEach(a => {
          const opt = document.createElement('option');
          opt.value = a;
          opt.textContent = `Artist: ${a}`;
          artistSelect.appendChild(opt);
        });
        artistSelect.value = state.pendingArtistSelected || state.artists[0];
      }
    }

    const currentArtist = myArtist || (artistSelect ? artistSelect.value : state.pendingArtistSelected) || state.artists[0];
    state.pendingArtistSelected = currentArtist;

    const pendingList = state.requests.filter(r => r.artist === currentArtist && r.projectStatus !== 'Completed');
    const activeList = pendingList.filter(r => r.designStatus === 'In Progress' || r.projectStatus === 'On-going');
    const overdueList = pendingList.filter(r => isOverdue(r.designDeadline, r.projectStatus));

    document.getElementById('artistStatTotal').textContent = pendingList.length;
    document.getElementById('artistStatActive').textContent = activeList.length;
    document.getElementById('artistStatOverdue').textContent = overdueList.length;

    const totalItems = pendingList.length;
    const page = state.pendingArtistPage || 1;
    const perPage = state.pendingArtistPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'pendingArtistPaginationInfo',
      controlsId: 'pendingArtistPaginationControls',
      selectIds: ['pendingArtistFilterPerPage', 'pendingArtistPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setPendingArtistPage',
      itemLabel: 'tasks'
    });

    state.pendingArtistPage = validPage;
    const pagedList = pendingList.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('pendingArtistTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">${currentArtist} currently has no pending projects.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus, DESIGN_STATUSES)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
            <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
            <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
            <td>
              <div style="display:inline-flex; gap:5px; align-items:center; justify-content:center; white-space:nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                ${isCurrentUserSuperAdmin() ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Task (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA; flex-shrink:0;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // MODULE 7: PENDING PROJECTS — SALES QUEUE (Directly Editable)
  // ==========================================================================

  function renderPendingSalesQueue() {
    // Strictly filter to all pending or newly encoded sales requests that are NOT yet approved
    let list = state.requests.filter(r => {
      const clientApp = (r.clientApproval || '').trim().toLowerCase();
      const projStat = (r.projectStatus || '').trim().toLowerCase();
      const isApproved = clientApp === 'approved' || projStat === 'approved';
      const isCompleted = projStat === 'completed';
      return !isApproved && !isCompleted;
    });

    const qFilter = state.pendingSalesFilter;
    const search = state.pendingSalesSearch;

    if (qFilter === 'approval') list = list.filter(r => (r.clientApproval || 'Pending') === 'Pending');
    if (qFilter === 'files') list = list.filter(r => r.fileSent === 'Pending' || r.fileSent === 'TO FOLLOW');
    if (qFilter === 'release') list = list.filter(r => r.releasingDate || r.releasingMode);
    if (qFilter === 'rush') list = list.filter(r => r.priority === 'Rush');

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.projectName.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      );
    }

    const totalItems = list.length;
    const page = state.pendingSalesPage || 1;
    const perPage = state.pendingSalesPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'pendingSalesPaginationInfo',
      controlsId: 'pendingSalesPaginationControls',
      selectIds: ['pendingSalesFilterPerPage', 'pendingSalesPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setPendingSalesPage',
      itemLabel: 'orders'
    });

    state.pendingSalesPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('pendingSalesTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:30px; color:var(--text-muted);">No sales queue tasks for the selected filter.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td><strong style="color:var(--accent-red);">${escapeHTML(r.joNumber)}</strong></td>
            <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
            <td>${renderEditableCell(r.id, 'client', r.client)}</td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderInlineSelect(r.id, 'clientApproval', r.clientApproval, APPROVAL_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'fileSent', r.fileSent, FILE_SENT_LEVELS)}</td>
            <td>${renderInlineDate(r.id, 'releasingDate', r.releasingDate)}</td>
            <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>
              <div style="display:inline-flex; gap:5px; align-items:center; justify-content:center; white-space:nowrap;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.quickSalesApprove('${r.id}')">Approve</button>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                ${isCurrentUserSuperAdmin() ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Order (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA; flex-shrink:0;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================

  // Creatives Tracker Specific Event Listeners
  function initTrackerListeners() {
    const trackerSearch = document.getElementById('trackerSearchInput');
    if (trackerSearch) {
      trackerSearch.addEventListener('input', () => {
        state.trackerFilter.search = trackerSearch.value.trim();
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    }

    ['trackerFilterProjectStatus', 'trackerFilterDesignStatus', 'trackerFilterArtist', 'trackerFilterOverdue'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        if (id === 'trackerFilterProjectStatus') state.trackerFilter.projectStatus = el.value;
        if (id === 'trackerFilterDesignStatus') state.trackerFilter.designStatus = el.value;
        if (id === 'trackerFilterArtist') state.trackerFilter.artist = el.value;
        if (id === 'trackerFilterOverdue') state.trackerFilter.overdue = el.value;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    });

    const trackerDatePreset = document.getElementById('trackerFilterDatePreset');
    const trackerDateCustom = document.getElementById('trackerFilterDateCustom');
    const trackerDateColumn = document.getElementById('trackerFilterDateColumn');

    if (trackerDatePreset) {
      trackerDatePreset.addEventListener('change', () => {
        state.trackerFilter.datePreset = trackerDatePreset.value;
        if (state.trackerFilter.datePreset !== 'custom' && trackerDateCustom) {
          trackerDateCustom.value = '';
          state.trackerFilter.dateCustom = '';
        }
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    }
    if (trackerDateCustom) {
      trackerDateCustom.addEventListener('change', () => {
        state.trackerFilter.dateCustom = trackerDateCustom.value;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    }
    if (trackerDateColumn) {
      trackerDateColumn.addEventListener('change', () => {
        state.trackerFilter.dateColumn = trackerDateColumn.value;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    }

    document.querySelectorAll('#creativesTrackerTable th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (state.trackerFilter.sortField === field) {
          state.trackerFilter.sortDir = state.trackerFilter.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.trackerFilter.sortField = field;
          state.trackerFilter.sortDir = 'asc';
        }
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    });

    const btnResetTracker = document.getElementById('btnResetTrackerFilters');
    if (btnResetTracker) {
      btnResetTracker.addEventListener('click', () => resetCreativesTrackerFilters());
    }

    const pendingSalesSearch = document.getElementById('pendingSalesSearchInput');
    if (pendingSalesSearch) {
      pendingSalesSearch.addEventListener('input', () => {
        state.pendingSalesSearch = pendingSalesSearch.value.trim();
        renderPendingSalesQueue();
      });
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['trackerFilterPerPage', 'trackerPaginationPerPage'], (val) => {
        state.trackerFilter.perPage = val;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
      bindRows(['pendingSalesFilterPerPage', 'pendingSalesPaginationPerPage'], (val) => {
        state.pendingSalesPerPage = val;
        renderPendingSalesQueue();
      });
      bindRows(['pendingArtistFilterPerPage', 'pendingArtistPaginationPerPage'], (val) => {
        state.pendingArtistPerPage = val;
        renderPendingArtistQueue();
      });
    }
  }

  // Expose Creatives Tracker Public API
  App.renderCreativesTracker = renderCreativesTracker;
  App.renderCreativesTrackerTable = renderCreativesTracker;
  App.populateTrackerFiltersDropdowns = populateTrackerFiltersDropdowns;
  App.resetTrackerFilters = resetCreativesTrackerFilters;
  App.setTrackerPage = (p) => {
    state.trackerFilter.page = p;
    renderCreativesTracker();
  };
  App.setTrackerPerPage = (val) => {
    state.trackerFilter.perPage = val;
    state.trackerFilter.page = 1;
    renderCreativesTracker();
  };
  App.switchTrackerAcceptanceTab = (tabKey) => {
    state.trackerAcceptanceTab = tabKey || 'accepted';
    state.trackerFilter.page = 1;
    renderCreativesTracker();
    const labels = {
      accepted: 'Accepted Projects',
      pending: 'Pending Projects (To be Accepted)',
      all: 'All Projects'
    };
    showToast('Viewing ' + (labels[tabKey] || 'Accepted Projects'), 'info');
  };
  App.acceptArtistProject = (id) => {
    if (!id) return;
    const rec = (state.requests || []).find(r => String(r.id) === String(id) || String(r.requestId) === String(id));
    if (!rec) {
      showToast('Task not found', 'error');
      return;
    }
    const todayStr = (new Date()).toISOString().slice(0, 10);
    rec.artistAccepted = 'Accepted';
    rec.artistAcceptedDate = todayStr;
    if (rec.designStatus === 'On Queue' || rec.designStatus === 'Not Started' || !rec.designStatus) {
      rec.designStatus = 'Ongoing';
    }
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=accept_artist_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rec.id, artist_accepted: 'Accepted', artist_accepted_date: todayStr })
      }).catch(() => {});
    }
    saveStateToStorage();
    renderCreativesTracker();
    showToast(`Task ${rec.requestId} accepted into ongoing queue!`);
  };
  App.applyKpiFilterToCreativesTracker = (type) => {
    state.trackerKpiFilter = type;
    state.trackerFilter.page = 1;
    document.querySelectorAll('#view-creatives-tracker .kpi-card').forEach(c => c.classList.remove('active'));
    const map = {
      all: 'trackerKpiCardTotal',
      pending: 'trackerKpiCardPending',
      working: 'trackerKpiCardWorking',
      approved: 'trackerKpiCardApproved',
      revising: 'trackerKpiCardRevising',
      overdue: 'trackerKpiCardOverdue'
    };
    if (map[type]) {
      const card = document.getElementById(map[type]);
      if (card) card.classList.add('active');
    }
    renderCreativesTracker();
  };
  App.clearTrackerKpiFilter = () => {
    state.trackerKpiFilter = 'all';
    state.trackerFilter.page = 1;
    renderCreativesTracker();
  };
  App.renderPendingArtistQueue = renderPendingArtistQueue;
  App.renderPendingSalesQueue = renderPendingSalesQueue;
  App.setPendingSalesPage = (p) => {
    state.pendingSalesPage = p;
    renderPendingSalesQueue();
  };
  App.setPendingSalesPerPage = (pp) => {
    state.pendingSalesPerPage = pp;
    state.pendingSalesPage = 1;
    renderPendingSalesQueue();
  };
  App.setPendingArtistPage = (p) => {
    state.pendingArtistPage = p;
    renderPendingArtistQueue();
  };
  App.setPendingArtistPerPage = (pp) => {
    state.pendingArtistPerPage = pp;
    state.pendingArtistPage = 1;
    renderPendingArtistQueue();
  };
  App.quickSalesApprove = (id) => {
    const rec = state.requests.find(r => r.id === id);
    if (!rec) return;
    rec.clientApproval = 'Approved';
    rec.projectStatus = 'Approved';
    saveStateToStorage();
    renderPendingSalesQueue();
    showToast(`Request ${rec.requestId} approved!`);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTrackerListeners();
      if (document.getElementById('view-creatives-tracker') || document.getElementById('creativesTrackerTableBody')) {
        renderCreativesTracker();
      }
      if (document.getElementById('view-pending-sales') || document.getElementById('pendingSalesTableBody')) {
        renderPendingSalesQueue();
      }
    });
  } else {
    initTrackerListeners();
    if (document.getElementById('view-creatives-tracker') || document.getElementById('creativesTrackerTableBody')) {
      renderCreativesTracker();
    }
    if (document.getElementById('view-pending-sales') || document.getElementById('pendingSalesTableBody')) {
      renderPendingSalesQueue();
    }
  }
})(window);
