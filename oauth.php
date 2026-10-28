<?php
/**
 * Sign Depot Operations PMS — OAuth 2.0 (Google SSO) & Developer Auth Provider
 * File: oauth.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth.php';

$provider = $_GET['provider'] ?? 'google';
$action = $_GET['action'] ?? '';
$error = '';

// Handle linking/unlinking Google account for logged in user
if ($action === 'link') {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
    $currUser = getCurrentUser();
    $mockEmail = $_GET['email'] ?? ($currUser['email'] ?: 'google_user@signdepot.com');
    $mockId = 'goog_' . substr(md5($mockEmail), 0, 16);
    
    $pdo = getDbConnection();
    if ($pdo) {
        ensureSecurityTables();
        $stmt = $pdo->prepare("UPDATE users SET oauth_provider = 'google', oauth_id = :oid, google_email = :ge, email_verified = 1, email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = :id");
        $stmt->execute([':oid' => $mockId, ':ge' => $mockEmail, ':id' => (int)$currUser['id']]);
        $_SESSION['pms_user']['oauth_provider'] = 'google';
        logAuditEvent($currUser['username'], $currUser['role'], 'AUTH', 'Account Settings', 'Connected Google account: ' . $mockEmail, null, 'Success');
    }
    header('Location: pages/settings.php?tab=account&msg=google_linked');
    exit;
}

if ($action === 'unlink') {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
    $currUser = getCurrentUser();
    $pdo = getDbConnection();
    if ($pdo) {
        ensureSecurityTables();
        $stmt = $pdo->prepare("UPDATE users SET oauth_provider = 'credentials', oauth_id = NULL, google_email = NULL WHERE id = :id");
        $stmt->execute([':id' => (int)$currUser['id']]);
        $_SESSION['pms_user']['oauth_provider'] = 'credentials';
        logAuditEvent($currUser['username'], $currUser['role'], 'AUTH', 'Account Settings', 'Disconnected Google account', null, 'Success');
    }
    header('Location: pages/settings.php?tab=account&msg=google_unlinked');
    exit;
}

// 1. Google OAuth2 Flow
if ($provider === 'google') {
    $clientId = defined('GOOGLE_CLIENT_ID') ? GOOGLE_CLIENT_ID : '';
    $clientSecret = defined('GOOGLE_CLIENT_SECRET') ? GOOGLE_CLIENT_SECRET : '';
    $redirectUri = defined('GOOGLE_REDIRECT_URI') ? GOOGLE_REDIRECT_URI : 'http://localhost/PMS/PMS/oauth.php?provider=google';

    // If developer mode simulation was requested or credentials not configured
    if (isset($_GET['mock']) || (empty($clientId) && !isset($_GET['code']))) {
        // Developer SSO Simulation (Instantly tests OAuth flow locally)
        $mockEmail = $_GET['email'] ?? 'google_user@signdepot.com';
        $mockName = $_GET['name'] ?? 'Google Workspace User';
        $mockId = 'goog_' . substr(md5($mockEmail), 0, 16);
        $mockAvatar = 'https://ui-avatars.com/api/?name=' . urlencode($mockName) . '&background=176B55&color=fff&size=128';

        $res = loginOAuthUser('google', $mockId, $mockEmail, $mockName, $mockAvatar);
        if ($res['success']) {
            header('Location: index.php');
            exit;
        } else {
            die('OAuth Error: ' . htmlspecialchars($res['error']));
        }
    }

    // Real Google OAuth Redirect to Google Auth endpoint
    if (!isset($_GET['code'])) {
        $state = bin2hex(random_bytes(16));
        $_SESSION['oauth_state'] = $state;

        $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            'access_type' => 'offline',
            'prompt' => 'select_account'
        ]);

        header('Location: ' . $authUrl);
        exit;
    } else {
        // Callback with authorization code
        $code = $_GET['code'];
        $state = $_GET['state'] ?? '';

        if (empty($_SESSION['oauth_state']) || $state !== $_SESSION['oauth_state']) {
            die('Invalid OAuth state parameter. Please try again.');
        }
        unset($_SESSION['oauth_state']);

        // Exchange code for access token via cURL
        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code'
        ]));
        $response = curl_exec($ch);
        curl_close($ch);

        $tokenData = json_decode($response, true);
        if (empty($tokenData['access_token'])) {
            die('Failed to obtain Google access token: ' . htmlspecialchars($response));
        }

        // Fetch user info with access token
        $ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $tokenData['access_token']
        ]);
        $userInfoRaw = curl_exec($ch);
        curl_close($ch);

        $userInfo = json_decode($userInfoRaw, true);
        if (empty($userInfo['email'])) {
            die('Failed to retrieve user profile from Google: ' . htmlspecialchars($userInfoRaw));
        }

        $res = loginOAuthUser(
            'google',
            $userInfo['sub'] ?? ('goog_' . md5($userInfo['email'])),
            $userInfo['email'],
            $userInfo['name'] ?? $userInfo['email'],
            $userInfo['picture'] ?? null
        );

        if ($res['success']) {
            header('Location: index.php');
            exit;
        } else {
            die('Login failed: ' . htmlspecialchars($res['error']));
        }
    }
}

// Fallback
header('Location: login.php');
exit;
