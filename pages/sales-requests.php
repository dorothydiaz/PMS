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
              <p>Click <strong>+ Add Request</strong> to open the new request modal. Existing requests can also be edited directly inline or via the full edit dialog.</p>
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
              <?php if (hasTabPermission('sales-requests', 'ongoing')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="On-going" id="tabSalesOngoing" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-ongoing"></span>
                <span class="tab-label">On-going</span>
                <span class="tab-count-pill pill-ongoing" id="badgeCountOngoing">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'for_review')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="For Review" id="tabSalesForReview" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-for-review"></span>
                <span class="tab-label">For Review</span>
                <span class="tab-count-pill pill-for-review" id="badgeCountForReview">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'revising')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Revising" id="tabSalesRevising" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-revising"></span>
                <span class="tab-label">Revising</span>
                <span class="tab-count-pill pill-revising" id="badgeCountRevising">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'completed')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Completed" id="tabSalesCompleted" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-completed"></span>
                <span class="tab-label">Completed</span>
                <span class="tab-count-pill pill-completed" id="badgeCountCompleted">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'released')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Released" id="tabSalesReleased" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-released"></span>
                <span class="tab-label">Released</span>
                <span class="tab-count-pill pill-released" id="badgeCountReleased">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'incomplete')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Incomplete Details/Files" id="tabSalesIncomplete" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-incomplete"></span>
                <span class="tab-label">Incomplete Details/Files</span>
                <span class="tab-count-pill pill-incomplete" id="badgeCountIncomplete">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'onhold')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Onhold" id="tabSalesOnhold" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-onhold"></span>
                <span class="tab-label">Onhold</span>
                <span class="tab-count-pill pill-onhold" id="badgeCountOnhold">0</span>
              </button>
              <?php endif; ?>
              <?php if (hasTabPermission('sales-requests', 'pending_approval')): ?>
              <button type="button" class="sales-approval-tab" data-tab-approval="Pending Approval" id="tabSalesPendingApproval" role="tab" aria-selected="false">
                <span class="tab-status-dot dot-pending"></span>
                <span class="tab-label">Pending Approval</span>
                <span class="tab-count-pill pill-pending" id="badgeCountPendingApproval">0</span>
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
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Rush">Rush</option>
              </select>
              <select class="filter-input" id="salesFilterApproval">
                <option value="">All Approvals</option>
                <option value="On-going">On-going</option>
                <option value="For Review">For Review</option>
                <option value="Revising">Revising</option>
                <option value="Completed">Completed</option>
                <option value="Released">Released</option>
                <option value="Incomplete Details/Files">Incomplete Details/Files</option>
                <option value="Onhold">Onhold</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
              </select>
              <select class="filter-input" id="salesFilterLocation">
                <option value="">All Placements</option>
                <option value="N/A">N/A (Blank)</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor & Outdoor">Indoor & Outdoor</option>
              </select>
              <select class="filter-input" id="salesFilterFileSent">
                <option value="">All File Statuses</option>
                <option value="N/A">N/A (Blank)</option>
                <option value="File Sent">File Sent</option>
                <option value="To Follow">To Follow</option>
                <option value="Incomplete">Incomplete</option>
              </select>
              <select class="filter-input" id="salesFilterSalesRep">
                <option value="">All Sales Reps</option>
              </select>
              <select class="filter-input" id="salesFilterDeadline" title="Filter by Deadline Status">
                <option value="">All Deadlines</option>
                <option value="overdue">Past Due</option>
                <option value="today">Due Today</option>
                <option value="soon">Almost Due (48h)</option>
                <option value="ontrack">On Track</option>
              </select>
            </div>
            <div class="filter-group">
              <button type="button" class="btn btn-secondary btn-sm" id="btnResetSalesFilters" onclick="if(window.SignDepotApp && window.SignDepotApp.resetSalesFilters) window.SignDepotApp.resetSalesFilters();">Reset Filters</button>
            </div>
          </div>

          <!-- Directly Inline Editable Sales Table -->
          <div class="table-studio-wrap">
            <table class="data-table" id="salesRequestsTable">
              <thead>
                <tr>
                  <th class="col-req-id" data-sort="requestId" title="Request ID">Request ID</th>
                  <th class="col-jo-number" data-sort="joNumber" title="Job Order Number">JO Number</th>
                  <th class="col-order-date" data-sort="orderDate" title="Timestamp (Date Encoded)">Timestamp (Date Encoded)</th>
                  <th class="col-sales-rep" data-sort="salesRep" title="Sales Representative">Sales Rep</th>
                  <th class="col-client" data-sort="client" title="Client / Company">Client</th>
                  <th class="col-project-name" data-sort="projectName" title="Project Name">Project Name</th>
                  <th class="col-artist" data-sort="artist" title="Assigned Artist">Artist</th>
                  <th class="col-design-deadline" data-sort="designDeadline" title="Design Deadline">Design Deadline</th>
                  <th class="col-releasing-date" data-sort="releasingDate" title="Production Due Date">Prod Due</th>
                  <th class="col-file-sent" data-sort="fileSent" title="File Status">File Status</th>
                  <th class="col-address" data-sort="completeAddress" title="Delivery or Installation Address">Address</th>
                  <th class="col-location" data-sort="location" title="Placement">Placement</th>
                  <th class="col-releasing-mode" data-sort="releasingMode" title="Mode of Releasing">Mode of Releasing</th>
                  <th class="col-contact-person" data-sort="contactPerson" title="Client Contact Person">Contact Person</th>
                  <th class="col-contact-number" data-sort="contactNumber" title="Contact Number">Contact Number</th>
                  <th class="col-client-approval" data-sort="clientApproval" title="Client Approval State">Client Approval</th>
                  <th class="col-priority" data-sort="priority" title="Priority Level">Priority Level</th>
                  <th class="col-actions no-sort">Actions</th>
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