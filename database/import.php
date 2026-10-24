<?php
/**
 * Sign Depot Operations PMS — Database Installer & Importer
 * Executes schema.sql (seeded from sales_requests.html) into MySQL
 */

require_once dirname(__DIR__) . '/config.php';

$message = '';
$status = 'info';

if (isset($_POST['reimport']) || php_sapi_name() === 'cli') {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);

        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `" . DB_NAME . "`");

        $sqlFile = __DIR__ . '/schema.sql';
        if (!file_exists($sqlFile)) {
            throw new Exception("schema.sql not found at " . $sqlFile);
        }

        $sql = file_get_contents($sqlFile);
        // Strip UTF-8 BOM if present
        $sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);
        
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
        $pdo->exec($sql);

        // Verify count
        $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests");
        $count = (int)$stmt->fetchColumn();

        $message = "Database `pms_db` initialized successfully! Imported $count sales requests directly from sales_requests.html.";
        $status = 'success';

        if (php_sapi_name() === 'cli') {
            echo "[SUCCESS] $message\n";
            exit(0);
        }
    } catch (Exception $e) {
        $message = "Import error: " . $e->getMessage();
        $status = 'error';
        if (php_sapi_name() === 'cli') {
            echo "[ERROR] $message\n";
            exit(1);
        }
    }
} else {
    // Check current DB status
    try {
        $pdo = getDbConnection();
        if ($pdo) {
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests");
            $count = (int)$stmt->fetchColumn();
            $message = "Database is connected! Current live sales requests count in MySQL: $count records.";
            $status = 'success';
        } else {
            $message = "Could not connect to database. Click 'Initialize Database' below.";
            $status = 'warning';
        }
    } catch (Exception $e) {
        $message = "Database status check: " . $e->getMessage();
        $status = 'warning';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PMS Database Manager — Sign Depot</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <style>
    body { background: #0b1120; color: #f8fafc; font-family: 'Inter', system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 600px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { margin-top: 0; font-size: 22px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
    .alert { padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; line-height: 1.5; }
    .alert-success { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #86efac; }
    .alert-warning { background: rgba(234, 179, 8, 0.15); border: 1px solid #eab308; color: #fde047; }
    .alert-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; text-decoration: none; transition: 0.2s; }
    .btn-primary { background: #3b82f6; color: #ffffff; }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary { background: #334155; color: #e2e8f0; margin-left: 10px; }
    .btn-secondary:hover { background: #475569; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
    .stat-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; text-align: center; }
    .stat-val { font-size: 20px; font-weight: 700; color: #f8fafc; }
    .stat-lbl { font-size: 11px; text-transform: uppercase; color: #94a3b8; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
      PMS Database Manager
    </h1>
    <p style="color: #94a3b8; font-size: 14px;">MySQL Database: <code style="color: #38bdf8;"><?= DB_NAME ?></code> on <code style="color: #38bdf8;"><?= DB_HOST ?>:<?= DB_PORT ?></code></p>
    
    <div class="alert alert-<?= $status ?>">
      <?= htmlspecialchars($message) ?>
    </div>

    <form method="POST" style="margin-top: 24px;">
      <button type="submit" name="reimport" value="1" class="btn btn-primary" onclick="return confirm('Re-importing will reset the table with all 2,100+ records from sales_requests.html. Continue?');">
        Re-Import From sales_requests.html
      </button>
      <a href="../index.php" class="btn btn-secondary">Open PMS Dashboard &rarr;</a>
    </form>
  </div>
</body>
</html>
