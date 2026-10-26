<?php
/**
 * Sign Depot Creative Operations — Modular Universal Topbar / Navbar Component
 * File: pages/includes/navbar.php
 */
$base = function_exists('getBasePath') ? getBasePath() : '../';
$pagesBase = function_exists('getPagesPath') ? getPagesPath() : (($base === './') ? './pages/' : './');
$pageTitle = $pageTitle ?? 'Project Dashboard';
$pageCategory = $pageCategory ?? 'Operations Overview';
$pageBadge = $pageBadge ?? 'MySQL Live';
?>
<header class="topbar" id="appTopbar">
  <div class="topbar-left">
    <div class="page-header-info">
      <span class="page-category-tag" id="pageCategoryTag"><?= htmlspecialchars($pageCategory) ?></span>
      <h1 class="module-title" id="moduleTitle">
        <span class="module-title-text" id="moduleTitleText"><?= htmlspecialchars($pageTitle) ?></span>
        <span class="module-badge" id="moduleCategoryBadge"><?= htmlspecialchars($pageBadge) ?></span>
      </h1>
    </div>
  </div>

  <div class="topbar-right">
    <?php if (in_array($currentPage ?? '', ['monthly-output', 'reports'])): ?>
    <!-- Timeframe Pills (Today | This Week | This Month | All Time) like Panze -->
    <div class="timeframe-pill-group" id="navbarTimeframePillGroup">
      <button class="timeframe-btn" data-timeframe="today">Today</button>
      <button class="timeframe-btn" data-timeframe="week">This Week</button>
      <button class="timeframe-btn" data-timeframe="month">This Month</button>
      <button class="timeframe-btn active" data-timeframe="all">All Time</button>
    </div>
    <?php endif; ?>

    <!-- Live Auto-Save Indicator -->
    <div class="auto-save-pill">
      <span class="auto-save-dot"></span>
      <span>Auto-Saved</span>
    </div>

    <!-- Deadline Alert Reminder Notification Bell & Drawer -->
    <div class="deadline-alert-container" id="deadlineAlertContainer">
      <button class="deadline-alert-btn" id="deadlineAlertBtn" aria-label="Deadline Reminders" title="Project Deadlines & Alerts">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span class="deadline-alert-badge has-alerts" id="deadlineAlertBadge" style="display: none;">0</span>
      </button>

      <div class="deadline-alert-dropdown" id="deadlineAlertDropdown">
        <div class="deadline-alert-header">
          <div class="deadline-alert-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Deadline Reminders</span>
          </div>
          <span class="deadline-alert-total-pill" id="deadlineAlertTotalPill">0 Alerts</span>
        </div>

        <div class="deadline-alert-tabs">
          <button class="deadline-tab-btn active" data-alert-tab="all" id="tabAlertAll">All (<span id="countTabAll">0</span>)</button>
          <button class="deadline-tab-btn" data-alert-tab="overdue" id="tabAlertOverdue">Past Due (<span id="countTabOverdue">0</span>)</button>
          <button class="deadline-tab-btn" data-alert-tab="today" id="tabAlertToday">Due Today (<span id="countTabToday">0</span>)</button>
          <button class="deadline-tab-btn" data-alert-tab="soon" id="tabAlertSoon">Almost Due (<span id="countTabSoon">0</span>)</button>
        </div>

        <div class="deadline-alert-list" id="deadlineAlertList">
          <!-- Dynamically populated -->
        </div>

        <div class="deadline-alert-footer">
          <span class="deadline-alert-footer-note">Real-time status based on local time</span>
          <a href="<?= $pagesBase ?>creatives-tracker.php" class="deadline-alert-view-all">View Tracker &rarr;</a>
        </div>
      </div>
    </div>

    <!-- Global Search -->
    <div class="global-search-container">
      <svg class="global-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" class="global-search-input" id="globalSearchInput" placeholder="Quick search..." autocomplete="off">
      <div class="quick-search-results" id="quickSearchResults"></div>
    </div>

    <!-- User Menu -->
    <?php
    $u = function_exists('getCurrentUser') ? getCurrentUser() : null;
    $userName = $u['full_name'] ?? 'User';
    $userRole = $u ? ucfirst(str_replace('_', ' ', $u['role'])) : 'Guest';
    $userAvatar = $u && !empty($u['avatar_url']) 
        ? '<img src="' . htmlspecialchars($u['avatar_url']) . '" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">' 
        : strtoupper(substr($userName, 0, 2));
    ?>
    <div class="user-profile-menu">
      <button class="user-profile-btn" id="userProfileBtn" aria-label="User Profile Menu">
        <div class="user-avatar"><?= $userAvatar ?></div>
        <div class="user-meta">
          <span class="user-name"><?= htmlspecialchars($userName) ?></span>
          <span class="user-role"><?= htmlspecialchars($userRole) ?></span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="dropdown-popover" id="userProfileDropdown">
        <div style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; margin-bottom: 4px;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;"><?= htmlspecialchars($userName) ?></div>
          <div style="font-size: 11px; color: #64748B;"><?= htmlspecialchars($u['email'] ?? '') ?></div>
        </div>
        <?php if (function_exists('hasPermission') && hasPermission('access-control', 'r')): ?>
        <a href="<?= $pagesBase ?>access-control.php" class="dropdown-item" style="text-decoration:none; color:inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Access Control (RBAC)
        </a>
        <?php endif; ?>
        <a href="<?= $pagesBase ?>directives-details.php" class="dropdown-item" id="btnQuickDirectiveSample" style="text-decoration:none; color:inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><rect x="6" y="14" width="12" height="8"></rect></svg>
          Directives Blueprint Sheet
        </a>
        <?php if (function_exists('hasPermission') && hasPermission('settings', 'r')): ?>
        <a href="<?= $pagesBase ?>settings.php" class="dropdown-item" id="btnGotoSettings" style="text-decoration: none; color: inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          System Settings
        </a>
        <?php endif; ?>
        <div class="dropdown-divider"></div>
        <a href="<?= $base ?>logout.php" class="dropdown-item" style="text-decoration:none; color:#DC2626; font-weight:700;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sign Out (<?= htmlspecialchars($u['username'] ?? 'User') ?>)
        </a>
      </div>
    </div>
  </div>
</header>
