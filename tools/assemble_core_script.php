<?php
/**
 * Assemble Core script.js with safe dispatcher proxies for page-specific functions
 */

$backupPath = dirname(__DIR__) . '/assets/js/script.monolithic.backup.js';
$rawBackup = str_replace(["\r\n", "\r"], "\n", file_get_contents($backupPath));
$lines = explode("\n", $rawBackup);

function getSlice($lines, $start, $end) {
    return implode("\n", array_slice($lines, $start - 1, $end - $start + 1));
}

// 1. Core Header through Navigation & Router (Lines 1 to 1708)
$part1 = getSlice($lines, 1, 1708);

// 2. Pagination Renderer (Lines 2217 to 2302)
$partPagination = getSlice($lines, 2217, 2302);

// 3. Global Search, Modals, Request ID, Deadline Alerts (Lines 8499 to 9827)
$partModalsAndAlerts = getSlice($lines, 8499, 9827);

// 4. Public API & Event Listeners (Lines 9828 to 11464)
$partApiAndListeners = getSlice($lines, 9828, 11464);

// 5. InitApp & Autofill (Lines 12016 to 12142)
$partAutofillAndInit = getSlice($lines, 12016, 12142);
$partAutofillAndInit = str_replace(
    [
        'setupDirectiveControlsSync();',
        'setupDirectiveAutocomplete();',
        'setupDirectiveActions();',
        'setupDirectiveZoomControls();',
    ],
    [
        'if (typeof setupDirectiveControlsSync === "function") setupDirectiveControlsSync();',
        'if (typeof setupDirectiveAutocomplete === "function") setupDirectiveAutocomplete();',
        'if (typeof setupDirectiveActions === "function") setupDirectiveActions();',
        'if (typeof setupDirectiveZoomControls === "function") setupDirectiveZoomControls();',
    ],
    $partAutofillAndInit
);

// Helper definitions to insert in Core
$coreHelpersCode = <<<'JS'

  function canUserAccessModule(moduleName) {
    const perms = getCurrentUserPermissions();
    if (!perms || !moduleName) return true;
    if (perms['*'] && perms['*']['*']) return true;
    return !!perms[moduleName];
  }

  function hasPermission(moduleName, perm) {
    const perms = getCurrentUserPermissions();
    if (!perms || !moduleName) return true;
    if (perms['*'] && perms['*']['*']) return true;
    const modPerms = perms[moduleName];
    if (!modPerms) return false;
    return modPerms.includes(perm) || modPerms.includes('*');
  }

  function getLoggedInSalesRep() {
    const u = window.PMS_CURRENT_USER;
    if (!u) return '';
    return u.sales_rep || u.full_name || u.username || '';
  }

  function bindRowsSelects(ids, setter) {
    if (!Array.isArray(ids)) return;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => setter(el.value));
      }
    });
  }

  // ==========================================================================
  // DYNAMIC PAGE MODULE LOADER
  // ==========================================================================

  window.SignDepotLoadedModules = window.SignDepotLoadedModules || {};

  function ensurePageModuleLoaded(viewId, callback) {
    const viewToScript = {
      'view-dashboard': 'dashboard.js',
      'view-sales-requests': 'sales-requests.js',
      'view-creatives-tracker': 'creatives-tracker.js',
      'view-pending-sales': 'creatives-tracker.js',
      'view-artist-workload': 'artist-workload.js',
      'view-directives-details': 'directives.js',
      'view-monthly-output': 'monthly-output.js',
      'view-reports': 'reports.js',
      'view-settings': 'settings.js',
      'view-access-control': 'settings.js',
      'view-audit-trail': 'settings.js'
    };
    const scriptFile = viewToScript[viewId];
    if (!scriptFile) {
      if (callback) callback();
      return;
    }
    const scriptId = 'script-module-' + scriptFile.replace('.js', '');
    if (document.getElementById(scriptId) || window.SignDepotLoadedModules[scriptFile]) {
      if (callback) callback();
      return;
    }
    const base = window.PMS_BASE_URL || '';
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = base + 'assets/js/pages/' + scriptFile + '?v=' + Date.now();
    script.onload = () => {
      window.SignDepotLoadedModules[scriptFile] = true;
      if (callback) callback();
    };
    script.onerror = () => {
      if (callback) callback();
    };
    document.body.appendChild(script);
  }

