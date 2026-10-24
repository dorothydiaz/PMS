<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Settings & Sync
 */

require_once dirname(__DIR__) . '/config.php';

$pageTitle = 'Settings & Sync';
$currentPage = 'settings';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
    <section class="view-panel active" id="view-settings">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2>System Settings & Configuration</h2>
              <p>Manage roster of artists, sales reps, workload thresholds, and local test data storage</p>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="studio-card">
              <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 14px;">Artist Roster & Capacity Limits</h3>
              <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                <input type="text" class="form-control" id="settingsNewArtistInput" placeholder="New artist name...">
                <button class="btn btn-primary btn-sm" id="btnSettingsAddArtist">Add Artist</button>
              </div>
              <div id="settingsArtistList" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>

            <div class="studio-card">
              <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 14px;">Sales Representatives</h3>
              <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                <input type="text" class="form-control" id="settingsNewSalesInput" placeholder="New sales rep name...">
                <button class="btn btn-primary btn-sm" id="btnSettingsAddSales">Add Sales</button>
              </div>
              <div id="settingsSalesList" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>


            <div class="studio-card col-span-2">
              <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 14px;">Browser LocalStorage Data Management</h3>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                All inline edits, new directives, drafts, and tasks are automatically persisted in your browser's local storage.
              </p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" id="btnSettingsExportJson">Export Data JSON</button>
                <button class="btn btn-secondary btn-sm" id="btnSettingsImportJson">Import Data JSON</button>
                <input type="file" id="importJsonFileInput" accept=".json" style="display: none;">
                <button class="btn btn-danger btn-sm" id="btnSettingsResetDefaults">Reset to Factory Defaults</button>
              </div>
            </div>
          </div>
        </section>
  </div>
  </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>