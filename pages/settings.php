<?php
/**
 * Sign Depotâ„¢ Operations PMS â€” Settings & Sync
 */

require_once __DIR__ . '/config.php';

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
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <h3 style="font-size: 16px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10B981;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Google Spreadsheet Database Integration
                </h3>
                <span class="badge badge-ongoing" id="gasSyncBadge">Google Sheet Ready</span>
              </div>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
                Connect this PMS directly to your Google Spreadsheet via Google Apps Script Web App. All production orders, deadlines, counts, and remarks sync live in two directions.
              </p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                <input type="url" class="form-control" id="settingsGasUrlInput" placeholder="Paste Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)" style="flex: 1; min-width: 280px;">
                <button class="btn btn-primary btn-sm" id="btnSettingsSaveGasUrl">Save & Connect</button>
                <button class="btn btn-secondary btn-sm" id="btnSettingsTestGas">Test Connection</button>
              </div>
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" id="btnSettingsPullGas">Pull from Google Sheet</button>
                <button class="btn btn-secondary btn-sm" id="btnSettingsPushGas">Push to Google Sheet</button>
                <span style="font-size: 12px; color: var(--text-muted);" id="gasLastSyncLabel">Status: Ready to connect or deploy to Apps Script</span>
              </div>
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