JS;

// Enhanced renderCurrentView replacing lines 1661-1707 in part1
$oldRenderCurrentView = <<<'JS'
  function renderCurrentView(viewId) {
    switch (viewId) {
      case 'view-dashboard':
        renderDashboard();
        break;
      case 'view-sales-requests':
        renderSalesRequests();
        break;
      case 'view-creatives-tracker':
        renderCreativesTracker();
        break;
      case 'view-artist-workload':
        renderArtistWorkload();
        break;
      case 'view-directives-details':
        renderDirectivePreview();
        break;
      case 'view-pending-sales':
        renderPendingSalesQueue();
        break;
      case 'view-monthly-output':
        renderMonthlyOutputReport(state.timeframe || 'all');
        break;
      case 'view-reports':
        renderReports(state.timeframe || 'all');
        break;
      case 'view-access-control':
        if (typeof loadUsersList === 'function') {
          loadUsersList();
        }
        break;
      case 'view-settings':
        renderSettings();
        break;
    }

    // Sync in-page Timeframe Pills if on monthly-output or reports
    const curTf = state.timeframe || 'month';
    document.querySelectorAll('#outputTimeframeTabs .timeframe-btn, #reportTimeframeTabs .timeframe-btn').forEach(b => {
      const bTf = b.getAttribute('data-timeframe');
      b.classList.toggle('active', bTf === curTf);
    });

    // Ensure all filter and form selects in the active view are upgraded to custom themed buttons
    upgradeAllFilterSelects();
    upgradeAllFormSelects();
  }
JS;

$newRenderCurrentView = <<<'JS'
  function renderCurrentView(viewId) {
    ensurePageModuleLoaded(viewId, () => {
      const App = window.SignDepotApp || {};
      switch (viewId) {
        case 'view-dashboard':
          if (typeof App.renderDashboard === 'function') App.renderDashboard();
          break;
        case 'view-sales-requests':
          if (typeof App.renderSalesRequests === 'function') App.renderSalesRequests();
          break;
        case 'view-creatives-tracker':
          if (typeof App.renderCreativesTracker === 'function') App.renderCreativesTracker();
          break;
        case 'view-artist-workload':
          if (typeof App.renderArtistWorkload === 'function') App.renderArtistWorkload();
          break;
        case 'view-directives-details':
          if (typeof App.renderDirectivePreview === 'function') App.renderDirectivePreview();
          break;
        case 'view-pending-sales':
          if (typeof App.renderPendingSalesQueue === 'function') App.renderPendingSalesQueue();
          break;
        case 'view-monthly-output':
          if (typeof App.renderMonthlyOutputReport === 'function') App.renderMonthlyOutputReport(state.timeframe || 'all');
          break;
        case 'view-reports':
          if (typeof App.renderReports === 'function') App.renderReports(state.timeframe || 'all');
          break;
        case 'view-access-control':
          if (typeof loadUsersList === 'function') loadUsersList();
          break;
        case 'view-settings':
          if (typeof App.renderSettings === 'function') App.renderSettings();
          break;
      }
    });

    // Sync in-page Timeframe Pills if on monthly-output or reports
    const curTf = state.timeframe || 'month';
    document.querySelectorAll('#outputTimeframeTabs .timeframe-btn, #reportTimeframeTabs .timeframe-btn').forEach(b => {
      const bTf = b.getAttribute('data-timeframe');
      b.classList.toggle('active', bTf === curTf);
    });

    // Ensure all filter and form selects in the active view are upgraded to custom themed buttons
    upgradeAllFilterSelects();
    upgradeAllFormSelects();
  }
JS;

$part1Updated = str_replace($oldRenderCurrentView, $coreHelpersCode . "\n" . $newRenderCurrentView, $part1);

