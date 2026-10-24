<?php
/**
 * Sign Depot Operations PMS — Database & Application Configuration
 */

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Database credentials
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'pms_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Base Paths
define('APP_NAME', 'Sign Depot Operations PMS');
define('APP_ROOT', __DIR__);

/**
 * Returns a singleton PDO connection
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // If database doesn't exist yet, attempt auto-create and import schema
        if (strpos($e->getMessage(), 'Unknown database') !== false || $e->getCode() == 1049) {
            try {
                $rootDsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
                $rootPdo = new PDO($rootDsn, DB_USER, DB_PASS, $options);
                $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                
                $schemaFile = APP_ROOT . '/database/schema.sql';
                if (file_exists($schemaFile)) {
                    $sql = file_get_contents($schemaFile);
                    $rootPdo->exec("USE `" . DB_NAME . "`");
                    $rootPdo->exec($sql);
                }
                // Retry connection
                $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
                return $pdo;
            } catch (Exception $ex) {
                error_log("PMS Database Initialization Error: " . $ex->getMessage());
                die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $ex->getMessage()]));
            }
        }
        error_log("PMS Database Connection Error: " . $e->getMessage());
        return null;
    }

    return $pdo;
}

/**
 * Clean & sanitize text input
 */
function cleanInput($data) {
    if (is_array($data)) {
        return array_map('cleanInput', $data);
    }
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Standard JSON response helper
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Get active relative base URL depending on script depth
 */
function getBasePath() {
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if (strpos($script, '/pages/') !== false) {
        return '../';
    }
    return './';
}
