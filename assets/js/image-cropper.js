/**
 * Sign Depot Operations PMS — Interactive Image Cropper Component
 * Provides smooth drag, zoom, rotate, flip, and high-resolution crop export for avatars & proofs.
 */

(function (window, document) {
  'use strict';

  let currentOptions = null;
  let sourceImage = null;
  let imageWidth = 0;
  let imageHeight = 0;

  // Cropper State
  let panX = 0;
  let panY = 0;
  let zoomFactor = 1.0;
  let minZoom = 1.0;
  let rotation = 0; // 0, 90, 180, 270
  let flipH = 1; // 1 or -1
  let isCircular = true;
  let cropBoxSize = 280;

  // Drag interaction state
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialPinchDistance = 0;
  let initialPinchZoom = 1.0;

  // DOM elements cache
  let modalEl = null;
  let canvasEl = null;
  let previewCanvasEl = null;
  let zoomSliderEl = null;
  let zoomLabelEl = null;
  let btnCropSave = null;
  let btnCancel = null;
  let btnClose = null;
  let btnRotateLeft = null;
  let btnRotateRight = null;
  let btnFlip = null;
  let btnReset = null;
  let btnShapeCircle = null;
  let btnShapeSquare = null;
  let btnSkip = null;

  function injectModalHTML() {
    if (document.getElementById('sdImageCropperModal')) return;

    const modalHTML = `
      <div class="sd-cropper-backdrop" id="sdImageCropperModal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="sdCropperTitle">
        <div class="sd-cropper-card">
          <div class="sd-cropper-header">
            <div>
              <h3 class="sd-cropper-title" id="sdCropperTitle">Crop & Adjust Picture</h3>
              <p class="sd-cropper-subtitle">Drag image to position • Scroll or slider to zoom • Rotate if needed</p>
            </div>
            <button type="button" class="sd-cropper-close" id="sdCropperClose" title="Cancel & Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="sd-cropper-body">
            <!-- Left: Interactive Canvas Viewport -->
            <div class="sd-cropper-viewport-wrap">
              <canvas id="sdCropperCanvas" width="360" height="360"></canvas>
              <div class="sd-cropper-viewport-hint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"></path><path d="M2 12h20M12 2v20"></path></svg>
                <span>Drag to pan & reposition</span>
              </div>
            </div>

            <!-- Right: Controls & Live Preview -->
            <div class="sd-cropper-controls">
              <!-- Live Preview Widget -->
              <div class="sd-cropper-preview-box">
                <div class="sd-cropper-preview-avatar" id="sdCropperPreviewWrap">
                  <canvas id="sdCropperPreviewCanvas" width="80" height="80"></canvas>
                </div>
                <div class="sd-cropper-preview-info">
                  <span class="sd-cropper-preview-title">Live Preview</span>
                  <span class="sd-cropper-preview-desc">Exactly as shown on your profile</span>
                </div>
              </div>

              <!-- Shape selector (Circle Avatar vs Square) -->
              <div class="sd-cropper-ctrl-group" id="sdCropperShapeGroup">
                <label class="sd-cropper-ctrl-label">Crop Frame Shape</label>
                <div class="sd-cropper-btn-toggle">
                  <button type="button" class="sd-toggle-btn active" id="sdCropperShapeCircle" title="Circular Avatar Frame">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
                    <span>Circle</span>
                  </button>
                  <button type="button" class="sd-toggle-btn" id="sdCropperShapeSquare" title="Square Frame">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                    <span>Square</span>
                  </button>
                </div>
              </div>

              <!-- Zoom Slider & Buttons -->
              <div class="sd-cropper-ctrl-group">
                <div class="sd-cropper-ctrl-header">
                  <label class="sd-cropper-ctrl-label">Zoom Level</label>
                  <span class="sd-cropper-zoom-val" id="sdCropperZoomVal">100%</span>
                </div>
                <div class="sd-cropper-slider-row">
                  <button type="button" class="sd-icon-btn" id="sdCropperZoomOut" title="Zoom Out (-)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <input type="range" id="sdCropperZoomSlider" min="100" max="350" value="100" step="1" class="sd-cropper-range">
                  <button type="button" class="sd-icon-btn" id="sdCropperZoomIn" title="Zoom In (+)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>

              <!-- Rotate & Tool Action Buttons -->
              <div class="sd-cropper-ctrl-group">
                <label class="sd-cropper-ctrl-label">Transform & Orientation</label>
                <div class="sd-cropper-tool-buttons">
                  <button type="button" class="sd-tool-btn" id="sdCropperRotateLeft" title="Rotate Counter-Clockwise 90°">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                    <span>Left 90°</span>
                  </button>
                  <button type="button" class="sd-tool-btn" id="sdCropperRotateRight" title="Rotate Clockwise 90°">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><polyline points="21 3 21 8 16 8"></polyline></svg>
                    <span>Right 90°</span>
                  </button>
                  <button type="button" class="sd-tool-btn" id="sdCropperFlip" title="Flip Horizontally">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                    <span>Flip</span>
                  </button>
                  <button type="button" class="sd-tool-btn" id="sdCropperReset" title="Reset Position & Fit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
                    <span>Center</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="sd-cropper-footer">
            <div class="sd-cropper-footer-left">
              <button type="button" class="btn btn-secondary btn-sm" id="sdCropperSkip" style="display:none;">
                Use Original (Skip Crop)
              </button>
            </div>
            <div class="sd-cropper-footer-right">
              <button type="button" class="btn btn-secondary btn-sm" id="sdCropperCancel">Cancel</button>
              <button type="button" class="btn btn-primary btn-sm" id="sdCropperSave" style="background:#DC2626; border-color:#DC2626; color:#FFF; font-weight:700;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span id="sdCropperSaveText">Crop & Save Picture</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);

    injectStyles();
    cacheDOMElements();
    bindEvents();
  }

  function injectStyles() {
    if (document.getElementById('sdCropperStyles')) return;

    const styles = `
      .sd-cropper-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(10, 13, 20, 0.78);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 16px;
        box-sizing: border-box;
      }
      .sd-cropper-card {
        background: #11141B;
        color: #F8FAFC;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(220, 38, 38, 0.25);
        max-width: 680px;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: sdCropperFadeIn 0.22s ease-out;
      }
      @keyframes sdCropperFadeIn {
        from { opacity: 0; transform: scale(0.96) translateY(-8px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .sd-cropper-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 18px 22px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: #151922;
      }
      .sd-cropper-title {
        font-size: 17px;
        font-weight: 800;
        color: #FFFFFF;
        margin: 0 0 4px 0;
        letter-spacing: -0.2px;
      }
      .sd-cropper-subtitle {
        font-size: 12px;
        color: #94A3B8;
        margin: 0;
      }
      .sd-cropper-close {
        background: none;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s, background 0.15s;
      }
      .sd-cropper-close:hover {
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.1);
      }
      .sd-cropper-body {
        display: flex;
        padding: 22px;
        gap: 22px;
        align-items: stretch;
      }
      @media (max-width: 640px) {
        .sd-cropper-body {
          flex-direction: column;
          padding: 16px;
          gap: 16px;
        }
      }
      .sd-cropper-viewport-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        background: #080A0E;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 10px;
        box-sizing: border-box;
      }
      #sdCropperCanvas {
        display: block;
        border-radius: 8px;
        cursor: grab;
        touch-action: none;
        user-select: none;
        max-width: 100%;
        height: auto;
      }
      #sdCropperCanvas.grabbing {
        cursor: grabbing !important;
      }
      .sd-cropper-viewport-hint {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #64748B;
        margin-top: 8px;
      }
      .sd-cropper-controls {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-width: 200px;
      }
      .sd-cropper-preview-box {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        background: #181C26;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
      }
      .sd-cropper-preview-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        background: #000000;
        border: 2px solid #DC2626;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sd-cropper-preview-avatar.is-square {
        border-radius: 8px;
      }
      #sdCropperPreviewCanvas {
        width: 100%;
        height: 100%;
        display: block;
      }
      .sd-cropper-preview-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .sd-cropper-preview-title {
        font-size: 12px;
        font-weight: 700;
        color: #F8FAFC;
      }
      .sd-cropper-preview-desc {
        font-size: 11px;
        color: #94A3B8;
        line-height: 1.3;
      }
      .sd-cropper-ctrl-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .sd-cropper-ctrl-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .sd-cropper-ctrl-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #94A3B8;
      }
      .sd-cropper-zoom-val {
        font-size: 11px;
        font-weight: 700;
        color: #DC2626;
      }
      .sd-cropper-slider-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sd-icon-btn {
        background: #1C202C;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #E2E8F0;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s;
        flex-shrink: 0;
      }
      .sd-icon-btn:hover {
        background: #252B3B;
        color: #FFFFFF;
        border-color: #DC2626;
      }
      .sd-cropper-range {
        flex: 1;
        accent-color: #DC2626;
        cursor: pointer;
        height: 5px;
        border-radius: 3px;
      }
      .sd-cropper-tool-buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }
      .sd-tool-btn {
        background: #181C26;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #CBD5E1;
        padding: 6px 4px;
        border-radius: 6px;
        font-size: 10.5px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .sd-tool-btn:hover {
        background: #202634;
        color: #FFFFFF;
        border-color: rgba(220, 38, 38, 0.5);
      }
      .sd-cropper-btn-toggle {
        display: flex;
        gap: 6px;
      }
      .sd-toggle-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 6px;
        background: #181C26;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #94A3B8;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
      }
      .sd-toggle-btn.active {
        background: rgba(220, 38, 38, 0.15);
        color: #FFFFFF;
        border-color: #DC2626;
      }
      .sd-cropper-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 22px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: #151922;
        gap: 12px;
      }
      .sd-cropper-footer-right {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'sdCropperStyles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  function cacheDOMElements() {
    modalEl = document.getElementById('sdImageCropperModal');
    canvasEl = document.getElementById('sdCropperCanvas');
    previewCanvasEl = document.getElementById('sdCropperPreviewCanvas');
    zoomSliderEl = document.getElementById('sdCropperZoomSlider');
    zoomLabelEl = document.getElementById('sdCropperZoomVal');
    btnCropSave = document.getElementById('sdCropperSave');
    btnCancel = document.getElementById('sdCropperCancel');
    btnClose = document.getElementById('sdCropperClose');
    btnRotateLeft = document.getElementById('sdCropperRotateLeft');
    btnRotateRight = document.getElementById('sdCropperRotateRight');
    btnFlip = document.getElementById('sdCropperFlip');
    btnReset = document.getElementById('sdCropperReset');
    btnShapeCircle = document.getElementById('sdCropperShapeCircle');
    btnShapeSquare = document.getElementById('sdCropperShapeSquare');
    btnSkip = document.getElementById('sdCropperSkip');
  }

  function bindEvents() {
    if (!canvasEl) return;

    // Pointer / Mouse events for dragging
    canvasEl.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      canvasEl.classList.add('grabbing');
      canvasEl.setPointerCapture(e.pointerId);
    });

    canvasEl.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      render();
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      canvasEl.classList.remove('grabbing');
      try {
        canvasEl.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    canvasEl.addEventListener('pointerup', stopDrag);
    canvasEl.addEventListener('pointercancel', stopDrag);

    // Mouse wheel zooming
    canvasEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(zoomFactor + delta);
    }, { passive: false });

    // Touch pinch-to-zoom
    canvasEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchZoom = zoomFactor;
      }
    });

    canvasEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDistance > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = dist / initialPinchDistance;
        setZoom(initialPinchZoom * scale);
      }
    }, { passive: false });

    // Zoom slider
    zoomSliderEl.addEventListener('input', () => {
      const val = parseFloat(zoomSliderEl.value) / 100;
      setZoom(val);
    });

    document.getElementById('sdCropperZoomIn').addEventListener('click', () => {
      setZoom(zoomFactor + 0.15);
    });

    document.getElementById('sdCropperZoomOut').addEventListener('click', () => {
      setZoom(zoomFactor - 0.15);
    });

    // Rotation & Tool buttons
    btnRotateLeft.addEventListener('click', () => {
      rotation = (rotation - 90 + 360) % 360;
      recalculateBaseScale();
      render();
    });

    btnRotateRight.addEventListener('click', () => {
      rotation = (rotation + 90) % 360;
      recalculateBaseScale();
      render();
    });

    btnFlip.addEventListener('click', () => {
      flipH *= -1;
      render();
    });

    btnReset.addEventListener('click', () => {
      resetTransform();
    });

    // Shape toggle
    btnShapeCircle.addEventListener('click', () => {
      setShape(true);
    });

    btnShapeSquare.addEventListener('click', () => {
      setShape(false);
    });

    // Close / Cancel / Save buttons
    btnClose.addEventListener('click', cancelCropper);
    btnCancel.addEventListener('click', cancelCropper);

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        closeModal();
        if (currentOptions && typeof currentOptions.onSkip === 'function') {
          currentOptions.onSkip();
        }
      });
    }

    btnCropSave.addEventListener('click', handleSaveCrop);

    // Keyboard support: Escape cancels, Enter crops
    window.addEventListener('keydown', (e) => {
      if (!modalEl || modalEl.style.display === 'none') return;
      if (e.key === 'Escape') {
        cancelCropper();
      } else if (e.key === 'Enter' && !btnCropSave.disabled) {
        handleSaveCrop();
      }
    });
  }

  function setShape(circular) {
    isCircular = circular;
    if (circular) {
      btnShapeCircle.classList.add('active');
      btnShapeSquare.classList.remove('active');
      document.getElementById('sdCropperPreviewWrap').classList.remove('is-square');
    } else {
      btnShapeSquare.classList.add('active');
      btnShapeCircle.classList.remove('active');
      document.getElementById('sdCropperPreviewWrap').classList.add('is-square');
    }
    render();
  }

  function setZoom(val) {
    zoomFactor = Math.max(0.6, Math.min(val, 3.5));
    if (zoomSliderEl) {
      zoomSliderEl.value = Math.round(zoomFactor * 100);
    }
    if (zoomLabelEl) {
      zoomLabelEl.textContent = `${Math.round(zoomFactor * 100)}%`;
    }
    render();
  }

  function recalculateBaseScale() {
    if (!sourceImage) return;
    const isSideways = rotation % 180 !== 0;
    const effectiveW = isSideways ? imageHeight : imageWidth;
    const effectiveH = isSideways ? imageWidth : imageHeight;

    minZoom = Math.max(cropBoxSize / effectiveW, cropBoxSize / effectiveH);
  }

  function resetTransform() {
    panX = 0;
    panY = 0;
    rotation = 0;
    flipH = 1;
    recalculateBaseScale();
    setZoom(1.0);
  }

  function render() {
    if (!canvasEl || !sourceImage) return;
    const ctx = canvasEl.getContext('2d');
    const w = canvasEl.width;
    const h = canvasEl.height;
    const xc = w / 2;
    const yc = h / 2;

    // Clear background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#090B0F';
    ctx.fillRect(0, 0, w, h);

    // Draw transformed image
    const totalScale = minZoom * zoomFactor;

    ctx.save();
    ctx.translate(xc + panX, yc + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH * totalScale, totalScale);
    ctx.drawImage(sourceImage, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    ctx.restore();

    // Darkened overlay with cutout
    ctx.save();
    ctx.fillStyle = 'rgba(7, 9, 14, 0.72)';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);

    const halfBox = cropBoxSize / 2;
    if (isCircular) {
      ctx.arc(xc, yc, halfBox, 0, Math.PI * 2, true);
    } else {
      ctx.rect(xc + halfBox, yc - halfBox, -cropBoxSize, cropBoxSize);
    }
    ctx.fill();

    // Boundary outline
    ctx.beginPath();
    if (isCircular) {
      ctx.arc(xc, yc, halfBox, 0, Math.PI * 2);
    } else {
      ctx.rect(xc - halfBox, yc - halfBox, cropBoxSize, cropBoxSize);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Subtle rule-of-thirds grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.setLineDash([4, 4]);

    const third = cropBoxSize / 3;
    for (let i = 1; i <= 2; i++) {
      const gx = xc - halfBox + i * third;
      ctx.beginPath();
      ctx.moveTo(gx, yc - halfBox);
      ctx.lineTo(gx, yc + halfBox);
      ctx.stroke();

      const gy = yc - halfBox + i * third;
      ctx.beginPath();
      ctx.moveTo(xc - halfBox, gy);
      ctx.lineTo(xc + halfBox, gy);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // Update Mini Preview Canvas
    renderMiniPreview();
  }

  function renderMiniPreview() {
    if (!previewCanvasEl || !sourceImage) return;
    const pCtx = previewCanvasEl.getContext('2d');
    const pw = previewCanvasEl.width;
    const ph = previewCanvasEl.height;

    pCtx.clearRect(0, 0, pw, ph);

    // Ratio between preview canvas and crop box
    const ratio = pw / cropBoxSize;
    const totalScale = minZoom * zoomFactor * ratio;

    pCtx.save();
    pCtx.translate(pw / 2 + panX * ratio, ph / 2 + panY * ratio);
    pCtx.rotate((rotation * Math.PI) / 180);
    pCtx.scale(flipH * totalScale, totalScale);
    pCtx.drawImage(sourceImage, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    pCtx.restore();
  }

  async function handleSaveCrop() {
    if (!sourceImage || !currentOptions) return;

    btnCropSave.disabled = true;
    const originalText = document.getElementById('sdCropperSaveText').textContent;
    document.getElementById('sdCropperSaveText').textContent = 'Cropping & Uploading...';

    try {
      const outputSize = currentOptions.outputSize || 512;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = outputSize;
      exportCanvas.height = outputSize;
      const outCtx = exportCanvas.getContext('2d');

      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = 'high';

      // Background
      outCtx.fillStyle = '#FFFFFF';
      outCtx.fillRect(0, 0, outputSize, outputSize);

      const ratio = outputSize / cropBoxSize;
      const totalScale = minZoom * zoomFactor * ratio;

      outCtx.save();
      outCtx.translate(outputSize / 2 + panX * ratio, outputSize / 2 + panY * ratio);
      outCtx.rotate((rotation * Math.PI) / 180);
      outCtx.scale(flipH * totalScale, totalScale);
      outCtx.drawImage(sourceImage, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
      outCtx.restore();

      // Convert to blob and File
      const blob = await new Promise((resolve) => {
        exportCanvas.toBlob(resolve, 'image/jpeg', 0.92);
      });

      const fileName = (currentOptions.file && currentOptions.file.name)
        ? currentOptions.file.name.replace(/\.[^.]+$/, '') + '_cropped.jpg'
        : 'avatar_cropped.jpg';

      const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
      const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);

      if (typeof currentOptions.onCrop === 'function') {
        await currentOptions.onCrop(blob, dataUrl, croppedFile);
      }

      closeModal();
    } catch (err) {
      console.error('Cropper error:', err);
      alert('Error during crop processing: ' + (err.message || 'Unknown error'));
    } finally {
      btnCropSave.disabled = false;
      document.getElementById('sdCropperSaveText').textContent = originalText;
    }
  }

  function cancelCropper() {
    closeModal();
    if (currentOptions && typeof currentOptions.onCancel === 'function') {
      currentOptions.onCancel();
    }
  }

  function closeModal() {
    if (modalEl) modalEl.style.display = 'none';
    sourceImage = null;
    currentOptions = null;
  }

  /**
   * Public API: SignDepotCropper.open(options)
   */
  function open(options) {
    if (!options || !options.file) {
      console.error('SignDepotCropper: options.file is required');
      return;
    }

    injectModalHTML();
    currentOptions = options;

    const file = options.file;
    const title = options.title || 'Crop & Adjust Picture';
    const allowSkip = !!options.allowSkip;
    const defaultCircular = options.circular !== false;

    document.getElementById('sdCropperTitle').textContent = title;
    if (btnSkip) btnSkip.style.display = allowSkip ? 'inline-flex' : 'none';

    setShape(defaultCircular);

    // Read and load image
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        sourceImage = img;
        imageWidth = img.naturalWidth || img.width;
        imageHeight = img.naturalHeight || img.height;

        resetTransform();
        modalEl.style.display = 'flex';
        render();
      };
      img.onerror = () => {
        alert('Could not read this image file. Please choose a valid PNG, JPG, or WebP.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Expose globally
  window.SignDepotCropper = {
    open: open,
    close: closeModal
  };

})(window, document);
