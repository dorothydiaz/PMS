<?php
/**
 * Sign Depot Operations PMS — Modern Enterprise Login & OAuth Portal
 * File: login.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';
$msg = $_GET['msg'] ?? '';
$redirect = $_GET['redirect'] ?? 'index.php';

// Handle Credentials Submission
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $usernameOrEmail = cleanInput($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($usernameOrEmail) || empty($password)) {
        $error = 'Please enter your username/email and password.';
    } else {
        $result = loginUser($usernameOrEmail, $password);
        if ($result['success']) {
            $dest = !empty($redirect) && strpos($redirect, 'login.php') === false ? $redirect : 'index.php';
            header('Location: ' . $dest);
            exit;
        } else {
            $error = $result['error'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In — <?= htmlspecialchars(APP_NAME) ?></title>
  <meta name="description" content="Sign Depot Operations PMS Authentication Portal">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" type="image/png" href="assets/img/sign-depot-logo.png">
  <style>
    :root {
    :root {
      --login-primary: #DC2626;
      --login-primary-hover: #B91C1C;
      --login-primary-light: #FEF2F2;
      --login-accent: #111827;
      --login-bg: #090B0E;
    }
    
    body.login-body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #020000;
      background: linear-gradient(135deg, #020000 0%, #130005 25%, #2B010C 50%, #3D0212 75%, #540318 100%);
      background-attachment: fixed;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    .ambient-glow {
      display: none !important;
    }

    .login-container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 440px;
      padding: 24px;
      box-sizing: border-box;
    }

    .login-card {
      position: relative;
      background: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 40px 36px 36px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }

    .login-brand-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .login-logo-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #FFFFFF;
      padding: 10px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05);
      margin-bottom: 18px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .login-logo-wrap:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.12), 0 0 0 1px rgba(220, 38, 38, 0.15);
    }

    .login-logo-img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }

    .login-title {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px;
      letter-spacing: -0.3px;
    }

    .login-subtitle {
      font-size: 13px;
      color: #64748B;
      margin: 0;
      font-weight: 500;
    }

    .login-alert {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.4;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .alert-error {
      background: #FEF2F2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }
    .alert-info {
      background: #0F172A;
      color: #F8FAFC;
      border: 1px solid #1E293B;
    }
    .alert-info svg {
      stroke: #DC2626;
    }

    .form-group-login {
      margin-bottom: 18px;
      position: relative;
    }

    .login-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .input-icon-wrap {
      position: relative;
    }

    .input-icon-wrap input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px 12px 40px;
      font-size: 14px;
      color: #0F172A;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .input-icon-wrap input:focus {
      outline: none;
      border-color: var(--login-primary);
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
    }

    .input-left-icon {
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
      pointer-events: none;
      transition: color 0.2s;
    }
    .input-icon-wrap input:focus + .input-left-icon,
    .input-icon-wrap:focus-within .input-left-icon {
      color: var(--login-primary);
    }

    .password-toggle-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #94A3B8;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;
    }
    .password-toggle-btn:hover {
      color: #111827;
    }

    .btn-submit-login {
      width: 100%;
      padding: 13px 18px;
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
      margin-top: 24px;
    }
    .btn-submit-login:hover {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      box-shadow: 0 6px 18px rgba(220, 38, 38, 0.45);
      transform: translateY(-1px);
    }
    .btn-submit-login:active {
      transform: translateY(0);
    }

    .quick-creds-container {
      margin-top: 26px;
      padding-top: 20px;
      border-top: 1px solid #F1F5F9;
    }
    .quick-creds-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      text-align: center;
    }
    .quick-creds-chips {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .quick-cred-chip {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s ease;
    }
    .quick-cred-chip:hover {
      background: #FEF2F2;
      border-color: #DC2626;
      border-style: solid;
      color: #991B1B;
      transform: translateX(2px);
    }
    .quick-cred-role {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .quick-cred-meta {
      font-size: 11px;
      color: #64748B;
    }
    .quick-cred-chip:hover .quick-cred-meta {
      color: #B91C1C;
    }

    .login-footer-info {
      text-align: center;
      margin-top: 18px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.65);
    }
  </style>
</head>
<body class="login-body">
  <div class="login-container">
    <div class="login-card">
      <div class="login-brand-header">
        <div class="login-logo-wrap">
          <img src="assets/img/sign-depot-logo.png" alt="Sign Depot Logo" class="login-logo-img">
        </div>
        <h1 class="login-title">Operations Portal</h1>
        <p class="login-subtitle">Sign Depot Sales & Creative Production PMS</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="login-alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span><?= htmlspecialchars($error) ?></span>
        </div>
      <?php endif; ?>

      <?php if ($msg === 'logged_out'): ?>
        <div class="login-alert alert-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>You have been signed out safely.</span>
        </div>
      <?php endif; ?>

      <!-- Standard Credentials Form -->
      <form method="POST" action="login.php<?= !empty($redirect) ? '?redirect=' . urlencode($redirect) : '' ?>">
        <div class="form-group-login">
          <label class="login-label" for="loginUsername">Username or Email</label>
          <div class="input-icon-wrap">
            <svg class="input-left-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <input type="text" id="loginUsername" name="username" placeholder="superadmin or email..." required autofocus autocomplete="username">
          </div>
        </div>

        <div class="form-group-login">
          <label class="login-label" for="loginPassword">Password</label>
          <div class="input-icon-wrap">
            <svg class="input-left-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" id="loginPassword" name="password" placeholder="••••••••••••" required autocomplete="current-password">
            <button type="button" class="password-toggle-btn" id="btnTogglePassword" aria-label="Toggle password visibility">
              <svg id="eyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit-login">
          <span>Sign In</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </form>



      <!-- Quick Super Admin Credentials for Local Pair Programming & Testing -->
      <div class="quick-creds-container">
        <div class="quick-creds-title">1-Click Test Accounts</div>
        <div class="quick-creds-chips">
          <div class="quick-cred-chip" onclick="fillCreds('superadmin', 'Password123!')">
            <span class="quick-cred-role">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Super Admin
            </span>
            <span class="quick-cred-meta">superadmin / Full CRUD</span>
          </div>
          <div class="quick-cred-chip" onclick="fillCreds('artist_dorothy', 'sample123')">
            <span class="quick-cred-role">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Artist Account
            </span>
            <span class="quick-cred-meta">artist_dorothy / Limited Modules</span>
          </div>
          <div class="quick-cred-chip" onclick="fillCreds('sales_dona', 'Password123!')">
            <span class="quick-cred-role">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              Sales Account
            </span>
            <span class="quick-cred-meta">sales_dona / Sales Queue</span>
          </div>
        </div>
      </div>
    </div>

    <div class="login-footer-info">
      Sign Depot Creative Operations © <?= date('Y') ?> • Enterprise PMS v2.5
    </div>
  </div>

  <script>
    // Password toggle
    const toggleBtn = document.getElementById('btnTogglePassword');
    const pwdInput = document.getElementById('loginPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    toggleBtn.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      } else {
        pwdInput.type = 'password';
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
    });

    // 1-Click Credential auto-fill helper
    function fillCreds(u, p) {
      document.getElementById('loginUsername').value = u;
      document.getElementById('loginPassword').value = p;
    }
  </script>
</body>
</html>
