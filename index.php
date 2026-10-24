<?php
/**
 * Sign Depot Operations PMS — Project Dashboard
 * Connected to MySQL Database (pms_db) populated from sales_requests.html
 */

require_once __DIR__ . '/config.php';

$pageTitle = 'Project Dashboard';
$currentPage = 'dashboard';
$pageCategory = 'Operations Overview';
$pageBadge = 'MySQL Live';

// Query Initial Live KPIs from MySQL
$pdo = getDbConnection();
$kpis = [
    'total' => 0,
    'pending' => 0,
    'working' => 0,
    'approved' => 0,
    'revising' => 0,
    'overdue' => 0
];

if ($pdo) {
    try {
        $today = date('Y-m-d');
        $kpis['total'] = (int)$pdo->query("SELECT COUNT(*) FROM sales_requests")->fetchColumn();
        $kpis['pending'] = (int)$pdo->query("SELECT COUNT(*) FROM sales_requests WHERE client_approval = 'Pending' OR project_status = 'Pending'")->fetchColumn();
        $kpis['working'] = (int)$pdo->query("SELECT COUNT(*) FROM sales_requests WHERE project_status IN ('On-going', 'Ongoing', 'In Progress', 'Working')")->fetchColumn();
        $kpis['approved'] = (int)$pdo->query("SELECT COUNT(*) FROM sales_requests WHERE client_approval = 'Approved' OR project_status = 'Approved'")->fetchColumn();
        $kpis['revising'] = (int)$pdo->query("SELECT COUNT(*) FROM sales_requests WHERE project_status = 'Revising' OR design_status = 'Revising'")->fetchColumn();
        
        $overdueStmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE design_deadline != '' AND design_deadline < ? AND project_status NOT IN ('Completed', 'Approved')");
        $overdueStmt->execute([$today]);
        $kpis['overdue'] = (int)$overdueStmt->fetchColumn();
    } catch (Exception $e) {
        error_log("Dashboard query error: " . $e->getMessage());
    }
}

