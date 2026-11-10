<?php
/**
 * Script Extractor: Generates all 8 modular page scripts from script.monolithic.backup.js
 */

$backupPath = dirname(__DIR__) . '/assets/js/script.monolithic.backup.js';
$lines = file($backupPath);

function getSlice($lines, $start, $end) {
    return implode('', array_slice($lines, $start - 1, $end - $start + 1));
}

function getHeader($title, $filename) {
    return "/**\n * Sign Depot Operations PMS — {$title}\n * File: assets/js/pages/{$filename}\n */\n\n(function (window) {\n  'use strict';\n\n  const App = window.SignDepotApp;\n  if (!App) return;\n\n  const state = App.state;\n  const {\n    renderPagination,\n    renderEditableCell,\n    renderInlineSelect,\n    renderInlineDate,\n    renderInlineNumber,\n    showToast,\n    showCustomConfirm,\n    saveStateToStorage,\n    escapeHTML,\n    toTitleCase,\n    isOverdue,\n    getDeadlineAlertStatus,\n    getAvailabilityBadge,\n    canUserAccessTab,\n    canUserAccessModule,\n    hasPermission,\n    isCurrentUserSuperAdmin,\n    getLoggedInArtist,\n    getLoggedInSalesRep,\n    syncFilterSelectUI,\n    upgradeAllFilterSelects,\n    upgradeAllFormSelects,\n    syncAllFormDropdowns,\n    syncFormDropdownBtn,\n    openDirectiveForJo,\n    editSalesRequest,\n    deleteSalesRequest,\n    downloadCsv\n  } = App.utils || App;\n\n  const {\n    STORAGE_KEY,\n    DEFAULT_ARTISTS,\n    DEFAULT_SALES_REPS,\n    PROJECT_STATUSES,\n    DESIGN_STATUSES,\n    PRIORITY_LEVELS,\n    APPROVAL_LEVELS,\n    FILE_STATUS_LEVELS,\n    PLACEMENT_OPTIONS,\n    RELEASING_MODES,\n    HEAD_APPROVAL_LEVELS\n  } = App.constants || {};\n\n";
}

$wrapperFooter = "\n})(window);\n";

// ==========================================
// 1. DASHBOARD (1709-2216 AND 2303-2434)
// ==========================================
$dashBody = getSlice($lines, 1709, 2216) . "\n" . getSlice($lines, 2303, 2434);
$dashListeners = <<<'JS'

  // Dashboard Specific Event Listeners
  function initDashboardListeners() {
    const dashSearch = document.getElementById('dashboardSearchInput');
    if (dashSearch) {
      dashSearch.addEventListener('input', () => {
        state.dashboardSearch = dashSearch.value.trim();
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }

    const dashStatus = document.getElementById('dashboardFilterStatus');
    if (dashStatus) {
      dashStatus.addEventListener('change', () => {
        state.dashboardStatus = dashStatus.value;
        if (state.dashboardStatus) state.dashboardKpiFilter = '';
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }

    const dashDeadline = document.getElementById('dashboardFilterDeadline');
    if (dashDeadline) {
      dashDeadline.addEventListener('change', () => {
        state.dashboardDeadline = dashDeadline.value;
        state.dashboardPage = 1;
        document.querySelectorAll('.kpi-card[data-kpi]').forEach(c => {
          const k = c.getAttribute('data-kpi');
          if (c) c.classList.toggle('active', k === state.dashboardDeadline);
        });
        renderDashboardRecentProjectsTable();
      });
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['dashboardFilterPerPage', 'dashboardPaginationPerPage'], (val) => {
        state.dashboardPerPage = val;
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }
  }

  // Expose Dashboard Public API
  App.renderDashboard = renderDashboard;
  App.updateDashboardKPIs = updateDashboardKPIs;
  App.renderProgressTimeline = renderProgressTimeline;
  App.renderRecentActivityFeed = renderRecentActivityFeed;
  App.renderDashboardRecentProjectsTable = renderDashboardRecentProjectsTable;
  App.setActivityFilter = (f) => renderRecentActivityFeed(f);
  App.refreshRecentActivity = () => renderRecentActivityFeed(currentActivityFilter, true);
  App.setDashboardPage = (p) => {
    state.dashboardPage = p;
    renderDashboardRecentProjectsTable();
  };
  App.setDashboardPerPage = (pp) => {
    state.dashboardPerPage = pp;
    state.dashboardPage = 1;
    renderDashboardRecentProjectsTable();
  };
  App.filterDashboardDeadlines = (type) => {
    state.dashboardDeadline = (state.dashboardDeadline === type) ? '' : type;
    state.dashboardPage = 1;
    const sel = document.getElementById('dashboardFilterDeadline');
    if (sel) {
      sel.value = state.dashboardDeadline;
      if (typeof syncFilterSelectUI === 'function') syncFilterSelectUI(sel);
    }
    renderDashboardRecentProjectsTable();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDashboardListeners();
      if (document.getElementById('view-dashboard')) renderDashboard();
    });
  } else {
    initDashboardListeners();
    if (document.getElementById('view-dashboard')) renderDashboard();
  }
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/dashboard.js',
    getHeader('Dashboard Module', 'dashboard.js') . $dashBody . $dashListeners . $wrapperFooter
);

// ==========================================
// 2. SALES REQUESTS (2435-2765)
// ==========================================
$salesBody = getSlice($lines, 2435, 2765);
$salesListeners = <<<'JS'

  // Sales Requests Specific Event Listeners
  function initSalesRequestsListeners() {
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
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/sales-requests.js',
    getHeader('Sales Requests Module', 'sales-requests.js') . $salesBody . $salesListeners . $wrapperFooter
);

// ==========================================
// 3. CREATIVES TRACKER & PENDING QUEUES (2766-3250 AND 6410-6576)
// ==========================================
$trackerBody = getSlice($lines, 2766, 3250);
$trackerBody = str_replace('updateDashboardKPIs();', 'if (typeof App.updateDashboardKPIs === "function") App.updateDashboardKPIs();', $trackerBody);
$pendingQueuesBody = getSlice($lines, 6410, 6576);
$trackerListeners = <<<'JS'

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
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/creatives-tracker.js',
    getHeader('Creatives Tracker & Production Module', 'creatives-tracker.js') . $trackerBody . "\n" . $pendingQueuesBody . $trackerListeners . $wrapperFooter
);

// ==========================================
// 4. ARTIST WORKLOAD (3251-3418)
// ==========================================
$workloadBody = getSlice($lines, 3251, 3418);
$workloadListeners = <<<'JS'

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
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/artist-workload.js',
    getHeader('Artist Workload Module', 'artist-workload.js') . $workloadBody . $workloadListeners . $wrapperFooter
);

