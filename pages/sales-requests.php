<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Sales Requests
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('sales-requests', 'r');

$pageTitle = 'Sales Requests';
$currentPage = 'sales-requests';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-sales-requests">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Sales Requests Management</h2>
              <p>Directly click and edit any field inline. Press Enter or click outside to auto-save.</p>
            </div>
            <div class="section-actions">
              <?php if (hasPermission('sales-requests', 'c')): ?>
              <button class="btn btn-primary" id="btnSalesNewRequest">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Request
              </button>
              <?php endif; ?>
            </div>
          </div>

          <!-- Client Approval Status Tabs -->
          <div class="sales-tabs-container">
            <div class="sales-approval-tabs" role="tablist">
              <?php if (hasTabPermission('sales-requests', 'all')): ?>
              <button type="button" class="sales-approval-tab active" data-tab-approval="" id="tabSalesAll" role="tab" aria-selected="true">
                <span class="tab-label">All Requests</span>
                <span class="tab-count-pill" id="badgeCountAll">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'pending')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Pending" id="tabSalesPending" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-pending"></span>
                <span class="tab-label">Pending</span>
                <span class="tab-count-pill pill-pending" id="badgeCountPending">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'revision')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Revision Requested" id="tabSalesRevision" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-revision"></span>
                <span class="tab-label">Revision Requested</span>
                <span class="tab-count-pill pill-revision" id="badgeCountRevision">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'approved')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Approved" id="tabSalesApproved" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-approved"></span>
                <span class="tab-label">Approved</span>
                <span class="tab-count-pill pill-approved" id="badgeCountApproved">0</span>
              </button>
              <?php endif; ?>
            </div>
          </div>

          <!-- Filter & Search Controls -->
          <div class="filter-bar">
            <div class="filter-group">
              <input type="search" name="q_orders" class="filter-input" id="salesSearchInput" placeholder="Search orders..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 220px;">
              <select class="filter-input" id="salesFilterPriority">
                <option value="">All Priorities</option>
                <option value="Rush">Rush</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select class="filter-input" id="salesFilterApproval">
                <option value="">All Approvals</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Revision Requested">Revision Requested</option>
              </select>
              <select class="filter-input" id="salesFilterLocation">
                <option value="">All Locations</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor & Outdoor">Indoor & Outdoor</option>
              </select>
              <select class="filter-input" id="salesFilterFileSent">
                <option value="">File Sent Status</option>
                <option value="Sent">File Sent</option>
                <option value="Pending">File Pending</option>
              </select>
              <select class="filter-input" id="salesFilterSalesRep">
                <option value="">All Sales Reps</option>
              </select>
              <select class="filter-input" id="salesFilterDeadline" title="Filter by Deadline Status">
                <option value="">All Deadlines</option>
                <option value="overdue">🔴 Past Due</option>
                <option value="today">🟠 Due Today</option>
                <option value="soon">🟡 Almost Due (48h)</option>
              </select>
            </div>
            <div class="filter-group">
              <div class="filter-rows-wrap">
                <label for="salesFilterPerPage">Show:</label>
                <select class="filter-input rows-filter-select" id="salesFilterPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
              <button class="btn btn-secondary btn-sm" id="btnResetSalesFilters">Reset Filters</button>
            </div>
          </div>

          <!-- Directly Inline Editable Sales Table -->
          <div class="table-studio-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th data-sort="requestId">Req ID</th>
                  <th data-sort="joNumber">JO #</th>
                  <th data-sort="projectName">Project Name (Click to Edit)</th>
                  <th data-sort="client">Client (Click to Edit)</th>
                  <th data-sort="location">Location</th>
                  <th data-sort="artist">Artist</th>
                  <th data-sort="designDeadline">Deadline</th>
                  <th data-sort="releasingDate">Releasing</th>
                  <th data-sort="fileSent">File Sent</th>
                  <th data-sort="clientApproval">Approval</th>
                  <th data-sort="priority">Priority</th>
                  <th data-sort="salesRep">Sales</th>
                  <th class="no-sort">Actions</th>
                </tr>
              </thead>
              <tbody id="salesRequestsTableBody">
                <!-- Dynamically rendered with inline editable inputs -->
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="salesPagination">
            <div class="pagination-info-group">
              <div class="pagination-info" id="salesPaginationInfo">Showing 0-0 of 0</div>
              <div class="pagination-rows-select-wrap">
                <label for="salesPaginationPerPage">Show:</label>
                <select class="filter-input-sm" id="salesPaginationPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="pagination-controls" id="salesPaginationControls"></div>
    </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>