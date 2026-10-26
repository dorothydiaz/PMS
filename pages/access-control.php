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

        <!-- Filter bar -->
        <div class="filter-bar" style="margin-bottom: 20px;">
          <div class="filter-group" style="flex-wrap: wrap; gap: 10px;">
            <input type="search" name="q_users" class="filter-input" id="usersSearchInput" placeholder="Search user, name, email, role..." autocomplete="off" data-lpignore="true" data-form-type="other" style="width: 260px;" oninput="filterUsers(this.value)">
            <select class="filter-input" id="usersRoleFilter" onchange="filterUserRole(this.value)">
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="artist">Artist</option>
              <option value="sales">Sales</option>
            </select>
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

        <!-- Pagination -->
        <div class="pagination-container" id="usersPagination" style="margin-top: 14px;">
          <div class="pagination-info-group">
            <div class="pagination-info" id="usersPaginationInfo">Showing 0-0 of 0 users</div>
            <div class="pagination-rows-select-wrap">
              <label for="usersPaginationPerPage">Show:</label>
              <select class="filter-input-sm" id="usersPaginationPerPage" title="Rows to display">
                <option value="10" selected>10 rows</option>
                <option value="15">15 rows</option>
                <option value="20">20 rows</option>
                <option value="25">25 rows</option>
                <option value="30">30 rows</option>
              </select>
            </div>
          </div>
          <div class="pagination-controls" id="usersPaginationControls"></div>
        </div>
      </section>
    </div>
  </main>
</div>

<!-- ==========================================================================
     MODAL: GRANULAR MODULE CRUD PERMISSIONS MATRIX
     ========================================================================== -->
