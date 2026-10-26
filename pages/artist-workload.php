<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Artist Workload
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('artist-workload', 'r');

$pageTitle = 'Artist Workload';
$currentPage = 'artist-workload';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-artist-workload">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Artist Workload & Capacity Management</h2>
              <p>Real-time assignment distribution across Bob, Dorothy, Glen, Goodrich, Jules, Raven, Tim</p>
            </div>
            <div class="section-actions">
              <select class="filter-input" id="workloadFilterAvailability">
                <option value="">All Availability</option>
                <option value="Available">Available (0-3)</option>
                <option value="Moderate">Moderate (4-7)</option>
                <option value="Near Capacity">Near Capacity (8-9)</option>
                <option value="Full">Full (10+)</option>
              </select>
            </div>
          </div>

          <div class="kpi-grid" id="artistWorkloadCardsGrid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            <!-- Dynamically populated artist workload cards -->
          </div>

          <div class="studio-card" style="margin-top: 24px;">
            <div class="section-header-row" style="margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800;" id="workloadSelectedArtistTitle">All Active Artist Assignments</h3>
                <span style="font-size: 12px; color: var(--text-secondary);">Read-only active assignment overview</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <input type="search" name="q_workload" class="filter-input" id="workloadTableSearch" placeholder="Search tasks..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 200px;">
                <div class="filter-rows-wrap">
                  <label for="workloadFilterPerPage">Show:</label>
                  <select class="filter-input rows-filter-select" id="workloadFilterPerPage" title="Rows to display">
                    <option value="10" selected>10 rows</option>
                    <option value="15">15 rows</option>
                    <option value="20">20 rows</option>
                    <option value="25">25 rows</option>
                    <option value="30">30 rows</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="table-studio-wrap" style="margin-bottom: 0;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>Artist</th>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Deadline</th>
                    <th>Project Status</th>
                    <th>Design Status</th>
                    <th>Revisions</th>
                    <th>Directive</th>
                  </tr>
                </thead>
                <tbody id="artistWorkloadDetailsTableBody">
                  <!-- Dynamically populated -->
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-container" id="workloadPagination" style="margin-top: 14px;">
              <div class="pagination-info-group">
                <div class="pagination-info" id="workloadPaginationInfo">Showing 0-0 of 0</div>
                <div class="pagination-rows-select-wrap">
                  <label for="workloadPaginationPerPage">Show:</label>
                  <select class="filter-input-sm" id="workloadPaginationPerPage" title="Rows to display">
                    <option value="10" selected>10 rows</option>
                    <option value="15">15 rows</option>
                    <option value="20">20 rows</option>
                    <option value="25">25 rows</option>
                    <option value="30">30 rows</option>
                  </select>
                </div>
              </div>
              <div class="pagination-controls" id="workloadPaginationControls"></div>
            </div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>