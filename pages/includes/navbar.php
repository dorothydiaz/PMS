<?php
/**
 * Sign Depot Creative Operations — Modular Universal Topbar / Navbar Component
 * File: pages/includes/navbar.php
 */
$base = function_exists('getBasePath') ? getBasePath() : '../';
$pageTitle = $pageTitle ?? 'Project Dashboard';
$pageCategory = $pageCategory ?? 'Operations Overview';
$pageBadge = $pageBadge ?? 'MySQL Live';
?>
<header class="topbar" id="appTopbar">
  <div class="topbar-left">
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open Navigation" title="Toggle Navigation Menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    <div class="page-header-info">
      <span class="page-category-tag" id="pageCategoryTag"><?= htmlspecialchars($pageCategory) ?></span>
      <h1 class="module-title" id="moduleTitle">
        <span class="module-title-text" id="moduleTitleText"><?= htmlspecialchars($pageTitle) ?></span>
        <span class="module-badge" id="moduleCategoryBadge"><?= htmlspecialchars($pageBadge) ?></span>
      </h1>
    </div>
  </div>

  <div class="topbar-right">
    <!-- Timeframe Pills (Today | This Week | This Month) like Panze -->
    <div class="timeframe-pill-group">
      <button class="timeframe-btn" data-timeframe="today">Today</button>
      <button class="timeframe-btn" data-timeframe="week">This Week</button>
      <button class="timeframe-btn active" data-timeframe="month">This Month</button>
      <button class="timeframe-btn" data-timeframe="all">All Time</button>
    </div>

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
          <a href="<?= $base ?>creatives-tracker.php" class="deadline-alert-view-all">View Tracker &rarr;</a>
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
    <div class="user-profile-menu">
      <button class="user-profile-btn" id="userProfileBtn" aria-label="User Profile Menu">
        <div class="user-avatar">DC</div>
        <div class="user-meta">
          <span class="user-name">Ed</span>
          <span class="user-role">Creative Lead</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="dropdown-popover" id="userProfileDropdown">
        <a href="<?= $base ?>directives-details.php" class="dropdown-item" id="btnQuickDirectiveSample" style="text-decoration:none; color:inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><rect x="6" y="14" width="12" height="8"></rect></svg>
          Directives Blueprint Sheet
        </a>
        <a href="<?= $base ?>database/import.php" class="dropdown-item" style="text-decoration:none; color:inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
          MySQL Database Status
        </a>
        <div class="dropdown-divider"></div>
        <a href="<?= $base ?>settings.php" class="dropdown-item" id="btnGotoSettings" style="text-decoration: none; color: inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          System Settings
        </a>
      </div>
    </div>
  </div>
</header>