// Safe replacements inside partApiAndListeners for functions extracted to page modules
$replacements = [
    'openEnvOptionMenu: openEnvOptionMenu,' => 'openEnvOptionMenu: (...args) => (window.SignDepotApp._openEnvOptionMenu ? window.SignDepotApp._openEnvOptionMenu(...args) : null),',
    'setDirectiveEnvType: setDirectiveEnvType,' => 'setDirectiveEnvType: (...args) => (window.SignDepotApp._setDirectiveEnvType ? window.SignDepotApp._setDirectiveEnvType(...args) : null),',
    'setActivityFilter: (f) => renderRecentActivityFeed(f),' => 'setActivityFilter: (f) => (window.SignDepotApp.renderRecentActivityFeed ? window.SignDepotApp.renderRecentActivityFeed(f) : null),',
    'refreshRecentActivity: () => renderRecentActivityFeed(currentActivityFilter, true),' => 'refreshRecentActivity: () => (window.SignDepotApp.renderRecentActivityFeed ? window.SignDepotApp.renderRecentActivityFeed() : null),',
    'renderSalesRequests: renderSalesRequests,' => 'renderSalesRequests: (...args) => (window.SignDepotApp._renderSalesRequests ? window.SignDepotApp._renderSalesRequests(...args) : null),',
    'renderCreativesTracker: renderCreativesTracker,' => 'renderCreativesTracker: (...args) => (window.SignDepotApp._renderCreativesTracker ? window.SignDepotApp._renderCreativesTracker(...args) : null),',
    'renderDashboardRecentProjectsTable: renderDashboardRecentProjectsTable,' => 'renderDashboardRecentProjectsTable: (...args) => (window.SignDepotApp._renderDashboardRecentProjectsTable ? window.SignDepotApp._renderDashboardRecentProjectsTable(...args) : null),',
    'resetSalesFilters: resetSalesRequestsFilters,' => 'resetSalesFilters: (...args) => (window.SignDepotApp._resetSalesFilters ? window.SignDepotApp._resetSalesFilters(...args) : null),',
    'resetTrackerFilters: resetCreativesTrackerFilters,' => 'resetTrackerFilters: (...args) => (window.SignDepotApp._resetTrackerFilters ? window.SignDepotApp._resetTrackerFilters(...args) : null),',
    'renderProgressTimeline: renderProgressTimeline,' => 'renderProgressTimeline: (...args) => (window.SignDepotApp._renderProgressTimeline ? window.SignDepotApp._renderProgressTimeline(...args) : null),',
    'renderRecentActivityFeed: renderRecentActivityFeed,' => 'renderRecentActivityFeed: (...args) => (window.SignDepotApp._renderRecentActivityFeed ? window.SignDepotApp._renderRecentActivityFeed(...args) : null),',
    'showTimelineTooltip: showTimelineTooltip,' => 'showTimelineTooltip: (...args) => (window.SignDepotApp._showTimelineTooltip ? window.SignDepotApp._showTimelineTooltip(...args) : null),',
    'hideTimelineTooltip: hideTimelineTooltip,' => 'hideTimelineTooltip: (...args) => (window.SignDepotApp._hideTimelineTooltip ? window.SignDepotApp._hideTimelineTooltip(...args) : null),',
    'setupOutputFilterToolbarEvents();' => 'if (typeof setupOutputFilterToolbarEvents === "function") setupOutputFilterToolbarEvents();',
    'setupReportFilterToolbarEvents();' => 'if (typeof setupReportFilterToolbarEvents === "function") setupReportFilterToolbarEvents();',
    'renderCreativesTracker();' => 'if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();',
    'renderSalesRequests();' => 'if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();',
    'renderDashboardRecentProjectsTable();' => 'if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();',
    'renderMonthlyOutputReport(' => 'if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport(',
    'renderArtistWorkload();' => 'if (window.SignDepotApp && window.SignDepotApp.renderArtistWorkload) window.SignDepotApp.renderArtistWorkload();',
    'renderPendingSalesQueue();' => 'if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();',
    'renderPendingArtistQueue();' => 'if (window.SignDepotApp && window.SignDepotApp.renderPendingArtistQueue) window.SignDepotApp.renderPendingArtistQueue();',
    'renderDirectivePreview(' => 'if (window.SignDepotApp && window.SignDepotApp.renderDirectivePreview) window.SignDepotApp.renderDirectivePreview(',
];

