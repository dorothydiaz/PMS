<?php
/**
 * Sign Depot Operations PMS — Access Control & Role-Based Permissions (RBAC)
 * File: pages/access-control.php
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/includes/auth.php';

// Enforce login and access control permission
requireLogin();
requirePermission('access-control', 'r');

$pageTitle = 'Access Control & Users';
$currentPage = 'access-control';
$pageCategory = 'System Administration';
$pageBadge = 'Super Admin Only';

$currentUser = getCurrentUser();
$modules = getSystemModules();

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/sidebar.php';
?>

<div class="main-wrapper">
  <?php require_once __DIR__ . '/includes/navbar.php'; ?>

  <main class="main-content">
    <div class="content-body">
      <section class="view-panel active" id="view-access-control">
        <!-- Header Section -->
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2>User Management & Access Control (RBAC)</h2>
            <p>Control user roles, login credentials, and grant granular Create, Read, Update, and Delete (CRUD) permissions across all system modules.</p>
          </div>
          <div class="section-actions">
            <button class="btn btn-primary" id="btnAddNewUser" onclick="openAddUserModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New User
            </button>
          </div>
        </div>

        <!-- Super Admin Summary Banner -->
        <div style="background: linear-gradient(135deg, rgba(23, 107, 85, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%); border: 1px solid rgba(23, 107, 85, 0.2); border-radius: 12px; padding: 18px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; background: #176B55; color: #FFF; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <div style="font-size: 15px; font-weight: 800; color: #0F172A;">Role-Based Access Control Enabled</div>
              <div style="font-size: 13px; color: #64748B;">Super Admin has unrestricted master access. All changes to other users' permissions take effect on their next request.</div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="badge badge-ongoing" id="activeUsersCountBadge">Loading users...</span>
          </div>
        </div>

        <!-- Users Roster Table -->
        <div class="table-studio-wrap">
          <table class="data-table" id="usersTable">
            <thead>
              <tr>
                <th style="width: 240px;">User & Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Auth Provider</th>
                <th>Status</th>
                <th>Active Permissions</th>
                <th class="no-sort" style="text-align: right; width: 180px;">Actions</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: #64748B;">Loading user accounts...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</div>

<!-- ==========================================================================
     MODAL: GRANULAR MODULE CRUD PERMISSIONS MATRIX
     ========================================================================== -->
<div class="modal-backdrop" id="permissionsModal">
  <div class="modal-container" style="max-width: 860px; width: 95%;">
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 32px; height: 32px; background: #E0F2FE; color: #0284C7; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div>
          <h3 class="modal-title" style="font-size: 16px; margin: 0;">Module Access & CRUD Permissions</h3>
          <div style="font-size: 12px; color: #64748B;" id="permModalTargetUser">User: Loading...</div>
        </div>
      </div>
      <button class="modal-close-btn" data-close-modal="permissionsModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Quick Role Presets -->
    <div style="background: #F8FAFC; padding: 12px 24px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
      <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Quick Presets:</span>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyPermPreset('all')">Full Access (All)</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyPermPreset('readonly')">Read Only (All)</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyPermPreset('artist')">Creative Artist</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyPermPreset('sales')">Sales Rep</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="applyPermPreset('none')">Revoke All</button>
      </div>
    </div>

    <form id="permissionsForm">
      <input type="hidden" id="permUserId" name="userId">
      <div class="modal-body" style="padding: 0; max-height: 56vh; overflow-y: auto;">
        <table class="data-table" style="margin: 0; border: none; font-size: 13px;">
          <thead style="position: sticky; top: 0; background: #F1F5F9; z-index: 5;">
            <tr>
              <th style="padding-left: 24px;">Module Name</th>
              <th style="text-align: center; width: 85px;">Create (C)</th>
              <th style="text-align: center; width: 85px;">Read (R)</th>
              <th style="text-align: center; width: 85px;">Update (U)</th>
              <th style="text-align: center; width: 85px;">Delete (D)</th>
              <th style="text-align: center; width: 95px;">Quick Toggle</th>
            </tr>
          </thead>
          <tbody id="permMatrixTbody">
            <?php foreach ($modules as $modKey => $modInfo): ?>
              <tr data-module="<?= htmlspecialchars($modKey) ?>">
                <td style="padding-left: 24px;">
                  <div style="font-weight: 700; color: #0F172A;"><?= htmlspecialchars($modInfo['label']) ?></div>
                  <div style="font-size: 11px; color: #64748B;"><?= htmlspecialchars($modInfo['desc']) ?></div>
                </td>
                <td style="text-align: center;">
                  <input type="checkbox" class="perm-check" data-mod="<?= $modKey ?>" data-act="c">
                </td>
                <td style="text-align: center;">
                  <input type="checkbox" class="perm-check" data-mod="<?= $modKey ?>" data-act="r">
                </td>
                <td style="text-align: center;">
                  <input type="checkbox" class="perm-check" data-mod="<?= $modKey ?>" data-act="u">
                </td>
                <td style="text-align: center;">
                  <input type="checkbox" class="perm-check" data-mod="<?= $modKey ?>" data-act="d">
                </td>
                <td style="text-align: center;">
                  <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 11px;" onclick="toggleRowPerms('<?= $modKey ?>')">Row</button>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <button type="button" class="btn btn-secondary" data-close-modal="permissionsModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btnSavePermissions">Save Permissions</button>
      </div>
    </form>
  </div>
</div>

<!-- ==========================================================================
     MODAL: ADD / EDIT USER
     ========================================================================== -->
<div class="modal-backdrop" id="userFormModal">
  <div class="modal-container" style="max-width: 560px;">
    <div class="modal-header">
      <h3 class="modal-title" id="userFormModalTitle">Add New User</h3>
      <button class="modal-close-btn" data-close-modal="userFormModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <form id="userEditForm">
      <input type="hidden" id="editUserId" name="id">
      <div class="modal-body">
        <div class="form-grid-2">
          <div class="form-group col-span-2">
            <label class="form-label required">Full Name</label>
            <input type="text" class="form-control" id="formUserFullName" required placeholder="e.g. John Santos">
          </div>
          <div class="form-group">
            <label class="form-label required">Username</label>
            <input type="text" class="form-control" id="formUserUsername" required placeholder="e.g. jsantos">
          </div>
          <div class="form-group">
            <label class="form-label required">Email Address</label>
            <input type="email" class="form-control" id="formUserEmail" required placeholder="john@signdepot.com">
          </div>
          <div class="form-group col-span-2">
            <label class="form-label" id="lblFormUserPassword">Password</label>
            <input type="password" class="form-control" id="formUserPassword" placeholder="Minimum 6 characters...">
            <small style="color: #64748B; font-size: 11px;" id="helpPassword">Leave blank to keep existing password when editing.</small>
          </div>
          <div class="form-group">
            <label class="form-label required">Role</label>
            <select class="form-control" id="formUserRole" required>
              <option value="user">Standard User</option>
              <option value="artist">Creative Artist</option>
              <option value="sales">Sales Representative</option>
              <option value="manager">Operations Manager</option>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Status</label>
            <select class="form-control" id="formUserStatus" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive / Suspended</option>
            </select>
          </div>
          <div class="form-group col-span-2" id="groupAssignedArtist" style="display: none;">
            <label class="form-label">Linked Artist Identity (in Creatives Tracker)</label>
            <select class="form-control" id="formUserAssignedArtist">
              <option value="">-- Auto-detect from Name/Username --</option>
              <option value="Bob">Bob</option>
              <option value="Dorothy">Dorothy</option>
              <option value="Glen">Glen</option>
              <option value="Goodrich">Goodrich</option>
              <option value="Jules">Jules</option>
              <option value="Raven">Raven</option>
              <option value="Rodel">Rodel</option>
              <option value="Tim">Tim</option>
              <option value="Russel">Russel</option>
              <option value="Gilbert">Gilbert</option>
              <option value="Benjie">Benjie</option>
            </select>
            <small style="color: #64748B; font-size: 11px;">When this artist logs in, Creatives Tracker automatically filters to ONLY display projects assigned to this artist.</small>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="userFormModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btnSaveUser">Save User</button>
      </div>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>

<!-- Script for Access Control Management -->
<script>
  let cachedUsers = [];
  let currentTargetUser = null;

  async function loadUsersList() {
    try {
      const res = await fetch(window.PMS_API_URL + '?action=users_list');
      const data = await res.json();
      if (data && data.success) {
        cachedUsers = data.data;
        renderUsersTable();
      } else {
        showToast(data.error || 'Failed to load users list.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error while fetching users.', 'error');
    }
  }

  function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    const badgeEl = document.getElementById('activeUsersCountBadge');
    if (badgeEl) badgeEl.textContent = `${cachedUsers.length} Registered Users`;

    if (!cachedUsers.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No users found.</td></tr>';
      return;
    }

    tbody.innerHTML = cachedUsers.map(u => {
      const isSuper = u.role === 'super_admin';
      const roleBadge = isSuper ? 'badge-priority-rush' : (u.role === 'artist' ? 'badge-artist' : (u.role === 'sales' ? 'badge-sales' : 'badge-ongoing'));
      const statusBadge = u.status === 'active' ? 'badge-completed' : 'badge-not-started';
      const avatarText = u.full_name ? u.full_name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : 'U';

      // Summary of readable modules
      let permsSummary = '';
      if (isSuper) {
        permsSummary = '<span style="color: #176B55; font-weight: 700;">★ Full Master CRUD (All 10 Modules)</span>';
      } else {
        const perms = u.permissions || {};
        const readableMods = Object.keys(perms).filter(k => perms[k] && perms[k].r);
        permsSummary = `<span style="font-weight: 600; color: #475569;">${readableMods.length} of 10 Modules</span> <span style="color: #94A3B8; font-size: 11px;">(${readableMods.slice(0, 3).join(', ')}${readableMods.length > 3 ? '...' : ''})</span>`;
      }

      let roleLabel = escapeHtml(u.role.replace('_', ' ').toUpperCase());
      if (u.role === 'artist') {
        roleLabel = u.assigned_artist ? `ARTIST (${escapeHtml(u.assigned_artist)})` : 'ARTIST';
      }

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: #0F172A; color: #FFF; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;">
                ${avatarText}
              </div>
              <div>
                <div style="font-weight: 700; color: #0F172A;">${escapeHtml(u.full_name)}</div>
                <div style="font-size: 11px; color: #64748B;">@${escapeHtml(u.username)}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(u.email)}</td>
          <td><span class="badge ${roleBadge}">${roleLabel}</span></td>
          <td>
            <span style="font-size: 12px; color: #475569; display: flex; align-items: center; gap: 4px;">
              ${u.oauth_provider === 'google' ? '🟢 Google SSO' : '🔑 Standard Password'}
            </span>
          </td>
          <td><span class="badge ${statusBadge}">${escapeHtml(u.status.toUpperCase())}</span></td>
          <td>${permsSummary}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" title="Configure Module Access & CRUD" onclick="openPermissionsModal(${u.id})">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Permissions
              </button>
              <button class="btn btn-secondary btn-sm" title="Edit user" onclick="openEditUserModal(${u.id})">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              ${!isSuper ? `
                <button class="btn btn-secondary btn-sm" style="color: #DC2626;" title="Delete user" onclick="deleteUser(${u.id}, '${escapeHtml(u.username)}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // Toggle assigned artist identity selector when role changes
  document.getElementById('formUserRole').addEventListener('change', (e) => {
    const isArtist = e.target.value === 'artist';
    document.getElementById('groupAssignedArtist').style.display = isArtist ? 'block' : 'none';
  });

  function notify(msg, type = 'success') {
    if (typeof window.showToast === 'function') {
      window.showToast(msg, type);
    } else {
      console.log(`[${type}]`, msg);
    }
  }

  // --- Modal Helpers ---
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('show');
      m.classList.add('active');
    }
  }
  window.openModal = openModal;

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('show');
      m.classList.remove('active');
    }
  }
  window.closeModal = closeModal;

  // --- Add User Modal Handling ---
  function openAddUserModal() {
    document.getElementById('userFormModalTitle').textContent = 'Add New User';
    document.getElementById('editUserId').value = '';
    document.getElementById('formUserFullName').value = '';
    document.getElementById('formUserUsername').value = '';
    document.getElementById('formUserEmail').value = '';
    document.getElementById('formUserPassword').value = '';
    document.getElementById('formUserPassword').required = true;
    document.getElementById('lblFormUserPassword').className = 'form-label required';
    document.getElementById('helpPassword').style.display = 'none';
    document.getElementById('formUserRole').value = 'user';
    document.getElementById('formUserStatus').value = 'active';
    document.getElementById('formUserAssignedArtist').value = '';
    document.getElementById('groupAssignedArtist').style.display = 'none';
    openModal('userFormModal');
  }
  window.openAddUserModal = openAddUserModal;

  const btnAddNew = document.getElementById('btnAddNewUser');
  if (btnAddNew) {
    btnAddNew.addEventListener('click', openAddUserModal);
  }

  function openEditUserModal(id) {
    const user = cachedUsers.find(u => Number(u.id) === Number(id));
    if (!user) {
      console.warn('User not found for edit ID:', id);
      return;
    }
    document.getElementById('userFormModalTitle').textContent = `Edit User: ${user.username}`;
    document.getElementById('editUserId').value = user.id;
    document.getElementById('formUserFullName').value = user.full_name;
    document.getElementById('formUserUsername').value = user.username;
    document.getElementById('formUserEmail').value = user.email;
    document.getElementById('formUserPassword').value = '';
    document.getElementById('formUserPassword').required = false;
    document.getElementById('lblFormUserPassword').className = 'form-label';
    document.getElementById('helpPassword').style.display = 'block';
    document.getElementById('formUserRole').value = user.role;
    document.getElementById('formUserStatus').value = user.status;
    document.getElementById('formUserAssignedArtist').value = user.assigned_artist || '';
    document.getElementById('groupAssignedArtist').style.display = (user.role === 'artist') ? 'block' : 'none';
    openModal('userFormModal');
  }
  window.openEditUserModal = openEditUserModal;

  // Save User (Add or Edit)
  document.getElementById('userEditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const isEdit = Boolean(id);
    const payload = {
      action: isEdit ? 'users_update' : 'users_create',
      id: id || undefined,
      full_name: document.getElementById('formUserFullName').value.trim(),
      username: document.getElementById('formUserUsername').value.trim(),
      email: document.getElementById('formUserEmail').value.trim(),
      role: document.getElementById('formUserRole').value,
      assigned_artist: document.getElementById('formUserAssignedArtist').value,
      status: document.getElementById('formUserStatus').value,
      password: document.getElementById('formUserPassword').value
    };

    try {
      const res = await fetch(window.PMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        notify(isEdit ? 'User updated successfully.' : 'New user created successfully.');
        closeModal('userFormModal');
        loadUsersList();
      } else {
        notify(data.error || 'Failed to save user.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Error saving user data.', 'error');
    }
  });

  // Delete User
  async function deleteUser(id, username) {
    if (!confirm(`Are you sure you want to permanently delete user "${username}"?`)) {
      return;
    }
    try {
      const res = await fetch(window.PMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'users_delete', id: id })
      });
      const data = await res.json();
      if (data && data.success) {
        notify(`User ${username} deleted.`);
        loadUsersList();
      } else {
        notify(data.error || 'Failed to delete user.', 'error');
      }
    } catch (e) {
      notify('Network error deleting user.', 'error');
    }
  }
  window.deleteUser = deleteUser;

  // --- Permissions Matrix Modal Handling ---
  function openPermissionsModal(userId) {
    const user = cachedUsers.find(u => Number(u.id) === Number(userId));
    if (!user) {
      console.warn('User not found for permissions ID:', userId);
      return;
    }
    currentTargetUser = user;

    document.getElementById('permUserId').value = user.id;
    document.getElementById('permModalTargetUser').textContent = `User: ${user.full_name} (@${user.username}) — Role: ${user.role.toUpperCase()}`;

    // Populate checkboxes according to user's permissions
    const perms = user.permissions || {};
    const isSuper = user.role === 'super_admin';

    document.querySelectorAll('.perm-check').forEach(chk => {
      const mod = chk.getAttribute('data-mod');
      const act = chk.getAttribute('data-act');
      if (isSuper) {
        chk.checked = true;
      } else {
        chk.checked = Boolean(perms[mod] && perms[mod][act]);
      }
    });

    openModal('permissionsModal');
  }
  window.openPermissionsModal = openPermissionsModal;

  function toggleRowPerms(mod) {
    const checkboxes = document.querySelectorAll(`.perm-check[data-mod="${mod}"]`);
    const allChecked = Array.from(checkboxes).every(c => c.checked);
    checkboxes.forEach(c => c.checked = !allChecked);
  }
  window.toggleRowPerms = toggleRowPerms;

  function applyPermPreset(type) {
    document.querySelectorAll('.perm-check').forEach(chk => {
      const mod = chk.getAttribute('data-mod');
      const act = chk.getAttribute('data-act');

      if (type === 'all') {
        chk.checked = true;
      } else if (type === 'none') {
        chk.checked = false;
      } else if (type === 'readonly') {
        chk.checked = (act === 'r');
      } else if (type === 'artist') {
        if (['dashboard', 'creatives-tracker', 'directives-details', 'monthly-output', 'artist-workload'].includes(mod)) {
          chk.checked = (act === 'r' || act === 'u' || (act === 'c' && mod === 'creatives-tracker'));
        } else {
          chk.checked = false;
        }
      } else if (type === 'sales') {
        if (['dashboard', 'sales-requests'].includes(mod)) {
          chk.checked = true;
        } else if (['creatives-tracker', 'directives-details', 'artist-workload'].includes(mod)) {
          chk.checked = (act === 'r');
        } else {
          chk.checked = false;
        }
      }
    });
  }
  window.applyPermPreset = applyPermPreset;

  // Save Permissions Matrix
  document.getElementById('permissionsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('permUserId').value;
    
    // Build JSON permissions object
    const newPerms = {};
    document.querySelectorAll('.perm-check').forEach(chk => {
      const mod = chk.getAttribute('data-mod');
      const act = chk.getAttribute('data-act');
      if (!newPerms[mod]) {
        newPerms[mod] = { c: false, r: false, u: false, d: false };
      }
      if (chk.checked) {
        newPerms[mod][act] = true;
      }
    });

    try {
      const res = await fetch(window.PMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'users_update_permissions',
          id: userId,
          permissions: newPerms
        })
      });
      const data = await res.json();
      if (data && data.success) {
        notify('Permissions updated and applied successfully!');
        closeModal('permissionsModal');
        loadUsersList();
      } else {
        notify(data.error || 'Failed to update permissions.', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Error saving permissions.', 'error');
    }
  });

  // Modal Close buttons handler
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Close when clicking directly on backdrop outside modal container
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        modal.classList.remove('active');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('userFormModal');
      closeModal('permissionsModal');
    }
  });

  // Load initial list
  document.addEventListener('DOMContentLoaded', loadUsersList);
  if (document.readyState !== 'loading') loadUsersList();
</script>