<div class="modal-backdrop" id="permissionsModal">
  <div class="modal-container" style="max-width: 940px; width: 95%;">
    <div class="modal-header" style="border-bottom: none; padding-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 38px; height: 38px; background: #E0F2FE; color: #0284C7; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div>
          <h3 class="modal-title" style="font-size: 16px; margin: 0; font-weight: 800;">Permissions & Data Customization Engine</h3>
          <div style="font-size: 12px; color: #64748B;" id="permModalTargetUser">User: Loading...</div>
        </div>
      </div>
      <button class="modal-close-btn" data-close-modal="permissionsModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Dual Tab Navigation: 1. Module & Tab Access | 2. Column-Level Permissions -->
    <div class="perm-modal-tabs">
      <button type="button" class="perm-tab-btn active" id="btnTabPermModules" onclick="switchPermTab('modules')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        1. Module & Tab Privileges (CRUD)
      </button>
      <button type="button" class="perm-tab-btn" id="btnTabPermColumns" onclick="switchPermTab('columns')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        2. Column-Level Edit Permissions (Per Table)
      </button>
    </div>

    <form id="permissionsForm">
      <input type="hidden" id="permUserId" name="userId">
      
      <!-- TAB 1: MODULES & CRUD PERMISSIONS -->
      <div id="permPanelModules">
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

        <div class="modal-body" style="padding: 0; max-height: 52vh; overflow-y: auto;">
          <table class="data-table" style="margin: 0; border: none; font-size: 13px;">
            <thead style="position: sticky; top: 0; background: #F1F5F9; z-index: 5;">
              <tr>
                <th style="padding-left: 24px;">Module & Table Name</th>
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
      </div>

      <!-- TAB 2: SPECIFIC COLUMN EDIT PERMISSIONS (PER TABLE) -->
      <div id="permPanelColumns" style="display: none;">
        <div style="background: #F8FAFC; padding: 14px 24px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label style="font-size: 12px; font-weight: 700; color: #334155; text-transform: uppercase;">Configuring Table:</label>
            <select class="form-control" id="permTableSelect" style="width: auto; font-weight: 700; font-size: 13px;" onchange="onPermTableSelectChange(this.value)">
              <option value="sales-requests">Sales Requests Table</option>
              <option value="creatives-tracker">Creatives Tracker Table</option>
              <option value="artist-workload">Artist Workload Table</option>
              <option value="directives-details">Directive Details Spec Sheet</option>
            </select>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="applyColPreset('all')">Select All Columns</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="applyColPreset('artist')">Artist Preset</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="applyColPreset('sales')">Sales Preset</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="applyColPreset('none')">Deselect All</button>
          </div>
        </div>

        <div class="modal-body" style="padding: 20px 24px; max-height: 52vh; overflow-y: auto;">
          <!-- Column Permission Mode Switcher -->
          <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-weight: 800; font-size: 14px; color: #0F172A;" id="permTableTitle">Sales Requests Table</div>
              <div style="font-size: 12px; color: #64748B;" id="permTableSubtitle">Choose whether all columns are freely editable or restrict to specific columns.</div>
            </div>
            <div style="display: flex; gap: 14px; align-items: center;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; cursor: pointer; color: #0F172A;">
                <input type="radio" name="colEditMode" id="colModeAll" value="all" onchange="onColModeToggle('all')">
                All Columns Editable
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; cursor: pointer; color: #0F172A;">
                <input type="radio" name="colEditMode" id="colModeCustom" value="custom" onchange="onColModeToggle('custom')">
                Restrict to Specific Columns
              </label>
            </div>
          </div>

          <!-- Status Alert if Module has no Update Permission -->
          <div id="permUpdateWarningBanner" style="display: none; background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; color: #92400E; font-size: 12px; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Notice: <strong>Update (U)</strong> permission is currently disabled for this module in Tab 1. Be sure to check Update (U) so this user is allowed to edit the table.</span>
          </div>

          <!-- Column Checkbox Grid -->
          <div id="permColumnGridContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px;">
            <!-- Dynamically populated per table -->
          </div>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #64748B;" id="permModalFooterSummary">
          Changes take effect instantly on live tables upon saving.
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-secondary" data-close-modal="permissionsModal">Cancel</button>
          <button type="submit" class="btn btn-primary" id="btnSavePermissions">Save Permissions</button>
        </div>
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
  let usersCurrentPage = 1;
  let usersPerPage = 10;
  let usersSearchQuery = '';
  let usersRoleFilterVal = '';

  function filterUsers(q) {
    usersSearchQuery = q || '';
    usersCurrentPage = 1;
    renderUsersTable();
  }

  function filterUserRole(r) {
    usersRoleFilterVal = r || '';
    usersCurrentPage = 1;
    renderUsersTable();
  }

  function changeUsersPage(p) {
    usersCurrentPage = p;
    renderUsersTable();
  }

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
    const infoEl = document.getElementById('usersPaginationInfo');
    const controlsEl = document.getElementById('usersPaginationControls');
    if (!tbody) return;

    if (badgeEl) badgeEl.textContent = `${cachedUsers.length} Registered Users`;

    const q = usersSearchQuery.toLowerCase().trim();
    const filtered = cachedUsers.filter(u => {
      if (usersRoleFilterVal && u.role !== usersRoleFilterVal) return false;
      if (!q) return true;
      const searchable = `${u.full_name || ''} ${u.username || ''} ${u.email || ''} ${u.role || ''} ${u.assigned_artist || ''}`.toLowerCase();
      return searchable.includes(q);
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(Math.ceil(totalItems / usersPerPage), 1);
    if (usersCurrentPage > totalPages) usersCurrentPage = totalPages;
    if (usersCurrentPage < 1) usersCurrentPage = 1;

    const startIndex = (usersCurrentPage - 1) * usersPerPage;
    const pagedUsers = filtered.slice(startIndex, startIndex + usersPerPage);

    if (!pagedUsers.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #64748B;">No user accounts found matching the filters.</td></tr>';
    } else {
      tbody.innerHTML = pagedUsers.map(u => {
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

    // Sync info label
    if (infoEl) {
      const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
      const endDisplay = Math.min(startIndex + usersPerPage, totalItems);
      infoEl.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems} users`;
    }

    // Render controls
    if (controlsEl) {
      let btnsHTML = `
        <button class="page-btn" ${usersCurrentPage === 1 ? 'disabled' : ''} onclick="changeUsersPage(${usersCurrentPage - 1})" aria-label="Previous Page" title="Previous Page">&laquo;</button>
      `;

      if (totalPages <= 7) {
        for (let p = 1; p <= totalPages; p++) {
          btnsHTML += `<button class="page-btn ${p === usersCurrentPage ? 'active' : ''}" onclick="changeUsersPage(${p})">${p}</button>`;
        }
      } else {
        btnsHTML += `<button class="page-btn ${usersCurrentPage === 1 ? 'active' : ''}" onclick="changeUsersPage(1)">1</button>`;
        const startP = Math.max(2, usersCurrentPage - 1);
        const endP = Math.min(totalPages - 1, usersCurrentPage + 1);

        if (startP > 2) {
          btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
        }
        for (let p = startP; p <= endP; p++) {
          btnsHTML += `<button class="page-btn ${p === usersCurrentPage ? 'active' : ''}" onclick="changeUsersPage(${p})">${p}</button>`;
        }
        if (endP < totalPages - 1) {
          btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
        }
        btnsHTML += `<button class="page-btn ${usersCurrentPage === totalPages ? 'active' : ''}" onclick="changeUsersPage(${totalPages})">${totalPages}</button>`;
      }

      btnsHTML += `
        <button class="page-btn" ${usersCurrentPage === totalPages ? 'disabled' : ''} onclick="changeUsersPage(${usersCurrentPage + 1})" aria-label="Next Page" title="Next Page">&raquo;</button>
      `;

      controlsEl.innerHTML = btnsHTML;
    }
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

  // --- Permissions Engine Configuration ---
  const TABLE_COLUMNS_CONFIG = {
    'sales-requests': {
      label: 'Sales Requests Table',
      subtitle: 'Customer orders intake, specifications, contact details, and releasing records.',
      columns: [
        { key: 'joNumber', label: 'JO Number', desc: 'Job Order ID Number', type: 'Text' },
        { key: 'orderDate', label: 'Order Date', desc: 'Order intake timestamp', type: 'Date' },
        { key: 'salesRep', label: 'Sales Representative', desc: 'Assigned Sales Agent', type: 'Dropdown' },
        { key: 'client', label: 'Client / Account', desc: 'Customer Account Name', type: 'Text' },
        { key: 'projectName', label: 'Project Description', desc: 'Signage specifications', type: 'Text' },
        { key: 'artist', label: 'Assigned Artist', desc: 'Graphic designer assigned', type: 'Dropdown' },
        { key: 'designDeadline', label: 'Design Deadline', desc: 'Target blueprint deadline', type: 'Date' },
        { key: 'releasingDate', label: 'Release Date', desc: 'Production release date', type: 'Date' },
        { key: 'releasingMode', label: 'Releasing Mode', desc: 'Install / Delivery / Pick-up', type: 'Dropdown' },
        { key: 'fileSent', label: 'File Sent Status', desc: 'File Sent / Pending / To Follow', type: 'Dropdown' },
        { key: 'clientApproval', label: 'Client Approval', desc: 'Pending / Approved / Revising', type: 'Dropdown' },
        { key: 'projectStatus', label: 'Project Status', desc: 'Pending / On-going / Approved / Completed', type: 'Dropdown' },
        { key: 'priority', label: 'Priority', desc: 'Normal / Rush / High / Low', type: 'Dropdown' },
        { key: 'completeAddress', label: 'Complete Address', desc: 'Installation venue & address', type: 'Text' },
        { key: 'location', label: 'Location', desc: 'Indoor / Outdoor installation', type: 'Dropdown' },
        { key: 'contactPerson', label: 'Contact Person', desc: 'On-site contact name', type: 'Text' },
        { key: 'contactNumber', label: 'Contact Number', desc: 'Phone / mobile number', type: 'Text' },
        { key: 'remarks', label: 'Remarks', desc: 'Special production instructions', type: 'Text' }
      ]
    },
    'creatives-tracker': {
      label: 'Creatives Tracker Table',
      subtitle: 'Production queue, design progress, release dates, and assignment counts.',
      columns: [
        { key: 'designStatus', label: 'Design Status', desc: 'Not Started / In Progress / Submitted', type: 'Dropdown' },
        { key: 'projectStatus', label: 'Project Status', desc: 'Pending / On-going / Approved / Completed', type: 'Dropdown' },
        { key: 'artist', label: 'Assigned Artist', desc: 'Assigned graphic designer', type: 'Dropdown' },
        { key: 'releasingDate', label: 'Target Release Date', desc: 'Target completion date', type: 'Date' },
        { key: 'fileSent', label: 'File Sent Status', desc: 'File Sent / Pending / To Follow', type: 'Dropdown' },
        { key: 'countStandard', label: 'Std Count', desc: 'Standard signages count', type: 'Number' },
        { key: 'countPrinting', label: 'Prt Count', desc: 'Large format print count', type: 'Number' },
        { key: 'countSpecial', label: 'Spc Count', desc: 'Special fabrication count', type: 'Number' },
        { key: 'revisionCount', label: 'Revision Iterations', desc: 'Client revision count', type: 'Number' },
        { key: 'remarks', label: 'Remarks & Directives', desc: 'Creative team remarks', type: 'Text' },
        { key: 'projectName', label: 'Project Description', desc: 'Signage specifications', type: 'Text' }
      ]
    },
    'artist-workload': {
      label: 'Artist Workload Table',
      subtitle: 'Artist capacity thresholds, queue balancing, and job reassignment.',
      columns: [
        { key: 'artist', label: 'Reassign Artist', desc: 'Change task ownership', type: 'Dropdown' },
        { key: 'priority', label: 'Task Priority', desc: 'Urgent / Rush / Normal', type: 'Dropdown' },
        { key: 'designDeadline', label: 'Design Deadline', desc: 'Reschedule deadline', type: 'Date' },
        { key: 'projectStatus', label: 'Project Status', desc: 'Workload active status', type: 'Dropdown' }
      ]
    },
    'directives-details': {
      label: 'Directive Details Spec Sheet',
      subtitle: 'Blueprint job orders, technical parameters, and image attachments.',
      columns: [
        { key: 'projectName', label: 'Project Name', desc: 'Blueprint specification', type: 'Text' },
        { key: 'client', label: 'Client Name', desc: 'Blueprint client account', type: 'Text' },
        { key: 'artist', label: 'Artist Assignment', desc: 'Blueprint artist', type: 'Dropdown' },
        { key: 'salesRep', label: 'Sales Rep', desc: 'Blueprint sales agent', type: 'Dropdown' },
        { key: 'designDeadline', label: 'Design Deadline', desc: 'Target spec deadline', type: 'Date' },
        { key: 'releasingDate', label: 'Release Date', desc: 'Target release date', type: 'Date' },
        { key: 'reference', label: 'Reference / Sent Status', desc: 'File sent reference', type: 'Dropdown' }
      ]
    }
  };

  let currentEditingPerms = {};
  let currentPermTable = 'sales-requests';

  function switchPermTab(tab) {
    const isMod = (tab === 'modules');
    document.getElementById('btnTabPermModules').classList.toggle('active', isMod);
    document.getElementById('btnTabPermColumns').classList.toggle('active', !isMod);
    document.getElementById('permPanelModules').style.display = isMod ? 'block' : 'none';
    document.getElementById('permPanelColumns').style.display = isMod ? 'none' : 'block';

    if (!isMod) {
      renderColumnPermGrid(currentPermTable);
    }
  }
  window.switchPermTab = switchPermTab;

  function openPermissionsModal(userId) {
    const user = cachedUsers.find(u => Number(u.id) === Number(userId));
    if (!user) {
      console.warn('User not found for permissions ID:', userId);
      return;
    }
    currentTargetUser = user;
    currentEditingPerms = JSON.parse(JSON.stringify(user.permissions || {}));

    document.getElementById('permUserId').value = user.id;
    document.getElementById('permModalTargetUser').textContent = `User: ${user.full_name} (@${user.username}) — Role: ${user.role.toUpperCase()}`;

    const isSuper = user.role === 'super_admin';

    // Populate Tab 1 Checkboxes
    document.querySelectorAll('.perm-check').forEach(chk => {
      const mod = chk.getAttribute('data-mod');
      const act = chk.getAttribute('data-act');
      if (isSuper) {
        chk.checked = true;
      } else {
        chk.checked = Boolean(currentEditingPerms[mod] && currentEditingPerms[mod][act]);
      }
    });

    // Reset to Tab 1
    switchPermTab('modules');
    currentPermTable = 'sales-requests';
    const select = document.getElementById('permTableSelect');
    if (select) select.value = currentPermTable;

    openModal('permissionsModal');
  }
  window.openPermissionsModal = openPermissionsModal;

  function onPermTableSelectChange(tableKey) {
    currentPermTable = tableKey;
    renderColumnPermGrid(tableKey);
  }
  window.onPermTableSelectChange = onPermTableSelectChange;

  function renderColumnPermGrid(tableKey) {
    const cfg = TABLE_COLUMNS_CONFIG[tableKey];
    if (!cfg) return;

    document.getElementById('permTableTitle').textContent = cfg.label;
    document.getElementById('permTableSubtitle').textContent = cfg.subtitle;

    const modPerm = currentEditingPerms[tableKey] || {};
    const hasUpdate = Boolean(modPerm.u || currentTargetUser?.role === 'super_admin');
    
    // Warning banner if Update is disabled in Tab 1
    const banner = document.getElementById('permUpdateWarningBanner');
    if (banner) {
      banner.style.display = hasUpdate ? 'none' : 'flex';
    }

    // Determine current editable columns setting
    const rawCols = modPerm.editable_columns;
    const isAll = (rawCols === undefined || rawCols === null || rawCols === '*' || (Array.isArray(rawCols) && (rawCols.length === 0 || rawCols.includes('*'))));

    document.getElementById('colModeAll').checked = isAll;
    document.getElementById('colModeCustom').checked = !isAll;

    const selectedCols = Array.isArray(rawCols) ? rawCols : (isAll ? cfg.columns.map(c => c.key) : []);

    const container = document.getElementById('permColumnGridContainer');
    container.innerHTML = cfg.columns.map(col => {
      const isChecked = isAll || selectedCols.includes(col.key);
      return `
        <label class="column-perm-card ${isChecked ? 'is-checked' : ''}" style="${isAll ? 'opacity: 0.7;' : ''}">
          <input type="checkbox" class="perm-col-checkbox" data-col="${col.key}" ${isChecked ? 'checked' : ''} ${isAll ? 'disabled' : ''} onchange="toggleColCheckbox('${tableKey}', '${col.key}', this.checked)">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <strong style="font-size: 13px; color: #0F172A;">${escapeHtml(col.label)}</strong>
              <span class="badge badge-ongoing" style="font-size: 9px; padding: 2px 6px;">${col.type}</span>
            </div>
            <div style="font-size: 11px; color: #64748B;">${escapeHtml(col.desc)}</div>
          </div>
        </label>
      `;
    }).join('');
  }

  function onColModeToggle(mode) {
    if (!currentEditingPerms[currentPermTable]) {
      currentEditingPerms[currentPermTable] = { c: false, r: true, u: true, d: false };
    }
    const cfg = TABLE_COLUMNS_CONFIG[currentPermTable];
    if (mode === 'all') {
      currentEditingPerms[currentPermTable].editable_columns = ['*'];
    } else {
      // Initialize with all columns checked so user can uncheck the ones they want to restrict
      currentEditingPerms[currentPermTable].editable_columns = cfg ? cfg.columns.map(c => c.key) : [];
    }
    renderColumnPermGrid(currentPermTable);
  }
  window.onColModeToggle = onColModeToggle;

  function toggleColCheckbox(tableKey, colKey, isChecked) {
    if (!currentEditingPerms[tableKey]) {
      currentEditingPerms[tableKey] = { c: false, r: true, u: true, d: false };
    }
    let cols = currentEditingPerms[tableKey].editable_columns;
    const cfg = TABLE_COLUMNS_CONFIG[tableKey];
    if (!Array.isArray(cols) || cols.includes('*')) {
      cols = cfg ? cfg.columns.map(c => c.key) : [];
    }

    if (isChecked) {
      if (!cols.includes(colKey)) cols.push(colKey);
    } else {
      cols = cols.filter(k => k !== colKey);
    }

    currentEditingPerms[tableKey].editable_columns = cols;
    renderColumnPermGrid(tableKey);
  }
  window.toggleColCheckbox = toggleColCheckbox;

  function applyColPreset(presetType) {
    if (!currentEditingPerms[currentPermTable]) {
      currentEditingPerms[currentPermTable] = { c: false, r: true, u: true, d: false };
    }
    const cfg = TABLE_COLUMNS_CONFIG[currentPermTable];
    if (!cfg) return;

    if (presetType === 'all') {
      currentEditingPerms[currentPermTable].editable_columns = ['*'];
      document.getElementById('colModeAll').checked = true;
      document.getElementById('colModeCustom').checked = false;
    } else if (presetType === 'none') {
      currentEditingPerms[currentPermTable].editable_columns = [];
      document.getElementById('colModeAll').checked = false;
      document.getElementById('colModeCustom').checked = true;
    } else if (presetType === 'artist') {
      document.getElementById('colModeAll').checked = false;
      document.getElementById('colModeCustom').checked = true;
      const artistCols = ['designStatus', 'projectStatus', 'releasingDate', 'fileSent', 'countStandard', 'countPrinting', 'countSpecial', 'revisionCount', 'remarks'];
      currentEditingPerms[currentPermTable].editable_columns = cfg.columns.map(c => c.key).filter(k => artistCols.includes(k));
    } else if (presetType === 'sales') {
      document.getElementById('colModeAll').checked = false;
      document.getElementById('colModeCustom').checked = true;
      const salesCols = ['client', 'salesRep', 'projectName', 'releasingMode', 'clientApproval', 'remarks', 'contactPerson', 'contactNumber', 'completeAddress', 'location'];
      currentEditingPerms[currentPermTable].editable_columns = cfg.columns.map(c => c.key).filter(k => salesCols.includes(k));
    }
    renderColumnPermGrid(currentPermTable);
  }
  window.applyColPreset = applyColPreset;

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

  // Save Permissions Matrix & Column Restrictions
  document.getElementById('permissionsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('permUserId').value;
    
    // Sync Tab 1 checkboxes into currentEditingPerms
    document.querySelectorAll('.perm-check').forEach(chk => {
      const mod = chk.getAttribute('data-mod');
      const act = chk.getAttribute('data-act');
      if (!currentEditingPerms[mod]) {
        currentEditingPerms[mod] = { c: false, r: false, u: false, d: false };
      }
      currentEditingPerms[mod][act] = chk.checked;
    });

    try {
      const res = await fetch(window.PMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'users_update_permissions',
          id: userId,
          permissions: currentEditingPerms
        })
      });
      const data = await res.json();
      if (data && data.success) {
        notify('Permissions & column customizations updated successfully!');
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

  // Bind per-page selector
  const usersPerPageSelect = document.getElementById('usersPaginationPerPage');
  if (usersPerPageSelect) {
    usersPerPageSelect.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        usersPerPage = val;
        usersCurrentPage = 1;
        renderUsersTable();
      }
    });
  }

  // Load initial list
  document.addEventListener('DOMContentLoaded', loadUsersList);
  if (document.readyState !== 'loading') loadUsersList();
</script>