require_once __DIR__ . '/pages/includes/header.php';
require_once __DIR__ . '/pages/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/pages/includes/navbar.php'; ?>

  <!-- Main Content Container with Project Dashboard View -->
  <main class="main-content">
    <section class="view-panel active" id="view-dashboard">
      <!-- KPI Summary Cards Grid -->
      <div class="kpi-grid">
        <div class="kpi-card" id="kpiCardTotal" onclick="window.SignDepotApp.navigateToPageTable('all')" title="Click to view All Records in Creatives Tracker table">
          <div class="kpi-header">
            <span>Total Requests</span>
            <span class="badge badge-ongoing">All Records</span>
          </div>
          <div class="kpi-value" id="kpiTotalRequests"><?= number_format($kpis['total']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Active production logs</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('all')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="kpi-card" id="kpiCardPending" onclick="window.SignDepotApp.navigateToPageTable('pending')" title="Click to view Pending Approval in Creatives Tracker table">
          <div class="kpi-header">
            <span>Pending Approval</span>
            <span class="badge badge-pending">Queue</span>
          </div>
          <div class="kpi-value" id="kpiPendingApproval"><?= number_format($kpis['pending']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Awaiting review</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('pending')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="kpi-card" id="kpiCardWorking" onclick="window.SignDepotApp.navigateToPageTable('working')" title="Click to view Working / On-Going in Creatives Tracker table">
          <div class="kpi-header">
            <span>Working / On-Going</span>
            <span class="badge badge-ongoing">In Progress</span>
          </div>
          <div class="kpi-value" id="kpiWorking"><?= number_format($kpis['working']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Active drafting</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('working')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="kpi-card" id="kpiCardApproved" onclick="window.SignDepotApp.navigateToPageTable('approved')" title="Click to view Approved in Creatives Tracker table">
          <div class="kpi-header">
            <span>Approved</span>
            <span class="badge badge-approved">Approved</span>
          </div>
          <div class="kpi-value" id="kpiApproved"><?= number_format($kpis['approved']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Production cleared</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('approved')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="kpi-card" id="kpiCardRevising" onclick="window.SignDepotApp.navigateToPageTable('revising')" title="Click to view Revising in Creatives Tracker table">
          <div class="kpi-header">
            <span>Revising</span>
            <span class="badge badge-revising">Feedback</span>
          </div>
          <div class="kpi-value" id="kpiRevising"><?= number_format($kpis['revising']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Client alterations</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('revising')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>

        <div class="kpi-card" id="kpiCardOverdue" onclick="window.SignDepotApp.navigateToPageTable('overdue')" title="Click to view Overdue in Creatives Tracker table">
          <div class="kpi-header">
            <span>Overdue</span>
            <span class="badge badge-priority-rush">Past Due</span>
          </div>
          <div class="kpi-value" id="kpiOverdue" style="color: var(--accent-red);"><?= number_format($kpis['overdue']) ?></div>
          <div class="kpi-footer-row">
            <div class="kpi-trend">Needs attention</div>
            <button class="kpi-quick-btn" title="Quick View" onclick="event.stopPropagation(); window.SignDepotApp.openKpiQuickView('overdue')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Panze Studio 3-Column Spotlight -->
      <div class="dashboard-panze-grid">
        <!-- Left Column: "My Tasks" (Pastel Tinted Cards) -->
        <div class="studio-card">
          <div class="task-column-header">
            <h3 style="font-size: 16px; font-weight: 800;">Active Tasks</h3>
            <button class="circle-action-btn" id="btnPanzeAddTask" title="Add Task">+</button>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button class="timeframe-btn active" style="font-size: 11px; padding: 4px 12px;">Active Queue</button>
            <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-left: auto;">
              <span class="badge badge-ongoing" id="panzeActiveTasksCountBadge">--</span>
              <span>Tasks</span>
            </div>
          </div>

          <div id="panzeTasksCardList">
            <!-- Dynamically populated task cards -->
          </div>
        </div>

        <!-- Middle Column: "Projects Overview" (Donut Chart & Legend) -->
        <div class="studio-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div class="task-column-header">
            <div>
              <h3 style="font-size: 16px; font-weight: 800;">Projects Overview</h3>
              <span style="font-size: 12px; color: var(--text-secondary);">Real-time status breakdown</span>
            </div>
            <button class="circle-action-btn" onclick="window.SignDepotApp.switchView('view-creatives-tracker')" title="Open Tracker">↗</button>
          </div>

          <div class="donut-chart-wrap">
            <div id="panzeDonutChartSvgContainer" style="width: 220px; height: 220px;"></div>
            <div class="donut-legend" id="panzeDonutLegend"></div>
          </div>

          <div style="border-top: 1px solid var(--border-light); padding-top: 16px; margin-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12.5px; font-weight: 700;">2026 Production Pace</span>
              <span style="font-size: 12px; font-weight: 800; color: var(--primary-green);">High Output</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Artist Capacity Overview -->
        <div class="studio-card">
          <div class="task-column-header">
            <div>
              <h3 style="font-size: 16px; font-weight: 800;">Artist Capacity</h3>
              <span style="font-size: 12px; color: var(--text-secondary);">Live workload limits</span>
            </div>
            <button class="circle-action-btn" onclick="window.SignDepotApp.switchView('view-artist-workload')" title="Workload Details">↗</button>
          </div>
          <div id="dashboardWorkloadSummaryList">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- Bottom: Directly Inline Editable Recent Projects Table -->
      <div class="studio-card" id="liveProductionQueueCard">
        <div class="section-header-row" style="margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 17px; font-weight: 800;">Live Production Queue</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
              ✨ <strong>Direct Inline Editing:</strong> Click any cell below to edit Project Name, Client, Artist, or Status. Changes auto-save instantly to MySQL!
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div id="activeKpiFilterBanner" class="active-kpi-filter-pill" style="display: none;"></div>
            <button class="btn btn-primary btn-sm" id="btnDashboardNewRequest">+ Add Project</button>
          </div>
        </div>

        <!-- Filter & Rows Per Page Controls -->
        <div class="filter-bar" style="margin-bottom: 14px;">
          <div class="filter-group">
            <input type="text" class="filter-input" id="dashboardSearchInput" placeholder="Search live orders..." style="width: 220px;">
            <select class="filter-input" id="dashboardFilterStatus">
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="On-going">On-going</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <select class="filter-input" id="dashboardFilterDeadline" title="Filter by Deadline Status">
              <option value="">All Deadlines</option>
              <option value="overdue">🔴 Past Due</option>
              <option value="today">🟠 Due Today</option>
              <option value="soon">🟡 Almost Due (48h)</option>
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-rows-wrap">
              <label for="dashboardFilterPerPage">Show:</label>
              <select class="filter-input rows-filter-select" id="dashboardFilterPerPage" title="Rows to display">
                <option value="10" selected>10 rows</option>
                <option value="15">15 rows</option>
                <option value="20">20 rows</option>
                <option value="25">25 rows</option>
                <option value="30">30 rows</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-studio-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>JO #</th>
                <th>Project Name (Editable)</th>
                <th>Client (Editable)</th>
                <th>Artist</th>
                <th>Deadline</th>
                <th>Project Status</th>
                <th>Priority</th>
                <th class="no-sort">Directive</th>
              </tr>
            </thead>
            <tbody id="dashboardRecentProjectsBody">
              <!-- Populated dynamically with inline editable cells -->
            </tbody>
          </table>
        </div>

        <!-- Dashboard Pagination Container -->
        <div class="pagination-container" id="dashboardPagination" style="margin-top: 14px;">
          <div class="pagination-info-group">
            <div class="pagination-info" id="dashboardPaginationInfo">Showing 0-0 of 0</div>
            <div class="pagination-rows-select-wrap">
              <label for="dashboardPaginationPerPage">Show:</label>
              <select class="filter-input-sm" id="dashboardPaginationPerPage" title="Rows to display">
                <option value="10" selected>10 rows</option>
                <option value="15">15 rows</option>
                <option value="20">20 rows</option>
                <option value="25">25 rows</option>
                <option value="30">30 rows</option>
              </select>
            </div>
          </div>
          <div class="pagination-controls" id="dashboardPaginationControls">
            <!-- Buttons dynamically generated -->
          </div>
        </div>
      </div>
    </section>
  </main>
</div>

<?php require_once __DIR__ . '/pages/includes/footer.php'; ?>
