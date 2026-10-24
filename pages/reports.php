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
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <section class="view-panel active" id="view-reports">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2>Production Reports & Analytics</h2>
            <p>Comprehensive operational metrics, artist turnaround times, and sales performance summaries</p>
          </div>
          <div class="section-actions" style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Report
            </button>
            <button class="btn btn-primary btn-sm" onclick="exportReportsCSV()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Report CSV
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar" style="margin-bottom: 20px;">
          <div class="filter-group" style="flex-wrap: wrap; gap: 10px;">
            <select class="filter-input" id="reportTimeframe">
              <option value="ytd">Year to Date (2026)</option>
              <option value="month" selected>This Month (October 2026)</option>
              <option value="q3">Q3 2026 (Jul - Sep)</option>
              <option value="q2">Q2 2026 (Apr - Jun)</option>
              <option value="q1">Q1 2026 (Jan - Mar)</option>
            </select>
            <select class="filter-input" id="reportDepartment">
              <option value="all">All Departments</option>
              <option value="creative">Creative / Design</option>
              <option value="sales">Sales & Accounts</option>
              <option value="production">Print & Fabrication</option>
            </select>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Total Orders Logged</span>
              <span class="badge badge-ongoing">2026 Active</span>
            </div>
            <div class="kpi-value" id="repStatTotal">148</div>
            <div class="kpi-footer-row">
              <div class="kpi-trend" style="color:var(--primary-green);">+12.4% vs last month</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Jobs Delivered / Submitted</span>
              <span class="badge" style="background:#F0FDF4; color:#166534;">On Schedule</span>
            </div>
            <div class="kpi-value" id="repStatCompleted" style="color:var(--primary-green);">132</div>
            <div class="kpi-footer-row">
              <div class="kpi-trend">94.8% on-time rate</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Average Turnaround</span>
              <span class="badge" style="background:#EFF6FF; color:#1E40AF;">Standard SLA</span>
            </div>
            <div class="kpi-value" style="color:#2563EB;">2.4 <span style="font-size:14px; font-weight:600; color:#64748B;">days</span></div>
            <div class="kpi-footer-row">
              <div class="kpi-trend">Target: ≤ 3.0 days</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-header">
              <span>Revision Ratio</span>
              <span class="badge" style="background:#FEF2F2; color:#991B1B;">Low Rework</span>
            </div>
            <div class="kpi-value" style="color:#DC2626;">0.38 <span style="font-size:14px; font-weight:600; color:#64748B;">/ job</span></div>
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
                <tr>
                  <td><strong>Glen</strong></td>
                  <td>34</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">31</span></td>
                  <td>3</td>
                  <td>18</td>
                  <td>9</td>
                  <td>7</td>
                  <td><span style="font-weight:700; color:#166534;">96.2%</span></td>
                </tr>
                <tr>
                  <td><strong>Edrian</strong></td>
                  <td>28</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">26</span></td>
                  <td>2</td>
                  <td>14</td>
                  <td>8</td>
                  <td>6</td>
                  <td><span style="font-weight:700; color:#166534;">95.5%</span></td>
                </tr>
                <tr>
                  <td><strong>Jules</strong></td>
                  <td>24</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">22</span></td>
                  <td>2</td>
                  <td>11</td>
                  <td>7</td>
                  <td>6</td>
                  <td><span style="font-weight:700; color:#166534;">94.1%</span></td>
                </tr>
                <tr>
                  <td><strong>Raven</strong></td>
                  <td>22</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">20</span></td>
                  <td>2</td>
                  <td>10</td>
                  <td>8</td>
                  <td>4</td>
                  <td><span style="font-weight:700; color:#166534;">93.8%</span></td>
                </tr>
                <tr>
                  <td><strong>Goodrich</strong></td>
                  <td>21</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">19</span></td>
                  <td>2</td>
                  <td>12</td>
                  <td>5</td>
                  <td>4</td>
                  <td><span style="font-weight:700; color:#166534;">93.2%</span></td>
                </tr>
                <tr>
                  <td><strong>Rodel</strong></td>
                  <td>19</td>
                  <td><span class="badge" style="background:#F0FDF4; color:#166534;">14</span></td>
                  <td>5</td>
                  <td>9</td>
                  <td>6</td>
                  <td>4</td>
                  <td><span style="font-weight:700; color:#D97706;">90.4%</span></td>
                </tr>
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
  const headers = ['Artist', 'Assigned Jobs', 'Completed', 'In Progress', 'Standard', 'Printing', 'Special', 'Efficiency Rating'];
  const rows = [
    ['Glen', '34', '31', '3', '18', '9', '7', '96.2%'],
    ['Edrian', '28', '26', '2', '14', '8', '6', '95.5%'],
    ['Jules', '24', '22', '2', '11', '7', '6', '94.1%'],
    ['Raven', '22', '20', '2', '10', '8', '4', '93.8%'],
    ['Goodrich', '21', '19', '2', '12', '5', '4', '93.2%'],
    ['Rodel', '19', '14', '5', '9', '6', '4', '90.4%']
  ];
  let csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
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
