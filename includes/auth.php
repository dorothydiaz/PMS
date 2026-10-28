<?php
/**
 * Sign Depot Operations PMS — Authentication & RBAC Engine
 * File: includes/auth.php
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(__DIR__) . '/config.php';

/**
 * Returns available system modules and their human-readable labels
 */
function getSystemModules() {
    return [
        'dashboard' => [
            'label' => 'Project Dashboard',
            'icon' => 'grid',
            'desc' => 'Live operations KPIs, overview charts, producer leaderboard'
        ],
        'sales-requests' => [
            'label' => 'Sales Requests',
            'icon' => 'file-text',
            'desc' => 'Order intake, multi-field filters, and manual JO number entry'
        ],
        'creatives-tracker' => [
            'label' => 'Creatives Tracker',
            'icon' => 'table',
            'desc' => 'Google Sheets replica with inline status editing and Std/Prt/Spc'
        ],
        'artist-workload' => [
            'label' => 'Artist Workload',
            'icon' => 'users',
            'desc' => 'Capacity balancing thresholds and active artist task assignments'
        ],
        'directives-details' => [
            'label' => 'Directives Details',
            'icon' => 'printer',
            'desc' => 'Job order spec sheet with 4K image export & template designer'
        ],
        'monthly-output' => [
            'label' => 'Monthly Output',
            'icon' => 'bar-chart-2',
            'desc' => 'Completed artist assignment counting matrix and annual metrics'
        ],
        'reports' => [
            'label' => 'Reports & Analytics',
            'icon' => 'file-text',
            'desc' => 'Production summary reports, turnaround metrics, and operational performance'
        ],
        'access-control' => [
            'label' => 'Access Control (Users)',
            'icon' => 'shield',
            'desc' => 'Super Admin module access and granular CRUD permissions control'
        ],
        'audit-trail' => [
            'label' => 'Audit Trail',
            'icon' => 'activity',
            'desc' => 'Security audit log, user activity history, and system modification tracking'
        ],
        'settings' => [
            'label' => 'System Settings',
            'icon' => 'settings',
            'desc' => 'Rosters management, JSON backups, and system reset tools'
        ]
    ];
}

/**
 * Check if current visitor is authenticated
 */
function isLoggedIn() {
    return !empty($_SESSION['pms_user']) && !empty($_SESSION['pms_user']['id']);
}

/**
 * Get current logged in user array or null
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    static $cachedFreshUser = null;
    $userId = $_SESSION['pms_user']['id'] ?? 0;
    if ($cachedFreshUser !== null && ($cachedFreshUser['id'] ?? 0) === $userId) {
        return $cachedFreshUser;
    }
    if ($userId > 0 && function_exists('getDbConnection')) {
        try {
            $pdo = getDbConnection();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, assigned_artist, status, permissions, oauth_provider, avatar_url FROM users WHERE id = ? LIMIT 1");
                $stmt->execute([$userId]);
                $fresh = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($fresh && $fresh['status'] === 'active') {
                    $perms = [];
                    if (!empty($fresh['permissions'])) {
                        $perms = is_array($fresh['permissions']) ? $fresh['permissions'] : (json_decode($fresh['permissions'], true) ?: []);
                    }
                    $_SESSION['pms_user']['role'] = $fresh['role'];
                    $_SESSION['pms_user']['assigned_artist'] = $fresh['assigned_artist'];
                    $_SESSION['pms_user']['full_name'] = $fresh['full_name'];
                    $_SESSION['pms_user']['permissions'] = $perms;
                    $cachedFreshUser = $_SESSION['pms_user'];
                    return $cachedFreshUser;
                }
            }
        } catch (Exception $e) {
            // fallback to session
        }
    }
    $cachedFreshUser = $_SESSION['pms_user'];
    return $cachedFreshUser;
}

/**
 * Require login on protected views
 */
