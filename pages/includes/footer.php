<?php
/**
 * Sign Depot Operations PMS — Shared Footer & Scripts
 * Location: pages/includes/footer.php
 */
$base = function_exists('getBasePath') ? getBasePath() : '../';
$justLoggedIn = !empty($_SESSION['pms_first_login_reminder']);
if ($justLoggedIn) {
    unset($_SESSION['pms_first_login_reminder']);
}
?>
  </div><!-- /.app-container -->

  <?php require_once __DIR__ . '/modals.php'; ?>

  <!-- Global Application API Endpoints & Current User Configuration -->
  <script>
    window.PMS_API_URL = '<?= $base ?>api.php';
    window.PMS_BASE_URL = '<?= $base ?>';
    window.PMS_APP_BASE = '<?= function_exists('getAppBaseUrl') ? getAppBaseUrl() : '/' ?>';
    window.PMS_CURRENT_USER = <?= json_encode(function_exists('getCurrentUser') ? getCurrentUser() : null) ?>;
    window.PMS_JUST_LOGGED_IN = <?= $justLoggedIn ? 'true' : 'false' ?>;
  </script>

  <!-- Modular Component Loader, Cookie/Cache Manager & Core Application Scripts -->
  <script src="<?= $base ?>assets/js/cookie-cache.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>assets/js/image-cropper.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>pages/includes/components.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>assets/js/script.js?v=<?= time() ?>"></script>

  <!-- Page-Specific JavaScript Modules -->
  <?php
    $pageScriptMap = [
        'dashboard' => 'dashboard.js',
        'sales-requests' => 'sales-requests.js',
        'print-request' => 'print-request.js',
        'creatives-tracker' => 'creatives-tracker.js',
        'creatives-production' => 'creatives-tracker.js',
        'artist-workload' => 'artist-workload.js',
        'directives-details' => 'directives.js',
        'directive-editor' => 'directives.js',
        'monthly-output' => 'monthly-output.js',
        'reports' => 'reports.js',
        'settings' => 'settings.js',
        'access-control' => 'settings.js',
        'audit-trail' => 'settings.js',
    ];
    $targetScript = isset($currentPage) && isset($pageScriptMap[$currentPage]) ? $pageScriptMap[$currentPage] : null;
  ?>
  <?php if ($targetScript): ?>
    <script src="<?= $base ?>assets/js/pages/<?= $targetScript ?>?v=<?= time() ?>"></script>
  <?php endif; ?>
</body>
</html>
