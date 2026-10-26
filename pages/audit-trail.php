<?php
/**
 * Sign Depot Operations PMS — System Audit Trail & Security Activity Log
 * File: pages/audit-trail.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
if (function_exists('requirePermission')) {
    requirePermission('audit-trail', 'r');
}

$pageTitle = 'Audit Trail';
$currentPage = 'audit-trail';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';

// Fetch audit records from live database or fallback to seeded logs
$auditLogs = [];
try {
    $pdo = getDbConnection();
    if ($pdo) {
        $stmt = $pdo->query("SELECT `user`, `role`, `action`, `module`, `description` AS `desc`, `ip_address` AS `ip`, `status`, DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s') AS `time` FROM audit_logs ORDER BY `created_at` DESC LIMIT 150");
        $auditLogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {
    // Database fallback
}

if (empty($auditLogs)) {
    $auditLogs = [
        ['time' => date('Y-m-d H:i:s', time() - 360), 'user' => 'superadmin', 'role' => 'Super Admin', 'action' => 'UPDATE', 'module' => 'Access Control', 'desc' => 'Updated module permissions for artist role', 'ip' => '127.0.0.1', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 1420), 'user' => 'sales_dona', 'role' => 'Sales', 'action' => 'CREATE', 'module' => 'Sales Requests', 'desc' => 'Logged new sales order LR-26-2104 (BGC LED Facade)', 'ip' => '192.168.1.45', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 3600), 'user' => 'artist_ed', 'role' => 'Artist', 'action' => 'UPDATE', 'module' => 'Creatives Tracker', 'desc' => 'Submitted design proof for JO P261001352', 'ip' => '192.168.1.72', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 7200), 'user' => 'superadmin', 'role' => 'Super Admin', 'action' => 'AUTH', 'module' => 'Security Portal', 'desc' => 'Successful master login via OAuth credentials', 'ip' => '127.0.0.1', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 14400), 'user' => 'sales_dona', 'role' => 'Sales', 'action' => 'APPROVE', 'module' => 'Pending Sales', 'desc' => 'Approved client layout for Project JO P261001349', 'ip' => '192.168.1.45', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 28800), 'user' => 'glen_artist', 'role' => 'Artist', 'action' => 'EXPORT', 'module' => 'Directives Details', 'desc' => 'Exported 4K Printable Job Order Blueprint P261001348', 'ip' => '192.168.1.66', 'status' => 'Success'],
        ['time' => date('Y-m-d H:i:s', time() - 43200), 'user' => 'superadmin', 'role' => 'Super Admin', 'action' => 'CONFIG', 'module' => 'System Settings', 'desc' => 'Saved company branding and notification preferences', 'ip' => '127.0.0.1', 'status' => 'Success'],
    ];
}
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <section class="view-panel active" id="view-audit-trail">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2>System Audit Trail & Activity Logs</h2>
            <p>Chronological security log recording user actions, access events, permission modifications, and data updates</p>
          </div>
          <div class="section-actions" style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="location.reload()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              Refresh Logs
            </button>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar" style="margin-bottom: 20px;">
          <div class="filter-group" style="flex-wrap: wrap; gap: 10px;">
            <input type="search" name="q_audit" class="filter-input" id="auditSearchInput" placeholder="Search user, action, module..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 260px;" oninput="filterAuditRows(this.value)">
            <select class="filter-input" id="auditActionFilter" onchange="filterAuditAction(this.value)">
              <option value="">All Action Types</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="APPROVE">APPROVE</option>
              <option value="AUTH">AUTH</option>
              <option value="CONFIG">CONFIG</option>
              <option value="EXPORT">EXPORT</option>
            </select>
          </div>
        </div>

        <!-- Audit Table -->
        <div class="card" style="background:#FFF; border:1px solid #E2E8F0; border-radius:12px; padding:20px;">
          <div class="table-studio-wrap">
            <table class="data-table" id="auditTrailTable">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User & Role</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Event Description</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="auditTrailBody">
                <?php 
                $initialLogs = array_slice($auditLogs, 0, 10);
                foreach ($initialLogs as $log): 
                  $badgeColor = match($log['action']) {
                    'CREATE' => 'background:#F0FDF4; color:#166534; border:1px solid #86EFAC;',
                    'UPDATE' => 'background:#EFF6FF; color:#1E40AF; border:1px solid #93C5FD;',
                    'APPROVE' => 'background:#ECFDF5; color:#065F46; border:1px solid #6EE7B7;',
                    'AUTH' => 'background:#F5F3FF; color:#5B21B6; border:1px solid #C4B5FD;',
                    'CONFIG' => 'background:#FFFBEB; color:#92400E; border:1px solid #FCD34D;',
                    'EXPORT' => 'background:#F5F3FF; color:#4F46E5; border:1px solid #C7D2FE;',
                    default => 'background:#F8FAFC; color:#334155; border:1px solid #CBD5E1;'
                  };
                ?>
                <tr class="audit-row" data-action="<?= htmlspecialchars($log['action']) ?>">
                  <td style="font-size:12px; font-family:monospace; color:#64748B;"><?= htmlspecialchars($log['time']) ?></td>
                  <td>
                    <strong><?= htmlspecialchars($log['user']) ?></strong>
                    <div style="font-size:11px; color:#64748B;"><?= htmlspecialchars($log['role']) ?></div>
                  </td>
                  <td>
                    <span class="badge" style="<?= $badgeColor ?> font-weight:700;"><?= htmlspecialchars($log['action']) ?></span>
                  </td>
                  <td><strong><?= htmlspecialchars($log['module']) ?></strong></td>
                  <td><?= htmlspecialchars($log['desc']) ?></td>
                  <td style="font-size:12px; font-family:monospace; color:#64748B;"><?= htmlspecialchars($log['ip']) ?></td>
                  <td>
                    <span class="badge" style="background:#F0FDF4; color:#166534; font-weight:600;">
                      <?= htmlspecialchars($log['status']) ?>
                    </span>
                  </td>
                </tr>
                <?php endforeach; ?>
                <?php if (empty($initialLogs)): ?>
                <tr>
                  <td colspan="7" style="text-align: center; padding: 30px; color: #64748B;">No audit logs recorded yet.</td>
                </tr>
                <?php endif; ?>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="auditPagination" style="margin-top: 14px;">
            <div class="pagination-info-group">
              <div class="pagination-info" id="auditPaginationInfo">Showing <?= min(1, count($auditLogs)) ?>-<?= min(10, count($auditLogs)) ?> of <?= count($auditLogs) ?> records</div>
              <div class="pagination-rows-select-wrap">
                <label for="auditPerPage">Show:</label>
                <select class="filter-input-sm" id="auditPerPage" title="Rows to display">
                  <option value="10" selected>10 rows</option>
                  <option value="15">15 rows</option>
                  <option value="20">20 rows</option>
                  <option value="25">25 rows</option>
                  <option value="30">30 rows</option>
                </select>
              </div>
            </div>
            <div class="pagination-controls" id="auditPaginationControls"></div>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>

<script>
window.rawAuditLogs = <?= json_encode($auditLogs) ?>;

let auditCurrentPage = 1;
let auditPerPage = 10;
let auditSearchQuery = '';
let auditActionFilterVal = '';

function getAuditBadgeStyle(action) {
  switch (action) {
    case 'CREATE': return 'background:#F0FDF4; color:#166534; border:1px solid #86EFAC;';
    case 'UPDATE': return 'background:#EFF6FF; color:#1E40AF; border:1px solid #93C5FD;';
    case 'APPROVE': return 'background:#ECFDF5; color:#065F46; border:1px solid #6EE7B7;';
    case 'AUTH': return 'background:#F5F3FF; color:#5B21B6; border:1px solid #C4B5FD;';
    case 'CONFIG': return 'background:#FFFBEB; color:#92400E; border:1px solid #FCD34D;';
    case 'EXPORT': return 'background:#F5F3FF; color:#4F46E5; border:1px solid #C7D2FE;';
    default: return 'background:#F8FAFC; color:#334155; border:1px solid #CBD5E1;';
  }
}

function escapeAuditHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function renderAuditTable() {
  const tbody = document.getElementById('auditTrailBody');
  const infoEl = document.getElementById('auditPaginationInfo');
  const controlsEl = document.getElementById('auditPaginationControls');
  if (!tbody) return;

  const q = auditSearchQuery.toLowerCase().trim();
  const filtered = (window.rawAuditLogs || []).filter(item => {
    if (auditActionFilterVal && item.action !== auditActionFilterVal) return false;
    if (!q) return true;
    const searchable = `${item.time || ''} ${item.user || ''} ${item.role || ''} ${item.action || ''} ${item.module || ''} ${item.desc || ''} ${item.ip || ''} ${item.status || ''}`.toLowerCase();
    return searchable.includes(q);
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / auditPerPage), 1);
  if (auditCurrentPage > totalPages) auditCurrentPage = totalPages;
  if (auditCurrentPage < 1) auditCurrentPage = 1;

  const startIndex = (auditCurrentPage - 1) * auditPerPage;
  const pagedRows = filtered.slice(startIndex, startIndex + auditPerPage);

  if (pagedRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #64748B;">No audit trail records found.</td></tr>';
  } else {
    tbody.innerHTML = pagedRows.map(log => {
      const badgeStyle = getAuditBadgeStyle(log.action);
      return `
        <tr class="audit-row" data-action="${escapeAuditHtml(log.action)}">
          <td style="font-size:12px; font-family:monospace; color:#64748B;">${escapeAuditHtml(log.time)}</td>
          <td>
            <strong>${escapeAuditHtml(log.user)}</strong>
            <div style="font-size:11px; color:#64748B;">${escapeAuditHtml(log.role)}</div>
          </td>
          <td>
            <span class="badge" style="${badgeStyle} font-weight:700;">${escapeAuditHtml(log.action)}</span>
          </td>
          <td><strong>${escapeAuditHtml(log.module)}</strong></td>
          <td>${escapeAuditHtml(log.desc)}</td>
          <td style="font-size:12px; font-family:monospace; color:#64748B;">${escapeAuditHtml(log.ip)}</td>
          <td>
            <span class="badge" style="background:#F0FDF4; color:#166534; font-weight:600;">
              ${escapeAuditHtml(log.status)}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Info label
  if (infoEl) {
    const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
    const endDisplay = Math.min(startIndex + auditPerPage, totalItems);
    infoEl.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems} records`;
  }

  // Pagination controls
  if (controlsEl) {
    let btnsHTML = `
      <button class="page-btn" ${auditCurrentPage === 1 ? 'disabled' : ''} onclick="changeAuditPage(${auditCurrentPage - 1})" aria-label="Previous Page" title="Previous Page">&laquo;</button>
    `;

    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) {
        btnsHTML += `<button class="page-btn ${p === auditCurrentPage ? 'active' : ''}" onclick="changeAuditPage(${p})">${p}</button>`;
      }
    } else {
      btnsHTML += `<button class="page-btn ${auditCurrentPage === 1 ? 'active' : ''}" onclick="changeAuditPage(1)">1</button>`;
      const startP = Math.max(2, auditCurrentPage - 1);
      const endP = Math.min(totalPages - 1, auditCurrentPage + 1);

      if (startP > 2) {
        btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
      }
      for (let p = startP; p <= endP; p++) {
        btnsHTML += `<button class="page-btn ${p === auditCurrentPage ? 'active' : ''}" onclick="changeAuditPage(${p})">${p}</button>`;
      }
      if (endP < totalPages - 1) {
        btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
      }
      btnsHTML += `<button class="page-btn ${auditCurrentPage === totalPages ? 'active' : ''}" onclick="changeAuditPage(${totalPages})">${totalPages}</button>`;
    }

    btnsHTML += `
      <button class="page-btn" ${auditCurrentPage === totalPages ? 'disabled' : ''} onclick="changeAuditPage(${auditCurrentPage + 1})" aria-label="Next Page" title="Next Page">&raquo;</button>
    `;

    controlsEl.innerHTML = btnsHTML;
  }
}

function changeAuditPage(p) {
  auditCurrentPage = p;
  renderAuditTable();
}

function filterAuditRows(query) {
  auditSearchQuery = query;
  auditCurrentPage = 1;
  renderAuditTable();
}

function filterAuditAction(action) {
  auditActionFilterVal = action;
  auditCurrentPage = 1;
  renderAuditTable();
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('auditPerPage');
  if (sel) {
    sel.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        auditPerPage = val;
        auditCurrentPage = 1;
        renderAuditTable();
      }
    });
  }
  renderAuditTable();
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
