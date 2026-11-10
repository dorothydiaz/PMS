/**
 * Sign Depot Operations PMS — Directives & Vector Studio Module
 * File: assets/js/pages/directives.js
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
  // MODULE 5: DIRECTIVES DETAILS (The Star Module)
  // ==========================================================================

  function getDirectiveRecord(joOrReq) {
    if (!joOrReq || !state.requests || state.requests.length === 0) return null;
    const clean = String(joOrReq).trim().toLowerCase();
    if (!clean) return null;

    // 1. Exact match by requestId (e.g. "LR-26-2102")
    let match = state.requests.find(r => r.requestId && String(r.requestId).trim().toLowerCase() === clean);
    if (match) return match;

    // 2. Exact match by id (e.g. 15, "15", "lr-26-2102")
    match = state.requests.find(r => r.id !== undefined && r.id !== null && String(r.id).trim().toLowerCase() === clean);
    if (match) return match;

    // 3. Exact match by joNumber (e.g. "P261001356")
    match = state.requests.find(r => r.joNumber && String(r.joNumber).trim().toLowerCase() === clean);
    if (match) return match;

    // 4. Exact match by projectName
    match = state.requests.find(r => r.projectName && String(r.projectName).trim().toLowerCase() === clean);
    if (match) return match;

    // 5. Fuzzy substring match by projectName
    match = state.requests.find(r => r.projectName && String(r.projectName).trim().toLowerCase().includes(clean));
    if (match) return match;

    return null;
  }

  // ==========================================================================
  // CUSTOMIZED PER-CELL FONT SIZE ENGINE (Customized per individual cell, not everything!)
  // ==========================================================================

  let activeDirectiveCell = null;

  function getCellFriendlyName(cell) {
    if (!cell) return 'Select Any Cell';
    if (cell.id === 'docFieldJoLabel' || cell.classList.contains('doc-jo-lbl')) return 'JO# Label';
    if (cell.id === 'docFieldJoNumber' || cell.classList.contains('doc-jo-val')) return 'JO Number';
    if (cell.id === 'docFieldProjectName' || cell.classList.contains('doc-proj-cell')) return 'Project Name';
    if (cell.id === 'docFieldClientName' || cell.classList.contains('doc-client-cell')) return 'Client Name';
    if (cell.id === 'docFieldDueDate' || cell.classList.contains('doc-date-val')) return 'Due Date';
    if (cell.id === 'docFieldDueDateLabel') return 'Due Date Label';
    if (cell.id === 'docFieldLocation') return 'Location';
    if (cell.id === 'docFieldLocationLabel') return 'Location Label';
    if (cell.id === 'docFieldContactPerson') return 'Contact Person';
    if (cell.id === 'docFieldContactPersonLabel') return 'Contact Person Label';
    if (cell.id === 'docFieldContactNumber') return 'Contact Number';
    if (cell.id === 'docFieldContactNumberLabel') return 'Contact Number Label';
    if (cell.id === 'docFieldOrderDate') return 'Order Date';
    if (cell.id === 'docFieldOrderDateLabel') return 'Order Date Label';
    if (cell.id === 'docFieldReleasingDate') return 'Releasing Date';
    if (cell.id === 'docFieldReleasingDateLabel') return 'Releasing Date Label';
    if (cell.id === 'docFieldReleasingMode') return 'Releasing Mode';
    if (cell.id === 'docFieldReleasingModeLabel') return 'Releasing Mode Label';
    if (cell.id === 'docFieldInstallers') return 'Installers';
    if (cell.id === 'docFieldInstallersLabel') return 'Installers Label';
    if (cell.id === 'docFieldDuration') return 'Duration';
    if (cell.id === 'docFieldDurationLabel') return 'Duration Label';
    if (cell.id === 'docFieldAddress') return 'Address';
    if (cell.id === 'docFieldAddressLabel') return 'Address Label';
    if (cell.id === 'docFieldInCharge') return 'In-Charge';
    if (cell.id === 'docFieldInChargeLabel') return 'In-Charge Label';
    if (cell.id === 'docFieldDrawnBy') return 'Drawn By';
    if (cell.id === 'docFieldDrawnByLabel') return 'Drawn By Label';
    return (cell.textContent || 'Selected Cell').trim().slice(0, 16);
  }

  function getCellDefaultFontSize(cell) {
    if (!cell) return 13;
    if (cell.id && DIRECTIVE_FIELD_BOXES[cell.id]) return DIRECTIVE_FIELD_BOXES[cell.id].defaultSz;
    if (cell.id === 'docFieldJoLabel' || cell.classList.contains('doc-jo-lbl')) return 28;
    if (cell.classList.contains('doc-jo-val')) return 28;
    if (cell.classList.contains('doc-proj-cell')) return 30;
    if (cell.classList.contains('doc-client-cell')) return 26;
    if (cell.classList.contains('doc-date-val')) return 14.5;
    if (cell.classList.contains('doc-person-val')) return 15;
    if (cell.classList.contains('doc-box-val')) return 14;
    if (cell.classList.contains('doc-label-cell')) return 13.5;
    return 13;
  }

  function getCellCurrentFontSize(cell) {
    if (!cell) return 13;
    const custom = cell.getAttribute('data-custom-size');
    if (custom) return parseFloat(custom);
    if (window.SVGElement && cell instanceof SVGElement) {
      const attrSize = cell.getAttribute('font-size');
      if (attrSize) return parseFloat(attrSize);
    }
    const inline = cell.style.fontSize;
    if (inline) return parseFloat(inline);
    const computed = window.getComputedStyle(cell).fontSize;
    return parseFloat(computed) || getCellDefaultFontSize(cell);
  }

  // DIRECTIVE EXACT CELL COORDINATES & PROPERTIES FOR IN-PLACE DIRECT EDITING (PURE REGULAR BEBAS KAI)
  const DIRECTIVE_FIELD_BOXES = {
    docFieldJoNumber: { x: 58, y: 2, w: 164, h: 29, color: '#FFFFFF', bg: '#000000', align: 'left', defaultSz: 28, weight: 'normal', name: 'JO Number' },
    docFieldInCharge: { x: 104, y: 35, w: 118, h: 17, color: '#000000', bg: '#FFFFFF', align: 'right', defaultSz: 15, weight: 'normal', name: 'In-Charge' },
    docFieldDrawnBy: { x: 104, y: 56, w: 118, h: 17, color: '#000000', bg: '#FFFFFF', align: 'right', defaultSz: 15, weight: 'normal', name: 'Drawn By' },
    docFieldAddress: { x: 99, y: 77, w: 122, h: 17, color: '#000000', bg: '#E8EBED', align: 'right', defaultSz: 12, weight: 'normal', name: 'Address' },
    docFieldOrderDate: { x: 227, y: 16, w: 111, h: 15, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 14, weight: 'normal', name: 'Order Date' },
    docFieldDueDate: { x: 227, y: 47, w: 111, h: 16, color: '#FFFFFF', bg: '#000000', align: 'center', defaultSz: 14, weight: 'normal', name: 'Due Date' },
    docFieldReleasingDate: { x: 227, y: 78, w: 111, h: 16, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 14, weight: 'normal', name: 'Release Date' },
    docFieldClientName: { x: 342, y: 20, w: 220, h: 28, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 22, weight: 'normal', name: 'Client Name' },
    docFieldProjectName: { x: 342, y: 52, w: 220, h: 19, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 12, weight: 'normal', name: 'Project Name' },
    docFieldContactPerson: { x: 715, y: 46, w: 100, h: 18, color: '#000000', bg: '#E8EBED', align: 'center', defaultSz: 13, weight: 'normal', name: 'Contact Person' },
    docFieldContactNumber: { x: 715, y: 73, w: 100, h: 18, color: '#000000', bg: '#E8EBED', align: 'center', defaultSz: 13, weight: 'normal', name: 'Contact Number' },
    docFieldInstallers: { x: 824, y: 24, w: 78, h: 22, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 14, weight: 'normal', name: 'Installers' },
    docFieldDuration: { x: 824, y: 72, w: 78, h: 22, color: '#000000', bg: '#FFFFFF', align: 'center', defaultSz: 14, weight: 'normal', name: 'Duration' }
  };

  let activeDirectEditor = null;

  function getFieldRawText(idOrEl) {
    const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (!el) return '';

    const ctrlMap = {
      docFieldInstallers: 'ctrlInstallers',
      docFieldDuration: 'ctrlDuration',
      docFieldAddress: 'ctrlAddress',
      docFieldOrderDate: 'ctrlOrderDate',
      docFieldDueDate: 'ctrlDueDate',
      docFieldReleasingDate: 'ctrlReleasingDate',
      docFieldInCharge: 'ctrlInCharge',
      docFieldDrawnBy: 'ctrlDrawnBy'
    };
    if (el.id && ctrlMap[el.id]) {
      const c = document.getElementById(ctrlMap[el.id]);
      if (c && c.value !== undefined && c.value !== null && c.value.trim() !== '') {
        return c.value.trim();
      }
    }

    if (el.hasAttribute('data-raw-text')) {
      const rawAttr = el.getAttribute('data-raw-text');
      if (rawAttr !== undefined && rawAttr !== null && rawAttr.trim() !== '') {
        return rawAttr;
      }
    }
    const tspans = el.querySelectorAll('tspan:not(.chinese)');
    if (tspans && tspans.length > 0) {
      const text = Array.from(tspans).map(t => t.textContent).join('\n').trim();
      if (text !== '') return text;
    }
    const textContent = (el.textContent || '').trim();
    if (textContent !== '') return textContent;

    if (el.id && ctrlMap[el.id]) {
      const c = document.getElementById(ctrlMap[el.id]);
      if (c && c.value) return c.value.trim();
    }
    return '';
  }

  function estimateBebasKaiWidth(text, fontSize, letterSpacing = 0.8) {
    if (!text) return 0;
    const str = String(text).toUpperCase();
    let total = 0;
    const ls = parseFloat(letterSpacing) || 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      let ratio = 0.56;
      if (ch === ' ' || ch === '.' || ch === ',' || ch === ':' || ch === ';' || ch === '!' || ch === '\'' || ch === '|') {
        ratio = (ch === ' ') ? 0.28 : 0.24;
      } else if (ch === 'I') {
        ratio = 0.26;
      } else if (ch === 'M' || ch === 'W') {
        ratio = 0.78;
      } else if (ch === 'J' || ch === 'L') {
        ratio = 0.44;
      } else if (ch === '-' || ch === '(' || ch === ')') {
        ratio = 0.32;
      }
      total += ratio * fontSize + ls;
    }
    return total;
  }

  let _measureCanvas = null;
  function getSvgTextWidth(text, fontSize, letterSpacing = 0.8) {
    if (!text) return 0;
    try {
      if (typeof document !== 'undefined') {
        if (!_measureCanvas) _measureCanvas = document.createElement('canvas');
        const ctx = _measureCanvas.getContext('2d');
        if (ctx) {
          ctx.font = `${fontSize}px 'Bebas Kai', 'BebasKai', 'Oswald', sans-serif`;
          const m = ctx.measureText(text);
          const ls = parseFloat(letterSpacing) || 0;
          const w = m.width + (ls ? text.length * ls : 0);
          if (w > 0) return w;
        }
      }
    } catch (e) {}
    return estimateBebasKaiWidth(text, fontSize, letterSpacing);
  }

  function greedyWrapTwoLines(text, fontSize, maxW = 210, letterSpacing = 0.8) {
    const wAll = getSvgTextWidth(text, fontSize, letterSpacing);
    if (wAll <= maxW) {
      return { fits: true, lines: [text], single: true };
    }
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= 1) {
      return { fits: false, lines: [text], single: true };
    }
    let line1 = words[0];
    if (getSvgTextWidth(line1, fontSize, letterSpacing) > maxW) {
      return { fits: false, lines: [text], single: false };
    }
    let splitIdx = 1;
    for (let i = 1; i < words.length; i++) {
      const test = line1 + ' ' + words[i];
      if (getSvgTextWidth(test, fontSize, letterSpacing) <= maxW) {
        line1 = test;
        splitIdx = i + 1;
      } else {
        break;
      }
    }
    if (splitIdx >= words.length) {
      return { fits: true, lines: [line1], single: true };
    }
    const line2 = words.slice(splitIdx).join(' ');
    const w2 = getSvgTextWidth(line2, fontSize, letterSpacing);
    return {
      fits: w2 <= maxW,
      lines: [line1, line2],
      single: false
    };
  }

  function fitDirectiveClientName(rawText, userBaseSize) {
    const MAX_W = 210;
    const raw = String(rawText !== undefined && rawText !== null ? rawText : '').trim().replace(/\r\n/g, '\n');
    if (!raw) {
      return {
        lines: [''],
        fontSize: 22,
        isMultiline: false,
        baseY: 44,
        startY: 44,
        lastLineY: 44,
        lineHeight: 25,
        divY: 50,
        projY: 65,
        widestLineWidth: 40
      };
    }

    let lines = raw.split('\n');

    // If explicit newlines provided by user (>= 2 lines)
    if (lines.length > 1) {
      let sz = userBaseSize ? parseFloat(userBaseSize) : 18;
      if (isNaN(sz) || sz <= 0) sz = 18;
      if (!userBaseSize) sz = Math.min(18, sz);
      while (sz > 11) {
        const maxW = Math.max(...lines.map(l => getSvgTextWidth(l, sz, 0.8)));
        if (maxW <= MAX_W) break;
        sz = Math.round((sz - 0.5) * 10) / 10;
      }
      const maxW = Math.max(...lines.map(l => getSvgTextWidth(l, sz, 0.8)));
      const lh = Math.max(14, Math.round(sz * 0.95 * 10) / 10);
      const startY = 32.5;
      const lastLineY = Math.round((startY + (lines.length - 1) * lh) * 10) / 10;
      const divY = Math.min(54, Math.round(lastLineY + 4));
      const projY = Math.min(67, Math.round(divY + 13));
      return {
        lines,
        fontSize: sz,
        isMultiline: true,
        startY,
        lastLineY,
        lineHeight: lh,
        divY,
        projY,
        widestLineWidth: maxW
      };
    }

    // Single line text: first test if it fits on 1 line at userBaseSize or 22px
    let baseSz = userBaseSize ? parseFloat(userBaseSize) : 22;
    if (isNaN(baseSz) || baseSz <= 0) baseSz = 22;

    if (getSvgTextWidth(raw, baseSz, 0.8) <= MAX_W) {
      return {
        lines: [raw],
        fontSize: baseSz,
        isMultiline: false,
        baseY: 44,
        startY: 44,
        lastLineY: 44,
        lineHeight: Math.round(baseSz * 1.15 * 10) / 10,
        divY: 50,
        projY: 65,
        widestLineWidth: getSvgTextWidth(raw, baseSz, 0.8)
      };
    }

    // Does not fit on 1 line: greedy-wrap into 2 lines, filling the upper line first!
    // Start at 18px (or userBaseSize if lower than 18) to ensure vertical clearance
    let sz = userBaseSize ? Math.min(18, parseFloat(userBaseSize)) : 18;
    if (isNaN(sz) || sz <= 0) sz = 18;
    const minSz = 11;

    let bestResult = null;
    while (sz >= minSz) {
      const wrapRes = greedyWrapTwoLines(raw, sz, MAX_W, 0.8);
      if (wrapRes.fits) {
        bestResult = { lines: wrapRes.lines, fontSize: sz };
        break;
      }
      sz = Math.round((sz - 0.5) * 10) / 10;
    }

    if (!bestResult) {
      const fallbackWrap = greedyWrapTwoLines(raw, minSz, MAX_W, 0.8);
      bestResult = { lines: fallbackWrap.lines, fontSize: minSz };
    }

    const resLines = bestResult.lines;
    const resSz = bestResult.fontSize;
    const maxW = Math.max(...resLines.map(l => getSvgTextWidth(l, resSz, 0.8)));

    if (resLines.length > 1) {
      const lh = Math.max(14, Math.round(resSz * 0.95 * 10) / 10);
      const startY = 32.5;
      const lastLineY = Math.round((startY + lh) * 10) / 10;
      const divY = Math.min(54, Math.round(lastLineY + 4));
      const projY = Math.min(67, Math.round(divY + 13));

      return {
        lines: resLines,
        fontSize: resSz,
        isMultiline: true,
        startY,
        lastLineY,
        lineHeight: lh,
        divY,
        projY,
        widestLineWidth: maxW
      };
    }

    return {
      lines: resLines,
      fontSize: resSz,
      isMultiline: false,
      baseY: 44,
      startY: 44,
      lastLineY: 44,
      lineHeight: Math.round(resSz * 1.15 * 10) / 10,
      divY: 50,
      projY: 65,
      widestLineWidth: maxW
    };
  }

  function setFieldMultilineText(el, text, customBaseY) {
    if (!el) return;
    const raw = String(text !== undefined && text !== null ? text : '').replace(/\r\n/g, '\n');
    el.setAttribute('data-raw-text', raw);

    if (el.id === 'docFieldJoNumber') {
      const clean = raw.replace(/^JO#:\s*/i, '').trim();
      let joSz = el.getAttribute('data-custom-size') ? parseFloat(el.getAttribute('data-custom-size')) : 28;
      if (clean.length > 12 && !el.getAttribute('data-custom-size')) {
        joSz = Math.max(18, Math.round(28 * (12 / clean.length) * 10) / 10);
      }
      const joNumX = Math.round(10 + joSz * 1.78);
      el.setAttribute('font-size', joSz);
      el.style.setProperty('font-size', joSz + 'px', 'important');
      el.setAttribute('x', joNumX);
      el.setAttribute('y', 26.5);
      el.textContent = clean;
      return;
    }

    if (el.id === 'docFieldClientName') {
      const customSz = el.getAttribute('data-custom-size') ? parseFloat(el.getAttribute('data-custom-size')) : (state.customCellFonts?.['docFieldClientName'] || null);
      const fit = fitDirectiveClientName(raw, customSz);

      el.setAttribute('x', '452');
      el.setAttribute('font-size', fit.fontSize);
      el.style.setProperty('font-size', fit.fontSize + 'px', 'important');

      if (!fit.isMultiline) {
        el.removeAttribute('data-multiline');
        el.setAttribute('x', '452');
        el.setAttribute('y', fit.baseY || 44);
        el.textContent = fit.lines[0] || '';
      } else {
        el.setAttribute('data-multiline', 'true');
        el.textContent = '';
        el.setAttribute('x', '452');
        el.removeAttribute('y');

        fit.lines.forEach((line, idx) => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          tspan.setAttribute('x', '452');
          tspan.setAttribute('y', Math.round((fit.startY + idx * fit.lineHeight) * 10) / 10);
          tspan.textContent = line || '\u00A0';
          el.appendChild(tspan);
        });
      }

      updateProjDividerLine();
      return;
    }

    if (el.id === 'docFieldProjectName') {
      const customSz = el.getAttribute('data-custom-size') ? parseFloat(el.getAttribute('data-custom-size')) : (state.customCellFonts?.['docFieldProjectName'] || null);
      let sz = customSz || 12;
      const MAX_W = 210;
      while (sz > 8.5 && getSvgTextWidth(raw, sz, 0.5) > MAX_W) {
        sz = Math.round((sz - 0.5) * 10) / 10;
      }
      el.setAttribute('font-size', sz);
      el.style.setProperty('font-size', sz + 'px', 'important');
      el.setAttribute('x', '452');

      const lines = raw.split('\n');
      if (lines.length <= 1) {
        el.removeAttribute('data-multiline');
        const curY = el.getAttribute('data-base-y') || el.getAttribute('y') || '65';
        el.setAttribute('x', '452');
        el.setAttribute('y', curY);
        el.textContent = lines[0] || '';
        return;
      }

      el.setAttribute('data-multiline', 'true');
      el.textContent = '';
      el.setAttribute('x', '452');
      el.removeAttribute('y');
      const lh = Math.round(sz * 1.15 * 10) / 10;
      const curBaseY = parseFloat(el.getAttribute('data-base-y')) || 65;
      const startY = Math.round((curBaseY - ((lines.length - 1) * lh) / 2) * 10) / 10;
      lines.forEach((line, idx) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', '452');
        tspan.setAttribute('y', Math.round((startY + idx * lh) * 10) / 10);
        tspan.textContent = line || '\u00A0';
        el.appendChild(tspan);
      });
      return;
    }

    let baseY = customBaseY !== undefined ? customBaseY : parseFloat(el.getAttribute('data-base-y'));
    if (isNaN(baseY)) {
      baseY = parseFloat(el.getAttribute('y') || el.querySelector('tspan')?.getAttribute('y') || 0);
      el.setAttribute('data-base-y', baseY);
    }

    let xAttr = el.getAttribute('x') || el.querySelector('tspan')?.getAttribute('x');
    if (!xAttr && el.getAttribute('data-base-x')) xAttr = el.getAttribute('data-base-x');
    if (!xAttr) xAttr = '0';
    el.setAttribute('data-base-x', xAttr);
    const sz = getCellCurrentFontSize(el);
    const lines = raw.split('\n');

    if (lines.length <= 1) {
      el.removeAttribute('data-multiline');
      el.setAttribute('x', xAttr);
      el.setAttribute('y', baseY);
      el.textContent = lines[0] || '';
      updateProjDividerLine();
      return;
    }

    el.setAttribute('data-multiline', 'true');
    el.textContent = '';
    el.setAttribute('x', xAttr);
    el.removeAttribute('y');

    const lh = Math.round(sz * 1.15 * 10) / 10;
    const startY = Math.round((baseY - ((lines.length - 1) * lh) / 2) * 10) / 10;

    lines.forEach((line, idx) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', xAttr);
      tspan.setAttribute('y', Math.round((startY + idx * lh) * 10) / 10);
      tspan.textContent = line || '\u00A0';
      el.appendChild(tspan);
    });

    updateProjDividerLine();
  }

  function updateProjDividerLine() {
    const divider = document.getElementById('docProjDividerLine');
    const clientEl = document.getElementById('docFieldClientName');
    const projEl = document.getElementById('docFieldProjectName');
    if (!divider || !clientEl) return;

    // Underline width must exactly match Client Name width!
    let clientWidth = 0;
    try {
      if (typeof clientEl.getComputedTextLength === 'function') {
        const tspans = clientEl.querySelectorAll('tspan');
        if (tspans && tspans.length > 0) {
          tspans.forEach(t => {
            const w = t.getComputedTextLength();
            if (w > clientWidth) clientWidth = w;
          });
        } else {
          clientWidth = clientEl.getComputedTextLength();
        }
      } else if (typeof clientEl.getBBox === 'function') {
        clientWidth = clientEl.getBBox().width;
      }
    } catch (e) {}

    // Fallback approximation if DOM not rendered yet
    if (!clientWidth || isNaN(clientWidth) || clientWidth < 5) {
      const text = getFieldRawText(clientEl) || '';
      const lines = text.split('\n');
      const sz = getCellCurrentFontSize(clientEl) || 22;
      clientWidth = Math.max(...lines.map(l => getSvgTextWidth(l, sz, 0.8)));
      if (!clientWidth || clientWidth < 5) clientWidth = 40;
    }

    const finalWidth = Math.min(214, Math.max(16, clientWidth));
    const centerX = 452;
    const halfW = Math.round((finalWidth / 2) * 10) / 10;
    const x1 = Math.round((centerX - halfW) * 10) / 10;
    const x2 = Math.round((centerX + halfW) * 10) / 10;
    divider.setAttribute('x1', x1);
    divider.setAttribute('x2', x2);

    // Vertical positioning: underline sits directly under Client Name
    const tspans = clientEl.querySelectorAll('tspan');
    if (tspans && tspans.length > 1) {
      const lastTspan = tspans[tspans.length - 1];
      const lastY = parseFloat(lastTspan.getAttribute('y') || 49.5);
      const divY = Math.min(54, Math.round(lastY + 4));
      divider.setAttribute('y1', divY);
      divider.setAttribute('y2', divY);
      if (projEl && !projEl.hasAttribute('data-multiline')) {
        const projY = Math.min(67, Math.round(divY + 13));
        projEl.setAttribute('y', projY);
      }
    } else {
      divider.setAttribute('y1', '50');
      divider.setAttribute('y2', '50');
      if (projEl && !projEl.hasAttribute('data-multiline')) {
        projEl.setAttribute('y', '65');
      }
    }
  }

  function syncControlValues(fieldId, val) {
    if (fieldId === 'docFieldInCharge') {
      const c = document.getElementById('ctrlInCharge');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldDrawnBy') {
      const c = document.getElementById('ctrlDrawnBy');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldInstallers') {
      const c = document.getElementById('ctrlInstallers');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldDuration') {
      const c = document.getElementById('ctrlDuration');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldJoNumber') {
      const inp = document.getElementById('directiveLookupInput');
      if (inp) inp.value = val.split('\n')[0];
    } else if (fieldId === 'docFieldAddress') {
      const c = document.getElementById('ctrlAddress');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldOrderDate') {
      const c = document.getElementById('ctrlOrderDate');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldDueDate') {
      const c = document.getElementById('ctrlDueDate');
      if (c) c.value = val;
    } else if (fieldId === 'docFieldReleasingDate') {
      const c = document.getElementById('ctrlReleasingDate');
      if (c) c.value = val;
    }
  }

  function getFieldIdAtSvgCoords(x, y) {
    if (x >= 0 && x <= 225) {
      if (y >= 0 && y <= 33) return 'docFieldJoNumber';
      if (y > 33 && y <= 54) return 'docFieldInCharge';
      if (y > 54 && y <= 75) return 'docFieldDrawnBy';
      if (y > 75 && y <= 96) return 'docFieldAddress';
    } else if (x > 225 && x <= 340) {
      if (y >= 0 && y <= 33) return 'docFieldOrderDate';
      if (y > 33 && y <= 65) return 'docFieldDueDate';
      if (y > 65 && y <= 96) return 'docFieldReleasingDate';
    } else if (x > 340 && x <= 564) {
      if (y >= 18 && y <= 50) return 'docFieldClientName';
      if (y > 50 && y <= 73) return 'docFieldProjectName';
    } else if (x > 564 && x <= 822) {
      if (y > 43 && y <= 70) return 'docFieldContactPerson';
      if (y > 70 && y <= 96) return 'docFieldContactNumber';
    } else if (x > 822 && x <= 904) {
      if (y >= 0 && y <= 48) return 'docFieldInstallers';
      if (y > 48 && y <= 96) return 'docFieldDuration';
    }
    return null;
  }

  function syncToolbarBoxInputs(cell) {
    if (!cell) return;
    const curSize = Math.round(getCellCurrentFontSize(cell));

    const badge = document.getElementById('fontCtrlCellBadge') || document.getElementById('selectedCellBadge');
    if (badge) badge.textContent = `${getCellFriendlyName(cell)}: ${curSize}px`;

    const inpSz = document.getElementById('cellFontSizeInput');
    if (inpSz) inpSz.value = curSize;
  }

  function setCellCustomBoxSize(cell, wPx, hPx) {
    if (!cell) cell = getActiveOrTargetCell();
    if (!cell) return;
    const cellId = cell.id;
    if (!state.customBoxSizes) state.customBoxSizes = {};
    const boxDef = DIRECTIVE_FIELD_BOXES[cellId] || { w: 100, h: 20 };
    const cur = state.customBoxSizes[cellId] || { w: boxDef.w, h: boxDef.h };
    const newW = wPx !== undefined ? Math.max(30, Math.min(800, Math.round(wPx))) : cur.w;
    const newH = hPx !== undefined ? Math.max(15, Math.min(300, Math.round(hPx))) : cur.h;
    state.customBoxSizes[cellId] = { w: newW, h: newH };
    saveStateToStorage();

    syncToolbarBoxInputs(cell);

    if (activeDirectEditor && activeDirectEditor.__targetCell === cell) {
      const svg = document.getElementById('directiveExactSvg');
      const svgRect = svg ? svg.getBoundingClientRect() : { width: 904, height: 96 };
      const scaleX = svgRect.width / 904;
      const scaleY = svgRect.height / 96;
      activeDirectEditor.style.width = Math.round(newW * scaleX) + 'px';
      activeDirectEditor.style.height = Math.round(newH * scaleY) + 'px';
    }
  }

  function openDirectiveDirectEditor(cell) {
    if (!cell) return;
    const cellId = cell.id;
    const boxDef = DIRECTIVE_FIELD_BOXES[cellId];
    const wrap = document.getElementById('directiveGridTable');
    const svg = document.getElementById('directiveExactSvg');
    if (!wrap || !svg) return;

    if (activeDirectEditor && activeDirectEditor.__targetCell === cell) {
      activeDirectEditor.focus();
      return;
    }
    closeDirectiveDirectEditor(true);

    const wrapRect = wrap.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const scaleX = svgRect.width / 904;
    const scaleY = svgRect.height / 96;
    const offsetX = svgRect.left - wrapRect.left;
    const offsetY = svgRect.top - wrapRect.top;

    let box = boxDef;
    if (!box) {
      const cRect = cell.getBoundingClientRect();
      box = {
        x: (cRect.left - svgRect.left) / scaleX,
        y: (cRect.top - svgRect.top) / scaleY,
        w: cRect.width / scaleX,
        h: cRect.height / scaleY,
        color: cell.getAttribute('fill') || '#000000',
        bg: '#FFFFFF',
        align: cell.getAttribute('text-anchor') === 'middle' ? 'center' : (cell.getAttribute('text-anchor') === 'end' ? 'right' : 'left'),
        defaultSz: parseFloat(cell.getAttribute('font-size') || 12),
        weight: 'normal'
      };
    }

    const curSize = getCellCurrentFontSize(cell);
    const rawVal = getFieldRawText(cell);

    const savedBox = (state.customBoxSizes && state.customBoxSizes[cellId]) || {};
    const boxW = savedBox.w || box.w;
    const linesCount = (rawVal.match(/\n/g) || []).length + 1;
    const autoH = Math.max(box.h, (linesCount * curSize * 1.15) + 6);
    const boxH = savedBox.h || autoH;
    const boxY = linesCount > 1 ? Math.max(0, box.y - ((linesCount - 1) * curSize * 0.45)) : box.y;

    const editor = document.createElement('textarea');
    editor.id = 'directiveDirectEditor';
    editor.className = 'directive-direct-editor';
    editor.__targetCell = cell;
    editor.value = rawVal;
    editor.spellcheck = false;

    editor.style.left = Math.round(offsetX + box.x * scaleX) + 'px';
    editor.style.top = Math.round(offsetY + boxY * scaleY) + 'px';
    editor.style.width = Math.round(boxW * scaleX) + 'px';
    editor.style.height = Math.round(boxH * scaleY) + 'px';
    editor.style.minHeight = Math.round(box.h * scaleY) + 'px';
    editor.style.fontSize = Math.round(curSize * scaleY) + 'px';
    editor.style.textAlign = box.align;
    editor.style.fontWeight = 'normal';
    editor.style.color = box.color;
    editor.style.background = box.bg === '#000000' ? 'rgba(0,0,0,0.92)' : (box.bg === '#E8EBED' ? '#E8EBED' : 'rgba(255,255,255,0.96)');

    wrap.appendChild(editor);
    activeDirectEditor = editor;

    editor.focus();
    editor.select();

    syncToolbarBoxInputs(cell);

    const updateLayout = () => {
      const val = editor.value;
      setFieldMultilineText(cell, val);
      syncControlValues(cellId, val);

      if (!state.customBoxSizes || !state.customBoxSizes[cellId] || !state.customBoxSizes[cellId].h) {
        const lines = (val.match(/\n/g) || []).length + 1;
        const dynH = Math.max(box.h, (lines * curSize * 1.15) + 6);
        const dynY = lines > 1 ? Math.max(0, box.y - ((lines - 1) * curSize * 0.45)) : box.y;
        editor.style.top = Math.round(offsetY + dynY * scaleY) + 'px';
        editor.style.height = Math.round(dynH * scaleY) + 'px';
        const inpH = document.getElementById('cellBoxHeightInput');
        if (inpH) inpH.value = Math.round(dynH);
      }
    };

    editor.addEventListener('input', updateLayout);

    // Track user drag-resizing of the textbox
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (!activeDirectEditor || activeDirectEditor !== editor) return;
        const curW = Math.round(editor.offsetWidth / scaleX);
        const curH = Math.round(editor.offsetHeight / scaleY);
        if (!state.customBoxSizes) state.customBoxSizes = {};
        state.customBoxSizes[cellId] = { w: curW, h: curH };
        saveStateToStorage();
        syncToolbarBoxInputs(cell);
      });
      ro.observe(editor);
      editor.__resizeObserver = ro;
    }

    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Support next line when user enters!
        e.stopPropagation();
        setTimeout(updateLayout, 10);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        closeDirectiveDirectEditor(true);
        const keys = Object.keys(DIRECTIVE_FIELD_BOXES);
        const idx = keys.indexOf(cellId);
        const nextId = keys[(idx + (e.shiftKey ? -1 : 1) + keys.length) % keys.length];
        const nextEl = document.getElementById(nextId);
        if (nextEl) selectDirectiveCell(nextEl, true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDirectiveDirectEditor(true);
      } else if (e.ctrlKey && (e.key === '[' || e.key === ']')) {
        e.preventDefault();
        const step = e.key === '[' ? -1 : 1;
        const current = getCellCurrentFontSize(cell);
        const next = Math.max(6, Math.min(72, current + step));
        setCellCustomFontSize(cell, next);
        editor.style.fontSize = Math.round(next * scaleY) + 'px';
        updateLayout();
      }
    });
  }

  function closeDirectiveDirectEditor(commit = true) {
    if (!activeDirectEditor) return;
    const editor = activeDirectEditor;
    const cell = editor.__targetCell;
    if (editor.__resizeObserver) {
      editor.__resizeObserver.disconnect();
      delete editor.__resizeObserver;
    }
    activeDirectEditor = null;
    if (commit && cell) {
      cell.setAttribute('data-raw-text', editor.value);
      setFieldMultilineText(cell, editor.value);
      syncControlValues(cell.id, editor.value);
    }
    if (editor.parentNode) {
      editor.parentNode.removeChild(editor);
    }
  }

  function selectDirectiveCell(cell, shouldOpenEditor = true) {
    if (!cell) return;
    const table = document.getElementById('directiveGridTable');
    if (table) {
      table.querySelectorAll('.directive-active-cell, .active-svg-cell').forEach(c => {
        c.classList.remove('directive-active-cell');
        c.classList.remove('active-svg-cell');
      });
    }
    activeDirectiveCell = cell;
    cell.classList.add('directive-active-cell');
    if (window.SVGElement && cell instanceof SVGElement) {
      cell.classList.add('active-svg-cell');
    }

    syncToolbarBoxInputs(cell);

    if (shouldOpenEditor && (window.SVGElement && cell instanceof SVGElement)) {
      openDirectiveDirectEditor(cell);
    }
  }

  function setCellCustomFontSize(cell, sizePx) {
    if (!cell) {
      cell = document.getElementById('docFieldProjectName') || document.querySelector('.interactive-field') || document.querySelector('.doc-proj-cell');
      if (cell) selectDirectiveCell(cell, false);
    }
    if (!cell) return;

    const clamped = Math.max(6, Math.min(72, Math.round(sizePx * 10) / 10));
    cell.setAttribute('data-custom-size', clamped);
    if (window.SVGElement && cell instanceof SVGElement) {
      cell.setAttribute('font-size', clamped);
    }
    cell.style.setProperty('font-size', clamped + 'px', 'important');

    // Recalculate multiline tspans with new font size
    if (cell.id && DIRECTIVE_FIELD_BOXES[cell.id]) {
      setFieldMultilineText(cell, getFieldRawText(cell));
    }

    if (activeDirectEditor && activeDirectEditor.__targetCell === cell) {
      const svg = document.getElementById('directiveExactSvg');
      const scaleY = svg ? (svg.getBoundingClientRect().height / 96) : 1;
      activeDirectEditor.style.fontSize = Math.round(clamped * scaleY) + 'px';
    }

    syncToolbarBoxInputs(cell);

    if (!state.customCellFonts) state.customCellFonts = {};
    const key = cell.id || cell.className;
    state.customCellFonts[key] = clamped;
    saveStateToStorage();
  }

  function autoFitCellText(cell) {
    if (!cell || (window.SVGElement && cell instanceof SVGElement)) return;
    const baseSizeAttr = cell.getAttribute('data-base-size');
    let baseSize = baseSizeAttr ? parseFloat(baseSizeAttr) : null;
    if (!baseSize) {
      baseSize = getCellDefaultFontSize(cell);
      cell.setAttribute('data-base-size', baseSize);
    }

    // If customized for this specific cell, prioritize the customized font size!
    const customSizeAttr = cell.getAttribute('data-custom-size');
    if (customSizeAttr) {
      cell.style.setProperty('font-size', customSizeAttr + 'px', 'important');
      return;
    }

    const minSize = cell.classList.contains('doc-jo-val') ? 14 :
                    cell.classList.contains('doc-proj-cell') ? 12 :
                    cell.classList.contains('doc-client-cell') ? 11 :
                    cell.classList.contains('doc-date-val') ? 9 : 8;

    let targetSize = baseSize;
    cell.style.setProperty('font-size', targetSize + 'px', 'important');

    // Auto-shrink font size ONLY if text overflows cell bounds
    let guard = 0;
    while (guard < 35 && (cell.scrollWidth > cell.clientWidth || cell.scrollHeight > cell.clientHeight) && targetSize > minSize) {
      targetSize = Math.max(minSize, Math.round((targetSize - 0.5) * 10) / 10);
      cell.style.setProperty('font-size', targetSize + 'px', 'important');
      guard++;
    }
  }

  function autoFitDirectiveTexts() {
    const table = document.getElementById('directiveGridTable');
    if (!table) return;
    const cells = table.querySelectorAll('td[contenteditable="true"], .doc-label-cell, .doc-value-cell, .doc-person-val');
    cells.forEach(cell => autoFitCellText(cell));
  }

  function renderDirectivePreview(joToLoad) {
    const jo = joToLoad || state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || (state.requests && state.requests[0] ? (state.requests[0].requestId || state.requests[0].joNumber) : '');
    let rec = getDirectiveRecord(jo);

    if (!rec && jo && window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_request&id=' + encodeURIComponent(jo))
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.data) {
            normalizeRequestItem(res.data);
            if (!state.requests) state.requests = [];
            const idx = state.requests.findIndex(r => r.id == res.data.id || r.requestId == res.data.requestId);
            if (idx >= 0) {
              state.requests[idx] = res.data;
            } else {
              state.requests.unshift(res.data);
            }
            renderDirectivePreview(res.data.requestId || res.data.joNumber);
          }
        })
        .catch(() => {});
    }

    if (!rec) {
      rec = (state.requests && state.requests.length > 0) ? state.requests[0] : null;
    }
    if (!rec) return;

    state.currentDirectiveJo = rec.requestId || rec.joNumber || rec.id;
    try { sessionStorage.setItem('SIGN_DEPOT_CURRENT_DIRECTIVE', state.currentDirectiveJo); } catch (e) {}

    const btnOpenEditor = document.getElementById('btnOpenFullEditor');
    if (btnOpenEditor) {
      btnOpenEditor.href = `directive-editor.php?id=${encodeURIComponent(state.currentDirectiveJo)}`;
    }

    const input = document.getElementById('directiveLookupInput');
    if (input) input.value = rec.joNumber || rec.requestId || rec.projectName || '';

    const setTxt = (id, val, fallback = '—') => {
      const el = document.getElementById(id);
      if (!el) return;
      const textVal = (val !== undefined && val !== null && String(val).trim() !== '') ? String(val) : fallback;
      setFieldMultilineText(el, textVal);
    };

    const toDotDate = (val) => {
      if (!val || val === '—' || val === '-' || val === '0000-00-00') return '00.00.0000';
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) return val;
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}.${dd}.${yyyy}`;
    };

    setTxt('docFieldRequestId', rec.requestId || '—');
    setTxt('docFieldJoNumber', rec.joNumber || rec.requestId || '—');
    setTxt('docFieldDueDate', toDotDate(rec.designDeadline || rec.releasingDate));
    setTxt('docFieldLocation', rec.location || '—');
    setTxt('docFieldProjectName', rec.projectName || '—');
    setTxt('docFieldClientName', rec.client || '—');
    setTxt('docFieldInCharge', (rec.inCharge || rec.salesRep || '—').toUpperCase());
    setTxt('docFieldDrawnBy', (rec.drawnBy || rec.artist || '—').toUpperCase());
    setTxt('docFieldContactPerson', (rec.contactPerson && rec.contactPerson !== 'N/A') ? rec.contactPerson : '-');
    setTxt('docFieldContactNumber', (rec.contactNumber && rec.contactNumber !== 'N/A') ? rec.contactNumber : '-');
    setTxt('docFieldOrderDate', toDotDate(rec.orderDate));
    setTxt('docFieldReleasingDate', toDotDate(rec.releasingDate));
    setTxt('docFieldReleasingMode', normalizeReleasingMode(rec.releasingMode));
    setTxt('docFieldAddress', (rec.completeAddress && rec.completeAddress !== 'N/A') ? rec.completeAddress : ((rec.location && rec.location !== 'N/A') ? rec.location : '-'));
    setTxt('docFieldInstallers', rec.installers || '', '');
    setTxt('docFieldDuration', rec.duration || '', '');
    setDirectiveEnvType(rec.envType || rec.wallType || '');
    const loc = String(rec.location || '').toLowerCase().trim();
    const isIndoor = (loc !== '—' && loc !== '-' && loc !== '') && (loc.includes('indoor') || loc.includes('both'));
    const isOutdoor = (loc !== '—' && loc !== '-' && loc !== '') && (loc.includes('outdoor') || loc.includes('both'));
    setDirectiveLocation(isIndoor, isOutdoor);

    // Sync Checkboxes (Install / Deliver / Pick up) - Filled with red when selected
    const mode = (rec.releasingMode || 'Pickup').toLowerCase();
    const isInstall = mode === 'install';
    const isDeliver = mode === 'deliver';
    const isPickup = mode === 'pickup' || !mode;

    const boxI = document.getElementById('boxCheckInstall') || document.querySelector('#grpCheckInstall rect');
    const boxD = document.getElementById('boxCheckDeliver') || document.querySelector('#grpCheckDeliver rect');
    const boxP = document.getElementById('boxCheckPickup') || document.querySelector('#grpCheckPickup rect');
    if (boxI) boxI.setAttribute('fill', isInstall ? '#E10600' : '#FFFFFF');
    if (boxD) boxD.setAttribute('fill', isDeliver ? '#E10600' : '#FFFFFF');
    if (boxP) boxP.setAttribute('fill', isPickup ? '#E10600' : '#FFFFFF');

    const svgChkInstall = document.getElementById('docFieldCheckInstall');
    const svgChkDeliver = document.getElementById('docFieldCheckDeliver');
    const svgChkPickup = document.getElementById('docFieldCheckPickup');
    if (svgChkInstall) svgChkInstall.textContent = '';
    if (svgChkDeliver) svgChkDeliver.textContent = '';
    if (svgChkPickup) svgChkPickup.textContent = '';

    const chkInstall = document.querySelector('#dfCheckInstall .deh-check-mark');
    const chkDeliver = document.querySelector('#dfCheckDeliver .deh-check-mark');
    const chkPickup = document.querySelector('#dfCheckPickup .deh-check-mark');
    if (chkInstall) { chkInstall.style.backgroundColor = isInstall ? '#E10600' : 'transparent'; chkInstall.textContent = ''; }
    if (chkDeliver) { chkDeliver.style.backgroundColor = isDeliver ? '#E10600' : 'transparent'; chkDeliver.textContent = ''; }
    if (chkPickup) { chkPickup.style.backgroundColor = isPickup ? '#E10600' : 'transparent'; chkPickup.textContent = ''; }

    const priorityEl = document.getElementById('docFieldPriorityStatus');
    if (priorityEl) {
      priorityEl.innerHTML = `Priority: <strong>${escapeHTML(rec.priority || 'Normal')}</strong> | Status: <strong>${escapeHTML(rec.projectStatus || rec.status || 'Pending')}</strong>`;
    }

    const deliveryEl = document.getElementById('docFieldDeliveryAddress');
    if (deliveryEl) {
      const addr = rec.completeAddress || rec.location || '—';
      deliveryEl.innerHTML = `<strong>DELIVERY / SITE ADDRESS:</strong> ${escapeHTML(addr)}`;
    }

    const ctrlInst = document.getElementById('ctrlInstallers');
    const ctrlDur = document.getElementById('ctrlDuration');
    const ctrlEnv = document.getElementById('ctrlEnvType');
    if (ctrlEnv) {
      ctrlEnv.addEventListener('change', () => {
        setDirectiveEnvType(ctrlEnv.value);
        showToast(ctrlEnv.value ? `Environment: ${ctrlEnv.options[ctrlEnv.selectedIndex]?.text}` : 'Environment cleared (Blank)');
      });
    }

    const envContainer = document.getElementById('docFieldEnvOption');
    if (envContainer) {
      envContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        openEnvOptionMenu(envContainer);
      });
    }

    const ctrlMode = document.getElementById('ctrlReleasingMode');
    const ctrlNotes = document.getElementById('ctrlNotes');
    const ctrlInCharge = document.getElementById('ctrlInCharge');
    const ctrlDrawnBy = document.getElementById('ctrlDrawnBy');

    if (ctrlInst) ctrlInst.value = rec.installers || '';
    if (ctrlDur) ctrlDur.value = rec.duration || '';
    if (ctrlMode) ctrlMode.value = normalizeReleasingMode(rec.releasingMode);
    if (ctrlNotes) ctrlNotes.value = rec.notes || '';
    if (ctrlInCharge) ctrlInCharge.value = rec.inCharge || rec.salesRep || '';
    if (ctrlDrawnBy) ctrlDrawnBy.value = rec.drawnBy || rec.artist || '';
    if (ctrlEnv) ctrlEnv.value = rec.envType || rec.wallType || '';
    const ctrlAddr = document.getElementById('ctrlAddress');
    if (ctrlAddr) ctrlAddr.value = (rec.completeAddress && rec.completeAddress !== 'N/A') ? rec.completeAddress : ((rec.location && rec.location !== 'N/A') ? rec.location : '-');
    const ctrlOrder = document.getElementById('ctrlOrderDate');
    if (ctrlOrder) ctrlOrder.value = toDotDate(rec.orderDate);
    const ctrlDue = document.getElementById('ctrlDueDate');
    if (ctrlDue) ctrlDue.value = toDotDate(rec.designDeadline || rec.releasingDate);
    const ctrlRelease = document.getElementById('ctrlReleasingDate');
    if (ctrlRelease) ctrlRelease.value = toDotDate(rec.releasingDate);

    renderAttachmentsList();

    // Re-apply saved customized cell font sizes
    if (state.customCellFonts) {
      Object.entries(state.customCellFonts).forEach(([key, size]) => {
        const target = document.getElementById(key);
        if (target && size > 0) {
          target.setAttribute('data-custom-size', size);
          if (window.SVGElement && target instanceof SVGElement) {
            target.setAttribute('font-size', size);
          }
          target.style.setProperty('font-size', size + 'px', 'important');
        }
      });
    }

    setTimeout(() => {
      autoFitDirectiveTexts();
      updateProjDividerLine();
    }, 20);
  }

  function setDirectiveLocation(indoor, outdoor) {
    state.directiveLocation = { indoor: !!indoor, outdoor: !!outdoor };
    const bgIndoor = document.getElementById('bgIndoor');
    const lblIndoor = document.getElementById('lblIndoor');
    const bgOutdoor = document.getElementById('bgOutdoor');
    const lblOutdoor = document.getElementById('lblOutdoor');

    if (bgIndoor) bgIndoor.setAttribute('fill', indoor ? '#E10600' : '#FFFFFF');
    if (lblIndoor) lblIndoor.setAttribute('fill', indoor ? '#FFFFFF' : '#000000');
    if (bgOutdoor) bgOutdoor.setAttribute('fill', outdoor ? '#E10600' : '#FFFFFF');
    if (lblOutdoor) lblOutdoor.setAttribute('fill', outdoor ? '#FFFFFF' : '#000000');

    const ctrlLoc = document.getElementById('ctrlLocation');
    if (ctrlLoc) {
      if (indoor && outdoor) ctrlLoc.value = 'Indoor & Outdoor';
      else if (indoor) ctrlLoc.value = 'Indoor';
      else if (outdoor) ctrlLoc.value = 'Outdoor';
      else ctrlLoc.value = '';
    }
  }

  function setupDirectiveControlsSync() {
    const bindSync = (controlId, docFieldId, fallback) => {
      const ctrl = document.getElementById(controlId);
      const target = document.getElementById(docFieldId);
      if (ctrl && target) {
        ctrl.addEventListener('input', () => {
          target.setAttribute('data-raw-text', ctrl.value);
          setFieldMultilineText(target, ctrl.value || fallback);
          autoFitCellText(target);
        });
      }
    };

    bindSync('ctrlInstallers', 'docFieldInstallers', '');
    bindSync('ctrlDuration', 'docFieldDuration', '');
    bindSync('ctrlInCharge', 'docFieldInCharge', 'DONA');
    bindSync('ctrlDrawnBy', 'docFieldDrawnBy', 'GLEN');
    bindSync('ctrlAddress', 'docFieldAddress', '-');
    bindSync('ctrlOrderDate', 'docFieldOrderDate', '00.00.0000');
    bindSync('ctrlDueDate', 'docFieldDueDate', '00.00.0000');
    bindSync('ctrlReleasingDate', 'docFieldReleasingDate', '00.00.0000');

    const ctrlEnv = document.getElementById('ctrlEnvType');
    if (ctrlEnv) {
      ctrlEnv.addEventListener('change', () => {
        setDirectiveEnvType(ctrlEnv.value);
        showToast(ctrlEnv.value ? `Environment: ${ctrlEnv.options[ctrlEnv.selectedIndex]?.text}` : 'Environment cleared (Blank)');
      });
    }

    const envContainer = document.getElementById('docFieldEnvOption');
    if (envContainer) {
      envContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        openEnvOptionMenu(envContainer);
      });
    }

    const ctrlLoc = document.getElementById('ctrlLocation');
    if (ctrlLoc) {
      ctrlLoc.addEventListener('change', () => {
        const val = ctrlLoc.value;
        const indoor = val.includes('Indoor');
        const outdoor = val.includes('Outdoor');
        setDirectiveLocation(indoor, outdoor);
        showToast(`Location set to: ${val || 'None'}`);
      });
    }

    const ctrlMode = document.getElementById('ctrlReleasingMode');
    if (ctrlMode) {
      ctrlMode.addEventListener('change', () => {
        setMode(ctrlMode.value);
        const target = document.getElementById('docFieldReleasingMode');
        if (target) {
          target.textContent = normalizeReleasingMode(ctrlMode.value);
          autoFitCellText(target);
        }
      });
    }

    const editableInstallers = document.getElementById('docFieldInstallers');
    if (editableInstallers) {
      editableInstallers.addEventListener('input', () => {
        const val = editableInstallers.textContent.trim();
        editableInstallers.setAttribute('data-raw-text', val);
        const ctrl = document.getElementById('ctrlInstallers');
        if (ctrl) ctrl.value = val;
        autoFitCellText(editableInstallers);
      });
    }

    const editableDuration = document.getElementById('docFieldDuration');
    if (editableDuration) {
      editableDuration.addEventListener('input', () => {
        const val = editableDuration.textContent.trim();
        editableDuration.setAttribute('data-raw-text', val);
        const ctrl = document.getElementById('ctrlDuration');
        if (ctrl) ctrl.value = val;
        autoFitCellText(editableDuration);
      });
    }
  }

  function setupDirectiveAutocomplete() {
    const input = document.getElementById('directiveLookupInput');
    const box = document.getElementById('directiveAutocompleteBox');
    const statusEl = document.getElementById('directiveLookupStatus');
    if (!input || !box) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        box.classList.remove('show');
        box.innerHTML = '';
        return;
      }

      const matches = state.requests.filter(r => 
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.requestId.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        box.innerHTML = `<div style="padding:10px 14px; font-size:12px; color:var(--text-muted);">No matching job orders found.</div>`;
      } else {
        box.innerHTML = matches.map(m => `
          <div class="autocomplete-item" onclick="window.SignDepotApp.selectAutocompleteJo('${m.joNumber}')">
            <div>
              <span class="autocomplete-jo">${escapeHTML(m.joNumber)}</span>
              <span style="font-weight:700; margin-left:8px;">${escapeHTML(m.projectName)}</span>
            </div>
            <span class="autocomplete-meta">${escapeHTML(m.requestId)} | ${escapeHTML(m.client)}</span>
          </div>
        `).join('');
      }
      box.classList.add('show');
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.classList.remove('show');
      }
    });

    const doSearch = (query) => {
      const q = (query !== undefined ? query : input.value).trim();
      if (!q) return;
      if (statusEl) {
        statusEl.textContent = 'Searching...';
        statusEl.style.color = '#64748B';
      }
      box.classList.remove('show');

      const found = getDirectiveRecord(q);
      if (found) {
        renderDirectivePreview(found.joNumber || found.requestId);
        if (statusEl) {
          statusEl.textContent = 'Loaded!';
          statusEl.style.color = '#176B55';
          setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2500);
        }
        showToast(`Directive for ${found.joNumber || found.requestId} loaded.`);
        return;
      }

      // Query database via API
      const apiUrl = window.PMS_API_URL || 'api.php';
      fetch(apiUrl + '?action=get_request&id=' + encodeURIComponent(q))
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.data) {
            normalizeRequestItem(res.data);
            if (!state.requests) state.requests = [];
            const idx = state.requests.findIndex(r => r.id == res.data.id || r.requestId == res.data.requestId || r.joNumber == res.data.joNumber);
            if (idx >= 0) {
              state.requests[idx] = res.data;
            } else {
              state.requests.unshift(res.data);
            }
            renderDirectivePreview(res.data.joNumber || res.data.requestId);
            if (statusEl) {
              statusEl.textContent = 'Loaded!';
              statusEl.style.color = '#176B55';
              setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2500);
            }
            showToast(`Directive for ${res.data.joNumber || res.data.requestId} loaded.`);
          } else {
            if (statusEl) {
              statusEl.textContent = 'Not found';
              statusEl.style.color = '#E53935';
            }
            showToast(`Job "${q}" not found.`, 'error');
          }
        })
        .catch(err => {
          if (statusEl) {
            statusEl.textContent = 'Search error';
            statusEl.style.color = '#E53935';
          }
          showToast(`Could not search server for "${q}".`, 'error');
        });
    };

    const btnSearch = document.getElementById('btnDirectiveSearch');
    if (btnSearch) {
      btnSearch.addEventListener('click', () => doSearch());
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });

    const btnClear = document.getElementById('btnDirectiveClear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        input.value = '';
        box.classList.remove('show');
        if (statusEl) statusEl.textContent = '';
      });
    }
  }

  // ==========================================================================
  // VECTOR SVG GENERATOR (Multi-Software Support: Photoshop, Illustrator, CorelDRAW, Affinity)
  // ==========================================================================

    function generateDirectiveSVG(rec) {
    if (!rec) {
      rec = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
            (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : null) ||
            {};
    }

    const toDot = (v) => {
      if (!v || v === '—' || v === '-' || v === '0000-00-00') return '00.00.0000';
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(v)) return v;
      const d = new Date(v);
      if (isNaN(d.getTime())) return v;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${mm}.${dd}.${d.getFullYear()}`;
    };

    const joNumberVal = document.getElementById('docFieldJoNumber')?.textContent?.trim() || rec.joNumber || rec.requestId || 'SD261104-019';
    const dueDateFormatted = document.getElementById('docFieldDueDate')?.textContent?.trim() || toDot(rec.designDeadline || rec.releasingDate);
    const releasingDateFormatted = document.getElementById('docFieldReleasingDate')?.textContent?.trim() || toDot(rec.releasingDate);
    const orderDateVal = document.getElementById('docFieldOrderDate')?.textContent?.trim() || toDot(rec.orderDate);
    const inChargeVal = (document.getElementById('docFieldInCharge')?.textContent?.trim() || rec.inCharge || rec.salesRep || 'SOL').toUpperCase();
    const drawnByVal = (document.getElementById('docFieldDrawnBy')?.textContent?.trim() || rec.drawnBy || rec.artist || 'DOROTHY').toUpperCase();
    const releasingModeVal = (document.getElementById('ctrlReleasingMode')?.value || rec.releasingMode || 'Pickup').toLowerCase();
    const envType = (document.getElementById('ctrlEnvType')?.value !== undefined ? document.getElementById('ctrlEnvType').value : (rec.envType || rec.wallType || state.directiveEnvType || '')).trim();
    const envSvgContent = DIRECTIVE_WALL_SVGS[envType] || '';
    let isIndoor = false;
    let isOutdoor = false;
    const bgIndoorEl = document.getElementById('bgIndoor');
    const bgOutdoorEl = document.getElementById('bgOutdoor');
    if (bgIndoorEl && bgOutdoorEl) {
      isIndoor = bgIndoorEl.getAttribute('fill') === '#E10600';
      isOutdoor = bgOutdoorEl.getAttribute('fill') === '#E10600';
    } else if (state.directiveLocation) {
      isIndoor = !!state.directiveLocation.indoor;
      isOutdoor = !!state.directiveLocation.outdoor;
    } else if (rec && rec.location) {
      const locStr = String(rec.location || '').toLowerCase().trim();
      isIndoor = (locStr !== '—' && locStr !== '-' && locStr !== '') && (locStr.includes('indoor') || locStr.includes('both'));
      isOutdoor = (locStr !== '—' && locStr !== '-' && locStr !== '') && (locStr.includes('outdoor') || locStr.includes('both'));
    }
    const installersVal = document.getElementById('docFieldInstallers')?.textContent?.trim() || rec.installers || '';
    const durationVal = document.getElementById('docFieldDuration')?.textContent?.trim() || rec.duration || '';
    const addressVal = document.getElementById('docFieldAddress')?.textContent?.trim() || rec.completeAddress || rec.location || '-';
    const projectNameVal = document.getElementById('docFieldProjectName')?.textContent?.trim() || rec.projectName || 'DTF FABRIC';
    const clientVal = document.getElementById('docFieldClientName')?.textContent?.trim() || rec.client || 'DANIELA TAYANGONA';
    const contactPersonVal = document.getElementById('docFieldContactPerson')?.textContent?.trim() || rec.contactPerson || '-';
    const contactNumberVal = document.getElementById('docFieldContactNumber')?.textContent?.trim() || rec.contactNumber || '-';

    const checkInstall = releasingModeVal === 'install' ? '✓' : '';
    const checkDeliver = releasingModeVal === 'deliver' ? '✓' : '';
    const checkPickup = (releasingModeVal === 'pickup' || !releasingModeVal) ? '✓' : '';

    const getSz = (id, def) => (state.customCellFonts && state.customCellFonts[id]) ? state.customCellFonts[id] : def;
    const bebasB64 = (typeof window !== 'undefined' && window.__BEBAS_KAI_B64) ? `url('data:font/otf;charset=utf-8;base64,${window.__BEBAS_KAI_B64}') format('opentype'), ` : '';

    const makeSvgField = (id, x, defaultY, defaultSz, className, textAnchor = 'middle', letterSpacing = '', defaultFill = null) => {
      const sz = getSz(id, defaultSz);
      let raw = getFieldRawText(id);
      if (!raw) {
        if (id === 'docFieldInstallers') raw = document.getElementById('ctrlInstallers')?.value?.trim() || rec?.installers || '';
        else if (id === 'docFieldDuration') raw = document.getElementById('ctrlDuration')?.value?.trim() || rec?.duration || '';
        else if (id === 'docFieldAddress') raw = document.getElementById('ctrlAddress')?.value?.trim() || rec?.completeAddress || rec?.location || '-';
        else if (id === 'docFieldOrderDate') raw = document.getElementById('ctrlOrderDate')?.value?.trim() || toDot(rec?.orderDate);
        else if (id === 'docFieldDueDate') raw = document.getElementById('ctrlDueDate')?.value?.trim() || toDot(rec?.designDeadline || rec?.releasingDate);
        else if (id === 'docFieldReleasingDate') raw = document.getElementById('ctrlReleasingDate')?.value?.trim() || toDot(rec?.releasingDate);
        else if (id === 'docFieldJoNumber') raw = document.getElementById('docFieldJoNumber')?.textContent?.trim() || rec?.joNumber || rec?.requestId || '';
      }
      if (id === 'docFieldJoNumber' && raw) {
        raw = raw.replace(/^JO#:\s*/i, '').trim();
      }
      const lines = raw ? raw.split('\n') : [''];
      const anchorAttr = textAnchor !== 'start' ? `text-anchor="${textAnchor}"` : '';
      const spacingAttr = letterSpacing ? `letter-spacing="${letterSpacing}"` : '';
      const isWhiteText = (id === 'docFieldJoNumber' || id === 'docFieldDueDate');
      const textFill = defaultFill || (isWhiteText ? '#FFFFFF' : '#000000');
      const fillAttr = `fill="${textFill}"`;

      if (lines.length <= 1) {
        return `<text x="${x}" y="${defaultY}" ${fillAttr} font-size="${sz}" class="${className}" ${anchorAttr} ${spacingAttr} id="${id}">${escapeHTML(lines[0] || '')}</text>`;
      }

      const lh = Math.round(sz * 1.05 * 10) / 10;
      const startY = Math.round((defaultY - ((lines.length - 1) * lh) / 2) * 10) / 10;
      const tspans = lines.map((line, idx) => {
        const lineY = Math.round((startY + idx * lh) * 10) / 10;
        return `<tspan x="${x}" y="${lineY}">${escapeHTML(line)}</tspan>`;
      }).join('');
      return `<text ${fillAttr} font-size="${sz}" class="${className}" ${anchorAttr} ${spacingAttr} id="${id}">${tspans}</text>`;
    };

    const clientRaw = getFieldRawText('docFieldClientName') || 'INTEGU PHILIPPINES, INC';
    const clientCustomSz = (state.customCellFonts && state.customCellFonts['docFieldClientName']) ? state.customCellFonts['docFieldClientName'] : null;
    const clientFit = fitDirectiveClientName(clientRaw, clientCustomSz);

    const projRaw = getFieldRawText('docFieldProjectName') || 'DTF FABRIC';
    let projAutoSz = getSz('docFieldProjectName', 12);
    while (projAutoSz > 8.5 && getSvgTextWidth(projRaw, projAutoSz, 0.5) > 210) {
      projAutoSz = Math.round((projAutoSz - 0.5) * 10) / 10;
    }

    let clientX1 = 412;
    let clientX2 = 492;
    const domLine = document.getElementById('docProjDividerLine');
    if (domLine && domLine.getAttribute('x1') && domLine.getAttribute('x2')) {
      clientX1 = parseFloat(domLine.getAttribute('x1'));
      clientX2 = parseFloat(domLine.getAttribute('x2'));
    } else {
      const estW = Math.min(214, Math.max(16, clientFit.widestLineWidth));
      clientX1 = Math.round((452 - estW / 2) * 10) / 10;
      clientX2 = Math.round((452 + estW / 2) * 10) / 10;
    }

    const joRawVal = (getFieldRawText('docFieldJoNumber') || rec.joNumber || rec.requestId || 'SD261104-019').replace(/^JO#:\s*/i, '').trim();
    let joSz = getSz('docFieldJoNumber', 28);
    if (joRawVal.length > 12 && !state.customCellFonts?.['docFieldJoNumber']) {
      joSz = Math.max(18, Math.round(28 * (12 / joRawVal.length) * 10) / 10);
    }
    const joNumX = Math.round(10 + joSz * 1.78);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 904 96" width="3616" height="384" style="background:#FFFFFF;">
  <defs>
    <style>
      @font-face {
        font-family: 'Bebas Kai';
        src: ${bebasB64}url('../fonts/BebasKai.otf') format('opentype'),
             url('../fonts/BebasKai.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      text { font-family:'Bebas Kai','BebasKai','Archivo','Oswald',sans-serif; font-weight: normal !important; }
      .cond-black { font-family:'Bebas Kai','BebasKai','Archivo','Oswald',sans-serif; font-weight: normal !important; }
      .cond-bold { font-family:'Bebas Kai','BebasKai','Archivo','Oswald',sans-serif; font-weight: normal !important; }
      .cond-semi { font-family:'Bebas Kai','BebasKai','Archivo','Oswald',sans-serif; font-weight: normal !important; }
      .chinese { font-family:'Microsoft YaHei','SimSun','PingFang SC','Noto Sans CJK SC',sans-serif; font-weight:bold; }
      tspan.chinese { font-family:'Microsoft YaHei','SimSun','PingFang SC','Noto Sans CJK SC',sans-serif; font-weight:bold; }
      .center-txt { text-anchor: middle; }
    </style>
  </defs>

  <rect x="0" y="0" width="904" height="96" fill="#FFFFFF"/>

  <!-- Col 1 (x: 0 to 225) -->
  <rect x="0" y="0" width="225" height="33" fill="#000000"/>
  <text x="10" y="26.5" fill="#FFFFFF" font-size="${joSz}" class="cond-black" letter-spacing="0.5">JO#:</text>
  ${makeSvgField('docFieldJoNumber', joNumX, 26.5, joSz, 'cond-black', 'start', '0.5', '#FFFFFF')}

  <line x1="0" y1="33" x2="225" y2="33" stroke="#000000" stroke-width="1.5"/>
  <text x="8" y="47" fill="#000000" font-size="13.5" class="cond-bold">IN CHARGE<tspan font-size="11.5" class="chinese">负责人</tspan>  :</text>
  ${makeSvgField('docFieldInCharge', 218, 47, 15, 'cond-bold', 'end')}

  <text x="8" y="68" fill="#000000" font-size="13.5" class="cond-bold">DRAWN BY <tspan font-size="11.5" class="chinese">通过绘制</tspan>  :</text>
  ${makeSvgField('docFieldDrawnBy', 218, 68, 15, 'cond-bold', 'end')}

  <g transform="translate(6, 80.7) scale(0.39)">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#000000"/>
  </g>
  <text x="16.5" y="89.5" fill="#000000" font-size="12" class="cond-bold">ADDRESS <tspan font-size="11" class="chinese">地址</tspan>  :</text>
  <rect x="100" y="79" width="120" height="13.5" rx="2" fill="#E8EBED"/>
  ${makeSvgField('docFieldAddress', 216, 89.5, 12, 'cond-bold', 'end')}

  <line x1="225" y1="0" x2="225" y2="96" stroke="#000000" stroke-width="2"/>

  <!-- Col 2 (x: 225 to 340) -->
  <text x="282.5" y="13.5" fill="#000000" font-size="12" class="cond-bold center-txt">ORDER DATE <tspan font-size="10.5" class="chinese">订购日期</tspan></text>
  ${makeSvgField('docFieldOrderDate', 282.5, 27.5, 14, 'cond-bold center-txt', 'middle')}

  <line x1="225" y1="33" x2="340" y2="33" stroke="#000000" stroke-width="1.5"/>
  <rect x="225" y="33" width="115" height="32" fill="#000000"/>
  <text x="282.5" y="47" fill="#FFFFFF" font-size="13" class="cond-bold center-txt" letter-spacing="0.5">DUE DATE</text>
  ${makeSvgField('docFieldDueDate', 282.5, 60, 14, 'cond-bold center-txt', 'middle', '', '#FFFFFF')}

  <line x1="225" y1="65" x2="340" y2="65" stroke="#000000" stroke-width="1.5"/>
  <text x="282.5" y="77" fill="#000000" font-size="11.5" class="cond-bold center-txt" letter-spacing="0.2">DATE TO BE RELEASE</text>
  ${makeSvgField('docFieldReleasingDate', 282.5, 90, 14, 'cond-bold center-txt', 'middle')}

  <line x1="340" y1="0" x2="340" y2="96" stroke="#000000" stroke-width="2"/>

  <!-- Col 3 (x: 340 to 564) -->
  <rect x="340" y="0" width="112" height="18" fill="${isIndoor ? '#E10600' : '#FFFFFF'}"/>
  <rect x="452" y="0" width="112" height="18" fill="${isOutdoor ? '#E10600' : '#FFFFFF'}"/>
  <line x1="452" y1="0" x2="452" y2="18" stroke="#000000" stroke-width="1"/>
  <text x="396" y="14" fill="${isIndoor ? '#FFFFFF' : '#000000'}" font-size="13.5" class="cond-black center-txt" letter-spacing="0.5">INDOOR</text>
  <text x="508" y="14" fill="${isOutdoor ? '#FFFFFF' : '#000000'}" font-size="13.5" class="cond-black center-txt" letter-spacing="0.5">OUTDOOR</text>

  <line x1="340" y1="18" x2="564" y2="18" stroke="#000000" stroke-width="1.5"/>
  ${clientFit.lines.length <= 1 ?
    `<text x="452" y="44" font-size="${clientFit.fontSize}" class="cond-black center-txt" text-anchor="middle" letter-spacing="0.8" id="docFieldClientName">${escapeHTML(clientFit.lines[0] || '')}</text>` :
    `<text x="452" font-size="${clientFit.fontSize}" class="cond-black center-txt" text-anchor="middle" letter-spacing="0.8" id="docFieldClientName">${clientFit.lines.map((l, idx) => `<tspan x="452" y="${Math.round((clientFit.startY + idx * clientFit.lineHeight) * 10) / 10}">${escapeHTML(l)}</tspan>`).join('')}</text>`
  }
  <line x1="${clientX1}" y1="${clientFit.divY}" x2="${clientX2}" y2="${clientFit.divY}" stroke="#000000" stroke-width="1" id="docProjDividerLine"/>
  ${makeSvgField('docFieldProjectName', 452, clientFit.projY, projAutoSz, 'cond-bold center-txt', 'middle', '0.5')}

  <rect x="347" y="78.5" width="10" height="10" fill="${releasingModeVal === 'install' ? '#E10600' : '#FFFFFF'}" stroke="#000000" stroke-width="1.2" id="boxCheckInstall"/>
  <text x="361" y="87" fill="#000000" font-size="12" class="cond-bold">INSTALL <tspan font-size="10.5" class="chinese">安装</tspan></text>

  <rect x="424" y="78.5" width="10" height="10" fill="${releasingModeVal === 'deliver' ? '#E10600' : '#FFFFFF'}" stroke="#000000" stroke-width="1.2" id="boxCheckDeliver"/>
  <text x="438" y="87" fill="#000000" font-size="12" class="cond-bold">DELIVER <tspan font-size="10.5" class="chinese">送货</tspan></text>

  <rect x="498" y="78.5" width="10" height="10" fill="${(releasingModeVal === 'pickup' || !releasingModeVal) ? '#E10600' : '#FFFFFF'}" stroke="#000000" stroke-width="1.2" id="boxCheckPickup"/>
  <text x="512" y="87" fill="#000000" font-size="12" class="cond-bold">PICK UP <tspan font-size="10.5" class="chinese">自取</tspan></text>

  <line x1="564" y1="0" x2="564" y2="96" stroke="#000000" stroke-width="2"/>

  <!-- Col 4 (x: 564 to 822) -->
  <rect x="564" y="0" width="97" height="43" fill="#000000"/>
  <text x="612.5" y="13" fill="#FFFFFF" font-size="10.5" class="cond-bold center-txt" letter-spacing="0.2">ON-SITE INSTALLATION</text>
  <text x="612.5" y="24.5" fill="#FFFFFF" font-size="10.5" class="cond-bold center-txt" letter-spacing="0.2">ENVIRONMENT OPTIONS</text>
  <text x="612.5" y="36.5" fill="#FFFFFF" font-size="10" class="chinese center-txt">现场安装环境选项</text>

  <!-- Wall Option Container -->
  <g id="docFieldEnvOption" data-env-type="${escapeHTML(envType)}">
    <rect x="661" y="0" width="161" height="43" fill="#FFFFFF"/>
    <svg id="docEnvSvg" x="661" y="0" width="161" height="43" viewBox="0 0 10572.6 3022.83" preserveAspectRatio="xMidYMid meet">
      ${envSvgContent}
    </svg>
  </g>

  <line x1="564" y1="43" x2="822" y2="43" stroke="#000000" stroke-width="1.5"/>
  <text x="572" y="58" fill="#000000" font-size="12.5" class="cond-bold">CONTACT PERSON <tspan font-size="11" class="chinese">联络人</tspan>  :</text>
  <rect x="716" y="47.5" width="98" height="15" rx="2" fill="#E8EBED"/>
  ${makeSvgField('docFieldContactPerson', 765, 59, 13, 'cond-bold center-txt', 'middle')}

  <text x="572" y="85" fill="#000000" font-size="12.5" class="cond-bold">CONTACT NUMBER <tspan font-size="11" class="chinese">联系电话</tspan>  :</text>
  <rect x="716" y="74.5" width="98" height="15" rx="2" fill="#E8EBED"/>
  ${makeSvgField('docFieldContactNumber', 765, 86, 13, 'cond-bold center-txt', 'middle')}

  <line x1="822" y1="0" x2="822" y2="96" stroke="#000000" stroke-width="2"/>

  <!-- Col 5 (x: 822 to 904) -->
  <rect x="822" y="0" width="82" height="22" fill="#000000"/>
  <text x="863" y="11" fill="#FFFFFF" font-size="9.5" class="cond-bold center-txt" letter-spacing="0.2">NUMBER OF INSTALLERS</text>
  <text x="863" y="20" fill="#FFFFFF" font-size="9" class="chinese center-txt">安装人数</text>
  ${makeSvgField('docFieldInstallers', 863, 38, 14, 'cond-bold center-txt', 'middle')}

  <line x1="822" y1="48" x2="904" y2="48" stroke="#000000" stroke-width="1.5"/>
  <rect x="822" y="48" width="82" height="22" fill="#000000"/>
  <text x="863" y="59" fill="#FFFFFF" font-size="9.5" class="cond-bold center-txt" letter-spacing="0.2">INSTALLATION DURATION</text>
  <text x="863" y="68" fill="#FFFFFF" font-size="9.5" class="chinese center-txt">安装时长</text>
  ${makeSvgField('docFieldDuration', 863, 86, 14, 'cond-bold center-txt', 'middle')}

  <rect x="0" y="0" width="904" height="96" fill="none" stroke="#000000" stroke-width="2"/>
</svg>`;
  }

  function setupDirectiveActions() {
    // COPY AS VECTOR GRAPHIC (Multi-Software Support: Photoshop, Illustrator, CorelDRAW, Affinity Designer)
    const handleCopyVector = async () => {
      const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                  (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
      const cleanSvg = generateDirectiveSVG(cur).trim();
      
      // Standard HTML clipboard fragment for Windows CF_HTML (Photoshop Smart Object & Corel/Illustrator Vector parse)
      const htmlPayload = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><!--StartFragment-->${cleanSvg}<!--EndFragment--></body></html>`;

      let copySuccess = false;

      // 1. Try modern Asynchronous Clipboard API with rich multi-MIME payload
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml' });
          const htmlBlob = new Blob([htmlPayload], { type: 'text/html' });
          const textBlob = new Blob([cleanSvg], { type: 'text/plain' });

          await navigator.clipboard.write([
            new ClipboardItem({
              'image/svg+xml': svgBlob,
              'text/html': htmlBlob,
              'text/plain': textBlob
            })
          ]);
          copySuccess = true;
        } catch (mimeErr) {
          // If browser rejects image/svg+xml in write, write text/html (CF_HTML) and text/plain
          try {
            const htmlBlob = new Blob([htmlPayload], { type: 'text/html' });
            const textBlob = new Blob([cleanSvg], { type: 'text/plain' });

            await navigator.clipboard.write([
              new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob
              })
            ]);
            copySuccess = true;
          } catch (writeErr) {
            console.warn('Clipboard write fallback triggered', writeErr);
          }
        }
      }

      // 2. Synchronous Clipboard Event Fallback (sets CF_HTML and CF_UNICODETEXT on Windows)
      if (!copySuccess) {
        try {
          const copyHandler = (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/html', htmlPayload);
            e.clipboardData.setData('text/plain', cleanSvg);
            try {
              e.clipboardData.setData('image/svg+xml', cleanSvg);
            } catch (ignore) {}
          };
          document.addEventListener('copy', copyHandler, { once: true });
          copySuccess = document.execCommand('copy');
        } catch (e) {
          copySuccess = false;
        }
      }

      if (copySuccess) {
        showToast('SVG vector code copied (for Illustrator / Figma). For CorelDRAW: Click "Download Vector" & drag into Corel, or use "Copy Image" for Ctrl+V.');
      } else {
        copyFallback(cleanSvg);
      }
    };

    // Download EMF file converted for native CorelDRAW vector compatibility
    async function downloadDirectiveEMF(record) {
      const cur = record || (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                  (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
      const svgString = generateDirectiveSVG(cur);
      const joRaw = cur && (cur.joNumber || cur.requestId || 'Header');
      const joClean = String(joRaw).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Directive-Header-${joClean}`;

      showToast('Converting vector to CorelDRAW EMF format...', 'info');

      try {
        const formData = new FormData();
        formData.append('svg', svgString);
        formData.append('filename', filename);

        const apiEndpoint = (window.PMS_API_URL || 'api.php') + '?action=convert_emf';
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errText = await response.text();
          let msg = 'Conversion failed';
          try {
            const j = JSON.parse(errText);
            if (j.error) msg = j.error;
          } catch (e) {
            if (errText) msg = errText;
          }
          throw new Error(msg);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.emf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('CorelDRAW EMF vector downloaded! Drag & drop directly into CorelDRAW or press Ctrl+I.', 'success');
      } catch (err) {
        console.error('EMF conversion error:', err);
        showToast('Failed to convert EMF: ' + err.message, 'error');
      }
    }
    window.downloadDirectiveEMF = downloadDirectiveEMF;

    // Direct Copy Ultra-HD 4K Image (3616 × 384 px) for CorelDRAW, Photoshop, Affinity, Illustrator
    function handleCopyImage4K(e, customRec) {
      const cur = customRec || (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                  (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
      const svgString = generateDirectiveSVG(cur);
      
      const scale = 4;
      const targetWidth = 904 * scale;  // 3616px
      const targetHeight = 96 * scale;  // 384px

      const svg4K = svgString
        .replace(/width="[0-9]+"/, `width="${targetWidth}"`)
        .replace(/height="[0-9]+"/, `height="${targetHeight}"`);

      showToast('Rendering 4K ultra-sharp image for clipboard...', 'info');

      const img = new Image();
      const svgBlob = new Blob([svg4K], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          URL.revokeObjectURL(url);

          canvas.toBlob(async (blob) => {
            if (!blob) {
              showToast('Failed to generate 4K image data.', 'error');
              return;
            }

            if (e && e.shiftKey) {
              const dlUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = dlUrl;
              a.download = `Directive-Header-4K-${cur.joNumber || 'Job'}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(dlUrl);
              showToast('4K Ultra-HD PNG downloaded (3616 × 384 px)!', 'success');
              return;
            }

            try {
              if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('Ultra-HD 4K image copied (3616 × 384 px)! Ready to paste (Ctrl+V) directly into CorelDRAW, PS, or Illustrator.', 'success');
              } else {
                throw new Error('Clipboard API unavailable');
              }
            } catch (err) {
              const dlUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = dlUrl;
              a.download = `Directive-Header-4K-${cur.joNumber || 'Job'}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(dlUrl);
              showToast('Clipboard access restricted. Downloaded 4K PNG file instead.', 'info');
            }
          }, 'image/png', 1.0);
        } catch (renderErr) {
          URL.revokeObjectURL(url);
          console.error('Canvas render error:', renderErr);
          showToast('Failed to render 4K graphic: ' + renderErr.message, 'error');
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        showToast('Failed to render 4K graphic for clipboard.', 'error');
      };
      img.src = url;
    }
    window.handleCopyImage4K = handleCopyImage4K;

    // Export Dropdown menu bindings (Directives Details page)
    const btnExpDropdown = document.getElementById('btnDirectiveExportDropdown');
    const expMenu = document.getElementById('directiveExportMenu');
    if (btnExpDropdown && expMenu) {
      btnExpDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = expMenu.classList.contains('show');
        document.querySelectorAll('.directive-export-menu.show').forEach(m => m.classList.remove('show'));
        if (!isOpen) {
          const rect = btnExpDropdown.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          if (spaceBelow < 260 && spaceAbove > 220) {
            expMenu.classList.add('open-on-top');
          } else {
            expMenu.classList.remove('open-on-top');
          }
          expMenu.classList.add('show');
          btnExpDropdown.setAttribute('aria-expanded', 'true');
        } else {
          expMenu.classList.remove('show');
          expMenu.classList.remove('open-on-top');
          btnExpDropdown.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (!window.__directiveExportMenuGlobalListenerAttached) {
      window.__directiveExportMenuGlobalListenerAttached = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.directive-dropdown-container')) {
          document.querySelectorAll('.directive-export-menu.show').forEach(m => {
            m.classList.remove('show');
            const btn = m.parentElement ? m.parentElement.querySelector('.directive-dropdown-btn') : null;
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    const optDownloadEMF = document.getElementById('optDirectiveDownloadEMF');
    if (optDownloadEMF) {
      optDownloadEMF.addEventListener('click', () => {
        if (expMenu) expMenu.classList.remove('show');
        downloadDirectiveEMF();
      });
    }

    const optCopyPNG = document.getElementById('optDirectiveCopyPNG');
    if (optCopyPNG) {
      optCopyPNG.addEventListener('click', (e) => {
        if (expMenu) expMenu.classList.remove('show');
        handleCopyImage4K(e);
      });
    }

    const optCopySVG = document.getElementById('optDirectiveCopySVG');
    if (optCopySVG) {
      optCopySVG.addEventListener('click', (e) => {
        if (expMenu) expMenu.classList.remove('show');
        handleCopyVector(e);
      });
    }

    const optDownloadSVG = document.getElementById('optDirectiveDownloadSVG');
    if (optDownloadSVG) {
      optDownloadSVG.addEventListener('click', () => {
        if (expMenu) expMenu.classList.remove('show');
        const legacyDl = document.getElementById('btnDirectiveDownloadSVG');
        if (legacyDl) {
          legacyDl.click();
        } else {
          const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                      (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
          const svgString = generateDirectiveSVG(cur);
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Sign_Depot_Directive_${cur.joNumber || 'Job'}.svg`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Vector SVG downloaded! Drag & drop the file into CorelDRAW or press Ctrl+I.');
        }
      });
    }

    const btnCopySVG = document.getElementById('btnDirectiveCopySVG');
    const btnQuickCopy = document.getElementById('btnQuickCopyVector');
    if (btnCopySVG) btnCopySVG.addEventListener('click', handleCopyVector);
    if (btnQuickCopy) btnQuickCopy.addEventListener('click', handleCopyVector);

    const svgEl = document.getElementById('directiveExactSvg');
    if (svgEl) {
      svgEl.addEventListener('click', (e) => {
        const textNode = e.target.closest('text.interactive-field');
        if (!textNode) return;
        const titleAttr = textNode.getAttribute('title') || '';
        const fieldName = titleAttr.replace('Click to edit ', '') || textNode.id.replace('docField', '');
        const currentVal = textNode.textContent.trim();
        const newVal = prompt(`Edit ${fieldName}:`, (currentVal === '—' || currentVal === '-') ? '' : currentVal);
        if (newVal !== null) {
          const finalVal = newVal.trim() !== '' ? newVal.trim() : '—';
          textNode.textContent = finalVal;
          if (textNode.id === 'docFieldInstallers') {
            const ctrl = document.getElementById('ctrlInstallers');
            if (ctrl) ctrl.value = finalVal;
          } else if (textNode.id === 'docFieldDuration') {
            const ctrl = document.getElementById('ctrlDuration');
            if (ctrl) ctrl.value = finalVal;
          } else if (textNode.id === 'docFieldInCharge') {
            const ctrl = document.getElementById('ctrlInCharge');
            if (ctrl) ctrl.value = finalVal;
          } else if (textNode.id === 'docFieldDrawnBy') {
            const ctrl = document.getElementById('ctrlDrawnBy');
            if (ctrl) ctrl.value = finalVal;
          }
          showToast(`Updated ${fieldName}`);
        }
      });
    }

    // COPY ULTRA-HD 4K IMAGE (Instant Ctrl+V for CorelDRAW, Photoshop, Affinity, Illustrator, Chat)
    const btnCopyPNG = document.getElementById('btnDirectiveCopyPNG');
    if (btnCopyPNG) {
      btnCopyPNG.addEventListener('click', (e) => handleCopyImage4K(e));
    }

    // DOWNLOAD VECTOR SVG FILE (Direct 1-click for CorelDRAW Drag & Drop or Import)
    const btnDownloadSVG = document.getElementById('btnDirectiveDownloadSVG');
    if (btnDownloadSVG) {
      btnDownloadSVG.addEventListener('click', () => {
        const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                    (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
        const svgString = generateDirectiveSVG(cur);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sign_Depot_Directive_${cur.joNumber || 'Job'}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Vector SVG downloaded! Drag & drop the file into CorelDRAW or press Ctrl+I.`);
      });
    }

    const btnSave = document.getElementById('btnDirectiveSaveDraft');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo);
        if (cur) {
          cur.installers = document.getElementById('ctrlInstallers').value;
          cur.duration = document.getElementById('ctrlDuration').value;
          cur.releasingMode = normalizeReleasingMode(document.getElementById('ctrlReleasingMode').value);
          cur.notes = document.getElementById('ctrlNotes') ? document.getElementById('ctrlNotes').value : (cur.notes || '');
          cur.inCharge = document.getElementById('ctrlInCharge').value;
          cur.drawnBy = document.getElementById('ctrlDrawnBy').value;
          saveStateToStorage();
          if (window.PMS_API_URL) {
            fetch(window.PMS_API_URL + '?action=update_field', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: cur.id, field: 'releasingMode', value: cur.releasingMode, module: 'directives-details' })
            }).catch(() => {});
            fetch(window.PMS_API_URL + '?action=update_field', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: cur.id, field: 'remarks', value: cur.notes, module: 'directives-details' })
            }).catch(() => {});
          }
          showToast(`Draft for ${cur.joNumber} saved to database.`);
        }
      });
    }

    const btnPrint = document.getElementById('btnDirectivePrint');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

        // Background Clarity Switcher (Vector 4K vs Original Image)
    const btnBgVec = document.getElementById('btnBgVector');
    const btnBgOrig = document.getElementById('btnBgOriginal');
    const headerBgImg = document.getElementById('directiveHeaderBg');

    if (btnBgVec && btnBgOrig && headerBgImg) {
      btnBgVec.onclick = () => {
        headerBgImg.src = '../assets/img/directive-header-clear.svg?v=' + Date.now();
        btnBgVec.style.background = '#0F172A';
        btnBgVec.style.color = '#FFFFFF';
        btnBgOrig.style.background = '#FFFFFF';
        btnBgOrig.style.color = '#64748B';
        showToast('Switched to Razor-Sharp Vector Background (4K)');
      };

      btnBgOrig.onclick = () => {
        headerBgImg.src = '../assets/img/directive-header-template.png?v=' + Date.now();
        btnBgOrig.style.background = '#0F172A';
        btnBgOrig.style.color = '#FFFFFF';
        btnBgVec.style.background = '#FFFFFF';
        btnBgVec.style.color = '#64748B';
        showToast('Switched to Original Template Image');
      };
    }

    // Interactive Checkboxes for Releasing Mode (Install, Deliver, Pick up)
    const setMode = (modeStr) => {
      const ctrl = document.getElementById('ctrlReleasingMode');
      if (ctrl) ctrl.value = modeStr;
      const m = (modeStr || 'Pickup').toLowerCase();
      const isInstall = m === 'install';
      const isDeliver = m === 'deliver';
      const isPickup = m === 'pickup' || !m;

      const boxI = document.getElementById('boxCheckInstall') || document.querySelector('#grpCheckInstall rect');
      const boxD = document.getElementById('boxCheckDeliver') || document.querySelector('#grpCheckDeliver rect');
      const boxP = document.getElementById('boxCheckPickup') || document.querySelector('#grpCheckPickup rect');
      if (boxI) boxI.setAttribute('fill', isInstall ? '#E10600' : '#FFFFFF');
      if (boxD) boxD.setAttribute('fill', isDeliver ? '#E10600' : '#FFFFFF');
      if (boxP) boxP.setAttribute('fill', isPickup ? '#E10600' : '#FFFFFF');

      const svgChkInstall = document.getElementById('docFieldCheckInstall');
      const svgChkDeliver = document.getElementById('docFieldCheckDeliver');
      const svgChkPickup = document.getElementById('docFieldCheckPickup');
      if (svgChkInstall) svgChkInstall.textContent = '';
      if (svgChkDeliver) svgChkDeliver.textContent = '';
      if (svgChkPickup) svgChkPickup.textContent = '';

      const chkI = document.querySelector('#dfCheckInstall .deh-check-mark');
      const chkD = document.querySelector('#dfCheckDeliver .deh-check-mark');
      const chkP = document.querySelector('#dfCheckPickup .deh-check-mark');
      if (chkI) { chkI.style.backgroundColor = isInstall ? '#E10600' : 'transparent'; chkI.textContent = ''; }
      if (chkD) { chkD.style.backgroundColor = isDeliver ? '#E10600' : 'transparent'; chkD.textContent = ''; }
      if (chkP) { chkP.style.backgroundColor = isPickup ? '#E10600' : 'transparent'; chkP.textContent = ''; }

      showToast('Releasing Mode: ' + modeStr);
    };

    const elChkI = document.getElementById('dfCheckInstall') || document.getElementById('grpCheckInstall');
    const elChkD = document.getElementById('dfCheckDeliver') || document.getElementById('grpCheckDeliver');
    const elChkP = document.getElementById('dfCheckPickup') || document.getElementById('grpCheckPickup');
    if (elChkI) elChkI.onclick = () => setMode('Install');
    if (elChkD) elChkD.onclick = () => setMode('Deliver');
    if (elChkP) elChkP.onclick = () => setMode('Pickup');

    const btnReset = document.getElementById('btnDirectiveReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.customCellFonts = {};
        if (typeof setDirectiveZoom === 'function') setDirectiveZoom(100);
        if (typeof setDirectiveEnvType === 'function') setDirectiveEnvType('');
        saveStateToStorage();
        const table = document.getElementById('directiveGridTable');
        if (table) {
          table.querySelectorAll('td, text.interactive-field, text.bebas-field').forEach(c => {
            c.removeAttribute('data-custom-size');
            c.style.removeProperty('font-size');
          });
          const defaultSizes = {
            docFieldJoNumber: 28,
            docFieldDueDate: 14,
            docFieldOrderDate: 14,
            docFieldReleasingDate: 14,
            docFieldClientName: 22,
            docFieldProjectName: 12,
            docFieldInCharge: 15,
            docFieldDrawnBy: 15,
            docFieldAddress: 12,
            docFieldContactPerson: 13,
            docFieldContactNumber: 13,
            docFieldInstallers: 14,
            docFieldDuration: 14
          };
          Object.entries(defaultSizes).forEach(([id, sz]) => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('font-size', sz);
          });
        }
        renderDirectivePreview(state.currentDirectiveJo);
        showToast('All cell font sizes reset to standard defaults.');
      });
    }

    // CUSTOMIZED PER-CELL FONT SIZE CONTROLS (Customized per individual cell, not everything!)
    const getActiveOrTargetCell = () => {
      if (activeDirectiveCell && document.body.contains(activeDirectiveCell)) {
        return activeDirectiveCell;
      }
      const defaultCell = document.getElementById('docFieldProjectName') || document.querySelector('.doc-proj-cell') || document.querySelector('.interactive-field');
      if (defaultCell) selectDirectiveCell(defaultCell);
      return defaultCell;
    };

    const btnCellDec = document.getElementById('btnCellFontDec');
    if (btnCellDec) {
      btnCellDec.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const current = getCellCurrentFontSize(cell);
          const next = Math.max(6, Math.round(current - 1));
          setCellCustomFontSize(cell, next);
          showToast(`Font size for ${getCellFriendlyName(cell)}: ${next}px`);
        }
      });
    }

    const btnCellInc = document.getElementById('btnCellFontInc');
    if (btnCellInc) {
      btnCellInc.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const current = getCellCurrentFontSize(cell);
          const next = Math.min(72, Math.round(current + 1));
          setCellCustomFontSize(cell, next);
          showToast(`Font size for ${getCellFriendlyName(cell)}: ${next}px`);
        }
      });
    }

    const cellFontInput = document.getElementById('cellFontSizeInput');
    if (cellFontInput) {
      const handleCellFontChange = () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const val = parseFloat(cellFontInput.value);
          if (!isNaN(val) && val >= 6 && val <= 72) {
            setCellCustomFontSize(cell, val);
          }
        }
      };
      cellFontInput.addEventListener('input', handleCellFontChange);
      cellFontInput.addEventListener('change', handleCellFontChange);
    }

    // Box Width Controls
    const btnBoxWDec = document.getElementById('btnBoxWidthDec');
    if (btnBoxWDec) {
      btnBoxWDec.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const boxDef = DIRECTIVE_FIELD_BOXES[cell.id] || { w: 100 };
          const saved = (state.customBoxSizes && state.customBoxSizes[cell.id]) || {};
          const cur = saved.w || boxDef.w;
          setCellCustomBoxSize(cell, Math.max(30, cur - 10));
        }
      });
    }

    const btnBoxWInc = document.getElementById('btnBoxWidthInc');
    if (btnBoxWInc) {
      btnBoxWInc.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const boxDef = DIRECTIVE_FIELD_BOXES[cell.id] || { w: 100 };
          const saved = (state.customBoxSizes && state.customBoxSizes[cell.id]) || {};
          const cur = saved.w || boxDef.w;
          setCellCustomBoxSize(cell, Math.min(800, cur + 10));
        }
      });
    }

    const cellBoxWInput = document.getElementById('cellBoxWidthInput');
    if (cellBoxWInput) {
      const handleWChange = () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const val = parseFloat(cellBoxWInput.value);
          if (!isNaN(val) && val >= 30 && val <= 800) {
            setCellCustomBoxSize(cell, val);
          }
        }
      };
      cellBoxWInput.addEventListener('input', handleWChange);
      cellBoxWInput.addEventListener('change', handleWChange);
    }

    // Box Height Controls
    const btnBoxHDec = document.getElementById('btnBoxHeightDec');
    if (btnBoxHDec) {
      btnBoxHDec.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const boxDef = DIRECTIVE_FIELD_BOXES[cell.id] || { h: 20 };
          const saved = (state.customBoxSizes && state.customBoxSizes[cell.id]) || {};
          const cur = saved.h || boxDef.h;
          setCellCustomBoxSize(cell, undefined, Math.max(15, cur - 5));
        }
      });
    }

    const btnBoxHInc = document.getElementById('btnBoxHeightInc');
    if (btnBoxHInc) {
      btnBoxHInc.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const boxDef = DIRECTIVE_FIELD_BOXES[cell.id] || { h: 20 };
          const saved = (state.customBoxSizes && state.customBoxSizes[cell.id]) || {};
          const cur = saved.h || boxDef.h;
          setCellCustomBoxSize(cell, undefined, Math.min(300, cur + 5));
        }
      });
    }

    const cellBoxHInput = document.getElementById('cellBoxHeightInput');
    if (cellBoxHInput) {
      const handleHChange = () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const val = parseFloat(cellBoxHInput.value);
          if (!isNaN(val) && val >= 15 && val <= 300) {
            setCellCustomBoxSize(cell, undefined, val);
          }
        }
      };
      cellBoxHInput.addEventListener('input', handleHChange);
      cellBoxHInput.addEventListener('change', handleHChange);
    }

    // Done editing button
    const btnDone = document.getElementById('btnEditorDone');
    if (btnDone) {
      btnDone.addEventListener('click', () => {
        closeDirectiveDirectEditor(true);
        showToast('Directive edits committed.');
      });
    }

    const btnCellReset = document.getElementById('btnCellFontReset');
    if (btnCellReset) {
      btnCellReset.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          cell.removeAttribute('data-custom-size');
          cell.style.removeProperty('font-size');
          const defaultSizes = {
            docFieldJoNumber: 28,
            docFieldDueDate: 14,
            docFieldOrderDate: 14,
            docFieldReleasingDate: 14,
            docFieldClientName: 22,
            docFieldProjectName: 12,
            docFieldInCharge: 15,
            docFieldDrawnBy: 15,
            docFieldAddress: 12,
            docFieldContactPerson: 13,
            docFieldContactNumber: 13,
            docFieldInstallers: 14,
            docFieldDuration: 14
          };
          if (window.SVGElement && cell instanceof SVGElement && cell.id && defaultSizes[cell.id]) {
            cell.setAttribute('font-size', defaultSizes[cell.id]);
          }
          if (state.customCellFonts && cell.id) {
            delete state.customCellFonts[cell.id];
          }
          if (state.customBoxSizes && cell.id) {
            delete state.customBoxSizes[cell.id];
          }
          saveStateToStorage();

          setFieldMultilineText(cell, getFieldRawText(cell));
          syncToolbarBoxInputs(cell);

          if (activeDirectEditor && activeDirectEditor.__targetCell === cell) {
            openDirectiveDirectEditor(cell);
          }
          showToast(`Reset font and box size for ${getCellFriendlyName(cell)} to default.`);
        }
      });
    }

    // Cell selection, direct editing & hotkey listeners on the directive CAD table
    const gridTable = document.getElementById('directiveGridTable');
    if (gridTable) {
      gridTable.addEventListener('click', (e) => {
        // If clicking inside active editor, allow typing/editing without closing
        if (activeDirectEditor && (e.target === activeDirectEditor || activeDirectEditor.contains(e.target))) {
          return;
        }

        // Check for releasing mode checkbox clicks
        const checkGrp = e.target.closest('.deh-check-grp');
        if (checkGrp) {
          const m = checkGrp.getAttribute('data-mode');
          if (m) {
            setMode(m);
            return;
          }
        }

        // Check for Indoor / Outdoor toggle
        const indoorTarget = e.target.closest('#lblIndoor, #bgIndoor');
        const outdoorTarget = e.target.closest('#lblOutdoor, #bgOutdoor');
        if (indoorTarget || outdoorTarget) {
          const curState = state.directiveLocation || {
            indoor: document.getElementById('bgIndoor')?.getAttribute('fill') === '#E10600',
            outdoor: document.getElementById('bgOutdoor')?.getAttribute('fill') === '#E10600'
          };
          if (indoorTarget) {
            const nextIndoor = !curState.indoor;
            setDirectiveLocation(nextIndoor, curState.outdoor);
            showToast(`Directive Location: ${nextIndoor ? 'INDOOR' : 'None'}${curState.outdoor ? ' & OUTDOOR' : ''}`);
          } else {
            const nextOutdoor = !curState.outdoor;
            setDirectiveLocation(curState.indoor, nextOutdoor);
            showToast(`Directive Location: ${curState.indoor ? 'INDOOR & ' : ''}${nextOutdoor ? 'OUTDOOR' : 'None'}`);
          }
          return;
        }

        // Handle clicks on address gray pill or due date black box directly
        if (e.target.id === 'bgFieldAddress' || e.target.closest('#bgFieldAddress')) {
          const elAddr = document.getElementById('docFieldAddress');
          if (elAddr) { selectDirectiveCell(elAddr, true); return; }
        }
        if (e.target.id === 'bgFieldDueDate' || e.target.closest('#bgFieldDueDate')) {
          const elDue = document.getElementById('docFieldDueDate');
          if (elDue) { selectDirectiveCell(elDue, true); return; }
        }

        // Direct editing target (if clicking directly on text or tspan)
        const targetCell = e.target.closest('td') || e.target.closest('text.interactive-field') || e.target.closest('.bebas-field');
        if (targetCell) {
          selectDirectiveCell(targetCell, true);
          return;
        }

        // Coordinate-based cell selection: click anywhere in the cell box!
        const svg = document.getElementById('directiveExactSvg');
        if (svg) {
          const svgRect = svg.getBoundingClientRect();
          if (svgRect.width > 0 && svgRect.height > 0) {
            const scaleX = 904 / svgRect.width;
            const scaleY = 96 / svgRect.height;
            const svgX = (e.clientX - svgRect.left) * scaleX;
            const svgY = (e.clientY - svgRect.top) * scaleY;

            // Indoor / Outdoor header (row 1 of column 3, y <= 18)
            if (svgX >= 340 && svgX <= 564 && svgY <= 18) {
              const isIndoorClick = svgX <= 452;
              const curState = state.directiveLocation || {
                indoor: document.getElementById('bgIndoor')?.getAttribute('fill') === '#E10600',
                outdoor: document.getElementById('bgOutdoor')?.getAttribute('fill') === '#E10600'
              };
              if (isIndoorClick) {
                const nextIndoor = !curState.indoor;
                setDirectiveLocation(nextIndoor, curState.outdoor);
                showToast(`Directive Location: ${nextIndoor ? 'INDOOR' : 'None'}${curState.outdoor ? ' & OUTDOOR' : ''}`);
              } else {
                const nextOutdoor = !curState.outdoor;
                setDirectiveLocation(curState.indoor, nextOutdoor);
                showToast(`Directive Location: ${curState.indoor ? 'INDOOR & ' : ''}${nextOutdoor ? 'OUTDOOR' : 'None'}`);
              }
              return;
            }

            // Releasing mode checkboxes (row 3 of column 3)
            if (svgX >= 340 && svgX <= 564 && svgY > 73) {
              if (svgX < 420) setMode('Install');
              else if (svgX < 490) setMode('Deliver');
              else setMode('Pickup');
              return;
            }

            const fieldId = getFieldIdAtSvgCoords(svgX, svgY);
            if (fieldId) {
              const el = document.getElementById(fieldId);
              if (el) {
                selectDirectiveCell(el, true);
                return;
              }
            }
          }
        }
      });

      gridTable.addEventListener('focusin', (e) => {
        const targetCell = e.target.closest('td') || e.target.closest('text.interactive-field') || e.target.closest('.bebas-field');
        if (targetCell) {
          selectDirectiveCell(targetCell, false);
        }
      });

      // Hotkeys: Ctrl+[ decreases active cell font, Ctrl+] increases active cell font
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '[' || e.key === ']')) {
          const targetCell = getActiveOrTargetCell();
          if (targetCell) {
            e.preventDefault();
            selectDirectiveCell(targetCell, false);
            const current = getCellCurrentFontSize(targetCell);
            const step = e.key === '[' ? -1 : 1;
            const next = Math.max(6, Math.min(72, Math.round(current + step)));
            setCellCustomFontSize(targetCell, next);
            showToast(`${getCellFriendlyName(targetCell)} font: ${next}px`);
          }
        }
      });

      // Close editor when clicking outside
      document.addEventListener('mousedown', (e) => {
        if (activeDirectEditor) {
          if (e.target === activeDirectEditor || activeDirectEditor.contains(e.target)) return;
          if (e.target.closest && (e.target.closest('.doc-font-controls') || e.target.closest('.interactive-field') || e.target.closest('.bebas-field') || e.target.closest('#directiveGridTable'))) return;
          closeDirectiveDirectEditor(true);
        }
      });

      // Re-position editor on window resize
      window.addEventListener('resize', () => {
        if (activeDirectEditor && activeDirectEditor.__targetCell) {
          const target = activeDirectEditor.__targetCell;
          openDirectiveDirectEditor(target);
        }
      });

      // Live auto-fit when typing in contenteditable table cells
      gridTable.addEventListener('input', (e) => {
        const targetCell = e.target.closest('td');
        if (targetCell) autoFitCellText(targetCell);
      });
    }

    const subtabs = document.querySelectorAll('.directive-toolbar .tab-btn');
    subtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        subtabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-subtab');
        document.querySelectorAll('.directive-subtab-content').forEach(c => {
          c.style.display = 'none';
          c.classList.remove('active');
        });

        const activeContent = document.getElementById(target);
        if (activeContent) {
          activeContent.style.display = target === 'tab-template-editor' ? 'flex' : 'block';
          activeContent.classList.add('active');
          if (target === 'tab-template-editor') {
            initTemplateEditorCanvas();
          }
        }
      });
    });
  }

  // DIRECTIVE REAL-TIME ZOOM ENGINE & CONTROLS
  const DIRECTIVE_ZOOM_LEVELS = [50, 65, 75, 85, 100, 115, 125, 150, 175, 200, 250, 300];

  function setDirectiveZoom(zoom) {
    const clamped = Math.max(40, Math.min(350, Math.round(zoom)));
    state.directiveZoom = clamped;
    saveStateToStorage();

    const wrap = document.getElementById('directiveGridTable');
    const label = document.getElementById('directiveZoomLevelText');
    const baseW = 904;
    const baseH = 96;
    const newW = Math.round((baseW * clamped) / 100);
    const newH = Math.round((baseH * clamped) / 100);

    if (wrap) {
      wrap.style.setProperty('--directive-zoom-width', newW + 'px');
      wrap.style.setProperty('--directive-zoom-height', newH + 'px');
      wrap.style.width = newW + 'px';
      wrap.style.height = newH + 'px';
      wrap.style.minWidth = newW + 'px';
      wrap.style.minHeight = newH + 'px';
    }

    if (label) {
      label.textContent = clamped + '%';
    }

    if (activeDirectEditor && activeDirectEditor.__targetCell) {
      openDirectiveDirectEditor(activeDirectEditor.__targetCell);
    }
  }

  function setupDirectiveZoomControls() {
    const btnZoomOut = document.getElementById('btnDirectiveZoomOut');
    const btnZoomIn = document.getElementById('btnDirectiveZoomIn');
    const btnZoomReset = document.getElementById('btnDirectiveZoomReset');
    const btnZoomFit = document.getElementById('btnDirectiveZoomFit');
    const zoomLabel = document.getElementById('directiveZoomLevelText');
    const container = document.getElementById('directiveZoomContainer');

    const getCurrentZoom = () => state.directiveZoom || 100;

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        const cur = getCurrentZoom();
        const smaller = DIRECTIVE_ZOOM_LEVELS.filter(z => z < cur);
        const next = smaller.length > 0 ? smaller[smaller.length - 1] : Math.max(40, cur - 15);
        setDirectiveZoom(next);
      });
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        const cur = getCurrentZoom();
        const larger = DIRECTIVE_ZOOM_LEVELS.filter(z => z > cur);
        const next = larger.length > 0 ? larger[0] : Math.min(350, cur + 15);
        setDirectiveZoom(next);
      });
    }

    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => {
        setDirectiveZoom(100);
        showToast('Zoom reset to 100%');
      });
    }

    if (zoomLabel) {
      zoomLabel.addEventListener('click', () => {
        const cur = getCurrentZoom();
        setDirectiveZoom(cur === 100 ? 150 : 100);
      });
    }

    if (btnZoomFit) {
      btnZoomFit.addEventListener('click', () => {
        if (!container) return;
        const availW = container.clientWidth - 28;
        if (availW > 100) {
          const fitZoom = Math.round((availW / 904) * 100);
          setDirectiveZoom(fitZoom);
          showToast('Zoom fitted to container: ' + fitZoom + '%');
        }
      });
    }

    if (container) {
      container.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const cur = getCurrentZoom();
          const delta = e.deltaY < 0 ? 10 : -10;
          setDirectiveZoom(cur + delta);
        }
      }, { passive: false });
    }

    if (state.directiveZoom && state.directiveZoom !== 100) {
      setDirectiveZoom(state.directiveZoom);
    }
  }

  const DIRECTIVE_WALL_SVGS = {
    "concrete-wall": "<g> <polygon fill=\"#FFFFFF\" points=\"-0,3022.83 10572.6,3022.83 10572.6,0 -0,0 \"\/> <g> <g> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3671.45 1413.43c-38.1,0 -70.4,-13.31 -97.02,-40.03 -26.72,-26.61 -40.03,-58.92 -40.03,-96.69l0 -312.73c0,-38.1 13.42,-70.51 40.25,-97.12 26.72,-26.72 59.02,-40.03 96.8,-40.03 38.1,0 70.4,13.42 96.91,40.24 26.51,26.83 39.71,59.13 39.71,97.02l0 65.47 -89.5 0 0 -67.29c0,-13.63 -4.83,-25.43 -14.59,-35.2 -9.77,-9.77 -21.46,-14.6 -35.2,-14.6 -13.74,0 -25.33,4.83 -34.99,14.6 -9.55,9.77 -14.38,21.46 -14.38,35.2l0 313.59c0,13.74 4.83,25.33 14.38,34.99 9.66,9.55 21.25,14.38 34.99,14.38 13.74,0 25.43,-4.83 35.2,-14.38 9.77,-9.55 14.59,-21.25 14.59,-34.99l0 -78.99 89.5 0 0 79.95c0,38.1 -13.42,70.4 -40.25,96.91 -26.72,26.51 -58.92,39.71 -96.37,39.71zm343.1 -587.25c38.1,0 70.4,13.41 97.02,40.24 26.72,26.83 40.03,59.13 40.03,96.91l0 312.94c0,38.1 -13.42,70.51 -40.24,97.12 -26.72,26.72 -59.03,40.03 -96.8,40.03 -38.1,0 -70.4,-13.42 -96.91,-40.24 -26.51,-26.83 -39.71,-59.13 -39.71,-96.91l0 -312.94c0,-38.1 13.42,-70.51 40.25,-97.12 26.72,-26.72 58.92,-40.03 96.37,-40.03zm46.9 135.65c0,-13.74 -4.83,-25.33 -14.38,-34.99 -9.66,-9.55 -21.25,-14.38 -34.99,-14.38 -13.74,0 -25.43,4.83 -35.2,14.38 -9.77,9.66 -14.6,21.25 -14.6,34.99l0 313.37c0,13.74 4.83,25.33 14.6,34.99 9.77,9.55 21.46,14.38 35.2,14.38 13.74,0 25.33,-4.83 34.99,-14.38 9.55,-9.66 14.38,-21.25 14.38,-34.99l0 -313.37zm263.47 -129.21l114.72 385.06 0 -385.06 86.28 0 0 573.73 -92.83 0 -119.02 -367.25 0 367.25 -86.28 0 0 -573.73 97.12 0zm413.93 580.81c-38.1,0 -70.4,-13.31 -97.02,-40.03 -26.72,-26.61 -40.03,-58.92 -40.03,-96.69l0 -312.73c0,-38.1 13.42,-70.51 40.24,-97.12 26.72,-26.72 59.03,-40.03 96.8,-40.03 38.1,0 70.4,13.42 96.91,40.24 26.51,26.83 39.71,59.13 39.71,97.02l0 65.47 -89.5 0 0 -67.29c0,-13.63 -4.83,-25.43 -14.59,-35.2 -9.77,-9.77 -21.46,-14.6 -35.2,-14.6 -13.74,0 -25.33,4.83 -34.99,14.6 -9.55,9.77 -14.38,21.46 -14.38,35.2l0 313.59c0,13.74 4.83,25.33 14.38,34.99 9.66,9.55 21.25,14.38 34.99,14.38 13.74,0 25.43,-4.83 35.2,-14.38 9.77,-9.55 14.59,-21.25 14.59,-34.99l0 -78.99 89.5 0 0 79.95c0,38.1 -13.42,70.4 -40.25,96.91 -26.72,26.51 -58.92,39.71 -96.37,39.71zm344.28 -580.17c48.19,0 83.6,13.31 106.25,39.82 19.85,23.18 29.73,55.48 29.73,96.91l0 83.28c0,40.57 -15.45,74.8 -46.47,102.92l64.07 250.16 -93.04 0 -52.59 -215.82c-2.47,0.11 -5.04,0.11 -7.83,0.11l-50.23 0 0 215.71 -86.28 0 0 -573.08 136.4 0zm51.62 138.12c0,-33.27 -16.53,-49.9 -49.47,-49.9l-52.26 0 0 183.52 52.26 0c13.74,0 25.44,-4.83 34.99,-14.6 9.66,-9.77 14.49,-21.57 14.49,-35.31l0 -83.71zm176 434.96l0 -573.73 246.08 0 0 86.93 -159.8 0 0 156.47 116.55 0 0 86.93 -116.55 0 0 156.47 159.8 0 0 86.93 -246.08 0zm397.62 -486.15l-92.08 0 0 -86.93 269.8 0 0 86.93 -91.44 0 0 486.15 -86.28 0 0 -486.15zm247.26 486.15l0 -573.73 246.08 0 0 86.93 -159.8 0 0 156.47 116.55 0 0 86.93 -116.55 0 0 156.47 159.8 0 0 86.93 -246.08 0zm720.32 -573.08l90.58 0 -89.61 573.08 -82.53 0 -48.94 -314.12 -45.82 314.12 -82.85 0 -96.16 -573.08 90.58 0 45.29 306.93 41.53 -306.93 90.58 0 45.29 306.61 42.07 -306.61zm190.92 441.08l-21.14 132 -90.15 0 97.45 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm464.26 441.72l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm295.02 0l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28z\"\/> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3790.93 1634.22l62.39 26.43 -23.97 19.26c-1.64,36.88 1.54,68.13 9.53,93.74 8.09,25.61 20.9,56.86 38.42,93.74 62.49,-51.33 104.9,-95.38 127.34,-132.26l40.77 43.33c-15.98,1.54 -36.06,11.17 -60.03,28.79 -25.61,17.62 -60.03,41.7 -103.26,72.12 62.49,120.17 132.87,193.11 211.34,218.72l0 9.63c-30.43,1.64 -48.87,11.17 -55.22,28.89 -97.63,-72.12 -167.29,-189.11 -208.88,-350.98l0 336.53c1.54,40.06 -17.62,64.85 -57.68,74.48 1.64,-22.44 -23.15,-40.06 -74.38,-52.86l0 -9.63c36.78,3.17 61.98,4.81 75.6,4.81 13.63,0 20.39,-9.63 20.39,-28.89l0 -386.93c0,-30.43 -0.82,-60.03 -2.36,-88.92zm-247.3 514.27l-4.81 -7.17c80.01,-80.01 135.23,-182.45 165.65,-307.33l-74.48 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 151.21 0 21.62 -28.79 43.23 38.42 -23.97 11.99c-40.06,142.5 -106.44,244.94 -199.25,307.33zm1104.45 -437.03c0,55.94 0.82,95.89 2.36,119.86l-35.96 14.44 0 -21.62 -208.88 0c1.54,97.63 -7.68,173.34 -27.66,227.02 -19.98,53.58 -57.98,99.68 -114.02,138.1l-4.82 -7.17c38.42,-36.88 66.38,-76.83 84.01,-120.07 17.62,-43.23 27.25,-102.44 28.89,-177.64l0 -156.13c0,-23.97 -0.82,-44.77 -2.46,-62.39l36.06 23.97 204.07 0 19.16 -23.97 38.42 31.25 -19.16 14.34zm-189.73 410.7l0 -165.86c0,-43.23 -0.82,-75.3 -2.36,-96.09l57.57 23.97 -21.62 19.26 0 120.17c54.5,-36.88 96.09,-76.12 124.88,-117.81l38.42 43.33c-14.34,1.54 -33.6,10.35 -57.57,26.43 -25.61,15.98 -60.85,36.88 -105.72,62.49l0 72.12c0,22.44 8.09,32.78 24.07,31.25l117.61 0c12.81,-4.82 20.08,-18.44 21.62,-40.88 1.64,-22.33 2.46,-48.76 2.46,-79.19l11.99 0c0,30.43 1.54,55.22 4.82,74.37 3.18,19.26 12.81,32.07 28.79,38.42 -12.81,24.07 -33.6,36.06 -62.39,36.06l-132.15 0c-35.14,1.64 -51.94,-14.44 -50.4,-48.05zm-52.76 -417.87l0 105.42 208.88 0 0 -105.42 -208.88 0zm-57.68 31.25c-54.4,169.65 -83.59,264.51 -87.59,284.59 -4,19.98 -6.86,44.36 -8.4,73.25 -1.64,28.79 -2.46,49.58 -2.46,62.39 0,6.45 -3.18,9.63 -9.63,9.63 -3.18,0 -9.94,-2.36 -20.39,-7.17 -10.35,-4.81 -15.57,-13.63 -15.57,-26.43 0,-11.17 1.64,-22.44 4.81,-33.6 4.81,-16.08 7.17,-28.89 7.17,-38.42 0,-9.63 -3.59,-17.62 -10.76,-24.07 -7.27,-6.35 -22.85,-12.81 -46.82,-19.16l0 -9.63c27.15,3.18 44.36,4.41 51.53,3.59 7.27,-0.82 15.67,-7.99 25.3,-21.62 9.53,-13.63 43.95,-98.86 103.16,-255.8l9.63 2.46zm-192.08 47.94c54.4,27.25 82.06,48.56 82.88,63.72 0.82,15.26 -2.05,26.43 -8.4,33.7 -6.45,7.17 -11.27,10.76 -14.44,10.76 -4.81,0 -9.63,-7.17 -14.44,-21.62 -6.35,-20.8 -23.15,-47.23 -50.4,-79.29l4.81 -7.27zm55.22 -139.43c44.87,22.44 69.25,38.11 73.25,46.92 4,8.81 6.04,14.85 6.04,18.03 0,7.99 -3.28,16.8 -9.63,26.43 -6.45,9.63 -10.45,14.44 -11.99,14.44 -4.81,0 -9.63,-7.17 -14.44,-21.62 -7.99,-22.44 -23.97,-48.15 -48.05,-77.04l4.82 -7.17zm883.58 360.2l0 59.93 72.02 0 0 -59.93 -72.02 0zm9.63 -290.43c0,-33.5 -0.82,-61.57 -2.36,-83.9l57.57 26.43 -21.62 16.7 0 40.77 88.82 0 28.89 -28.79 43.13 43.23 -160.84 0 0 131.85 36.06 0c27.15,-51.22 43.23,-91.18 47.94,-120.07l45.69 31.25c-17.62,7.99 -44.05,37.6 -79.29,88.82l60.03 0 31.25 -31.14 45.59 45.59 -316.96 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 175.28 0 0 -131.85 -67.2 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 146.49 0zm-115.25 36.06l7.17 -4.81c36.88,25.61 57.68,45.18 62.49,58.7 4.82,13.63 3.18,24.79 -4.81,33.6 -7.99,8.81 -13.63,13.22 -16.8,13.22 -6.45,0 -11.27,-7.99 -14.44,-23.97 -4.82,-23.97 -15.98,-49.58 -33.6,-76.73zm288.07 335.92c0,12.81 0.82,39.95 2.46,81.65l-36.06 11.99 0 -36.27 -225.69 0 0 24.18 -35.96 12.09c1.54,-46.41 2.36,-92.1 2.36,-136.87 0,-44.87 -0.82,-88.1 -2.36,-129.69l35.96 19.16 220.87 0 19.26 -23.97 36.06 31.25 -16.9 14.34 0 132.15zm-259.29 -139.32l0 182.25 225.69 0 0 -182.25 -225.69 0zm76.83 43.33l69.66 0 14.44 -19.16 33.6 26.43 -16.8 11.99c0,31.96 0.72,59.11 2.36,81.55l-31.25 14.44 0 -26.43 -72.02 0 0 16.8 -31.14 11.99c1.54,-25.61 2.36,-47.94 2.36,-67.2 0,-19.16 -0.82,-41.59 -2.36,-67.2l31.14 16.8zm-247.3 -165.35l0 -103.26c0,-25.61 -0.82,-52.86 -2.36,-81.65l57.57 31.25 -21.62 16.8 0 136.87 28.89 0 26.33 -26.33 40.88 40.77 -96.09 0 0 187.27 86.46 -21.62 2.36 9.63c-110.44,40.06 -171.19,69.66 -182.45,88.82l-26.43 -48.05c20.9,-3.18 49.69,-9.53 86.46,-19.16l0 -196.9 -7.17 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 86.46 0z\"\/> <\/g> <polygon fill=\"#ED3237\" points=\"2901.38,2406.67 2901.38,616.16 3306.54,616.16 3306.54,2406.67 \"\/> <\/g> <\/g>",
    "glass-wall": "<g> <polygon fill=\"#FFFFFF\" points=\"-0,3022.83 10572.6,3022.83 10572.6,0 -0,0 \"\/> <g> <g> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M4188.08 1413.56c-38.1,0 -70.4,-13.42 -97.02,-40.25 -26.72,-26.83 -40.03,-59.03 -40.03,-96.48l0 -312.73c0,-38.1 13.42,-70.51 40.25,-97.12 26.72,-26.72 59.03,-40.03 96.8,-40.03 38.1,0 70.4,13.42 96.91,40.25 26.51,26.83 39.71,59.13 39.71,97.02l0 65.46 -89.5 0 0 -67.29c0,-13.63 -4.83,-25.43 -14.59,-35.2 -9.77,-9.77 -21.46,-14.6 -35.2,-14.6 -13.74,0 -25.33,4.83 -34.99,14.6 -9.55,9.77 -14.38,21.46 -14.38,35.2l0 313.59c0,13.74 4.83,25.33 14.38,34.99 9.66,9.55 21.25,14.38 34.99,14.38 13.74,0 25.43,-4.83 35.2,-14.38 9.77,-9.55 14.59,-21.14 14.59,-34.77l0 -112.47 -48.29 0 0 -86.93 137.8 0 0 200.15c0,38.1 -13.42,70.4 -40.24,96.91 -26.72,26.51 -58.92,39.71 -96.37,39.71zm447.52 -7.08l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm170.74 -132l-21.14 132 -90.15 0 97.44 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm488.51 299.31c0.64,39.92 -9.77,74.05 -31.12,102.38 -14.06,19.21 -33.81,32.73 -59.46,40.67 -13.74,4.29 -29.73,6.44 -47.97,6.44 -33.91,0 -61.92,-8.37 -84.24,-25.22 -18.57,-13.74 -33.27,-32.41 -44.11,-56.02 -10.84,-23.72 -17.17,-50.76 -18.99,-81.35l82.21 -5.9c3.76,33.38 12.56,57.52 26.51,72.55 10.41,11.37 22.32,16.74 35.74,16.1 18.89,-0.64 33.91,-9.87 45.18,-27.9 5.79,-8.91 8.69,-21.46 8.69,-37.99 0,-23.83 -10.84,-47.43 -32.52,-70.94 -17.06,-16.1 -42.61,-40.35 -76.73,-72.76 -28.65,-27.69 -48.94,-52.59 -60.85,-74.59 -12.77,-24.68 -19.21,-51.51 -19.21,-80.49 0,-52.16 17.49,-91.65 52.59,-118.48 21.68,-16.2 48.51,-24.25 80.6,-24.25 30.8,0 57.2,6.87 79.09,20.6 17.06,10.63 30.91,25.54 41.43,44.75 10.52,19.1 16.85,41.21 18.99,66.22l-82.96 15.02c-2.47,-23.29 -9.23,-41.53 -20.18,-54.63 -7.94,-9.34 -19.42,-14.06 -34.45,-14.06 -15.88,0 -27.9,6.98 -36.17,21.03 -6.76,11.27 -10.09,25.33 -10.09,42.07 0,26.19 11.27,52.91 33.91,79.95 8.59,10.41 21.46,22.64 38.53,36.6 20.18,16.85 33.48,28.55 39.92,35.2 21.36,21.36 37.88,42.39 49.47,63.1 5.58,9.77 9.98,18.78 13.31,27.04 8.26,20.39 12.56,38.64 12.88,54.84zm345.24 0c0.64,39.92 -9.77,74.05 -31.12,102.38 -14.06,19.21 -33.81,32.73 -59.46,40.67 -13.74,4.29 -29.73,6.44 -47.97,6.44 -33.91,0 -61.92,-8.37 -84.25,-25.22 -18.57,-13.74 -33.27,-32.41 -44.11,-56.02 -10.84,-23.72 -17.17,-50.76 -18.99,-81.35l82.21 -5.9c3.76,33.38 12.56,57.52 26.51,72.55 10.41,11.37 22.32,16.74 35.74,16.1 18.89,-0.64 33.91,-9.87 45.18,-27.9 5.8,-8.91 8.69,-21.46 8.69,-37.99 0,-23.83 -10.84,-47.43 -32.52,-70.94 -17.06,-16.1 -42.61,-40.35 -76.73,-72.76 -28.65,-27.69 -48.94,-52.59 -60.85,-74.59 -12.77,-24.68 -19.21,-51.51 -19.21,-80.49 0,-52.16 17.49,-91.65 52.59,-118.48 21.68,-16.2 48.51,-24.25 80.6,-24.25 30.8,0 57.2,6.87 79.09,20.6 17.06,10.63 30.91,25.54 41.43,44.75 10.52,19.1 16.85,41.21 18.99,66.22l-82.96 15.02c-2.47,-23.29 -9.23,-41.53 -20.18,-54.63 -7.94,-9.34 -19.42,-14.06 -34.45,-14.06 -15.88,0 -27.9,6.98 -36.17,21.03 -6.76,11.27 -10.09,25.33 -10.09,42.07 0,26.19 11.27,52.91 33.91,79.95 8.59,10.41 21.46,22.64 38.53,36.6 20.18,16.85 33.48,28.55 39.92,35.2 21.36,21.36 37.88,42.39 49.47,63.1 5.58,9.77 9.98,18.78 13.31,27.04 8.26,20.39 12.56,38.64 12.88,54.84zm474.13 -430.67l90.58 0 -89.61 573.08 -82.53 0 -48.94 -314.12 -45.82 314.12 -82.85 0 -96.16 -573.08 90.58 0 45.29 306.93 41.53 -306.93 90.58 0 45.29 306.61 42.07 -306.61zm190.92 441.08l-21.14 132 -90.15 0 97.45 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm464.26 441.72l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm295.02 0l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28z\"\/> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M4151.43 2189.35c46.41,-33.7 79.7,-72.12 99.68,-115.35 19.98,-43.23 31.25,-99.68 33.6,-169.34 2.36,-69.66 2.77,-131.74 1.23,-186.14l33.6 19.16 91.18 0c0,-52.76 -0.72,-88.72 -2.36,-107.87l50.4 21.62 -16.8 16.8 0 69.46 98.45 0 26.43 -23.97 43.23 45.59c-14.44,3.28 -28.07,7.68 -40.88,13.21 -12.81,5.63 -29.61,20.39 -50.4,44.46l-7.17 -4.81 35.96 -60.03 -105.62 0 0 130 74.48 0 21.62 -21.62 38.42 38.42 -21.62 9.63c-36.88,72.02 -68.02,123.14 -93.64,153.56 47.94,46.41 98.45,76.01 151.21,88.82l0 7.17c-20.8,1.64 -35.96,11.17 -45.59,28.79 -49.58,-30.43 -91.28,-64.85 -124.88,-103.26 -60.85,56.04 -132.87,93.63 -216.05,112.89l-2.46 -7.17c84.82,-35.24 152.13,-78.37 201.71,-129.59 -27.25,-36.78 -49.58,-91.18 -67.2,-163.19l-9.63 0 -16.8 7.17 -14.44 -14.34c-1.54,75.19 -13.93,136.76 -37.19,184.71 -23.15,48.05 -64.44,88.82 -123.65,122.42l-4.81 -7.17zm165.65 -437.23l0 130 93.63 0 0 -130 -93.63 0zm124.88 286.13c25.61,-33.6 51.22,-80.83 76.83,-141.68l-146.5 0c20.9,64.03 44.05,111.26 69.66,141.68zm-384.17 40.77c22.44,-4.82 52.86,-11.99 91.28,-21.62l0 -160.84 -2.46 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 81.65 0 0 -141.68 -9.63 0c-20.8,0 -40.06,2.36 -57.57,7.17l-21.62 -21.62 141.58 0 28.89 -28.79 40.77 43.23 -91.28 0 0 141.68 19.26 0 26.43 -26.33 38.42 40.77 -84.11 0 0 153.67 79.29 -21.62 2.36 9.63c-103.98,38.42 -163.19,65.56 -177.64,81.65l-26.43 -40.88zm729.92 -19.46l84.01 -21.62 2.46 9.53c-56.04,20.8 -112.89,44.05 -170.47,69.66l-14.44 14.44 -26.43 -45.69c38.42,-6.35 69.66,-12.81 93.64,-19.16l0 -158.48 -2.36 0c-20.8,0 -40.06,2.36 -57.57,7.17l-21.62 -21.62 81.55 0 0 -144.14 -11.99 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 136.87 0 26.43 -26.33 38.42 40.77 -79.29 0 0 144.14 21.62 0 23.97 -23.97 36.06 38.42 -81.65 0 0 151.31zm72.02 -345.85l170.47 0c-4.81,-23.87 -18.34,-48.66 -40.77,-74.17l4.81 -4.81c30.43,12.81 49.17,23.15 56.45,31.14 7.17,7.99 10.76,14.34 10.76,19.16 0,9.53 -5.63,19.16 -16.8,28.68l108.08 0 31.14 -28.79 38.42 43.23 -283.26 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62zm110.43 343.8l124.88 -11.99c-7.99,-12.81 -19.16,-27.97 -33.6,-45.59l7.17 -4.81c35.24,22.44 56.04,38.42 62.49,48.05 6.35,9.63 9.53,17.62 9.53,23.97 0,7.99 -2.36,15.67 -7.17,22.85 -4.81,7.17 -7.99,10.76 -9.63,10.76 -3.18,0 -5.53,-3.18 -7.17,-9.53 -4.82,-12.81 -10.35,-24.89 -16.8,-36.06 -81.65,15.98 -130.41,31.25 -146.5,45.59l-21.62 -43.23c8.09,-4.71 16.08,-10.76 24.07,-17.93 7.99,-7.27 19.98,-27.66 35.96,-61.26l-84.01 0 0 201.41 -31.25 14.44c1.64,-49.58 2.46,-96.81 2.46,-141.58 0,-44.67 -0.82,-80.73 -2.46,-107.87l31.25 19.16 88.82 0c11.27,-23.97 18.44,-44.77 21.62,-62.39l-88.82 0 -16.8 19.16 -28.79 -23.97 14.34 -11.99c0,-64.03 -0.82,-106.44 -2.36,-127.24l50.4 19.16 -19.16 16.8 0 93.63 218.41 0c0,-62.39 -0.72,-104.8 -2.36,-127.24l50.4 21.62 -19.16 16.8c0,56.04 0.72,95.27 2.36,117.71l-31.25 14.34 0 -28.79 -127.24 0 45.59 23.97 -19.16 9.63 -16.8 28.79 134.41 0 16.8 -21.62 33.7 28.89 -16.8 14.34 0 148.65c0,28.79 -16.9,49.58 -50.51,62.39 -4.81,-23.97 -29.61,-40.77 -74.37,-50.4l0 -9.53c44.77,3.18 71.61,4.81 80.42,4.81 8.81,0 13.22,-6.45 13.22,-19.26l0 -143.83 -144.04 0c-16.08,31.96 -32.88,58.39 -50.51,79.19zm136.87 -286.02c-11.17,6.45 -25.61,16.08 -43.23,28.89 19.26,8.09 32.88,15.67 40.88,22.95 7.99,7.17 11.99,15.57 11.99,25.3 0,6.35 -0.82,12.4 -2.36,18.03 -1.64,5.63 -3.28,8.4 -4.81,8.4 -4.81,0 -10.45,-4.81 -16.8,-14.44 -12.81,-16.08 -28.07,-30.53 -45.69,-43.33 -38.42,24.07 -72.02,41.7 -100.81,52.96l-4.81 -7.17c33.6,-19.36 61.67,-38.62 84,-57.88 -20.8,-14.44 -42.41,-28.07 -64.75,-40.98l4.81 -7.17c30.32,11.27 55.93,21.72 76.83,31.35 15.98,-12.91 31.96,-30.53 47.94,-53.07l36.06 36.16 -19.26 0zm504.23 235.11l0 59.93 72.02 0 0 -59.93 -72.02 0zm9.63 -290.43c0,-33.5 -0.82,-61.57 -2.36,-83.9l57.57 26.43 -21.62 16.7 0 40.77 88.82 0 28.89 -28.79 43.13 43.23 -160.84 0 0 131.85 36.06 0c27.15,-51.22 43.23,-91.18 47.94,-120.07l45.69 31.25c-17.62,7.99 -44.05,37.6 -79.29,88.82l60.03 0 31.25 -31.14 45.59 45.59 -316.96 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 175.28 0 0 -131.85 -67.2 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 146.5 0zm-115.25 36.06l7.17 -4.81c36.88,25.61 57.68,45.18 62.49,58.7 4.82,13.63 3.18,24.79 -4.81,33.6 -7.99,8.81 -13.63,13.22 -16.8,13.22 -6.45,0 -11.27,-7.99 -14.44,-23.97 -4.82,-23.97 -15.98,-49.58 -33.6,-76.73zm288.07 335.92c0,12.81 0.82,39.95 2.46,81.65l-36.06 11.99 0 -36.27 -225.69 0 0 24.18 -35.96 12.09c1.54,-46.41 2.36,-92.1 2.36,-136.87 0,-44.87 -0.82,-88.1 -2.36,-129.69l35.96 19.16 220.87 0 19.26 -23.97 36.06 31.25 -16.9 14.34 0 132.15zm-259.29 -139.32l0 182.25 225.69 0 0 -182.25 -225.69 0zm76.83 43.33l69.66 0 14.44 -19.16 33.6 26.43 -16.8 11.99c0,31.96 0.72,59.11 2.36,81.55l-31.25 14.44 0 -26.43 -72.02 0 0 16.8 -31.14 11.99c1.54,-25.61 2.36,-47.94 2.36,-67.2 0,-19.16 -0.82,-41.59 -2.36,-67.2l31.14 16.8zm-247.3 -165.35l0 -103.26c0,-25.61 -0.82,-52.86 -2.36,-81.65l57.57 31.25 -21.62 16.8 0 136.87 28.89 0 26.33 -26.33 40.88 40.77 -96.09 0 0 187.27 86.46 -21.62 2.36 9.63c-110.44,40.06 -171.19,69.66 -182.45,88.82l-26.43 -48.05c20.9,-3.18 49.69,-9.53 86.46,-19.16l0 -196.9 -7.17 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 86.46 0z\"\/> <\/g> <polygon fill=\"#ED3237\" points=\"3418.01,2406.67 3418.01,616.16 3823.17,616.16 3823.17,2406.67 \"\/> <\/g> <\/g>",
    "iron-plated": "<g> <polygon fill=\"#FFFFFF\" points=\"-0,3022.83 10572.6,3022.83 10572.6,0 -0,0 \"\/> <g> <g> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3527.77 1110.15l-72.66 0 0 -482.6 72.66 0 0 482.6zm180.03 -482.6c40.58,0 70.4,11.21 89.47,33.53 16.72,19.52 25.03,46.72 25.03,81.61l0 70.13c0,34.16 -13.01,62.99 -39.13,86.67l53.95 210.66 -78.35 0 -44.28 -181.74c-2.08,0.09 -4.25,0.09 -6.6,0.09l-42.3 0 0 181.65 -72.66 0 0 -482.6 114.87 0zm43.47 116.31c0,-28.02 -13.92,-42.02 -41.66,-42.02l-44.01 0 0 154.54 44.01 0c11.57,0 21.42,-4.07 29.46,-12.29 8.13,-8.22 12.2,-18.17 12.2,-29.73l0 -70.49zm250.97 -122.28c32.08,0 59.29,11.3 81.7,33.89 22.5,22.59 33.71,49.8 33.71,81.61l0 263.53c0,32.08 -11.3,59.38 -33.89,81.79 -22.5,22.5 -49.71,33.71 -81.52,33.71 -32.08,0 -59.29,-11.3 -81.61,-33.89 -22.32,-22.59 -33.44,-49.8 -33.44,-81.61l0 -263.53c0,-32.08 11.3,-59.38 33.89,-81.79 22.5,-22.5 49.62,-33.71 81.16,-33.71zm39.49 114.23c0,-11.57 -4.07,-21.33 -12.11,-29.46 -8.13,-8.04 -17.89,-12.11 -29.46,-12.11 -11.57,0 -21.42,4.07 -29.64,12.11 -8.22,8.13 -12.29,17.89 -12.29,29.46l0 263.89c0,11.57 4.07,21.33 12.29,29.46 8.22,8.04 18.07,12.11 29.64,12.11 11.57,0 21.33,-4.07 29.46,-12.11 8.04,-8.13 12.11,-17.89 12.11,-29.46l0 -263.89zm221.87 -108.81l96.61 324.26 0 -324.26 72.66 0 0 483.14 -78.17 0 -100.22 -309.26 0 309.26 -72.66 0 0 -483.14 81.79 0zm219.34 205.51l215.63 0 0 73.2 -215.63 0 0 -73.2zm380.48 -204.97c35.43,0 63.71,11.21 84.77,33.53 19.52,21.33 29.28,48.53 29.28,81.7l0 70.13c0,31.81 -11.12,59.1 -33.35,81.7 -22.23,22.59 -49.16,33.89 -80.79,33.89l-42.02 0 0 181.65 -72.66 0 0 -482.6 114.78 0zm43.56 116.31c0,-12.65 -3.8,-22.77 -11.39,-30.46 -7.59,-7.68 -17.71,-11.57 -30.28,-11.57l-44.01 0 0 154.54 44.01 0c11.57,0 21.42,-4.07 29.46,-12.29 8.13,-8.22 12.2,-18.17 12.2,-29.73l0 -70.49zm326.88 366.29l-198.37 0 0 -482.6 72.66 0 0 409.94 125.71 0 0 72.66zm143.79 -111.16l-17.8 111.16 -75.91 0 82.06 -482.6 100.14 0 80.88 482.6 -76.46 0 -16.99 -111.16 -75.91 0zm37.96 -260.82l-26.93 189.79 53.95 0 -27.02 -189.79zm201.9 -37.42l-77.54 0 0 -73.2 227.2 0 0 73.2 -77 0 0 409.4 -72.66 0 0 -409.4zm208.22 409.4l0 -483.14 207.23 0 0 73.2 -134.57 0 0 131.77 98.15 0 0 73.2 -98.15 0 0 131.77 134.57 0 0 73.2 -207.23 0zm486.12 -115.59c0,31.81 -11.21,59.11 -33.53,81.7 -22.32,22.59 -49.25,33.89 -80.88,33.89l-114.41 0 0 -483.14 114.41 0c31.81,0 58.83,11.3 81.07,33.89 22.23,22.59 33.35,49.71 33.35,81.34l0 252.32zm-156.17 43.47l43.92 0c11.57,0 21.33,-4.16 29.28,-12.56 7.95,-8.31 11.93,-18.16 11.93,-29.46l0 -252.69c0,-11.57 -4.07,-21.51 -12.11,-29.73 -8.13,-8.22 -17.8,-12.29 -29.1,-12.29l-43.92 0 0 336.73zm457.75 -441.39l59.2 0 -201.44 528.15 -59.2 0 201.44 -528.15zm231.99 513.51l-72.66 0 0 -482.6 72.66 0 0 482.6zm180.03 -482.6c40.58,0 70.4,11.21 89.47,33.53 16.72,19.52 25.03,46.72 25.03,81.61l0 70.13c0,34.16 -13.01,62.99 -39.13,86.67l53.95 210.66 -78.35 0 -44.28 -181.74c-2.08,0.09 -4.25,0.09 -6.6,0.09l-42.3 0 0 181.65 -72.66 0 0 -482.6 114.87 0zm43.47 116.31c0,-28.02 -13.92,-42.02 -41.66,-42.02l-44.01 0 0 154.54 44.01 0c11.57,0 21.42,-4.07 29.46,-12.29 8.13,-8.22 12.2,-18.17 12.2,-29.73l0 -70.49zm250.97 -122.28c32.08,0 59.29,11.3 81.7,33.89 22.5,22.59 33.71,49.8 33.71,81.61l0 263.53c0,32.08 -11.3,59.38 -33.89,81.79 -22.5,22.5 -49.71,33.71 -81.52,33.71 -32.08,0 -59.29,-11.3 -81.61,-33.89 -22.32,-22.59 -33.44,-49.8 -33.44,-81.61l0 -263.53c0,-32.08 11.3,-59.38 33.89,-81.79 22.5,-22.5 49.62,-33.71 81.16,-33.71zm39.49 114.23c0,-11.57 -4.07,-21.33 -12.11,-29.46 -8.13,-8.04 -17.89,-12.11 -29.46,-12.11 -11.57,0 -21.42,4.07 -29.64,12.11 -8.22,8.13 -12.29,17.89 -12.29,29.46l0 263.89c0,11.57 4.07,21.33 12.29,29.46 8.22,8.04 18.07,12.11 29.64,12.11 11.57,0 21.33,-4.07 29.46,-12.11 8.04,-8.13 12.11,-17.89 12.11,-29.46l0 -263.89zm221.87 -108.81l96.61 324.26 0 -324.26 72.66 0 0 483.14 -78.17 0 -100.22 -309.26 0 309.26 -72.66 0 0 -483.14 81.79 0zm-4053.47 1200.62l-72.66 0 0 -483.14 207.23 0 0 73.2 -134.57 0 0 131.77 98.15 0 0 73.2 -98.15 0 0 204.97zm299.5 -482.6c40.58,0 70.4,11.21 89.47,33.53 16.72,19.52 25.03,46.72 25.03,81.61l0 70.13c0,34.16 -13.01,62.99 -39.13,86.67l53.95 210.66 -78.35 0 -44.28 -181.74c-2.08,0.09 -4.25,0.09 -6.6,0.09l-42.3 0 0 181.65 -72.66 0 0 -482.6 114.87 0zm43.47 116.31c0,-28.02 -13.92,-42.02 -41.66,-42.02l-44.01 0 0 154.54 44.01 0c11.57,0 21.42,-4.07 29.46,-12.29 8.13,-8.22 12.2,-18.16 12.2,-29.73l0 -70.49zm238.14 255.13l-17.8 111.16 -75.91 0 82.06 -482.6 100.14 0 80.88 482.6 -76.46 0 -16.99 -111.16 -75.91 0zm37.96 -260.82l-26.93 189.79 53.95 0 -27.02 -189.79zm265.25 371.98l-72.66 0 0 -483.14 104.56 0 67.87 347.85 65.43 -347.85 99.95 0 0 483.14 -72.66 0 0 -303.48 -63.35 303.48 -58.56 0 -70.58 -302.66 0 302.66zm330.14 0l0 -483.14 207.23 0 0 73.2 -134.57 0 0 131.77 98.15 0 0 73.2 -98.15 0 0 131.77 134.57 0 0 73.2 -207.23 0zm556.52 -482.6l76.28 0 -75.46 482.6 -69.5 0 -41.21 -264.53 -38.59 264.53 -69.77 0 -80.98 -482.6 76.28 0 38.14 258.47 34.97 -258.47 76.28 0 38.14 258.2 35.43 -258.2zm241.39 -5.96c32.08,0 59.29,11.3 81.7,33.89 22.5,22.59 33.71,49.8 33.71,81.61l0 263.53c0,32.08 -11.3,59.38 -33.89,81.79 -22.5,22.5 -49.71,33.71 -81.52,33.71 -32.08,0 -59.29,-11.3 -81.61,-33.89 -22.32,-22.59 -33.44,-49.8 -33.44,-81.61l0 -263.53c0,-32.08 11.3,-59.38 33.89,-81.79 22.5,-22.5 49.62,-33.71 81.16,-33.71zm39.49 114.23c0,-11.57 -4.07,-21.33 -12.11,-29.46 -8.13,-8.04 -17.89,-12.11 -29.46,-12.11 -11.57,0 -21.42,4.07 -29.64,12.11 -8.22,8.13 -12.29,17.89 -12.29,29.46l0 263.89c0,11.57 4.07,21.33 12.29,29.46 8.22,8.04 18.07,12.11 29.64,12.11 11.57,0 21.33,-4.07 29.46,-12.11 8.04,-8.13 12.11,-17.89 12.11,-29.46l0 -263.89zm255.4 -108.27c40.58,0 70.4,11.21 89.47,33.53 16.72,19.52 25.03,46.72 25.03,81.61l0 70.13c0,34.16 -13.01,62.99 -39.13,86.67l53.95 210.66 -78.35 0 -44.28 -181.74c-2.08,0.09 -4.25,0.09 -6.6,0.09l-42.3 0 0 181.65 -72.66 0 0 -482.6 114.87 0zm43.47 116.31c0,-28.02 -13.92,-42.02 -41.66,-42.02l-44.01 0 0 154.54 44.01 0c11.57,0 21.42,-4.07 29.46,-12.29 8.13,-8.22 12.2,-18.16 12.2,-29.73l0 -70.49zm220.87 213.73l0 152.55 -72.66 0 0 -483.14 72.66 0 0 172.34 89.11 -172.34 78.08 0 -100.04 197.11 116.76 286.04 -85.58 0 -76.46 -196.11 -21.87 43.56zm583.18 -330.05l76.28 0 -75.46 482.6 -69.5 0 -41.21 -264.53 -38.59 264.53 -69.77 0 -80.98 -482.6 76.28 0 38.14 258.47 34.97 -258.47 76.28 0 38.14 258.2 35.43 -258.2zm160.78 371.44l-17.8 111.16 -75.91 0 82.06 -482.6 100.14 0 80.88 482.6 -76.46 0 -16.99 -111.16 -75.91 0zm37.96 -260.82l-26.93 189.79 53.95 0 -27.02 -189.79zm390.96 371.98l-198.37 0 0 -482.6 72.66 0 0 409.94 125.71 0 0 72.66zm248.44 0l-198.37 0 0 -482.6 72.66 0 0 409.94 125.71 0 0 72.66z\"\/> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3698.19 2088.69c-16.13,36.4 -32.35,65.39 -48.48,86.96l-6.04 -4.05c20.19,-41.75 35.72,-101.8 46.5,-179.96l44.43 24.24 -16.13 8.11c-4.06,10.78 -9.49,28.3 -16.22,52.54l60.65 0c0,-44.51 -0.6,-86.36 -1.98,-125.52l46.5 24.33 -16.13 14.15 0 87.05 56.59 0 26.31 -28.3 36.32 40.46 -119.22 0c-1.38,38.99 -3.36,75.31 -6.13,108.96l80.92 0 26.23 -28.3 36.41 40.46 -129.4 0c28.3,98.35 73.5,158.39 135.53,179.96l0 8.02c-20.27,-1.29 -35.11,5.43 -44.51,20.27 -51.24,-48.57 -84.89,-117.93 -101.11,-208.26l-6.04 0c-22.95,102.4 -84.98,173.83 -186,214.29l-4.05 -6.04c87.56,-51.24 141.48,-120.69 161.76,-208.26l-44.52 0c-17.51,0 -33.73,1.98 -48.48,6.04l-18.2 -18.2 113.19 0c2.67,-34.94 4.74,-71.26 6.04,-108.96l-64.7 0zm-131.39 252.51l82.9 -48.57 6.04 6.04c-59.27,45.9 -93,78.94 -101.11,99.12l-28.3 -30.28c8.11,-6.73 12.16,-16.91 12.16,-30.37l0 -109.22 -12.16 0c-17.51,0 -33.64,1.98 -48.48,6.04l-18.2 -18.2 78.85 0 0 -81.01 -40.46 0c-12.08,14.84 -24.24,28.99 -36.4,42.44l-6.04 -4.05c32.35,-48.48 59.96,-121.21 82.9,-218.09l46.5 24.24 -16.22 8.11c-10.78,24.24 -18.81,43.05 -24.24,56.51l58.66 0 24.24 -26.23 34.42 38.39 -121.38 0c-13.46,26.92 -25.62,49.09 -36.41,66.51l86.96 0 24.33 -24.24 32.35 36.41 -80.92 0 0 81.01 36.41 0 24.24 -22.17 30.37 34.33 -91.01 0 0 113.27zm653.06 -295.21c0,-37.7 -0.6,-70.05 -1.98,-97.05l48.48 20.19 -18.2 16.22 0 60.65 121.38 0 20.19 -24.24 38.39 38.39c-20.19,1.38 -46.5,22.95 -78.85,64.7l-6.04 -3.97 30.37 -62.72 -125.44 0 0 121.38 76.87 0 22.26 -22.17 32.35 36.32 -22.26 8.11c-32.35,52.54 -63.32,94.98 -93,127.33 40.46,31.06 101.8,49.86 184.01,56.59l0 8.11c-22.95,2.67 -36.4,12.77 -40.46,30.37 -63.32,-16.22 -117.24,-41.84 -161.76,-76.87 -57.97,41.75 -131.39,67.38 -220.42,76.87l-1.98 -6.13c91.62,-20.19 159.08,-49.86 202.22,-88.94 -33.73,-36.32 -60.65,-82.21 -80.92,-137.43l-24.24 4.05 -16.22 -16.22 115.26 0 0 -121.38 -129.4 0c0,55.3 -0.35,102.49 -0.95,141.57 -0.69,39.08 -9.14,77.82 -25.28,116.29 -16.22,38.39 -41.15,75.14 -74.88,110.17l-6.04 -4.06c28.3,-39.08 48.22,-78.16 59.7,-117.24 11.39,-39.17 17.51,-82.9 18.12,-131.47 0.69,-48.48 0.34,-97.74 -0.95,-147.61l32.35 20.19 127.33 0zm-64.7 145.71c25.62,51.24 55.3,91.01 89.03,119.31 28.3,-28.3 55.9,-68.07 82.9,-119.31l-171.93 0zm552.04 -46.76c0,53.92 0.69,92.4 1.98,115.34l-30.28 12.08 0 -24.24 -101.11 0 0 24.24 -30.37 14.15c1.38,-30.97 2.07,-61.34 2.07,-91.01 0,-29.68 -0.69,-58.66 -2.07,-86.96l34.42 16.13 93 0 18.2 -20.19 28.3 28.3 -14.15 12.16zm-129.4 -8.11l0 99.12 101.11 0 0 -99.12 -101.11 0zm254.75 -180.13c32.35,12.16 51.85,21.57 58.66,28.3 6.73,6.73 10.09,12.85 10.09,18.2 0,5.43 -2.07,11.13 -6.13,17.17 -3.97,6.13 -7.33,9.14 -10.09,9.14 -4.05,0 -8.71,-5.43 -14.15,-16.22 -9.4,-14.84 -23.55,-31.66 -42.44,-50.55l4.05 -6.04zm121.3 327.65c-1.29,21.57 -1.98,39.77 -1.98,54.61 0,14.84 0.95,27.69 3.02,38.48 1.98,10.78 5,21.57 9.06,32.35 1.38,4.05 0,6.13 -4.06,6.13 -5.35,0 -21.83,-6.13 -49.52,-18.2 -27.61,-12.16 -58.32,-40.46 -91.96,-84.98 -43.14,40.46 -97.05,75.49 -161.76,105.16l-4.05 -8.11c64.7,-36.41 115.26,-77.56 151.66,-123.45 -24.24,-44.51 -38.48,-120.09 -42.44,-226.63l-188.07 0c-17.51,0 -33.73,1.98 -48.57,6.04l-18.2 -18.2 252.77 0c0,-28.21 -0.69,-58.49 -1.98,-90.84l50.55 22.26 -18.2 16.13 0 52.45 103.09 0 28.3 -28.3 40.46 40.46 -169.86 0c4.05,95.76 14.84,162.53 32.35,200.32 10.78,-16.13 21.22,-37.44 31.32,-63.75 10.18,-26.31 19.24,-56.25 27.35,-89.98l46.5 32.35 -20.19 12.16c-24.33,59.35 -47.19,105.85 -68.76,139.58 20.19,29.68 49.17,56.68 86.87,81.01l18.2 -87.05 8.11 0zm-454.9 54.7c28.3,-1.3 114.57,-14.75 258.81,-40.37l1.98 8.11c-150.97,38.99 -231.2,64.62 -240.61,76.78l-20.19 -44.51zm752.1 -250.35c-16.13,36.4 -32.35,65.39 -48.48,86.96l-6.04 -4.05c20.19,-41.75 35.72,-101.8 46.5,-179.96l44.43 24.24 -16.13 8.11c-4.06,10.78 -9.49,28.3 -16.22,52.54l60.65 0c0,-44.51 -0.6,-86.36 -1.98,-125.52l46.5 24.33 -16.13 14.15 0 87.05 56.59 0 26.31 -28.3 36.32 40.46 -119.22 0c-1.38,38.99 -3.36,75.31 -6.13,108.96l80.92 0 26.23 -28.3 36.41 40.46 -129.4 0c28.3,98.35 73.5,158.39 135.53,179.96l0 8.02c-20.27,-1.29 -35.11,5.43 -44.51,20.27 -51.24,-48.57 -84.89,-117.93 -101.11,-208.26l-6.04 0c-22.95,102.4 -84.98,173.83 -186,214.29l-4.05 -6.04c87.56,-51.24 141.48,-120.69 161.76,-208.26l-44.52 0c-17.51,0 -33.73,1.98 -48.48,6.04l-18.2 -18.2 113.19 0c2.67,-34.94 4.74,-71.26 6.04,-108.96l-64.7 0zm-131.39 252.51l82.9 -48.57 6.04 6.04c-59.27,45.9 -93,78.94 -101.11,99.12l-28.3 -30.28c8.11,-6.73 12.16,-16.91 12.16,-30.37l0 -109.22 -12.16 0c-17.51,0 -33.65,1.98 -48.48,6.04l-18.2 -18.2 78.85 0 0 -81.01 -40.46 0c-12.08,14.84 -24.24,28.99 -36.41,42.44l-6.04 -4.05c32.35,-48.48 59.96,-121.21 82.9,-218.09l46.5 24.24 -16.22 8.11c-10.78,24.24 -18.81,43.05 -24.24,56.51l58.66 0 24.24 -26.23 34.42 38.39 -121.38 0c-13.46,26.92 -25.62,49.09 -36.41,66.51l86.96 0 24.33 -24.24 32.35 36.41 -80.92 0 0 81.01 36.41 0 24.24 -22.17 30.37 34.33 -91.01 0 0 113.27zm659.19 -80.66c0,87.56 0.6,138.03 1.98,151.49l-32.35 14.15c1.38,-44.52 2.07,-98.43 2.07,-161.76 -47.19,74.11 -120,126.04 -218.43,155.72l-1.98 -8.11c88.94,-36.32 150.97,-86.87 186,-151.49l-105.16 0c-17.51,0 -33.64,1.98 -48.48,6.04l-18.2 -18.2 206.27 0c0,-17.51 -0.69,-38.39 -2.07,-62.63l48.57 20.19 -18.2 14.15 0 28.3 149.59 0 28.3 -28.3 40.46 40.46 -198.16 0c41.75,60.65 106.46,97.05 194.11,109.22l0 8.02c-20.19,2.76 -33.73,11.47 -40.46,26.31 -74.11,-24.24 -128.71,-72.12 -163.74,-143.55l-10.09 0zm-230.51 -232.67l84.89 0c0,-24.24 -0.69,-49.86 -1.98,-76.87l46.5 24.33 -16.22 14.15 0 38.39 56.68 0 18.12 -20.19 28.38 26.31 -16.22 12.08c-2.67,62.03 -5.09,99.12 -7.07,111.2 -1.98,12.16 -7.42,22.26 -16.13,30.37 -8.8,8.11 -20.62,14.15 -35.46,18.2 1.38,-13.46 -13.46,-26.31 -44.43,-38.39l1.98 -8.11c29.68,6.73 47.88,8.71 54.61,6.04 6.73,-2.67 11.13,-9.4 13.11,-20.19 2.07,-10.78 4.4,-45.89 7.07,-105.16l-60.65 0c0,86.27 -39.08,150.28 -117.24,192.12l-4.05 -6.13c62.03,-45.81 93,-107.84 93,-186l-50.55 0 -18.2 4.05 -16.13 -16.22zm262.86 161.76c1.29,-32.35 1.98,-64.62 1.98,-96.97 0,-32.26 -0.69,-64.62 -1.98,-96.97l30.28 18.2 80.92 0 18.2 -18.2 26.23 26.31 -16.13 12.08c0,72.73 0.69,117.15 1.98,133.29l-28.3 14.15 0 -34.33 -84.89 0 0 28.3 -28.3 14.15zm28.3 -163.57l0 108.96 84.89 0 0 -108.96 -84.89 0zm487.25 240.17l0 50.47 60.65 0 0 -50.47 -60.65 0zm8.11 -244.57c0,-28.21 -0.69,-51.85 -1.98,-70.66l48.48 22.26 -18.2 14.06 0 34.34 74.8 0 24.33 -24.24 36.32 36.41 -135.44 0 0 111.03 30.37 0c22.86,-43.13 36.41,-76.78 40.37,-101.11l38.48 26.31c-14.84,6.73 -37.1,31.66 -66.77,74.8l50.55 0 26.31 -26.23 38.39 38.39 -266.92 0c-17.51,0 -33.65,1.98 -48.48,6.04l-18.2 -18.2 147.61 0 0 -111.03 -56.59 0c-17.51,0 -33.73,1.98 -48.57,6.04l-18.2 -18.2 123.37 0zm-97.05 30.37l6.04 -4.05c31.06,21.57 48.57,38.04 52.62,49.43 4.06,11.47 2.67,20.88 -4.05,28.3 -6.73,7.42 -11.47,11.13 -14.15,11.13 -5.43,0 -9.49,-6.73 -12.16,-20.19 -4.06,-20.19 -13.46,-41.75 -28.3,-64.62zm242.59 282.88c0,10.78 0.69,33.64 2.07,68.76l-30.37 10.09 0 -30.54 -190.05 0 0 20.36 -30.28 10.18c1.29,-39.08 1.98,-77.56 1.98,-115.26 0,-37.79 -0.69,-74.19 -1.98,-109.22l30.28 16.13 186 0 16.22 -20.19 30.37 26.31 -14.23 12.08 0 111.29zm-218.35 -117.33l0 153.47 190.05 0 0 -153.47 -190.05 0zm64.7 36.49l58.66 0 12.16 -16.13 28.3 22.26 -14.15 10.09c0,26.92 0.6,49.78 1.98,68.67l-26.31 12.16 0 -22.26 -60.65 0 0 14.15 -26.23 10.09c1.29,-21.57 1.98,-40.37 1.98,-56.59 0,-16.13 -0.69,-35.03 -1.98,-56.59l26.23 14.15zm-208.26 -139.24l0 -86.96c0,-21.57 -0.69,-44.52 -1.98,-68.76l48.48 26.31 -18.2 14.15 0 115.26 24.33 0 22.17 -22.17 34.42 34.33 -80.92 0 0 157.7 72.81 -18.2 1.98 8.11c-93,33.73 -144.16,58.66 -153.65,74.8l-22.26 -40.46c17.6,-2.67 41.84,-8.02 72.81,-16.13l0 -165.81 -6.04 0c-17.51,0 -33.73,1.98 -48.57,6.04l-18.2 -18.2 72.81 0z\"\/> <\/g> <polygon fill=\"#ED3237\" points=\"2822.09,2418.07 2822.09,627.56 3227.25,627.56 3227.25,2418.07 \"\/> <\/g> <\/g>",
    "acp": "<g> <polygon fill=\"#FFFFFF\" points=\"-0,3022.83 10572.6,3022.83 10572.6,0 -0,0 \"\/> <g> <g> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M4493.45 1239.61l-21.14 132 -90.15 0 97.44 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm352.43 448.81c-38.1,0 -70.4,-13.31 -97.02,-40.03 -26.72,-26.61 -40.03,-58.92 -40.03,-96.69l0 -312.73c0,-38.1 13.42,-70.51 40.25,-97.12 26.72,-26.72 59.02,-40.03 96.8,-40.03 38.1,0 70.4,13.42 96.91,40.24 26.51,26.83 39.71,59.13 39.71,97.02l0 65.47 -89.5 0 0 -67.29c0,-13.63 -4.83,-25.43 -14.59,-35.2 -9.77,-9.77 -21.46,-14.6 -35.2,-14.6 -13.74,0 -25.33,4.83 -34.99,14.6 -9.55,9.77 -14.38,21.46 -14.38,35.2l0 313.59c0,13.74 4.83,25.33 14.38,34.99 9.66,9.55 21.25,14.38 34.99,14.38 13.74,0 25.43,-4.83 35.2,-14.38 9.77,-9.55 14.59,-21.25 14.59,-34.99l0 -78.99 89.5 0 0 79.95c0,38.1 -13.42,70.4 -40.24,96.91 -26.72,26.51 -58.92,39.71 -96.37,39.71zm344.17 -580.17c42.07,0 75.66,13.31 100.67,39.82 23.18,25.33 34.77,57.63 34.77,97.02l0 83.28c0,37.78 -13.2,70.19 -39.6,97.02 -26.4,26.83 -58.38,40.25 -95.94,40.25l-49.9 0 0 215.71 -86.28 0 0 -573.08 136.29 0zm51.73 138.12c0,-15.03 -4.51,-27.04 -13.52,-36.17 -9.01,-9.12 -21.03,-13.74 -35.95,-13.74l-52.26 0 0 183.52 52.26 0c13.74,0 25.44,-4.83 34.99,-14.6 9.66,-9.77 14.49,-21.57 14.49,-35.31l0 -83.71zm557.84 -138.12l90.58 0 -89.61 573.08 -82.53 0 -48.94 -314.12 -45.82 314.12 -82.85 0 -96.16 -573.08 90.58 0 45.29 306.93 41.53 -306.93 90.58 0 45.29 306.61 42.07 -306.61zm190.92 441.08l-21.14 132 -90.15 0 97.44 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm464.26 441.72l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm295.02 0l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28z\"\/> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M4675.34 1724.87l0 129.39 165.65 0 0 -129.39 -165.65 0zm165.65 143.83l-165.65 0 0 26.43 -35.96 11.99c1.54,-47.94 2.36,-85.54 2.36,-112.79 0,-27.15 -0.82,-61.47 -2.36,-103.06l35.96 19.16 160.94 0 16.8 -23.97 40.77 28.79 -19.16 16.8c0,68.74 0.72,119.86 2.36,153.46l-36.06 16.8 0 -33.6zm21.62 285.21l-213.7 0 0 40.88 -35.96 14.44c1.64,-44.77 2.36,-85.13 2.36,-121.09 0,-35.96 -0.72,-81.14 -2.36,-135.53l35.96 23.97 208.99 0 19.16 -26.33 38.42 31.14 -19.16 16.8c0,84.72 0.72,147.11 2.36,187.06l-36.06 14.34 0 -45.69zm-213.7 -162.89l0 148.44 213.7 0 0 -148.44 -213.7 0zm-151.21 136.66l86.46 -50.3 4.81 7.17c-65.67,54.3 -100.91,91.07 -105.72,110.23l-28.79 -38.31c6.45,-6.35 9.63,-17.62 9.63,-33.6l0 -129.39 -16.8 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 96.09 0 0 -96.2 -50.4 0c-12.81,15.98 -26.43,32.78 -40.88,50.4l-7.17 -4.81c43.23,-70.38 78.37,-158.28 105.62,-263.79l50.4 28.79 -21.62 14.44c-11.17,23.97 -20.8,46.31 -28.79,67.1l72.02 0 31.25 -31.14 38.42 45.59 -146.5 0c-15.98,30.32 -31.14,56.65 -45.59,78.99l115.25 0 28.79 -28.79 38.42 43.23 -105.62 0 0 96.2 45.59 0 28.79 -28.79 36.06 43.23 -110.44 0 0 134.2zm537.83 -216.06c0,-35.24 -0.82,-70.38 -2.46,-105.62l52.86 21.62 -19.16 14.34 0 76.83 62.39 0c1.64,-57.57 2.36,-104.9 2.36,-141.68l-57.57 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 96.09 0c-3.17,-27.25 -15.98,-56.14 -38.42,-86.57l7.17 -4.81c36.88,22.44 57.68,40.06 62.49,52.96 4.81,12.81 -0.82,25.61 -16.8,38.42l62.39 0c19.16,-36.88 31.96,-68.95 38.42,-96.2l45.59 26.43 -21.62 9.63c-19.16,25.71 -35.14,45.69 -47.94,60.14l52.76 0 26.43 -26.33 40.77 40.77 -136.76 0c0,43.23 -1.64,90.46 -4.81,141.68l67.2 0c0,-36.78 -0.82,-74.37 -2.46,-112.79l48.05 19.16 -16.8 14.44c0,49.58 0.82,84.82 2.46,105.62l-31.25 11.99 0 -23.97 -69.66 0c-9.63,46.41 -30.02,80.42 -61.16,102.03 -31.25,21.62 -66.08,38.83 -104.49,51.63l-2.36 -7.17c33.6,-17.62 62.8,-37.29 87.59,-58.91 24.79,-21.51 41.18,-50.81 49.28,-87.59l-60.03 0 -14.44 16.8 -31.25 -26.43 14.44 -11.99zm280.9 -218.51l33.6 21.62 112.89 0 14.34 -21.62 38.42 26.43 -16.8 14.44 0 247.3c1.64,28.79 -15.98,51.22 -52.76,67.2 -1.64,-17.62 -23.26,-33.6 -64.85,-47.94l0 -9.63c35.24,4.82 58.39,7.17 69.66,7.17 11.17,0 16.8,-10.35 16.8,-31.25l0 -57.57 -124.88 0c-7.99,38.42 -32.06,73.66 -72.02,105.62l33.6 19.26 -19.26 14.34 0 50.4 103.26 0 31.25 -31.14 45.59 45.59 -180.1 0 0 69.77 168.11 0 36.06 -35.96 50.4 50.4 -470.63 0c-20.8,0 -40.06,2.36 -57.57,7.17l-21.62 -21.62 261.64 0 0 -69.77 -107.98 0c-20.9,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 187.27 0 0 -72.02c-11.17,7.99 -35.96,18.44 -74.38,31.25l-2.46 -7.17c51.22,-25.61 86.87,-52.04 106.85,-79.29 20.08,-27.15 31.25,-56.86 33.6,-88.82 2.46,-32.07 3.69,-62.39 3.69,-91.28 0,-28.79 -0.82,-61.57 -2.46,-98.45zm33.6 36.06l0 71.61 117.71 0 0 -71.61 -117.71 0zm0 86.05c0,28.99 -1.54,55.52 -4.81,79.6l122.52 0 0 -79.6 -117.71 0zm732.38 62.39c-27.25,88.1 -56.04,152.95 -86.46,194.64 44.77,57.57 97.63,93.64 158.48,108.08l0 9.53c-28.79,1.64 -45.69,11.27 -50.4,28.89 -44.87,-22.44 -87.28,-63.21 -127.34,-122.52 -52.76,56.04 -117.61,96.09 -194.44,120.06l-4.82 -7.17c76.83,-35.24 137.69,-80.83 182.45,-136.97 -30.43,-59.21 -50.4,-128.06 -60.03,-206.53l-26.33 0c0,40.06 -2.46,82.47 -7.27,127.34 -4.81,44.77 -15.16,85.64 -31.14,122.52 -16.08,36.78 -46.51,72.84 -91.28,108.08l-7.17 -7.27c46.41,-46.41 75.19,-96.4 86.36,-150.08 11.27,-53.58 16.8,-108.8 16.8,-165.65 0,-56.75 -0.72,-114.84 -2.36,-174.05l36.06 19.16c73.55,-19.16 120.37,-33.19 140.45,-42 19.98,-8.81 38.01,-18.03 53.99,-27.56l36.06 45.59c-19.26,0 -44.05,3.18 -74.48,9.53 -31.96,6.45 -84,15.26 -156.02,26.43l0 93.53 172.82 0 23.97 -23.97 36.06 36.06 -23.97 14.34zm-170.47 -11.99c14.34,68.84 36.78,128.87 67.2,180.1 28.79,-48.05 51.22,-108.08 67.2,-180.1l-134.41 0zm-184.91 36.27c0,174.46 0.82,278.44 2.36,312.05l-38.42 16.8c1.64,-72.02 2.46,-172.82 2.46,-302.42 -22.44,63.93 -52.86,119.14 -91.28,165.55l-7.17 -4.81c43.23,-76.73 74.38,-164.83 93.64,-264l-55.22 0 -19.26 4.81 -19.16 -19.26 98.45 0c0,-57.68 -0.82,-105.72 -2.46,-144.14l55.22 28.79 -19.16 16.9 0 98.45 28.79 0 26.43 -26.33 40.77 40.77 -95.99 0 0 62.39c36.78,20.8 59.21,36.06 67.2,45.59 7.99,9.63 11.99,19.26 11.99,28.89 0,7.99 -1.95,16.8 -5.94,26.33 -4,9.63 -6.86,14.44 -8.4,14.44 -4.81,0 -9.63,-7.99 -14.44,-23.97 -9.63,-24.07 -26.43,-49.69 -50.4,-76.83zm813.92 134.61l0 59.93 72.02 0 0 -59.93 -72.02 0zm9.63 -290.43c0,-33.5 -0.82,-61.57 -2.36,-83.9l57.57 26.43 -21.62 16.7 0 40.77 88.82 0 28.89 -28.79 43.13 43.23 -160.84 0 0 131.85 36.06 0c27.15,-51.22 43.23,-91.18 47.94,-120.06l45.69 31.25c-17.62,7.99 -44.05,37.6 -79.29,88.82l60.03 0 31.25 -31.14 45.59 45.59 -316.96 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 175.28 0 0 -131.85 -67.2 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 146.49 0zm-115.25 36.06l7.17 -4.81c36.88,25.61 57.68,45.18 62.49,58.7 4.82,13.63 3.18,24.79 -4.81,33.6 -7.99,8.81 -13.63,13.22 -16.8,13.22 -6.45,0 -11.27,-7.99 -14.44,-23.97 -4.82,-23.97 -15.98,-49.58 -33.6,-76.73zm288.07 335.92c0,12.81 0.82,39.95 2.46,81.65l-36.06 11.99 0 -36.27 -225.69 0 0 24.18 -35.96 12.09c1.54,-46.41 2.36,-92.1 2.36,-136.87 0,-44.87 -0.82,-88.1 -2.36,-129.69l35.96 19.16 220.87 0 19.26 -23.97 36.06 31.25 -16.9 14.34 0 132.15zm-259.29 -139.32l0 182.25 225.69 0 0 -182.25 -225.69 0zm76.83 43.33l69.66 0 14.44 -19.16 33.6 26.43 -16.8 11.99c0,31.96 0.72,59.11 2.36,81.55l-31.25 14.44 0 -26.43 -72.02 0 0 16.8 -31.14 11.99c1.54,-25.61 2.36,-47.94 2.36,-67.2 0,-19.16 -0.82,-41.59 -2.36,-67.2l31.14 16.8zm-247.3 -165.35l0 -103.26c0,-25.61 -0.82,-52.86 -2.36,-81.65l57.57 31.25 -21.62 16.8 0 136.87 28.89 0 26.33 -26.33 40.88 40.77 -96.09 0 0 187.27 86.46 -21.62 2.36 9.63c-110.44,40.06 -171.19,69.66 -182.45,88.82l-26.43 -48.05c20.9,-3.18 49.69,-9.53 86.46,-19.16l0 -196.9 -7.17 0c-20.8,0 -40.05,2.36 -57.68,7.17l-21.62 -21.62 86.46 0z\"\/> <\/g> <polygon fill=\"#ED3237\" points=\"3732.63,2406.67 3732.63,616.16 4137.78,616.16 4137.78,2406.67 \"\/> <\/g> <\/g>",
    "woodenpanel": "<g> <polygon fill=\"#FFFFFF\" points=\"-0,3022.83 10572.6,3022.83 10572.6,0 -0,0 \"\/> <g> <g> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3300.92 832.47l90.58 0 -89.61 573.08 -82.53 0 -48.94 -314.12 -45.82 314.12 -82.85 0 -96.16 -573.08 90.58 0 45.29 306.93 41.53 -306.93 90.58 0 45.29 306.61 42.07 -306.61zm286.65 -7.08c38.1,0 70.4,13.41 97.02,40.24 26.72,26.83 40.03,59.13 40.03,96.91l0 312.94c0,38.1 -13.42,70.51 -40.25,97.12 -26.72,26.72 -59.03,40.03 -96.8,40.03 -38.1,0 -70.4,-13.42 -96.91,-40.25 -26.51,-26.83 -39.71,-59.13 -39.71,-96.91l0 -312.94c0,-38.1 13.42,-70.51 40.24,-97.12 26.72,-26.72 58.92,-40.03 96.37,-40.03zm46.9 135.65c0,-13.74 -4.83,-25.33 -14.38,-34.99 -9.66,-9.55 -21.25,-14.38 -34.99,-14.38 -13.74,0 -25.43,4.83 -35.2,14.38 -9.77,9.66 -14.6,21.25 -14.6,34.99l0 313.37c0,13.74 4.83,25.33 14.6,34.99 9.77,9.55 21.46,14.38 35.2,14.38 13.74,0 25.33,-4.83 34.99,-14.38 9.55,-9.66 14.38,-21.25 14.38,-34.99l0 -313.37zm301.67 -135.65c38.1,0 70.4,13.41 97.02,40.24 26.72,26.83 40.03,59.13 40.03,96.91l0 312.94c0,38.1 -13.42,70.51 -40.25,97.12 -26.72,26.72 -59.03,40.03 -96.8,40.03 -38.1,0 -70.4,-13.42 -96.91,-40.25 -26.51,-26.83 -39.71,-59.13 -39.71,-96.91l0 -312.94c0,-38.1 13.42,-70.51 40.24,-97.12 26.72,-26.72 58.92,-40.03 96.37,-40.03zm46.9 135.65c0,-13.74 -4.83,-25.33 -14.38,-34.99 -9.66,-9.55 -21.25,-14.38 -34.99,-14.38 -13.74,0 -25.43,4.83 -35.2,14.38 -9.77,9.66 -14.6,21.25 -14.6,34.99l0 313.37c0,13.74 4.83,25.33 14.6,34.99 9.77,9.55 21.46,14.38 35.2,14.38 13.74,0 25.33,-4.83 34.99,-14.38 9.55,-9.66 14.38,-21.25 14.38,-34.99l0 -313.37zm438.08 307.25c0,37.78 -13.31,70.19 -39.82,97.02 -26.51,26.83 -58.49,40.24 -96.05,40.24l-135.87 0 0 -573.73 135.87 0c37.78,0 69.86,13.42 96.26,40.25 26.4,26.83 39.6,59.03 39.6,96.59l0 299.63zm-185.45 51.62l52.16 0c13.74,0 25.33,-4.94 34.77,-14.92 9.44,-9.87 14.17,-21.57 14.17,-34.99l0 -300.06c0,-13.74 -4.83,-25.54 -14.38,-35.31 -9.66,-9.77 -21.14,-14.6 -34.56,-14.6l-52.16 0 0 399.87zm261.21 85.64l0 -573.73 246.08 0 0 86.93 -159.8 0 0 156.47 116.55 0 0 86.93 -116.55 0 0 156.47 159.8 0 0 86.93 -246.08 0zm402.66 -573.73l114.72 385.06 0 -385.06 86.28 0 0 573.73 -92.83 0 -119.02 -367.25 0 367.25 -86.28 0 0 -573.73 97.12 0zm456.21 0.64c42.07,0 75.66,13.31 100.66,39.82 23.18,25.33 34.77,57.63 34.77,97.02l0 83.28c0,37.78 -13.2,70.19 -39.6,97.02 -26.4,26.83 -58.38,40.25 -95.94,40.25l-49.9 0 0 215.71 -86.28 0 0 -573.08 136.29 0zm51.73 138.12c0,-15.03 -4.51,-27.04 -13.52,-36.17 -9.01,-9.12 -21.03,-13.74 -35.95,-13.74l-52.26 0 0 183.52 52.26 0c13.74,0 25.44,-4.83 34.99,-14.6 9.66,-9.77 14.49,-21.57 14.49,-35.31l0 -83.71zm208.63 302.96l-21.14 132 -90.15 0 97.45 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm325.82 -132l114.72 385.06 0 -385.06 86.28 0 0 573.73 -92.83 0 -119.02 -367.25 0 367.25 -86.28 0 0 -573.73 97.12 0zm278.28 573.73l0 -573.73 246.08 0 0 86.93 -159.8 0 0 156.47 116.55 0 0 86.93 -116.55 0 0 156.47 159.8 0 0 86.93 -246.08 0zm541.1 0l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm474.24 -573.08l90.58 0 -89.61 573.08 -82.53 0 -48.94 -314.12 -45.82 314.12 -82.85 0 -96.16 -573.08 90.58 0 45.29 306.93 41.53 -306.93 90.58 0 45.29 306.61 42.07 -306.61zm190.92 441.08l-21.14 132 -90.15 0 97.45 -573.08 118.91 0 96.05 573.08 -90.79 0 -20.18 -132 -90.15 0zm45.07 -309.72l-31.98 225.37 64.07 0 -32.09 -225.37zm464.26 441.72l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28zm295.02 0l-235.56 0 0 -573.08 86.28 0 0 486.8 149.28 0 0 86.28z\"\/> <path fill=\"#000000\" fill-rule=\"nonzero\" d=\"M3222.61 1813.28c0,190.75 0.82,310.92 2.46,360.61l-40.88 19.26c1.64,-97.73 2.46,-212.37 2.46,-343.8 -49.69,116.99 -133.69,210.73 -252.12,281.31l-4.81 -7.27c108.8,-84.93 185.63,-188.29 230.5,-310.1l-139.32 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 244.94 0c0,-64.03 -0.82,-119.25 -2.46,-165.65l62.49 26.43 -24.07 19.16 0 120.07 163.3 0 38.42 -38.42 52.86 52.86 -230.5 0c46.41,139.43 127.24,223.64 242.49,252.42l0 9.63c-35.24,6.45 -55.22,18.44 -60.03,36.06 -108.9,-75.3 -173.64,-174.67 -194.54,-298.11l-11.99 0zm809.21 31.04c-27.25,88.1 -56.04,152.95 -86.46,194.64 44.77,57.57 97.63,93.63 158.48,108.08l0 9.53c-28.79,1.64 -45.69,11.27 -50.4,28.89 -44.87,-22.44 -87.28,-63.21 -127.34,-122.52 -52.76,56.04 -117.61,96.09 -194.44,120.06l-4.82 -7.17c76.83,-35.24 137.69,-80.83 182.45,-136.97 -30.43,-59.21 -50.4,-128.06 -60.03,-206.53l-26.33 0c0,40.06 -2.46,82.47 -7.27,127.34 -4.81,44.77 -15.16,85.64 -31.14,122.52 -16.08,36.78 -46.51,72.84 -91.28,108.08l-7.17 -7.27c46.41,-46.41 75.19,-96.4 86.36,-150.08 11.27,-53.58 16.8,-108.8 16.8,-165.65 0,-56.75 -0.72,-114.84 -2.36,-174.05l36.06 19.16c73.55,-19.16 120.37,-33.19 140.45,-42 19.98,-8.81 38.01,-18.03 53.99,-27.56l36.06 45.59c-19.26,0 -44.05,3.18 -74.48,9.53 -31.96,6.45 -84,15.26 -156.02,26.43l0 93.53 172.82 0 23.97 -23.97 36.06 36.06 -23.97 14.34zm-170.47 -11.99c14.34,68.84 36.78,128.88 67.2,180.1 28.79,-48.05 51.22,-108.08 67.2,-180.1l-134.41 0zm-184.91 36.27c0,174.46 0.82,278.44 2.36,312.05l-38.42 16.8c1.64,-72.02 2.46,-172.82 2.46,-302.42 -22.44,63.93 -52.86,119.14 -91.28,165.55l-7.17 -4.81c43.23,-76.73 74.38,-164.83 93.64,-264l-55.22 0 -19.26 4.81 -19.16 -19.26 98.45 0c0,-57.68 -0.82,-105.72 -2.46,-144.14l55.22 28.79 -19.16 16.9 0 98.45 28.79 0 26.43 -26.33 40.77 40.77 -95.99 0 0 62.39c36.78,20.8 59.21,36.06 67.2,45.59 7.99,9.63 11.99,19.26 11.99,28.89 0,7.99 -1.95,16.8 -5.94,26.33 -4,9.63 -6.86,14.44 -8.4,14.44 -4.81,0 -9.63,-7.99 -14.44,-23.97 -9.63,-24.07 -26.43,-49.69 -50.4,-76.83zm813.92 134.61l0 59.93 72.02 0 0 -59.93 -72.02 0zm9.63 -290.43c0,-33.5 -0.82,-61.57 -2.36,-83.9l57.57 26.43 -21.62 16.7 0 40.77 88.82 0 28.89 -28.79 43.13 43.23 -160.84 0 0 131.85 36.06 0c27.15,-51.22 43.23,-91.18 47.94,-120.07l45.69 31.25c-17.62,7.99 -44.05,37.6 -79.29,88.82l60.03 0 31.25 -31.14 45.59 45.59 -316.96 0c-20.8,0 -39.95,2.36 -57.57,7.17l-21.62 -21.62 175.28 0 0 -131.85 -67.2 0c-20.8,0 -40.06,2.36 -57.68,7.17l-21.62 -21.62 146.49 0zm-115.25 36.06l7.17 -4.81c36.88,25.61 57.68,45.18 62.49,58.7 4.82,13.63 3.18,24.79 -4.81,33.6 -7.99,8.81 -13.63,13.22 -16.8,13.22 -6.45,0 -11.27,-7.99 -14.44,-23.97 -4.82,-23.97 -15.98,-49.58 -33.6,-76.73zm288.07 335.92c0,12.81 0.82,39.95 2.46,81.65l-36.06 11.99 0 -36.27 -225.69 0 0 24.18 -35.96 12.09c1.54,-46.41 2.36,-92.1 2.36,-136.87 0,-44.87 -0.82,-88.1 -2.36,-129.69l35.96 19.16 220.87 0 19.26 -23.97 36.06 31.25 -16.9 14.34 0 132.15zm-259.29 -139.32l0 182.25 225.69 0 0 -182.25 -225.69 0zm76.83 43.33l69.66 0 14.44 -19.16 33.6 26.43 -16.8 11.99c0,31.96 0.72,59.11 2.36,81.55l-31.25 14.44 0 -26.43 -72.02 0 0 16.8 -31.14 11.99c1.54,-25.61 2.36,-47.94 2.36,-67.2 0,-19.16 -0.82,-41.59 -2.36,-67.2l31.14 16.8zm-247.3 -165.35l0 -103.26c0,-25.61 -0.82,-52.86 -2.36,-81.65l57.57 31.25 -21.62 16.8 0 136.87 28.89 0 26.33 -26.33 40.88 40.77 -96.09 0 0 187.27 86.46 -21.62 2.36 9.63c-110.44,40.06 -171.19,69.66 -182.45,88.82l-26.43 -48.05c20.9,-3.18 49.69,-9.53 86.46,-19.16l0 -196.9 -7.17 0c-20.8,0 -40.05,2.36 -57.68,7.17l-21.62 -21.62 86.46 0z\"\/> <\/g> <polygon fill=\"#ED3237\" points=\"2296.7,2406.67 2296.7,616.16 2701.86,616.16 2701.86,2406.67 \"\/> <\/g> <\/g>",
  };

  function setDirectiveEnvType(type) {
    const cleanType = (type || '').trim();
    state.directiveEnvType = cleanType;
    const svgEl = document.getElementById('docEnvSvg');
    const container = document.getElementById('docFieldEnvOption');
    const ctrl = document.getElementById('ctrlEnvType');
    if (ctrl && ctrl.value !== cleanType) {
      ctrl.value = cleanType;
    }
    if (container) {
      container.setAttribute('data-env-type', cleanType);
    }
    if (svgEl) {
      svgEl.innerHTML = DIRECTIVE_WALL_SVGS[cleanType] || '';
    }
  }

  function openEnvOptionMenu(anchorEl) {
    let menu = document.getElementById('directiveEnvPickerMenu');
    if (menu) {
      menu.remove();
      return;
    }
    menu = document.createElement('div');
    menu.id = 'directiveEnvPickerMenu';
    menu.className = 'directive-env-picker-menu';

    const options = [
      { id: '', label: 'Blank (None)', desc: 'Leave environment blank / unselected' },
      { id: 'concrete-wall', label: 'Concrete Wall', desc: '水泥墙' },
      { id: 'glass-wall', label: 'Glass Wall', desc: '玻璃墙' },
      { id: 'iron-plated', label: 'Iron-plated / Iron Framework Wall', desc: '铁皮/铁架墙' },
      { id: 'woodenpanel', label: 'Wooden Panel Wall', desc: '木板墙' },
      { id: 'acp', label: 'ACP Wall', desc: '铝塑板墙' }
    ];

    const cur = state.directiveEnvType || '';

    menu.innerHTML = `
      <div class="env-picker-header">
        <span>Select Installation Environment</span>
        <button type="button" class="env-picker-close">&times;</button>
      </div>
      <div class="env-picker-list">
        ${options.map(opt => `
          <button type="button" class="env-picker-item ${opt.id === cur ? 'active' : ''}" data-env-id="${opt.id}">
            <div class="env-picker-item-label">${opt.label}</div>
            <div class="env-picker-item-desc">${opt.desc}</div>
          </button>
        `).join('')}
      </div>
    `;

    document.body.appendChild(menu);

    const rect = anchorEl.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 6) + 'px';
    menu.style.left = Math.max(10, Math.min(window.innerWidth - 320, rect.left)) + 'px';
    menu.style.zIndex = '999999';

    menu.querySelector('.env-picker-close').onclick = (e) => {
      e.stopPropagation();
      menu.remove();
    };

    menu.querySelectorAll('.env-picker-item').forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const id = item.getAttribute('data-env-id');
        setDirectiveEnvType(id);
        const name = item.querySelector('.env-picker-item-label')?.textContent || id;
        showToast(id ? `Environment set to ${name}` : 'Environment set to Blank');
        menu.remove();
      };
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && e.target !== anchorEl) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Vector SVG copied to clipboard!');
    } catch (e) {
      showToast('Unable to copy automatically.', 'error');
    }
    document.body.removeChild(ta);
  }

  // ==========================================================================
  // TEMPLATE EDITOR ENGINE (Interactive Drag, Resize & Customization)
  // ==========================================================================

  let isDraggingElem = false;
  let isResizingElem = false;
  let dragTarget = null;
  let dragOffset = { x: 0, y: 0 };
  let initialSize = { w: 0, h: 0 };
  let initialMousePos = { x: 0, y: 0 };

  function initTemplateEditorCanvas() {
    const canvas = document.getElementById('interactiveTemplateCanvas');
    if (!canvas) return;

    canvas.innerHTML = '';
    state.templateElements.forEach(el => {
      const elemNode = document.createElement('div');
      elemNode.className = `template-element ${state.selectedTemplateElemId === el.id ? 'selected' : ''}`;
      elemNode.id = `tpl-${el.id}`;
      elemNode.style.left = `${el.x}px`;
      elemNode.style.top = `${el.y}px`;
      elemNode.style.width = `${el.w}px`;
      elemNode.style.height = `${el.h}px`;
      elemNode.style.textAlign = el.align || 'center';

      elemNode.innerHTML = `
        <div class="element-label">${escapeHTML(el.label)}</div>
        <div class="element-content" style="font-size: ${el.fontSize}px; color: ${el.color || '#1F2937'};">${escapeHTML(el.content)}</div>
        <div class="resize-handle" title="Drag to resize"></div>
      `;

      elemNode.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
          isResizingElem = true;
          dragTarget = el;
          initialSize = { w: el.w, h: el.h };
          initialMousePos = { x: e.clientX, y: e.clientY };
          selectTemplateElement(el.id);
          e.stopPropagation();
          return;
        }

        isDraggingElem = true;
        dragTarget = el;
        const rect = elemNode.getBoundingClientRect();
        dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        selectTemplateElement(el.id);
        e.stopPropagation();
      });

      canvas.appendChild(elemNode);
    });

    if (!canvas._listenersAttached) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
      canvas._listenersAttached = true;
    }

    setupTemplateToolbar();
  }

  function handleCanvasMouseMove(e) {
    if (!dragTarget) return;
    const canvas = document.getElementById('interactiveTemplateCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    if (isDraggingElem) {
      let newX = e.clientX - canvasRect.left - dragOffset.x;
      let newY = e.clientY - canvasRect.top - dragOffset.y;

      newX = Math.max(0, Math.min(newX, canvas.clientWidth - dragTarget.w));
      newY = Math.max(0, Math.min(newY, canvas.clientHeight - dragTarget.h));

      dragTarget.x = Math.round(newX);
      dragTarget.y = Math.round(newY);

      const node = document.getElementById(`tpl-${dragTarget.id}`);
      if (node) {
        node.style.left = `${dragTarget.x}px`;
        node.style.top = `${dragTarget.y}px`;
      }
    } else if (isResizingElem) {
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;

      let newW = Math.max(80, initialSize.w + deltaX);
      let newH = Math.max(35, initialSize.h + deltaY);

      dragTarget.w = Math.round(newW);
      dragTarget.h = Math.round(newH);

      const node = document.getElementById(`tpl-${dragTarget.id}`);
      if (node) {
        node.style.width = `${dragTarget.w}px`;
        node.style.height = `${dragTarget.h}px`;
      }
    }
  }

  function handleCanvasMouseUp() {
    if (isDraggingElem || isResizingElem) {
      isDraggingElem = false;
      isResizingElem = false;
      dragTarget = null;
    }
  }

  function selectTemplateElement(id) {
    state.selectedTemplateElemId = id;
    document.querySelectorAll('.template-element').forEach(n => n.classList.remove('selected'));
    const cur = document.getElementById(`tpl-${id}`);
    if (cur) cur.classList.add('selected');

    const el = state.templateElements.find(item => item.id === id);
    if (el) {
      const lblInput = document.getElementById('propElemLabel');
      const cntInput = document.getElementById('propElemContent');
      const fsInput = document.getElementById('propElemFontSize');
      const alignInput = document.getElementById('propElemAlign');

      if (lblInput) lblInput.value = el.label;
      if (cntInput) cntInput.value = el.content;
      if (fsInput) fsInput.value = el.fontSize;
      if (alignInput) alignInput.value = el.align || 'center';
    }
  }

  function setupTemplateToolbar() {
    const lblInput = document.getElementById('propElemLabel');
    const cntInput = document.getElementById('propElemContent');
    const fsInput = document.getElementById('propElemFontSize');
    const alignInput = document.getElementById('propElemAlign');

    const updateCurrent = () => {
      if (!state.selectedTemplateElemId) return;
      const el = state.templateElements.find(item => item.id === state.selectedTemplateElemId);
      if (!el) return;

      if (lblInput) el.label = lblInput.value;
      if (cntInput) el.content = cntInput.value;
      if (fsInput) el.fontSize = parseInt(fsInput.value, 10) || 12;
      if (alignInput) el.align = alignInput.value;

      const node = document.getElementById(`tpl-${el.id}`);
      if (node) {
        node.querySelector('.element-label').textContent = el.label;
        const cntNode = node.querySelector('.element-content');
        cntNode.textContent = el.content;
        cntNode.style.fontSize = `${el.fontSize}px`;
        node.style.textAlign = el.align;
      }
    };

    if (lblInput) lblInput.oninput = updateCurrent;
    if (cntInput) cntInput.oninput = updateCurrent;
    if (fsInput) fsInput.oninput = updateCurrent;
    if (alignInput) alignInput.onchange = updateCurrent;

    const btnAdd = document.getElementById('btnTplAddElement');
    if (btnAdd) {
      btnAdd.onclick = () => {
        const newId = `el-${Date.now().toString(36)}`;
        const newEl = { id: newId, label: 'CUSTOM FIELD', content: 'NEW CONTENT', x: 50, y: 50, w: 160, h: 44, fontSize: 12, align: 'center', color: '#1F2937' };
        state.templateElements.push(newEl);
        initTemplateEditorCanvas();
        selectTemplateElement(newId);
        showToast('New template field added.');
      };
    }

    const btnDel = document.getElementById('btnTplDeleteElement');
    if (btnDel) {
      btnDel.onclick = () => {
        if (!state.selectedTemplateElemId) return;
        state.templateElements = state.templateElements.filter(e => e.id !== state.selectedTemplateElemId);
        state.selectedTemplateElemId = null;
        initTemplateEditorCanvas();
        showToast('Element deleted.');
      };
    }

    const btnSaveTpl = document.getElementById('btnTplSaveTemplate');
    if (btnSaveTpl) {
      btnSaveTpl.onclick = () => {
        saveStateToStorage();
        showToast('Custom template layout saved!');
      };
    }

    const btnResetTpl = document.getElementById('btnTplResetDefault');
    if (btnResetTpl) {
      btnResetTpl.onclick = () => {
        state.templateElements = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS));
        state.selectedTemplateElemId = null;
        initTemplateEditorCanvas();
        saveStateToStorage();
        showToast('Template restored to standard layout.');
      };
    }
  }

  // ==========================================================================
  // ATTACHMENTS HANDLING
  // ==========================================================================

  function resolveAttachmentUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    if (typeof isInsidePagesDir === 'function' && isInsidePagesDir() && !url.startsWith('../')) {
      return '../' + url;
    }
    return url;
  }

  function sanitizeAttachmentUrls() {
    if (!Array.isArray(state.attachments)) return;
    state.attachments.forEach(att => {
      if (att.url === 'assets/img/sign-depot-logo.png' || att.url === '../assets/img/sign-depot-logo.png' || !att.url) {
        const match = DEFAULT_ATTACHMENTS.find(d => d.id === att.id || d.name === att.name);
        if (match && match.url) {
          att.url = match.url;
          if (match.type) att.type = match.type;
        }
      }
    });
  }

  function renderAttachmentsList() {
    const grid = document.getElementById('attachmentsGridContainer');
    const badge = document.getElementById('attachmentsCountBadge');
    sanitizeAttachmentUrls();
    if (badge) badge.textContent = state.attachments.length;
    if (!grid) return;

    if (!state.attachments || state.attachments.length === 0) {
      grid.innerHTML = `
        <div class="attachment-empty-box">
          <div class="attachment-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <h4 style="font-size:15px; font-weight:700; color:#0F172A; margin:0 0 6px 0;">No Proofs Attached Yet</h4>
          <p style="font-size:12.5px; color:#64748B; margin:0 0 16px 0;">Upload design renders, vector drawings, or site photos for this directive.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('localAttachmentUploadInput').click();">
            Upload First Proof
          </button>
        </div>
      `;
    } else {
      grid.innerHTML = state.attachments.map(att => {
        const resolvedUrl = resolveAttachmentUrl(att.url);
        return `
          <div class="attachment-card" data-att-id="${escapeHTML(att.id)}">
            <div class="attachment-thumbnail" onclick="window.SignDepotApp.previewAttachment('${escapeHTML(att.id)}')">
              <span class="attachment-type-badge">${escapeHTML(att.type || 'Proof')}</span>
              <img src="${resolvedUrl}" alt="${escapeHTML(att.name)}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
              <div class="attachment-fallback-preview" style="display:none;">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span class="fallback-name">${escapeHTML(att.name)}</span>
              </div>
              <div class="attachment-thumb-overlay">
                <span class="attachment-zoom-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Click to Inspect
                </span>
              </div>
            </div>
            <div class="attachment-meta">
              <div class="attachment-title" title="${escapeHTML(att.name)}">${escapeHTML(att.name)}</div>
              <div class="attachment-info-row">
                <span class="attachment-size-pill">${escapeHTML(att.size || 'N/A')}</span>
                <span class="attachment-date-pill">${escapeHTML(att.dateAdded || '')}</span>
              </div>
            </div>
            <div class="attachment-footer-actions">
              <button type="button" class="attachment-btn-view" onclick="window.SignDepotApp.previewAttachment('${escapeHTML(att.id)}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Proof
              </button>
              <button type="button" class="attachment-btn-delete" title="Delete attachment" onclick="window.SignDepotApp.deleteAttachment('${escapeHTML(att.id)}')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    const uploadBtn = document.getElementById('btnUploadLocalAttachment');
    const fileInput = document.getElementById('localAttachmentUploadInput');
    if (uploadBtn && fileInput) {
      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const handleAddAttachment = (name, type, sizeBytes, url) => {
          const newAtt = {
            id: `att-${Date.now()}`,
            name: name,
            type: type || 'Image File',
            size: `${(sizeBytes / 1024).toFixed(1)} KB`,
            dateAdded: new Date().toISOString().split('T')[0],
            storageType: 'Local Browser',
            url: url
          };
          state.attachments.unshift(newAtt);
          saveStateToStorage();
          renderAttachmentsList();
          showToast(`Attached ${name} successfully.`);
          fileInput.value = '';
        };

        if (file.type && file.type.startsWith('image/') && window.SignDepotCropper) {
          window.SignDepotCropper.open({
            file: file,
            title: 'Crop & Adjust Proof Artwork',
            circular: false,
            allowSkip: true,
            outputSize: 1200,
            onCrop: (croppedBlob, croppedDataUrl, croppedFile) => {
              handleAddAttachment(croppedFile.name, 'image/jpeg', croppedBlob.size, croppedDataUrl);
            },
            onSkip: () => {
              const reader = new FileReader();
              reader.onload = (event) => {
                handleAddAttachment(file.name, file.type, file.size, event.target.result);
              };
              reader.readAsDataURL(file);
            },
            onCancel: () => {
              fileInput.value = '';
            }
          });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            handleAddAttachment(file.name, file.type, file.size, event.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
    }
  }


  // ==========================================================================
  // FULL-PLEDGE VECTOR STUDIO EDITOR (CorelDRAW / Adobe Illustrator Mode)
  // ==========================================================================

  function initStudioVectorEditor() {
    const inspector = document.getElementById('studioPropertyInspector');
    if (!inspector) return;

    const svg = document.getElementById('directiveExactSvg');
    const artwrap = document.getElementById('studioArtboardWrap');
    const transformBox = document.getElementById('studioTransformBox');
    if (!svg || !artwrap || !transformBox) return;

    let zoom = 1.25;
    let activeFieldId = 'docFieldProjectName';
    let isMoving = false;
    let isResizing = false;
    let activeHandle = null;
    let dragStart = { x: 0, y: 0 };
    let initBox = { x: 0, y: 0, w: 0, h: 0 };

    const STUDIO_FIELDS = [
      { id: 'docFieldClientName', name: 'Client Name', defX: 342, defY: 20, defW: 220, defH: 28, defSz: 22, color: '#000000', align: 'middle' },
      { id: 'docFieldJoNumber', name: 'JO Number', defX: 58, defY: 2, defW: 164, defH: 29, defSz: 28, color: '#FFFFFF', align: 'start' },
      { id: 'docFieldProjectName', name: 'Project Name', defX: 342, defY: 52, defW: 220, defH: 19, defSz: 12, color: '#000000', align: 'middle' },
      { id: 'docFieldDueDate', name: 'Due Date', defX: 227, defY: 34, defW: 111, defH: 30, defSz: 14, color: '#FFFFFF', align: 'middle' },
      { id: 'docFieldOrderDate', name: 'Order Date', defX: 227, defY: 2, defW: 111, defH: 30, defSz: 14, color: '#000000', align: 'middle' },
      { id: 'docFieldReleasingDate', name: 'Release Date', defX: 227, defY: 66, defW: 111, defH: 29, defSz: 14, color: '#000000', align: 'middle' },
      { id: 'docFieldInCharge', name: 'In-Charge', defX: 8, defY: 34, defW: 215, defH: 19, defSz: 15, color: '#000000', align: 'end' },
      { id: 'docFieldDrawnBy', name: 'Drawn By', defX: 8, defY: 55, defW: 215, defH: 19, defSz: 15, color: '#000000', align: 'end' },
      { id: 'docFieldAddress', name: 'Address', defX: 99, defY: 77, defW: 122, defH: 17, defSz: 12, color: '#000000', align: 'middle' },
      { id: 'docFieldContactPerson', name: 'Contact Person', defX: 715, defY: 46, defW: 100, defH: 18, defSz: 13, color: '#000000', align: 'middle' },
      { id: 'docFieldContactNumber', name: 'Contact Number', defX: 715, defY: 73, defW: 100, defH: 18, defSz: 13, color: '#000000', align: 'middle' },
      { id: 'docFieldInstallers', name: 'Installers', defX: 824, defY: 2, defW: 78, defH: 44, defSz: 14, color: '#000000', align: 'middle' },
      { id: 'docFieldDuration', name: 'Duration', defX: 824, defY: 50, defW: 78, defH: 44, defSz: 14, color: '#000000', align: 'middle' }
    ];

    if (!state.customBoxPositions) state.customBoxPositions = {};
    if (!state.customBoxSizes) state.customBoxSizes = {};
    if (!state.customCellFonts) state.customCellFonts = {};

    // 1. Zoom Engine
    const applyZoom = (z) => {
      zoom = Math.max(0.5, Math.min(3, z));
      artwrap.style.transform = `scale(${zoom})`;
      const zoomSel = document.getElementById('studioZoomSelect');
      if (zoomSel) zoomSel.value = String(zoom);
    };

    const btnZoomIn = document.getElementById('studioZoomIn');
    if (btnZoomIn) btnZoomIn.onclick = () => applyZoom(Math.round((zoom + 0.25) * 100) / 100);

    const btnZoomOut = document.getElementById('studioZoomOut');
    if (btnZoomOut) btnZoomOut.onclick = () => applyZoom(Math.round((zoom - 0.25) * 100) / 100);

    const btnZoomReset = document.getElementById('studioZoomReset');
    if (btnZoomReset) btnZoomReset.onclick = () => applyZoom(1);

    const btnZoomFit = document.getElementById('studioZoomFit');
    if (btnZoomFit) {
      btnZoomFit.onclick = () => {
        const viewport = document.getElementById('studioArtboardViewport');
        if (viewport) {
          const availW = viewport.clientWidth - 100;
          const fitZ = Math.min(2, Math.max(0.75, Math.round((availW / 904) * 10) / 10));
          applyZoom(fitZ);
        }
      };
    }

    const zoomSelect = document.getElementById('studioZoomSelect');
    if (zoomSelect) {
      zoomSelect.onchange = () => applyZoom(parseFloat(zoomSelect.value));
    }

    // 2. Field Selection & Transform Bounding Box
    const getFieldData = (id) => {
      const def = STUDIO_FIELDS.find(f => f.id === id) || STUDIO_FIELDS[0];
      const pos = (state.customBoxPositions && state.customBoxPositions[id]) || { x: def.defX, y: def.defY };
      const sz = (state.customBoxSizes && state.customBoxSizes[id]) || { w: def.defW, h: def.defH };
      const fontSz = (state.customCellFonts && state.customCellFonts[id]) || def.defSz;
      return {
        id,
        name: def.name,
        x: pos.x !== undefined ? pos.x : def.defX,
        y: pos.y !== undefined ? pos.y : def.defY,
        w: sz.w !== undefined ? sz.w : def.defW,
        h: sz.h !== undefined ? sz.h : def.defH,
        fontSize: fontSz,
        align: def.align,
        color: def.color
      };
    };

    const updateTransformBoxUI = (fieldId) => {
      const data = getFieldData(fieldId);
      transformBox.style.display = 'block';
      transformBox.style.left = `${data.x}px`;
      transformBox.style.top = `${data.y}px`;
      transformBox.style.width = `${data.w}px`;
      transformBox.style.height = `${data.h}px`;

      // Update Inspector Inputs
      const inpX = document.getElementById('propPosX');
      const inpY = document.getElementById('propPosY');
      const inpW = document.getElementById('propBoxW');
      const inpH = document.getElementById('propBoxH');
      const inpSz = document.getElementById('propFontSize');
      const selField = document.getElementById('studioFieldSelect');
      const textInput = document.getElementById('studioActiveTextInput');

      if (inpX) inpX.value = Math.round(data.x);
      if (inpY) inpY.value = Math.round(data.y);
      if (inpW) inpW.value = Math.round(data.w);
      if (inpH) inpH.value = Math.round(data.h);
      if (inpSz) inpSz.value = Math.round(data.fontSize);
      if (selField) selField.value = fieldId;

      const el = document.getElementById(fieldId);
      if (el && textInput) {
        textInput.value = getFieldRawText(el);
      }

      // Update Layers List Active State
      document.querySelectorAll('.sidebar-layers-list .layer-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-field-id') === fieldId);
      });
    };

    const selectStudioField = (fieldId) => {
      activeFieldId = fieldId;
      const el = document.getElementById(fieldId);
      if (el) {
        document.querySelectorAll('#directiveExactSvg .active-svg-cell').forEach(c => c.classList.remove('active-svg-cell'));
        el.classList.add('active-svg-cell');
      }
      updateTransformBoxUI(fieldId);
    };

    // 3. Populate Layers List in Sidebar
    const renderLayersList = () => {
      const container = document.getElementById('studioLayersList');
      if (!container) return;
      container.innerHTML = '';

      STUDIO_FIELDS.forEach(f => {
        const el = document.getElementById(f.id);
        const rawText = el ? getFieldRawText(el) : '';
        const item = document.createElement('div');
        item.className = `layer-item ${f.id === activeFieldId ? 'active' : ''}`;
        item.setAttribute('data-field-id', f.id);
        item.innerHTML = `
          <div class="layer-info">
            <span class="layer-name">${escapeHTML(f.name)}</span>
            <span class="layer-preview">${escapeHTML(rawText.replace(/\\n/g, ' ↵ ') || '—')}</span>
          </div>
          <span class="layer-badge">${Math.round(getCellCurrentFontSize(el))}px</span>
        `;
        item.onclick = () => selectStudioField(f.id);
        container.appendChild(item);
      });
    };

    // 4. Transform Box Mouse Handlers (Move & 8-Handle Resize in Artboard Coordinates)
    const getArtboardCoords = (e) => {
      const rect = svg.getBoundingClientRect();
      const scaleX = 904 / rect.width;
      const scaleY = 96 / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const dragArea = transformBox.querySelector('.transform-drag-area');
    if (dragArea) {
      dragArea.addEventListener('mousedown', (e) => {
        isMoving = true;
        const cur = getFieldData(activeFieldId);
        const mouse = getArtboardCoords(e);
        dragStart = { x: mouse.x, y: mouse.y };
        initBox = { x: cur.x, y: cur.y, w: cur.w, h: cur.h };
        e.stopPropagation();
        e.preventDefault();
      });
    }

    transformBox.querySelectorAll('.studio-transform-handle').forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        activeHandle = handle.getAttribute('data-handle');
        const cur = getFieldData(activeFieldId);
        const mouse = getArtboardCoords(e);
        dragStart = { x: mouse.x, y: mouse.y };
        initBox = { x: cur.x, y: cur.y, w: cur.w, h: cur.h };
        e.stopPropagation();
        e.preventDefault();
      });
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMoving && !isResizing) return;
      const mouse = getArtboardCoords(e);
      const dx = mouse.x - dragStart.x;
      const dy = mouse.y - dragStart.y;
      const data = getFieldData(activeFieldId);

      if (isMoving) {
        let newX = Math.round(initBox.x + dx);
        let newY = Math.round(initBox.y + dy);
        newX = Math.max(0, Math.min(904 - initBox.w, newX));
        newY = Math.max(0, Math.min(96 - initBox.h, newY));

        data.x = newX;
        data.y = newY;
        state.customBoxPositions[activeFieldId] = { x: newX, y: newY };
        saveStateToStorage();

        // Update SVG text coordinates
        const el = document.getElementById(activeFieldId);
        if (el) {
          const tspans = el.querySelectorAll('tspan');
          if (tspans && tspans.length > 0) {
            const fontSz = getCellCurrentFontSize(el);
            const lh = Math.round(fontSz * 1.15 * 10) / 10;
            const startY = Math.round(newY + fontSz);
            tspans.forEach((t, i) => {
              t.setAttribute('x', Math.round(newX + data.w / 2));
              t.setAttribute('y', Math.round(startY + i * lh));
            });
          } else {
            el.setAttribute('x', Math.round(newX + data.w / 2));
            el.setAttribute('y', Math.round(newY + data.h * 0.75));
          }
        }
        updateTransformBoxUI(activeFieldId);
      } else if (isResizing) {
        let { x, y, w, h } = initBox;

        if (activeHandle.includes('e')) w = Math.max(20, initBox.w + dx);
        if (activeHandle.includes('s')) h = Math.max(12, initBox.h + dy);
        if (activeHandle.includes('w')) {
          const maxDx = initBox.w - 20;
          const appliedDx = Math.min(maxDx, dx);
          x = initBox.x + appliedDx;
          w = initBox.w - appliedDx;
        }
        if (activeHandle.includes('n')) {
          const maxDy = initBox.h - 12;
          const appliedDy = Math.min(maxDy, dy);
          y = initBox.y + appliedDy;
          h = initBox.h - appliedDy;
        }

        data.x = Math.round(x);
        data.y = Math.round(y);
        data.w = Math.round(w);
        data.h = Math.round(h);

        state.customBoxPositions[activeFieldId] = { x: data.x, y: data.y };
        state.customBoxSizes[activeFieldId] = { w: data.w, h: data.h };
        saveStateToStorage();

        updateTransformBoxUI(activeFieldId);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isMoving || isResizing) {
        isMoving = false;
        isResizing = false;
        activeHandle = null;
        renderLayersList();
      }
    });

    // 5. Direct Artboard Click to Select Field
    svg.addEventListener('click', (e) => {
      const indoorTarget = e.target.closest('#lblIndoor, #bgIndoor');
      const outdoorTarget = e.target.closest('#lblOutdoor, #bgOutdoor');
      if (indoorTarget || outdoorTarget) {
        const curState = state.directiveLocation || {
          indoor: document.getElementById('bgIndoor')?.getAttribute('fill') === '#E10600',
          outdoor: document.getElementById('bgOutdoor')?.getAttribute('fill') === '#E10600'
        };
        if (indoorTarget) {
          const nextIndoor = !curState.indoor;
          setDirectiveLocation(nextIndoor, curState.outdoor);
          showToast(`Directive Location: ${nextIndoor ? 'INDOOR' : 'None'}${curState.outdoor ? ' & OUTDOOR' : ''}`);
        } else {
          const nextOutdoor = !curState.outdoor;
          setDirectiveLocation(curState.indoor, nextOutdoor);
          showToast(`Directive Location: ${curState.indoor ? 'INDOOR & ' : ''}${nextOutdoor ? 'OUTDOOR' : 'None'}`);
        }
        return;
      }
      const coords = getArtboardCoords(e);
      if (coords.x >= 340 && coords.x <= 564 && coords.y <= 18) {
        const isIndoorClick = coords.x <= 452;
        const curState = state.directiveLocation || {
          indoor: document.getElementById('bgIndoor')?.getAttribute('fill') === '#E10600',
          outdoor: document.getElementById('bgOutdoor')?.getAttribute('fill') === '#E10600'
        };
        if (isIndoorClick) {
          const nextIndoor = !curState.indoor;
          setDirectiveLocation(nextIndoor, curState.outdoor);
          showToast(`Directive Location: ${nextIndoor ? 'INDOOR' : 'None'}${curState.outdoor ? ' & OUTDOOR' : ''}`);
        } else {
          const nextOutdoor = !curState.outdoor;
          setDirectiveLocation(curState.indoor, nextOutdoor);
          showToast(`Directive Location: ${curState.indoor ? 'INDOOR & ' : ''}${nextOutdoor ? 'OUTDOOR' : 'None'}`);
        }
        return;
      }
      const targetCell = e.target.closest('text.interactive-field') || e.target.closest('.bebas-field');
      if (targetCell && targetCell.id) {
        selectStudioField(targetCell.id);
        return;
      }
      const fieldId = getFieldIdAtSvgCoords(coords.x, coords.y);
      if (fieldId) {
        selectStudioField(fieldId);
      }
    });

    // 6. Right Sidebar Textarea: Multi-line with Enter key support
    const textInput = document.getElementById('studioActiveTextInput');
    if (textInput) {
      textInput.addEventListener('input', () => {
        const el = document.getElementById(activeFieldId);
        if (el) {
          setFieldMultilineText(el, textInput.value);
          syncControlValues(activeFieldId, textInput.value);
          renderLayersList();
          updateTransformBoxUI(activeFieldId);
        }
      });
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.stopPropagation(); // Next line supported naturally!
        }
      });
    }

    // 7. Inspector Toolbar Input Bindings
    const selField = document.getElementById('studioFieldSelect');
    if (selField) {
      selField.addEventListener('change', () => selectStudioField(selField.value));
    }

    const inpSz = document.getElementById('propFontSize');
    const btnSzDec = document.getElementById('propFontDec');
    const btnSzInc = document.getElementById('propFontInc');

    const changeFontSz = (deltaOrVal) => {
      const el = document.getElementById(activeFieldId);
      if (!el) return;
      const cur = getCellCurrentFontSize(el);
      const next = typeof deltaOrVal === 'number' ? Math.max(6, Math.min(72, deltaOrVal)) : Math.max(6, Math.min(72, cur + (deltaOrVal === 'dec' ? -1 : 1)));
      setCellCustomFontSize(el, next);
      if (inpSz) inpSz.value = Math.round(next);
      updateTransformBoxUI(activeFieldId);
      renderLayersList();
    };

    if (btnSzDec) btnSzDec.onclick = () => changeFontSz('dec');
    if (btnSzInc) btnSzInc.onclick = () => changeFontSz('inc');
    if (inpSz) inpSz.onchange = () => changeFontSz(parseFloat(inpSz.value));

    // Position / Dimension Inputs
    const inpX = document.getElementById('propPosX');
    const inpY = document.getElementById('propPosY');
    const inpW = document.getElementById('propBoxW');
    const inpH = document.getElementById('propBoxH');

    const updateManualTransform = () => {
      const data = getFieldData(activeFieldId);
      const newX = inpX ? parseFloat(inpX.value) : data.x;
      const newY = inpY ? parseFloat(inpY.value) : data.y;
      const newW = inpW ? parseFloat(inpW.value) : data.w;
      const newH = inpH ? parseFloat(inpH.value) : data.h;

      data.x = isNaN(newX) ? data.x : Math.max(0, Math.min(904, newX));
      data.y = isNaN(newY) ? data.y : Math.max(0, Math.min(96, newY));
      data.w = isNaN(newW) ? data.w : Math.max(20, Math.min(800, newW));
      data.h = isNaN(newH) ? data.h : Math.max(10, Math.min(300, newH));

      state.customBoxPositions[activeFieldId] = { x: data.x, y: data.y };
      state.customBoxSizes[activeFieldId] = { w: data.w, h: data.h };
      saveStateToStorage();
      updateTransformBoxUI(activeFieldId);
    };

    [inpX, inpY, inpW, inpH].forEach(inp => {
      if (inp) inp.addEventListener('change', updateManualTransform);
    });

    // Swatches
    document.querySelectorAll('.inspector-swatches .swatch-btn').forEach(sw => {
      sw.onclick = () => {
        const color = sw.getAttribute('data-color');
        const el = document.getElementById(activeFieldId);
        if (el) {
          el.setAttribute('fill', color);
          el.style.fill = color;
          showToast(`Set ${activeFieldId} color to ${color}`);
        }
      };
    });

    // 8. Studio Export Actions & Dropdown
    const btnStudioExpDropdown = document.getElementById('btnStudioExportDropdown');
    const studioExpMenu = document.getElementById('studioExportMenu');
    if (btnStudioExpDropdown && studioExpMenu) {
      btnStudioExpDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = studioExpMenu.classList.contains('show');
        document.querySelectorAll('.directive-export-menu.show').forEach(m => m.classList.remove('show'));
        if (!isOpen) {
          studioExpMenu.classList.add('show');
          btnStudioExpDropdown.setAttribute('aria-expanded', 'true');
        } else {
          btnStudioExpDropdown.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const optStudioDownloadEMF = document.getElementById('optStudioDownloadEMF');
    if (optStudioDownloadEMF) {
      optStudioDownloadEMF.addEventListener('click', () => {
        if (studioExpMenu) studioExpMenu.classList.remove('show');
        downloadDirectiveEMF();
      });
    }

    const optStudioCopyPNG = document.getElementById('optStudioCopyPNG');
    if (optStudioCopyPNG) {
      optStudioCopyPNG.addEventListener('click', (e) => {
        if (studioExpMenu) studioExpMenu.classList.remove('show');
        handleCopyImage4K(e);
      });
    }

    const optStudioCopySVG = document.getElementById('optStudioCopySVG');
    if (optStudioCopySVG) {
      optStudioCopySVG.addEventListener('click', (e) => {
        if (studioExpMenu) studioExpMenu.classList.remove('show');
        handleCopyVector(e);
      });
    }

    const optStudioDownloadSVG = document.getElementById('optStudioDownloadSVG');
    if (optStudioDownloadSVG) {
      optStudioDownloadSVG.addEventListener('click', () => {
        if (studioExpMenu) studioExpMenu.classList.remove('show');
        const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                    (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
        const svgString = generateDirectiveSVG(cur);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sign_Depot_Directive_${cur.joNumber || 'Job'}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Vector SVG downloaded! Drag & drop the file into CorelDRAW or press Ctrl+I.');
      });
    }

    const copySvgBtn = document.getElementById('studioCopySVG');
    if (copySvgBtn) {
      copySvgBtn.onclick = () => {
        const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                    (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
        const svgCode = generateDirectiveSVG(cur);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(svgCode).then(() => showToast('Vector SVG copied for Illustrator / CorelDRAW!'));
        } else {
          copyFallback(svgCode);
          showToast('Vector SVG copied to clipboard!');
        }
      };
    }

    const copyPngBtn = document.getElementById('studioCopyPNG');
    if (copyPngBtn) {
      copyPngBtn.onclick = () => {
        const cur = (typeof getDirectiveRecord === 'function' ? getDirectiveRecord(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY) : null) ||
                    (state.requests ? (state.requests.find(r => r.joNumber === state.currentDirectiveJo || r.requestId === state.currentDirectiveJo || r.id == state.currentDirectiveJo) || state.requests[0]) : {});
        const svgString = generateDirectiveSVG(cur);
        const scale = 4;
        const targetWidth = 904 * scale;
        const targetHeight = 96 * scale;
        const svg4K = svgString.replace(/width="[0-9]+"/, `width="${targetWidth}"`).replace(/height="[0-9]+"/, `height="${targetHeight}"`);

        const img = new Image();
        const svgBlob = new Blob([svg4K], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (blob && navigator.clipboard && window.ClipboardItem) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                .then(() => showToast('Ultra HD 4K image copied to clipboard (Ctrl+V ready)!'))
                .catch(() => showToast('4K image render completed.'));
            }
          }, 'image/png');
        };
        img.src = url;
      };
    }

    const resetAllBtn = document.getElementById('studioResetAll');
    if (resetAllBtn) {
      resetAllBtn.onclick = () => {
        state.customBoxPositions = {};
        state.customBoxSizes = {};
        state.customCellFonts = {};
        if (typeof setDirectiveZoom === 'function') setDirectiveZoom(100);
        if (typeof setDirectiveEnvType === 'function') setDirectiveEnvType('');
        saveStateToStorage();
        STUDIO_FIELDS.forEach(f => {
          const el = document.getElementById(f.id);
          if (el) {
            el.removeAttribute('data-custom-size');
            el.style.removeProperty('font-size');
            el.setAttribute('font-size', f.defSz);
            setFieldMultilineText(el, getFieldRawText(el));
          }
        });
        selectStudioField(activeFieldId);
        renderLayersList();
        showToast('All text positions and sizes reset to defaults.');
      };
    }

    // Initial Setup
    renderLayersList();
    selectStudioField('docFieldProjectName');
    applyZoom(1.25);
  }


  // Expose Directives Public API
  App.renderDirectivePreview = renderDirectivePreview;
  App.getDirectiveRecord = getDirectiveRecord;
  App.generateDirectiveSVG = generateDirectiveSVG;
  App.openEnvOptionMenu = openEnvOptionMenu;
  App.setDirectiveEnvType = setDirectiveEnvType;
  App.initVectorStudioEditor = (typeof initStudioVectorEditor === 'function') ? initStudioVectorEditor : null;
  App.previewAttachment = (typeof previewAttachment === 'function') ? previewAttachment : null;
  App.deleteAttachment = (typeof deleteAttachment === 'function') ? deleteAttachment : null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('view-directives-details') || document.getElementById('directiveDocSheet')) {
        renderDirectivePreview();
      }
    });
  } else {
    if (document.getElementById('view-directives-details') || document.getElementById('directiveDocSheet')) {
      renderDirectivePreview();
    }
  }
})(window);