function requireLogin() {
    if (!isLoggedIn()) {
        $base = function_exists('getBasePath') ? getBasePath() : './';
        $currentUrl = $_SERVER['REQUEST_URI'] ?? '';
        header('Location: ' . $base . 'login.php?redirect=' . urlencode($currentUrl));
        exit;
    }
    // Check if current session has been revoked from another device
    if (function_exists('checkUserSessionRevoked') && checkUserSessionRevoked()) {
        logoutUser();
        $base = function_exists('getBasePath') ? getBasePath() : './';
        header('Location: ' . $base . 'login.php?msg=session_revoked');
        exit;
    }
}

/**
 * Check if the user is a super admin (bypasses all permission checks)
 */
function isSuperAdmin() {
    $user = getCurrentUser();
    return $user && ($user['role'] === 'super_admin');
}

/**
 * Granular Permission Check for any module and CRUD action
 * $action: 'c' (create), 'r' (read/view), 'u' (update/edit), 'd' (delete)
 */
function hasPermission($module, $action = 'r') {
    if (!isLoggedIn()) {
        return false;
    }
    
    $user = getCurrentUser();
    if (!$user) {
        return false;
    }
    if ($user['role'] === 'super_admin') {
        return true;
    }

    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) {
        $perms = json_decode($perms, true) ?: [];
    }

    if (!isset($perms[$module])) {
        return false;
    }

    $action = strtolower($action);
    return !empty($perms[$module][$action]);
}

/**
 * Check if the user is allowed to access a specific tab within a module/table
 */
function hasTabPermission($module, $tab) {
    if (!isLoggedIn()) return false;
    if (isSuperAdmin()) return true;
    $user = getCurrentUser();
    if (!$user) return false;
    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) $perms = json_decode($perms, true) ?: [];

    // Check if module read permission is granted
    if (empty($perms[$module]['r'])) return false;

    // Check tab permission if defined
    if (isset($perms[$module]['tabs'][$tab])) {
        return !empty($perms[$module]['tabs'][$tab]);
    }
    return true; // Default to allow if not explicitly restricted
}

/**
 * Check if the user is allowed to edit a specific column/field on a table
 */
