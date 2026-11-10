/**
 * Sign Depot Operations PMS — Print Request Module
 * File: assets/js/pages/print-request.js
 */

(function (window) {
  'use strict';

  const App = window.SignDepotApp;
  const state = (App && App.state) ? App.state : { requests: [] };
  const showToast = (App && App.utils && App.utils.showToast) ? App.utils.showToast : (msg) => alert(msg);

  let activeSvgCell = null;
  let currentZoom = 100;
  let originalData = Object.assign({}, window.__CURRENT_REQUEST_DATA || {});

  // ==========================================================================
  // FIELD MAPPINGS FOR SVG & FORM CONTROLS
  // ==========================================================================
  const FIELD_CONFIG = [
    { key: 'requestId', svgId: 'svgFieldRequestId', ctrlId: 'ctrlReqId', label: 'Request ID', defaultSz: 14.5 },
    { key: 'salesRep',  svgId: 'svgFieldSales',     ctrlId: 'ctrlReqSales', label: 'Requested by', defaultSz: 14.5 },
    { key: 'client',    svgId: 'svgFieldClient',    ctrlId: 'ctrlReqClient', label: 'Client', defaultSz: 14.5 },
    { key: 'project',   svgId: 'svgFieldProject',   ctrlId: 'ctrlReqProject', label: 'Project Name', defaultSz: 14.5 },
    { key: 'joNumber',  svgId: 'svgFieldJo',        ctrlId: 'ctrlReqJo', label: 'JO Number', defaultSz: 14.5 },
    { key: 'artist',    svgId: 'svgFieldArtist',    ctrlId: 'ctrlReqArtist', label: 'Artist', defaultSz: 14.5 },
    { key: 'dateReq',   svgId: 'svgFieldDateReq',   ctrlId: 'ctrlReqDate', label: 'Date Requested', defaultSz: 14.5 },
    { key: 'deadline',  svgId: 'svgFieldDeadline',  ctrlId: 'ctrlReqDeadline', label: 'Deadline', defaultSz: 14.5 },
    { key: 'releasing', svgId: 'svgFieldReleasing', ctrlId: 'ctrlReqReleasing', label: 'Releasing Date', defaultSz: 14.5 },
    { key: 'reference', svgId: 'svgFieldReference', ctrlId: 'ctrlReqRef', label: 'Reference', defaultSz: 14.5 }
  ];

  // Helper to safely format dates
  function formatDate(dStr) {
    if (!dStr || dStr === '0000-00-00' || dStr === '—' || dStr === '-') return '';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    } catch (e) {
      return dStr;
    }
  }

  // ==========================================================================
  // DATA APPLICATION & RENDERING
  // ==========================================================================
  function applyRequestToCard(req) {
    if (!req) return;

    const reqId = req.request_id || req.requestId || (req.id ? `LR-26-${req.id}` : 'LR-26-0000');
    const sales = req.sales_rep || req.salesRep || '';
    const client = req.client || '';
    const proj = req.project_name || req.projectName || '';
    const jo = req.jo_number || req.joNumber || '';
    const artist = req.artist || '';
    const dateReq = formatDate(req.order_date || req.orderDate || req.created_at || req.timestamp || '');
    const deadline = formatDate(req.design_deadline || req.designDeadline || '');
    const releasing = formatDate(req.releasing_date || req.releasingDate || '');
    const ref = req.remarks || req.complete_address || req.location || req.drive_link || '';

    // Update active badge in toolbar
    const badge = document.getElementById('docActiveReqBadge');
    if (badge) badge.textContent = reqId;

    // Update SVG Text Elements
    setSvgFieldText('svgFieldRequestId', reqId);
    setSvgFieldText('svgFieldSales', sales);
    setSvgFieldText('svgFieldClient', client);
    setSvgFieldText('svgFieldProject', proj);
    setSvgFieldText('svgFieldJo', jo);
    setSvgFieldText('svgFieldArtist', artist);
    setSvgFieldText('svgFieldDateReq', dateReq);
    setSvgFieldText('svgFieldDeadline', deadline);
    setSvgFieldText('svgFieldReleasing', releasing);
    setSvgFieldText('svgFieldReference', ref);

    // Update Form Controls
    setControlVal('ctrlReqId', reqId);
    setControlVal('ctrlReqSales', sales);
    setControlVal('ctrlReqClient', client);
    setControlVal('ctrlReqProject', proj);
    setControlVal('ctrlReqJo', jo);
    setControlVal('ctrlReqArtist', artist);
    setControlVal('ctrlReqDate', dateReq);
    setControlVal('ctrlReqDeadline', deadline);
    setControlVal('ctrlReqReleasing', releasing);
    setControlVal('ctrlReqRef', ref);

    originalData = {
      requestId: reqId,
      salesRep: sales,
      client: client,
      projectName: proj,
      joNumber: jo,
      artist: artist,
      orderDate: dateReq,
      designDeadline: deadline,
      releasingDate: releasing,
      remarks: ref
    };
  }

  function setSvgFieldText(id, val) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = val || '';
      el.setAttribute('data-raw-text', val || '');
    }
  }

  function setControlVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  // ==========================================================================
  // SEARCH LOOKUP & AUTOCOMPLETE
  // ==========================================================================
  function setupLookup() {
    const input = document.getElementById('requestLookupInput');
    const autoBox = document.getElementById('requestAutocompleteBox');
    const btnSearch = document.getElementById('btnRequestSearch');
    const btnClear = document.getElementById('btnRequestClear');
    const statusSpan = document.getElementById('requestLookupStatus');

    if (!input) return;

    function findRecord(query) {
      if (!query) return null;
      const clean = query.trim().toLowerCase();
      const list = (state && Array.isArray(state.requests)) ? state.requests : [];

      return list.find(r => {
        const reqId = (r.requestId || r.request_id || '').toLowerCase();
        const jo = (r.joNumber || r.jo_number || '').toLowerCase();
        const client = (r.client || '').toLowerCase();
        const proj = (r.projectName || r.project_name || '').toLowerCase();
        const id = String(r.id || '').toLowerCase();

        return reqId === clean || jo === clean || id === clean ||
               reqId.includes(clean) || jo.includes(clean) ||
               client.includes(clean) || proj.includes(clean);
      });
    }

    function doSearch() {
      const q = input.value.trim();
      if (!q) {
        if (statusSpan) {
          statusSpan.textContent = 'Please enter a Request ID or JO Number';
          statusSpan.style.color = '#EF4444';
        }
        return;
      }

      if (statusSpan) {
        statusSpan.textContent = 'Searching...';
        statusSpan.style.color = '#64748B';
      }

      // Check client-side state first
      const record = findRecord(q);
      if (record) {
        applyRequestToCard(record);
        if (autoBox) autoBox.style.display = 'none';
        if (statusSpan) {
          statusSpan.textContent = 'Loaded successfully';
          statusSpan.style.color = '#16A34A';
          setTimeout(() => { statusSpan.textContent = ''; }, 3000);
        }
        updateUrl(record.requestId || record.request_id || record.joNumber || record.jo_number);
        return;
      }

      // Query server via api.php
      const apiUrl = (window.PMS_API_URL || '../api.php') + `?action=get_request&id=${encodeURIComponent(q)}`;
      fetch(apiUrl)
        .then(res => res.json())
        .then(res => {
          if (res && res.success && res.data) {
            applyRequestToCard(res.data);
            if (autoBox) autoBox.style.display = 'none';
            if (statusSpan) {
              statusSpan.textContent = 'Loaded from server';
              statusSpan.style.color = '#16A34A';
              setTimeout(() => { statusSpan.textContent = ''; }, 3000);
            }
            updateUrl(res.data.request_id || res.data.jo_number);
          } else {
            if (statusSpan) {
              statusSpan.textContent = 'No matching request found';
              statusSpan.style.color = '#EF4444';
            }
          }
        })
        .catch(err => {
          if (statusSpan) {
            statusSpan.textContent = 'Search failed';
            statusSpan.style.color = '#EF4444';
          }
        });
    }

    if (btnSearch) btnSearch.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        input.value = '';
        if (autoBox) autoBox.style.display = 'none';
        if (statusSpan) statusSpan.textContent = '';
      });
    }

    // Autocomplete Suggestions
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!autoBox) return;

      if (!q || q.length < 2) {
        autoBox.style.display = 'none';
        autoBox.innerHTML = '';
        return;
      }

      const list = (state && Array.isArray(state.requests)) ? state.requests : [];
      const matches = list.filter(r => {
        const reqId = (r.requestId || r.request_id || '').toLowerCase();
        const jo = (r.joNumber || r.jo_number || '').toLowerCase();
        const client = (r.client || '').toLowerCase();
        const proj = (r.projectName || r.project_name || '').toLowerCase();
        return reqId.includes(q) || jo.includes(q) || client.includes(q) || proj.includes(q);
      }).slice(0, 8);

      if (matches.length === 0) {
        autoBox.style.display = 'none';
        autoBox.innerHTML = '';
        return;
      }

      autoBox.innerHTML = matches.map(m => {
        const id = m.requestId || m.request_id || 'REQ';
        const jo = m.joNumber || m.jo_number || '';
        const client = m.client || '';
        const proj = m.projectName || m.project_name || '';
        return `
          <div class="autocomplete-item" data-id="${id}" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #F1F5F9; font-size: 13px;">
            <div style="font-weight: 700; color: #0F172A;">${id} ${jo ? `<span style="color:#64748B; font-weight:500;">· JO: ${jo}</span>` : ''}</div>
            <div style="color: #475569; font-size: 12px;">${client} — ${proj}</div>
          </div>
        `;
      }).join('');

      autoBox.style.display = 'block';

      autoBox.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetId = item.getAttribute('data-id');
          input.value = targetId;
          autoBox.style.display = 'none';
          doSearch();
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (autoBox && !autoBox.contains(e.target) && e.target !== input) {
        autoBox.style.display = 'none';
      }
    });
  }

  function updateUrl(id) {
    if (!id || !window.history || !window.history.pushState) return;
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  }

  // ==========================================================================
  // REAL-TIME FONT CONTROLS
  // ==========================================================================
  function setupFontControls() {
    const badge = document.getElementById('fontCtrlCellBadge');
    const input = document.getElementById('cellReqFontSizeInput');
    const btnInc = document.getElementById('btnReqFontInc');
    const btnDec = document.getElementById('btnReqFontDec');
    const btnReset = document.getElementById('btnReqFontReset');

    function selectCell(cell) {
      if (activeSvgCell) {
        activeSvgCell.classList.remove('active-svg-cell');
      }
      activeSvgCell = cell;
      if (!activeSvgCell) {
        if (badge) badge.textContent = 'Select Field';
        return;
      }
      activeSvgCell.classList.add('active-svg-cell');

      const name = activeSvgCell.getAttribute('data-field-name') || 'Field';
      const curSz = getCurrentFontSize(activeSvgCell);

      if (badge) badge.textContent = `${name}: ${curSz}px`;
      if (input) input.value = curSz;
    }

    function getCurrentFontSize(el) {
      if (!el) return 14;
      const custom = el.getAttribute('data-custom-size');
      if (custom) return parseFloat(custom);
      const attr = el.getAttribute('font-size');
      if (attr) return parseFloat(attr);
      const computed = window.getComputedStyle(el).fontSize;
      return parseFloat(computed) || 14;
    }

    function setFontSize(size) {
      if (!activeSvgCell) {
        showToast('Please click on a table field to adjust its font size', 'info');
        return;
      }
      const clamped = Math.max(6, Math.min(48, Math.round(size * 10) / 10));
      activeSvgCell.setAttribute('font-size', clamped);
      activeSvgCell.style.fontSize = `${clamped}px`;
      activeSvgCell.setAttribute('data-custom-size', clamped);

      const name = activeSvgCell.getAttribute('data-field-name') || 'Field';
      if (badge) badge.textContent = `${name}: ${clamped}px`;
      if (input) input.value = clamped;
    }

    if (btnInc) {
      btnInc.addEventListener('click', () => {
        if (!activeSvgCell) selectCell(document.getElementById('svgFieldRequestId'));
        setFontSize(getCurrentFontSize(activeSvgCell) + 1);
      });
    }

    if (btnDec) {
      btnDec.addEventListener('click', () => {
        if (!activeSvgCell) selectCell(document.getElementById('svgFieldRequestId'));
        setFontSize(getCurrentFontSize(activeSvgCell) - 1);
      });
    }

    if (input) {
      input.addEventListener('change', () => {
        setFontSize(parseFloat(input.value) || 14);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (!activeSvgCell) return;
        const cfg = FIELD_CONFIG.find(f => f.svgId === activeSvgCell.id);
        const defSz = cfg ? cfg.defaultSz : 14.5;
        activeSvgCell.removeAttribute('font-size');
        activeSvgCell.removeAttribute('data-custom-size');
        activeSvgCell.style.fontSize = '';
        selectCell(activeSvgCell);
        showToast('Font size reset');
      });
    }

    // Attach click and dblclick listeners to all interactive SVG cells
    const svgEl = document.getElementById('printRequestSvg');
    if (svgEl) {
      svgEl.addEventListener('click', (e) => {
        const textNode = e.target.closest('text.interactive-field');
        if (textNode) {
          selectCell(textNode);
        }
      });

      svgEl.addEventListener('dblclick', (e) => {
        const textNode = e.target.closest('text.interactive-field');
        if (!textNode) return;
        const fieldName = textNode.getAttribute('data-field-name') || 'Value';
        const currentVal = textNode.textContent.trim();
        const newVal = prompt(`Edit ${fieldName}:`, currentVal);
        if (newVal !== null) {
          textNode.textContent = newVal.trim();
          // Sync with corresponding form control
          const cfg = FIELD_CONFIG.find(f => f.svgId === textNode.id);
          if (cfg) {
            const ctrl = document.getElementById(cfg.ctrlId);
            if (ctrl) ctrl.value = newVal.trim();
          }
        }
      });
    }
  }

  // ==========================================================================
  // REAL-TIME ZOOM CONTROLS
  // ==========================================================================
  function setupZoomControls() {
    const container = document.getElementById('reqZoomContainer');
    const zoomText = document.getElementById('reqZoomLevelText');
    const btnIn = document.getElementById('btnReqZoomIn');
    const btnOut = document.getElementById('btnReqZoomOut');
    const btnReset = document.getElementById('btnReqZoomReset');
    const btnFit = document.getElementById('btnReqZoomFit');

    function applyZoom(z) {
      currentZoom = Math.max(40, Math.min(250, z));
      if (container) {
        container.style.transform = `scale(${currentZoom / 100})`;
      }
      if (zoomText) {
        zoomText.textContent = `${currentZoom}%`;
      }
    }

    if (btnIn) {
      btnIn.addEventListener('click', () => applyZoom(currentZoom + 10));
    }
    if (btnOut) {
      btnOut.addEventListener('click', () => applyZoom(currentZoom - 10));
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => applyZoom(100));
    }
    if (zoomText) {
      zoomText.addEventListener('click', () => applyZoom(100));
    }
    if (btnFit) {
      btnFit.addEventListener('click', () => {
        const wrap = document.querySelector('.print-req-card-wrap');
        const sheet = document.getElementById('printableRequestDocument');
        if (wrap && sheet) {
          const wrapWidth = wrap.clientWidth - 48;
          const targetWidth = 560;
          const fitRatio = Math.min(1.5, Math.max(0.5, wrapWidth / targetWidth));
          applyZoom(Math.round(fitRatio * 100));
        }
      });
    }
  }

  // ==========================================================================
  // TWO-WAY LIVE FORM SYNCHRONIZATION
  // ==========================================================================
  function setupLiveFormSync() {
    FIELD_CONFIG.forEach(cfg => {
      const ctrl = document.getElementById(cfg.ctrlId);
      const svgText = document.getElementById(cfg.svgId);
      if (ctrl && svgText) {
        ctrl.addEventListener('input', () => {
          svgText.textContent = ctrl.value;
          if (cfg.key === 'requestId') {
            const badge = document.getElementById('docActiveReqBadge');
            if (badge) badge.textContent = ctrl.value || 'Ready';
          }
        });
      }
    });

    // Reset button
    const btnReset = document.getElementById('btnReqReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        applyRequestToCard(originalData);
        showToast('Card restored to original values');
      });
    }
  }

  // ==========================================================================
  // EXPORT & PRINT HANDLERS
  // ==========================================================================
  function setupExportHandlers() {
    const btnDropdown = document.getElementById('btnReqExportDropdown');
    const menu = document.getElementById('reqExportMenu');
    const btnPrint = document.getElementById('btnReqPrintDoc');

    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnDropdown && menu) {
      btnDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('show');
        menu.classList.toggle('show', !isOpen);
        btnDropdown.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.directive-dropdown-container')) {
          menu.classList.remove('show');
          btnDropdown.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function getSvgMarkup() {
      const svg = document.getElementById('printRequestSvg');
      if (!svg) return '';
      const clone = svg.cloneNode(true);
      // Remove any temporary active outline classes
      clone.querySelectorAll('.active-svg-cell').forEach(el => el.classList.remove('active-svg-cell'));
      return new XMLSerializer().serializeToString(clone);
    }

    // 1. Copy Vector SVG
    const optCopySvg = document.getElementById('optReqCopySVG');
    if (optCopySvg) {
      optCopySvg.addEventListener('click', () => {
        if (menu) menu.classList.remove('show');
        const markup = getSvgMarkup();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(markup)
            .then(() => showToast('Vector SVG copied to clipboard! Ready to paste into Illustrator or Figma.'))
            .catch(() => fallbackCopy(markup));
        } else {
          fallbackCopy(markup);
        }
      });
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Vector SVG copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
      }
      document.body.removeChild(ta);
    }

    // 2. Download Vector SVG
    const optDlSvg = document.getElementById('optReqDownloadSVG');
    if (optDlSvg) {
      optDlSvg.addEventListener('click', () => {
        if (menu) menu.classList.remove('show');
        const markup = getSvgMarkup();
        const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const reqId = (document.getElementById('ctrlReqId') ? document.getElementById('ctrlReqId').value : 'Request').replace(/[^a-zA-Z0-9_-]/g, '_');
        a.href = url;
        a.download = `Sign_Depot_Request_${reqId}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Vector SVG file downloaded!');
      });
    }

    // 3. High-Res Image Render (for Copy 4K & Download PNG)
    function renderHighResCanvas(scale, callback) {
      const markup = getSvgMarkup();
      const svgBlob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 560 * scale;
        canvas.height = 352 * scale;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        callback(canvas);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        showToast('Failed to render graphic preview', 'error');
      };

      img.src = url;
    }

    // Copy Image 4K
    const optCopyPNG = document.getElementById('optReqCopyPNG');
    if (optCopyPNG) {
      optCopyPNG.addEventListener('click', () => {
        if (menu) menu.classList.remove('show');
        showToast('Rendering high-resolution graphic...', 'info');

        renderHighResCanvas(4, (canvas) => {
          canvas.toBlob((blob) => {
            if (!blob) return;
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item])
                .then(() => showToast('Ultra-sharp 4K image copied to clipboard! Paste directly (Ctrl+V) into CorelDRAW or Photoshop.'))
                .catch(() => {
                  downloadCanvas(canvas);
                });
            } else {
              downloadCanvas(canvas);
            }
          }, 'image/png', 1.0);
        });
      });
    }

    // Download PNG
    const optDlPNG = document.getElementById('optReqDownloadPNG');
    if (optDlPNG) {
      optDlPNG.addEventListener('click', () => {
        if (menu) menu.classList.remove('show');
        renderHighResCanvas(3, (canvas) => {
          downloadCanvas(canvas);
        });
      });
    }

    function downloadCanvas(canvas) {
      const a = document.createElement('a');
      const reqId = (document.getElementById('ctrlReqId') ? document.getElementById('ctrlReqId').value : 'Request').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.href = canvas.toDataURL('image/png');
      a.download = `Sign_Depot_Request_${reqId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('PNG image downloaded!');
    }
  }

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  function initPrintRequest() {
    setupLookup();
    setupFontControls();
    setupZoomControls();
    setupLiveFormSync();
    setupExportHandlers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrintRequest);
  } else {
    initPrintRequest();
  }

})(window);

