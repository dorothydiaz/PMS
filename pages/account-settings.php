<?php
/**
 * Sign Depot™ Operations PMS — Account Settings Redirect
 * Forwards to unified Settings & Account portal
 */
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('account-settings', 'r');

$msg = $_GET['msg'] ?? '';
$loc = 'settings.php?tab=account' . (!empty($msg) ? '&msg=' . urlencode($msg) : '');
header('Location: ' . $loc);
exit;
