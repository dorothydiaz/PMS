<?php
/**
 * Sign Depot Creative Operations — Modular Sidebar Component
 * File: pages/includes/sidebar.php
 */
require_once dirname(__DIR__, 2) . '/includes/auth.php';
$base = function_exists('getBasePath') ? getBasePath() : '../';
$pagesBase = function_exists('getPagesPath') ? getPagesPath() : (($base === './') ? './pages/' : './');
$cur = $currentPage ?? 'dashboard';
$u = getCurrentUser();
$roleName = $u ? ucfirst(str_replace('_', ' ', $u['role'])) : 'Guest';
?>
<aside class="sidebar" id="appSidebar">
  <div class="sidebar-brand">
    <a href="<?= $base ?>index.php" class="brand-link" id="brandHomeLink" title="Sign Depot">
      <img src="<?= $base ?>assets/img/sign-depot-logo.png" alt="Sign Depot Logo" class="brand-logo-img">
    </a>
    <div class="sidebar-header-actions">
      <!-- Desktop Collapse Button -->
      <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Toggle Sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M9 3v18"></path>
          <polyline class="toggle-arrow" points="15 9 12 12 15 15"></polyline>
        </svg>
      </button>
      <!-- Mobile Close Button (Closes drawer on mobile) -->
      <button class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close Navigation" title="Close Menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>

  <nav class="sidebar-nav">
    <!-- 1. HOME -->
    <div class="nav-section-label">HOME</div>
    <?php if (hasPermission('dashboard', 'r')): ?>
    <a class="nav-item <?= ($cur === 'dashboard') ? 'active' : '' ?>" href="<?= $base ?>index.php" data-view="view-dashboard" data-page="view-dashboard" title="Dashboard">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      </span>
      <span class="nav-label">Dashboard</span>
    </a>
    <?php endif; ?>

    <!-- 2. SALES -->
    <?php if (hasPermission('sales-requests', 'r')): ?>
    <div class="nav-section-label">SALES</div>

    <a class="nav-item <?= ($cur === 'sales-requests') ? 'active' : '' ?>" href="<?= $pagesBase ?>sales-requests.php" data-view="view-sales-requests" data-page="view-sales-requests" title="Sales Requests">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </span>
      <span class="nav-label">Sales Requests</span>
    </a>
    <?php endif; ?>

    <!-- 3. DESIGN -->
    <?php if (hasPermission('creatives-tracker', 'r') || hasPermission('artist-workload', 'r') || hasPermission('directives-details', 'r')): ?>
    <div class="nav-section-label">DESIGN</div>

    <?php if (hasPermission('creatives-tracker', 'r')): ?>
    <a class="nav-item <?= ($cur === 'creatives-tracker') ? 'active' : '' ?>" href="<?= $pagesBase ?>creatives-production.php" data-view="view-creatives-tracker" data-page="view-creatives-tracker" title="Creatives Tracker">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </span>
      <span class="nav-label">Creatives Tracker</span>
    </a>
    <?php endif; ?>

    <?php if (hasPermission('artist-workload', 'r')): ?>
    <a class="nav-item <?= ($cur === 'artist-workload') ? 'active' : '' ?>" href="<?= $pagesBase ?>artist-workload.php" data-view="view-artist-workload" data-page="view-artist-workload" title="Artist Workload">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </span>
      <span class="nav-label">Artist Workload</span>
    </a>
    <?php endif; ?>

    <?php if (hasPermission('directives-details', 'r')): ?>
    <a class="nav-item <?= ($cur === 'directives-details') ? 'active' : '' ?>" href="<?= $pagesBase ?>directives-details.php" data-view="view-directives-details" data-page="view-directives-details" title="Directive Details">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      </span>
      <span class="nav-label">Directive Details</span>
    </a>
    <?php endif; ?>
    <?php endif; ?>

    <!-- 4. ANALYTICS & REPORTS -->
    <?php if (hasPermission('monthly-output', 'r') || hasPermission('reports', 'r')): ?>
    <div class="nav-section-label">ANALYTICS & REPORTS</div>

    <?php if (hasPermission('monthly-output', 'r')): ?>
    <a class="nav-item <?= ($cur === 'monthly-output') ? 'active' : '' ?>" href="<?= $pagesBase ?>monthly-output.php" data-view="view-monthly-output" data-page="view-monthly-output" title="Monthly Output">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </span>
      <span class="nav-label">Monthly Output</span>
    </a>
    <?php endif; ?>

    <?php if (hasPermission('reports', 'r')): ?>
    <a class="nav-item <?= ($cur === 'reports') ? 'active' : '' ?>" href="<?= $pagesBase ?>reports.php" data-view="view-reports" data-page="view-reports" title="Reports">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
      </span>
      <span class="nav-label">Reports</span>
    </a>
    <?php endif; ?>
    <?php endif; ?>

    <!-- 5. ADMINISTRATION -->
    <?php if (hasPermission('access-control', 'r') || hasPermission('audit-trail', 'r') || hasPermission('settings', 'r')): ?>
    <div class="nav-section-label">ADMINISTRATION</div>

    <?php if (hasPermission('access-control', 'r')): ?>
    <a class="nav-item <?= ($cur === 'access-control') ? 'active' : '' ?>" href="<?= $pagesBase ?>access-control.php" data-view="view-access-control" data-page="view-access-control" title="Access Control">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </span>
      <span class="nav-label">Access Control</span>
    </a>
    <?php endif; ?>

    <?php if (hasPermission('audit-trail', 'r')): ?>
    <a class="nav-item <?= ($cur === 'audit-trail') ? 'active' : '' ?>" href="<?= $pagesBase ?>audit-trail.php" data-view="view-audit-trail" data-page="view-audit-trail" title="Audit Trail">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </span>
      <span class="nav-label">Audit Trail</span>
    </a>
    <?php endif; ?>
    <?php endif; ?>

    <!-- 6. SETTINGS & ACCOUNT -->
    <div class="nav-section-label">SETTINGS</div>
    <a class="nav-item <?= ($cur === 'settings' || $cur === 'account-settings') ? 'active' : '' ?>" href="<?= $pagesBase ?>settings.php" data-view="view-settings" data-page="view-settings" title="Settings & Account">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </span>
      <span class="nav-label">Settings</span>
    </a>
  </nav>
</aside>
