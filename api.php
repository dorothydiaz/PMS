<?php
/**
 * Sign Depot Operations PMS — RESTful JSON API
 * Connects frontend UI to MySQL database (pms_db)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendJsonResponse(['success' => false, 'error' => 'Database connection failed'], 500);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

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

            // Total Requests
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests");
            $total = (int)$stmt->fetchColumn();

            // Pending Approval
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests WHERE client_approval = 'Pending' OR project_status = 'Pending'");
            $pending = (int)$stmt->fetchColumn();

            // Working / Ongoing
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests WHERE project_status IN ('On-going', 'Ongoing', 'In Progress', 'Working')");
            $ongoing = (int)$stmt->fetchColumn();

            // Approved
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests WHERE client_approval = 'Approved' OR project_status = 'Approved'");
            $approved = (int)$stmt->fetchColumn();

            // Revising
            $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests WHERE project_status = 'Revising' OR design_status = 'Revising'");
            $revising = (int)$stmt->fetchColumn();

            // Overdue
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM sales_requests WHERE design_deadline != '' AND design_deadline < :today AND project_status NOT IN ('Completed', 'Approved')");
            $stmt->execute([':today' => $today]);
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

            // Artist filter
            $artist = trim($_GET['artist'] ?? $bodyData['artist'] ?? '');
            if (!empty($artist)) {
                $where[] = "artist = :artist";
                $params[':artist'] = $artist;
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
                    'designStatus' => $r['design_status'],
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
            $stmt = $pdo->query("SELECT * FROM sales_requests ORDER BY id DESC LIMIT 500");
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
                    'designStatus' => $r['design_status'],
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
            $id = trim($_POST['id'] ?? $bodyData['id'] ?? '');
            $field = trim($_POST['field'] ?? $bodyData['field'] ?? '');
            $value = trim($_POST['value'] ?? $bodyData['value'] ?? '');

            if (empty($id) || empty($field)) {
                sendJsonResponse(['success' => false, 'error' => 'Missing ID or field name'], 400);
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

            $stmt = $pdo->prepare("UPDATE sales_requests SET `$col` = :val WHERE `id` = :id1 OR `request_id` = :id2");
            $stmt->execute([':val' => $value, ':id1' => $id, ':id2' => $id]);

            sendJsonResponse(['success' => true, 'message' => "Field $field updated successfully"]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'create_request':
        try {
            $data = !empty($bodyData) ? $bodyData : $_POST;

            $reqId = trim($data['requestId'] ?? $data['request_id'] ?? '');
            if (empty($reqId)) {
                // Auto generate
                $stmt = $pdo->query("SELECT COUNT(*) FROM sales_requests");
                $count = (int)$stmt->fetchColumn() + 1;
                $reqId = 'LR-26-' . str_pad($count, 4, '0', STR_PAD_LEFT);
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
                ':dstat' => trim($data['designStatus'] ?? $data['design_status'] ?? 'Not Started'),
                ':rev' => (int)($data['revisionCount'] ?? $data['revision_count'] ?? 0),
                ':remarks' => trim($data['remarks'] ?? '')
            ]);

            sendJsonResponse(['success' => true, 'id' => $id, 'requestId' => $reqId, 'message' => 'Request created']);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    case 'delete_request':
        try {
            $id = trim($_POST['id'] ?? $bodyData['id'] ?? '');
            if (empty($id)) {
                sendJsonResponse(['success' => false, 'error' => 'Missing ID'], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM sales_requests WHERE id = :id1 OR request_id = :id2");
            $stmt->execute([':id1' => $id, ':id2' => $id]);
            sendJsonResponse(['success' => true, 'message' => 'Request deleted']);
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
            $stmt = $pdo->query("SELECT name FROM sales_reps ORDER BY name ASC");
            $reps = $stmt->fetchAll(PDO::FETCH_COLUMN);
            sendJsonResponse(['success' => true, 'data' => $reps]);
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

    default:
        sendJsonResponse(['success' => false, 'error' => 'Invalid or missing API action'], 400);
        break;
}
