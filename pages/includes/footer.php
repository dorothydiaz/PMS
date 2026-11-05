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

  <div style="text-align:center; padding:12px 0 20px; font-size:11.5px; color:#64748B;">
    <a href="javascript:void(0)" onclick="window.SignDepotConsent && window.SignDepotConsent.showBanner(true)" style="color:#64748B; text-decoration:none; display:inline-flex; align-items:center; gap:5px; transition:color 0.15s;" onmouseover="this.style.color='#E60000'" onmouseout="this.style.color='#64748B'">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0-1.5 19.88"></path></svg>
      Cookie & Cache Preferences
    </a>
  </div>

  <!-- Global Application API Endpoints & Current User Configuration -->
  <script>
    window.PMS_API_URL = '<?= $base ?>api.php';
    window.PMS_BASE_URL = '<?= $base ?>';
    window.PMS_CURRENT_USER = <?= json_encode(function_exists('getCurrentUser') ? getCurrentUser() : null) ?>;
    window.PMS_JUST_LOGGED_IN = <?= $justLoggedIn ? 'true' : 'false' ?>;
  </script>

  <!-- Modular Component Loader, Cookie/Cache Manager & Core Application Scripts -->
  <script src="<?= $base ?>assets/js/cookie-cache.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>pages/includes/components.js?v=<?= time() ?>"></script>
  <script src="<?= $base ?>assets/js/script.js?v=<?= time() ?>"></script>
</body>
</html>
