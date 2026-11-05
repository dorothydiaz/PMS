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
$docReleasingDate = ($targetRecord && !empty($targetRecord['releasing_date'])) ? formatDotDate($targetRecord['releasing_date']) : '00.00.0000';
$docInCharge = $targetRecord ? strtoupper($targetRecord['sales_rep'] ?: '—') : '—';
$docDrawnBy = $targetRecord ? strtoupper($targetRecord['artist'] ?: '—') : '—';
$docReleasingMode = $targetRecord ? ($targetRecord['releasing_mode'] ?: 'Pickup') : 'Pickup';
$docAddress = ($targetRecord && !empty($targetRecord['complete_address']) && $targetRecord['complete_address'] !== 'N/A') ? $targetRecord['complete_address'] : (($targetRecord && !empty($targetRecord['location']) && $targetRecord['location'] !== 'N/A') ? $targetRecord['location'] : '-');
$docLookupVal = $targetRecord ? ($targetRecord['jo_number'] ?: $targetRecord['request_id'] ?: $targetRecord['project_name'] ?: '') : '';
$initialDirectiveKey = $targetRecord ? ($targetRecord['request_id'] ?: $targetRecord['jo_number'] ?: $targetRecord['id'] ?: '') : '';

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
            <div class="directive-canvas-wrap">
              <!-- Master Directive Landscape Letter Sheet (11in x 8.5in Ratio) -->
              <div class="directive-sheet-landscape" id="printableDirectiveDocument">
                <!-- Directive Top Quick Bar (Vector Ready) -->
                <div class="doc-top-bar no-print">
                  <div class="doc-top-quick-actions" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-sm" id="btnDirectiveCopySVG" title="Copy exact vector SVG to clipboard for Illustrator, Figma, or CorelDRAW">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                      Copy Vector SVG
                    </button>
                    <button class="btn btn-green btn-sm" id="btnDirectiveCopyPNG" title="Copy ultra high-res 4K graphic (3616 × 384 px) to clipboard for direct Ctrl+V pasting into CorelDRAW, Photoshop, Affinity, or Illustrator">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      Copy Image 4K (Ctrl+V)
                    </button>
                    <button class="btn btn-secondary btn-sm" id="btnDirectiveReset" title="Reset directive to default values">Reset</button>
                  </div>
                </div>

                <!-- Exact 1:1 Vector Production Directive Header (Pure Original SVG File at Actual Size) -->
                <div class="directive-exact-header-wrap" id="directiveGridTable">
                  <?php
                    $svgPath = dirname(__DIR__) . '/assets/img/directive-header-clear.svg';
                    if (file_exists($svgPath)) {
                      echo file_get_contents($svgPath);
                    }
                  ?>
                </div>
              </div>
            </div>

            <!-- Live Adjustment Controls -->
            <div class="studio-card directive-extra-notes" style="margin-top: 20px;">
              <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px;">Live Directive Adjustment Controls</h4>
              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">Number of Installers</label>
                  <input type="text" class="form-control" id="ctrlInstallers" value="2 Installers">
                </div>
                <div class="form-group">
                  <label class="form-label">Installation Duration</label>
                  <input type="text" class="form-control" id="ctrlDuration" value="1 Day (4 Hours)">
                </div>
                <div class="form-group">
                  <label class="form-label">Releasing Mode</label>
                  <select class="form-control" id="ctrlReleasingMode">
                    <option value="Install" <?= $docReleasingMode === 'Install' ? 'selected' : '' ?>>Install</option>
                    <option value="Deliver" <?= $docReleasingMode === 'Deliver' ? 'selected' : '' ?>>Deliver</option>
                    <option value="Pickup" <?= ($docReleasingMode === 'Pickup' || empty($docReleasingMode)) ? 'selected' : '' ?>>Pickup</option>
                  </select>
                </div>
                <div class="form-group col-span-2">
                  <label class="form-label">Installation / Fabrication Notes</label>
                  <textarea class="form-control" id="ctrlNotes" placeholder="Special fabrication requirements, acrylic thickness..."><?= htmlspecialchars($targetRecord['remarks'] ?? '') ?></textarea>
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
  </script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>