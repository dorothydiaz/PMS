<?php
/**
 * Sign Depot Operations PMS — Shared Footer & Scripts
 * Location: pages/includes/footer.php
 */
$base = function_exists('getBasePath') ? getBasePath() : '../';
?>
  </div><!-- /.app-container -->

  <?php require_once __DIR__ . '/modals.php'; ?>

  <!-- Global Application API Endpoints & Current User Configuration -->
  <script>
    window.PMS_API_URL = '<?= $base ?>api.php';
    window.PMS_BASE_URL = '<?= $base ?>';
    window.PMS_CURRENT_USER = <?= json_encode(function_exists('getCurrentUser') ? getCurrentUser() : null) ?>;
  </script>

  <!-- Modular Component Loader & Core Application Scripts -->
  <script src="<?= $base ?>pages/includes/components.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>assets/js/script.js?v=<?= time() ?>"></script>
</body>
</html>
