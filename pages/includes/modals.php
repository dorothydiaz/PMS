<?php
/**
 * Sign Depot Operations PMS — Shared Modal Components & Dialogs
 */
?>
<!-- MODAL: ADD / EDIT SALES REQUEST -->
<div class="modal-backdrop" id="salesModal">
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title" id="salesModalTitle">New Sales Request</h3>
      <button class="modal-close-btn" data-close-modal="salesModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <form id="salesRequestForm">
      <div class="modal-body">
        <input type="hidden" id="salesFormId">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Request ID</label>
            <input type="text" class="form-control" id="salesFormReqId" placeholder="e.g. LR-26-2103" required>
          </div>
          <div class="form-group">
            <label class="form-label">JO Number</label>
            <input type="text" class="form-control" id="salesFormJo" placeholder="e.g. P261001357">
          </div>
          <div class="form-group">
            <label class="form-label required">Sales Representative</label>
            <select class="form-control" id="salesFormSalesRep" required></select>
          </div>
          <div class="form-group">
            <label class="form-label required">Client Name</label>
            <input type="text" class="form-control" id="salesFormClient" placeholder="Company or Client" required>
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
            <label class="form-label">Production Due</label>
            <input type="date" class="form-control" id="salesFormReleasing">
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Artist</label>
            <select class="form-control" id="salesFormArtist"></select>
          </div>
          <div class="form-group">
            <label class="form-label">Priority Level</label>
            <select class="form-control" id="salesFormPriority">
              <option value="Normal">Normal</option>
              <option value="Rush">Rush</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Releasing Mode</label>
            <select class="form-control" id="salesFormRelMode">
              <option value="Install">Install</option>
              <option value="Deliver">Deliver</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">File Sent Status</label>
            <select class="form-control" id="salesFormFileSent">
              <option value="File Sent">File Sent</option>
              <option value="Pending">Pending</option>
              <option value="To Follow">To Follow</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Contact Person</label>
            <input type="text" class="form-control" id="salesFormContactPerson" placeholder="Full name">
          </div>
          <div class="form-group">
            <label class="form-label">Contact Number</label>
            <input type="text" class="form-control" id="salesFormContactNumber" placeholder="e.g. 0917 123 4567">
          </div>
          <div class="form-group col-span-2">
            <label class="form-label">Complete Delivery/Installation Address</label>
            <input type="text" class="form-control" id="salesFormAddress" placeholder="Full address">
          </div>
        </div>
      </div>
      <div class="modal-footer">
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
    <form id="trackerTaskForm">
      <div class="modal-body">
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
            <label class="form-label">Artist Head Approval</label>
            <select class="form-control" id="trackerFormHeadApproval">
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Project Status</label>
            <select class="form-control" id="trackerFormProjectStatus">
              <option value="Pending">Pending</option>
              <option value="On-going">On-going</option>
              <option value="Approved">Approved</option>
              <option value="For Review">For Review</option>
              <option value="Revising">Revising</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Design Status</label>
            <select class="form-control" id="trackerFormDesignStatus">
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="For Review">For Review</option>
              <option value="Revising">Revising</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Standard Count</label>
            <input type="number" class="form-control" id="trackerFormStd" min="0" value="1">
          </div>
          <div class="form-group">
            <label class="form-label">Printing Count</label>
            <input type="number" class="form-control" id="trackerFormPrt" min="0" value="0">
          </div>
          <div class="form-group">
            <label class="form-label">Special Count</label>
            <input type="number" class="form-control" id="trackerFormSpc" min="0" value="0">
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
      <div class="modal-footer">
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

<!-- Toast Notification Hub -->
<div class="toast-container" id="toastContainer"></div>
