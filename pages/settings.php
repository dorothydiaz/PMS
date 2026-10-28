<?php
/**
 * Sign Depot™ Operations PMS — Unified Settings & Account Management
 * Merged User Account Settings and System Configuration separated with modern tabs
 * File: pages/settings.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

requireLogin();

$user = getCurrentUser();
$userId = (int)$user['id'];
$canAccessSystemSettings = hasPermission('settings', 'r');

// Tab selection from query param (?tab=account or ?tab=system)
$requestedTab = $_GET['tab'] ?? '';
$activeTopTab = ($requestedTab === 'system' && $canAccessSystemSettings) ? 'system' : 'account';
$msg = $_GET['msg'] ?? '';

$pageTitle = 'Settings & Account';
$pageCategory = 'Configuration & Security';
$pageBadge = 'Unified Portal';
$currentPage = 'settings';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<style>
  .settings-container {
    max-width: 1140px;
    margin: 0 auto;
    padding-bottom: 60px;
  }

  /* Top-Level Primary Tab Switcher */
  .settings-top-tabs {
    display: flex;
    gap: 10px;
    background: #FFFFFF;
    padding: 8px;
    border-radius: 14px;
    border: 1px solid #E2E8F0;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .settings-top-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 800;
    color: #64748B;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .settings-top-tab-btn:hover {
    color: #0F172A;
    background: #F8FAFC;
  }

  .settings-top-tab-btn.active {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    color: #FFFFFF;
    border-color: #DC2626;
    box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
  }

  /* Account Header Banner */
  .settings-header-banner {
    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px 28px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .user-header-left {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .header-avatar-wrap {
    position: relative;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
    color: #FFFFFF;
    font-size: 24px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35);
    overflow: hidden;
    flex-shrink: 0;
  }

  .header-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-header-details h2 {
    margin: 0 0 4px 0;
    font-size: 20px;
    font-weight: 800;
    color: #F8FAFC;
    letter-spacing: -0.3px;
  }

  .user-header-details p {
    margin: 0;
    font-size: 13px;
    color: #94A3B8;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .role-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    background: rgba(220, 38, 38, 0.18);
    color: #F87171;
    border: 1px solid rgba(220, 38, 38, 0.3);
  }

  /* Secondary Sub-Nav Tabs for Account Settings */
  .account-subnav-tabs {
    display: flex;
    gap: 8px;
    background: #FFFFFF;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    margin-bottom: 22px;
    overflow-x: auto;
  }

  .account-subtab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #64748B;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .account-subtab-btn:hover {
    color: #0F172A;
    background: #F1F5F9;
  }

  .account-subtab-btn.active {
    background: #0F172A;
    color: #FFFFFF;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.25);
  }

  /* Card Styles */
  .settings-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 26px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  }

  .settings-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #F1F5F9;
    padding-bottom: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .settings-card-title {
    font-size: 16px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-card-subtitle {
    margin: 0;
    font-size: 13px;
    color: #64748B;
  }

  /* Form Elements */
  .form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  @media (max-width: 768px) {
    .form-row-2 {
      grid-template-columns: 1fr;
    }
  }

  .form-group-custom {
    margin-bottom: 18px;
  }

  .form-label-custom {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .form-input-custom {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    font-size: 14px;
    color: #0F172A;
    background: #FFFFFF;
    box-sizing: border-box;
    transition: all 0.2s;
  }

  .form-input-custom:focus {
    outline: none;
    border-color: #DC2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  .input-password-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-password-wrap input {
    padding-right: 40px;
  }

  .btn-pwd-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: #94A3B8;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-pwd-eye:hover {
    color: #0F172A;
  }

  /* Avatar Picker Section */
  .avatar-management-grid {
    display: flex;
    align-items: flex-start;
    gap: 28px;
    flex-wrap: wrap;
  }

  .avatar-preview-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .avatar-large-preview {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
    color: #FFFFFF;
    font-size: 38px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #FFFFFF;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px #E2E8F0;
    overflow: hidden;
  }

  .avatar-large-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .preset-avatars-title {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .preset-avatars-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .preset-avatar-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #E2E8F0;
    cursor: pointer;
    overflow: hidden;
    padding: 0;
    background: #F8FAFC;
    transition: all 0.2s;
  }

  .preset-avatar-btn:hover {
    transform: scale(1.1);
    border-color: #DC2626;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  .preset-avatar-btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Password Strength */
  .pwd-strength-container {
    margin-top: 6px;
  }

  .pwd-strength-bar {
    height: 4px;
    width: 100%;
    background: #E2E8F0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .pwd-strength-fill {
    height: 100%;
    width: 0%;
    transition: all 0.3s ease;
    border-radius: 4px;
  }

  .pwd-strength-text {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
  }

  /* Google Auth */
  .auth-integration-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: #FAFAFA;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 14px;
  }

  .integration-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .integration-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .totp-setup-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 22px;
    margin-top: 16px;
  }

  .totp-steps-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
  }

  @media (max-width: 680px) {
    .totp-steps-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  .totp-qr-wrapper {
    background: #FFFFFF;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: inline-block;
  }

  .totp-qr-wrapper img {
    display: block;
    width: 170px;
    height: 170px;
  }

  .totp-manual-box {
    background: #FFFFFF;
    border: 1px dashed #CBD5E1;
    border-radius: 8px;
    padding: 10px 14px;
    font-family: monospace;
    font-size: 13px;
    letter-spacing: 2px;
    color: #0F172A;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 16px 0;
  }

  /* Devices List */
  .device-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 12px;
    background: #FFFFFF;
    transition: all 0.2s;
    gap: 14px;
    flex-wrap: wrap;
  }

  .device-item:hover {
    border-color: #CBD5E1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  .device-item.is-current-device {
    background: #F8FAFC;
    border-left: 4px solid #10B981;
  }

  .device-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .device-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #F1F5F9;
    color: #334155;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .device-meta h4 {
    margin: 0 0 3px 0;
    font-size: 14px;
    font-weight: 700;
    color: #0F172A;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .device-meta p {
    margin: 0;
    font-size: 12px;
    color: #64748B;
  }

  .current-badge {
    background: #DCFCE7;
    color: #15803D;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #86EFAC;
  }

  .settings-alert {
    padding: 12px 18px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    font-weight: 600;
  }
  .settings-alert-success {
    background: #ECFDF5;
    color: #065F46;
    border: 1px solid #A7F3D0;
  }
  .settings-alert-error {
    background: #FEF2F2;
    color: #991B1B;
    border: 1px solid #FECACA;
  }
