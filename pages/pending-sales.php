<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Pending Sales Queue
 */

require_once __DIR__ . '/config.php';

$pageTitle = 'Pending Sales Queue';
$currentPage = 'pending-sales';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-pending-sales">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Pending Projects — Sales Queue</h2>
              <p>Track orders awaiting sales approvals, release coordination & rush items</p>
            </div>
          </div>

          <div class="filter-bar">
            <div class="filter-group">
              <button class="btn btn-primary btn-sm sales-queue-tab active" data-queue="all">All Pending</button>
              <button class="btn btn-secondary btn-sm sales-queue-tab" data-queue="approval">Pending Approval</button>
              <button class="btn btn-secondary btn-sm sales-queue-tab" data-queue="files">Files to Follow</button>
              <button class="btn btn-secondary btn-sm sales-queue-tab" data-queue="release">Awaiting Release</button>
              <button class="btn btn-secondary btn-sm sales-queue-tab" data-queue="rush">Rush Projects</button>
            </div>
            <div class="filter-group">
              <input type="text" class="filter-input" id="pendingSalesSearchInput" placeholder="Search queue..." style="width: 200px;">
              <div class="filter-rows-wrap">
                <label for="pendingSalesFilterPerPage">Show:</label>
                <select class="filter-input rows-filter-select" id="pendingSalesFilterPerPage" title="Rows to display">
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
                  <th>JO Number</th>
                  <th>Sales Rep</th>
                  <th>Client (Editable)</th>
                  <th>Project Name (Editable)</th>
                  <th>Artist</th>
                  <th>Client Approval</th>
                  <th>File Sent</th>
                  <th>Releasing Date</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th class="no-sort">Quick Action</th>
                </tr>
              </thead>
              <tbody id="pendingSalesTableBody"></tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="pendingSalesPagination" style="margin-top: 14px;">
            <div class="pagination-info-group">
              <div class="pagination-info" id="pendingSalesPaginationInfo">Showing 0-0 of 0</div>
              <div class="pagination-rows-select-wrap">
                <label for="pendingSalesPaginationPerPage">Show:</label>
                <select class="filter-input-sm" id="pendingSalesPaginationPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="pagination-controls" id="pendingSalesPaginationControls"></div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>