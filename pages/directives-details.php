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
              <p>Printable Sign Depot production directive generator, template editor & attachments</p>
            </div>
            <div class="section-actions">
              <button class="btn btn-secondary" id="btnDirectivesLoadSampleUral">Load Sample: URAL (P260701373)</button>
            </div>
          </div>

          <div class="directive-lookup-card">
            <label style="font-size: 13px; font-weight: 800; color: #0F172A;">
              Search by J.O. Number, Project Name, or Request ID
            </label>
            <div class="lookup-flex">
              <div class="lookup-input-wrap">
                <svg class="lookup-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="lookup-input" id="directiveLookupInput" placeholder="e.g. P260701373, URAL, or LR-26-1230..." autocomplete="off">
                <div class="autocomplete-box" id="directiveAutocompleteBox"></div>
              </div>
              <button class="btn btn-primary" id="btnDirectiveSearch">Load Job</button>
              <button class="btn btn-secondary" id="btnDirectiveClear">Clear</button>
              <span id="directiveLookupStatus" style="font-size: 13px; font-weight: 700; margin-left: 8px;"></span>
            </div>
          </div>

          <div class="directive-toolbar no-print">
            <div class="directive-tabs">
              <button class="tab-btn active" data-subtab="tab-directive-preview" id="btnTabPreview">Directive Document</button>
              <button class="tab-btn" data-subtab="tab-template-editor" id="btnTabEditor">Template Editor</button>
              <button class="tab-btn" data-subtab="tab-attachments" id="btnTabAttachments">Attachments (<span id="attachmentsCountBadge">3</span>)</button>
            </div>
          </div>

          <!-- SUBTAB 1: DIRECTIVE PREVIEW (Exact Sign Depot Document Layout) -->
          <div class="directive-subtab-content active" id="tab-directive-preview">
            <div class="directive-canvas-wrap">
              <!-- Master Directive Landscape Letter Sheet (11in x 8.5in Ratio) -->
              <div class="directive-sheet-landscape" id="printableDirectiveDocument">
                <!-- Directive Top Quick Bar (Vector Ready & Text Controls) -->
                <div class="doc-top-bar no-print">
                  <div class="doc-top-quick-actions" style="display: flex; gap: 12px; align-items: center;">
                    <!-- Customized Per-Cell Font Size Controls -->
                    <div class="doc-font-controls" id="cellFontControls" title="Customize font size for the selected cell">
                      <span class="font-ctrl-cell-badge" id="selectedCellBadge" title="Click any cell in the table below to customize its font size">Select Any Cell</span>
                      <button type="button" class="btn-font-scale" id="btnCellFontDec" title="Decrease font size of selected cell (Ctrl+[)">A-</button>
                      <input type="number" id="cellFontSizeInput" class="cell-font-size-input" value="30" min="6" max="72" step="1" title="Type exact font size in px">
                      <span class="font-ctrl-unit">px</span>
                      <button type="button" class="btn-font-scale" id="btnCellFontInc" title="Increase font size of selected cell (Ctrl+])">A+</button>
                      <button type="button" class="btn-font-scale" id="btnCellFontReset" title="Reset this cell to default font size">Reset</button>
                    </div>

                    <button class="btn btn-green btn-sm" id="btnDirectiveCopyPNG" title="Copy ultra high-res 4K graphic (4864 × 648 px) to clipboard for direct Ctrl+V pasting into CorelDRAW, Photoshop, Affinity, or Illustrator. (Hold Shift to download .png file)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      Copy Image 4K (Ctrl+V)
                    </button>
                    <button class="btn btn-secondary btn-sm" id="btnDirectiveReset" title="Reset directive to default values">Reset</button>
                  </div>
                </div>

                <!-- Main Directive Grid Table (Exact Pixel Match to Photos: 10.44% | 16.61% | 33.31% | 8.72% | 16.61% | 14.31%) -->
                <table class="doc-grid-table" id="directiveGridTable">
                  <colgroup>
                    <col style="width: 10.44%;"> <!-- Col 1: JO#, DUE DATE, LOCATION labels -->
                    <col style="width: 16.61%;"> <!-- Col 2: P260701373, JULY 30, 2026, Location values -->
                    <col style="width: 33.31%;"> <!-- Col 3: URAL, PAU ACILAC, IN-CHARGE/DRAWN BY -->
                    <col style="width: 8.72%;">  <!-- Col 4: CONTACT PERSON, CONTACT NUMBER, etc. -->
                    <col style="width: 16.61%;"> <!-- Col 5: Contact, Phone, Dates, Mode, Address values -->
                    <col style="width: 14.31%;"> <!-- Col 6: NUMBER OF INSTALLERS / INSTALLATION DURATION -->
                  </colgroup>
                  <tbody>
                    <!-- ROW 1 -->
                    <tr>
                      <td rowspan="2" class="doc-label-cell doc-cell-center doc-jo-lbl" id="docFieldJoLabel" contenteditable="true" title="Click to edit JO# Label">JO#:</td>
                      <td rowspan="2" class="doc-value-cell doc-cell-center doc-jo-val" id="docFieldJoNumber" contenteditable="true" title="Click to edit JO Number">P260701373</td>
                      <td rowspan="2" class="doc-value-cell doc-cell-center doc-proj-cell" id="docFieldProjectName" contenteditable="true" title="Click to edit Project Name">URAL</td>
                      <td class="doc-label-cell" id="docFieldContactPersonLabel" contenteditable="true" title="Click to edit Label">CONTACT PERSON:</td>
                      <td class="doc-value-cell" id="docFieldContactPerson" contenteditable="true" title="Click to edit">-</td>
                      <td class="doc-label-cell doc-cell-center" id="docFieldInstallersLabel" contenteditable="true" title="Click to edit Label">NUMBER OF INSTALLERS</td>
                    </tr>

                    <!-- ROW 2 -->
                    <tr>
                      <td class="doc-label-cell" id="docFieldContactNumberLabel" contenteditable="true" title="Click to edit Label">CONTACT NUMBER:</td>
                      <td class="doc-value-cell" id="docFieldContactNumber" contenteditable="true" title="Click to edit">639178805364</td>
                      <td rowspan="2" class="doc-value-cell doc-cell-center doc-box-val" id="docFieldInstallers" contenteditable="true" title="Click to edit Installers">2 Installers</td>
                    </tr>

                    <!-- ROW 3 -->
                    <tr>
                      <td class="doc-label-cell doc-cell-center" id="docFieldDueDateLabel" contenteditable="true" title="Click to edit Label">DUE DATE:</td>
                      <td class="doc-value-cell doc-cell-center doc-date-val" id="docFieldDueDate" contenteditable="true" title="Click to edit Due Date">JULY 30, 2026</td>
                      <td rowspan="2" class="doc-value-cell doc-cell-center doc-client-cell" id="docFieldClientName" contenteditable="true" title="Click to edit Client Name">PAU ACILAC</td>
                      <td class="doc-label-cell" id="docFieldOrderDateLabel" contenteditable="true" title="Click to edit Label">ORDER DATE:</td>
                      <td class="doc-value-cell" id="docFieldOrderDate" contenteditable="true" title="Click to edit">23/10/2026</td>
                    </tr>

                    <!-- ROW 4 -->
                    <tr>
                      <td class="doc-label-cell doc-cell-center" id="docFieldLocationLabel" contenteditable="true" title="Click to edit Label">LOCATION:</td>
                      <td class="doc-value-cell doc-cell-center" id="docFieldLocation" contenteditable="true" title="Click to edit">Manila Branch</td>
                      <td class="doc-label-cell" id="docFieldReleasingDateLabel" contenteditable="true" title="Click to edit Label">RELEASING DATE:</td>
                      <td class="doc-value-cell" id="docFieldReleasingDate" contenteditable="true" title="Click to edit">JULY 30, 2026</td>
                      <td class="doc-label-cell doc-cell-center" id="docFieldDurationLabel" contenteditable="true" title="Click to edit Label">INSTALLATION DURATION</td>
                    </tr>

                    <!-- ROW 5 -->
                    <tr>
                      <td colspan="2" rowspan="2" class="doc-value-cell doc-logo-cell">
                        <div class="doc-triple-logos">
                          <img src="../assets/img/sign-depot-logo.png" alt="Sign Depot Logo">
                          <img src="../assets/img/sign-depot-logo.png" alt="Sign Depot Logo">
                          <img src="../assets/img/sign-depot-logo.png" alt="Sign Depot Logo">
                        </div>
                      </td>
                      <td rowspan="2" style="padding: 0; vertical-align: stretch;">
                        <table class="doc-personnel-table">
                          <colgroup>
                            <col style="width: 50%;">
                            <col style="width: 50%;">
                          </colgroup>
                          <tbody>
                            <tr>
                              <td class="doc-label-cell doc-cell-center" id="docFieldInChargeLabel" contenteditable="true" title="Click to edit Label" style="border-bottom: 1.5px solid #000000; border-right: 1.5px solid #000000; height: 26px;">IN-CHARGE</td>
                              <td class="doc-label-cell doc-cell-center" id="docFieldDrawnByLabel" contenteditable="true" title="Click to edit Label" style="border-bottom: 1.5px solid #000000; height: 26px;">DRAWN BY:</td>
                            </tr>
                            <tr>
                              <td class="doc-value-cell doc-cell-center doc-person-val" style="border-right: 1.5px solid #000000; height: 26px;" id="docFieldInCharge" contenteditable="true" title="Click to edit In-Charge">Dona</td>
                              <td class="doc-value-cell doc-cell-center doc-person-val" style="height: 26px;" id="docFieldDrawnBy" contenteditable="true" title="Click to edit Drawn By">Glen</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td class="doc-label-cell" id="docFieldReleasingModeLabel" contenteditable="true" title="Click to edit Label">RELEASING MODE:</td>
                      <td class="doc-value-cell" id="docFieldReleasingMode" contenteditable="true" title="Click to edit">Pickup</td>
                      <td rowspan="2" class="doc-value-cell doc-cell-center doc-box-val" id="docFieldDuration" contenteditable="true" title="Click to edit Duration">1 Day (4 Hours)</td>
                    </tr>

                    <!-- ROW 6 -->
                    <tr>
                      <td class="doc-label-cell" id="docFieldAddressLabel" contenteditable="true" title="Click to edit Label">ADDRESS:</td>
                      <td class="doc-value-cell" id="docFieldAddress" contenteditable="true" title="Click to edit">Manila Branch</td>
                    </tr>
                  </tbody>
                </table>
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
                    <option value="Install">Install</option>
                    <option value="Deliver">Deliver</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>
                <div class="form-group col-span-2">
                  <label class="form-label">Installation / Fabrication Notes</label>
                  <textarea class="form-control" id="ctrlNotes" placeholder="Special fabrication requirements, acrylic thickness..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Assigned In-Charge</label>
                  <input type="text" class="form-control" id="ctrlInCharge" value="Dona">
                  <label class="form-label" style="margin-top: 6px;">Drawn By (Artist)</label>
                  <input type="text" class="form-control" id="ctrlDrawnBy" value="Glen">
                </div>
              </div>
            </div>
          </div>

          <!-- SUBTAB 2: TEMPLATE EDITOR -->
          <div class="directive-subtab-content template-editor-wrap" id="tab-template-editor" style="display: none;">
            <div class="template-editor-toolbar">
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn btn-primary btn-sm" id="btnTplAddElement">+ Add Text Element</button>
                <button class="btn btn-secondary btn-sm" id="btnTplSaveTemplate">Save Layout</button>
                <button class="btn btn-secondary btn-sm" id="btnTplResetDefault">Reset to Standard</button>
              </div>
              <span style="font-size: 12px; color: var(--text-secondary);">Click to select, drag to reposition, pull corner to resize</span>
            </div>

            <div class="template-properties-panel" id="templatePropsPanel">
              <span style="font-size: 12px; font-weight: 800; color: #0F172A; white-space: nowrap;">Element Properties:</span>
              <input type="text" class="template-prop-input" id="propElemLabel" placeholder="Label" style="width: 140px;">
              <input type="text" class="template-prop-input" id="propElemContent" placeholder="Text Content" style="width: 180px;">
              <input type="number" class="template-prop-input" id="propElemFontSize" placeholder="Font (px)" style="width: 105px;" min="8" max="48">
              <select class="template-prop-input template-prop-select" id="propElemAlign">
                <option value="left">Left Align</option>
                <option value="center">Center Align</option>
                <option value="right">Right Align</option>
              </select>
              <button class="btn btn-danger btn-sm" id="btnTplDeleteElement">Delete</button>
            </div>

            <div class="canvas-bounds-wrapper">
              <div class="interactive-template-canvas" id="interactiveTemplateCanvas"></div>
            </div>
          </div>

          <!-- SUBTAB 3: ATTACHMENTS PANEL -->
          <div class="directive-subtab-content" id="tab-attachments" style="display: none;">
            <div class="studio-card">
              <div class="section-header-row">
                <div>
                  <h3 style="font-size: 16px; font-weight: 800;">Project Attachments & Proofs</h3>
                  <p>Design renders and vector assets for current directive</p>
                </div>
                <div class="section-actions">
                  <input type="file" id="localAttachmentUploadInput" accept="image/*,.pdf" style="display: none;">
                  <button class="btn btn-primary btn-sm" id="btnUploadLocalAttachment">Upload Local Proof</button>
                </div>
              </div>
              <div class="attachments-grid" id="attachmentsGridContainer"></div>
            </div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>