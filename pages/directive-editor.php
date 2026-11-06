<?php
/**
 * Sign Depot™ Operations PMS — Full-Pledge Vector Text Studio Editor (Corel / Illustrator Mode)
 * Location: pages/directive-editor.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
requirePermission('directives-details', 'r');

$pageTitle = 'Directive Vector Studio Editor';
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

function formatDotDateStudio($dateStr) {
    if (empty($dateStr) || $dateStr === '0000-00-00' || $dateStr === '—' || $dateStr === '-') return '00.00.0000';
    $t = strtotime($dateStr);
    return $t ? date('m.d.Y', $t) : '00.00.0000';
}

$docJo = $targetRecord ? ($targetRecord['jo_number'] ?: $targetRecord['request_id'] ?: '—') : '—';
$docProj = $targetRecord ? ($targetRecord['project_name'] ?: '—') : '—';
$docContact = ($targetRecord && !empty($targetRecord['contact_person']) && $targetRecord['contact_person'] !== 'N/A') ? $targetRecord['contact_person'] : '-';
$docPhone = ($targetRecord && !empty($targetRecord['contact_number']) && $targetRecord['contact_number'] !== 'N/A') ? $targetRecord['contact_number'] : '-';
$docDueDate = ($targetRecord && !empty($targetRecord['design_deadline'])) ? formatDotDateStudio($targetRecord['design_deadline']) : '00.00.0000';
$docClient = $targetRecord ? ($targetRecord['client'] ?: '—') : '—';
$docOrderDate = ($targetRecord && !empty($targetRecord['order_date'])) ? formatDotDateStudio($targetRecord['order_date']) : '00.00.0000';
$docLocation = $targetRecord ? ($targetRecord['location'] ?: '—') : '—';
$locLower = strtolower(trim($docLocation));
$isIndoor = ($locLower !== '—' && $locLower !== '-' && $locLower !== '' && (strpos($locLower, 'indoor') !== false || strpos($locLower, 'both') !== false));
$isOutdoor = ($locLower !== '—' && $locLower !== '-' && $locLower !== '' && (strpos($locLower, 'outdoor') !== false || strpos($locLower, 'both') !== false));
$docReleasingDate = ($targetRecord && !empty($targetRecord['releasing_date'])) ? formatDotDateStudio($targetRecord['releasing_date']) : '00.00.0000';
$docInCharge = $targetRecord ? strtoupper($targetRecord['sales_rep'] ?: '—') : '—';
$docDrawnBy = $targetRecord ? strtoupper($targetRecord['artist'] ?: '—') : '—';
$docReleasingMode = $targetRecord ? ($targetRecord['releasing_mode'] ?: 'Pickup') : 'Pickup';
$docAddress = ($targetRecord && !empty($targetRecord['complete_address']) && $targetRecord['complete_address'] !== 'N/A') ? $targetRecord['complete_address'] : (($targetRecord && !empty($targetRecord['location']) && $targetRecord['location'] !== 'N/A') ? $targetRecord['location'] : '-');
$initialDirectiveKey = $targetRecord ? ($targetRecord['request_id'] ?: $targetRecord['jo_number'] ?: $targetRecord['id'] ?: '') : '';
$fontFile = dirname(__DIR__) . '/assets/fonts/BebasKai.otf';
$bebasB64 = file_exists($fontFile) ? base64_encode(file_get_contents($fontFile)) : '';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="content-wrapper studio-fullpage-wrapper" style="padding: 0; background: #0F1216; overflow: hidden; height: calc(100vh - 64px); display: flex; flex-direction: column;">
  <!-- Studio Top Menu & Navigation Bar -->
  <header class="studio-top-nav">
    <div class="studio-nav-left">
      <a href="directives-details.php<?= !empty($targetIdentifier) ? '?id=' . urlencode($targetIdentifier) : '' ?>" class="btn-studio-back" title="Exit Studio & Return to Directive Document">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Directives Sheet
      </a>
      <div class="studio-nav-divider"></div>
      <div class="studio-branding-badge">
        <span class="studio-badge-tag">COREL / ILLUSTRATOR MODE</span>
        <span class="studio-proj-title"><?= htmlspecialchars($docJo) ?> — <?= htmlspecialchars($docProj) ?></span>
      </div>
    </div>

    <!-- Zoom & Canvas Controls -->
    <div class="studio-nav-center">
      <button class="btn-studio-icon" id="studioZoomOut" title="Zoom Out (Ctrl+Minus)">−</button>
      <select class="studio-zoom-select" id="studioZoomSelect" title="Zoom Level">
        <option value="0.75">75%</option>
        <option value="1" selected>100%</option>
        <option value="1.25">125%</option>
        <option value="1.5">150% (Recommended)</option>
        <option value="1.75">175%</option>
        <option value="2">200% (2x HD)</option>
        <option value="2.5">250%</option>
        <option value="3">300% (3x Ultra)</option>
      </select>
      <button class="btn-studio-icon" id="studioZoomIn" title="Zoom In (Ctrl+Plus)">+</button>
      <button class="btn-studio-text" id="studioZoomReset" title="Reset Zoom to 100%">100%</button>
      <button class="btn-studio-text" id="studioZoomFit" title="Fit Artboard to Viewport">Fit</button>
    </div>

    <!-- Export & Sync Actions -->
    <div class="studio-nav-right">
      <button class="btn btn-sm btn-primary" id="studioCopySVG" title="Copy clean Vector SVG code for Adobe Illustrator, Figma, or CorelDRAW">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        Copy Vector SVG
      </button>
      <button class="btn btn-sm btn-green" id="studioCopyPNG" title="Copy 4K Ultra-Sharp Bitmap (3616×384) to clipboard">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        Copy Image 4K
      </button>
      <button class="btn btn-sm btn-danger" id="studioResetAll" title="Reset all custom sizes and positions to template defaults">
        ↺ Reset Defaults
      </button>
    </div>
  </header>

  <!-- Corel / Illustrator Property Inspector Ribbon (Docked Top Toolbar) -->
  <section class="studio-property-inspector" id="studioPropertyInspector">
    <!-- Active Object Selector -->
    <div class="inspector-group">
      <span class="inspector-label">OBJECT:</span>
      <select class="inspector-select" id="studioFieldSelect" title="Select active text element to transform">
        <option value="docFieldProjectName">Project Name</option>
        <option value="docFieldJoNumber">JO Number</option>
        <option value="docFieldClientName">Client Name</option>
        <option value="docFieldDueDate">Due Date</option>
        <option value="docFieldOrderDate">Order Date</option>
        <option value="docFieldReleasingDate">Release Date</option>
        <option value="docFieldInCharge">In-Charge</option>
        <option value="docFieldDrawnBy">Drawn By</option>
        <option value="docFieldAddress">Address</option>
        <option value="docFieldContactPerson">Contact Person</option>
        <option value="docFieldContactNumber">Contact Number</option>
        <option value="docFieldInstallers">Installers</option>
        <option value="docFieldDuration">Duration</option>
      </select>
    </div>

    <div class="inspector-divider"></div>

    <!-- Transform Controls: X, Y, W, H -->
    <div class="inspector-group">
      <span class="inspector-label">X:</span>
      <input type="number" class="inspector-input-num" id="propPosX" title="X Position (pixels)" step="1">
      <span class="inspector-label" style="margin-left:6px;">Y:</span>
      <input type="number" class="inspector-input-num" id="propPosY" title="Y Position (pixels)" step="1">
      <span class="inspector-label" style="margin-left:6px;">W:</span>
      <input type="number" class="inspector-input-num" id="propBoxW" title="Textbox Width (pixels)" min="20" max="800" step="1">
      <span class="inspector-label" style="margin-left:6px;">H:</span>
      <input type="number" class="inspector-input-num" id="propBoxH" title="Textbox Height (pixels)" min="10" max="300" step="1">
    </div>

    <div class="inspector-divider"></div>

    <!-- Typography Controls: Bebas Kai, Font Size, Align -->
    <div class="inspector-group">
      <span class="inspector-label">FONT:</span>
      <span class="inspector-font-badge">Bebas Kai</span>

      <span class="inspector-label" style="margin-left:6px;">SIZE:</span>
      <button class="btn-inspector-step" id="propFontDec" title="Decrease font size">A−</button>
      <input type="number" class="inspector-input-num" id="propFontSize" min="6" max="72" value="22" title="Font size in px">
      <button class="btn-inspector-step" id="propFontInc" title="Increase font size">A+</button>
    </div>

    <div class="inspector-divider"></div>

    <!-- Text Alignment -->
    <div class="inspector-group">
      <span class="inspector-label">ALIGN:</span>
      <div class="inspector-btn-group">
        <button class="btn-inspector-toggle" id="propAlignLeft" title="Align Left">Left</button>
        <button class="btn-inspector-toggle active" id="propAlignCenter" title="Align Center">Center</button>
        <button class="btn-inspector-toggle" id="propAlignRight" title="Align Right">Right</button>
      </div>
    </div>

    <div class="inspector-divider"></div>

    <!-- Text Color Swatches -->
    <div class="inspector-group">
      <span class="inspector-label">COLOR:</span>
      <div class="inspector-swatches">
        <button class="swatch-btn swatch-black" data-color="#000000" title="Pure Black (#000000)"></button>
        <button class="swatch-btn swatch-white" data-color="#FFFFFF" title="Crisp White (#FFFFFF)"></button>
        <button class="swatch-btn swatch-red" data-color="#E10600" title="Sign Depot Red (#E10600)"></button>
        <button class="swatch-btn swatch-slate" data-color="#475569" title="Slate Gray (#475569)"></button>
      </div>
    </div>
  </section>

  <!-- Studio Workspace Main Split (Artboard Canvas Viewport + Right Inspector Sidebar) -->
  <div class="studio-workspace-body">
    <!-- Center Artboard Viewport (Infinite CAD Canvas with rulers & center artboard) -->
    <div class="studio-artboard-viewport" id="studioArtboardViewport">
      <div class="studio-artboard-container" id="studioArtboardContainer">
        <!-- 904 x 96 Vector Directive Artboard Wrapper -->
        <div class="studio-artboard-artwrap" id="studioArtboardWrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 904 96" width="904" height="96" id="directiveExactSvg" style="background:#FFFFFF; display:block; box-shadow: 0 10px 40px rgba(0,0,0,0.45);">
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
                text { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; }
                .bebas-field { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif !important; cursor: pointer; user-select: text; }
                .cond-black { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: 900; }
                .cond-bold { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: 800; }
                .cond-semi { font-family: 'Bebas Kai', 'BebasKai', 'Archivo', 'Oswald', sans-serif; font-weight: 700; }
                .chinese { font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', sans-serif; font-weight: bold; }
                tspan.chinese { font-family: 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', sans-serif; font-weight: bold; }
                .center-txt { text-anchor: middle; }
                .interactive-field { cursor: pointer; transition: opacity 0.15s; }
                .interactive-field:hover { opacity: 0.8; }
                .active-svg-cell { outline: 2px dashed #E10600; fill: #E10600 !important; }
              </style>
            </defs>

            <!-- Base Canvas -->
            <rect x="0" y="0" width="904" height="96" fill="#FFFFFF"/>

            <!-- ========================================== -->
            <!-- COLUMN 1: (0 to 225) -->
            <!-- ========================================== -->
            <rect x="0" y="0" width="225" height="33" fill="#000000"/>
            <text x="14" y="24" fill="#FFFFFF" font-size="20" class="cond-black" letter-spacing="0.5">JO#:</text>
            <text x="56" y="24" fill="#FFFFFF" font-size="20" class="cond-black bebas-field interactive-field" letter-spacing="0.5" id="docFieldJoNumber" data-field-name="JO Number" data-base-y="24" data-raw-text="<?= htmlspecialchars($docJo) ?>"><?= htmlspecialchars($docJo) ?></text>

            <line x1="0" y1="33" x2="225" y2="33" stroke="#000000" stroke-width="1.5"/>
            <text x="8" y="47" fill="#000000" font-size="11.5" class="cond-bold">IN CHARGE<tspan font-size="10" class="chinese">负责人</tspan>  :</text>
            <text x="218" y="47" fill="#000000" font-size="13" class="cond-bold bebas-field interactive-field" text-anchor="end" id="docFieldInCharge" data-field-name="In-Charge" data-base-y="47" data-raw-text="<?= htmlspecialchars($docInCharge) ?>"><?= htmlspecialchars($docInCharge) ?></text>

            <line x1="0" y1="54" x2="225" y2="54" stroke="#000000" stroke-width="1.5"/>
            <text x="8" y="68" fill="#000000" font-size="11.5" class="cond-bold">DRAWN BY <tspan font-size="10" class="chinese">通过绘制</tspan>  :</text>
            <text x="218" y="68" fill="#000000" font-size="13" class="cond-bold bebas-field interactive-field" text-anchor="end" id="docFieldDrawnBy" data-field-name="Drawn By" data-base-y="68" data-raw-text="<?= htmlspecialchars($docDrawnBy) ?>"><?= htmlspecialchars($docDrawnBy) ?></text>

            <line x1="0" y1="75" x2="225" y2="75" stroke="#000000" stroke-width="1.5"/>
            <g transform="translate(7, 80) scale(0.65)">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#000000"/>
            </g>
            <text x="21" y="89.5" fill="#000000" font-size="10.5" class="cond-bold">ADDRESS <tspan font-size="9.5" class="chinese">地址</tspan>  :</text>
            <rect x="100" y="79" width="120" height="13.5" rx="2" fill="#E8EBED"/>
            <text x="160" y="89.5" fill="#000000" font-size="10" class="cond-bold bebas-field interactive-field center-txt" id="docFieldAddress" data-field-name="Address" data-base-y="89.5" data-raw-text="<?= htmlspecialchars($docAddress) ?>"><?= htmlspecialchars($docAddress) ?></text>

            <line x1="225" y1="0" x2="225" y2="96" stroke="#000000" stroke-width="2"/>

            <!-- ========================================== -->
            <!-- COLUMN 2: (225 to 340) -->
            <!-- ========================================== -->
            <text x="282.5" y="14" fill="#000000" font-size="10" class="cond-bold center-txt">ORDER DATE <tspan font-size="9" class="chinese">订购日期</tspan></text>
            <text x="282.5" y="27" fill="#000000" font-size="11.5" class="cond-bold bebas-field interactive-field center-txt" id="docFieldOrderDate" data-field-name="Order Date" data-base-y="27" data-raw-text="<?= htmlspecialchars($docOrderDate) ?>"><?= htmlspecialchars($docOrderDate) ?></text>

            <line x1="225" y1="33" x2="340" y2="33" stroke="#000000" stroke-width="1.5"/>
            <rect x="225" y="33" width="115" height="32" fill="#000000"/>
            <text x="282.5" y="46" fill="#FFFFFF" font-size="10.5" class="cond-bold center-txt" letter-spacing="0.5">DUE DATE</text>
            <text x="282.5" y="59" fill="#FFFFFF" font-size="12" class="cond-bold bebas-field interactive-field center-txt" id="docFieldDueDate" data-field-name="Due Date" data-base-y="59" data-raw-text="<?= htmlspecialchars($docDueDate) ?>"><?= htmlspecialchars($docDueDate) ?></text>

            <line x1="225" y1="65" x2="340" y2="65" stroke="#000000" stroke-width="1.5"/>
            <text x="282.5" y="76.5" fill="#000000" font-size="9.5" class="cond-bold center-txt" letter-spacing="0.2">DATE TO BE RELEASE</text>
            <text x="282.5" y="89.5" fill="#000000" font-size="11.5" class="cond-bold bebas-field interactive-field center-txt" id="docFieldReleasingDate" data-field-name="Release Date" data-base-y="89.5" data-raw-text="<?= htmlspecialchars($docReleasingDate) ?>"><?= htmlspecialchars($docReleasingDate) ?></text>

            <line x1="340" y1="0" x2="340" y2="96" stroke="#000000" stroke-width="2"/>

            <!-- ========================================== -->
            <!-- COLUMN 3: (340 to 564) -->
            <!-- ========================================== -->
            <!-- Indoor & Outdoor Header Blocks -->
            <rect x="340" y="0" width="112" height="18" fill="<?= $isIndoor ? '#E10600' : '#FFFFFF' ?>" id="bgIndoor" style="cursor: pointer;"/>
            <rect x="452" y="0" width="112" height="18" fill="<?= $isOutdoor ? '#E10600' : '#FFFFFF' ?>" id="bgOutdoor" style="cursor: pointer;"/>
            <line x1="452" y1="0" x2="452" y2="18" stroke="#000000" stroke-width="1"/>
            <text x="396" y="13" fill="<?= $isIndoor ? '#FFFFFF' : '#000000' ?>" font-size="11.5" class="cond-black center-txt" letter-spacing="0.5" id="lblIndoor" style="cursor: pointer; user-select: none;">INDOOR</text>
            <text x="508" y="13" fill="<?= $isOutdoor ? '#FFFFFF' : '#000000' ?>" font-size="11.5" class="cond-black center-txt" letter-spacing="0.5" id="lblOutdoor" style="cursor: pointer; user-select: none;">OUTDOOR</text>

            <line x1="340" y1="18" x2="564" y2="18" stroke="#000000" stroke-width="1.5"/>

            <text x="452" y="44" fill="#000000" font-size="22" class="cond-black bebas-field interactive-field center-txt" letter-spacing="0.8" id="docFieldProjectName" data-field-name="Project Name" data-base-y="44" data-raw-text="<?= htmlspecialchars($docProj) ?>"><?= htmlspecialchars($docProj) ?></text>
            <line x1="412" y1="50" x2="492" y2="50" stroke="#000000" stroke-width="1" id="docProjDividerLine"/>
            <text x="452" y="65" fill="#000000" font-size="12" class="cond-bold bebas-field interactive-field center-txt" letter-spacing="0.5" id="docFieldClientName" data-field-name="Client Name" data-base-y="65" data-raw-text="<?= htmlspecialchars($docClient) ?>"><?= htmlspecialchars($docClient) ?></text>

            <line x1="340" y1="73" x2="564" y2="73" stroke="#000000" stroke-width="1.5"/>

            <g class="deh-check-grp" id="grpCheckInstall" style="cursor: pointer;" data-mode="Install">
              <rect x="347" y="78.5" width="10" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="1.2"/>
              <text x="352" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckInstall"><?= strtolower($docReleasingMode) === 'install' ? '✓' : '' ?></text>
              <text x="361" y="87" fill="#000000" font-size="10.5" class="cond-bold">INSTALL <tspan font-size="9" class="chinese">安装</tspan></text>
            </g>

            <g class="deh-check-grp" id="grpCheckDeliver" style="cursor: pointer;" data-mode="Deliver">
              <rect x="424" y="78.5" width="10" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="1.2"/>
              <text x="429" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckDeliver"><?= strtolower($docReleasingMode) === 'deliver' ? '✓' : '' ?></text>
              <text x="438" y="87" fill="#000000" font-size="10.5" class="cond-bold">DELIVER <tspan font-size="9" class="chinese">送货</tspan></text>
            </g>

            <g class="deh-check-grp" id="grpCheckPickup" style="cursor: pointer;" data-mode="Pickup">
              <rect x="498" y="78.5" width="10" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="1.2"/>
              <text x="503" y="87.5" fill="#E10600" font-size="11" font-weight="900" class="center-txt" id="docFieldCheckPickup"><?= (strtolower($docReleasingMode) === 'pickup' || empty($docReleasingMode)) ? '✓' : '' ?></text>
              <text x="512" y="87" fill="#000000" font-size="10.5" class="cond-bold">PICK UP <tspan font-size="9" class="chinese">自取</tspan></text>
            </g>

            <line x1="564" y1="0" x2="564" y2="96" stroke="#000000" stroke-width="2"/>

            <!-- ========================================== -->
            <!-- COLUMN 4: (564 to 822) -->
            <!-- ========================================== -->
            <rect x="564" y="0" width="97" height="43" fill="#000000"/>
            <text x="612.5" y="12" fill="#FFFFFF" font-size="8.5" class="cond-bold center-txt" letter-spacing="0.2">ON-SITE INSTALLATION</text>
            <text x="612.5" y="22" fill="#FFFFFF" font-size="8.5" class="cond-bold center-txt" letter-spacing="0.2">ENVIRONMENT OPTIONS</text>
            <text x="612.5" y="35" fill="#FFFFFF" font-size="8.5" class="chinese center-txt">现场安装环境选项</text>

            <rect x="674" y="10" width="4.5" height="23" fill="#E10600"/>
            <text x="684" y="21" fill="#000000" font-size="11.5" class="cond-bold" letter-spacing="0.3">CONCRETE WALL</text>
            <text x="684" y="32.5" fill="#000000" font-size="9.5" class="chinese">水泥墙</text>

            <line x1="564" y1="43" x2="822" y2="43" stroke="#000000" stroke-width="1.5"/>

            <text x="572" y="58" fill="#000000" font-size="10.5" class="cond-bold">CONTACT PERSON <tspan font-size="9.5" class="chinese">联络人</tspan>  :</text>
            <rect x="716" y="47.5" width="98" height="15" rx="2" fill="#E8EBED"/>
            <text x="765" y="59" fill="#000000" font-size="11" class="cond-bold bebas-field interactive-field center-txt" id="docFieldContactPerson" data-field-name="Contact Person" data-base-y="59" data-raw-text="<?= htmlspecialchars($docContact) ?>"><?= htmlspecialchars($docContact) ?></text>

            <line x1="564" y1="70" x2="822" y2="70" stroke="#000000" stroke-width="1.5"/>

            <text x="572" y="85" fill="#000000" font-size="10.5" class="cond-bold">CONTACT NUMBER <tspan font-size="9.5" class="chinese">联系电话</tspan>  :</text>
            <rect x="716" y="74.5" width="98" height="15" rx="2" fill="#E8EBED"/>
            <text x="765" y="86" fill="#000000" font-size="11" class="cond-bold bebas-field interactive-field center-txt" id="docFieldContactNumber" data-field-name="Contact Number" data-base-y="86" data-raw-text="<?= htmlspecialchars($docPhone) ?>"><?= htmlspecialchars($docPhone) ?></text>

            <line x1="822" y1="0" x2="822" y2="96" stroke="#000000" stroke-width="2"/>

            <!-- ========================================== -->
            <!-- COLUMN 5: (822 to 904) -->
            <!-- ========================================== -->
            <rect x="822" y="0" width="82" height="22" fill="#000000"/>
            <text x="863" y="10.5" fill="#FFFFFF" font-size="7.5" class="cond-bold center-txt" letter-spacing="0.2">NUMBER OF INSTALLERS</text>
            <text x="863" y="19" fill="#FFFFFF" font-size="7.5" class="chinese center-txt">安装人数</text>
            <text x="863" y="38" fill="#000000" font-size="12" class="cond-bold bebas-field interactive-field center-txt" id="docFieldInstallers" data-field-name="Installers" data-base-y="38" data-raw-text="<?= htmlspecialchars($targetRecord['installers'] ?? '2 Installers') ?>"><?= htmlspecialchars($targetRecord['installers'] ?? '2 Installers') ?></text>

            <line x1="822" y1="48" x2="904" y2="48" stroke="#000000" stroke-width="1.5"/>

            <rect x="822" y="48" width="82" height="22" fill="#000000"/>
            <text x="863" y="58.5" fill="#FFFFFF" font-size="7.5" class="cond-bold center-txt" letter-spacing="0.2">INSTALLATION DURATION</text>
            <text x="863" y="67" fill="#FFFFFF" font-size="7.5" class="chinese center-txt">安装时长</text>
            <text x="863" y="86" fill="#000000" font-size="12" class="cond-bold bebas-field interactive-field center-txt" id="docFieldDuration" data-field-name="Duration" data-base-y="86" data-raw-text="<?= htmlspecialchars($targetRecord['duration'] ?? '1 Day (4 Hours)') ?>"><?= htmlspecialchars($targetRecord['duration'] ?? '1 Day (4 Hours)') ?></text>

            <rect x="0" y="0" width="904" height="96" fill="none" stroke="#000000" stroke-width="2"/>
          </svg>

          <!-- Corel / Illustrator 8-Handle Transform Selection Box Overlay -->
          <div class="studio-transform-box" id="studioTransformBox" style="display:none;">
            <div class="transform-drag-area" title="Drag to move text position"></div>
            <!-- 8 Transform Handles -->
            <div class="studio-transform-handle handle-nw" data-handle="nw" title="Resize Top-Left"></div>
            <div class="studio-transform-handle handle-ne" data-handle="ne" title="Resize Top-Right"></div>
            <div class="studio-transform-handle handle-se" data-handle="se" title="Resize Bottom-Right"></div>
            <div class="studio-transform-handle handle-sw" data-handle="sw" title="Resize Bottom-Left"></div>
            <div class="studio-transform-handle handle-n"  data-handle="n"  title="Resize Height (Top)"></div>
            <div class="studio-transform-handle handle-s"  data-handle="s"  title="Resize Height (Bottom)"></div>
            <div class="studio-transform-handle handle-w"  data-handle="w"  title="Resize Width (Left)"></div>
            <div class="studio-transform-handle handle-e"  data-handle="e"  title="Resize Width (Right)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right-Side Corel / Illustrator Inspector & Elements Sidebar -->
    <aside class="studio-layers-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">TEXT ELEMENTS & LAYERS</span>
        <span class="sidebar-tag">13 NODES</span>
      </div>

      <!-- Quick Edit Content Area -->
      <div class="sidebar-card">
        <label class="sidebar-label" for="studioActiveTextInput">EDIT TEXT (ENTER FOR NEXT LINE):</label>
        <textarea class="sidebar-textarea" id="studioActiveTextInput" rows="3" placeholder="Type text here..." spellcheck="false"></textarea>
      </div>

      <!-- Layers List -->
      <div class="sidebar-layers-list" id="studioLayersList">
        <!-- Generated by JavaScript -->
      </div>
    </aside>
  </div>
</div>

<script>
  window.__INITIAL_DIRECTIVE_KEY = <?= json_encode($initialDirectiveKey) ?>;
  <?php
    if (file_exists($fontFile)) {
      echo 'window.__BEBAS_KAI_B64 = ' . json_encode(base64_encode(file_get_contents($fontFile))) . ';';
    }
  ?>
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
