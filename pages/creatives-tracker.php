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

          <!-- Creatives Tracker Artist Acceptance Stream Tabs -->
          <div class="sales-tabs-container tracker-tabs-container" style="margin-bottom: 14px;">
            <div class="sales-approval-tabs tracker-acceptance-tabs" role="tablist">
              <button type="button" class="sales-approval-tab active" data-tracker-tab="accepted" id="tabTrackerAccepted" role="tab" aria-selected="true" onclick="window.SignDepotApp.switchTrackerAcceptanceTab('accepted')">
                <span class="tab-status-dot dot-approved"></span>
                <span class="tab-label">Accepted Projects</span>
                <span class="tab-count-pill pill-approved" id="trackerBadgeCountAccepted">0</span>
              </button>
              <button type="button" class="sales-approval-tab" data-tracker-tab="pending" id="tabTrackerPending" role="tab" aria-selected="false" onclick="window.SignDepotApp.switchTrackerAcceptanceTab('pending')">
                <span class="tab-status-dot dot-pending"></span>
                <span class="tab-label">Pending Projects (To be Accepted)</span>
                <span class="tab-count-pill pill-pending" id="trackerBadgeCountPending">0</span>
              </button>
              <button type="button" class="sales-approval-tab" data-tracker-tab="all" id="tabTrackerAll" role="tab" aria-selected="false" onclick="window.SignDepotApp.switchTrackerAcceptanceTab('all')">
                <span class="tab-label">All Projects</span>
                <span class="tab-count-pill" id="trackerBadgeCountAll">0</span>
              </button>
            </div>
          </div>

          <!-- Tracker Filters -->
          <div class="filter-bar">
            <div class="filter-group">
              <input type="search" name="q_tasks" class="filter-input" id="trackerSearchInput" placeholder="Filter tasks..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 175px;">
              
              <!-- Date Filter Group -->
              <div class="filter-date-wrap">
                <select class="filter-input" id="trackerFilterDateColumn" title="Target Date Field">
                  <option value="orderDate">Date: Timestamp</option>
                  <option value="designDeadline">Date: Deadline</option>
                  <option value="dateUpdated">Date: Updated</option>
                  <option value="any">Date: Any Field</option>
                </select>
                <select class="filter-input" id="trackerFilterDatePreset" title="Date Range Preset">
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="custom">Specific Date...</option>
                </select>
                <input type="date" class="filter-input" id="trackerFilterDateCustom" style="display: none; width: 135px; padding: 5px 8px;" title="Pick Specific Date">
              </div>

              <select class="filter-input" id="trackerFilterProjectStatus">
                <option value="">All Project Statuses</option>
                <option value="Completed">Completed</option>
                <option value="On-going">On-going</option>
              </select>
              <select class="filter-input" id="trackerFilterDesignStatus">
                <option value="">All Design Statuses</option>
                <option value="On Queue">On Queue</option>
                <option value="On-hold">On-hold</option>
                <option value="Incomplete Details">Incomplete Details</option>
                <option value="Ongoing">Ongoing</option>
                <option value="For Approval Design">For Approval Design</option>
                <option value="Design Approved">Design Approved</option>
                <option value="Sent to AE">Sent to AE</option>
                <option value="Sent to Prod">Sent to Prod</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Revising">Revising</option>
                <option value="Completed">Completed</option>
              </select>
              <select class="filter-input" id="trackerFilterArtist">
                <option value="">All Artists</option>
              </select>
              <select class="filter-input" id="trackerFilterOverdue" title="Filter by Deadline Status">
                <option value="">All Deadlines</option>
                <option value="overdue">Past Due</option>
                <option value="today">Due Today</option>
                <option value="soon">Almost Due (48h)</option>
                <option value="ontime">On Track</option>
              </select>

              <!-- Quick Sort Dropdown -->
              <select class="filter-input" id="trackerSortDropdown" title="Sort Table Rows">
                <option value="requestId_desc" selected>Sort: Request ID (Latest to Old)</option>
                <option value="requestId_asc">Sort: Request ID (Old to Latest)</option>
                <option value="projectName_asc">Sort: Project Name (A → Z)</option>
                <option value="projectName_desc">Sort: Project Name (Z → A)</option>
                <option value="artist_asc">Sort: Artist (A → Z)</option>
                <option value="artist_desc">Sort: Artist (Z → A)</option>
                <option value="salesRep_asc">Sort: Sales Rep (A → Z)</option>
                <option value="salesRep_desc">Sort: Sales Rep (Z → A)</option>
                <option value="designStatus_asc">Sort: Design Status (A → Z)</option>
                <option value="headApproval_asc">Sort: Head Approval (A → Z)</option>
                <option value="designDeadline_asc">Sort: Deadline (Earliest)</option>
                <option value="designDeadline_desc">Sort: Deadline (Latest)</option>
                <option value="revisionCount_desc">Sort: Revisions (High → Low)</option>
                <option value="dateUpdated_desc">Sort: Date Updated (Newest)</option>
              </select>
            </div>
            <div class="filter-group">
              <button type="button" class="btn btn-secondary btn-sm" id="btnResetTrackerFilters" onclick="if(window.SignDepotApp && window.SignDepotApp.resetTrackerFilters) window.SignDepotApp.resetTrackerFilters();">Reset Filters</button>
            </div>
          </div>

          <!-- Directly Inline Editable Creatives Tracker Table -->
          <div class="table-studio-wrap">
            <table class="data-table" id="creativesTrackerTable">
              <thead>
                <tr>
                  <th data-sort="requestId" title="Click to sort: Latest to Old / Old to Latest">Request ID</th>
                  <th data-sort="artist" title="Click to sort alphabetically (A-Z / Z-A)">Artist</th>
                  <th data-sort="projectName" title="Click to sort alphabetically (A-Z / Z-A)">Project Name</th>
                  <th data-sort="designDeadline" title="Click to sort by Deadline Date">Design Deadline</th>
                  <th data-sort="headApproval" title="Click to sort alphabetically">Head Approval</th>
                  <th data-sort="countStandard" title="Click to sort numerically">Standard</th>
                  <th data-sort="countSpecial" title="Click to sort numerically">Special</th>
                  <th data-sort="countPrinting" title="Click to sort numerically">Printing</th>
                  <th data-sort="projectStatus" title="Click to sort alphabetically">Project Status</th>
                  <th data-sort="designStatus" title="Click to sort alphabetically">Design Status</th>
                  <th data-sort="deadlineStatus" title="Click to sort by Overdue severity">Overdue Indicator</th>
                  <th data-sort="revisionCount" title="Click to sort numerically">Revision Count</th>
                  <th data-sort="remarks" title="Click to sort alphabetically">Remarks</th>
                  <th data-sort="salesRep" title="Click to sort alphabetically (A-Z / Z-A)">Sales</th>
                  <th data-sort="orderDate" title="Click to sort by Timestamp">Timestamp</th>
                  <th data-sort="dateUpdated" title="Click to sort by Date Updated">Date Updated</th>
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