<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Monthly Output Analytics
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('monthly-output', 'r');

$pageTitle = 'Production Output Analytics';
$currentPage = 'monthly-output';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

$pdo = getDbConnection();
$artistsStmt = $pdo->query("SELECT name FROM artists ORDER BY name ASC");
$activeArtists = $artistsStmt->fetchAll(PDO::FETCH_COLUMN);

$stmt = $pdo->query("SELECT artist, order_date, releasing_date, design_deadline, project_status, design_status, count_standard, count_printing, count_special FROM sales_requests WHERE project_status = 'Completed' OR design_status = 'Submitted'");
$completed = $stmt->fetchAll(PDO::FETCH_ASSOC);

$matrix = [];
foreach ($activeArtists as $a) {
    $matrix[$a] = array_fill(0, 12, 0);
}

$ytdTotal = 0;
$currentMonthTotal = 0;
$currentMonthIdx = (int)date('n') - 1; // 9 for October

foreach ($completed as $r) {
    $dateStr = $r['releasing_date'] ?: ($r['design_deadline'] ?: $r['order_date']);
    if (empty($dateStr)) continue;
    $clean = trim(str_ireplace('Ocotber', 'October', $dateStr));
    $mIdx = -1;
    if (preg_match('/^(\d{4})-(\d{1,2})/', $clean, $m)) {
        $mIdx = (int)$m[2] - 1;
    } else {
        $ts = strtotime($clean);
        if ($ts) $mIdx = (int)date('n', $ts) - 1;
    }
    if ($mIdx < 0 || $mIdx > 11) continue;

    $artist = ucwords(strtolower(trim($r['artist'])));
    if ($artist === 'Juls' || $artist === 'Ju' || $artist === 'J') $artist = 'Jules';
    if ($artist === 'Gle') $artist = 'Glen';

    if (isset($matrix[$artist])) {
        $cnt = max((int)$r['count_standard'] + (int)$r['count_printing'] + (int)$r['count_special'], 1);
        $matrix[$artist][$mIdx] += $cnt;
        $ytdTotal += $cnt;
        if ($mIdx === $currentMonthIdx) {
            $currentMonthTotal += $cnt;
        }
    }
}

$topArtist = '-';
$topArtistCount = 0;
$matrixRows = [];
foreach ($matrix as $art => $counts) {
    $annualSum = array_sum($counts);
    if ($annualSum > $topArtistCount) {
        $topArtistCount = $annualSum;
        $topArtist = $art;
    }
    $matrixRows[] = [
        'artist' => $art,
        'counts' => $counts,
        'annualSum' => $annualSum
    ];
}

uasort($matrixRows, function($a, $b) {
    return $b['annualSum'] - $a['annualSum'];
});

