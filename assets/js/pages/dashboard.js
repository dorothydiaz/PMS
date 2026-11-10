/**
 * Sign Depot Operations PMS — Dashboard Module
 * File: assets/js/pages/dashboard.js
 */

(function (window) {
  'use strict';

  const App = window.SignDepotApp;
  if (!App) return;

  const state = App.state;
  const {
    renderPagination,
    renderEditableCell,
    renderInlineSelect,
    renderInlineDate,
    renderInlineNumber,
    showToast,
    showCustomConfirm,
    saveStateToStorage,
    escapeHTML,
    toTitleCase,
    isOverdue,
    getDeadlineAlertStatus,
    getAvailabilityBadge,
    canUserAccessTab,
    canUserAccessModule,
    hasPermission,
    isCurrentUserSuperAdmin,
    getLoggedInArtist,
    getLoggedInSalesRep,
    syncFilterSelectUI,
    upgradeAllFilterSelects,
    upgradeAllFormSelects,
    syncAllFormDropdowns,
    syncFormDropdownBtn,
    openDirectiveForJo,
    editSalesRequest,
    deleteSalesRequest,
    downloadCsv
  } = App.utils || App;

  const {
    STORAGE_KEY,
    DEFAULT_ARTISTS,
    DEFAULT_SALES_REPS,
    PROJECT_STATUSES,
    DESIGN_STATUSES,
    PRIORITY_LEVELS,
    APPROVAL_LEVELS,
    FILE_STATUS_LEVELS,
    PLACEMENT_OPTIONS,
    RELEASING_MODES,
    HEAD_APPROVAL_LEVELS
  } = App.constants || {};

  // ==========================================================================
  // MODULE 1: DASHBOARD ENGINE (Panze Studio Layout + Live Inline Editable)
  // ==========================================================================

  function renderDashboard() {
    updateDashboardKPIs();
    renderProgressTimeline();
    renderRecentActivityFeed();
    renderPanzeDonutChart();
    renderDashboardWorkloadSnapshot();
    renderDashboardRecentProjectsTable();
  }

  function getKpiFilteredRequests(type) {
    const reqs = state.requests || [];
    if (type === 'pending') {
      return reqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
    }
    if (type === 'working') {
      return reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
    }
    if (type === 'approved' || type === 'completed') {
      return reqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved');
    }
    if (type === 'revising') {
      return reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
    }
    if (type === 'overdue') {
      return reqs.filter(r => isOverdue(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate));
    }
    return reqs; // 'all'
  }

  function updateDashboardKPIs() {
    const reqs = state.requests;
    const totalRequests = reqs.length;
    const pendingApproval = reqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending').length;
    const working = reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const approved = reqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved').length;
    const revising = reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;
    const overdue = reqs.filter(r => isOverdue(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate)).length;

    // Creatives Tracker KPI scoping for logged-in artist
    const myArtist = getLoggedInArtist();
    const trackerReqs = myArtist ? reqs.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase()) : reqs;
    const trkTotal = trackerReqs.length;
    const trkPending = trackerReqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending').length;
    const trkWorking = trackerReqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const trkApproved = trackerReqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved').length;
    const trkRevising = trackerReqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;
    const trkOverdue = trackerReqs.filter(r => isOverdue(r.designDeadline, r.projectStatus, r.artistAccepted, r.artistAcceptedDate, r.orderDate)).length;

    // Dashboard elements
    const elTot = document.getElementById('kpiTotalRequests');
    const elPend = document.getElementById('kpiPendingApproval');
    const elWork = document.getElementById('kpiWorking');
    const elAppr = document.getElementById('kpiApproved');
    const elComp = document.getElementById('kpiCompleted');
    const elRev = document.getElementById('kpiRevising');
    const elOver = document.getElementById('kpiOverdue');

    // Creatives Tracker KPI elements
    const elTotTrk = document.getElementById('kpiTotalRequestsTracker'); if (elTotTrk) elTotTrk.textContent = Number(trkTotal).toLocaleString();
    const elPendTrk = document.getElementById('kpiPendingApprovalTracker'); if (elPendTrk) elPendTrk.textContent = Number(trkPending).toLocaleString();
    const elWorkTrk = document.getElementById('kpiWorkingTracker'); if (elWorkTrk) elWorkTrk.textContent = Number(trkWorking).toLocaleString();
    const elApprTrk = document.getElementById('kpiApprovedTracker'); if (elApprTrk) elApprTrk.textContent = Number(trkApproved).toLocaleString();
    const elRevTrk = document.getElementById('kpiRevisingTracker'); if (elRevTrk) elRevTrk.textContent = Number(trkRevising).toLocaleString();
    const elOverTrk = document.getElementById('kpiOverdueTracker'); if (elOverTrk) elOverTrk.textContent = Number(trkOverdue).toLocaleString();

    // Live MySQL real-time KPI sync when backend is available
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_stats')
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.stats) {
            const s = res.stats;
            if (elTot && s.total !== undefined) elTot.textContent = Number(s.total).toLocaleString();
            if (elPend && s.pending !== undefined) elPend.textContent = Number(s.pending).toLocaleString();
            if (elWork && s.ongoing !== undefined) elWork.textContent = Number(s.ongoing).toLocaleString();
            if (elAppr && s.approved !== undefined) elAppr.textContent = Number(s.approved).toLocaleString();
            if (elComp && s.approved !== undefined) elComp.textContent = Number(s.approved).toLocaleString();
            if (elRev && s.revising !== undefined) elRev.textContent = Number(s.revising).toLocaleString();
            if (elOver && s.overdue !== undefined) elOver.textContent = Number(s.overdue).toLocaleString();
          }
        })
        .catch(() => {});
    } else {
      // Pure offline fallback
      if (elTot) elTot.textContent = Number(totalRequests).toLocaleString();
      if (elPend) elPend.textContent = Number(pendingApproval).toLocaleString();
      if (elWork) elWork.textContent = Number(working).toLocaleString();
      if (elAppr) elAppr.textContent = Number(approved).toLocaleString();
      if (elComp) elComp.textContent = Number(approved).toLocaleString();
      if (elRev) elRev.textContent = Number(revising).toLocaleString();
      if (elOver) elOver.textContent = Number(overdue).toLocaleString();
    }
  }

  // ==========================================================================
  // PROGRESS TIMELINE RENDERER (100% Real Database Queries)
  // ==========================================================================
  function renderProgressTimeline(timelinePayload) {
    const container = document.getElementById('progressTimelineChartContainer');
    if (!container) return;

    const data = timelinePayload || window.__TIMELINE_DATA_CACHE || window.__INITIAL_TIMELINE_DATA;
    if (!data && window.PMS_API_URL && !container._fetchingTimeline) {
      container._fetchingTimeline = true;
      fetch(window.PMS_API_URL + '?action=get_progress_timeline')
        .then(r => r.json())
        .then(res => {
          container._fetchingTimeline = false;
          if (res && res.success) {
            window.__TIMELINE_DATA_CACHE = res;
            renderProgressTimeline(res);
          }
        })
        .catch(() => {
          container._fetchingTimeline = false;
        });
      return;
    }

    const days = (data && Array.isArray(data.timeline) && data.timeline.length === 7) 
      ? data.timeline 
      : [
          { key: 'M', name: 'Monday', created: 0, completed: 0, x: 48 },
          { key: 'T', name: 'Tuesday', created: 0, completed: 0, x: 128 },
          { key: 'W', name: 'Wednesday', created: 0, completed: 0, x: 208 },
          { key: 'T', name: 'Thursday', created: 0, completed: 0, x: 288 },
          { key: 'F', name: 'Friday', created: 0, completed: 0, x: 368 },
          { key: 'S', name: 'Saturday', created: 0, completed: 0, x: 448 },
          { key: 'S', name: 'Sunday', created: 0, completed: 0, x: 518 }
        ];

    // Peak & Subtitle headers from real database metrics
    const titleEl = document.getElementById('timelineHighlightTitle');
    if (titleEl && data && data.peakTitle) {
      titleEl.textContent = data.peakTitle;
    }
    const subtitleEl = document.getElementById('timelineHighlightSubtitle');
    if (subtitleEl && data && data.peakSubtitle) {
      subtitleEl.textContent = data.peakSubtitle;
    }

    const chartW = 560;
    const chartH = 160;
    const axisY = 132;
    
    // Scale max value dynamically according to real database data
    const maxDataVal = Math.max(
      ...days.map(d => Math.max(Number(d.created) || 0, Number(d.completed) || 0)),
      1
    );
    const maxVal = Math.max(5, Math.ceil(maxDataVal * 1.25));

    const getY = (val) => {
      const plotH = 96;
      const num = Number(val) || 0;
      return Math.round(axisY - (num / maxVal) * plotH);
    };

    // Smooth cardinal/cubic Bezier spline generator (high subpixel precision)
    const getSmoothSpline = (pts, tension = 0.22) => {
      if (!pts || pts.length === 0) return '';
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
      let path = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i < pts.length - 2 ? pts[i + 2] : p2;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
      }
      return path;
    };

    // Find current active day index or default to today's weekday
    let currentDayIndex = days.findIndex(d => d.isCurrent);
    if (currentDayIndex === -1) {
      currentDayIndex = 4; // Default Friday
    }
    const activeDaysCount = Math.min(Math.max(currentDayIndex + 1, 1), 7);

    // Active completed curve (Mon up to active day)
    const activeCompletedDays = days.slice(0, activeDaysCount);
    const completedPts = activeCompletedDays.map(d => ({ x: d.x, y: getY(d.completed) }));
    const dCompletedLine = getSmoothSpline(completedPts, 0.24);
    const currentDayPt = completedPts[completedPts.length - 1];
    const mon = completedPts[0];
    const dCompletedArea = `${dCompletedLine} L ${currentDayPt.x} ${axisY} L ${mon.x} ${axisY} Z`;

    // Created tasks curve (Mon - Sun full week)
    const createdPts = days.map(d => ({ x: d.x, y: getY(d.created) }));
    const dCreated = getSmoothSpline(createdPts, 0.20);

    container.innerHTML = `
      <svg class="timeline-chart-svg" viewBox="0 0 ${chartW} ${chartH}" shape-rendering="geometricPrecision">
        <!-- Vertical Day Grid Lines -->
        ${days.map(d => `<line class="timeline-grid-line" x1="${d.x}" y1="18" x2="${d.x}" y2="${axisY}" shape-rendering="geometricPrecision" />`).join('')}

        <!-- Bottom Axis -->
        <line class="timeline-axis-line" x1="24" y1="${axisY}" x2="${chartW - 24}" y2="${axisY}" shape-rendering="geometricPrecision" />

        <!-- Day Tick Marks -->
        ${days.map(d => `<line class="timeline-tick-line" x1="${d.x}" y1="${axisY - 4}" x2="${d.x}" y2="${axisY + 3}" stroke-linecap="round" shape-rendering="geometricPrecision" />`).join('')}

        <!-- Day Labels (M, T, W, T, F, S, S) -->
        ${days.map(d => `<text class="timeline-day-label" x="${d.x}" y="${axisY + 18}">${d.key}</text>`).join('')}

        <!-- Task Created Path (Smooth Dashed Gray Line) -->
        <path class="timeline-path-created" d="${dCreated}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision" />

        <!-- Task Completed Area Fill (Soft Translucent Tint) -->
        <path class="timeline-area-completed" fill="rgba(79, 70, 229, 0.08)" d="${dCompletedArea}" shape-rendering="geometricPrecision" />

        <!-- Task Completed Path (Smooth Solid Indigo Wave) -->
        <path class="timeline-path-completed" d="${dCompletedLine}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision" />

        <!-- Current Active Day Indicator (Vertical Marker to Axis) -->
        <line class="timeline-current-marker" x1="${currentDayPt.x}" y1="${currentDayPt.y}" x2="${currentDayPt.x}" y2="${axisY + 2}" vector-effect="non-scaling-stroke" stroke-linecap="round" shape-rendering="geometricPrecision" />

        <!-- Projection Dotted Line across remainder of week -->
        ${activeDaysCount < 7 ? `<line class="timeline-projection-line" x1="${currentDayPt.x}" y1="${currentDayPt.y}" x2="${chartW - 30}" y2="${currentDayPt.y}" vector-effect="non-scaling-stroke" stroke-linecap="round" shape-rendering="geometricPrecision" />` : ''}

        <!-- Interactive Data Points on Active Days -->
        ${activeCompletedDays.map(d => `
          <circle class="timeline-data-point" cx="${d.x}" cy="${getY(d.completed)}" r="${d.isPeak ? 5.5 : 4}"
            data-day="${escapeHTML(d.name)}" data-completed="${d.completed}" data-created="${d.created}"
            vector-effect="non-scaling-stroke" shape-rendering="geometricPrecision"
            onmouseenter="window.SignDepotApp.showTimelineTooltip(event, '${d.name}', ${d.completed}, ${d.created})"
            onmouseleave="window.SignDepotApp.hideTimelineTooltip()" />
        `).join('')}
      </svg>
      <div id="timelineTooltipEl" class="timeline-tooltip"></div>
    `;
  }

  function showTimelineTooltip(e, dayName, completed, created) {
    const tip = document.getElementById('timelineTooltipEl');
    if (!tip) return;
    tip.innerHTML = `<strong>${escapeHTML(dayName)}</strong>: <span style="color:#818CF8; font-weight:700;">${completed} Completed</span> • <span style="color:#94A3B8;">${created} Created</span>`;
    const rect = e.target.getBoundingClientRect();
    const parent = e.target.closest('.timeline-chart-wrap');
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    tip.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
    tip.style.top = `${rect.top - parentRect.top}px`;
    tip.classList.add('visible');
  }

  function hideTimelineTooltip() {
    const tip = document.getElementById('timelineTooltipEl');
    if (tip) tip.classList.remove('visible');
  }

  // ==========================================================================
  // RECENT ACTIVITY & UPDATES FEED RENDERER (100% Real Database Logs)
  // ==========================================================================
  let currentActivityFilter = 'all';

  function renderRecentActivityFeed(filter = currentActivityFilter, force = false) {
    currentActivityFilter = filter;
    const feed = document.getElementById('recentActivityFeedList');
    if (!feed) return;

    // Sync filter pills
    document.querySelectorAll('#activityFilterTabs [data-act-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-act-filter') === filter);
    });

    if (!feed._cachedLogs && window.__INITIAL_AUDIT_LOGS && Array.isArray(window.__INITIAL_AUDIT_LOGS)) {
      feed._cachedLogs = window.__INITIAL_AUDIT_LOGS;
    }

    if (window.PMS_API_URL && (!feed._loadedOnce || force)) {
      feed._loadedOnce = true;
      fetch(window.PMS_API_URL + '?action=get_recent_activity')
        .then(r => r.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.logs)) {
            feed._cachedLogs = res.logs;
          }
          buildActivityFeedDOM(filter);
        })
        .catch(() => {
          buildActivityFeedDOM(filter);
        });
      return;
    }

    buildActivityFeedDOM(filter);
  }

  function buildActivityFeedDOM(filter) {
    const feed = document.getElementById('recentActivityFeedList');
    if (!feed) return;

    const cachedLogs = feed._cachedLogs || window.__INITIAL_AUDIT_LOGS || [];
    let items = [];

    // Map 100% REAL audit logs from database
    cachedLogs.forEach(l => {
      let type = 'general';
      const m = (l.module || '').toLowerCase();
      if (m.includes('sales')) type = 'orders';
      else if (m.includes('creative') || m.includes('directive') || m.includes('tracker') || m.includes('production') || m.includes('workload')) type = 'creatives';
      else if (m.includes('access') || m.includes('security') || m.includes('auth') || m.includes('user') || m.includes('account')) type = 'security';

      let roleType = 'system';
      const r = (l.role || '').toLowerCase();
      if (r.includes('sales')) roleType = 'sales';
      else if (r.includes('artist')) roleType = 'artist';
      else if (r.includes('admin')) roleType = 'admin';

      // Extract request/project ID if mentioned in description
      let projId = '';
      const descText = l.desc || l.description || '';
      const mId = descText.match(/\b([A-Z]{2}-\d{2}-\d{4})\b/i) || descText.match(/\b([A-Z]\d{6}-\d{3})\b/i);
      if (mId) {
        projId = mId[1].toUpperCase();
      }

      items.push({
        user: l.user || 'System',
        roleType: roleType,
        action: l.action || 'UPDATE',
        module: l.module || 'System',
        desc: escapeHTML(descText),
        projectId: projId,
        time: l.time ? formatRelativeTime(l.time) : 'Recently',
        type: type,
        timestamp: l.time ? (new Date(String(l.time).replace(/-/g, '/')).getTime() || Date.now()) : Date.now()
      });
    });

    // NOTE: Removed synthetic mock requests loop completely so ONLY real database records are shown.

    // Sort descending by recency
    items.sort((a, b) => b.timestamp - a.timestamp);

    // Apply category filter
    if (filter !== 'all') {
      items = items.filter(it => it.type === filter);
    }

    if (items.length === 0) {
      feed.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:12px;">No activity logged for this category.</div>`;
      return;
    }

    feed.innerHTML = items.slice(0, 15).map(it => {
      const avatarInitial = (it.user || 'S').substring(0, 1).toUpperCase();
      const avatarClass = `activity-avatar-${it.roleType}`;
      const projectPill = it.projectId ? `
        <span class="activity-project-pill" onclick="window.SignDepotApp.filterByDeadlineProject('${it.projectId}')" title="Highlight in table">
          ${escapeHTML(it.projectId)}
        </span>
      ` : '';

      return `
        <div class="activity-feed-item">
          <div class="activity-avatar ${avatarClass}">
            ${escapeHTML(avatarInitial)}
          </div>
          <div class="activity-details">
            <div class="activity-header-line">
              <span class="activity-user-name">${escapeHTML(it.user)}</span>
              <span class="activity-time-ago">${escapeHTML(it.time)}</span>
            </div>
            <div class="activity-desc-text">
              ${it.desc}
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="activity-module-tag">${escapeHTML(it.module)}</span>
              ${projectPill}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function formatRelativeTime(dateStr) {
    if (!dateStr) return 'Recently';
    try {
      const s = String(dateStr).trim().replace(/-/g, '/');
      const date = new Date(s);
      if (isNaN(date.getTime())) return 'Recently';
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  }

  // Panze Middle Column: Donut Chart
  function renderPanzeDonutChart() {
    const container = document.getElementById('panzeDonutChartSvgContainer');
    const legend = document.getElementById('panzeDonutLegend');
    if (!container || !legend) return;

    const reqs = state.requests;
    const completed = reqs.filter(r => r.projectStatus === 'Completed').length;
    const inProgress = reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const pending = reqs.filter(r => r.projectStatus === 'Pending').length;
    const revising = reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;

    const total = completed + inProgress + pending + revising || 1;

    // Donut SVG Parameters
    const size = 200;
    const center = size / 2;
    const radius = 70;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    const segCompleted = (completed / total) * circumference;
    const segInProgress = (inProgress / total) * circumference;
    const segPending = (pending / total) * circumference;
    const segRevising = (revising / total) * circumference;

    const offsetCompleted = 0;
    const offsetInProgress = -segCompleted;
    const offsetPending = -(segCompleted + segInProgress);
    const offsetRevising = -(segCompleted + segInProgress + segPending);

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${size} ${size}">
        <!-- Completed (Green) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#10B981" stroke-width="${strokeWidth}"
          stroke-dasharray="${segCompleted} ${circumference}"
          stroke-dashoffset="${offsetCompleted}" />
        <!-- In Progress (Orange / Blue) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#F97316" stroke-width="${strokeWidth}"
          stroke-dasharray="${segInProgress} ${circumference}"
          stroke-dashoffset="${offsetInProgress}" />
        <!-- Pending (Sky Blue) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#0284C7" stroke-width="${strokeWidth}"
          stroke-dasharray="${segPending} ${circumference}"
          stroke-dashoffset="${offsetPending}" />
        <!-- Revising (Purple) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#8B5CF6" stroke-width="${strokeWidth}"
          stroke-dasharray="${segRevising} ${circumference}"
          stroke-dashoffset="${offsetRevising}" />
        <text x="${center}" y="${center + 5}" text-anchor="middle" font-size="22" font-weight="800" fill="#0F172A">${total}</text>
        <text x="${center}" y="${center + 22}" text-anchor="middle" font-size="10" font-weight="700" fill="#64748B">PROJECTS</text>
      </svg>
    `;

    legend.innerHTML = `
      <div class="legend-item"><span class="legend-dot" style="background:#10B981;"></span> Completed: ${completed}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#F97316;"></span> In Progress: ${inProgress}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#0284C7;"></span> Pending: ${pending}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#8B5CF6;"></span> Revising: ${revising}</div>
    `;
  }

  // Panze Right Column: Artist Capacity
  function renderDashboardWorkloadSnapshot() {
    const listEl = document.getElementById('dashboardWorkloadSummaryList');
    if (!listEl) return;

    const reqs = state.requests;
    const summaries = state.artists.slice(0, 5).map(artist => {
      const activeTasks = reqs.filter(r => r.artist === artist && r.projectStatus !== 'Completed').length;
      const capacity = 10;
      const pct = Math.min(Math.round((activeTasks / capacity) * 100), 100);
      const avail = getAvailabilityBadge(activeTasks);
      return { artist, activeTasks, pct, avail };
    });

    listEl.innerHTML = summaries.map(item => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #F1F5F9; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:110px;">
          <div class="user-avatar" style="width:28px; height:28px; font-size:10px;">${escapeHTML(item.artist.substring(0, 2).toUpperCase())}</div>
          <span style="font-weight:700; font-size:13px;">${escapeHTML(item.artist)}</span>
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:600;">
            <span>${item.activeTasks} Active</span>
            <span>${item.pct}%</span>
          </div>
          <div style="height:6px; background:#F1F5F9; border-radius:99px; overflow:hidden;">
            <div style="height:100%; width:${item.pct}%; background:${item.pct >= 80 ? 'var(--accent-red)' : item.pct >= 50 ? '#F59E0B' : 'var(--primary-green)'};"></div>
          </div>
        </div>
        <span class="badge ${item.avail.class}" style="font-size:9.5px;">${item.avail.text}</span>
      </div>
    `).join('');
  }


  function renderDashboardRecentProjectsTable() {
    const tbody = document.getElementById('dashboardRecentProjectsBody');
    if (!tbody) return;

    let list = [...state.requests];
    const search = (state.dashboardSearch || '').toLowerCase();
    const status = state.dashboardStatus || '';

    if (search) {
      list = list.filter(r =>
        r.requestId.toLowerCase().includes(search) ||
        r.joNumber.toLowerCase().includes(search) ||
        r.projectName.toLowerCase().includes(search) ||
        r.client.toLowerCase().includes(search)
      );
    }
    if (status) {
      list = list.filter(r => r.projectStatus === status);
    }
    const deadlineFilter = state.dashboardDeadline || '';
    if (deadlineFilter) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
        if (deadlineFilter === 'overdue') return info.status === 'overdue';
        if (deadlineFilter === 'today') return info.status === 'today';
        if (deadlineFilter === 'soon') return info.status === 'soon';
        return true;
      });
    }

    if (state.dashboardKpiFilter && state.dashboardKpiFilter !== 'all') {
      const kf = state.dashboardKpiFilter;
      if (kf === 'pending') {
        list = list.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
      } else if (kf === 'working') {
        list = list.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
      } else if (kf === 'completed') {
        list = list.filter(r => r.projectStatus === 'Completed');
      } else if (kf === 'revising') {
        list = list.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
      } else if (kf === 'overdue') {
        list = list.filter(r => isOverdue(r.designDeadline, r.projectStatus));
      }
    }

    // Sync active KPI filter banner & card highlights
    const kpiBanner = document.getElementById('activeKpiFilterBanner');
    if (kpiBanner) {
      if (state.dashboardKpiFilter && state.dashboardKpiFilter !== 'all') {
        const labels = {
          pending: 'Pending Approval',
          working: 'Working / On-Going',
          completed: 'Completed',
          revising: 'Revising',
          overdue: 'Overdue'
        };
        const label = labels[state.dashboardKpiFilter] || state.dashboardKpiFilter;
        kpiBanner.style.display = 'inline-flex';
        kpiBanner.innerHTML = `
          <span>Filtered by: <strong>${escapeHTML(label)}</strong> (${list.length} records)</span>
          <button class="clear-kpi-btn" title="Clear filter" onclick="window.SignDepotApp.handleKpiCardClick('all')">&times;</button>
        `;
      } else {
        kpiBanner.style.display = 'none';
        kpiBanner.innerHTML = '';
      }
    }

    const kpiCardMap = {
      all: document.getElementById('kpiCardTotal'),
      pending: document.getElementById('kpiCardPending'),
      working: document.getElementById('kpiCardWorking'),
      completed: document.getElementById('kpiCardCompleted'),
      revising: document.getElementById('kpiCardRevising'),
      overdue: document.getElementById('kpiCardOverdue')
    };
    Object.entries(kpiCardMap).forEach(([k, card]) => {
      if (!card) return;
      const isAct = (state.dashboardKpiFilter || 'all') === k;
      card.classList.toggle('active', isAct);
    });

    const page = state.dashboardPage || 1;
    const perPage = state.dashboardPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'dashboardPaginationInfo',
      controlsId: 'dashboardPaginationControls',
      selectIds: ['dashboardFilterPerPage', 'dashboardPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems: list.length,
      onPageChange: 'window.SignDepotApp.setDashboardPage',
      itemLabel: 'projects'
    });

    state.dashboardPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    if (pagedList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">No projects match current filters.</td></tr>`;
      return;
    }

    const isSuper = isCurrentUserSuperAdmin();
    tbody.innerHTML = pagedList.map(r => `
      <tr data-req-id="${r.id}">
        <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color:var(--primary-green); font-weight:700; white-space:nowrap;')}</td>
        <td>${renderEditableCell(r.id, 'joNumber', r.joNumber, '', 'color:var(--accent-red); font-weight:700; white-space:nowrap;')}</td>
        <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
        <td>${renderEditableCell(r.id, 'client', r.client)}</td>
        <td>${renderInlineSelect(r.id, 'location', r.location || 'Indoor', ['Indoor', 'Outdoor', 'Indoor & Outdoor'])}</td>
        <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
        <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
        <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
        <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
        <td>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">
              Directive
            </button>
            ${isSuper ? `
              <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Project (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA; flex-shrink:0;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }


  // Dashboard Specific Event Listeners
  function initDashboardListeners() {
    const dashSearch = document.getElementById('dashboardSearchInput');
    if (dashSearch) {
      dashSearch.addEventListener('input', () => {
        state.dashboardSearch = dashSearch.value.trim();
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }

    const dashStatus = document.getElementById('dashboardFilterStatus');
    if (dashStatus) {
      dashStatus.addEventListener('change', () => {
        state.dashboardStatus = dashStatus.value;
        if (state.dashboardStatus) state.dashboardKpiFilter = '';
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }

    const dashDeadline = document.getElementById('dashboardFilterDeadline');
    if (dashDeadline) {
      dashDeadline.addEventListener('change', () => {
        state.dashboardDeadline = dashDeadline.value;
        state.dashboardPage = 1;
        document.querySelectorAll('.kpi-card[data-kpi]').forEach(c => {
          const k = c.getAttribute('data-kpi');
          if (c) c.classList.toggle('active', k === state.dashboardDeadline);
        });
        renderDashboardRecentProjectsTable();
      });
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['dashboardFilterPerPage', 'dashboardPaginationPerPage'], (val) => {
        state.dashboardPerPage = val;
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
      });
    }
  }

  // Expose Dashboard Public API
  App.renderDashboard = renderDashboard;
  App.updateDashboardKPIs = updateDashboardKPIs;
  App.renderProgressTimeline = renderProgressTimeline;
  App.renderRecentActivityFeed = renderRecentActivityFeed;
  App.renderDashboardRecentProjectsTable = renderDashboardRecentProjectsTable;
  App.setActivityFilter = (f) => renderRecentActivityFeed(f);
  App.refreshRecentActivity = () => renderRecentActivityFeed(currentActivityFilter, true);
  App.setDashboardPage = (p) => {
    state.dashboardPage = p;
    renderDashboardRecentProjectsTable();
  };
  App.setDashboardPerPage = (pp) => {
    state.dashboardPerPage = pp;
    state.dashboardPage = 1;
    renderDashboardRecentProjectsTable();
  };
  App.filterDashboardDeadlines = (type) => {
    state.dashboardDeadline = (state.dashboardDeadline === type) ? '' : type;
    state.dashboardPage = 1;
    const sel = document.getElementById('dashboardFilterDeadline');
    if (sel) {
      sel.value = state.dashboardDeadline;
      if (typeof syncFilterSelectUI === 'function') syncFilterSelectUI(sel);
    }
    renderDashboardRecentProjectsTable();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDashboardListeners();
      if (document.getElementById('view-dashboard')) renderDashboard();
    });
  } else {
    initDashboardListeners();
    if (document.getElementById('view-dashboard')) renderDashboard();
  }
})(window);
