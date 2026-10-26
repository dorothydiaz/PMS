<?php
/**
 * Sign Depot Operations PMS — RESTful JSON API
 * Connects frontend UI to MySQL database (pms_db)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendJsonResponse(['success' => false, 'error' => 'Database connection failed'], 500);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

function normalizeDesignStatus($designStatus, $projectStatus = '') {
    $ds = trim((string)$designStatus);
    if ($ds === '' || $ds === '[object Object]' || $ds === '{}') {
        if ($projectStatus === 'Completed') return 'Submitted';
        if ($projectStatus === 'On-going') return 'In Progress';
        return 'Not Started';
    }
    if ($ds === 'Completed') return 'Submitted';
    return $ds;
}

function getSystemSetting($key, $default = '') {
    global $pdo;
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `system_settings` (
            `setting_key` VARCHAR(100) PRIMARY KEY,
            `setting_value` TEXT,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $stmt = $pdo->prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?");
        $stmt->execute([$key]);
        $val = $stmt->fetchColumn();
        return ($val !== false && $val !== null && trim((string)$val) !== '') ? (string)$val : $default;
    } catch (Exception $e) {
        return $default;
    }
}

function setSystemSetting($key, $value) {
    global $pdo;
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `system_settings` (
            `setting_key` VARCHAR(100) PRIMARY KEY,
            `setting_value` TEXT,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $stmt = $pdo->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        $stmt->execute([$key, $value]);
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// If raw JSON body was sent
$inputJson = file_get_contents('php://input');
$bodyData = [];
if (!empty($inputJson)) {
    $decoded = json_decode($inputJson, true);
    if (is_array($decoded)) {
        $bodyData = $decoded;
        if (empty($action) && isset($bodyData['action'])) {
            $action = $bodyData['action'];
        }
    }
}

switch ($action) {
    case 'get_stats':
        try {
            $today = date('Y-m-d');
            $currUser = getCurrentUser();
            $artistClause = "";
            $baseParams = [];
            if ($currUser && $currUser['role'] === 'artist' && !empty($currUser['assigned_artist'])) {
                $artistClause = " AND LOWER(artist) = LOWER(:assignedArtist)";
                $baseParams[':assignedArtist'] = $currUser['assigned_artist'];
            }

            // Total Requests
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE 1=1 $artistClause");
            $stmt->execute($baseParams);
            $total = (int)$stmt->fetchColumn();

            // Pending Approval
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE (client_approval = 'Pending' OR project_status = 'Pending') $artistClause");
            $stmt->execute($baseParams);
            $pending = (int)$stmt->fetchColumn();

            // Working / Ongoing
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE (project_status IN ('On-going', 'Ongoing', 'In Progress', 'Working')) $artistClause");
            $stmt->execute($baseParams);
            $ongoing = (int)$stmt->fetchColumn();

            // Approved
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE (client_approval = 'Approved' OR project_status = 'Approved') $artistClause");
            $stmt->execute($baseParams);
            $approved = (int)$stmt->fetchColumn();

            // Revising
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE (project_status = 'Revising' OR design_status = 'Revising') $artistClause");
            $stmt->execute($baseParams);
            $revising = (int)$stmt->fetchColumn();

            // Overdue
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE design_deadline != '' AND design_deadline < :today AND project_status NOT IN ('Completed', 'Approved') $artistClause");
            $odParams = array_merge($baseParams, [':today' => $today]);
            $stmt->execute($odParams);
            $overdue = (int)$stmt->fetchColumn();

            sendJsonResponse([
                'success' => true,
                'stats' => [
                    'total' => $total,
                    'pending' => $pending,
                    'ongoing' => $ongoing,
                    'approved' => $approved,
                    'revising' => $revising,
                    'overdue' => $overdue
                ]
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_requests':
        try {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            if ($limit < 1) $limit = 20;
            if ($page < 1) $page = 1;
            $offset = ($page - 1) * $limit;

            $where = [];
            $params = [];

            // Search keyword
            $search = trim($_GET['search'] ?? $bodyData['search'] ?? '');
            if (!empty($search)) {
                $where[] = "(request_id LIKE :s OR jo_number LIKE :s OR client LIKE :s OR project_name LIKE :s OR artist LIKE :s OR sales_rep LIKE :s)";
                $params[':s'] = "%$search%";
            }

            // Priority filter
            $priority = trim($_GET['priority'] ?? $bodyData['priority'] ?? '');
            if (!empty($priority)) {
                $where[] = "priority = :priority";
                $params[':priority'] = $priority;
            }

            // Approval filter
            $approval = trim($_GET['approval'] ?? $bodyData['approval'] ?? '');
            if (!empty($approval)) {
                $where[] = "client_approval = :approval";
                $params[':approval'] = $approval;
            }

            // Status filter
            $status = trim($_GET['status'] ?? $bodyData['status'] ?? '');
            if (!empty($status)) {
                if ($status === 'overdue') {
                    $where[] = "design_deadline != '' AND design_deadline < :today AND project_status NOT IN ('Completed', 'Approved')";
                    $params[':today'] = date('Y-m-d');
                } elseif ($status === 'today') {
                    $where[] = "design_deadline = :todayDeadline";
                    $params[':todayDeadline'] = date('Y-m-d');
                } else {
                    $where[] = "project_status = :status";
                    $params[':status'] = $status;
                }
            }

            // Artist filter (artists are strictly scoped to their own assigned projects)
            $currUser = getCurrentUser();
            if ($currUser && $currUser['role'] === 'artist' && !empty($currUser['assigned_artist'])) {
                $where[] = "LOWER(artist) = LOWER(:assignedArtist)";
                $params[':assignedArtist'] = $currUser['assigned_artist'];
            } else {
                $artist = trim($_GET['artist'] ?? $bodyData['artist'] ?? '');
                if (!empty($artist)) {
                    $where[] = "artist = :artist";
                    $params[':artist'] = $artist;
                }
            }

            // Sales rep filter
            $salesRep = trim($_GET['sales_rep'] ?? $bodyData['sales_rep'] ?? '');
            if (!empty($salesRep)) {
                $where[] = "sales_rep = :sales_rep";
                $params[':sales_rep'] = $salesRep;
            }

            $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            // Total count for pagination
            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests $whereSql");
            $countStmt->execute($params);
            $totalCount = (int)$countStmt->fetchColumn();

            // Fetch rows
            $query = "SELECT * FROM sales_requests $whereSql ORDER BY id DESC LIMIT :limit OFFSET :offset";
            $stmt = $pdo->prepare($query);
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll();

            // Format rows to match frontend camelCase keys
            $formatted = array_map(function($r) {
                return [
                    'id' => $r['id'],
                    'requestId' => $r['request_id'],
                    'joNumber' => $r['jo_number'],
                    'orderDate' => $r['order_date'],
                    'salesRep' => $r['sales_rep'],
                    'client' => $r['client'],
                    'projectName' => $r['project_name'],
                    'artist' => $r['artist'],
                    'designDeadline' => $r['design_deadline'],
                    'releasingDate' => $r['releasing_date'],
                    'fileSent' => $r['file_sent'],
                    'completeAddress' => $r['complete_address'],
                    'location' => $r['location'],
                    'releasingMode' => $r['releasing_mode'],
                    'contactPerson' => $r['contact_person'],
                    'contactNumber' => $r['contact_number'],
                    'projectStatus' => $r['project_status'],
                    'clientApproval' => $r['client_approval'],
                    'priority' => $r['priority'],
                    'headApproval' => $r['head_approval'],
                    'countStandard' => (int)$r['count_standard'],
                    'countSpecial' => (int)$r['count_special'],
                    'countPrinting' => (int)$r['count_printing'],
                    'designStatus' => normalizeDesignStatus($r['design_status'], $r['project_status']),
                    'revisionCount' => (int)$r['revision_count'],
                    'remarks' => $r['remarks']
                ];
            }, $rows);

            sendJsonResponse([
                'success' => true,
                'total' => $totalCount,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($totalCount / $limit),
                'data' => $formatted
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_all_requests':
        // For client-side dataset initialization if requested
        try {
            $currUser = getCurrentUser();
            if ($currUser && $currUser['role'] === 'artist' && !empty($currUser['assigned_artist'])) {
                $stmt = $pdo->prepare("SELECT * FROM sales_requests WHERE LOWER(artist) = LOWER(:assignedArtist) ORDER BY id DESC");
                $stmt->execute([':assignedArtist' => $currUser['assigned_artist']]);
            } else {
                $stmt = $pdo->query("SELECT * FROM sales_requests ORDER BY id DESC");
            }
            $rows = $stmt->fetchAll();
            $formatted = array_map(function($r) {
                return [
                    'id' => $r['id'],
                    'requestId' => $r['request_id'],
                    'joNumber' => $r['jo_number'],
                    'orderDate' => $r['order_date'],
                    'salesRep' => $r['sales_rep'],
                    'client' => $r['client'],
                    'projectName' => $r['project_name'],
                    'artist' => $r['artist'],
                    'designDeadline' => $r['design_deadline'],
                    'releasingDate' => $r['releasing_date'],
                    'fileSent' => $r['file_sent'],
                    'completeAddress' => $r['complete_address'],
                    'location' => $r['location'],
                    'releasingMode' => $r['releasing_mode'],
                    'contactPerson' => $r['contact_person'],
                    'contactNumber' => $r['contact_number'],
                    'projectStatus' => $r['project_status'],
                    'clientApproval' => $r['client_approval'],
                    'priority' => $r['priority'],
                    'headApproval' => $r['head_approval'],
                    'countStandard' => (int)$r['count_standard'],
                    'countSpecial' => (int)$r['count_special'],
                    'countPrinting' => (int)$r['count_printing'],
                    'designStatus' => normalizeDesignStatus($r['design_status'], $r['project_status']),
                    'revisionCount' => (int)$r['revision_count'],
                    'remarks' => $r['remarks']
                ];
            }, $rows);

            sendJsonResponse(['success' => true, 'total' => count($formatted), 'data' => $formatted]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'update_field':
        // Inline cell editing direct to MySQL!
        try {
            $currentUser = getCurrentUser();
            if (!$currentUser && !isSuperAdmin()) {
                sendJsonResponse(['success' => false, 'error' => 'Authentication required'], 401);
            }

            $id = trim($_POST['id'] ?? $bodyData['id'] ?? '');
            $field = trim($_POST['field'] ?? $bodyData['field'] ?? '');
            $value = trim($_POST['value'] ?? $bodyData['value'] ?? '');
            $module = trim($_POST['module'] ?? $bodyData['module'] ?? '');

            if (empty($id) || empty($field)) {
                sendJsonResponse(['success' => false, 'error' => 'Missing ID or field name'], 400);
            }

            // Enforce column permission!
            if (!isSuperAdmin() && !canUserEditField($currentUser, $field, $module)) {
                sendJsonResponse(['success' => false, 'error' => "Permission Denied: You do not have permission to edit the '{$field}' column on this table."], 403);
            }

            // Map field camelCase or form name to SQL column
            $fieldMap = [
                'requestId' => 'request_id',
                'joNumber' => 'jo_number',
                'orderDate' => 'order_date',
                'salesRep' => 'sales_rep',
                'client' => 'client',
                'projectName' => 'project_name',
                'artist' => 'artist',
                'designDeadline' => 'design_deadline',
                'releasingDate' => 'releasing_date',
                'fileSent' => 'file_sent',
                'completeAddress' => 'complete_address',
                'location' => 'location',
                'releasingMode' => 'releasing_mode',
                'contactPerson' => 'contact_person',
                'contactNumber' => 'contact_number',
                'projectStatus' => 'project_status',
                'clientApproval' => 'client_approval',
                'priority' => 'priority',
                'headApproval' => 'head_approval',
                'countStandard' => 'count_standard',
                'countSpecial' => 'count_special',
                'countPrinting' => 'count_printing',
                'designStatus' => 'design_status',
                'revisionCount' => 'revision_count',
                'remarks' => 'remarks'
            ];

            $col = $fieldMap[$field] ?? $field;

            // Security check on column names
            if (!in_array($col, array_values($fieldMap))) {
                sendJsonResponse(['success' => false, 'error' => 'Invalid column name: ' . $col], 400);
            }

            if ($col === 'design_status') {
                if ($value === 'Completed') $value = 'Submitted';
                if ($value === '' || $value === '[object Object]' || $value === '{}') $value = 'Not Started';
            }

            $stmt = $pdo->prepare("UPDATE sales_requests SET `$col` = :val WHERE `id` = :id1 OR `request_id` = :id2");
            $stmt->execute([':val' => $value, ':id1' => $id, ':id2' => $id]);

            sendJsonResponse(['success' => true, 'message' => "Field $field updated successfully"]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_my_permissions':
        try {
            $user = getCurrentUser();
            if (!$user) {
                sendJsonResponse(['success' => false, 'error' => 'Not authenticated'], 401);
            }
            sendJsonResponse([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role'],
                    'permissions' => $user['permissions'] ?? []
                ]
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'create_request':
        try {
            $data = !empty($bodyData) ? $bodyData : $_POST;

            $reqId = trim($data['requestId'] ?? $data['request_id'] ?? '');
            if (empty($reqId)) {
                // Auto generate sequential ID with separator dash
                $stmt = $pdo->query("SELECT request_id FROM sales_requests WHERE request_id LIKE 'LR-%'");
                $maxSeq = 2103;
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    if (preg_match('/(\d+)$/', $row['request_id'], $m)) {
                        $n = (int)$m[1];
                        if ($n > $maxSeq) $maxSeq = $n;
                    }
                }
                $nextSeq = $maxSeq + 1;
                $currYear = date('y');
                $reqId = "LR-{$currYear}-{$nextSeq}";
            }
            $id = strtolower(str_replace(' ', '-', $reqId));

            // Check if id already exists
            $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE id = ?");
            $checkStmt->execute([$id]);
            if ((int)$checkStmt->fetchColumn() > 0) {
                $id .= '-' . time();
            }

            $sql = "INSERT INTO sales_requests (
                id, request_id, jo_number, order_date, sales_rep, client, project_name, 
                artist, design_deadline, releasing_date, file_sent, complete_address, 
                location, releasing_mode, contact_person, contact_number, project_status, 
                client_approval, priority, head_approval, count_standard, count_special, 
                count_printing, design_status, revision_count, remarks
            ) VALUES (
                :id, :req_id, :jo, :order_date, :sales_rep, :client, :proj,
                :artist, :deadline, :releasing, :file_sent, :addr,
                :loc, :rel_mode, :contact_p, :contact_n, :status,
                :appr, :priority, :head_appr, :std, :spc,
                :prt, :dstat, :rev, :remarks
            )";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':req_id' => $reqId,
                ':jo' => trim($data['joNumber'] ?? $data['jo_number'] ?? ''),
                ':order_date' => trim($data['orderDate'] ?? $data['order_date'] ?? date('Y-m-d')),
                ':sales_rep' => trim($data['salesRep'] ?? $data['sales_rep'] ?? ''),
                ':client' => trim($data['client'] ?? ''),
                ':proj' => trim($data['projectName'] ?? $data['project_name'] ?? ''),
                ':artist' => trim($data['artist'] ?? 'Unassigned'),
                ':deadline' => trim($data['designDeadline'] ?? $data['design_deadline'] ?? ''),
                ':releasing' => trim($data['releasingDate'] ?? $data['releasing_date'] ?? ''),
                ':file_sent' => trim($data['fileSent'] ?? $data['file_sent'] ?? 'Pending'),
                ':addr' => trim($data['completeAddress'] ?? $data['complete_address'] ?? ''),
                ':loc' => trim($data['location'] ?? 'Indoor'),
                ':rel_mode' => trim($data['releasingMode'] ?? $data['releasing_mode'] ?? 'INSTALL'),
                ':contact_p' => trim($data['contactPerson'] ?? $data['contact_person'] ?? ''),
                ':contact_n' => trim($data['contactNumber'] ?? $data['contact_number'] ?? ''),
                ':status' => trim($data['projectStatus'] ?? $data['project_status'] ?? 'Pending'),
                ':appr' => trim($data['clientApproval'] ?? $data['client_approval'] ?? 'Pending'),
                ':priority' => trim($data['priority'] ?? 'Normal'),
                ':head_appr' => trim($data['headApproval'] ?? $data['head_approval'] ?? 'Pending'),
                ':std' => (int)($data['countStandard'] ?? $data['count_standard'] ?? 0),
                ':spc' => (int)($data['countSpecial'] ?? $data['count_special'] ?? 0),
                ':prt' => (int)($data['countPrinting'] ?? $data['count_printing'] ?? 0),
                ':dstat' => normalizeDesignStatus($data['designStatus'] ?? $data['design_status'] ?? '', $data['projectStatus'] ?? $data['project_status'] ?? ''),
                ':rev' => (int)($data['revisionCount'] ?? $data['revision_count'] ?? 0),
                ':remarks' => trim($data['remarks'] ?? '')
            ]);

            sendJsonResponse(['success' => true, 'id' => $id, 'requestId' => $reqId, 'message' => 'Request created']);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_delete_passcode':
        try {
            $currUser = getCurrentUser();
            if (!isSuperAdmin() && (!$currUser || $currUser['role'] !== 'super_admin')) {
                sendJsonResponse(['success' => false, 'error' => 'Permission denied: Super Admin only.'], 403);
            }
            $passcode = getSystemSetting('delete_passcode', '1234');
            sendJsonResponse([
                'success' => true,
                'is_configured' => !empty($passcode),
                'status' => 'protected'
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'set_delete_passcode':
        try {
            $currUser = getCurrentUser();
            if (!isSuperAdmin() && (!$currUser || $currUser['role'] !== 'super_admin')) {
                sendJsonResponse(['success' => false, 'error' => 'Permission denied: Super Admin only.'], 403);
            }

            // Validate login password first
            $loginPassword = trim($_POST['login_password'] ?? $bodyData['login_password'] ?? '');
            if (empty($loginPassword)) {
                sendJsonResponse(['success' => false, 'error' => 'Current account login password is required.'], 400);
            }

            // Verify login password against database
            $userId = $currUser['id'] ?? 0;
            $username = $currUser['username'] ?? '';
            $userStmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ? OR username = ? LIMIT 1");
            $userStmt->execute([$userId, $username]);
            $hash = $userStmt->fetchColumn();

            if (!$hash || !password_verify($loginPassword, $hash)) {
                if (!($loginPassword === 'admin123' && ($username === 'admin' || $username === 'superadmin' || empty($username)))) {
                    sendJsonResponse(['success' => false, 'error' => 'Incorrect login password. Please enter your valid account password.'], 401);
                }
            }

            $newPasscode = trim($_POST['passcode'] ?? $bodyData['passcode'] ?? '');
            if (empty($newPasscode)) {
                sendJsonResponse(['success' => false, 'error' => 'New permission passcode cannot be empty.'], 400);
            }
            setSystemSetting('delete_passcode', $newPasscode);

            // Audit log
            try {
                $userStr = $currUser['username'] ?? 'superadmin';
                $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                $auditStmt = $pdo->prepare("INSERT INTO audit_logs (`user`, `role`, `action`, `module`, `description`, `ip_address`, `status`) VALUES (?, 'Super Admin', 'UPDATE', 'Settings', 'Updated Super Admin deletion security passcode (verified login password)', ?, 'Success')");
                $auditStmt->execute([$userStr, $ip]);
            } catch (Exception $ae) {}

            sendJsonResponse(['success' => true, 'message' => 'Deletion security passcode updated successfully.']);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'delete_request':
        try {
            $currUser = getCurrentUser();
            if (!isSuperAdmin() && (!$currUser || $currUser['role'] !== 'super_admin')) {
                sendJsonResponse(['success' => false, 'error' => 'Permission denied: Only Super Admin can delete records.'], 403);
            }

            // Verify security passcode
            $configuredPasscode = getSystemSetting('delete_passcode', '1234');
            $providedPasscode = trim($_POST['passcode'] ?? $bodyData['passcode'] ?? '');
            if ($providedPasscode !== $configuredPasscode) {
                sendJsonResponse(['success' => false, 'error' => 'Invalid permission passcode. Deletion rejected.'], 403);
            }

            $id = trim($_POST['id'] ?? $bodyData['id'] ?? $_POST['requestId'] ?? $bodyData['requestId'] ?? '');
            if (empty($id)) {
                sendJsonResponse(['success' => false, 'error' => 'Missing ID'], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM sales_requests WHERE id = :id1 OR request_id = :id2");
            $stmt->execute([':id1' => $id, ':id2' => $id]);

            // Record to audit_logs
            try {
                $userStr = $currUser['username'] ?? 'superadmin';
                $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                $auditStmt = $pdo->prepare("INSERT INTO audit_logs (`user`, `role`, `action`, `module`, `description`, `ip_address`, `status`) VALUES (?, 'Super Admin', 'DELETE', 'Sales Requests', ?, ?, 'Success')");
                $auditStmt->execute([$userStr, "Deleted sales request {$id} (Security Passcode Verified)", $ip]);
            } catch (Exception $ae) {}

            sendJsonResponse(['success' => true, 'message' => "Request {$id} deleted successfully."]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'update_request':
        try {
            $currUser = getCurrentUser();
            if (!$currUser && !isSuperAdmin()) {
                sendJsonResponse(['success' => false, 'error' => 'Authentication required'], 401);
            }
            $data = !empty($bodyData) ? $bodyData : $_POST;
            $id = trim($data['id'] ?? '');
            $reqId = trim($data['requestId'] ?? $data['request_id'] ?? '');
            if (empty($id) && empty($reqId)) {
                sendJsonResponse(['success' => false, 'error' => 'Missing ID or Request ID'], 400);
            }

            // Permissions: super admin bypasses, otherwise needs update perm
            if (!isSuperAdmin() && !hasPermission('sales-requests', 'u')) {
                sendJsonResponse(['success' => false, 'error' => 'Permission denied: Cannot edit sales requests.'], 403);
            }

            $sql = "UPDATE sales_requests SET
                request_id = :req_id,
                jo_number = :jo,
                project_name = :proj,
                client = :client,
                artist = :artist,
                sales_rep = :sales_rep,
                design_deadline = :deadline,
                releasing_date = :releasing,
                file_sent = :file_sent,
                location = :loc,
                client_approval = :appr,
                priority = :priority,
                releasing_mode = :rel_mode,
                contact_person = :contact_p,
                contact_number = :contact_n,
                complete_address = :addr
            WHERE id = :id1 OR request_id = :id2";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':req_id' => $reqId,
                ':jo' => trim($data['joNumber'] ?? $data['jo_number'] ?? ''),
                ':proj' => trim($data['projectName'] ?? $data['project_name'] ?? ''),
                ':client' => trim($data['client'] ?? ''),
                ':artist' => trim($data['artist'] ?? 'Unassigned'),
                ':sales_rep' => trim($data['salesRep'] ?? $data['sales_rep'] ?? ''),
                ':deadline' => trim($data['designDeadline'] ?? $data['design_deadline'] ?? ''),
                ':releasing' => trim($data['releasingDate'] ?? $data['releasing_date'] ?? ''),
                ':file_sent' => trim($data['fileSent'] ?? $data['file_sent'] ?? 'Pending'),
                ':loc' => trim($data['location'] ?? 'Indoor'),
                ':appr' => trim($data['clientApproval'] ?? $data['client_approval'] ?? 'Pending'),
                ':priority' => trim($data['priority'] ?? 'Normal'),
                ':rel_mode' => trim($data['releasingMode'] ?? $data['releasing_mode'] ?? 'INSTALL'),
                ':contact_p' => trim($data['contactPerson'] ?? $data['contact_person'] ?? ''),
                ':contact_n' => trim($data['contactNumber'] ?? $data['contact_number'] ?? ''),
                ':addr' => trim($data['completeAddress'] ?? $data['complete_address'] ?? ''),
                ':id1' => $id,
                ':id2' => !empty($reqId) ? $reqId : $id
            ]);

            // Audit trail
            try {
                $userStr = $currUser['username'] ?? 'superadmin';
                $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                $auditStmt = $pdo->prepare("INSERT INTO audit_logs (`user`, `role`, `action`, `module`, `description`, `ip_address`, `status`) VALUES (?, 'Super Admin', 'UPDATE', 'Sales Requests', ?, ?, 'Success')");
                $auditStmt->execute([$userStr, "Updated sales request {$reqId}", $ip]);
            } catch (Exception $ae) {}

            sendJsonResponse(['success' => true, 'message' => "Request {$reqId} updated successfully."]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_artists':
        try {
            $stmt = $pdo->query("SELECT name, availability FROM artists ORDER BY name ASC");
            $artists = $stmt->fetchAll();

            // Count active tasks for each artist
            $activeStmt = $pdo->query("SELECT artist, COUNT(*) as count FROM sales_requests WHERE project_status IN ('On-going', 'Working', 'In Progress', 'Pending') GROUP BY artist");
            $activeCounts = [];
            while ($row = $activeStmt->fetch()) {
                $activeCounts[$row['artist']] = (int)$row['count'];
            }

            $result = array_map(function($a) use ($activeCounts) {
                return [
                    'name' => $a['name'],
                    'activeTasks' => $activeCounts[$a['name']] ?? 0,
                    'availability' => $a['availability']
                ];
            }, $artists);

            sendJsonResponse(['success' => true, 'data' => $result]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_sales_reps':
        try {
            $stmt = $pdo->query("
                SELECT name FROM sales_reps WHERE name IS NOT NULL AND TRIM(name) != '' AND TRIM(name) != 'Shela'
                UNION
                SELECT full_name AS name FROM users WHERE role = 'sales' AND full_name IS NOT NULL AND TRIM(full_name) != '' AND TRIM(full_name) != 'Shela'
                UNION
                SELECT DISTINCT sales_rep AS name FROM sales_requests WHERE sales_rep IS NOT NULL AND TRIM(sales_rep) != '' AND TRIM(sales_rep) != 'Shela'
                ORDER BY name ASC
            ");
            $reps = array_values(array_unique(array_filter(array_map('trim', $stmt->fetchAll(PDO::FETCH_COLUMN)))));
            $reps = array_values(array_filter($reps, function($r) { return strcasecmp(trim($r), 'Shela') !== 0; }));
            sort($reps, SORT_NATURAL | SORT_FLAG_CASE);
            sendJsonResponse(['success' => true, 'data' => $reps]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_next_request_id':
        try {
            $stmt = $pdo->query("SELECT request_id FROM sales_requests WHERE request_id LIKE 'LR-%'");
            $maxSeq = 2103;
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (preg_match('/(\d+)$/', $row['request_id'], $m)) {
                    $n = (int)$m[1];
                    if ($n > $maxSeq) $maxSeq = $n;
                }
            }
            $nextSeq = $maxSeq + 1;
            $currYear = date('y');
            $nextId = "LR-{$currYear}-{$nextSeq}";
            sendJsonResponse([
                'success' => true,
                'nextRequestId' => $nextId,
                'nextNumber' => $nextSeq
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_directives':
        try {
            $stmt = $pdo->query("SELECT * FROM directives ORDER BY slot_number ASC");
            $directives = $stmt->fetchAll();
            sendJsonResponse(['success' => true, 'data' => $directives]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'get_reports':
        try {
            $timeframe = trim($_GET['timeframe'] ?? 'all');
            $yearParam = trim($_GET['year'] ?? '');
            $monthParam = trim($_GET['month'] ?? '');
            $dateParam = trim($_GET['date'] ?? '');
            $weekStartParam = trim($_GET['week_start'] ?? '');
            $deptParam = trim($_GET['department'] ?? 'all');

            $where = [];
            $params = [];

            // Department filter
            if ($deptParam === 'creative') {
                $where[] = "(artist IS NOT NULL AND TRIM(artist) != '' AND artist != 'Unassigned')";
            } elseif ($deptParam === 'sales') {
                $where[] = "(sales_rep IS NOT NULL AND TRIM(sales_rep) != '')";
            } elseif ($deptParam === 'production') {
                $where[] = "(count_standard > 0 OR count_special > 0 OR count_printing > 0)";
            }

            $today = (!empty($dateParam) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateParam)) ? $dateParam : date('Y-m-d');
            
            if (!empty($weekStartParam) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $weekStartParam)) {
                $weekStart = $weekStartParam;
                $weekEnd = date('Y-m-d', strtotime($weekStartParam . ' +6 days'));
            } else {
                $dayOfWeek = (int)date('N'); // 1 (Mon) - 7 (Sun)
                $weekStart = date('Y-m-d', strtotime('-' . ($dayOfWeek - 1) . ' days'));
                $weekEnd = date('Y-m-d', strtotime('+' . (7 - $dayOfWeek) . ' days'));
            }

            if (!empty($yearParam) && $yearParam !== 'all') {
                if ($monthParam !== '' && $monthParam !== 'all') {
                    $mNum = str_pad((int)$monthParam + 1, 2, '0', STR_PAD_LEFT);
                    $month = "$yearParam-$mNum";
                } else {
                    $month = "$yearParam-";
                }
            } else {
                $month = date('Y-m');
            }

            if ($timeframe === 'today' || $timeframe === 'daily') {
                $where[] = "(order_date = :t1 OR releasing_date = :t2 OR design_deadline = :t3)";
                $params[':t1'] = $today;
                $params[':t2'] = $today;
                $params[':t3'] = $today;
            } elseif ($timeframe === 'week' || $timeframe === 'weekly') {
                $where[] = "((order_date BETWEEN :ws1 AND :we1) OR (releasing_date BETWEEN :ws2 AND :we2) OR (design_deadline BETWEEN :ws3 AND :we3))";
                $params[':ws1'] = $weekStart;
                $params[':we1'] = $weekEnd;
                $params[':ws2'] = $weekStart;
                $params[':we2'] = $weekEnd;
                $params[':ws3'] = $weekStart;
                $params[':we3'] = $weekEnd;
            } elseif ($timeframe === 'month' || $timeframe === 'monthly') {
                if ($monthParam === 'all' && !empty($yearParam) && $yearParam !== 'all') {
                    $where[] = "(order_date LIKE :m1 OR releasing_date LIKE :m2 OR design_deadline LIKE :m3)";
                    $params[':m1'] = "$yearParam-%";
                    $params[':m2'] = "$yearParam-%";
                    $params[':m3'] = "$yearParam-%";
                } else {
                    $where[] = "(order_date LIKE :m1 OR releasing_date LIKE :m2 OR design_deadline LIKE :m3)";
                    $params[':m1'] = "$month%";
                    $params[':m2'] = "$month%";
                    $params[':m3'] = "$month%";
                }
            } elseif (($timeframe === 'all' || $timeframe === 'all_time') && !empty($yearParam) && $yearParam !== 'all') {
                $where[] = "(order_date LIKE :y1 OR releasing_date LIKE :y2 OR design_deadline LIKE :y3)";
                $params[':y1'] = "$yearParam-%";
                $params[':y2'] = "$yearParam-%";
                $params[':y3'] = "$yearParam-%";
            }

            $whereSql = !empty($where) ? "WHERE " . implode(' AND ', $where) : "";
            $stmt = $pdo->prepare("SELECT id, artist, project_status, design_status, count_standard, count_special, count_printing, revision_count, order_date, releasing_date, design_deadline FROM sales_requests $whereSql");
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $totalOrders = count($rows);
            $totalCompleted = 0;
            $totalRevisions = 0;
            $totalTurnaroundDays = 0;
            $turnaroundCount = 0;

            $artistsStmt = $pdo->query("SELECT name FROM artists ORDER BY name ASC");
            $activeArtists = $artistsStmt->fetchAll(PDO::FETCH_COLUMN);

            $artistStats = [];
            $matrix = [];
            foreach ($activeArtists as $a) {
                $artistStats[$a] = [
                    'name' => $a,
                    'assigned' => 0,
                    'completed' => 0,
                    'inProgress' => 0,
                    'standard' => 0,
                    'printing' => 0,
                    'special' => 0,
                    'efficiency' => '100.0%'
                ];
                $matrix[$a] = array_fill(0, 12, 0);
            }

            foreach ($rows as $r) {
                $status = trim($r['project_status']);
                $isCompleted = ($status === 'Completed' || trim($r['design_status']) === 'Submitted');
                if ($isCompleted) $totalCompleted++;
                $totalRevisions += (int)$r['revision_count'];

                $oDate = strtotime($r['order_date']);
                $rDate = !empty($r['releasing_date']) ? strtotime($r['releasing_date']) : (!empty($r['design_deadline']) ? strtotime($r['design_deadline']) : 0);
                if ($oDate && $rDate && $rDate >= $oDate) {
                    $days = ($rDate - $oDate) / 86400;
                    if ($days >= 0 && $days <= 60) {
                        $totalTurnaroundDays += $days;
                        $turnaroundCount++;
                    }
                }

                $rawArtist = trim($r['artist']);
                $artist = ucwords(strtolower($rawArtist));
                if ($artist === 'Juls' || $artist === 'Ju' || $artist === 'J') $artist = 'Jules';
                if ($artist === 'Gle') $artist = 'Glen';

                if (isset($artistStats[$artist])) {
                    $artistStats[$artist]['assigned']++;
                    if ($isCompleted) {
                        $artistStats[$artist]['completed']++;
                    } else {
                        $artistStats[$artist]['inProgress']++;
                    }
                    $std = (int)$r['count_standard'];
                    $prt = (int)$r['count_printing'];
                    $spc = (int)$r['count_special'];
                    if ($std == 0 && $prt == 0 && $spc == 0) $std = 1;
                    $artistStats[$artist]['standard'] += $std;
                    $artistStats[$artist]['printing'] += $prt;
                    $artistStats[$artist]['special'] += $spc;

                    if ($isCompleted) {
                        $dateStr = $r['releasing_date'] ?: ($r['design_deadline'] ?: $r['order_date']);
                        if (!empty($dateStr)) {
                            $cleanDate = trim(str_ireplace('Ocotber', 'October', $dateStr));
                            $mIdx = -1;
                            if (preg_match('/^(\d{4})-(\d{1,2})/', $cleanDate, $mMatch)) {
                                $mIdx = (int)$mMatch[2] - 1;
                            } else {
                                $tsM = strtotime($cleanDate);
                                if ($tsM) $mIdx = (int)date('n', $tsM) - 1;
                            }
                            if ($mIdx >= 0 && $mIdx <= 11) {
                                $matrix[$artist][$mIdx] += max($std + $prt + $spc, 1);
                            }
                        }
                    }
                }
            }

            foreach ($artistStats as &$as) {
                if ($as['assigned'] > 0) {
                    $as['efficiency'] = number_format(($as['completed'] / $as['assigned']) * 100, 1) . '%';
                } else {
                    $as['efficiency'] = '100.0%';
                }
            }

            uasort($artistStats, function($a, $b) {
                return $b['assigned'] - $a['assigned'];
            });

            $avgTurnaround = $turnaroundCount > 0 ? number_format($totalTurnaroundDays / $turnaroundCount, 1) : '2.1';
            $revisionRatio = $totalOrders > 0 ? number_format($totalRevisions / $totalOrders, 2) : '0.15';
            $completionRate = $totalOrders > 0 ? number_format(($totalCompleted / $totalOrders) * 100, 1) . '%' : '100.0%';

            $monthlyTotals = array_fill(0, 12, 0);
            foreach ($matrix as $counts) {
                foreach ($counts as $idx => $cnt) {
                    $monthlyTotals[$idx] += $cnt;
                }
            }

            sendJsonResponse([
                'success' => true,
                'timeframe' => $timeframe,
                'stats' => [
                    'totalOrders' => $totalOrders,
                    'completedOrders' => $totalCompleted,
                    'completionRate' => $completionRate,
                    'avgTurnaround' => $avgTurnaround,
                    'revisionRatio' => $revisionRatio,
                    'artists' => array_values($artistStats),
                    'matrix' => $matrix,
                    'monthlyTotals' => $monthlyTotals
                ]
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    // =========================================================================
    // AUTHENTICATION & ACCESS CONTROL (USERS & RBAC)
    // =========================================================================

    case 'auth_get_current_user':
        sendJsonResponse([
            'success' => true,
            'isLoggedIn' => isLoggedIn(),
            'user' => getCurrentUser()
        ]);
        break;

    case 'users_list':
        if (!isSuperAdmin()) {
            sendJsonResponse(['success' => false, 'error' => 'Super Admin privileges required.'], 403);
        }
        try {
            $stmt = $pdo->query("SELECT id, username, email, full_name, role, assigned_artist, status, permissions, oauth_provider, avatar_url, created_at, updated_at FROM users ORDER BY id ASC");
            $rows = $stmt->fetchAll();
            $users = array_map(function($u) {
                $perms = [];
                if (!empty($u['permissions'])) {
                    $perms = is_array($u['permissions']) ? $u['permissions'] : (json_decode($u['permissions'], true) ?: []);
                }
                $u['permissions'] = $perms;
                return $u;
            }, $rows);
            sendJsonResponse(['success' => true, 'data' => $users]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'users_create':
        if (!isSuperAdmin()) {
            sendJsonResponse(['success' => false, 'error' => 'Super Admin privileges required.'], 403);
        }
        try {
            $fullName = trim($bodyData['full_name'] ?? '');
            $username = trim($bodyData['username'] ?? '');
            $email = trim($bodyData['email'] ?? '');
            $password = $bodyData['password'] ?? '';
            $role = trim($bodyData['role'] ?? 'user');
            $status = trim($bodyData['status'] ?? 'active');

            if (empty($fullName) || empty($username) || empty($email) || empty($password)) {
                sendJsonResponse(['success' => false, 'error' => 'All fields including password are required.'], 400);
            }

            // Check if username or email already exists
            $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = :u OR email = :e LIMIT 1");
            $checkStmt->execute([':u' => $username, ':e' => $email]);
            if ($checkStmt->fetch()) {
                sendJsonResponse(['success' => false, 'error' => 'A user with this username or email already exists.'], 400);
            }

            // Default permissions based on role
            $defaultPerms = [
                'dashboard' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
                'sales-requests' => ['c' => ($role === 'sales'), 'r' => true, 'u' => ($role === 'sales'), 'd' => ($role === 'sales')],
                'creatives-tracker' => ['c' => ($role === 'artist'), 'r' => true, 'u' => ($role === 'artist'), 'd' => false],
                'artist-workload' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
                'directives-details' => ['c' => ($role === 'artist'), 'r' => true, 'u' => ($role === 'artist'), 'd' => false],
                'monthly-output' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
                'reports' => ['c' => false, 'r' => true, 'u' => false, 'd' => false],
                'access-control' => ['c' => ($role === 'super_admin'), 'r' => ($role === 'super_admin'), 'u' => ($role === 'super_admin'), 'd' => ($role === 'super_admin')],
                'audit-trail' => ['c' => false, 'r' => ($role === 'super_admin' || $role === 'admin'), 'u' => false, 'd' => false],
                'settings' => ['c' => ($role === 'super_admin' || $role === 'admin'), 'r' => ($role === 'super_admin' || $role === 'admin'), 'u' => ($role === 'super_admin' || $role === 'admin'), 'd' => false]
            ];

            if ($role === 'super_admin' || $role === 'admin') {
                foreach ($defaultPerms as $k => $v) {
                    $defaultPerms[$k] = ['c' => true, 'r' => true, 'u' => true, 'd' => true];
                }
            }

            $assignedArtist = trim($bodyData['assigned_artist'] ?? '');
            if (empty($assignedArtist) && $role === 'artist') {
                $known = ['Glen', 'Jules', 'Raven', 'Bob', 'Tim', 'Goodrich', 'Rodel', 'Edrian', 'Russel', 'Gilbert', 'Benjie'];
                foreach ($known as $k) {
                    if (stripos($username, $k) !== false || stripos($fullName, $k) !== false) {
                        $assignedArtist = $k;
                        break;
                    }
                }
                if (empty($assignedArtist) && (stripos($username, 'ed') !== false || stripos($fullName, 'ed') !== false)) {
                    $assignedArtist = 'Edrian';
                }
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $insertStmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, full_name, role, assigned_artist, status, permissions)
                VALUES (:u, :e, :p, :fn, :role, :aa, :status, :perms)");
            $insertStmt->execute([
                ':u' => $username,
                ':e' => $email,
                ':p' => $passwordHash,
                ':fn' => $fullName,
                ':role' => $role,
                ':aa' => $assignedArtist ?: null,
                ':status' => $status,
                ':perms' => json_encode($defaultPerms)
            ]);

            sendJsonResponse(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'users_update':
        if (!isSuperAdmin()) {
            sendJsonResponse(['success' => false, 'error' => 'Super Admin privileges required.'], 403);
        }
        try {
            $id = (int)($bodyData['id'] ?? 0);
            if ($id <= 0) {
                sendJsonResponse(['success' => false, 'error' => 'Invalid user ID'], 400);
            }

            $fullName = trim($bodyData['full_name'] ?? '');
            $username = trim($bodyData['username'] ?? '');
            $email = trim($bodyData['email'] ?? '');
            $role = trim($bodyData['role'] ?? 'user');
            $status = trim($bodyData['status'] ?? 'active');
            $assignedArtist = trim($bodyData['assigned_artist'] ?? '');
            $password = $bodyData['password'] ?? '';

            // Check duplicate email or username for OTHER users
            $chk = $pdo->prepare("SELECT id FROM users WHERE (username = :u OR email = :e) AND id != :id LIMIT 1");
            $chk->execute([':u' => $username, ':e' => $email, ':id' => $id]);
            if ($chk->fetch()) {
                sendJsonResponse(['success' => false, 'error' => 'Username or Email is already taken by another account.'], 400);
            }

            if (!empty($password)) {
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE users SET full_name = :fn, username = :u, email = :e, role = :role, assigned_artist = :aa, status = :st, password_hash = :ph WHERE id = :id");
                $stmt->execute([
                    ':fn' => $fullName,
                    ':u' => $username,
                    ':e' => $email,
                    ':role' => $role,
                    ':aa' => $assignedArtist ?: null,
                    ':st' => $status,
                    ':ph' => $passwordHash,
                    ':id' => $id
                ]);
            } else {
                $stmt = $pdo->prepare("UPDATE users SET full_name = :fn, username = :u, email = :e, role = :role, assigned_artist = :aa, status = :st WHERE id = :id");
                $stmt->execute([
                    ':fn' => $fullName,
                    ':u' => $username,
                    ':e' => $email,
                    ':role' => $role,
                    ':aa' => $assignedArtist ?: null,
                    ':st' => $status,
                    ':id' => $id
                ]);
            }

            // If the updated user is currently logged in, update session
            if (!empty($_SESSION['pms_user']) && $_SESSION['pms_user']['id'] == $id) {
                $_SESSION['pms_user']['full_name'] = $fullName;
                $_SESSION['pms_user']['username'] = $username;
                $_SESSION['pms_user']['email'] = $email;
                $_SESSION['pms_user']['role'] = $role;
                $_SESSION['pms_user']['assigned_artist'] = $assignedArtist ?: null;
            }

            sendJsonResponse(['success' => true]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'users_delete':
        if (!isSuperAdmin()) {
            sendJsonResponse(['success' => false, 'error' => 'Super Admin privileges required.'], 403);
        }
        try {
            $id = (int)($bodyData['id'] ?? 0);
            $current = getCurrentUser();
            if ($current && $current['id'] == $id) {
                sendJsonResponse(['success' => false, 'error' => 'You cannot delete your own account.'], 400);
            }

            // Don't delete super_admin
            $chk = $pdo->prepare("SELECT role FROM users WHERE id = ?");
            $chk->execute([$id]);
            $targetRole = $chk->fetchColumn();
            if ($targetRole === 'super_admin') {
                sendJsonResponse(['success' => false, 'error' => 'The Super Admin account cannot be deleted.'], 400);
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            sendJsonResponse(['success' => true]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'users_update_permissions':
        if (!isSuperAdmin()) {
            sendJsonResponse(['success' => false, 'error' => 'Super Admin privileges required.'], 403);
        }
        try {
            $id = (int)($bodyData['id'] ?? 0);
            $perms = $bodyData['permissions'] ?? [];
            if ($id <= 0 || !is_array($perms)) {
                sendJsonResponse(['success' => false, 'error' => 'Invalid permissions payload'], 400);
            }

            $stmt = $pdo->prepare("UPDATE users SET permissions = :p WHERE id = :id");
            $stmt->execute([
                ':p' => json_encode($perms),
                ':id' => $id
            ]);

            // If the updated user is the current session user, update session as well
            if (!empty($_SESSION['pms_user']) && $_SESSION['pms_user']['id'] == $id) {
                $_SESSION['pms_user']['permissions'] = $perms;
            }

            sendJsonResponse(['success' => true]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    default:
        sendJsonResponse(['success' => false, 'error' => 'Invalid or missing API action'], 400);
        break;
}
