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
  <link rel="stylesheet" href="<?= $base ?>assets/css/style.css?v=<?= time() ?>">
  <link rel="icon" type="image/png" href="<?= $base ?>assets/img/sign-depot-logo.png">
</head>
<body data-page="view-<?= htmlspecialchars($currentPage) ?>">
  <div class="app-container">
