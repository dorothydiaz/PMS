<?php
/**
 * Sign Depot Operations PMS — Shared Modal Components & Dialogs
 */
?>
<!-- MODAL: ADD / EDIT SALES REQUEST -->
<div class="modal-backdrop" id="salesModal">
  <div class="modal-container" style="max-width: 740px;">
    <div class="modal-header">
      <h3 class="modal-title" id="salesModalTitle">New Sales Request</h3>
      <button class="modal-close-btn" data-close-modal="salesModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <form id="salesRequestForm" style="display: flex; flex-direction: column; min-height: 0; flex: 1; overflow: hidden; margin: 0;">
      <div class="modal-body" style="overflow-y: auto; flex: 1; min-height: 0; padding: 22px 26px;">
        <input type="hidden" id="salesFormId">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Request ID</label>
            <input type="text" class="form-control" id="salesFormReqId" placeholder="e.g. LR-26-2104" required autocomplete="off">
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Auto-generated sequential ID with separator dash (e.g. LR-26-2104)</div>
          </div>
          <div class="form-group">
            <label class="form-label required">JO Number</label>
            <input type="text" class="form-control" id="salesFormJo" placeholder="e.g. P261001357" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Date Encoded (Timestamp)</label>
            <input type="date" class="form-control" id="salesFormOrderDate" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Sales Representative</label>
            <select class="form-control" id="salesFormSalesRep" required>
              <option value="">Select Sales Rep...</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Client Name</label>
            <input type="text" class="form-control" id="salesFormClient" placeholder="Company or Client" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Assigned Artist</label>
            <select class="form-control" id="salesFormArtist" required>
              <option value="">Select Artist...</option>
            </select>
          </div>
          <div class="form-group col-span-2">
            <label class="form-label required">Project Name</label>
            <input type="text" class="form-control" id="salesFormProject" placeholder="e.g. Acrylic Build-up Signage" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Design Deadline</label>
            <input type="date" class="form-control" id="salesFormDeadline" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Production Due</label>
            <input type="date" class="form-control" id="salesFormReleasing" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Priority Level</label>
            <select class="form-control" id="salesFormPriority" required>
              <option value="">Select Priority...</option>
              <option value="Low">Low</option>
              <option value="Normal" selected>Normal</option>
              <option value="Rush">Rush</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Mode of Releasing</label>
            <select class="form-control" id="salesFormRelMode" required>
              <option value="">Select Mode of Releasing...</option>
              <option value="Install">Install</option>
              <option value="Deliver">Deliver</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Placement</label>
            <select class="form-control" id="salesFormLocation" required>
              <option value="">Select Placement...</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Indoor & Outdoor">Indoor & Outdoor</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">File Status</label>
            <select class="form-control" id="salesFormFileSent" required>
              <option value="">Select File Status...</option>
              <option value="File Sent">File Sent</option>
              <option value="To Follow">To Follow</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Client Approval</label>
            <select class="form-control" id="salesFormClientApproval" required>
              <option value="">Select Approval Status...</option>
              <option value="Pending Approval" selected>Pending Approval</option>
              <option value="On-going">On-going</option>
              <option value="For Review">For Review</option>
              <option value="Revising">Revising</option>
              <option value="Completed">Completed</option>
              <option value="Released">Released</option>
              <option value="Incomplete Details/Files">Incomplete Details/Files</option>
              <option value="Onhold">Onhold</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Contact Person</label>
            <input type="text" class="form-control" id="salesFormContactPerson" placeholder="Full name" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Contact Number</label>
            <input type="text" class="form-control" id="salesFormContactNumber" placeholder="e.g. 0917 123 4567" required>
          </div>
          <div class="form-group col-span-2">
            <label class="form-label required">Complete Delivery/Installation Address</label>
            <input type="text" class="form-control" id="salesFormAddress" placeholder="Full address" required>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="flex-shrink: 0; z-index: 2; position: relative;">
        <button type="button" class="btn btn-secondary" data-close-modal="salesModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btnSaveSalesRequest">Save Request</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: ADD / EDIT CREATIVE TASK -->
