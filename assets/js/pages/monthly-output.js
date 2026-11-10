/**
 * Sign Depot Operations PMS — Monthly Output Module
 * File: assets/js/pages/monthly-output.js
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
  // MODULE 8: DATE UTILITIES & TIMEFRAME FILTER ENGINE
  // ==========================================================================

  function parseRequestDate(str) {
    if (!str) return null;
    str = String(str).trim();
    // YYYY-MM-DD
    const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
      return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
    }
    // DD/MM/YYYY
    const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmy) {
      return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
    }
    // Natural date string like September 26, 2026 or Ocotber 13, 2026
    const clean = str.replace(/Ocotber/i, 'October').replace(/,(\d{4})/g, ', $1');
    const ts = Date.parse(clean);
    if (!isNaN(ts)) {
      return new Date(ts);
    }
    return null;
  }

  function getReferenceToday() {
    const now = new Date();
    if (now.getFullYear() !== 2026) {
      return new Date(2026, 9, 26);
    }
    return now;
  }

  function matchesTimeframe(req, tf) {
    if (!tf || tf === 'all') return true;
    const dateStr = req.releasingDate || req.designDeadline || req.orderDate;
    if (!dateStr) return false;
    const d = parseRequestDate(dateStr);
    if (!d) return false;

    const ref = getReferenceToday();

    if (tf === 'today') {
      return d.getFullYear() === ref.getFullYear() &&
             d.getMonth() === ref.getMonth() &&
             d.getDate() === ref.getDate();
    }
    if (tf === 'week') {
      const day = (ref.getDay() + 6) % 7; // Monday = 0
      const startOfWeek = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - day, 0, 0, 0);
      const endOfWeek = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - day + 6, 23, 59, 59);
      return d >= startOfWeek && d <= endOfWeek;
    }
    if (tf === 'month') {
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    }
    return true;
  }

  // ==========================================================================
  // MODULE 8A: PRODUCTION OUTPUT REPORT ENGINE (DAY, WEEK, MONTH, YEAR FILTERS)
  // ==========================================================================

  function formatIsoDate(d) {
    if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '2026-10-26';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getMondayOfWeek(d) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function initOutputFilterState() {
    if (!state.outputFilter) {
      state.outputFilter = {
        timeframe: state.timeframe || 'month',
        year: '2026',
        month: '9', // 0-indexed: 9 = October
        weekStartDate: '2026-10-19', // Monday of peak active week
        dayDate: '2026-10-26' // Today
      };
    }
  }

  function populateOutputWeekOptions() {
    const weekSelect = document.getElementById('outputFilterWeek');
    if (!weekSelect) return;

    initOutputFilterState();
    const selYear = state.outputFilter.year === 'all' ? 2026 : parseInt(state.outputFilter.year, 10);
    const selMonth = state.outputFilter.month === 'all' ? null : parseInt(state.outputFilter.month, 10);

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

    const exists = Array.from(weekSelect.options).some(o => o.value === state.outputFilter.weekStartDate);
    if (exists) {
      weekSelect.value = state.outputFilter.weekStartDate;
    } else if (weekSelect.options.length > 0) {
      const peakOpt = Array.from(weekSelect.options).find(o => o.value === '2026-10-19');
      if (peakOpt) {
        weekSelect.value = '2026-10-19';
        state.outputFilter.weekStartDate = '2026-10-19';
      } else {
        weekSelect.value = weekSelect.options[0].value;
        state.outputFilter.weekStartDate = weekSelect.options[0].value;
      }
    }
  }

  function syncOutputFilterControlsUI(tf) {
    initOutputFilterState();
    state.outputFilter.timeframe = tf;

    const yearSelect = document.getElementById('outputFilterYear');
    const monthSelect = document.getElementById('outputFilterMonth');
    const fieldWeek = document.getElementById('filterFieldWeek');
    const fieldDay = document.getElementById('filterFieldDay');
    const fieldMonth = document.getElementById('filterFieldMonth');
    const dateInput = document.getElementById('outputFilterDate');
    const statusBadge = document.getElementById('outputFilterStatusBadge');

    if (yearSelect) yearSelect.value = state.outputFilter.year || '2026';
    if (monthSelect) monthSelect.value = state.outputFilter.month !== undefined ? state.outputFilter.month : '9';
    if (dateInput) dateInput.value = state.outputFilter.dayDate || '2026-10-26';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.outputFilter.year === 'all' ? 'All Years' : state.outputFilter.year;

    if (tf === 'today') {
      if (fieldDay) fieldDay.style.display = 'flex';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (statusBadge) {
        statusBadge.textContent = `Daily: ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-completed';
      }
    } else if (tf === 'week') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'flex';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      populateOutputWeekOptions();
      const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
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
        const mIdx = parseInt(state.outputFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.outputFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthNames[mIdx];
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

  function setupOutputFilterToolbarEvents() {
    const yearSelect = document.getElementById('outputFilterYear');
    const monthSelect = document.getElementById('outputFilterMonth');
    const weekSelect = document.getElementById('outputFilterWeek');
    const dateInput = document.getElementById('outputFilterDate');
    const btnPrevWeek = document.getElementById('btnPrevWeek');
    const btnNextWeek = document.getElementById('btnNextWeek');
    const btnPrevDay = document.getElementById('btnPrevDay');
    const btnNextDay = document.getElementById('btnNextDay');
    const btnFilterToday = document.getElementById('btnFilterToday');
    const btnReset = document.getElementById('btnResetOutputFilter');

    initOutputFilterState();

    if (yearSelect && !yearSelect._bound) {
      yearSelect._bound = true;
      yearSelect.addEventListener('change', () => {
        state.outputFilter.year = yearSelect.value;
        if (state.outputFilter.timeframe === 'today') {
          const parts = state.outputFilter.dayDate.split('-');
          state.outputFilter.dayDate = `${yearSelect.value === 'all' ? '2026' : yearSelect.value}-${parts[1]}-${parts[2]}`;
          if (dateInput) dateInput.value = state.outputFilter.dayDate;
        } else if (state.outputFilter.timeframe === 'week') {
          populateOutputWeekOptions();
        }
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (monthSelect && !monthSelect._bound) {
      monthSelect._bound = true;
      monthSelect.addEventListener('change', () => {
        state.outputFilter.month = monthSelect.value;
        const selYear = state.outputFilter.year === 'all' ? '2026' : state.outputFilter.year;
        if (monthSelect.value !== 'all') {
          const mNum = parseInt(monthSelect.value, 10) + 1;
          const mStr = String(mNum).padStart(2, '0');
          if (state.outputFilter.timeframe === 'today') {
            state.outputFilter.dayDate = `${selYear}-${mStr}-15`;
            if (dateInput) dateInput.value = state.outputFilter.dayDate;
          } else if (state.outputFilter.timeframe === 'week') {
            populateOutputWeekOptions();
          }
        }
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (weekSelect && !weekSelect._bound) {
      weekSelect._bound = true;
      weekSelect.addEventListener('change', () => {
        state.outputFilter.weekStartDate = weekSelect.value;
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (btnPrevWeek && !btnPrevWeek._bound) {
      btnPrevWeek._bound = true;
      btnPrevWeek.addEventListener('click', () => {
        const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const curMon = new Date(parts[0], parts[1] - 1, parts[2]);
        curMon.setDate(curMon.getDate() - 7);
        state.outputFilter.weekStartDate = formatIsoDate(curMon);
        populateOutputWeekOptions();
        renderMonthlyOutputReport('week');
      });
    }

    if (btnNextWeek && !btnNextWeek._bound) {
      btnNextWeek._bound = true;
      btnNextWeek.addEventListener('click', () => {
        const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const curMon = new Date(parts[0], parts[1] - 1, parts[2]);
        curMon.setDate(curMon.getDate() + 7);
        state.outputFilter.weekStartDate = formatIsoDate(curMon);
        populateOutputWeekOptions();
        renderMonthlyOutputReport('week');
      });
    }

    if (dateInput && !dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener('change', () => {
        if (!dateInput.value) return;
        state.outputFilter.dayDate = dateInput.value;
        const parts = dateInput.value.split('-').map(Number);
        if (yearSelect && parts[0]) {
          yearSelect.value = String(parts[0]);
          state.outputFilter.year = String(parts[0]);
        }
        if (monthSelect && parts[1]) {
          monthSelect.value = String(parts[1] - 1);
          state.outputFilter.month = String(parts[1] - 1);
        }
        renderMonthlyOutputReport('today');
      });
    }

    if (btnPrevDay && !btnPrevDay._bound) {
      btnPrevDay._bound = true;
      btnPrevDay.addEventListener('click', () => {
        const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() - 1);
        state.outputFilter.dayDate = formatIsoDate(d);
        if (dateInput) dateInput.value = state.outputFilter.dayDate;
        renderMonthlyOutputReport('today');
      });
    }

    if (btnNextDay && !btnNextDay._bound) {
      btnNextDay._bound = true;
      btnNextDay.addEventListener('click', () => {
        const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + 1);
        state.outputFilter.dayDate = formatIsoDate(d);
        if (dateInput) dateInput.value = state.outputFilter.dayDate;
        renderMonthlyOutputReport('today');
      });
    }

    if (btnFilterToday && !btnFilterToday._bound) {
      btnFilterToday._bound = true;
      btnFilterToday.addEventListener('click', () => {
        state.outputFilter.dayDate = '2026-10-26';
        state.outputFilter.year = '2026';
        state.outputFilter.month = '9';
        if (dateInput) dateInput.value = '2026-10-26';
        if (yearSelect) yearSelect.value = '2026';
        if (monthSelect) monthSelect.value = '9';
        renderMonthlyOutputReport('today');
      });
    }

    if (btnReset && !btnReset._bound) {
      btnReset._bound = true;
      btnReset.addEventListener('click', () => {
        state.outputFilter = {
          timeframe: 'month',
          year: '2026',
          month: '9',
          weekStartDate: '2026-10-19',
          dayDate: '2026-10-26'
        };
        if (yearSelect) yearSelect.value = '2026';
        if (monthSelect) monthSelect.value = '9';
        if (dateInput) dateInput.value = '2026-10-26';
        populateOutputWeekOptions();
        renderMonthlyOutputReport('month');
        showToast('Filters reset to default (October 2026)');
      });
    }
  }

  function renderMonthlyOutputReport(timeframe) {
    initOutputFilterState();
    setupOutputFilterToolbarEvents();

    const rawTf = timeframe || state.outputFilter.timeframe || state.timeframe || 'month';
    let tf = 'month';
    const lowTf = String(rawTf).toLowerCase().trim();
    if (lowTf === 'today' || lowTf === 'daily' || lowTf === 'day') tf = 'today';
    else if (lowTf === 'week' || lowTf === 'weekly') tf = 'week';
    else if (lowTf === 'month' || lowTf === 'monthly') tf = 'month';
    else if (lowTf === 'all' || lowTf === 'all_time' || lowTf === 'alltime') tf = 'all';

    state.timeframe = tf;
    state.outputFilter.timeframe = tf;

    // Sync timeframe buttons on page and navbar
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
      const bTf = (btn.getAttribute('data-timeframe') || '').toLowerCase();
      const isAct = (bTf === tf) || 
                    (tf === 'today' && (bTf === 'daily' || bTf === 'today' || bTf === 'day')) ||
                    (tf === 'week' && (bTf === 'weekly' || bTf === 'week')) ||
                    (tf === 'month' && (bTf === 'monthly' || bTf === 'month')) ||
                    (tf === 'all' && (bTf === 'all' || bTf === 'all_time' || bTf === 'alltime'));
      btn.classList.toggle('active', isAct);
    });

    // Update filter toolbar controls visibility and values
    syncOutputFilterControlsUI(tf);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // 1. All completed requests
    const allCompleted = (state.requests || []).filter(r => 
      r.projectStatus === 'Completed' || r.designStatus === 'Submitted'
    );

    // Dynamic Elements References
    const reportTitle = document.getElementById('outputReportTitle');
    const reportSubtitle = document.getElementById('outputReportSubtitle');
    const chartTitle = document.getElementById('outputChartTitle');
    const chartSubtitle = document.getElementById('outputChartSubtitle');
    const chartBadge = document.getElementById('outputChartIntervalBadge');
    const matrixTitle = document.getElementById('outputMatrixTitle');
    const matrixBadge = document.getElementById('outputMatrixBadge');
    const thead = document.getElementById('monthlyOutputTableHead');
    const tbody = document.getElementById('monthlyOutputTableBody');
    const tfoot = document.getElementById('monthlyOutputTableFoot');
    const dailyCard = document.getElementById('dailyCompletedTasksCard');

    // KPI Elements
    const kpi1Title = document.getElementById('outputKpi1Title');
    const kpi1Val = document.getElementById('outputYtdTotal');
    const kpi1Desc = document.getElementById('outputKpi1Desc');

    const kpi2Title = document.getElementById('outputKpi2Title');
    const kpi2Val = document.getElementById('outputCurrentMonthTotal');
    const kpi2Desc = document.getElementById('outputKpi2Desc');

    const kpi3Title = document.getElementById('outputKpi3Title');
    const kpi3Val = document.getElementById('outputTopArtistName');
    const kpi3Desc = document.getElementById('outputTopArtistCount');

    const kpi4Title = document.getElementById('outputKpi4Title');
    const kpi4Val = document.getElementById('outputMonthlyAvg');
    const kpi4Desc = document.getElementById('outputKpi4Desc');

    // =========================================================================
    // CASE 1: DAILY / TODAY VIEW (Filtered by specific Day)
    // =========================================================================
    if (tf === 'today') {
      const targetIso = state.outputFilter.dayDate || '2026-10-26';
      const [dy, dm, dd] = targetIso.split('-').map(Number);
      const dateObj = new Date(dy, dm - 1, dd);
      const formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

      if (reportTitle) reportTitle.textContent = `Daily Production Output Report — ${formattedDay}`;
      if (reportSubtitle) reportSubtitle.textContent = `Verified output and completed artist assignments for ${formattedDay}`;
      if (chartTitle) chartTitle.textContent = `Daily Completed Output per Artist (${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      if (chartSubtitle) chartSubtitle.textContent = `Verified assignments finished on ${formattedDay} across all active artists`;
      if (chartBadge) { chartBadge.textContent = 'Daily Interval'; chartBadge.className = 'badge badge-completed'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Daily Production Matrix (${formattedDay})`;
      if (matrixBadge) { matrixBadge.textContent = "Day's Verified Output"; matrixBadge.className = 'badge badge-completed'; }

      // Filter requests completed on the exact target day
      let dayReqs = allCompleted.filter(r => {
        const dStr = r.releasingDate || r.designDeadline || r.orderDate;
        const d = parseRequestDate(dStr);
        if (!d) return false;
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return iso === targetIso;
      });

      // Group by artist
      const artistData = {};
      state.artists.forEach(a => {
        artistData[a] = { artist: a, std: 0, prt: 0, spc: 0, total: 0, revisions: 0 };
      });

      let totalDayOutput = 0;
      let totalStd = 0, totalPrt = 0, totalSpc = 0, totalRev = 0;

      dayReqs.forEach(r => {
        let art = toTitleCase(r.artist);
        if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
        if (art === 'Gle') art = 'Glen';

        if (!artistData[art]) {
          artistData[art] = { artist: art, std: 0, prt: 0, spc: 0, total: 0, revisions: 0 };
        }
        const std = parseInt(r.countStandard, 10) || 0;
        const prt = parseInt(r.countPrinting, 10) || 0;
        const spc = parseInt(r.countSpecial, 10) || 0;
        const cnt = Math.max(std + prt + spc, 1);
        const rev = parseInt(r.revisionCount, 10) || 0;

        artistData[art].std += std;
        artistData[art].prt += prt;
        artistData[art].spc += spc;
        artistData[art].total += cnt;
        artistData[art].revisions += rev;

        totalDayOutput += cnt;
        totalStd += std;
        totalPrt += prt;
        totalSpc += spc;
        totalRev += rev;
      });

      const sortedArtists = Object.values(artistData).sort((a, b) => b.total - a.total);
      const topArt = sortedArtists[0] && sortedArtists[0].total > 0 ? sortedArtists[0].artist : (state.artists[0] || 'Glen');
      const topCount = sortedArtists[0] ? sortedArtists[0].total : 0;
      const activeArtistsCount = sortedArtists.filter(a => a.total > 0).length;

      // Update KPIs
      if (kpi1Title) kpi1Title.textContent = "Selected Day's Output";
      if (kpi1Val) kpi1Val.textContent = Number(totalDayOutput).toLocaleString();
      if (kpi1Desc) kpi1Desc.textContent = `${dayReqs.length} finished job order${dayReqs.length === 1 ? '' : 's'}`;

      if (kpi2Title) kpi2Title.textContent = "Day's Category Mix";
      if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${totalStd} | Prt: ${totalPrt} | Spc: ${totalSpc}</span>`;
      if (kpi2Desc) kpi2Desc.textContent = "Fabrication breakdown";

      if (kpi3Title) kpi3Title.textContent = "Top Producer on Date";
      if (kpi3Val) kpi3Val.textContent = topArt;
      if (kpi3Desc) kpi3Desc.textContent = `${topCount} completed assignment${topCount === 1 ? '' : 's'}`;

      if (kpi4Title) kpi4Title.textContent = "Contributing Artists";
      if (kpi4Val) kpi4Val.textContent = `${activeArtistsCount} / ${state.artists.length}`;
      if (kpi4Desc) kpi4Desc.textContent = "Designers with output on date";

      // Render Table Header
      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Artist</th>
            <th style="text-align:center;">Standard Signage</th>
            <th style="text-align:center;">Large Format Print</th>
            <th style="text-align:center;">Special Fabrication</th>
            <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">Day's Completed</th>
            <th style="text-align:center;">Revisions</th>
            <th style="text-align:center;">Daily Share</th>
            <th style="text-align:center;">Rank</th>
          </tr>
        `;
      }

      // Render Table Body
      if (tbody) {
        tbody.innerHTML = sortedArtists.map((a, idx) => {
          const share = totalDayOutput > 0 ? ((a.total / totalDayOutput) * 100).toFixed(1) : '0.0';
          const isTop = idx === 0 && a.total > 0;
          return `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="user-avatar" style="width:26px; height:26px; font-size:10px; background:${isTop ? 'var(--primary-green)' : '#0F172A'};">${escapeHTML(a.artist.substring(0, 2).toUpperCase())}</div>
                  <strong>${escapeHTML(a.artist)}</strong>
                  ${isTop ? '<span class="badge badge-priority-rush" style="font-size:9px; padding:1px 5px;">★ Top</span>' : ''}
                </div>
              </td>
              <td style="text-align:center; font-weight:${a.std > 0 ? '700' : '400'}; color:${a.std > 0 ? '#0F172A' : '#94A3B8'};">${a.std}</td>
              <td style="text-align:center; font-weight:${a.prt > 0 ? '700' : '400'}; color:${a.prt > 0 ? '#0F172A' : '#94A3B8'};">${a.prt}</td>
              <td style="text-align:center; font-weight:${a.spc > 0 ? '700' : '400'}; color:${a.spc > 0 ? '#0F172A' : '#94A3B8'};">${a.spc}</td>
              <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">${a.total}</td>
              <td style="text-align:center; color:${a.revisions > 0 ? 'var(--accent-red)' : '#94A3B8'}; font-weight:700;">${a.revisions}</td>
              <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${share}%</td>
              <td style="text-align:center; font-weight:800;">#${idx + 1}</td>
            </tr>
          `;
        }).join('');
      }

      // Render Table Foot
      if (tfoot) {
        tfoot.innerHTML = `
          <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
            <td><strong>TOTAL ON DATE</strong></td>
            <td style="text-align:center;">${totalStd}</td>
            <td style="text-align:center;">${totalPrt}</td>
            <td style="text-align:center;">${totalSpc}</td>
            <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">${totalDayOutput}</td>
            <td style="text-align:center;">${totalRev}</td>
            <td style="text-align:center;">100.0%</td>
            <td style="text-align:center;">—</td>
          </tr>
        `;
      }

      // Render Daily Chart
      renderDailyArtistSvgChart(sortedArtists, totalDayOutput);

      // Render Completed Tasks Log for this day
      if (dailyCard) {
        dailyCard.style.display = 'block';
        const tasksTitle = document.getElementById('dailyTasksTitle');
        const tasksSubtitle = document.getElementById('dailyTasksSubtitle');
        const countBadge = document.getElementById('dailyTasksCountBadge');

        if (tasksTitle) tasksTitle.textContent = `Completed Production Tasks (${formattedDay})`;
        if (tasksSubtitle) tasksSubtitle.textContent = `Detailed log of individual job orders finished on ${formattedDay}`;
        if (countBadge) countBadge.textContent = `${dayReqs.length} Completed`;

        const logTbody = document.getElementById('dailyCompletedTasksTableBody');
        if (logTbody) {
          if (dayReqs.length === 0) {
            logTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">No completed tasks logged for ${formattedDay}.</td></tr>`;
          } else {
            logTbody.innerHTML = dayReqs.map(r => {
              const catBadge = r.countSpecial > 0 ? '<span class="badge badge-priority-rush">Special</span>' :
                               (r.countPrinting > 0 ? '<span class="badge badge-ongoing">Printing</span>' : '<span class="badge badge-completed">Standard</span>');
              return `
                <tr>
                  <td><strong style="color:var(--primary-green); font-weight:700;">${escapeHTML(r.requestId)}</strong></td>
                  <td><strong style="color:var(--accent-red); font-weight:700;">${escapeHTML(r.joNumber)}</strong></td>
                  <td><strong>${escapeHTML(r.projectName)}</strong></td>
                  <td>${escapeHTML(r.client)}</td>
                  <td><span class="badge badge-artist">${escapeHTML(r.artist)}</span></td>
                  <td>${catBadge}</td>
                  <td><span style="font-size:12px; color:var(--text-secondary);">${formatReadableDate(r.releasingDate || r.designDeadline || r.orderDate)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                  </td>
                </tr>
              `;
            }).join('');
          }
        }
      }

      setupCsvExportButton(`daily_${targetIso}`, sortedArtists);
      return;
    }

    // Hide daily log on non-daily modes
    if (dailyCard) dailyCard.style.display = 'none';

    // =========================================================================
    // CASE 2: WEEKLY VIEW (Filtered by specific Week: Monday — Sunday)
    // =========================================================================
    if (tf === 'week') {
      const weekStartIso = state.outputFilter.weekStartDate || '2026-10-19';
      const [wy, wm, wd] = weekStartIso.split('-').map(Number);
      const startMon = new Date(wy, wm - 1, wd);
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
        const cur = new Date(startMon);
        cur.setDate(startMon.getDate() + i);
        const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
        const mName = cur.toLocaleDateString('en-US', { month: 'short' });
        weekDays.push({
          day: dayNames[i],
          dateStr: iso,
          label: `${dayNames[i]} (${mName} ${cur.getDate()})`
        });
      }

      const weekRangeLabel = `${weekDays[0].label} — ${weekDays[6].label}`;

      if (reportTitle) reportTitle.textContent = `Weekly Production Output Report (${weekRangeLabel})`;
      if (reportSubtitle) reportSubtitle.textContent = `Verified output breakdown by day for the active week (${weekRangeLabel})`;
      if (chartTitle) chartTitle.textContent = `Weekly Production Trend by Day (${weekRangeLabel})`;
      if (chartSubtitle) chartSubtitle.textContent = 'Daily completed assignment counts across the 7 days of the selected work week';
      if (chartBadge) { chartBadge.textContent = 'Weekly Interval'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Weekly Output Matrix (${weekRangeLabel})`;
      if (matrixBadge) { matrixBadge.textContent = 'Weekly Verified Output'; matrixBadge.className = 'badge badge-completed'; }

      const weekMatrix = {};
      state.artists.forEach(a => {
        weekMatrix[a] = [0, 0, 0, 0, 0, 0, 0];
      });

      let weekTotal = 0;
      let weekStd = 0, weekPrt = 0, weekSpc = 0;
      const dailyTotals = [0, 0, 0, 0, 0, 0, 0];

      allCompleted.forEach(r => {
        const dStr = r.releasingDate || r.designDeadline || r.orderDate;
        const d = parseRequestDate(dStr);
        if (!d) return;
        const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const dayIdx = weekDays.findIndex(w => w.dateStr === isoDate);
        if (dayIdx >= 0) {
          let art = toTitleCase(r.artist);
          if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
          if (art === 'Gle') art = 'Glen';

          if (!weekMatrix[art]) weekMatrix[art] = [0, 0, 0, 0, 0, 0, 0];

          const std = parseInt(r.countStandard, 10) || 0;
          const prt = parseInt(r.countPrinting, 10) || 0;
          const spc = parseInt(r.countSpecial, 10) || 0;
          const cnt = Math.max(std + prt + spc, 1);

          weekMatrix[art][dayIdx] += cnt;
          dailyTotals[dayIdx] += cnt;
          weekTotal += cnt;
          weekStd += std;
          weekPrt += prt;
          weekSpc += spc;
        }
      });

      // Rows per artist
      const weekRows = state.artists.map(art => {
        const counts = weekMatrix[art] || [0, 0, 0, 0, 0, 0, 0];
        const sum = counts.reduce((a, b) => a + b, 0);
        return { artist: art, counts, sum };
      });
      weekRows.sort((a, b) => b.sum - a.sum);

      const topWeekArt = weekRows[0] && weekRows[0].sum > 0 ? weekRows[0].artist : (state.artists[0] || 'Glen');
      const topWeekCount = weekRows[0] ? weekRows[0].sum : 0;

      // Update KPIs
      if (kpi1Title) kpi1Title.textContent = "Weekly Output Total";
      if (kpi1Val) kpi1Val.textContent = Number(weekTotal).toLocaleString();
      if (kpi1Desc) kpi1Desc.textContent = `Completed ${weekRangeLabel}`;

      if (kpi2Title) kpi2Title.textContent = "Weekly Category Mix";
      if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${weekStd} | Prt: ${weekPrt} | Spc: ${weekSpc}</span>`;
      if (kpi2Desc) kpi2Desc.textContent = "Weekly fabrication types";

      if (kpi3Title) kpi3Title.textContent = "Top Producer This Week";
      if (kpi3Val) kpi3Val.textContent = topWeekArt;
      if (kpi3Desc) kpi3Desc.textContent = `${topWeekCount} completed jobs this week`;

      if (kpi4Title) kpi4Title.textContent = "Daily Run Rate";
      if (kpi4Val) kpi4Val.textContent = `${(weekTotal / 7).toFixed(1)} / day`;
      if (kpi4Desc) kpi4Desc.textContent = "Average completed per day";

      // Render Table Header
      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Artist</th>
            ${weekDays.map(w => `<th style="text-align:center;">${w.label}</th>`).join('')}
            <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">Week Total</th>
            <th style="text-align:center;">Team Share</th>
            <th style="text-align:center;">Rank</th>
          </tr>
        `;
      }

      // Render Table Body
      if (tbody) {
        tbody.innerHTML = weekRows.map((r, idx) => {
          const share = weekTotal > 0 ? ((r.sum / weekTotal) * 100).toFixed(1) : '0.0';
          return `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="user-avatar" style="width:26px; height:26px; font-size:10px;">${escapeHTML(r.artist.substring(0, 2).toUpperCase())}</div>
                  <strong>${escapeHTML(r.artist)}</strong>
                </div>
              </td>
              ${r.counts.map(c => `<td style="text-align:center; font-weight:${c > 0 ? '700' : '400'}; color:${c > 0 ? '#0F172A' : '#94A3B8'};">${c}</td>`).join('')}
              <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">${r.sum}</td>
              <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${share}%</td>
              <td style="text-align:center; font-weight:800;">#${idx + 1}</td>
            </tr>
          `;
        }).join('');
      }

      // Render Table Foot
      if (tfoot) {
        tfoot.innerHTML = `
          <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
            <td><strong>WEEKLY TOTAL</strong></td>
            ${dailyTotals.map(dt => `<td style="text-align:center; font-weight:800;">${dt}</td>`).join('')}
            <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">${weekTotal}</td>
            <td style="text-align:center;">100.0%</td>
            <td style="text-align:center;">—</td>
          </tr>
        `;
      }

      // Render Weekly SVG Chart
      renderWeeklySvgChart(weekDays, dailyTotals);

      // Export handler for Weekly
      setupCsvExportButton(`weekly_${weekStartIso}`, weekRows, weekDays);
      return;
    }

    // =========================================================================
    // CASE 3 & 4: MONTHLY & ALL-TIME VIEW (Filtered by Year and Month)
    // =========================================================================
    const selectedYear = state.outputFilter.year || '2026';
    const isYearFilter = (selectedYear !== 'all');
    const targetYearNum = isYearFilter ? parseInt(selectedYear, 10) : null;

    const rawMonth = state.outputFilter.month;
    const isAllMonths = (rawMonth === 'all' || rawMonth === undefined);
    const selectedMIdx = isAllMonths ? null : parseInt(rawMonth, 10);

    const isMonthOnly = (tf === 'month');

    if (isMonthOnly) {
      if (isAllMonths) {
        if (reportTitle) reportTitle.textContent = `${isYearFilter ? selectedYear : 'All-Time'} Annual Production Output Report`;
        if (reportSubtitle) reportSubtitle.textContent = `Verified output breakdown by month across all active artists (Jan — Dec ${isYearFilter ? selectedYear : 'History'})`;
      } else {
        const mName = monthFullNames[selectedMIdx] || months[selectedMIdx];
        if (reportTitle) reportTitle.textContent = `${mName} ${isYearFilter ? selectedYear : '2026'} Production Output Report`;
        if (reportSubtitle) reportSubtitle.textContent = `Verified output performance and artist breakdown for ${mName} ${isYearFilter ? selectedYear : '2026'}`;
      }
      if (chartTitle) chartTitle.textContent = `${isAllMonths ? 'Jan — Dec' : months[selectedMIdx]} ${isYearFilter ? selectedYear : ''} Completed Output`;
      if (chartSubtitle) chartSubtitle.textContent = 'Hover over bars for exact monthly count and verified volume';
      if (chartBadge) { chartBadge.textContent = 'Monthly Interval'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Monthly Output Matrix (Jan — Dec ${isYearFilter ? selectedYear : '2026'})`;
      if (matrixBadge) { matrixBadge.textContent = isAllMonths ? 'Full Year Matrix' : `${months[selectedMIdx]} Highlighted`; matrixBadge.className = 'badge badge-completed'; }
    } else {
      if (reportTitle) reportTitle.textContent = `All-Time Production Output Analytics ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (reportSubtitle) reportSubtitle.textContent = 'Comprehensive production history and cumulative performance rankings';
      if (chartTitle) chartTitle.textContent = `Completed Assignments by Month ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (chartSubtitle) chartSubtitle.textContent = 'Historical verified volume distribution across months';
      if (chartBadge) { chartBadge.textContent = 'All-Time Output'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Production Output Matrix ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (matrixBadge) { matrixBadge.textContent = 'Historical Grand Total'; matrixBadge.className = 'badge badge-completed'; }
    }

    const matrix = {};
    state.artists.forEach(a => {
      matrix[a] = new Array(12).fill(0);
    });

    let ytdTotal = 0;
    let selectedPeriodTotal = 0;
    let totalStd = 0, totalPrt = 0, totalSpc = 0;
    let filterMonthStd = 0, filterMonthPrt = 0, filterMonthSpc = 0;

    allCompleted.forEach(r => {
      const dateStr = r.releasingDate || r.designDeadline || r.orderDate;
      const d = parseRequestDate(dateStr);
      if (!d) return;

      if (targetYearNum && d.getFullYear() !== targetYearNum) return;

      const mIdx = d.getMonth();
      if (mIdx < 0 || mIdx > 11) return;

      let art = toTitleCase(r.artist);
      if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
      if (art === 'Gle') art = 'Glen';

      if (!matrix[art]) matrix[art] = new Array(12).fill(0);

      const std = parseInt(r.countStandard, 10) || 0;
      const prt = parseInt(r.countPrinting, 10) || 0;
      const spc = parseInt(r.countSpecial, 10) || 0;
      const cnt = Math.max(std + prt + spc, 1);

      matrix[art][mIdx] += cnt;
      ytdTotal += cnt;
      totalStd += std;
      totalPrt += prt;
      totalSpc += spc;

      if (selectedMIdx !== null && mIdx === selectedMIdx) {
        selectedPeriodTotal += cnt;
        filterMonthStd += std;
        filterMonthPrt += prt;
        filterMonthSpc += spc;
      }
    });

    const displayTotal = (selectedMIdx !== null) ? selectedPeriodTotal : ytdTotal;
    const displayStd = (selectedMIdx !== null) ? filterMonthStd : totalStd;
    const displayPrt = (selectedMIdx !== null) ? filterMonthPrt : totalPrt;
    const displaySpc = (selectedMIdx !== null) ? filterMonthSpc : totalSpc;

    // Monthly totals per month column
    const monthlyTotals = new Array(12).fill(0);
    Object.values(matrix).forEach(counts => {
      counts.forEach((c, idx) => { monthlyTotals[idx] += c; });
    });

    // Rows per artist
    const rows = state.artists.map(art => {
      const counts = matrix[art] || new Array(12).fill(0);
      const annualSum = counts.reduce((a, b) => a + b, 0);
      const monthCount = (selectedMIdx !== null) ? (counts[selectedMIdx] || 0) : annualSum;
      return { artist: art, counts, annualSum, monthCount };
    });

    // Sort by selected month or annual sum
    if (selectedMIdx !== null) {
      rows.sort((a, b) => b.monthCount - a.monthCount);
    } else {
      rows.sort((a, b) => b.annualSum - a.annualSum);
    }

    const topArtist = rows[0] ? rows[0].artist : (state.artists[0] || 'Glen');
    const topArtistCount = rows[0] ? (selectedMIdx !== null ? rows[0].monthCount : rows[0].annualSum) : 0;

    // Active months calculation
    const activeMonthsCount = monthlyTotals.filter(t => t > 0).length || 8;
    const monthlyAvg = activeMonthsCount > 0 ? (ytdTotal / activeMonthsCount).toFixed(1) : '0';

    // Update KPIs
    if (kpi1Title) kpi1Title.textContent = (selectedMIdx !== null) ? `${months[selectedMIdx]} Output Total` : "Period Total Output";
    if (kpi1Val) kpi1Val.textContent = Number(displayTotal).toLocaleString();
    if (kpi1Desc) kpi1Desc.textContent = (selectedMIdx !== null) ? `Completed in ${months[selectedMIdx]} ${selectedYear}` : `Completed across ${activeMonthsCount} active months`;

    if (kpi2Title) kpi2Title.textContent = (selectedMIdx !== null) ? `${months[selectedMIdx]} Category Mix` : "Category Breakdown";
    if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${displayStd} | Prt: ${displayPrt} | Spc: ${displaySpc}</span>`;
    if (kpi2Desc) kpi2Desc.textContent = "Fabrication distribution";

    if (kpi3Title) kpi3Title.textContent = (selectedMIdx !== null) ? `Top Producer in ${months[selectedMIdx]}` : "Top Producer";
    if (kpi3Val) kpi3Val.textContent = topArtist;
    if (kpi3Desc) kpi3Desc.textContent = `${topArtistCount} completed jobs`;

    if (kpi4Title) kpi4Title.textContent = (selectedMIdx !== null) ? "Daily Run Rate" : "Productivity Benchmark";
    if (kpi4Val) kpi4Val.textContent = (selectedMIdx !== null) ? `${(displayTotal / 30).toFixed(1)} / day` : `${monthlyAvg} / mo`;
    if (kpi4Desc) kpi4Desc.textContent = (selectedMIdx !== null) ? "Average completed per day" : "Average monthly output rate";

    // Highlight index
    const highlightMIdx = (selectedMIdx !== null) ? selectedMIdx : 9;

    // Render Table Header
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Artist</th>
          ${months.map((m, idx) => `
            <th style="text-align:center; ${idx === highlightMIdx ? 'background:#D1FAE5; color:#065F46; font-weight:900;' : ''}">
              ${m}
            </th>
          `).join('')}
          <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">${selectedMIdx !== null ? `${months[selectedMIdx]} Total` : 'Annual Total'}</th>
          <th style="text-align:center;">Rank</th>
        </tr>
      `;
    }

    // Pagination
    const totalItems = rows.length;
    const page = state.monthlyOutputPage || 1;
    const perPage = state.monthlyOutputPerPage || 10;
    const { validPage, startIndex } = renderPagination({
      infoId: 'monthlyOutputPaginationInfo',
      controlsId: 'monthlyOutputPaginationControls',
      selectIds: ['monthlyOutputFilterPerPage', 'monthlyOutputPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setMonthlyOutputPage',
      itemLabel: 'artists'
    });
    state.monthlyOutputPage = validPage;
    const pagedRows = rows.slice(startIndex, startIndex + perPage);

    // Table Body
    if (tbody) {
      tbody.innerHTML = pagedRows.map((r, idx) => {
        const isTop = idx === 0 && (selectedMIdx !== null ? r.monthCount > 0 : r.annualSum > 0);
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar" style="width:26px; height:26px; font-size:10px; background:${isTop ? 'var(--primary-green)' : '#0F172A'};">${escapeHTML(r.artist.substring(0, 2).toUpperCase())}</div>
                <strong>${escapeHTML(r.artist)}</strong>
                ${isTop ? '<span class="badge badge-priority-rush" style="font-size:9px; padding:1px 5px;">★ Top</span>' : ''}
              </div>
            </td>
            ${r.counts.map((c, mIdx) => `
              <td style="text-align:center; font-weight:${c > 0 ? '700' : '400'}; color:${c > 0 ? '#0F172A' : '#94A3B8'}; ${mIdx === highlightMIdx ? 'background:#F0FDF4; font-weight:800; color:#065F46;' : ''}">
                ${c}
              </td>
            `).join('')}
            <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">
              ${selectedMIdx !== null ? r.monthCount : r.annualSum}
            </td>
            <td style="text-align:center; font-weight:800;">#${startIndex + idx + 1}</td>
          </tr>
        `;
      }).join('');
    }

    // Table Foot
    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
          <td><strong>TOTAL OUTPUT</strong></td>
          ${monthlyTotals.map((mt, mIdx) => `
            <td style="text-align:center; font-weight:800; ${mIdx === highlightMIdx ? 'background:#D1FAE5; color:#065F46; font-weight:900;' : ''}">
              ${mt}
            </td>
          `).join('')}
          <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">
            ${selectedMIdx !== null ? selectedPeriodTotal : ytdTotal}
          </td>
          <td style="text-align:center;">—</td>
        </tr>
      `;
    }

    // Render 12-Month SVG Chart with active month highlight
    renderMonthlyOutputSvgChart(months, matrix, highlightMIdx, selectedYear);

    // Export CSV
    setupCsvExportButton(isMonthOnly ? (selectedMIdx !== null ? `month_${months[selectedMIdx]}_${selectedYear}` : `monthly_${selectedYear}`) : `all_time_${selectedYear}`, rows, months);
  }

  function setupCsvExportButton(mode, rows, headerCols) {
    const btn = document.getElementById('btnExportMonthlyReportCSV');
    if (!btn) return;
    btn.onclick = () => {
      let csvContent = '';
      if (mode === 'daily') {
        const headers = ['Artist', 'Standard Signage', 'Large Format Printing', 'Special Fabrication', "Today's Total", 'Revisions', 'Daily Share %'];
        const lines = [headers.join(',')];
        const dayTot = rows.reduce((acc, r) => acc + (r.total || 0), 0);
        rows.forEach(r => {
          const share = dayTot > 0 ? ((r.total / dayTot) * 100).toFixed(1) : '0.0';
          lines.push([`"${r.artist}"`, r.std, r.prt, r.spc, r.total, r.revisions, `"${share}%"`].join(','));
        });
        csvContent = lines.join('\n');
      } else if (mode === 'weekly') {
        const headers = ['Artist', ...headerCols.map(h => `"${h.label}"`), 'Week Total', 'Team Share %'];
        const lines = [headers.join(',')];
        const wTot = rows.reduce((acc, r) => acc + r.sum, 0);
        rows.forEach(r => {
          const share = wTot > 0 ? ((r.sum / wTot) * 100).toFixed(1) : '0.0';
          lines.push([`"${r.artist}"`, ...r.counts, r.sum, `"${share}%"`].join(','));
        });
        csvContent = lines.join('\n');
      } else {
        const headers = ['Artist', ...headerCols, 'Total Output'];
        const lines = [headers.join(',')];
        rows.forEach(r => {
          lines.push([`"${r.artist}"`, ...r.counts, r.annualSum].join(','));
        });
        csvContent = lines.join('\n');
      }
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sign_Depot_Production_Output_${mode}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${mode.toUpperCase()} output report to CSV.`);
      try {
        fetch((typeof apiBase !== 'undefined' ? apiBase : 'api.php') + '?action=log_action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'EXPORT',
            module: 'Reports',
            description: `Exported ${mode.toUpperCase()} output report to CSV`
          })
        }).catch(() => {});
      } catch (e) {}
    };
  }

  function renderDailyArtistSvgChart(sortedArtists, totalDayOutput) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const topArtists = sortedArtists.slice(0, 9);
    const maxVal = Math.max(...topArtists.map(a => a.total), 4);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 54;
    const padding = 36;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * topArtists.length) / Math.max(topArtists.length - 1, 1);

    let bars = '';
    topArtists.forEach((a, idx) => {
      const total = a.total;
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isTop = idx === 0 && total > 0;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isTop ? 'var(--primary-green)' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${a.artist}: ${total} completed assignments today</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#64748B">${a.artist}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }

  function renderWeeklySvgChart(weekDays, dailyTotals) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const maxVal = Math.max(...dailyTotals, 8);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 64;
    const padding = 40;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * 7) / 6;

    let bars = '';
    weekDays.forEach((w, idx) => {
      const total = dailyTotals[idx];
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isPeak = total === Math.max(...dailyTotals) && total > 0;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isPeak ? '#176B55' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${w.label}: ${total} completed assignments</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#64748B">${w.label}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }

  function renderMonthlyOutputSvgChart(months, matrix, highlightMIdx, yearLabel) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const monthlyTotals = new Array(12).fill(0);
    Object.values(matrix).forEach(counts => {
      counts.forEach((c, idx) => {
        monthlyTotals[idx] += c;
      });
    });

    const maxVal = Math.max(...monthlyTotals, 8);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 42;
    const padding = 32;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * 12) / 11;
    const activeHighlight = (highlightMIdx !== undefined && highlightMIdx !== null) ? highlightMIdx : 9;

    let bars = '';
    monthlyTotals.forEach((total, idx) => {
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isSelected = idx === activeHighlight;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isSelected ? 'var(--primary-green)' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${months[idx]} ${yearLabel || '2026'}: ${total} completed assignments</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="${isSelected ? '800' : '600'}" fill="${isSelected ? 'var(--primary-green)' : '#64748B'}">${months[idx]}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }


    function exportMonthlyReportCsv() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const matrix = {};
    state.artists.forEach(a => matrix[a] = new Array(12).fill(0));

    state.requests.forEach(r => {
      if (r.projectStatus === 'Completed') {
        let mIdx = -1;
        if (r.completionDate) {
          const mNum = parseInt(r.completionDate.split('-')[1], 10);
          if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) mIdx = mNum - 1;
        } else if (r.month) {
          const matchMonth = months.findIndex(m => r.month.toLowerCase().startsWith(m.toLowerCase()));
          if (matchMonth !== -1) mIdx = matchMonth;
        }
        if (mIdx !== -1 && matrix[r.artist]) {
          const count = Math.max((r.countStandard || 0) + (r.countPrinting || 0) + (r.countSpecial || 0), 1);
          matrix[r.artist][mIdx] += count;
        }
      }
    });

    const headers = ['Artist', ...months, 'Annual Total'];
    const rows = state.artists.map(a => {
      const counts = matrix[a];
      const sum = counts.reduce((acc, v) => acc + v, 0);
      return [a, ...counts, sum];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCsv(csvContent, `Sign_Depot_Monthly_Production_2026_${Date.now()}.csv`);
    try {
      fetch((typeof apiBase !== 'undefined' ? apiBase : 'api.php') + '?action=log_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'EXPORT',
          module: 'Monthly Output',
          description: 'Exported Annual Production report to CSV'
        })
      }).catch(() => {});
    } catch (e) {}
  }



  function initMonthlyOutputListeners() {
    const btnExportCSV = document.getElementById('btnExportMonthlyReportCSV');
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => exportMonthlyReportCsv());
    }

    const bindRows = App.utils && App.utils.bindRowsSelects;
    if (bindRows && typeof bindRows === 'function') {
      bindRows(['monthlyOutputFilterPerPage', 'monthlyOutputPaginationPerPage'], (val) => {
        state.monthlyOutputPerPage = val;
        renderMonthlyOutputReport(state.timeframe || 'all');
      });
    }
  }

  // Expose Monthly Output Public API
  App.renderMonthlyOutputReport = renderMonthlyOutputReport;
  App.setMonthlyOutputTimeframe = (tf) => {
    state.timeframe = tf;
    renderMonthlyOutputReport(tf);
  };
  App.setMonthlyOutputFilter = (f) => {
    state.monthlyOutputFilter = f;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.setMonthlyOutputPage = (p) => {
    state.monthlyOutputPage = p;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.setMonthlyOutputPerPage = (pp) => {
    state.monthlyOutputPerPage = pp;
    state.monthlyOutputPage = 1;
    renderMonthlyOutputReport(state.timeframe || 'all');
  };
  App.exportMonthlyReportCsv = exportMonthlyReportCsv;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMonthlyOutputListeners();
      if (document.getElementById('view-monthly-output') || document.getElementById('monthlyOutputTableBody')) {
        renderMonthlyOutputReport(state.timeframe || 'all');
      }
    });
  } else {
    initMonthlyOutputListeners();
    if (document.getElementById('view-monthly-output') || document.getElementById('monthlyOutputTableBody')) {
      renderMonthlyOutputReport(state.timeframe || 'all');
    }
  }
})(window);
