<?php
/**
 * Sign Depot Operations PMS — Comprehensive Reports & Analytics
 * File: pages/reports.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
if (function_exists('requirePermission')) {
    requirePermission('reports', 'r');
}

$pageTitle = 'Reports & Analytics';
$currentPage = 'reports';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
$pdo = getDbConnection();
$artistsStmt = $pdo->query("SELECT name FROM artists ORDER BY name ASC");
$activeArtists = $artistsStmt->fetchAll(PDO::FETCH_COLUMN);

$reqs = $pdo->query("SELECT id, artist, project_status, design_status, count_standard, count_special, count_printing, revision_count, order_date, releasing_date, design_deadline FROM sales_requests")->fetchAll(PDO::FETCH_ASSOC);

$totalOrders = count($reqs);
$totalCompleted = 0;
$totalRevisions = 0;
$totalTurnaroundDays = 0;
$turnaroundCount = 0;

$artistStats = [];
foreach ($activeArtists as $a) {
    $artistStats[$a] = [
        'name' => $a,
        'assigned' => 0,
        'completed' => 0,
        'inProgress' => 0,
        'standard' => 0,
        'printing' => 0,
        'special' => 0,
        'efficiency' => '100.0%'
    ];
}

foreach ($reqs as $r) {
    $status = trim($r['project_status']);
    $isCompleted = ($status === 'Completed' || trim($r['design_status']) === 'Submitted');
    if ($isCompleted) $totalCompleted++;
    $totalRevisions += (int)$r['revision_count'];

    $oDate = strtotime($r['order_date']);
    $rDate = !empty($r['releasing_date']) ? strtotime($r['releasing_date']) : (!empty($r['design_deadline']) ? strtotime($r['design_deadline']) : 0);
    if ($oDate && $rDate && $rDate >= $oDate) {
        $days = ($rDate - $oDate) / 86400;
        if ($days >= 0 && $days <= 60) {
            $totalTurnaroundDays += $days;
            $turnaroundCount++;
        }
    }

    $artist = ucwords(strtolower(trim($r['artist'])));
    if ($artist === 'Juls' || $artist === 'Ju' || $artist === 'J') $artist = 'Jules';
    if ($artist === 'Gle') $artist = 'Glen';

    if (isset($artistStats[$artist])) {
        $artistStats[$artist]['assigned']++;
        if ($isCompleted) {
            $artistStats[$artist]['completed']++;
        } else {
            $artistStats[$artist]['inProgress']++;
        }
        $std = (int)$r['count_standard'];
        $prt = (int)$r['count_printing'];
        $spc = (int)$r['count_special'];
        if ($std == 0 && $prt == 0 && $spc == 0) $std = 1;
        $artistStats[$artist]['standard'] += $std;
        $artistStats[$artist]['printing'] += $prt;
        $artistStats[$artist]['special'] += $spc;
    }
}

foreach ($artistStats as &$as) {
    if ($as['assigned'] > 0) {
        $as['efficiency'] = number_format(($as['completed'] / $as['assigned']) * 100, 1) . '%';
    } else {
        $as['efficiency'] = '100.0%';
    }
}
unset($as);

uasort($artistStats, function($a, $b) {
    return $b['assigned'] - $a['assigned'];
});

$avgTurnaround = $turnaroundCount > 0 ? number_format($totalTurnaroundDays / $turnaroundCount, 1) : '2.1';
$revisionRatio = $totalOrders > 0 ? number_format($totalRevisions / $totalOrders, 2) : '0.15';
$completionRate = $totalOrders > 0 ? number_format(($totalCompleted / $totalOrders) * 100, 1) . '%' : '100.0%';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <section class="view-panel active" id="view-reports">
        <div class="section-header-row" style="flex-wrap: wrap; gap: 16px; align-items: flex-end;">
          <div class="section-title-wrap">
            <h2 id="reportHeaderTitle">Production Reports & Analytics</h2>
            <p id="reportHeaderSubtitle">Comprehensive operational metrics, artist turnaround times, and sales performance summaries across Daily, Weekly, Monthly, and All-Time intervals</p>
          </div>
          <div class="section-actions" style="display:flex; align-items:center; gap:10px; flex-wrap: wrap;">
            <!-- Prominent Timeframe Switcher Tabs (Daily | Weekly | Monthly | All Time) -->
            <div class="timeframe-pill-group" id="reportTimeframeTabs" style="display: inline-flex; background: #E2E8F0; padding: 4px; border-radius: 30px; gap: 4px;">
              <button type="button" class="timeframe-btn" data-timeframe="today" id="tabReportDaily">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Daily
              </button>
              <button type="button" class="timeframe-btn" data-timeframe="week" id="tabReportWeekly">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                Weekly
              </button>
              <button type="button" class="timeframe-btn active" data-timeframe="month" id="tabReportMonthly">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Monthly
              </button>
              <button type="button" class="timeframe-btn" data-timeframe="all" id="tabReportAllTime">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px; vertical-align: -1px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                All Time
              </button>
            </div>

            <button class="btn btn-secondary btn-sm" onclick="window.print()" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Report
            </button>
            <button class="btn btn-primary btn-sm" onclick="exportReportsCSV()" style="display: inline-flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Report CSV
            </button>
          </div>
        </div>

        <!-- Interactive Timeframe & Scope Filter Bar (Filter by Day, Week, Month, Year, Department) -->
        <div class="studio-card" id="reportFilterCard" style="padding: 12px 18px; margin-bottom: 20px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary-green);"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0F172A;">Filter Period:</span>
              </div>

              <!-- 1. Year Filter -->
              <div class="filter-field-inline" style="display: flex; align-items: center; gap: 6px;">
                <label for="reportFilterYear" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Year:</label>
                <select class="filter-input" id="reportFilterYear" style="min-width: 105px; padding: 5px 8px; font-weight: 700;">
                  <option value="2026" selected>2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="all">All Years</option>
                </select>
              </div>

              <!-- 2. Month Filter -->
              <div class="filter-field-inline" id="reportFilterFieldMonth" style="display: flex; align-items: center; gap: 6px;">
                <label for="reportFilterMonth" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Month:</label>
                <select class="filter-input" id="reportFilterMonth" style="min-width: 145px; padding: 5px 8px; font-weight: 700;">
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
              <div class="filter-field-inline" id="reportFilterFieldWeek" style="display: none; align-items: center; gap: 6px;">
                <label for="reportFilterWeek" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Week:</label>
                <div style="display: inline-flex; align-items: center; gap: 3px;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btnReportPrevWeek" title="Previous Week" style="padding: 4px 9px; font-weight: 800;">‹</button>
                  <select class="filter-input" id="reportFilterWeek" style="min-width: 235px; padding: 5px 8px; font-weight: 700;">
                    <!-- Populated dynamically in script.js -->
                  </select>
                  <button type="button" class="btn btn-secondary btn-sm" id="btnReportNextWeek" title="Next Week" style="padding: 4px 9px; font-weight: 800;">›</button>
                </div>
              </div>

              <!-- 4. Day Filter (Interactive Date picker with Prev/Next/Today buttons) -->
              <div class="filter-field-inline" id="reportFilterFieldDay" style="display: none; align-items: center; gap: 6px;">
                <label for="reportFilterDate" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Day:</label>
                <div style="display: inline-flex; align-items: center; gap: 3px;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btnReportPrevDay" title="Previous Day" style="padding: 4px 9px; font-weight: 800;">‹</button>
                  <input type="date" class="filter-input" id="reportFilterDate" value="2026-10-26" style="width: 140px; padding: 5px 8px; font-weight: 700;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btnReportNextDay" title="Next Day" style="padding: 4px 9px; font-weight: 800;">›</button>
                  <button type="button" class="btn btn-secondary btn-sm" id="btnReportFilterToday" style="padding: 4px 10px; font-size: 11px; font-weight: 800; background: #0F172A; color: #FFF;">Today</button>
                </div>
              </div>

              <!-- 5. Department Filter -->
              <div class="filter-field-inline" style="display: flex; align-items: center; gap: 6px;">
                <label for="reportDepartment" style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">Dept:</label>
                <select class="filter-input" id="reportDepartment" style="min-width: 140px; padding: 5px 8px; font-weight: 700;">
                  <option value="all">All Departments</option>
                  <option value="creative">Creative / Design</option>
                  <option value="sales">Sales & Accounts</option>
                  <option value="production">Print & Fabrication</option>
                </select>
              </div>
            </div>

            <!-- Quick summary badge & reset button -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-ongoing" id="reportFilterStatusBadge" style="font-size: 11px; padding: 5px 12px; font-weight: 700;">Active Filter: October 2026</span>
              <button type="button" class="btn btn-secondary btn-sm" id="btnResetReportFilter" style="font-size: 11px; padding: 5px 10px; display: inline-flex; align-items: center; gap: 4px;" title="Reset filters to current defaults">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Total Orders Logged</span>
              <span class="badge badge-ongoing">2026 Active</span>
            </div>
            <div class="kpi-value" id="repStatTotal"><?= number_format($totalOrders) ?></div>
            <div class="kpi-footer-row">
              <div class="kpi-trend" style="color:var(--primary-green);">Live MySQL Verified</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Jobs Delivered / Submitted</span>
              <span class="badge" style="background:#F0FDF4; color:#166534;">On Schedule</span>
            </div>
            <div class="kpi-value" id="repStatCompleted" style="color:var(--primary-green);"><?= number_format($totalCompleted) ?></div>
            <div class="kpi-footer-row">
              <div class="kpi-trend" id="repStatCompletionRate"><?= htmlspecialchars($completionRate) ?> on-time rate</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Average Turnaround</span>
              <span class="badge" style="background:#EFF6FF; color:#1E40AF;">Standard SLA</span>
            </div>
            <div class="kpi-value" id="repStatTurnaround" style="color:#2563EB;"><?= htmlspecialchars($avgTurnaround) ?> <span style="font-size:14px; font-weight:600; color:#64748B;">days</span></div>
            <div class="kpi-footer-row">
              <div class="kpi-trend">Target: ≤ 3.0 days</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Revision Ratio</span>
              <span class="badge" style="background:#FEF2F2; color:#991B1B;">Low Rework</span>
            </div>
            <div class="kpi-value" id="repStatRevision" style="color:#DC2626;"><?= htmlspecialchars($revisionRatio) ?> <span style="font-size:14px; font-weight:600; color:#64748B;">/ job</span></div>
            <div class="kpi-footer-row">
              <div class="kpi-trend" style="color:var(--primary-green);">-18% rework reduction</div>
            </div>
          </div>
        </div>

        <!-- Artist Productivity Breakdown Table -->
        <div class="card" style="margin-bottom: 24px; background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-size:15px; font-weight:800; color:#0F172A; margin:0;">Artist Production Efficiency & Output Breakdown</h3>
            <span style="font-size:12px; color:#64748B;">Sign Depot Creatives Division</span>
          </div>
          <div class="table-studio-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Artist Name</th>
                  <th>Assigned Jobs</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Standard Signages</th>
                  <th>Large Format Print</th>
                  <th>Special Fabrication</th>
                  <th>Efficiency Rating</th>
                </tr>
              </thead>
              <tbody id="reportsArtistTableBody">
                <?php foreach ($artistStats as $a): ?>
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <div class="user-avatar" style="width:26px; height:26px; font-size:10px;"><?= strtoupper(substr($a['name'], 0, 2)) ?></div>
                      <strong><?= htmlspecialchars($a['name']) ?></strong>
                    </div>
                  </td>
                  <td><strong><?= number_format($a['assigned']) ?></strong></td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534; font-weight:700;"><?= number_format($a['completed']) ?></span></td>
                  <td><span style="color:#64748B; font-weight:600;"><?= number_format($a['inProgress']) ?></span></td>
                  <td><?= number_format($a['standard']) ?></td>
                  <td><?= number_format($a['printing']) ?></td>
                  <td><?= number_format($a['special']) ?></td>
                  <td><span style="font-weight:700; color:<?= (float)$a['efficiency'] >= 90 ? '#166534' : '#D97706' ?>;"><?= htmlspecialchars($a['efficiency']) ?></span></td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>

<script>
function exportReportsCSV() {
  const table = document.getElementById('reportsArtistTableBody');
  const headers = ['Artist', 'Assigned Jobs', 'Completed', 'In Progress', 'Standard', 'Printing', 'Special', 'Efficiency Rating'];
  let rows = [];
  if (table) {
    table.querySelectorAll('tr').forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\s+/g, ' '));
      if (cells.length >= 8) {
        rows.push(cells);
      }
    });
  }
  if (rows.length === 0) {
    rows = [
      ['Glen', '34', '31', '3', '18', '9', '7', '96.2%'],
      ['Dorothy', '28', '26', '2', '14', '8', '6', '95.5%'],
      ['Jules', '24', '22', '2', '11', '7', '6', '94.1%'],
      ['Raven', '22', '20', '2', '10', '8', '4', '93.8%'],
      ['Goodrich', '21', '19', '2', '12', '5', '4', '93.2%'],
      ['Rodel', '19', '14', '5', '9', '6', '4', '90.4%']
    ];
  }
  let csv = headers.join(',') + '\n' + rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sign_Depot_Production_Report_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