<div class="modal-backdrop" id="trackerModal">
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title" id="trackerModalTitle">Edit Creative Task</h3>
      <button class="modal-close-btn" data-close-modal="trackerModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <form id="trackerTaskForm" style="display: flex; flex-direction: column; min-height: 0; flex: 1; overflow: hidden; margin: 0;">
      <div class="modal-body" style="overflow-y: auto; flex: 1; min-height: 0; padding: 22px 26px;">
        <input type="hidden" id="trackerFormId">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Request ID</label>
            <input type="text" class="form-control" id="trackerFormReqId" required readonly style="background: #F1F5F9;">
          </div>
          <div class="form-group">
            <label class="form-label required">Assigned Artist</label>
            <select class="form-control" id="trackerFormArtist" required></select>
          </div>
          <div class="form-group col-span-2">
            <label class="form-label required">Project Name</label>
            <input type="text" class="form-control" id="trackerFormProject" required>
          </div>
          <div class="form-group">
            <label class="form-label required">Design Deadline</label>
            <input type="date" class="form-control" id="trackerFormDeadline" required>
          </div>
          <div class="form-group">
            <label class="form-label">Head Approval</label>
            <select class="form-control" id="trackerFormHeadApproval">
              <option value="Approved">Approved</option>
              <option value="Pending" selected>Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Project Status</label>
            <select class="form-control" id="trackerFormProjectStatus">
              <option value="Completed">Completed</option>
              <option value="On-going" selected>On-going</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Design Status</label>
            <select class="form-control" id="trackerFormDesignStatus">
              <option value="On Queue" selected>On Queue</option>
              <option value="On-hold">On-hold</option>
              <option value="Incomplete Details">Incomplete Details</option>
              <option value="Ongoing">Ongoing</option>
              <option value="For Approval Design">For Approval Design</option>
              <option value="Design Approved">Design Approved</option>
              <option value="Sent to AE">Sent to AE</option>
              <option value="Sent to Prod">Sent to Prod</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Revising">Revising</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Standard</label>
            <input type="number" class="form-control" id="trackerFormStd" min="0" value="1">
          </div>
          <div class="form-group">
            <label class="form-label">Special</label>
            <input type="number" class="form-control" id="trackerFormSpc" min="0" value="0">
          </div>
          <div class="form-group">
            <label class="form-label">Printing</label>
            <input type="number" class="form-control" id="trackerFormPrt" min="0" value="0">
          </div>
          <div class="form-group">
            <label class="form-label">Revision Count</label>
            <input type="number" class="form-control" id="trackerFormRev" min="0" value="0">
          </div>
          <div class="form-group col-span-2">
            <label class="form-label">Remarks</label>
            <textarea class="form-control" id="trackerFormRemarks" placeholder="Production notes..."></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="flex-shrink: 0;">
        <button type="button" class="btn btn-secondary" data-close-modal="trackerModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btnSaveTrackerTask">Save Changes</button>
      </div>
    </form>
  </div>
</div>

<!-- MODAL: KPI QUICK-VIEW DRAWER/POPUP -->
<div class="modal-backdrop" id="kpiQuickViewModal">
  <div class="modal-container" style="max-width: 840px; width: 92%;">
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge badge-ongoing" id="kpiModalBadge">Active</span>
        <h3 class="modal-title" id="kpiModalTitle" style="font-size: 16px; font-weight: 800;">KPI Projects View</h3>
      </div>
      <button class="modal-close-btn" data-close-modal="kpiQuickViewModal" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="modal-body" style="padding: 16px 22px; max-height: 62vh; overflow-y: auto;">
      <div id="kpiModalContent">
        <!-- Rendered dynamically -->
      </div>
    </div>
    <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <span style="font-size: 12px; color: var(--text-secondary); font-weight: 600;" id="kpiModalFooterCount">Showing 0 records</span>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="btn btn-secondary btn-sm" data-close-modal="kpiQuickViewModal">Close</button>
        <button type="button" class="btn btn-primary btn-sm" id="btnKpiModalFilterTable">Filter Queue Table</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL: PREVIEW ATTACHMENT -->
