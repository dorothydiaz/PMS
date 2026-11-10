/**
 * Sign Depot Operations PMS — Sales Requests Module
 * File: assets/js/pages/sales-requests.js
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

  // Safe fallback helpers
  function getStoredRowsPerPage() {
    if (App.utils && typeof App.utils.getStoredRowsPerPage === 'function') {
      return App.utils.getStoredRowsPerPage();
    }
    try {
      const saved = localStorage.getItem('SIGN_DEPOT_PER_PAGE');
      return saved ? parseInt(saved, 10) : 10;
    } catch (e) {
      return 10;
    }
  }

  function renderDraftSalesRowHTML(d) {
    if (App.utils && typeof App.utils.renderDraftSalesRowHTML === 'function') {
      return App.utils.renderDraftSalesRowHTML(d);
    }
    if (typeof window.renderDraftSalesRowHTML === 'function') {
      return window.renderDraftSalesRowHTML(d);
    }
    return '';
  }

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
  // MODULE 2: SALES REQUESTS ENGINE (Direct Inline Editable Table)
  // ==========================================================================

  function renderSalesRequests() {
    populateSalesFiltersDropdowns();

    // Live Client Approval Status Tab Counts
    const statusCounts = {
      all: state.requests.length,
      ongoing: 0,
      forReview: 0,
      revising: 0,
      completed: 0,
      released: 0,
      incomplete: 0,
      onhold: 0,
      pendingApproval: 0,
      approved: 0
    };

    state.requests.forEach(r => {
      const ca = (r.clientApproval || '').trim();
      const caLower = ca.toLowerCase();
      if (ca === 'On-going' || caLower === 'ongoing' || caLower === 'on-going') statusCounts.ongoing++;
      else if (ca === 'For Review' || caLower === 'for review') statusCounts.forReview++;
      else if (ca === 'Revising' || caLower === 'revising' || caLower.includes('revision')) statusCounts.revising++;
      else if (ca === 'Completed' || caLower === 'completed') statusCounts.completed++;
      else if (ca === 'Released' || caLower === 'released') statusCounts.released++;
      else if (ca === 'Incomplete Details/Files' || caLower.includes('incomplete')) statusCounts.incomplete++;
      else if (ca === 'Onhold' || caLower.includes('hold')) statusCounts.onhold++;
      else if (ca === 'Pending Approval' || caLower === 'pending approval' || caLower === 'pending') statusCounts.pendingApproval++;
      else if (ca === 'Approved' || caLower === 'approved') statusCounts.approved++;
      else statusCounts.pendingApproval++;
    });

    const updateBadge = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    updateBadge('badgeCountAll', statusCounts.all);
    updateBadge('badgeCountOngoing', statusCounts.ongoing);
    updateBadge('badgeCountForReview', statusCounts.forReview);
    updateBadge('badgeCountRevising', statusCounts.revising);
    updateBadge('badgeCountCompleted', statusCounts.completed);
    updateBadge('badgeCountReleased', statusCounts.released);
    updateBadge('badgeCountIncomplete', statusCounts.incomplete);
    updateBadge('badgeCountOnhold', statusCounts.onhold);
    updateBadge('badgeCountPendingApproval', statusCounts.pendingApproval);
    updateBadge('badgeCountApproved', statusCounts.approved);
    // Legacy fallback IDs
    updateBadge('badgeCountPending', statusCounts.pendingApproval);
    updateBadge('badgeCountRevision', statusCounts.revising);

    // Sync active approval tab button respecting permissions
    const tabKeyMap = {
      '': 'all',
      'On-going': 'ongoing',
      'For Review': 'for_review',
      'Revising': 'revising',
      'Revision Requested': 'revising',
      'Completed': 'completed',
      'Released': 'released',
      'Incomplete Details/Files': 'incomplete',
      'Onhold': 'onhold',
      'Pending Approval': 'pending_approval',
      'Pending': 'pending_approval',
      'Approved': 'approved'
    };
    let curTabKey = tabKeyMap[state.salesFilter.approvalTab || ''] || 'all';
    if (!canUserAccessTab('sales-requests', curTabKey)) {
      const allowedTabKey = ['all', 'ongoing', 'for_review', 'revising', 'completed', 'released', 'incomplete', 'onhold', 'pending_approval', 'approved'].find(k => canUserAccessTab('sales-requests', k));
      if (allowedTabKey) {
        const revMap = {
          'all': '',
          'ongoing': 'On-going',
          'for_review': 'For Review',
          'revising': 'Revising',
          'completed': 'Completed',
          'released': 'Released',
          'incomplete': 'Incomplete Details/Files',
          'onhold': 'Onhold',
          'pending_approval': 'Pending Approval',
          'approved': 'Approved'
        };
        state.salesFilter.approvalTab = revMap[allowedTabKey];
      }
    }
    const activeApprovalTab = state.salesFilter.approvalTab || '';
    document.querySelectorAll('.sales-approval-tab[data-tab-approval]').forEach(tabBtn => {
      const tabVal = tabBtn.getAttribute('data-tab-approval') || '';
      const isAct = tabVal === activeApprovalTab;
      tabBtn.classList.toggle('active', isAct);
      tabBtn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    // Keep salesFilterApproval select dropdown in sync with activeApprovalTab
    const selApproval = document.getElementById('salesFilterApproval');
    if (selApproval && selApproval.value !== activeApprovalTab) {
      selApproval.value = activeApprovalTab;
      syncFilterSelectUI(selApproval);
    }

    let list = [...state.requests];
    const { search, priority, approval, fileSent, salesRep, location, sortField, sortDir, page, perPage } = state.salesFilter;

    // Filter by approval tab or approval dropdown
    const effectiveApproval = activeApprovalTab || approval || '';
    if (effectiveApproval) {
      list = list.filter(r => {
        const ca = (r.clientApproval || '').trim();
        const caLower = ca.toLowerCase();
        const targetLower = effectiveApproval.toLowerCase();
        if (targetLower === 'pending approval' || targetLower === 'pending') {
          return caLower === 'pending approval' || caLower === 'pending';
        }
        if (targetLower === 'revising' || targetLower.includes('revision')) {
          return caLower === 'revising' || caLower.includes('revision');
        }
        if (targetLower === 'on-going' || targetLower === 'ongoing') {
          return caLower === 'on-going' || caLower === 'ongoing';
        }
        if (targetLower.includes('incomplete')) {
          return caLower.includes('incomplete');
        }
        if (targetLower.includes('hold')) {
          return caLower.includes('hold');
        }
        return ca === effectiveApproval || caLower === targetLower;
      });
    }

    // Filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.requestId.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        (r.location && r.location.toLowerCase().includes(q))
      );
    }
    if (priority) list = list.filter(r => r.priority === priority);
    if (approval) list = list.filter(r => r.clientApproval === approval);
    if (fileSent) list = list.filter(r => r.fileSent === fileSent);
    if (salesRep) list = list.filter(r => r.salesRep === salesRep);
    if (location) list = list.filter(r => (r.location || 'Indoor').toLowerCase() === location.toLowerCase());
    if (state.salesFilter.deadline) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
        if (state.salesFilter.deadline === 'overdue') return info.status === 'overdue';
        if (state.salesFilter.deadline === 'today') return info.status === 'today';
        if (state.salesFilter.deadline === 'soon') return info.status === 'soon';
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = list.length;
    const { validPage, startIndex } = renderPagination({
      infoId: 'salesPaginationInfo',
      controlsId: 'salesPaginationControls',
      selectIds: ['salesFilterPerPage', 'salesPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setSalesPage',
      itemLabel: 'requests'
    });

    state.salesFilter.page = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('salesRequestsTableBody');
    if (tbody) {
      const draftHTML = state.draftSalesRequest ? renderDraftSalesRowHTML(state.draftSalesRequest) : '';

      if (pagedList.length === 0 && !draftHTML) {
        tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding:32px 20px; color:var(--text-muted); font-size:13px;">No sales requests match the current filters. Click <strong>+ Add Request</strong> above to create a new sales request!</td></tr>`;
      } else {
        const isSuper = isCurrentUserSuperAdmin();
        const rowsHTML = pagedList.map(r => `
          <tr data-req-id="${r.id}">
            <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color: var(--primary-green); font-weight: 700; min-width: 95px;')}</td>
            <td>${renderEditableCell(r.id, 'joNumber', r.joNumber, '', 'color: var(--accent-red); font-weight: 700; min-width: 105px;')}</td>
            <td>${renderInlineDate(r.id, 'orderDate', r.orderDate)}</td>
            <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
            <td>${renderEditableCell(r.id, 'client', r.client, '', 'min-width: 140px;')}</td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName, '', 'min-width: 170px; font-weight: 600;')}</td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
            <td>${renderInlineDate(r.id, 'releasingDate', r.releasingDate)}</td>
            <td>${renderInlineSelect(r.id, 'fileSent', r.fileSent || 'N/A', FILE_STATUS_LEVELS)}</td>
            <td>${renderEditableCell(r.id, 'completeAddress', r.completeAddress, '', 'min-width: 190px;')}</td>
            <td>${renderInlineSelect(r.id, 'location', r.location || 'N/A', PLACEMENT_OPTIONS)}</td>
            <td>${renderInlineSelect(r.id, 'releasingMode', r.releasingMode || 'N/A', RELEASING_MODES)}</td>
            <td>${renderEditableCell(r.id, 'contactPerson', r.contactPerson, '', 'min-width: 130px;')}</td>
            <td>${renderEditableCell(r.id, 'contactNumber', r.contactNumber, '', 'min-width: 120px;')}</td>
            <td>${renderInlineSelect(r.id, 'clientApproval', r.clientApproval || 'Pending Approval', APPROVAL_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'priority', r.priority || 'Normal', PRIORITY_LEVELS)}</td>
            <td>
              <div style="display:inline-flex; gap:5px; align-items:center; justify-content:center; white-space:nowrap;">
                <button class="btn btn-secondary btn-sm btn-icon-only" onclick="window.SignDepotApp.openPrintRequest('${r.requestId || r.joNumber || r.id}')" title="Print Request">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </button>
                <button class="btn btn-secondary btn-sm btn-icon-only" onclick="window.SignDepotApp.editSalesRequest('${r.id}')" title="Edit Full Details">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                ${isSuper ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Request (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA; flex-shrink:0;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');

        tbody.innerHTML = draftHTML + rowsHTML;
      }
    }
  }

  function populateSalesFiltersDropdowns() {
    state.salesReps = state.salesReps.filter(s => s && s.toLowerCase() !== 'shela');
    const repSelect = document.getElementById('salesFilterSalesRep');
    if (repSelect) {
      const curVal = repSelect.value;
      repSelect.innerHTML = '<option value="">All Sales Reps</option>';
      state.salesReps.forEach(rep => {
        const titleRep = toTitleCase(rep);
        const opt = document.createElement('option');
        opt.value = titleRep;
        opt.textContent = titleRep;
        repSelect.appendChild(opt);
      });
      if (curVal && curVal.toLowerCase() !== 'shela') repSelect.value = curVal;
    }

    const modalArtistSelect = document.getElementById('salesFormArtist');
    if (modalArtistSelect) {
      const curArtist = modalArtistSelect.value;
      modalArtistSelect.innerHTML = '<option value="">Select Artist...</option>';
      state.artists.forEach(a => {
        const titleA = toTitleCase(a);
        const opt = document.createElement('option');
        opt.value = titleA;
        opt.textContent = titleA;
        modalArtistSelect.appendChild(opt);
      });
      if (curArtist) modalArtistSelect.value = curArtist;
    }

    const modalSalesSelect = document.getElementById('salesFormSalesRep');
    if (modalSalesSelect) {
      const curRep = modalSalesSelect.value;
      modalSalesSelect.innerHTML = '<option value="">Select Sales Rep...</option>';
      state.salesReps.forEach(s => {
        const titleS = toTitleCase(s);
        const opt = document.createElement('option');
        opt.value = titleS;
        opt.textContent = titleS;
        modalSalesSelect.appendChild(opt);
      });
      if (curRep && curRep.toLowerCase() !== 'shela') {
        modalSalesSelect.value = curRep;
      } else if (curRep && curRep.toLowerCase() === 'shela') {
        modalSalesSelect.value = 'Shella';
      }
    }

    upgradeAllFormSelects();
  }

  function resetSalesRequestsFilters() {
    state.salesFilter = {
      search: '',
      priority: '',
      approval: '',
      fileSent: '',
      salesRep: '',
      location: '',
      deadline: '',
      sortField: 'orderDate',
      sortDir: 'desc',
      page: 1,
      perPage: getStoredRowsPerPage(),
      approvalTab: ''
    };

    const salesSearch = document.getElementById('salesSearchInput');
    if (salesSearch) salesSearch.value = '';

    const filterIds = [
      'salesFilterPriority',
      'salesFilterApproval',
      'salesFilterLocation',
      'salesFilterFileSent',
      'salesFilterSalesRep',
      'salesFilterDeadline'
    ];

    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        syncFilterSelectUI(el);
      }
    });

    // Reset approval tab buttons to All
    document.querySelectorAll('.sales-approval-tab[data-tab-approval]').forEach(tab => {
      const isAll = !tab.getAttribute('data-tab-approval');
      tab.classList.toggle('active', isAll);
      tab.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    renderSalesRequests();
    showToast('Sales filters have been reset.');
  }


  function openNewSalesRequestModal() {
    if (App && typeof App.openNewSalesRequestModal === 'function' && App.openNewSalesRequestModal !== openNewSalesRequestModal) {
      return App.openNewSalesRequestModal();
    }
    const form = document.getElementById('salesRequestForm');
    if (form) {
      form.reset();
      form.querySelectorAll('.is-invalid-detail').forEach(el => el.classList.remove('is-invalid-detail'));
    }
    const idField = document.getElementById('salesFormId');
    if (idField) idField.value = '';
    const titleEl = document.getElementById('salesModalTitle');
    if (titleEl) titleEl.textContent = 'New Sales Request';

    // Auto-generate sequential Request ID with separator dash (e.g. LR-26-2104 / LR-26-2105)
    const getNextIdFn = (App && App.getNextRequestId) || (App && App.utils && App.utils.getNextRequestId);
    const nextId = typeof getNextIdFn === 'function' ? getNextIdFn() : 'LR-26-2101';
    const reqInput = document.getElementById('salesFormReqId');
    if (reqInput) reqInput.value = nextId;

    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_next_request_id')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && res.nextRequestId && reqInput && (!reqInput.value || reqInput.value === nextId)) {
            reqInput.value = res.nextRequestId;
          }
        })
        .catch(() => {});
    }

    const joInput = document.getElementById('salesFormJo');
    if (joInput) joInput.value = '';

    const orderDateInput = document.getElementById('salesFormOrderDate');
    if (orderDateInput) {
      orderDateInput.value = new Date().toISOString().split('T')[0];
    }

    const deadlineInput = document.getElementById('salesFormDeadline');
    if (deadlineInput && !deadlineInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      deadlineInput.value = d.toISOString().split('T')[0];
    }

    const releasingInput = document.getElementById('salesFormReleasing');
    if (releasingInput && !releasingInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      releasingInput.value = d.toISOString().split('T')[0];
    }

    const locInput = document.getElementById('salesFormLocation');
    if (locInput) locInput.value = 'Indoor';

    const prioInput = document.getElementById('salesFormPriority');
    if (prioInput) prioInput.value = 'Normal';

    const appInput = document.getElementById('salesFormProjectStatus') || document.getElementById('salesFormClientApproval');
    if (appInput) appInput.value = 'Pending Approval';

    const relModeInput = document.getElementById('salesFormRelMode');
    if (relModeInput) relModeInput.value = 'Pickup';

    const fileSentInput = document.getElementById('salesFormFileSent');
    if (fileSentInput) fileSentInput.value = 'File Sent';

    populateSalesFiltersDropdowns();
    const loggedInRep = typeof getLoggedInSalesRep === 'function' ? getLoggedInSalesRep() : null;
    const salesRepSelect = document.getElementById('salesFormSalesRep');
    if (loggedInRep && salesRepSelect && !salesRepSelect.value) {
      salesRepSelect.value = toTitleCase(loggedInRep);
    }
    if (typeof upgradeAllFormSelects === 'function') upgradeAllFormSelects();
    if (typeof syncAllFormDropdowns === 'function') syncAllFormDropdowns();

    const modal = document.getElementById('salesModal');
    if (modal) {
      modal.classList.add('show');
      setTimeout(() => {
        if (joInput) {
          joInput.focus();
        } else if (reqInput) {
          reqInput.focus();
        }
      }, 100);
    }
  }

  // Sales Requests Specific Event Listeners
  function initSalesRequestsListeners() {
    const btnSalesNewReq = document.getElementById('btnSalesNewRequest');
    if (btnSalesNewReq) {
      btnSalesNewReq.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        openNewSalesRequestModal();
      });
    }

    const salesSearch = document.getElementById('salesSearchInput');
    if (salesSearch) {
      if (salesSearch.value && (salesSearch.value.toLowerCase().startsWith('sup_') || salesSearch.value.toLowerCase().includes('angel') || salesSearch.value.toLowerCase() === 'superadmin')) {
        salesSearch.value = '';
        state.salesFilter.search = '';
      }
      salesSearch.addEventListener('input', () => {
        state.salesFilter.search = salesSearch.value.trim();
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    }

    ['salesFilterPriority', 'salesFilterApproval', 'salesFilterFileSent', 'salesFilterSalesRep', 'salesFilterLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        if (id === 'salesFilterPriority') state.salesFilter.priority = el.value;
        if (id === 'salesFilterApproval') {
          state.salesFilter.approval = el.value;
          state.salesFilter.approvalTab = el.value;
        }
        if (id === 'salesFilterFileSent') state.salesFilter.fileSent = el.value;
        if (id === 'salesFilterSalesRep') state.salesFilter.salesRep = el.value;
        if (id === 'salesFilterLocation') state.salesFilter.location = el.value;
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    });

    document.querySelectorAll('.sales-approval-tab[data-tab-approval]').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabVal = tab.getAttribute('data-tab-approval') || '';
        state.salesFilter.approvalTab = tabVal;
        state.salesFilter.approval = tabVal;
        const selApproval = document.getElementById('salesFilterApproval');
        if (selApproval) {
          selApproval.value = tabVal;
          if (typeof syncFilterSelectUI === 'function') syncFilterSelectUI(selApproval);
        }
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    });

    const btnResetSales = document.getElementById('btnResetSalesFilters');
    if (btnResetSales) {
      btnResetSales.addEventListener('click', () => resetSalesRequestsFilters());
    }

    document.querySelectorAll('#salesRequestsTable th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (state.salesFilter.sortField === field) {
          state.salesFilter.sortDir = state.salesFilter.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.salesFilter.sortField = field;
          state.salesFilter.sortDir = 'asc';
        }
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    });

    const salesDeadline = document.getElementById('salesFilterDeadline');
    if (salesDeadline) {
      salesDeadline.addEventListener('change', () => {
        state.salesFilter.deadline = salesDeadline.value;
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['salesFilterPerPage', 'salesPaginationPerPage'], (val) => {
        state.salesFilter.perPage = val;
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    }
  }

  // Expose Sales Requests Public API
  App.renderSalesRequests = renderSalesRequests;
  App.renderSalesRequestsTable = renderSalesRequests;
  App.populateSalesFiltersDropdowns = populateSalesFiltersDropdowns;
  App.resetSalesFilters = resetSalesRequestsFilters;
  App.openNewSalesRequestModal = openNewSalesRequestModal;
  window.openNewSalesRequestModal = openNewSalesRequestModal;
  window.populateSalesFiltersDropdowns = populateSalesFiltersDropdowns;
  App.setSalesPage = (p) => {
    state.salesFilter.page = p;
    renderSalesRequests();
  };
  App.setSalesApprovalTab = (tabVal) => {
    state.salesFilter.approvalTab = tabVal;
    state.salesFilter.approval = tabVal;
    state.salesFilter.page = 1;
    renderSalesRequests();
  };
  App.setSalesPerPage = (val) => {
    state.salesFilter.perPage = val;
    state.salesFilter.page = 1;
    renderSalesRequests();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSalesRequestsListeners();
      if (document.getElementById('view-sales-requests') || document.getElementById('salesRequestsTableBody')) {
        renderSalesRequests();
      }
    });
  } else {
    initSalesRequestsListeners();
    if (document.getElementById('view-sales-requests') || document.getElementById('salesRequestsTableBody')) {
      renderSalesRequests();
    }
  }
})(window);
