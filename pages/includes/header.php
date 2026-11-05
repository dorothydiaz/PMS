<?php
/**
 * Sign Depot Operations PMS — Shared Header
 * Location: pages/includes/header.php
 */
require_once dirname(__DIR__, 2) . '/includes/auth.php';

// Enforce authentication on all protected pages
requireLogin();

$base = function_exists('getBasePath') ? getBasePath() : '../';
$pageTitle = $pageTitle ?? 'Operations PMS';
$currentPage = $currentPage ?? 'dashboard';

// Enforce module read permission
if ($currentPage !== 'login') {
    requirePermission($currentPage, 'r');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?> — Sign Depot Operations PMS</title>
  <meta name="description" content="Sign Depot modern enterprise PMS with live editable tables, production dashboard, artist workload, and printable job directives.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;0,900;1,700;1,900&family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="<?= $base ?>assets/css/style.css?v=<?= time() ?>">
  <link rel="icon" type="image/svg+xml" href="<?= $base ?>assets/img/favicon.svg?v=2">
  <link rel="shortcut icon" href="<?= $base ?>assets/img/favicon.svg?v=2">
  <script src="<?= $base ?>assets/js/image-cropper.js?v=<?= time() ?>"></script>
</head>
<body data-page="view-<?= htmlspecialchars($currentPage) ?>" class="<?= in_array($currentPage, ['sales-requests', 'creatives-tracker', 'creatives-production']) ? 'layout-table-fit' : '' ?>">
  <div class="app-container">