<div class="modal-backdrop" id="attachmentPreviewModal">
  <div class="modal-container" style="max-width: 800px;">
    <div class="modal-header">
      <h3 class="modal-title" id="attachmentModalTitle">Attachment Preview</h3>
      <button class="modal-close-btn" data-close-modal="attachmentPreviewModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="modal-body" style="padding: 16px; align-items: center; justify-content: center; background: #0F172A;">
      <img id="attachmentModalImg" src="" alt="Proof Preview" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 4px;">
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-close-modal="attachmentPreviewModal">Close Preview</button>
    </div>
  </div>
</div>

<!-- MODAL: CUSTOM DESIGNED CONFIRMATION & SUPER ADMIN DELETE SECURITY PASSCODE DIALOG -->
<!-- MODAL: CUSTOM DESIGNED CONFIRMATION & SUPER ADMIN DELETE SECURITY PASSCODE DIALOG (CLEAN MINIMALIST MONOCHROME) -->
<div class="modal-backdrop" id="customConfirmModal">
  <div class="modal-container" style="max-width: 500px; width: 94%; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 14px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1); animation: modalSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden;">
    <div class="modal-header" style="border-bottom: 1px solid #F4F4F5; padding: 20px 24px; background: #FFFFFF;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div id="confirmModalIconWrap" style="width: 40px; height: 40px; border-radius: 10px; background: #09090B; display: flex; align-items: center; justify-content: center; color: #FFFFFF; flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
        <div>
          <h3 class="modal-title" id="confirmModalTitle" style="font-size: 17px; font-weight: 700; color: #09090B; margin: 0 0 2px 0; letter-spacing: -0.2px;">Permanent Data Deletion</h3>
          <span id="confirmModalSubtitle" style="font-size: 11px; font-weight: 600; color: #71717A; letter-spacing: 0.6px; text-transform: uppercase;">Super Admin Security Authorization</span>
        </div>
      </div>
      <button class="modal-close-btn" data-close-modal="customConfirmModal" aria-label="Close" style="background: none; border: none; cursor: pointer; color: #71717A; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: color 0.15s;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body" style="padding: 22px 24px; background: #FFFFFF;">
      <div id="confirmModalMessage" style="font-size: 13.5px; line-height: 1.55; color: #3F3F46; margin-bottom: 16px;">
        Are you sure you want to permanently delete this record? This action will permanently remove it from both your local workspace and the live MySQL database.
      </div>

      <!-- Record detail summary card -->
      <div id="confirmModalRecordCard" style="display: none; background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 10px; padding: 14px 16px; margin-bottom: 18px; font-size: 13px;">
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; align-items: baseline;">
          <span style="color: #71717A; font-weight: 600;">Request ID:</span>
          <strong id="confirmRecordRequestId" style="color: #09090B; font-size: 13.5px; font-weight: 700;">-</strong>
          <span style="color: #71717A; font-weight: 600;">JO Number:</span>
          <strong id="confirmRecordJoNumber" style="color: #09090B; font-weight: 700;">-</strong>
          <span style="color: #71717A; font-weight: 600;">Project:</span>
          <span id="confirmRecordProjectName" style="color: #18181B; font-weight: 600;">-</span>
          <span style="color: #71717A; font-weight: 600;">Client:</span>
          <span id="confirmRecordClient" style="color: #52525B;">-</span>
        </div>
      </div>

      <!-- Security Passcode Form Section (Isolated in form to prevent browser leaking username into page search bars) -->
      <form autocomplete="off" onsubmit="return false;" style="margin: 0; padding: 0;">
        <!-- Hidden decoy inputs to absorb browser autofill algorithms -->
        <input type="text" name="decoy_username" style="display:none;" aria-hidden="true" tabindex="-1">
        <input type="password" name="decoy_password" style="display:none;" aria-hidden="true" tabindex="-1">

        <div id="confirmPasscodeSection" style="background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 10px; padding: 16px; margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label for="confirmDeletePasscode" style="font-size: 11.5px; font-weight: 700; color: #09090B; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Permission Passcode
            </label>
            <button type="button" id="btnTogglePasscodeSetup" style="background: none; border: none; color: #09090B; font-size: 11.5px; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;">
              Change Passcode
            </button>
          </div>

          <div>
            <input type="password" class="form-control" id="confirmDeletePasscode" placeholder="Enter permission passcode to confirm..." autocomplete="new-password" data-lpignore="true" style="padding: 10px 14px; font-size: 14px; background: #FFFFFF; border: 1px solid #D4D4D8; color: #09090B; letter-spacing: 2px; border-radius: 8px;">
          </div>

          <div id="confirmPasscodeError" style="display: none; color: #DC2626; font-size: 12px; font-weight: 600; margin-top: 8px; background: #FEF2F2; padding: 7px 12px; border-radius: 6px; border: 1px solid #FECACA;"></div>

          <div id="confirmPasscodeHint" style="font-size: 11.5px; color: #71717A; margin-top: 8px; line-height: 1.4;">
            Security safeguard: Super Admin must authenticate with the permission passcode before permanent data deletion takes effect.
          </div>
        </div>

        <!-- Change/Set Passcode Sub-drawer (collapsible) -->
        <div id="confirmPasscodeSetupDrawer" style="display: none; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 10px; padding: 16px; margin-top: 10px;">
          <div style="font-size: 11.5px; font-weight: 700; color: #09090B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            Set New Permission Passcode
          </div>
          <div style="font-size: 12px; color: #71717A; margin-bottom: 12px; line-height: 1.4;">
            For security, please verify your account login password before setting a new passcode:
          </div>
          
          <div style="margin-bottom: 10px;">
            <label for="confirmLoginPasswordInput" style="font-size: 11px; font-weight: 600; color: #52525B; margin-bottom: 4px; display: block;">Your Current Login Password</label>
            <input type="password" class="form-control" id="confirmLoginPasswordInput" placeholder="Enter current login password..." autocomplete="new-password" data-lpignore="true" data-form-type="other" value="" style="background: #FAFAFA; border: 1px solid #D4D4D8; font-size: 13px; border-radius: 8px;">
          </div>

          <div style="margin-bottom: 6px;">
            <label for="confirmNewPasscodeInput" style="font-size: 11px; font-weight: 600; color: #52525B; margin-bottom: 4px; display: block;">New Permission Passcode</label>
            <div style="display: flex; gap: 8px;">
              <input type="password" class="form-control" id="confirmNewPasscodeInput" placeholder="Enter new passcode (e.g. 1234)..." autocomplete="new-password" data-lpignore="true" data-form-type="other" value="" style="background: #FAFAFA; border: 1px solid #D4D4D8; font-size: 13px; border-radius: 8px;">
              <button type="button" class="btn btn-sm" id="btnSaveNewPasscodeInsideModal" style="background: #09090B; border: 1px solid #09090B; color: #FFFFFF; font-weight: 600; padding: 0 16px; border-radius: 8px; white-space: nowrap; cursor: pointer;">Update</button>
            </div>
          </div>

          <div id="confirmNewPasscodeFeedback" style="font-size: 12px; font-weight: 600; margin-top: 8px; display: none;"></div>
        </div>
      </form>
    </div>

    <div class="modal-footer" style="border-top: 1px solid #F4F4F5; padding: 16px 24px; display: flex; justify-content: flex-end; gap: 10px; background: #FAFAFA;">
      <button type="button" class="btn" data-close-modal="customConfirmModal" id="btnCancelCustomConfirm" style="background: #FFFFFF; border: 1px solid #D4D4D8; color: #18181B; font-weight: 600; padding: 8px 18px; border-radius: 8px;">Cancel</button>
      <button type="button" class="btn" id="btnExecuteCustomConfirm" style="background: #000000; border: 1px solid #000000; color: #FFFFFF; font-weight: 700; padding: 8px 20px; border-radius: 8px; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); cursor: pointer;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span id="confirmModalSubmitLabel">Permanently Delete</span>
      </button>
    </div>
  </div>
</div>

<!-- Toast Notification Hub -->
<div class="toast-container" id="toastContainer"></div>