</style>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <!-- Register view-panel active so script.js view-switcher never redirects back -->
      <section class="view-panel active" id="view-settings">
        <div class="settings-container">

          <!-- Top Status Alerts -->
          <?php if ($msg === 'google_linked'): ?>
            <div class="settings-alert settings-alert-success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Google Account successfully connected! You can now use Google SSO for instant login.</span>
            </div>
          <?php elseif ($msg === 'google_unlinked'): ?>
            <div class="settings-alert settings-alert-success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Google Account has been unlinked. You may continue logging in with your password.</span>
            </div>
          <?php endif; ?>

          <!-- PRIMARY TOP-LEVEL TABS (User Account Settings vs System Configuration) -->
          <div class="settings-top-tabs">
            <button type="button" class="settings-top-tab-btn <?= ($activeTopTab === 'account') ? 'active' : '' ?>" id="topTabAccount" data-top-target="panel-account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>User Account Settings</span>
            </button>
            <?php if ($canAccessSystemSettings): ?>
            <button type="button" class="settings-top-tab-btn <?= ($activeTopTab === 'system') ? 'active' : '' ?>" id="topTabSystem" data-top-target="panel-system">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>System Configuration</span>
            </button>
            <?php endif; ?>
          </div>

          <!-- =================================================================== -->
          <!-- PANEL 1: USER ACCOUNT SETTINGS                                     -->
          <!-- =================================================================== -->
          <div class="top-tab-panel" id="panel-account" style="display: <?= ($activeTopTab === 'account') ? 'block' : 'none' ?>;">
            
            <!-- User Profile Banner -->
            <div class="settings-header-banner">
              <div class="user-header-left">
                <div class="header-avatar-wrap" id="headerAvatarBox">
                  <?php if (!empty($user['avatar_url'])): ?>
                    <img src="<?= htmlspecialchars($user['avatar_url']) ?>" alt="Avatar" class="header-avatar-img" id="headerAvatarImg">
                  <?php else: ?>
                    <span id="headerAvatarInitials"><?= strtoupper(substr($user['full_name'] ?: $user['username'], 0, 2)) ?></span>
                  <?php endif; ?>
                </div>
                <div class="user-header-details">
                  <h2 id="headerUserNameDisplay"><?= htmlspecialchars($user['full_name'] ?: $user['username']) ?></h2>
                  <p>
                    <span id="headerUserEmailDisplay"><?= htmlspecialchars($user['email']) ?></span>
                    <span>&bull;</span>
                    <span class="role-tag"><?= htmlspecialchars(str_replace('_', ' ', $user['role'])) ?></span>
                  </p>
                </div>
              </div>
              <div style="font-size: 12px; color: #94A3B8; text-align: right;">
                <div>Account ID: #<?= (int)$user['id'] ?></div>
                <div style="margin-top: 4px; color: #10B981; font-weight: 700; display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
                  Active Session
                </div>
              </div>
            </div>

            <!-- Account Sub-Tabs -->
            <div class="account-subnav-tabs">
              <button type="button" class="account-subtab-btn active" data-sub-target="subtab-profile">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Profile & Avatar</span>
              </button>
              <button type="button" class="account-subtab-btn" data-sub-target="subtab-password">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Change Password</span>
              </button>
              <button type="button" class="account-subtab-btn" data-sub-target="subtab-google">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Google Authentication & 2FA</span>
              </button>
              <button type="button" class="account-subtab-btn" data-sub-target="subtab-devices">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span>Device Login Management</span>
              </button>
            </div>

            <!-- SUB-TAB 1: PROFILE & AVATAR -->
            <div class="account-subtab-pane active" id="subtab-profile">
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Profile Picture & Avatar
                    </h3>
                    <p class="settings-card-subtitle">Personalize your identity across the PMS portal, top navigation bar, and tracker comments.</p>
                  </div>
                </div>

                <div class="avatar-management-grid">
                  <div class="avatar-preview-box">
                    <div class="avatar-large-preview" id="mainAvatarPreview">
                      <?php if (!empty($user['avatar_url'])): ?>
                        <img src="<?= htmlspecialchars($user['avatar_url']) ?>" alt="Avatar" id="mainAvatarImg">
                      <?php else: ?>
                        <span id="mainAvatarInitials"><?= strtoupper(substr($user['full_name'] ?: $user['username'], 0, 2)) ?></span>
                      <?php endif; ?>
                    </div>
                    <div style="font-size: 11px; color: #64748B; font-weight: 600;">Current Avatar</div>
                  </div>

                  <div style="flex: 1; min-width: 280px;">
                    <div class="form-group-custom">
                      <label class="form-label-custom">Upload Custom Photo</label>
                      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <label class="btn btn-secondary btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          <span>Choose Image File</span>
                          <input type="file" id="avatarFileInput" accept="image/png, image/jpeg, image/webp, image/gif" style="display: none;">
                        </label>
                        <button type="button" class="btn btn-outline-danger btn-sm" id="btnRemoveAvatar" style="display: <?= !empty($user['avatar_url']) ? 'inline-flex' : 'none' ?>; align-items: center; gap: 6px;">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          <span>Remove Photo</span>
                        </button>
                      </div>
                      <span style="font-size: 11px; color: #64748B; margin-top: 6px; display: block;">Supports JPG, PNG, WEBP or GIF (Max file size: 5MB).</span>
                    </div>

                    <div style="margin-top: 18px;">
                      <div class="preset-avatars-title">Or Choose a Curated Avatar Preset:</div>
                      <div class="preset-avatars-row">
                        <?php
                        $presets = [
                          'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4',
                          'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow&backgroundColor=c0aede',
                          'https://api.dicebear.com/7.x/bottts/svg?seed=Bandit&backgroundColor=d1d4f9',
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=Dorothy&backgroundColor=ffd5dc',
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf',
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=c0aede',
                          'https://api.dicebear.com/7.x/identicon/svg?seed=SignDepot1',
                          'https://api.dicebear.com/7.x/identicon/svg?seed=SignDepot2'
                        ];
                        foreach ($presets as $idx => $pUrl):
                        ?>
                          <button type="button" class="preset-avatar-btn" data-preset-url="<?= htmlspecialchars($pUrl) ?>" title="Select Preset #<?= $idx + 1 ?>">
                            <img src="<?= htmlspecialchars($pUrl) ?>" alt="Preset">
                          </button>
                        <?php endforeach; ?>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Basic Personal Info -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">Personal Details</h3>
                    <p class="settings-card-subtitle">Keep your name and notification email up to date.</p>
                  </div>
                </div>

                <form id="profileInfoForm" onsubmit="return false;">
                  <div class="form-row-2">
                    <div class="form-group-custom">
                      <label class="form-label-custom" for="profileFullName">Full Name</label>
                      <input type="text" class="form-input-custom" id="profileFullName" value="<?= htmlspecialchars($user['full_name'] ?: '') ?>" placeholder="e.g. Dorothy Diaz" required>
                    </div>
                    <div class="form-group-custom">
                      <label class="form-label-custom" for="profileEmail">Email Address</label>
                      <input type="email" class="form-input-custom" id="profileEmail" value="<?= htmlspecialchars($user['email'] ?: '') ?>" placeholder="e.g. dorothy@signdepot.com" required>
                    </div>
                  </div>
                  <div class="form-row-2">
                    <div class="form-group-custom">
                      <label class="form-label-custom">System Username (Fixed)</label>
                      <input type="text" class="form-input-custom" value="<?= htmlspecialchars($user['username']) ?>" disabled style="background: #F1F5F9; color: #64748B; cursor: not-allowed;">
                    </div>
                    <div class="form-group-custom">
                      <label class="form-label-custom">Assigned Role</label>
                      <input type="text" class="form-input-custom" value="<?= htmlspecialchars(strtoupper($user['role'])) ?>" disabled style="background: #F1F5F9; color: #64748B; cursor: not-allowed;">
                    </div>
                  </div>
                  <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                    <button type="submit" class="btn btn-primary" id="btnSaveProfileInfo" style="display: inline-flex; align-items: center; gap: 8px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- SUB-TAB 2: CHANGE PASSWORD -->
            <div class="account-subtab-pane" id="subtab-password" style="display: none;">
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Change Account Password
                    </h3>
                    <p class="settings-card-subtitle">Ensure your account is protected with a strong, distinct password.</p>
                  </div>
                </div>

                <form id="changePasswordForm" onsubmit="return false;" style="max-width: 540px;">
                  <div class="form-group-custom">
                    <label class="form-label-custom" for="pwdCurrent">Current Password</label>
                    <div class="input-password-wrap">
                      <input type="password" class="form-input-custom" id="pwdCurrent" placeholder="Enter current password..." autocomplete="current-password" required>
                      <button type="button" class="btn-pwd-eye" data-toggle-for="pwdCurrent">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                  </div>

                  <div class="form-group-custom">
                    <label class="form-label-custom" for="pwdNew">New Password</label>
                    <div class="input-password-wrap">
                      <input type="password" class="form-input-custom" id="pwdNew" placeholder="Minimum 6 characters..." autocomplete="new-password" required>
                      <button type="button" class="btn-pwd-eye" data-toggle-for="pwdNew">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                    <div class="pwd-strength-container">
                      <div class="pwd-strength-bar">
                        <div class="pwd-strength-fill" id="pwdStrengthFill"></div>
                      </div>
                      <div class="pwd-strength-text" id="pwdStrengthText">Strength: Enter a password</div>
                    </div>
                  </div>

                  <div class="form-group-custom">
                    <label class="form-label-custom" for="pwdConfirm">Confirm New Password</label>
                    <div class="input-password-wrap">
                      <input type="password" class="form-input-custom" id="pwdConfirm" placeholder="Re-enter new password..." autocomplete="new-password" required>
                      <button type="button" class="btn-pwd-eye" data-toggle-for="pwdConfirm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </div>
                  </div>

                  <div style="margin-top: 24px;">
                    <button type="submit" class="btn btn-primary" id="btnSubmitChangePassword" style="display: inline-flex; align-items: center; gap: 8px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- SUB-TAB 3: GOOGLE AUTHENTICATION & 2FA -->
            <div class="account-subtab-pane" id="subtab-google" style="display: none;">
              <!-- Google SSO -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                      Google Single Sign-On (SSO) Account Linking
                    </h3>
                    <p class="settings-card-subtitle">Connect your Google Workspace or Gmail account for one-click authentication.</p>
                  </div>
                </div>

                <div class="auth-integration-box">
                  <div class="integration-left">
                    <div class="integration-icon-wrap">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.43 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.99 0 12s.45 3.86 1.24 5.43l4.04-3.14z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z"/>
                      </svg>
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 14px; color: #0F172A;">Google Workspace Account</div>
                      <div style="font-size: 12px; color: #64748B;" id="googleLinkStatusText">Checking link status...</div>
                    </div>
                  </div>

                  <div id="googleActionBtnContainer">
                    <button type="button" class="btn btn-primary btn-sm" id="btnConnectGoogle">
                      Connect Google Account
                    </button>
                  </div>
                </div>
                <p style="font-size: 12px; color: #64748B; margin: 0;">
                  Linking your Google account allows seamless single-click sign in directly from the login page without typing your password each time.
                </p>
              </div>

              <!-- Google Authenticator 2FA -->
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                      Google Authenticator (2FA Two-Factor Authentication)
                    </h3>
                    <p class="settings-card-subtitle">Add an extra layer of protection to your account with time-based 6-digit one-time passcodes.</p>
                  </div>
                  <div id="twoFactorBadgeWrap">
                    <span class="badge" style="background:#F1F5F9; color:#64748B;">Checking...</span>
                  </div>
                </div>

                <div id="totpDisabledView" style="display: none;">
                  <p style="font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 16px;">
                    Two-Factor Authentication is currently <strong>disabled</strong> on your account. When enabled, signing in will require both your password and a dynamic verification code generated by the Google Authenticator app on your smartphone.
                  </p>
                  <button type="button" class="btn btn-primary" id="btnStart2faSetup" style="display: inline-flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>Enable Google Authenticator 2FA</span>
                  </button>

                  <div class="totp-setup-card" id="totpSetupWizard" style="display: none;">
                    <h4 style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">3-Step Setup for Google Authenticator</h4>
                    <div class="totp-steps-grid">
                      <div style="text-align: center;">
                        <div class="totp-qr-wrapper">
                          <img id="totpQrImage" src="" alt="Google Authenticator QR Code">
                        </div>
                        <div style="font-size: 11px; color: #64748B; margin-top: 6px;">Scan with Google Authenticator</div>
                      </div>

                      <div>
                        <div style="font-size: 13px; color: #334155; margin-bottom: 10px;">
                          <strong>Step 1:</strong> Open <strong>Google Authenticator</strong> on your phone (or 1Password, Authy).
                        </div>
                        <div style="font-size: 13px; color: #334155; margin-bottom: 8px;">
                          <strong>Step 2:</strong> Tap <strong>+</strong> and choose <strong>Scan a QR code</strong>, or enter this secret key manually:
                        </div>
                        <div class="totp-manual-box">
                          <span id="totpManualKeyText">••••••••••••••••</span>
                          <button type="button" class="btn btn-sm btn-secondary" id="btnCopyTotpKey" style="padding: 3px 8px; font-size: 11px;">Copy</button>
                        </div>

                        <div style="font-size: 13px; color: #334155; margin-bottom: 8px;">
                          <strong>Step 3:</strong> Enter the 6-digit confirmation code generated by your app:
                        </div>
                        <div style="display: flex; gap: 8px; max-width: 300px;">
                          <input type="text" class="form-input-custom" id="totpVerifyInput" placeholder="123456" maxlength="6" pattern="[0-9]{6}" style="font-size: 18px; font-weight: 800; letter-spacing: 4px; text-align: center;">
                          <button type="button" class="btn btn-primary" id="btnVerifyAndActivate2fa" style="white-space: nowrap;">
                            Verify & Activate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="totpEnabledView" style="display: none;">
                  <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                      <div style="width: 44px; height: 44px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      </div>
                      <div>
                        <div style="font-weight: 800; font-size: 15px; color: #166534;">Two-Factor Authentication is Active</div>
                        <div style="font-size: 12px; color: #15803D;">Your account is strictly protected with time-based OTP verification.</div>
                      </div>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm" id="btnDisable2fa">
                      Disable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUB-TAB 4: DEVICE LOGIN MANAGEMENT -->
            <div class="account-subtab-pane" id="subtab-devices" style="display: none;">
              <div class="settings-card">
                <div class="settings-card-header">
                  <div>
                    <h3 class="settings-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                      Active Device Sessions
                    </h3>
                    <p class="settings-card-subtitle">Manage where you are currently signed in and terminate suspicious or unused sessions.</p>
                  </div>
                  <button type="button" class="btn btn-outline-danger btn-sm" id="btnRevokeAllOtherDevices" style="display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out All Other Devices</span>
                  </button>
                </div>

                <div id="deviceSessionsList">
                  <div style="text-align: center; padding: 40px; color: #94A3B8;">Loading active devices...</div>
                </div>

                <div style="margin-top: 18px; padding: 14px 18px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 12px; color: #64748B; display: flex; align-items: center; gap: 10px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <span>If you notice any unfamiliar device or location, revoke it immediately and change your account password.</span>
                </div>
              </div>
            </div>

          </div>

          <!-- =================================================================== -->
          <!-- PANEL 2: SYSTEM CONFIGURATION                                      -->
          <!-- =================================================================== -->
          <?php if ($canAccessSystemSettings): ?>
          <div class="top-tab-panel" id="panel-system" style="display: <?= ($activeTopTab === 'system') ? 'block' : 'none' ?>;">
            <div class="section-header-row" style="margin-bottom: 20px;">
              <div class="section-title-wrap">
                <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0;">System Settings & Configuration</h2>
                <p style="font-size: 13px; color: #64748B; margin: 0;">Manage roster of artists, sales reps, workload thresholds, and local test data storage</p>
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

                  <form autocomplete="off" onsubmit="return false;" style="margin: 0; padding: 0;">
                    <input type="text" name="fake_user" style="display:none;" aria-hidden="true" tabindex="-1">
                    <input type="password" name="fake_pass" style="display:none;" aria-hidden="true" tabindex="-1">

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
                  </form>
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
          </div>
          <?php endif; ?>

        </div>
      </section>
    </div>
  </main>
