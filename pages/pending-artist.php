<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Pending Artist Queue
 */

require_once __DIR__ . '/config.php';

$pageTitle = 'Pending Artist Queue';
$currentPage = 'pending-artist';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-pending-artist">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Pending Projects — Artist Queue</h2>
              <p>Filter active creative production tasks awaiting design completion</p>
            </div>
            <div class="section-actions" style="display:flex; align-items:center; gap:10px;">
              <select class="filter-input" id="pendingArtistSelect"></select>
              <div class="filter-rows-wrap">
                <label for="pendingArtistFilterPerPage">Show:</label>
                <select class="filter-input rows-filter-select" id="pendingArtistFilterPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
          </div>

          <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="kpi-card">
              <div class="kpi-header"><span>Assigned Projects</span></div>
              <div class="kpi-value" id="artistStatTotal">0</div>
              <div class="kpi-trend">Total in queue</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header"><span>Active / In Progress</span></div>
              <div class="kpi-value" id="artistStatActive" style="color: var(--primary-green);">0</div>
              <div class="kpi-trend">Currently drafting</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header"><span>Overdue Deadlines</span></div>
              <div class="kpi-value" id="artistStatOverdue" style="color: var(--accent-red);">0</div>
              <div class="kpi-trend">Priority attention needed</div>
            </div>
          </div>

          <div class="table-studio-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Project Name (Editable)</th>
                  <th>Project Status</th>
                  <th>Design Status</th>
                  <th>Deadline</th>
                  <th>Revisions</th>
                  <th>Remarks (Editable)</th>
                  <th>Directive</th>
                </tr>
              </thead>
              <tbody id="pendingArtistTableBody"></tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="pendingArtistPagination" style="margin-top: 14px;">
            <div class="pagination-info-group">
              <div class="pagination-info" id="pendingArtistPaginationInfo">Showing 0-0 of 0</div>
              <div class="pagination-rows-select-wrap">
                <label for="pendingArtistPaginationPerPage">Show:</label>
                <select class="filter-input-sm" id="pendingArtistPaginationPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="pagination-controls" id="pendingArtistPaginationControls"></div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>