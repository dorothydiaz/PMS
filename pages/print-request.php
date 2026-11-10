<?php
/**
 * Sign Depot™ Operations PMS — Print Request
 * Location: pages/print-request.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('print-request', 'r');

$pageTitle = 'Print Request';
$currentPage = 'print-request';

$targetIdentifier = trim($_GET['id'] ?? $_GET['jo'] ?? $_GET['req'] ?? $_GET['requestId'] ?? '');
$targetRecord = null;
try {
    $pdo = getDbConnection();
    if (!empty($targetIdentifier)) {
        $stmt = $pdo->prepare("SELECT * FROM sales_requests WHERE request_id = :id1 OR jo_number = :id2 OR id = :id3 LIMIT 1");
        $stmt->execute([':id1' => $targetIdentifier, ':id2' => $targetIdentifier, ':id3' => is_numeric($targetIdentifier) ? (int)$targetIdentifier : 0]);
        $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$targetRecord) {
            $stmt = $pdo->prepare("SELECT * FROM sales_requests WHERE project_name LIKE :pn OR client LIKE :cl LIMIT 1");
            $stmt->execute([':pn' => "%$targetIdentifier%", ':cl' => "%$targetIdentifier%"]);
            $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
    if (!$targetRecord) {
        $stmt = $pdo->query("SELECT * FROM sales_requests ORDER BY id DESC LIMIT 1");
        $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {}

function formatDisplayDate($dateStr) {
    if (empty($dateStr) || $dateStr === '0000-00-00' || $dateStr === '—' || $dateStr === '-') return '';
    $t = strtotime($dateStr);
    return $t ? date('m/d/Y', $t) : $dateStr;
}

$docRequestId = $targetRecord ? ($targetRecord['request_id'] ?: ('REQ-' . $targetRecord['id'])) : 'LR-26-0000';
$docSales = $targetRecord ? ($targetRecord['sales_rep'] ?: '') : '';
$docClient = $targetRecord ? ($targetRecord['client'] ?: '') : '';
$docProj = $targetRecord ? ($targetRecord['project_name'] ?: '') : '';
$docJo = $targetRecord ? ($targetRecord['jo_number'] ?: '') : '';
$docArtist = $targetRecord ? ($targetRecord['artist'] ?: '') : '';
$docDateReq = ($targetRecord && !empty($targetRecord['order_date'])) ? formatDisplayDate($targetRecord['order_date']) : (($targetRecord && !empty($targetRecord['created_at'])) ? formatDisplayDate($targetRecord['created_at']) : '');
$docDeadline = ($targetRecord && !empty($targetRecord['design_deadline'])) ? formatDisplayDate($targetRecord['design_deadline']) : '';
$docReleasing = ($targetRecord && !empty($targetRecord['releasing_date'])) ? formatDisplayDate($targetRecord['releasing_date']) : '';
$docRef = $targetRecord ? (!empty($targetRecord['file_sent']) ? $targetRecord['file_sent'] : (!empty($targetRecord['fileSent']) ? $targetRecord['fileSent'] : '')) : '';

$docLookupVal = $targetRecord ? ($targetRecord['request_id'] ?: $targetRecord['jo_number'] ?: $targetRecord['project_name'] ?: '') : '';
$initialRequestKey = $docRequestId;

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<style>
/* Specific Print Request Styles */
.print-req-card-wrap {
  background: #E2E6EC;
  padding: 40px 24px;
  border-radius: var(--radius-lg, 12px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: auto;
  box-shadow: inset 0 1px 4px rgba(15, 23, 42, 0.05);
  position: relative;
  z-index: 1;
}

.print-req-sheet {
  background: #FFFFFF;
  width: 100%;
  max-width: 680px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 24px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.print-req-zoom-container {
  transform-origin: top center;
  transition: transform 0.15s ease-out;
  display: flex;
  justify-content: center;
  width: 100%;
}

.print-req-svg-frame {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  background: #FFFFFF;
  display: block;
  user-select: none;
}

.print-req-svg-frame text.interactive-field {
  cursor: pointer;
  transition: opacity 0.15s ease, fill 0.15s ease;
}

.print-req-svg-frame text.interactive-field:hover {
  opacity: 0.7;
}

.print-req-svg-frame text.active-svg-cell {
  outline: 2px dashed #15803D;
  fill: #15803D !important;
}

/* Print Only Styles */
@media print {
  @page {
    margin: 15mm;
    size: auto;
  }
  html, body {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    color: #000000 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .sidebar, .topbar, .directive-lookup-card, .doc-top-bar, .studio-card, .no-print, .modal-backdrop, .toast-container {
    display: none !important;
  }
  .main-wrapper {
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
  }
  .content-body, .view-panel {
    padding: 0 !important;
    margin: 0 !important;
  }
  .print-req-card-wrap {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
  }
  .print-req-sheet {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 auto !important;
    max-width: 100% !important;
  }
  .print-req-zoom-container {
    transform: none !important;
  }
  .print-req-svg-frame {
    box-shadow: none !important;
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
  }
}
</style>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <section class="view-panel active" id="view-print-request">
        
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2>Print Request</h2>
            <p>Printable sales request vector card, job order specifications & Corel export</p>
          </div>
        </div>

        <!-- Search / Lookup Bar (Consistent with Directives Details) -->
        <div class="directive-lookup-card">
          <label style="font-size: 13px; font-weight: 800; color: #0F172A;">
            Search by Request ID, J.O. Number, Client, or Project Name
          </label>
          <div class="lookup-flex">
            <div class="lookup-input-wrap">
              <svg class="lookup-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" class="lookup-input" id="requestLookupInput" value="<?= htmlspecialchars($docLookupVal) ?>" placeholder="e.g. LR-26-2309, SD261106-017, Crave Lab..." autocomplete="off">
              <div class="autocomplete-box" id="requestAutocompleteBox"></div>
            </div>
            <div class="lookup-btn-group">
              <button class="btn btn-primary" id="btnRequestSearch">Load Request</button>
              <button class="btn btn-secondary" id="btnRequestClear">Clear</button>
            </div>
            <span id="requestLookupStatus" style="font-size: 13px; font-weight: 700; margin-left: 8px;"></span>
          </div>
        </div>

        <!-- Document Preview Section -->
        <div class="directive-subtab-content active" id="tab-request-preview" style="display: block;">
          
          <!-- Top Quick Bar with Zoom & Export Controls -->
          <div class="doc-top-bar no-print">
            <div class="doc-top-bar-left">
              <div class="doc-active-badge">
                <span class="doc-active-dot" style="background:#16A34A;"></span>
                <span class="doc-active-label">PRINT REQUEST</span>
                <span class="doc-active-divider">|</span>
                <span class="doc-active-jo" id="docActiveReqBadge"><?= !empty($docRequestId) ? htmlspecialchars($docRequestId) : 'Ready' ?></span>
              </div>
            </div>

            <div class="doc-top-quick-actions">
              <!-- Font Size Adjustment -->
              <div class="doc-font-controls" id="requestFontControls" title="Click any table field to select and scale font size">
                <span class="font-ctrl-cell-badge" id="fontCtrlCellBadge">Select Field</span>
                <button class="btn-font-scale" id="btnReqFontDec" title="Decrease font size">A−</button>
                <input type="number" class="cell-font-size-input" id="cellReqFontSizeInput" min="6" max="48" value="14" title="Custom font size in px">
                <span class="font-ctrl-unit">px</span>
                <button class="btn-font-scale" id="btnReqFontInc" title="Increase font size">A+</button>
                <button class="btn-font-scale" id="btnReqFontReset" title="Reset font size">↺</button>
              </div>

              <!-- Zoom Controls -->
              <div class="doc-font-controls doc-zoom-controls" id="requestZoomControls" title="Zoom Card Preview">
                <span class="font-ctrl-cell-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  ZOOM
                </span>
                <button class="btn-font-scale" id="btnReqZoomOut" title="Zoom Out (−)">−</button>
                <span class="zoom-level-text" id="reqZoomLevelText" title="Click to reset zoom">100%</span>
                <button class="btn-font-scale" id="btnReqZoomIn" title="Zoom In (+)">+</button>
                <button class="btn-font-scale" id="btnReqZoomFit" title="Fit to Container Width">FIT</button>
                <button class="btn-font-scale" id="btnReqZoomReset" title="Reset Zoom to 100%">↺</button>
              </div>

              <!-- Export Dropdown Menu -->
              <div class="doc-action-btn-group">
                <button class="btn btn-secondary btn-sm" id="btnReqPrintDoc" title="Print document preview immediately">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  <span>Print</span>
                </button>

                <div class="directive-dropdown-container">
                  <button class="btn btn-primary btn-sm directive-dropdown-btn" id="btnReqExportDropdown" type="button" aria-haspopup="true" aria-expanded="false">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Export / Copy</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>

                  <div class="directive-export-menu" id="reqExportMenu">
                    <button type="button" class="directive-export-item is-featured" id="optReqCopyPNG">
                      <div class="export-item-icon img-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Copy Image 4K (Ctrl+V)</span>
                          <span class="export-item-badge badge-green">Ultra-Sharp</span>
                        </div>
                        <span class="export-item-desc">High resolution clipboard image — instant Ctrl+V into Corel / Photoshop</span>
                      </div>
                    </button>

                    <button type="button" class="directive-export-item" id="optReqCopySVG">
                      <div class="export-item-icon svg-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Copy Vector SVG</span>
                          <span class="export-item-badge badge-blue">Illustrator / Figma</span>
                        </div>
                        <span class="export-item-desc">Clean SVG vector code copied directly to clipboard</span>
                      </div>
                    </button>

                    <div class="directive-export-divider"></div>

                    <button type="button" class="directive-export-item" id="optReqDownloadSVG">
                      <div class="export-item-icon dl-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Download Vector SVG (.svg)</span>
                        </div>
                        <span class="export-item-desc">Raw scalable vector graphic template</span>
                      </div>
                    </button>

                    <button type="button" class="directive-export-item" id="optReqDownloadPNG">
                      <div class="export-item-icon img-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Download PNG Image</span>
                        </div>
                        <span class="export-item-desc">High-definition raster PNG file</span>
                      </div>
                    </button>
                  </div>
                </div>

                <button class="btn btn-secondary btn-sm" id="btnReqReset" title="Reset fields to original database values">Reset</button>
              </div>
            </div>
          </div>

          <!-- Master Printable Sheet & Vector Canvas -->
          <div class="print-req-card-wrap">
            <div class="print-req-sheet" id="printableRequestDocument">
              <div class="print-req-zoom-container" id="reqZoomContainer">
                
                <!-- EXACT SVG VECTOR CARD (Exact Match to User's Template) -->
                <!-- Dimensions: 560 x 352 (11 rows x 32px height) -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 352" width="560" height="352" id="printRequestSvg" class="print-req-svg-frame">
                  <defs>
                    <style>
                      .req-label { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; fill: #111827; }
                      .req-val { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14.5px; font-weight: 500; fill: #111827; cursor: pointer; text-anchor: middle; }
                      .req-val-bold { font-weight: 700; fill: #0F172A; }
                      .req-val-artist { fill: #DC2626 !important; font-weight: 700; }
                      .req-val-artist:hover { fill: #B91C1C !important; }
                      .interactive-field { cursor: pointer; transition: opacity 0.15s ease; }
                      .interactive-field:hover { fill: #047857; }
                    </style>
                  </defs>

                  <!-- Base Background -->
                  <rect x="0" y="0" width="560" height="352" fill="#FFFFFF"/>

                  <!-- Left Column Green Labels Column (Width: 170) -->
                  <rect x="0" y="0" width="170" height="352" fill="#D9EAD3"/>

                  <!-- Top Right Request ID Value Cell (Width: 390, Height: 32) -->
                  <rect x="170" y="0" width="390" height="32" fill="#B6D7A8"/>

                  <!-- Horizontal Dividing Grid Lines (y = 32, 64, 96, 128, 160, 192, 224, 256, 288, 320) -->
                  <line x1="0" y1="32" x2="560" y2="32" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="64" x2="560" y2="64" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="96" x2="560" y2="96" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="128" x2="560" y2="128" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="160" x2="560" y2="160" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="192" x2="560" y2="192" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="224" x2="560" y2="224" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="256" x2="560" y2="256" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="288" x2="560" y2="288" stroke="#2B2D2F" stroke-width="1"/>
                  <line x1="0" y1="320" x2="560" y2="320" stroke="#2B2D2F" stroke-width="1"/>

                  <!-- Vertical Column Divider (x = 170) -->
                  <line x1="170" y1="0" x2="170" y2="352" stroke="#2B2D2F" stroke-width="1.2"/>

                  <!-- Outer Table Border (0, 0, 560, 352) -->
                  <rect x="0.5" y="0.5" width="559" height="351" fill="none" stroke="#2B2D2F" stroke-width="1.5"/>

                  <!-- ======================================================== -->
                  <!-- ROW 1: Request ID -->
                  <!-- ======================================================== -->
                  <text x="12" y="21.5" class="req-label" font-weight="700">Request ID:</text>
                  <text x="365" y="21.5" text-anchor="middle" class="req-val req-val-bold interactive-field" id="svgFieldRequestId" data-field-name="Request ID" data-base-y="21.5"><?= htmlspecialchars($docRequestId) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 2: (Empty separator row matching template) -->
                  <!-- ======================================================== -->

                  <!-- ======================================================== -->
                  <!-- ROW 3: Requested by -->
                  <!-- ======================================================== -->
                  <text x="12" y="85.5" class="req-label" font-weight="700">Requested by:</text>
                  <text x="365" y="85.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldSales" data-field-name="Requested by" data-base-y="85.5"><?= htmlspecialchars($docSales) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 4: Client -->
                  <!-- ======================================================== -->
                  <text x="12" y="117.5" class="req-label" font-weight="700">Client:</text>
                  <text x="365" y="117.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldClient" data-field-name="Client" data-base-y="117.5"><?= htmlspecialchars($docClient) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 5: Project Name -->
                  <!-- ======================================================== -->
                  <text x="12" y="149.5" class="req-label" font-weight="700">Project Name:</text>
                  <text x="365" y="149.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldProject" data-field-name="Project Name" data-base-y="149.5"><?= htmlspecialchars($docProj) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 6: JO Number -->
                  <!-- ======================================================== -->
                  <text x="12" y="181.5" class="req-label" font-weight="700">JO Number:</text>
                  <text x="365" y="181.5" text-anchor="middle" class="req-val req-val-bold interactive-field" id="svgFieldJo" data-field-name="JO Number" data-base-y="181.5"><?= htmlspecialchars($docJo) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 7: Artist -->
                  <!-- ======================================================== -->
                  <text x="12" y="213.5" class="req-label" font-weight="700">Artist:</text>
                  <text x="365" y="213.5" text-anchor="middle" class="req-val req-val-artist interactive-field" id="svgFieldArtist" data-field-name="Artist" data-base-y="213.5" fill="#DC2626"><?= htmlspecialchars($docArtist) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 8: Date Requested -->
                  <!-- ======================================================== -->
                  <text x="12" y="245.5" class="req-label" font-weight="700">Date Requested:</text>
                  <text x="365" y="245.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldDateReq" data-field-name="Date Requested" data-base-y="245.5"><?= htmlspecialchars($docDateReq) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 9: Deadline -->
                  <!-- ======================================================== -->
                  <text x="12" y="277.5" class="req-label" font-weight="700">Deadline:</text>
                  <text x="365" y="277.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldDeadline" data-field-name="Deadline" data-base-y="277.5"><?= htmlspecialchars($docDeadline) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 10: Releasing Date -->
                  <!-- ======================================================== -->
                  <text x="12" y="309.5" class="req-label" font-weight="700">Releasing Date:</text>
                  <text x="365" y="309.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldReleasing" data-field-name="Releasing Date" data-base-y="309.5"><?= htmlspecialchars($docReleasing) ?></text>

                  <!-- ======================================================== -->
                  <!-- ROW 11: Reference -->
                  <!-- ======================================================== -->
                  <text x="12" y="341.5" class="req-label" font-weight="700">Reference:</text>
                  <text x="365" y="341.5" text-anchor="middle" class="req-val interactive-field" id="svgFieldReference" data-field-name="Reference" data-base-y="341.5"><?= htmlspecialchars($docRef) ?></text>
                </svg>

              </div>
            </div>
          </div>

          <!-- Live Adjustment Form Card -->
          <div class="studio-card directive-extra-notes no-print" style="margin-top: 24px;">
            <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
              <span>Live Request Adjustment Controls</span>
              <span style="font-size: 12px; font-weight: 500; color: #64748B;">Changes reflect instantly on the SVG card above</span>
            </h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label">Request ID</label>
                <input type="text" class="form-control" id="ctrlReqId" value="<?= htmlspecialchars($docRequestId) ?>" placeholder="e.g. LR-26-2309">
              </div>
              <div class="form-group">
                <label class="form-label">Requested By (Sales Rep)</label>
                <input type="text" class="form-control" id="ctrlReqSales" value="<?= htmlspecialchars($docSales) ?>" placeholder="Sales Rep...">
              </div>
              <div class="form-group">
                <label class="form-label">Client</label>
                <input type="text" class="form-control" id="ctrlReqClient" value="<?= htmlspecialchars($docClient) ?>" placeholder="Client name...">
              </div>

              <div class="form-group col-span-2">
                <label class="form-label">Project Name</label>
                <input type="text" class="form-control" id="ctrlReqProject" value="<?= htmlspecialchars($docProj) ?>" placeholder="Project name...">
              </div>
              <div class="form-group">
                <label class="form-label">JO Number</label>
                <input type="text" class="form-control" id="ctrlReqJo" value="<?= htmlspecialchars($docJo) ?>" placeholder="Job order number...">
              </div>

              <div class="form-group">
                <label class="form-label">Artist Assigned</label>
                <input type="text" class="form-control" id="ctrlReqArtist" value="<?= htmlspecialchars($docArtist) ?>" placeholder="Artist..." style="color: #DC2626; font-weight: 600;">
              </div>
              <div class="form-group">
                <label class="form-label">Date Requested</label>
                <input type="text" class="form-control" id="ctrlReqDate" value="<?= htmlspecialchars($docDateReq) ?>" placeholder="MM/DD/YYYY">
              </div>
              <div class="form-group">
                <label class="form-label">Deadline</label>
                <input type="text" class="form-control" id="ctrlReqDeadline" value="<?= htmlspecialchars($docDeadline) ?>" placeholder="MM/DD/YYYY">
              </div>

              <div class="form-group">
                <label class="form-label">Releasing Date</label>
                <input type="text" class="form-control" id="ctrlReqReleasing" value="<?= htmlspecialchars($docReleasing) ?>" placeholder="MM/DD/YYYY">
              </div>
              <div class="form-group col-span-2">
                <label class="form-label">Reference (File Sent Status)</label>
                <input type="text" class="form-control" id="ctrlReqRef" value="<?= htmlspecialchars($docRef) ?>" placeholder="File sent status (e.g. File Sent, To Follow, Incomplete)...">
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  </main>
</div>

<script>
  window.__INITIAL_PRINT_REQUEST_KEY = <?= json_encode($initialRequestKey) ?>;
  window.__CURRENT_REQUEST_DATA = <?= json_encode($targetRecord ?: (object)[]) ?>;
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>

