/**
 * Sign Depot Operations PMS — Artist Workload Module
 * File: assets/js/pages/artist-workload.js
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
  // MODULE 4: ARTIST WORKLOAD ENGINE
  // ==========================================================================

  function renderArtistWorkload() {
    const grid = document.getElementById('artistWorkloadCardsGrid');
    if (!grid) return;

    const reqs = state.requests;
    const filterAvail = state.workloadFilter.availability;

    const artistData = state.artists.filter(a => a !== 'Rodel' && a !== 'Benjie' && a !== 'Seven' && a !== 'Edrian').map(artist => {
      const activeAssignments = reqs.filter(r => r.artist === artist && r.projectStatus !== 'Completed');
      let std = 0, prt = 0, spc = 0;
      activeAssignments.forEach(a => {
        std += (a.countStandard || 0);
        prt += (a.countPrinting || 0);
        spc += (a.countSpecial || 0);
      });
      const activeCount = activeAssignments.length;
      const capacity = 10;
      const avail = getAvailabilityBadge(activeCount);
      const pct = Math.min(Math.round((activeCount / capacity) * 100), 100);

      return {
        artist,
        activeAssignments,
        activeCount,
        std,
        prt,
        spc,
        capacity,
        avail,
        pct
      };
    });

    let filtered = artistData;
    if (filterAvail) {
      filtered = filtered.filter(a => a.avail.text === filterAvail);
    }

    grid.innerHTML = filtered.map(a => `
      <div class="studio-card" style="cursor:pointer;" onclick="window.SignDepotApp.selectWorkloadArtist('${a.artist}')">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="user-avatar" style="width:36px; height:36px;">${escapeHTML(a.artist.substring(0, 2).toUpperCase())}</div>
            <div>
              <h4 style="font-size:15px; font-weight:800;">${escapeHTML(a.artist)}</h4>
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600;">${a.activeCount} Active Tasks</span>
            </div>
          </div>
          <span class="badge ${a.avail.class}">${a.avail.text}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:#F8FAFC; border:1px solid var(--border-light); padding:8px 10px; border-radius:var(--radius-md); text-align:center; margin-bottom:12px;">
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Standard</div>
            <div style="font-size:14px; font-weight:800; color:var(--primary-green);">${a.std}</div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Printing</div>
            <div style="font-size:14px; font-weight:800; color:#3B82F6;">${a.prt}</div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Special</div>
            <div style="font-size:14px; font-weight:800; color:var(--accent-red);">${a.spc}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:600;">
          <span>Capacity (${a.activeCount}/${a.capacity})</span>
          <span>${a.pct}%</span>
        </div>
        <div style="height:6px; background:#F1F5F9; border-radius:99px; overflow:hidden;">
          <div style="height:100%; width:${a.pct}%; background:${a.pct >= 80 ? 'var(--accent-red)' : a.pct >= 50 ? '#F59E0B' : 'var(--primary-green)'};"></div>
        </div>
      </div>
    `).join('');

    renderWorkloadDetailsTable();
  }

  function renderWorkloadDetailsTable() {
    const selectedArtist = state.workloadFilter.selectedArtist;
    const titleEl = document.getElementById('workloadSelectedArtistTitle');
    if (titleEl) {
      titleEl.textContent = selectedArtist ? `Active Assignments for ${selectedArtist}` : 'All Active Artist Assignments';
    }

    let list = state.requests.filter(r => r.projectStatus !== 'Completed' && r.artist !== 'Rodel' && r.artist !== 'Benjie');
    if (selectedArtist) {
      list = list.filter(r => r.artist === selectedArtist);
    }

    const search = state.workloadFilter.search;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.projectName.toLowerCase().includes(q) || r.requestId.toLowerCase().includes(q));
    }

    const totalItems = list.length;
    const page = state.workloadPage || 1;
    const perPage = state.workloadPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'workloadPaginationInfo',
      controlsId: 'workloadPaginationControls',
      selectIds: ['workloadFilterPerPage', 'workloadPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setWorkloadPage',
      itemLabel: 'assignments'
    });

    state.workloadPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('artistWorkloadDetailsTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No active tasks for selected artist.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => {
          const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
          let deadlineBadge = '';
          if (alertInfo.status === 'overdue') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-overdue">${escapeHTML(alertInfo.diffText)}</span>`;
          } else if (alertInfo.status === 'today') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-today">Due Today</span>`;
          } else if (alertInfo.status === 'soon') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-soon">${escapeHTML(alertInfo.diffText)}</span>`;
          }

          const categoryBadge = r.countSpecial > 0 
            ? '<span class="badge badge-priority-high">Special</span>' 
            : (r.countPrinting > 0 ? '<span class="badge badge-ongoing">Printing</span>' : '<span class="badge badge-not-started">Standard</span>');

          const pStatus = (typeof r.projectStatus === 'string' && r.projectStatus.trim()) ? r.projectStatus.trim() : 'Pending';
          const dStatus = (typeof r.designStatus === 'string' && r.designStatus.trim() && r.designStatus !== '[object Object]') 
            ? r.designStatus.trim() 
            : (pStatus === 'Completed' ? 'Submitted' : (pStatus === 'On-going' ? 'In Progress' : 'Not Started'));

          return `
            <tr>
              <td><strong style="color:var(--primary-green); font-weight:700;">${escapeHTML(r.requestId)}</strong></td>
              <td><span class="badge badge-artist" style="font-weight:700;">${escapeHTML(r.artist || '-')}</span></td>
              <td><span style="font-weight:600; color:var(--text-main);">${escapeHTML(r.projectName || '-')}</span></td>
              <td>${categoryBadge}</td>
              <td style="white-space:nowrap;">
                <span>${escapeHTML(r.designDeadline || '-')}</span>${deadlineBadge}
              </td>
              <td><span class="badge ${getStatusBadgeClass(pStatus)}">${escapeHTML(pStatus)}</span></td>
              <td><span class="badge ${getStatusBadgeClass(dStatus)}">${escapeHTML(dStatus)}</span></td>
              <td style="text-align:center;"><span style="font-weight:700; color:var(--text-secondary);">${r.revisionCount || 0}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="View Blueprint Directive">
                  Directive
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }


  // Artist Workload Specific Event Listeners
  function initWorkloadListeners() {
    const availFilter = document.getElementById('workloadFilterAvailability');
    if (availFilter) {
      availFilter.addEventListener('change', () => {
        state.workloadFilter.availability = availFilter.value;
        renderArtistWorkload();
      });
    }

    const workloadTableSearch = document.getElementById('workloadTableSearch');
    if (workloadTableSearch) {
      workloadTableSearch.addEventListener('input', () => {
        state.workloadFilter.search = workloadTableSearch.value.trim();
        renderArtistWorkload();
      });
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['workloadFilterPerPage', 'workloadPaginationPerPage'], (val) => {
        state.workloadPerPage = val;
        renderArtistWorkload();
      });
    }
  }

  // Expose Artist Workload Public API
  App.renderArtistWorkload = renderArtistWorkload;
  App.selectWorkloadArtist = (artist) => {
    if (!state.workloadFilter) state.workloadFilter = {};
    state.workloadFilter.selectedArtist = artist;
    state.workloadSelectedArtist = artist;
    renderArtistWorkload();
  };
  App.setWorkloadPage = (p) => {
    state.workloadPage = p;
    renderArtistWorkload();
  };
  App.setWorkloadPerPage = (pp) => {
    state.workloadPerPage = pp;
    state.workloadPage = 1;
    renderArtistWorkload();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initWorkloadListeners();
      if (document.getElementById('view-artist-workload')) renderArtistWorkload();
    });
  } else {
    initWorkloadListeners();
    if (document.getElementById('view-artist-workload')) renderArtistWorkload();
  }
})(window);