foreach ($replacements as $search => $replace) {
    $partModalsAndAlerts = str_replace($search, $replace, $partModalsAndAlerts);
    $partApiAndListeners = str_replace($search, $replace, $partApiAndListeners);
}

// Enhance SignDepotApp declaration with utils and constants
$oldApiDeclaration = "  window.SignDepotApp = {";

$newApiDeclaration = <<<'JS'
  // Shared Utilities & Constants exposed for Page Modules
  const AppUtils = {
    escapeHTML,
    toTitleCase,
    isOverdue,
    getDeadlineAlertStatus,
    getAvailabilityBadge,
    normalizeRequestItem,
    saveStateToStorage,
    showToast,
    showCustomConfirm,
    renderPagination,
    renderEditableCell,
    renderInlineSelect,
    renderInlineDate,
    renderInlineNumber,
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
    editSalesRequest,
    deleteSalesRequest,
    downloadCsv,
    bindRowsSelects
  };

  const AppConstants = {
    STORAGE_KEY,
    DEFAULT_ARTISTS,
    DEFAULT_SALES_REPS,
    PROJECT_STATUSES,
    DESIGN_STATUSES,
    PRIORITY_LEVELS,
    APPROVAL_LEVELS,
    FILE_STATUS_LEVELS,
    FILE_SENT_LEVELS,
    PLACEMENT_OPTIONS,
    RELEASING_MODES,
    HEAD_APPROVAL_LEVELS
  };

  window.SignDepotApp = {
    state: state,
    utils: AppUtils,
    constants: AppConstants,
    ...AppUtils,
    ensurePageModuleLoaded: ensurePageModuleLoaded,
JS;

$partApiAndListenersUpdated = str_replace($oldApiDeclaration, $newApiDeclaration, $partApiAndListeners);

// Build clean core content
$coreContent = $part1Updated . "\n"
    . "  // [MODULE 1: DASHBOARD ENGINE] Extracted to assets/js/pages/dashboard.js\n\n"
    . $partPagination . "\n"
    . "  // [MODULE 2: SALES REQUESTS ENGINE] Extracted to assets/js/pages/sales-requests.js\n"
    . "  // [MODULE 3: CREATIVES TRACKER ENGINE] Extracted to assets/js/pages/creatives-tracker.js\n"
    . "  // [MODULE 4: ARTIST WORKLOAD ENGINE] Extracted to assets/js/pages/artist-workload.js\n"
    . "  // [MODULE 5: DIRECTIVES DETAILS ENGINE] Extracted to assets/js/pages/directives.js\n"
    . "  // [MODULE 6 & 7: PENDING QUEUES] Extracted to assets/js/pages/creatives-tracker.js\n"
    . "  // [MODULE 8 & 8A: MONTHLY OUTPUT REPORT] Extracted to assets/js/pages/monthly-output.js\n"
    . "  // [MODULE 8B: COMPREHENSIVE REPORTS] Extracted to assets/js/pages/reports.js\n"
    . "  // [MODULE 9: SETTINGS ENGINE] Extracted to assets/js/pages/settings.js\n\n"
    . $partModalsAndAlerts . "\n"
    . $partApiAndListenersUpdated . "\n"
    . "  // [FULL-PLEDGE VECTOR STUDIO EDITOR] Extracted to assets/js/pages/directives.js\n\n"
    . $partAutofillAndInit;

file_put_contents(dirname(__DIR__) . '/assets/js/script.js', $coreContent);

echo "Core script.js assembled successfully! Total lines: " . substr_count($coreContent, "\n") . "\n";