$activeMonths = 8;
$monthlyAvg = $activeMonths > 0 ? number_format($ytdTotal / $activeMonths, 1) : '0';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-monthly-output">
          <!-- Section Header with Timeframe Interval Switcher -->
          <div class="section-header-row" style="flex-wrap: wrap; gap: 16px; align-items: flex-end;">
            <div class="section-title-wrap">
              <h2 id="outputReportTitle">Production Output Analytics</h2>
              <p id="outputReportSubtitle">Performance metrics and verified output breakdown across Daily, Weekly, Monthly, and All-Time intervals</p>
            </div>
            <div class="section-actions" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <!-- Prominent Timeframe Switcher Tabs (Daily | Weekly | Monthly | All Time) -->
              <div class="timeframe-pill-group" id="outputTimeframeTabs" style="display: inline-flex; background: #E2E8F0; padding: 4px; border-radius: 30px; gap: 4px;">
                <button type="button" class="timeframe-btn" data-timeframe="today" id="tabOutputDaily">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Daily
                </button>
                <button type="button" class="timeframe-btn" data-timeframe="week" id="tabOutputWeekly">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  Weekly
                </button>
                <button type="button" class="timeframe-btn active" data-timeframe="month" id="tabOutputMonthly">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Monthly
                </button>
                <button type="button" class="timeframe-btn" data-timeframe="all" id="tabOutputAllTime">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                  All Time
                </button>
              </div>

              <button class="btn btn-secondary btn-sm" id="btnExportMonthlyReportCSV" style="display: inline-flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export Output CSV
              </button>
            </div>
          </div>

          <!-- Interactive Timeframe Filter Bar (Filter by Day, Week, Month, or Year) -->
          <div class="studio-card" id="outputFilterCard" style="padding: 12px 18px; margin-bottom: 20px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary-green);"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0F172A;">Filter Period:</span>
                </div>

                <!-- 1. Year Filter -->
                <div class="filter-field-inline" style="display: flex; align-items: center; gap: 6px;">
                  <label for="outputFilterYear" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Year:</label>
                  <select class="filter-input" id="outputFilterYear" style="min-width: 105px; padding: 5px 8px; font-weight: 700;">
                    <option value="2026" selected>2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="all">All Years</option>
                  </select>
                </div>

                <!-- 2. Month Filter -->
                <div class="filter-field-inline" id="filterFieldMonth" style="display: flex; align-items: center; gap: 6px;">
                  <label for="outputFilterMonth" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Month:</label>
                  <select class="filter-input" id="outputFilterMonth" style="min-width: 145px; padding: 5px 8px; font-weight: 700;">
                    <option value="all">All Months</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9" selected>October (Current)</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                  </select>
                </div>

                <!-- 3. Week Filter (Dynamic weeks with Prev/Next buttons) -->
                <div class="filter-field-inline" id="filterFieldWeek" style="display: none; align-items: center; gap: 6px;">
                  <label for="outputFilterWeek" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Week:</label>
                  <div style="display: inline-flex; align-items: center; gap: 3px;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btnPrevWeek" title="Previous Week" style="padding: 4px 9px; font-weight: 800;">‹</button>
                    <select class="filter-input" id="outputFilterWeek" style="min-width: 235px; padding: 5px 8px; font-weight: 700;">
                      <!-- Populated dynamically in script.js -->
                    </select>
                    <button type="button" class="btn btn-secondary btn-sm" id="btnNextWeek" title="Next Week" style="padding: 4px 9px; font-weight: 800;">›</button>
                  </div>
                </div>

                <!-- 4. Day Filter (Interactive Date picker with Prev/Next/Today buttons) -->
                <div class="filter-field-inline" id="filterFieldDay" style="display: none; align-items: center; gap: 6px;">
                  <label for="outputFilterDate" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Day:</label>
                  <div style="display: inline-flex; align-items: center; gap: 3px;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btnPrevDay" title="Previous Day" style="padding: 4px 9px; font-weight: 800;">‹</button>
                    <input type="date" class="filter-input" id="outputFilterDate" value="2026-10-26" style="width: 140px; padding: 5px 8px; font-weight: 700;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btnNextDay" title="Next Day" style="padding: 4px 9px; font-weight: 800;">›</button>
                    <button type="button" class="btn btn-secondary btn-sm" id="btnFilterToday" style="padding: 4px 10px; font-size: 11px; font-weight: 800; background: #0F172A; color: #FFF;">Today</button>
                  </div>
                </div>
              </div>

              <!-- Quick summary badge & reset button -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-ongoing" id="outputFilterStatusBadge" style="font-size: 11px; padding: 5px 12px; font-weight: 700;">Active Filter: October 2026</span>
                <button type="button" class="btn btn-secondary btn-sm" id="btnResetOutputFilter" style="font-size: 11px; padding: 5px 10px; display: inline-flex; align-items: center; gap: 4px;" title="Reset filters to current defaults">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Dynamic Output KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card" id="kpiCardPeriodOutput">
              <div class="kpi-header"><span id="outputKpi1Title">Current Month Output</span></div>
              <div class="kpi-value" id="outputYtdTotal"><?= number_format($currentMonthTotal ?: $ytdTotal) ?></div>
              <div class="kpi-trend" id="outputKpi1Desc">Completed assignments</div>
            </div>
            <div class="kpi-card" id="kpiCardCategoryMix">
              <div class="kpi-header"><span id="outputKpi2Title">Category Breakdown</span></div>
              <div class="kpi-value" id="outputCurrentMonthTotal" style="color: var(--primary-green); font-size: 20px;">Std / Prt / Spc</div>
              <div class="kpi-trend" id="outputKpi2Desc">Fabrication distribution</div>
            </div>
            <div class="kpi-card" id="kpiCardTopArtist">
              <div class="kpi-header"><span id="outputKpi3Title">Top Producer</span></div>
              <div class="kpi-value" id="outputTopArtistName" style="font-size: 20px;"><?= htmlspecialchars($topArtist) ?></div>
              <div class="kpi-trend" id="outputTopArtistCount"><?= number_format($topArtistCount) ?> completed jobs</div>
            </div>
            <div class="kpi-card" id="kpiCardPeriodAvg">
              <div class="kpi-header"><span id="outputKpi4Title">Productivity Benchmark</span></div>
              <div class="kpi-value" id="outputMonthlyAvg"><?= htmlspecialchars($monthlyAvg) ?> / mo</div>
              <div class="kpi-trend" id="outputKpi4Desc">Average output rate</div>
            </div>
          </div>

          <!-- Interactive Responsive SVG Chart -->
          <div class="studio-card" style="margin-bottom: 24px;">
            <div class="section-header-row" style="margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800;" id="outputChartTitle">2026 Completed Assignments Output per Month</h3>
                <span style="font-size: 12px; color: var(--text-secondary);" id="outputChartSubtitle">Hover over bars for exact count and verified totals</span>
              </div>
              <span class="badge badge-ongoing" id="outputChartIntervalBadge">Monthly Interval</span>
            </div>
            <div class="svg-chart-container" id="monthlyChartSvgContainer"></div>
          </div>

          <!-- Dynamic Output Matrix Breakdown Table -->
          <div class="studio-card">
            <div class="section-header-row" style="margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800;" id="outputMatrixTitle">Artist Production Output Matrix (Jan — Dec 2026)</h3>
                <span class="badge badge-completed" id="outputMatrixBadge">Verified Assignment Count</span>
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
                <thead id="monthlyOutputTableHead">
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
                <tfoot id="monthlyOutputTableFoot"></tfoot>
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

          <!-- Daily Completed Tasks Detailed Log (Rendered when in Daily mode) -->
          <div class="studio-card" id="dailyCompletedTasksCard" style="margin-top: 24px; display: none;">
            <div class="section-header-row" style="margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
              <div>
                <h3 style="font-size: 16px; font-weight: 800;" id="dailyTasksTitle">Today's Completed Production Tasks</h3>
                <span style="font-size: 12px; color: var(--text-secondary);" id="dailyTasksSubtitle">Detailed log of individual job orders finished today</span>
              </div>
              <span class="badge badge-completed" id="dailyTasksCountBadge">0 Completed</span>
            </div>
            <div class="table-studio-wrap" style="margin-bottom: 0;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>JO Number</th>
                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Artist</th>
                    <th>Category</th>
                    <th>Completed Date</th>
                    <th>Directive</th>
                  </tr>
                </thead>
                <tbody id="dailyCompletedTasksTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>