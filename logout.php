<?php
/**
 * Sign Depot Operations PMS — Logout Handler
 * File: logout.php
 */

require_once __DIR__ . '/includes/auth.php';

// Completely destroy session and user data
logoutUser();

// Expire the session cookie in browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 86400,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Redirect cleanly to login portal
header('Location: login.php?msg=logged_out');
exit;

