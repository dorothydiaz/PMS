<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Monthly Output Analytics
 */

require_once dirname(__DIR__) . '/config.php';

$pageTitle = 'Monthly Output Analytics';
$currentPage = 'monthly-output';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-monthly-output">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Monthly Production Output Report</h2>
              <p>Mandatory Counting Rule: Accurately counts completed artist assignments by month of completion</p>
            </div>
            <div class="section-actions">
              <select class="filter-input" id="monthlyOutputYearSelect">
                <option value="2026">Reporting Year 2026</option>
              </select>
              <button class="btn btn-secondary btn-sm" id="btnExportMonthlyReportCSV">Export Output Summary</button>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-header"><span>Year-to-Date Output</span></div>
              <div class="kpi-value" id="outputYtdTotal">0</div>
              <div class="kpi-trend">Total completed assignments</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header"><span>Current Month Output</span></div>
              <div class="kpi-value" id="outputCurrentMonthTotal" style="color: var(--primary-green);">0</div>
              <div class="kpi-trend">October 2026 completed jobs</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header"><span>Top Artist</span></div>
              <div class="kpi-value" id="outputTopArtistName" style="font-size: 20px;">-</div>
              <div class="kpi-trend" id="outputTopArtistCount">0 completed jobs</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-header"><span>Monthly Average</span></div>
              <div class="kpi-value" id="outputMonthlyAvg">0</div>
              <div class="kpi-trend">Assignments per month</div>
            </div>
          </div>

          <div class="studio-card" style="margin-bottom: 24px;">
            <div class="section-header-row" style="margin-bottom: 12px;">
              <h3 style="font-size: 16px; font-weight: 800;">2026 Completed Assignments Output per Month</h3>
              <span style="font-size: 12px; color: var(--text-secondary);">Hover over bars for exact count</span>
            </div>
            <div class="svg-chart-container" id="monthlyChartSvgContainer"></div>
          </div>

          <div class="studio-card">
            <div class="section-header-row" style="margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800;">Artist Production Output Matrix (Jan — Dec 2026)</h3>
                <span class="badge badge-completed">Verified Assignment Count</span>
              </div>
              <div class="filter-rows-wrap">
                <label for="monthlyOutputFilterPerPage">Show:</label>
                <select class="filter-input rows-filter-select" id="monthlyOutputFilterPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="table-studio-wrap" style="margin-bottom: 0;">
              <table class="data-table" id="monthlyOutputMatrixTable">
                <thead>
                  <tr>
                    <th>Artist</th>
                    <th>Jan</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Aug</th>
                    <th>Sep</th>
                    <th>Oct</th>
                    <th>Nov</th>
                    <th>Dec</th>
                    <th style="font-weight: 800; background: #EBF7F4; color: var(--primary-green);">Annual Total</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody id="monthlyOutputTableBody"></tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-container" id="monthlyOutputPagination" style="margin-top: 14px;">
              <div class="pagination-info-group">
                <div class="pagination-info" id="monthlyOutputPaginationInfo">Showing 1-9 of 9 artists</div>
                <div class="pagination-rows-select-wrap">
                  <label for="monthlyOutputPaginationPerPage">Show:</label>
                  <select class="filter-input-sm" id="monthlyOutputPaginationPerPage" title="Rows to display">
                    <option value="10" selected>10 rows</option>
                    <option value="15">15 rows</option>
                    <option value="20">20 rows</option>
                    <option value="25">25 rows</option>
                    <option value="30">30 rows</option>
                  </select>
                </div>
              </div>
              <div class="pagination-controls" id="monthlyOutputPaginationControls"></div>
            </div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>