// ==========================================
// 5. DIRECTIVES & VECTOR STUDIO (3419-6409 AND 11465-12015)
// ==========================================
$directivesBody = getSlice($lines, 3419, 6409);
$vectorStudioBody = getSlice($lines, 11465, 12015);
$directivesListeners = <<<'JS'

  // Expose Directives Public API
  App.renderDirectivePreview = renderDirectivePreview;
  App.getDirectiveRecord = getDirectiveRecord;
  App.generateDirectiveSVG = generateDirectiveSVG;
  App.openEnvOptionMenu = openEnvOptionMenu;
  App.setDirectiveEnvType = setDirectiveEnvType;
  App.initVectorStudioEditor = (typeof initStudioVectorEditor === 'function') ? initStudioVectorEditor : null;
  App.previewAttachment = (typeof previewAttachment === 'function') ? previewAttachment : null;
  App.deleteAttachment = (typeof deleteAttachment === 'function') ? deleteAttachment : null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-directives-details') || document.getElementById('directiveDocSheet')) {
        renderDirectivePreview();
      }
    });
  } else {
    if (document.getElementById('view-directives-details') || document.getElementById('directiveDocSheet')) {
      renderDirectivePreview();
    }
  }
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/directives.js',
    getHeader('Directives & Vector Studio Module', 'directives.js') . $directivesBody . "\n" . $vectorStudioBody . $directivesListeners . $wrapperFooter
);

// ==========================================
// 6. MONTHLY OUTPUT REPORT (6577-7750 AND 11410-11453)
// ==========================================
$monthlyBody = getSlice($lines, 6577, 7750);
$monthlyExportBody = getSlice($lines, 11410, 11453);
$monthlyListeners = <<<JS

  {$monthlyExportBody}

  function initMonthlyOutputListeners() {
    const btnExportCSV = document.getElementById('btnExportMonthlyReportCSV');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => exportMonthlyReportCsv());
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['monthlyOutputFilterPerPage', 'monthlyOutputPaginationPerPage'], (val) => {
        state.monthlyOutputPerPage = val;
        renderMonthlyOutputReport(state.timeframe || 'all');
      });
    }
  }

  // Expose Monthly Output Public API
  App.renderMonthlyOutputReport = renderMonthlyOutputReport;
  App.setMonthlyOutputTimeframe = (tf) => {
    state.timeframe = tf;
    renderMonthlyOutputReport(tf);
  };
  App.setMonthlyOutputFilter = (f) => {
    state.monthlyOutputFilter = f;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.setMonthlyOutputPage = (p) => {
    state.monthlyOutputPage = p;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.setMonthlyOutputPerPage = (pp) => {
    state.monthlyOutputPerPage = pp;
    state.monthlyOutputPage = 1;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.exportMonthlyReportCsv = exportMonthlyReportCsv;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMonthlyOutputListeners();
      if (document.getElementById('view-monthly-output') || document.getElementById('monthlyOutputTableBody')) {
        renderMonthlyOutputReport(state.timeframe || 'all');
      }
    });
  } else {
    initMonthlyOutputListeners();
    if (document.getElementById('view-monthly-output') || document.getElementById('monthlyOutputTableBody')) {
      renderMonthlyOutputReport(state.timeframe || 'all');
    }
  }
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/monthly-output.js',
    getHeader('Monthly Output Module', 'monthly-output.js') . $monthlyBody . $monthlyListeners . $wrapperFooter
);

// ==========================================
// 7. COMPREHENSIVE REPORTS & ANALYTICS (7751-8257)
// ==========================================
$reportsBody = getSlice($lines, 7751, 8257);
$reportsListeners = <<<'JS'

  // Expose Reports Public API
  App.renderReports = renderReports;
  App.exportReportsCSV = (typeof exportReportsCSV === 'function') ? exportReportsCSV : null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-reports')) renderReports(state.timeframe || 'all');
    });
  } else {
    if (document.getElementById('view-reports')) renderReports(state.timeframe || 'all');
  }
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/reports.js',
    getHeader('Reports & Analytics Module', 'reports.js') . $reportsBody . $reportsListeners . $wrapperFooter
);

// ==========================================
// 8. SETTINGS & ACCESS CONTROL (8258-8498)
// ==========================================
$settingsBody = getSlice($lines, 8258, 8498);
$settingsListeners = <<<'JS'

  // Expose Settings Public API
  App.renderSettings = renderSettings;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-settings')) renderSettings();
    });
  } else {
    if (document.getElementById('view-settings')) renderSettings();
  }
JS;

file_put_contents(
    dirname(__DIR__) . '/assets/js/pages/settings.js',
    getHeader('Settings Module', 'settings.js') . $settingsBody . $settingsListeners . $wrapperFooter
);

echo "All 8 modular page scripts created successfully!\n";