</div>

<!-- Unified Settings Script -->
<script>
(function() {
  'use strict';

  // 1. Primary Top-Level Tabs (Account vs System)
  const topTabBtns = document.querySelectorAll('.settings-top-tab-btn');
  const topTabPanels = document.querySelectorAll('.top-tab-panel');

  topTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      topTabBtns.forEach(b => b.classList.remove('active'));
      topTabPanels.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-top-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });

  // 2. Account Sub-Tabs
  const subTabBtns = document.querySelectorAll('.account-subtab-btn');
  const subTabPanes = document.querySelectorAll('.account-subtab-pane');

  subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subTabBtns.forEach(b => b.classList.remove('active'));
      subTabPanes.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-sub-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
      }
    });
  });

  // 3. Password Visibility Toggle
  document.querySelectorAll('.btn-pwd-eye').forEach(eye => {
    eye.addEventListener('click', () => {
      const targetId = eye.getAttribute('data-toggle-for');
      const input = document.getElementById(targetId);
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  // 4. Password Strength Indicator
  const pwdNewInput = document.getElementById('pwdNew');
  const pwdStrengthFill = document.getElementById('pwdStrengthFill');
  const pwdStrengthText = document.getElementById('pwdStrengthText');

  if (pwdNewInput) {
    pwdNewInput.addEventListener('input', () => {
      const val = pwdNewInput.value;
      let score = 0;
      if (val.length >= 6) score += 25;
      if (val.length >= 10) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 25;

      if (val.length === 0) {
        pwdStrengthFill.style.width = '0%';
        pwdStrengthFill.style.background = '#E2E8F0';
        pwdStrengthText.textContent = 'Strength: Enter a password';
        pwdStrengthText.style.color = '#64748B';
      } else if (score <= 25) {
        pwdStrengthFill.style.width = '25%';
        pwdStrengthFill.style.background = '#EF4444';
        pwdStrengthText.textContent = 'Strength: Weak (Too short)';
        pwdStrengthText.style.color = '#EF4444';
      } else if (score <= 50) {
        pwdStrengthFill.style.width = '50%';
        pwdStrengthFill.style.background = '#F59E0B';
        pwdStrengthText.textContent = 'Strength: Moderate';
        pwdStrengthText.style.color = '#F59E0B';
      } else if (score <= 75) {
        pwdStrengthFill.style.width = '75%';
        pwdStrengthFill.style.background = '#3B82F6';
        pwdStrengthText.textContent = 'Strength: Good';
        pwdStrengthText.style.color = '#3B82F6';
      } else {
        pwdStrengthFill.style.width = '100%';
        pwdStrengthFill.style.background = '#10B981';
        pwdStrengthText.textContent = 'Strength: Strong & Secure';
        pwdStrengthText.style.color = '#10B981';
      }
    });
  }

  // 5. Change Password Submission
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('pwdCurrent').value;
      const newPassword = document.getElementById('pwdNew').value;
      const confirmPassword = document.getElementById('pwdConfirm').value;

      if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match. Please verify.');
        return;
      }

      const btn = document.getElementById('btnSubmitChangePassword');
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
          alert('Success! Your password has been changed successfully.');
          changePasswordForm.reset();
          pwdStrengthFill.style.width = '0%';
          pwdStrengthText.textContent = 'Strength: Enter a password';
        } else {
          alert('Error: ' + (data.error || 'Failed to update password.'));
        }
      } catch (err) {
        alert('Network error while updating password.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      }
    });
  }

  // 6. Profile Picture Upload & Presets
  const avatarFileInput = document.getElementById('avatarFileInput');
  const mainAvatarPreview = document.getElementById('mainAvatarPreview');
  const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async () => {
      if (!avatarFileInput.files || !avatarFileInput.files[0]) return;
      const file = avatarFileInput.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert('Selected file is too large. Maximum size is 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('action', 'account_upload_avatar');
      formData.append('avatar', file);

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          updateAvatarDisplays(data.avatar_url);
          if (btnRemoveAvatar) btnRemoveAvatar.style.display = 'inline-flex';
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error while uploading avatar.');
      }
    });
  }

  // Preset avatar click
  document.querySelectorAll('.preset-avatar-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const presetUrl = btn.getAttribute('data-preset-url');
      if (!presetUrl) return;

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'account_upload_avatar',
            preset_url: presetUrl
          })
        });
        const data = await res.json();
        if (data.success) {
          updateAvatarDisplays(data.avatar_url);
          if (btnRemoveAvatar) btnRemoveAvatar.style.display = 'inline-flex';
        } else {
          alert('Failed to set avatar preset: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error while saving avatar preset.');
      }
    });
  });

  // Remove Avatar
  if (btnRemoveAvatar) {
    btnRemoveAvatar.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to remove your profile picture?')) return;
      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_remove_avatar' })
        });
        const data = await res.json();
        if (data.success) {
          updateAvatarDisplays(null);
          btnRemoveAvatar.style.display = 'none';
        } else {
          alert('Error: ' + (data.error || 'Failed to remove avatar.'));
        }
      } catch (err) {
        alert('Network error while removing avatar.');
      }
    });
  }

  function updateAvatarDisplays(url) {
    const fullName = document.getElementById('profileFullName') ? document.getElementById('profileFullName').value : 'User';
    const initials = (fullName.trim().substring(0, 2) || 'SD').toUpperCase();

    if (mainAvatarPreview) {
      if (url) {
        mainAvatarPreview.innerHTML = `<img src="${url}" alt="Avatar">`;
      } else {
        mainAvatarPreview.innerHTML = `<span>${initials}</span>`;
      }
    }

    const headerBox = document.getElementById('headerAvatarBox');
    if (headerBox) {
      if (url) {
        headerBox.innerHTML = `<img src="${url}" alt="Avatar" class="header-avatar-img">`;
      } else {
        headerBox.innerHTML = `<span>${initials}</span>`;
      }
    }

    const navAvatar = document.querySelector('.user-profile-btn .user-avatar');
    if (navAvatar) {
      if (url) {
        navAvatar.innerHTML = `<img src="${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
      } else {
        navAvatar.textContent = initials;
      }
    }
  }

  // 7. Profile Info Update
  const profileInfoForm = document.getElementById('profileInfoForm');
  if (profileInfoForm) {
    profileInfoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('profileFullName').value.trim();
      const email = document.getElementById('profileEmail').value.trim();

      const btn = document.getElementById('btnSaveProfileInfo');
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
          document.getElementById('headerUserNameDisplay').textContent = fullName;
          document.getElementById('headerUserEmailDisplay').textContent = email;
          const navName = document.querySelector('.user-profile-btn .user-name');
          if (navName) navName.textContent = fullName;
          alert('Profile information updated successfully!');
        } else {
          alert('Error: ' + (data.error || 'Failed to update profile.'));
        }
      } catch (err) {
        alert('Network error while saving profile.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg><span>Save Profile Changes</span>`;
      }
    });
  }

  // 8. Load Account Security Info (Google status & 2FA)
  async function loadAccountSecurityInfo() {
    try {
      const res = await fetch('../api.php?action=account_get_info');
      const data = await res.json();
      if (!data.success) return;

      const u = data.user;

      const googleStatusText = document.getElementById('googleLinkStatusText');
      const googleActionBtnContainer = document.getElementById('googleActionBtnContainer');

      if (googleStatusText && googleActionBtnContainer) {
        if (u.is_google_linked) {
          googleStatusText.innerHTML = `<span style="color:#10B981; font-weight:700;">● Connected</span> &bull; ${u.google_email || u.email}`;
          googleActionBtnContainer.innerHTML = `
            <button type="button" class="btn btn-outline-danger btn-sm" id="btnDisconnectGoogle">
              Disconnect Google Account
            </button>
          `;
          document.getElementById('btnDisconnectGoogle').addEventListener('click', handleDisconnectGoogle);
        } else {
          googleStatusText.innerHTML = `<span style="color:#64748B;">Not connected</span> &bull; Click to connect for single-click sign in`;
          googleActionBtnContainer.innerHTML = `
            <button type="button" class="btn btn-primary btn-sm" id="btnConnectGoogle">
              Connect Google Account
            </button>
          `;
          document.getElementById('btnConnectGoogle').addEventListener('click', handleConnectGoogle);
        }
      }

      const badgeWrap = document.getElementById('twoFactorBadgeWrap');
      const totpDisabledView = document.getElementById('totpDisabledView');
      const totpEnabledView = document.getElementById('totpEnabledView');

      if (badgeWrap && totpDisabledView && totpEnabledView) {
        if (u.two_factor_enabled) {
          badgeWrap.innerHTML = `<span class="badge" style="background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0; font-weight:800;">2FA ACTIVE</span>`;
          totpDisabledView.style.display = 'none';
          totpEnabledView.style.display = 'block';
        } else {
          badgeWrap.innerHTML = `<span class="badge" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA; font-weight:800;">DISABLED</span>`;
          totpDisabledView.style.display = 'block';
          totpEnabledView.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('Failed to load security info', err);
    }
  }

  function handleConnectGoogle() {
    window.location.href = '../oauth.php?action=link&provider=google';
  }

  async function handleDisconnectGoogle() {
    if (!confirm('Are you sure you want to disconnect your Google account?')) return;
    try {
      const res = await fetch('../api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'account_google_unlink' })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Google account disconnected.');
        loadAccountSecurityInfo();
      } else {
        alert('Error: ' + (data.error || 'Failed to disconnect Google account.'));
      }
    } catch (err) {
      alert('Network error disconnecting Google account.');
    }
  }

  // 9. 2FA Setup Flow
  const btnStart2faSetup = document.getElementById('btnStart2faSetup');
  const totpSetupWizard = document.getElementById('totpSetupWizard');
  const btnVerifyAndActivate2fa = document.getElementById('btnVerifyAndActivate2fa');
  const btnDisable2fa = document.getElementById('btnDisable2fa');

  if (btnStart2faSetup) {
    btnStart2faSetup.addEventListener('click', async () => {
      btnStart2faSetup.disabled = true;
      btnStart2faSetup.textContent = 'Generating QR Code...';

      try {
        const res = await fetch('../api.php?action=account_2fa_setup');
        const data = await res.json();
        if (data.success) {
          document.getElementById('totpQrImage').src = data.qr_url;
          document.getElementById('totpManualKeyText').textContent = data.manual_entry_key || data.secret;
          totpSetupWizard.style.display = 'block';
        } else {
          alert('Error initiating 2FA: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error initiating 2FA.');
      } finally {
        btnStart2faSetup.disabled = false;
        btnStart2faSetup.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><span>Enable Google Authenticator 2FA</span>`;
      }
    });
  }

  const btnCopyTotpKey = document.getElementById('btnCopyTotpKey');
  if (btnCopyTotpKey) {
    btnCopyTotpKey.addEventListener('click', () => {
      const key = document.getElementById('totpManualKeyText').textContent.replace(/\s+/g, '');
      navigator.clipboard.writeText(key).then(() => {
        btnCopyTotpKey.textContent = 'Copied!';
        setTimeout(() => { btnCopyTotpKey.textContent = 'Copy'; }, 2000);
      });
    });
  }

  if (btnVerifyAndActivate2fa) {
    btnVerifyAndActivate2fa.addEventListener('click', async () => {
      const code = document.getElementById('totpVerifyInput').value.trim();
      if (!code || code.length !== 6) {
        alert('Please enter the 6-digit code from Google Authenticator.');
        return;
      }

      btnVerifyAndActivate2fa.disabled = true;
      btnVerifyAndActivate2fa.textContent = 'Verifying...';

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'account_2fa_verify',
            code: code
          })
        });
        const data = await res.json();
        if (data.success) {
          alert('Success! ' + data.message);
          totpSetupWizard.style.display = 'none';
          loadAccountSecurityInfo();
        } else {
          alert('Verification Failed: ' + (data.error || 'Invalid code'));
        }
      } catch (err) {
        alert('Network error verifying 2FA code.');
      } finally {
        btnVerifyAndActivate2fa.disabled = false;
        btnVerifyAndActivate2fa.textContent = 'Verify & Activate';
      }
    });
  }

  if (btnDisable2fa) {
    btnDisable2fa.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to disable Two-Factor Authentication? Your account will only be protected by your password.')) return;

      try {
        const res = await fetch('../api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'account_2fa_disable' })
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message || '2FA disabled.');
          loadAccountSecurityInfo();
        } else {
          alert('Error: ' + (data.error || 'Failed to disable 2FA.'));
        }
      } catch (err) {
        alert('Network error disabling 2FA.');
      }
    });
  }

  // 10. Device Login Management
  async function loadDevices() {
    const container = document.getElementById('deviceSessionsList');
    if (!container) return;

    try {
      const res = await fetch('../api.php?action=account_get_devices');
      const data = await res.json();
      if (!data.success) {
        container.innerHTML = `<div style="color:#EF4444; padding:20px;">Failed to load devices: ${data.error}</div>`;
        return;
      }

      const devices = data.devices || [];
      if (devices.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748B;">No active device sessions found.</div>`;
        return;
      }

      let html = '';
      devices.forEach(d => {
        const isCurrent = d.is_current;
        const iconSvg = d.user_agent && /mobile|android|iphone/i.test(d.user_agent)
          ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`
          : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;

        html += `
          <div class="device-item ${isCurrent ? 'is-current-device' : ''}" data-session-id="${d.id}">
            <div class="device-left">
              <div class="device-icon-box">
                ${iconSvg}
              </div>
              <div class="device-meta">
                <h4>
                  <span>${escapeHtml(d.device_name || 'Unknown Device')}</span>
                  ${isCurrent ? `<span class="current-badge">This Device</span>` : ''}
                </h4>
                <p>
                  <span>IP: ${escapeHtml(d.ip_address || '127.0.0.1')}</span>
                  <span>&bull;</span>
                  <span>Last active: ${escapeHtml(d.last_active || 'Recently')}</span>
                </p>
              </div>
            </div>
            <div>
              ${isCurrent 
                ? `<span style="font-size:12px; font-weight:700; color:#10B981;">Active Now</span>` 
                : `<button type="button" class="btn btn-outline-danger btn-sm btn-revoke-session" data-id="${d.id}">Log Out Device</button>`
              }
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      container.querySelectorAll('.btn-revoke-session').forEach(btn => {
        btn.addEventListener('click', async () => {
          const sId = btn.getAttribute('data-id');
          if (!confirm('Log out this remote device session?')) return;
          try {
            const r = await fetch('../api.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'account_revoke_device', session_id: sId })
            });
            const d = await r.json();
            if (d.success) {
              loadDevices();
            } else {
              alert('Error: ' + (d.error || 'Failed to revoke device.'));
            }
          } catch (e) {
            alert('Network error revoking device session.');
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div style="color:#EF4444; padding:20px;">Network error loading devices.</div>`;
    }
  }

  const btnRevokeAll = document.getElementById('btnRevokeAllOtherDevices');
  if (btnRevokeAll) {
    btnRevokeAll.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to log out all other devices? All other active sessions will be terminated immediately.')) return;
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
        } else {
          alert('Error: ' + (data.error || 'Failed to revoke other devices.'));
        }
      } catch (err) {
        alert('Network error logging out other devices.');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Initialize
  loadAccountSecurityInfo();
  loadDevices();

})();
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>