/**
 * Sign Depot Creative Operations — Modular Component Loader (Sidebar & Navbar)
 * File: pages/includes/components.js
 * Automatically renders, binds, and manages responsive navigation for all pages
 * Works seamlessly via file:/// protocol and HTTP/HTTPS servers
 */

(function () {
  'use strict';

  // Determine current page and folder depth
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const pathParts = currentPath.split('/');
  const currentFilename = (pathParts.pop() || 'index.html').toLowerCase().split('?')[0].split('#')[0];
  const isInsidePagesFolder = pathParts.some(p => p.toLowerCase() === 'pages') || currentPath.toLowerCase().includes('/pages/');

  const rootPrefix = isInsidePagesFolder ? '../' : '';
  const pagesPrefix = isInsidePagesFolder ? '' : 'pages/';

  // Configuration map for every page in the suite
  const PAGE_CONFIG = {
    'index.html': {
      view: 'view-dashboard',
      title: 'Project Dashboard',
      badge: 'Live Status',
      category: 'Operations Overview'
    },
    'sales-requests.html': {
      view: 'view-sales-requests',
      title: 'Sales Requests',
      badge: 'Direct Inline Editable',
      category: 'Manage and track your operations'
    },
    'creatives-tracker.html': {
      view: 'view-creatives-tracker',
      title: 'Creatives Tracker',
      badge: 'Live Production Queue',
      category: 'Manage and track your operations'
    },
    'artist-workload.html': {
      view: 'view-artist-workload',
      title: 'Artist Workload',
      badge: 'Capacity & Assignments',
      category: 'Manage and track your operations'
    },
    'directives-details.html': {
      view: 'view-directives-details',
      title: 'Directives Details',
      badge: 'Official Job Order Blueprint',
      category: 'Sign Depot Technical Documentation'
    },
    'pending-artist.html': {
      view: 'view-pending-artist',
      title: 'Pending — Artist',
      badge: 'Drafting Queue',
      category: 'Pending Creative Pipelines'
    },
    'pending-sales.html': {
      view: 'view-pending-sales',
      title: 'Pending — Sales',
      badge: 'Awaiting Release',
      category: 'Pending Sales Pipelines'
    },
    'monthly-output.html': {
      view: 'view-monthly-output',
      title: 'Monthly Output',
      badge: 'Annual Production Matrix',
      category: 'Historical Production Records'
    },
    'settings.html': {
      view: 'view-settings',
      title: 'Settings',
      badge: 'Configuration',
      category: 'System Administration'
    }
  };

  const currentPage = PAGE_CONFIG[currentFilename] || PAGE_CONFIG['index.html'];

  function buildSidebarHTML() {
    const isAct = (file) => currentFilename === file ? ' active' : '';

    return `
<aside class="sidebar" id="appSidebar">
  <div class="sidebar-brand">
    <a href="${rootPrefix}index.html" class="brand-link" id="brandHomeLink" title="Sign Depot">
      <img src="${rootPrefix}assets/img/sign-depot-logo.png" alt="Sign Depot Logo" class="brand-logo-img">
    </a>
    <div class="sidebar-header-actions">
      <!-- Desktop Collapse Button -->
      <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Toggle Sidebar" aria-label="Toggle Sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M9 3v18"></path>
          <polyline class="toggle-arrow" points="15 9 12 12 15 15"></polyline>
        </svg>
      </button>
      <!-- Mobile Close Button (Prominent X on mobile) -->
      <button class="sidebar-close-btn" id="sidebarCloseBtn" aria-label="Close Navigation Menu" title="Close Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section-label">Operations</div>
    
    <a class="nav-item${isAct('index.html')}" href="${rootPrefix}index.html" data-view="view-dashboard" data-page="view-dashboard" title="Dashboard">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      </span>
      <span class="nav-label">Project Dashboard</span>
    </a>

    <a class="nav-item${isAct('sales-requests.html')}" href="${pagesPrefix}sales-requests.html" data-view="view-sales-requests" data-page="view-sales-requests" title="Sales Requests">
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

    <a class="nav-item${isAct('creatives-tracker.html')}" href="${pagesPrefix}creatives-tracker.html" data-view="view-creatives-tracker" data-page="view-creatives-tracker" title="Creatives Tracker">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </span>
      <span class="nav-label">Creatives Tracker</span>
    </a>

    <a class="nav-item${isAct('artist-workload.html')}" href="${pagesPrefix}artist-workload.html" data-view="view-artist-workload" data-page="view-artist-workload" title="Artist Workload">
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

    <div class="nav-section-label">Directives</div>

    <a class="nav-item${isAct('directives-details.html')}" href="${pagesPrefix}directives-details.html" data-view="view-directives-details" data-page="view-directives-details" title="Directives Details">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      </span>
      <span class="nav-label">Directives Details</span>
    </a>

    <div class="nav-section-label">Pending Queues</div>

    <a class="nav-item${isAct('pending-artist.html')}" href="${pagesPrefix}pending-artist.html" data-view="view-pending-artist" data-page="view-pending-artist" title="Pending Artist">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </span>
      <span class="nav-label">Pending — Artist</span>
    </a>

    <a class="nav-item${isAct('pending-sales.html')}" href="${pagesPrefix}pending-sales.html" data-view="view-pending-sales" data-page="view-pending-sales" title="Pending Sales">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </span>
      <span class="nav-label">Pending — Sales</span>
    </a>

    <div class="nav-section-label">Analytics & Config</div>

    <a class="nav-item${isAct('monthly-output.html')}" href="${pagesPrefix}monthly-output.html" data-view="view-monthly-output" data-page="view-monthly-output" title="Monthly Output">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </span>
      <span class="nav-label">Monthly Output</span>
    </a>

    <a class="nav-item${isAct('settings.html')}" href="${pagesPrefix}settings.html" data-view="view-settings" data-page="view-settings" title="Settings">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </span>
      <span class="nav-label">Settings</span>
    </a>
  </nav>

  <div class="sidebar-footer">
    <span class="badge-prototype">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      Live Inline Editable
    </span>
  </div>
</aside>
`;
  }

  function buildNavbarHTML(containerEl) {
    const category = containerEl?.getAttribute('data-category') || currentPage.category;
    const title = containerEl?.getAttribute('data-title') || currentPage.title;
    const badge = containerEl?.getAttribute('data-badge') || currentPage.badge;

    return `
<header class="topbar" id="appTopbar">
  <div class="topbar-left">
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open Navigation" title="Toggle Navigation Menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    <div class="page-header-info">
      <span class="page-category-tag" id="pageCategoryTag">${category}</span>
      <h1 class="module-title" id="moduleTitle">
        <span class="module-title-text" id="moduleTitleText">${title}</span>
        <span class="module-badge" id="moduleCategoryBadge">${badge}</span>
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
    <div class="auto-save-pill" title="Every table edit is automatically saved">
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
          <a href="${pagesPrefix}creatives-tracker.html" class="deadline-alert-view-all">View Tracker &rarr;</a>
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
        <div class="dropdown-item" id="btnQuickDirectiveSample">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><rect x="6" y="14" width="12" height="8"></rect></svg>
          Load Sample Directive (URAL)
        </div>
        <div class="dropdown-item" id="btnResetLocalStorage">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
          Reset Mock Data
        </div>
        <div class="dropdown-divider"></div>
        <a href="${pagesPrefix}settings.html" class="dropdown-item" id="btnGotoSettings" style="text-decoration: none; color: inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          System Settings
        </a>
      </div>
    </div>
  </div>
</header>
`;
  }

  // Inject or replace components in the DOM
  function renderComponents() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    if (sidebarContainer) {
      sidebarContainer.innerHTML = buildSidebarHTML();
    } else {
      const existingSidebar = document.getElementById('appSidebar');
      if (existingSidebar) {
        existingSidebar.outerHTML = buildSidebarHTML();
      }
    }

    const navbarContainer = document.getElementById('navbarContainer');
    if (navbarContainer) {
      navbarContainer.innerHTML = buildNavbarHTML(navbarContainer);
    } else {
      const existingTopbar = document.getElementById('appTopbar') || document.querySelector('.topbar');
      if (existingTopbar) {
        existingTopbar.outerHTML = buildNavbarHTML(null);
      }
    }

    // Ensure Backdrop element exists
    ensureBackdrop();

    // Check desktop saved collapse preference
    applyDesktopCollapseState();
  }

  function ensureBackdrop() {
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }
    return backdrop;
  }

  function openMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = ensureBackdrop();
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('sidebar-open');
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  }

  function toggleMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  }

  function toggleDesktopSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    try {
      localStorage.setItem('SIGN_DEPOT_SIDEBAR_COLLAPSED', isCollapsed ? '1' : '0');
    } catch (e) {}
  }

  function applyDesktopCollapseState() {
    if (window.innerWidth > 992) {
      try {
        if (localStorage.getItem('SIGN_DEPOT_SIDEBAR_COLLAPSED') === '1') {
          const sidebar = document.getElementById('appSidebar');
          if (sidebar) sidebar.classList.add('collapsed');
        }
      } catch (e) {}
    }
  }

  // Universal Document Event Delegation for 100% Reliable Interactions
  function bindGlobalEvents() {
    document.addEventListener('click', function (e) {
      // 1. Mobile Menu Button
      const menuBtn = e.target.closest('#mobileMenuBtn, .mobile-menu-btn');
      if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileSidebar();
        return;
      }

      // 2. Mobile Close Button
      const closeBtn = e.target.closest('#sidebarCloseBtn, .sidebar-close-btn');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileSidebar();
        return;
      }

      // 3. Desktop Sidebar Collapse Toggle
      const collapseBtn = e.target.closest('#sidebarCollapseBtn, .sidebar-collapse-btn');
      if (collapseBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (window.innerWidth <= 992) {
          closeMobileSidebar();
        } else {
          toggleDesktopSidebar();
        }
        return;
      }

      // 4. Backdrop Tap (Closes Mobile Drawer)
      if (e.target.closest('.sidebar-backdrop')) {
        closeMobileSidebar();
        return;
      }

      // 5. Sidebar Nav Item Tap on Mobile (Automatically dismisses drawer upon navigation)
      if (e.target.closest('.sidebar-nav .nav-item') && window.innerWidth <= 992) {
        closeMobileSidebar();
      }
    });

    // Close on Escape Key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('appSidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          closeMobileSidebar();
        }
      }
    });

    // Handle Window Resizing Across Media Query Thresholds
    window.addEventListener('resize', function () {
      if (window.innerWidth > 992) {
        closeMobileSidebar();
        applyDesktopCollapseState();
      } else {
        const sidebar = document.getElementById('appSidebar');
        if (sidebar) sidebar.classList.remove('collapsed');
      }
    });
  }

  // Initialize immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderComponents();
      bindGlobalEvents();
    });
  } else {
    renderComponents();
    bindGlobalEvents();
  }

  // Export helper functions to window for direct script interaction
  window.SignDepotNav = {
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    toggleDesktopSidebar,
    renderComponents
  };

})();
