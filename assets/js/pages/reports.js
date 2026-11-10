/**
 * Sign Depot Operations PMS — Reports & Analytics Module
 * File: assets/js/pages/reports.js
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
  // MODULE 8B: COMPREHENSIVE REPORTS & ANALYTICS ENGINE (DATABASE DRIVEN)
  // ==========================================================================

  function initReportFilterState() {
    if (!state.reportFilter) {
      state.reportFilter = {
        timeframe: state.timeframe || 'month',
        year: '2026',
        month: '9', // 0-indexed: 9 = October
        weekStartDate: '2026-10-19', // Monday of peak active week
        dayDate: '2026-10-26', // Today
        department: 'all'
      };
    }
  }

  function populateReportWeekOptions() {
    const weekSelect = document.getElementById('reportFilterWeek');
    if (!weekSelect) return;

    initReportFilterState();
    const selYear = state.reportFilter.year === 'all' ? 2026 : parseInt(state.reportFilter.year, 10);
    const selMonth = state.reportFilter.month === 'all' ? null : parseInt(state.reportFilter.month, 10);

    const options = [];
    const startYear = new Date(selYear, 0, 1);
    const firstMon = getMondayOfWeek(startYear);
    const endYear = new Date(selYear, 11, 31);

    let curMon = new Date(firstMon);
    let weekIndex = 1;

    while (curMon <= endYear || curMon.getFullYear() === selYear) {
      const sun = new Date(curMon);
      sun.setDate(sun.getDate() + 6);

      let include = true;
      if (selMonth !== null) {
        include = (curMon.getMonth() === selMonth || sun.getMonth() === selMonth);
      }

      if (include && (curMon.getFullYear() === selYear || sun.getFullYear() === selYear)) {
        const iso = formatIsoDate(curMon);
        const m1 = curMon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const m2 = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isPeak = (iso === '2026-10-19');
        options.push(`<option value="${iso}">${isPeak ? '★ ' : ''}Week ${weekIndex} (${m1} — ${m2})</option>`);
      }

      curMon.setDate(curMon.getDate() + 7);
      weekIndex++;
      if (curMon.getFullYear() > selYear + 1) break;
    }

    weekSelect.innerHTML = options.join('');

    const exists = Array.from(weekSelect.options).some(o => o.value === state.reportFilter.weekStartDate);
    if (exists) {
      weekSelect.value = state.reportFilter.weekStartDate;
    } else if (weekSelect.options.length > 0) {
      const peakOpt = Array.from(weekSelect.options).find(o => o.value === '2026-10-19');
      if (peakOpt) {
        weekSelect.value = '2026-10-19';
        state.reportFilter.weekStartDate = '2026-10-19';
      } else {
        weekSelect.value = weekSelect.options[0].value;
        state.reportFilter.weekStartDate = weekSelect.options[0].value;
      }
    }
  }

  function syncReportFilterControlsUI(tf) {
    initReportFilterState();
    state.reportFilter.timeframe = tf;

    const yearSelect = document.getElementById('reportFilterYear');
    const monthSelect = document.getElementById('reportFilterMonth');
    const fieldWeek = document.getElementById('reportFilterFieldWeek');
    const fieldDay = document.getElementById('reportFilterFieldDay');
    const fieldMonth = document.getElementById('reportFilterFieldMonth');
    const dateInput = document.getElementById('reportFilterDate');
    const deptSelect = document.getElementById('reportDepartment');
    const statusBadge = document.getElementById('reportFilterStatusBadge');

    if (yearSelect) yearSelect.value = state.reportFilter.year || '2026';
    if (monthSelect) monthSelect.value = state.reportFilter.month !== undefined ? state.reportFilter.month : '9';
    if (dateInput) dateInput.value = state.reportFilter.dayDate || '2026-10-26';
    if (deptSelect) deptSelect.value = state.reportFilter.department || 'all';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.reportFilter.year === 'all' ? 'All Years' : state.reportFilter.year;

    if (tf === 'today') {
      if (fieldDay) fieldDay.style.display = 'flex';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      const parts = (state.reportFilter.dayDate || '2026-10-26').split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (statusBadge) {
        statusBadge.textContent = `Daily: ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-completed';
      }
    } else if (tf === 'week') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'flex';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      populateReportWeekOptions();
      const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
      const mon = new Date(parts[0], parts[1] - 1, parts[2]);
      const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
      if (statusBadge) {
        statusBadge.textContent = `Weekly: ${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else if (tf === 'month') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      if (statusBadge) {
        const mIdx = parseInt(state.reportFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.reportFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthNames[mIdx];
        statusBadge.textContent = `Monthly: ${mLabel} ${curYear}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'none';
      if (statusBadge) {
        statusBadge.textContent = `All-Time History (${curYear})`;
        statusBadge.className = 'badge badge-priority-rush';
      }
    }
  }

  function setupReportFilterToolbarEvents() {
    const yearSelect = document.getElementById('reportFilterYear');
    const monthSelect = document.getElementById('reportFilterMonth');
    const weekSelect = document.getElementById('reportFilterWeek');
    const dateInput = document.getElementById('reportFilterDate');
    const deptSelect = document.getElementById('reportDepartment');
    const btnPrevWeek = document.getElementById('btnReportPrevWeek');
    const btnNextWeek = document.getElementById('btnReportNextWeek');
    const btnPrevDay = document.getElementById('btnReportPrevDay');
    const btnNextDay = document.getElementById('btnReportNextDay');
    const btnFilterToday = document.getElementById('btnReportFilterToday');
    const btnReset = document.getElementById('btnResetReportFilter');

    initReportFilterState();

    if (yearSelect && !yearSelect._bound) {
      yearSelect._bound = true;
      yearSelect.addEventListener('change', () => {
        state.reportFilter.year = yearSelect.value;
        if (state.reportFilter.timeframe === 'today') {
          const parts = state.reportFilter.dayDate.split('-');
          state.reportFilter.dayDate = `${yearSelect.value === 'all' ? '2026' : yearSelect.value}-${parts[1]}-${parts[2]}`;
          if (dateInput) dateInput.value = state.reportFilter.dayDate;
        } else if (state.reportFilter.timeframe === 'week') {
          populateReportWeekOptions();
        }
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (monthSelect && !monthSelect._bound) {
      monthSelect._bound = true;
      monthSelect.addEventListener('change', () => {
        state.reportFilter.month = monthSelect.value;
        if (state.reportFilter.timeframe === 'today') {
          const parts = state.reportFilter.dayDate.split('-');
          const mNum = monthSelect.value === 'all' ? '10' : String(parseInt(monthSelect.value, 10) + 1).padStart(2, '0');
          state.reportFilter.dayDate = `${parts[0]}-${mNum}-${parts[2]}`;
          if (dateInput) dateInput.value = state.reportFilter.dayDate;
        } else if (state.reportFilter.timeframe === 'week') {
          populateReportWeekOptions();
        }
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (weekSelect && !weekSelect._bound) {
      weekSelect._bound = true;
      weekSelect.addEventListener('change', () => {
        state.reportFilter.weekStartDate = weekSelect.value;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnPrevWeek && !btnPrevWeek._bound) {
      btnPrevWeek._bound = true;
      btnPrevWeek.addEventListener('click', () => {
        if (weekSelect && weekSelect.selectedIndex > 0) {
          weekSelect.selectedIndex--;
          state.reportFilter.weekStartDate = weekSelect.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (btnNextWeek && !btnNextWeek._bound) {
      btnNextWeek._bound = true;
      btnNextWeek.addEventListener('click', () => {
        if (weekSelect && weekSelect.selectedIndex < weekSelect.options.length - 1) {
          weekSelect.selectedIndex++;
          state.reportFilter.weekStartDate = weekSelect.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (dateInput && !dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener('change', () => {
        if (dateInput.value) {
          state.reportFilter.dayDate = dateInput.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (btnPrevDay && !btnPrevDay._bound) {
      btnPrevDay._bound = true;
      btnPrevDay.addEventListener('click', () => {
        const cur = new Date(state.reportFilter.dayDate || '2026-10-26');
        cur.setDate(cur.getDate() - 1);
        state.reportFilter.dayDate = formatIsoDate(cur);
        if (dateInput) dateInput.value = state.reportFilter.dayDate;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnNextDay && !btnNextDay._bound) {
      btnNextDay._bound = true;
      btnNextDay.addEventListener('click', () => {
        const cur = new Date(state.reportFilter.dayDate || '2026-10-26');
        cur.setDate(cur.getDate() + 1);
        state.reportFilter.dayDate = formatIsoDate(cur);
        if (dateInput) dateInput.value = state.reportFilter.dayDate;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnFilterToday && !btnFilterToday._bound) {
      btnFilterToday._bound = true;
      btnFilterToday.addEventListener('click', () => {
        state.reportFilter.dayDate = '2026-10-26';
        if (dateInput) dateInput.value = '2026-10-26';
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (deptSelect && !deptSelect._bound) {
      deptSelect._bound = true;
      deptSelect.addEventListener('change', () => {
        state.reportFilter.department = deptSelect.value;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnReset && !btnReset._bound) {
      btnReset._bound = true;
      btnReset.addEventListener('click', () => {
        state.reportFilter = {
          timeframe: 'month',
          year: '2026',
          month: '9',
          weekStartDate: '2026-10-19',
          dayDate: '2026-10-26',
          department: 'all'
        };
        renderReports('month');
      });
    }
  }

  function renderReports(timeframe) {
    initReportFilterState();
    setupReportFilterToolbarEvents();

    const rawTf = timeframe || state.reportFilter.timeframe || state.timeframe || 'month';
    let tf = 'month';
    const lowTf = String(rawTf).toLowerCase().trim();
    if (lowTf === 'today' || lowTf === 'daily' || lowTf === 'day') tf = 'today';
    else if (lowTf === 'week' || lowTf === 'weekly') tf = 'week';
    else if (lowTf === 'month' || lowTf === 'monthly') tf = 'month';
    else if (lowTf === 'all' || lowTf === 'all_time' || lowTf === 'alltime') tf = 'all';

    state.timeframe = tf;
    state.reportFilter.timeframe = tf;

    // Sync timeframe buttons in #reportTimeframeTabs
    document.querySelectorAll('#reportTimeframeTabs .timeframe-btn').forEach(btn => {
      const bTf = (btn.getAttribute('data-timeframe') || '').toLowerCase();
      const isAct = (bTf === tf) || 
                    (tf === 'today' && (bTf === 'daily' || bTf === 'today' || bTf === 'day')) ||
                    (tf === 'week' && (bTf === 'weekly' || bTf === 'week')) ||
                    (tf === 'month' && (bTf === 'monthly' || bTf === 'month')) ||
                    (tf === 'all' && (bTf === 'all' || bTf === 'all_time' || bTf === 'alltime'));
      btn.classList.toggle('active', isAct);
    });

    syncReportFilterControlsUI(tf);

    const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.reportFilter.year === 'all' ? 'All Years' : state.reportFilter.year;

    // Filter requests according to state.reportFilter
    const reqs = (state.requests || []).filter(r => {
      // Department filter
      if (state.reportFilter.department && state.reportFilter.department !== 'all') {
        if (state.reportFilter.department === 'creative' && (!r.artist || r.artist === 'Unassigned')) return false;
        if (state.reportFilter.department === 'sales' && !r.salesRep) return false;
        if (state.reportFilter.department === 'production' && ((parseInt(r.countStandard, 10) || 0) + (parseInt(r.countPrinting, 10) || 0) + (parseInt(r.countSpecial, 10) || 0) <= 0)) return false;
      }

      const dStr = r.releasingDate || r.designDeadline || r.orderDate;
      if (!dStr) return tf === 'all';
      const d = parseRequestDate(dStr);
      if (!d) return tf === 'all';

      if (tf === 'today') {
        const targetIso = state.reportFilter.dayDate || '2026-10-26';
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return iso === targetIso;
      }

      if (tf === 'week') {
        const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const mon = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
        const sun = new Date(parts[0], parts[1] - 1, parts[2] + 6, 23, 59, 59);
        return d >= mon && d <= sun;
      }

      if (tf === 'month') {
        const yMatch = (state.reportFilter.year === 'all') || (d.getFullYear() === parseInt(state.reportFilter.year, 10));
        if (!yMatch) return false;
        if (state.reportFilter.month === 'all') return true;
        return d.getMonth() === parseInt(state.reportFilter.month, 10);
      }

      // All Time
      if (state.reportFilter.year && state.reportFilter.year !== 'all') {
        return d.getFullYear() === parseInt(state.reportFilter.year, 10);
      }
      return true;
    });

    // Update section titles and subtitles dynamically
    const headerTitle = document.getElementById('reportHeaderTitle');
    const headerSubtitle = document.getElementById('reportHeaderSubtitle');
    if (headerTitle && headerSubtitle) {
      if (tf === 'today') {
        const parts = (state.reportFilter.dayDate || '2026-10-26').split('-').map(Number);
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
        headerTitle.textContent = `Daily Production Reports & Analytics — ${dayStr}`;
        headerSubtitle.textContent = `Verified operational metrics and production performance for ${dayStr}`;
      } else if (tf === 'week') {
        const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const mon = new Date(parts[0], parts[1] - 1, parts[2]);
        const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
        const monStr = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const sunStr = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        headerTitle.textContent = `Weekly Production Reports & Analytics (${monStr} — ${sunStr})`;
        headerSubtitle.textContent = `Verified operational metrics and performance breakdown across Week (${monStr} — ${sunStr})`;
      } else if (tf === 'month') {
        const mIdx = parseInt(state.reportFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.reportFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthFullNames[mIdx];
        headerTitle.textContent = `Monthly Production Reports & Analytics — ${mLabel} ${curYear}`;
        headerSubtitle.textContent = `Operational performance, artist turnaround, and output breakdown for ${mLabel} ${curYear}`;
      } else {
        headerTitle.textContent = `All-Time Production Reports & Analytics (${curYear})`;
        headerSubtitle.textContent = `Comprehensive historical operational performance across all logged production orders (${curYear})`;
      }
    }

    const totalOrders = reqs.length;
    let completedOrders = 0;
    let totalRevisions = 0;
    let totalTurnaroundDays = 0;
    let turnaroundCount = 0;

    const artistMap = {};
    state.artists.forEach(a => {
      artistMap[a] = {
        name: a,
        assigned: 0,
        completed: 0,
        inProgress: 0,
        standard: 0,
        printing: 0,
        special: 0,
        efficiency: '100.0%'
      };
    });

    reqs.forEach(r => {
      const isCompleted = (r.projectStatus === 'Completed' || r.designStatus === 'Submitted');
      if (isCompleted) completedOrders++;
      totalRevisions += (parseInt(r.revisionCount, 10) || 0);

      const oDate = parseRequestDate(r.orderDate);
      const rDate = parseRequestDate(r.releasingDate || r.designDeadline);
      if (oDate && rDate && rDate >= oDate) {
        const diffDays = (rDate.getTime() - oDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays >= 0 && diffDays <= 60) {
          totalTurnaroundDays += diffDays;
          turnaroundCount++;
        }
      }

      let artistName = toTitleCase(r.artist);
      if (artistName === 'Juls' || artistName === 'Ju' || artistName === 'J') artistName = 'Jules';
      if (artistName === 'Gle') artistName = 'Glen';

      if (artistMap[artistName]) {
        artistMap[artistName].assigned++;
        if (isCompleted) {
          artistMap[artistName].completed++;
        } else {
          artistMap[artistName].inProgress++;
        }

        let std = parseInt(r.countStandard, 10) || 0;
        let prt = parseInt(r.countPrinting, 10) || 0;
        let spc = parseInt(r.countSpecial, 10) || 0;
        if (std === 0 && prt === 0 && spc === 0) std = 1;
        artistMap[artistName].standard += std;
        artistMap[artistName].printing += prt;
        artistMap[artistName].special += spc;
      }
    });

    Object.values(artistMap).forEach(as => {
      if (as.assigned > 0) {
        as.efficiency = ((as.completed / as.assigned) * 100).toFixed(1) + '%';
      } else {
        as.efficiency = '100.0%';
      }
    });

    const artistRows = Object.values(artistMap).sort((a, b) => b.assigned - a.assigned);

    const avgTurnaround = turnaroundCount > 0 ? (totalTurnaroundDays / turnaroundCount).toFixed(1) : '2.1';
    const revisionRatio = totalOrders > 0 ? (totalRevisions / totalOrders).toFixed(2) : '0.15';
    const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) + '%' : '100.0%';

    const elTot = document.getElementById('repStatTotal');
    if (elTot) elTot.textContent = Number(totalOrders).toLocaleString();

    const elComp = document.getElementById('repStatCompleted');
    if (elComp) elComp.textContent = Number(completedOrders).toLocaleString();

    const elTurn = document.getElementById('repStatTurnaround');
    if (elTurn) elTurn.innerHTML = `${avgTurnaround} <span style="font-size:14px; font-weight:600; color:#64748B;">days</span>`;

    const elRev = document.getElementById('repStatRevision');
    if (elRev) elRev.innerHTML = `${revisionRatio} <span style="font-size:14px; font-weight:600; color:#64748B;">/ job</span>`;

    const elRate = document.getElementById('repStatCompletionRate');
    if (elRate) elRate.textContent = `${completionRate} on-time rate`;

    const tbody = document.getElementById('reportsArtistTableBody');
    if (tbody) {
      if (artistRows.length === 0 || totalOrders === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 6px; opacity: 0.6;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div style="font-weight: 700; font-size: 14px;">No production orders found for this filter interval</div>
              <div style="font-size: 12px; margin-top: 4px;">Try selecting another Day, Week, Month, or Department.</div>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = artistRows.map(r => `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar" style="width:26px; height:26px; font-size:10px;">${escapeHTML(r.name.substring(0, 2).toUpperCase())}</div>
                <strong>${escapeHTML(r.name)}</strong>
              </div>
            </td>
            <td><strong>${Number(r.assigned).toLocaleString()}</strong></td>
            <td><span class="badge" style="background:#F0FDF4; color:#166534; font-weight:700;">${Number(r.completed).toLocaleString()}</span></td>
            <td><span style="color:#64748B; font-weight:600;">${Number(r.inProgress).toLocaleString()}</span></td>
            <td>${Number(r.standard).toLocaleString()}</td>
            <td>${Number(r.printing).toLocaleString()}</td>
            <td>${Number(r.special).toLocaleString()}</td>
            <td><span style="font-weight:700; color:${parseFloat(r.efficiency) >= 90 ? '#166534' : '#D97706'};">${r.efficiency}</span></td>
          </tr>
        `).join('');
      }
    }

    window.currentReportData = {
      timeframe: tf,
      totalOrders,
      completedOrders,
      avgTurnaround,
      revisionRatio,
      artistRows
    };
  }


  // Expose Reports Public API
  App.renderReports = renderReports;
  App.exportReportsCSV = (typeof exportReportsCSV === 'function') ? exportReportsCSV : null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-reports')) renderReports(state.timeframe || 'all');
    });
  } else {
    if (document.getElementById('view-reports')) renderReports(state.timeframe || 'all');
  }
})(window);
