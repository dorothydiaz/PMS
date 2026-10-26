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


            <?php if (isSuperAdmin()): ?>
            <div class="studio-card col-span-2" id="settingsPasscodeCard" style="background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 12px; padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <h3 style="font-size: 16px; font-weight: 700; color: #09090B; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color: #09090B;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Super Admin Deletion Security Passcode
                  </h3>
                  <p style="font-size: 13px; color: #71717A; margin: 0;">
                    Configure the authorization passcode required whenever a Super Admin permanently deletes records from any table.
                  </p>
                </div>
                <span class="badge" style="background: #F4F4F5; color: #18181B; border: 1px solid #E4E4E7; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Super Admin Protected</span>
              </div>

              <div style="background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 10px; padding: 20px; max-width: 520px;">
                <!-- Security Status Indicator (Never exposes the raw passcode on screen) -->
                <div class="form-group" style="margin-bottom: 16px;">
                  <label class="form-label" style="font-weight: 600; font-size: 12px; color: #52525B;">Security Passcode Status</label>
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; padding: 10px 14px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #09090B;"></span>
                      <span style="font-size: 13px; font-weight: 600; color: #09090B;">Active & Protected</span>
                    </div>
                    <span style="font-family: monospace; font-size: 14px; color: #71717A; letter-spacing: 2.5px;">••••••••</span>
                  </div>
                  <span style="font-size: 11px; color: #71717A; margin-top: 4px; display: block;">Confidential: The active passcode is hashed and cannot be viewed on screen.</span>
                </div>

                <!-- Hidden fake fields to absorb browser credential autofill -->
                <input type="text" style="display:none;" aria-hidden="true" tabindex="-1">
                <input type="password" style="display:none;" aria-hidden="true" tabindex="-1">

                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label required" style="font-weight: 600; font-size: 12px; color: #52525B;">Current Login Password</label>
                  <input type="password" class="form-control" id="settingsLoginPasswordInput" placeholder="Enter your current login password..." autocomplete="new-password" data-lpignore="true" data-form-type="other" value="" style="background: #FFFFFF; border: 1px solid #D4D4D8; font-size: 13px;">
                </div>

                <div class="form-group" style="margin-bottom: 8px;">
                  <label class="form-label required" style="font-weight: 600; font-size: 12px; color: #52525B;">New Permission Passcode</label>
                  <div style="display: flex; gap: 8px;">
                    <input type="password" class="form-control" id="settingsNewPasscodeInput" placeholder="Enter new passcode (e.g. 1234)..." autocomplete="new-password" data-lpignore="true" data-form-type="other" value="" style="background: #FFFFFF; border: 1px solid #D4D4D8; font-size: 13px;">
                    <button type="button" class="btn btn-sm" id="btnSettingsSavePasscode" style="background: #09090B; border: 1px solid #09090B; color: #FFFFFF; font-weight: 600; padding: 0 18px; border-radius: 8px; white-space: nowrap; cursor: pointer;">Save Passcode</button>
                  </div>
                </div>
                <div id="settingsPasscodeFeedback" style="font-size: 12px; margin-top: 8px; font-weight: 600; display: none;"></div>
              </div>
            </div>
            <?php endif; ?>

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