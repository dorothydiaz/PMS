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
function loginUser($usernameOrEmail, $password) {
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

