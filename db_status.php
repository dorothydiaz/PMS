<?php
/**
 * Sign Depot Operations PMS — Web Hosting Database Diagnostics & Setup
 * File: db_status.php
 * Run this in your browser to verify database connection and auto-initialize tables on web hosting
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$importResult = null;

// Handle manual 1-click schema import
if ($action === 'import_schema' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    try {
        $pdo = getDbConnection();
        if (!$pdo) {
            $importResult = ['success' => false, 'error' => 'Cannot import: Database connection failed.'];
        } else {
            $schemaFile = __DIR__ . '/database/schema.sql';
            if (!file_exists($schemaFile)) {
                $importResult = ['success' => false, 'error' => 'schema.sql file not found in /database folder.'];
            } else {
                $sql = file_get_contents($schemaFile);
                $pdo->exec($sql);
                $importResult = ['success' => true, 'message' => 'Database tables and records imported successfully!'];
            }
        }
    } catch (Exception $e) {
        $importResult = ['success' => false, 'error' => $e->getMessage()];
    }
}

$connError = null;
$tableStats = [];
$totalRows = 0;
$pdo = null;

try {
    $pdo = getDbConnection();
} catch (Exception $e) {
    $connError = $e->getMessage();
}

if ($pdo) {
    $tables = ['sales_requests', 'users', 'artists', 'sales_reps', 'directives', 'audit_logs', 'system_settings'];
    foreach ($tables as $t) {
        try {
            $count = (int)$pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
            $tableStats[$t] = ['exists' => true, 'rows' => $count];
            if ($t === 'sales_requests') $totalRows = $count;
        } catch (Exception $e) {
            $tableStats[$t] = ['exists' => false, 'rows' => 0];
        }
    }
} else {
    $connError = $GLOBALS['PMS_DB_ERROR'] ?? 'Could not establish connection to MySQL.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Database Diagnostics — Sign Depot PMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Archivo:wght@700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    body {
      background: #0F1014;
      color: #E2E8F0;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 40px 20px;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .diag-card {
      background: #18191E;
      border: 1px solid #282A32;
      border-radius: 14px;
      max-width: 680px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 20px 48px rgba(0,0,0,0.6);
    }
    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-ok { background: #064E3B; color: #34D399; border: 1px solid #059669; }
    .badge-err { background: #450A0A; color: #F87171; border: 1px solid #DC2626; }
    .grid-kv {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 8px 16px;
      background: #111216;
      border: 1px solid #282A32;
      border-radius: 10px;
      padding: 16px;
      font-size: 13px;
      margin: 16px 0;
    }
    .grid-kv strong { color: #94A3B8; }
    .grid-kv code { color: #F8FAFC; font-family: monospace; font-size: 12.5px; }
    .table-list {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12.5px;
    }
    .table-list th, .table-list td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #282A32;
    }
    .table-list th { color: #94A3B8; font-weight: 600; }
    .help-box {
      background: rgba(230, 0, 0, 0.08);
      border: 1px solid rgba(230, 0, 0, 0.25);
      border-radius: 10px;
      padding: 16px;
      margin-top: 20px;
      font-size: 12.5px;
      line-height: 1.5;
      color: #F8FAFC;
    }
  </style>
</head>
<body>

  <div class="diag-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <h2 style="margin:0; font-size:20px; font-weight:800; color:#FFF;">Sign Depot PMS — Database Diagnostics</h2>
        <p style="margin:4px 0 0 0; font-size:12px; color:#94A3B8;">Web Hosting Connection & Table Verification Tool</p>
      </div>
      <div>
        <?php if ($pdo): ?>
          <span class="badge-status badge-ok">✓ Connected to MySQL</span>
        <?php else: ?>
          <span class="badge-status badge-err">✕ Connection Failed</span>
        <?php endif; ?>
      </div>
    </div>

    <?php if ($importResult): ?>
      <div style="padding:12px 16px; border-radius:8px; margin-bottom:16px; font-size:13px; font-weight:600; <?= $importResult['success'] ? 'background:#064E3B; color:#34D399; border:1px solid #059669;' : 'background:#450A0A; color:#F87171; border:1px solid #DC2626;' ?>">
        <?= htmlspecialchars($importResult['message'] ?? $importResult['error']) ?>
      </div>
    <?php endif; ?>

    <!-- Config Values Display -->
    <div class="grid-kv">
      <strong>Host:</strong> <code><?= htmlspecialchars(DB_HOST) ?></code>
      <strong>Database:</strong> <code><?= htmlspecialchars(DB_NAME) ?></code>
      <strong>User:</strong> <code><?= htmlspecialchars(DB_USER) ?></code>
      <strong>Password:</strong> <code><?= empty(DB_PASS) ? '<span style="color:#F87171;">(empty password)</span>' : '********' ?></code>
      <strong>PHP Version:</strong> <code><?= phpversion() ?></code>
    </div>

    <?php if (!$pdo): ?>
      <!-- Connection Failure Section -->
      <div style="background:#2A1215; border:1px solid #7F1D1D; border-radius:10px; padding:16px; margin-bottom:18px;">
        <h3 style="margin:0 0 8px 0; font-size:14px; color:#FCA5A5;">MySQL Error Details:</h3>
        <code style="color:#FECACA; font-size:12px; line-height:1.4; display:block; word-break:break-word;"><?= htmlspecialchars($connError) ?></code>
      </div>

      <div class="help-box">
        <h3 style="margin:0 0 8px 0; color:#E60000; font-size:14px;">How to Fix on Your Web Hosting (e.g. InfinityFree / cPanel):</h3>
        <ol style="margin:0; padding-left:18px; line-height:1.6;">
          <li>Log in to your web hosting control panel (vPanel / cPanel).</li>
          <li>Go to <strong>MySQL Databases</strong> and find your MySQL details:
            <ul>
              <li><strong>MySQL Hostname:</strong> (e.g. <code>sql300.infinityfree.com</code> — <em>not</em> localhost!)</li>
              <li><strong>MySQL Database Name:</strong> (e.g. <code>if0_38123456_pms_db</code>)</li>
              <li><strong>MySQL Username:</strong> (e.g. <code>if0_38123456</code> — <em>not</em> root!)</li>
              <li><strong>MySQL Password:</strong> (Your hosting account password)</li>
            </ul>
          </li>
          <li>Open <code>config.php</code> via File Manager or FTP on your hosting and replace lines 11-15 with your actual hosting values:
            <pre style="background:#0F1014; padding:10px; border-radius:6px; color:#38BDF8; font-size:11px; margin:8px 0;">define('DB_HOST', 'sqlXXX.infinityfree.com'); // Your MySQL host
define('DB_NAME', 'if0_XXXXXXXX_pms_db');      // Your database name
define('DB_USER', 'if0_XXXXXXXX');             // Your database user
define('DB_PASS', 'YourPasswordHere');         // Your account password</pre>
          </li>
          <li>Save <code>config.php</code> and refresh this page.</li>
        </ol>
      </div>

    <?php else: ?>
      <!-- Connection Success Section -->
      <h3 style="font-size:14px; margin:20px 0 10px 0; color:#FFF;">Database Tables Overview</h3>
      <table class="table-list">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Status</th>
            <th>Record Count</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($tableStats as $tbl => $info): ?>
          <tr>
            <td><code><?= htmlspecialchars($tbl) ?></code></td>
            <td>
              <?php if ($info['exists']): ?>
                <span style="color:#34D399; font-weight:600;">✓ Ready</span>
              <?php else: ?>
                <span style="color:#F87171; font-weight:600;">✕ Missing</span>
              <?php endif; ?>
            </td>
            <td><strong><?= number_format($info['rows']) ?></strong> rows</td>
          </tr>
          <?php endforeach; ?>
        </tbody>
      </table>

      <?php if ($totalRows === 0): ?>
        <div class="help-box" style="margin-top:20px;">
          <h3 style="margin:0 0 6px 0; color:#E60000; font-size:14px;">Database is Connected, but Tables Are Empty!</h3>
          <p style="margin:0 0 14px 0; font-size:12px; color:#94A3B8;">
            Click the button below to auto-import all PMS tables, 2,108 production requests, artists, sales reps, and demo user accounts from <code>database/schema.sql</code>.
          </p>
          <form method="POST">
            <input type="hidden" name="action" value="import_schema">
            <button type="submit" class="btn btn-primary" style="background:#E60000; border:none; padding:10px 20px; font-weight:700; border-radius:8px; cursor:pointer;">
              ⚡ 1-Click Import Database Tables & Data
            </button>
          </form>
        </div>
      <?php else: ?>
        <div style="margin-top:20px; padding:14px; background:#064E3B; border:1px solid #059669; border-radius:8px; font-size:13px; color:#34D399; display:flex; justify-content:space-between; align-items:center;">
          <span>✓ Database is fully populated with <strong><?= number_format($totalRows) ?></strong> project records!</span>
          <a href="index.php" class="btn btn-sm" style="background:#34D399; color:#064E3B; font-weight:700; text-decoration:none; padding:6px 14px; border-radius:6px;">Go to Dashboard &rarr;</a>
        </div>
      <?php endif; ?>

    <?php endif; ?>

    <div style="margin-top:24px; text-align:center; font-size:12px; color:#64748B;">
      <a href="index.php" style="color:#94A3B8; text-decoration:none;">&larr; Return to Dashboard</a>
      &bull;
      <a href="login.php" style="color:#94A3B8; text-decoration:none;">Go to Login</a>
    </div>
  </div>

</body>
</html>