function canUserEditField($user, $field, $module = null) {
    if (empty($user)) return false;
    if (($user['role'] ?? '') === 'super_admin') return true;

    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) $perms = json_decode($perms, true) ?: [];

    // Normalize field name to camelCase or SQL column
    $fieldMap = [
        'request_id' => 'requestId', 'jo_number' => 'joNumber', 'order_date' => 'orderDate',
        'sales_rep' => 'salesRep', 'project_name' => 'projectName', 'design_deadline' => 'designDeadline',
        'releasing_date' => 'releasingDate', 'file_sent' => 'fileSent', 'complete_address' => 'completeAddress',
        'releasing_mode' => 'releasingMode', 'contact_person' => 'contactPerson', 'contact_number' => 'contactNumber',
        'project_status' => 'projectStatus', 'client_approval' => 'clientApproval', 'head_approval' => 'headApproval',
        'count_standard' => 'countStandard', 'count_special' => 'countSpecial', 'count_printing' => 'countPrinting',
        'design_status' => 'designStatus', 'revision_count' => 'revisionCount', 'remarks' => 'remarks',
        'client' => 'client', 'location' => 'location'
    ];
    $normField = $fieldMap[$field] ?? $field;

    // If module not provided, check across known editable tables
    $modulesToCheck = $module ? [$module] : ['sales-requests', 'creatives-tracker', 'artist-workload', 'directives-details', 'dashboard'];

    foreach ($modulesToCheck as $mod) {
        if (!empty($perms[$mod]['u'])) {
            $editableCols = $perms[$mod]['editable_columns'] ?? null;
            // If editable_columns is not set, empty, or includes '*', all columns can be edited
            if ($editableCols === null || $editableCols === '*' || (is_array($editableCols) && (empty($editableCols) || in_array('*', $editableCols)))) {
                return true;
            }
            if (is_array($editableCols) && (in_array($normField, $editableCols) || in_array($field, $editableCols))) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Returns array of editable columns for a module for the current user (or '*' for all)
 */
function getEditableColumnsForUser($user, $module) {
    if (empty($user)) return [];
    if (($user['role'] ?? '') === 'super_admin') return ['*'];

    $perms = $user['permissions'] ?? [];
    if (is_string($perms)) $perms = json_decode($perms, true) ?: [];

    if (empty($perms[$module]['u'])) return [];
    $cols = $perms[$module]['editable_columns'] ?? null;
    if ($cols === null || $cols === '*' || (is_array($cols) && (empty($cols) || in_array('*', $cols)))) {
        return ['*'];
    }
    return (array)$cols;
}

/**
 * Enforce permission or show access denied screen
 */
function requirePermission($module, $action = 'r') {
    requireLogin();
    if (!hasPermission($module, $action)) {
        renderAccessDenied($module, $action);
        exit;
    }
}

/**
 * Render elegant 403 Access Denied template
 */
function renderAccessDenied($module, $action = 'r') {
    $base = function_exists('getBasePath') ? getBasePath() : './';
    $modules = getSystemModules();
    $modName = $modules[$module]['label'] ?? ucfirst($module);
    $actionMap = ['c' => 'Create', 'r' => 'View/Access', 'u' => 'Edit/Update', 'd' => 'Delete'];
    $actName = $actionMap[$action] ?? strtoupper($action);
    $user = getCurrentUser();

    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>403 Access Denied — <?= htmlspecialchars(APP_NAME) ?></title>
      <link rel="stylesheet" href="<?= $base ?>assets/css/style.css">
      <style>
        .denied-wrapper {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }
        .denied-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 44px 36px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 45px rgba(0,0,0,0.08);
        }
        .denied-icon {
          width: 64px;
          height: 64px;
          background: #FEF2F2;
          color: #DC2626;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .denied-title {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 10px;
        }
        .denied-msg {
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .denied-badge {
          display: inline-block;
          background: #F1F5F9;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
        }
      </style>
    </head>
    <body style="background: #F8FAFC;">
      <div class="denied-wrapper">
        <div class="denied-card">
          <div class="denied-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
          </div>
          <h1 class="denied-title">Access Restricted</h1>
          <p class="denied-msg">
            Your account <strong><?= htmlspecialchars($user['email'] ?? 'User') ?></strong> does not have <strong><?= htmlspecialchars($actName) ?></strong> privileges for <strong><?= htmlspecialchars($modName) ?></strong>.
          </p>
          <div class="denied-badge">Role: <?= htmlspecialchars(ucfirst(str_replace('_', ' ', $user['role'] ?? 'user'))) ?></div>
          <div>
            <a href="<?= $base ?>index.php" class="btn btn-primary" style="text-decoration: none;">Return to Dashboard</a>
            <a href="<?= $base ?>logout.php" class="btn btn-secondary" style="text-decoration: none; margin-left: 8px;">Switch Account</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    <?php
    exit;
}

/**
 * Standard Username/Email & Password Login Handler
 */
function loginUser($usernameOrEmail, $password, $totpCode = null) {
    $pdo = getDbConnection();
    if (!$pdo) {
        return ['success' => false, 'error' => 'Database connection unavailable'];
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE (username = :u OR email = :e) LIMIT 1");
    $uVal = trim($usernameOrEmail);
    $stmt->execute([':u' => $uVal, ':e' => $uVal]);
    $user = $stmt->fetch();

    if (!$user) {
        return ['success' => false, 'error' => 'Invalid username or password'];
    }

    if ($user['status'] !== 'active') {
        return ['success' => false, 'error' => 'Your account has been deactivated. Please contact Super Admin.'];
    }

    if (!password_verify($password, $user['password_hash'])) {
        return ['success' => false, 'error' => 'Invalid username or password'];
    }

    // If Two-Factor Authentication is enabled, verify TOTP code
    if (!empty($user['two_factor_enabled']) && (int)$user['two_factor_enabled'] === 1 && !empty($user['two_factor_secret'])) {
        if (empty($totpCode)) {
            return ['success' => false, 'require_2fa' => true, 'error' => 'Please enter the 6-digit code from your Google Authenticator app.'];
        }
        if (!verifyTotpCode($user['two_factor_secret'], $totpCode)) {
            return ['success' => false, 'require_2fa' => true, 'error' => 'Invalid or expired 6-digit code. Please check your Google Authenticator app.'];
        }
    }

    // Parse permissions JSON
    $perms = [];
    if (!empty($user['permissions'])) {
        $perms = is_array($user['permissions']) ? $user['permissions'] : (json_decode($user['permissions'], true) ?: []);
    }

    // Resolve assigned artist name for artists
    $assignedArtist = !empty($user['assigned_artist']) ? $user['assigned_artist'] : null;
    if (empty($assignedArtist) && $user['role'] === 'artist') {
        $known = ['Glen', 'Jules', 'Raven', 'Bob', 'Tim', 'Goodrich', 'Rodel', 'Dorothy', 'Russel', 'Gilbert', 'Benjie'];
        foreach ($known as $k) {
            if (stripos($user['username'], $k) !== false || stripos($user['full_name'], $k) !== false) {
                $assignedArtist = $k;
                break;
            }
        }
        if (empty($assignedArtist) && (stripos($user['username'], 'dorothy') !== false || stripos($user['full_name'], 'dorothy') !== false)) {
            $assignedArtist = 'Dorothy';
        }
    }

    // Set Session
    $_SESSION['pms_user'] = [
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'full_name' => $user['full_name'],
        'role' => $user['role'],
        'assigned_artist' => $assignedArtist,
        'avatar_url' => $user['avatar_url'] ?: null,
        'permissions' => $perms,
        'oauth_provider' => $user['oauth_provider'] ?: 'credentials'
    ];
    $_SESSION['pms_first_login_reminder'] = true;
    recordUserSession((int)$user['id']);

    logAuditEvent($user['username'], $user['role'], 'AUTH', 'Security Portal', 'Successful credentials login for user: ' . $user['username'], $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', 'Success');

    return ['success' => true, 'user' => $_SESSION['pms_user']];
}

/**
 * OAuth Login / Registration Helper
 */
function loginOAuthUser($provider, $oauthId, $email, $fullName, $avatarUrl = null) {
    $pdo = getDbConnection();
    if (!$pdo) {
        return ['success' => false, 'error' => 'Database connection failed'];
    }

    // Check if user already exists with this email or oauth_id
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email OR (oauth_provider = :p AND oauth_id = :oid) LIMIT 1");
    $stmt->execute([
        ':email' => $email,
        ':p' => $provider,
        ':oid' => $oauthId
    ]);
    $user = $stmt->fetch();

    if ($user) {
        if ($user['status'] !== 'active') {
            return ['success' => false, 'error' => 'This account has been deactivated. Please contact Super Admin.'];
        }

        // Update oauth info and avatar if not set
        $updateStmt = $pdo->prepare("UPDATE users SET oauth_provider = :p, oauth_id = :oid, avatar_url = COALESCE(:avatar, avatar_url) WHERE id = :id");
        $updateStmt->execute([
            ':p' => $provider,
            ':oid' => $oauthId,
            ':avatar' => $avatarUrl,
            ':id' => $user['id']
        ]);

        $perms = [];
        if (!empty($user['permissions'])) {
            $perms = is_array($user['permissions']) ? $user['permissions'] : (json_decode($user['permissions'], true) ?: []);
        }

        $_SESSION['pms_user'] = [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role' => $user['role'],
            'avatar_url' => $avatarUrl ?: ($user['avatar_url'] ?: null),
            'permissions' => $perms,
            'oauth_provider' => $provider
        ];
        $_SESSION['pms_first_login_reminder'] = true;
        recordUserSession((int)$user['id']);

        return ['success' => true, 'user' => $_SESSION['pms_user']];
    } else {
        // Auto-create new user with read permissions
        $username = explode('@', $email)[0];
        // Ensure unique username
        $chkStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $chkStmt->execute([$username]);
        if ($chkStmt->fetchColumn() > 0) {
            $username .= '_' . substr(uniqid(), -4);
        }

        // Default new user permissions: Read on operational views
        $defaultPerms = [
            'dashboard' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'sales-requests' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'creatives-tracker' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'artist-workload' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'directives-details' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'monthly-output' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'reports' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
            'access-control' => ['c' => false, 'r' => false, 'u' => false, 'd' => false],
            'audit-trail' => ['c' => false, 'r' => false, 'u' => false, 'd' => false],
            'settings' => ['c' => false, 'r' => false, 'u' => false, 'd' => false],
        ];

        $randomPassword = password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT);

        $insertStmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, full_name, role, status, permissions, oauth_provider, oauth_id, avatar_url)
            VALUES (:u, :e, :p, :fn, 'user', 'active', :perms, :prov, :oid, :avatar)");

        $insertStmt->execute([
            ':u' => $username,
            ':e' => $email,
            ':p' => $randomPassword,
            ':fn' => $fullName ?: $username,
            ':perms' => json_encode($defaultPerms),
            ':prov' => $provider,
            ':oid' => $oauthId,
            ':avatar' => $avatarUrl
        ]);

        $newId = (int)$pdo->lastInsertId();

        $_SESSION['pms_user'] = [
            'id' => $newId,
            'username' => $username,
            'email' => $email,
            'full_name' => $fullName ?: $username,
            'role' => 'user',
            'avatar_url' => $avatarUrl,
            'permissions' => $defaultPerms,
            'oauth_provider' => $provider
        ];
        $_SESSION['pms_first_login_reminder'] = true;
        recordUserSession($newId);

        return ['success' => true, 'user' => $_SESSION['pms_user'], 'created' => true];
    }
}

/**
 * Log out and destroy session
 */
function logoutUser() {
    if (!empty($_SESSION['pms_user'])) {
        $u = $_SESSION['pms_user'];
        logAuditEvent($u['username'] ?? 'User', $u['role'] ?? 'user', 'AUTH', 'Security Portal', 'User signed out', $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1', 'Success');
    }
    $_SESSION['pms_user'] = null;
    unset($_SESSION['pms_user']);
    session_regenerate_id(true);
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}

/**
 * Append entry to audit_logs table
 */
function logAuditEvent($user, $role, $action, $module, $description, $ip = null, $status = 'Success') {
    try {
        $pdo = getDbConnection();
        if (!$pdo) return;
        $ip = $ip ?: ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $stmt = $pdo->prepare("INSERT INTO audit_logs (`user`, `role`, `action`, `module`, `description`, `ip_address`, `status`) VALUES (:u, :r, :a, :m, :d, :ip, :s)");
        $stmt->execute([
            ':u' => $user ?: 'system',
            ':r' => $role ?: 'System',
            ':a' => strtoupper($action ?: 'EVENT'),
            ':m' => $module ?: 'General',
            ':d' => $description ?: '',
            ':ip' => $ip,
            ':s' => $status ?: 'Success'
        ]);
    } catch (Exception $e) {
        // Silently tolerate if audit_logs table is missing or readonly
    }
}

/**
 * Ensure security tables and columns exist
 */
function ensureSecurityTables() {
    static $ensured = false;
    if ($ensured) return;
    $pdo = getDbConnection();
    if (!$pdo) return;

    try {
        // Create user_sessions table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS `user_sessions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `session_token` VARCHAR(128) NOT NULL,
            `ip_address` VARCHAR(45) NULL,
            `user_agent` VARCHAR(500) NULL,
            `device_name` VARCHAR(100) NULL,
            `browser` VARCHAR(50) NULL,
            `os` VARCHAR(50) NULL,
            `is_revoked` TINYINT(1) DEFAULT 0,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `last_active` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_user_id` (`user_id`),
            INDEX `idx_token` (`session_token`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // Check if two_factor_enabled exists on users table
        $cols = $pdo->query("SHOW COLUMNS FROM `users` LIKE 'two_factor_enabled'")->fetchAll();
        if (empty($cols)) {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `two_factor_enabled` TINYINT(1) DEFAULT 0");
        }

        $cols = $pdo->query("SHOW COLUMNS FROM `users` LIKE 'two_factor_secret'")->fetchAll();
        if (empty($cols)) {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `two_factor_secret` VARCHAR(100) NULL");
        }

        $cols = $pdo->query("SHOW COLUMNS FROM `users` LIKE 'google_email'")->fetchAll();
        if (empty($cols)) {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `google_email` VARCHAR(150) NULL");
        }

        $ensured = true;
    } catch (Exception $e) {
        // Silently tolerate
    }
}

/**
 * Detect client device, browser and OS from User-Agent string
 */
function detectClientDevice($userAgent = null) {
    $ua = $userAgent ?: ($_SERVER['HTTP_USER_AGENT'] ?? '');
    
    // Detect OS
    $os = 'Unknown OS';
    if (preg_match('/windows nt 10/i', $ua)) {
        $os = 'Windows 10/11';
    } elseif (preg_match('/windows nt 6\.3/i', $ua)) {
        $os = 'Windows 8.1';
    } elseif (preg_match('/windows nt 6\.1/i', $ua)) {
        $os = 'Windows 7';
    } elseif (preg_match('/macintosh|mac os x/i', $ua)) {
        $os = 'macOS';
    } elseif (preg_match('/android/i', $ua)) {
        $os = 'Android';
    } elseif (preg_match('/iphone|ipad|ipod/i', $ua)) {
        $os = 'iOS';
    } elseif (preg_match('/linux/i', $ua)) {
        $os = 'Linux';
    }

    // Detect Browser
    $browser = 'Unknown Browser';
    if (preg_match('/edg/i', $ua)) {
        $browser = 'Microsoft Edge';
    } elseif (preg_match('/chrome|crios/i', $ua) && !preg_match('/opr|opera/i', $ua)) {
        $browser = 'Google Chrome';
    } elseif (preg_match('/firefox|fxios/i', $ua)) {
        $browser = 'Mozilla Firefox';
    } elseif (preg_match('/safari/i', $ua) && !preg_match('/chrome|crios/i', $ua)) {
        $browser = 'Apple Safari';
    } elseif (preg_match('/opr|opera/i', $ua)) {
        $browser = 'Opera';
    }

    $isMobile = preg_match('/mobile|android|iphone|ipad|ipod/i', $ua);
    $deviceName = $os . ' (' . $browser . ')';

    return [
        'device_name' => $deviceName,
        'os' => $os,
        'browser' => $browser,
        'is_mobile' => $isMobile
    ];
}

/**
 * Record or update active session for user
 */
function recordUserSession($userId) {
    ensureSecurityTables();
    $pdo = getDbConnection();
    if (!$pdo) return;

    if (empty($_SESSION['pms_session_token'])) {
        $_SESSION['pms_session_token'] = bin2hex(random_bytes(32));
    }
    $token = $_SESSION['pms_session_token'];
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $device = detectClientDevice($ua);

    try {
        $stmt = $pdo->prepare("SELECT id FROM user_sessions WHERE session_token = :t LIMIT 1");
        $stmt->execute([':t' => $token]);
        $existing = $stmt->fetch();

        if ($existing) {
            $upd = $pdo->prepare("UPDATE user_sessions SET user_id = :u, ip_address = :ip, user_agent = :ua, device_name = :dn, browser = :b, os = :os, is_revoked = 0, last_active = NOW() WHERE id = :id");
            $upd->execute([
                ':u' => $userId,
                ':ip' => $ip,
                ':ua' => substr($ua, 0, 500),
                ':dn' => $device['device_name'],
                ':b' => $device['browser'],
                ':os' => $device['os'],
                ':id' => $existing['id']
            ]);
        } else {
            $ins = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, device_name, browser, os, is_revoked, created_at, last_active)
                VALUES (:u, :t, :ip, :ua, :dn, :b, :os, 0, NOW(), NOW())");
            $ins->execute([
                ':u' => $userId,
                ':t' => $token,
                ':ip' => $ip,
                ':ua' => substr($ua, 0, 500),
                ':dn' => $device['device_name'],
                ':b' => $device['browser'],
                ':os' => $device['os']
            ]);
        }
    } catch (Exception $e) {
        // tolerate
    }
}

/**
 * Check if the active session was marked as revoked
 */
function checkUserSessionRevoked() {
    if (empty($_SESSION['pms_user']['id'])) {
        return false;
    }
    if (empty($_SESSION['pms_session_token'])) {
        recordUserSession((int)$_SESSION['pms_user']['id']);
        return false;
    }

    $token = $_SESSION['pms_session_token'];
    $pdo = getDbConnection();
    if (!$pdo) return false;

    try {
        $stmt = $pdo->prepare("SELECT is_revoked FROM user_sessions WHERE session_token = :t AND user_id = :uid LIMIT 1");
        $stmt->execute([
            ':t' => $token,
            ':uid' => (int)$_SESSION['pms_user']['id']
        ]);
        $row = $stmt->fetch();

        if ($row && (int)$row['is_revoked'] === 1) {
            return true;
        }

        // Periodically bump last_active
        $upd = $pdo->prepare("UPDATE user_sessions SET last_active = NOW() WHERE session_token = :t");
        $upd->execute([':t' => $token]);

        return false;
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Get all active (non-revoked) devices/sessions for a user
 */
function getUserActiveDevices($userId) {
    ensureSecurityTables();
    $pdo = getDbConnection();
    if (!$pdo) return [];

    try {
        $stmt = $pdo->prepare("SELECT id, session_token, ip_address, user_agent, device_name, browser, os, created_at, last_active
            FROM user_sessions
            WHERE user_id = :uid AND is_revoked = 0
            ORDER BY last_active DESC");
        $stmt->execute([':uid' => $userId]);
        $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $currentToken = $_SESSION['pms_session_token'] ?? '';
        foreach ($sessions as &$s) {
            $s['is_current'] = (!empty($currentToken) && $s['session_token'] === $currentToken);
            unset($s['session_token']);
        }
        return $sessions;
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Revoke a specific session
 */
function revokeUserDevice($userId, $sessionId) {
    ensureSecurityTables();
    $pdo = getDbConnection();
    if (!$pdo) return false;

    try {
        $stmt = $pdo->prepare("UPDATE user_sessions SET is_revoked = 1 WHERE id = :id AND user_id = :uid");
        return $stmt->execute([
            ':id' => $sessionId,
            ':uid' => $userId
        ]);
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Revoke all other sessions except current
 */
function revokeAllOtherDevices($userId) {
    ensureSecurityTables();
    $pdo = getDbConnection();
    if (!$pdo) return false;

    $currentToken = $_SESSION['pms_session_token'] ?? '';
    try {
        $stmt = $pdo->prepare("UPDATE user_sessions SET is_revoked = 1 WHERE user_id = :uid AND session_token != :cur");
        return $stmt->execute([
            ':uid' => $userId,
            ':cur' => $currentToken
        ]);
    } catch (Exception $e) {
        return false;
    }
}

/**
 * =========================================================================
 * Google Authenticator (TOTP RFC 6238) Implementation
 * =========================================================================
 */

/**
 * Generate a random 16-character Base32 secret for TOTP
 */
function generateTotpSecret($length = 16) {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $secret = '';
    for ($i = 0; $i < $length; $i++) {
        $secret .= $chars[random_int(0, 31)];
    }
    return $secret;
}

/**
 * Decode Base32 string to binary
 */
function base32Decode($secret) {
    if (empty($secret)) return '';
    $base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $base32charsFlipped = array_flip(str_split($base32chars));

    $paddingCharCount = substr_count($secret, '=');
    $allowedValues = [6, 4, 3, 1, 0];
    if (!in_array($paddingCharCount, $allowedValues)) return false;
    for ($i = 0; $i < 4; $i++) {
        if ($paddingCharCount == $allowedValues[$i] &&
            substr($secret, -($allowedValues[$i])) != str_repeat('=', $allowedValues[$i])) return false;
    }
    $secret = str_replace('=', '', strtoupper($secret));
    $secret = str_split($secret);
    $binaryString = '';
    for ($i = 0; $i < count($secret); $i = $i + 8) {
        $x = '';
        if (!in_array($secret[$i], str_split($base32chars))) return false;
        for ($j = 0; $j < 8; $j++) {
            $x .= str_pad(base_convert((string)(@$base32charsFlipped[@$secret[$i + $j]]), 10, 2), 5, '0', STR_PAD_LEFT);
        }
        $eightBits = str_split($x, 8);
        for ($z = 0; $z < count($eightBits); $z++) {
            $binaryString .= (($y = chr(base_convert($eightBits[$z], 2, 10))) || ord($y) == 48) ? $y : '';
        }
    }
    return $binaryString;
}

/**
 * Calculate the current 6-digit TOTP code for a secret and time slice
 */
function getTotpCode($secret, $timeSlice = null) {
    if ($timeSlice === null) {
        $timeSlice = floor(time() / 30);
    }
    $secretKey = base32Decode($secret);
    if ($secretKey === false || empty($secretKey)) return '';

    // Pack time into 8-byte binary string (big-endian)
    $time = chr(0) . chr(0) . chr(0) . chr(0) . pack('N*', $timeSlice);
    $hmac = hash_hmac('sha1', $time, $secretKey, true);
    $offset = ord(substr($hmac, -1)) & 0x0F;
    $hashPart = substr($hmac, $offset, 4);
    $value = unpack('N', $hashPart);
    $value = $value[1] & 0x7FFFFFFF;

    $modulo = pow(10, 6);
    return str_pad($value % $modulo, 6, '0', STR_PAD_LEFT);
}

/**
 * Verify a user-provided 6-digit code against secret
 */
function verifyTotpCode($secret, $code, $discrepancy = 1) {
    $code = trim((string)$code);
    if (strlen($code) !== 6) return false;
    $currentTimeSlice = floor(time() / 30);

    for ($i = -$discrepancy; $i <= $discrepancy; $i++) {
        $calculatedCode = getTotpCode($secret, $currentTimeSlice + $i);
        if (hash_equals($calculatedCode, $code)) {
            return true;
        }
    }
    return false;
}

/**
 * Get QR code URL for Google Authenticator app
 */
function getTotpQrCodeUrl($secret, $accountEmail, $issuer = 'Sign Depot PMS') {
    $encodedIssuer = rawurlencode($issuer);
    $encodedAccount = rawurlencode($accountEmail);
    $otpauth = "otpauth://totp/{$encodedIssuer}:{$encodedAccount}?secret={$secret}&issuer={$encodedIssuer}&algorithm=SHA1&digits=6&period=30";
    return 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' . rawurlencode($otpauth);
}


