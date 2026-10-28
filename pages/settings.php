<?php
/**
 * Sign Depot™ Operations PMS — Unified Settings & Account Management
 * Clean, minimalist UI matching the Sign Depot design language with full Google Auth & Email Verification
 * File: pages/settings.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();
ensureSecurityTables();

$user = getCurrentUser();
$userId = (int)$user['id'];
$canAccessSystemSettings = hasPermission('settings', 'r');

// Tab selection from query param (?tab=account or ?tab=system)
$requestedTab = $_GET['tab'] ?? '';
$activeTopTab = ($requestedTab === 'system' && $canAccessSystemSettings) ? 'system' : 'account';
$msg = $_GET['msg'] ?? '';

$pageTitle = 'Settings & Account';
$pageCategory = 'Configuration & Security';
$pageBadge = 'Preferences';
$currentPage = 'settings';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<style>
  /* Minimalist Settings Container */
  .settings-wrapper {
    max-width: 840px;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  /* Clean Top-Level Tab Strip (Underline Minimalist Style) */
  .settings-tab-strip {
    display: flex;
    gap: 8px;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 18px;
    background: transparent;
  }

  .settings-tab-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #64748B;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    margin-bottom: -1px;
  }

  .settings-tab-link:hover {
    color: #0F172A;
  }

  .settings-tab-link.active {
    color: #DC2626;
    border-bottom-color: #DC2626;
  }

  /* Account Subtabs Pill Navigation */
  .account-subtabs-bar {
    display: flex;
    gap: 4px;
    background: #F1F5F9;
    padding: 4px;
    border-radius: 8px;
    width: fit-content;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .account-subtab-btn {
    border: none;
    background: transparent;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 700;
    color: #64748B;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .account-subtab-btn:hover {
    color: #0F172A;
  }

  .account-subtab-btn.active {
    background: #FFFFFF;
    color: #0F172A;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  /* Section Card (Consistent with studio-card) */
  .section-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    padding: 20px 22px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  }

  .section-card-header {
    border-bottom: 1px solid #F1F5F9;
    padding-bottom: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .section-card-header h3 {
    font-size: 14.5px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 2px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-card-header p {
    font-size: 12px;
    color: #64748B;
    margin: 0;
  }

  .role-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 6px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    background: #F8FAFC;
    color: #475569;
    border: 1px solid #E2E8F0;
  }

  /* Form Elements */
  .settings-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 640px) {
    .settings-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  .field-group {
    margin-bottom: 14px;
  }

  .field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 5px;
  }

  .field-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #CBD5E1;
    border-radius: 6px;
    font-size: 13px;
    color: #0F172A;
    background: #FFFFFF;
    box-sizing: border-box;
    transition: all 0.2s;
  }

  .field-input:focus {
    outline: none;
    border-color: #DC2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }

  .field-input[disabled] {
    background: #F8FAFC;
    color: #64748B;
    cursor: not-allowed;
  }

  .input-with-action {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .field-password-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field-password-wrap input {
    padding-right: 36px;
  }

  .eye-toggle-btn {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    color: #94A3B8;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .eye-toggle-btn:hover {
    color: #0F172A;
  }

  /* Avatar management minimalist */
  .avatar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #E2E8F0;
  }

  .avatar-circle-sm {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #F8FAFC;
    border: 2px solid #E2E8F0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    color: #334155;
    flex-shrink: 0;
  }

  .avatar-circle-sm img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preset-avatar-chip {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #E2E8F0;
    padding: 0;
    background: #F8FAFC;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.15s;
  }

  .preset-avatar-chip:hover {
    transform: scale(1.1);
    border-color: #DC2626;
  }

  .preset-avatar-chip img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Password Strength Meter */
  .meter-bar {
    height: 3px;
    background: #E2E8F0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 3px;
  }

  .meter-fill {
    height: 100%;
    width: 0%;
    transition: all 0.25s;
    border-radius: 3px;
  }

  .meter-text {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
  }

  /* Integration Box */
  .integration-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    margin-bottom: 10px;
    background: #FAFAFA;
    flex-wrap: wrap;
    gap: 10px;
  }

  .integration-item:last-child {
    margin-bottom: 0;
  }

  .integration-lead {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .integration-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Device item */
  .device-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    margin-bottom: 8px;
    background: #FFFFFF;
    gap: 10px;
    flex-wrap: wrap;
  }

  .device-row.is-current {
    background: #F8FAFC;
    border-left: 3px solid #10B981;
  }

  .badge-verified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    background: #ECFDF5;
    color: #065F46;
    border: 1px solid #A7F3D0;
  }

  .badge-unverified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    background: #FEF3C7;
    color: #92400E;
    border: 1px solid #FDE68A;
  }

  /* Clean alerts */
  .alert-clean {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .alert-clean-success {
    background: #ECFDF5;
    color: #065F46;
    border: 1px solid #A7F3D0;
  }

  /* Simple Modal */
  .clean-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .clean-modal {
    background: #FFFFFF;
    border-radius: 12px;
    width: 100%;
    max-width: 420px;
    padding: 20px 22px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
</style>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <!-- Register view-panel active so script.js view-switcher never redirects back -->
      <section class="view-panel active" id="view-settings">
        <div class="settings-wrapper">

          <!-- Minimalist Primary Tab Strip -->
          <div class="settings-tab-strip">
            <button type="button" class="settings-tab-link <?= ($activeTopTab === 'account') ? 'active' : '' ?>" data-tab-btn="account">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Account & Security</span>
            </button>
            <?php if ($canAccessSystemSettings): ?>
            <button type="button" class="settings-tab-link <?= ($activeTopTab === 'system') ? 'active' : '' ?>" data-tab-btn="system">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>System Configuration</span>
            </button>
            <?php endif; ?>
          </div>

          <!-- =================================================================== -->
          <!-- TAB 1: ACCOUNT & SECURITY                                          -->
          <!-- =================================================================== -->
          <div class="settings-content-pane" id="pane-account" style="display: <?= ($activeTopTab === 'account') ? 'block' : 'none' ?>;">
            
            <!-- Compact Subtab Pill Bar -->
            <div class="account-subtabs-bar">
              <button type="button" class="account-subtab-btn active" data-subtab="profile">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Profile & Identity</span>
              </button>
              <button type="button" class="account-subtab-btn" data-subtab="password">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Change Password</span>
              </button>
              <button type="button" class="account-subtab-btn" data-subtab="auth">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Two-Factor Auth (2FA)</span>
              </button>
              <button type="button" class="account-subtab-btn" data-subtab="devices">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span>Active Sessions</span>
              </button>
            </div>

            <!-- SUBTAB 1: Profile & Identity -->
            <div class="account-subtab-pane" id="subpane-profile">
              <div class="section-card">
                <div class="section-card-header">
                  <div>
                    <h3>Profile & Identity</h3>
                    <p>Update your photo and account display details</p>
                  </div>
                  <div>
                    <span class="role-pill"><?= htmlspecialchars(str_replace('_', ' ', $user['role'])) ?></span>
                  </div>
                </div>

                <!-- Hidden sync targets for JS backward-compatibility -->
                <span id="heroName" style="display:none;"><?= htmlspecialchars($user['full_name'] ?: $user['username']) ?></span>
                <span id="heroEmail" style="display:none;"><?= htmlspecialchars($user['email']) ?></span>
                <div id="heroAvatar" style="display:none;"></div>

                <!-- Avatar row -->
                <div class="avatar-row">
                  <div class="avatar-circle-sm" id="editorAvatarPreview">
                    <?php if (!empty($user['avatar_url'])): ?>
                      <img src="<?= htmlspecialchars($user['avatar_url']) ?>" alt="Avatar">
                    <?php else: ?>
                      <span><?= strtoupper(substr($user['full_name'] ?: $user['username'], 0, 2)) ?></span>
                    <?php endif; ?>
                  </div>

                  <div style="flex: 1;">
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">
                      <label class="btn btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; padding: 5px 11px;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span>Upload Photo</span>
                        <input type="file" id="avatarFileInput" accept="image/png, image/jpeg, image/webp, image/gif" style="display: none;">
                      </label>
                      <button type="button" class="btn btn-outline-danger btn-sm" id="btnRemoveAvatar" style="font-size: 11.5px; padding: 5px 11px; display: <?= !empty($user['avatar_url']) ? 'inline-flex' : 'none' ?>;">
                        Remove Photo
                      </button>
                    </div>
                    <!-- Quick Preset Icons -->
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span style="font-size: 10.5px; font-weight: 700; color: #64748B; text-transform: uppercase;">Presets:</span>
                      <?php
                      $presets = [
                        'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4',
                        'https://api.dicebear.com/7.x/bottts/svg?seed=Bandit&backgroundColor=d1d4f9',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy&backgroundColor=ffd5dc',
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf',
                        'https://api.dicebear.com/7.x/identicon/svg?seed=SignDepot1',
                        'https://api.dicebear.com/7.x/identicon/svg?seed=SignDepot2'
                      ];
                      foreach ($presets as $p): ?>
                        <button type="button" class="preset-avatar-chip" data-preset="<?= htmlspecialchars($p) ?>" title="Select Preset">
                          <img src="<?= htmlspecialchars($p) ?>" alt="Avatar">
                        </button>
                      <?php endforeach; ?>
                    </div>
                  </div>
                </div>

                <!-- Profile Details Form -->
                <form id="profileForm" onsubmit="return false;">
                  <div class="settings-grid-2">
                    <div class="field-group">
                      <label class="field-label" for="profileFullName">Full Name</label>
                      <input type="text" class="field-input" id="profileFullName" value="<?= htmlspecialchars($user['full_name'] ?: '') ?>" required>
                    </div>
                    <div class="field-group">
                      <label class="field-label" for="profileEmail">Email Address</label>
                      <input type="email" class="field-input" id="profileEmail" value="<?= htmlspecialchars($user['email'] ?: '') ?>" required>
                    </div>
                  </div>

                  <div class="settings-grid-2">
                    <div class="field-group">
                      <label class="field-label">Username</label>
                      <input type="text" class="field-input" value="<?= htmlspecialchars($user['username']) ?>" disabled>
                    </div>
                    <div class="field-group">
                      <label class="field-label">System Role</label>
                      <input type="text" class="field-input" value="<?= htmlspecialchars(strtoupper($user['role'])) ?>" disabled>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                    <button type="submit" class="btn btn-primary btn-sm" id="btnSaveProfile">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- SUBTAB 2: Password & Security -->
            <div class="account-subtab-pane" id="subpane-password" style="display: none;">
              <div class="section-card">
                <div class="section-card-header">
                  <div>
                    <h3>Change Password</h3>
                    <p>Update your credentials with a secure password</p>
                  </div>
                </div>

                <form id="passwordForm" onsubmit="return false;" style="max-width: 440px;">
                  <div class="field-group">
                    <label class="field-label" for="pwdCurrent">Current Password</label>
                    <div class="field-password-wrap">
                      <input type="password" class="field-input" id="pwdCurrent" placeholder="••••••••••••" autocomplete="current-password" required>
                      <button type="button" class="eye-toggle-btn" data-target="pwdCurrent">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="pwdNew">New Password</label>
                    <div class="field-password-wrap">
                      <input type="password" class="field-input" id="pwdNew" placeholder="Minimum 6 characters" autocomplete="new-password" required>
                      <button type="button" class="eye-toggle-btn" data-target="pwdNew">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                    <div class="meter-bar">
                      <div class="meter-fill" id="pwdMeterFill"></div>
                    </div>
                    <div class="meter-text" id="pwdMeterText">Strength: Enter a password</div>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="pwdConfirm">Confirm New Password</label>
                    <div class="field-password-wrap">
                      <input type="password" class="field-input" id="pwdConfirm" placeholder="Re-type new password" autocomplete="new-password" required>
                      <button type="button" class="eye-toggle-btn" data-target="pwdConfirm">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary btn-sm" id="btnUpdatePassword">Update Password</button>
                </form>
              </div>
            </div>

            <!-- SUBTAB 3: Two-Factor Authentication (2FA) -->
            <div class="account-subtab-pane" id="subpane-auth" style="display: none;">
              <div class="section-card">
                <div class="section-card-header">
                  <div>
                    <h3>Two-Factor Authentication (2FA)</h3>
                    <p>Protect your account with Google Authenticator or any standard TOTP app</p>
                  </div>
                </div>

                <!-- Google Authenticator 2FA -->
                <div class="integration-item">
                  <div class="integration-lead">
                    <div class="integration-logo" style="color: #DC2626;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                    </div>
                    <div>
                      <div style="font-size: 13.5px; font-weight: 700; color: #0F172A;">Two-Factor Authentication (TOTP 2FA)</div>
                      <div style="font-size: 12px; color: #64748B;" id="totpStatusLine">Requires a 6-digit code on login</div>
                    </div>
                  </div>
                  <div id="totpBtnSlot">
                    <!-- Enable / Disable injected via JS -->
                  </div>
                </div>

                <!-- 2FA Setup Panel (Revealed when configuring) -->
                <div id="totpSetupBox" style="display: none; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-top: 12px; background: #F8FAFC;">
                  <div style="font-weight: 700; font-size: 13px; color: #0F172A; margin-bottom: 10px;">Scan with Google Authenticator</div>
                  <div style="display: flex; gap: 18px; align-items: center; flex-wrap: wrap;">
                    <div style="background: #FFFFFF; padding: 8px; border-radius: 8px; border: 1px solid #E2E8F0; display: inline-block;">
                      <img id="totpQr" src="" alt="QR Code" style="width: 130px; height: 130px; display: block;">
                    </div>
                    <div style="flex: 1; min-width: 230px;">
                      <div style="font-size: 12px; color: #475569; margin-bottom: 5px;">Or enter code manually:</div>
                      <div style="font-family: monospace; font-size: 13px; font-weight: 700; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; padding: 6px 10px; letter-spacing: 2px; margin-bottom: 10px;" id="totpSecretText"></div>
                      <div style="font-size: 12px; color: #475569; margin-bottom: 5px;">Enter the 6-digit verification code from your app:</div>
                      <div style="display: flex; gap: 8px; max-width: 250px;">
                        <input type="text" class="field-input" id="totpCodeInput" placeholder="123456" maxlength="6" style="text-align: center; letter-spacing: 3px; font-weight: 700; font-size: 14px;">
                        <button type="button" class="btn btn-primary btn-sm" id="btnConfirm2fa">Verify</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUBTAB 4: Active Device Sessions -->
            <div class="account-subtab-pane" id="subpane-devices" style="display: none;">
              <div class="section-card">
                <div class="section-card-header">
                  <div>
                    <h3>Device Login Management</h3>
                    <p>Active browser sessions and device authorizations</p>
                  </div>
                  <button type="button" class="btn btn-outline-danger btn-sm" id="btnRevokeAllOther" style="font-size: 11.5px;">
                    Log Out All Other Devices
                  </button>
                </div>

                <div id="deviceListContainer">
                  <div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 13px;">Loading active sessions...</div>
                </div>
              </div>
            </div>

          </div>

          <!-- =================================================================== -->
          <!-- TAB 2: SYSTEM CONFIGURATION (FOR ADMINS)                           -->
          <!-- =================================================================== -->
          <?php if ($canAccessSystemSettings): ?>
          <div class="settings-content-pane" id="pane-system" style="display: <?= ($activeTopTab === 'system') ? 'block' : 'none' ?>;">
            
            <div class="form-grid-2">
              <!-- Artist Roster -->
              <div class="studio-card">
                <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Artist Roster & Capacity Limits</h3>
                <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                  <input type="text" class="form-control" id="settingsNewArtistInput" placeholder="New artist name...">
                  <button class="btn btn-primary btn-sm" id="btnSettingsAddArtist">Add Artist</button>
                </div>
                <div id="settingsArtistList" style="display: flex; flex-direction: column; gap: 6px;"></div>
              </div>

              <!-- Sales Reps -->
              <div class="studio-card">
                <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Sales Representatives</h3>
                <div style="display: flex; gap: 8px; margin-bottom: 14px;">
                  <input type="text" class="form-control" id="settingsNewSalesInput" placeholder="New sales rep name...">
                  <button class="btn btn-primary btn-sm" id="btnSettingsAddSales">Add Sales</button>
                </div>
                <div id="settingsSalesList" style="display: flex; flex-direction: column; gap: 6px;"></div>
              </div>

              <!-- Super Admin Passcode -->
              <?php if (isSuperAdmin()): ?>
              <div class="studio-card col-span-2" id="settingsPasscodeCard" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; color: #09090B; margin: 0 0 2px 0;">
                      Super Admin Deletion Security Passcode
                    </h3>
                    <p style="font-size: 12px; color: #71717A; margin: 0;">
                      Authorization passcode required whenever a Super Admin permanently deletes records.
                    </p>
                  </div>
                  <span class="badge" style="background: #F4F4F5; color: #18181B; border: 1px solid #E4E4E7; font-weight: 700; font-size: 10.5px;">Super Admin Only</span>
                </div>

                <div style="background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 16px; max-width: 480px;">
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label" style="font-weight: 600; font-size: 11.5px; color: #52525B;">Status</label>
                    <div style="display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 6px; padding: 8px 12px;">
                      <span style="font-size: 12.5px; font-weight: 600; color: #09090B;">● Active & Protected</span>
                      <span style="font-family: monospace; font-size: 13px; color: #71717A; letter-spacing: 2px;">••••••••</span>
                    </div>
                  </div>

                  <form autocomplete="off" onsubmit="return false;" style="margin: 0; padding: 0;">
                    <input type="text" name="fake_user" style="display:none;" aria-hidden="true" tabindex="-1">
                    <input type="password" name="fake_pass" style="display:none;" aria-hidden="true" tabindex="-1">

                    <div class="form-group" style="margin-bottom: 12px;">
                      <label class="form-label required" style="font-weight: 600; font-size: 11.5px; color: #52525B;">Current Login Password</label>
                      <input type="password" class="form-control" id="settingsLoginPasswordInput" placeholder="Enter current login password..." autocomplete="new-password">
                    </div>

                    <div class="form-group" style="margin-bottom: 8px;">
                      <label class="form-label required" style="font-weight: 600; font-size: 11.5px; color: #52525B;">New Deletion Passcode</label>
                      <div style="display: flex; gap: 8px;">
                        <input type="password" class="form-control" id="settingsNewPasscodeInput" placeholder="Enter new passcode..." autocomplete="new-password">
                        <button type="button" class="btn btn-sm btn-primary" id="btnSettingsSavePasscode">Save</button>
                      </div>
                    </div>
                    <div id="settingsPasscodeFeedback" style="font-size: 12px; margin-top: 6px; font-weight: 600; display: none;"></div>
                  </form>
                </div>
              </div>
              <?php endif; ?>

              <!-- Browser LocalStorage -->
              <div class="studio-card col-span-2">
                <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Local Storage & Backup</h3>
                <p style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 14px;">
                  Export or restore client-side draft configurations and local offline cache.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <button class="btn btn-secondary btn-sm" id="btnSettingsExportJson">Export JSON</button>
                  <button class="btn btn-secondary btn-sm" id="btnSettingsImportJson">Import JSON</button>
                  <input type="file" id="importJsonFileInput" accept=".json" style="display: none;">
                  <button class="btn btn-danger btn-sm" id="btnSettingsResetDefaults">Reset Defaults</button>
                </div>
              </div>
            </div>

          </div>
          <?php endif; ?>

        </div>
      </section>
    </div>
  </main>
</div>

<script>
(function() {
  'use strict';

  // 1. Primary Underline Tab Switcher
  const tabLinks = document.querySelectorAll('.settings-tab-link');
  const contentPanes = document.querySelectorAll('.settings-content-pane');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      tabLinks.forEach(l => l.classList.remove('active'));
      contentPanes.forEach(p => p.style.display = 'none');

      link.classList.add('active');
      const tabKey = link.getAttribute('data-tab-btn');
      const pane = document.getElementById('pane-' + tabKey);
      if (pane) pane.style.display = 'block';
    });
  });

  // 1b. Account Subtabs Switcher
  const subtabBtns = document.querySelectorAll('.account-subtab-btn');
  const subtabPanes = document.querySelectorAll('.account-subtab-pane');

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabBtns.forEach(b => b.classList.remove('active'));
      subtabPanes.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetSubtab = btn.getAttribute('data-subtab');
      const targetPane = document.getElementById('subpane-' + targetSubtab);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // Activate subtab if specified in URL query
  const urlParams = new URLSearchParams(window.location.search);
  const requestedSub = urlParams.get('sub') || '';
  if (requestedSub) {
    const targetBtn = document.querySelector(`.account-subtab-btn[data-subtab="${requestedSub}"]`);
    if (targetBtn) targetBtn.click();
  }

  // 2. Password Visibility Toggles
  document.querySelectorAll('.eye-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  // 3. Password Strength Meter
  const pwdNew = document.getElementById('pwdNew');
  const pwdMeterFill = document.getElementById('pwdMeterFill');
  const pwdMeterText = document.getElementById('pwdMeterText');

  if (pwdNew && pwdMeterFill && pwdMeterText) {
    pwdNew.addEventListener('input', () => {
      const val = pwdNew.value;
      let score = 0;
      if (val.length >= 6) score += 25;
      if (val.length >= 10) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 25;

      if (val.length === 0) {
        pwdMeterFill.style.width = '0%';
        pwdMeterFill.style.background = '#E2E8F0';
        pwdMeterText.textContent = 'Strength: Enter a password';
        pwdMeterText.style.color = '#64748B';
      } else if (score <= 25) {
        pwdMeterFill.style.width = '25%';
        pwdMeterFill.style.background = '#EF4444';
        pwdMeterText.textContent = 'Strength: Weak';
        pwdMeterText.style.color = '#EF4444';
      } else if (score <= 50) {
        pwdMeterFill.style.width = '50%';
        pwdMeterFill.style.background = '#F59E0B';
        pwdMeterText.textContent = 'Strength: Moderate';
        pwdMeterText.style.color = '#F59E0B';
      } else if (score <= 75) {
        pwdMeterFill.style.width = '75%';
        pwdMeterFill.style.background = '#3B82F6';
        pwdMeterText.textContent = 'Strength: Good';
        pwdMeterText.style.color = '#3B82F6';
      } else {
        pwdMeterFill.style.width = '100%';
        pwdMeterFill.style.background = '#10B981';
        pwdMeterText.textContent = 'Strength: Strong';
        pwdMeterText.style.color = '#10B981';
      }
    });
  }

  // 4. Change Password Handler
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('pwdCurrent').value;
      const newPassword = document.getElementById('pwdNew').value;
      const confirmPassword = document.getElementById('pwdConfirm').value;

      if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match. Please re-enter.');
        return;
      }

      const btn = document.getElementById('btnUpdatePassword');
      btn.disabled = true;
      btn.textContent = 'Updating...';

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'account_change_password',
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
          })
        });
        const data = await res.json();
        if (data.success) {
          alert('Password successfully updated!');
          passwordForm.reset();
          pwdMeterFill.style.width = '0%';
          pwdMeterText.textContent = 'Strength: Enter a password';
        } else {
          alert('Error: ' + (data.error || 'Failed to update password.'));
        }
      } catch (err) {
        alert('Network error updating password.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      }
    });
  }

  // 5. Avatar Management
  const avatarFileInput = document.getElementById('avatarFileInput');
  const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async () => {
      if (!avatarFileInput.files || !avatarFileInput.files[0]) return;
      const file = avatarFileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      const formData = new FormData();
      formData.append('action', 'account_upload_avatar');
      formData.append('avatar', file);

      try {
        const res = await fetch('../api.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          syncAvatars(data.avatar_url);
          btnRemoveAvatar.style.display = 'inline-flex';
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error uploading avatar.');
      }
    });
  }

  document.querySelectorAll('.preset-avatar-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const presetUrl = chip.getAttribute('data-preset');
      if (!presetUrl) return;

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_upload_avatar', preset_url: presetUrl })
        });
        const data = await res.json();
        if (data.success) {
          syncAvatars(data.avatar_url);
          btnRemoveAvatar.style.display = 'inline-flex';
        } else {
          alert('Failed to set avatar preset.');
        }
      } catch (err) {
        alert('Network error saving avatar preset.');
      }
    });
  });

  if (btnRemoveAvatar) {
    btnRemoveAvatar.addEventListener('click', async () => {
      if (!confirm('Remove profile photo?')) return;
      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_remove_avatar' })
        });
        const data = await res.json();
        if (data.success) {
          syncAvatars(null);
          btnRemoveAvatar.style.display = 'none';
        } else {
          alert('Error removing avatar.');
        }
      } catch (err) {
        alert('Network error removing avatar.');
      }
    });
  }

  function syncAvatars(url) {
    const fullName = document.getElementById('profileFullName') ? document.getElementById('profileFullName').value : 'User';
    const initials = (fullName.trim().substring(0, 2) || 'SD').toUpperCase();

    const hero = document.getElementById('heroAvatar');
    const editor = document.getElementById('editorAvatarPreview');
    const navAvatar = document.querySelector('.user-profile-btn .user-avatar');

    const content = url ? `<img src="${url}" alt="Avatar">` : `<span>${initials}</span>`;

    if (hero) hero.innerHTML = content;
    if (editor) editor.innerHTML = content;
    if (navAvatar) {
      navAvatar.innerHTML = url ? `<img src="${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : initials;
    }
  }

  // 6. Profile Info Update
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('profileFullName').value.trim();
      const email = document.getElementById('profileEmail').value.trim();

      const btn = document.getElementById('btnSaveProfile');
      btn.disabled = true;
      btn.textContent = 'Saving...';

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'account_update_profile',
            full_name: fullName,
            email: email
          })
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('heroName').textContent = fullName;
          document.getElementById('heroEmail').textContent = email;
          const navName = document.querySelector('.user-profile-btn .user-name');
          if (navName) navName.textContent = fullName;
          alert('Profile details saved!');
          loadAccountSecurityInfo();
        } else {
          alert('Error: ' + (data.error || 'Failed to save profile.'));
        }
      } catch (err) {
        alert('Network error saving profile.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
    });
  }

  // 7. Load 2FA Security Status
  async function loadAccountSecurityInfo() {
    try {
      const res = await fetch('../api.php?action=account_get_info');
      const data = await res.json();
      if (!data.success) return;

      const u = data.user;

      // TOTP status
      const totpStatusLine = document.getElementById('totpStatusLine');
      const totpBtnSlot = document.getElementById('totpBtnSlot');
      const totpSetupBox = document.getElementById('totpSetupBox');

      if (u.two_factor_enabled) {
        if (totpStatusLine) totpStatusLine.innerHTML = `<span style="color:#059669; font-weight:700;">● Active</span> &bull; 6-digit TOTP verification active`;
        if (totpBtnSlot) {
          totpBtnSlot.innerHTML = `<button type="button" class="btn btn-outline-danger btn-sm" id="btnDisable2fa">Disable 2FA</button>`;
          document.getElementById('btnDisable2fa').addEventListener('click', handleDisable2fa);
        }
        if (totpSetupBox) totpSetupBox.style.display = 'none';
      } else {
        if (totpStatusLine) totpStatusLine.innerHTML = `<span style="color:#64748B;">Disabled</span> &bull; Protect your account with standard TOTP 2FA`;
        if (totpBtnSlot) {
          totpBtnSlot.innerHTML = `<button type="button" class="btn btn-secondary btn-sm" id="btnStart2fa">Configure 2FA</button>`;
          document.getElementById('btnStart2fa').addEventListener('click', handleStart2fa);
        }
      }
    } catch (err) {
      console.error('Failed to load security info', err);
    }
  }

  // 10. 2FA Setup
  async function handleStart2fa() {
    try {
      const res = await fetch('../api.php?action=account_2fa_setup');
      const data = await res.json();
      if (data.success) {
        document.getElementById('totpQr').src = data.qr_url;
        document.getElementById('totpSecretText').textContent = data.manual_entry_key || data.secret;
        document.getElementById('totpSetupBox').style.display = 'block';
      } else {
        alert('Error initiating 2FA: ' + data.error);
      }
    } catch (err) {
      alert('Network error initiating 2FA.');
    }
  }

  const btnConfirm2fa = document.getElementById('btnConfirm2fa');
  if (btnConfirm2fa) {
    btnConfirm2fa.addEventListener('click', async () => {
      const code = document.getElementById('totpCodeInput').value.trim();
      if (!code || code.length !== 6) {
        alert('Enter the 6-digit code from Google Authenticator.');
        return;
      }
      btnConfirm2fa.disabled = true;
      btnConfirm2fa.textContent = 'Verifying...';

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_2fa_verify', code: code })
        });
        const data = await res.json();
        if (data.success) {
          alert('Success! Google Authenticator 2FA is now active.');
          document.getElementById('totpSetupBox').style.display = 'none';
          loadAccountSecurityInfo();
        } else {
          alert('Verification failed: ' + (data.error || 'Invalid code.'));
        }
      } catch (err) {
        alert('Network error verifying 2FA.');
      } finally {
        btnConfirm2fa.disabled = false;
        btnConfirm2fa.textContent = 'Verify';
      }
    });
  }

  async function handleDisable2fa() {
    if (!confirm('Disable Two-Factor Authentication?')) return;
    try {
      const res = await fetch('../api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'account_2fa_disable' })
      });
      const data = await res.json();
      if (data.success) {
        loadAccountSecurityInfo();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Network error disabling 2FA.');
    }
  }

  // 11. Devices Management
  async function loadDevices() {
    const container = document.getElementById('deviceListContainer');
    if (!container) return;

    try {
      const res = await fetch('../api.php?action=account_get_devices');
      const data = await res.json();
      if (!data.success) {
        container.innerHTML = `<div style="color:#EF4444; padding:10px;">Failed to load sessions.</div>`;
        return;
      }

      const devices = data.devices || [];
      if (devices.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:16px; color:#64748B;">No active device sessions.</div>`;
        return;
      }

      let html = '';
      devices.forEach(d => {
        const isCur = d.is_current;
        const icon = d.user_agent && /mobile|android|iphone/i.test(d.user_agent)
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;

        html += `
          <div class="device-row ${isCur ? 'is-current' : ''}">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="color: #64748B;">${icon}</div>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #0F172A; display: flex; align-items: center; gap: 6px;">
                  <span>${escapeHtml(d.device_name || 'Browser Device')}</span>
                  ${isCur ? `<span style="font-size: 10px; background: #DCFCE7; color: #166534; padding: 1px 6px; border-radius: 4px; font-weight: 800;">CURRENT</span>` : ''}
                </div>
                <div style="font-size: 11.5px; color: #64748B;">IP: ${escapeHtml(d.ip_address || '127.0.0.1')} &bull; Last active: ${escapeHtml(d.last_active || 'Recently')}</div>
              </div>
            </div>
            <div>
              ${isCur 
                ? `<span style="font-size: 11px; font-weight: 700; color: #10B981;">Online Now</span>` 
                : `<button type="button" class="btn btn-outline-danger btn-sm btn-revoke" data-id="${d.id}" style="font-size: 11px; padding: 3px 8px;">Log Out</button>`
              }
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      container.querySelectorAll('.btn-revoke').forEach(b => {
        b.addEventListener('click', async () => {
          const sId = b.getAttribute('data-id');
          if (!confirm('Log out this remote session?')) return;
          try {
            const r = await fetch('../api.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'account_revoke_device', session_id: sId })
            });
            const d = await r.json();
            if (d.success) loadDevices();
          } catch (e) {
            alert('Failed to revoke session.');
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div style="color:#EF4444; padding:10px;">Network error loading sessions.</div>`;
    }
  }

  const btnRevokeAllOther = document.getElementById('btnRevokeAllOther');
  if (btnRevokeAllOther) {
    btnRevokeAllOther.addEventListener('click', async () => {
      if (!confirm('Log out all other active sessions?')) return;
      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_revoke_other_devices' })
        });
        const data = await res.json();
        if (data.success) {
          alert('All other devices have been logged out.');
          loadDevices();
        }
      } catch (err) {
        alert('Network error.');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Initial load
  loadAccountSecurityInfo();
  loadDevices();

})();
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>