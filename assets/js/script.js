/**
 * Sign Depot — Sales & Creative Production Tracker
 * Frontend Application Engine (Vanilla JS, Local Persistence)
 * With Panze Studio Aesthetic & Direct Inline Editable Tables
 */

(function () {
  'use strict';

  // ==========================================================================
  // STORAGE & DEFAULT DATA STRUCTURES
  // ==========================================================================

  const STORAGE_KEY = 'SIGN_DEPOT_OPS_DATA_V4';

  const DEFAULT_ARTISTS = ['Bob', 'Dorothy', 'Glen', 'Goodrich', 'Jules', 'Raven', 'Rodel', 'Tim'];

  const DEFAULT_SALES_REPS = [
    'Aj', 'Alvic', 'Anna', 'Dave', 'Dona', 'Ed', 'Flora', 'Jade', 'Janet',
    'Jasmin', 'Jastine', 'Jay', 'Jen', 'Joana', 'Joie', 'Joyce', 'Kate',
    'Kim', 'Levi', 'Mae', 'Mariel', 'Mike', 'Pia', 'Seven', 'Sheena',
    'Shella', 'Sol'
  ];

  const PROJECT_STATUSES = [
    'On-going', 'For Review', 'Revising', 'Pending Approval', 'Approved', 'Completed', 'On-hold', 'Incomplete Details/Files', 'Cancelled'
  ];

  const DESIGN_STATUSES = [
    'On Queue', 'On-hold', 'Incomplete Details', 'Ongoing', 'For Approval Design', 'Design Approved', 'Sent to AE', 'Sent to Prod', 'Cancelled', 'Revising', 'Completed'
  ];

  const PRIORITY_LEVELS = ['Low', 'Normal', 'Rush'];
  const APPROVAL_LEVELS = [
    'On-going', 'For Review', 'Revising', 'Completed', 'Released', 'Incomplete Details/Files', 'Onhold', 'Pending Approval', 'Approved'
  ];
  const FILE_STATUS_LEVELS = ['N/A', 'File Sent', 'To Follow', 'Incomplete'];
  const FILE_SENT_LEVELS = FILE_STATUS_LEVELS;
  const PLACEMENT_OPTIONS = ['N/A', 'Indoor', 'Outdoor', 'Indoor & Outdoor'];
  const RELEASING_MODES = ['N/A', 'Install', 'Deliver', 'Pickup'];
  const HEAD_APPROVAL_LEVELS = ['Approved', 'Pending', 'Rejected'];

  function toTitleCase(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .split(' ')
      .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
      .join(' ');
  }

  function normalizeReleasingMode(mode) {
    if (!mode) return 'Pickup';
    const m = String(mode).trim().toUpperCase();
    if (m.startsWith('INST')) return 'Install';
    if (m.startsWith('DELIV')) return 'Deliver';
    if (m.startsWith('PICK')) return 'Pickup';
    return 'Pickup';
  }
  window.normalizeReleasingMode = normalizeReleasingMode;

  // Comprehensive Shared Mock Dataset (25+ real-world Sign Depot projects)
  // Live Spreadsheet Database Orders (LR-26-2102 to LR-26-1950 from 1Uwm-SjFgMgo62S8YY2IonJkmy9BfCmcIvZ7Txvp09Pg)
  const DEFAULT_REQUESTS = [];

  // Default Template Layout Elements
  const DEFAULT_TEMPLATE_ELEMENTS = [
    { id: 'el-req', label: 'REQUEST ID', content: 'LR-26-2100', x: 20, y: 15, w: 140, h: 42, fontSize: 13, align: 'center', color: '#DC2626' },
    { id: 'el-jo', label: 'JO NUMBER', content: 'P261001348', x: 180, y: 15, w: 180, h: 42, fontSize: 16, align: 'center', color: '#DC2626' },
    { id: 'el-due', label: 'DUE DATE', content: 'JULY 30, 2026', x: 380, y: 15, w: 160, h: 42, fontSize: 12, align: 'center', color: '#DC2626' },
    { id: 'el-proj', label: 'PROJECT NAME', content: 'LACOST & SMH & MK', x: 20, y: 75, w: 420, h: 50, fontSize: 22, align: 'center', color: '#1F2937' },
    { id: 'el-client', label: 'CLIENT NAME', content: 'DECALPRO PRINTING SERVICES', x: 20, y: 135, w: 420, h: 45, fontSize: 20, align: 'center', color: '#1F2937' },
    { id: 'el-incharge', label: 'IN-CHARGE', content: 'DONA', x: 20, y: 195, w: 200, h: 44, fontSize: 12, align: 'center', color: '#1F2937' },
    { id: 'el-drawnby', label: 'DRAWN BY', content: 'GLEN', x: 240, y: 195, w: 200, h: 44, fontSize: 12, align: 'center', color: '#1F2937' },
    { id: 'el-contact', label: 'CONTACT NUMBER', content: '639178805364', x: 460, y: 75, w: 220, h: 40, fontSize: 12, align: 'left', color: '#1F2937' },
    { id: 'el-orderdate', label: 'ORDER DATE', content: '23/10/2026', x: 460, y: 125, w: 220, h: 40, fontSize: 12, align: 'left', color: '#1F2937' },
    { id: 'el-releasing', label: 'RELEASING DATE', content: 'JULY 30, 2026', x: 460, y: 175, w: 220, h: 40, fontSize: 12, align: 'left', color: '#1F2937' },
    { id: 'el-mode', label: 'RELEASING MODE', content: 'PICKUP', x: 460, y: 225, w: 220, h: 40, fontSize: 12, align: 'left', color: '#1F2937' },
    { id: 'el-installers', label: 'INSTALLERS', content: '2 Installers', x: 700, y: 75, w: 170, h: 90, fontSize: 13, align: 'center', color: '#1F2937' },
    { id: 'el-duration', label: 'DURATION', content: '1 Day (4 Hours)', x: 700, y: 175, w: 170, h: 90, fontSize: 13, align: 'center', color: '#1F2937' },
    { id: 'el-address', label: 'DELIVERY ADDRESS', content: 'Block 14 Lot 3, Ortigas Ave Extension, Pasig City', x: 20, y: 250, w: 420, h: 45, fontSize: 11, align: 'left', color: '#1F2937' }
  ];

  // Default Mock Attachments
  const DEFAULT_ATTACHMENTS = [
    {
      id: 'att-1',
      name: 'Sign_Depot_Vector_Spec_URAL.png',
      type: 'Vector Blueprint',
      size: '1.4 MB',
      dateAdded: '2026-10-23',
      storageType: 'Local Spec',
      url: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20240%22%20width%3D%22400%22%20height%3D%22240%22%3E%3Crect%20width%3D%22400%22%20height%3D%22240%22%20fill%3D%22%230B132B%22%2F%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%231C2541%22%20stroke-width%3D%220.8%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22400%22%20height%3D%22240%22%20fill%3D%22url%28%23grid%29%22%2F%3E%3Crect%20x%3D%2225%22%20y%3D%2225%22%20width%3D%22350%22%20height%3D%22190%22%20fill%3D%22none%22%20stroke%3D%22%233A86FF%22%20stroke-width%3D%221.5%22%20stroke-dasharray%3D%224%2C2%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2245%22%20width%3D%22320%22%20height%3D%2290%22%20rx%3D%228%22%20fill%3D%22%231C2541%22%20stroke%3D%22%2348CAE4%22%20stroke-width%3D%221.5%22%2F%3E%3Cpolygon%20points%3D%2260%2C60%20180%2C60%20160%2C115%2040%2C115%22%20fill%3D%22%23DC2626%22%2F%3E%3Ctext%20x%3D%2270%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2222%22%20fill%3D%22%23FFFFFF%22%20font-style%3D%22italic%22%3ESIGN%20DEPOT%3C%2Ftext%3E%3Ctext%20x%3D%22195%22%20y%3D%2280%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2213%22%20fill%3D%22%23FFFFFF%22%3E3D%20ACRYLIC%20CHANNEL%3C%2Ftext%3E%3Ctext%20x%3D%22195%22%20y%3D%22100%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22500%22%20font-size%3D%2210.5%22%20fill%3D%22%2348CAE4%22%3ELED%20BACKLIT%20%E2%80%A2%203000K%20WARM%3C%2Ftext%3E%3Ctext%20x%3D%22195%22%20y%3D%22118%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22500%22%20font-size%3D%229.5%22%20fill%3D%22%2394A3B8%22%3ESCALE%201%3A20%20%E2%80%A2%203400%20x%20950%20MM%3C%2Ftext%3E%3Cline%20x1%3D%2240%22%20y1%3D%22150%22%20x2%3D%22360%22%20y2%3D%22150%22%20stroke%3D%22%2300B4D8%22%20stroke-width%3D%221.2%22%2F%3E%3Cpolygon%20points%3D%2240%2C150%2048%2C147%2048%2C153%22%20fill%3D%22%2300B4D8%22%2F%3E%3Cpolygon%20points%3D%22360%2C150%20352%2C147%20352%2C153%22%20fill%3D%22%2300B4D8%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22146%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2211%22%20fill%3D%22%2300B4D8%22%20text-anchor%3D%22middle%22%3EW%3A%203400%20mm%3C%2Ftext%3E%3Crect%20x%3D%2225%22%20y%3D%22185%22%20width%3D%22350%22%20height%3D%2230%22%20fill%3D%22%230D1B2A%22%2F%3E%3Ctext%20x%3D%2235%22%20y%3D%22204%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23FFFFFF%22%3ESIGN%20DEPOT%20VECTOR%20SPEC%20%E2%80%94%20URAL%3C%2Ftext%3E%3Ctext%20x%3D%22365%22%20y%3D%22204%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%229%22%20fill%3D%22%2306D6A0%22%20text-anchor%3D%22end%22%3EAPPROVED%20FOR%20PRODUCTION%3C%2Ftext%3E%3C%2Fsvg%3E'
    },
    {
      id: 'att-2',
      name: 'Client_Approved_Facade_Render_PauAcilac.png',
      type: 'Proof Render',
      size: '2.8 MB',
      dateAdded: '2026-10-23',
      storageType: 'Local Render',
      url: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20240%22%20width%3D%22400%22%20height%3D%22240%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22sky%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%220%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230F172A%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231E293B%22%2F%3E%3C%2FlinearGradient%3E%3CradialGradient%20id%3D%22glow%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2250%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23EF4444%22%20stop-opacity%3D%220.45%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23EF4444%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22400%22%20height%3D%22240%22%20fill%3D%22url%28%23sky%29%22%2F%3E%3Crect%20x%3D%2230%22%20y%3D%2230%22%20width%3D%22340%22%20height%3D%22210%22%20fill%3D%22%23334155%22%20stroke%3D%22%23475569%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%22110%22%20width%3D%22300%22%20height%3D%22120%22%20fill%3D%22%231E293B%22%20opacity%3D%220.9%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221%22%2F%3E%3Cline%20x1%3D%22150%22%20y1%3D%22110%22%20x2%3D%22150%22%20y2%3D%22230%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%2F%3E%3Cline%20x1%3D%22250%22%20y1%3D%22110%22%20x2%3D%22250%22%20y2%3D%22230%22%20stroke%3D%22%23475569%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2245%22%20width%3D%22320%22%20height%3D%2260%22%20rx%3D%224%22%20fill%3D%22%2309090B%22%20stroke%3D%22%23DC2626%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2240%22%20y%3D%2245%22%20width%3D%22320%22%20height%3D%2260%22%20fill%3D%22url%28%23glow%29%22%2F%3E%3Cpolygon%20points%3D%2265%2C58%20175%2C58%20155%2C95%2045%2C95%22%20fill%3D%22%23DC2626%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2284%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2218%22%20fill%3D%22%23FFFFFF%22%20font-style%3D%22italic%22%3ESIGN%20DEPOT%3C%2Ftext%3E%3Ctext%20x%3D%22185%22%20y%3D%2276%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22800%22%20font-size%3D%2213%22%20fill%3D%22%23FFFFFF%22%3EPAU%20ACILAC%20STORE%3C%2Ftext%3E%3Ctext%20x%3D%22185%22%20y%3D%2293%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%229.5%22%20fill%3D%22%23FCA5A5%22%3EFACADE%20NIGHT%20RENDER%203D%3C%2Ftext%3E%3Crect%20x%3D%22250%22%20y%3D%22195%22%20width%3D%22110%22%20height%3D%2226%22%20rx%3D%224%22%20fill%3D%22%23065F46%22%20opacity%3D%220.9%22%2F%3E%3Ctext%20x%3D%22305%22%20y%3D%22212%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%229.5%22%20fill%3D%22%23A7F3D0%22%20text-anchor%3D%22middle%22%3E%E2%9C%93%20CLIENT%20APPROVED%3C%2Ftext%3E%3C%2Fsvg%3E'
    },
    {
      id: 'att-3',
      name: 'Engineering_Electrical_Wiring_Diagram.png',
      type: 'Technical Drawing',
      size: '890 KB',
      dateAdded: '2026-10-23',
      storageType: 'Local Schematic',
      url: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20240%22%20width%3D%22400%22%20height%3D%22240%22%3E%3Crect%20width%3D%22400%22%20height%3D%22240%22%20fill%3D%22%230B131E%22%2F%3E%3Cdefs%3E%3Cpattern%20id%3D%22elecGrid%22%20width%3D%2216%22%20height%3D%2216%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2016%200%20L%200%200%200%2016%22%20fill%3D%22none%22%20stroke%3D%22%23152238%22%20stroke-width%3D%220.7%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22400%22%20height%3D%22240%22%20fill%3D%22url%28%23elecGrid%29%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2215%22%20width%3D%22360%22%20height%3D%2230%22%20fill%3D%22%23132338%22%20stroke%3D%22%231E3A5F%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2234%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210.5%22%20fill%3D%22%2338BDF8%22%3EELECTRICAL%20%26%20LED%20WIRING%20SCHEMATIC%20%E2%80%94%20220V%20AC%20%2F%2012V%20DC%3C%2Ftext%3E%3Crect%20x%3D%2235%22%20y%3D%2270%22%20width%3D%2290%22%20height%3D%2280%22%20rx%3D%224%22%20fill%3D%22%231E293B%22%20stroke%3D%22%23F59E0B%22%20stroke-width%3D%221.5%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%22100%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23FBBF24%22%20text-anchor%3D%22middle%22%3EMEANWELL%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22115%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%229%22%20fill%3D%22%23E2E8F0%22%20text-anchor%3D%22middle%22%3ELRS-350-12%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22130%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22500%22%20font-size%3D%228%22%20fill%3D%22%2394A3B8%22%20text-anchor%3D%22middle%22%3E29A%20%E2%80%A2%2012V%20350W%3C%2Ftext%3E%3Cline%20x1%3D%2215%22%20y1%3D%2295%22%20x2%3D%2235%22%20y2%3D%2295%22%20stroke%3D%22%23EF4444%22%20stroke-width%3D%222%22%2F%3E%3Cline%20x1%3D%2215%22%20y1%3D%22125%22%20x2%3D%2235%22%20y2%3D%22125%22%20stroke%3D%22%233B82F6%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2218%22%20y%3D%2290%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23EF4444%22%3EL%20%28220V%29%3C%2Ftext%3E%3Cline%20x1%3D%22125%22%20y1%3D%22100%22%20x2%3D%22180%22%20y2%3D%22100%22%20stroke%3D%22%23DC2626%22%20stroke-width%3D%222.5%22%2F%3E%3Cline%20x1%3D%22125%22%20y1%3D%22120%22%20x2%3D%22180%22%20y2%3D%22120%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222.5%22%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%2294%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%23DC2626%22%3E%2B12V%3C%2Ftext%3E%3Crect%20x%3D%22180%22%20y%3D%2265%22%20width%3D%22185%22%20height%3D%2242%22%20rx%3D%224%22%20fill%3D%22%231E293B%22%20stroke%3D%22%2310B981%22%20stroke-width%3D%221.2%22%2F%3E%3Ctext%20x%3D%22272%22%20y%3D%2285%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%229%22%20fill%3D%22%2334D399%22%20text-anchor%3D%22middle%22%3ELED%20STRING%20A%20%2818%20pcs%20x%201.5W%29%3C%2Ftext%3E%3Ctext%20x%3D%22272%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%2394A3B8%22%20text-anchor%3D%22middle%22%3ESAMSUNG%20CHIP%20%E2%80%A2%20IP67%3C%2Ftext%3E%3Crect%20x%3D%22180%22%20y%3D%22120%22%20width%3D%22185%22%20height%3D%2242%22%20rx%3D%224%22%20fill%3D%22%231E293B%22%20stroke%3D%22%2310B981%22%20stroke-width%3D%221.2%22%2F%3E%3Ctext%20x%3D%22272%22%20y%3D%22140%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%229%22%20fill%3D%22%2334D399%22%20text-anchor%3D%22middle%22%3ELED%20STRING%20B%20%2818%20pcs%20x%201.5W%29%3C%2Ftext%3E%3Ctext%20x%3D%22272%22%20y%3D%22153%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%2394A3B8%22%20text-anchor%3D%22middle%22%3ESAMSUNG%20CHIP%20%E2%80%A2%20IP67%3C%2Ftext%3E%3Cline%20x1%3D%2280%22%20y1%3D%22150%22%20x2%3D%2280%22%20y2%3D%22190%22%20stroke%3D%22%2310B981%22%20stroke-width%3D%221.5%22%20stroke-dasharray%3D%223%2C2%22%2F%3E%3Ctext%20x%3D%2285%22%20y%3D%22185%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%228%22%20fill%3D%22%2310B981%22%3EEARTH%20GROUND%3C%2Ftext%3E%3Crect%20x%3D%2220%22%20y%3D%22195%22%20width%3D%22360%22%20height%3D%2230%22%20fill%3D%22%230D1622%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%22214%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-weight%3D%22600%22%20font-size%3D%229%22%20fill%3D%22%2394A3B8%22%3EENGINEERING%20DWG%20REV%202.4%20%E2%80%A2%20APPROVED%20FOR%20INSTALLATION%3C%2Ftext%3E%3C%2Fsvg%3E'
    }
  ];

  // ==========================================================================
  // STATE STORE (Unified Central State with LocalStorage Sync)
  // ==========================================================================

  const ROWS_PER_PAGE_KEY = 'SIGN_DEPOT_DEFAULT_PER_PAGE';

  function getStoredRowsPerPage() {
    try {
      const saved = localStorage.getItem(ROWS_PER_PAGE_KEY);
      if (saved) {
        const n = parseInt(saved, 10);
        if ([10, 15, 20, 25, 30].includes(n)) return n;
      }
    } catch (e) {}
    return 10;
  }

  function setStoredRowsPerPage(n) {
    try {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        localStorage.setItem(ROWS_PER_PAGE_KEY, String(val));
      }
    } catch (e) {}
  }

  const initialRowsPerPage = getStoredRowsPerPage();

  let state = {
    artists: [...DEFAULT_ARTISTS],
    salesReps: [...DEFAULT_SALES_REPS],
    requests: JSON.parse(JSON.stringify(DEFAULT_REQUESTS)).map(r => ({ ...r, releasingMode: normalizeReleasingMode(r.releasingMode) })),
    templateElements: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS)),
    attachments: [...DEFAULT_ATTACHMENTS],
    activeView: 'view-dashboard',
    currentDirectiveJo: 'P261001348',
    salesFilter: { search: '', priority: '', approval: '', fileSent: '', salesRep: '', location: '', deadline: '', sortField: 'orderDate', sortDir: 'desc', page: 1, perPage: initialRowsPerPage, approvalTab: '' },
    trackerFilter: { search: '', headApproval: '', projectStatus: '', designStatus: '', artist: '', overdue: '', datePreset: '', dateCustom: '', dateColumn: 'orderDate', sortField: 'requestId', sortDir: 'desc', page: 1, perPage: initialRowsPerPage },
    trackerAcceptanceTab: 'accepted',
    pendingSalesFilter: 'all',
    pendingSalesSearch: '',
    pendingSalesPage: 1,
    pendingSalesPerPage: initialRowsPerPage,
    pendingArtistSelected: 'Glen',
    pendingArtistPage: 1,
    pendingArtistPerPage: initialRowsPerPage,
    workloadFilter: { availability: '', search: '', selectedArtist: '' },
    workloadPage: 1,
    workloadPerPage: initialRowsPerPage,
    dashboardSearch: '',
    dashboardStatus: '',
    dashboardDeadline: '',
    dashboardKpiFilter: '',
    dashboardPage: 1,
    trackerKpiFilter: 'all',
    dashboardPerPage: initialRowsPerPage,
    monthlyOutputPage: 1,
    monthlyOutputPerPage: initialRowsPerPage,
    selectedTemplateElemId: null,
    customCellFonts: {},
    directiveZoom: 100,
    directiveEnvType: '',
    draftSalesRequest: null
  };

  function normalizeRequestItem(r) {
    if (!r) return;

    // Normalize projectStatus: (Completed, On-going)
    if (!r.projectStatus || typeof r.projectStatus !== 'string' || !r.projectStatus.trim() || r.projectStatus === '[object Object]') {
      r.projectStatus = 'On-going';
    } else {
      const ps = r.projectStatus.trim().toLowerCase();
      r.projectStatus = (ps === 'completed') ? 'Completed' : 'On-going';
    }

    // Normalize designStatus: (On Queue, On-hold, Incomplete Details, Ongoing, For Approval Design, Design Approved, Sent to AE, Sent to Prod, Cancelled, Revising, Completed)
    if (!r.designStatus || typeof r.designStatus !== 'string' || !r.designStatus.trim() || r.designStatus === '[object Object]' || r.designStatus === '{}') {
      r.designStatus = (r.projectStatus === 'Completed') ? 'Completed' : 'On Queue';
    } else {
      let ds = r.designStatus.trim();
      const dsLower = ds.toLowerCase();
      if (dsLower === 'in progress' || dsLower === 'ongoing') ds = 'Ongoing';
      else if (dsLower === 'not started' || dsLower === 'queue' || dsLower === 'on queue') ds = 'On Queue';
      else if (dsLower === 'submitted') ds = (r.projectStatus === 'Completed') ? 'Completed' : 'Sent to AE';
      else if (dsLower === 'for review') ds = 'For Approval Design';
      else if (dsLower === 'approved') ds = 'Design Approved';
      else if (dsLower === 'on hold' || dsLower === 'on-hold') ds = 'On-hold';
      else if (dsLower === 'incomplete' || dsLower === 'incomplete details') ds = 'Incomplete Details';
      else if (dsLower === 'revising') ds = 'Revising';
      else if (dsLower === 'cancelled') ds = 'Cancelled';
      else if (dsLower === 'sent to prod') ds = 'Sent to Prod';
      else if (dsLower === 'sent to ae') ds = 'Sent to AE';
      else if (dsLower === 'completed') ds = 'Completed';
      else if (DESIGN_STATUSES.includes(ds)) r.designStatus = ds;
      else ds = (r.projectStatus === 'Completed') ? 'Completed' : 'On Queue';
      r.designStatus = ds;
    }

    // Normalize headApproval: (Approved, Pending, Rejected)
    if (!r.headApproval || typeof r.headApproval !== 'string' || !r.headApproval.trim()) {
      r.headApproval = 'Pending';
    } else {
      const ha = r.headApproval.trim().toLowerCase();
      if (ha.includes('appr')) r.headApproval = 'Approved';
      else if (ha.includes('rej')) r.headApproval = 'Rejected';
      else r.headApproval = 'Pending';
    }

    // Normalize clientApproval: (On-going, For Review, Revising, Completed, Released, Incomplete Details/Files, Onhold, Pending Approval, Approved)
    if (!r.clientApproval || typeof r.clientApproval !== 'string' || !r.clientApproval.trim()) {
      r.clientApproval = 'Pending Approval';
    } else {
      const ca = r.clientApproval.trim().toLowerCase();
      if (ca === 'approved') r.clientApproval = 'Approved';
      else if (ca === 'pending' || ca === 'pending approval') r.clientApproval = 'Pending Approval';
      else if (ca.includes('revision') || ca === 'revising') r.clientApproval = 'Revising';
      else if (ca === 'completed') r.clientApproval = 'Completed';
      else if (ca === 'on-going' || ca === 'ongoing') r.clientApproval = 'On-going';
      else if (ca === 'for review') r.clientApproval = 'For Review';
      else if (ca === 'released') r.clientApproval = 'Released';
      else if (ca.includes('incomplete')) r.clientApproval = 'Incomplete Details/Files';
      else if (ca.includes('hold')) r.clientApproval = 'Onhold';
      else if (!APPROVAL_LEVELS.includes(r.clientApproval)) r.clientApproval = 'Pending Approval';
    }

    // Normalize priority level: (Low, Normal, Rush)
    if (!r.priority || typeof r.priority !== 'string' || !r.priority.trim()) {
      r.priority = 'Normal';
    } else {
      const p = r.priority.trim().toLowerCase();
      if (p === 'rush') r.priority = 'Rush';
      else if (p === 'low') r.priority = 'Low';
      else r.priority = 'Normal';
    }

    // Normalize file status: (blank/N/A, file sent, to follow, incomplete)
    if (!r.fileSent || typeof r.fileSent !== 'string' || !r.fileSent.trim()) {
      r.fileSent = 'N/A';
    } else {
      const fs = r.fileSent.trim().toLowerCase();
      if (fs === 'file sent' || fs === 'sent' || fs === 'filesent') r.fileSent = 'File Sent';
      else if (fs === 'to follow' || fs === 'tofollow') r.fileSent = 'To Follow';
      else if (fs === 'incomplete') r.fileSent = 'Incomplete';
      else r.fileSent = 'N/A';
    }

    // Normalize placement: (Blank/N/A, Indoor, Outdoor, Indoor & Outdoor)
    if (!r.location || typeof r.location !== 'string' || !r.location.trim() || r.location === 'Blank') {
      r.location = 'N/A';
    } else {
      const loc = r.location.trim().toLowerCase();
      if (loc.includes('&') || (loc.includes('indoor') && loc.includes('outdoor'))) r.location = 'Indoor & Outdoor';
      else if (loc.includes('outdoor')) r.location = 'Outdoor';
      else if (loc.includes('indoor')) r.location = 'Indoor';
      else r.location = 'N/A';
    }

    // Normalize mode of releasing: (Blank/N/A, Install, Deliver, Pickup)
    if (!r.releasingMode || typeof r.releasingMode !== 'string' || !r.releasingMode.trim() || r.releasingMode === 'Blank') {
      r.releasingMode = 'N/A';
    } else {
      const rm = r.releasingMode.trim().toLowerCase();
      if (rm.includes('inst')) r.releasingMode = 'Install';
      else if (rm.includes('deliv')) r.releasingMode = 'Deliver';
      else if (rm.includes('pick')) r.releasingMode = 'Pickup';
      else r.releasingMode = 'N/A';
    }

    if (r.salesRep && typeof r.salesRep === 'string') r.salesRep = toTitleCase(r.salesRep);
    if (r.artist && typeof r.artist === 'string') r.artist = toTitleCase(r.artist);

    // Timestamps
    if (!r.timestamp || r.timestamp === '') r.timestamp = r.orderDate || 'N/A';
    if (!r.dateUpdated || r.dateUpdated === '') r.dateUpdated = r.orderDate || 'N/A';

    // Blank field defaults
    if (!r.completeAddress || r.completeAddress.trim() === '') r.completeAddress = 'N/A';
    if (!r.contactPerson || r.contactPerson.trim() === '') r.contactPerson = 'N/A';
    if (!r.contactNumber || r.contactNumber.trim() === '') r.contactNumber = 'N/A';
    if (!r.remarks || r.remarks.trim() === '') r.remarks = 'N/A';
  }

  function loadStateFromStorage() {
    let hydratedFromCache = false;
    // 1. Check localStorage, but PURGE if it contains old fictional mock data
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.requests) && parsed.requests.length > 0) {
          // Check if this is old dummy mock data or a partial cached slice (< 2100 records)
          const isStaleMockData = (parsed.requests.length < 2100) || parsed.requests.some(r => r.id === 'req-001' || r.id === 'mock-001');
          if (isStaleMockData) {
            console.log('Purging stale/partial (' + parsed.requests.length + ' rows) cache from localStorage, loading live full dataset...');
            localStorage.removeItem(STORAGE_KEY);
          } else {
            parsed.requests.forEach(normalizeRequestItem);
            state.requests = parsed.requests;
            saveStateToStorage();
            if (parsed.artists) {
              state.artists = parsed.artists
                .filter(a => a !== 'Seven' && a !== 'Edrian')
                .map(toTitleCase);
              if (!state.artists.includes('Dorothy')) {
                state.artists.push('Dorothy');
              }
              state.artists.sort();
            } else {
              state.artists = [...DEFAULT_ARTISTS];
            }
            if (parsed.salesReps && Array.isArray(parsed.salesReps) && parsed.salesReps.length > 0) {
              state.salesReps = parsed.salesReps
                .filter(s => s && s.toLowerCase() !== 'shela' && s.toLowerCase() !== 'tim')
                .map(toTitleCase);
              state.salesReps.sort();
            } else {
              state.salesReps = [...DEFAULT_SALES_REPS];
            }
            if (!state.salesReps.includes('Jastine')) {
              state.salesReps.push('Jastine');
              state.salesReps.sort();
            }
            // Sanitize requests to replace typo Shela with Shella
            if (state.requests && Array.isArray(state.requests)) {
              state.requests.forEach(r => {
                if (r && r.salesRep && r.salesRep.toLowerCase() === 'shela') {
                  r.salesRep = 'Shella';
                }
              });
            }
            if (parsed.directiveZoom) state.directiveZoom = parsed.directiveZoom;
            if (parsed.directiveEnvType !== undefined) state.directiveEnvType = parsed.directiveEnvType;
            if (parsed.artistWorkloadFromSheet) state.artistWorkloadFromSheet = parsed.artistWorkloadFromSheet;
            if (parsed.attachments && Array.isArray(parsed.attachments) && parsed.attachments.length > 0) {
              state.attachments = parsed.attachments;
            }
            
            const storedRows = getStoredRowsPerPage();
            if (state.salesFilter) state.salesFilter.perPage = storedRows;
            if (state.trackerFilter) state.trackerFilter.perPage = storedRows;
            state.pendingSalesPerPage = storedRows;
            state.pendingArtistPerPage = storedRows;
            state.workloadPerPage = storedRows;
            state.dashboardPerPage = storedRows;
            state.monthlyOutputPerPage = storedRows;
            hydratedFromCache = true;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Fallback to cached requests or default dataset if not hydrated from local storage
    if (!hydratedFromCache) {
      if (window.PmsCache && window.PmsCache.isCachePermitted()) {
        const cached = window.PmsCache.getCachedRequests();
        if (cached && Array.isArray(cached) && cached.length > 0) {
          cached.forEach(normalizeRequestItem);
          state.requests = cached;
          hydratedFromCache = true;
        }
      }
      if (!hydratedFromCache) {
        state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
        state.requests.forEach(normalizeRequestItem);
      }
      state.artists = DEFAULT_ARTISTS.map(toTitleCase);
      state.salesReps = DEFAULT_SALES_REPS.map(toTitleCase);
      saveStateToStorage();
    }

    // 3. If running in PHP environment with live MySQL backend, sync live records
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_artists')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
            state.artists = res.data
              .map(a => toTitleCase(a.name || a))
              .filter(a => a !== 'Seven' && a !== 'Edrian')
              .sort();
            saveStateToStorage();
            populateSalesFiltersDropdowns();
            populateTrackerFiltersDropdowns();
            if (state.activeView === 'view-artist-workload') {
              renderArtistWorkload();
            } else if (state.activeView === 'view-settings') {
              renderSettings();
            }
          }
        })
        .catch(e => console.warn('MySQL live artists fetch:', e));

      fetch(window.PMS_API_URL + '?action=get_sales_reps')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
            const reps = res.data
              .filter(s => s && s.toLowerCase() !== 'shela' && s.toLowerCase() !== 'tim')
              .map(toTitleCase);
            state.salesReps = reps.sort();
            saveStateToStorage();
            populateSalesFiltersDropdowns();
            if (state.activeView === 'view-settings') {
              renderSettings();
            }
          }
        })
        .catch(e => console.warn('MySQL live sales reps fetch:', e));

      fetch(window.PMS_API_URL + '?action=get_all_requests')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data)) {
            res.data.forEach(normalizeRequestItem);
            state.requests = res.data;
            saveStateToStorage();
            if (window.PmsCache && window.PmsCache.isCachePermitted()) {
              window.PmsCache.setCachedRequests(res.data);
            }
            updateDashboardKPIs();
            renderCurrentView(state.activeView);
          } else if (res && !res.success) {
            console.error('MySQL live requests fetch failed:', res.error);
            showToast('⚠️ Database Notice: ' + (res.error || 'Could not connect to database. Check config.php.'), 'error');
            // Gracefully render default dataset so page is never empty
            renderCurrentView(state.activeView);
          }
        })
        .catch(e => {
          console.warn('MySQL live requests fetch error:', e);
          // Gracefully render default dataset so page is never empty
          renderCurrentView(state.activeView);
        });
    }
  }

  function saveStateToStorage() {
    // Respect user privacy: only save cache/localStorage if permitted!
    if (window.PmsCache && !window.PmsCache.isCachePermitted()) {
      return;
    }
    try {
      const dataToSave = {
        artists: state.artists,
        salesReps: state.salesReps,
        requests: state.requests,
        templateElements: state.templateElements,
        attachments: state.attachments,
        customCellFonts: state.customCellFonts || {},
        directiveZoom: state.directiveZoom || 100,
        directiveEnvType: state.directiveEnvType || ''
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      if (window.PmsCache) {
        window.PmsCache.setCachedRequests(state.requests);
      }
      pulseAutoSaveIndicator();
    } catch (e) {
      console.warn('Could not save to localStorage.', e);
    }
  }

  function pulseAutoSaveIndicator() {
    const pill = document.querySelector('.auto-save-pill');
    if (pill) {
      pill.style.transform = 'scale(1.08)';
      pill.style.background = '#D1FAE5';
      setTimeout(() => {
        pill.style.transform = 'scale(1)';
        pill.style.background = '#ECFDF5';
      }, 350);
    }
  }

  // ==========================================================================
  // GRANULAR PERMISSION ENGINE (Module, Tab, Table & Column Level)
  // ==========================================================================

  function getCurrentUserPermissions() {
    if (window.PMS_CURRENT_USER && window.PMS_CURRENT_USER.permissions) {
      let p = window.PMS_CURRENT_USER.permissions;
      if (typeof p === 'string') {
        try { p = JSON.parse(p); } catch (e) { p = {}; }
      }
      return p;
    }
    return null;
  }

  function isCurrentUserSuperAdmin() {
    return window.PMS_CURRENT_USER && (window.PMS_CURRENT_USER.role === 'super_admin');
  }

  function getModuleForCurrentView() {
    const view = state.activeView || detectCurrentPage();
    const map = {
      'view-sales-requests': 'sales-requests',
      'view-pending-sales': 'sales-requests',
      'view-creatives-tracker': 'creatives-tracker',
      'view-artist-workload': 'artist-workload',
      'view-directives-details': 'directives-details',
      'view-dashboard': 'dashboard',
      'view-monthly-output': 'monthly-output',
      'view-reports': 'reports',
      'view-access-control': 'access-control',
      'view-audit-trail': 'audit-trail',
      'view-settings': 'settings'
    };
    return map[view] || 'sales-requests';
  }

  function canUserEditField(module, fieldName) {
    if (!window.PMS_CURRENT_USER) return true; // Standalone demo fallback
    if (isCurrentUserSuperAdmin()) return true;

    const perms = getCurrentUserPermissions();
    if (!perms) return true;

    const mod = module || getModuleForCurrentView();

    // 1. Check if user has general update (u) permission for this module/table
    if (!perms[mod] || !perms[mod].u) {
      return false;
    }

    // 2. Check if specific columns are restricted
    const editableCols = perms[mod].editable_columns;
    if (editableCols === undefined || editableCols === null || editableCols === '*' || (Array.isArray(editableCols) && (editableCols.length === 0 || editableCols.includes('*')))) {
      return true; // All columns editable
    }

    if (Array.isArray(editableCols)) {
      return editableCols.includes(fieldName);
    }

    return false;
  }

  function canUserAccessTab(module, tabKey) {
    if (!window.PMS_CURRENT_USER) return true;
    if (isCurrentUserSuperAdmin()) return true;
    const perms = getCurrentUserPermissions();
    if (!perms || !perms[module]) return true;
    if (perms[module].tabs && typeof perms[module].tabs[tabKey] !== 'undefined') {
      return Boolean(perms[module].tabs[tabKey]);
    }
    return true;
  }

  // ==========================================================================
  // DIRECT INLINE TABLE EDITING ENGINE
  // ==========================================================================

  // Updates any field on a request directly, recalculates dependent views and persists
  function updateRequestField(requestId, fieldName, newValue, domElement) {
    const currentMod = getModuleForCurrentView();

    // Enforce column-level permissions
    if (!canUserEditField(currentMod, fieldName)) {
      showToast(`Editing Locked: You do not have permission to edit the '${fieldName}' column on this table.`, 'error');
      if (domElement && domElement.isContentEditable) {
        const existing = state.requests.find(r => r.id === requestId);
        domElement.textContent = existing ? (existing[fieldName] || '') : '';
      }
      return;
    }

    const rec = state.requests.find(r => r.id === requestId);
    if (!rec) return;

    if (currentMod === 'sales-requests' && typeof newValue === 'string' && newValue.trim() === '') {
      showToast(`This detail cannot be left empty on sales requests.`, 'error');
      if (domElement && domElement.isContentEditable) {
        domElement.textContent = rec[fieldName] || '';
        domElement.classList.add('is-invalid-detail');
        setTimeout(() => domElement.classList.remove('is-invalid-detail'), 1500);
      }
      return;
    }

    // Parse numbers if applicable
    if (['countStandard', 'countPrinting', 'countSpecial', 'revisionCount'].includes(fieldName)) {
      rec[fieldName] = Math.max(0, parseInt(newValue, 10) || 0);
    } else {
      rec[fieldName] = (typeof newValue === 'string') ? newValue.trim() : newValue;
    }

    // Auto update completion date if status is marked Completed
    if (fieldName === 'projectStatus') {
      if (rec.projectStatus === 'Completed' && !rec.completionDate) {
        rec.completionDate = '2026-10-23';
      }
      if (rec.projectStatus !== 'Completed') {
        rec.completionDate = null;
      }
    }

    // Track Date Updated
    rec.dateUpdated = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Visual feedback
    if (domElement) {
      domElement.classList.add('cell-just-saved');
      setTimeout(() => domElement.classList.remove('cell-just-saved'), 1000);
    }

    saveStateToStorage();

    // Live MySQL Database Sync
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=update_field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rec.id || requestId,
          field: fieldName,
          value: rec[fieldName],
          module: currentMod
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res && !res.success) {
          showToast(res.error || 'Server rejected update.', 'error');
        } else if (res && res.success) {
          if (window.PmsCache) window.PmsCache.invalidate();
        }
      })
      .catch(err => console.warn('MySQL update sync failed:', err));
    }

    updateDeadlineAlertCenter();

    // Dynamically refresh dependent views if on Dashboard, Workload or Output
    if (state.activeView === 'view-dashboard') {
      updateDashboardKPIs();
      renderPanzeDonutChart();
      renderPanzeTaskCards();
    } else if (state.activeView === 'view-artist-workload') {
      renderArtistWorkload();
    } else if (state.activeView === 'view-monthly-output') {
      renderMonthlyOutputReport();
    } else if (state.activeView === 'view-sales-requests' || currentMod === 'sales-requests') {
      if (fieldName === 'clientApproval') {
        renderSalesRequests();
      }
    }
  }

  // Generates directly editable text cell HTML (or locked read-only span)
  function renderEditableCell(reqId, fieldName, currentValue, extraClass = '', extraStyle = '') {
    const canEdit = canUserEditField(null, fieldName);
    const styleAttr = extraStyle ? ` style="${extraStyle}"` : '';
    const hasVal = currentValue !== null && currentValue !== undefined && String(currentValue).trim() !== '' && String(currentValue).trim() !== '—';
    const displayVal = hasVal ? String(currentValue).trim() : 'N/A';
    const isNA = displayVal === 'N/A';
    const naClass = isNA ? ' is-na-default' : '';

    if (!canEdit) {
      return `<span class="read-only-cell ${extraClass}${naClass}" data-req-id="${reqId}" data-field="${fieldName}" title="Editing locked: Read-only for your role"${styleAttr}>${escapeHTML(displayVal)}</span>`;
    }

    const placeholderMap = {
      projectName: 'Enter project name...',
      client: 'Enter client name...',
      joNumber: 'Enter JO #...',
      contactPerson: 'Contact name...',
      contactNumber: 'Phone #...',
      completeAddress: 'Enter full address...',
      remarks: 'Add remarks...'
    };
    const ph = placeholderMap[fieldName] || 'N/A';

    return `<span class="editable-cell ${extraClass}${naClass}" contenteditable="true"${styleAttr} 
      data-req-id="${reqId}" data-field="${fieldName}" data-placeholder="${ph}"
      onfocus="if(this.textContent.trim()==='N/A'){this.textContent='';this.classList.remove('is-na-default');}"
      onblur="window.SignDepotApp.handleInlineTextBlur(this)" 
      onkeydown="window.SignDepotApp.handleInlineTextKey(event, this)">${escapeHTML(displayVal)}</span>`;
  }

  // Badge styling resolver for custom dropdown pills
  function getBadgeClassForValue(fieldName, val) {
    if (!val || val === 'N/A' || val === 'Blank') return 'badge-neutral';
    const v = String(val).toLowerCase();
    if (fieldName === 'location') {
      if (v.includes('&') || (v.includes('indoor') && v.includes('outdoor'))) return 'badge-location-both';
      if (v.includes('outdoor')) return 'badge-location-outdoor';
      if (v.includes('indoor')) return 'badge-location-indoor';
      return 'badge-location-indoor';
    }
    if (fieldName === 'artist') return 'badge-artist';
    if (fieldName === 'salesRep') return 'badge-sales';
    if (['completed', 'approved', 'design approved', 'sent to prod', 'file sent'].includes(v)) return 'badge-completed';
    if (['in progress', 'on-going', 'ongoing', 'sent to ae', 'working'].includes(v)) return 'badge-ongoing';
    if (['pending', 'pending approval', 'for review', 'for approval design', 'on queue', 'queue', 'needs revision', 'to follow'].includes(v)) return 'badge-pending';
    if (['revising'].includes(v)) return 'badge-revising';
    if (['released'].includes(v)) return 'badge-released';
    if (['rush', 'high', 'rejected', 'incomplete details/files', 'incomplete', 'cancelled'].includes(v)) return 'badge-priority-rush';
    if (['medium', 'med', 'normal'].includes(v)) return 'badge-priority-med';
    if (['not started', 'draft', 'low', 'on-hold', 'onhold'].includes(v)) return 'badge-not-started';
    return 'badge-neutral';
  }

  // Dot indicator styling resolver for dropdown options
  function getIndicatorClass(fieldName, val) {
    if (!val || val === 'N/A' || val === 'Blank') return 'indicator-neutral';
    const v = String(val).toLowerCase();
    if (v === 'overdue' || v.includes('past due')) return 'indicator-rush';
    if (v === 'today' || v.includes('due today')) return 'indicator-pending';
    if (v === 'soon' || v.includes('almost due')) return 'indicator-warning';
    if (v === 'ontrack' || v === 'ontime' || v.includes('on track')) return 'indicator-completed';
    if (fieldName === 'location' || fieldName === 'salesFormLocation' || fieldName === 'salesFilterLocation') {
      if (v.includes('&') || (v.includes('indoor') && v.includes('outdoor'))) return 'indicator-location-both';
      if (v.includes('outdoor')) return 'indicator-location-outdoor';
      if (v.includes('indoor')) return 'indicator-location-indoor';
      return 'indicator-location-indoor';
    }
    if (fieldName === 'artist' || fieldName === 'salesFormArtist' || fieldName === 'trackerFormArtist' || fieldName === 'trackerFilterArtist') return 'indicator-artist';
    if (fieldName === 'salesRep' || fieldName === 'salesFormSalesRep' || fieldName === 'salesFilterSalesRep') return 'indicator-sales';
    if (['completed', 'approved', 'design approved', 'sent to prod', 'released', 'file sent'].includes(v)) return 'indicator-completed';
    if (['in progress', 'on-going', 'ongoing', 'working', 'sent to ae', 'install', 'deliver'].includes(v)) return 'indicator-ongoing';
    if (['pending', 'pending approval', 'for review', 'for approval design', 'on queue', 'revising', 'needs revision', 'queue', 'to follow'].includes(v)) return 'indicator-pending';
    if (['rush', 'high', 'rejected', 'incomplete', 'incomplete details/files', 'cancelled'].includes(v)) return 'indicator-rush';
    return 'indicator-neutral';
  }

  // Generates directly editable custom themed dropdown trigger HTML (or locked read-only badge)
  function renderInlineSelect(reqId, fieldName, currentValue, optionsList) {
    if (typeof currentValue === 'object' || currentValue === null || currentValue === undefined || currentValue === '[object Object]') {
      currentValue = '';
    }
    const canEdit = canUserEditField(null, fieldName);
    const hasVal = currentValue && String(currentValue).trim() !== '' && String(currentValue).trim() !== 'Blank';
    const displayVal = hasVal ? String(currentValue).trim() : 'N/A';
    const isNA = displayVal === 'N/A';
    const badgeClass = !isNA ? getBadgeClassForValue(fieldName, displayVal) : 'badge-neutral';
    const safeVal = escapeHTML(displayVal);

    if (!canEdit) {
      return `
        <span class="custom-select-btn is-readonly ${badgeClass}${isNA ? ' is-na-default' : ''}"
          data-req-id="${reqId}"
          data-field="${fieldName}"
          title="Editing locked: Read-only for your role">
          <span class="custom-select-label">${safeVal}</span>
        </span>
      `;
    }

    let options = Array.isArray(optionsList) ? [...optionsList] : [];
    if (!options.includes('N/A')) {
      options = ['N/A', ...options.filter(o => o !== '' && o !== 'Blank')];
    }
    const safeOptions = JSON.stringify(options).replace(/"/g, '&quot;');
    return `
      <button type="button" class="custom-select-btn ${badgeClass} ${isNA ? 'is-na-default is-blank' : ''}"
        data-req-id="${reqId}"
        data-field="${fieldName}"
        data-current="${escapeHTML(displayVal)}"
        data-options="${safeOptions}"
        data-tooltip="Click to change ${fieldName}"
        onclick="window.SignDepotApp.openCustomDropdown(this, event)">
        <span class="custom-select-label">${safeVal}</span>
        <svg class="custom-select-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    `;
  }

  // ==========================================================================
  // CUSTOM THEMED DROPDOWN ENGINE (Floating Popover with Drop Shadows & Search)
  // ==========================================================================

  let activeDropdownTrigger = null;

  function closeCustomDropdown() {
    const popover = document.getElementById('sdCustomDropdownMenu');
    if (popover) {
      popover.classList.remove('show');
      popover.style.display = 'none';
      popover.style.minWidth = '';
      popover.style.maxWidth = '';
    }
    if (activeDropdownTrigger) {
      activeDropdownTrigger.classList.remove('is-active');
      activeDropdownTrigger = null;
    }
  }

  function openCustomDropdown(triggerBtn, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!triggerBtn || triggerBtn.classList.contains('is-readonly')) {
      return;
    }

    const fld = triggerBtn.getAttribute('data-field');
    const isDraft = triggerBtn.getAttribute('data-is-draft') === 'true' || (triggerBtn.id && triggerBtn.id.startsWith('draft'));
    if (!isDraft && !canUserEditField(null, fld)) {
      showToast(`Editing Locked: You do not have permission to edit the '${fld}' column.`, 'error');
      return;
    }

    if (activeDropdownTrigger === triggerBtn) {
      closeCustomDropdown();
      return;
    }

    closeCustomDropdown();

    let popover = document.getElementById('sdCustomDropdownMenu');
    if (!popover) {
      popover = document.createElement('div');
      popover.id = 'sdCustomDropdownMenu';
      popover.className = 'sd-custom-dropdown-popover';
      popover.innerHTML = `
        <div class="sd-dropdown-header" id="sdDropdownHeader" style="display: none;">
          <input type="text" class="sd-dropdown-search" id="sdDropdownSearch" placeholder="Filter options..." autocomplete="off">
        </div>
        <div class="sd-dropdown-options" id="sdDropdownOptions"></div>
      `;
      document.body.appendChild(popover);
    }

    const optionsContainer = document.getElementById('sdDropdownOptions');
    const headerContainer = document.getElementById('sdDropdownHeader');
    const searchInput = document.getElementById('sdDropdownSearch');

    let optionsList = [];
    try {
      optionsList = JSON.parse(triggerBtn.getAttribute('data-options') || '[]');
    } catch (err) {
      optionsList = [];
    }

    const fieldName = triggerBtn.getAttribute('data-field') || '';
    const currentVal = triggerBtn.getAttribute('data-current') || '';
    const reqId = triggerBtn.getAttribute('data-req-id') || '';

    // Show search filter if 6 or more items (e.g. for artists or long lists)
    if (optionsList.length >= 6) {
      headerContainer.style.display = 'block';
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 60);
    } else {
      headerContainer.style.display = 'none';
    }

    const renderOptions = (filterText = '') => {
      const q = filterText.toLowerCase();
      const filtered = optionsList.filter(opt => {
        const label = typeof opt === 'object' ? opt.label : String(opt);
        return label.toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        optionsContainer.innerHTML = '<div style="padding: 10px; font-size: 11.5px; color: var(--text-muted); text-align: center;">No matches found</div>';
        return;
      }

      optionsContainer.innerHTML = filtered.map(opt => {
        const val = typeof opt === 'object' ? opt.value : String(opt);
        const label = typeof opt === 'object' ? opt.label : String(opt);
        const isSelected = String(val) === String(currentVal);
        const indicator = getIndicatorClass(fieldName, val);
        const displayLabel = label || '— Blank —';
        return `
          <div class="custom-dropdown-opt ${isSelected ? 'selected' : ''}" data-val="${escapeHTML(val)}" data-label="${escapeHTML(label)}">
            <span class="opt-indicator ${indicator}"></span>
            <span class="opt-label">${escapeHTML(displayLabel)}</span>
            ${isSelected ? '<svg class="opt-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
        `;
      }).join('');

      optionsContainer.querySelectorAll('.custom-dropdown-opt').forEach(optEl => {
        optEl.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const selectedVal = optEl.getAttribute('data-val');
          const selectedLabel = optEl.getAttribute('data-label');
          selectCustomDropdownValue(triggerBtn, reqId, fieldName, selectedVal, selectedLabel);
        });
      });
    };

    renderOptions();

    if (searchInput) {
      searchInput.oninput = () => renderOptions(searchInput.value.trim());
      searchInput.onkeydown = (ev) => {
        if (ev.key === 'Escape') closeCustomDropdown();
        if (ev.key === 'Enter') {
          const first = optionsContainer.querySelector('.custom-dropdown-opt');
          if (first) {
            const val = first.getAttribute('data-val');
            const lbl = first.getAttribute('data-label');
            selectCustomDropdownValue(triggerBtn, reqId, fieldName, val, lbl);
          }
        }
      };
    }

    activeDropdownTrigger = triggerBtn;
    triggerBtn.classList.add('is-active');

    popover.style.display = 'block';
    popover.classList.add('show');

    // Precision positioning relative to document
    const rect = triggerBtn.getBoundingClientRect();
    const isFormDropdown = triggerBtn.classList.contains('custom-form-dropdown-btn');
    if (isFormDropdown) {
      popover.style.minWidth = `${rect.width}px`;
      popover.style.maxWidth = `${Math.max(rect.width, 320)}px`;
    } else {
      popover.style.minWidth = '';
      popover.style.maxWidth = '';
    }

    const popoverRect = popover.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = rect.bottom + scrollTop + 4;
    let left = rect.left + scrollLeft;

    if (rect.bottom + popoverRect.height + 10 > window.innerHeight && rect.top - popoverRect.height > 0) {
      top = rect.top + scrollTop - popoverRect.height - 4;
    }

    if (rect.left + popoverRect.width > window.innerWidth - 10) {
      left = rect.right + scrollLeft - popoverRect.width;
    }

    popover.style.top = `${Math.max(10, top)}px`;
    popover.style.left = `${Math.max(10, left)}px`;
  }

  function selectCustomDropdownValue(triggerBtn, reqId, fieldName, selectedVal, selectedLabel) {
    closeCustomDropdown();
    if (!triggerBtn) return;

    const finalVal = selectedVal || '';
    triggerBtn.setAttribute('data-current', finalVal);
    const labelSpan = triggerBtn.querySelector('.custom-select-label');
    if (labelSpan) {
      labelSpan.textContent = finalVal ? (selectedLabel || finalVal) : '';
    }

    const isDraft = triggerBtn.getAttribute('data-is-draft') === 'true' || (triggerBtn.id && triggerBtn.id.startsWith('draft'));
    if (isDraft) {
      const badgeClass = finalVal ? getBadgeClassForValue(fieldName, finalVal) : '';
      triggerBtn.className = `custom-select-btn draft-custom-select ${badgeClass} ${!finalVal ? 'is-blank' : ''}`;
      if (state.draftSalesRequest) {
        state.draftSalesRequest[fieldName] = finalVal;
      }
      return;
    }

    if (reqId) {
      triggerBtn.className = `custom-select-btn ${getBadgeClassForValue(fieldName, finalVal)} cell-just-saved`;
      updateRequestField(reqId, fieldName, finalVal, triggerBtn);
      showToast(`Updated ${fieldName} to ${finalVal}.`);
    } else if (triggerBtn._nativeSelect) {
      triggerBtn._nativeSelect.value = finalVal;
      triggerBtn._nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      if (finalVal) {
        triggerBtn.classList.add('has-value');
      } else {
        triggerBtn.classList.remove('has-value');
      }
    }
  }

  function initCustomDropdownEngine() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#sdCustomDropdownMenu') && 
          !e.target.closest('.custom-select-btn') && 
          !e.target.closest('.custom-filter-dropdown-btn') && 
          !e.target.closest('.custom-form-dropdown-btn')) {
        closeCustomDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCustomDropdown();
    });
  }

  // Upgrades toolbar filter <select> elements into sleek custom dropdown buttons
  function upgradeAllFilterSelects() {
    const selects = document.querySelectorAll('select.filter-input');
    selects.forEach(sel => {
      if (sel._customUpgraded) return;
      sel._customUpgraded = true;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-filter-dropdown-btn';
      if (sel.id) {
        btn.classList.add(`filter-btn-${sel.id}`);
        btn.id = `${sel.id}_customBtn`;
      }
      if (sel.value) btn.classList.add('has-value');

      const currentText = sel.options[sel.selectedIndex]?.text || 'Filter';
      btn.innerHTML = `
        <span class="custom-select-label">${escapeHTML(currentText)}</span>
        <svg class="custom-select-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      `;

      btn._nativeSelect = sel;

      const getOptionsArray = () => {
        return Array.from(sel.options).map(o => ({ value: o.value, label: o.text }));
      };

      btn.addEventListener('click', (e) => {
        const opts = getOptionsArray();
        btn.setAttribute('data-options', JSON.stringify(opts));
        btn.setAttribute('data-current', sel.value);
        btn.setAttribute('data-field', sel.id);
        openCustomDropdown(btn, e);
      });

      sel.style.display = 'none';
      sel.parentNode.insertBefore(btn, sel.nextSibling);

      sel.addEventListener('change', () => {
        const txt = sel.options[sel.selectedIndex]?.text || 'Filter';
        const lbl = btn.querySelector('.custom-select-label');
        if (lbl) lbl.textContent = txt;
        btn.setAttribute('data-current', sel.value || '');
        if (sel.value) {
          btn.classList.add('has-value');
        } else {
          btn.classList.remove('has-value');
        }
      });
    });
  }

  // Synchronizes the custom filter dropdown button UI with its underlying native select element
  function syncFilterSelectUI(selectEl) {
    if (!selectEl) return;
    const btn = (selectEl.nextElementSibling && selectEl.nextElementSibling.classList.contains('custom-filter-dropdown-btn'))
      ? selectEl.nextElementSibling
      : (selectEl.id ? document.getElementById(`${selectEl.id}_customBtn`) : null);
    if (btn) {
      const txt = selectEl.options[selectEl.selectedIndex]?.text || 'Filter';
      const lbl = btn.querySelector('.custom-select-label');
      if (lbl) lbl.textContent = txt;
      btn.setAttribute('data-current', selectEl.value || '');
      if (selectEl.value) {
        btn.classList.add('has-value');
      } else {
        btn.classList.remove('has-value');
      }
    }
  }

  // Upgrades form <select class="form-control"> elements into sleek custom studio dropdowns
  function upgradeAllFormSelects() {
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(sel => {
      // Normalize option text to Title Case if it's all uppercase
      Array.from(sel.options).forEach(opt => {
        let txt = opt.textContent || opt.value || '';
        if (txt && txt === txt.toUpperCase() && txt.length > 1) {
          opt.textContent = toTitleCase(txt);
        }
      });

      if (sel._customFormUpgraded && sel._formDropdownBtn) {
        syncFormDropdownBtn(sel);
        return;
      }
      sel._customFormUpgraded = true;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-form-dropdown-btn';
      if (sel.id) btn.id = `btnDropdown_${sel.id}`;
      sel._formDropdownBtn = btn;
      btn._nativeSelect = sel;

      sel.style.display = 'none';
      sel.parentNode.insertBefore(btn, sel.nextSibling);

      syncFormDropdownBtn(sel);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Refresh options in case they were dynamically populated
        const opts = Array.from(sel.options).map(o => {
          let label = o.text || o.value;
          if (label && label === label.toUpperCase() && label.length > 1) {
            label = toTitleCase(label);
          }
          return { value: o.value, label: label };
        });

        btn.setAttribute('data-options', JSON.stringify(opts));
        btn.setAttribute('data-current', sel.value);
        btn.setAttribute('data-field', sel.id);
        openCustomDropdown(btn, e);
      });

      sel.addEventListener('change', () => {
        syncFormDropdownBtn(sel);
      });
    });
  }

  function syncFormDropdownBtn(sel) {
    if (!sel || !sel._formDropdownBtn) return;
    const btn = sel._formDropdownBtn;
    const selectedOpt = sel.options[sel.selectedIndex];
    let label = selectedOpt ? (selectedOpt.text || selectedOpt.value) : (sel.value || '-- Select --');
    if (label && label === label.toUpperCase() && label.length > 1) {
      label = toTitleCase(label);
    }
    btn.innerHTML = `
      <span class="custom-select-label">${escapeHTML(label || '-- Select --')}</span>
      <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
    `;
    if (sel.value) {
      btn.classList.add('has-value');
    } else {
      btn.classList.remove('has-value');
    }
  }

  function syncAllFormDropdowns() {
    document.querySelectorAll('select.form-control').forEach(sel => {
      syncFormDropdownBtn(sel);
    });
  }

  // ==========================================================================
  // CUSTOM THEMED TOOLTIP ENGINE (Instant Smooth Minimalist Tooltips)
  // ==========================================================================

  function initCustomTooltipEngine() {
    let tooltip = document.getElementById('sdGlobalTooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'sdGlobalTooltip';
      tooltip.className = 'sd-custom-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      document.body.appendChild(tooltip);
    }

    const convertTitles = () => {
      document.querySelectorAll('[title]').forEach(el => {
        const t = el.getAttribute('title');
        if (t && t.trim()) {
          el.setAttribute('data-tooltip', t.trim());
          el.removeAttribute('title');
        }
      });
    };

    convertTitles();

    const observer = new MutationObserver(() => convertTitles());
    observer.observe(document.body, { childList: true, subtree: true, attributeFilter: ['title'] });

    document.addEventListener('mouseover', (e) => {
      // Suppress tooltips if deadline alert dropdown or any modal is open
      const alertDd = document.getElementById('deadlineAlertDropdown');
      if (alertDd && alertDd.classList.contains('show')) {
        tooltip.classList.remove('show');
        return;
      }
      if (e.target.closest('#deadlineAlertContainer, .deadline-alert-dropdown, .deadline-alert-btn')) {
        tooltip.classList.remove('show');
        return;
      }

      const target = e.target.closest('[data-tooltip]');
      if (!target) {
        tooltip.classList.remove('show');
        return;
      }

      // Suppress/hide tooltips when the sidebar is toggled open (expanded)
      const sidebarEl = target.closest('#appSidebar, .sidebar');
      if (sidebarEl && !sidebarEl.classList.contains('collapsed')) {
        tooltip.classList.remove('show');
        return;
      }

      const text = target.getAttribute('data-tooltip');
      if (!text || !text.trim()) return;

      tooltip.textContent = text;
      tooltip.className = 'sd-custom-tooltip';

      const rect = target.getBoundingClientRect();
      const tipRect = tooltip.getBoundingClientRect();

      let top = rect.top - 30;
      let left = rect.left + (rect.width / 2) - (tipRect.width / 2);

      if (top < 10) {
        top = rect.bottom + 8;
        tooltip.classList.add('pos-bottom');
      }
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tipRect.width - 8;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.classList.add('show');
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        tooltip.classList.remove('show');
      }
    });

    window.addEventListener('scroll', () => tooltip.classList.remove('show'), { passive: true });
  }

  // Generates directly editable date picker HTML (or locked read-only date)
  function renderInlineDate(reqId, fieldName, currentDateValue, projectStatus) {
    const canEdit = canUserEditField(null, fieldName);
    if (!canEdit) {
      return `
        <div class="inline-date-cell-wrap" style="opacity: 0.85;">
          <input type="date" class="inline-date-input is-readonly" value="${currentDateValue || ''}" disabled title="Editing locked: Read-only for your role" style="cursor: default;">
        </div>
      `;
    }

    return `
      <div class="inline-date-cell-wrap">
        <input type="date" class="inline-date-input" value="${currentDateValue || ''}"
          data-req-id="${reqId}" data-field="${fieldName}"
          onchange="window.SignDepotApp.handleInlineDateChange(this)">
      </div>
    `;
  }

  // Generates directly editable number input HTML (or locked read-only number)
  function renderInlineNumber(reqId, fieldName, currentNumValue) {
    const canEdit = canUserEditField(null, fieldName);
    if (!canEdit) {
      return `
        <input type="number" class="inline-num-input is-readonly" min="0" value="${currentNumValue || 0}" disabled title="Editing locked: Read-only for your role" style="cursor: default; opacity: 0.85;">
      `;
    }

    return `
      <input type="number" class="inline-num-input" min="0" value="${currentNumValue || 0}"
        data-req-id="${reqId}" data-field="${fieldName}"
        onchange="window.SignDepotApp.handleInlineNumberChange(this)">
    `;
  }

  // ==========================================================================
  // UTILITIES & HELPERS
  // ==========================================================================

  let lastToastMsg = '';
  let lastToastTime = 0;
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const now = Date.now();
    if (message === lastToastMsg && (now - lastToastTime) < 600) {
      return; // Deduplicate rapid identical toasts
    }
    lastToastMsg = message;
    lastToastTime = now;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#176B55" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.showToast = showToast;

  // Safe global stubs to prevent ReferenceErrors when not on dashboard.js
  if (typeof window.updateDashboardKPIs !== 'function') {
    window.updateDashboardKPIs = function() {
      if (window.SignDepotApp && typeof window.SignDepotApp.updateDashboardKPIs === 'function') {
        window.SignDepotApp.updateDashboardKPIs();
      }
    };
  }
  if (typeof window.renderDashboard !== 'function') {
    window.renderDashboard = function() {
      if (window.SignDepotApp && typeof window.SignDepotApp.renderDashboard === 'function') {
        window.SignDepotApp.renderDashboard();
      }
    };
  }

  function getLoggedInArtist() {
    const u = window.PMS_CURRENT_USER;
    if (!u) return null;
    if (u.role === 'artist' || u.assigned_artist) {
      if (u.assigned_artist) return u.assigned_artist;
      // Auto-fallback from username/full_name if role is artist
      if (u.role === 'artist') {
        const known = ['Glen', 'Jules', 'Raven', 'Bob', 'Tim', 'Goodrich', 'Rodel', 'Dorothy', 'Russel', 'Gilbert', 'Benjie'];
        for (const k of known) {
          if ((u.username && u.username.toLowerCase().includes(k.toLowerCase())) ||
              (u.full_name && u.full_name.toLowerCase().includes(k.toLowerCase()))) {
            return k;
          }
        }
        if ((u.username && u.username.toLowerCase().includes('dorothy')) ||
            (u.full_name && u.full_name.toLowerCase().includes('dorothy'))) {
          return 'Dorothy';
        }
      }
    }
    return null;
  }

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    if (typeof str === 'object') return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    if (dateStr.includes('-') && dateStr.length === 10) {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  function formatReadableDate(dateStr) {
    if (!dateStr) return '-';
    if (dateStr.length === 10 && dateStr.includes('-')) {
      const d = new Date(dateStr + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      }
    }
    return dateStr.toUpperCase();
  }

  function isProjectArtistAccepted(valOrObj) {
    if (valOrObj === null || valOrObj === undefined) return false;
    if (typeof valOrObj === 'object') {
      const st = valOrObj.artistAccepted ?? valOrObj.artist_accepted;
      if (!st || st === 'Pending' || st === 'pending' || st === false) return false;
      return String(st).trim().toLowerCase() === 'accepted';
    }
    if (!valOrObj || valOrObj === 'Pending' || valOrObj === 'pending' || valOrObj === false) return false;
    return String(valOrObj).trim().toLowerCase() === 'accepted';
  }
  window.isProjectArtistAccepted = isProjectArtistAccepted;

  // Real-time Deadline Alert Calculation based on user local date vs artist acceptance
  function getDeadlineAlertStatus(deadlineStr, projectStatus, artistAccepted, acceptedDate, orderDate) {
    // Support passing full request record as first argument
    if (typeof deadlineStr === 'object' && deadlineStr !== null) {
      const r = deadlineStr;
      deadlineStr = r.designDeadline || r.design_deadline;
      projectStatus = r.projectStatus || r.project_status;
      artistAccepted = r.artistAccepted ?? r.artist_accepted;
      acceptedDate = r.artistAcceptedDate ?? r.artist_accepted_date;
      orderDate = r.orderDate ?? r.order_date;
    }

    if (projectStatus === 'Completed') {
      return { status: 'none', label: 'On Track', diffDays: null, diffText: '', pillText: '' };
    }

    // If pending acceptance by artist: not overdue, awaiting acceptance
    if (!isProjectArtistAccepted(artistAccepted)) {
      return {
        status: 'pending_accept',
        label: 'Pending Acceptance',
        diffDays: null,
        diffText: 'Pending Acceptance',
        pillText: 'Pending Accept'
      };
    }

    if (!deadlineStr) {
      return { status: 'none', label: 'On Track', diffDays: null, diffText: '', pillText: '' };
    }

    const parts = String(deadlineStr).trim().split('-');
    if (parts.length < 3) {
      return { status: 'none', label: 'On Track', diffDays: null, diffText: '', pillText: '' };
    }

    const dYear = parseInt(parts[0], 10);
    const dMonth = parseInt(parts[1], 10) - 1;
    const dDay = parseInt(parts[2], 10);
    if (isNaN(dYear) || isNaN(dMonth) || isNaN(dDay)) {
      return { status: 'none', label: 'On Track', diffDays: null, diffText: '', pillText: '' };
    }

    let targetDate = new Date(dYear, dMonth, dDay);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 1000 * 60 * 60 * 24;

    // Overdue indicator based on the day project was accepted by artist vs design deadline
    if (acceptedDate) {
      const aParts = String(acceptedDate).trim().split('-');
      if (aParts.length >= 3) {
        const aYear = parseInt(aParts[0], 10);
        const aMonth = parseInt(aParts[1], 10) - 1;
        const aDay = parseInt(aParts[2], 10);
        if (!isNaN(aYear) && !isNaN(aMonth) && !isNaN(aDay)) {
          const accDate = new Date(aYear, aMonth, aDay);
          // If project was accepted after the original deadline date:
          // Preserve expected turnaround duration starting from the day it was accepted
          if (accDate.getTime() > targetDate.getTime()) {
            let turnaroundDays = 1;
            if (orderDate) {
              const oParts = String(orderDate).trim().split('-');
              if (oParts.length >= 3) {
                const oDate = new Date(parseInt(oParts[0], 10), parseInt(oParts[1], 10) - 1, parseInt(oParts[2], 10));
                if (!isNaN(oDate.getTime()) && targetDate.getTime() > oDate.getTime()) {
                  turnaroundDays = Math.max(1, Math.round((targetDate.getTime() - oDate.getTime()) / msPerDay));
                }
              }
            }
            targetDate = new Date(accDate.getTime() + (turnaroundDays * msPerDay));
          }
        }
      }
    }

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / msPerDay);

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        status: 'overdue',
        label: 'Past Due',
        diffDays,
        diffText: daysAgo === 1 ? '1 day past due' : `${daysAgo} days past due`,
        pillText: daysAgo === 1 ? '1d overdue' : `${daysAgo}d overdue`
      };
    } else if (diffDays === 0) {
      return {
        status: 'today',
        label: 'Due Today',
        diffDays,
        diffText: 'Due today',
        pillText: 'Today'
      };
    } else if (diffDays <= 2) {
      const daysLeft = diffDays;
      return {
        status: 'soon',
        label: 'Almost Due',
        diffDays,
        diffText: daysLeft === 1 ? 'Due tomorrow' : `Due in ${daysLeft} days`,
        pillText: daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft}d`
      };
    } else {
      return {
        status: 'ontrack',
        label: 'On Track',
        diffDays,
        diffText: `Due in ${diffDays} days`,
        pillText: `${diffDays}d`
      };
    }
  }

  function isOverdue(deadlineStr, projectStatus, artistAccepted, acceptedDate, orderDate) {
    return getDeadlineAlertStatus(deadlineStr, projectStatus, artistAccepted, acceptedDate, orderDate).status === 'overdue';
  }

  function getStatusBadgeClass(status) {
    if (typeof status === 'object' || !status) return 'badge-not-started';
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'On-going': return 'badge-ongoing';
      case 'Approved': return 'badge-approved';
      case 'For Review': return 'badge-for-review';
      case 'Revising': return 'badge-revising';
      case 'Completed': return 'badge-completed';
      case 'Submitted': return 'badge-completed';
      case 'On Hold': return 'badge-on-hold';
      case 'Not Started': return 'badge-not-started';
      case 'In Progress': return 'badge-ongoing';
      default: return 'badge-not-started';
    }
  }
  window.getStatusBadgeClass = getStatusBadgeClass;

  function getPriorityBadgeClass(priority) {
    switch (priority) {
      case 'Rush': return 'badge-priority-rush';
      case 'High': return 'badge-priority-high';
      case 'Medium': return 'badge-priority-med';
      case 'Low': return 'badge-priority-low';
      default: return 'badge-priority-low';
    }
  }

  function getAvailabilityBadge(activeCount) {
    if (activeCount <= 3) return { text: 'Available', class: 'badge-avail-available', colorClass: 'bar-green' };
    if (activeCount <= 7) return { text: 'Moderate', class: 'badge-avail-moderate', colorClass: 'bar-teal' };
    if (activeCount <= 9) return { text: 'Near Capacity', class: 'badge-avail-near', colorClass: 'bar-amber' };
    return { text: 'Full', class: 'badge-avail-full', colorClass: 'bar-red' };
  }

  // ==========================================================================
  // NAVIGATION & MULTI-PAGE VIEW ROUTER
  // ==========================================================================

  const PAGE_MAP = {
    'view-dashboard': 'index.html',
    'view-sales-requests': 'sales-requests.html',
    'view-creatives-tracker': 'creatives-production.html',
    'view-artist-workload': 'artist-workload.html',
    'view-directives-details': 'directives-details.html',
    'view-pending-sales': 'sales-requests.html',
    'view-monthly-output': 'monthly-output.html',
    'view-reports': 'reports.html',
    'view-access-control': 'access-control.html',
    'view-audit-trail': 'audit-trail.html',
    'view-settings': 'settings.html'
  };

  function isInsidePagesDir() {
    const p = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    return p.includes('/pages/') || p.endsWith('/pages');
  }

  function isPhpEnv() {
    return window.location.pathname.toLowerCase().endsWith('.php') || 
           window.location.href.toLowerCase().includes('.php') || 
           typeof window.PMS_API_URL !== 'undefined';
  }

  function getPageUrl(filename) {
    let target = filename;
    if (isPhpEnv()) {
      target = target.replace(/\.html$/i, '.php');
    }
    const inside = isInsidePagesDir();
    if (target === 'index.html' || target === 'index.php') {
      return inside ? '../' + target : target;
    }
    return inside ? target : 'pages/' + target;
  }

  function detectCurrentPage() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage && (PAGE_MAP[bodyPage] || document.getElementById(bodyPage))) return bodyPage;

    const path = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    const rawFile = path.split('/').pop() || 'index.php';
    const filename = rawFile.replace(/\.(html|php)$/i, '');
    for (const [viewId, pageFile] of Object.entries(PAGE_MAP)) {
      const pageBase = pageFile.toLowerCase().replace(/\.(html|php)$/i, '');
      if (filename === pageBase) return viewId;
    }
    if (document.getElementById('view-' + filename)) {
      return 'view-' + filename;
    }
    return 'view-dashboard';
  }

  function switchView(viewId) {
    state.activeView = viewId;

    // Check if the target view panel exists on the current page
    const targetPanel = document.getElementById(viewId);
    if (!targetPanel) {
      const targetPage = PAGE_MAP[viewId];
      if (targetPage) {
        const currentFile = (window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.php').toLowerCase();
        const destFile = (targetPage.replace(/\\/g, '/').split('/').pop() || '').toLowerCase().replace(/\.html$/i, isPhpEnv() ? '.php' : '.html');
        if (currentFile !== destFile) {
          window.location.href = getPageUrl(targetPage);
          return;
        }
      }
    }

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
      if (panel.id === viewId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    const moduleTitles = {
      'view-dashboard': { title: 'Project Dashboard', badge: 'Live Operations' },
      'view-sales-requests': { title: 'Sales Requests', badge: 'Order Management' },
      'view-creatives-tracker': { title: 'Creatives Tracker', badge: 'Production Queue' },
      'view-artist-workload': { title: 'Artist Workload', badge: 'Capacity & Assignments' },
      'view-directives-details': { title: 'Directives Details', badge: 'Printable Job Orders' },
      'view-pending-sales': { title: 'Pending Projects — Sales', badge: 'Sales Actions' },
      'view-monthly-output': { title: 'Monthly Production Output', badge: 'Verified 2026 Metrics' },
      'view-reports': { title: 'Reports & Analytics', badge: 'Performance Intelligence' },
      'view-access-control': { title: 'Access Control & Users', badge: 'RBAC Administration' },
      'view-audit-trail': { title: 'Audit Trail', badge: 'Security Logs' },
      'view-settings': { title: 'System Settings', badge: 'Configuration' }
    };

    const titleInfo = moduleTitles[viewId] || { title: 'Sign Depot Operations', badge: 'System' };
    const titleEl = document.getElementById('moduleTitle');
    if (titleEl) {
      titleEl.innerHTML = `${titleInfo.title} <span class="module-badge" id="moduleCategoryBadge">${titleInfo.badge}</span>`;
    }

    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    const isTableFitView = (viewId === 'view-sales-requests' || viewId === 'view-creatives-tracker');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.toggle('layout-table-fit', isTableFitView);
    }
    document.body.classList.toggle('layout-table-fit', isTableFitView);

    renderCurrentView(viewId);
  }


  function canUserAccessModule(moduleName) {
    const perms = getCurrentUserPermissions();
    if (!perms || !moduleName) return true;
    if (perms['*'] && perms['*']['*']) return true;
    return !!perms[moduleName];
  }

  function hasPermission(moduleName, perm) {
    const perms = getCurrentUserPermissions();
    if (!perms || !moduleName) return true;
    if (perms['*'] && perms['*']['*']) return true;
    const modPerms = perms[moduleName];
    if (!modPerms) return false;
    return modPerms.includes(perm) || modPerms.includes('*');
  }

  function getLoggedInSalesRep() {
    const u = window.PMS_CURRENT_USER;
    if (!u) return '';
    return u.sales_rep || u.full_name || u.username || '';
  }

  function bindRowsSelects(ids, setter) {
    if (!Array.isArray(ids)) return;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => setter(el.value));
      }
    });
  }

  // ==========================================================================
  // DYNAMIC PAGE MODULE LOADER
  // ==========================================================================

  window.SignDepotLoadedModules = window.SignDepotLoadedModules || {};

  function ensurePageModuleLoaded(viewId, callback) {
    const viewToScript = {
      'view-dashboard': 'dashboard.js',
      'view-sales-requests': 'sales-requests.js',
      'view-creatives-tracker': 'creatives-tracker.js',
      'view-pending-sales': 'creatives-tracker.js',
      'view-artist-workload': 'artist-workload.js',
      'view-directives-details': 'directives.js',
      'view-monthly-output': 'monthly-output.js',
      'view-reports': 'reports.js',
      'view-settings': 'settings.js',
      'view-access-control': 'settings.js',
      'view-audit-trail': 'settings.js'
    };
    const scriptFile = viewToScript[viewId];
    if (!scriptFile) {
      if (callback) callback();
      return;
    }
    const scriptId = 'script-module-' + scriptFile.replace('.js', '');
    if (document.getElementById(scriptId) || window.SignDepotLoadedModules[scriptFile]) {
      if (callback) callback();
      return;
    }
    const base = window.PMS_BASE_URL || '';
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = base + 'assets/js/pages/' + scriptFile + '?v=' + Date.now();
    script.onload = () => {
      window.SignDepotLoadedModules[scriptFile] = true;
      if (callback) callback();
    };
    script.onerror = () => {
      if (callback) callback();
    };
    document.body.appendChild(script);
  }

  function renderCurrentView(viewId) {
    ensurePageModuleLoaded(viewId, () => {
      const App = window.SignDepotApp || {};
      switch (viewId) {
        case 'view-dashboard':
          if (typeof App.renderDashboard === 'function') App.renderDashboard();
          break;
        case 'view-sales-requests':
          if (typeof App.renderSalesRequests === 'function') App.renderSalesRequests();
          break;
        case 'view-creatives-tracker':
          if (typeof App.renderCreativesTracker === 'function') App.renderCreativesTracker();
          break;
        case 'view-artist-workload':
          if (typeof App.renderArtistWorkload === 'function') App.renderArtistWorkload();
          break;
        case 'view-directives-details':
          if (typeof App.renderDirectivePreview === 'function') App.renderDirectivePreview();
          break;
        case 'view-pending-sales':
          if (typeof App.renderPendingSalesQueue === 'function') App.renderPendingSalesQueue();
          break;
        case 'view-monthly-output':
          if (typeof App.renderMonthlyOutputReport === 'function') App.renderMonthlyOutputReport(state.timeframe || 'all');
          break;
        case 'view-reports':
          if (typeof App.renderReports === 'function') App.renderReports(state.timeframe || 'all');
          break;
        case 'view-access-control':
          if (typeof loadUsersList === 'function') loadUsersList();
          break;
        case 'view-settings':
          if (typeof App.renderSettings === 'function') App.renderSettings();
          break;
      }
    });

    // Sync in-page Timeframe Pills if on monthly-output or reports
    const curTf = state.timeframe || 'month';
    document.querySelectorAll('#outputTimeframeTabs .timeframe-btn, #reportTimeframeTabs .timeframe-btn').forEach(b => {
      const bTf = b.getAttribute('data-timeframe');
      b.classList.toggle('active', bTf === curTf);
    });

    // Ensure all filter and form selects in the active view are upgraded to custom themed buttons
    upgradeAllFilterSelects();
    upgradeAllFormSelects();
  }

  // [MODULE 1: DASHBOARD ENGINE] Extracted to assets/js/pages/dashboard.js

  // ==========================================================================
  // UNIFIED PAGINATION & ROWS-PER-PAGE RENDERER
  // ==========================================================================

  function renderPagination(opts) {
    const {
      infoId,
      controlsId,
      selectIds = [],
      currentPage = 1,
      perPage = 10,
      totalItems = 0,
      onPageChange = '',
      itemLabel = 'items'
    } = opts;

    const totalPages = Math.max(Math.ceil(totalItems / perPage), 1);
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (validPage - 1) * perPage;
    const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
    const endDisplay = Math.min(startIndex + perPage, totalItems);

    // Sync Info label
    const infoEl = document.getElementById(infoId);
    if (infoEl) {
      infoEl.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems} ${itemLabel}`;
    }

    // Sync all rows-per-page select dropdowns
    selectIds.forEach(id => {
      const sel = document.getElementById(id);
      if (sel && sel.value !== String(perPage)) {
        sel.value = String(perPage);
        const customBtn = sel.nextElementSibling;
        if (customBtn && customBtn.classList.contains('custom-filter-dropdown-btn')) {
          const lbl = customBtn.querySelector('.custom-select-label');
          if (lbl) lbl.textContent = sel.options[sel.selectedIndex]?.text || `${perPage} rows`;
        }
      }
    });

    // Render Controls
    const controlsEl = document.getElementById(controlsId);
    if (controlsEl) {
      if (totalPages <= 1) {
        controlsEl.innerHTML = '';
        return { validPage, startIndex, totalPages };
      }

      let btnsHTML = `
        <button class="page-btn" ${validPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${validPage - 1})" aria-label="Previous Page" title="Previous Page">&laquo;</button>
      `;

      if (totalPages <= 7) {
        for (let p = 1; p <= totalPages; p++) {
          btnsHTML += `<button class="page-btn ${p === validPage ? 'active' : ''}" onclick="${onPageChange}(${p})">${p}</button>`;
        }
      } else {
        btnsHTML += `<button class="page-btn ${validPage === 1 ? 'active' : ''}" onclick="${onPageChange}(1)">1</button>`;
        const startP = Math.max(2, validPage - 1);
        const endP = Math.min(totalPages - 1, validPage + 1);

        if (startP > 2) {
          btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
        }
        for (let p = startP; p <= endP; p++) {
          btnsHTML += `<button class="page-btn ${p === validPage ? 'active' : ''}" onclick="${onPageChange}(${p})">${p}</button>`;
        }
        if (endP < totalPages - 1) {
          btnsHTML += `<span style="font-size:12px; padding:0 3px; color:var(--text-muted);">&hellip;</span>`;
        }
        btnsHTML += `<button class="page-btn ${validPage === totalPages ? 'active' : ''}" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
      }

      btnsHTML += `
        <button class="page-btn ${validPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${validPage + 1})" aria-label="Next Page" title="Next Page">&raquo;</button>
      `;

      controlsEl.innerHTML = btnsHTML;
    }

    return { validPage, startIndex, totalPages };
  }
  window.renderPagination = renderPagination;

  // Bottom Recent Projects: DIRECT INLINE EDITABLE TABLE
  // [MODULE 2: SALES REQUESTS ENGINE] Extracted to assets/js/pages/sales-requests.js
  // [MODULE 3: CREATIVES TRACKER ENGINE] Extracted to assets/js/pages/creatives-tracker.js
  // [MODULE 4: ARTIST WORKLOAD ENGINE] Extracted to assets/js/pages/artist-workload.js
  // [MODULE 5: DIRECTIVES DETAILS ENGINE] Extracted to assets/js/pages/directives.js
  // [MODULE 6 & 7: PENDING QUEUES] Extracted to assets/js/pages/creatives-tracker.js
  // [MODULE 8 & 8A: MONTHLY OUTPUT REPORT] Extracted to assets/js/pages/monthly-output.js
  // [MODULE 8B: COMPREHENSIVE REPORTS] Extracted to assets/js/pages/reports.js
  // [MODULE 9: SETTINGS ENGINE] Extracted to assets/js/pages/settings.js

  // ==========================================================================
  // GLOBAL SEARCH & TOPBAR
  // ==========================================================================

  function setupGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    const dropdown = document.getElementById('quickSearchResults');
    if (!input || !dropdown) return;

    // Immediately purge if browser erroneously prefilled a user account credential
    if (input.value && (input.value.toLowerCase().startsWith('sup_') || input.value.toLowerCase().includes('angel') || input.value.toLowerCase() === 'superadmin')) {
      input.value = '';
    }

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }

      const matching = state.requests.filter(r => 
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q)
      ).slice(0, 8);

      if (matching.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px 14px; font-size:12px; color:var(--text-muted);">No records found.</div>`;
      } else {
        dropdown.innerHTML = `
          <div class="search-group-title">Matches (${matching.length})</div>
          ${matching.map(m => `
            <div class="search-item" onclick="window.SignDepotApp.openDirectiveForJo('${m.joNumber}'); document.getElementById('quickSearchResults').style.display='none';">
              <div>
                <div class="search-item-primary">${escapeHTML(m.projectName)}</div>
                <div class="search-item-sub"><strong style="color:var(--accent-red);">${escapeHTML(m.joNumber)}</strong> • ${escapeHTML(m.client)}</div>
              </div>
              <span class="badge ${getStatusBadgeClass(m.projectStatus)}">${escapeHTML(m.projectStatus)}</span>
            </div>
          `).join('')}
        `;
      }
      dropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    const profBtn = document.getElementById('userProfileBtn');
    const profDropdown = document.getElementById('userProfileDropdown');
    if (profBtn && profDropdown) {
      profBtn.addEventListener('click', () => profDropdown.classList.toggle('show'));
      document.addEventListener('click', (e) => {
        if (!profBtn.contains(e.target) && !profDropdown.contains(e.target)) {
          profDropdown.classList.remove('show');
        }
      });
    }

    const btnQuickUral = document.getElementById('btnQuickDirectiveSample');
    if (btnQuickUral) {
      btnQuickUral.onclick = () => {
        window.SignDepotApp.openDirectiveForJo('P261001348');
        profDropdown.classList.remove('show');
      };
    }

    const btnResetStore = document.getElementById('btnResetLocalStorage');
    if (btnResetStore) {
      btnResetStore.onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
        saveStateToStorage();
        renderCurrentView(state.activeView);
        profDropdown.classList.remove('show');
        showToast('Mock data reset.');
      };
    }

    const btnGotoSettings = document.getElementById('btnGotoSettings');
    if (btnGotoSettings) {
      btnGotoSettings.onclick = () => {
        if (document.getElementById('view-settings')) {
          switchView('view-settings');
        } else {
          window.location.href = getPageUrl('settings.html');
        }
        profDropdown.classList.remove('show');
      };
    }

    // Sidebar toggle is handled cleanly via delegated events with debounce in window.toggleDesktopSidebar

    // Timeframe filters (Today | This Week | This Month | All Time)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.timeframe-btn');
      if (!btn) return;
      const tf = btn.getAttribute('data-timeframe') || 'all';
      document.querySelectorAll('.timeframe-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-timeframe') === tf);
      });
      state.timeframe = tf;

      // Sync dropdowns if present
      const reportTfSelect = document.getElementById('reportTimeframe');
      if (reportTfSelect) {
        reportTfSelect.value = tf;
      }

      // Re-render corresponding views
      if (document.getElementById('view-monthly-output') || state.activeView === 'view-monthly-output') {
        if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport(tf);
      }
      if (document.getElementById('view-reports') || state.activeView === 'view-reports') {
        renderReports(tf);
      }

      const labelMap = { today: 'Today', week: 'This Week', month: 'This Month', all: 'All Time' };
      showToast(`Timeframe: ${labelMap[tf] || tf}`);
    });

    const reportTfSelect = document.getElementById('reportTimeframe');
    if (reportTfSelect) {
      reportTfSelect.addEventListener('change', () => {
        const tf = reportTfSelect.value;
        document.querySelectorAll('.timeframe-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-timeframe') === tf);
        });
        state.timeframe = tf;
        renderReports(tf);
        if (document.getElementById('view-monthly-output') || state.activeView === 'view-monthly-output') {
          if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport(tf);
        }
      });
    }

    const reportDeptSelect = document.getElementById('reportDepartment');
    if (reportDeptSelect) {
      reportDeptSelect.addEventListener('change', () => {
        renderReports(state.timeframe || 'all');
      });
    }

    if (typeof setupOutputFilterToolbarEvents === "function") setupOutputFilterToolbarEvents();
    if (typeof setupReportFilterToolbarEvents === "function") setupReportFilterToolbarEvents();
  }

  // ==========================================================================
  // REQUEST ID AUTO-GENERATION & SEPARATOR DASH FORMATTING ENGINE
  // ==========================================================================

  function getNextRequestId() {
    let maxSeq = 2103;
    const curYear = new Date().getFullYear().toString().slice(-2);
    (state.requests || []).forEach(r => {
      if (!r.requestId) return;
      const match = String(r.requestId).match(/(?:LR-?\d{2}-?)?(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
    const nextSeq = maxSeq + 1;
    return `LR-${curYear}-${nextSeq}`;
  }

  function getNextJoNumber() {
    let maxJo = 1001357;
    const curYear = new Date().getFullYear().toString().slice(-2);
    (state.requests || []).forEach(r => {
      if (!r.joNumber) return;
      const match = String(r.joNumber).match(/P\d{2}(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxJo) {
          maxJo = num;
        }
      }
    });
    return `P${curYear}${maxJo + 1}`;
  }

  function formatRequestIdInput(val) {
    if (!val) return '';
    const curYear = new Date().getFullYear().toString().slice(-2);
    let str = String(val).trim().toUpperCase();

    // Pure digits: "2104" or "2105" -> "LR-26-2104"
    if (/^\d{4,5}$/.test(str)) {
      return `LR-${curYear}-${str}`;
    }
    // "26-2104" or "262104" -> "LR-26-2104"
    if (/^\d{2}-?\d{4,5}$/.test(str)) {
      const clean = str.replace(/-/g, '');
      return `LR-${clean.slice(0, 2)}-${clean.slice(2)}`;
    }
    // "LR2104" -> "LR-26-2104"
    if (/^LR\d{4,5}$/.test(str)) {
      return `LR-${curYear}-${str.slice(2)}`;
    }
    // "LR262104" -> "LR-26-2104"
    if (/^LR\d{6,7}$/.test(str)) {
      return `LR-${str.slice(2, 4)}-${str.slice(4)}`;
    }
    // "LR-262104" -> "LR-26-2104"
    if (/^LR-\d{6,7}$/.test(str)) {
      return `LR-${str.slice(3, 5)}-${str.slice(5)}`;
    }
    // Progressive typing formatting
    if (str === 'LR') return 'LR-';
    if (/^LR-\d{2}$/.test(str)) return `${str}-`;

    return str;
  }

  function populateSalesFiltersDropdowns() {
    state.salesReps = (state.salesReps || []).filter(s => s && s.toLowerCase() !== 'shela');
    const repSelect = document.getElementById('salesFilterSalesRep');
    if (repSelect) {
      const curVal = repSelect.value;
      repSelect.innerHTML = '<option value="">All Sales Reps</option>';
      state.salesReps.forEach(rep => {
        const titleRep = toTitleCase(rep);
        const opt = document.createElement('option');
        opt.value = titleRep;
        opt.textContent = titleRep;
        repSelect.appendChild(opt);
      });
      if (curVal && curVal.toLowerCase() !== 'shela') repSelect.value = curVal;
    }

    const modalArtistSelect = document.getElementById('salesFormArtist');
    if (modalArtistSelect) {
      const curArtist = modalArtistSelect.value;
      modalArtistSelect.innerHTML = '<option value="">Select Artist...</option>';
      (state.artists || []).forEach(a => {
        const titleA = toTitleCase(a);
        const opt = document.createElement('option');
        opt.value = titleA;
        opt.textContent = titleA;
        modalArtistSelect.appendChild(opt);
      });
      if (curArtist) modalArtistSelect.value = curArtist;
    }

    const modalSalesSelect = document.getElementById('salesFormSalesRep');
    if (modalSalesSelect) {
      const curRep = modalSalesSelect.value;
      modalSalesSelect.innerHTML = '<option value="">Select Sales Rep...</option>';
      (state.salesReps || []).forEach(s => {
        const titleS = toTitleCase(s);
        const opt = document.createElement('option');
        opt.value = titleS;
        opt.textContent = titleS;
        modalSalesSelect.appendChild(opt);
      });
      if (curRep && curRep.toLowerCase() !== 'shela') {
        modalSalesSelect.value = curRep;
      }
    }
  }
  window.populateSalesFiltersDropdowns = populateSalesFiltersDropdowns;

  function openNewSalesRequestModal() {
    const form = document.getElementById('salesRequestForm');
    if (form) {
      form.reset();
      form.querySelectorAll('.is-invalid-detail').forEach(el => el.classList.remove('is-invalid-detail'));
    }
    const idField = document.getElementById('salesFormId');
    if (idField) idField.value = '';
    const titleEl = document.getElementById('salesModalTitle');
    if (titleEl) titleEl.textContent = 'New Sales Request';

    // Auto-generate sequential Request ID with separator dash (e.g. LR-26-2104 / LR-26-2105)
    const nextId = getNextRequestId();
    const reqInput = document.getElementById('salesFormReqId');
    if (reqInput) reqInput.value = nextId;

    // Fetch live backend for latest ID if available to ensure perfect multi-client sync
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_next_request_id')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && res.nextRequestId && reqInput && (!reqInput.value || reqInput.value === nextId)) {
            reqInput.value = res.nextRequestId;
          }
        })
        .catch(() => {});
    }

    // No default JO number on the add request form
    const joInput = document.getElementById('salesFormJo');
    if (joInput) joInput.value = '';

    const orderDateInput = document.getElementById('salesFormOrderDate');
    if (orderDateInput) {
      orderDateInput.value = new Date().toISOString().split('T')[0];
    }

    // Default design deadline (+3 days from today)
    const deadlineInput = document.getElementById('salesFormDeadline');
    if (deadlineInput && !deadlineInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      deadlineInput.value = d.toISOString().split('T')[0];
    }

    // Default production due (+5 days from today)
    const releasingInput = document.getElementById('salesFormReleasing');
    if (releasingInput && !releasingInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      releasingInput.value = d.toISOString().split('T')[0];
    }

    const locInput = document.getElementById('salesFormLocation');
    if (locInput) locInput.value = 'Indoor';

    const prioInput = document.getElementById('salesFormPriority');
    if (prioInput) prioInput.value = 'Normal';

    const appInput = document.getElementById('salesFormProjectStatus') || document.getElementById('salesFormClientApproval');
    if (appInput) appInput.value = 'Pending Approval';

    const relModeInput = document.getElementById('salesFormRelMode');
    if (relModeInput) relModeInput.value = 'Pickup';

    const fileSentInput = document.getElementById('salesFormFileSent');
    if (fileSentInput) fileSentInput.value = 'File Sent';

    populateSalesFiltersDropdowns();

    const loggedInRep = typeof getLoggedInSalesRep === 'function' ? getLoggedInSalesRep() : null;
    const salesRepSelect = document.getElementById('salesFormSalesRep');
    if (loggedInRep && salesRepSelect && !salesRepSelect.value) {
      salesRepSelect.value = toTitleCase(loggedInRep);
    }

    upgradeAllFormSelects();
    syncAllFormDropdowns();

    const modal = document.getElementById('salesModal');
    if (modal) {
      modal.classList.add('show');
      setTimeout(() => {
        if (joInput) {
          joInput.focus();
        } else if (reqInput) {
          reqInput.focus();
        }
      }, 100);
    }
  }
  window.openNewSalesRequestModal = openNewSalesRequestModal;

  function renderDraftCustomSelect(fieldName, currentValue, optionsList, elementId, styleWidth) {
    const hasVal = currentValue && String(currentValue).trim() !== '' && String(currentValue).trim() !== 'N/A' && String(currentValue).trim() !== 'Blank';
    const val = hasVal ? String(currentValue).trim() : '';
    const badgeClass = hasVal ? getBadgeClassForValue(fieldName, val) : 'badge-neutral';
    const safeLabel = hasVal ? escapeHTML(val) : '— Select —';
    let options = Array.isArray(optionsList) ? [...optionsList] : [];
    const safeOptions = JSON.stringify(options).replace(/"/g, '&quot;');
    const widthStyle = styleWidth ? `style="width:${styleWidth};"` : '';

    return `
      <button type="button" class="custom-select-btn draft-custom-select ${badgeClass} ${!hasVal ? 'is-blank is-unselected' : ''}"
        id="${elementId}"
        ${widthStyle}
        data-is-draft="true"
        data-field="${fieldName}"
        data-current="${escapeHTML(val)}"
        data-options="${safeOptions}"
        title="Click to select ${fieldName}"
        onclick="window.SignDepotApp.openCustomDropdown(this, event)">
        <span class="custom-select-label">${safeLabel}</span>
        <svg class="custom-select-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    `;
  }

  function renderDraftSalesRowHTML(d) {
    const orderDateVal = d.orderDate || '';
    const deadlineVal = d.designDeadline || '';
    const releasingVal = d.releasingDate || '';

    return `
      <tr class="table-draft-row" id="draftSalesRow">
        <td><input type="text" class="draft-cell-input" id="draftReqId" value="${escapeHTML(d.requestId)}" style="color:var(--primary-green); font-weight:700; width:95px;" placeholder="Req ID" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td><input type="text" class="draft-cell-input" id="draftJoNumber" value="${escapeHTML(d.joNumber || '')}" placeholder="JO # (e.g. P26...)" style="color:var(--accent-red); font-weight:700; width:110px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td><input type="date" class="draft-cell-input" id="draftOrderDate" value="${escapeHTML(orderDateVal)}" style="width:125px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td>${renderDraftCustomSelect('salesRep', d.salesRep, state.salesReps, 'draftSalesRep', '120px')}</td>
        <td><input type="text" class="draft-cell-input" id="draftClient" value="${escapeHTML(d.client || '')}" placeholder="Client name..." style="width:140px;" required autocomplete="off" onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td><input type="text" class="draft-cell-input" id="draftProjectName" value="${escapeHTML(d.projectName || '')}" placeholder="Project name..." style="width:170px; font-weight:600;" required autocomplete="off" onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td>${renderDraftCustomSelect('artist', d.artist, state.artists, 'draftArtist', '120px')}</td>
        <td><input type="date" class="draft-cell-input" id="draftDeadline" value="${escapeHTML(deadlineVal)}" style="width:125px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td><input type="date" class="draft-cell-input" id="draftReleasing" value="${escapeHTML(releasingVal)}" style="width:125px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td>${renderDraftCustomSelect('fileSent', d.fileSent, FILE_STATUS_LEVELS, 'draftFileSent', '100px')}</td>
        <td><input type="text" class="draft-cell-input" id="draftAddress" value="${escapeHTML(d.completeAddress || '')}" placeholder="Full address..." style="width:190px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td>${renderDraftCustomSelect('location', d.location, PLACEMENT_OPTIONS, 'draftLocation', '115px')}</td>
        <td>${renderDraftCustomSelect('releasingMode', d.releasingMode, RELEASING_MODES, 'draftRelMode', '100px')}</td>
        <td><input type="text" class="draft-cell-input" id="draftContactPerson" value="${escapeHTML(d.contactPerson || '')}" placeholder="Contact person..." style="width:130px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td><input type="text" class="draft-cell-input" id="draftContactNumber" value="${escapeHTML(d.contactNumber || '')}" placeholder="Phone number..." style="width:120px;" required onkeydown="window.SignDepotApp.handleDraftKey(event)"></td>
        <td>${renderDraftCustomSelect('clientApproval', d.clientApproval || 'Pending Approval', APPROVAL_LEVELS, 'draftClientApproval', '125px')}</td>
        <td>${renderDraftCustomSelect('priority', d.priority || 'Normal', PRIORITY_LEVELS, 'draftPriority', '95px')}</td>
        <td class="draft-actions-cell">
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="btn btn-save-draft" id="btnSaveDraftRequest" onclick="if(window.SignDepotApp && window.SignDepotApp.saveDraftSalesRequest){window.SignDepotApp.saveDraftSalesRequest();}else{saveDraftSalesRequest();}" title="Save Request (✓)" aria-label="Save Request">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <button type="button" class="btn btn-cancel-draft" id="btnCancelDraftRequest" onclick="if(window.SignDepotApp && window.SignDepotApp.cancelDraftSalesRequest){window.SignDepotApp.cancelDraftSalesRequest();}else{cancelDraftSalesRequest();}" title="Cancel (✕)" aria-label="Cancel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  function addNewSalesRequestRow() {
    openNewSalesRequestModal();
  }
  window.addNewSalesRequestRow = addNewSalesRequestRow;

  function saveDraftSalesRequest() {
    if (!state.draftSalesRequest) return;

    const draftRow = document.getElementById('draftSalesRow');
    if (draftRow) {
      draftRow.querySelectorAll('.is-invalid-detail').forEach(el => el.classList.remove('is-invalid-detail'));
    }

    const getDraftSelectVal = (elemId, fieldName) => {
      const el = document.getElementById(elemId);
      if (el) {
        const cur = el.getAttribute('data-current');
        if (cur !== null && cur !== undefined && cur !== '' && cur !== 'N/A' && cur !== 'Blank') return cur.trim();
        if (el.value !== undefined && el.value !== '' && el.value !== 'N/A') return el.value.trim();
      }
      const st = state.draftSalesRequest && state.draftSalesRequest[fieldName];
      return (st && st !== 'N/A' && st !== 'Blank') ? String(st).trim() : '';
    };

    const reqIdInput = document.getElementById('draftReqId');
    const reqId = (reqIdInput && reqIdInput.value.trim()) || '';
    const joNumber = document.getElementById('draftJoNumber') ? document.getElementById('draftJoNumber').value.trim() : '';
    const orderDate = document.getElementById('draftOrderDate') ? document.getElementById('draftOrderDate').value.trim() : '';
    const projectName = document.getElementById('draftProjectName') ? document.getElementById('draftProjectName').value.trim() : '';
    const client = document.getElementById('draftClient') ? document.getElementById('draftClient').value.trim() : '';
    const salesRep = getDraftSelectVal('draftSalesRep', 'salesRep');
    const artist = getDraftSelectVal('draftArtist', 'artist');
    const location = getDraftSelectVal('draftLocation', 'location');
    const releasingMode = getDraftSelectVal('draftRelMode', 'releasingMode');
    const designDeadline = document.getElementById('draftDeadline') ? document.getElementById('draftDeadline').value.trim() : '';
    const releasingDate = document.getElementById('draftReleasing') ? document.getElementById('draftReleasing').value.trim() : '';
    const fileSent = getDraftSelectVal('draftFileSent', 'fileSent');
    const clientApproval = getDraftSelectVal('draftClientApproval', 'clientApproval');
    const priority = getDraftSelectVal('draftPriority', 'priority');
    const contactPerson = document.getElementById('draftContactPerson') ? document.getElementById('draftContactPerson').value.trim() : '';
    const contactNumber = document.getElementById('draftContactNumber') ? document.getElementById('draftContactNumber').value.trim() : '';
    const completeAddress = document.getElementById('draftAddress') ? document.getElementById('draftAddress').value.trim() : '';

    const checks = [
      { val: reqId, id: 'draftReqId', name: 'Request ID' },
      { val: joNumber, id: 'draftJoNumber', name: 'JO Number' },
      { val: orderDate, id: 'draftOrderDate', name: 'Timestamp (Date Encoded)' },
      { val: salesRep, id: 'draftSalesRep', name: 'Sales Representative' },
      { val: client, id: 'draftClient', name: 'Client' },
      { val: projectName, id: 'draftProjectName', name: 'Project Name' },
      { val: artist, id: 'draftArtist', name: 'Artist' },
      { val: designDeadline, id: 'draftDeadline', name: 'Design Deadline' },
      { val: releasingDate, id: 'draftReleasing', name: 'Production Due' },
      { val: fileSent, id: 'draftFileSent', name: 'File Status' },
      { val: completeAddress, id: 'draftAddress', name: 'Address' },
      { val: location, id: 'draftLocation', name: 'Placement' },
      { val: releasingMode, id: 'draftRelMode', name: 'Mode of Releasing' },
      { val: contactPerson, id: 'draftContactPerson', name: 'Contact Person' },
      { val: contactNumber, id: 'draftContactNumber', name: 'Contact Number' },
      { val: clientApproval, id: 'draftClientApproval', name: 'Client Approval' },
      { val: priority, id: 'draftPriority', name: 'Priority Level' }
    ];

    const missing = [];
    checks.forEach(c => {
      if (!c.val) {
        missing.push(c.name);
        const el = document.getElementById(c.id);
        if (el) {
          el.classList.add('is-invalid-detail');
          const cleanUp = () => {
            el.classList.remove('is-invalid-detail');
            el.removeEventListener('input', cleanUp);
            el.removeEventListener('change', cleanUp);
          };
          el.addEventListener('input', cleanUp);
          el.addEventListener('change', cleanUp);
        }
      }
    });

    if (missing.length > 0) {
      showToast(`Cannot save: All sales request details are required. Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ' (+' + (missing.length - 3) + ' more)' : ''}.`, 'error');
      const firstInvalid = draftRow ? draftRow.querySelector('.is-invalid-detail') : null;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
      }
      return;
    }

    const finalId = reqId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const nowStamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRecord = {
      id: finalId,
      requestId: reqId,
      joNumber: joNumber,
      orderDate: orderDate || nowStamp.substring(0, 10),
      salesRep: salesRep,
      client: client,
      projectName: projectName,
      artist: artist,
      designDeadline: designDeadline,
      releasingDate: releasingDate,
      fileSent: fileSent,
      completeAddress: completeAddress,
      location: location,
      releasingMode: releasingMode,
      contactPerson: contactPerson,
      contactNumber: contactNumber,
      projectStatus: 'On-going',
      clientApproval: clientApproval || 'Pending Approval',
      priority: priority || 'Normal',
      headApproval: 'Pending',
      countStandard: 0,
      countSpecial: 0,
      countPrinting: 0,
      designStatus: 'On Queue',
      revisionCount: 0,
      remarks: 'N/A',
      timestamp: orderDate || nowStamp.substring(0, 10),
      dateUpdated: nowStamp
    };

    // Clear draft state so draft row vanishes
    state.draftSalesRequest = null;

    // Add to requests list and save state locally
    state.requests.unshift(newRecord);
    saveStateToStorage();

    // Persist to MySQL backend
    const apiUrl = window.PMS_API_URL || (window.location.pathname.includes('/pages/') ? '../api.php' : './api.php');
    fetch(apiUrl + '?action=create_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
    .then(res => res.json())
    .then(res => {
      if (res && res.success) {
        if (window.PmsCache) window.PmsCache.invalidate();
        if (res.id) newRecord.id = res.id;
        if (res.requestId && res.requestId !== newRecord.requestId) {
          newRecord.requestId = res.requestId;
          if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
        }
      }
    })
    .catch(err => console.warn('MySQL save failed:', err));

    // Re-render table with newly committed row
    if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();

    // Smooth scroll and green glow animation on newly saved row
    setTimeout(() => {
      const row = document.querySelector(`tr[data-req-id="${newRecord.id}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        row.classList.add('table-row-new-entry');
      }
    }, 80);

    showToast(`Request ${reqId} saved successfully!`, 'success');
  }
  window.saveDraftSalesRequest = saveDraftSalesRequest;

  function cancelDraftSalesRequest() {
    state.draftSalesRequest = null;
    if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
    showToast('New request row cancelled.', 'info');
  }
  window.cancelDraftSalesRequest = cancelDraftSalesRequest;

  function handleDraftKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveDraftSalesRequest();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelDraftSalesRequest();
    }
  }
  window.handleDraftKey = handleDraftKey;

  function editSalesRequest(id) {
    const rec = state.requests.find(r => r.id === id || r.requestId === id);
    if (!rec) return;

    const form = document.getElementById('salesRequestForm');
    if (form) form.reset();

    const setVal = (elemId, val) => {
      const el = document.getElementById(elemId);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };

    setVal('salesFormId', rec.id || '');
    const titleEl = document.getElementById('salesModalTitle');
    if (titleEl) titleEl.textContent = `Edit Sales Request — ${rec.requestId}`;

    setVal('salesFormReqId', rec.requestId);
    setVal('salesFormJo', rec.joNumber);
    setVal('salesFormOrderDate', rec.orderDate || rec.timestamp || '');
    setVal('salesFormProject', rec.projectName);
    setVal('salesFormClient', rec.client);
    setVal('salesFormLocation', rec.location || 'Indoor');
    setVal('salesFormArtist', rec.artist);
    setVal('salesFormSalesRep', rec.salesRep);
    setVal('salesFormDeadline', rec.designDeadline);
    setVal('salesFormReleasing', rec.releasingDate || rec.designDeadline);
    setVal('salesFormPriority', rec.priority || 'Normal');
    setVal('salesFormRelMode', rec.releasingMode || 'Pickup');
    setVal('salesFormFileSent', rec.fileSent || 'Pending');
    setVal('salesFormContactPerson', rec.contactPerson || '');
    setVal('salesFormContactNumber', rec.contactNumber || '');
    setVal('salesFormAddress', rec.completeAddress || '');
    setVal('salesFormProjectStatus', rec.projectStatus || rec.clientApproval || 'Pending Approval');

    populateSalesFiltersDropdowns();
    upgradeAllFormSelects();
    syncAllFormDropdowns();

    const modal = document.getElementById('salesModal');
    if (modal) modal.classList.add('show');
  }
  window.editSalesRequest = editSalesRequest;

  function showCustomConfirm(options) {
    const modal = document.getElementById('customConfirmModal');
    if (!modal) {
      if (confirm(options.message || 'Are you sure?')) {
        if (options.onConfirm) options.onConfirm('', () => {});
      }
      return;
    }

    const titleEl = document.getElementById('confirmModalTitle');
    const subtitleEl = document.getElementById('confirmModalSubtitle');
    const msgEl = document.getElementById('confirmModalMessage');
    const recordCard = document.getElementById('confirmModalRecordCard');
    const passcodeSection = document.getElementById('confirmPasscodeSection');
    const passcodeInput = document.getElementById('confirmDeletePasscode');
    const passcodeError = document.getElementById('confirmPasscodeError');
    const setupDrawer = document.getElementById('confirmPasscodeSetupDrawer');
    const submitBtn = document.getElementById('btnExecuteCustomConfirm');
    const submitLabel = document.getElementById('confirmModalSubmitLabel');
    const toggleSetupBtn = document.getElementById('btnTogglePasscodeSetup');

    if (titleEl) titleEl.textContent = options.title || 'Permanent Data Deletion';
    if (subtitleEl) subtitleEl.textContent = options.subtitle || (options.requiresPasscode ? 'SUPER ADMIN SECURITY PASSCODE REQUIRED' : 'CONFIRM ACTION');
    if (msgEl) msgEl.innerHTML = options.message || 'Are you sure you want to proceed?';
    if (submitLabel) submitLabel.textContent = options.confirmText || 'Permanently Delete';

    if (passcodeError) {
      passcodeError.style.display = 'none';
      passcodeError.textContent = '';
    }
    if (setupDrawer) setupDrawer.style.display = 'none';
    if (toggleSetupBtn) toggleSetupBtn.textContent = 'Change Passcode';

    const loginPassModalInput = document.getElementById('confirmLoginPasswordInput');
    const newPasscodeModalInput = document.getElementById('confirmNewPasscodeInput');
    const newPasscodeFeedback = document.getElementById('confirmNewPasscodeFeedback');
    if (loginPassModalInput) loginPassModalInput.value = '';
    if (newPasscodeModalInput) newPasscodeModalInput.value = '';
    if (newPasscodeFeedback) {
      newPasscodeFeedback.style.display = 'none';
      newPasscodeFeedback.textContent = '';
    }

    if (recordCard && options.record) {
      recordCard.style.display = 'block';
      const reqIdEl = document.getElementById('confirmRecordRequestId');
      const joEl = document.getElementById('confirmRecordJoNumber');
      const projEl = document.getElementById('confirmRecordProjectName');
      const clientEl = document.getElementById('confirmRecordClient');
      if (reqIdEl) reqIdEl.textContent = options.record.requestId || '-';
      if (joEl) joEl.textContent = options.record.joNumber || 'Unassigned';
      if (projEl) projEl.textContent = options.record.projectName || '-';
      if (clientEl) clientEl.textContent = options.record.client || '-';
    } else if (recordCard) {
      recordCard.style.display = 'none';
    }

    if (passcodeSection) {
      passcodeSection.style.display = options.requiresPasscode ? 'block' : 'none';
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.classList.remove('input-shake');
        passcodeInput.style.borderColor = '#D4D4D8';
      }
    }

    modal.classList.add('show');
    if (options.requiresPasscode && passcodeInput) {
      setTimeout(() => passcodeInput.focus(), 150);
    }

    const handleSubmit = async () => {
      const enteredPasscode = passcodeInput ? passcodeInput.value.trim() : '';

      if (options.requiresPasscode) {
        if (!enteredPasscode) {
          if (passcodeError) {
            passcodeError.style.display = 'block';
            passcodeError.textContent = 'Please enter the Super Admin permission passcode.';
          }
          if (passcodeInput) {
            passcodeInput.style.borderColor = '#DC2626';
            passcodeInput.classList.add('input-shake');
            setTimeout(() => passcodeInput.classList.remove('input-shake'), 400);
            passcodeInput.focus();
          }
          return;
        }
      }

      if (typeof options.onConfirm === 'function') {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        try {
          const success = await options.onConfirm(enteredPasscode, () => modal.classList.remove('show'));
          if (success) {
            modal.classList.remove('show');
          }
        } catch (err) {
          if (passcodeError) {
            passcodeError.style.display = 'block';
            passcodeError.textContent = err.message || 'Operation failed.';
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      } else {
        modal.classList.remove('show');
      }
    };

    submitBtn.onclick = handleSubmit;
    if (passcodeInput) {
      passcodeInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      };
    }
  }
  window.showCustomConfirm = showCustomConfirm;

  /**
   * Universal Promise-based and callback-based Modern Confirmation Dialog
   * Replaces ugly browser native confirm() with a sleek Sign Depot design modal.
   */
  function showConfirmDialog(options = {}) {
    return new Promise((resolve) => {
      const modal = document.getElementById('genericConfirmModal');
      if (!modal) {
        const nativeResult = window.confirm(options.message ? options.message.replace(/<[^>]*>/g, '') : (options.title || 'Are you sure?'));
        if (nativeResult && typeof options.onConfirm === 'function') {
          options.onConfirm();
        } else if (!nativeResult && typeof options.onCancel === 'function') {
          options.onCancel();
        }
        resolve(nativeResult);
        return;
      }

      const iconWrap = document.getElementById('genericConfirmIconWrap');
      const subtitleEl = document.getElementById('genericConfirmSubtitle');
      const titleEl = document.getElementById('genericConfirmTitle');
      const msgEl = document.getElementById('genericConfirmMessage');
      const okBtn = document.getElementById('genericConfirmOkBtn');
      const okLabel = document.getElementById('genericConfirmOkLabel');
      const cancelBtn = document.getElementById('genericConfirmCancelBtn');

      if (titleEl) titleEl.textContent = options.title || 'Are you sure?';
      if (subtitleEl) subtitleEl.textContent = options.subtitle || 'Confirmation Required';
      if (msgEl) msgEl.innerHTML = options.message || 'Please confirm that you want to proceed with this action.';
      if (okLabel) okLabel.textContent = options.confirmText || 'Confirm';
      if (cancelBtn) cancelBtn.textContent = options.cancelText || 'Cancel';

      const isDanger = options.isDanger !== false;

      const iconMap = {
        shield: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
        warning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        logout: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
        trash: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        info: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
      };

      const iconType = options.icon || (isDanger ? 'shield' : 'info');
      if (iconWrap) {
        if (isDanger) {
          iconWrap.style.background = '#FEF2F2';
          iconWrap.style.color = '#DC2626';
          iconWrap.style.boxShadow = '0 2px 6px rgba(220, 38, 38, 0.12)';
        } else {
          iconWrap.style.background = '#EFF6FF';
          iconWrap.style.color = '#2563EB';
          iconWrap.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.12)';
        }
        iconWrap.innerHTML = iconMap[iconType] || iconMap.shield;
      }

      if (okBtn) {
        if (isDanger) {
          okBtn.style.background = '#DC2626';
          okBtn.style.borderColor = '#DC2626';
          okBtn.style.color = '#FFFFFF';
          okBtn.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.25)';
        } else {
          okBtn.style.background = '#0F172A';
          okBtn.style.borderColor = '#0F172A';
          okBtn.style.color = '#FFFFFF';
          okBtn.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.2)';
        }
      }

      let resolved = false;
      const closeButtons = modal.querySelectorAll('[data-close-modal="genericConfirmModal"]');

      const cleanup = () => {
        modal.classList.remove('show');
        if (okBtn) okBtn.removeEventListener('click', handleOk);
        if (cancelBtn) cancelBtn.removeEventListener('click', handleCancel);
        closeButtons.forEach(btn => btn.removeEventListener('click', handleCancel));
        document.removeEventListener('keydown', handleKey);
      };

      const handleOk = async () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        if (typeof options.onConfirm === 'function') {
          await options.onConfirm();
        }
        resolve(true);
      };

      const handleCancel = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        if (typeof options.onCancel === 'function') {
          options.onCancel();
        }
        resolve(false);
      };

      const handleKey = (e) => {
        if (e.key === 'Escape') {
          handleCancel();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleOk();
        }
      };

      if (okBtn) okBtn.addEventListener('click', handleOk);
      if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
      closeButtons.forEach(btn => btn.addEventListener('click', handleCancel));
      document.addEventListener('keydown', handleKey);

      modal.classList.add('show');
    });
  }
  window.showConfirmDialog = showConfirmDialog;
  if (window.SignDepotApp) {
    if (!window.SignDepotApp.utils) window.SignDepotApp.utils = {};
    window.SignDepotApp.utils.showConfirmDialog = showConfirmDialog;
  }

  function deleteSalesRequest(id) {
    if (!isCurrentUserSuperAdmin()) {
      showToast('Permission Denied: Only Super Admin can delete records.', 'error');
      return;
    }

    let rec = state.requests.find(r => r.id === id || r.requestId === id);
    if (!rec) {
      rec = { id: id, requestId: id, projectName: 'Sales Request', client: '' };
    }

    const reqLabel = rec.requestId || id;

    showCustomConfirm({
      title: 'Permanent Data Deletion',
      subtitle: 'SUPER ADMIN SECURITY PASSCODE REQUIRED',
      message: `Are you sure you want to permanently delete <strong>${escapeHTML(reqLabel)}</strong>? This action will permanently remove it from both your local workspace and the live MySQL database.`,
      record: {
        requestId: rec.requestId,
        joNumber: rec.joNumber,
        projectName: rec.projectName,
        client: rec.client
      },
      requiresPasscode: true,
      confirmText: 'Permanently Delete',
      onConfirm: async (passcode, closeModal) => {
        if (window.PMS_API_URL) {
          try {
            const res = await fetch(window.PMS_API_URL + '?action=delete_request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: rec.id || id,
                requestId: rec.requestId,
                passcode: passcode
              })
            }).then(r => r.json());

            if (res && res.success) {
              if (window.PmsCache) window.PmsCache.invalidate();
              state.requests = state.requests.filter(r => r.id !== id && r.requestId !== id);
              saveStateToStorage();
              renderCurrentView(state.activeView);
              if (typeof updateDashboardKPIs === 'function') {
                updateDashboardKPIs();
              } else if (window.SignDepotApp && typeof window.SignDepotApp.updateDashboardKPIs === 'function') {
                window.SignDepotApp.updateDashboardKPIs();
              }
              if (typeof updateDeadlineAlertCenter === 'function') {
                updateDeadlineAlertCenter();
              }
              showToast(`Request ${reqLabel} deleted successfully.`);
              return true;
            } else {
              const passcodeError = document.getElementById('confirmPasscodeError');
              const passcodeInput = document.getElementById('confirmDeletePasscode');
              if (passcodeError) {
                passcodeError.style.display = 'block';
                passcodeError.textContent = res.error || 'Invalid permission passcode. Deletion rejected.';
              }
              if (passcodeInput) {
                passcodeInput.style.borderColor = '#DC2626';
                passcodeInput.classList.add('input-shake');
                setTimeout(() => passcodeInput.classList.remove('input-shake'), 400);
                passcodeInput.focus();
                passcodeInput.select();
              }
              return false;
            }
          } catch (err) {
            console.warn('MySQL delete error:', err);
            state.requests = state.requests.filter(r => r.id !== id && r.requestId !== id);
            saveStateToStorage();
            renderCurrentView(state.activeView);
            if (typeof updateDashboardKPIs === 'function') {
              updateDashboardKPIs();
            } else if (window.SignDepotApp && typeof window.SignDepotApp.updateDashboardKPIs === 'function') {
              window.SignDepotApp.updateDashboardKPIs();
            }
            if (typeof updateDeadlineAlertCenter === 'function') {
              updateDeadlineAlertCenter();
            }
            showToast(`Deleted ${reqLabel} locally.`, 'info');
            return true;
          }
        } else {
          state.requests = state.requests.filter(r => r.id !== id && r.requestId !== id);
          saveStateToStorage();
          renderCurrentView(state.activeView);
          if (typeof updateDashboardKPIs === 'function') {
            updateDashboardKPIs();
          } else if (window.SignDepotApp && typeof window.SignDepotApp.updateDashboardKPIs === 'function') {
            window.SignDepotApp.updateDashboardKPIs();
          }
          if (typeof updateDeadlineAlertCenter === 'function') {
            updateDeadlineAlertCenter();
          }
          showToast(`Request ${reqLabel} deleted successfully.`);
          return true;
        }
      }
    });
  }
  window.deleteSalesRequest = deleteSalesRequest;

  // ==========================================================================
  // MODALS
  // ==========================================================================

  function setupModals() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });

      // Custom Confirm & Passcode Modal Controls Setup
      const confirmPasscodeInput = document.getElementById('confirmDeletePasscode');
      const toggleSetupBtn = document.getElementById('btnTogglePasscodeSetup');
      const setupDrawer = document.getElementById('confirmPasscodeSetupDrawer');
      if (toggleSetupBtn && setupDrawer) {
        toggleSetupBtn.onclick = () => {
          const isHidden = setupDrawer.style.display === 'none' || !setupDrawer.style.display;
          setupDrawer.style.display = isHidden ? 'block' : 'none';
          toggleSetupBtn.textContent = isHidden ? 'Close Setup' : 'Change Passcode';
        };
      }

      const saveInsideModalBtn = document.getElementById('btnSaveNewPasscodeInsideModal');
      const loginPasswordInsideModalInput = document.getElementById('confirmLoginPasswordInput');
      const newPasscodeInsideModalInput = document.getElementById('confirmNewPasscodeInput');
      const newPasscodeFeedback = document.getElementById('confirmNewPasscodeFeedback');
      if (saveInsideModalBtn && newPasscodeInsideModalInput) {
        saveInsideModalBtn.onclick = () => {
          const loginPass = loginPasswordInsideModalInput ? loginPasswordInsideModalInput.value.trim() : '';
          if (!loginPass) {
            if (newPasscodeFeedback) {
              newPasscodeFeedback.style.display = 'block';
              newPasscodeFeedback.style.color = '#DC2626';
              newPasscodeFeedback.textContent = 'Please enter your current account login password.';
            }
            if (loginPasswordInsideModalInput) loginPasswordInsideModalInput.focus();
            return;
          }

          const val = newPasscodeInsideModalInput.value.trim();
          if (!val) {
            if (newPasscodeFeedback) {
              newPasscodeFeedback.style.display = 'block';
              newPasscodeFeedback.style.color = '#DC2626';
              newPasscodeFeedback.textContent = 'Please enter a valid passcode.';
            }
            newPasscodeInsideModalInput.focus();
            return;
          }

          saveInsideModalBtn.disabled = true;
          saveInsideModalBtn.textContent = 'Updating...';

          const onSaved = () => {
            if (loginPasswordInsideModalInput) loginPasswordInsideModalInput.value = '';
            if (newPasscodeInsideModalInput) newPasscodeInsideModalInput.value = '';
            if (confirmPasscodeInput) {
              confirmPasscodeInput.value = '';
              confirmPasscodeInput.style.borderColor = '#D4D4D8';
            }
            if (newPasscodeFeedback) {
              newPasscodeFeedback.style.display = 'block';
              newPasscodeFeedback.style.color = '#09090B';
              newPasscodeFeedback.textContent = 'Passcode updated successfully! Enter it above to confirm deletion.';
            }
            setTimeout(() => {
              if (setupDrawer) setupDrawer.style.display = 'none';
              if (toggleSetupBtn) toggleSetupBtn.textContent = 'Change Passcode';
            }, 1800);
            showToast('Super Admin deletion passcode updated.');
            saveInsideModalBtn.disabled = false;
            saveInsideModalBtn.textContent = 'Update';
          };

          if (window.PMS_API_URL && isCurrentUserSuperAdmin()) {
            fetch(window.PMS_API_URL + '?action=set_delete_passcode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ passcode: val, login_password: loginPass })
            })
            .then(r => r.json())
            .then(res => {
              if (res && res.success) {
                onSaved();
              } else {
                if (newPasscodeFeedback) {
                  newPasscodeFeedback.style.display = 'block';
                  newPasscodeFeedback.style.color = '#DC2626';
                  newPasscodeFeedback.textContent = res.error || 'Failed to update passcode.';
                }
                saveInsideModalBtn.disabled = false;
                saveInsideModalBtn.textContent = 'Update';
              }
            })
            .catch(() => onSaved());
          } else {
            onSaved();
          }
        };
      }

      // Automatically upgrade and sync all form selects whenever any modal becomes visible
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.attributeName === 'class' && modal.classList.contains('show')) {
            upgradeAllFormSelects();
            syncAllFormDropdowns();
          }
        });
      });
      observer.observe(modal, { attributes: true });
    });

    // Automatically sync dropdown button labels when forms are reset
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('reset', () => {
        setTimeout(() => syncAllFormDropdowns(), 20);
      });
    });

    const salesForm = document.getElementById('salesRequestForm');
    if (salesForm) {
      salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        salesForm.querySelectorAll('.is-invalid-detail').forEach(el => el.classList.remove('is-invalid-detail'));

        const id = document.getElementById('salesFormId').value;
        const rawReqId = document.getElementById('salesFormReqId').value.trim();
        const reqId = formatRequestIdInput(rawReqId) || getNextRequestId();
        const jo = (document.getElementById('salesFormJo')?.value.trim()) || 'TF';
        const project = document.getElementById('salesFormProject').value.trim();
        const client = document.getElementById('salesFormClient').value.trim();
        const artist = document.getElementById('salesFormArtist').value;
        const salesRep = toTitleCase(document.getElementById('salesFormSalesRep').value);
        const deadline = document.getElementById('salesFormDeadline').value;
        let releasingDate = (document.getElementById('salesFormReleasingDate') || document.getElementById('salesFormReleasing'))?.value || '';
        if (!releasingDate && deadline) releasingDate = deadline;
        const fileSentRaw = document.getElementById('salesFormFileSent')?.value || '';
        const fileSent = (fileSentRaw === 'Blank' || !fileSentRaw) ? 'File Sent' : fileSentRaw;
        const statusEl = document.getElementById('salesFormProjectStatus') || document.getElementById('salesFormClientApproval');
        const projectStatus = (statusEl && statusEl.value) ? statusEl.value.trim() : 'Pending Approval';
        const clientApproval = projectStatus;
        const priority = document.getElementById('salesFormPriority')?.value || 'Normal';
        const relModeRaw = (document.getElementById('salesFormRelMode') || document.getElementById('salesFormReleasingMode'))?.value || '';
        const mode = (relModeRaw === 'Blank' || !relModeRaw) ? 'Pickup' : relModeRaw;
        const locRaw = document.getElementById('salesFormLocation')?.value || '';
        const location = (locRaw === 'Blank' || !locRaw) ? 'Indoor' : locRaw;
        const contactPerson = document.getElementById('salesFormContactPerson')?.value.trim() || 'N/A';
        const contactNumber = document.getElementById('salesFormContactNumber')?.value.trim() || 'N/A';
        const address = document.getElementById('salesFormAddress')?.value.trim() || 'N/A';
        const nowStamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const orderDateEl = document.getElementById('salesFormOrderDate');
        const orderDate = (orderDateEl && orderDateEl.value) ? orderDateEl.value.trim() : nowStamp.substring(0, 10);

        const requiredChecks = [
          { val: reqId, id: 'salesFormReqId', name: 'Request ID' },
          { val: salesRep, id: 'salesFormSalesRep', name: 'Sales Representative' },
          { val: client, id: 'salesFormClient', name: 'Client Name' },
          { val: project, id: 'salesFormProject', name: 'Project Name' },
          { val: deadline, id: 'salesFormDeadline', name: 'Design Deadline' },
          { val: artist, id: 'salesFormArtist', name: 'Assigned Artist' }
        ];

        const missingModal = [];
        requiredChecks.forEach(c => {
          if (!c.val) {
            missingModal.push(c.name);
            const el = document.getElementById(c.id);
            const customBtn = el && el._formDropdownBtn;
            const target = customBtn || el;
            if (target) {
              target.classList.add('is-invalid-detail');
              const cleanUp = () => {
                target.classList.remove('is-invalid-detail');
                if (el) {
                  el.removeEventListener('input', cleanUp);
                  el.removeEventListener('change', cleanUp);
                }
              };
              if (el) {
                el.addEventListener('input', cleanUp);
                el.addEventListener('change', cleanUp);
              }
            }
          }
        });

        if (missingModal.length > 0) {
          showToast(`Cannot save: All sales request details are required. Please fill in: ${missingModal.slice(0, 3).join(', ')}${missingModal.length > 3 ? ' (+' + (missingModal.length - 3) + ' more)' : ''}.`, 'error');
          const firstInvalid = salesForm.querySelector('.is-invalid-detail');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
          }
          return;
        }

        let newRec = null;
        if (id) {
          const rec = state.requests.find(r => String(r.id) === String(id) || r.requestId === id);
          if (rec) {
            rec.requestId = reqId;
            rec.joNumber = jo || 'TF';
            rec.orderDate = orderDate || rec.orderDate;
            rec.projectName = project || 'N/A';
            rec.client = client || 'N/A';
            rec.artist = artist || 'N/A';
            rec.salesRep = salesRep || 'N/A';
            rec.designDeadline = deadline || 'N/A';
            rec.releasingDate = releasingDate || deadline || 'N/A';
            rec.fileSent = fileSent;
            rec.location = location;
            rec.clientApproval = clientApproval;
            rec.projectStatus = clientApproval;
            rec.priority = priority;
            rec.releasingMode = mode;
            rec.contactPerson = contactPerson;
            rec.contactNumber = contactNumber;
            rec.completeAddress = address;
            rec.dateUpdated = nowStamp;
            rec.timestamp = orderDate || rec.timestamp;
            showToast(`Sales request ${reqId} updated.`);
            if (window.PMS_API_URL) {
              fetch(window.PMS_API_URL + '?action=update_request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rec)
              }).catch(err => console.warn('MySQL update sync:', err));
            }
          }
        } else {
          newRec = {
            id: `req-${Date.now()}`,
            requestId: reqId,
            joNumber: jo || 'TF',
            projectName: project || 'N/A',
            client: client || 'N/A',
            artist: artist || 'N/A',
            salesRep: salesRep || 'N/A',
            inCharge: toTitleCase(salesRep),
            drawnBy: toTitleCase(artist),
            orderDate: orderDate || nowStamp.substring(0, 10),
            designDeadline: deadline || 'N/A',
            releasingDate: releasingDate || deadline || 'N/A',
            releasingMode: mode,
            location: location,
            completeAddress: address,
            contactPerson: contactPerson,
            contactNumber: contactNumber,
            clientApproval: clientApproval,
            priority: priority,
            fileSent: fileSent,
            installers: '2 Installers',
            duration: '1 Day',
            notes: 'N/A',
            projectStatus: clientApproval || 'Pending Approval',
            artistAccepted: 'Pending',
            artistAcceptedDate: null,
            designStatus: 'On Queue',
            headApproval: 'Pending',
            countStandard: 0,
            countPrinting: 0,
            countSpecial: 0,
            revisionCount: 0,
            remarks: 'N/A',
            month: 'October 2026',
            completionDate: null,
            timestamp: orderDate || nowStamp.substring(0, 10),
            dateUpdated: nowStamp
          };
          state.requests.unshift(newRec);
          if (window.PMS_API_URL) {
            fetch(window.PMS_API_URL + '?action=create_request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newRec)
            })
            .then(res => res.json())
            .then(res => {
              if (res && res.success) {
                if (res.id) newRec.id = res.id;
                if (res.requestId && res.requestId !== newRec.requestId) {
                  newRec.requestId = res.requestId;
                  if (document.getElementById('salesRequestsTableBody')) {
                    if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
                  }
                }
              }
            })
            .catch(err => console.warn('MySQL create sync:', err));
          }
          showToast(`Request ${reqId} created successfully!`, 'success');
        }

        saveStateToStorage();
        document.getElementById('salesModal').classList.remove('show');
        renderCurrentView(state.activeView);
        if (document.getElementById('salesRequestsTableBody')) {
          if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
          setTimeout(() => {
            const targetId = id || (newRec && newRec.id);
            if (targetId) {
              const row = document.querySelector(`tr[data-req-id="${targetId}"]`);
              if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                row.classList.add('table-row-new-entry');
              }
            }
          }, 120);
        }
      });
    }

    const trackerForm = document.getElementById('trackerTaskForm');
    if (trackerForm) {
      trackerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('trackerFormId').value;
        const rec = state.requests.find(r => r.id === id);
        if (rec) {
          rec.artist = document.getElementById('trackerFormArtist').value || 'N/A';
          rec.projectName = document.getElementById('trackerFormProject').value.trim() || 'N/A';
          rec.designDeadline = document.getElementById('trackerFormDeadline').value || 'N/A';
          rec.headApproval = document.getElementById('trackerFormHeadApproval').value || 'Pending';
          rec.projectStatus = document.getElementById('trackerFormProjectStatus').value || 'On-going';
          rec.designStatus = document.getElementById('trackerFormDesignStatus').value || 'On Queue';
          rec.countStandard = parseInt(document.getElementById('trackerFormStd').value, 10) || 0;
          rec.countSpecial = parseInt(document.getElementById('trackerFormSpc').value, 10) || 0;
          rec.countPrinting = parseInt(document.getElementById('trackerFormPrt').value, 10) || 0;
          rec.revisionCount = parseInt(document.getElementById('trackerFormRev').value, 10) || 0;
          rec.remarks = document.getElementById('trackerFormRemarks').value.trim() || 'N/A';
          rec.dateUpdated = new Date().toISOString().replace('T', ' ').substring(0, 16);

          if (rec.projectStatus === 'Completed' && !rec.completionDate) {
            rec.completionDate = '2026-10-23';
          }

          saveStateToStorage();
          showToast(`Task ${rec.requestId} updated.`);
        }
        document.getElementById('trackerModal').classList.remove('show');
        renderCurrentView(state.activeView);
      });
    }
  }

  // ==========================================================================
  // DEADLINE REMINDER ALERTS & NOTIFICATION CENTER ENGINE
  // ==========================================================================

  let currentAlertTab = 'all';

  function updateDeadlineAlertCenter() {
    const requests = state.requests || [];
    
    // Categorize active requests
    const overdueList = [];
    const todayList = [];
    const soonList = [];

    requests.forEach(r => {
      if (r.projectStatus === 'Completed') return;
      const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
      if (alertInfo.status === 'overdue') {
        overdueList.push({ request: r, alert: alertInfo });
      } else if (alertInfo.status === 'today') {
        todayList.push({ request: r, alert: alertInfo });
      } else if (alertInfo.status === 'soon') {
        soonList.push({ request: r, alert: alertInfo });
      }
    });

    const allAlerts = [...overdueList, ...todayList, ...soonList];
    const totalCount = allAlerts.length;

    // 1. Update Topbar Bell Badge
    const badgeEl = document.getElementById('deadlineAlertBadge');
    if (badgeEl) {
      badgeEl.textContent = totalCount;
      if (totalCount > 0) {
        badgeEl.style.display = 'inline-flex';
        badgeEl.className = 'deadline-alert-badge has-alerts' + (overdueList.length > 0 ? ' badge-overdue' : '');
      } else {
        badgeEl.style.display = 'none';
      }
    }

    // 2. Update Dropdown Header & Tab Counts
    const totalPill = document.getElementById('deadlineAlertTotalPill');
    if (totalPill) {
      totalPill.textContent = `${totalCount} Alert${totalCount === 1 ? '' : 's'}`;
      totalPill.className = 'deadline-alert-total-pill' + (overdueList.length > 0 ? ' pill-overdue' : '');
    }

    const countTabAll = document.getElementById('countTabAll');
    if (countTabAll) countTabAll.textContent = totalCount;

    const countTabOverdue = document.getElementById('countTabOverdue');
    if (countTabOverdue) countTabOverdue.textContent = overdueList.length;

    const countTabToday = document.getElementById('countTabToday');
    if (countTabToday) countTabToday.textContent = todayList.length;

    const countTabSoon = document.getElementById('countTabSoon');
    if (countTabSoon) countTabSoon.textContent = soonList.length;

    // 3. Render Dropdown Alert Items
    renderAlertDrawerItems(allAlerts, overdueList, todayList, soonList);

    // 4. Update Dashboard Widget (if on index / dashboard)
    const widgetOverdue = document.getElementById('widgetCountOverdue');
    if (widgetOverdue) {
      widgetOverdue.textContent = overdueList.length;
      const subOverdue = document.getElementById('widgetSubOverdue');
      if (subOverdue) subOverdue.textContent = overdueList.length > 0 ? `${overdueList.length} past deadline` : 'No overdue projects';
    }

    const widgetToday = document.getElementById('widgetCountToday');
    if (widgetToday) {
      widgetToday.textContent = todayList.length;
      const subToday = document.getElementById('widgetSubToday');
      if (subToday) subToday.textContent = todayList.length > 0 ? `${todayList.length} due today` : 'None due today';
    }

    const widgetSoon = document.getElementById('widgetCountSoon');
    if (widgetSoon) {
      widgetSoon.textContent = soonList.length;
      const subSoon = document.getElementById('widgetSubSoon');
      if (subSoon) subSoon.textContent = soonList.length > 0 ? `${soonList.length} due in next 48h` : 'None in next 48h';
    }

    const widgetTotalPill = document.getElementById('widgetTotalAlertsPill');
    if (widgetTotalPill) {
      if (totalCount > 0) {
        widgetTotalPill.textContent = `${totalCount} Action Required`;
        widgetTotalPill.className = 'deadline-pill ' + (overdueList.length > 0 ? 'deadline-pill-overdue' : 'deadline-pill-today');
      } else {
        widgetTotalPill.textContent = `All On Track`;
        widgetTotalPill.className = 'deadline-pill deadline-pill-ontrack';
      }
    }
  }

  function renderAlertDrawerItems(allAlerts, overdueList, todayList, soonList) {
    const listEl = document.getElementById('deadlineAlertList');
    if (!listEl) return;

    let itemsToRender = [];
    if (currentAlertTab === 'overdue') itemsToRender = overdueList;
    else if (currentAlertTab === 'today') itemsToRender = todayList;
    else if (currentAlertTab === 'soon') itemsToRender = soonList;
    else itemsToRender = allAlerts;

    if (itemsToRender.length === 0) {
      listEl.innerHTML = `
        <div class="deadline-empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div class="empty-state-title">No Pending Alerts</div>
          <p class="empty-state-desc">All project milestones for this category are on schedule.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = itemsToRender.map(item => {
      const r = item.request;
      const a = item.alert;
      const sevClass = a.status === 'overdue' ? 'sev-overdue' : (a.status === 'today' ? 'sev-today' : 'sev-soon');
      const pillClass = a.status === 'overdue' ? 'deadline-pill-overdue' : (a.status === 'today' ? 'deadline-pill-today' : 'deadline-pill-soon');

      return `
        <div class="deadline-alert-item ${sevClass}" data-req-id="${r.id}">
          <div class="alert-item-header">
            <div class="alert-item-left">
              <div class="alert-item-topline">
                <span class="alert-jo-badge">${escapeHTML(r.requestId || r.joNumber || r.id)}</span>
                <span class="badge ${getStatusBadgeClass(r.projectStatus)}" style="font-size:10px; padding:1px 6px;">${escapeHTML(r.projectStatus)}</span>
              </div>
              <h4 class="alert-project-title" title="${escapeHTML(r.projectName)}">${escapeHTML(r.projectName)}</h4>
            </div>
            <span class="deadline-pill ${pillClass}">${escapeHTML(a.diffText)}</span>
          </div>

          <div class="alert-item-meta">
            <span class="alert-meta-point">Client: <strong>${escapeHTML(r.client || '-')}</strong></span>
            <span class="alert-meta-point">Artist: <strong>${escapeHTML(r.artist || 'Unassigned')}</strong></span>
          </div>

          <div class="alert-item-actions">
            <button class="alert-action-btn btn-view-table" onclick="window.SignDepotApp.filterByDeadlineProject('${r.id}')" title="Find and highlight in table">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>View in Table</span>
            </button>
            <button class="alert-action-btn btn-view-directive" onclick="window.SignDepotApp.openDirectiveForRequest('${r.id}')" title="Open Job Order Blueprint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><rect x="6" y="14" width="12" height="8"></rect></svg>
              <span>Directive</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // PUBLIC API (Exposed on window.SignDepotApp)
  // ==========================================================================

  // Shared Utilities & Constants exposed for Page Modules
  const AppUtils = {
    escapeHTML,
    toTitleCase,
    normalizeReleasingMode,
    isOverdue,
    getDeadlineAlertStatus,
    getAvailabilityBadge,
    isProjectArtistAccepted,
    getStatusBadgeClass,
    normalizeRequestItem,
    saveStateToStorage,
    showToast,
    showCustomConfirm,
    renderPagination,
    renderEditableCell,
    renderInlineSelect,
    renderInlineDate,
    renderInlineNumber,
    canUserAccessTab,
    canUserAccessModule,
    hasPermission,
    isCurrentUserSuperAdmin,
    getLoggedInArtist,
    getLoggedInSalesRep,
    syncFilterSelectUI,
    upgradeAllFilterSelects,
    upgradeAllFormSelects,
    syncAllFormDropdowns,
    syncFormDropdownBtn,
    editSalesRequest,
    deleteSalesRequest,
    downloadCsv,
    bindRowsSelects,
    openNewSalesRequestModal,
    getNextRequestId,
    formatRequestIdInput,
    getStoredRowsPerPage,
    renderDraftSalesRowHTML,
    populateSalesFiltersDropdowns
  };

  const AppConstants = {
    STORAGE_KEY,
    DEFAULT_ARTISTS,
    DEFAULT_SALES_REPS,
    PROJECT_STATUSES,
    DESIGN_STATUSES,
    PRIORITY_LEVELS,
    APPROVAL_LEVELS,
    FILE_STATUS_LEVELS,
    FILE_SENT_LEVELS,
    PLACEMENT_OPTIONS,
    RELEASING_MODES,
    HEAD_APPROVAL_LEVELS
  };

  window.SignDepotApp = {
    state: state,
    utils: AppUtils,
    constants: AppConstants,
    ...AppUtils,
    ensurePageModuleLoaded: ensurePageModuleLoaded,
    openEnvOptionMenu: (...args) => (window.SignDepotApp._openEnvOptionMenu ? window.SignDepotApp._openEnvOptionMenu(...args) : null),
    setDirectiveEnvType: (...args) => (window.SignDepotApp._setDirectiveEnvType ? window.SignDepotApp._setDirectiveEnvType(...args) : null),
    setActivityFilter: (f) => (window.SignDepotApp.renderRecentActivityFeed ? window.SignDepotApp.renderRecentActivityFeed(f) : null),
    refreshRecentActivity: () => (window.SignDepotApp.renderRecentActivityFeed ? window.SignDepotApp.renderRecentActivityFeed() : null),
    clearTrackerKpiFilter: () => {
      state.trackerKpiFilter = 'all';
      state.trackerFilter.projectStatus = '';
      state.trackerFilter.designStatus = '';
      state.trackerFilter.artist = '';
      state.trackerFilter.overdue = '';
      state.trackerFilter.search = '';
      state.trackerFilter.page = 1;
      const statusSel = document.getElementById('trackerFilterProjectStatus');
      if (statusSel) statusSel.value = '';
      const overdueSel = document.getElementById('trackerFilterOverdue');
      if (overdueSel) overdueSel.value = '';
      const searchInput = document.getElementById('trackerSearchInput');
      if (searchInput) searchInput.value = '';
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      showToast('Showing all tasks in Creatives Tracker', 'info');
    },
    switchTrackerAcceptanceTab: (tabKey) => {
      state.trackerAcceptanceTab = tabKey || 'accepted';
      state.trackerFilter.page = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      const labels = {
        accepted: 'Accepted Projects',
        pending: 'Pending Projects (To be Accepted)',
        all: 'All Projects'
      };
      showToast('Viewing ' + (labels[tabKey] || 'Accepted Projects'), 'info');
    },
    acceptArtistProject: (id) => {
      if (!id) return;
      const rec = (state.requests || []).find(r => String(r.id) === String(id) || String(r.requestId) === String(id));
      if (!rec) {
        showToast('Task not found', 'error');
        return;
      }
      const todayStr = (new Date()).toISOString().slice(0, 10);
      rec.artistAccepted = 'Accepted';
      rec.artistAcceptedDate = todayStr;
      if (rec.designStatus === 'On Queue' || rec.designStatus === 'Not Started' || !rec.designStatus) {
        rec.designStatus = 'Ongoing';
      }
      if (window.PMS_API_URL) {
        fetch(window.PMS_API_URL + '?action=accept_artist_project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: rec.id })
        })
        .then(r => r.json())
        .then(res => {
          if (res && res.success && window.PmsCache) window.PmsCache.invalidate();
        })
        .catch(err => console.error('Accept project network error:', err));
      }
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      if (typeof updateDashboardKPIs === 'function') {
        updateDashboardKPIs();
      } else if (window.SignDepotApp && typeof window.SignDepotApp.updateDashboardKPIs === 'function') {
        window.SignDepotApp.updateDashboardKPIs();
      }
      showToast('Project ' + rec.requestId + ' accepted! Moved to Accepted Projects.', 'success');
    },
    handleKpiCardClick: (type) => {
      if (state.dashboardKpiFilter === type && type !== 'all') {
        state.dashboardKpiFilter = 'all';
      } else {
        state.dashboardKpiFilter = type;
      }
      const statusSelect = document.getElementById('dashboardFilterStatus');
      if (statusSelect) statusSelect.value = '';
      state.dashboardStatus = '';
      const deadlineSelect = document.getElementById('dashboardFilterDeadline');
      if (deadlineSelect && type !== 'overdue') {
        deadlineSelect.value = '';
        state.dashboardDeadline = '';
      }
      state.dashboardPage = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
    },
    openKpiQuickView: (type) => {
      const modal = document.getElementById('kpiQuickViewModal');
      if (!modal) return;
      const titleEl = document.getElementById('kpiQuickViewTitle');
      const countEl = document.getElementById('kpiQuickViewCount');
      const descEl = document.getElementById('kpiQuickViewDesc');
      const content = document.getElementById('kpiQuickViewContent');
      const filterBtn = document.getElementById('btnKpiModalFilterTable');
      const titles = {
        all: { title: 'Total Production Requests', desc: 'All active and historical sales orders logged in system' },
        pending: { title: 'Pending Approval Tasks', desc: 'Awaiting creative lead or client design approval' },
        working: { title: 'Active Production / On-going', desc: 'Currently being actively designed and fabricated' },
        approved: { title: 'Approved Creative Directives', desc: 'Directives that have passed final approval' },
        revising: { title: 'Revisions in Progress', desc: 'Design directives under customer-requested revisions' },
        overdue: { title: 'Overdue Directives', desc: 'Active tasks past their specified deadline target date' }
      };
      const meta = titles[type] || titles.all;
      if (titleEl) titleEl.textContent = meta.title;
      if (descEl) descEl.textContent = meta.desc;
      const items = (typeof getKpiFilteredRequests === 'function') ? getKpiFilteredRequests(type) : [];
      if (countEl) countEl.textContent = '(' + items.length + ' items)';
      if (content) {
        if (items.length === 0) {
          content.innerHTML = '<div style="text-align:center; padding:32px 16px; color:var(--text-muted); font-size:13px;">There are currently no active projects matching this category.</div>';
        } else {
          content.innerHTML = items.map(r => `
            <div class="kpi-modal-item">
              <div class="kpi-modal-item-left">
                <div class="kpi-modal-item-title-row">
                  <span class="kpi-modal-req">${escapeHTML(r.requestId)}</span>
                  <span class="kpi-modal-jo">${escapeHTML(r.joNumber)}</span>
                  <span class="kpi-modal-name" title="${escapeHTML(r.projectName)}">${escapeHTML(r.projectName)}</span>
                </div>
                <div class="kpi-modal-meta">
                  <span>Client: <strong>${escapeHTML(r.client || '-')}</strong></span>
                  <span>Artist: <strong>${escapeHTML(r.artist || 'Unassigned')}</strong></span>
                  <span>Sales: <strong>${escapeHTML(r.salesRep || '-')}</strong></span>
                  <span>Status: <span class="badge ${getStatusBadgeClass(r.projectStatus)}" style="font-size:10px; padding:2px 6px;">${escapeHTML(r.projectStatus)}</span></span>
                </div>
              </div>
              <div class="kpi-modal-actions">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.viewProjectInQueue('${r.id}')" title="Find in Live Table">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  Table
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="Open Job Directive">
                  Directive
                </button>
              </div>
            </div>
          `).join('');
        }
      }
      if (filterBtn) {
        filterBtn.onclick = () => {
          modal.classList.remove('show');
          window.SignDepotApp.navigateToPageTable(type);
        };
        filterBtn.textContent = 'Open in Tracker Table (' + items.length + ') ↗';
      }
      modal.classList.add('show');
    },
    viewProjectInQueue: (reqId) => {
      const modal = document.getElementById('kpiQuickViewModal');
      if (modal) modal.classList.remove('show');
      window.SignDepotApp.filterByDeadlineProject(reqId);
    },
    setAlertTab: (tab) => {
      currentAlertTab = tab;
      document.querySelectorAll('.deadline-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-alert-tab') === tab);
      });
      updateDeadlineAlertCenter();
    },
    toggleDeadlineAlertDrawer: (force) => {
      const dropdown = document.getElementById('deadlineAlertDropdown');
      if (!dropdown) return;
      if (typeof force === 'boolean') {
        dropdown.classList.toggle('show', force);
      } else {
        dropdown.classList.toggle('show');
      }
    },
    filterDashboardDeadlines: (type) => {
      const select = document.getElementById('dashboardFilterDeadline');
      const cards = {
        overdue: document.getElementById('cardFilterOverdue'),
        today: document.getElementById('cardFilterToday'),
        soon: document.getElementById('cardFilterSoon')
      };
      if (state.dashboardDeadline === type) {
        state.dashboardDeadline = '';
        if (select) select.value = '';
        Object.values(cards).forEach(c => c && c.classList.remove('active'));
      } else {
        state.dashboardDeadline = type;
        if (select) select.value = type;
        Object.entries(cards).forEach(([k, c]) => {
          if (c) c.classList.toggle('active', k === type);
        });
      }
      state.dashboardPage = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
    },
    switchView: switchView,
    renderSalesRequests: (...args) => (window.SignDepotApp._renderSalesRequests ? window.SignDepotApp._renderSalesRequests(...args) : null),
    renderCreativesTracker: (...args) => (window.SignDepotApp._renderCreativesTracker ? window.SignDepotApp._renderCreativesTracker(...args) : null),
    renderDashboardRecentProjectsTable: (...args) => (window.SignDepotApp._renderDashboardRecentProjectsTable ? window.SignDepotApp._renderDashboardRecentProjectsTable(...args) : null),
    canUserEditField: canUserEditField,
    canUserAccessTab: canUserAccessTab,
    getCurrentUserPermissions: getCurrentUserPermissions,
    openNewSalesRequestModal: openNewSalesRequestModal,
    openPrintRequest: (...args) => (window.SignDepotApp && typeof window.SignDepotApp.openPrintRequest === 'function' ? window.SignDepotApp.openPrintRequest(...args) : (window.openPrintRequest ? window.openPrintRequest(...args) : null)),
    editSalesRequest: editSalesRequest,
    deleteSalesRequest: deleteSalesRequest,
    formatRequestIdInput: formatRequestIdInput,
    getNextRequestId: getNextRequestId,
    showCustomConfirm: showCustomConfirm,
    resetSalesFilters: (...args) => (window.SignDepotApp._resetSalesFilters ? window.SignDepotApp._resetSalesFilters(...args) : null),
    resetTrackerFilters: (...args) => (window.SignDepotApp._resetTrackerFilters ? window.SignDepotApp._resetTrackerFilters(...args) : null),
    renderProgressTimeline: (...args) => (window.SignDepotApp._renderProgressTimeline ? window.SignDepotApp._renderProgressTimeline(...args) : null),
    renderRecentActivityFeed: (...args) => (window.SignDepotApp._renderRecentActivityFeed ? window.SignDepotApp._renderRecentActivityFeed(...args) : null),
    refreshRecentActivity: () => renderRecentActivityFeed(currentActivityFilter),
    showTimelineTooltip: (...args) => (window.SignDepotApp._showTimelineTooltip ? window.SignDepotApp._showTimelineTooltip(...args) : null),
    hideTimelineTooltip: (...args) => (window.SignDepotApp._hideTimelineTooltip ? window.SignDepotApp._hideTimelineTooltip(...args) : null),
    getState: () => state,

    // KPI Cards Clickable & Viewable Public API (SPA + Multi-Page Aware)
    navigateToPageTable: (type) => {
      // 1. In Single-Page App mode (GAS or single page with view-panels in DOM):
      const creativesPanel = document.getElementById('view-creatives-tracker');
      const isGas = typeof google !== 'undefined' && google.script;
      if (creativesPanel || isGas) {
        if (typeof switchView === 'function') {
          switchView('view-creatives-tracker');
        }
        if (typeof window.SignDepotApp.applyKpiFilterToCreativesTracker === 'function') {
          window.SignDepotApp.applyKpiFilterToCreativesTracker(type);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 2. Multi-page fallback for standalone static HTML pages
      sessionStorage.setItem('SIGN_DEPOT_ACTIVE_KPI', type);
      const currentPath = window.location.pathname.replace(/\\/g, '/');
      const isInsidePagesFolder = currentPath.toLowerCase().includes('/pages/');
      const isPhp = window.location.pathname.endsWith('.php') || typeof window.PMS_API_URL !== 'undefined';
      const ext = isPhp ? '.php' : '.html';
      const targetUrl = (isInsidePagesFolder ? '' : 'pages/') + 'creatives-production' + ext + '?kpi=' + encodeURIComponent(type);
      window.location.href = targetUrl;
    },

    applyKpiFilterToCreativesTracker: (type) => {
      if (state.trackerKpiFilter === type && type !== 'all') {
        state.trackerKpiFilter = 'all';
      } else {
        state.trackerKpiFilter = type || 'all';
      }

      state.trackerFilter.page = 1;

      // Reset dropdown inputs to match cleanly
      const statusSelect = document.getElementById('trackerFilterProjectStatus');
      const overdueSelect = document.getElementById('trackerFilterOverdue');
      if (statusSelect) statusSelect.value = '';
      if (overdueSelect) overdueSelect.value = '';
      state.trackerFilter.projectStatus = '';
      state.trackerFilter.overdue = '';

      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();

      const labels = {
        all: 'All Requests',
        pending: 'Pending Approval',
        working: 'Working / On-Going',
        approved: 'Approved',
        revising: 'Revising',
        overdue: 'Overdue'
      };
      showToast(`Showing ${labels[state.trackerKpiFilter] || 'All'} in Creatives Tracker`, 'info');
    },

    clearTrackerKpiFilter: () => {
      state.trackerKpiFilter = 'all';
      state.trackerFilter.projectStatus = '';
      state.trackerFilter.designStatus = '';
      state.trackerFilter.artist = '';
      state.trackerFilter.overdue = '';
      state.trackerFilter.search = '';
      state.trackerFilter.page = 1;
      const statusSel = document.getElementById('trackerFilterProjectStatus');
      if (statusSel) statusSel.value = '';
      const overdueSel = document.getElementById('trackerFilterOverdue');
      if (overdueSel) overdueSel.value = '';
      const searchInput = document.getElementById('trackerSearchInput');
      if (searchInput) searchInput.value = '';
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      showToast('Showing all tasks in Creatives Tracker', 'info');
    },

    switchTrackerAcceptanceTab: (tabKey) => {
      state.trackerAcceptanceTab = tabKey || 'accepted';
      state.trackerFilter.page = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      const labels = {
        accepted: 'Accepted Projects',
        pending: 'Pending Projects (To be Accepted)',
        all: 'All Projects'
      };
      showToast(`Viewing ${labels[tabKey] || 'Accepted Projects'}`, 'info');
    },

    acceptArtistProject: (id) => {
      if (!id) return;
      const rec = (state.requests || []).find(r => String(r.id) === String(id) || String(r.requestId) === String(id));
      if (!rec) {
        showToast('Task not found', 'error');
        return;
      }

      const todayStr = (new Date()).toISOString().slice(0, 10);
      rec.artistAccepted = 'Accepted';
      rec.artistAcceptedDate = todayStr;
      if (rec.designStatus === 'On Queue' || rec.designStatus === 'Not Started' || !rec.designStatus) {
        rec.designStatus = 'Ongoing';
      }

      // Sync to backend MySQL
      if (window.PMS_API_URL) {
        fetch(window.PMS_API_URL + '?action=accept_artist_project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: rec.id })
        })
        .then(r => r.json())
        .then(res => {
          if (res && res.success) {
            if (window.PmsCache) window.PmsCache.invalidate();
          } else if (!res || !res.success) {
            console.warn('Backend sync response:', res);
          }
        })
        .catch(err => console.error('Accept project network error:', err));
      }

      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      updateDashboardKPIs();
      showToast(`Project ${rec.requestId} accepted! Moved to Accepted Projects.`, 'success');
    },

    handleKpiCardClick: (type) => {
      if (state.dashboardKpiFilter === type && type !== 'all') {
        state.dashboardKpiFilter = 'all';
      } else {
        state.dashboardKpiFilter = type;
      }

      // Reset specific conflicting filters if any
      const statusSelect = document.getElementById('dashboardFilterStatus');
      if (statusSelect) statusSelect.value = '';
      state.dashboardStatus = '';
      
      const deadlineSelect = document.getElementById('dashboardFilterDeadline');
      if (deadlineSelect && type !== 'overdue') {
        deadlineSelect.value = '';
        state.dashboardDeadline = '';
      }

      state.dashboardPage = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();

      // Smooth scroll to table
      const queueSection = document.getElementById('liveProductionQueueCard');
      if (queueSection) {
        queueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const labels = {
        all: 'All Requests',
        pending: 'Pending Approval',
        working: 'Working / On-Going',
        completed: 'Completed',
        revising: 'Revising',
        overdue: 'Overdue'
      };
      showToast(`Showing ${labels[state.dashboardKpiFilter] || 'All'} in Production Queue`, 'info');
    },

    openKpiQuickView: (type) => {
      const modal = document.getElementById('kpiQuickViewModal');
      const content = document.getElementById('kpiModalContent');
      const title = document.getElementById('kpiModalTitle');
      const badge = document.getElementById('kpiModalBadge');
      const footerCount = document.getElementById('kpiModalFooterCount');
      const filterBtn = document.getElementById('btnKpiModalFilterTable');
      if (!modal || !content) return;

      const items = getKpiFilteredRequests(type);

      const metaMap = {
        all: { title: 'Total Active Requests', badge: 'All Records', badgeClass: 'badge-ongoing' },
        pending: { title: 'Pending Approval Queue', badge: 'Queue', badgeClass: 'badge-pending' },
        working: { title: 'Working & On-Going Projects', badge: 'In Progress', badgeClass: 'badge-ongoing' },
        approved: { title: 'Approved Projects', badge: 'Approved', badgeClass: 'badge-approved' },
        completed: { title: 'Approved Projects', badge: 'Approved', badgeClass: 'badge-approved' },
        revising: { title: 'Client Revision Requests', badge: 'Feedback', badgeClass: 'badge-revising' },
        overdue: { title: 'Past Due / Overdue Projects', badge: 'Past Due', badgeClass: 'badge-priority-rush' }
      };

      const meta = metaMap[type] || metaMap['all'];
      if (title) title.textContent = meta.title;
      if (badge) {
        badge.textContent = meta.badge;
        badge.className = `badge ${meta.badgeClass}`;
      }
      if (footerCount) {
        footerCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'project' : 'projects'}`;
      }

      if (items.length === 0) {
        content.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px;">
              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div style="font-size: 15px; font-weight: 700; color: #1E293B;">No Projects in this Category</div>
            <p style="font-size: 13px; margin-top: 4px;">There are currently no active projects matching "${meta.title}".</p>
          </div>
        `;
      } else {
        content.innerHTML = items.map(r => {
          const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
          let deadlinePill = '';
          if (alertInfo.status === 'overdue') {
            deadlinePill = `<span class="deadline-pill deadline-pill-overdue">${alertInfo.pillText}</span>`;
          } else if (alertInfo.status === 'today') {
            deadlinePill = `<span class="deadline-pill deadline-pill-today">Today</span>`;
          } else if (alertInfo.status === 'soon') {
            deadlinePill = `<span class="deadline-pill deadline-pill-soon">${alertInfo.pillText}</span>`;
          }

          return `
            <div class="kpi-modal-item">
              <div class="kpi-modal-item-left">
                <div class="kpi-modal-item-title-row">
                  <span class="kpi-modal-req">${escapeHTML(r.requestId)}</span>
                  <span class="kpi-modal-jo">${escapeHTML(r.joNumber)}</span>
                  <span class="kpi-modal-name" title="${escapeHTML(r.projectName)}">${escapeHTML(r.projectName)}</span>
                  ${deadlinePill}
                </div>
                <div class="kpi-modal-meta">
                  <span>Client: <strong>${escapeHTML(r.client || '-')}</strong></span>
                  <span>Artist: <strong>${escapeHTML(r.artist || 'Unassigned')}</strong></span>
                  <span>Sales: <strong>${escapeHTML(r.salesRep || '-')}</strong></span>
                  <span>Status: <span class="badge ${getStatusBadgeClass(r.projectStatus)}" style="font-size:10px; padding:2px 6px;">${escapeHTML(r.projectStatus)}</span></span>
                </div>
              </div>
              <div class="kpi-modal-actions">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.viewProjectInQueue('${r.id}')" title="Find in Live Table">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  Table
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="Open Job Directive">
                  Directive
                </button>
              </div>
            </div>
          `;
        }).join('');
      }

      if (filterBtn) {
        filterBtn.onclick = () => {
          modal.classList.remove('show');
          window.SignDepotApp.navigateToPageTable(type);
        };
        filterBtn.textContent = `Open in Tracker Table (${items.length}) â†—`;
      }

      modal.classList.add('show');
    },

    viewProjectInQueue: (reqId) => {
      const modal = document.getElementById('kpiQuickViewModal');
      if (modal) modal.classList.remove('show');
      window.SignDepotApp.filterByDeadlineProject(reqId);
    },

    // Deadline Alert Center Public API
    setAlertTab: (tab) => {
      currentAlertTab = tab;
      document.querySelectorAll('.deadline-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-alert-tab') === tab);
      });
      updateDeadlineAlertCenter();
    },

    toggleDeadlineAlertDrawer: (force) => {
      const dropdown = document.getElementById('deadlineAlertDropdown');
      if (!dropdown) return;
      if (typeof force === 'boolean') {
        dropdown.classList.toggle('show', force);
      } else {
        dropdown.classList.toggle('show');
      }
    },

    filterDashboardDeadlines: (type) => {
      const select = document.getElementById('dashboardFilterDeadline');
      const cards = {
        overdue: document.getElementById('cardFilterOverdue'),
        today: document.getElementById('cardFilterToday'),
        soon: document.getElementById('cardFilterSoon')
      };

      if (state.dashboardDeadline === type) {
        state.dashboardDeadline = '';
        if (select) select.value = '';
        Object.values(cards).forEach(c => c && c.classList.remove('active'));
      } else {
        state.dashboardDeadline = type;
        if (select) select.value = type;
        Object.entries(cards).forEach(([k, c]) => {
          if (c) c.classList.toggle('active', k === type);
        });
      }

      state.dashboardPage = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
    },

    filterByDeadlineProject: (reqId) => {
      const rec = state.requests.find(r => r.id === reqId);
      if (!rec) return;

      const dropdown = document.getElementById('deadlineAlertDropdown');
      if (dropdown) dropdown.classList.remove('show');

      const currentFile = (window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html').toLowerCase();

      const isGas = typeof google !== 'undefined' && google.script;
      if ((state.activeView === 'view-dashboard') || currentFile === 'index.html' || currentFile === '' || isGas) {
        state.dashboardSearch = rec.requestId;
        state.dashboardStatus = '';
        state.dashboardDeadline = '';
        const searchInput = document.getElementById('dashboardSearchInput');
        if (searchInput) searchInput.value = rec.requestId;
        const statusSelect = document.getElementById('dashboardFilterStatus');
        if (statusSelect) statusSelect.value = '';
        const deadlineSelect = document.getElementById('dashboardFilterDeadline');
        if (deadlineSelect) deadlineSelect.value = '';
        state.dashboardPage = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();

        setTimeout(() => {
          const row = document.querySelector(`tr[data-req-id="${reqId}"]`);
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.classList.add('table-row-highlight');
            setTimeout(() => row.classList.remove('table-row-highlight'), 3000);
          }
        }, 150);
        showToast(`Viewing ${rec.requestId} - ${rec.projectName}`, 'info');
      } else {
        if (document.getElementById('trackerSearchInput')) {
          state.trackerFilter.search = rec.requestId;
          state.trackerFilter.projectStatus = '';
          state.trackerFilter.designStatus = '';
          state.trackerFilter.artist = '';
          state.trackerFilter.overdue = '';
          state.trackerFilter.page = 1;
          const tSearch = document.getElementById('trackerSearchInput');
          if (tSearch) tSearch.value = rec.requestId;
          if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
          setTimeout(() => {
            const row = document.querySelector(`tr[data-req-id="${reqId}"]`);
            if (row) {
              row.scrollIntoView({ behavior: 'smooth', block: 'center' });
              row.classList.add('table-row-highlight');
              setTimeout(() => row.classList.remove('table-row-highlight'), 3000);
            }
          }, 150);
          showToast(`Viewing ${rec.requestId} in Creatives Tracker`, 'info');
        } else if (document.getElementById('salesSearchInput')) {
          state.salesFilter.search = rec.requestId;
          state.salesFilter.priority = '';
          state.salesFilter.approval = '';
          state.salesFilter.fileSent = '';
          state.salesFilter.salesRep = '';
          state.salesFilter.deadline = '';
          state.salesFilter.page = 1;
          const sSearch = document.getElementById('salesSearchInput');
          if (sSearch) sSearch.value = rec.requestId;
          if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
          setTimeout(() => {
            const row = document.querySelector(`tr[data-req-id="${reqId}"]`);
            if (row) {
              row.scrollIntoView({ behavior: 'smooth', block: 'center' });
              row.classList.add('table-row-highlight');
              setTimeout(() => row.classList.remove('table-row-highlight'), 3000);
            }
          }, 150);
          showToast(`Viewing ${rec.requestId} in Sales Requests`, 'info');
        } else {
          window.SignDepotApp.openDirectiveForJo(rec.joNumber);
        }
      }
    },

    openDirectiveForRequest: (reqId) => {
      const rec = state.requests.find(r => r.id === reqId);
      if (rec && rec.joNumber) {
        const dropdown = document.getElementById('deadlineAlertDropdown');
        if (dropdown) dropdown.classList.remove('show');
        window.SignDepotApp.openDirectiveForJo(rec.joNumber);
      }
    },

    updateDeadlineAlertCenter: () => updateDeadlineAlertCenter(),
    openCustomDropdown: (btn, ev) => openCustomDropdown(btn, ev),
    closeCustomDropdown: () => closeCustomDropdown(),
    upgradeAllFormSelects: () => upgradeAllFormSelects(),
    syncAllFormDropdowns: () => syncAllFormDropdowns(),

    addNewSalesRequestRow: () => addNewSalesRequestRow(),
    saveDraftSalesRequest: () => saveDraftSalesRequest(),
    cancelDraftSalesRequest: () => cancelDraftSalesRequest(),
    handleDraftKey: (e) => handleDraftKey(e),

    // Direct Inline Editing Handlers
    handleInlineTextBlur: (el) => {
      const reqId = el.getAttribute('data-req-id');
      const field = el.getAttribute('data-field');
      const text = el.innerText;
      updateRequestField(reqId, field, text, el);
    },
    handleInlineTextKey: (e, el) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      } else if (e.key === 'Tab') {
        const row = el.closest('tr');
        if (row) {
          const cells = Array.from(row.querySelectorAll('.editable-cell, .custom-select-btn:not(.is-readonly), .inline-date-input:not([disabled])'));
          const idx = cells.indexOf(el);
          if (idx !== -1) {
            const next = e.shiftKey ? cells[idx - 1] : cells[idx + 1];
            if (next) {
              e.preventDefault();
              el.blur();
              next.focus();
            }
          }
        }
      }
    },
    handleInlineSelectChange: (el) => {
      const reqId = el.getAttribute('data-req-id');
      const field = el.getAttribute('data-field');
      updateRequestField(reqId, field, el.value, el);
      showToast(`Updated ${field} to ${el.value}.`);
    },
    handleInlineDateChange: (el) => {
      const reqId = el.getAttribute('data-req-id');
      const field = el.getAttribute('data-field');
      updateRequestField(reqId, field, el.value, el);
      showToast(`Deadline updated to ${formatDate(el.value)}.`);
    },
    handleInlineNumberChange: (el) => {
      const reqId = el.getAttribute('data-req-id');
      const field = el.getAttribute('data-field');
      updateRequestField(reqId, field, el.value, el);
    },
    toggleTaskCompletion: (id) => {
      const rec = state.requests.find(r => r.id === id);
      if (rec) {
        if (rec.projectStatus === 'Completed') {
          rec.projectStatus = 'On-going';
          rec.designStatus = 'In Progress';
          rec.completionDate = null;
          showToast(`Task ${rec.requestId} marked in progress.`);
        } else {
          rec.projectStatus = 'Completed';
          rec.designStatus = 'Submitted';
          rec.completionDate = '2026-10-23';
          showToast(`Task ${rec.requestId} marked as Completed!`);
        }
        saveStateToStorage();
        if (typeof renderDashboard === 'function') {
          renderDashboard();
        } else if (window.SignDepotApp && typeof window.SignDepotApp.renderDashboard === 'function') {
          window.SignDepotApp.renderDashboard();
        }
      }
    },

    openDirectiveForJo: (jo, reqId, id) => {
      const identifier = (reqId && String(reqId).trim()) ? String(reqId).trim() :
                         ((jo && String(jo).trim()) ? String(jo).trim() :
                         ((id !== undefined && id !== null && String(id).trim()) ? String(id).trim() : ''));
      state.currentDirectiveJo = identifier;
      try { sessionStorage.setItem('SIGN_DEPOT_CURRENT_DIRECTIVE', identifier); } catch (e) {}
      saveStateToStorage();
      if (document.getElementById('view-directives-details')) {
        switchView('view-directives-details');
        if (window.SignDepotApp && window.SignDepotApp.renderDirectivePreview) window.SignDepotApp.renderDirectivePreview(identifier);
      } else {
        window.location.href = getPageUrl('directives-details.html') + '?id=' + encodeURIComponent(identifier);
      }
    },
    openPrintRequest: (identifier) => {
      if (!identifier) return;
      window.location.href = getPageUrl('print-request.php') + '?id=' + encodeURIComponent(identifier);
    },
    selectAutocompleteJo: (joOrReq) => {
      const box = document.getElementById('directiveAutocompleteBox');
      if (box) box.classList.remove('show');
      if (window.SignDepotApp && window.SignDepotApp.renderDirectivePreview) window.SignDepotApp.renderDirectivePreview(joOrReq);
      showToast(`Loaded directive for ${joOrReq}.`);
    },

    setSalesPage: (p) => {
      state.salesFilter.page = p;
      if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
    },
    setSalesApprovalTab: (tab) => {
      state.salesFilter.approvalTab = tab || '';
      state.salesFilter.page = 1;
      if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
    },
    setSalesPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.salesFilter.perPage = val;
        state.salesFilter.page = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
      }
    },

    setTrackerPage: (p) => {
      state.trackerFilter.page = p;
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
    },
    setTrackerPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.trackerFilter.perPage = val;
        state.trackerFilter.page = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      }
    },

    setPendingSalesPage: (p) => {
      state.pendingSalesPage = p;
      if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();
    },
    setPendingSalesPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.pendingSalesPerPage = val;
        state.pendingSalesPage = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();
      }
    },

    setPendingArtistPage: (p) => {
      state.pendingArtistPage = p;
      if (window.SignDepotApp && window.SignDepotApp.renderPendingArtistQueue) window.SignDepotApp.renderPendingArtistQueue();
    },
    setPendingArtistPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.pendingArtistPerPage = val;
        state.pendingArtistPage = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderPendingArtistQueue) window.SignDepotApp.renderPendingArtistQueue();
      }
    },

    setWorkloadPage: (p) => {
      state.workloadPage = p;
      renderWorkloadDetailsTable();
    },
    setWorkloadPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.workloadPerPage = val;
        state.workloadPage = 1;
        setStoredRowsPerPage(val);
        renderWorkloadDetailsTable();
      }
    },

    setDashboardPage: (p) => {
      state.dashboardPage = p;
      if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
    },
    setDashboardPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.dashboardPerPage = val;
        state.dashboardPage = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
      }
    },

    setMonthlyOutputTimeframe: (tf) => {
      if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport(tf);
    },
    renderMonthlyOutputReport: (tf) => {
      if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport(tf);
    },
    setMonthlyOutputFilter: (filterObj) => {
      initOutputFilterState();
      if (filterObj && typeof filterObj === 'object') {
        Object.assign(state.outputFilter, filterObj);
      }
      if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport();
    },
    setMonthlyOutputPage: (p) => {
      state.monthlyOutputPage = p;
      if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport();
    },
    setMonthlyOutputPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.monthlyOutputPerPage = val;
        state.monthlyOutputPage = 1;
        setStoredRowsPerPage(val);
        if (window.SignDepotApp && window.SignDepotApp.renderMonthlyOutputReport) window.SignDepotApp.renderMonthlyOutputReport();
      }
    },
    duplicateSalesRequest: (id) => {
      const rec = state.requests.find(r => r.id === id);
      if (!rec) return;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const cloned = JSON.parse(JSON.stringify(rec));
      cloned.id = `req-${Date.now()}`;
      cloned.requestId = `LR-26-${randomNum}`;
      cloned.joNumber = `P2607${randomNum}`;
      cloned.projectName = `${rec.projectName} (Copy)`;
      cloned.projectStatus = 'Pending';
      cloned.designStatus = 'Not Started';
      cloned.completionDate = null;

      state.requests.unshift(cloned);
      saveStateToStorage();
      renderCurrentView(state.activeView);
      showToast(`Cloned into ${cloned.requestId}`);
    },

    setTrackerPage: (p) => {
      state.trackerFilter.page = p;
      if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
    },
    resetTrackerFilters: () => {
      resetCreativesTrackerFilters();
    },

    selectWorkloadArtist: (artist) => {
      state.workloadFilter.selectedArtist = (state.workloadFilter.selectedArtist === artist) ? '' : artist;
      renderWorkloadDetailsTable();
    },

    quickSalesApprove: (id) => {
      const rec = state.requests.find(r => r.id === id);
      if (rec) {
        rec.clientApproval = 'Approved';
        rec.projectStatus = 'Approved';
        saveStateToStorage();
        if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();
        showToast(`Project ${rec.requestId} approved.`);
      }
    },

    previewAttachment: (id) => {
      const att = state.attachments.find(a => a.id === id);
      if (!att) return;
      document.getElementById('attachmentModalTitle').textContent = att.name;
      const resolvedUrl = resolveAttachmentUrl(att.url);
      document.getElementById('attachmentModalImg').src = resolvedUrl;
      document.getElementById('attachmentPreviewModal').classList.add('show');
    },
    deleteAttachment: (id) => {
      state.attachments = state.attachments.filter(a => a.id !== id);
      saveStateToStorage();
      renderAttachmentsList();
      showToast('Attachment deleted.');
    },

    removeArtist: (artist) => {
      if (state.artists.length <= 1) {
        showToast('Must have at least one artist.', 'error');
        return;
      }
      state.artists = state.artists.filter(a => a !== artist && a.toLowerCase() !== artist.toLowerCase());
      saveStateToStorage();
      renderSettings();
      populateSalesFiltersDropdowns();
      populateTrackerFiltersDropdowns();
      showToast(`Removed artist ${artist}.`);

      if (window.PMS_API_URL) {
        fetch(window.PMS_API_URL + '?action=delete_artist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: artist })
        })
        .then(res => res.json())
        .then(res => {
          if (res && res.success && res.data) {
            state.artists = res.data;
            saveStateToStorage();
            populateSalesFiltersDropdowns();
            populateTrackerFiltersDropdowns();
          }
        })
        .catch(e => console.warn('delete_artist API error:', e));
      }
    },
    removeSales: (rep) => {
      if (state.salesReps.length <= 1) {
        showToast('Must have at least one sales rep.', 'error');
        return;
      }
      state.salesReps = state.salesReps.filter(s => s !== rep && s.toLowerCase() !== rep.toLowerCase());
      saveStateToStorage();
      renderSettings();
      populateSalesFiltersDropdowns();
      showToast(`Removed sales rep ${rep}.`);

      if (window.PMS_API_URL) {
        fetch(window.PMS_API_URL + '?action=delete_sales_rep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: rep })
        })
        .then(res => res.json())
        .then(res => {
          if (res && res.success && res.data) {
            state.salesReps = res.data;
            saveStateToStorage();
            populateSalesFiltersDropdowns();
          }
        })
        .catch(e => console.warn('delete_sales_rep API error:', e));
      }
    }
  };

  // ==========================================================================
  // EVENT LISTENERS INITIALIZATION
  // ==========================================================================

  function initEventListeners() {
    // Sidebar Desktop Collapse Toggle & Mobile Offcanvas Drawer
    function ensureMobileBackdrop() {
      let backdrop = document.querySelector('.sidebar-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
      }
      return backdrop;
    }

    function closeMobileSidebar() {
      const appSidebar = document.getElementById('appSidebar');
      const backdrop = document.querySelector('.sidebar-backdrop');
      if (appSidebar) appSidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }

    function openMobileSidebar() {
      const appSidebar = document.getElementById('appSidebar');
      const backdrop = ensureMobileBackdrop();
      if (appSidebar) appSidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('sidebar-open');
    }

    function toggleMobileSidebar() {
      if (typeof window.toggleMobileSidebar === 'function' && window.toggleMobileSidebar !== toggleMobileSidebar) {
        window.toggleMobileSidebar();
        return;
      }
      const appSidebar = document.getElementById('appSidebar');
      if (appSidebar && appSidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    }

    function toggleDesktopSidebar() {
      if (typeof window.toggleDesktopSidebar === 'function' && window.toggleDesktopSidebar !== toggleDesktopSidebar) {
        window.toggleDesktopSidebar();
        return;
      }
      const appSidebar = document.getElementById('appSidebar');
      if (!appSidebar) return;
      const isCollapsed = appSidebar.classList.contains('collapsed');
      appSidebar.classList.toggle('collapsed', !isCollapsed);
      const activeTip = document.getElementById('sdGlobalTooltip');
      if (activeTip) activeTip.classList.remove('show');
      try {
        localStorage.setItem('SIGN_DEPOT_SIDEBAR_COLLAPSED', !isCollapsed ? '1' : '0');
      } catch (err) {}
    }

    // Delegated click handler for 100% reliable clicks on buttons and child SVGs
    document.addEventListener('click', (e) => {
      // If modular components.js navigation is already active, prevent duplicate handling
      if (window.SignDepotNav) return;

      const mobileBtn = e.target.closest('#mobileMenuBtn, .mobile-menu-btn');
      if (mobileBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toggleMobileSidebar();
        return;
      }

      const closeBtn = e.target.closest('#sidebarCloseBtn, .sidebar-close-btn');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeMobileSidebar();
        return;
      }

      const collapseBtn = e.target.closest('#sidebarCollapseBtn, .sidebar-collapse-btn');
      if (collapseBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (window.innerWidth <= 992) {
          closeMobileSidebar();
        } else {
          toggleDesktopSidebar();
        }
        return;
      }

      if (e.target.closest('.sidebar-backdrop')) {
        closeMobileSidebar();
        return;
      }

      if (e.target.closest('.sidebar-nav .nav-item') && window.innerWidth <= 992) {
        closeMobileSidebar();
      }
    });

    // Restore desktop collapsed preference
    try {
      if (window.innerWidth > 992 && localStorage.getItem('SIGN_DEPOT_SIDEBAR_COLLAPSED') === '1') {
        const appSidebar = document.getElementById('appSidebar');
        if (appSidebar) appSidebar.classList.add('collapsed');
      }
    } catch (err) {}

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileSidebar();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        closeMobileSidebar();
      } else {
        const appSidebar = document.getElementById('appSidebar');
        if (appSidebar) appSidebar.classList.remove('collapsed');
      }
    });

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          closeMobileSidebar();
        }
        const href = item.getAttribute('href');
        const viewId = item.getAttribute('data-view');

        if (href && href !== '#' && !href.startsWith('javascript:')) {
          const currentFile = (window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html').toLowerCase();
          const targetFile = (href.replace(/\\/g, '/').split('?')[0].split('/').pop() || 'index.html').toLowerCase();
          if (targetFile !== currentFile) {
            // Allow native browser navigation across distinct HTML pages
            return;
          }
        }

        e.preventDefault();
        if (viewId) switchView(viewId);
      });
    });

    const brandHomeLink = document.getElementById('brandHomeLink');
    if (brandHomeLink && !brandHomeLink.getAttribute('href')?.includes('signdepot.ph')) {
      brandHomeLink.addEventListener('click', (e) => {
        if (document.getElementById('view-dashboard')) {
          e.preventDefault();
          switchView('view-dashboard');
          return;
        }
        const currentFile = (window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html').toLowerCase();
        if (currentFile !== 'index.html') {
          return;
        }
        e.preventDefault();
        switchView('view-dashboard');
      });
    }

    const handleNewRequestTrigger = (e) => {
      if (e) e.preventDefault();
      if (document.getElementById('salesModal')) {
        if (window.SignDepotApp && typeof window.SignDepotApp.openNewSalesRequestModal === 'function') {
          window.SignDepotApp.openNewSalesRequestModal();
        } else if (typeof openNewSalesRequestModal === 'function') {
          openNewSalesRequestModal();
        } else if (typeof window.openNewSalesRequestModal === 'function') {
          window.openNewSalesRequestModal();
        }
      } else {
        const pagesPrefix = window.location.pathname.includes('/pages/') ? './' : './pages/';
        window.location.href = pagesPrefix + 'sales-requests.php?action=add_new';
      }
    };

    const btnNewReqDash = document.getElementById('btnDashboardNewRequest');
    if (btnNewReqDash) {
      btnNewReqDash.addEventListener('click', handleNewRequestTrigger);
    }

    const btnPanzeAdd = document.getElementById('btnPanzeAddTask');
    if (btnPanzeAdd) {
      btnPanzeAdd.addEventListener('click', handleNewRequestTrigger);
    }

    const btnSalesNewReq = document.getElementById('btnSalesNewRequest');
    if (btnSalesNewReq) {
      btnSalesNewReq.addEventListener('click', handleNewRequestTrigger);
    }

    // Delegated click handler for save (✓) and cancel (✕) buttons on the draft row
    document.addEventListener('click', (e) => {
      const saveBtn = e.target.closest && e.target.closest('.btn-save-draft');
      if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();
        saveDraftSalesRequest();
        return;
      }
      const cancelBtn = e.target.closest && e.target.closest('.btn-cancel-draft');
      if (cancelBtn) {
        e.preventDefault();
        e.stopPropagation();
        cancelDraftSalesRequest();
        return;
      }
    });

    // Auto-trigger new request modal if navigated from external page with ?action=add_new
    if (window.location.search.includes('action=add_new')) {
      setTimeout(() => {
        openNewSalesRequestModal();
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 300);
    }

    // Automatic separator dash formatting on Request ID input
    const reqIdInput = document.getElementById('salesFormReqId');
    if (reqIdInput) {
      reqIdInput.addEventListener('input', (e) => {
        const raw = e.target.value;
        const formatted = formatRequestIdInput(raw);
        if (formatted && formatted !== raw) {
          const oldLen = raw.length;
          e.target.value = formatted;
          if (formatted.length > oldLen) {
            e.target.setSelectionRange(formatted.length, formatted.length);
          }
        }
      });
      reqIdInput.addEventListener('blur', (e) => {
        const formatted = formatRequestIdInput(e.target.value);
        if (formatted) e.target.value = formatted;
      });
    }

    const salesSearch = document.getElementById('salesSearchInput');
    if (salesSearch) {
      // Purge any errant autofill before binding
      if (salesSearch.value && (salesSearch.value.toLowerCase().startsWith('sup_') || salesSearch.value.toLowerCase().includes('angel') || salesSearch.value.toLowerCase() === 'superadmin')) {
        salesSearch.value = '';
        state.salesFilter.search = '';
      }

      salesSearch.addEventListener('input', () => {
        state.salesFilter.search = salesSearch.value.trim();
        state.salesFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
      });
    }

    ['salesFilterPriority', 'salesFilterApproval', 'salesFilterFileSent', 'salesFilterSalesRep', 'salesFilterLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'salesFilterPriority') state.salesFilter.priority = el.value;
          if (id === 'salesFilterApproval') {
            state.salesFilter.approval = el.value;
            state.salesFilter.approvalTab = el.value;
          }
          if (id === 'salesFilterFileSent') state.salesFilter.fileSent = el.value;
          if (id === 'salesFilterSalesRep') state.salesFilter.salesRep = el.value;
          if (id === 'salesFilterLocation') state.salesFilter.location = el.value;
          state.salesFilter.page = 1;
          if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
        });
      }
    });

    // Client Approval Status Tabs listener
    document.querySelectorAll('.sales-approval-tab[data-tab-approval]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabVal = btn.getAttribute('data-tab-approval') || '';
        state.salesFilter.approvalTab = tabVal;
        state.salesFilter.approval = tabVal;
        const selApproval = document.getElementById('salesFilterApproval');
        if (selApproval) {
          selApproval.value = tabVal;
          syncFilterSelectUI(selApproval);
        }
        state.salesFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
      });
    });

    const btnResetSales = document.getElementById('btnResetSalesFilters');
    if (btnResetSales) {
      btnResetSales.addEventListener('click', (e) => {
        e.preventDefault();
        resetSalesRequestsFilters();
      });
    }

    document.querySelectorAll('#view-sales-requests .data-table th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (state.salesFilter.sortField === field) {
          state.salesFilter.sortDir = state.salesFilter.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.salesFilter.sortField = field;
          state.salesFilter.sortDir = 'asc';
        }
        if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
      });
    });

    const btnTrackerNew = document.getElementById('btnTrackerNewTask');
    if (btnTrackerNew) {
      btnTrackerNew.addEventListener('click', () => {
        const myArtist = getLoggedInArtist();
        const candidateList = myArtist ? state.requests.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase()) : state.requests;
        const first = candidateList[0] || state.requests[0];
        if (!first) return;
        document.getElementById('trackerFormId').value = first.id;
        document.getElementById('trackerFormReqId').value = first.requestId;
        document.getElementById('trackerFormProject').value = first.projectName;
        if (myArtist) {
          const mArtist = document.getElementById('trackerFormArtist');
          if (mArtist) mArtist.value = myArtist;
        }
        document.getElementById('trackerModalTitle').textContent = `Add Creative Task — ${first.requestId}`;
        document.getElementById('trackerModal').classList.add('show');
      });
    }

    const trackerSearch = document.getElementById('trackerSearchInput');
    if (trackerSearch) {
      trackerSearch.addEventListener('input', () => {
        state.trackerFilter.search = trackerSearch.value.trim();
        state.trackerFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      });
    }

    ['trackerFilterProjectStatus', 'trackerFilterDesignStatus', 'trackerFilterArtist', 'trackerFilterOverdue'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'trackerFilterProjectStatus') state.trackerFilter.projectStatus = el.value;
          if (id === 'trackerFilterDesignStatus') state.trackerFilter.designStatus = el.value;
          if (id === 'trackerFilterArtist') state.trackerFilter.artist = el.value;
          if (id === 'trackerFilterOverdue') state.trackerFilter.overdue = el.value;
          state.trackerFilter.page = 1;
          if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
        });
      }
    });

    // Date filter listeners
    const trackerDatePreset = document.getElementById('trackerFilterDatePreset');
    const trackerDateCustom = document.getElementById('trackerFilterDateCustom');
    const trackerDateColumn = document.getElementById('trackerFilterDateColumn');

    if (trackerDatePreset) {
      trackerDatePreset.addEventListener('change', () => {
        state.trackerFilter.datePreset = trackerDatePreset.value;
        if (trackerDatePreset.value === 'custom') {
          if (trackerDateCustom) {
            trackerDateCustom.style.display = 'inline-block';
            trackerDateCustom.focus();
          }
        } else {
          if (trackerDateCustom) {
            trackerDateCustom.style.display = 'none';
          }
        }
        state.trackerFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      });
    }

    if (trackerDateCustom) {
      trackerDateCustom.addEventListener('change', () => {
        state.trackerFilter.dateCustom = trackerDateCustom.value;
        state.trackerFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      });
    }

    if (trackerDateColumn) {
      trackerDateColumn.addEventListener('change', () => {
        state.trackerFilter.dateColumn = trackerDateColumn.value;
        state.trackerFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      });
    }

    // Sort Dropdown listener
    const trackerSortEl = document.getElementById('trackerSortDropdown');
    if (trackerSortEl) {
      trackerSortEl.addEventListener('change', () => {
        const parts = trackerSortEl.value.split('_');
        if (parts.length === 2) {
          state.trackerFilter.sortField = parts[0];
          state.trackerFilter.sortDir = parts[1];
          state.trackerFilter.page = 1;
          if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
        }
      });
    }

    // Actual table header click-to-sort listeners for Creatives Tracker!
    document.querySelectorAll('#view-creatives-tracker .data-table th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (state.trackerFilter.sortField === field) {
          state.trackerFilter.sortDir = state.trackerFilter.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.trackerFilter.sortField = field;
          if (field === 'requestId' || field === 'orderDate' || field === 'dateUpdated') {
            state.trackerFilter.sortDir = 'desc';
          } else {
            state.trackerFilter.sortDir = 'asc';
          }
        }
        state.trackerFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderCreativesTracker) window.SignDepotApp.renderCreativesTracker();
      });
    });

    const btnResetTracker = document.getElementById('btnResetTrackerFilters');
    if (btnResetTracker) {
      btnResetTracker.addEventListener('click', (e) => {
        e.preventDefault();
        resetCreativesTrackerFilters();
      });
    }

    const btnExportTrackerCSV = document.getElementById('btnQuickExportTrackerCSV');
    if (btnExportTrackerCSV) {
      btnExportTrackerCSV.addEventListener('click', () => exportTrackerCsv());
    }

    const btnExportOutputCSV = document.getElementById('btnExportMonthlyReportCSV');
    if (btnExportOutputCSV) {
      btnExportOutputCSV.addEventListener('click', () => exportMonthlyReportCsv());
    }

    const btnSampleUral = document.getElementById('btnDirectivesLoadSampleUral');
    if (btnSampleUral) {
      btnSampleUral.addEventListener('click', () => {
        if (window.SignDepotApp && window.SignDepotApp.renderDirectivePreview) window.SignDepotApp.renderDirectivePreview('P261001348');
        showToast('Sample directive for URAL loaded.');
      });
    }

    const availFilter = document.getElementById('workloadFilterAvailability');
    if (availFilter) {
      availFilter.addEventListener('change', () => {
        state.workloadFilter.availability = availFilter.value;
        if (window.SignDepotApp && window.SignDepotApp.renderArtistWorkload) window.SignDepotApp.renderArtistWorkload();
      });
    }

    const workloadTableSearch = document.getElementById('workloadTableSearch');
    if (workloadTableSearch) {
      workloadTableSearch.addEventListener('input', () => {
        state.workloadFilter.search = workloadTableSearch.value.trim();
        renderWorkloadDetailsTable();
      });
    }

    const pendingArtistSelect = document.getElementById('pendingArtistSelect');
    if (pendingArtistSelect) {
      pendingArtistSelect.addEventListener('change', () => {
        state.pendingArtistSelected = pendingArtistSelect.value;
        if (window.SignDepotApp && window.SignDepotApp.renderPendingArtistQueue) window.SignDepotApp.renderPendingArtistQueue();
      });
    }

    document.querySelectorAll('.sales-queue-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sales-queue-tab').forEach(t => {
          t.classList.remove('btn-primary');
          t.classList.add('btn-secondary');
        });
        tab.classList.remove('btn-secondary');
        tab.classList.add('btn-primary');

        state.pendingSalesFilter = tab.getAttribute('data-queue');
        if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();
      });
    });

    const pendingSalesSearch = document.getElementById('pendingSalesSearchInput');
    if (pendingSalesSearch) {
      pendingSalesSearch.addEventListener('input', () => {
        state.pendingSalesSearch = pendingSalesSearch.value.trim();
        state.pendingSalesPage = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderPendingSalesQueue) window.SignDepotApp.renderPendingSalesQueue();
      });
    }

    // Rows Per Page event listeners for all tables
    const bindRowsSelects = (ids, setter) => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', () => setter(el.value));
        }
      });
    };

    bindRowsSelects(['salesFilterPerPage', 'salesPaginationPerPage'], window.SignDepotApp.setSalesPerPage);
    bindRowsSelects(['trackerFilterPerPage', 'trackerPaginationPerPage'], window.SignDepotApp.setTrackerPerPage);
    bindRowsSelects(['pendingSalesFilterPerPage', 'pendingSalesPaginationPerPage'], window.SignDepotApp.setPendingSalesPerPage);
    bindRowsSelects(['pendingArtistFilterPerPage', 'pendingArtistPaginationPerPage'], window.SignDepotApp.setPendingArtistPerPage);
    bindRowsSelects(['workloadFilterPerPage', 'workloadPaginationPerPage'], window.SignDepotApp.setWorkloadPerPage);
    bindRowsSelects(['dashboardFilterPerPage', 'dashboardPaginationPerPage'], window.SignDepotApp.setDashboardPerPage);
    bindRowsSelects(['monthlyOutputFilterPerPage', 'monthlyOutputPaginationPerPage'], window.SignDepotApp.setMonthlyOutputPerPage);

    // Dashboard Search & Status Filter listeners
    const dashSearch = document.getElementById('dashboardSearchInput');
    if (dashSearch) {
      dashSearch.addEventListener('input', () => {
        state.dashboardSearch = dashSearch.value.trim();
        state.dashboardPage = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
      });
    }

    const dashStatus = document.getElementById('dashboardFilterStatus');
    if (dashStatus) {
      dashStatus.addEventListener('change', () => {
        state.dashboardStatus = dashStatus.value;
        if (state.dashboardStatus) state.dashboardKpiFilter = '';
        state.dashboardPage = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
      });
    }

    // Dashboard Deadline Filter listener
    const dashDeadline = document.getElementById('dashboardFilterDeadline');
    if (dashDeadline) {
      dashDeadline.addEventListener('change', () => {
        state.dashboardDeadline = dashDeadline.value;
        state.dashboardPage = 1;
        const cards = {
          overdue: document.getElementById('cardFilterOverdue'),
          today: document.getElementById('cardFilterToday'),
          soon: document.getElementById('cardFilterSoon')
        };
        Object.entries(cards).forEach(([k, c]) => {
          if (c) c.classList.toggle('active', k === state.dashboardDeadline);
        });
        if (window.SignDepotApp && window.SignDepotApp.renderDashboardRecentProjectsTable) window.SignDepotApp.renderDashboardRecentProjectsTable();
      });
    }

    // Sales Requests Deadline Filter listener
    const salesDeadline = document.getElementById('salesFilterDeadline');
    if (salesDeadline) {
      salesDeadline.addEventListener('change', () => {
        state.salesFilter.deadline = salesDeadline.value;
        state.salesFilter.page = 1;
        if (window.SignDepotApp && window.SignDepotApp.renderSalesRequests) window.SignDepotApp.renderSalesRequests();
      });
    }

    // Recent Activity Tabs & Timeline Options
    document.addEventListener('click', (e) => {
      const actBtn = e.target.closest('#activityFilterTabs [data-act-filter]');
      if (actBtn) {
        e.preventDefault();
        const filter = actBtn.getAttribute('data-act-filter');
        renderRecentActivityFeed(filter);
        return;
      }

      const optBtn = e.target.closest('#btnTimelineOptions');
      if (optBtn) {
        e.preventDefault();
        showToast('Timeline timeframe: Active Production Week (Oct 19–25, 2026)', 'info');
        return;
      }
    });

    // Topbar Deadline Alert Notification Drawer & Tab Switching
    document.addEventListener('click', (e) => {
      const bellBtn = e.target.closest('#deadlineAlertBtn, .deadline-alert-btn');
      const alertDropdown = document.getElementById('deadlineAlertDropdown');

      if (bellBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (alertDropdown) {
          alertDropdown.classList.toggle('show');
          const globalTip = document.getElementById('sdGlobalTooltip');
          if (globalTip) globalTip.classList.remove('show');
        }
        return;
      }

      const tabBtn = e.target.closest('.deadline-tab-btn');
      if (tabBtn && tabBtn.getAttribute('data-alert-tab')) {
        e.preventDefault();
        e.stopPropagation();
        const tab = tabBtn.getAttribute('data-alert-tab');
        window.SignDepotApp.setAlertTab(tab);
        return;
      }

      if (alertDropdown && alertDropdown.classList.contains('show') && !e.target.closest('#deadlineAlertContainer')) {
        alertDropdown.classList.remove('show');
      }
    });
  }

  function exportTrackerCsv() {
    const myArtist = getLoggedInArtist();
    const headers = ['Request ID', 'JO Number', 'Artist', 'Project Name', 'Design Deadline', 'Head Approval', 'Standard', 'Printing', 'Special', 'Project Status', 'Design Status', 'Revisions', 'Remarks', 'Date', 'Sales', 'Month'];
    const reqList = myArtist ? state.requests.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase()) : state.requests;
    const rows = reqList.map(r => [
      r.requestId,
      r.joNumber || '',
      r.artist,
      `"${(r.projectName || '').replace(/"/g, '""')}"`,
      r.designDeadline,
      r.headApproval,
      r.countStandard,
      r.countPrinting,
      r.countSpecial,
      r.projectStatus,
      r.designStatus,
      r.revisionCount,
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
      r.orderDate,
      r.salesRep,
      r.month
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCsv(csvContent, `Sign_Depot_Creatives_Tracker_${myArtist ? myArtist + '_' : ''}${Date.now()}.csv`);
    try {
      fetch((typeof apiBase !== 'undefined' ? apiBase : 'api.php') + '?action=log_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'EXPORT',
          module: 'Creatives Tracker',
          description: `Exported Creatives Tracker records to CSV (${reqList.length} rows)`
        })
      }).catch(() => {});
    } catch (e) {}
  }

  function exportMonthlyReportCsv() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const matrix = {};
    state.artists.forEach(a => matrix[a] = new Array(12).fill(0));

    state.requests.forEach(r => {
      if (r.projectStatus === 'Completed') {
        let mIdx = -1;
        if (r.completionDate) {
          const mNum = parseInt(r.completionDate.split('-')[1], 10);
          if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) mIdx = mNum - 1;
        } else if (r.month) {
          const matchMonth = months.findIndex(m => r.month.toLowerCase().startsWith(m.toLowerCase()));
          if (matchMonth !== -1) mIdx = matchMonth;
        }
        if (mIdx !== -1 && matrix[r.artist]) {
          const count = Math.max((r.countStandard || 0) + (r.countPrinting || 0) + (r.countSpecial || 0), 1);
          matrix[r.artist][mIdx] += count;
        }
      }
    });

    const headers = ['Artist', ...months, 'Annual Total'];
    const rows = state.artists.map(a => {
      const counts = matrix[a];
      const sum = counts.reduce((acc, v) => acc + v, 0);
      return [a, ...counts, sum];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCsv(csvContent, `Sign_Depot_Monthly_Production_2026_${Date.now()}.csv`);
    try {
      fetch((typeof apiBase !== 'undefined' ? apiBase : 'api.php') + '?action=log_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'EXPORT',
          module: 'Monthly Output',
          description: 'Exported Annual Production report to CSV'
        })
      }).catch(() => {});
    } catch (e) {}
  }

  function downloadCsv(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  }

  // [FULL-PLEDGE VECTOR STUDIO EDITOR] Extracted to assets/js/pages/directives.js

  function initApp() {
    if (window.SignDepotNav && typeof window.SignDepotNav.renderComponents === 'function') {
      window.SignDepotNav.renderComponents();
    }
    loadStateFromStorage();
    initEventListeners();
    if (typeof setupDirectiveControlsSync === "function") setupDirectiveControlsSync();
    else if (window.SignDepotApp && typeof window.SignDepotApp.setupDirectiveControlsSync === "function") window.SignDepotApp.setupDirectiveControlsSync();

    if (typeof setupDirectiveAutocomplete === "function") setupDirectiveAutocomplete();
    else if (window.SignDepotApp && typeof window.SignDepotApp.setupDirectiveAutocomplete === "function") window.SignDepotApp.setupDirectiveAutocomplete();

    if (typeof setupDirectiveActions === "function") setupDirectiveActions();
    else if (window.SignDepotApp && typeof window.SignDepotApp.setupDirectiveActions === "function") window.SignDepotApp.setupDirectiveActions();

    if (typeof setupDirectiveZoomControls === "function") setupDirectiveZoomControls();
    else if (window.SignDepotApp && typeof window.SignDepotApp.setupDirectiveZoomControls === "function") window.SignDepotApp.setupDirectiveZoomControls();
    setupGlobalSearch();
    setupModals();

    initCustomDropdownEngine();
    upgradeAllFilterSelects();
    upgradeAllFormSelects();
    initCustomTooltipEngine();

    const urlParams = new URLSearchParams(window.location.search);
    const joParam = urlParams.get('id') || urlParams.get('jo') || urlParams.get('req') || urlParams.get('requestId') || window.__INITIAL_DIRECTIVE_KEY || sessionStorage.getItem('SIGN_DEPOT_CURRENT_DIRECTIVE');
    if (joParam) {
      state.currentDirectiveJo = joParam;
    }

    const kpiParam = urlParams.get('kpi') || sessionStorage.getItem('SIGN_DEPOT_ACTIVE_KPI');
    if (kpiParam) {
      sessionStorage.removeItem('SIGN_DEPOT_ACTIVE_KPI');
      state.trackerKpiFilter = kpiParam;
      state.dashboardKpiFilter = kpiParam;
    }

    const currentView = detectCurrentPage();
    switchView(currentView);

    if (currentView === 'view-directives-details') {
      if (typeof renderDirectivePreview === 'function') {
        renderDirectivePreview(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || '');
      } else if (window.SignDepotApp && typeof window.SignDepotApp.renderDirectivePreview === 'function') {
        window.SignDepotApp.renderDirectivePreview(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || '');
      }
    }

    // Initialize Dedicated Vector Studio Editor if on directive-editor.php
    if (document.getElementById('studioPropertyInspector')) {
      if (typeof renderDirectivePreview === 'function') {
        renderDirectivePreview(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || '');
      } else if (window.SignDepotApp && typeof window.SignDepotApp.renderDirectivePreview === 'function') {
        window.SignDepotApp.renderDirectivePreview(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || '');
      }
      if (typeof initStudioVectorEditor === 'function') {
        setTimeout(initStudioVectorEditor, 50);
      } else if (window.SignDepotApp && typeof window.SignDepotApp.initVectorStudioEditor === 'function') {
        setTimeout(window.SignDepotApp.initVectorStudioEditor, 50);
      }
    }

    updateDeadlineAlertCenter();

    // Non-intrusive reminder alert on first login ONLY
    const hasShownReminder = sessionStorage.getItem('PMS_DEADLINE_REMINDER_SHOWN');
    const isFirstLogin = Boolean(window.PMS_JUST_LOGGED_IN) || (!hasShownReminder && !sessionStorage.getItem('PMS_SESSION_INITIALIZED'));
    sessionStorage.setItem('PMS_SESSION_INITIALIZED', 'true');

    if (!hasShownReminder && isFirstLogin) {
      sessionStorage.setItem('PMS_DEADLINE_REMINDER_SHOWN', 'true');
      setTimeout(() => {
        const activeAlerts = (state.requests || []).filter(r => r.projectStatus !== 'Completed').map(r => getDeadlineAlertStatus(r.designDeadline, r.projectStatus));
        const overdueCount = activeAlerts.filter(a => a.status === 'overdue').length;
        const todayCount = activeAlerts.filter(a => a.status === 'today').length;
        if (overdueCount > 0 || todayCount > 0) {
          let msg = 'Deadline Reminder: ';
          if (overdueCount > 0 && todayCount > 0) {
            msg += `${overdueCount} project${overdueCount > 1 ? 's' : ''} past due & ${todayCount} due today!`;
          } else if (overdueCount > 0) {
            msg += `${overdueCount} project${overdueCount > 1 ? 's' : ''} past due requiring immediate attention!`;
          } else {
            msg += `${todayCount} project${todayCount > 1 ? 's' : ''} due today!`;
          }
          showToast(msg, overdueCount > 0 ? 'error' : 'info');
        }
      }, 1200);
    }

    // Run active autofill scrubbing to prevent browsers from placing credentials into search bars
    purgeSearchAutofill();
    [20, 80, 200, 500, 1000, 2000].forEach(delay => setTimeout(purgeSearchAutofill, delay));
  }

  // Guardian: Purges any errant browser credential autofill (e.g. 'sup_angel') from all search bars
  function purgeSearchAutofill() {
    const knownCredentials = ['sup_angel', 'superadmin', 'admin', 'angelica'];
    const searchSelectors = [
      '#globalSearchInput',
      '#salesSearchInput',
      '#pendingSalesSearchInput',
      '#trackerSearchInput',
      '#workloadTableSearch',
      '#usersSearchInput',
      '#auditSearchInput',
      'input[type="search"]',
      'input.global-search-input',
      'input.filter-input'
    ];
    document.querySelectorAll(searchSelectors.join(',')).forEach(input => {
      if (!input || input.type === 'password') return;
      const val = (input.value || '').trim();
      const lower = val.toLowerCase();
      if (
        knownCredentials.includes(lower) ||
        lower.startsWith('sup_') ||
        lower.startsWith('artist_') ||
        lower.startsWith('sales_') ||
        lower.includes('@')
      ) {
        input.value = '';
        if (input.id === 'salesSearchInput' && state && state.salesFilter) {
          state.salesFilter.search = '';
          if (typeof renderSalesRequests === 'function') renderSalesRequests();
        } else if (input.id === 'pendingSalesSearchInput' && state) {
          state.pendingSalesSearch = '';
          if (typeof renderSalesRequests === 'function') renderSalesRequests();
        } else if (input.id === 'globalSearchInput') {
          const dd = document.getElementById('quickSearchResults');
          if (dd) dd.style.display = 'none';
        }
      }
    });
  }

  window.addEventListener('focus', purgeSearchAutofill);
  window.addEventListener('pageshow', purgeSearchAutofill);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();