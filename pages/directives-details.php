<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Directives Details
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('directives-details', 'r');

$pageTitle = 'Directives Details';
$currentPage = 'directives-details';

$targetIdentifier = trim($_GET['id'] ?? $_GET['jo'] ?? $_GET['req'] ?? $_GET['requestId'] ?? '');
$targetRecord = null;
try {
    $pdo = getDbConnection();
    if (!empty($targetIdentifier)) {
        $stmt = $pdo->prepare("SELECT * FROM sales_requests WHERE request_id = :id1 OR jo_number = :id2 OR id = :id3 LIMIT 1");
        $stmt->execute([':id1' => $targetIdentifier, ':id2' => $targetIdentifier, ':id3' => is_numeric($targetIdentifier) ? (int)$targetIdentifier : 0]);
        $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$targetRecord) {
            $stmt = $pdo->prepare("SELECT * FROM sales_requests WHERE project_name LIKE :pn LIMIT 1");
            $stmt->execute([':pn' => "%$targetIdentifier%"]);
            $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
    if (!$targetRecord) {
        $stmt = $pdo->query("SELECT * FROM sales_requests ORDER BY id DESC LIMIT 1");
        $targetRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {}

function formatDotDate($dateStr) {
    if (empty($dateStr) || $dateStr === '0000-00-00' || $dateStr === '—' || $dateStr === '-') return '00.00.0000';
    $t = strtotime($dateStr);
    return $t ? date('m.d.Y', $t) : '00.00.0000';
}

$docJo = $targetRecord ? ($targetRecord['jo_number'] ?: $targetRecord['request_id'] ?: '—') : '—';
$docProj = $targetRecord ? ($targetRecord['project_name'] ?: '—') : '—';
$docContact = ($targetRecord && !empty($targetRecord['contact_person']) && $targetRecord['contact_person'] !== 'N/A') ? $targetRecord['contact_person'] : '-';
$docPhone = ($targetRecord && !empty($targetRecord['contact_number']) && $targetRecord['contact_number'] !== 'N/A') ? $targetRecord['contact_number'] : '-';
$docDueDate = ($targetRecord && !empty($targetRecord['design_deadline'])) ? formatDotDate($targetRecord['design_deadline']) : '00.00.0000';
$docClient = $targetRecord ? ($targetRecord['client'] ?: '—') : '—';
$docOrderDate = ($targetRecord && !empty($targetRecord['order_date'])) ? formatDotDate($targetRecord['order_date']) : '00.00.0000';
$docLocation = $targetRecord ? ($targetRecord['location'] ?: '—') : '—';
$locLower = strtolower(trim($docLocation));
$isIndoor = ($locLower !== '—' && $locLower !== '-' && $locLower !== '' && (strpos($locLower, 'indoor') !== false || strpos($locLower, 'both') !== false));
$isOutdoor = ($locLower !== '—' && $locLower !== '-' && $locLower !== '' && (strpos($locLower, 'outdoor') !== false || strpos($locLower, 'both') !== false));
$docReleasingDate = ($targetRecord && !empty($targetRecord['releasing_date'])) ? formatDotDate($targetRecord['releasing_date']) : '00.00.0000';
$docInCharge = $targetRecord ? strtoupper($targetRecord['sales_rep'] ?: '—') : '—';
$docDrawnBy = $targetRecord ? strtoupper($targetRecord['artist'] ?: '—') : '—';
$docReleasingMode = $targetRecord ? ($targetRecord['releasing_mode'] ?: 'Pickup') : 'Pickup';
$docAddress = ($targetRecord && !empty($targetRecord['complete_address']) && $targetRecord['complete_address'] !== 'N/A') ? $targetRecord['complete_address'] : (($targetRecord && !empty($targetRecord['location']) && $targetRecord['location'] !== 'N/A') ? $targetRecord['location'] : '-');
$docLookupVal = $targetRecord ? ($targetRecord['jo_number'] ?: $targetRecord['request_id'] ?: $targetRecord['project_name'] ?: '') : '';
$initialDirectiveKey = $targetRecord ? ($targetRecord['request_id'] ?: $targetRecord['jo_number'] ?: $targetRecord['id'] ?: '') : '';
$fontFile = dirname(__DIR__) . '/assets/fonts/BebasKai.otf';
$bebasB64 = file_exists($fontFile) ? base64_encode(file_get_contents($fontFile)) : '';

function getWallSvgContent($type) {
    if (empty($type) || $type === 'blank') return '';
    $path = dirname(__DIR__) . '/assets/img/walls/' . basename($type) . '.svg';
    if (!file_exists($path)) return '';
    $raw = file_get_contents($path);
    if (preg_match('/<g id="Layer_x0020_1">(.*?)<\/svg>/s', $raw, $m)) {
        $inner = preg_replace('/<\/g>\s*$/', '', trim($m[1]));
        $inner = str_replace('class="fil1"', 'fill="#000000" fill-rule="nonzero"', $inner);
        $inner = str_replace('class="fil2"', 'fill="#ED3237"', $inner);
        $inner = str_replace('class="fil0"', 'fill="#FFFFFF"', $inner);
        return preg_replace('/<metadata[^>]*\/?>/', '', $inner);
    }
    return '';
}

$docEnvType = $targetRecord['env_type'] ?? $targetRecord['wall_type'] ?? '';
$docEnvSvgHtml = getWallSvgContent($docEnvType);

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-directives-details">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>Directives Details & Job Orders</h2>
              <p>Printable Sign Depot production directive generator & specifications</p>
            </div>
          </div>

          <div class="directive-lookup-card">
            <label style="font-size: 13px; font-weight: 800; color: #0F172A;">
              Search by J.O. Number, Project Name, or Request ID
            </label>
            <div class="lookup-flex">
              <div class="lookup-input-wrap">
                <svg class="lookup-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="lookup-input" id="directiveLookupInput" value="<?= htmlspecialchars($docLookupVal) ?>" placeholder="e.g. P260701373, URAL, or LR-26-1230..." autocomplete="off">
                <div class="autocomplete-box" id="directiveAutocompleteBox"></div>
              </div>
              <button class="btn btn-primary" id="btnDirectiveSearch">Load Job</button>
              <button class="btn btn-secondary" id="btnDirectiveClear">Clear</button>
              <span id="directiveLookupStatus" style="font-size: 13px; font-weight: 700; margin-left: 8px;"></span>
            </div>
          </div>

          <!-- DIRECTIVE DOCUMENT PREVIEW (Exact Sign Depot Document Layout) -->
          <div class="directive-subtab-content active" id="tab-directive-preview" style="display: block;">
            
            <!-- Directive Top Quick Bar (Vector Ready) -->
            <div class="doc-top-bar no-print">
              <div class="doc-top-quick-actions" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: flex-end; width: 100%;">
                <!-- Real-time Font Size Controls -->
                <div class="doc-font-controls" id="directiveFontControls" title="Click any directive field to select and scale font size, or edit text directly">
                  <span class="font-ctrl-cell-badge" id="fontCtrlCellBadge">PROJECT NAME: 22px</span>
                  <button class="btn-font-scale" id="btnCellFontDec" title="Decrease font size (Ctrl+[)">A−</button>
                  <input type="number" class="cell-font-size-input" id="cellFontSizeInput" min="6" max="72" value="22" title="Custom font size in px">
                  <span class="font-ctrl-unit">px</span>
                  <button class="btn-font-scale" id="btnCellFontInc" title="Increase font size (Ctrl+])">A+</button>
                  <button class="btn-font-scale" id="btnCellFontReset" title="Reset font size for active field">↺</button>
                </div>

                <!-- Real-time Zoom Controls -->
                <div class="doc-font-controls doc-zoom-controls" id="directiveZoomControls" title="Zoom Directive Preview">
                  <span class="font-ctrl-cell-badge" id="zoomCtrlBadge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    ZOOM
                  </span>
                  <button class="btn-font-scale" id="btnDirectiveZoomOut" title="Zoom Out (−)">−</button>
                  <span class="zoom-level-text" id="directiveZoomLevelText" title="Click to toggle or reset zoom">100%</span>
                  <button class="btn-font-scale" id="btnDirectiveZoomIn" title="Zoom In (+)">+</button>
                  <button class="btn-font-scale" id="btnDirectiveZoomFit" title="Fit to Container Width">FIT</button>
                  <button class="btn-font-scale" id="btnDirectiveZoomReset" title="Reset Zoom to 100%">↺</button>
                </div>

                <div class="directive-dropdown-container">
                  <button class="btn btn-primary btn-sm directive-dropdown-btn" id="btnDirectiveExportDropdown" type="button" aria-haspopup="true" aria-expanded="false">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Export / Copy</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div class="directive-export-menu" id="directiveExportMenu">
                    <button type="button" class="directive-export-item is-featured" id="optDirectiveDownloadEMF">
                      <div class="export-item-icon emf-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Download EMF (CorelDRAW)</span>
                          <span class="export-item-badge badge-corel">CorelDRAW Compatible</span>
                        </div>
                        <span class="export-item-desc">Native vector with outlined text — 1-click import into CorelDRAW</span>
                      </div>
                    </button>
                    
                    <div class="directive-export-divider"></div>

                    <button type="button" class="directive-export-item" id="optDirectiveCopyPNG">
                      <div class="export-item-icon img-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Copy Image 4K (Ctrl+V)</span>
                          <span class="export-item-badge badge-green">Ultra-Sharp</span>
                        </div>
                        <span class="export-item-desc">3616 × 384 px clipboard image — instant Ctrl+V into Corel / PS</span>
                      </div>
                    </button>

                    <button type="button" class="directive-export-item" id="optDirectiveCopySVG">
                      <div class="export-item-icon svg-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Copy Vector SVG</span>
                          <span class="export-item-badge badge-blue">Illustrator / Figma</span>
                        </div>
                        <span class="export-item-desc">Standard vector SVG code copied directly to clipboard</span>
                      </div>
                    </button>

                    <div class="directive-export-divider"></div>

                    <button type="button" class="directive-export-item" id="optDirectiveDownloadSVG">
                      <div class="export-item-icon dl-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      </div>
                      <div class="export-item-body">
                        <div class="export-item-title-row">
                          <span class="export-item-title">Download Vector SVG (.svg)</span>
                        </div>
                        <span class="export-item-desc">Raw scalable vector graphic file</span>
                      </div>
                    </button>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" id="btnDirectiveReset" title="Reset directive to default values">Reset</button>
              </div>
            </div>

            <div class="directive-canvas-wrap">
              <!-- Master Directive Landscape Letter Sheet (11in x 8.5in Ratio) -->
              <div class="directive-sheet-landscape" id="printableDirectiveDocument">
                <!-- Exact 1:1 Vector Production Directive Header (Pure Original SVG Format with Bebas Kai & Dynamic Fields) -->
                <div class="directive-zoom-container" id="directiveZoomContainer">
                  <div class="directive-exact-header-wrap" id="directiveGridTable">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 904 96" width="904" height="96" id="directiveExactSvg" style="background:#FFFFFF; display:block;">
                    <defs>
                      <style>
                        @font-face {
                          font-family: 'Bebas Kai';
                          src: url('data:font/otf;charset=utf-8;base64,<?= $bebasB64 ?>') format('opentype'),
                               url('../assets/fonts/BebasKai.otf') format('opentype'),
                               url('../assets/fonts/BebasKai.ttf') format('truetype');
                          font-weight: normal;
                          font-style: normal;
                        }
                        @font-face {
                          font-family: 'BebasKai';
                          src: url('data:font/otf;charset=utf-8;base64,<?= $bebasB64 ?>') format('opentype'),
                               url('../assets/fonts/BebasKai.otf') format('opentype'),
                               url('../assets/fonts/BebasKai.ttf') format('truetype');
                          font-weight: normal;
                          font-style: normal;
                        }
                        text { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: normal; }
                        .bebas-field { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif !important; font-weight: normal !important; cursor: pointer; user-select: text; }
                        .cond-black { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: normal !important; }
                        .cond-bold { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: normal !important; }
                        .cond-semi { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: normal !important; }
                        .chinese { font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', sans-serif; font-weight: bold; }
                        tspan.chinese { font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', sans-serif; font-weight: bold; }
                        .center-txt { text-anchor: middle; }
                        .interactive-field { cursor: pointer; transition: opacity 0.15s, fill 0.15s; }
                        .interactive-field:hover { opacity: 0.75; }
                        .active-svg-cell { outline: 2px dashed #E10600; fill: #E10600 !important; }
                      </style>
                    </defs>

                    <!-- Base White Canvas -->
                    <rect x="0" y="0" width="904" height="96" fill="#FFFFFF"/>

                    <!-- ========================================== -->
                    <!-- COLUMN 1: (0 to 225) -->
                    <!-- ========================================== -->
                    <?php
                      $joClean = preg_replace('/^JO#:\s*/i', '', trim($docJo));
                      $joLen = strlen($joClean);
                      $joSz = 28;
                      if ($joLen > 12) {
                        $joSz = max(18, round(28 * (12 / $joLen), 1));
                      }
                      $joNumX = round(10 + ($joSz * 1.78));
                    ?>
                    <rect x="0" y="0" width="225" height="33" fill="#000000"/>
                    <text x="10" y="26.5" fill="#FFFFFF" font-size="<?= $joSz ?>" class="cond-black" letter-spacing="0.5">JO#:</text>
                    <text x="<?= $joNumX ?>" y="26.5" fill="#FFFFFF" font-size="<?= $joSz ?>" class="cond-black bebas-field interactive-field" letter-spacing="0.5" id="docFieldJoNumber" data-field-name="JO Number" data-base-y="26.5" data-raw-text="<?= htmlspecialchars($docJo) ?>"><?= htmlspecialchars($joClean) ?></text>

                    <line x1="0" y1="33" x2="225" y2="33" stroke="#000000" stroke-width="1.5"/>
                    <text x="8" y="47" fill="#000000" font-size="13.5" class="cond-bold">IN CHARGE<tspan font-size="11.5" class="chinese">负责人</tspan>  :</text>
                    <text x="218" y="47" fill="#000000" font-size="15" class="cond-bold bebas-field interactive-field" text-anchor="end" id="docFieldInCharge" data-field-name="In-Charge" data-base-y="47" data-raw-text="<?= htmlspecialchars($docInCharge) ?>"><?= htmlspecialchars($docInCharge) ?></text>

                    <text x="8" y="68" fill="#000000" font-size="13.5" class="cond-bold">DRAWN BY <tspan font-size="11.5" class="chinese">通过绘制</tspan>  :</text>
                    <text x="218" y="68" fill="#000000" font-size="15" class="cond-bold bebas-field interactive-field" text-anchor="end" id="docFieldDrawnBy" data-field-name="Drawn By" data-base-y="68" data-raw-text="<?= htmlspecialchars($docDrawnBy) ?>"><?= htmlspecialchars($docDrawnBy) ?></text>

                    <g transform="translate(6, 80.7) scale(0.39)">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#000000"/>
                    </g>
                    <text x="16.5" y="89.5" fill="#000000" font-size="12" class="cond-bold">ADDRESS <tspan font-size="11" class="chinese">地址</tspan>  :</text>
                    <rect x="100" y="79" width="120" height="13.5" rx="2" fill="#E8EBED" id="bgFieldAddress" style="cursor: pointer;"/>
                    <text x="216" y="89.5" fill="#000000" font-size="12" class="cond-bold bebas-field interactive-field" text-anchor="end" id="docFieldAddress" data-field-name="Address" data-base-y="89.5" data-raw-text="<?= htmlspecialchars($docAddress) ?>" style="cursor: pointer;"><?= htmlspecialchars($docAddress) ?></text>

                    <!-- Vertical Divider 1 -->
                    <line x1="225" y1="0" x2="225" y2="96" stroke="#000000" stroke-width="2"/>

                    <!-- ========================================== -->
                    <!-- COLUMN 2: (225 to 340) -->
                    <!-- ========================================== -->
                    <!-- Row 1: Order Date -->
                    <text x="282.5" y="13.5" fill="#000000" font-size="12" class="cond-bold center-txt">ORDER DATE <tspan font-size="10.5" class="chinese">订购日期</tspan></text>
                    <text x="282.5" y="27.5" fill="#000000" font-size="14" class="cond-bold bebas-field interactive-field center-txt" id="docFieldOrderDate" data-field-name="Order Date" data-base-y="27.5" data-raw-text="<?= htmlspecialchars($docOrderDate) ?>"><?= htmlspecialchars($docOrderDate) ?></text>

                    <!-- Row 2: Due Date -->
                    <line x1="225" y1="33" x2="340" y2="33" stroke="#000000" stroke-width="1.5"/>
                    <rect x="225" y="33" width="115" height="32" fill="#000000" id="bgFieldDueDate" style="cursor: pointer;"/>
                    <text x="282.5" y="47" fill="#FFFFFF" font-size="13" class="cond-bold center-txt" letter-spacing="0.5">DUE DATE</text>
                    <text x="282.5" y="60" fill="#FFFFFF" font-size="14.5" class="cond-bold bebas-field interactive-field center-txt" id="docFieldDueDate" data-field-name="Due Date" data-base-y="60" data-raw-text="<?= htmlspecialchars($docDueDate) ?>"><?= htmlspecialchars($docDueDate) ?></text>

                    <!-- Row 3: Date to be Release -->
                    <line x1="225" y1="65" x2="340" y2="65" stroke="#000000" stroke-width="1.5"/>
                    <text x="282.5" y="77" fill="#000000" font-size="11.5" class="cond-bold center-txt" letter-spacing="0.2">DATE TO BE RELEASE</text>
                    <text x="282.5" y="90" fill="#000000" font-size="14" class="cond-bold bebas-field interactive-field center-txt" id="docFieldReleasingDate" data-field-name="Release Date" data-base-y="90" data-raw-text="<?= htmlspecialchars($docReleasingDate) ?>"><?= htmlspecialchars($docReleasingDate) ?></text>

                    <!-- Vertical Divider 2 -->
                    <line x1="340" y1="0" x2="340" y2="96" stroke="#000000" stroke-width="2"/>

                    <!-- ========================================== -->
                    <!-- COLUMN 3: (340 to 564) -->
                    <!-- ========================================== -->
                    <!-- Indoor & Outdoor Header Blocks -->
                    <rect x="340" y="0" width="112" height="18" fill="<?= $isIndoor ? '#E10600' : '#FFFFFF' ?>" id="bgIndoor" style="cursor: pointer;"/>
                    <rect x="452" y="0" width="112" height="18" fill="<?= $isOutdoor ? '#E10600' : '#FFFFFF' ?>" id="bgOutdoor" style="cursor: pointer;"/>
                    <line x1="452" y1="0" x2="452" y2="18" stroke="#000000" stroke-width="1"/>
                    <text x="396" y="14" fill="<?= $isIndoor ? '#FFFFFF' : '#000000' ?>" font-size="13.5" class="cond-black center-txt" letter-spacing="0.5" id="lblIndoor" style="cursor: pointer; user-select: none;">INDOOR</text>
                    <text x="508" y="14" fill="<?= $isOutdoor ? '#FFFFFF' : '#000000' ?>" font-size="13.5" class="cond-black center-txt" letter-spacing="0.5" id="lblOutdoor" style="cursor: pointer; user-select: none;">OUTDOOR</text>

                    <line x1="340" y1="18" x2="564" y2="18" stroke="#000000" stroke-width="1.5"/>

                    <!-- Client Name (Larger) & Project Name (Smaller) Swapped -->
                    <?php
                      $docClientRaw = trim($docClient);
                      $clientLines = [$docClientRaw];
                      $clientSz = 22;
                      $clientDivY = 50;
                      $projDefY = 65;
                      $isClientMulti = false;
                      $clientStartY = 44;
                      $clientLastY = 44;

                      $calcEstW = function($txt, $sz) {
                        $str = strtoupper($txt);
                        $total = 0;
                        for ($i = 0; $i < strlen($str); $i++) {
                          $ch = $str[$i];
                          $r = ($ch === ' ') ? 0.28 : (($ch === '.' || $ch === ',' || $ch === ':' || $ch === ';' || $ch === '!' || $ch === '\'' || $ch === '|') ? 0.24 : (($ch === 'I') ? 0.26 : (($ch === 'M' || $ch === 'W') ? 0.78 : (($ch === 'J' || $ch === 'L') ? 0.44 : 0.56))));
                          $total += $r * $sz + 0.8;
                        }
                        return $total;
                      };

                      $greedyWrapPhp = function($text, $sz, $calcEstW) {
                        if ($calcEstW($text, $sz) <= 210) return ['fits' => true, 'lines' => [$text], 'single' => true];
                        $words = preg_split('/\s+/', trim($text));
                        if (count($words) <= 1) return ['fits' => false, 'lines' => [$text], 'single' => true];
                        $l1 = $words[0];
                        if ($calcEstW($l1, $sz) > 210) return ['fits' => false, 'lines' => [$text], 'single' => false];
                        $split = 1;
                        for ($i = 1; $i < count($words); $i++) {
                          $test = $l1 . ' ' . $words[$i];
                          if ($calcEstW($test, $sz) <= 210) {
                            $l1 = $test;
                            $split = $i + 1;
                          } else {
                            break;
                          }
                        }
                        if ($split >= count($words)) return ['fits' => true, 'lines' => [$l1], 'single' => true];
                        $l2 = implode(' ', array_slice($words, $split));
                        return ['fits' => ($calcEstW($l2, $sz) <= 210), 'lines' => [$l1, $l2], 'single' => false];
                      };

                      if ($calcEstW($docClientRaw, 22) <= 210) {
                        $clientLines = [$docClientRaw];
                        $clientSz = 22;
                      } else {
                        $sz = 18;
                        $bestRes = null;
                        while ($sz >= 11) {
                          $res = $greedyWrapPhp($docClientRaw, $sz, $calcEstW);
                          if ($res['fits']) {
                            $bestRes = ['lines' => $res['lines'], 'sz' => $sz];
                            break;
                          }
                          $sz -= 0.5;
                        }
                        if (!$bestRes) {
                          $fallback = $greedyWrapPhp($docClientRaw, 11, $calcEstW);
                          $bestRes = ['lines' => $fallback['lines'], 'sz' => 11];
                        }
                        $clientLines = $bestRes['lines'];
                        $clientSz = $bestRes['sz'];
                        if (count($clientLines) > 1) {
                          $isClientMulti = true;
                          $clientLh = max(14, round($clientSz * 0.95, 1));
                          $clientStartY = 32.5;
                          $clientLastY = round($clientStartY + $clientLh, 1);
                          $clientDivY = min(54, round($clientLastY + 4));
                          $projDefY = min(67, round($clientDivY + 13));
                        }
                      }

                      $maxLineW = $isClientMulti ? max($calcEstW($clientLines[0], $clientSz), $calcEstW($clientLines[1], $clientSz)) : $calcEstW($docClientRaw, $clientSz);
                      $divW = min(214, max(16, round($maxLineW, 1)));
                      $divX1 = round(452 - $divW / 2, 1);
                      $divX2 = round(452 + $divW / 2, 1);
                    ?>
                    <?php if ($isClientMulti): ?>
                    <text x="452" font-size="<?= $clientSz ?>" class="cond-black bebas-field interactive-field center-txt" letter-spacing="0.8" id="docFieldClientName" data-field-name="Client Name" data-raw-text="<?= htmlspecialchars($docClient) ?>" data-multiline="true">
                      <tspan x="452" y="<?= $clientStartY ?>"><?= htmlspecialchars($clientLines[0]) ?></tspan>
                      <tspan x="452" y="<?= $clientLastY ?>"><?= htmlspecialchars($clientLines[1]) ?></tspan>
                    </text>
                    <?php else: ?>
                    <text x="452" y="44" fill="#000000" font-size="<?= $clientSz ?>" class="cond-black bebas-field interactive-field center-txt" letter-spacing="0.8" id="docFieldClientName" data-field-name="Client Name" data-base-y="44" data-raw-text="<?= htmlspecialchars($docClient) ?>"><?= htmlspecialchars($docClient) ?></text>
                    <?php endif; ?>
                    <line x1="<?= $divX1 ?>" y1="<?= $clientDivY ?>" x2="<?= $divX2 ?>" y2="<?= $clientDivY ?>" stroke="#000000" stroke-width="1" id="docProjDividerLine"/>
                    <text x="452" y="<?= $projDefY ?>" fill="#000000" font-size="12" class="cond-bold bebas-field interactive-field center-txt" letter-spacing="0.5" id="docFieldProjectName" data-field-name="Project Name" data-base-y="<?= $projDefY ?>" data-raw-text="<?= htmlspecialchars($docProj) ?>"><?= htmlspecialchars($docProj) ?></text>

                    <!-- Row 3: Checkboxes -->
                    <g class="deh-check-grp" id="grpCheckInstall" style="cursor: pointer;" data-mode="Install">
                      <rect x="347" y="78.5" width="10" height="10" fill="<?= strtolower($docReleasingMode) === 'install' ? '#E10600' : '#FFFFFF' ?>" stroke="#000000" stroke-width="1.2" id="boxCheckInstall"/>
                      <text x="352" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckInstall" style="display:none;"></text>
                      <text x="361" y="87" fill="#000000" font-size="12" class="cond-bold">INSTALL <tspan font-size="10.5" class="chinese">安装</tspan></text>
                    </g>

                    <g class="deh-check-grp" id="grpCheckDeliver" style="cursor: pointer;" data-mode="Deliver">
                      <rect x="424" y="78.5" width="10" height="10" fill="<?= strtolower($docReleasingMode) === 'deliver' ? '#E10600' : '#FFFFFF' ?>" stroke="#000000" stroke-width="1.2" id="boxCheckDeliver"/>
                      <text x="429" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckDeliver" style="display:none;"></text>
                      <text x="438" y="87" fill="#000000" font-size="12" class="cond-bold">DELIVER <tspan font-size="10.5" class="chinese">送货</tspan></text>
                    </g>

                    <g class="deh-check-grp" id="grpCheckPickup" style="cursor: pointer;" data-mode="Pickup">
                      <rect x="498" y="78.5" width="10" height="10" fill="<?= (strtolower($docReleasingMode) === 'pickup' || empty($docReleasingMode)) ? '#E10600' : '#FFFFFF' ?>" stroke="#000000" stroke-width="1.2" id="boxCheckPickup"/>
                      <text x="503" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckPickup" style="display:none;"></text>
                      <text x="512" y="87" fill="#000000" font-size="12" class="cond-bold">PICK UP <tspan font-size="10.5" class="chinese">自取</tspan></text>
                    </g>

                    <!-- Vertical Divider 3 -->
                    <line x1="564" y1="0" x2="564" y2="96" stroke="#000000" stroke-width="2"/>

                    <!-- ========================================== -->
                    <!-- COLUMN 4: (564 to 822) -->
                    <!-- ========================================== -->
                    <rect x="564" y="0" width="97" height="43" fill="#000000"/>
                    <text x="612.5" y="13" fill="#FFFFFF" font-size="10.5" class="cond-bold center-txt" letter-spacing="0.2">ON-SITE INSTALLATION</text>
                    <text x="612.5" y="24.5" fill="#FFFFFF" font-size="10.5" class="cond-bold center-txt" letter-spacing="0.2">ENVIRONMENT OPTIONS</text>
                    <text x="612.5" y="36.5" fill="#FFFFFF" font-size="10" class="chinese center-txt">现场安装环境选项</text>

                    <!-- Wall Option Container (Clickable to switch wall type or leave blank) -->
                    <g id="docFieldEnvOption" class="interactive-field" data-field-name="Environment Option" data-env-type="<?= htmlspecialchars($docEnvType) ?>" style="cursor: pointer;" title="Click to select wall environment">
                      <rect x="661" y="0" width="161" height="43" fill="#FFFFFF"/>
                      <svg id="docEnvSvg" x="661" y="0" width="161" height="43" viewBox="0 0 10572.6 3022.83" preserveAspectRatio="xMidYMid meet">
                        <?= $docEnvSvgHtml ?>
                      </svg>
                    </g>

                    <line x1="564" y1="43" x2="822" y2="43" stroke="#000000" stroke-width="1.5"/>

                    <!-- Row 2: Contact Person -->
                    <text x="572" y="58" fill="#000000" font-size="12.5" class="cond-bold">CONTACT PERSON <tspan font-size="11" class="chinese">联络人</tspan>  :</text>
                    <rect x="716" y="47.5" width="98" height="15" rx="2" fill="#E8EBED"/>
                    <text x="765" y="59" fill="#000000" font-size="13" class="cond-bold bebas-field interactive-field center-txt" id="docFieldContactPerson" data-field-name="Contact Person" data-base-y="59" data-raw-text="<?= htmlspecialchars($docContact) ?>"><?= htmlspecialchars($docContact) ?></text>

                    <!-- Row 3: Contact Number -->
                    <text x="572" y="85" fill="#000000" font-size="12.5" class="cond-bold">CONTACT NUMBER <tspan font-size="11" class="chinese">联系电话</tspan>  :</text>
                    <rect x="716" y="74.5" width="98" height="15" rx="2" fill="#E8EBED"/>
                    <text x="765" y="86" fill="#000000" font-size="13" class="cond-bold bebas-field interactive-field center-txt" id="docFieldContactNumber" data-field-name="Contact Number" data-base-y="86" data-raw-text="<?= htmlspecialchars($docPhone) ?>"><?= htmlspecialchars($docPhone) ?></text>

                    <!-- Vertical Divider 4 -->
                    <line x1="822" y1="0" x2="822" y2="96" stroke="#000000" stroke-width="2"/>

                    <!-- ========================================== -->
                    <!-- COLUMN 5: (822 to 904) -->
                    <!-- ========================================== -->
                    <rect x="822" y="0" width="82" height="22" fill="#000000"/>
                    <text x="863" y="11" fill="#FFFFFF" font-size="9.5" class="cond-bold center-txt" letter-spacing="0.2">NUMBER OF INSTALLERS</text>
                    <text x="863" y="20" fill="#FFFFFF" font-size="9" class="chinese center-txt">安装人数</text>
                    <text x="863" y="38" fill="#000000" font-size="14" class="cond-bold bebas-field interactive-field center-txt" id="docFieldInstallers" data-field-name="Installers" data-base-y="38" data-raw-text="<?= htmlspecialchars($targetRecord['installers'] ?? '') ?>"><?= htmlspecialchars($targetRecord['installers'] ?? '') ?></text>

                    <line x1="822" y1="48" x2="904" y2="48" stroke="#000000" stroke-width="1.5"/>

                    <rect x="822" y="48" width="82" height="22" fill="#000000"/>
                    <text x="863" y="59" fill="#FFFFFF" font-size="9.5" class="cond-bold center-txt" letter-spacing="0.2">INSTALLATION DURATION</text>
                    <text x="863" y="68" fill="#FFFFFF" font-size="9" class="chinese center-txt">安装时长</text>
                    <text x="863" y="86" fill="#000000" font-size="14" class="cond-bold bebas-field interactive-field center-txt" id="docFieldDuration" data-field-name="Duration" data-base-y="86" data-raw-text="<?= htmlspecialchars($targetRecord['duration'] ?? '') ?>"><?= htmlspecialchars($targetRecord['duration'] ?? '') ?></text>

                    <!-- Outer Border Outline -->
                    <rect x="0" y="0" width="904" height="96" fill="none" stroke="#000000" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

            <!-- Live Adjustment Controls -->
            <div class="studio-card directive-extra-notes" style="margin-top: 20px;">
              <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px;">Live Directive Adjustment Controls</h4>
              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">Order Date (Directive Only)</label>
                  <input type="text" class="form-control" id="ctrlOrderDate" value="<?= htmlspecialchars($docOrderDate) ?>" placeholder="MM.DD.YYYY">
                </div>
                <div class="form-group">
                  <label class="form-label">Due Date (Directive Only)</label>
                  <input type="text" class="form-control" id="ctrlDueDate" value="<?= htmlspecialchars($docDueDate) ?>" placeholder="MM.DD.YYYY">
                </div>
                <div class="form-group">
                  <label class="form-label">Date to be Released (Directive Only)</label>
                  <input type="text" class="form-control" id="ctrlReleasingDate" value="<?= htmlspecialchars($docReleasingDate) ?>" placeholder="MM.DD.YYYY">
                </div>
                <div class="form-group col-span-2">
                  <label class="form-label">Delivery / Installation Address (Directive Only)</label>
                  <input type="text" class="form-control" id="ctrlAddress" value="<?= htmlspecialchars($docAddress) ?>" placeholder="Delivery or site address...">
                </div>
                <div class="form-group">
                  <label class="form-label">Number of Installers</label>
                  <input type="text" class="form-control" id="ctrlInstallers" value="<?= htmlspecialchars($targetRecord['installers'] ?? '') ?>">
                </div>
                <div class="form-group">
                  <label class="form-label">Installation Duration</label>
                  <input type="text" class="form-control" id="ctrlDuration" value="<?= htmlspecialchars($targetRecord['duration'] ?? '') ?>">
                </div>
                <div class="form-group">
                  <label class="form-label">Releasing Mode</label>
                  <select class="form-control" id="ctrlReleasingMode">
                    <option value="Install" <?= $docReleasingMode === 'Install' ? 'selected' : '' ?>>Install</option>
                    <option value="Deliver" <?= $docReleasingMode === 'Deliver' ? 'selected' : '' ?>>Deliver</option>
                    <option value="Pickup" <?= ($docReleasingMode === 'Pickup' || empty($docReleasingMode)) ? 'selected' : '' ?>>Pickup</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Placement (Location)</label>
                  <select class="form-control" id="ctrlLocation">
                    <option value="" <?= (!$isIndoor && !$isOutdoor) ? 'selected' : '' ?>>None (Unselected)</option>
                    <option value="Indoor" <?= ($isIndoor && !$isOutdoor) ? 'selected' : '' ?>>Indoor</option>
                    <option value="Outdoor" <?= (!$isIndoor && $isOutdoor) ? 'selected' : '' ?>>Outdoor</option>
                    <option value="Indoor & Outdoor" <?= ($isIndoor && $isOutdoor) ? 'selected' : '' ?>>Both (Indoor & Outdoor)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Environment Options (Wall Type)</label>
                  <select class="form-control" id="ctrlEnvType">
                    <option value="" <?= empty($docEnvType) ? 'selected' : '' ?>>Blank (None)</option>
                    <option value="concrete-wall" <?= $docEnvType === 'concrete-wall' ? 'selected' : '' ?>>Concrete Wall (水泥墙)</option>
                    <option value="glass-wall" <?= $docEnvType === 'glass-wall' ? 'selected' : '' ?>>Glass Wall (玻璃墙)</option>
                    <option value="iron-plated" <?= $docEnvType === 'iron-plated' ? 'selected' : '' ?>>Iron-plated / Iron Framework Wall (铁皮/铁架墙)</option>
                    <option value="woodenpanel" <?= $docEnvType === 'woodenpanel' ? 'selected' : '' ?>>Wooden Panel Wall (木板墙)</option>
                    <option value="acp" <?= $docEnvType === 'acp' ? 'selected' : '' ?>>ACP Wall (铝塑板墙)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Assigned In-Charge</label>
                  <input type="text" class="form-control" id="ctrlInCharge" value="<?= htmlspecialchars($docInCharge) ?>">
                  <label class="form-label" style="margin-top: 6px;">Drawn By (Artist)</label>
                  <input type="text" class="form-control" id="ctrlDrawnBy" value="<?= htmlspecialchars($docDrawnBy) ?>">
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <script>
    window.__INITIAL_DIRECTIVE_KEY = <?= json_encode($initialDirectiveKey) ?>;
    <?php
      $fontFile = dirname(__DIR__) . '/assets/fonts/BebasKai.otf';
      if (file_exists($fontFile)) {
        echo 'window.__BEBAS_KAI_B64 = ' . json_encode(base64_encode(file_get_contents($fontFile))) . ';';
      }
    ?>
  </script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>