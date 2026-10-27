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
    'Shella', 'Sol', 'Tim'
  ];

  const PROJECT_STATUSES = [
    'Completed', 'On-going'
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

  // Comprehensive Shared Mock Dataset (25+ real-world Sign Depot projects)
  // Live Spreadsheet Database Orders (LR-26-2102 to LR-26-1950 from 1Uwm-SjFgMgo62S8YY2IonJkmy9BfCmcIvZ7Txvp09Pg)
  const DEFAULT_REQUESTS = [
    {
        "id":  "lr-26-2102",
        "requestId":  "LR-26-2102",
        "joNumber":  "P261001356",
        "salesRep":  "DONA",
        "client":  "CDJJ DYNAMIC MERCHANDISING",
        "projectName":  "UNIVERS GB THOM BROWNE \u0026 ACNE STUDIOS WINDOW",
        "artist":  "Jules",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2101",
        "requestId":  "LR-26-2101",
        "joNumber":  "P261001337",
        "salesRep":  "DONA",
        "client":  "TRADEMASTERS VENTURES OPC",
        "projectName":  "TIEN MA\u0027S RE-ORDER",
        "artist":  "Jules",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2100",
        "requestId":  "LR-26-2100",
        "joNumber":  "P261001348",
        "salesRep":  "DONA",
        "client":  "DEcalpro Printing Services",
        "projectName":  "LACOST \u0026 SMH \u0026 MK",
        "artist":  "Glen",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2099",
        "requestId":  "LR-26-2099",
        "joNumber":  "SD261021-028",
        "salesRep":  "JEN",
        "client":  "ANYTIME FITNESS",
        "projectName":  "STICKERS",
        "artist":  "Glen",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "AF VISTAHUB BGC",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Fredinel Aguinaldo",
        "contactNumber":  "639054576672",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2098",
        "requestId":  "LR-26-2098",
        "joNumber":  "SD261021-028",
        "salesRep":  "JEN",
        "client":  "ANYTIME FITNESS",
        "projectName":  "SIGNAGE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "AF VISTAHUB BGC",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Fredinel Aguinaldo",
        "contactNumber":  "639054576672",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2097",
        "requestId":  "LR-26-2097",
        "joNumber":  "SD261007-021",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "WINSTON NAPKIN HOLDER \u0026 RESERVED SIGN",
        "artist":  "Tim",
        "designDeadline":  "",
        "releasingDate":  "",
        "fileSent":  "Pending",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2096",
        "requestId":  "LR-26-2096",
        "joNumber":  "SD261020-003",
        "salesRep":  "JANET",
        "client":  "SHELL ARTELIA",
        "projectName":  "CROCS LIGHTBOX",
        "artist":  "Tim",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SLEX NORTHBOUND BINAN LAGUNA",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MS. LOUISE",
        "contactNumber":  "9164547031",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2095",
        "requestId":  "LR-26-2095",
        "joNumber":  "SD261023-026",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL ICONIC PAGBILAO",
        "artist":  "Tim",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-29",
        "fileSent":  "FILE SENT",
        "completeAddress":  "PAGBILAO",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2094",
        "requestId":  "LR-26-2094",
        "joNumber":  "SD261023-025",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL ICONIC BATANGAS",
        "artist":  "Tim",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-29",
        "fileSent":  "FILE SENT",
        "completeAddress":  "BATANGAS",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2093",
        "requestId":  "LR-26-2093",
        "joNumber":  "SD261016-013",
        "salesRep":  "JANET",
        "client":  "REDBIN",
        "projectName":  "TENT CARD RESAMPLE",
        "artist":  "Glen",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "MAIN BUILDING S-1, EAST GATE BUSINESS CENTER, LRT ANTIPOLO STATION, MARCOS HIGHWAY, BARANGAY MAYAMOT, ANTIPOLO CITY",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. CIELO",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2092",
        "requestId":  "LR-26-2092",
        "joNumber":  "SD260921-001",
        "salesRep":  "JANET",
        "client":  "REDBIN",
        "projectName":  "TENT CARD SAMPLE",
        "artist":  "Glen",
        "designDeadline":  "2026-09-21",
        "releasingDate":  "2026-09-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "MAIN BUILDING S-1, EAST GATE BUSINESS CENTER, LRT ANTIPOLO STATION, MARCOS HIGHWAY, BARANGAY MAYAMOT, ANTIPOLO CITY",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. CIELO",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2091",
        "requestId":  "LR-26-2091",
        "joNumber":  "SD260917-021",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "SAMPLE SWATCHES AND PROOFING FOR DRESS UP",
        "artist":  "Tim",
        "designDeadline":  "2026-09-21",
        "releasingDate":  "2026-09-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor \u0026 Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2090",
        "requestId":  "LR-26-2090",
        "joNumber":  "SD260917-018",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "VIP PLATE FINAL SAMPLE (OPTION 2)",
        "artist":  "Tim",
        "designDeadline":  "2026-09-18",
        "releasingDate":  "2026-09-18",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2089",
        "requestId":  "LR-26-2089",
        "joNumber":  "SD260828-025",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "VIP PLATE SAMPLE FINAL REVISED",
        "artist":  "Tim",
        "designDeadline":  "2026-09-02",
        "releasingDate":  "2026-09-03",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2088",
        "requestId":  "LR-26-2088",
        "joNumber":  "SD260828-026",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL DRESS UP SWATCH",
        "artist":  "Tim",
        "designDeadline":  "2026-09-02",
        "releasingDate":  "2026-09-05",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor \u0026 Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2087",
        "requestId":  "LR-26-2087",
        "joNumber":  "SD260902-005",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL LED NEON",
        "artist":  "Tim",
        "designDeadline":  "2026-09-02",
        "releasingDate":  "2026-09-11",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2086",
        "requestId":  "LR-26-2086",
        "joNumber":  "SD260902-003",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "WINSTON LED NEON",
        "artist":  "Tim",
        "designDeadline":  "2026-09-02",
        "releasingDate":  "2026-09-11",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2085",
        "requestId":  "LR-26-2085",
        "joNumber":  "P261001214",
        "salesRep":  "DONA",
        "client":  "SD",
        "projectName":  "QUANTUM POKEMON STANDEE",
        "artist":  "Jules",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-27",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2084",
        "requestId":  "LR-26-2084",
        "joNumber":  "P261001303",
        "salesRep":  "DONA",
        "client":  "PAU ACILAC",
        "projectName":  "BELLE OUVRE 10.23",
        "artist":  "Glen",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2083",
        "requestId":  "LR-26-2083",
        "joNumber":  "P261001284",
        "salesRep":  "DONA",
        "client":  "Decalpro Printing Services",
        "projectName":  "SALE 1.8MM  L-STAND   10.23",
        "artist":  "Glen",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2082",
        "requestId":  "LR-26-2082",
        "joNumber":  "SD261020-022",
        "salesRep":  "FLORA",
        "client":  "MODULART",
        "projectName":  "KAPOOR LIGHTBOX",
        "artist":  "Raven",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-25",
        "fileSent":  "FILE SENT",
        "completeAddress":  "VALENZUELA CITY",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "JANSEN CHUA",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2081",
        "requestId":  "LR-26-2081",
        "joNumber":  "P261001275",
        "salesRep":  "DONA",
        "client":  "CDJJ DYNAMIC MERCHANDISING",
        "projectName":  "MAISON DTF",
        "artist":  "Jules",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2080",
        "requestId":  "LR-26-2080",
        "joNumber":  "SD261009-018",
        "salesRep":  "JOYCE",
        "client":  "STUDIO LYV",
        "projectName":  "ALTITUDE PARK TRIANGLE PARK - BGC",
        "artist":  "Raven",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "TRIANGLE PARK BGC",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Joseph Doble",
        "contactNumber":  "(0995) 572 6988",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2079",
        "requestId":  "LR-26-2079",
        "joNumber":  "P261001224",
        "salesRep":  "DONA",
        "client":  "MAKING FINE BEVERAGES CORP.",
        "projectName":  "TIGER SUGAR BANDERITAS",
        "artist":  "Jules",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-23",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2078",
        "requestId":  "LR-26-2078",
        "joNumber":  "SD260821-001",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "SHELL BENCH \u0026 RAMP 6TH BATCH",
        "artist":  "Tim",
        "designDeadline":  "2026-08-24",
        "releasingDate":  "2026-09-01",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SOUTHSEA NAVOTAS",
        "location":  "Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR JACKSON",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2077",
        "requestId":  "LR-26-2077",
        "joNumber":  "SD260926-005",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "WINSTON ROULETTE",
        "artist":  "Bob",
        "designDeadline":  "2026-09-11",
        "releasingDate":  "2026-09-14",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2076",
        "requestId":  "LR-26-2076",
        "joNumber":  "TF",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "YUMAPANDA",
        "artist":  "Bob",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET TAYTAY",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2075",
        "requestId":  "LR-26-2075",
        "joNumber":  "SD2601023-004",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "ALEXAS DELIGHT WINGS",
        "artist":  "Bob",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET DASMARINAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2074",
        "requestId":  "LR-26-2074",
        "joNumber":  "SD261016-013",
        "salesRep":  "JANET",
        "client":  "REDBIN",
        "projectName":  "WINSTON LAMP",
        "artist":  "Tim",
        "designDeadline":  "2026-10-17",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "ANTIPOLO CITY",
        "location":  "Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. TALA",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2073",
        "requestId":  "LR-26-2073",
        "joNumber":  "SD261008-007",
        "salesRep":  "JANET",
        "client":  "REDBIN",
        "projectName":  "GOV. WARNING STANDEE / KV POSTERS 2 AREA CAINTA ANTIPOLO",
        "artist":  "Tim",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "ANTIPOLO CITY",
        "location":  "Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. TALA",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2072",
        "requestId":  "LR-26-2072",
        "joNumber":  "SD261012-021",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "MIGHTY STANDARD",
        "artist":  "Tim",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-19",
        "fileSent":  "FILE SENT",
        "completeAddress":  "DAVAO",
        "location":  "Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2071",
        "requestId":  "LR-26-2071",
        "joNumber":  "SD261007-017",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "PEST GUARD RESAMPLE",
        "artist":  "Edrian",
        "designDeadline":  "2026-10-13",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR JACKSON",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2070",
        "requestId":  "LR-26-2070",
        "joNumber":  "SD260923-009",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "PEST GUARD SAMPLE",
        "artist":  "Edrian",
        "designDeadline":  "2026-09-23",
        "releasingDate":  "2026-09-24",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR JACKSON",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2069",
        "requestId":  "LR-26-2069",
        "joNumber":  "SD261010-021",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "WINSTON BILI NA LIGHTED SIGNAGE",
        "artist":  "Edrian",
        "designDeadline":  "Ocotber 13, 2026",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2068",
        "requestId":  "LR-26-2068",
        "joNumber":  "SD260921-004",
        "salesRep":  "JANET",
        "client":  "FINCOM",
        "projectName":  "MALLPLUS  SIGNAGE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "ROBINSONS MAGNOLIA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MS. GEN BERMUDO",
        "contactNumber":  "639173239460",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2067",
        "requestId":  "LR-26-2067",
        "joNumber":  "SD261002-007",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL NAPKIN HOLDER (ONLY) REVISED",
        "artist":  "Tim",
        "designDeadline":  "2026-10-07",
        "releasingDate":  "2026-10-07",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2066",
        "requestId":  "LR-26-2066",
        "joNumber":  "SD261006-018",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "WINSTON LED NEON REORDER (GMA ALLOCATION)",
        "artist":  "Tim",
        "designDeadline":  "2026-10-06",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor \u0026 Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2065",
        "requestId":  "LR-26-2065",
        "joNumber":  "SD261002-007",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL NAPKIN HOLDER",
        "artist":  "Tim",
        "designDeadline":  "2026-10-02",
        "releasingDate":  "2026-10-03",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2064",
        "requestId":  "LR-26-2064",
        "joNumber":  "SD261001-012",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "CAMEL ICONIC STO. TOMAS",
        "artist":  "Tim",
        "designDeadline":  "2026-10-01",
        "releasingDate":  "2026-10-02",
        "fileSent":  "FILE SENT",
        "completeAddress":  "BATANGAS, LAGUNA, QUEZON",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2063",
        "requestId":  "LR-26-2063",
        "joNumber":  "PROOFING",
        "salesRep":  "JASTINE",
        "client":  "The Crave Lab Corp.",
        "projectName":  "SOMETHAI BOARD UP",
        "artist":  "Glen",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "UNit 195-A Tomas Morato Corner Scout Fuentebella Laging Handa 1103 QUEZON CITY",
        "location":  "Outdoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2062",
        "requestId":  "LR-26-2062",
        "joNumber":  "N/A",
        "salesRep":  "JANET",
        "client":  "TOPVALUE",
        "projectName":  "PROOFING WINSTON, MIGHTY, CAMEL",
        "artist":  "Tim",
        "designDeadline":  "2022-10-21",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "18 SHIBUYAN STA. MESA HEIGHTS. QC",
        "location":  "Indoor \u0026 Outdoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "SIR LAU",
        "contactNumber":  "9175956385",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2061",
        "requestId":  "LR-26-2061",
        "joNumber":  "SD261022-013",
        "salesRep":  "FLORA",
        "client":  "PARADIGMA",
        "projectName":  "L-STAND MENU",
        "artist":  "Glen",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "BINONDO",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "ANA FORTIN",
        "contactNumber":  "639771566932",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2060",
        "requestId":  "LR-26-2060",
        "joNumber":  "SD2601021-023",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-21",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2059",
        "requestId":  "LR-26-2059",
        "joNumber":  "SD2601020-017",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT GOLDEN BAY",
        "artist":  "Bob",
        "designDeadline":  "2026-10-17",
        "releasingDate":  "2026-10-25",
        "fileSent":  "FILE SENT",
        "completeAddress":  "GOLDEN BAY",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2058",
        "requestId":  "LR-26-2058",
        "joNumber":  "SD2601014-029",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "QUICKLY",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET TAYTAY",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2057",
        "requestId":  "LR-26-2057",
        "joNumber":  "SD2601020-029",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "CAPTAIN CALAMARES",
        "artist":  "Bob",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-28",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET BATANGAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2056",
        "requestId":  "LR-26-2056",
        "joNumber":  "SD2601020-028",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "BUKO ZONE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET DASMARINAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2055",
        "requestId":  "LR-26-2055",
        "joNumber":  "SD2601020-024",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "PAOTSIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-24",
        "releasingDate":  "2026-10-28",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET SORSOGON",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2054",
        "requestId":  "LR-26-2054",
        "joNumber":  "SD2601019-009",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "MANG PASTIL",
        "artist":  "Bob",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET BICUTAN",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2053",
        "requestId":  "LR-26-2053",
        "joNumber":  "SD2601019-008",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "MASTER SIOMAI",
        "artist":  "Bob",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET LEMERY BATANGAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2052",
        "requestId":  "LR-26-2052",
        "joNumber":  "SD261022-011",
        "salesRep":  "FLORA",
        "client":  "MG PARIAL CONTRUCTION",
        "projectName":  "FORTHEO SIGNAGE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-23",
        "releasingDate":  "2026-10-26",
        "fileSent":  "FILE SENT",
        "completeAddress":  "QUEZON CITY",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "MARY GRACE PARIAL",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2051",
        "requestId":  "LR-26-2051",
        "joNumber":  "SD2601015-020",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-18",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2050",
        "requestId":  "LR-26-2050",
        "joNumber":  "SD2601014-013",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC AM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-18",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2049",
        "requestId":  "LR-26-2049",
        "joNumber":  "SD2601014-027",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET VALENZUELA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA;AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2048",
        "requestId":  "LR-26-2048",
        "joNumber":  "SD2601014-024",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET NORTH EDSA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2047",
        "requestId":  "LR-26-2047",
        "joNumber":  "SD2601014-026",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MARILAO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2046",
        "requestId":  "LR-26-2046",
        "joNumber":  "SD2601014-025",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET NOVALICHES",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2045",
        "requestId":  "LR-26-2045",
        "joNumber":  "SD2601014-022",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MOA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2044",
        "requestId":  "LR-26-2044",
        "joNumber":  "SD2601014-008",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2043",
        "requestId":  "LR-26-2043",
        "joNumber":  "SD2601016-001",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "FAMOUS BELGIAN WAFFLE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET NOVALICHES",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2042",
        "requestId":  "LR-26-2042",
        "joNumber":  "SD2601008-019",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "POTATO GIANT",
        "artist":  "Bob",
        "designDeadline":  "2026-10-08",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET SUCAT",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2041",
        "requestId":  "LR-26-2041",
        "joNumber":  "SD2601014-023",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET FAIRVIEW",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2040",
        "requestId":  "LR-26-2040",
        "joNumber":  "SD2601014-028",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "RBX",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MANDALUYONG",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2039",
        "requestId":  "LR-26-2039",
        "joNumber":  "SD2601009-011",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "PAOTSIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MANDALUYONG",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2038",
        "requestId":  "LR-26-2038",
        "joNumber":  "SD2601009-010",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "PAOTSIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET FAIRVIEW",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2037",
        "requestId":  "LR-26-2037",
        "joNumber":  "SD2601009-009",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "PAOTSIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET CUBAO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SAN",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2036",
        "requestId":  "LR-26-2036",
        "joNumber":  "SD2601015-004",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "ABUBUTS",
        "artist":  "Bob",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-11-10",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET BACOOR",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2035",
        "requestId":  "LR-26-2035",
        "joNumber":  "SD2601015-003",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "CAPTAIN CALAMARES",
        "artist":  "Bob",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET ROSARIO CAVITE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2034",
        "requestId":  "LR-26-2034",
        "joNumber":  "SD2601015-002",
        "salesRep":  "MARIEL",
        "client":  "SM SUPERMARKET",
        "projectName":  "WAFFLE TIME",
        "artist":  "Bob",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-11-10",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SUPERMARKET SAN MATEO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM JOCEL",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2033",
        "requestId":  "LR-26-2033",
        "joNumber":  "SD2601014-040",
        "salesRep":  "MARIEL",
        "client":  "SM SAVEMORE",
        "projectName":  "KURIMI",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SAVEMORE MUZON 2",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2032",
        "requestId":  "LR-26-2032",
        "joNumber":  "SD2601009-015",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "KETTLE CORN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MOA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2031",
        "requestId":  "LR-26-2031",
        "joNumber":  "SD2601009-014",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "SAM\u0027S",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MOA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2030",
        "requestId":  "LR-26-2030",
        "joNumber":  "SD2601009-013",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "SONYDA",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET SUCAT",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2029",
        "requestId":  "LR-26-2029",
        "joNumber":  "SD2601009-012",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "PAOTSIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-09",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET VALENZUELA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2028",
        "requestId":  "LR-26-2028",
        "joNumber":  "SD2601014-004",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "SPUD BOMB POTATO",
        "artist":  "Bob",
        "designDeadline":  "2026-10-14",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET FAIRVIEW",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2027",
        "requestId":  "LR-26-2027",
        "joNumber":  "SD2601008-017",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "SPUD BOMB POTATO",
        "artist":  "Bob",
        "designDeadline":  "2026-10-08",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MARILAO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2026",
        "requestId":  "LR-26-2026",
        "joNumber":  "SD2601010-025",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-10",
        "releasingDate":  "2026-10-13",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2025",
        "requestId":  "LR-26-2025",
        "joNumber":  "SD2601008-018",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "MOMOYO",
        "artist":  "Bob",
        "designDeadline":  "2026-10-08",
        "releasingDate":  "2026-10-10",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET MARILAO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2024",
        "requestId":  "LR-26-2024",
        "joNumber":  "SD2601007-025",
        "salesRep":  "MARIEL",
        "client":  "MINI DEPATO",
        "projectName":  "MINISO - LAOAG FROSTED STICKER",
        "artist":  "Bob",
        "designDeadline":  "2026-10-07",
        "releasingDate":  "2026-10-08",
        "fileSent":  "FILE SENT",
        "completeAddress":  "MINISO LAOAG",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "SIR MARLO",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2023",
        "requestId":  "LR-26-2023",
        "joNumber":  "SD2601008-012",
        "salesRep":  "MARIEL",
        "client":  "SM SAVEMORE",
        "projectName":  "JAMAICAN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-08",
        "releasingDate":  "2026-10-12",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM SAVEMORE ACACIA",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM SHAIRA",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2022",
        "requestId":  "LR-26-2022",
        "joNumber":  "SD2601007-032",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "BUKO JUAN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-07",
        "releasingDate":  "2026-10-09",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET BICUTAN",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2021",
        "requestId":  "LR-26-2021",
        "joNumber":  "SD2601005-004",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-05",
        "releasingDate":  "2026-10-06",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2020",
        "requestId":  "LR-26-2020",
        "joNumber":  "SD2601002-018",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC PM EVENT EAST OCEAN PALACE",
        "artist":  "Bob",
        "designDeadline":  "2026-10-02",
        "releasingDate":  "2026-10-04",
        "fileSent":  "FILE SENT",
        "completeAddress":  "EAST OCEAN PALACE",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2019",
        "requestId":  "LR-26-2019",
        "joNumber":  "SD2601001-015",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "HENLIN",
        "artist":  "Bob",
        "designDeadline":  "2026-10-01",
        "releasingDate":  "2026-10-05",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET ROSARIO BATANGAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2018",
        "requestId":  "LR-26-2018",
        "joNumber":  "SD2601001-016",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "SONYDA",
        "artist":  "Bob",
        "designDeadline":  "2026-10-01",
        "releasingDate":  "2026-10-05",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET ROSARIO BATANGAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2017",
        "requestId":  "LR-26-2017",
        "joNumber":  "SD2601001-017",
        "salesRep":  "MARIEL",
        "client":  "SM HYPERMARKET",
        "projectName":  "POTATO CORNER",
        "artist":  "Bob",
        "designDeadline":  "2026-10-01",
        "releasingDate":  "2026-10-05",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM HYPERMARKET ROSARIO BATANGAS",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "MA\u0027AM ELLE",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2016",
        "requestId":  "LR-26-2016",
        "joNumber":  "SD2601002-011",
        "salesRep":  "MARIEL",
        "client":  "SINITIC",
        "projectName":  "SINITIC GOLDEN BAY",
        "artist":  "Bob",
        "designDeadline":  "2026-10-02",
        "releasingDate":  "2026-10-04",
        "fileSent":  "FILE SENT",
        "completeAddress":  "GOLDEN BAY",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "BOSS DANNY",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2015",
        "requestId":  "LR-26-2015",
        "joNumber":  "SD261022-006",
        "salesRep":  "JANET",
        "client":  "MS. GEN",
        "projectName":  "CLEAR ACRYLIC BOX (FREE)",
        "artist":  "Goodrich",
        "designDeadline":  "2026-10-21",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "ROBINSONS MAGNOLIA",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. GEN BERMUDO",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2014",
        "requestId":  "LR-26-2014",
        "joNumber":  "P261001188",
        "salesRep":  "JASTINE",
        "client":  "LSG FOOD CORPORATION",
        "projectName":  "HEY NOAH BOARD UP",
        "artist":  "Glen",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Sir Eries Chan",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2013",
        "requestId":  "LR-26-2013",
        "joNumber":  "TF",
        "salesRep":  "JOYCE",
        "client":  "PLANET SPORTS",
        "projectName":  "Halloween - Sticker",
        "artist":  "Raven",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2012",
        "requestId":  "LR-26-2012",
        "joNumber":  "P261001183",
        "salesRep":  "JASTINE",
        "client":  "CITY SAVINGS",
        "projectName":  "DATA PRIVACY ACT",
        "artist":  "Glen",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2011",
        "requestId":  "LR-26-2011",
        "joNumber":  "SD261021-029",
        "salesRep":  "KIM",
        "client":  "LEXIGN ARTS \u0026 SIGNS",
        "projectName":  "PEDRO AND ELA GAGAN",
        "artist":  "Tim",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Outdoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "Ms. Peng",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2010",
        "requestId":  "LR-26-2010",
        "joNumber":  "SD261021-025",
        "salesRep":  "JOYCE",
        "client":  "CHINA BANKING CORPORATION",
        "projectName":  "CBC SAMPLE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "2026-10-23",
        "fileSent":  "N/A",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2009",
        "requestId":  "LR-26-2009",
        "joNumber":  "N/A",
        "salesRep":  "FLORA",
        "client":  "SYSU INTERNATIONAL",
        "projectName":  "SYSU EXTERIOR SIGNAGE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-22",
        "releasingDate":  "",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2008",
        "requestId":  "LR-26-2008",
        "joNumber":  "SD261021-014",
        "salesRep":  "KIM",
        "client":  "GOD IS LOVE CONSTRUCTION MATERIALS TRADING",
        "projectName":  "PULL UP BANNER",
        "artist":  "Glen",
        "designDeadline":  "1015-10-21",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "MS. ALYSA",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2007",
        "requestId":  "LR-26-2007",
        "joNumber":  "P261000939",
        "salesRep":  "DONA",
        "client":  "Cullinan Group Inc",
        "projectName":  "MY DIAMOND",
        "artist":  "Glen",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2006",
        "requestId":  "LR-26-2006",
        "joNumber":  "P261001120",
        "salesRep":  "DONA",
        "client":  "PAU ACILAC",
        "projectName":  "BELLE OUVRE",
        "artist":  "Glen",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2005",
        "requestId":  "LR-26-2005",
        "joNumber":  "P261001148",
        "salesRep":  "DONA",
        "client":  "SPACEY DESIGN MANILA",
        "projectName":  "KIDS ZONE TELA - APHOLSTERY",
        "artist":  "Jules",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2004",
        "requestId":  "LR-26-2004",
        "joNumber":  "P261001121",
        "salesRep":  "DONA",
        "client":  "CDJJ DYNAMIC MERCHANDISING",
        "projectName":  "OT TAI-CHI OG WINDOW SHANGLA 10.21",
        "artist":  "Jules",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2003",
        "requestId":  "LR-26-2003",
        "joNumber":  "P261001127",
        "salesRep":  "DONA",
        "client":  "Decalpro Printing Services",
        "projectName":  "SALE 1.8MM  L-STAND   10.21",
        "artist":  "Glen",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2002",
        "requestId":  "LR-26-2002",
        "joNumber":  "P261001125",
        "salesRep":  "DONA",
        "client":  "Global Link MP Events Intl Inc.",
        "projectName":  "CINEPROD EXPO BACKDROP  ADDITIONAL",
        "artist":  "Jules",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-2001",
        "requestId":  "LR-26-2001",
        "joNumber":  "SD261021-010",
        "salesRep":  "KIM",
        "client":  "ADVOS ADVERTISING AGENCY",
        "projectName":  "SOB",
        "artist":  "Glen",
        "designDeadline":  "Octobert 21, 2026",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "Muzon Taytay Rizal",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "Ms. Jesicca",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-2000",
        "requestId":  "LR-26-2000",
        "joNumber":  "SD261015-025",
        "salesRep":  "KIM",
        "client":  "WAGS AND WHISKERS BY DOC FERDS ANIMAL WELLNESS",
        "projectName":  "Christmas UV Backlit Film",
        "artist":  "Raven",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-15",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1999",
        "requestId":  "LR-26-1999",
        "joNumber":  "P261001082",
        "salesRep":  "JASTINE",
        "client":  "FULTON TRADING",
        "projectName":  "TRAFFIC ADVISORY V7",
        "artist":  "Glen",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "pick up",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1998",
        "requestId":  "LR-26-1998",
        "joNumber":  "SD261020-019",
        "salesRep":  "FLORA",
        "client":  "RASHEED TASHID",
        "projectName":  "Congratulatory Tarp",
        "artist":  "Jules",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "pick up",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1997",
        "requestId":  "LR-26-1997",
        "joNumber":  "SD260926-007",
        "salesRep":  "JEN",
        "client":  "ANYTIME FITNESS",
        "projectName":  "MURALS",
        "artist":  "Glen",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "AF SAN FERNANDO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Mr. James Sy",
        "contactNumber":  "639228402612",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1996",
        "requestId":  "LR-26-1996",
        "joNumber":  "SD261020-027",
        "salesRep":  "JOYCE",
        "client":  "STUDIO LYV",
        "projectName":  "2XU - Additional",
        "artist":  "Raven",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "TO FOLLOW",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1995",
        "requestId":  "LR-26-1995",
        "joNumber":  "SD261016-016",
        "salesRep":  "JOYCE",
        "client":  "Zuspresso",
        "projectName":  "Sample Mock Up",
        "artist":  "Raven",
        "designDeadline":  "2026-10-21",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "Zus Head Office",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1994",
        "requestId":  "LR-26-1994",
        "joNumber":  "SD261020-022",
        "salesRep":  "FLORA",
        "client":  "MODULART",
        "projectName":  "KAPOOR LIGHTBOX",
        "artist":  "Raven",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "VALENZUELA",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1993",
        "requestId":  "LR-26-1993",
        "joNumber":  "P261001043",
        "salesRep":  "JASTINE",
        "client":  "CGS ADVERTISING SERVICES",
        "projectName":  "PROJECT COFFEE MENU",
        "artist":  "Glen",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1992",
        "requestId":  "LR-26-1992",
        "joNumber":  "N/A",
        "salesRep":  "FLORA",
        "client":  "VIKINGS GROUP",
        "projectName":  "VFV SIGNAGE MOCK UP",
        "artist":  "Tim",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM FAIRVIEW",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1991",
        "requestId":  "LR-26-1991",
        "joNumber":  "P261001034",
        "salesRep":  "JASTINE",
        "client":  "BASEL SMH MARKETING INC.",
        "projectName":  "Calvin Klein WPS",
        "artist":  "Jules",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1990",
        "requestId":  "LR-26-1990",
        "joNumber":  "P261001032",
        "salesRep":  "JASTINE",
        "client":  "BASEL SMH MARKETING INC.",
        "projectName":  "The Watch Store- Sm Fairview",
        "artist":  "Jules",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-23",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM FAIRVIEW",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1989",
        "requestId":  "LR-26-1989",
        "joNumber":  "N/A",
        "salesRep":  "JASTINE",
        "client":  "EDGECON",
        "projectName":  "LAW OFFICE",
        "artist":  "GOODRICH",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1988",
        "requestId":  "LR-26-1988",
        "joNumber":  "P261001021",
        "salesRep":  "JASTINE",
        "client":  "FULTON TRADING",
        "projectName":  "TRAFFIC ADVISORY V6",
        "artist":  "Glen",
        "designDeadline":  "2026-10-20",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "639171423679",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1987",
        "requestId":  "LR-26-1987",
        "joNumber":  "P261001001",
        "salesRep":  "JASTINE",
        "client":  "BASEL SMH MARKETING INC.",
        "projectName":  "SM MEGA MALL",
        "artist":  "Jules",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-22",
        "fileSent":  "FILE SENT",
        "completeAddress":  "SM MEGA MALL",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "639171423679",
        "projectStatus":  "Pending",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-19",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1986",
        "requestId":  "LR-26-1986",
        "joNumber":  "P261000979",
        "salesRep":  "JASTINE",
        "client":  "CGS ADVERTISING SERVICES",
        "projectName":  "BLACK BACK",
        "artist":  "Glen",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "PICK UP",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "639171423679",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-19",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1985",
        "requestId":  "LR-26-1985",
        "joNumber":  "SD261019-013",
        "salesRep":  "FLORA",
        "client":  "INTERNATIONAL FINANCE CENTER",
        "projectName":  "IFC INDICATOR SINTRA",
        "artist":  "Bob",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "BGC",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "KESHNER LOQUINARIO",
        "contactNumber":  "639171423679",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1984",
        "requestId":  "LR-26-1984",
        "joNumber":  "P261000961",
        "salesRep":  "JASTINE",
        "client":  "RED OCTAGON",
        "projectName":  "CANVAS",
        "artist":  "Jules",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-20",
        "fileSent":  "FILE SENT",
        "completeAddress":  "PICK UP",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-19",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1983",
        "requestId":  "LR-26-1983",
        "joNumber":  "P261000953",
        "salesRep":  "JASTINE",
        "client":  "GPF PHILS.",
        "projectName":  "THE YARD OPEN",
        "artist":  "Jules",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-19",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1982",
        "requestId":  "LR-26-1982",
        "joNumber":  "SD261017-005",
        "salesRep":  "KIM",
        "client":  "ADVOS ADVERTISING AGENCY",
        "projectName":  "11.11 SALE TARP",
        "artist":  "Glen",
        "designDeadline":  "2026-10-17",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "MUZON TAYTAY RIZAL",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "MS. JESSICA",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1981",
        "requestId":  "LR-26-1981",
        "joNumber":  "P261000912",
        "salesRep":  "DONA",
        "client":  "RGM Exhibit And Events Services",
        "projectName":  "AMERICAN",
        "artist":  "Jules",
        "designDeadline":  "2026-10-17",
        "releasingDate":  "October 17,2026",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1980",
        "requestId":  "LR-26-1980",
        "joNumber":  "SD261017-002",
        "salesRep":  "JEN",
        "client":  "ANYTIME FITNESS",
        "projectName":  "BILLBOARD",
        "artist":  "Glen",
        "designDeadline":  "2026-10-19",
        "releasingDate":  "October 17,2026",
        "fileSent":  "FILE SENT",
        "completeAddress":  "AF DISTRICT IMUS",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Mr. Dirreck Calixto",
        "contactNumber":  "639171408442",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1979",
        "requestId":  "LR-26-1979",
        "joNumber":  "SD260926-007",
        "salesRep":  "JEN",
        "client":  "ANYTIME FITNESS",
        "projectName":  "SIGNAGE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "AF SAN FERNANDO",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "Mr. James Sy",
        "contactNumber":  "639228402612",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1978",
        "requestId":  "LR-26-1978",
        "joNumber":  "TF",
        "salesRep":  "FLORA",
        "client":  "MEGAWORLD",
        "projectName":  "MEGAWORLD SIGNAGE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1977",
        "requestId":  "LR-26-1977",
        "joNumber":  "P261000876",
        "salesRep":  "DONA",
        "client":  "RGM Exhibit And Events Services",
        "projectName":  "SCHULTE AND MINTRA ADDITONAL",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-22",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1976",
        "requestId":  "LR-26-1976",
        "joNumber":  "SD261016-014",
        "salesRep":  "FLORA",
        "client":  "HAPPY N HEALTHY",
        "projectName":  "HNH MENU",
        "artist":  "Goodrich",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-21",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1975",
        "requestId":  "LR-26-1975",
        "joNumber":  "P261000868",
        "salesRep":  "DONA",
        "client":  "TRADEMASTERS VENTURES OPC",
        "projectName":  "GRAY FABRIC",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Ongoing",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-20",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1974",
        "requestId":  "LR-26-1974",
        "joNumber":  "P261000864",
        "salesRep":  "DONA",
        "client":  "PROFIX ADS",
        "projectName":  "GFORCE ABREEZA",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-19",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1973",
        "requestId":  "LR-26-1973",
        "joNumber":  "P261000862",
        "salesRep":  "DONA",
        "client":  "SPACEY DESIGN MANILA",
        "projectName":  "happy sking riser label new font",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-18",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1972",
        "requestId":  "LR-26-1972",
        "joNumber":  "P261000859",
        "salesRep":  "DONA",
        "client":  "PROFIX ADS",
        "projectName":  "HAUNTED FORTUNE 10.15",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1971",
        "requestId":  "LR-26-1971",
        "joNumber":  "N/A",
        "salesRep":  "FLORA",
        "client":  "VIKINGS GROUP",
        "projectName":  "KAGUYA",
        "artist":  "Tim",
        "designDeadline":  "2026-10-17",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1970",
        "requestId":  "LR-26-1970",
        "joNumber":  "P261000854",
        "salesRep":  "JASTINE",
        "client":  "COOPTECHNOLOGIES",
        "projectName":  "Bridge Store Hours Stickers",
        "artist":  "Glen",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1969",
        "requestId":  "LR-26-1969",
        "joNumber":  "SD261016-005",
        "salesRep":  "KIM",
        "client":  "LEXIGN ARTS \u0026 SIGNS",
        "projectName":  "HERMINA",
        "artist":  "Tim",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "Ms. Peng",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1968",
        "requestId":  "LR-26-1968",
        "joNumber":  "SD261017-010",
        "salesRep":  "JOYCE",
        "client":  "RBS FOOD CORPORATION",
        "projectName":  "MANG INASAL SHELL OF ASIA",
        "artist":  "Raven",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "Pending",
        "completeAddress":  "",
        "location":  "Indoor \u0026 Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1967",
        "requestId":  "LR-26-1967",
        "joNumber":  "SD261009-019",
        "salesRep":  "JOYCE",
        "client":  "STUDIO LYV",
        "projectName":  "2XU - Signage",
        "artist":  "Raven",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "TO FOLLOW",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Approved",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Not Started",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1966",
        "requestId":  "LR-26-1966",
        "joNumber":  "SD261016-007",
        "salesRep":  "KIM",
        "client":  "ADVOS ADVERTISING AGENCY",
        "projectName":  "WALL MURAL",
        "artist":  "Glen",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "mandaue foam antipolo",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "ms. jessica",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1965",
        "requestId":  "LR-26-1965",
        "joNumber":  "SD261014-041",
        "salesRep":  "KIM",
        "client":  "SQUAREFOOT",
        "projectName":  "ABLAY-CLEDERA",
        "artist":  "Tim",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "DELIVER",
        "contactPerson":  "Ms. Nerizza",
        "contactNumber":  "Messenger",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1964",
        "requestId":  "LR-26-1964",
        "joNumber":  "P261000841",
        "salesRep":  "JASTINE",
        "client":  "Jorouv Travel and Tours Inc",
        "projectName":  "JOROUV DTF",
        "artist":  "Jules",
        "designDeadline":  "2026-10-16",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1963",
        "requestId":  "LR-26-1963",
        "joNumber":  "P261000819",
        "salesRep":  "JASTINE",
        "client":  "BASEL SMH MARKETING INC.",
        "projectName":  "The Watch Store - SM Bacolod Rebranding Additional",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1962",
        "requestId":  "LR-26-1962",
        "joNumber":  "P261000809",
        "salesRep":  "JASTINE",
        "client":  "FULTON TRADING",
        "projectName":  "TRAFFIC ADVISORY V5",
        "artist":  "Glen",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1961",
        "requestId":  "LR-26-1961",
        "joNumber":  "SD261015-022",
        "salesRep":  "FLORA",
        "client":  "POPEYES",
        "projectName":  "EVO BOARD UP",
        "artist":  "Raven",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Outdoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1960",
        "requestId":  "LR-26-1960",
        "joNumber":  "P261000800",
        "salesRep":  "JASTINE",
        "client":  "EPCC",
        "projectName":  "JESUS REIGNS BANNER",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-16",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Outdoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1959",
        "requestId":  "LR-26-1959",
        "joNumber":  "P26100787",
        "salesRep":  "JASTINE",
        "client":  "NAVCO",
        "projectName":  "ANKER UPBGC",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1958",
        "requestId":  "LR-26-1958",
        "joNumber":  "P26100785",
        "salesRep":  "JASTINE",
        "client":  "NAVCO",
        "projectName":  "ANKER SM NORTH",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1957",
        "requestId":  "LR-26-1957",
        "joNumber":  "P26100783",
        "salesRep":  "JASTINE",
        "client":  "NAVCO",
        "projectName":  "ANKER MEGAMALL",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1956",
        "requestId":  "LR-26-1956",
        "joNumber":  "P26100782",
        "salesRep":  "JASTINE",
        "client":  "NAVCO",
        "projectName":  "ANKER BACOOR",
        "artist":  "Jules",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-21",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Submitted",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-15",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1955",
        "requestId":  "LR-26-1955",
        "joNumber":  "SD261015-009",
        "salesRep":  "FLORA",
        "client":  "MODULART",
        "projectName":  "HAPPY SKIN SIGNAGE",
        "artist":  "Raven",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-19",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-24",
        "month":  "October 2026",
        "completionDate":  null
    },
    {
        "id":  "lr-26-1954",
        "requestId":  "LR-26-1954",
        "joNumber":  "SD261015-011",
        "salesRep":  "DONA",
        "client":  "RISING DESIGN PH. INC.",
        "projectName":  "RISEN CHURCH",
        "artist":  "Goodrich",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-17",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "PICKUP",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "Completed",
        "clientApproval":  "Approved",
        "priority":  "Normal",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "Completed",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-17",
        "month":  "October 2026",
        "completionDate":  true
    },
    {
        "id":  "lr-26-1953",
        "requestId":  "LR-26-1953",
        "joNumber":  "",
        "salesRep":  "SOL",
        "client":  "TEABROS CORP",
        "projectName":  "SM CHERRY COLLATERALS",
        "artist":  "Tim",
        "designDeadline":  "2026-10-15",
        "releasingDate":  "2026-10-15",
        "fileSent":  "FILE SENT",
        "completeAddress":  "",
        "location":  "Indoor",
        "releasingMode":  "INSTALL",
        "contactPerson":  "",
        "contactNumber":  "",
        "projectStatus":  "On-going",
        "clientApproval":  "Pending",
        "priority":  "Rush",
        "countStandard":  0,
        "countSpecial":  0,
        "countPrinting":  0,
        "headApproval":  "Pending",
        "designStatus":  "In Progress",
        "revisionCount":  0,
        "remarks":  "",
        "orderDate":  "2026-10-16",
        "month":  "October 2026",
        "completionDate":  null
    }
];

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
      type: 'PNG Image',
      size: '1.4 MB',
      dateAdded: '2026-10-23',
      storageType: 'Local Mock',
      url: 'assets/img/sign-depot-logo.png'
    },
    {
      id: 'att-2',
      name: 'Client_Approved_Facade_Render_PauAcilac.png',
      type: 'Proof Render',
      size: '2.8 MB',
      dateAdded: '2026-10-23',
      storageType: 'Local Mock',
      url: 'assets/img/sign-depot-logo.png'
    },
    {
      id: 'att-3',
      name: 'Engineering_Electrical_Wiring_Diagram.png',
      type: 'Technical Drawing',
      size: '890 KB',
      dateAdded: '2026-10-23',
      storageType: 'Local Mock',
      url: 'assets/img/sign-depot-logo.png'
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
    trackerFilter: { search: '', projectStatus: '', designStatus: '', artist: '', overdue: '', datePreset: '', dateCustom: '', dateColumn: 'orderDate', sortField: 'requestId', sortDir: 'desc', page: 1, perPage: initialRowsPerPage },
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
            if (parsed.salesReps) {
              const loadedReps = parsed.salesReps
                .filter(s => s && s.toLowerCase() !== 'shela')
                .map(toTitleCase);
              state.salesReps = Array.from(new Set([...DEFAULT_SALES_REPS, ...loadedReps]))
                .filter(s => s && s.toLowerCase() !== 'shela')
                .sort();
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
            if (parsed.artistWorkloadFromSheet) state.artistWorkloadFromSheet = parsed.artistWorkloadFromSheet;
            
            const storedRows = getStoredRowsPerPage();
            if (state.salesFilter) state.salesFilter.perPage = storedRows;
            if (state.trackerFilter) state.trackerFilter.perPage = storedRows;
            state.pendingSalesPerPage = storedRows;
            state.pendingArtistPerPage = storedRows;
            state.workloadPerPage = storedRows;
            state.dashboardPerPage = storedRows;
            state.monthlyOutputPerPage = storedRows;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Use genuine live spreadsheet default dataset
    state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
    state.requests.forEach(normalizeRequestItem);
    state.artists = DEFAULT_ARTISTS.map(toTitleCase);
    state.salesReps = DEFAULT_SALES_REPS.map(toTitleCase);
    saveStateToStorage();

    // 3. If running in PHP environment with live MySQL backend, sync live records
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_artists')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
            state.artists = res.data
              .map(a => toTitleCase(a.name))
              .filter(a => a !== 'Seven' && a !== 'Edrian');
            if (!state.artists.includes('Dorothy')) {
              state.artists.push('Dorothy');
            }
            state.artists.sort();
            saveStateToStorage();
            if (state.activeView === 'view-artist-workload') {
              renderArtistWorkload();
            }
          }
        })
        .catch(e => console.warn('MySQL live artists fetch:', e));

      fetch(window.PMS_API_URL + '?action=get_sales_reps')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
            const reps = res.data
              .filter(s => s && s.toLowerCase() !== 'shela')
              .map(toTitleCase);
            state.salesReps = Array.from(new Set([...state.salesReps, ...reps]))
              .filter(s => s && s.toLowerCase() !== 'shela')
              .sort();
            saveStateToStorage();
            populateSalesFiltersDropdowns();
          }
        })
        .catch(e => console.warn('MySQL live sales reps fetch:', e));

      fetch(window.PMS_API_URL + '?action=get_all_requests')
        .then(res => res.json())
        .then(res => {
          if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach(normalizeRequestItem);
            state.requests = res.data;
            saveStateToStorage();
            if (state.activeView === 'view-dashboard') {
              renderDashboard();
            } else if (state.activeView === 'view-sales-requests') {
              renderSalesRequests();
            } else if (state.activeView === 'view-creatives-tracker') {
              renderCreativesTracker();
            } else if (state.activeView === 'view-artist-workload') {
              renderArtistWorkload();
            } else if (state.activeView === 'view-directives-details') {
              renderDirectivePreview(state.currentDirectiveJo);
            }
          }
        })
        .catch(e => console.warn('MySQL live requests fetch:', e));
    }
  }

  function saveStateToStorage() {
    try {
      const dataToSave = {
        artists: state.artists,
        salesReps: state.salesReps,
        requests: state.requests,
        templateElements: state.templateElements,
        attachments: state.attachments,
        customCellFonts: state.customCellFonts || {}
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
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
    const btn = selectEl.nextElementSibling && selectEl.nextElementSibling.classList.contains('custom-filter-dropdown-btn')
      ? selectEl.nextElementSibling
      : null;
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

  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

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

  // Real-time Deadline Alert Calculation based on user local date
  function getDeadlineAlertStatus(deadlineStr, projectStatus) {
    if (!deadlineStr || projectStatus === 'Completed') {
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

    const targetDate = new Date(dYear, dMonth, dDay);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
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

  function isOverdue(deadlineStr, projectStatus) {
    return getDeadlineAlertStatus(deadlineStr, projectStatus).status === 'overdue';
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

    renderCurrentView(viewId);
  }

  function renderCurrentView(viewId) {
    switch (viewId) {
      case 'view-dashboard':
        renderDashboard();
        break;
      case 'view-sales-requests':
        renderSalesRequests();
        break;
      case 'view-creatives-tracker':
        renderCreativesTracker();
        break;
      case 'view-artist-workload':
        renderArtistWorkload();
        break;
      case 'view-directives-details':
        renderDirectivePreview();
        break;
      case 'view-pending-sales':
        renderPendingSalesQueue();
        break;
      case 'view-monthly-output':
        renderMonthlyOutputReport(state.timeframe || 'all');
        break;
      case 'view-reports':
        renderReports(state.timeframe || 'all');
        break;
      case 'view-access-control':
        if (typeof loadUsersList === 'function') {
          loadUsersList();
        }
        break;
      case 'view-settings':
        renderSettings();
        break;
    }

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

  // ==========================================================================
  // MODULE 1: DASHBOARD ENGINE (Panze Studio Layout + Live Inline Editable)
  // ==========================================================================

  function renderDashboard() {
    updateDashboardKPIs();
    renderProgressTimeline();
    renderRecentActivityFeed();
    renderPanzeDonutChart();
    renderDashboardWorkloadSnapshot();
    renderDashboardRecentProjectsTable();
  }

  function getKpiFilteredRequests(type) {
    const reqs = state.requests || [];
    if (type === 'pending') {
      return reqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
    }
    if (type === 'working') {
      return reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
    }
    if (type === 'approved' || type === 'completed') {
      return reqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved');
    }
    if (type === 'revising') {
      return reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
    }
    if (type === 'overdue') {
      return reqs.filter(r => isOverdue(r.designDeadline, r.projectStatus));
    }
    return reqs; // 'all'
  }

  function updateDashboardKPIs() {
    const reqs = state.requests;
    const totalRequests = reqs.length;
    const pendingApproval = reqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending').length;
    const working = reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const approved = reqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved').length;
    const revising = reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;
    const overdue = reqs.filter(r => isOverdue(r.designDeadline, r.projectStatus)).length;

    // Creatives Tracker KPI scoping for logged-in artist
    const myArtist = getLoggedInArtist();
    const trackerReqs = myArtist ? reqs.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase()) : reqs;
    const trkTotal = trackerReqs.length;
    const trkPending = trackerReqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending').length;
    const trkWorking = trackerReqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const trkApproved = trackerReqs.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved').length;
    const trkRevising = trackerReqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;
    const trkOverdue = trackerReqs.filter(r => isOverdue(r.designDeadline, r.projectStatus)).length;

    // Dashboard elements
    const elTot = document.getElementById('kpiTotalRequests'); if (elTot) elTot.textContent = Number(totalRequests).toLocaleString();
    const elPend = document.getElementById('kpiPendingApproval'); if (elPend) elPend.textContent = Number(pendingApproval).toLocaleString();
    const elWork = document.getElementById('kpiWorking'); if (elWork) elWork.textContent = Number(working).toLocaleString();
    const elAppr = document.getElementById('kpiApproved'); if (elAppr) elAppr.textContent = Number(approved).toLocaleString();
    const elComp = document.getElementById('kpiCompleted'); if (elComp) elComp.textContent = Number(approved).toLocaleString();
    const elRev = document.getElementById('kpiRevising'); if (elRev) elRev.textContent = Number(revising).toLocaleString();
    const elOver = document.getElementById('kpiOverdue'); if (elOver) elOver.textContent = Number(overdue).toLocaleString();

    // Creatives Tracker KPI elements
    const elTotTrk = document.getElementById('kpiTotalRequestsTracker'); if (elTotTrk) elTotTrk.textContent = Number(trkTotal).toLocaleString();
    const elPendTrk = document.getElementById('kpiPendingApprovalTracker'); if (elPendTrk) elPendTrk.textContent = Number(trkPending).toLocaleString();
    const elWorkTrk = document.getElementById('kpiWorkingTracker'); if (elWorkTrk) elWorkTrk.textContent = Number(trkWorking).toLocaleString();
    const elApprTrk = document.getElementById('kpiApprovedTracker'); if (elApprTrk) elApprTrk.textContent = Number(trkApproved).toLocaleString();
    const elRevTrk = document.getElementById('kpiRevisingTracker'); if (elRevTrk) elRevTrk.textContent = Number(trkRevising).toLocaleString();
    const elOverTrk = document.getElementById('kpiOverdueTracker'); if (elOverTrk) elOverTrk.textContent = Number(trkOverdue).toLocaleString();

    // Live MySQL real-time KPI sync when backend is available
    if (window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_stats')
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.stats) {
            const s = res.stats;
            if (elTot && s.total !== undefined) elTot.textContent = Number(s.total).toLocaleString();
            if (elPend && s.pending !== undefined) elPend.textContent = Number(s.pending).toLocaleString();
            if (elWork && s.ongoing !== undefined) elWork.textContent = Number(s.ongoing).toLocaleString();
            if (elAppr && s.approved !== undefined) elAppr.textContent = Number(s.approved).toLocaleString();
            if (elComp && s.approved !== undefined) elComp.textContent = Number(s.approved).toLocaleString();
            if (elRev && s.revising !== undefined) elRev.textContent = Number(s.revising).toLocaleString();
            if (elOver && s.overdue !== undefined) elOver.textContent = Number(s.overdue).toLocaleString();
          }
        })
        .catch(() => {});
    }
  }

  // ==========================================================================
  // PROGRESS TIMELINE RENDERER (Image 2 Replica)
  // ==========================================================================
  function renderProgressTimeline() {
    const container = document.getElementById('progressTimelineChartContainer');
    if (!container) return;

    // Timeline data: 7 days of active week (M, T, W, T, F, S, S)
    const days = [
      { key: 'M', name: 'Monday', created: 13, completed: 8, x: 48 },
      { key: 'T', name: 'Tuesday', created: 17, completed: 12, x: 128 },
      { key: 'W', name: 'Wednesday', created: 19, completed: 23, x: 208, isPeak: true },
      { key: 'T', name: 'Thursday', created: 15, completed: 14, x: 288 },
      { key: 'F', name: 'Friday', created: 18, completed: 17, x: 368, isCurrent: true },
      { key: 'S', name: 'Saturday', created: 8, completed: 0, x: 448, isProjected: true },
      { key: 'S', name: 'Sunday', created: 6, completed: 0, x: 518, isProjected: true }
    ];

    const chartW = 560;
    const chartH = 160;
    const axisY = 132;
    const maxVal = 28;

    let peakDay = days[2];
    days.forEach(d => {
      if (d.completed > peakDay.completed) peakDay = d;
    });

    const titleEl = document.getElementById('timelineHighlightTitle');
    if (titleEl) titleEl.textContent = `Peak productivity on ${peakDay.name}`;

    const subtitleEl = document.getElementById('timelineHighlightSubtitle');
    if (subtitleEl) subtitleEl.textContent = 'Focus shifted to task completion';

    const getY = (val) => {
      const plotH = 96;
      return Math.round(axisY - (val / maxVal) * plotH);
    };

    // Smooth cardinal/cubic Bezier spline generator (high subpixel precision)
    const getSmoothSpline = (pts, tension = 0.22) => {
      if (!pts || pts.length === 0) return '';
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
      let path = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i < pts.length - 2 ? pts[i + 2] : p2;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
      }
      return path;
    };

    // Active completed curve (Mon - Fri)
    const completedPts = days.slice(0, 5).map(d => ({ x: d.x, y: getY(d.completed) }));
    const dCompletedLine = getSmoothSpline(completedPts, 0.24);
    const fri = completedPts[completedPts.length - 1];
    const mon = completedPts[0];
    const dCompletedArea = `${dCompletedLine} L ${fri.x} ${axisY} L ${mon.x} ${axisY} Z`;

    // Created tasks curve (Mon - Sun full week projection)
    const createdPts = days.map(d => ({ x: d.x, y: getY(d.created) }));
    const dCreated = getSmoothSpline(createdPts, 0.20);

    container.innerHTML = `
      <svg class="timeline-chart-svg" viewBox="0 0 ${chartW} ${chartH}" shape-rendering="geometricPrecision">
        <!-- Vertical Day Grid Lines -->
        ${days.map(d => `<line class="timeline-grid-line" x1="${d.x}" y1="18" x2="${d.x}" y2="${axisY}" shape-rendering="geometricPrecision" />`).join('')}

        <!-- Bottom Axis -->
        <line class="timeline-axis-line" x1="24" y1="${axisY}" x2="${chartW - 24}" y2="${axisY}" shape-rendering="geometricPrecision" />

        <!-- Day Tick Marks -->
        ${days.map(d => `<line class="timeline-tick-line" x1="${d.x}" y1="${axisY - 4}" x2="${d.x}" y2="${axisY + 3}" stroke-linecap="round" shape-rendering="geometricPrecision" />`).join('')}

        <!-- Day Labels (M, T, W, T, F, S, S) -->
        ${days.map(d => `<text class="timeline-day-label" x="${d.x}" y="${axisY + 18}">${d.key}</text>`).join('')}

        <!-- Task Created Path (Smooth Dashed Gray Line) -->
        <path class="timeline-path-created" d="${dCreated}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision" />

        <!-- Task Completed Area Fill (Soft Translucent Tint) -->
        <path class="timeline-area-completed" fill="rgba(79, 70, 229, 0.08)" d="${dCompletedArea}" shape-rendering="geometricPrecision" />

        <!-- Task Completed Path (Smooth Solid Indigo Wave) -->
        <path class="timeline-path-completed" d="${dCompletedLine}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision" />

        <!-- Friday Active Indicator (Vertical Marker to Axis) -->
        <line class="timeline-current-marker" x1="${fri.x}" y1="${fri.y}" x2="${fri.x}" y2="${axisY + 2}" vector-effect="non-scaling-stroke" stroke-linecap="round" shape-rendering="geometricPrecision" />

        <!-- Weekend Projection Dotted Line across Saturday & Sunday -->
        <line class="timeline-projection-line" x1="${fri.x}" y1="${fri.y}" x2="${chartW - 30}" y2="${fri.y}" vector-effect="non-scaling-stroke" stroke-linecap="round" shape-rendering="geometricPrecision" />

        <!-- Interactive Data Points on Active Days (Mon - Fri) -->
        ${days.slice(0, 5).map(d => `
          <circle class="timeline-data-point" cx="${d.x}" cy="${getY(d.completed)}" r="${d.isPeak ? 5.5 : 4}"
            data-day="${escapeHTML(d.name)}" data-completed="${d.completed}" data-created="${d.created}"
            vector-effect="non-scaling-stroke" shape-rendering="geometricPrecision"
            onmouseenter="window.SignDepotApp.showTimelineTooltip(event, '${d.name}', ${d.completed}, ${d.created})"
            onmouseleave="window.SignDepotApp.hideTimelineTooltip()" />
        `).join('')}
      </svg>
      <div id="timelineTooltipEl" class="timeline-tooltip"></div>
    `;
  }

  function showTimelineTooltip(e, dayName, completed, created) {
    const tip = document.getElementById('timelineTooltipEl');
    if (!tip) return;
    tip.innerHTML = `<strong>${escapeHTML(dayName)}</strong>: <span style="color:#818CF8; font-weight:700;">${completed} Completed</span> • <span style="color:#94A3B8;">${created} Created</span>`;
    const rect = e.target.getBoundingClientRect();
    const parent = e.target.closest('.timeline-chart-wrap');
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    tip.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
    tip.style.top = `${rect.top - parentRect.top}px`;
    tip.classList.add('visible');
  }

  function hideTimelineTooltip() {
    const tip = document.getElementById('timelineTooltipEl');
    if (tip) tip.classList.remove('visible');
  }

  // ==========================================================================
  // RECENT ACTIVITY & UPDATES FEED RENDERER
  // ==========================================================================
  let currentActivityFilter = 'all';

  function renderRecentActivityFeed(filter = currentActivityFilter) {
    currentActivityFilter = filter;
    const feed = document.getElementById('recentActivityFeedList');
    if (!feed) return;

    // Sync filter pills
    document.querySelectorAll('#activityFilterTabs [data-act-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-act-filter') === filter);
    });

    if (window.PMS_API_URL && !feed._loadedOnce) {
      feed._loadedOnce = true;
      fetch(window.PMS_API_URL + '?action=get_recent_activity')
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.logs && res.logs.length > 0) {
            feed._cachedLogs = res.logs;
            feed._cachedRequests = res.recent_requests || [];
            buildActivityFeedDOM(filter);
            return;
          }
          buildActivityFeedDOM(filter);
        })
        .catch(() => {
          buildActivityFeedDOM(filter);
        });
      return;
    }

    buildActivityFeedDOM(filter);
  }

  function buildActivityFeedDOM(filter) {
    const feed = document.getElementById('recentActivityFeedList');
    if (!feed) return;

    const cachedLogs = feed._cachedLogs || [];
    const cachedReqs = feed._cachedRequests || (state.requests || []).slice(0, 10);

    let items = [];

    // Map audit logs
    cachedLogs.forEach(l => {
      let type = 'general';
      const m = (l.module || '').toLowerCase();
      if (m.includes('sales')) type = 'orders';
      else if (m.includes('creative') || m.includes('directive') || m.includes('tracker')) type = 'creatives';
      else if (m.includes('access') || m.includes('security') || m.includes('auth') || m.includes('user')) type = 'security';

      let roleType = 'system';
      const r = (l.role || '').toLowerCase();
      if (r.includes('sales')) roleType = 'sales';
      else if (r.includes('artist')) roleType = 'artist';
      else if (r.includes('admin')) roleType = 'admin';

      items.push({
        user: l.user || 'System',
        roleType: roleType,
        action: l.action || 'UPDATE',
        module: l.module || 'System',
        desc: l.desc || l.description || 'System operation executed',
        time: l.time ? formatRelativeTime(l.time) : 'Just now',
        type: type,
        timestamp: new Date(l.time).getTime() || Date.now()
      });
    });

    // Add recent project updates from state.requests
    cachedReqs.slice(0, 8).forEach((req, idx) => {
      const minutesAgo = (idx + 1) * 16;
      items.push({
        user: req.salesRep || req.artist || 'Sales',
        roleType: req.artist ? 'artist' : 'sales',
        action: req.projectStatus === 'Completed' ? 'COMPLETED' : 'UPDATE',
        module: 'Sales Requests',
        desc: `Updated project <strong>${escapeHTML(req.projectName)}</strong> (${escapeHTML(req.client || 'Client')})`,
        projectId: req.requestId,
        time: `${minutesAgo}m ago`,
        type: 'orders',
        timestamp: Date.now() - (minutesAgo * 60 * 1000)
      });
    });

    // Sort descending by recency
    items.sort((a, b) => b.timestamp - a.timestamp);

    // Apply category filter
    if (filter !== 'all') {
      items = items.filter(it => it.type === filter);
    }

    if (items.length === 0) {
      feed.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:12px;">No activity logged for this category.</div>`;
      return;
    }

    feed.innerHTML = items.slice(0, 5).map(it => {
      const avatarInitial = (it.user || 'S').substring(0, 1).toUpperCase();
      const avatarClass = `activity-avatar-${it.roleType}`;
      const projectPill = it.projectId ? `
        <span class="activity-project-pill" onclick="window.SignDepotApp.filterByDeadlineProject('${it.projectId}')" title="Highlight in table">
          ${escapeHTML(it.projectId)}
        </span>
      ` : '';

      return `
        <div class="activity-feed-item">
          <div class="activity-avatar ${avatarClass}">
            ${escapeHTML(avatarInitial)}
          </div>
          <div class="activity-details">
            <div class="activity-header-line">
              <span class="activity-user-name">${escapeHTML(it.user)}</span>
              <span class="activity-time-ago">${escapeHTML(it.time)}</span>
            </div>
            <div class="activity-desc-text">
              ${it.desc}
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="activity-module-tag">${escapeHTML(it.module)}</span>
              ${projectPill}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function formatRelativeTime(dateStr) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';
      const diffMs = Date.now() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  }

  // Panze Middle Column: Donut Chart
  function renderPanzeDonutChart() {
    const container = document.getElementById('panzeDonutChartSvgContainer');
    const legend = document.getElementById('panzeDonutLegend');
    if (!container || !legend) return;

    const reqs = state.requests;
    const completed = reqs.filter(r => r.projectStatus === 'Completed').length;
    const inProgress = reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const pending = reqs.filter(r => r.projectStatus === 'Pending').length;
    const revising = reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;

    const total = completed + inProgress + pending + revising || 1;

    // Donut SVG Parameters
    const size = 200;
    const center = size / 2;
    const radius = 70;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    const segCompleted = (completed / total) * circumference;
    const segInProgress = (inProgress / total) * circumference;
    const segPending = (pending / total) * circumference;
    const segRevising = (revising / total) * circumference;

    const offsetCompleted = 0;
    const offsetInProgress = -segCompleted;
    const offsetPending = -(segCompleted + segInProgress);
    const offsetRevising = -(segCompleted + segInProgress + segPending);

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${size} ${size}">
        <!-- Completed (Green) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#10B981" stroke-width="${strokeWidth}"
          stroke-dasharray="${segCompleted} ${circumference}"
          stroke-dashoffset="${offsetCompleted}" />
        <!-- In Progress (Orange / Blue) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#F97316" stroke-width="${strokeWidth}"
          stroke-dasharray="${segInProgress} ${circumference}"
          stroke-dashoffset="${offsetInProgress}" />
        <!-- Pending (Sky Blue) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#0284C7" stroke-width="${strokeWidth}"
          stroke-dasharray="${segPending} ${circumference}"
          stroke-dashoffset="${offsetPending}" />
        <!-- Revising (Purple) -->
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
          stroke="#8B5CF6" stroke-width="${strokeWidth}"
          stroke-dasharray="${segRevising} ${circumference}"
          stroke-dashoffset="${offsetRevising}" />
        <text x="${center}" y="${center + 5}" text-anchor="middle" font-size="22" font-weight="800" fill="#0F172A">${total}</text>
        <text x="${center}" y="${center + 22}" text-anchor="middle" font-size="10" font-weight="700" fill="#64748B">PROJECTS</text>
      </svg>
    `;

    legend.innerHTML = `
      <div class="legend-item"><span class="legend-dot" style="background:#10B981;"></span> Completed: ${completed}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#F97316;"></span> In Progress: ${inProgress}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#0284C7;"></span> Pending: ${pending}</div>
      <div class="legend-item"><span class="legend-dot" style="background:#8B5CF6;"></span> Revising: ${revising}</div>
    `;
  }

  // Panze Right Column: Artist Capacity
  function renderDashboardWorkloadSnapshot() {
    const listEl = document.getElementById('dashboardWorkloadSummaryList');
    if (!listEl) return;

    const reqs = state.requests;
    const summaries = state.artists.slice(0, 5).map(artist => {
      const activeTasks = reqs.filter(r => r.artist === artist && r.projectStatus !== 'Completed').length;
      const capacity = 10;
      const pct = Math.min(Math.round((activeTasks / capacity) * 100), 100);
      const avail = getAvailabilityBadge(activeTasks);
      return { artist, activeTasks, pct, avail };
    });

    listEl.innerHTML = summaries.map(item => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #F1F5F9; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px; min-width:110px;">
          <div class="user-avatar" style="width:28px; height:28px; font-size:10px;">${escapeHTML(item.artist.substring(0, 2).toUpperCase())}</div>
          <span style="font-weight:700; font-size:13px;">${escapeHTML(item.artist)}</span>
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:600;">
            <span>${item.activeTasks} Active</span>
            <span>${item.pct}%</span>
          </div>
          <div style="height:6px; background:#F1F5F9; border-radius:99px; overflow:hidden;">
            <div style="height:100%; width:${item.pct}%; background:${item.pct >= 80 ? 'var(--accent-red)' : item.pct >= 50 ? '#F59E0B' : 'var(--primary-green)'};"></div>
          </div>
        </div>
        <span class="badge ${item.avail.class}" style="font-size:9.5px;">${item.avail.text}</span>
      </div>
    `).join('');
  }

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
  function renderDashboardRecentProjectsTable() {
    const tbody = document.getElementById('dashboardRecentProjectsBody');
    if (!tbody) return;

    let list = [...state.requests];
    const search = (state.dashboardSearch || '').toLowerCase();
    const status = state.dashboardStatus || '';

    if (search) {
      list = list.filter(r =>
        r.requestId.toLowerCase().includes(search) ||
        r.joNumber.toLowerCase().includes(search) ||
        r.projectName.toLowerCase().includes(search) ||
        r.client.toLowerCase().includes(search)
      );
    }
    if (status) {
      list = list.filter(r => r.projectStatus === status);
    }
    const deadlineFilter = state.dashboardDeadline || '';
    if (deadlineFilter) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
        if (deadlineFilter === 'overdue') return info.status === 'overdue';
        if (deadlineFilter === 'today') return info.status === 'today';
        if (deadlineFilter === 'soon') return info.status === 'soon';
        return true;
      });
    }

    if (state.dashboardKpiFilter && state.dashboardKpiFilter !== 'all') {
      const kf = state.dashboardKpiFilter;
      if (kf === 'pending') {
        list = list.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
      } else if (kf === 'working') {
        list = list.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
      } else if (kf === 'completed') {
        list = list.filter(r => r.projectStatus === 'Completed');
      } else if (kf === 'revising') {
        list = list.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
      } else if (kf === 'overdue') {
        list = list.filter(r => isOverdue(r.designDeadline, r.projectStatus));
      }
    }

    // Sync active KPI filter banner & card highlights
    const kpiBanner = document.getElementById('activeKpiFilterBanner');
    if (kpiBanner) {
      if (state.dashboardKpiFilter && state.dashboardKpiFilter !== 'all') {
        const labels = {
          pending: 'Pending Approval',
          working: 'Working / On-Going',
          completed: 'Completed',
          revising: 'Revising',
          overdue: 'Overdue'
        };
        const label = labels[state.dashboardKpiFilter] || state.dashboardKpiFilter;
        kpiBanner.style.display = 'inline-flex';
        kpiBanner.innerHTML = `
          <span>Filtered by: <strong>${escapeHTML(label)}</strong> (${list.length} records)</span>
          <button class="clear-kpi-btn" title="Clear filter" onclick="window.SignDepotApp.handleKpiCardClick('all')">&times;</button>
        `;
      } else {
        kpiBanner.style.display = 'none';
        kpiBanner.innerHTML = '';
      }
    }

    const kpiCardMap = {
      all: document.getElementById('kpiCardTotal'),
      pending: document.getElementById('kpiCardPending'),
      working: document.getElementById('kpiCardWorking'),
      completed: document.getElementById('kpiCardCompleted'),
      revising: document.getElementById('kpiCardRevising'),
      overdue: document.getElementById('kpiCardOverdue')
    };
    Object.entries(kpiCardMap).forEach(([k, card]) => {
      if (!card) return;
      const isAct = (state.dashboardKpiFilter || 'all') === k;
      card.classList.toggle('active', isAct);
    });

    const page = state.dashboardPage || 1;
    const perPage = state.dashboardPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'dashboardPaginationInfo',
      controlsId: 'dashboardPaginationControls',
      selectIds: ['dashboardFilterPerPage', 'dashboardPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems: list.length,
      onPageChange: 'window.SignDepotApp.setDashboardPage',
      itemLabel: 'projects'
    });

    state.dashboardPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    if (pagedList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">No projects match current filters.</td></tr>`;
      return;
    }

    const isSuper = isCurrentUserSuperAdmin();
    tbody.innerHTML = pagedList.map(r => `
      <tr data-req-id="${r.id}">
        <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color:var(--primary-green); font-weight:700;')}</td>
        <td>${renderEditableCell(r.id, 'joNumber', r.joNumber, '', 'color:var(--accent-red); font-weight:700;')}</td>
        <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
        <td>${renderEditableCell(r.id, 'client', r.client)}</td>
        <td>${renderInlineSelect(r.id, 'location', r.location || 'Indoor', ['Indoor', 'Outdoor', 'Indoor & Outdoor'])}</td>
        <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
        <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
        <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
        <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
        <td>
          <div style="display:flex; gap:4px; align-items:center;">
            <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">
              Directive
            </button>
            ${isSuper ? `
              <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Project (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // MODULE 2: SALES REQUESTS ENGINE (Direct Inline Editable Table)
  // ==========================================================================

  function renderSalesRequests() {
    populateSalesFiltersDropdowns();

    // Live Client Approval Status Tab Counts
    const allCount = state.requests.length;
    const pendingCount = state.requests.filter(r => r.clientApproval === 'Pending').length;
    const revisionCount = state.requests.filter(r => r.clientApproval === 'Revision Requested').length;
    const approvedCount = state.requests.filter(r => r.clientApproval === 'Approved').length;

    const elAll = document.getElementById('badgeCountAll');
    if (elAll) elAll.textContent = allCount;
    const elPending = document.getElementById('badgeCountPending');
    if (elPending) elPending.textContent = pendingCount;
    const elRevision = document.getElementById('badgeCountRevision');
    if (elRevision) elRevision.textContent = revisionCount;
    const elApproved = document.getElementById('badgeCountApproved');
    if (elApproved) elApproved.textContent = approvedCount;

    // Sync active approval tab button respecting permissions
    const tabKeyMap = { '': 'all', 'Pending': 'pending', 'Revision Requested': 'revision', 'Approved': 'approved' };
    let curTabKey = tabKeyMap[state.salesFilter.approvalTab || ''] || 'all';
    if (!canUserAccessTab('sales-requests', curTabKey)) {
      const allowedTabKey = ['all', 'pending', 'revision', 'approved'].find(k => canUserAccessTab('sales-requests', k));
      if (allowedTabKey) {
        const revMap = { 'all': '', 'pending': 'Pending', 'revision': 'Revision Requested', 'approved': 'Approved' };
        state.salesFilter.approvalTab = revMap[allowedTabKey];
      }
    }
    const activeApprovalTab = state.salesFilter.approvalTab || '';
    document.querySelectorAll('.sales-approval-tab').forEach(tabBtn => {
      const tabVal = tabBtn.getAttribute('data-tab-approval') || '';
      const isAct = tabVal === activeApprovalTab;
      tabBtn.classList.toggle('active', isAct);
      tabBtn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    let list = [...state.requests];
    const { search, priority, approval, fileSent, salesRep, location, sortField, sortDir, page, perPage } = state.salesFilter;

    // Filter by approval tab
    if (activeApprovalTab) {
      list = list.filter(r => r.clientApproval === activeApprovalTab);
    }

    // Filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.requestId.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        (r.location && r.location.toLowerCase().includes(q))
      );
    }
    if (priority) list = list.filter(r => r.priority === priority);
    if (approval) list = list.filter(r => r.clientApproval === approval);
    if (fileSent) list = list.filter(r => r.fileSent === fileSent);
    if (salesRep) list = list.filter(r => r.salesRep === salesRep);
    if (location) list = list.filter(r => (r.location || 'Indoor').toLowerCase() === location.toLowerCase());
    if (state.salesFilter.deadline) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
        if (state.salesFilter.deadline === 'overdue') return info.status === 'overdue';
        if (state.salesFilter.deadline === 'today') return info.status === 'today';
        if (state.salesFilter.deadline === 'soon') return info.status === 'soon';
        return true;
      });
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = list.length;
    const { validPage, startIndex } = renderPagination({
      infoId: 'salesPaginationInfo',
      controlsId: 'salesPaginationControls',
      selectIds: ['salesFilterPerPage', 'salesPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setSalesPage',
      itemLabel: 'requests'
    });

    state.salesFilter.page = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('salesRequestsTableBody');
    if (tbody) {
      const draftHTML = state.draftSalesRequest ? renderDraftSalesRowHTML(state.draftSalesRequest) : '';

      if (pagedList.length === 0 && !draftHTML) {
        tbody.innerHTML = `<tr><td colspan="18" style="text-align:center; padding:32px 20px; color:var(--text-muted); font-size:13px;">No sales requests match the current filters. Click <strong>+ Add Request</strong> above to add a new row directly to this table!</td></tr>`;
      } else {
        const isSuper = isCurrentUserSuperAdmin();
        const rowsHTML = pagedList.map(r => `
          <tr data-req-id="${r.id}">
            <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color: var(--primary-green); font-weight: 700; min-width: 95px;')}</td>
            <td>${renderEditableCell(r.id, 'joNumber', r.joNumber, '', 'color: var(--accent-red); font-weight: 700; min-width: 105px;')}</td>
            <td>${renderInlineDate(r.id, 'orderDate', r.orderDate)}</td>
            <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
            <td>${renderEditableCell(r.id, 'client', r.client, '', 'min-width: 140px;')}</td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName, '', 'min-width: 170px; font-weight: 600;')}</td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
            <td>${renderInlineDate(r.id, 'releasingDate', r.releasingDate)}</td>
            <td>${renderInlineSelect(r.id, 'fileSent', r.fileSent || 'N/A', FILE_STATUS_LEVELS)}</td>
            <td>${renderEditableCell(r.id, 'completeAddress', r.completeAddress, '', 'min-width: 190px;')}</td>
            <td>${renderInlineSelect(r.id, 'location', r.location || 'N/A', PLACEMENT_OPTIONS)}</td>
            <td>${renderInlineSelect(r.id, 'releasingMode', r.releasingMode || 'N/A', RELEASING_MODES)}</td>
            <td>${renderEditableCell(r.id, 'contactPerson', r.contactPerson, '', 'min-width: 130px;')}</td>
            <td>${renderEditableCell(r.id, 'contactNumber', r.contactNumber, '', 'min-width: 120px;')}</td>
            <td>${renderInlineSelect(r.id, 'clientApproval', r.clientApproval || 'Pending Approval', APPROVAL_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'priority', r.priority || 'Normal', PRIORITY_LEVELS)}</td>
            <td>
              <div style="display:flex; gap:4px; align-items:center;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="Open Job Directive">
                  Directive
                </button>
                <button class="btn btn-secondary btn-sm btn-icon-only" onclick="window.SignDepotApp.editSalesRequest('${r.id}')" title="Edit Full Details">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                ${isSuper ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Request (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');

        tbody.innerHTML = draftHTML + rowsHTML;
      }
    }
  }

  function populateSalesFiltersDropdowns() {
    state.salesReps = state.salesReps.filter(s => s && s.toLowerCase() !== 'shela');
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
      state.artists.forEach(a => {
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
      state.salesReps.forEach(s => {
        const titleS = toTitleCase(s);
        const opt = document.createElement('option');
        opt.value = titleS;
        opt.textContent = titleS;
        modalSalesSelect.appendChild(opt);
      });
      if (curRep && curRep.toLowerCase() !== 'shela') {
        modalSalesSelect.value = curRep;
      } else if (curRep && curRep.toLowerCase() === 'shela') {
        modalSalesSelect.value = 'Shella';
      }
    }

    upgradeAllFormSelects();
  }

  function resetSalesRequestsFilters() {
    state.salesFilter = {
      search: '',
      priority: '',
      approval: '',
      fileSent: '',
      salesRep: '',
      location: '',
      deadline: '',
      sortField: 'orderDate',
      sortDir: 'desc',
      page: 1,
      perPage: getStoredRowsPerPage(),
      approvalTab: ''
    };

    const salesSearch = document.getElementById('salesSearchInput');
    if (salesSearch) salesSearch.value = '';

    const filterIds = [
      'salesFilterPriority',
      'salesFilterApproval',
      'salesFilterLocation',
      'salesFilterFileSent',
      'salesFilterSalesRep',
      'salesFilterDeadline'
    ];

    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        syncFilterSelectUI(el);
      }
    });

    // Reset approval tab buttons to All
    document.querySelectorAll('.sales-approval-tab').forEach(tab => {
      const isAll = !tab.getAttribute('data-tab-approval');
      tab.classList.toggle('active', isAll);
      tab.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    renderSalesRequests();
    showToast('Sales filters have been reset.');
  }

  // ==========================================================================
  // MODULE 3: CREATIVES TRACKER (Google Sheets Replica with Inline Editing)
  // ==========================================================================

  function matchesTrackerDateFilter(r, filter) {
    if (!filter) return true;
    const { datePreset, dateCustom, dateColumn } = filter;
    if (!datePreset && !dateCustom) return true;

    let targetDates = [];
    if (dateColumn === 'any') {
      targetDates = [r.orderDate, r.designDeadline, r.dateUpdated, r.timestamp].filter(Boolean);
    } else if (dateColumn === 'designDeadline') {
      targetDates = [r.designDeadline].filter(Boolean);
    } else if (dateColumn === 'dateUpdated') {
      targetDates = [r.dateUpdated].filter(Boolean);
    } else {
      targetDates = [r.orderDate, r.timestamp].filter(Boolean);
    }

    if (targetDates.length === 0) return false;

    const itemDateStrs = targetDates.map(d => {
      const m = String(d).match(/\d{4}-\d{2}-\d{2}/);
      return m ? m[0] : '';
    }).filter(Boolean);

    if (itemDateStrs.length === 0) return false;

    const now = new Date();
    const formatYMD = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const todayStr = formatYMD(now);

    if (datePreset === 'today') {
      return itemDateStrs.some(ds => ds === todayStr);
    }

    if (datePreset === 'yesterday') {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const yestStr = formatYMD(yest);
      return itemDateStrs.some(ds => ds === yestStr);
    }

    if (datePreset === 'this_week') {
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const monStr = formatYMD(monday);
      const sunStr = formatYMD(sunday);
      return itemDateStrs.some(ds => ds >= monStr && ds <= sunStr);
    }

    if (datePreset === 'this_month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const prefix = `${y}-${m}`;
      return itemDateStrs.some(ds => ds.startsWith(prefix));
    }

    if (datePreset === 'custom' || (!datePreset && dateCustom)) {
      if (!dateCustom) return true;
      return itemDateStrs.some(ds => ds === dateCustom);
    }

    return true;
  }

  function renderCreativesTracker() {
    populateTrackerFiltersDropdowns();
    updateDashboardKPIs();

    const myArtist = getLoggedInArtist();
    let list = [...state.requests];

    // Artist-scoped filter: if logged in as an artist, show ONLY their assigned tasks!
    if (myArtist) {
      list = list.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase());

      // Show artist banner on tracker header
      const titleWrap = document.querySelector('#view-creatives-tracker .section-title-wrap');
      if (titleWrap && !document.getElementById('artistScopedTrackerBanner')) {
        const banner = document.createElement('div');
        banner.id = 'artistScopedTrackerBanner';
        banner.style.cssText = 'display:inline-flex; align-items:center; gap:6px; background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; margin-top:6px;';
        banner.innerHTML = `<span>🎨 Filtered to Your Assigned Tasks: <strong>${escapeHTML(myArtist)}</strong></span>`;
        titleWrap.appendChild(banner);
      }
    }

    const { search, projectStatus, designStatus, artist, overdue, sortField, sortDir, page, perPage } = state.trackerFilter;

    // Apply KPI filter if active on Creatives Tracker
    if (state.trackerKpiFilter && state.trackerKpiFilter !== 'all') {
      const kf = state.trackerKpiFilter;
      if (kf === 'pending') {
        list = list.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending');
      } else if (kf === 'working') {
        list = list.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress');
      } else if (kf === 'approved') {
        list = list.filter(r => r.projectStatus === 'Approved' || r.clientApproval === 'Approved');
      } else if (kf === 'revising') {
        list = list.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising');
      } else if (kf === 'overdue') {
        list = list.filter(r => isOverdue(r.designDeadline, r.projectStatus));
      }
    }

    // Sync active KPI filter banner & card highlights on Creatives Tracker
    const kpiBanner = document.getElementById('trackerKpiFilterBanner');
    if (kpiBanner) {
      if (state.trackerKpiFilter && state.trackerKpiFilter !== 'all') {
        const labels = {
          pending: 'Pending Approval',
          working: 'Working / On-Going',
          approved: 'Approved',
          revising: 'Revising',
          overdue: 'Overdue'
        };
        const label = labels[state.trackerKpiFilter] || state.trackerKpiFilter;
        kpiBanner.style.display = 'inline-flex';
        kpiBanner.innerHTML = `
          <span>Filtered: <strong>${escapeHTML(label)}</strong> (${list.length} tasks)</span>
          <button class="clear-kpi-btn" title="Clear filter" onclick="window.SignDepotApp.applyKpiFilterToCreativesTracker('all')">&times; Show All</button>
        `;
      } else {
        kpiBanner.style.display = 'none';
        kpiBanner.innerHTML = '';
      }
    }

    const trackerKpiCardMap = {
      all: document.getElementById('trackerKpiCardTotal'),
      pending: document.getElementById('trackerKpiCardPending'),
      working: document.getElementById('trackerKpiCardWorking'),
      approved: document.getElementById('trackerKpiCardApproved'),
      revising: document.getElementById('trackerKpiCardRevising'),
      overdue: document.getElementById('trackerKpiCardOverdue')
    };
    Object.entries(trackerKpiCardMap).forEach(([k, card]) => {
      if (!card) return;
      const isAct = (state.trackerKpiFilter || 'all') === k;
      card.classList.toggle('active', isAct);
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.requestId.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.remarks.toLowerCase().includes(q)
      );
    }
    if (projectStatus) list = list.filter(r => r.projectStatus === projectStatus);
    if (designStatus) list = list.filter(r => r.designStatus === designStatus);
    if (!myArtist && artist) list = list.filter(r => r.artist === artist);
    if (overdue) {
      list = list.filter(r => {
        const info = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
        if (overdue === 'overdue') return info.status === 'overdue';
        if (overdue === 'today') return info.status === 'today';
        if (overdue === 'soon') return info.status === 'soon';
        if (overdue === 'ontime') return info.status === 'ontrack' || (!isOverdue(r.designDeadline, r.projectStatus) && info.status !== 'soon' && info.status !== 'today');
        return true;
      });
    }

    // Apply Date Filter
    if (state.trackerFilter.datePreset || state.trackerFilter.dateCustom) {
      list = list.filter(r => matchesTrackerDateFilter(r, state.trackerFilter));
    }

    // Sort Table Rows (Default: Latest to Old based on Request ID)
    const effectiveSortField = sortField || 'requestId';
    const effectiveSortDir = sortDir || 'desc';

    list.sort((a, b) => {
      let valA = a[effectiveSortField];
      let valB = b[effectiveSortField];
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Natural Request ID sort (Latest to Old default)
      if (effectiveSortField === 'requestId' || effectiveSortField === 'id') {
        const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
        return effectiveSortDir === 'asc' ? cmp : -cmp;
      }

      // Numeric count columns
      if (['countStandard', 'countSpecial', 'countPrinting', 'revisionCount'].includes(effectiveSortField)) {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return effectiveSortDir === 'asc' ? numA - numB : numB - numA;
      }

      // Date columns (chronological)
      if (['designDeadline', 'orderDate', 'dateUpdated', 'timestamp'].includes(effectiveSortField)) {
        const timeA = (valA && valA !== 'N/A') ? new Date(valA).getTime() : 0;
        const timeB = (valB && valB !== 'N/A') ? new Date(valB).getTime() : 0;
        if (timeA && timeB && !isNaN(timeA) && !isNaN(timeB)) {
          return effectiveSortDir === 'asc' ? timeA - timeB : timeB - timeA;
        }
      }

      // Overdue severity sort
      if (effectiveSortField === 'deadlineStatus') {
        const rank = { overdue: 4, today: 3, soon: 2, ontrack: 1, completed: 0 };
        const statusA = getDeadlineAlertStatus(a.designDeadline, a.projectStatus).status;
        const statusB = getDeadlineAlertStatus(b.designDeadline, b.projectStatus).status;
        const diff = (rank[statusA] || 0) - (rank[statusB] || 0);
        return effectiveSortDir === 'asc' ? diff : -diff;
      }

      // Alphabetical sort (A-Z or Z-A)
      const cmp = String(valA).trim().localeCompare(String(valB).trim(), undefined, { sensitivity: 'base' });
      return effectiveSortDir === 'asc' ? cmp : -cmp;
    });

    // Update Interactive Sort Badges on Table Headers
    document.querySelectorAll('#view-creatives-tracker .data-table th[data-sort]').forEach(th => {
      const f = th.getAttribute('data-sort');
      th.classList.remove('sort-asc', 'sort-desc');
      const oldPill = th.querySelector('.sort-indicator-pill');
      if (oldPill) oldPill.remove();

      if (f === effectiveSortField) {
        const isAsc = effectiveSortDir === 'asc';
        th.classList.add(isAsc ? 'sort-asc' : 'sort-desc');
        const pill = document.createElement('span');
        pill.className = 'sort-indicator-pill';
        if (f === 'requestId') {
          pill.textContent = isAsc ? '↑ Oldest' : '↓ Latest';
        } else if (['countStandard', 'countSpecial', 'countPrinting', 'revisionCount'].includes(f)) {
          pill.textContent = isAsc ? '↑ 1-9' : '↓ 9-1';
        } else if (['designDeadline', 'orderDate', 'dateUpdated'].includes(f)) {
          pill.textContent = isAsc ? '↑ Earliest' : '↓ Newest';
        } else {
          pill.textContent = isAsc ? '↑ A-Z' : '↓ Z-A';
        }
        th.appendChild(pill);
      }
    });

    // Sync sort dropdown in filter toolbar
    const sortDropdown = document.getElementById('trackerSortDropdown');
    if (sortDropdown) {
      const targetVal = `${effectiveSortField}_${effectiveSortDir}`;
      if (sortDropdown.querySelector(`option[value="${targetVal}"]`)) {
        sortDropdown.value = targetVal;
      }
    }

    const totalItems = list.length;
    const { validPage, startIndex } = renderPagination({
      infoId: 'trackerPaginationInfo',
      controlsId: 'trackerPaginationControls',
      selectIds: ['trackerFilterPerPage', 'trackerPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setTrackerPage',
      itemLabel: 'tasks'
    });

    state.trackerFilter.page = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('creativesTrackerTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; padding:30px; color:var(--text-muted);">No tasks match the filters.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => {
          const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
          let deadlineStatusBadge = '<span style="color:#10B981; font-weight:700; font-size:11px;">ON TRACK</span>';
          if (alertInfo.status === 'overdue') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-overdue">${escapeHTML(alertInfo.diffText)}</span>`;
          } else if (alertInfo.status === 'today') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-today">Due Today</span>`;
          } else if (alertInfo.status === 'soon') {
            deadlineStatusBadge = `<span class="deadline-pill deadline-pill-soon">${escapeHTML(alertInfo.diffText)}</span>`;
          }

          const isSuper = isCurrentUserSuperAdmin();
          return `
            <tr data-req-id="${r.id}">
              <td>${renderEditableCell(r.id, 'requestId', r.requestId, '', 'color:var(--primary-green); font-weight:700;')}</td>
              <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
              <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
              <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
              <td>${renderInlineSelect(r.id, 'headApproval', r.headApproval || 'Pending', HEAD_APPROVAL_LEVELS)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countStandard', r.countStandard)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countSpecial', r.countSpecial)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countPrinting', r.countPrinting)}</td>
              <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus || 'On-going', PROJECT_STATUSES)}</td>
              <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus || 'On Queue', DESIGN_STATUSES)}</td>
              <td style="text-align:center;">
                ${deadlineStatusBadge}
              </td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
              <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
              <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
              <td style="font-size:12px; color:var(--text-secondary); white-space:nowrap;">${escapeHTML(r.orderDate || r.timestamp || 'N/A')}</td>
              <td style="font-size:12px; color:var(--text-secondary); white-space:nowrap;">${escapeHTML(r.dateUpdated || r.orderDate || 'N/A')}</td>
              <td>
                <div style="display:flex; gap:4px; align-items:center;">
                  <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                  ${isSuper ? `
                    <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Task (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  function populateTrackerFiltersDropdowns() {
    const myArtist = getLoggedInArtist();
    const artistSelect = document.getElementById('trackerFilterArtist');
    if (artistSelect) {
      if (myArtist) {
        artistSelect.innerHTML = `<option value="${escapeHTML(myArtist)}" selected>🎨 ${escapeHTML(myArtist)} (You)</option>`;
        artistSelect.disabled = true;
        artistSelect.title = `Your account is linked to ${myArtist}. Only your assigned tasks are shown.`;
        artistSelect.style.background = '#ECFDF5';
        artistSelect.style.borderColor = '#10B981';
        artistSelect.style.color = '#065F46';
        artistSelect.style.fontWeight = '700';
      } else if (artistSelect.children.length <= 1) {
        state.artists.forEach(a => {
          const titleA = toTitleCase(a);
          const opt = document.createElement('option');
          opt.value = titleA;
          opt.textContent = titleA;
          artistSelect.appendChild(opt);
        });
      }
    }

    const modalArtistSelect = document.getElementById('trackerFormArtist');
    if (modalArtistSelect) {
      if (modalArtistSelect.children.length === 0) {
        state.artists.forEach(a => {
          const titleA = toTitleCase(a);
          const opt = document.createElement('option');
          opt.value = titleA;
          opt.textContent = titleA;
          modalArtistSelect.appendChild(opt);
        });
      }
      if (myArtist) {
        modalArtistSelect.value = toTitleCase(myArtist);
      }
    }

    upgradeAllFormSelects();
  }

  function resetCreativesTrackerFilters() {
    const myArtist = getLoggedInArtist();
    state.trackerFilter = {
      search: '',
      projectStatus: '',
      designStatus: '',
      artist: myArtist || '',
      overdue: '',
      datePreset: '',
      dateCustom: '',
      dateColumn: 'orderDate',
      sortField: 'requestId',
      sortDir: 'desc',
      page: 1,
      perPage: getStoredRowsPerPage()
    };
    state.trackerKpiFilter = 'all';

    const trackerSearch = document.getElementById('trackerSearchInput');
    if (trackerSearch) trackerSearch.value = '';

    ['trackerFilterProjectStatus', 'trackerFilterDesignStatus', 'trackerFilterOverdue', 'trackerFilterDatePreset'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        syncFilterSelectUI(el);
      }
    });

    const dateCol = document.getElementById('trackerFilterDateColumn');
    if (dateCol) {
      dateCol.value = 'orderDate';
      syncFilterSelectUI(dateCol);
    }

    const dateCust = document.getElementById('trackerFilterDateCustom');
    if (dateCust) {
      dateCust.value = '';
      dateCust.style.display = 'none';
    }

    const sortDropdown = document.getElementById('trackerSortDropdown');
    if (sortDropdown) {
      sortDropdown.value = 'requestId_desc';
      syncFilterSelectUI(sortDropdown);
    }

    const artEl = document.getElementById('trackerFilterArtist');
    if (artEl) {
      artEl.value = myArtist || '';
      syncFilterSelectUI(artEl);
    }

    // Reset KPI cards active state
    document.querySelectorAll('#view-creatives-tracker .kpi-card').forEach(c => {
      c.classList.remove('active');
    });
    const totalCard = document.getElementById('trackerKpiCardTotal');
    if (totalCard) totalCard.classList.add('active');

    renderCreativesTracker();
    showToast('Tracker filters have been reset.');
  }

  // ==========================================================================
  // MODULE 4: ARTIST WORKLOAD ENGINE
  // ==========================================================================

  function renderArtistWorkload() {
    const grid = document.getElementById('artistWorkloadCardsGrid');
    if (!grid) return;

    const reqs = state.requests;
    const filterAvail = state.workloadFilter.availability;

    const artistData = state.artists.filter(a => a !== 'Rodel' && a !== 'Benjie' && a !== 'Seven' && a !== 'Edrian').map(artist => {
      const activeAssignments = reqs.filter(r => r.artist === artist && r.projectStatus !== 'Completed');
      let std = 0, prt = 0, spc = 0;
      activeAssignments.forEach(a => {
        std += (a.countStandard || 0);
        prt += (a.countPrinting || 0);
        spc += (a.countSpecial || 0);
      });
      const activeCount = activeAssignments.length;
      const capacity = 10;
      const avail = getAvailabilityBadge(activeCount);
      const pct = Math.min(Math.round((activeCount / capacity) * 100), 100);

      return {
        artist,
        activeAssignments,
        activeCount,
        std,
        prt,
        spc,
        capacity,
        avail,
        pct
      };
    });

    let filtered = artistData;
    if (filterAvail) {
      filtered = filtered.filter(a => a.avail.text === filterAvail);
    }

    grid.innerHTML = filtered.map(a => `
      <div class="studio-card" style="cursor:pointer;" onclick="window.SignDepotApp.selectWorkloadArtist('${a.artist}')">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="user-avatar" style="width:36px; height:36px;">${escapeHTML(a.artist.substring(0, 2).toUpperCase())}</div>
            <div>
              <h4 style="font-size:15px; font-weight:800;">${escapeHTML(a.artist)}</h4>
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600;">${a.activeCount} Active Tasks</span>
            </div>
          </div>
          <span class="badge ${a.avail.class}">${a.avail.text}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:#F8FAFC; border:1px solid var(--border-light); padding:8px 10px; border-radius:var(--radius-md); text-align:center; margin-bottom:12px;">
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Standard</div>
            <div style="font-size:14px; font-weight:800; color:var(--primary-green);">${a.std}</div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Printing</div>
            <div style="font-size:14px; font-weight:800; color:#3B82F6;">${a.prt}</div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Special</div>
            <div style="font-size:14px; font-weight:800; color:var(--accent-red);">${a.spc}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; font-weight:600;">
          <span>Capacity (${a.activeCount}/${a.capacity})</span>
          <span>${a.pct}%</span>
        </div>
        <div style="height:6px; background:#F1F5F9; border-radius:99px; overflow:hidden;">
          <div style="height:100%; width:${a.pct}%; background:${a.pct >= 80 ? 'var(--accent-red)' : a.pct >= 50 ? '#F59E0B' : 'var(--primary-green)'};"></div>
        </div>
      </div>
    `).join('');

    renderWorkloadDetailsTable();
  }

  function renderWorkloadDetailsTable() {
    const selectedArtist = state.workloadFilter.selectedArtist;
    const titleEl = document.getElementById('workloadSelectedArtistTitle');
    if (titleEl) {
      titleEl.textContent = selectedArtist ? `Active Assignments for ${selectedArtist}` : 'All Active Artist Assignments';
    }

    let list = state.requests.filter(r => r.projectStatus !== 'Completed' && r.artist !== 'Rodel' && r.artist !== 'Benjie');
    if (selectedArtist) {
      list = list.filter(r => r.artist === selectedArtist);
    }

    const search = state.workloadFilter.search;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.projectName.toLowerCase().includes(q) || r.requestId.toLowerCase().includes(q));
    }

    const totalItems = list.length;
    const page = state.workloadPage || 1;
    const perPage = state.workloadPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'workloadPaginationInfo',
      controlsId: 'workloadPaginationControls',
      selectIds: ['workloadFilterPerPage', 'workloadPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setWorkloadPage',
      itemLabel: 'assignments'
    });

    state.workloadPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('artistWorkloadDetailsTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No active tasks for selected artist.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => {
          const alertInfo = getDeadlineAlertStatus(r.designDeadline, r.projectStatus);
          let deadlineBadge = '';
          if (alertInfo.status === 'overdue') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-overdue">${escapeHTML(alertInfo.diffText)}</span>`;
          } else if (alertInfo.status === 'today') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-today">Due Today</span>`;
          } else if (alertInfo.status === 'soon') {
            deadlineBadge = ` <span class="deadline-pill deadline-pill-soon">${escapeHTML(alertInfo.diffText)}</span>`;
          }

          const categoryBadge = r.countSpecial > 0 
            ? '<span class="badge badge-priority-high">Special</span>' 
            : (r.countPrinting > 0 ? '<span class="badge badge-ongoing">Printing</span>' : '<span class="badge badge-not-started">Standard</span>');

          const pStatus = (typeof r.projectStatus === 'string' && r.projectStatus.trim()) ? r.projectStatus.trim() : 'Pending';
          const dStatus = (typeof r.designStatus === 'string' && r.designStatus.trim() && r.designStatus !== '[object Object]') 
            ? r.designStatus.trim() 
            : (pStatus === 'Completed' ? 'Submitted' : (pStatus === 'On-going' ? 'In Progress' : 'Not Started'));

          return `
            <tr>
              <td><strong style="color:var(--primary-green); font-family:var(--font-mono, monospace);">${escapeHTML(r.requestId)}</strong></td>
              <td><span class="badge badge-artist" style="font-weight:700;">${escapeHTML(r.artist || '-')}</span></td>
              <td><span style="font-weight:600; color:var(--text-main);">${escapeHTML(r.projectName || '-')}</span></td>
              <td>${categoryBadge}</td>
              <td style="white-space:nowrap;">
                <span>${escapeHTML(r.designDeadline || '-')}</span>${deadlineBadge}
              </td>
              <td><span class="badge ${getStatusBadgeClass(pStatus)}">${escapeHTML(pStatus)}</span></td>
              <td><span class="badge ${getStatusBadgeClass(dStatus)}">${escapeHTML(dStatus)}</span></td>
              <td style="text-align:center;"><span style="font-weight:700; color:var(--text-secondary);">${r.revisionCount || 0}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="View Blueprint Directive">
                  Directive
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // ==========================================================================
  // MODULE 5: DIRECTIVES DETAILS (The Star Module)
  // ==========================================================================

  function getDirectiveRecord(joOrReq) {
    if (!joOrReq || !state.requests || state.requests.length === 0) return null;
    const clean = String(joOrReq).trim().toLowerCase();
    if (!clean) return null;

    // 1. Exact match by requestId (e.g. "LR-26-2102")
    let match = state.requests.find(r => r.requestId && String(r.requestId).trim().toLowerCase() === clean);
    if (match) return match;

    // 2. Exact match by id (e.g. 15, "15", "lr-26-2102")
    match = state.requests.find(r => r.id !== undefined && r.id !== null && String(r.id).trim().toLowerCase() === clean);
    if (match) return match;

    // 3. Exact match by joNumber (e.g. "P261001356")
    match = state.requests.find(r => r.joNumber && String(r.joNumber).trim().toLowerCase() === clean);
    if (match) return match;

    // 4. Exact match by projectName
    match = state.requests.find(r => r.projectName && String(r.projectName).trim().toLowerCase() === clean);
    if (match) return match;

    // 5. Fuzzy substring match by projectName
    match = state.requests.find(r => r.projectName && String(r.projectName).trim().toLowerCase().includes(clean));
    if (match) return match;

    return null;
  }

  // ==========================================================================
  // CUSTOMIZED PER-CELL FONT SIZE ENGINE (Customized per individual cell, not everything!)
  // ==========================================================================

  let activeDirectiveCell = null;

  function getCellFriendlyName(cell) {
    if (!cell) return 'Select Any Cell';
    if (cell.id === 'docFieldJoLabel' || cell.classList.contains('doc-jo-lbl')) return 'JO# Label';
    if (cell.id === 'docFieldJoNumber' || cell.classList.contains('doc-jo-val')) return 'JO Number';
    if (cell.id === 'docFieldProjectName' || cell.classList.contains('doc-proj-cell')) return 'Project Name';
    if (cell.id === 'docFieldClientName' || cell.classList.contains('doc-client-cell')) return 'Client Name';
    if (cell.id === 'docFieldDueDate' || cell.classList.contains('doc-date-val')) return 'Due Date';
    if (cell.id === 'docFieldDueDateLabel') return 'Due Date Label';
    if (cell.id === 'docFieldLocation') return 'Location';
    if (cell.id === 'docFieldLocationLabel') return 'Location Label';
    if (cell.id === 'docFieldContactPerson') return 'Contact Person';
    if (cell.id === 'docFieldContactPersonLabel') return 'Contact Person Label';
    if (cell.id === 'docFieldContactNumber') return 'Contact Number';
    if (cell.id === 'docFieldContactNumberLabel') return 'Contact Number Label';
    if (cell.id === 'docFieldOrderDate') return 'Order Date';
    if (cell.id === 'docFieldOrderDateLabel') return 'Order Date Label';
    if (cell.id === 'docFieldReleasingDate') return 'Releasing Date';
    if (cell.id === 'docFieldReleasingDateLabel') return 'Releasing Date Label';
    if (cell.id === 'docFieldReleasingMode') return 'Releasing Mode';
    if (cell.id === 'docFieldReleasingModeLabel') return 'Releasing Mode Label';
    if (cell.id === 'docFieldInstallers') return 'Installers';
    if (cell.id === 'docFieldInstallersLabel') return 'Installers Label';
    if (cell.id === 'docFieldDuration') return 'Duration';
    if (cell.id === 'docFieldDurationLabel') return 'Duration Label';
    if (cell.id === 'docFieldAddress') return 'Address';
    if (cell.id === 'docFieldAddressLabel') return 'Address Label';
    if (cell.id === 'docFieldInCharge') return 'In-Charge';
    if (cell.id === 'docFieldInChargeLabel') return 'In-Charge Label';
    if (cell.id === 'docFieldDrawnBy') return 'Drawn By';
    if (cell.id === 'docFieldDrawnByLabel') return 'Drawn By Label';
    return (cell.textContent || 'Selected Cell').trim().slice(0, 16);
  }

  function getCellDefaultFontSize(cell) {
    if (!cell) return 13;
    if (cell.id === 'docFieldJoLabel' || cell.classList.contains('doc-jo-lbl')) return 20;
    if (cell.classList.contains('doc-jo-val')) return 30;
    if (cell.classList.contains('doc-proj-cell')) return 30;
    if (cell.classList.contains('doc-client-cell')) return 26;
    if (cell.classList.contains('doc-date-val')) return 14.5;
    if (cell.classList.contains('doc-person-val')) return 13.5;
    if (cell.classList.contains('doc-box-val')) return 13;
    if (cell.classList.contains('doc-label-cell')) return 11.5;
    return 13;
  }

  function getCellCurrentFontSize(cell) {
    if (!cell) return 13;
    const custom = cell.getAttribute('data-custom-size');
    if (custom) return parseFloat(custom);
    const inline = cell.style.fontSize;
    if (inline) return parseFloat(inline);
    const computed = window.getComputedStyle(cell).fontSize;
    return parseFloat(computed) || getCellDefaultFontSize(cell);
  }

  function selectDirectiveCell(cell) {
    if (!cell) return;
    const table = document.getElementById('directiveGridTable');
    if (table) {
      table.querySelectorAll('.directive-active-cell').forEach(c => c.classList.remove('directive-active-cell'));
    }
    activeDirectiveCell = cell;
    cell.classList.add('directive-active-cell');

    const badge = document.getElementById('selectedCellBadge');
    if (badge) badge.textContent = getCellFriendlyName(cell);

    const input = document.getElementById('cellFontSizeInput');
    if (input) input.value = Math.round(getCellCurrentFontSize(cell));
  }

  function setCellCustomFontSize(cell, sizePx) {
    if (!cell) {
      cell = document.getElementById('docFieldProjectName') || document.querySelector('.doc-proj-cell');
      if (cell) selectDirectiveCell(cell);
    }
    if (!cell) return;

    const clamped = Math.max(6, Math.min(72, Math.round(sizePx * 10) / 10));
    cell.setAttribute('data-custom-size', clamped);
    cell.style.setProperty('font-size', clamped + 'px', 'important');

    const input = document.getElementById('cellFontSizeInput');
    if (input) input.value = Math.round(clamped);

    if (!state.customCellFonts) state.customCellFonts = {};
    const key = cell.id || cell.className;
    state.customCellFonts[key] = clamped;
    saveStateToStorage();
  }

  function autoFitCellText(cell) {
    if (!cell) return;
    const baseSizeAttr = cell.getAttribute('data-base-size');
    let baseSize = baseSizeAttr ? parseFloat(baseSizeAttr) : null;
    if (!baseSize) {
      baseSize = getCellDefaultFontSize(cell);
      cell.setAttribute('data-base-size', baseSize);
    }

    // If customized for this specific cell, prioritize the customized font size!
    const customSizeAttr = cell.getAttribute('data-custom-size');
    if (customSizeAttr) {
      cell.style.setProperty('font-size', customSizeAttr + 'px', 'important');
      return;
    }

    const minSize = cell.classList.contains('doc-jo-val') ? 14 :
                    cell.classList.contains('doc-proj-cell') ? 12 :
                    cell.classList.contains('doc-client-cell') ? 11 :
                    cell.classList.contains('doc-date-val') ? 9 : 8;

    let targetSize = baseSize;
    cell.style.setProperty('font-size', targetSize + 'px', 'important');

    // Auto-shrink font size ONLY if text overflows cell bounds
    let guard = 0;
    while (guard < 35 && (cell.scrollWidth > cell.clientWidth || cell.scrollHeight > cell.clientHeight) && targetSize > minSize) {
      targetSize = Math.max(minSize, Math.round((targetSize - 0.5) * 10) / 10);
      cell.style.setProperty('font-size', targetSize + 'px', 'important');
      guard++;
    }
  }

  function autoFitDirectiveTexts() {
    const table = document.getElementById('directiveGridTable');
    if (!table) return;
    const cells = table.querySelectorAll('td[contenteditable="true"], .doc-label-cell, .doc-value-cell, .doc-person-val');
    cells.forEach(cell => autoFitCellText(cell));
  }

  function renderDirectivePreview(joToLoad) {
    const jo = joToLoad || state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || (state.requests && state.requests[0] ? (state.requests[0].requestId || state.requests[0].joNumber) : '');
    let rec = getDirectiveRecord(jo);

    if (!rec && jo && window.PMS_API_URL) {
      fetch(window.PMS_API_URL + '?action=get_request&id=' + encodeURIComponent(jo))
        .then(r => r.json())
        .then(res => {
          if (res && res.success && res.data) {
            normalizeRequestItem(res.data);
            if (!state.requests) state.requests = [];
            const idx = state.requests.findIndex(r => r.id == res.data.id || r.requestId == res.data.requestId);
            if (idx >= 0) {
              state.requests[idx] = res.data;
            } else {
              state.requests.unshift(res.data);
            }
            renderDirectivePreview(res.data.requestId || res.data.joNumber);
          }
        })
        .catch(() => {});
    }

    if (!rec) {
      rec = (state.requests && state.requests.length > 0) ? state.requests[0] : null;
    }
    if (!rec) return;

    state.currentDirectiveJo = rec.requestId || rec.joNumber || rec.id;
    try { sessionStorage.setItem('SIGN_DEPOT_CURRENT_DIRECTIVE', state.currentDirectiveJo); } catch (e) {}

    const input = document.getElementById('directiveLookupInput');
    if (input) input.value = rec.joNumber || rec.requestId || rec.projectName || '';

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = (val !== undefined && val !== null && String(val).trim() !== '') ? val : '—';
    };

    setTxt('docFieldRequestId', rec.requestId || '—');
    setTxt('docFieldJoNumber', rec.joNumber || rec.requestId || '—');
    setTxt('docFieldDueDate', formatReadableDate(rec.designDeadline || rec.releasingDate) || '—');
    setTxt('docFieldLocation', rec.location || '—');
    setTxt('docFieldProjectName', rec.projectName || '—');
    setTxt('docFieldClientName', rec.client || '—');
    setTxt('docFieldInCharge', (rec.inCharge || rec.salesRep || '—').toUpperCase());
    setTxt('docFieldDrawnBy', (rec.drawnBy || rec.artist || '—').toUpperCase());
    setTxt('docFieldContactPerson', rec.contactPerson || '—');
    setTxt('docFieldContactNumber', rec.contactNumber || '—');
    setTxt('docFieldOrderDate', formatDate(rec.orderDate) || '—');
    setTxt('docFieldReleasingDate', formatReadableDate(rec.releasingDate) || '—');
    setTxt('docFieldReleasingMode', normalizeReleasingMode(rec.releasingMode));
    setTxt('docFieldAddress', rec.completeAddress || rec.location || '—');
    setTxt('docFieldInstallers', rec.installers || '—');
    setTxt('docFieldDuration', rec.duration || '—');

    const priorityEl = document.getElementById('docFieldPriorityStatus');
    if (priorityEl) {
      priorityEl.innerHTML = `Priority: <strong>${escapeHTML(rec.priority || 'Normal')}</strong> | Status: <strong>${escapeHTML(rec.projectStatus || rec.status || 'Pending')}</strong>`;
    }

    const deliveryEl = document.getElementById('docFieldDeliveryAddress');
    if (deliveryEl) {
      const addr = rec.completeAddress || rec.location || '—';
      deliveryEl.innerHTML = `<strong>DELIVERY / SITE ADDRESS:</strong> ${escapeHTML(addr)}`;
    }

    const ctrlInst = document.getElementById('ctrlInstallers');
    const ctrlDur = document.getElementById('ctrlDuration');
    const ctrlMode = document.getElementById('ctrlReleasingMode');
    const ctrlNotes = document.getElementById('ctrlNotes');
    const ctrlInCharge = document.getElementById('ctrlInCharge');
    const ctrlDrawnBy = document.getElementById('ctrlDrawnBy');

    if (ctrlInst) ctrlInst.value = rec.installers || '';
    if (ctrlDur) ctrlDur.value = rec.duration || '';
    if (ctrlMode) ctrlMode.value = normalizeReleasingMode(rec.releasingMode);
    if (ctrlNotes) ctrlNotes.value = rec.notes || '';
    if (ctrlInCharge) ctrlInCharge.value = rec.inCharge || rec.salesRep || '';
    if (ctrlDrawnBy) ctrlDrawnBy.value = rec.drawnBy || rec.artist || '';

    renderAttachmentsList();

    // Re-apply saved customized cell font sizes
    if (state.customCellFonts) {
      Object.entries(state.customCellFonts).forEach(([key, size]) => {
        const target = document.getElementById(key);
        if (target && size > 0) {
          target.setAttribute('data-custom-size', size);
          target.style.setProperty('font-size', size + 'px', 'important');
        }
      });
    }

    setTimeout(autoFitDirectiveTexts, 20);
  }

  function setupDirectiveControlsSync() {
    const bindSync = (controlId, docFieldId, fallback) => {
      const ctrl = document.getElementById(controlId);
      const target = document.getElementById(docFieldId);
      if (ctrl && target) {
        ctrl.addEventListener('input', () => {
          target.textContent = ctrl.value || fallback;
          autoFitCellText(target);
        });
      }
    };

    bindSync('ctrlInstallers', 'docFieldInstallers', '2 Installers');
    bindSync('ctrlDuration', 'docFieldDuration', '1 Day (4 Hours)');
    bindSync('ctrlInCharge', 'docFieldInCharge', 'DONA');
    bindSync('ctrlDrawnBy', 'docFieldDrawnBy', 'GLEN');

    const ctrlMode = document.getElementById('ctrlReleasingMode');
    if (ctrlMode) {
      ctrlMode.addEventListener('change', () => {
        const target = document.getElementById('docFieldReleasingMode');
        if (target) {
          target.textContent = normalizeReleasingMode(ctrlMode.value);
          autoFitCellText(target);
        }
      });
    }

    const editableInstallers = document.getElementById('docFieldInstallers');
    if (editableInstallers) {
      editableInstallers.addEventListener('input', () => {
        const ctrl = document.getElementById('ctrlInstallers');
        if (ctrl) ctrl.value = editableInstallers.textContent.trim();
        autoFitCellText(editableInstallers);
      });
    }

    const editableDuration = document.getElementById('docFieldDuration');
    if (editableDuration) {
      editableDuration.addEventListener('input', () => {
        const ctrl = document.getElementById('ctrlDuration');
        if (ctrl) ctrl.value = editableDuration.textContent.trim();
        autoFitCellText(editableDuration);
      });
    }
  }

  function setupDirectiveAutocomplete() {
    const input = document.getElementById('directiveLookupInput');
    const box = document.getElementById('directiveAutocompleteBox');
    const statusEl = document.getElementById('directiveLookupStatus');
    if (!input || !box) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        box.classList.remove('show');
        box.innerHTML = '';
        return;
      }

      const matches = state.requests.filter(r => 
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.requestId.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        box.innerHTML = `<div style="padding:10px 14px; font-size:12px; color:var(--text-muted);">No matching job orders found.</div>`;
      } else {
        box.innerHTML = matches.map(m => `
          <div class="autocomplete-item" onclick="window.SignDepotApp.selectAutocompleteJo('${m.joNumber}')">
            <div>
              <span class="autocomplete-jo">${escapeHTML(m.joNumber)}</span>
              <span style="font-weight:700; margin-left:8px;">${escapeHTML(m.projectName)}</span>
            </div>
            <span class="autocomplete-meta">${escapeHTML(m.requestId)} | ${escapeHTML(m.client)}</span>
          </div>
        `).join('');
      }
      box.classList.add('show');
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !box.contains(e.target)) {
        box.classList.remove('show');
      }
    });

    const btnSearch = document.getElementById('btnDirectiveSearch');
    if (btnSearch) {
      btnSearch.addEventListener('click', () => {
        const q = input.value.trim();
        const found = getDirectiveRecord(q);
        if (found) {
          renderDirectivePreview(found.joNumber);
          if (statusEl) {
            statusEl.textContent = 'Loaded!';
            statusEl.style.color = '#176B55';
            setTimeout(() => statusEl.textContent = '', 2500);
          }
          showToast(`Directive for ${found.joNumber} loaded.`);
        } else {
          if (statusEl) {
            statusEl.textContent = 'Not found';
            statusEl.style.color = '#E53935';
          }
          showToast(`Job "${q}" not found.`, 'error');
        }
      });
    }

    const btnClear = document.getElementById('btnDirectiveClear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        input.value = '';
        box.classList.remove('show');
        if (statusEl) statusEl.textContent = '';
      });
    }
  }

  // ==========================================================================
  // VECTOR SVG GENERATOR (Multi-Software Support: Photoshop, Illustrator, CorelDRAW, Affinity)
  // ==========================================================================

  function generateDirectiveSVG(rec) {
    if (!rec) rec = state.requests.find(r => r.joNumber === state.currentDirectiveJo) || state.requests[0];

    const joLabelVal = document.getElementById('docFieldJoLabel')?.textContent?.trim() || 'JO#:';
    const joNumberVal = document.getElementById('docFieldJoNumber')?.textContent?.trim() || rec.joNumber || 'P261001348';
    const dueDateFormatted = document.getElementById('docFieldDueDate')?.textContent?.trim() || formatReadableDate(rec.designDeadline || rec.releasingDate);
    const releasingDateFormatted = document.getElementById('docFieldReleasingDate')?.textContent?.trim() || formatReadableDate(rec.releasingDate);
    const inChargeVal = (document.getElementById('docFieldInCharge')?.textContent?.trim() || rec.inCharge || rec.salesRep || 'DONA').toUpperCase();
    const drawnByVal = (document.getElementById('docFieldDrawnBy')?.textContent?.trim() || rec.drawnBy || rec.artist || 'GLEN').toUpperCase();
    const releasingModeVal = normalizeReleasingMode(document.getElementById('docFieldReleasingMode')?.textContent?.trim() || rec.releasingMode || 'PICKUP');
    const locationVal = document.getElementById('docFieldLocation')?.textContent?.trim() || rec.location || 'Manila Branch';
    const installersVal = document.getElementById('docFieldInstallers')?.textContent?.trim() || rec.installers || '2 Installers';
    const durationVal = document.getElementById('docFieldDuration')?.textContent?.trim() || rec.duration || '1 Day (4 Hours)';
    const addressVal = document.getElementById('docFieldAddress')?.textContent?.trim() || rec.completeAddress || rec.location || 'Manila Branch';
    const projectNameVal = document.getElementById('docFieldProjectName')?.textContent?.trim() || rec.projectName || 'LACOST & SMH & MK';
    const clientVal = document.getElementById('docFieldClientName')?.textContent?.trim() || rec.client || 'DECALPRO PRINTING SERVICES';
    const contactPersonVal = document.getElementById('docFieldContactPerson')?.textContent?.trim() || rec.contactPerson || '-';
    const contactNumberVal = document.getElementById('docFieldContactNumber')?.textContent?.trim() || rec.contactNumber || '639178805364';
    const orderDateVal = document.getElementById('docFieldOrderDate')?.textContent?.trim() || formatDate(rec.orderDate);

    // Font sizing for SVG: Uses customized per-cell font sizes if manually set or computed from live DOM table
    const getSvgSize = (str, maxChars, base, min, elementId) => {
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          const custom = el.getAttribute('data-custom-size');
          if (custom && parseFloat(custom) > 0) return parseFloat(custom);
          const inline = el.style.fontSize;
          if (inline && parseFloat(inline) > 0) return parseFloat(inline);
          const computed = window.getComputedStyle(el).fontSize;
          if (computed && parseFloat(computed) > 0) return parseFloat(computed);
        }
      }
      if (state.customCellFonts && state.customCellFonts[elementId] && state.customCellFonts[elementId] > 0) {
        return state.customCellFonts[elementId];
      }
      const len = (str || '').length;
      if (len <= maxChars) return base;
      return Math.max(min, Math.round((base * (maxChars / len)) * 10) / 10);
    };

    const joLblSize = getSvgSize(joLabelVal, 6, 20, 12, 'docFieldJoLabel');
    const joSize = getSvgSize(joNumberVal, 10, 30, 16, 'docFieldJoNumber');
    const projSize = getSvgSize(projectNameVal, 12, 30, 15, 'docFieldProjectName');
    const clientSize = getSvgSize(clientVal, 14, 26, 14, 'docFieldClientName');
    const addressSize = getSvgSize(addressVal, 22, 13, 8.5, 'docFieldAddress');
    const personSize = getSvgSize(contactPersonVal, 20, 13, 9, 'docFieldContactPerson');
    const phoneSize = getSvgSize(contactNumberVal, 18, 13, 9, 'docFieldContactNumber');
    const inChargeSize = getSvgSize(inChargeVal, 14, 13, 9, 'docFieldInCharge');
    const drawnBySize = getSvgSize(drawnByVal, 14, 13, 9, 'docFieldDrawnBy');
    const installersSize = getSvgSize(installersVal, 14, 13, 9, 'docFieldInstallers');
    const durationSize = getSvgSize(durationVal, 14, 13, 9, 'docFieldDuration');
    const dueSize = getSvgSize(dueDateFormatted, 16, 14.5, 9, 'docFieldDueDate');
    const locationSize = getSvgSize(locationVal, 18, 13, 8.5, 'docFieldLocation');
    const orderDateSize = getSvgSize(orderDateVal, 16, 13, 8.5, 'docFieldOrderDate');
    const releasingDateSize = getSvgSize(releasingDateFormatted, 16, 13, 8.5, 'docFieldReleasingDate');
    const releasingModeSize = getSvgSize(releasingModeVal, 16, 13, 8.5, 'docFieldReleasingMode');

    // Dynamic vertical baseline calculations based on actual font size and cell height
    const joLblY = Math.round(0 + (54 + joLblSize * 0.72) / 2);
    const joY = Math.round(0 + (54 + joSize * 0.72) / 2);
    const projY = Math.round(0 + (54 + projSize * 0.72) / 2);
    const clientY = Math.round(54 + (54 + clientSize * 0.72) / 2);
    const dueY = Math.round(54 + (27 + dueSize * 0.72) / 2);
    const installersY = Math.round(27 + (54 + installersSize * 0.72) / 2);
    const durationY = Math.round(108 + (54 + durationSize * 0.72) / 2);
    const inChargeY = Math.round(135 + (27 + inChargeSize * 0.72) / 2);
    const drawnByY = Math.round(135 + (27 + drawnBySize * 0.72) / 2);
    const addressY = Math.round(135 + (27 + addressSize * 0.72) / 2);
    const personY = Math.round(0 + (27 + personSize * 0.72) / 2);
    const phoneY = Math.round(27 + (27 + phoneSize * 0.72) / 2);
    const locationY = Math.round(81 + (27 + locationSize * 0.72) / 2);
    const orderDateY = Math.round(54 + (27 + orderDateSize * 0.72) / 2);
    const releasingDateY = Math.round(81 + (27 + releasingDateSize * 0.72) / 2);
    const releasingModeY = Math.round(108 + (27 + releasingModeSize * 0.72) / 2);

    // Pure Vector Sign Depot Logo
    const logoSVG = `
      <g>
        <rect x="0" y="0" width="76" height="24" rx="3" fill="#E53935" transform="rotate(-4 38 12)" />
        <text x="38" y="16" fill="#FFFFFF" font-family="'Roboto Condensed', Arial, sans-serif" font-weight="900" font-size="11" text-anchor="middle" transform="rotate(-4 38 12)">Sign Depot</text>
        <text x="79" y="8" fill="#000000" font-family="Arial, sans-serif" font-weight="bold" font-size="7">TM</text>
      </g>
    `;

    // 6-Row Fixed CAD Table: Exact Widths (10.44% | 16.61% | 33.31% | 8.72% | 16.61% | 14.31%) & Colors (#434343 & #FF0000)
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1216 162" width="1216" height="162">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;800;900&amp;display=swap');
      .cad-lbl-box { fill: #434343; stroke: #000000; stroke-width: 1.5px; }
      .cad-lbl-txt { fill: #FFFFFF; font-family: 'Roboto Condensed', 'Arial Narrow', 'Franklin Gothic Medium', Arial, sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; }
      .cad-val-box { fill: #FFFFFF; stroke: #000000; stroke-width: 1.5px; }
      .cad-val-txt { fill: #434343; font-family: 'Roboto Condensed', 'Arial Narrow', 'Franklin Gothic Medium', Arial, sans-serif; font-weight: 700; text-transform: uppercase; }
      .cad-red-txt { fill: #FF0000; font-family: 'Roboto Condensed', 'Arial Narrow', 'Franklin Gothic Medium', Arial, sans-serif; font-weight: 900; }
      .center-txt { text-anchor: middle; }
    </style>
  </defs>

  <!-- Sheet White Background & Outer Frame -->
  <rect width="1216" height="162" fill="#FFFFFF" />
  <rect x="0" y="0" width="1216" height="162" fill="none" stroke="#000000" stroke-width="2" />

  <!-- ==================== ROWS 1 & 2 ==================== -->
  <!-- Col 1: JO#: (Rows 1-2, x=0, y=0, w=127, h=54) -->
  <rect x="0" y="0" width="127" height="54" class="cad-lbl-box" />
  <text x="63.5" y="${joLblY}" class="cad-lbl-txt center-txt" style="font-size: ${joLblSize}px !important; font-weight: 900;" font-size="${joLblSize}" font-weight="900">${escapeHTML(joLabelVal)}</text>

  <!-- Col 2: JO Value (Rows 1-2, x=127, y=0, w=202, h=54) -->
  <rect x="127" y="0" width="202" height="54" class="cad-val-box" />
  <text x="228" y="${joY}" class="cad-red-txt center-txt" style="font-size: ${joSize}px !important; font-weight: 900;" font-size="${joSize}" font-weight="900">${escapeHTML(joNumberVal)}</text>

  <!-- Col 3: URAL Project (Rows 1-2, x=329, y=0, w=405, h=54) -->
  <rect x="329" y="0" width="405" height="54" class="cad-val-box" />
  <text x="531.5" y="${projY}" class="cad-val-txt center-txt" style="font-size: ${projSize}px !important; font-weight: 900; letter-spacing: 1.5px;" font-size="${projSize}" font-weight="900" letter-spacing="1.5">${escapeHTML(projectNameVal)}</text>

  <!-- Col 4 (Row 1): CONTACT PERSON: (x=734, y=0, w=106, h=27) -->
  <rect x="734" y="0" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="18" class="cad-lbl-txt">CONTACT PERSON:</text>

  <!-- Col 5 (Row 1): Contact Person Value (x=840, y=0, w=202, h=27) -->
  <rect x="840" y="0" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${personY}" class="cad-val-txt" style="font-size: ${personSize}px !important;" font-size="${personSize}">${escapeHTML(contactPersonVal)}</text>

  <!-- Col 6 (Row 1): NUMBER OF INSTALLERS Header (x=1042, y=0, w=174, h=27) -->
  <rect x="1042" y="0" width="174" height="27" class="cad-lbl-box" />
  <text x="1129" y="18" class="cad-lbl-txt center-txt" font-size="11" font-weight="900">NUMBER OF INSTALLERS</text>

  <!-- Col 4 (Row 2): CONTACT NUMBER: (x=734, y=27, w=106, h=27) -->
  <rect x="734" y="27" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="45" class="cad-lbl-txt">CONTACT NUMBER:</text>

  <!-- Col 5 (Row 2): Contact Number Value (x=840, y=27, w=202, h=27) -->
  <rect x="840" y="27" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${phoneY}" class="cad-val-txt" style="font-size: ${phoneSize}px !important;" font-size="${phoneSize}">${escapeHTML(contactNumberVal)}</text>

  <!-- Col 6 (Rows 2-3): NUMBER OF INSTALLERS Value Box (x=1042, y=27, w=174, h=54) -->
  <rect x="1042" y="27" width="174" height="54" class="cad-val-box" />
  <text x="1129" y="${installersY}" class="cad-val-txt center-txt" style="font-size: ${installersSize}px !important; font-weight: 800;" font-size="${installersSize}" font-weight="800">${escapeHTML(installersVal)}</text>

  <!-- ==================== ROWS 3 & 4 ==================== -->
  <!-- Col 1 (Row 3): DUE DATE: (x=0, y=54, w=127, h=27) -->
  <rect x="0" y="54" width="127" height="27" class="cad-lbl-box" />
  <text x="63.5" y="72" class="cad-lbl-txt center-txt" font-size="12" font-weight="900">DUE DATE:</text>

  <!-- Col 2 (Row 3): Due Date Value (x=127, y=54, w=202, h=27) -->
  <rect x="127" y="54" width="202" height="27" class="cad-val-box" />
  <text x="228" y="${dueY}" class="cad-red-txt center-txt" style="font-size: ${dueSize}px !important; font-weight: 800;" font-size="${dueSize}" font-weight="800">${escapeHTML(dueDateFormatted)}</text>

  <!-- Col 3: PAU ACILAC Client (Rows 3-4, x=329, y=54, w=405, h=54) -->
  <rect x="329" y="54" width="405" height="54" class="cad-val-box" />
  <text x="531.5" y="${clientY}" class="cad-val-txt center-txt" style="font-size: ${clientSize}px !important; font-weight: 900; letter-spacing: 1.5px;" font-size="${clientSize}" font-weight="900" letter-spacing="1.5">${escapeHTML(clientVal)}</text>

  <!-- Col 4 (Row 3): ORDER DATE: (x=734, y=54, w=106, h=27) -->
  <rect x="734" y="54" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="72" class="cad-lbl-txt">ORDER DATE:</text>

  <!-- Col 5 (Row 3): Order Date Value (x=840, y=54, w=202, h=27) -->
  <rect x="840" y="54" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${orderDateY}" class="cad-val-txt" style="font-size: ${orderDateSize}px !important;" font-size="${orderDateSize}">${escapeHTML(orderDateVal)}</text>

  <!-- Col 1 (Row 4): LOCATION: (x=0, y=81, w=127, h=27) -->
  <rect x="0" y="81" width="127" height="27" class="cad-lbl-box" />
  <text x="63.5" y="99" class="cad-lbl-txt center-txt" font-size="12" font-weight="900">LOCATION:</text>

  <!-- Col 2 (Row 4): Location Value (x=127, y=81, w=202, h=27) -->
  <rect x="127" y="81" width="202" height="27" class="cad-val-box" />
  <text x="228" y="${locationY}" class="cad-val-txt center-txt" style="font-size: ${locationSize}px !important;" font-size="${locationSize}">${escapeHTML(locationVal)}</text>

  <!-- Col 4 (Row 4): RELEASING DATE: (x=734, y=81, w=106, h=27) -->
  <rect x="734" y="81" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="99" class="cad-lbl-txt">RELEASING DATE:</text>

  <!-- Col 5 (Row 4): Releasing Date Value (x=840, y=81, w=202, h=27) -->
  <rect x="840" y="81" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${releasingDateY}" class="cad-val-txt" style="font-size: ${releasingDateSize}px !important;" font-size="${releasingDateSize}">${escapeHTML(releasingDateFormatted)}</text>

  <!-- Col 6 (Row 4): INSTALLATION DURATION Header (x=1042, y=81, w=174, h=27) -->
  <rect x="1042" y="81" width="174" height="27" class="cad-lbl-box" />
  <text x="1129" y="99" class="cad-lbl-txt center-txt" font-size="11" font-weight="900">INSTALLATION DURATION</text>

  <!-- ==================== ROWS 5 & 6 ==================== -->
  <!-- Cols 1 & 2: 3 Sign Depot Logos (Rows 5-6, x=0, y=108, w=329, h=54) -->
  <rect x="0" y="108" width="329" height="54" class="cad-val-box" />
  <g transform="translate(18, 122) scale(0.85)">${logoSVG}</g>
  <g transform="translate(125, 122) scale(0.85)">${logoSVG}</g>
  <g transform="translate(232, 122) scale(0.85)">${logoSVG}</g>

  <!-- Col 3: Subtable IN-CHARGE & DRAWN BY (Rows 5-6, x=329, y=108, w=405, h=54) -->
  <rect x="329" y="108" width="202.5" height="27" class="cad-lbl-box" />
  <text x="430.25" y="126" class="cad-lbl-txt center-txt" font-size="12" font-weight="900">IN-CHARGE</text>
  <rect x="531.5" y="108" width="202.5" height="27" class="cad-lbl-box" />
  <text x="632.75" y="126" class="cad-lbl-txt center-txt" font-size="12" font-weight="900">DRAWN BY:</text>

  <rect x="329" y="135" width="202.5" height="27" class="cad-val-box" />
  <text x="430.25" y="${inChargeY}" class="cad-val-txt center-txt" style="font-size: ${inChargeSize}px !important; font-weight: 800;" font-size="${inChargeSize}" font-weight="800">${escapeHTML(inChargeVal)}</text>
  <rect x="531.5" y="135" width="202.5" height="27" class="cad-val-box" />
  <text x="632.75" y="${drawnByY}" class="cad-val-txt center-txt" style="font-size: ${drawnBySize}px !important; font-weight: 800;" font-size="${drawnBySize}" font-weight="800">${escapeHTML(drawnByVal)}</text>

  <!-- Col 4 (Row 5): RELEASING MODE: (x=734, y=108, w=106, h=27) -->
  <rect x="734" y="108" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="126" class="cad-lbl-txt">RELEASING MODE:</text>

  <!-- Col 5 (Row 5): Releasing Mode Value (x=840, y=108, w=202, h=27) -->
  <rect x="840" y="108" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${releasingModeY}" class="cad-val-txt" style="font-size: ${releasingModeSize}px !important; font-weight: 900;" font-size="${releasingModeSize}" font-weight="900">${escapeHTML(releasingModeVal)}</text>

  <!-- Col 6 (Rows 5-6): INSTALLATION DURATION Value Box (x=1042, y=108, w=174, h=54) -->
  <rect x="1042" y="108" width="174" height="54" class="cad-val-box" />
  <text x="1129" y="${durationY}" class="cad-val-txt center-txt" style="font-size: ${durationSize}px !important; font-weight: 800;" font-size="${durationSize}" font-weight="800">${escapeHTML(durationVal)}</text>

  <!-- Col 4 (Row 6): ADDRESS: (x=734, y=135, w=106, h=27) -->
  <rect x="734" y="135" width="106" height="27" class="cad-lbl-box" />
  <text x="740" y="153" class="cad-lbl-txt">ADDRESS:</text>

  <!-- Col 5 (Row 6): Address Value (x=840, y=135, w=202, h=27) -->
  <rect x="840" y="135" width="202" height="27" class="cad-val-box" />
  <text x="848" y="${addressY}" class="cad-val-txt" style="font-size: ${addressSize}px !important;" font-size="${addressSize}">${escapeHTML(addressVal)}</text>
</svg>`;
  }

  function setupDirectiveActions() {
    // COPY AS VECTOR GRAPHIC (Multi-Software Support: Photoshop, Illustrator, CorelDRAW, Affinity Designer)
    const handleCopyVector = async () => {
      const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo) || state.requests[0];
      const cleanSvg = generateDirectiveSVG(cur).trim();
      
      // Standard HTML clipboard fragment for Windows CF_HTML (Photoshop Smart Object & Corel/Illustrator Vector parse)
      const htmlPayload = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><!--StartFragment-->${cleanSvg}<!--EndFragment--></body></html>`;

      let copySuccess = false;

      // 1. Try modern Asynchronous Clipboard API with rich multi-MIME payload
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml' });
          const htmlBlob = new Blob([htmlPayload], { type: 'text/html' });
          const textBlob = new Blob([cleanSvg], { type: 'text/plain' });

          await navigator.clipboard.write([
            new ClipboardItem({
              'image/svg+xml': svgBlob,
              'text/html': htmlBlob,
              'text/plain': textBlob
            })
          ]);
          copySuccess = true;
        } catch (mimeErr) {
          // If browser rejects image/svg+xml in write, write text/html (CF_HTML) and text/plain
          try {
            const htmlBlob = new Blob([htmlPayload], { type: 'text/html' });
            const textBlob = new Blob([cleanSvg], { type: 'text/plain' });

            await navigator.clipboard.write([
              new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob
              })
            ]);
            copySuccess = true;
          } catch (writeErr) {
            console.warn('Clipboard write fallback triggered', writeErr);
          }
        }
      }

      // 2. Synchronous Clipboard Event Fallback (sets CF_HTML and CF_UNICODETEXT on Windows)
      if (!copySuccess) {
        try {
          const copyHandler = (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/html', htmlPayload);
            e.clipboardData.setData('text/plain', cleanSvg);
            try {
              e.clipboardData.setData('image/svg+xml', cleanSvg);
            } catch (ignore) {}
          };
          document.addEventListener('copy', copyHandler, { once: true });
          copySuccess = document.execCommand('copy');
        } catch (e) {
          copySuccess = false;
        }
      }

      if (copySuccess) {
        showToast('SVG vector code copied (for Illustrator / Figma). For CorelDRAW: Click "Download Vector" & drag into Corel, or use "Copy Image" for Ctrl+V.');
      } else {
        copyFallback(cleanSvg);
      }
    };

    const btnCopySVG = document.getElementById('btnDirectiveCopySVG');
    const btnQuickCopy = document.getElementById('btnQuickCopyVector');
    if (btnCopySVG) btnCopySVG.addEventListener('click', handleCopyVector);
    if (btnQuickCopy) btnQuickCopy.addEventListener('click', handleCopyVector);

    // COPY ULTRA-HD 4K IMAGE (Instant Ctrl+V for CorelDRAW, Photoshop, Affinity, Illustrator, Chat)
    const btnCopyPNG = document.getElementById('btnDirectiveCopyPNG');
    if (btnCopyPNG) {
      btnCopyPNG.addEventListener('click', (e) => {
        const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo) || state.requests[0];
        const svgString = generateDirectiveSVG(cur);
        
        // 4K Ultra-High Definition resolution: 4864 × 648 px (scale = 4, over 4K UHD 3840px width)
        const scale = 4;
        const targetWidth = 1216 * scale;  // 4864px
        const targetHeight = 162 * scale;  // 648px
        
        // Ensure the root SVG attributes specify the target 4K dimensions so the browser natively rasterizes vector geometry at 4K
        const svg4K = svgString
          .replace(/width="1216"/, `width="${targetWidth}"`)
          .replace(/height="162"/, `height="${targetHeight}"`);

        const img = new Image();
        const svgBlob = new Blob([svg4K], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Pure crisp white background fill
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Render native 4K vector graphics
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          URL.revokeObjectURL(url);

          canvas.toBlob(async (blob) => {
            if (!blob) {
              showToast('Failed to generate 4K image data.', 'error');
              return;
            }

            // If Shift key is held, also trigger direct download of the 4K PNG file
            if (e.shiftKey) {
              const dlUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = dlUrl;
              a.download = `Directive-Header-4K-${cur.joNumber || 'Job'}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(dlUrl);
              showToast('4K Ultra-HD PNG downloaded (4864 × 648 px)!');
              return;
            }

            try {
              if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('Ultra-HD 4K image copied (4864 × 648 px)! Ready to paste (Ctrl+V) directly in Corel, PS, Affinity, or Illustrator.');
              } else {
                throw new Error('Clipboard API unavailable');
              }
            } catch (err) {
              // Automatic download fallback if clipboard access is blocked
              const dlUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = dlUrl;
              a.download = `Directive-Header-4K-${cur.joNumber || 'Job'}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(dlUrl);
              showToast('Clipboard access restricted. Downloaded 4K PNG file instead.', 'info');
            }
          }, 'image/png', 1.0);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          showToast('Failed to render 4K graphic for clipboard.', 'error');
        };
        img.src = url;
      });
    }

    // DOWNLOAD VECTOR SVG FILE (Direct 1-click for CorelDRAW Drag & Drop or Import)
    const btnDownloadSVG = document.getElementById('btnDirectiveDownloadSVG');
    if (btnDownloadSVG) {
      btnDownloadSVG.addEventListener('click', () => {
        const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo) || state.requests[0];
        const svgString = generateDirectiveSVG(cur);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sign_Depot_Directive_${cur.joNumber || 'Job'}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Vector SVG downloaded! Drag & drop the file into CorelDRAW or press Ctrl+I.`);
      });
    }

    const btnSave = document.getElementById('btnDirectiveSaveDraft');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo);
        if (cur) {
          cur.installers = document.getElementById('ctrlInstallers').value;
          cur.duration = document.getElementById('ctrlDuration').value;
          cur.releasingMode = normalizeReleasingMode(document.getElementById('ctrlReleasingMode').value);
          cur.notes = document.getElementById('ctrlNotes').value;
          cur.inCharge = document.getElementById('ctrlInCharge').value;
          cur.drawnBy = document.getElementById('ctrlDrawnBy').value;
          saveStateToStorage();
          showToast(`Draft for ${cur.joNumber} saved.`);
        }
      });
    }

    const btnPrint = document.getElementById('btnDirectivePrint');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    const btnReset = document.getElementById('btnDirectiveReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.customCellFonts = {};
        saveStateToStorage();
        const table = document.getElementById('directiveGridTable');
        if (table) {
          table.querySelectorAll('td').forEach(c => {
            c.removeAttribute('data-custom-size');
            c.style.removeProperty('font-size');
          });
        }
        renderDirectivePreview(state.currentDirectiveJo);
        showToast('All cell font sizes reset to standard defaults.');
      });
    }

    // CUSTOMIZED PER-CELL FONT SIZE CONTROLS (Customized per individual cell, not everything!)
    const getActiveOrTargetCell = () => {
      if (activeDirectiveCell && document.body.contains(activeDirectiveCell)) {
        return activeDirectiveCell;
      }
      const defaultCell = document.getElementById('docFieldProjectName') || document.querySelector('.doc-proj-cell') || document.querySelector('.doc-value-cell');
      if (defaultCell) selectDirectiveCell(defaultCell);
      return defaultCell;
    };

    const btnCellDec = document.getElementById('btnCellFontDec');
    if (btnCellDec) {
      btnCellDec.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const current = getCellCurrentFontSize(cell);
          const next = Math.max(6, Math.round(current - 1));
          setCellCustomFontSize(cell, next);
          showToast(`Font size for ${getCellFriendlyName(cell)}: ${next}px`);
        }
      });
    }

    const btnCellInc = document.getElementById('btnCellFontInc');
    if (btnCellInc) {
      btnCellInc.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const current = getCellCurrentFontSize(cell);
          const next = Math.min(72, Math.round(current + 1));
          setCellCustomFontSize(cell, next);
          showToast(`Font size for ${getCellFriendlyName(cell)}: ${next}px`);
        }
      });
    }

    const cellFontInput = document.getElementById('cellFontSizeInput');
    if (cellFontInput) {
      const handleCellFontChange = () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          const val = parseFloat(cellFontInput.value);
          if (!isNaN(val) && val >= 6 && val <= 72) {
            setCellCustomFontSize(cell, val);
          }
        }
      };
      cellFontInput.addEventListener('input', handleCellFontChange);
      cellFontInput.addEventListener('change', handleCellFontChange);
    }

    const btnCellReset = document.getElementById('btnCellFontReset');
    if (btnCellReset) {
      btnCellReset.addEventListener('click', () => {
        const cell = getActiveOrTargetCell();
        if (cell) {
          cell.removeAttribute('data-custom-size');
          cell.style.removeProperty('font-size');
          autoFitCellText(cell);
          if (cellFontInput) cellFontInput.value = Math.round(getCellCurrentFontSize(cell));
          if (state.customCellFonts && cell.id) {
            delete state.customCellFonts[cell.id];
            saveStateToStorage();
          }
          showToast(`Reset font size for ${getCellFriendlyName(cell)} to default (${Math.round(getCellCurrentFontSize(cell))}px)`);
        }
      });
    }

    // Cell selection & hotkey listeners on the directive CAD table
    const gridTable = document.getElementById('directiveGridTable');
    if (gridTable) {
      gridTable.addEventListener('click', (e) => {
        const targetCell = e.target.closest('td');
        if (targetCell) {
          selectDirectiveCell(targetCell);
        }
      });

      gridTable.addEventListener('focusin', (e) => {
        const targetCell = e.target.closest('td');
        if (targetCell) {
          selectDirectiveCell(targetCell);
        }
      });

      // Hotkeys: Ctrl+[ decreases active cell font, Ctrl+] increases active cell font
      gridTable.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '[' || e.key === ']')) {
          e.preventDefault();
          const targetCell = e.target.closest('td') || getActiveOrTargetCell();
          if (targetCell) {
            selectDirectiveCell(targetCell);
            const current = getCellCurrentFontSize(targetCell);
            const step = e.key === '[' ? -1 : 1;
            const next = Math.max(6, Math.min(72, Math.round(current + step)));
            setCellCustomFontSize(targetCell, next);
            showToast(`${getCellFriendlyName(targetCell)} font: ${next}px`);
          }
        }
      });

      // Live auto-fit when typing in contenteditable table cells
      gridTable.addEventListener('input', (e) => {
        const targetCell = e.target.closest('td');
        if (targetCell) autoFitCellText(targetCell);
      });
    }

    const subtabs = document.querySelectorAll('.directive-toolbar .tab-btn');
    subtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        subtabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-subtab');
        document.querySelectorAll('.directive-subtab-content').forEach(c => {
          c.style.display = 'none';
          c.classList.remove('active');
        });

        const activeContent = document.getElementById(target);
        if (activeContent) {
          activeContent.style.display = target === 'tab-template-editor' ? 'flex' : 'block';
          activeContent.classList.add('active');
          if (target === 'tab-template-editor') {
            initTemplateEditorCanvas();
          }
        }
      });
    });
  }

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Vector SVG copied to clipboard!');
    } catch (e) {
      showToast('Unable to copy automatically.', 'error');
    }
    document.body.removeChild(ta);
  }

  // ==========================================================================
  // TEMPLATE EDITOR ENGINE (Interactive Drag, Resize & Customization)
  // ==========================================================================

  let isDraggingElem = false;
  let isResizingElem = false;
  let dragTarget = null;
  let dragOffset = { x: 0, y: 0 };
  let initialSize = { w: 0, h: 0 };
  let initialMousePos = { x: 0, y: 0 };

  function initTemplateEditorCanvas() {
    const canvas = document.getElementById('interactiveTemplateCanvas');
    if (!canvas) return;

    canvas.innerHTML = '';
    state.templateElements.forEach(el => {
      const elemNode = document.createElement('div');
      elemNode.className = `template-element ${state.selectedTemplateElemId === el.id ? 'selected' : ''}`;
      elemNode.id = `tpl-${el.id}`;
      elemNode.style.left = `${el.x}px`;
      elemNode.style.top = `${el.y}px`;
      elemNode.style.width = `${el.w}px`;
      elemNode.style.height = `${el.h}px`;
      elemNode.style.textAlign = el.align || 'center';

      elemNode.innerHTML = `
        <div class="element-label">${escapeHTML(el.label)}</div>
        <div class="element-content" style="font-size: ${el.fontSize}px; color: ${el.color || '#1F2937'};">${escapeHTML(el.content)}</div>
        <div class="resize-handle" title="Drag to resize"></div>
      `;

      elemNode.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
          isResizingElem = true;
          dragTarget = el;
          initialSize = { w: el.w, h: el.h };
          initialMousePos = { x: e.clientX, y: e.clientY };
          selectTemplateElement(el.id);
          e.stopPropagation();
          return;
        }

        isDraggingElem = true;
        dragTarget = el;
        const rect = elemNode.getBoundingClientRect();
        dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        selectTemplateElement(el.id);
        e.stopPropagation();
      });

      canvas.appendChild(elemNode);
    });

    if (!canvas._listenersAttached) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
      canvas._listenersAttached = true;
    }

    setupTemplateToolbar();
  }

  function handleCanvasMouseMove(e) {
    if (!dragTarget) return;
    const canvas = document.getElementById('interactiveTemplateCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    if (isDraggingElem) {
      let newX = e.clientX - canvasRect.left - dragOffset.x;
      let newY = e.clientY - canvasRect.top - dragOffset.y;

      newX = Math.max(0, Math.min(newX, canvas.clientWidth - dragTarget.w));
      newY = Math.max(0, Math.min(newY, canvas.clientHeight - dragTarget.h));

      dragTarget.x = Math.round(newX);
      dragTarget.y = Math.round(newY);

      const node = document.getElementById(`tpl-${dragTarget.id}`);
      if (node) {
        node.style.left = `${dragTarget.x}px`;
        node.style.top = `${dragTarget.y}px`;
      }
    } else if (isResizingElem) {
      const deltaX = e.clientX - initialMousePos.x;
      const deltaY = e.clientY - initialMousePos.y;

      let newW = Math.max(80, initialSize.w + deltaX);
      let newH = Math.max(35, initialSize.h + deltaY);

      dragTarget.w = Math.round(newW);
      dragTarget.h = Math.round(newH);

      const node = document.getElementById(`tpl-${dragTarget.id}`);
      if (node) {
        node.style.width = `${dragTarget.w}px`;
        node.style.height = `${dragTarget.h}px`;
      }
    }
  }

  function handleCanvasMouseUp() {
    if (isDraggingElem || isResizingElem) {
      isDraggingElem = false;
      isResizingElem = false;
      dragTarget = null;
    }
  }

  function selectTemplateElement(id) {
    state.selectedTemplateElemId = id;
    document.querySelectorAll('.template-element').forEach(n => n.classList.remove('selected'));
    const cur = document.getElementById(`tpl-${id}`);
    if (cur) cur.classList.add('selected');

    const el = state.templateElements.find(item => item.id === id);
    if (el) {
      const lblInput = document.getElementById('propElemLabel');
      const cntInput = document.getElementById('propElemContent');
      const fsInput = document.getElementById('propElemFontSize');
      const alignInput = document.getElementById('propElemAlign');

      if (lblInput) lblInput.value = el.label;
      if (cntInput) cntInput.value = el.content;
      if (fsInput) fsInput.value = el.fontSize;
      if (alignInput) alignInput.value = el.align || 'center';
    }
  }

  function setupTemplateToolbar() {
    const lblInput = document.getElementById('propElemLabel');
    const cntInput = document.getElementById('propElemContent');
    const fsInput = document.getElementById('propElemFontSize');
    const alignInput = document.getElementById('propElemAlign');

    const updateCurrent = () => {
      if (!state.selectedTemplateElemId) return;
      const el = state.templateElements.find(item => item.id === state.selectedTemplateElemId);
      if (!el) return;

      if (lblInput) el.label = lblInput.value;
      if (cntInput) el.content = cntInput.value;
      if (fsInput) el.fontSize = parseInt(fsInput.value, 10) || 12;
      if (alignInput) el.align = alignInput.value;

      const node = document.getElementById(`tpl-${el.id}`);
      if (node) {
        node.querySelector('.element-label').textContent = el.label;
        const cntNode = node.querySelector('.element-content');
        cntNode.textContent = el.content;
        cntNode.style.fontSize = `${el.fontSize}px`;
        node.style.textAlign = el.align;
      }
    };

    if (lblInput) lblInput.oninput = updateCurrent;
    if (cntInput) cntInput.oninput = updateCurrent;
    if (fsInput) fsInput.oninput = updateCurrent;
    if (alignInput) alignInput.onchange = updateCurrent;

    const btnAdd = document.getElementById('btnTplAddElement');
    if (btnAdd) {
      btnAdd.onclick = () => {
        const newId = `el-${Date.now().toString(36)}`;
        const newEl = { id: newId, label: 'CUSTOM FIELD', content: 'NEW CONTENT', x: 50, y: 50, w: 160, h: 44, fontSize: 12, align: 'center', color: '#1F2937' };
        state.templateElements.push(newEl);
        initTemplateEditorCanvas();
        selectTemplateElement(newId);
        showToast('New template field added.');
      };
    }

    const btnDel = document.getElementById('btnTplDeleteElement');
    if (btnDel) {
      btnDel.onclick = () => {
        if (!state.selectedTemplateElemId) return;
        state.templateElements = state.templateElements.filter(e => e.id !== state.selectedTemplateElemId);
        state.selectedTemplateElemId = null;
        initTemplateEditorCanvas();
        showToast('Element deleted.');
      };
    }

    const btnSaveTpl = document.getElementById('btnTplSaveTemplate');
    if (btnSaveTpl) {
      btnSaveTpl.onclick = () => {
        saveStateToStorage();
        showToast('Custom template layout saved!');
      };
    }

    const btnResetTpl = document.getElementById('btnTplResetDefault');
    if (btnResetTpl) {
      btnResetTpl.onclick = () => {
        state.templateElements = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS));
        state.selectedTemplateElemId = null;
        initTemplateEditorCanvas();
        saveStateToStorage();
        showToast('Template restored to standard layout.');
      };
    }
  }

  // ==========================================================================
  // ATTACHMENTS HANDLING
  // ==========================================================================

  function renderAttachmentsList() {
    const grid = document.getElementById('attachmentsGridContainer');
    const badge = document.getElementById('attachmentsCountBadge');
    if (badge) badge.textContent = state.attachments.length;
    if (!grid) return;

    grid.innerHTML = state.attachments.map(att => `
      <div class="attachment-card">
        <div class="attachment-thumbnail" onclick="window.SignDepotApp.previewAttachment('${att.id}')" style="cursor:pointer;">
          <img src="${att.url}" alt="${escapeHTML(att.name)}">
        </div>
        <div class="attachment-meta">
          <span style="font-weight:700; font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(att.name)}</span>
          <span style="font-size:11px; color:var(--text-secondary);">${att.type} • ${att.size}</span>
        </div>
        <div style="display:flex; gap:6px; margin-top:4px;">
          <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.SignDepotApp.previewAttachment('${att.id}')">View</button>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.deleteAttachment('${att.id}')">Delete</button>
        </div>
      </div>
    `).join('');

    const uploadBtn = document.getElementById('btnUploadLocalAttachment');
    const fileInput = document.getElementById('localAttachmentUploadInput');
    if (uploadBtn && fileInput) {
      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const newAtt = {
            id: `att-${Date.now()}`,
            name: file.name,
            type: file.type || 'Image File',
            size: `${(file.size / 1024).toFixed(1)} KB`,
            dateAdded: '2026-10-23',
            storageType: 'Local Browser',
            url: event.target.result
          };
          state.attachments.unshift(newAtt);
          saveStateToStorage();
          renderAttachmentsList();
          showToast(`Attached ${file.name} successfully.`);
        };
        reader.readAsDataURL(file);
      };
    }
  }

  // ==========================================================================
  // MODULE 6: PENDING PROJECTS — ARTIST QUEUE (Directly Editable)
  // ==========================================================================

  function renderPendingArtistQueue() {
    const myArtist = getLoggedInArtist();
    const artistSelect = document.getElementById('pendingArtistSelect');
    if (artistSelect) {
      if (myArtist) {
        artistSelect.innerHTML = `<option value="${escapeHTML(myArtist)}" selected>🎨 Artist: ${escapeHTML(myArtist)} (You)</option>`;
        artistSelect.disabled = true;
        state.pendingArtistSelected = myArtist;
      } else if (artistSelect.children.length === 0) {
        state.artists.forEach(a => {
          const opt = document.createElement('option');
          opt.value = a;
          opt.textContent = `Artist: ${a}`;
          artistSelect.appendChild(opt);
        });
        artistSelect.value = state.pendingArtistSelected || state.artists[0];
      }
    }

    const currentArtist = myArtist || (artistSelect ? artistSelect.value : state.pendingArtistSelected) || state.artists[0];
    state.pendingArtistSelected = currentArtist;

    const pendingList = state.requests.filter(r => r.artist === currentArtist && r.projectStatus !== 'Completed');
    const activeList = pendingList.filter(r => r.designStatus === 'In Progress' || r.projectStatus === 'On-going');
    const overdueList = pendingList.filter(r => isOverdue(r.designDeadline, r.projectStatus));

    document.getElementById('artistStatTotal').textContent = pendingList.length;
    document.getElementById('artistStatActive').textContent = activeList.length;
    document.getElementById('artistStatOverdue').textContent = overdueList.length;

    const totalItems = pendingList.length;
    const page = state.pendingArtistPage || 1;
    const perPage = state.pendingArtistPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'pendingArtistPaginationInfo',
      controlsId: 'pendingArtistPaginationControls',
      selectIds: ['pendingArtistFilterPerPage', 'pendingArtistPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setPendingArtistPage',
      itemLabel: 'tasks'
    });

    state.pendingArtistPage = validPage;
    const pagedList = pendingList.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('pendingArtistTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">${currentArtist} currently has no pending projects.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus, DESIGN_STATUSES)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline, r.projectStatus)}</td>
            <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
            <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
            <td>
              <div style="display:flex; gap:4px; align-items:center;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                ${isCurrentUserSuperAdmin() ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Task (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // MODULE 7: PENDING PROJECTS — SALES QUEUE (Directly Editable)
  // ==========================================================================

  function renderPendingSalesQueue() {
    // Strictly filter to all pending or newly encoded sales requests that are NOT yet approved
    let list = state.requests.filter(r => {
      const clientApp = (r.clientApproval || '').trim().toLowerCase();
      const projStat = (r.projectStatus || '').trim().toLowerCase();
      const isApproved = clientApp === 'approved' || projStat === 'approved';
      const isCompleted = projStat === 'completed';
      return !isApproved && !isCompleted;
    });

    const qFilter = state.pendingSalesFilter;
    const search = state.pendingSalesSearch;

    if (qFilter === 'approval') list = list.filter(r => (r.clientApproval || 'Pending') === 'Pending');
    if (qFilter === 'files') list = list.filter(r => r.fileSent === 'Pending' || r.fileSent === 'TO FOLLOW');
    if (qFilter === 'release') list = list.filter(r => r.releasingDate || r.releasingMode);
    if (qFilter === 'rush') list = list.filter(r => r.priority === 'Rush');

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.projectName.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      );
    }

    const totalItems = list.length;
    const page = state.pendingSalesPage || 1;
    const perPage = state.pendingSalesPerPage || 10;

    const { validPage, startIndex } = renderPagination({
      infoId: 'pendingSalesPaginationInfo',
      controlsId: 'pendingSalesPaginationControls',
      selectIds: ['pendingSalesFilterPerPage', 'pendingSalesPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setPendingSalesPage',
      itemLabel: 'orders'
    });

    state.pendingSalesPage = validPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('pendingSalesTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:30px; color:var(--text-muted);">No sales queue tasks for the selected filter.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td><strong style="color:var(--accent-red);">${escapeHTML(r.joNumber)}</strong></td>
            <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
            <td>${renderEditableCell(r.id, 'client', r.client)}</td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderInlineSelect(r.id, 'clientApproval', r.clientApproval, APPROVAL_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'fileSent', r.fileSent, FILE_SENT_LEVELS)}</td>
            <td>${renderInlineDate(r.id, 'releasingDate', r.releasingDate)}</td>
            <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>
              <div style="display:flex; gap:4px; align-items:center;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.quickSalesApprove('${r.id}')">Approve</button>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                ${isCurrentUserSuperAdmin() ? `
                  <button class="btn btn-sm btn-icon-only" onclick="window.SignDepotApp.deleteSalesRequest('${r.id}')" title="Delete Order (Super Admin)" style="color:#DC2626; background:#FEF2F2; border:1px solid #FECACA;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // ==========================================================================
  // MODULE 8: DATE UTILITIES & TIMEFRAME FILTER ENGINE
  // ==========================================================================

  function parseRequestDate(str) {
    if (!str) return null;
    str = String(str).trim();
    // YYYY-MM-DD
    const iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
      return new Date(parseInt(iso[1], 10), parseInt(iso[2], 10) - 1, parseInt(iso[3], 10));
    }
    // DD/MM/YYYY
    const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmy) {
      return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
    }
    // Natural date string like September 26, 2026 or Ocotber 13, 2026
    const clean = str.replace(/Ocotber/i, 'October').replace(/,(\d{4})/g, ', $1');
    const ts = Date.parse(clean);
    if (!isNaN(ts)) {
      return new Date(ts);
    }
    return null;
  }

  function getReferenceToday() {
    const now = new Date();
    if (now.getFullYear() !== 2026) {
      return new Date(2026, 9, 26);
    }
    return now;
  }

  function matchesTimeframe(req, tf) {
    if (!tf || tf === 'all') return true;
    const dateStr = req.releasingDate || req.designDeadline || req.orderDate;
    if (!dateStr) return false;
    const d = parseRequestDate(dateStr);
    if (!d) return false;

    const ref = getReferenceToday();

    if (tf === 'today') {
      return d.getFullYear() === ref.getFullYear() &&
             d.getMonth() === ref.getMonth() &&
             d.getDate() === ref.getDate();
    }
    if (tf === 'week') {
      const day = (ref.getDay() + 6) % 7; // Monday = 0
      const startOfWeek = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - day, 0, 0, 0);
      const endOfWeek = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - day + 6, 23, 59, 59);
      return d >= startOfWeek && d <= endOfWeek;
    }
    if (tf === 'month') {
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    }
    return true;
  }

  // ==========================================================================
  // MODULE 8A: PRODUCTION OUTPUT REPORT ENGINE (DAY, WEEK, MONTH, YEAR FILTERS)
  // ==========================================================================

  function formatIsoDate(d) {
    if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '2026-10-26';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getMondayOfWeek(d) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function initOutputFilterState() {
    if (!state.outputFilter) {
      state.outputFilter = {
        timeframe: state.timeframe || 'month',
        year: '2026',
        month: '9', // 0-indexed: 9 = October
        weekStartDate: '2026-10-19', // Monday of peak active week
        dayDate: '2026-10-26' // Today
      };
    }
  }

  function populateOutputWeekOptions() {
    const weekSelect = document.getElementById('outputFilterWeek');
    if (!weekSelect) return;

    initOutputFilterState();
    const selYear = state.outputFilter.year === 'all' ? 2026 : parseInt(state.outputFilter.year, 10);
    const selMonth = state.outputFilter.month === 'all' ? null : parseInt(state.outputFilter.month, 10);

    const options = [];
    const startYear = new Date(selYear, 0, 1);
    const firstMon = getMondayOfWeek(startYear);
    const endYear = new Date(selYear, 11, 31);

    let curMon = new Date(firstMon);
    let weekIndex = 1;

    while (curMon <= endYear || curMon.getFullYear() === selYear) {
      const sun = new Date(curMon);
      sun.setDate(sun.getDate() + 6);

      let include = true;
      if (selMonth !== null) {
        include = (curMon.getMonth() === selMonth || sun.getMonth() === selMonth);
      }

      if (include && (curMon.getFullYear() === selYear || sun.getFullYear() === selYear)) {
        const iso = formatIsoDate(curMon);
        const m1 = curMon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const m2 = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isPeak = (iso === '2026-10-19');
        options.push(`<option value="${iso}">${isPeak ? '★ ' : ''}Week ${weekIndex} (${m1} — ${m2})</option>`);
      }

      curMon.setDate(curMon.getDate() + 7);
      weekIndex++;
      if (curMon.getFullYear() > selYear + 1) break;
    }

    weekSelect.innerHTML = options.join('');

    const exists = Array.from(weekSelect.options).some(o => o.value === state.outputFilter.weekStartDate);
    if (exists) {
      weekSelect.value = state.outputFilter.weekStartDate;
    } else if (weekSelect.options.length > 0) {
      const peakOpt = Array.from(weekSelect.options).find(o => o.value === '2026-10-19');
      if (peakOpt) {
        weekSelect.value = '2026-10-19';
        state.outputFilter.weekStartDate = '2026-10-19';
      } else {
        weekSelect.value = weekSelect.options[0].value;
        state.outputFilter.weekStartDate = weekSelect.options[0].value;
      }
    }
  }

  function syncOutputFilterControlsUI(tf) {
    initOutputFilterState();
    state.outputFilter.timeframe = tf;

    const yearSelect = document.getElementById('outputFilterYear');
    const monthSelect = document.getElementById('outputFilterMonth');
    const fieldWeek = document.getElementById('filterFieldWeek');
    const fieldDay = document.getElementById('filterFieldDay');
    const fieldMonth = document.getElementById('filterFieldMonth');
    const dateInput = document.getElementById('outputFilterDate');
    const statusBadge = document.getElementById('outputFilterStatusBadge');

    if (yearSelect) yearSelect.value = state.outputFilter.year || '2026';
    if (monthSelect) monthSelect.value = state.outputFilter.month !== undefined ? state.outputFilter.month : '9';
    if (dateInput) dateInput.value = state.outputFilter.dayDate || '2026-10-26';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.outputFilter.year === 'all' ? 'All Years' : state.outputFilter.year;

    if (tf === 'today') {
      if (fieldDay) fieldDay.style.display = 'flex';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (statusBadge) {
        statusBadge.textContent = `Daily: ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-completed';
      }
    } else if (tf === 'week') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'flex';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      populateOutputWeekOptions();
      const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
      const mon = new Date(parts[0], parts[1] - 1, parts[2]);
      const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
      if (statusBadge) {
        statusBadge.textContent = `Weekly: ${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else if (tf === 'month') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      if (statusBadge) {
        const mIdx = parseInt(state.outputFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.outputFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthNames[mIdx];
        statusBadge.textContent = `Monthly: ${mLabel} ${curYear}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'none';
      if (statusBadge) {
        statusBadge.textContent = `All-Time History (${curYear})`;
        statusBadge.className = 'badge badge-priority-rush';
      }
    }
  }

  function setupOutputFilterToolbarEvents() {
    const yearSelect = document.getElementById('outputFilterYear');
    const monthSelect = document.getElementById('outputFilterMonth');
    const weekSelect = document.getElementById('outputFilterWeek');
    const dateInput = document.getElementById('outputFilterDate');
    const btnPrevWeek = document.getElementById('btnPrevWeek');
    const btnNextWeek = document.getElementById('btnNextWeek');
    const btnPrevDay = document.getElementById('btnPrevDay');
    const btnNextDay = document.getElementById('btnNextDay');
    const btnFilterToday = document.getElementById('btnFilterToday');
    const btnReset = document.getElementById('btnResetOutputFilter');

    initOutputFilterState();

    if (yearSelect && !yearSelect._bound) {
      yearSelect._bound = true;
      yearSelect.addEventListener('change', () => {
        state.outputFilter.year = yearSelect.value;
        if (state.outputFilter.timeframe === 'today') {
          const parts = state.outputFilter.dayDate.split('-');
          state.outputFilter.dayDate = `${yearSelect.value === 'all' ? '2026' : yearSelect.value}-${parts[1]}-${parts[2]}`;
          if (dateInput) dateInput.value = state.outputFilter.dayDate;
        } else if (state.outputFilter.timeframe === 'week') {
          populateOutputWeekOptions();
        }
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (monthSelect && !monthSelect._bound) {
      monthSelect._bound = true;
      monthSelect.addEventListener('change', () => {
        state.outputFilter.month = monthSelect.value;
        const selYear = state.outputFilter.year === 'all' ? '2026' : state.outputFilter.year;
        if (monthSelect.value !== 'all') {
          const mNum = parseInt(monthSelect.value, 10) + 1;
          const mStr = String(mNum).padStart(2, '0');
          if (state.outputFilter.timeframe === 'today') {
            state.outputFilter.dayDate = `${selYear}-${mStr}-15`;
            if (dateInput) dateInput.value = state.outputFilter.dayDate;
          } else if (state.outputFilter.timeframe === 'week') {
            populateOutputWeekOptions();
          }
        }
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (weekSelect && !weekSelect._bound) {
      weekSelect._bound = true;
      weekSelect.addEventListener('change', () => {
        state.outputFilter.weekStartDate = weekSelect.value;
        renderMonthlyOutputReport(state.outputFilter.timeframe);
      });
    }

    if (btnPrevWeek && !btnPrevWeek._bound) {
      btnPrevWeek._bound = true;
      btnPrevWeek.addEventListener('click', () => {
        const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const curMon = new Date(parts[0], parts[1] - 1, parts[2]);
        curMon.setDate(curMon.getDate() - 7);
        state.outputFilter.weekStartDate = formatIsoDate(curMon);
        populateOutputWeekOptions();
        renderMonthlyOutputReport('week');
      });
    }

    if (btnNextWeek && !btnNextWeek._bound) {
      btnNextWeek._bound = true;
      btnNextWeek.addEventListener('click', () => {
        const parts = (state.outputFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const curMon = new Date(parts[0], parts[1] - 1, parts[2]);
        curMon.setDate(curMon.getDate() + 7);
        state.outputFilter.weekStartDate = formatIsoDate(curMon);
        populateOutputWeekOptions();
        renderMonthlyOutputReport('week');
      });
    }

    if (dateInput && !dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener('change', () => {
        if (!dateInput.value) return;
        state.outputFilter.dayDate = dateInput.value;
        const parts = dateInput.value.split('-').map(Number);
        if (yearSelect && parts[0]) {
          yearSelect.value = String(parts[0]);
          state.outputFilter.year = String(parts[0]);
        }
        if (monthSelect && parts[1]) {
          monthSelect.value = String(parts[1] - 1);
          state.outputFilter.month = String(parts[1] - 1);
        }
        renderMonthlyOutputReport('today');
      });
    }

    if (btnPrevDay && !btnPrevDay._bound) {
      btnPrevDay._bound = true;
      btnPrevDay.addEventListener('click', () => {
        const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() - 1);
        state.outputFilter.dayDate = formatIsoDate(d);
        if (dateInput) dateInput.value = state.outputFilter.dayDate;
        renderMonthlyOutputReport('today');
      });
    }

    if (btnNextDay && !btnNextDay._bound) {
      btnNextDay._bound = true;
      btnNextDay.addEventListener('click', () => {
        const parts = (state.outputFilter.dayDate || '2026-10-26').split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + 1);
        state.outputFilter.dayDate = formatIsoDate(d);
        if (dateInput) dateInput.value = state.outputFilter.dayDate;
        renderMonthlyOutputReport('today');
      });
    }

    if (btnFilterToday && !btnFilterToday._bound) {
      btnFilterToday._bound = true;
      btnFilterToday.addEventListener('click', () => {
        state.outputFilter.dayDate = '2026-10-26';
        state.outputFilter.year = '2026';
        state.outputFilter.month = '9';
        if (dateInput) dateInput.value = '2026-10-26';
        if (yearSelect) yearSelect.value = '2026';
        if (monthSelect) monthSelect.value = '9';
        renderMonthlyOutputReport('today');
      });
    }

    if (btnReset && !btnReset._bound) {
      btnReset._bound = true;
      btnReset.addEventListener('click', () => {
        state.outputFilter = {
          timeframe: 'month',
          year: '2026',
          month: '9',
          weekStartDate: '2026-10-19',
          dayDate: '2026-10-26'
        };
        if (yearSelect) yearSelect.value = '2026';
        if (monthSelect) monthSelect.value = '9';
        if (dateInput) dateInput.value = '2026-10-26';
        populateOutputWeekOptions();
        renderMonthlyOutputReport('month');
        showToast('Filters reset to default (October 2026)');
      });
    }
  }

  function renderMonthlyOutputReport(timeframe) {
    initOutputFilterState();
    setupOutputFilterToolbarEvents();

    const rawTf = timeframe || state.outputFilter.timeframe || state.timeframe || 'month';
    let tf = 'month';
    const lowTf = String(rawTf).toLowerCase().trim();
    if (lowTf === 'today' || lowTf === 'daily' || lowTf === 'day') tf = 'today';
    else if (lowTf === 'week' || lowTf === 'weekly') tf = 'week';
    else if (lowTf === 'month' || lowTf === 'monthly') tf = 'month';
    else if (lowTf === 'all' || lowTf === 'all_time' || lowTf === 'alltime') tf = 'all';

    state.timeframe = tf;
    state.outputFilter.timeframe = tf;

    // Sync timeframe buttons on page and navbar
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
      const bTf = (btn.getAttribute('data-timeframe') || '').toLowerCase();
      const isAct = (bTf === tf) || 
                    (tf === 'today' && (bTf === 'daily' || bTf === 'today' || bTf === 'day')) ||
                    (tf === 'week' && (bTf === 'weekly' || bTf === 'week')) ||
                    (tf === 'month' && (bTf === 'monthly' || bTf === 'month')) ||
                    (tf === 'all' && (bTf === 'all' || bTf === 'all_time' || bTf === 'alltime'));
      btn.classList.toggle('active', isAct);
    });

    // Update filter toolbar controls visibility and values
    syncOutputFilterControlsUI(tf);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // 1. All completed requests
    const allCompleted = (state.requests || []).filter(r => 
      r.projectStatus === 'Completed' || r.designStatus === 'Submitted'
    );

    // Dynamic Elements References
    const reportTitle = document.getElementById('outputReportTitle');
    const reportSubtitle = document.getElementById('outputReportSubtitle');
    const chartTitle = document.getElementById('outputChartTitle');
    const chartSubtitle = document.getElementById('outputChartSubtitle');
    const chartBadge = document.getElementById('outputChartIntervalBadge');
    const matrixTitle = document.getElementById('outputMatrixTitle');
    const matrixBadge = document.getElementById('outputMatrixBadge');
    const thead = document.getElementById('monthlyOutputTableHead');
    const tbody = document.getElementById('monthlyOutputTableBody');
    const tfoot = document.getElementById('monthlyOutputTableFoot');
    const dailyCard = document.getElementById('dailyCompletedTasksCard');

    // KPI Elements
    const kpi1Title = document.getElementById('outputKpi1Title');
    const kpi1Val = document.getElementById('outputYtdTotal');
    const kpi1Desc = document.getElementById('outputKpi1Desc');

    const kpi2Title = document.getElementById('outputKpi2Title');
    const kpi2Val = document.getElementById('outputCurrentMonthTotal');
    const kpi2Desc = document.getElementById('outputKpi2Desc');

    const kpi3Title = document.getElementById('outputKpi3Title');
    const kpi3Val = document.getElementById('outputTopArtistName');
    const kpi3Desc = document.getElementById('outputTopArtistCount');

    const kpi4Title = document.getElementById('outputKpi4Title');
    const kpi4Val = document.getElementById('outputMonthlyAvg');
    const kpi4Desc = document.getElementById('outputKpi4Desc');

    // =========================================================================
    // CASE 1: DAILY / TODAY VIEW (Filtered by specific Day)
    // =========================================================================
    if (tf === 'today') {
      const targetIso = state.outputFilter.dayDate || '2026-10-26';
      const [dy, dm, dd] = targetIso.split('-').map(Number);
      const dateObj = new Date(dy, dm - 1, dd);
      const formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

      if (reportTitle) reportTitle.textContent = `Daily Production Output Report — ${formattedDay}`;
      if (reportSubtitle) reportSubtitle.textContent = `Verified output and completed artist assignments for ${formattedDay}`;
      if (chartTitle) chartTitle.textContent = `Daily Completed Output per Artist (${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      if (chartSubtitle) chartSubtitle.textContent = `Verified assignments finished on ${formattedDay} across all active artists`;
      if (chartBadge) { chartBadge.textContent = 'Daily Interval'; chartBadge.className = 'badge badge-completed'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Daily Production Matrix (${formattedDay})`;
      if (matrixBadge) { matrixBadge.textContent = "Day's Verified Output"; matrixBadge.className = 'badge badge-completed'; }

      // Filter requests completed on the exact target day
      let dayReqs = allCompleted.filter(r => {
        const dStr = r.releasingDate || r.designDeadline || r.orderDate;
        const d = parseRequestDate(dStr);
        if (!d) return false;
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return iso === targetIso;
      });

      // Group by artist
      const artistData = {};
      state.artists.forEach(a => {
        artistData[a] = { artist: a, std: 0, prt: 0, spc: 0, total: 0, revisions: 0 };
      });

      let totalDayOutput = 0;
      let totalStd = 0, totalPrt = 0, totalSpc = 0, totalRev = 0;

      dayReqs.forEach(r => {
        let art = toTitleCase(r.artist);
        if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
        if (art === 'Gle') art = 'Glen';

        if (!artistData[art]) {
          artistData[art] = { artist: art, std: 0, prt: 0, spc: 0, total: 0, revisions: 0 };
        }
        const std = parseInt(r.countStandard, 10) || 0;
        const prt = parseInt(r.countPrinting, 10) || 0;
        const spc = parseInt(r.countSpecial, 10) || 0;
        const cnt = Math.max(std + prt + spc, 1);
        const rev = parseInt(r.revisionCount, 10) || 0;

        artistData[art].std += std;
        artistData[art].prt += prt;
        artistData[art].spc += spc;
        artistData[art].total += cnt;
        artistData[art].revisions += rev;

        totalDayOutput += cnt;
        totalStd += std;
        totalPrt += prt;
        totalSpc += spc;
        totalRev += rev;
      });

      const sortedArtists = Object.values(artistData).sort((a, b) => b.total - a.total);
      const topArt = sortedArtists[0] && sortedArtists[0].total > 0 ? sortedArtists[0].artist : (state.artists[0] || 'Glen');
      const topCount = sortedArtists[0] ? sortedArtists[0].total : 0;
      const activeArtistsCount = sortedArtists.filter(a => a.total > 0).length;

      // Update KPIs
      if (kpi1Title) kpi1Title.textContent = "Selected Day's Output";
      if (kpi1Val) kpi1Val.textContent = Number(totalDayOutput).toLocaleString();
      if (kpi1Desc) kpi1Desc.textContent = `${dayReqs.length} finished job order${dayReqs.length === 1 ? '' : 's'}`;

      if (kpi2Title) kpi2Title.textContent = "Day's Category Mix";
      if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${totalStd} | Prt: ${totalPrt} | Spc: ${totalSpc}</span>`;
      if (kpi2Desc) kpi2Desc.textContent = "Fabrication breakdown";

      if (kpi3Title) kpi3Title.textContent = "Top Producer on Date";
      if (kpi3Val) kpi3Val.textContent = topArt;
      if (kpi3Desc) kpi3Desc.textContent = `${topCount} completed assignment${topCount === 1 ? '' : 's'}`;

      if (kpi4Title) kpi4Title.textContent = "Contributing Artists";
      if (kpi4Val) kpi4Val.textContent = `${activeArtistsCount} / ${state.artists.length}`;
      if (kpi4Desc) kpi4Desc.textContent = "Designers with output on date";

      // Render Table Header
      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Artist</th>
            <th style="text-align:center;">Standard Signage</th>
            <th style="text-align:center;">Large Format Print</th>
            <th style="text-align:center;">Special Fabrication</th>
            <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">Day's Completed</th>
            <th style="text-align:center;">Revisions</th>
            <th style="text-align:center;">Daily Share</th>
            <th style="text-align:center;">Rank</th>
          </tr>
        `;
      }

      // Render Table Body
      if (tbody) {
        tbody.innerHTML = sortedArtists.map((a, idx) => {
          const share = totalDayOutput > 0 ? ((a.total / totalDayOutput) * 100).toFixed(1) : '0.0';
          const isTop = idx === 0 && a.total > 0;
          return `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="user-avatar" style="width:26px; height:26px; font-size:10px; background:${isTop ? 'var(--primary-green)' : '#0F172A'};">${escapeHTML(a.artist.substring(0, 2).toUpperCase())}</div>
                  <strong>${escapeHTML(a.artist)}</strong>
                  ${isTop ? '<span class="badge badge-priority-rush" style="font-size:9px; padding:1px 5px;">★ Top</span>' : ''}
                </div>
              </td>
              <td style="text-align:center; font-weight:${a.std > 0 ? '700' : '400'}; color:${a.std > 0 ? '#0F172A' : '#94A3B8'};">${a.std}</td>
              <td style="text-align:center; font-weight:${a.prt > 0 ? '700' : '400'}; color:${a.prt > 0 ? '#0F172A' : '#94A3B8'};">${a.prt}</td>
              <td style="text-align:center; font-weight:${a.spc > 0 ? '700' : '400'}; color:${a.spc > 0 ? '#0F172A' : '#94A3B8'};">${a.spc}</td>
              <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">${a.total}</td>
              <td style="text-align:center; color:${a.revisions > 0 ? 'var(--accent-red)' : '#94A3B8'}; font-weight:700;">${a.revisions}</td>
              <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${share}%</td>
              <td style="text-align:center; font-weight:800;">#${idx + 1}</td>
            </tr>
          `;
        }).join('');
      }

      // Render Table Foot
      if (tfoot) {
        tfoot.innerHTML = `
          <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
            <td><strong>TOTAL ON DATE</strong></td>
            <td style="text-align:center;">${totalStd}</td>
            <td style="text-align:center;">${totalPrt}</td>
            <td style="text-align:center;">${totalSpc}</td>
            <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">${totalDayOutput}</td>
            <td style="text-align:center;">${totalRev}</td>
            <td style="text-align:center;">100.0%</td>
            <td style="text-align:center;">—</td>
          </tr>
        `;
      }

      // Render Daily Chart
      renderDailyArtistSvgChart(sortedArtists, totalDayOutput);

      // Render Completed Tasks Log for this day
      if (dailyCard) {
        dailyCard.style.display = 'block';
        const tasksTitle = document.getElementById('dailyTasksTitle');
        const tasksSubtitle = document.getElementById('dailyTasksSubtitle');
        const countBadge = document.getElementById('dailyTasksCountBadge');

        if (tasksTitle) tasksTitle.textContent = `Completed Production Tasks (${formattedDay})`;
        if (tasksSubtitle) tasksSubtitle.textContent = `Detailed log of individual job orders finished on ${formattedDay}`;
        if (countBadge) countBadge.textContent = `${dayReqs.length} Completed`;

        const logTbody = document.getElementById('dailyCompletedTasksTableBody');
        if (logTbody) {
          if (dayReqs.length === 0) {
            logTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">No completed tasks logged for ${formattedDay}.</td></tr>`;
          } else {
            logTbody.innerHTML = dayReqs.map(r => {
              const catBadge = r.countSpecial > 0 ? '<span class="badge badge-priority-rush">Special</span>' :
                               (r.countPrinting > 0 ? '<span class="badge badge-ongoing">Printing</span>' : '<span class="badge badge-completed">Standard</span>');
              return `
                <tr>
                  <td><strong style="color:var(--primary-green); font-family:monospace;">${escapeHTML(r.requestId)}</strong></td>
                  <td><strong style="color:var(--accent-red); font-family:monospace;">${escapeHTML(r.joNumber)}</strong></td>
                  <td><strong>${escapeHTML(r.projectName)}</strong></td>
                  <td>${escapeHTML(r.client)}</td>
                  <td><span class="badge badge-artist">${escapeHTML(r.artist)}</span></td>
                  <td>${catBadge}</td>
                  <td><span style="font-size:12px; color:var(--text-secondary);">${formatReadableDate(r.releasingDate || r.designDeadline || r.orderDate)}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
                  </td>
                </tr>
              `;
            }).join('');
          }
        }
      }

      setupCsvExportButton(`daily_${targetIso}`, sortedArtists);
      return;
    }

    // Hide daily log on non-daily modes
    if (dailyCard) dailyCard.style.display = 'none';

    // =========================================================================
    // CASE 2: WEEKLY VIEW (Filtered by specific Week: Monday — Sunday)
    // =========================================================================
    if (tf === 'week') {
      const weekStartIso = state.outputFilter.weekStartDate || '2026-10-19';
      const [wy, wm, wd] = weekStartIso.split('-').map(Number);
      const startMon = new Date(wy, wm - 1, wd);
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
        const cur = new Date(startMon);
        cur.setDate(startMon.getDate() + i);
        const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
        const mName = cur.toLocaleDateString('en-US', { month: 'short' });
        weekDays.push({
          day: dayNames[i],
          dateStr: iso,
          label: `${dayNames[i]} (${mName} ${cur.getDate()})`
        });
      }

      const weekRangeLabel = `${weekDays[0].label} — ${weekDays[6].label}`;

      if (reportTitle) reportTitle.textContent = `Weekly Production Output Report (${weekRangeLabel})`;
      if (reportSubtitle) reportSubtitle.textContent = `Verified output breakdown by day for the active week (${weekRangeLabel})`;
      if (chartTitle) chartTitle.textContent = `Weekly Production Trend by Day (${weekRangeLabel})`;
      if (chartSubtitle) chartSubtitle.textContent = 'Daily completed assignment counts across the 7 days of the selected work week';
      if (chartBadge) { chartBadge.textContent = 'Weekly Interval'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Weekly Output Matrix (${weekRangeLabel})`;
      if (matrixBadge) { matrixBadge.textContent = 'Weekly Verified Output'; matrixBadge.className = 'badge badge-completed'; }

      const weekMatrix = {};
      state.artists.forEach(a => {
        weekMatrix[a] = [0, 0, 0, 0, 0, 0, 0];
      });

      let weekTotal = 0;
      let weekStd = 0, weekPrt = 0, weekSpc = 0;
      const dailyTotals = [0, 0, 0, 0, 0, 0, 0];

      allCompleted.forEach(r => {
        const dStr = r.releasingDate || r.designDeadline || r.orderDate;
        const d = parseRequestDate(dStr);
        if (!d) return;
        const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const dayIdx = weekDays.findIndex(w => w.dateStr === isoDate);
        if (dayIdx >= 0) {
          let art = toTitleCase(r.artist);
          if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
          if (art === 'Gle') art = 'Glen';

          if (!weekMatrix[art]) weekMatrix[art] = [0, 0, 0, 0, 0, 0, 0];

          const std = parseInt(r.countStandard, 10) || 0;
          const prt = parseInt(r.countPrinting, 10) || 0;
          const spc = parseInt(r.countSpecial, 10) || 0;
          const cnt = Math.max(std + prt + spc, 1);

          weekMatrix[art][dayIdx] += cnt;
          dailyTotals[dayIdx] += cnt;
          weekTotal += cnt;
          weekStd += std;
          weekPrt += prt;
          weekSpc += spc;
        }
      });

      // Rows per artist
      const weekRows = state.artists.map(art => {
        const counts = weekMatrix[art] || [0, 0, 0, 0, 0, 0, 0];
        const sum = counts.reduce((a, b) => a + b, 0);
        return { artist: art, counts, sum };
      });
      weekRows.sort((a, b) => b.sum - a.sum);

      const topWeekArt = weekRows[0] && weekRows[0].sum > 0 ? weekRows[0].artist : (state.artists[0] || 'Glen');
      const topWeekCount = weekRows[0] ? weekRows[0].sum : 0;

      // Update KPIs
      if (kpi1Title) kpi1Title.textContent = "Weekly Output Total";
      if (kpi1Val) kpi1Val.textContent = Number(weekTotal).toLocaleString();
      if (kpi1Desc) kpi1Desc.textContent = `Completed ${weekRangeLabel}`;

      if (kpi2Title) kpi2Title.textContent = "Weekly Category Mix";
      if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${weekStd} | Prt: ${weekPrt} | Spc: ${weekSpc}</span>`;
      if (kpi2Desc) kpi2Desc.textContent = "Weekly fabrication types";

      if (kpi3Title) kpi3Title.textContent = "Top Producer This Week";
      if (kpi3Val) kpi3Val.textContent = topWeekArt;
      if (kpi3Desc) kpi3Desc.textContent = `${topWeekCount} completed jobs this week`;

      if (kpi4Title) kpi4Title.textContent = "Daily Run Rate";
      if (kpi4Val) kpi4Val.textContent = `${(weekTotal / 7).toFixed(1)} / day`;
      if (kpi4Desc) kpi4Desc.textContent = "Average completed per day";

      // Render Table Header
      if (thead) {
        thead.innerHTML = `
          <tr>
            <th>Artist</th>
            ${weekDays.map(w => `<th style="text-align:center;">${w.label}</th>`).join('')}
            <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">Week Total</th>
            <th style="text-align:center;">Team Share</th>
            <th style="text-align:center;">Rank</th>
          </tr>
        `;
      }

      // Render Table Body
      if (tbody) {
        tbody.innerHTML = weekRows.map((r, idx) => {
          const share = weekTotal > 0 ? ((r.sum / weekTotal) * 100).toFixed(1) : '0.0';
          return `
            <tr>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="user-avatar" style="width:26px; height:26px; font-size:10px;">${escapeHTML(r.artist.substring(0, 2).toUpperCase())}</div>
                  <strong>${escapeHTML(r.artist)}</strong>
                </div>
              </td>
              ${r.counts.map(c => `<td style="text-align:center; font-weight:${c > 0 ? '700' : '400'}; color:${c > 0 ? '#0F172A' : '#94A3B8'};">${c}</td>`).join('')}
              <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">${r.sum}</td>
              <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${share}%</td>
              <td style="text-align:center; font-weight:800;">#${idx + 1}</td>
            </tr>
          `;
        }).join('');
      }

      // Render Table Foot
      if (tfoot) {
        tfoot.innerHTML = `
          <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
            <td><strong>WEEKLY TOTAL</strong></td>
            ${dailyTotals.map(dt => `<td style="text-align:center; font-weight:800;">${dt}</td>`).join('')}
            <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">${weekTotal}</td>
            <td style="text-align:center;">100.0%</td>
            <td style="text-align:center;">—</td>
          </tr>
        `;
      }

      // Render Weekly SVG Chart
      renderWeeklySvgChart(weekDays, dailyTotals);

      // Export handler for Weekly
      setupCsvExportButton(`weekly_${weekStartIso}`, weekRows, weekDays);
      return;
    }

    // =========================================================================
    // CASE 3 & 4: MONTHLY & ALL-TIME VIEW (Filtered by Year and Month)
    // =========================================================================
    const selectedYear = state.outputFilter.year || '2026';
    const isYearFilter = (selectedYear !== 'all');
    const targetYearNum = isYearFilter ? parseInt(selectedYear, 10) : null;

    const rawMonth = state.outputFilter.month;
    const isAllMonths = (rawMonth === 'all' || rawMonth === undefined);
    const selectedMIdx = isAllMonths ? null : parseInt(rawMonth, 10);

    const isMonthOnly = (tf === 'month');

    if (isMonthOnly) {
      if (isAllMonths) {
        if (reportTitle) reportTitle.textContent = `${isYearFilter ? selectedYear : 'All-Time'} Annual Production Output Report`;
        if (reportSubtitle) reportSubtitle.textContent = `Verified output breakdown by month across all active artists (Jan — Dec ${isYearFilter ? selectedYear : 'History'})`;
      } else {
        const mName = monthFullNames[selectedMIdx] || months[selectedMIdx];
        if (reportTitle) reportTitle.textContent = `${mName} ${isYearFilter ? selectedYear : '2026'} Production Output Report`;
        if (reportSubtitle) reportSubtitle.textContent = `Verified output performance and artist breakdown for ${mName} ${isYearFilter ? selectedYear : '2026'}`;
      }
      if (chartTitle) chartTitle.textContent = `${isAllMonths ? 'Jan — Dec' : months[selectedMIdx]} ${isYearFilter ? selectedYear : ''} Completed Output`;
      if (chartSubtitle) chartSubtitle.textContent = 'Hover over bars for exact monthly count and verified volume';
      if (chartBadge) { chartBadge.textContent = 'Monthly Interval'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Monthly Output Matrix (Jan — Dec ${isYearFilter ? selectedYear : '2026'})`;
      if (matrixBadge) { matrixBadge.textContent = isAllMonths ? 'Full Year Matrix' : `${months[selectedMIdx]} Highlighted`; matrixBadge.className = 'badge badge-completed'; }
    } else {
      if (reportTitle) reportTitle.textContent = `All-Time Production Output Analytics ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (reportSubtitle) reportSubtitle.textContent = 'Comprehensive production history and cumulative performance rankings';
      if (chartTitle) chartTitle.textContent = `Completed Assignments by Month ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (chartSubtitle) chartSubtitle.textContent = 'Historical verified volume distribution across months';
      if (chartBadge) { chartBadge.textContent = 'All-Time Output'; chartBadge.className = 'badge badge-ongoing'; }
      if (matrixTitle) matrixTitle.textContent = `Artist Production Output Matrix ${isYearFilter ? `(${selectedYear})` : ''}`;
      if (matrixBadge) { matrixBadge.textContent = 'Historical Grand Total'; matrixBadge.className = 'badge badge-completed'; }
    }

    const matrix = {};
    state.artists.forEach(a => {
      matrix[a] = new Array(12).fill(0);
    });

    let ytdTotal = 0;
    let selectedPeriodTotal = 0;
    let totalStd = 0, totalPrt = 0, totalSpc = 0;
    let filterMonthStd = 0, filterMonthPrt = 0, filterMonthSpc = 0;

    allCompleted.forEach(r => {
      const dateStr = r.releasingDate || r.designDeadline || r.orderDate;
      const d = parseRequestDate(dateStr);
      if (!d) return;

      if (targetYearNum && d.getFullYear() !== targetYearNum) return;

      const mIdx = d.getMonth();
      if (mIdx < 0 || mIdx > 11) return;

      let art = toTitleCase(r.artist);
      if (art === 'Juls' || art === 'Ju' || art === 'J') art = 'Jules';
      if (art === 'Gle') art = 'Glen';

      if (!matrix[art]) matrix[art] = new Array(12).fill(0);

      const std = parseInt(r.countStandard, 10) || 0;
      const prt = parseInt(r.countPrinting, 10) || 0;
      const spc = parseInt(r.countSpecial, 10) || 0;
      const cnt = Math.max(std + prt + spc, 1);

      matrix[art][mIdx] += cnt;
      ytdTotal += cnt;
      totalStd += std;
      totalPrt += prt;
      totalSpc += spc;

      if (selectedMIdx !== null && mIdx === selectedMIdx) {
        selectedPeriodTotal += cnt;
        filterMonthStd += std;
        filterMonthPrt += prt;
        filterMonthSpc += spc;
      }
    });

    const displayTotal = (selectedMIdx !== null) ? selectedPeriodTotal : ytdTotal;
    const displayStd = (selectedMIdx !== null) ? filterMonthStd : totalStd;
    const displayPrt = (selectedMIdx !== null) ? filterMonthPrt : totalPrt;
    const displaySpc = (selectedMIdx !== null) ? filterMonthSpc : totalSpc;

    // Monthly totals per month column
    const monthlyTotals = new Array(12).fill(0);
    Object.values(matrix).forEach(counts => {
      counts.forEach((c, idx) => { monthlyTotals[idx] += c; });
    });

    // Rows per artist
    const rows = state.artists.map(art => {
      const counts = matrix[art] || new Array(12).fill(0);
      const annualSum = counts.reduce((a, b) => a + b, 0);
      const monthCount = (selectedMIdx !== null) ? (counts[selectedMIdx] || 0) : annualSum;
      return { artist: art, counts, annualSum, monthCount };
    });

    // Sort by selected month or annual sum
    if (selectedMIdx !== null) {
      rows.sort((a, b) => b.monthCount - a.monthCount);
    } else {
      rows.sort((a, b) => b.annualSum - a.annualSum);
    }

    const topArtist = rows[0] ? rows[0].artist : (state.artists[0] || 'Glen');
    const topArtistCount = rows[0] ? (selectedMIdx !== null ? rows[0].monthCount : rows[0].annualSum) : 0;

    // Active months calculation
    const activeMonthsCount = monthlyTotals.filter(t => t > 0).length || 8;
    const monthlyAvg = activeMonthsCount > 0 ? (ytdTotal / activeMonthsCount).toFixed(1) : '0';

    // Update KPIs
    if (kpi1Title) kpi1Title.textContent = (selectedMIdx !== null) ? `${months[selectedMIdx]} Output Total` : "Period Total Output";
    if (kpi1Val) kpi1Val.textContent = Number(displayTotal).toLocaleString();
    if (kpi1Desc) kpi1Desc.textContent = (selectedMIdx !== null) ? `Completed in ${months[selectedMIdx]} ${selectedYear}` : `Completed across ${activeMonthsCount} active months`;

    if (kpi2Title) kpi2Title.textContent = (selectedMIdx !== null) ? `${months[selectedMIdx]} Category Mix` : "Category Breakdown";
    if (kpi2Val) kpi2Val.innerHTML = `<span style="font-size:16px; font-weight:800; color:var(--text-main);">Std: ${displayStd} | Prt: ${displayPrt} | Spc: ${displaySpc}</span>`;
    if (kpi2Desc) kpi2Desc.textContent = "Fabrication distribution";

    if (kpi3Title) kpi3Title.textContent = (selectedMIdx !== null) ? `Top Producer in ${months[selectedMIdx]}` : "Top Producer";
    if (kpi3Val) kpi3Val.textContent = topArtist;
    if (kpi3Desc) kpi3Desc.textContent = `${topArtistCount} completed jobs`;

    if (kpi4Title) kpi4Title.textContent = (selectedMIdx !== null) ? "Daily Run Rate" : "Productivity Benchmark";
    if (kpi4Val) kpi4Val.textContent = (selectedMIdx !== null) ? `${(displayTotal / 30).toFixed(1)} / day` : `${monthlyAvg} / mo`;
    if (kpi4Desc) kpi4Desc.textContent = (selectedMIdx !== null) ? "Average completed per day" : "Average monthly output rate";

    // Highlight index
    const highlightMIdx = (selectedMIdx !== null) ? selectedMIdx : 9;

    // Render Table Header
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>Artist</th>
          ${months.map((m, idx) => `
            <th style="text-align:center; ${idx === highlightMIdx ? 'background:#D1FAE5; color:#065F46; font-weight:900;' : ''}">
              ${m}
            </th>
          `).join('')}
          <th style="text-align:center; font-weight:800; background:#EBF7F4; color:var(--primary-green);">${selectedMIdx !== null ? `${months[selectedMIdx]} Total` : 'Annual Total'}</th>
          <th style="text-align:center;">Rank</th>
        </tr>
      `;
    }

    // Pagination
    const totalItems = rows.length;
    const page = state.monthlyOutputPage || 1;
    const perPage = state.monthlyOutputPerPage || 10;
    const { validPage, startIndex } = renderPagination({
      infoId: 'monthlyOutputPaginationInfo',
      controlsId: 'monthlyOutputPaginationControls',
      selectIds: ['monthlyOutputFilterPerPage', 'monthlyOutputPaginationPerPage'],
      currentPage: page,
      perPage,
      totalItems,
      onPageChange: 'window.SignDepotApp.setMonthlyOutputPage',
      itemLabel: 'artists'
    });
    state.monthlyOutputPage = validPage;
    const pagedRows = rows.slice(startIndex, startIndex + perPage);

    // Table Body
    if (tbody) {
      tbody.innerHTML = pagedRows.map((r, idx) => {
        const isTop = idx === 0 && (selectedMIdx !== null ? r.monthCount > 0 : r.annualSum > 0);
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar" style="width:26px; height:26px; font-size:10px; background:${isTop ? 'var(--primary-green)' : '#0F172A'};">${escapeHTML(r.artist.substring(0, 2).toUpperCase())}</div>
                <strong>${escapeHTML(r.artist)}</strong>
                ${isTop ? '<span class="badge badge-priority-rush" style="font-size:9px; padding:1px 5px;">★ Top</span>' : ''}
              </div>
            </td>
            ${r.counts.map((c, mIdx) => `
              <td style="text-align:center; font-weight:${c > 0 ? '700' : '400'}; color:${c > 0 ? '#0F172A' : '#94A3B8'}; ${mIdx === highlightMIdx ? 'background:#F0FDF4; font-weight:800; color:#065F46;' : ''}">
                ${c}
              </td>
            `).join('')}
            <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">
              ${selectedMIdx !== null ? r.monthCount : r.annualSum}
            </td>
            <td style="text-align:center; font-weight:800;">#${startIndex + idx + 1}</td>
          </tr>
        `;
      }).join('');
    }

    // Table Foot
    if (tfoot) {
      tfoot.innerHTML = `
        <tr style="background:#F8FAFC; font-weight:800; border-top:2px solid #CBD5E1;">
          <td><strong>TOTAL OUTPUT</strong></td>
          ${monthlyTotals.map((mt, mIdx) => `
            <td style="text-align:center; font-weight:800; ${mIdx === highlightMIdx ? 'background:#D1FAE5; color:#065F46; font-weight:900;' : ''}">
              ${mt}
            </td>
          `).join('')}
          <td style="text-align:center; background:#D1FAE5; color:#065F46; font-size:15px; font-weight:900;">
            ${selectedMIdx !== null ? selectedPeriodTotal : ytdTotal}
          </td>
          <td style="text-align:center;">—</td>
        </tr>
      `;
    }

    // Render 12-Month SVG Chart with active month highlight
    renderMonthlyOutputSvgChart(months, matrix, highlightMIdx, selectedYear);

    // Export CSV
    setupCsvExportButton(isMonthOnly ? (selectedMIdx !== null ? `month_${months[selectedMIdx]}_${selectedYear}` : `monthly_${selectedYear}`) : `all_time_${selectedYear}`, rows, months);
  }

  function setupCsvExportButton(mode, rows, headerCols) {
    const btn = document.getElementById('btnExportMonthlyReportCSV');
    if (!btn) return;
    btn.onclick = () => {
      let csvContent = '';
      if (mode === 'daily') {
        const headers = ['Artist', 'Standard Signage', 'Large Format Printing', 'Special Fabrication', "Today's Total", 'Revisions', 'Daily Share %'];
        const lines = [headers.join(',')];
        const dayTot = rows.reduce((acc, r) => acc + (r.total || 0), 0);
        rows.forEach(r => {
          const share = dayTot > 0 ? ((r.total / dayTot) * 100).toFixed(1) : '0.0';
          lines.push([`"${r.artist}"`, r.std, r.prt, r.spc, r.total, r.revisions, `"${share}%"`].join(','));
        });
        csvContent = lines.join('\n');
      } else if (mode === 'weekly') {
        const headers = ['Artist', ...headerCols.map(h => `"${h.label}"`), 'Week Total', 'Team Share %'];
        const lines = [headers.join(',')];
        const wTot = rows.reduce((acc, r) => acc + r.sum, 0);
        rows.forEach(r => {
          const share = wTot > 0 ? ((r.sum / wTot) * 100).toFixed(1) : '0.0';
          lines.push([`"${r.artist}"`, ...r.counts, r.sum, `"${share}%"`].join(','));
        });
        csvContent = lines.join('\n');
      } else {
        const headers = ['Artist', ...headerCols, 'Total Output'];
        const lines = [headers.join(',')];
        rows.forEach(r => {
          lines.push([`"${r.artist}"`, ...r.counts, r.annualSum].join(','));
        });
        csvContent = lines.join('\n');
      }
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sign_Depot_Production_Output_${mode}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${mode.toUpperCase()} output report to CSV.`);
    };
  }

  function renderDailyArtistSvgChart(sortedArtists, totalDayOutput) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const topArtists = sortedArtists.slice(0, 9);
    const maxVal = Math.max(...topArtists.map(a => a.total), 4);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 54;
    const padding = 36;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * topArtists.length) / Math.max(topArtists.length - 1, 1);

    let bars = '';
    topArtists.forEach((a, idx) => {
      const total = a.total;
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isTop = idx === 0 && total > 0;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isTop ? 'var(--primary-green)' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${a.artist}: ${total} completed assignments today</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#64748B">${a.artist}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }

  function renderWeeklySvgChart(weekDays, dailyTotals) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const maxVal = Math.max(...dailyTotals, 8);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 64;
    const padding = 40;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * 7) / 6;

    let bars = '';
    weekDays.forEach((w, idx) => {
      const total = dailyTotals[idx];
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isPeak = total === Math.max(...dailyTotals) && total > 0;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isPeak ? '#176B55' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${w.label}: ${total} completed assignments</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="700" fill="#64748B">${w.label}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }

  function renderMonthlyOutputSvgChart(months, matrix, highlightMIdx, yearLabel) {
    const container = document.getElementById('monthlyChartSvgContainer');
    if (!container) return;

    const monthlyTotals = new Array(12).fill(0);
    Object.values(matrix).forEach(counts => {
      counts.forEach((c, idx) => {
        monthlyTotals[idx] += c;
      });
    });

    const maxVal = Math.max(...monthlyTotals, 8);
    const svgWidth = 850;
    const svgHeight = 220;
    const barWidth = 42;
    const padding = 32;
    const usableWidth = svgWidth - padding * 2;
    const gap = (usableWidth - barWidth * 12) / 11;
    const activeHighlight = (highlightMIdx !== undefined && highlightMIdx !== null) ? highlightMIdx : 9;

    let bars = '';
    monthlyTotals.forEach((total, idx) => {
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isSelected = idx === activeHighlight;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isSelected ? 'var(--primary-green)' : '#0F172A'}" 
            opacity="${total > 0 ? '1' : '0.35'}">
            <title>${months[idx]} ${yearLabel || '2026'}: ${total} completed assignments</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="${isSelected ? '800' : '600'}" fill="${isSelected ? 'var(--primary-green)' : '#64748B'}">${months[idx]}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding}" y1="170" x2="${svgWidth - padding}" y2="170" stroke="#E2E8F0" stroke-width="1.5" />
        ${bars}
      </svg>
    `;
  }

  // ==========================================================================
  // MODULE 8B: COMPREHENSIVE REPORTS & ANALYTICS ENGINE (DATABASE DRIVEN)
  // ==========================================================================

  function initReportFilterState() {
    if (!state.reportFilter) {
      state.reportFilter = {
        timeframe: state.timeframe || 'month',
        year: '2026',
        month: '9', // 0-indexed: 9 = October
        weekStartDate: '2026-10-19', // Monday of peak active week
        dayDate: '2026-10-26', // Today
        department: 'all'
      };
    }
  }

  function populateReportWeekOptions() {
    const weekSelect = document.getElementById('reportFilterWeek');
    if (!weekSelect) return;

    initReportFilterState();
    const selYear = state.reportFilter.year === 'all' ? 2026 : parseInt(state.reportFilter.year, 10);
    const selMonth = state.reportFilter.month === 'all' ? null : parseInt(state.reportFilter.month, 10);

    const options = [];
    const startYear = new Date(selYear, 0, 1);
    const firstMon = getMondayOfWeek(startYear);
    const endYear = new Date(selYear, 11, 31);

    let curMon = new Date(firstMon);
    let weekIndex = 1;

    while (curMon <= endYear || curMon.getFullYear() === selYear) {
      const sun = new Date(curMon);
      sun.setDate(sun.getDate() + 6);

      let include = true;
      if (selMonth !== null) {
        include = (curMon.getMonth() === selMonth || sun.getMonth() === selMonth);
      }

      if (include && (curMon.getFullYear() === selYear || sun.getFullYear() === selYear)) {
        const iso = formatIsoDate(curMon);
        const m1 = curMon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const m2 = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isPeak = (iso === '2026-10-19');
        options.push(`<option value="${iso}">${isPeak ? '★ ' : ''}Week ${weekIndex} (${m1} — ${m2})</option>`);
      }

      curMon.setDate(curMon.getDate() + 7);
      weekIndex++;
      if (curMon.getFullYear() > selYear + 1) break;
    }

    weekSelect.innerHTML = options.join('');

    const exists = Array.from(weekSelect.options).some(o => o.value === state.reportFilter.weekStartDate);
    if (exists) {
      weekSelect.value = state.reportFilter.weekStartDate;
    } else if (weekSelect.options.length > 0) {
      const peakOpt = Array.from(weekSelect.options).find(o => o.value === '2026-10-19');
      if (peakOpt) {
        weekSelect.value = '2026-10-19';
        state.reportFilter.weekStartDate = '2026-10-19';
      } else {
        weekSelect.value = weekSelect.options[0].value;
        state.reportFilter.weekStartDate = weekSelect.options[0].value;
      }
    }
  }

  function syncReportFilterControlsUI(tf) {
    initReportFilterState();
    state.reportFilter.timeframe = tf;

    const yearSelect = document.getElementById('reportFilterYear');
    const monthSelect = document.getElementById('reportFilterMonth');
    const fieldWeek = document.getElementById('reportFilterFieldWeek');
    const fieldDay = document.getElementById('reportFilterFieldDay');
    const fieldMonth = document.getElementById('reportFilterFieldMonth');
    const dateInput = document.getElementById('reportFilterDate');
    const deptSelect = document.getElementById('reportDepartment');
    const statusBadge = document.getElementById('reportFilterStatusBadge');

    if (yearSelect) yearSelect.value = state.reportFilter.year || '2026';
    if (monthSelect) monthSelect.value = state.reportFilter.month !== undefined ? state.reportFilter.month : '9';
    if (dateInput) dateInput.value = state.reportFilter.dayDate || '2026-10-26';
    if (deptSelect) deptSelect.value = state.reportFilter.department || 'all';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.reportFilter.year === 'all' ? 'All Years' : state.reportFilter.year;

    if (tf === 'today') {
      if (fieldDay) fieldDay.style.display = 'flex';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      const parts = (state.reportFilter.dayDate || '2026-10-26').split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (statusBadge) {
        statusBadge.textContent = `Daily: ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-completed';
      }
    } else if (tf === 'week') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'flex';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      populateReportWeekOptions();
      const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
      const mon = new Date(parts[0], parts[1] - 1, parts[2]);
      const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
      if (statusBadge) {
        statusBadge.textContent = `Weekly: ${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else if (tf === 'month') {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'flex';
      if (statusBadge) {
        const mIdx = parseInt(state.reportFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.reportFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthNames[mIdx];
        statusBadge.textContent = `Monthly: ${mLabel} ${curYear}`;
        statusBadge.className = 'badge badge-ongoing';
      }
    } else {
      if (fieldDay) fieldDay.style.display = 'none';
      if (fieldWeek) fieldWeek.style.display = 'none';
      if (fieldMonth) fieldMonth.style.display = 'none';
      if (statusBadge) {
        statusBadge.textContent = `All-Time History (${curYear})`;
        statusBadge.className = 'badge badge-priority-rush';
      }
    }
  }

  function setupReportFilterToolbarEvents() {
    const yearSelect = document.getElementById('reportFilterYear');
    const monthSelect = document.getElementById('reportFilterMonth');
    const weekSelect = document.getElementById('reportFilterWeek');
    const dateInput = document.getElementById('reportFilterDate');
    const deptSelect = document.getElementById('reportDepartment');
    const btnPrevWeek = document.getElementById('btnReportPrevWeek');
    const btnNextWeek = document.getElementById('btnReportNextWeek');
    const btnPrevDay = document.getElementById('btnReportPrevDay');
    const btnNextDay = document.getElementById('btnReportNextDay');
    const btnFilterToday = document.getElementById('btnReportFilterToday');
    const btnReset = document.getElementById('btnResetReportFilter');

    initReportFilterState();

    if (yearSelect && !yearSelect._bound) {
      yearSelect._bound = true;
      yearSelect.addEventListener('change', () => {
        state.reportFilter.year = yearSelect.value;
        if (state.reportFilter.timeframe === 'today') {
          const parts = state.reportFilter.dayDate.split('-');
          state.reportFilter.dayDate = `${yearSelect.value === 'all' ? '2026' : yearSelect.value}-${parts[1]}-${parts[2]}`;
          if (dateInput) dateInput.value = state.reportFilter.dayDate;
        } else if (state.reportFilter.timeframe === 'week') {
          populateReportWeekOptions();
        }
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (monthSelect && !monthSelect._bound) {
      monthSelect._bound = true;
      monthSelect.addEventListener('change', () => {
        state.reportFilter.month = monthSelect.value;
        if (state.reportFilter.timeframe === 'today') {
          const parts = state.reportFilter.dayDate.split('-');
          const mNum = monthSelect.value === 'all' ? '10' : String(parseInt(monthSelect.value, 10) + 1).padStart(2, '0');
          state.reportFilter.dayDate = `${parts[0]}-${mNum}-${parts[2]}`;
          if (dateInput) dateInput.value = state.reportFilter.dayDate;
        } else if (state.reportFilter.timeframe === 'week') {
          populateReportWeekOptions();
        }
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (weekSelect && !weekSelect._bound) {
      weekSelect._bound = true;
      weekSelect.addEventListener('change', () => {
        state.reportFilter.weekStartDate = weekSelect.value;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnPrevWeek && !btnPrevWeek._bound) {
      btnPrevWeek._bound = true;
      btnPrevWeek.addEventListener('click', () => {
        if (weekSelect && weekSelect.selectedIndex > 0) {
          weekSelect.selectedIndex--;
          state.reportFilter.weekStartDate = weekSelect.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (btnNextWeek && !btnNextWeek._bound) {
      btnNextWeek._bound = true;
      btnNextWeek.addEventListener('click', () => {
        if (weekSelect && weekSelect.selectedIndex < weekSelect.options.length - 1) {
          weekSelect.selectedIndex++;
          state.reportFilter.weekStartDate = weekSelect.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (dateInput && !dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener('change', () => {
        if (dateInput.value) {
          state.reportFilter.dayDate = dateInput.value;
          renderReports(state.reportFilter.timeframe);
        }
      });
    }

    if (btnPrevDay && !btnPrevDay._bound) {
      btnPrevDay._bound = true;
      btnPrevDay.addEventListener('click', () => {
        const cur = new Date(state.reportFilter.dayDate || '2026-10-26');
        cur.setDate(cur.getDate() - 1);
        state.reportFilter.dayDate = formatIsoDate(cur);
        if (dateInput) dateInput.value = state.reportFilter.dayDate;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnNextDay && !btnNextDay._bound) {
      btnNextDay._bound = true;
      btnNextDay.addEventListener('click', () => {
        const cur = new Date(state.reportFilter.dayDate || '2026-10-26');
        cur.setDate(cur.getDate() + 1);
        state.reportFilter.dayDate = formatIsoDate(cur);
        if (dateInput) dateInput.value = state.reportFilter.dayDate;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnFilterToday && !btnFilterToday._bound) {
      btnFilterToday._bound = true;
      btnFilterToday.addEventListener('click', () => {
        state.reportFilter.dayDate = '2026-10-26';
        if (dateInput) dateInput.value = '2026-10-26';
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (deptSelect && !deptSelect._bound) {
      deptSelect._bound = true;
      deptSelect.addEventListener('change', () => {
        state.reportFilter.department = deptSelect.value;
        renderReports(state.reportFilter.timeframe);
      });
    }

    if (btnReset && !btnReset._bound) {
      btnReset._bound = true;
      btnReset.addEventListener('click', () => {
        state.reportFilter = {
          timeframe: 'month',
          year: '2026',
          month: '9',
          weekStartDate: '2026-10-19',
          dayDate: '2026-10-26',
          department: 'all'
        };
        renderReports('month');
      });
    }
  }

  function renderReports(timeframe) {
    initReportFilterState();
    setupReportFilterToolbarEvents();

    const rawTf = timeframe || state.reportFilter.timeframe || state.timeframe || 'month';
    let tf = 'month';
    const lowTf = String(rawTf).toLowerCase().trim();
    if (lowTf === 'today' || lowTf === 'daily' || lowTf === 'day') tf = 'today';
    else if (lowTf === 'week' || lowTf === 'weekly') tf = 'week';
    else if (lowTf === 'month' || lowTf === 'monthly') tf = 'month';
    else if (lowTf === 'all' || lowTf === 'all_time' || lowTf === 'alltime') tf = 'all';

    state.timeframe = tf;
    state.reportFilter.timeframe = tf;

    // Sync timeframe buttons in #reportTimeframeTabs
    document.querySelectorAll('#reportTimeframeTabs .timeframe-btn').forEach(btn => {
      const bTf = (btn.getAttribute('data-timeframe') || '').toLowerCase();
      const isAct = (bTf === tf) || 
                    (tf === 'today' && (bTf === 'daily' || bTf === 'today' || bTf === 'day')) ||
                    (tf === 'week' && (bTf === 'weekly' || bTf === 'week')) ||
                    (tf === 'month' && (bTf === 'monthly' || bTf === 'month')) ||
                    (tf === 'all' && (bTf === 'all' || bTf === 'all_time' || bTf === 'alltime'));
      btn.classList.toggle('active', isAct);
    });

    syncReportFilterControlsUI(tf);

    const monthFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const curYear = state.reportFilter.year === 'all' ? 'All Years' : state.reportFilter.year;

    // Filter requests according to state.reportFilter
    const reqs = (state.requests || []).filter(r => {
      // Department filter
      if (state.reportFilter.department && state.reportFilter.department !== 'all') {
        if (state.reportFilter.department === 'creative' && (!r.artist || r.artist === 'Unassigned')) return false;
        if (state.reportFilter.department === 'sales' && !r.salesRep) return false;
        if (state.reportFilter.department === 'production' && ((parseInt(r.countStandard, 10) || 0) + (parseInt(r.countPrinting, 10) || 0) + (parseInt(r.countSpecial, 10) || 0) <= 0)) return false;
      }

      const dStr = r.releasingDate || r.designDeadline || r.orderDate;
      if (!dStr) return tf === 'all';
      const d = parseRequestDate(dStr);
      if (!d) return tf === 'all';

      if (tf === 'today') {
        const targetIso = state.reportFilter.dayDate || '2026-10-26';
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return iso === targetIso;
      }

      if (tf === 'week') {
        const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const mon = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
        const sun = new Date(parts[0], parts[1] - 1, parts[2] + 6, 23, 59, 59);
        return d >= mon && d <= sun;
      }

      if (tf === 'month') {
        const yMatch = (state.reportFilter.year === 'all') || (d.getFullYear() === parseInt(state.reportFilter.year, 10));
        if (!yMatch) return false;
        if (state.reportFilter.month === 'all') return true;
        return d.getMonth() === parseInt(state.reportFilter.month, 10);
      }

      // All Time
      if (state.reportFilter.year && state.reportFilter.year !== 'all') {
        return d.getFullYear() === parseInt(state.reportFilter.year, 10);
      }
      return true;
    });

    // Update section titles and subtitles dynamically
    const headerTitle = document.getElementById('reportHeaderTitle');
    const headerSubtitle = document.getElementById('reportHeaderSubtitle');
    if (headerTitle && headerSubtitle) {
      if (tf === 'today') {
        const parts = (state.reportFilter.dayDate || '2026-10-26').split('-').map(Number);
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
        headerTitle.textContent = `Daily Production Reports & Analytics — ${dayStr}`;
        headerSubtitle.textContent = `Verified operational metrics and production performance for ${dayStr}`;
      } else if (tf === 'week') {
        const parts = (state.reportFilter.weekStartDate || '2026-10-19').split('-').map(Number);
        const mon = new Date(parts[0], parts[1] - 1, parts[2]);
        const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
        const monStr = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const sunStr = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        headerTitle.textContent = `Weekly Production Reports & Analytics (${monStr} — ${sunStr})`;
        headerSubtitle.textContent = `Verified operational metrics and performance breakdown across Week (${monStr} — ${sunStr})`;
      } else if (tf === 'month') {
        const mIdx = parseInt(state.reportFilter.month, 10);
        const mLabel = isNaN(mIdx) || state.reportFilter.month === 'all' ? 'Full Year (Jan — Dec)' : monthFullNames[mIdx];
        headerTitle.textContent = `Monthly Production Reports & Analytics — ${mLabel} ${curYear}`;
        headerSubtitle.textContent = `Operational performance, artist turnaround, and output breakdown for ${mLabel} ${curYear}`;
      } else {
        headerTitle.textContent = `All-Time Production Reports & Analytics (${curYear})`;
        headerSubtitle.textContent = `Comprehensive historical operational performance across all logged production orders (${curYear})`;
      }
    }

    const totalOrders = reqs.length;
    let completedOrders = 0;
    let totalRevisions = 0;
    let totalTurnaroundDays = 0;
    let turnaroundCount = 0;

    const artistMap = {};
    state.artists.forEach(a => {
      artistMap[a] = {
        name: a,
        assigned: 0,
        completed: 0,
        inProgress: 0,
        standard: 0,
        printing: 0,
        special: 0,
        efficiency: '100.0%'
      };
    });

    reqs.forEach(r => {
      const isCompleted = (r.projectStatus === 'Completed' || r.designStatus === 'Submitted');
      if (isCompleted) completedOrders++;
      totalRevisions += (parseInt(r.revisionCount, 10) || 0);

      const oDate = parseRequestDate(r.orderDate);
      const rDate = parseRequestDate(r.releasingDate || r.designDeadline);
      if (oDate && rDate && rDate >= oDate) {
        const diffDays = (rDate.getTime() - oDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays >= 0 && diffDays <= 60) {
          totalTurnaroundDays += diffDays;
          turnaroundCount++;
        }
      }

      let artistName = toTitleCase(r.artist);
      if (artistName === 'Juls' || artistName === 'Ju' || artistName === 'J') artistName = 'Jules';
      if (artistName === 'Gle') artistName = 'Glen';

      if (artistMap[artistName]) {
        artistMap[artistName].assigned++;
        if (isCompleted) {
          artistMap[artistName].completed++;
        } else {
          artistMap[artistName].inProgress++;
        }

        let std = parseInt(r.countStandard, 10) || 0;
        let prt = parseInt(r.countPrinting, 10) || 0;
        let spc = parseInt(r.countSpecial, 10) || 0;
        if (std === 0 && prt === 0 && spc === 0) std = 1;
        artistMap[artistName].standard += std;
        artistMap[artistName].printing += prt;
        artistMap[artistName].special += spc;
      }
    });

    Object.values(artistMap).forEach(as => {
      if (as.assigned > 0) {
        as.efficiency = ((as.completed / as.assigned) * 100).toFixed(1) + '%';
      } else {
        as.efficiency = '100.0%';
      }
    });

    const artistRows = Object.values(artistMap).sort((a, b) => b.assigned - a.assigned);

    const avgTurnaround = turnaroundCount > 0 ? (totalTurnaroundDays / turnaroundCount).toFixed(1) : '2.1';
    const revisionRatio = totalOrders > 0 ? (totalRevisions / totalOrders).toFixed(2) : '0.15';
    const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) + '%' : '100.0%';

    const elTot = document.getElementById('repStatTotal');
    if (elTot) elTot.textContent = Number(totalOrders).toLocaleString();

    const elComp = document.getElementById('repStatCompleted');
    if (elComp) elComp.textContent = Number(completedOrders).toLocaleString();

    const elTurn = document.getElementById('repStatTurnaround');
    if (elTurn) elTurn.innerHTML = `${avgTurnaround} <span style="font-size:14px; font-weight:600; color:#64748B;">days</span>`;

    const elRev = document.getElementById('repStatRevision');
    if (elRev) elRev.innerHTML = `${revisionRatio} <span style="font-size:14px; font-weight:600; color:#64748B;">/ job</span>`;

    const elRate = document.getElementById('repStatCompletionRate');
    if (elRate) elRate.textContent = `${completionRate} on-time rate`;

    const tbody = document.getElementById('reportsArtistTableBody');
    if (tbody) {
      if (artistRows.length === 0 || totalOrders === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 6px; opacity: 0.6;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div style="font-weight: 700; font-size: 14px;">No production orders found for this filter interval</div>
              <div style="font-size: 12px; margin-top: 4px;">Try selecting another Day, Week, Month, or Department.</div>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = artistRows.map(r => `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar" style="width:26px; height:26px; font-size:10px;">${escapeHTML(r.name.substring(0, 2).toUpperCase())}</div>
                <strong>${escapeHTML(r.name)}</strong>
              </div>
            </td>
            <td><strong>${Number(r.assigned).toLocaleString()}</strong></td>
            <td><span class="badge" style="background:#F0FDF4; color:#166534; font-weight:700;">${Number(r.completed).toLocaleString()}</span></td>
            <td><span style="color:#64748B; font-weight:600;">${Number(r.inProgress).toLocaleString()}</span></td>
            <td>${Number(r.standard).toLocaleString()}</td>
            <td>${Number(r.printing).toLocaleString()}</td>
            <td>${Number(r.special).toLocaleString()}</td>
            <td><span style="font-weight:700; color:${parseFloat(r.efficiency) >= 90 ? '#166534' : '#D97706'};">${r.efficiency}</span></td>
          </tr>
        `).join('');
      }
    }

    window.currentReportData = {
      timeframe: tf,
      totalOrders,
      completedOrders,
      avgTurnaround,
      revisionRatio,
      artistRows
    };
  }

  // ==========================================================================
  // MODULE 9: SETTINGS ENGINE
  // ==========================================================================

  function renderSettings() {
    const artistListEl = document.getElementById('settingsArtistList');
    if (artistListEl) {
      artistListEl.innerHTML = state.artists.map(a => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#F8FAFC; border-radius:var(--radius-sm); border:1px solid #E2E8F0;">
          <span style="font-weight:700; font-size:13px;">${escapeHTML(a)}</span>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.removeArtist('${a}')">Remove</button>
        </div>
      `).join('');
    }

    const salesListEl = document.getElementById('settingsSalesList');
    if (salesListEl) {
      salesListEl.innerHTML = state.salesReps.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:#F8FAFC; border-radius:var(--radius-sm); border:1px solid #E2E8F0;">
          <span style="font-weight:700; font-size:13px;">${escapeHTML(s)}</span>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.removeSales('${s}')">Remove</button>
        </div>
      `).join('');
    }

    const btnAddArtist = document.getElementById('btnSettingsAddArtist');
    const inputAddArtist = document.getElementById('settingsNewArtistInput');
    if (btnAddArtist && inputAddArtist) {
      btnAddArtist.onclick = () => {
        const val = inputAddArtist.value.trim();
        if (val && !state.artists.includes(val)) {
          state.artists.push(val);
          inputAddArtist.value = '';
          saveStateToStorage();
          renderSettings();
          showToast(`Artist "${val}" added.`);
        }
      };
    }

    const btnAddSales = document.getElementById('btnSettingsAddSales');
    const inputAddSales = document.getElementById('settingsNewSalesInput');
    if (btnAddSales && inputAddSales) {
      btnAddSales.onclick = () => {
        const val = inputAddSales.value.trim();
        if (val && !state.salesReps.includes(val)) {
          state.salesReps.push(val);
          inputAddSales.value = '';
          saveStateToStorage();
          renderSettings();
          showToast(`Sales representative "${val}" added.`);
        }
      };
    }

    const btnExport = document.getElementById('btnSettingsExportJson');
    if (btnExport) {
      btnExport.onclick = () => {
        const jsonStr = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sign_Depot_Data_Backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON backup downloaded.');
      };
    }

    const btnImport = document.getElementById('btnSettingsImportJson');
    const importInput = document.getElementById('importJsonFileInput');
    if (btnImport && importInput) {
      btnImport.onclick = () => importInput.click();
      importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && Array.isArray(parsed.requests)) {
              state.requests = parsed.requests;
              state.artists = parsed.artists || state.artists;
              state.salesReps = parsed.salesReps || state.salesReps;
              saveStateToStorage();
              renderSettings();
              showToast('Backup restored successfully!');
            }
          } catch (err) {
            showToast('Failed to parse JSON file.', 'error');
          }
        };
        reader.readAsText(file);
      };
    }

    // Super Admin Deletion Security Passcode Management
    const loginPasswordEl = document.getElementById('settingsLoginPasswordInput');
    const newPasscodeEl = document.getElementById('settingsNewPasscodeInput');
    const savePasscodeBtn = document.getElementById('btnSettingsSavePasscode');
    const feedbackEl = document.getElementById('settingsPasscodeFeedback');

    // Ensure password fields are always clean and not pre-filled by browser credential managers
    if (loginPasswordEl) loginPasswordEl.value = '';
    if (newPasscodeEl) newPasscodeEl.value = '';

    if (savePasscodeBtn && newPasscodeEl) {
      savePasscodeBtn.onclick = () => {
        const loginPass = loginPasswordEl ? loginPasswordEl.value.trim() : '';
        if (!loginPass) {
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#DC2626';
            feedbackEl.textContent = 'Please enter your current account login password.';
          }
          if (loginPasswordEl) loginPasswordEl.focus();
          return;
        }

        const val = newPasscodeEl.value.trim();
        if (!val) {
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#DC2626';
            feedbackEl.textContent = 'Please enter a valid new passcode.';
          }
          newPasscodeEl.focus();
          return;
        }

        savePasscodeBtn.disabled = true;
        savePasscodeBtn.textContent = 'Saving...';

        const updateLocal = () => {
          if (loginPasswordEl) loginPasswordEl.value = '';
          newPasscodeEl.value = '';
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#09090B';
            feedbackEl.textContent = 'Deletion security passcode successfully saved and protected!';
            setTimeout(() => { if (feedbackEl) feedbackEl.style.display = 'none'; }, 4000);
          }
          showToast('Super Admin deletion passcode updated.');
          savePasscodeBtn.disabled = false;
          savePasscodeBtn.textContent = 'Save Passcode';
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
              updateLocal();
            } else {
              if (feedbackEl) {
                feedbackEl.style.display = 'block';
                feedbackEl.style.color = '#DC2626';
                feedbackEl.textContent = res.error || 'Failed to update passcode on server.';
              }
              savePasscodeBtn.disabled = false;
              savePasscodeBtn.textContent = 'Save Passcode';
            }
          })
          .catch(() => updateLocal());
        } else {
          updateLocal();
        }
      };
    }

    const btnResetAll = document.getElementById('btnSettingsResetDefaults');
    if (btnResetAll) {
      btnResetAll.onclick = () => {
        showCustomConfirm({
          title: 'Reset to Factory Defaults',
          subtitle: 'LOCALSTORAGE DATA RESET',
          message: 'Are you sure you want to reset all mock data to factory defaults? All unsynced local drafts will be cleared.',
          requiresPasscode: false,
          confirmText: 'Reset Defaults',
          onConfirm: () => {
            localStorage.removeItem(STORAGE_KEY);
            state.artists = [...DEFAULT_ARTISTS];
            state.salesReps = [...DEFAULT_SALES_REPS];
            state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
            state.templateElements = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS));
            state.attachments = [...DEFAULT_ATTACHMENTS];
            saveStateToStorage();
            renderCurrentView(state.activeView);
            showToast('Sample dataset restored to factory defaults.');
            return true;
          }
        });
      };
    }
  }

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
        renderMonthlyOutputReport(tf);
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
          renderMonthlyOutputReport(tf);
        }
      });
    }

    const reportDeptSelect = document.getElementById('reportDepartment');
    if (reportDeptSelect) {
      reportDeptSelect.addEventListener('change', () => {
        renderReports(state.timeframe || 'all');
      });
    }

    setupOutputFilterToolbarEvents();
    setupReportFilterToolbarEvents();
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

  function openNewSalesRequestModal() {
    const form = document.getElementById('salesRequestForm');
    if (form) form.reset();
    document.getElementById('salesFormId').value = '';
    document.getElementById('salesModalTitle').textContent = 'New Sales Request';

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

    // Default design deadline (+3 days from today)
    const deadlineInput = document.getElementById('salesFormDeadline');
    if (deadlineInput && !deadlineInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      deadlineInput.value = d.toISOString().split('T')[0];
    }

    const locInput = document.getElementById('salesFormLocation');
    if (locInput) locInput.value = 'Indoor';

    populateSalesFiltersDropdowns();
    document.getElementById('salesModal').classList.add('show');
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
    if (state.draftSalesRequest) {
      const projEl = document.getElementById('draftProjectName');
      if (projEl) {
        projEl.focus();
        projEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast('A new request row is already active. Fill in all cells and click ✓ to Save or ✕ to Cancel.', 'info');
      return;
    }

    const nextReqId = getNextRequestId();

    state.draftSalesRequest = {
      requestId: nextReqId,
      joNumber: '',
      orderDate: new Date().toISOString().substring(0, 10),
      salesRep: '',
      client: '',
      projectName: '',
      artist: '',
      designDeadline: '',
      releasingDate: '',
      fileSent: '',
      completeAddress: '',
      location: '',
      releasingMode: '',
      contactPerson: '',
      contactNumber: '',
      projectStatus: 'On-going',
      clientApproval: 'Pending Approval',
      priority: 'Normal',
      remarks: ''
    };

    // Ensure we are on page 1 so draft row is visible at the very top
    state.salesFilter.page = 1;

    // Render sales requests table with the new draft row
    renderSalesRequests();

    // Focus JO Number input
    setTimeout(() => {
      const joInput = document.getElementById('draftJoNumber');
      if (joInput) {
        joInput.focus();
        joInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);

    showToast('New row ready! All details must be filled up before saving.');
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
        if (res.id) newRecord.id = res.id;
        if (res.requestId && res.requestId !== newRecord.requestId) {
          newRecord.requestId = res.requestId;
          renderSalesRequests();
        }
      }
    })
    .catch(err => console.warn('MySQL save failed:', err));

    // Re-render table with newly committed row
    renderSalesRequests();

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
    renderSalesRequests();
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
              state.requests = state.requests.filter(r => r.id !== id && r.requestId !== id);
              saveStateToStorage();
              renderCurrentView(state.activeView);
              updateDashboardKPIs();
              updateDeadlineAlertCenter();
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
            updateDashboardKPIs();
            updateDeadlineAlertCenter();
            showToast(`Deleted ${reqLabel} locally.`, 'info');
            return true;
          }
        } else {
          state.requests = state.requests.filter(r => r.id !== id && r.requestId !== id);
          saveStateToStorage();
          renderCurrentView(state.activeView);
          updateDashboardKPIs();
          updateDeadlineAlertCenter();
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
        const jo = document.getElementById('salesFormJo').value.trim();
        const project = document.getElementById('salesFormProject').value.trim();
        const client = document.getElementById('salesFormClient').value.trim();
        const artist = document.getElementById('salesFormArtist').value;
        const salesRep = toTitleCase(document.getElementById('salesFormSalesRep').value);
        const deadline = document.getElementById('salesFormDeadline').value;
        const releasingDate = (document.getElementById('salesFormReleasingDate') || document.getElementById('salesFormReleasing'))?.value || '';
        const fileSentRaw = document.getElementById('salesFormFileSent')?.value || '';
        const fileSent = (fileSentRaw === 'Blank' || fileSentRaw === 'N/A' || !fileSentRaw) ? '' : fileSentRaw;
        const clientApproval = document.getElementById('salesFormClientApproval')?.value || '';
        const priority = document.getElementById('salesFormPriority')?.value || '';
        const relModeRaw = (document.getElementById('salesFormRelMode') || document.getElementById('salesFormReleasingMode'))?.value || '';
        const mode = (relModeRaw === 'Blank' || relModeRaw === 'N/A' || !relModeRaw) ? '' : relModeRaw;
        const locRaw = document.getElementById('salesFormLocation')?.value || '';
        const location = (locRaw === 'Blank' || locRaw === 'N/A' || !locRaw) ? '' : locRaw;
        const contactPerson = document.getElementById('salesFormContactPerson').value.trim();
        const contactNumber = document.getElementById('salesFormContactNumber').value.trim();
        const address = document.getElementById('salesFormAddress').value.trim();
        const nowStamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const requiredChecks = [
          { val: reqId, id: 'salesFormReqId', name: 'Request ID' },
          { val: jo, id: 'salesFormJo', name: 'JO Number' },
          { val: salesRep, id: 'salesFormSalesRep', name: 'Sales Representative' },
          { val: client, id: 'salesFormClient', name: 'Client Name' },
          { val: project, id: 'salesFormProject', name: 'Project Name' },
          { val: deadline, id: 'salesFormDeadline', name: 'Design Deadline' },
          { val: releasingDate, id: 'salesFormReleasing', name: 'Production Due' },
          { val: artist, id: 'salesFormArtist', name: 'Assigned Artist' },
          { val: priority, id: 'salesFormPriority', name: 'Priority Level' },
          { val: mode, id: 'salesFormRelMode', name: 'Mode of Releasing' },
          { val: location, id: 'salesFormLocation', name: 'Placement' },
          { val: fileSent, id: 'salesFormFileSent', name: 'File Status' },
          { val: clientApproval, id: 'salesFormClientApproval', name: 'Client Approval' },
          { val: contactPerson, id: 'salesFormContactPerson', name: 'Contact Person' },
          { val: contactNumber, id: 'salesFormContactNumber', name: 'Contact Number' },
          { val: address, id: 'salesFormAddress', name: 'Complete Address' }
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

        if (id) {
          const rec = state.requests.find(r => r.id === id);
          if (rec) {
            rec.requestId = reqId;
            rec.joNumber = jo || 'N/A';
            rec.projectName = project || 'N/A';
            rec.client = client || 'N/A';
            rec.artist = artist || 'N/A';
            rec.salesRep = salesRep || 'N/A';
            rec.designDeadline = deadline || 'N/A';
            rec.releasingDate = releasingDate || deadline || 'N/A';
            rec.fileSent = fileSent;
            rec.location = location;
            rec.clientApproval = clientApproval;
            rec.priority = priority;
            rec.releasingMode = mode;
            rec.contactPerson = contactPerson;
            rec.contactNumber = contactNumber;
            rec.completeAddress = address;
            rec.dateUpdated = nowStamp;
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
          const newRec = {
            id: `req-${Date.now()}`,
            requestId: reqId,
            joNumber: jo || 'N/A',
            projectName: project || 'N/A',
            client: client || 'N/A',
            artist: artist || 'N/A',
            salesRep: salesRep || 'N/A',
            inCharge: toTitleCase(salesRep),
            drawnBy: toTitleCase(artist),
            orderDate: nowStamp.substring(0, 10),
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
            projectStatus: clientApproval === 'Approved' ? 'Completed' : 'On-going',
            designStatus: 'On Queue',
            headApproval: 'Pending',
            countStandard: 0,
            countPrinting: 0,
            countSpecial: 0,
            revisionCount: 0,
            remarks: 'N/A',
            month: 'October 2026',
            completionDate: null,
            timestamp: nowStamp.substring(0, 10),
            dateUpdated: nowStamp
          };
          state.requests.unshift(newRec);
          if (window.PMS_API_URL) {
            fetch(window.PMS_API_URL + '?action=create_request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newRec)
            }).catch(err => console.warn('MySQL create sync:', err));
          }
        }

        saveStateToStorage();
        document.getElementById('salesModal').classList.remove('show');
        renderCurrentView(state.activeView);
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

  window.SignDepotApp = {
    switchView: switchView,
    renderSalesRequests: renderSalesRequests,
    renderCreativesTracker: renderCreativesTracker,
    renderDashboardRecentProjectsTable: renderDashboardRecentProjectsTable,
    canUserEditField: canUserEditField,
    canUserAccessTab: canUserAccessTab,
    getCurrentUserPermissions: getCurrentUserPermissions,
    openNewSalesRequestModal: openNewSalesRequestModal,
    editSalesRequest: editSalesRequest,
    deleteSalesRequest: deleteSalesRequest,
    formatRequestIdInput: formatRequestIdInput,
    getNextRequestId: getNextRequestId,
    showCustomConfirm: showCustomConfirm,
    resetSalesFilters: resetSalesRequestsFilters,
    resetTrackerFilters: resetCreativesTrackerFilters,
    renderProgressTimeline: renderProgressTimeline,
    renderRecentActivityFeed: renderRecentActivityFeed,
    refreshRecentActivity: () => renderRecentActivityFeed(currentActivityFilter),
    showTimelineTooltip: showTimelineTooltip,
    hideTimelineTooltip: hideTimelineTooltip,
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

      renderCreativesTracker();

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
      renderCreativesTracker();
      showToast('Showing all tasks in Creatives Tracker', 'info');
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
      renderDashboardRecentProjectsTable();

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
      renderDashboardRecentProjectsTable();
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
        renderDashboardRecentProjectsTable();

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
          renderCreativesTracker();
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
          renderSalesRequests();
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
        renderDashboard();
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
        renderDirectivePreview(identifier);
      } else {
        window.location.href = getPageUrl('directives-details.html') + '?id=' + encodeURIComponent(identifier);
      }
    },
    selectAutocompleteJo: (joOrReq) => {
      const box = document.getElementById('directiveAutocompleteBox');
      if (box) box.classList.remove('show');
      renderDirectivePreview(joOrReq);
      showToast(`Loaded directive for ${joOrReq}.`);
    },

    setSalesPage: (p) => {
      state.salesFilter.page = p;
      renderSalesRequests();
    },
    setSalesApprovalTab: (tab) => {
      state.salesFilter.approvalTab = tab || '';
      state.salesFilter.page = 1;
      renderSalesRequests();
    },
    setSalesPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.salesFilter.perPage = val;
        state.salesFilter.page = 1;
        setStoredRowsPerPage(val);
        renderSalesRequests();
      }
    },

    setTrackerPage: (p) => {
      state.trackerFilter.page = p;
      renderCreativesTracker();
    },
    setTrackerPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.trackerFilter.perPage = val;
        state.trackerFilter.page = 1;
        setStoredRowsPerPage(val);
        renderCreativesTracker();
      }
    },

    setPendingSalesPage: (p) => {
      state.pendingSalesPage = p;
      renderPendingSalesQueue();
    },
    setPendingSalesPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.pendingSalesPerPage = val;
        state.pendingSalesPage = 1;
        setStoredRowsPerPage(val);
        renderPendingSalesQueue();
      }
    },

    setPendingArtistPage: (p) => {
      state.pendingArtistPage = p;
      renderPendingArtistQueue();
    },
    setPendingArtistPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.pendingArtistPerPage = val;
        state.pendingArtistPage = 1;
        setStoredRowsPerPage(val);
        renderPendingArtistQueue();
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
      renderDashboardRecentProjectsTable();
    },
    setDashboardPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.dashboardPerPage = val;
        state.dashboardPage = 1;
        setStoredRowsPerPage(val);
        renderDashboardRecentProjectsTable();
      }
    },

    setMonthlyOutputTimeframe: (tf) => {
      renderMonthlyOutputReport(tf);
    },
    renderMonthlyOutputReport: (tf) => {
      renderMonthlyOutputReport(tf);
    },
    setMonthlyOutputFilter: (filterObj) => {
      initOutputFilterState();
      if (filterObj && typeof filterObj === 'object') {
        Object.assign(state.outputFilter, filterObj);
      }
      renderMonthlyOutputReport();
    },
    setMonthlyOutputPage: (p) => {
      state.monthlyOutputPage = p;
      renderMonthlyOutputReport();
    },
    setMonthlyOutputPerPage: (n) => {
      const val = parseInt(n, 10);
      if ([10, 15, 20, 25, 30].includes(val)) {
        state.monthlyOutputPerPage = val;
        state.monthlyOutputPage = 1;
        setStoredRowsPerPage(val);
        renderMonthlyOutputReport();
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
      renderCreativesTracker();
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
        renderPendingSalesQueue();
        showToast(`Project ${rec.requestId} approved.`);
      }
    },

    previewAttachment: (id) => {
      const att = state.attachments.find(a => a.id === id);
      if (!att) return;
      document.getElementById('attachmentModalTitle').textContent = att.name;
      const resolvedUrl = (isInsidePagesDir() && !att.url.startsWith('../') && !att.url.startsWith('http') && !att.url.startsWith('data:')) ? '../' + att.url : att.url;
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
      state.artists = state.artists.filter(a => a !== artist);
      saveStateToStorage();
      renderSettings();
      showToast(`Removed artist ${artist}.`);
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
    if (brandHomeLink) {
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
      if (document.getElementById('salesRequestsTableBody')) {
        addNewSalesRequestRow();
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

    // Auto-trigger new row if navigated from external page with ?action=add_new
    if (window.location.search.includes('action=add_new') && document.getElementById('salesRequestsTableBody')) {
      setTimeout(() => {
        addNewSalesRequestRow();
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
        renderSalesRequests();
      });
    }

    ['salesFilterPriority', 'salesFilterApproval', 'salesFilterFileSent', 'salesFilterSalesRep', 'salesFilterLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'salesFilterPriority') state.salesFilter.priority = el.value;
          if (id === 'salesFilterApproval') state.salesFilter.approval = el.value;
          if (id === 'salesFilterFileSent') state.salesFilter.fileSent = el.value;
          if (id === 'salesFilterSalesRep') state.salesFilter.salesRep = el.value;
          if (id === 'salesFilterLocation') state.salesFilter.location = el.value;
          state.salesFilter.page = 1;
          renderSalesRequests();
        });
      }
    });

    // Client Approval Status Tabs listener
    document.querySelectorAll('.sales-approval-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabVal = btn.getAttribute('data-tab-approval') || '';
        state.salesFilter.approvalTab = tabVal;
        state.salesFilter.page = 1;
        renderSalesRequests();
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
        renderSalesRequests();
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
        renderCreativesTracker();
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
          renderCreativesTracker();
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
        renderCreativesTracker();
      });
    }

    if (trackerDateCustom) {
      trackerDateCustom.addEventListener('change', () => {
        state.trackerFilter.dateCustom = trackerDateCustom.value;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
      });
    }

    if (trackerDateColumn) {
      trackerDateColumn.addEventListener('change', () => {
        state.trackerFilter.dateColumn = trackerDateColumn.value;
        state.trackerFilter.page = 1;
        renderCreativesTracker();
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
          renderCreativesTracker();
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
        renderCreativesTracker();
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
        renderDirectivePreview('P261001348');
        showToast('Sample directive for URAL loaded.');
      });
    }

    const availFilter = document.getElementById('workloadFilterAvailability');
    if (availFilter) {
      availFilter.addEventListener('change', () => {
        state.workloadFilter.availability = availFilter.value;
        renderArtistWorkload();
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
        renderPendingArtistQueue();
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
        renderPendingSalesQueue();
      });
    });

    const pendingSalesSearch = document.getElementById('pendingSalesSearchInput');
    if (pendingSalesSearch) {
      pendingSalesSearch.addEventListener('input', () => {
        state.pendingSalesSearch = pendingSalesSearch.value.trim();
        state.pendingSalesPage = 1;
        renderPendingSalesQueue();
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
        renderDashboardRecentProjectsTable();
      });
    }

    const dashStatus = document.getElementById('dashboardFilterStatus');
    if (dashStatus) {
      dashStatus.addEventListener('change', () => {
        state.dashboardStatus = dashStatus.value;
        if (state.dashboardStatus) state.dashboardKpiFilter = '';
        state.dashboardPage = 1;
        renderDashboardRecentProjectsTable();
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
        renderDashboardRecentProjectsTable();
      });
    }

    // Sales Requests Deadline Filter listener
    const salesDeadline = document.getElementById('salesFilterDeadline');
    if (salesDeadline) {
      salesDeadline.addEventListener('change', () => {
        state.salesFilter.deadline = salesDeadline.value;
        state.salesFilter.page = 1;
        renderSalesRequests();
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
    const headers = ['Request ID', 'Artist', 'Project Name', 'Design Deadline', 'Head Approval', 'Standard', 'Printing', 'Special', 'Project Status', 'Design Status', 'Revisions', 'Remarks', 'Date', 'Sales', 'Month'];
    const reqList = myArtist ? state.requests.filter(r => r.artist && r.artist.trim().toLowerCase() === myArtist.toLowerCase()) : state.requests;
    const rows = reqList.map(r => [
      r.requestId,
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

  function initApp() {
    if (window.SignDepotNav && typeof window.SignDepotNav.renderComponents === 'function') {
      window.SignDepotNav.renderComponents();
    }
    loadStateFromStorage();
    initEventListeners();
    setupDirectiveControlsSync();
    setupDirectiveAutocomplete();
    setupDirectiveActions();
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
      renderDirectivePreview(state.currentDirectiveJo || window.__INITIAL_DIRECTIVE_KEY || '');
    }

    updateDeadlineAlertCenter();

    // Non-intrusive reminder alert on load if urgent items exist
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