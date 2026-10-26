<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Creatives Tracker
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('creatives-tracker', 'r');

$pageTitle = 'Creatives Tracker';
$currentPage = 'creatives-tracker';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-creatives-tracker">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Creatives Tracker</h2>
              <p>Directly edit counts (Std/Prt/Spc), Statuses, Deadlines, and Remarks like Google Sheets</p>
            </div>
            <div class="section-actions">
              <div id="trackerKpiFilterBanner" class="active-kpi-filter-pill" style="display: none;"></div>
              <button class="btn btn-secondary btn-sm" id="btnQuickExportTrackerCSV">Export CSV</button>
            </div>
          </div>

          <!-- Interactive KPI Metrics Grid for Creatives Tracker Table -->
          <div class="kpi-grid" style="margin-bottom: 18px;">
            <div class="kpi-card" id="trackerKpiCardTotal" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('all')" title="Filter by All Records">
              <div class="kpi-header">
                <span>Total Requests</span>
                <span class="badge badge-ongoing">All Records</span>
              </div>
              <div class="kpi-value" id="kpiTotalRequestsTracker">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">All active orders</div>
              </div>
            </div>

            <div class="kpi-card" id="trackerKpiCardPending" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('pending')" title="Filter by Pending Approval">
              <div class="kpi-header">
                <span>Pending Approval</span>
                <span class="badge badge-pending">Queue</span>
              </div>
              <div class="kpi-value" id="kpiPendingApprovalTracker">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">Awaiting review</div>
              </div>
            </div>

            <div class="kpi-card" id="trackerKpiCardWorking" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('working')" title="Filter by Working / On-Going">
              <div class="kpi-header">
                <span>Working / On-Going</span>
                <span class="badge badge-ongoing">In Progress</span>
              </div>
              <div class="kpi-value" id="kpiWorkingTracker">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">Active drafting</div>
              </div>
            </div>

            <div class="kpi-card" id="trackerKpiCardApproved" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('approved')" title="Filter by Approved">
              <div class="kpi-header">
                <span>Approved</span>
                <span class="badge badge-approved">Approved</span>
              </div>
              <div class="kpi-value" id="kpiApprovedTracker">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">Production cleared</div>
              </div>
            </div>

            <div class="kpi-card" id="trackerKpiCardRevising" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('revising')" title="Filter by Revising">
              <div class="kpi-header">
                <span>Revising</span>
                <span class="badge badge-revising">Feedback</span>
              </div>
              <div class="kpi-value" id="kpiRevisingTracker">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">Client alterations</div>
              </div>
            </div>

            <div class="kpi-card" id="trackerKpiCardOverdue" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('overdue')" title="Filter by Overdue">
              <div class="kpi-header">
                <span>Overdue</span>
                <span class="badge badge-priority-rush">Past Due</span>
              </div>
              <div class="kpi-value" id="kpiOverdueTracker" style="color: var(--accent-red);">0</div>
              <div class="kpi-footer-row">
                <div class="kpi-trend">Needs attention</div>
              </div>
            </div>
          </div>

          <!-- Tracker Filters -->
          <div class="filter-bar">
            <div class="filter-group">
              <input type="search" name="q_tasks" class="filter-input" id="trackerSearchInput" placeholder="Filter tasks..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 200px;">
              <select class="filter-input" id="trackerFilterProjectStatus">
                <option value="">All Project Statuses</option>
                <option value="Pending">Pending</option>
                <option value="On-going">On-going</option>
                <option value="Approved">Approved</option>
                <option value="For Review">For Review</option>
                <option value="Revising">Revising</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <select class="filter-input" id="trackerFilterDesignStatus">
                <option value="">All Design Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="For Review">For Review</option>
                <option value="Revising">Revising</option>
                <option value="Submitted">Submitted</option>
              </select>
              <select class="filter-input" id="trackerFilterArtist">
                <option value="">All Artists</option>
              </select>
              <select class="filter-input" id="trackerFilterOverdue" title="Filter by Deadline Status">
                <option value="">All Deadlines</option>
                <option value="overdue">🔴 Past Due</option>
                <option value="today">🟠 Due Today</option>
                <option value="soon">🟡 Almost Due (48h)</option>
                <option value="ontime">🟢 On Track</option>
              </select>
            </div>
            <div class="filter-group">
              <div class="filter-rows-wrap">
                <label for="trackerFilterPerPage">Show:</label>
                <select class="filter-input rows-filter-select" id="trackerFilterPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="btnResetTrackerFilters" onclick="if(window.SignDepotApp && window.SignDepotApp.resetTrackerFilters) window.SignDepotApp.resetTrackerFilters();">Reset Filters</button>
            </div>
          </div>

          <!-- Directly Inline Editable Creatives Tracker Table -->
          <div class="table-studio-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th data-sort="requestId">Req ID</th>
                  <th data-sort="artist">Artist</th>
                  <th data-sort="projectName">Project Name (Editable)</th>
                  <th data-sort="designDeadline">Deadline</th>
                  <th data-sort="headApproval">Head Approval</th>
                  <th data-sort="countStandard" title="Standard Count">Std</th>
                  <th data-sort="countPrinting" title="Printing Count">Prt</th>
                  <th data-sort="countSpecial" title="Special Count">Spc</th>
                  <th data-sort="projectStatus">Project Status</th>
                  <th data-sort="designStatus">Design Status</th>
                  <th>Overdue</th>
                  <th data-sort="revisionCount">Rev#</th>
                  <th>Remarks (Editable)</th>
                  <th data-sort="salesRep">Sales</th>
                  <th class="no-sort">Actions</th>
                </tr>
              </thead>
              <tbody id="creativesTrackerTableBody">
                <!-- Dynamically rendered with direct inputs -->
              </tbody>
            </table>
          </div>

          <div class="pagination-container" id="trackerPagination">
            <div class="pagination-info-group">
              <div class="pagination-info" id="trackerPaginationInfo">Showing 0-0 of 0</div>
              <div class="pagination-rows-select-wrap">
                <label for="trackerPaginationPerPage">Show:</label>
                <select class="filter-input-sm" id="trackerPaginationPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="pagination-controls" id="trackerPaginationControls"></div>
    </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>