<?php
/**
 * Sign Depot Operations PMS — Logout Handler
 * File: logout.php
 */

require_once __DIR__ . '/includes/auth.php';
logoutUser();
header('Location: login.php?msg=logged_out');
exit;
