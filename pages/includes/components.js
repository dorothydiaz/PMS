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
  const rawFilename = (pathParts.pop() || 'index.php').toLowerCase().split('?')[0].split('#')[0];
  const isInsidePagesFolder = pathParts.some(p => p.toLowerCase() === 'pages') || currentPath.toLowerCase().includes('/pages/');

  const isPhp = rawFilename.endsWith('.php') || window.location.href.includes('.php') || typeof window.PMS_API_URL !== 'undefined';
  const ext = isPhp ? '.php' : '.html';
  const rootPrefix = isInsidePagesFolder ? '../' : './';
  const pagesPrefix = isInsidePagesFolder ? '' : 'pages/';
  const baseKey = rawFilename.replace(/\.(html|php)$/i, '');
  const currentFilename = baseKey + ext;

  // Configuration map for every page in the suite
  const BASE_PAGE_CONFIG = {
    'index': {
      view: 'view-dashboard',
      title: 'Project Dashboard',
      badge: 'Live Status',
      category: 'Operations Overview'
    },
    'sales-requests': {
      view: 'view-sales-requests',
      title: 'Sales Requests',
      badge: 'Direct Inline Editable',
      category: 'Manage and track your operations'
    },
    'creatives-tracker': {
      view: 'view-creatives-tracker',
      title: 'Creatives Tracker',
      badge: 'Live Production Queue',
      category: 'Manage and track your operations'
    },
    'artist-workload': {
      view: 'view-artist-workload',
      title: 'Artist Workload',
      badge: 'Capacity & Assignments',
      category: 'Manage and track your operations'
    },
    'directives-details': {
      view: 'view-directives-details',
      title: 'Directives Details',
      badge: 'Official Job Order Blueprint',
      category: 'Sign Depot Technical Documentation'
    },
    'monthly-output': {
      view: 'view-monthly-output',
      title: 'Monthly Output',
      badge: 'Annual Production Matrix',
      category: 'Historical Production Records'
    },
    'reports': {
      view: 'view-reports',
      title: 'Reports',
      badge: 'Operational Intelligence',
      category: 'Analytics & Reports'
    },
    'access-control': {
      view: 'view-access-control',
      title: 'Access Control',
      badge: 'RBAC & CRUD Permissions',
      category: 'System Administration'
    },
    'audit-trail': {
      view: 'view-audit-trail',
      title: 'Audit Trail',
      badge: 'Security Activity Log',
      category: 'System Administration'
    },
    'settings': {
      view: 'view-settings',
      title: 'Settings',
      badge: 'Configuration',
      category: 'System Administration'
    }
  };

  const currentPage = BASE_PAGE_CONFIG[baseKey] || BASE_PAGE_CONFIG['index'];

  function buildSidebarHTML() {
    const isAct = (key) => baseKey === key ? ' active' : '';

    return `
<aside class="sidebar" id="appSidebar">
  <div class="sidebar-brand">
    <a href="${rootPrefix}index${ext}" class="brand-link" id="brandHomeLink" title="Sign Depot">
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
    <!-- 1. HOME -->
    <div class="nav-section-label">HOME</div>
    
    <a class="nav-item${isAct('index') || isAct('dashboard')}" href="${rootPrefix}index${ext}" data-view="view-dashboard" data-page="view-dashboard" title="Dashboard">
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

    <!-- 2. SALES -->
    <div class="nav-section-label">SALES</div>

    <a class="nav-item${isAct('sales-requests')}" href="${pagesPrefix}sales-requests${ext}" data-view="view-sales-requests" data-page="view-sales-requests" title="Sales Requests">
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

    <!-- 3. DESIGN -->
    <div class="nav-section-label">DESIGN</div>

    <a class="nav-item${isAct('creatives-tracker')}" href="${pagesPrefix}creatives-production${ext}" data-view="view-creatives-tracker" data-page="view-creatives-tracker" title="Creatives Tracker">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </span>
      <span class="nav-label">Creatives Tracker</span>
    </a>

    <a class="nav-item${isAct('artist-workload')}" href="${pagesPrefix}artist-workload${ext}" data-view="view-artist-workload" data-page="view-artist-workload" title="Artist Workload">
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

    <a class="nav-item${isAct('directives-details')}" href="${pagesPrefix}directives-details${ext}" data-view="view-directives-details" data-page="view-directives-details" title="Directive Details">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      </span>
      <span class="nav-label">Directive Details</span>
    </a>

    <!-- 4. ANALYTICS & REPORTS -->
    <div class="nav-section-label">ANALYTICS & REPORTS</div>

    <a class="nav-item${isAct('monthly-output')}" href="${pagesPrefix}monthly-output${ext}" data-view="view-monthly-output" data-page="view-monthly-output" title="Monthly Output">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </span>
      <span class="nav-label">Monthly Output</span>
    </a>

    <a class="nav-item${isAct('reports')}" href="${pagesPrefix}reports${ext}" data-view="view-reports" data-page="view-reports" title="Reports">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
      </span>
      <span class="nav-label">Reports</span>
    </a>

    <!-- 5. ADMINISTRATION -->
    <div class="nav-section-label">ADMINISTRATION</div>

    <a class="nav-item${isAct('access-control')}" href="${pagesPrefix}access-control${ext}" data-view="view-access-control" data-page="view-access-control" title="Access Control">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </span>
      <span class="nav-label">Access Control</span>
    </a>

    <a class="nav-item${isAct('audit-trail')}" href="${pagesPrefix}audit-trail${ext}" data-view="view-audit-trail" data-page="view-audit-trail" title="Audit Trail">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </span>
      <span class="nav-label">Audit Trail</span>
    </a>

    <a class="nav-item${isAct('settings')}" href="${pagesPrefix}settings${ext}" data-view="view-settings" data-page="view-settings" title="Settings">
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
`;
  }

  function buildNavbarHTML(containerEl) {
    const category = containerEl?.getAttribute('data-category') || currentPage.category;
    const title = containerEl?.getAttribute('data-title') || currentPage.title;
    const badge = containerEl?.getAttribute('data-badge') || currentPage.badge;

    return `
<header class="topbar" id="appTopbar">
  <div class="topbar-left">
    <div class="page-header-info">
      <span class="page-category-tag" id="pageCategoryTag">${category}</span>
      <h1 class="module-title" id="moduleTitle">
        <span class="module-title-text" id="moduleTitleText">${title}</span>
        <span class="module-badge" id="moduleCategoryBadge">${badge}</span>
      </h1>
    </div>
  </div>

  <div class="topbar-right">
    <!-- Live Auto-Save Indicator -->
    <div class="auto-save-pill" >
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
          <a href="${pagesPrefix}creatives-production${ext}" class="deadline-alert-view-all">View Tracker &rarr;</a>
        </div>
      </div>
    </div>

    <!-- Global Search -->
    <div class="global-search-container">
      <svg class="global-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="search" name="q_search" class="global-search-input" id="globalSearchInput" placeholder="Quick search..." autocomplete="off" data-lpignore="true" data-form-type="other">
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
        <a href="${pagesPrefix}settings${ext}" class="dropdown-item" id="btnGotoSettings" style="text-decoration: none; color: inherit;">
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
    } else if (!document.getElementById('appSidebar')) {
      const appContainer = document.querySelector('.app-container') || document.body;
      appContainer.insertAdjacentHTML('afterbegin', buildSidebarHTML());
    }

    const navbarContainer = document.getElementById('navbarContainer');
    if (navbarContainer) {
      navbarContainer.innerHTML = buildNavbarHTML(navbarContainer);
    } else if (!document.getElementById('appTopbar') && !document.querySelector('.topbar')) {
      const mainContent = document.querySelector('.main-content') || document.body;
      mainContent.insertAdjacentHTML('afterbegin', buildNavbarHTML(null));
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

  let isTogglingDesktop = false;
  function toggleDesktopSidebar() {
    if (isTogglingDesktop) return;
    isTogglingDesktop = true;
    setTimeout(function () { isTogglingDesktop = false; }, 250);

    const sidebar = document.getElementById('appSidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.contains('collapsed');
    const newState = !isCollapsed;
    sidebar.classList.toggle('collapsed', newState);
    try {
      localStorage.setItem('SIGN_DEPOT_SIDEBAR_COLLAPSED', newState ? '1' : '0');
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

  window.toggleDesktopSidebar = toggleDesktopSidebar;
  window.toggleMobileSidebar = toggleMobileSidebar;
  window.closeMobileSidebar = closeMobileSidebar;
  window.openMobileSidebar = openMobileSidebar;

  // Universal Document Event Delegation for 100% Reliable Interactions
  function bindGlobalEvents() {
    document.addEventListener('click', function (e) {
      // 1. Mobile Menu Button (or Desktop Topbar Menu Toggle)
      const menuBtn = e.target.closest('#mobileMenuBtn, .mobile-menu-btn');
      if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (window.innerWidth <= 992) {
          toggleMobileSidebar();
        } else {
          toggleDesktopSidebar();
        }
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
