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

  const STORAGE_KEY = 'SIGN_DEPOT_OPS_DATA_V2';

  const DEFAULT_ARTISTS = [
    'Bob', 'Edrian', 'Glen', 'Goodrich', 'Jules', 'Raven', 'Rodel', 'Tim', 'Seven'
  ];

  const DEFAULT_SALES_REPS = [
    'Dona', 'Marco', 'Sarah', 'Kevin'
  ];

  const PROJECT_STATUSES = [
    'Pending', 'On-going', 'Approved', 'For Review', 'Revising', 'Completed', 'On Hold'
  ];

  const DESIGN_STATUSES = [
    'Not Started', 'In Progress', 'For Review', 'Revising', 'Completed'
  ];

  const PRIORITY_LEVELS = ['Rush', 'High', 'Medium', 'Low'];
  const APPROVAL_LEVELS = ['Approved', 'Pending', 'Revision Requested'];
  const FILE_SENT_LEVELS = ['Sent', 'Pending'];
  const RELEASING_MODES = ['PICKUP', 'DELIVERY', 'INSTALLATION', 'COURIER'];

  // Comprehensive Shared Mock Dataset (25+ real-world Sign Depot projects)
  const DEFAULT_REQUESTS = [
    {
      id: 'req-001',
      requestId: 'LR-26-1230',
      joNumber: 'P260701373',
      projectName: 'URAL',
      client: 'PAU ACILAC',
      artist: 'Glen',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'GLEN',
      orderDate: '2026-10-23',
      designDeadline: '2026-07-30',
      releasingDate: '2026-07-30',
      releasingMode: 'PICKUP',
      location: 'Manila Branch',
      completeAddress: 'Block 14 Lot 3, Ortigas Ave Extension, Pasig City',
      contactPerson: '-',
      contactNumber: '639178805364',
      clientApproval: 'Approved',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '1 Day (4 Hours)',
      notes: 'Matte black acrylic letters with warm white LED backlighting on hairline stainless backing.',
      projectStatus: 'Approved',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 1,
      countPrinting: 0,
      countSpecial: 1,
      revisionCount: 1,
      remarks: 'Client signed off on proof #2. Directives issued for pickup release.',
      month: 'July 2026',
      completionDate: '2026-07-29'
    },
    {
      id: 'req-002',
      requestId: 'LR-26-1231',
      joNumber: 'P260701374',
      projectName: 'BDO BRANCH FACADE ILLUMINATED SIGN',
      client: 'BANCO DE ORO UNIBANK',
      artist: 'Bob',
      salesRep: 'Marco',
      inCharge: 'MARCO',
      drawnBy: 'BOB',
      orderDate: '2026-10-15',
      designDeadline: '2026-10-28',
      releasingDate: '2026-11-04',
      releasingMode: 'INSTALLATION',
      location: 'Makati CBD',
      completeAddress: 'Makati Avenue cor. Ayala Avenue, Makati City',
      contactPerson: 'Mr. Ronald Santos',
      contactNumber: '639182345678',
      clientApproval: 'Pending',
      priority: 'High',
      fileSent: 'Sent',
      installers: '4 Installers',
      duration: '2 Days (16 Hours)',
      notes: 'Structural engineering sign-off required for outdoor wind load calculations.',
      projectStatus: 'On-going',
      designStatus: 'In Progress',
      headApproval: 'Pending',
      countStandard: 2,
      countPrinting: 1,
      countSpecial: 2,
      revisionCount: 2,
      remarks: 'Awaiting structural load blueprint approval.',
      month: 'October 2026',
      completionDate: null
    },
    {
      id: 'req-003',
      requestId: 'LR-26-1232',
      joNumber: 'P260701375',
      projectName: 'AYALA MALLS ROOFTOP PYLON MONUMENT',
      client: 'AYALA LAND INC.',
      artist: 'Edrian',
      salesRep: 'Sarah',
      inCharge: 'SARAH',
      drawnBy: 'EDRIAN',
      orderDate: '2026-10-10',
      designDeadline: '2026-10-24',
      releasingDate: '2026-11-10',
      releasingMode: 'INSTALLATION',
      location: 'Cebu Business Park',
      completeAddress: 'Cardinal Rosales Ave, Cebu City',
      contactPerson: 'Arch. Denise Lee',
      contactNumber: '639209876543',
      clientApproval: 'Revision Requested',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '6 Installers',
      duration: '4 Days (32 Hours)',
      notes: 'Crane truck required for hoist. Double-sided flex face with 12V Osram LED modules.',
      projectStatus: 'Revising',
      designStatus: 'Revising',
      headApproval: 'Needs Revision',
      countStandard: 3,
      countPrinting: 2,
      countSpecial: 3,
      revisionCount: 3,
      remarks: 'Client requested larger logo typography and brighter lumen rating.',
      month: 'October 2026',
      completionDate: null
    },
    {
      id: 'req-004',
      requestId: 'LR-26-1233',
      joNumber: 'P260701376',
      projectName: 'STARBUCKS RESERVE RECEPTION 3D BRASS LOGO',
      client: 'RUSTAN COFFEE CORP.',
      artist: 'Goodrich',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'GOODRICH',
      orderDate: '2026-10-02',
      designDeadline: '2026-10-18',
      releasingDate: '2026-10-22',
      releasingMode: 'DELIVERY',
      location: 'BGC Taguig',
      completeAddress: 'High Street South Block, 26th Street, BGC, Taguig City',
      contactPerson: 'Ms. Clara Mendez',
      contactNumber: '639175554321',
      clientApproval: 'Approved',
      priority: 'High',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '1 Day (6 Hours)',
      notes: 'Brushed gold electroplated brass with stud mounts and 1:1 paper template for drilling.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 1,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 0,
      remarks: 'Delivered and accepted on schedule.',
      month: 'October 2026',
      completionDate: '2026-10-20'
    },
    {
      id: 'req-005',
      requestId: 'LR-26-1234',
      joNumber: 'P260701377',
      projectName: 'SHELL SELECT GAS STATION CANOPY FASCIA',
      client: 'PILIPINAS SHELL PETROLEUM',
      artist: 'Jules',
      salesRep: 'Kevin',
      inCharge: 'KEVIN',
      drawnBy: 'JULES',
      orderDate: '2026-09-12',
      designDeadline: '2026-09-25',
      releasingDate: '2026-10-05',
      releasingMode: 'INSTALLATION',
      location: 'SLEX Southwoods',
      completeAddress: 'Km 32 South Luzon Expressway, Biñan, Laguna',
      contactPerson: 'Engr. Paulo Tan',
      contactNumber: '639191112233',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '4 Installers',
      duration: '3 Days (24 Hours)',
      notes: 'Yellow & red polycarbonate thermoformed canopy wrap.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 1,
      countSpecial: 1,
      revisionCount: 1,
      remarks: 'Completed on site inspection.',
      month: 'October 2026',
      completionDate: '2026-10-04'
    },
    {
      id: 'req-006',
      requestId: 'LR-26-1235',
      joNumber: 'P260701378',
      projectName: 'JOLLIBEE DRIVE-THRU DIRECTIONAL ARROWS',
      client: 'JOLLIBEE FOODS CORP.',
      artist: 'Raven',
      salesRep: 'Marco',
      inCharge: 'MARCO',
      drawnBy: 'RAVEN',
      orderDate: '2026-10-18',
      designDeadline: '2026-10-22',
      releasingDate: '2026-10-29',
      releasingMode: 'DELIVERY',
      location: 'Quezon City',
      completeAddress: 'Commonwealth Ave, Tandang Sora, Quezon City',
      contactPerson: 'Mr. Jerry Flores',
      contactNumber: '639184449900',
      clientApproval: 'Pending',
      priority: 'Rush',
      fileSent: 'Pending',
      installers: '2 Installers',
      duration: '1 Day (4 Hours)',
      notes: 'Reflective 3M engineering grade vinyl on 3mm aluminum composite panel.',
      projectStatus: 'On-going',
      designStatus: 'In Progress',
      headApproval: 'Pending',
      countStandard: 2,
      countPrinting: 2,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Waiting for approved drive-thru lane layout from architect.',
      month: 'October 2026',
      completionDate: null
    },
    {
      id: 'req-007',
      requestId: 'LR-26-1236',
      joNumber: 'P260701379',
      projectName: 'UNILAB LABORATORY SAFETY WAYFINDING',
      client: 'UNITED LABORATORIES INC.',
      artist: 'Rodel',
      salesRep: 'Marco',
      inCharge: 'MARCO',
      drawnBy: 'RODEL',
      orderDate: '2026-10-05',
      designDeadline: '2026-10-19',
      releasingDate: '2026-10-26',
      releasingMode: 'COURIER',
      location: 'Mandaluyong City',
      completeAddress: '66 United Street, Mandaluyong City',
      contactPerson: 'Dr. Evelyn Garcia',
      contactNumber: '639178881234',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: 'None',
      duration: 'Self-install',
      notes: 'Photoluminescent exit signs & hazard warning wall plaques.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 4,
      countPrinting: 4,
      countSpecial: 0,
      revisionCount: 1,
      remarks: 'Shipped via courier with tracking details.',
      month: 'October 2026',
      completionDate: '2026-10-24'
    },
    {
      id: 'req-008',
      requestId: 'LR-26-1237',
      joNumber: 'P260701380',
      projectName: 'SM SUPERMARKET AISLE HANGING BANNERS',
      client: 'SM PRIME HOLDINGS',
      artist: 'Tim',
      salesRep: 'Sarah',
      inCharge: 'SARAH',
      drawnBy: 'TIM',
      orderDate: '2026-10-14',
      designDeadline: '2026-10-21',
      releasingDate: '2026-10-27',
      releasingMode: 'DELIVERY',
      location: 'SM Megamall',
      completeAddress: 'EDSA cor. Doña Julia Vargas Ave, Mandaluyong',
      contactPerson: 'Ms. Joanna Ramos',
      contactNumber: '639223334455',
      clientApproval: 'Approved',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: 'Night Work (8 Hours)',
      notes: 'Double-sided blockout tarpaulin 18oz with top & bottom aluminum tubing.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 0,
      countPrinting: 6,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Delivered for evening mall ingress.',
      month: 'October 2026',
      completionDate: '2026-10-22'
    },
    {
      id: 'req-009',
      requestId: 'LR-26-1238',
      joNumber: 'P260701381',
      projectName: 'SEVEN ELEVEN NEON FLEX ILLUMINATED SIGN',
      client: 'PHILIPPINE SEVEN CORP.',
      artist: 'Seven',
      salesRep: 'Kevin',
      inCharge: 'KEVIN',
      drawnBy: 'SEVEN',
      orderDate: '2026-10-08',
      designDeadline: '2026-10-20',
      releasingDate: '2026-10-28',
      releasingMode: 'PICKUP',
      location: 'Pasig City',
      completeAddress: 'Ortigas Center, Pasig City',
      contactPerson: 'Mr. Leo Navarro',
      contactNumber: '639156667788',
      clientApproval: 'Approved',
      priority: 'Low',
      fileSent: 'Sent',
      installers: '1 Installer',
      duration: '2 Hours',
      notes: '12V silicone LED neon flex mounted on clear 5mm CNC-routed acrylic backer.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 1,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 1,
      remarks: 'Tested on 24-hr burn test bench.',
      month: 'October 2026',
      completionDate: '2026-10-21'
    },
    {
      id: 'req-010',
      requestId: 'LR-26-1239',
      joNumber: 'P260701382',
      projectName: 'MERCEDES BENZ SHOWROOM PYLON LETTERS',
      client: 'AUTO NATION GROUP',
      artist: 'Glen',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'GLEN',
      orderDate: '2026-10-12',
      designDeadline: '2026-10-25',
      releasingDate: '2026-11-02',
      releasingMode: 'INSTALLATION',
      location: 'Greenhills',
      completeAddress: 'EDSA Greenhills, San Juan City',
      contactPerson: 'Sir Anthony Sy',
      contactNumber: '639179990011',
      clientApproval: 'Pending',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '3 Installers',
      duration: '1 Day (8 Hours)',
      notes: 'Mirror polished 316 marine-grade stainless steel letters with pure white halo illumination.',
      projectStatus: 'For Review',
      designStatus: 'For Review',
      headApproval: 'Pending',
      countStandard: 2,
      countPrinting: 0,
      countSpecial: 3,
      revisionCount: 2,
      remarks: 'Art director checking LED halo diffusion distance.',
      month: 'October 2026',
      completionDate: null
    },
    // Historical 2026 Records
    {
      id: 'req-011',
      requestId: 'LR-26-1101',
      joNumber: 'P260100101',
      projectName: 'TOYOTA DEALERSHIP TOTEM SIGN',
      client: 'TOYOTA MOTOR PHILS',
      artist: 'Bob',
      salesRep: 'Marco',
      inCharge: 'MARCO',
      drawnBy: 'BOB',
      orderDate: '2026-01-05',
      designDeadline: '2026-01-18',
      releasingDate: '2026-01-25',
      releasingMode: 'INSTALLATION',
      location: 'Alabang',
      completeAddress: 'Alabang-Zapote Road, Muntinlupa',
      contactPerson: 'Mr. Bong Velasquez',
      contactNumber: '639170010022',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '4 Installers',
      duration: '2 Days',
      notes: 'Red acrylic illuminated logo.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 3,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 1,
      remarks: 'Installed January 2026.',
      month: 'January 2026',
      completionDate: '2026-01-24'
    },
    {
      id: 'req-012',
      requestId: 'LR-26-1102',
      joNumber: 'P260100102',
      projectName: 'MCDONALDS GOLDEN ARCHES STOREFRONT',
      client: 'GOLDEN ARCHES DEV CORP',
      artist: 'Glen',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'GLEN',
      orderDate: '2026-01-12',
      designDeadline: '2026-01-22',
      releasingDate: '2026-01-29',
      releasingMode: 'INSTALLATION',
      location: 'Katipunan QC',
      completeAddress: 'Katipunan Ave, Quezon City',
      contactPerson: 'Ms. Sarah Dizon',
      contactNumber: '639180020033',
      clientApproval: 'Approved',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '3 Installers',
      duration: '1 Day',
      notes: 'Thermoformed yellow acrylic arches.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 0,
      remarks: 'Completed on schedule.',
      month: 'January 2026',
      completionDate: '2026-01-28'
    },
    {
      id: 'req-013',
      requestId: 'LR-26-1103',
      joNumber: 'P260200201',
      projectName: 'PETRON SERVICE STATION PYLON',
      client: 'PETRON CORPORATION',
      artist: 'Edrian',
      salesRep: 'Sarah',
      inCharge: 'SARAH',
      drawnBy: 'EDRIAN',
      orderDate: '2026-02-04',
      designDeadline: '2026-02-16',
      releasingDate: '2026-02-24',
      releasingMode: 'INSTALLATION',
      location: 'NLEX Valenzuela',
      completeAddress: 'NLEX Km 15, Valenzuela',
      contactPerson: 'Engr. Dindo Castro',
      contactNumber: '639190030044',
      clientApproval: 'Approved',
      priority: 'High',
      fileSent: 'Sent',
      installers: '5 Installers',
      duration: '3 Days',
      notes: 'Electronic digital price display integration.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 1,
      countSpecial: 3,
      revisionCount: 2,
      remarks: 'Completed February 2026.',
      month: 'February 2026',
      completionDate: '2026-02-23'
    },
    {
      id: 'req-014',
      requestId: 'LR-26-1104',
      joNumber: 'P260200202',
      projectName: 'UNIQLO GLASS STOREFRONT FROSTED GRAPHICS',
      client: 'FAST RETAILING PH',
      artist: 'Tim',
      salesRep: 'Sarah',
      inCharge: 'SARAH',
      drawnBy: 'TIM',
      orderDate: '2026-02-10',
      designDeadline: '2026-02-20',
      releasingDate: '2026-02-26',
      releasingMode: 'INSTALLATION',
      location: 'Glorietta Makati',
      completeAddress: 'Glorietta 5, Makati City',
      contactPerson: 'Kenji Sato',
      contactNumber: '639200040055',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '4 Hours',
      notes: 'Dusted crystal vinyl plotter cut.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 0,
      countPrinting: 5,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Clean handover.',
      month: 'February 2026',
      completionDate: '2026-02-25'
    },
    {
      id: 'req-015',
      requestId: 'LR-26-1105',
      joNumber: 'P260300301',
      projectName: 'ROBINSONS MALL ATRIUM PROMO STAGING',
      client: 'ROBINSONS LAND CORP',
      artist: 'Rodel',
      salesRep: 'Kevin',
      inCharge: 'KEVIN',
      drawnBy: 'RODEL',
      orderDate: '2026-03-02',
      designDeadline: '2026-03-12',
      releasingDate: '2026-03-18',
      releasingMode: 'INSTALLATION',
      location: 'Robinsons Galleria',
      completeAddress: 'EDSA cor. Ortigas Ave, QC',
      contactPerson: 'Ms. Hazel Cruz',
      contactNumber: '639210050066',
      clientApproval: 'Approved',
      priority: 'High',
      fileSent: 'Sent',
      installers: '3 Installers',
      duration: '1 Night',
      notes: 'Sintra board standees and direct UV print backdrop.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 1,
      countPrinting: 4,
      countSpecial: 1,
      revisionCount: 1,
      remarks: 'Completed March 2026.',
      month: 'March 2026',
      completionDate: '2026-03-17'
    },
    {
      id: 'req-016',
      requestId: 'LR-26-1106',
      joNumber: 'P260400401',
      projectName: 'SHAKE SHACK BURGER NEON AMBIENT LIGHT',
      client: 'SSI GROUP INC',
      artist: 'Seven',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'SEVEN',
      orderDate: '2026-04-05',
      designDeadline: '2026-04-18',
      releasingDate: '2026-04-25',
      releasingMode: 'PICKUP',
      location: 'Greenbelt 5',
      completeAddress: 'Greenbelt 5, Makati City',
      contactPerson: 'Mr. Chris Young',
      contactNumber: '639220060077',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '1 Installer',
      duration: '2 Hours',
      notes: 'Custom neon burger icon green & white.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 1,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 1,
      remarks: 'Completed April 2026.',
      month: 'April 2026',
      completionDate: '2026-04-24'
    },
    {
      id: 'req-017',
      requestId: 'LR-26-1107',
      joNumber: 'P260500501',
      projectName: 'WATSONS DRUGSTORE PHARMACY HEADER',
      client: 'A.S. WATSON GROUP',
      artist: 'Raven',
      salesRep: 'Marco',
      inCharge: 'MARCO',
      drawnBy: 'RAVEN',
      orderDate: '2026-05-08',
      designDeadline: '2026-05-18',
      releasingDate: '2026-05-26',
      releasingMode: 'INSTALLATION',
      location: 'Festival Mall',
      completeAddress: 'Filinvest Alabang, Muntinlupa',
      contactPerson: 'Ms. Maricar Santos',
      contactNumber: '639230070088',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '6 Hours',
      notes: 'Teal acrylic channel letters with internal green LEDs.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 1,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Completed May 2026.',
      month: 'May 2026',
      completionDate: '2026-05-25'
    },
    {
      id: 'req-018',
      requestId: 'LR-26-1108',
      joNumber: 'P260600601',
      projectName: 'FILINVEST CORPORATE TOWER DIRECTORY',
      client: 'FILINVEST LAND',
      artist: 'Goodrich',
      salesRep: 'Sarah',
      inCharge: 'SARAH',
      drawnBy: 'GOODRICH',
      orderDate: '2026-06-03',
      designDeadline: '2026-06-15',
      releasingDate: '2026-06-22',
      releasingMode: 'INSTALLATION',
      location: 'Northgate Alabang',
      completeAddress: 'Filinvest City, Alabang',
      contactPerson: 'Arch. Victor Lim',
      contactNumber: '639240080099',
      clientApproval: 'Approved',
      priority: 'Low',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '4 Hours',
      notes: 'Magnetic modular tenant directory board.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 0,
      countSpecial: 2,
      revisionCount: 0,
      remarks: 'Completed June 2026.',
      month: 'June 2026',
      completionDate: '2026-06-21'
    },
    {
      id: 'req-019',
      requestId: 'LR-26-1109',
      joNumber: 'P260800801',
      projectName: 'HONDA CARS SERVICE CENTER BLADES',
      client: 'HONDA CARS PHILS',
      artist: 'Jules',
      salesRep: 'Kevin',
      inCharge: 'KEVIN',
      drawnBy: 'JULES',
      orderDate: '2026-08-05',
      designDeadline: '2026-08-16',
      releasingDate: '2026-08-23',
      releasingMode: 'DELIVERY',
      location: 'Pasig City',
      completeAddress: 'C5 Road, Pasig City',
      contactPerson: 'Sir Elmer Tan',
      contactNumber: '639250090011',
      clientApproval: 'Approved',
      priority: 'Medium',
      fileSent: 'Sent',
      installers: '2 Installers',
      duration: '1 Day',
      notes: 'Aluminum composite blade signs.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 2,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Completed August 2026.',
      month: 'August 2026',
      completionDate: '2026-08-22'
    },
    {
      id: 'req-020',
      requestId: 'LR-26-1110',
      joNumber: 'P260900901',
      projectName: 'ACE HARDWARE STOREFRONT LIGHTBOX',
      client: 'ACE HARDWARE PHILS',
      artist: 'Glen',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'GLEN',
      orderDate: '2026-09-02',
      designDeadline: '2026-09-15',
      releasingDate: '2026-09-22',
      releasingMode: 'INSTALLATION',
      location: 'SM North EDSA',
      completeAddress: 'North Ave, QC',
      contactPerson: 'Mr. Gilbert Uy',
      contactNumber: '639260100022',
      clientApproval: 'Approved',
      priority: 'Rush',
      fileSent: 'Sent',
      installers: '3 Installers',
      duration: '6 Hours',
      notes: 'Red acrylic 3D box with Osram LEDs.',
      projectStatus: 'Completed',
      designStatus: 'Completed',
      headApproval: 'Approved',
      countStandard: 2,
      countPrinting: 1,
      countSpecial: 1,
      revisionCount: 1,
      remarks: 'Completed September 2026.',
      month: 'September 2026',
      completionDate: '2026-09-20'
    },
    {
      id: 'req-021',
      requestId: 'LR-26-1240',
      joNumber: 'P260701383',
      projectName: 'GOLDILOCKS STOREFRONT FACIA',
      client: 'GOLDILOCKS BAKESHOP',
      artist: 'Bob',
      salesRep: 'Dona',
      inCharge: 'DONA',
      drawnBy: 'BOB',
      orderDate: '2026-10-19',
      designDeadline: '2026-10-24',
      releasingDate: '2026-11-01',
      releasingMode: 'DELIVERY',
      location: 'Manila',
      completeAddress: 'Shaw Blvd, Mandaluyong',
      contactPerson: 'Ms. Teresa Mendoza',
      contactNumber: '639178887766',
      clientApproval: 'Pending',
      priority: 'Rush',
      fileSent: 'Pending',
      installers: '2 Installers',
      duration: '4 Hours',
      notes: 'Standard yellow 3D letters.',
      projectStatus: 'On-going',
      designStatus: 'In Progress',
      headApproval: 'Pending',
      countStandard: 2,
      countPrinting: 0,
      countSpecial: 0,
      revisionCount: 0,
      remarks: 'Design in progress.',
      month: 'October 2026',
      completionDate: null
    }
  ];

  // Default Template Layout Elements
  const DEFAULT_TEMPLATE_ELEMENTS = [
    { id: 'el-req', label: 'REQUEST ID', content: 'LR-26-1230', x: 20, y: 15, w: 140, h: 42, fontSize: 13, align: 'center', color: '#DC2626' },
    { id: 'el-jo', label: 'JO NUMBER', content: 'P260701373', x: 180, y: 15, w: 180, h: 42, fontSize: 16, align: 'center', color: '#DC2626' },
    { id: 'el-due', label: 'DUE DATE', content: 'JULY 30, 2026', x: 380, y: 15, w: 160, h: 42, fontSize: 12, align: 'center', color: '#DC2626' },
    { id: 'el-proj', label: 'PROJECT NAME', content: 'URAL', x: 20, y: 75, w: 420, h: 50, fontSize: 22, align: 'center', color: '#1F2937' },
    { id: 'el-client', label: 'CLIENT NAME', content: 'PAU ACILAC', x: 20, y: 135, w: 420, h: 45, fontSize: 20, align: 'center', color: '#1F2937' },
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
      url: 'assets/sign-depot-logo.png'
    },
    {
      id: 'att-2',
      name: 'Client_Approved_Facade_Render_PauAcilac.png',
      type: 'Proof Render',
      size: '2.8 MB',
      dateAdded: '2026-10-23',
      storageType: 'Local Mock',
      url: 'assets/sign-depot-logo.png'
    },
    {
      id: 'att-3',
      name: 'Engineering_Electrical_Wiring_Diagram.png',
      type: 'Technical Drawing',
      size: '890 KB',
      dateAdded: '2026-10-23',
      storageType: 'Local Mock',
      url: 'assets/sign-depot-logo.png'
    }
  ];

  // ==========================================================================
  // STATE STORE (Unified Central State with LocalStorage Sync)
  // ==========================================================================

  let state = {
    artists: [...DEFAULT_ARTISTS],
    salesReps: [...DEFAULT_SALES_REPS],
    requests: JSON.parse(JSON.stringify(DEFAULT_REQUESTS)),
    templateElements: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS)),
    attachments: [...DEFAULT_ATTACHMENTS],
    activeView: 'view-dashboard',
    currentDirectiveJo: 'P260701373',
    timeframe: 'month',
    salesFilter: { search: '', priority: '', approval: '', fileSent: '', salesRep: '', sortField: 'orderDate', sortDir: 'desc', page: 1, perPage: 8 },
    trackerFilter: { search: '', projectStatus: '', designStatus: '', artist: '', overdue: '', sortField: 'designDeadline', sortDir: 'asc', page: 1, perPage: 10 },
    workloadFilter: { availability: '', search: '', selectedArtist: '' },
    pendingArtistSelected: 'Glen',
    pendingSalesFilter: 'all',
    pendingSalesSearch: '',
    selectedTemplateElemId: null
  };

  function loadStateFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.requests) && parsed.requests.length > 0) {
          state.artists = parsed.artists || DEFAULT_ARTISTS;
          state.salesReps = parsed.salesReps || DEFAULT_SALES_REPS;
          state.requests = parsed.requests;
          state.templateElements = parsed.templateElements || DEFAULT_TEMPLATE_ELEMENTS;
          state.attachments = parsed.attachments || DEFAULT_ATTACHMENTS;
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available or parse failed. Using defaults.', e);
    }
  }

  function saveStateToStorage() {
    try {
      const dataToSave = {
        artists: state.artists,
        salesReps: state.salesReps,
        requests: state.requests,
        templateElements: state.templateElements,
        attachments: state.attachments
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
  // DIRECT INLINE TABLE EDITING ENGINE
  // ==========================================================================

  // Updates any field on a request directly, recalculates dependent views and persists
  function updateRequestField(requestId, fieldName, newValue, domElement) {
    const rec = state.requests.find(r => r.id === requestId);
    if (!rec) return;

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

    // Visual feedback
    if (domElement) {
      domElement.classList.add('cell-just-saved');
      setTimeout(() => domElement.classList.remove('cell-just-saved'), 1000);
    }

    saveStateToStorage();

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

  // Generates directly editable text cell HTML
  function renderEditableCell(reqId, fieldName, currentValue) {
    return `<span class="editable-cell" contenteditable="true" 
      data-req-id="${reqId}" data-field="${fieldName}"
      onblur="window.SignDepotApp.handleInlineTextBlur(this)" 
      onkeydown="window.SignDepotApp.handleInlineTextKey(event, this)">${escapeHTML(currentValue || '')}</span>`;
  }

  // Badge styling resolver for custom dropdown pills
  function getBadgeClassForValue(fieldName, val) {
    if (!val) return 'badge-neutral';
    const v = String(val).toLowerCase();
    if (fieldName === 'artist') return 'badge-artist';
    if (fieldName === 'salesRep') return 'badge-sales';
    if (['completed', 'approved', 'sent'].includes(v)) return 'badge-completed';
    if (['in progress', 'on-going', 'working'].includes(v)) return 'badge-ongoing';
    if (['pending', 'for review', 'revising', 'needs revision', 'queue'].includes(v)) return 'badge-pending';
    if (['rush', 'high'].includes(v)) return 'badge-priority-rush';
    if (['medium', 'med'].includes(v)) return 'badge-priority-med';
    if (['not started', 'draft', 'low'].includes(v)) return 'badge-not-started';
    return 'badge-neutral';
  }

  // Dot indicator styling resolver for dropdown options
  function getIndicatorClass(fieldName, val) {
    if (!val) return 'indicator-neutral';
    const v = String(val).toLowerCase();
    if (fieldName === 'artist') return 'indicator-artist';
    if (fieldName === 'salesRep') return 'indicator-sales';
    if (['completed', 'approved', 'sent'].includes(v)) return 'indicator-completed';
    if (['in progress', 'on-going', 'working'].includes(v)) return 'indicator-ongoing';
    if (['pending', 'for review', 'revising', 'needs revision', 'queue'].includes(v)) return 'indicator-pending';
    if (['rush', 'high'].includes(v)) return 'indicator-rush';
    return 'indicator-neutral';
  }

  // Generates directly editable custom themed dropdown trigger HTML
  function renderInlineSelect(reqId, fieldName, currentValue, optionsList) {
    const badgeClass = getBadgeClassForValue(fieldName, currentValue);
    const safeOptions = JSON.stringify(optionsList).replace(/"/g, '&quot;');
    const safeVal = escapeHTML(currentValue || 'Select');
    return `
      <button type="button" class="custom-select-btn ${badgeClass}"
        data-req-id="${reqId}"
        data-field="${fieldName}"
        data-current="${escapeHTML(currentValue || '')}"
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
        return `
          <div class="custom-dropdown-opt ${isSelected ? 'selected' : ''}" data-val="${escapeHTML(val)}" data-label="${escapeHTML(label)}">
            <span class="opt-indicator ${indicator}"></span>
            <span class="opt-label">${escapeHTML(label)}</span>
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

    triggerBtn.setAttribute('data-current', selectedVal);
    const labelSpan = triggerBtn.querySelector('.custom-select-label');
    if (labelSpan) labelSpan.textContent = selectedLabel || selectedVal;

    if (reqId) {
      triggerBtn.className = `custom-select-btn ${getBadgeClassForValue(fieldName, selectedVal)} cell-just-saved`;
      updateRequestField(reqId, fieldName, selectedVal, triggerBtn);
      showToast(`Updated ${fieldName} to ${selectedVal}.`);
    } else if (triggerBtn._nativeSelect) {
      triggerBtn._nativeSelect.value = selectedVal;
      triggerBtn._nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      if (selectedVal) {
        triggerBtn.classList.add('has-value');
      } else {
        triggerBtn.classList.remove('has-value');
      }
    }
  }

  function initCustomDropdownEngine() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#sdCustomDropdownMenu') && !e.target.closest('.custom-select-btn') && !e.target.closest('.custom-filter-dropdown-btn')) {
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
        if (sel.value) {
          btn.classList.add('has-value');
        } else {
          btn.classList.remove('has-value');
        }
      });
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

  // Generates directly editable date picker HTML
  function renderInlineDate(reqId, fieldName, currentDateValue) {
    return `
      <input type="date" class="inline-date-input" value="${currentDateValue || ''}"
        data-req-id="${reqId}" data-field="${fieldName}"
        onchange="window.SignDepotApp.handleInlineDateChange(this)">
    `;
  }

  // Generates directly editable number input HTML
  function renderInlineNumber(reqId, fieldName, currentNumValue) {
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
    }, 3200);
  }

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
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

  function isOverdue(deadlineStr, projectStatus) {
    if (!deadlineStr || projectStatus === 'Completed') return false;
    const deadline = new Date(deadlineStr + 'T23:59:59');
    const now = new Date('2026-10-23T11:45:00');
    return deadline < now;
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'On-going': return 'badge-ongoing';
      case 'Approved': return 'badge-approved';
      case 'For Review': return 'badge-for-review';
      case 'Revising': return 'badge-revising';
      case 'Completed': return 'badge-completed';
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
    'view-creatives-tracker': 'creatives-tracker.html',
    'view-artist-workload': 'artist-workload.html',
    'view-directives-details': 'directives-details.html',
    'view-pending-artist': 'pending-artist.html',
    'view-pending-sales': 'pending-sales.html',
    'view-monthly-output': 'monthly-output.html',
    'view-settings': 'settings.html'
  };

  function detectCurrentPage() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage && PAGE_MAP[bodyPage]) return bodyPage;

    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop() || 'index.html';
    for (const [viewId, pageFile] of Object.entries(PAGE_MAP)) {
      if (filename === pageFile.toLowerCase()) return viewId;
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
        window.location.href = targetPage;
        return;
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
      'view-pending-artist': { title: 'Pending Projects — Artist', badge: 'Creative Queue' },
      'view-pending-sales': { title: 'Pending Projects — Sales', badge: 'Sales Actions' },
      'view-monthly-output': { title: 'Monthly Production Output', badge: 'Verified 2026 Metrics' },
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
      case 'view-pending-artist':
        renderPendingArtistQueue();
        break;
      case 'view-pending-sales':
        renderPendingSalesQueue();
        break;
      case 'view-monthly-output':
        renderMonthlyOutputReport();
        break;
      case 'view-settings':
        renderSettings();
        break;
    }

    // Ensure all filter selects in the active view are upgraded to custom themed buttons
    upgradeAllFilterSelects();
  }

  // ==========================================================================
  // MODULE 1: DASHBOARD ENGINE (Panze Studio Layout + Live Inline Editable)
  // ==========================================================================

  function renderDashboard() {
    updateDashboardKPIs();
    renderPanzeTaskCards();
    renderPanzeDonutChart();
    renderDashboardWorkloadSnapshot();
    renderDashboardRecentProjectsTable();
  }

  function updateDashboardKPIs() {
    const reqs = state.requests;
    const totalRequests = reqs.length;
    const pendingApproval = reqs.filter(r => r.clientApproval === 'Pending' || r.projectStatus === 'Pending').length;
    const working = reqs.filter(r => r.projectStatus === 'On-going' || r.designStatus === 'In Progress').length;
    const completed = reqs.filter(r => r.projectStatus === 'Completed').length;
    const revising = reqs.filter(r => r.projectStatus === 'Revising' || r.designStatus === 'Revising').length;
    const overdue = reqs.filter(r => isOverdue(r.designDeadline, r.projectStatus)).length;

    document.getElementById('kpiTotalRequests').textContent = totalRequests;
    document.getElementById('kpiPendingApproval').textContent = pendingApproval;
    document.getElementById('kpiWorking').textContent = working;
    document.getElementById('kpiCompleted').textContent = completed;
    document.getElementById('kpiRevising').textContent = revising;
    document.getElementById('kpiOverdue').textContent = overdue;
  }

  // Panze Left Column: Soft Pastel Tinted Task Cards
  function renderPanzeTaskCards() {
    const container = document.getElementById('panzeTasksCardList');
    const badge = document.getElementById('panzeActiveTasksCountBadge');
    if (!container) return;

    const activeList = state.requests.filter(r => r.projectStatus !== 'Completed').slice(0, 4);
    if (badge) badge.textContent = state.requests.filter(r => r.projectStatus !== 'Completed').length;

    const tints = ['task-tint-peach', 'task-tint-blue', 'task-tint-green', 'task-tint-purple'];
    const badgeColors = ['#F97316', '#0284C7', '#10B981', '#7C3AED'];

    container.innerHTML = activeList.map((r, idx) => {
      const tint = tints[idx % tints.length];
      const iconColor = badgeColors[idx % badgeColors.length];
      const isPastDue = isOverdue(r.designDeadline, r.projectStatus);

      return `
        <div class="task-item-card ${tint}">
          <div class="task-card-top">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="task-badge-icon" style="background:${iconColor}; color:#FFF;">
                ${escapeHTML(r.artist.substring(0, 1))}
              </div>
              <span style="font-size:11px; font-weight:700; color:var(--text-secondary);">${escapeHTML(r.requestId)}</span>
            </div>
            <button class="circle-action-btn" style="width:24px; height:24px;" 
              onclick="window.SignDepotApp.toggleTaskCompletion('${r.id}')" title="Mark Done">
              ✓
            </button>
          </div>
          <div class="task-card-title">${escapeHTML(r.projectName)}</div>
          <div class="task-card-desc">${escapeHTML(r.client)} • Artist: <strong>${escapeHTML(r.artist)}</strong></div>
          <div class="task-card-footer">
            <span class="badge ${getStatusBadgeClass(r.projectStatus)}">${escapeHTML(r.projectStatus)}</span>
            <span style="color:${isPastDue ? 'var(--accent-red)' : 'var(--text-secondary)'}; font-weight:700;">
              ${isPastDue ? '⚠️ Due ' : 'Due '}${formatDate(r.designDeadline)}
            </span>
          </div>
        </div>
      `;
    }).join('');
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

  // Bottom Recent Projects: DIRECT INLINE EDITABLE TABLE
  function renderDashboardRecentProjectsTable() {
    const tbody = document.getElementById('dashboardRecentProjectsBody');
    if (!tbody) return;

    const recentList = [...state.requests].slice(0, 6);
    tbody.innerHTML = recentList.map(r => `
      <tr>
        <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
        <td><strong style="color:var(--accent-red);">${escapeHTML(r.joNumber)}</strong></td>
        <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
        <td>${renderEditableCell(r.id, 'client', r.client)}</td>
        <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
        <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline)}</td>
        <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
        <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">
            Directive
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // MODULE 2: SALES REQUESTS ENGINE (Direct Inline Editable Table)
  // ==========================================================================

  function renderSalesRequests() {
    populateSalesFiltersDropdowns();

    let list = [...state.requests];
    const { search, priority, approval, fileSent, salesRep, sortField, sortDir, page, perPage } = state.salesFilter;

    // Filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.requestId.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      );
    }
    if (priority) list = list.filter(r => r.priority === priority);
    if (approval) list = list.filter(r => r.clientApproval === approval);
    if (fileSent) list = list.filter(r => r.fileSent === fileSent);
    if (salesRep) list = list.filter(r => r.salesRep === salesRep);

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = list.length;
    const totalPages = Math.max(Math.ceil(totalItems / perPage), 1);
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('salesRequestsTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:30px; color:var(--text-muted);">No sales requests match the current filters.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => `
          <tr>
            <td><strong style="color: var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td><strong style="color: var(--accent-red);">${escapeHTML(r.joNumber)}</strong></td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderEditableCell(r.id, 'client', r.client)}</td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline)}</td>
            <td>${renderInlineDate(r.id, 'releasingDate', r.releasingDate)}</td>
            <td>${renderInlineSelect(r.id, 'fileSent', r.fileSent, FILE_SENT_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'clientApproval', r.clientApproval, APPROVAL_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'priority', r.priority, PRIORITY_LEVELS)}</td>
            <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
            <td>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')" title="Open Directive">
                  Directive
                </button>
                <button class="btn btn-secondary btn-sm btn-icon-only" onclick="window.SignDepotApp.duplicateSalesRequest('${r.id}')" title="Duplicate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }

    // Pagination
    const infoEl = document.getElementById('salesPaginationInfo');
    if (infoEl) {
      const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
      const endDisplay = Math.min(startIndex + perPage, totalItems);
      infoEl.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems} requests`;
    }

    const controlsEl = document.getElementById('salesPaginationControls');
    if (controlsEl) {
      let btnsHTML = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="window.SignDepotApp.setSalesPage(${currentPage - 1})">&laquo;</button>
      `;
      for (let p = 1; p <= totalPages; p++) {
        btnsHTML += `
          <button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="window.SignDepotApp.setSalesPage(${p})">${p}</button>
        `;
      }
      btnsHTML += `
        <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''} onclick="window.SignDepotApp.setSalesPage(${currentPage + 1})">&raquo;</button>
      `;
      controlsEl.innerHTML = btnsHTML;
    }
  }

  function populateSalesFiltersDropdowns() {
    const repSelect = document.getElementById('salesFilterSalesRep');
    if (repSelect && repSelect.children.length <= 1) {
      state.salesReps.forEach(rep => {
        const opt = document.createElement('option');
        opt.value = rep;
        opt.textContent = rep;
        repSelect.appendChild(opt);
      });
    }

    const modalArtistSelect = document.getElementById('salesFormArtist');
    if (modalArtistSelect && modalArtistSelect.children.length === 0) {
      state.artists.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        modalArtistSelect.appendChild(opt);
      });
    }

    const modalSalesSelect = document.getElementById('salesFormSalesRep');
    if (modalSalesSelect && modalSalesSelect.children.length === 0) {
      state.salesReps.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        modalSalesSelect.appendChild(opt);
      });
    }
  }

  // ==========================================================================
  // MODULE 3: CREATIVES TRACKER (Google Sheets Replica with Inline Editing)
  // ==========================================================================

  function renderCreativesTracker() {
    populateTrackerFiltersDropdowns();

    let list = [...state.requests];
    const { search, projectStatus, designStatus, artist, overdue, sortField, sortDir, page, perPage } = state.trackerFilter;

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
    if (artist) list = list.filter(r => r.artist === artist);
    if (overdue === 'overdue') list = list.filter(r => isOverdue(r.designDeadline, r.projectStatus));
    if (overdue === 'ontime') list = list.filter(r => !isOverdue(r.designDeadline, r.projectStatus));

    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = list.length;
    const totalPages = Math.max(Math.ceil(totalItems / perPage), 1);
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const pagedList = list.slice(startIndex, startIndex + perPage);

    const tbody = document.getElementById('creativesTrackerTableBody');
    if (tbody) {
      if (pagedList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="15" style="text-align:center; padding:30px; color:var(--text-muted);">No tasks match the filters.</td></tr>`;
      } else {
        tbody.innerHTML = pagedList.map(r => {
          const pastDue = isOverdue(r.designDeadline, r.projectStatus);
          return `
            <tr>
              <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
              <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
              <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
              <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline)}</td>
              <td>${renderInlineSelect(r.id, 'headApproval', r.headApproval || 'Pending', ['Approved', 'Pending', 'Needs Revision'])}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countStandard', r.countStandard)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countPrinting', r.countPrinting)}</td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'countSpecial', r.countSpecial)}</td>
              <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
              <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus, DESIGN_STATUSES)}</td>
              <td>
                ${pastDue ? '<span class="badge badge-priority-rush">OVERDUE</span>' : '<span style="color:#10B981; font-weight:700; font-size:11px;">ON TRACK</span>'}
              </td>
              <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
              <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
              <td>${renderInlineSelect(r.id, 'salesRep', r.salesRep, state.salesReps)}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    const infoEl = document.getElementById('trackerPaginationInfo');
    if (infoEl) {
      const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
      const endDisplay = Math.min(startIndex + perPage, totalItems);
      infoEl.textContent = `Showing ${startDisplay}-${endDisplay} of ${totalItems} tasks`;
    }

    const controlsEl = document.getElementById('trackerPaginationControls');
    if (controlsEl) {
      let btnsHTML = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="window.SignDepotApp.setTrackerPage(${currentPage - 1})">&laquo;</button>
      `;
      for (let p = 1; p <= totalPages; p++) {
        btnsHTML += `
          <button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="window.SignDepotApp.setTrackerPage(${p})">${p}</button>
        `;
      }
      btnsHTML += `
        <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''} onclick="window.SignDepotApp.setTrackerPage(${currentPage + 1})">&raquo;</button>
      `;
      controlsEl.innerHTML = btnsHTML;
    }
  }

  function populateTrackerFiltersDropdowns() {
    const artistSelect = document.getElementById('trackerFilterArtist');
    if (artistSelect && artistSelect.children.length <= 1) {
      state.artists.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        artistSelect.appendChild(opt);
      });
    }

    const modalArtistSelect = document.getElementById('trackerFormArtist');
    if (modalArtistSelect && modalArtistSelect.children.length === 0) {
      state.artists.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        modalArtistSelect.appendChild(opt);
      });
    }
  }

  // ==========================================================================
  // MODULE 4: ARTIST WORKLOAD ENGINE
  // ==========================================================================

  function renderArtistWorkload() {
    const grid = document.getElementById('artistWorkloadCardsGrid');
    if (!grid) return;

    const reqs = state.requests;
    const filterAvail = state.workloadFilter.availability;

    const artistData = state.artists.map(artist => {
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

    let list = state.requests.filter(r => r.projectStatus !== 'Completed');
    if (selectedArtist) {
      list = list.filter(r => r.artist === selectedArtist);
    }

    const search = state.workloadFilter.search;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.projectName.toLowerCase().includes(q) || r.requestId.toLowerCase().includes(q));
    }

    const tbody = document.getElementById('artistWorkloadDetailsTableBody');
    if (tbody) {
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No active tasks for selected artist.</td></tr>`;
      } else {
        tbody.innerHTML = list.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td>${renderInlineSelect(r.id, 'artist', r.artist, state.artists)}</td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>
              ${r.countSpecial > 0 ? '<span class="badge badge-priority-high">Special</span>' : r.countPrinting > 0 ? '<span class="badge badge-ongoing">Printing</span>' : '<span class="badge badge-not-started">Standard</span>'}
            </td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus, DESIGN_STATUSES)}</td>
            <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // MODULE 5: DIRECTIVES DETAILS (The Star Module)
  // ==========================================================================

  function getDirectiveRecord(joOrReq) {
    if (!joOrReq) return null;
    const clean = String(joOrReq).trim().toLowerCase();
    return state.requests.find(r => 
      r.joNumber.toLowerCase() === clean || 
      r.requestId.toLowerCase() === clean ||
      r.projectName.toLowerCase().includes(clean)
    );
  }

  function renderDirectivePreview(joToLoad) {
    const jo = joToLoad || state.currentDirectiveJo || 'P260701373';
    const rec = getDirectiveRecord(jo) || state.requests[0];
    state.currentDirectiveJo = rec.joNumber;

    const input = document.getElementById('directiveLookupInput');
    if (input) input.value = rec.joNumber;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = (val !== undefined && val !== null) ? val : '';
    };

    setTxt('docFieldRequestId', rec.requestId || 'LR-26-1230');
    setTxt('docFieldJoNumber', rec.joNumber || 'P260701373');
    setTxt('docFieldDueDate', formatReadableDate(rec.designDeadline || rec.releasingDate));
    setTxt('docFieldLocation', rec.location || 'Manila Branch');
    setTxt('docFieldProjectName', rec.projectName || 'URAL');
    setTxt('docFieldClientName', rec.client || 'PAU ACILAC');
    setTxt('docFieldInCharge', (rec.inCharge || rec.salesRep || 'DONA').toUpperCase());
    setTxt('docFieldDrawnBy', (rec.drawnBy || rec.artist || 'GLEN').toUpperCase());
    setTxt('docFieldContactPerson', rec.contactPerson || '-');
    setTxt('docFieldContactNumber', rec.contactNumber || '639178805364');
    setTxt('docFieldOrderDate', formatDate(rec.orderDate));
    setTxt('docFieldReleasingDate', formatReadableDate(rec.releasingDate));
    setTxt('docFieldReleasingMode', (rec.releasingMode || 'PICKUP').toUpperCase());
    setTxt('docFieldAddress', rec.completeAddress || rec.location || 'Manila Branch');
    setTxt('docFieldInstallers', rec.installers || '2 Installers');
    setTxt('docFieldDuration', rec.duration || '1 Day (4 Hours)');

    const priorityEl = document.getElementById('docFieldPriorityStatus');
    if (priorityEl) {
      priorityEl.innerHTML = `Priority: <strong>${escapeHTML(rec.priority || 'RUSH')}</strong> | Status: <strong>${escapeHTML(rec.status || 'Approved')}</strong>`;
    }

    const deliveryEl = document.getElementById('docFieldDeliveryAddress');
    if (deliveryEl) {
      const addr = rec.completeAddress || 'Block 14 Lot 3, Ortigas Ave Extension, Pasig City';
      deliveryEl.innerHTML = `<strong>DELIVERY / SITE ADDRESS:</strong> ${escapeHTML(addr)}`;
    }

    // Update live drawing canvas mock
    setTxt('mockSignTitle', rec.projectName || 'URAL');
    setTxt('mockSignSub', rec.client || 'PAU ACILAC');

    const ctrlInst = document.getElementById('ctrlInstallers');
    const ctrlDur = document.getElementById('ctrlDuration');
    const ctrlMode = document.getElementById('ctrlReleasingMode');
    const ctrlNotes = document.getElementById('ctrlNotes');
    const ctrlInCharge = document.getElementById('ctrlInCharge');
    const ctrlDrawnBy = document.getElementById('ctrlDrawnBy');

    if (ctrlInst) ctrlInst.value = rec.installers || '2 Installers';
    if (ctrlDur) ctrlDur.value = rec.duration || '1 Day (4 Hours)';
    if (ctrlMode) ctrlMode.value = rec.releasingMode || 'PICKUP';
    if (ctrlNotes) ctrlNotes.value = rec.notes || '';
    if (ctrlInCharge) ctrlInCharge.value = rec.inCharge || rec.salesRep || 'DONA';
    if (ctrlDrawnBy) ctrlDrawnBy.value = rec.drawnBy || rec.artist || 'GLEN';

    renderAttachmentsList();
  }

  function setupDirectiveControlsSync() {
    const bindSync = (controlId, docFieldId, fallback) => {
      const ctrl = document.getElementById(controlId);
      const target = document.getElementById(docFieldId);
      if (ctrl && target) {
        ctrl.addEventListener('input', () => {
          target.textContent = ctrl.value || fallback;
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
        if (target) target.textContent = ctrlMode.value.toUpperCase();
      });
    }

    const editableInstallers = document.getElementById('docFieldInstallers');
    if (editableInstallers) {
      editableInstallers.addEventListener('input', () => {
        const ctrl = document.getElementById('ctrlInstallers');
        if (ctrl) ctrl.value = editableInstallers.textContent.trim();
      });
    }

    const editableDuration = document.getElementById('docFieldDuration');
    if (editableDuration) {
      editableDuration.addEventListener('input', () => {
        const ctrl = document.getElementById('ctrlDuration');
        if (ctrl) ctrl.value = editableDuration.textContent.trim();
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

    const requestIdVal = document.getElementById('docFieldRequestId')?.textContent?.trim() || rec.requestId || 'LR-26-1230';
    const joNumberVal = document.getElementById('docFieldJoNumber')?.textContent?.trim() || rec.joNumber || 'P260701373';
    const dueDateFormatted = document.getElementById('docFieldDueDate')?.textContent?.trim() || formatReadableDate(rec.designDeadline || rec.releasingDate);
    const releasingDateFormatted = document.getElementById('docFieldReleasingDate')?.textContent?.trim() || formatReadableDate(rec.releasingDate);
    const inChargeVal = (document.getElementById('docFieldInCharge')?.textContent?.trim() || rec.inCharge || rec.salesRep || 'DONA').toUpperCase();
    const drawnByVal = (document.getElementById('docFieldDrawnBy')?.textContent?.trim() || rec.drawnBy || rec.artist || 'GLEN').toUpperCase();
    const releasingModeVal = (document.getElementById('docFieldReleasingMode')?.textContent?.trim() || rec.releasingMode || 'PICKUP').toUpperCase();
    const locationVal = document.getElementById('docFieldLocation')?.textContent?.trim() || rec.location || 'Manila Branch';
    const installersVal = document.getElementById('docFieldInstallers')?.textContent?.trim() || rec.installers || '2 Installers';
    const durationVal = document.getElementById('docFieldDuration')?.textContent?.trim() || rec.duration || '1 Day (4 Hours)';
    const addressVal = document.getElementById('docFieldAddress')?.textContent?.trim() || rec.completeAddress || rec.location || 'Manila Branch';
    const projectNameVal = document.getElementById('docFieldProjectName')?.textContent?.trim() || rec.projectName || 'URAL';
    const clientVal = document.getElementById('docFieldClientName')?.textContent?.trim() || rec.client || 'PAU ACILAC';
    const contactPersonVal = document.getElementById('docFieldContactPerson')?.textContent?.trim() || rec.contactPerson || '-';
    const contactNumberVal = document.getElementById('docFieldContactNumber')?.textContent?.trim() || rec.contactNumber || '639178805364';
    const orderDateVal = document.getElementById('docFieldOrderDate')?.textContent?.trim() || formatDate(rec.orderDate);
    const priorityVal = rec.priority || 'RUSH';
    const statusVal = rec.status || 'Approved';
    const deliverySiteVal = rec.completeAddress || 'Block 14 Lot 3, Ortigas Ave Extension, Pasig City';

    // Pure Vector Sign Depot Logo (No external images, pastes seamlessly in Corel/Illustrator)
    const logoSVG = `
      <g>
        <rect x="0" y="0" width="76" height="24" rx="3" fill="#E53935" transform="rotate(-4 38 12)" />
        <text x="38" y="16" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="11" text-anchor="middle" transform="rotate(-4 38 12)">Sign Depot</text>
        <text x="79" y="8" fill="#000000" font-family="Arial, sans-serif" font-weight="bold" font-size="7">TM</text>
      </g>
    `;

    // Note: Do NOT prepend <?xml ...?> so Illustrator & Photoshop treat it as vector graphic data rather than code text
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 320" width="1000" height="320">
  <defs>
    <style>
      .lbl-box { fill: #262D37; stroke: #000000; stroke-width: 1.5px; }
      .lbl-txt { fill: #FFFFFF; font-family: Arial, 'Roboto Condensed', 'Oswald', sans-serif; font-weight: bold; font-size: 11.5px; letter-spacing: 0.3px; }
      .val-box { fill: #FFFFFF; stroke: #000000; stroke-width: 1.5px; }
      .val-txt { fill: #111111; font-family: Arial, 'Roboto Condensed', 'Oswald', sans-serif; font-size: 13px; font-weight: bold; }
      .red-txt { fill: #E31B23; font-family: Arial, 'Roboto Condensed', 'Oswald', sans-serif; font-weight: 900; }
      .center-txt { text-anchor: middle; }
    </style>
  </defs>

  <!-- Sheet White Background -->
  <rect width="1000" height="320" fill="#FFFFFF" />

  <!-- TOP REQUEST ID NUMBER BADGE -->
  <rect x="5" y="5" width="140" height="18" fill="#262D37" stroke="#262D37" stroke-width="1.5" />
  <text x="75" y="17.5" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="9.5" text-anchor="middle" letter-spacing="0.5">REQUEST ID NUMBER</text>
  <rect x="5" y="23" width="140" height="22" fill="#FFFFFF" stroke="#262D37" stroke-width="1.5" />
  <text x="75" y="39" fill="#E31B23" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="0.5">${escapeHTML(requestIdVal)}</text>

  <!-- MAIN TABLE OUTER BORDER (x=5, y=50, w=990, h=265) -->
  <rect x="5" y="50" width="990" height="265" fill="#FFFFFF" stroke="#000000" stroke-width="2" />

  <!-- ROW 1 (y=50, h=44) -->
  <!-- JO#: -->
  <rect x="5" y="50" width="85" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="47.5" y="77" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="13" text-anchor="middle" class="lbl-txt center-txt">JO#:</text>

  <!-- JO Number Value -->
  <rect x="90" y="50" width="175" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="177.5" y="82" fill="#E31B23" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="28" text-anchor="middle" class="red-txt center-txt">${escapeHTML(joNumberVal)}</text>

  <!-- MERGED URAL & PAU ACILAC (Rows 1-3, x=265, y=50, w=350, h=132) -->
  <rect x="265" y="50" width="350" height="132" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="440" y="100" fill="#262D37" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="34" letter-spacing="2" text-anchor="middle" class="center-txt">${escapeHTML(projectNameVal)}</text>
  <text x="440" y="145" fill="#262D37" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="26" letter-spacing="1.5" text-anchor="middle" class="center-txt">${escapeHTML(clientVal)}</text>

  <!-- CONTACT PERSON: -->
  <rect x="615" y="50" width="125" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="77" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">CONTACT PERSON:</text>
  <rect x="740" y="50" width="135" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="77" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" class="val-txt">${escapeHTML(contactPersonVal)}</text>

  <!-- NUMBER OF INSTALLERS Header -->
  <rect x="875" y="50" width="120" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="935" y="77" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="9.5" text-anchor="middle" class="lbl-txt center-txt">NUMBER OF INSTALLERS</text>

  <!-- ROW 2 (y=94, h=44) -->
  <!-- DUE DATE: -->
  <rect x="5" y="94" width="85" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="47.5" y="121" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="12" text-anchor="middle" class="lbl-txt center-txt">DUE DATE:</text>
  <rect x="90" y="94" width="175" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="177.5" y="122" fill="#E31B23" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="14.5" text-anchor="middle" class="red-txt center-txt">${escapeHTML(dueDateFormatted)}</text>

  <!-- CONTACT NUMBER: -->
  <rect x="615" y="94" width="125" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="121" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">CONTACT NUMBER:</text>
  <rect x="740" y="94" width="135" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="121" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" class="val-txt">${escapeHTML(contactNumberVal)}</text>

  <!-- INSTALLERS PILL BOX (Rows 2 & 3, x=875, y=94, w=120, h=88) -->
  <rect x="875" y="94" width="120" height="88" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <rect x="885" y="120" width="100" height="36" rx="6" fill="#FFFFFF" stroke="#262D37" stroke-width="1.5" />
  <text x="935" y="143" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="13" text-anchor="middle" class="val-txt center-txt">${escapeHTML(installersVal)}</text>

  <!-- ROW 3 (y=138, h=44) -->
  <!-- LOCATION: -->
  <rect x="5" y="138" width="85" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="47.5" y="165" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="12" text-anchor="middle" class="lbl-txt center-txt">LOCATION:</text>
  <rect x="90" y="138" width="175" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="177.5" y="165" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" text-anchor="middle" class="val-txt center-txt">${escapeHTML(locationVal)}</text>

  <!-- ORDER DATE: -->
  <rect x="615" y="138" width="125" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="165" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">ORDER DATE:</text>
  <rect x="740" y="138" width="135" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="165" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" class="val-txt">${escapeHTML(orderDateVal)}</text>

  <!-- ROW 4 (y=182, h=45) -->
  <!-- 3 Vector Logos (Cols 1 & 2, w=260, h=45) -->
  <rect x="5" y="182" width="260" height="45" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <g transform="translate(15, 193) scale(0.68)">${logoSVG}</g>
  <g transform="translate(100, 193) scale(0.68)">${logoSVG}</g>
  <g transform="translate(185, 193) scale(0.68)">${logoSVG}</g>

  <!-- SUBTABLE: IN-CHARGE & DRAWN BY (Col 3, x=265, y=182, w=350, h=45) -->
  <rect x="265" y="182" width="175" height="22" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="352.5" y="197" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="11" text-anchor="middle" class="lbl-txt center-txt">IN-CHARGE</text>
  <rect x="440" y="182" width="175" height="22" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="527.5" y="197" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="11" text-anchor="middle" class="lbl-txt center-txt">DRAWN BY:</text>

  <rect x="265" y="204" width="175" height="23" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="352.5" y="220" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="13.5" text-anchor="middle" class="val-txt center-txt">${escapeHTML(inChargeVal)}</text>
  <rect x="440" y="204" width="175" height="23" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="527.5" y="220" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="13.5" text-anchor="middle" class="val-txt center-txt">${escapeHTML(drawnByVal)}</text>

  <!-- RELEASING DATE: -->
  <rect x="615" y="182" width="125" height="45" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="210" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">RELEASING DATE:</text>
  <rect x="740" y="182" width="135" height="45" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="210" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" class="val-txt">${escapeHTML(releasingDateFormatted)}</text>

  <!-- INSTALLATION DURATION Header -->
  <rect x="875" y="182" width="120" height="45" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="935" y="210" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="9.5" text-anchor="middle" class="lbl-txt center-txt">INSTALLATION DURATION</text>

  <!-- ROW 5 (y=227, h=44) -->
  <!-- Priority & Status Bar (Cols 1-3, x=5, y=227, w=610, h=44) -->
  <rect x="5" y="227" width="610" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="310" y="254" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-size="12" text-anchor="middle" class="val-txt center-txt">Priority: <tspan font-weight="900">${escapeHTML(priorityVal)}</tspan> | Status: <tspan font-weight="900">${escapeHTML(statusVal)}</tspan></text>

  <!-- RELEASING MODE: -->
  <rect x="615" y="227" width="125" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="254" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">RELEASING MODE:</text>
  <rect x="740" y="227" width="135" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="254" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="13" class="val-txt">${escapeHTML(releasingModeVal)}</text>

  <!-- DURATION PILL BOX (Rows 5 & 6, x=875, y=227, w=120, h=88) -->
  <rect x="875" y="227" width="120" height="88" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <rect x="883" y="253" width="104" height="36" rx="6" fill="#FFFFFF" stroke="#262D37" stroke-width="1.5" />
  <text x="935" y="276" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="900" font-size="12.5" text-anchor="middle" class="val-txt center-txt">${escapeHTML(durationVal)}</text>

  <!-- ROW 6 (y=271, h=44) -->
  <!-- DELIVERY / SITE ADDRESS: (Cols 1-3, x=5, y=271, w=610, h=44) -->
  <rect x="5" y="271" width="610" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="15" y="298" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-size="11.5" class="val-txt"><tspan font-weight="900">DELIVERY / SITE ADDRESS: </tspan><tspan font-weight="bold">${escapeHTML(deliverySiteVal)}</tspan></text>

  <!-- ADDRESS: -->
  <rect x="615" y="271" width="125" height="44" fill="#262D37" stroke="#000000" stroke-width="1.5" class="lbl-box" />
  <text x="625" y="298" fill="#FFFFFF" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="800" font-size="11.5" class="lbl-txt">ADDRESS:</text>
  <rect x="740" y="271" width="135" height="44" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" class="val-box" />
  <text x="750" y="298" fill="#111111" font-family="Arial, 'Roboto Condensed', 'Oswald', sans-serif" font-weight="bold" font-size="13" class="val-txt">${escapeHTML(addressVal)}</text>
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
        showToast('Vector graphic copied! Ready to paste (Ctrl+V) directly as vector shapes or smart object in Photoshop, Illustrator, CorelDRAW, or Affinity.');
      } else {
        copyFallback(cleanSvg);
      }
    };

    const btnCopySVG = document.getElementById('btnDirectiveCopySVG');
    const btnQuickCopy = document.getElementById('btnQuickCopyVector');
    if (btnCopySVG) btnCopySVG.addEventListener('click', handleCopyVector);
    if (btnQuickCopy) btnQuickCopy.addEventListener('click', handleCopyVector);

    // DOWNLOAD VECTOR SVG FILE (Direct 1-click fallback for drag & drop into Photoshop/Corel)
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
        showToast(`Downloaded vector SVG: Sign_Depot_Directive_${cur.joNumber}.svg`);
      });
    }

    const btnSave = document.getElementById('btnDirectiveSaveDraft');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const cur = state.requests.find(r => r.joNumber === state.currentDirectiveJo);
        if (cur) {
          cur.installers = document.getElementById('ctrlInstallers').value;
          cur.duration = document.getElementById('ctrlDuration').value;
          cur.releasingMode = document.getElementById('ctrlReleasingMode').value;
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
        renderDirectivePreview(state.currentDirectiveJo);
        showToast('Directive preview reset.');
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
    const artistSelect = document.getElementById('pendingArtistSelect');
    if (artistSelect && artistSelect.children.length === 0) {
      state.artists.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = `Artist: ${a}`;
        artistSelect.appendChild(opt);
      });
      artistSelect.value = state.pendingArtistSelected || state.artists[0];
    }

    const currentArtist = (artistSelect ? artistSelect.value : state.pendingArtistSelected) || state.artists[0];
    state.pendingArtistSelected = currentArtist;

    const pendingList = state.requests.filter(r => r.artist === currentArtist && r.projectStatus !== 'Completed');
    const activeList = pendingList.filter(r => r.designStatus === 'In Progress' || r.projectStatus === 'On-going');
    const overdueList = pendingList.filter(r => isOverdue(r.designDeadline, r.projectStatus));

    document.getElementById('artistStatTotal').textContent = pendingList.length;
    document.getElementById('artistStatActive').textContent = activeList.length;
    document.getElementById('artistStatOverdue').textContent = overdueList.length;

    const tbody = document.getElementById('pendingArtistTableBody');
    if (tbody) {
      if (pendingList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">${currentArtist} currently has no pending projects.</td></tr>`;
      } else {
        tbody.innerHTML = pendingList.map(r => `
          <tr>
            <td><strong style="color:var(--primary-green);">${escapeHTML(r.requestId)}</strong></td>
            <td>${renderEditableCell(r.id, 'projectName', r.projectName)}</td>
            <td>${renderInlineSelect(r.id, 'projectStatus', r.projectStatus, PROJECT_STATUSES)}</td>
            <td>${renderInlineSelect(r.id, 'designStatus', r.designStatus, DESIGN_STATUSES)}</td>
            <td>${renderInlineDate(r.id, 'designDeadline', r.designDeadline)}</td>
            <td style="text-align:center;">${renderInlineNumber(r.id, 'revisionCount', r.revisionCount)}</td>
            <td>${renderEditableCell(r.id, 'remarks', r.remarks)}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
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
    let list = state.requests.filter(r => r.projectStatus !== 'Completed');
    const qFilter = state.pendingSalesFilter;
    const search = state.pendingSalesSearch;

    if (qFilter === 'approval') list = list.filter(r => r.clientApproval === 'Pending');
    if (qFilter === 'files') list = list.filter(r => r.fileSent === 'Pending');
    if (qFilter === 'release') list = list.filter(r => r.projectStatus === 'Approved' || r.designStatus === 'Completed');
    if (qFilter === 'rush') list = list.filter(r => r.priority === 'Rush');

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.projectName.toLowerCase().includes(q) ||
        r.joNumber.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      );
    }

    const tbody = document.getElementById('pendingSalesTableBody');
    if (tbody) {
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:30px; color:var(--text-muted);">No sales queue tasks for the selected filter.</td></tr>`;
      } else {
        tbody.innerHTML = list.map(r => `
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
              <div style="display:flex; gap:4px;">
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.quickSalesApprove('${r.id}')">Approve</button>
                <button class="btn btn-secondary btn-sm" onclick="window.SignDepotApp.openDirectiveForJo('${r.joNumber}')">Directive</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================================================
  // MODULE 8: MONTHLY OUTPUT REPORT ENGINE
  // ==========================================================================

  function renderMonthlyOutputReport() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const matrix = {};

    state.artists.forEach(artist => {
      matrix[artist] = new Array(12).fill(0);
    });

    let ytdTotal = 0;
    let currentMonthTotal = 0;

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
          const assignmentsCount = Math.max((r.countStandard || 0) + (r.countPrinting || 0) + (r.countSpecial || 0), 1);
          matrix[r.artist][mIdx] += assignmentsCount;
          ytdTotal += assignmentsCount;

          if (mIdx === 9) { // October
            currentMonthTotal += assignmentsCount;
          }
        }
      }
    });

    let topArtist = '-';
    let topArtistCount = 0;
    state.artists.forEach(artist => {
      const annualSum = matrix[artist].reduce((a, b) => a + b, 0);
      if (annualSum > topArtistCount) {
        topArtistCount = annualSum;
        topArtist = artist;
      }
    });

    const monthlyAvg = (ytdTotal / 10).toFixed(1);

    document.getElementById('outputYtdTotal').textContent = ytdTotal;
    document.getElementById('outputCurrentMonthTotal').textContent = currentMonthTotal;
    document.getElementById('outputTopArtistName').textContent = topArtist;
    document.getElementById('outputTopArtistCount').textContent = `${topArtistCount} completed assignments`;
    document.getElementById('outputMonthlyAvg').textContent = monthlyAvg;

    const tbody = document.getElementById('monthlyOutputTableBody');
    if (tbody) {
      const rows = state.artists.map(artist => {
        const counts = matrix[artist];
        const annualSum = counts.reduce((a, b) => a + b, 0);
        return { artist, counts, annualSum };
      });

      rows.sort((a, b) => b.annualSum - a.annualSum);

      tbody.innerHTML = rows.map((r, idx) => `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="user-avatar" style="width:26px; height:26px; font-size:10px;">${escapeHTML(r.artist.substring(0, 2).toUpperCase())}</div>
              <strong>${escapeHTML(r.artist)}</strong>
            </div>
          </td>
          ${r.counts.map((c, mIdx) => `<td style="text-align:center; font-weight:${c > 0 ? '800' : '400'}; color:${mIdx === 9 && c > 0 ? '#176B55' : c > 0 ? '#0F172A' : '#94A3B8'};">${c}</td>`).join('')}
          <td style="text-align:center; font-weight:900; background:#EBF7F4; color:var(--primary-green); font-size:14px;">
            ${r.annualSum}
          </td>
          <td style="text-align:center; font-weight:800;">#${idx + 1}</td>
        </tr>
      `).join('');
    }

    renderMonthlyOutputSvgChart(months, matrix);
  }

  function renderMonthlyOutputSvgChart(months, matrix) {
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

    let bars = '';
    monthlyTotals.forEach((total, idx) => {
      const barH = Math.max((total / maxVal) * 140, 4);
      const x = padding + idx * (barWidth + gap);
      const y = 170 - barH;
      const isCurrentMonth = idx === 9;

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" 
            fill="${isCurrentMonth ? '#0F172A' : '#CBD5E1'}" 
            opacity="${total > 0 ? '1' : '0.4'}">
            <title>${months[idx]} 2026: ${total} completed assignments</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="800" fill="#0F172A">${total}</text>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="11" font-weight="${isCurrentMonth ? '800' : '600'}" fill="${isCurrentMonth ? '#0F172A' : '#64748B'}">${months[idx]}</text>
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

    const btnResetAll = document.getElementById('btnSettingsResetDefaults');
    if (btnResetAll) {
      btnResetAll.onclick = () => {
        if (confirm('Reset all mock data to factory defaults?')) {
          localStorage.removeItem(STORAGE_KEY);
          state.artists = [...DEFAULT_ARTISTS];
          state.salesReps = [...DEFAULT_SALES_REPS];
          state.requests = JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
          state.templateElements = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_ELEMENTS));
          state.attachments = [...DEFAULT_ATTACHMENTS];
          saveStateToStorage();
          renderCurrentView(state.activeView);
          showToast('Sample dataset restored to factory defaults.');
        }
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
        window.SignDepotApp.openDirectiveForJo('P260701373');
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
          window.location.href = 'settings.html';
        }
        profDropdown.classList.remove('show');
      };
    }

    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebar = document.getElementById('appSidebar');
    if (collapseBtn && sidebar) {
      collapseBtn.onclick = () => sidebar.classList.toggle('collapsed');
    }

    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn && sidebar) {
      mobileBtn.onclick = () => sidebar.classList.toggle('mobile-open');
    }

    // Timeframe filters
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.timeframe = btn.getAttribute('data-timeframe');
        showToast(`Filtered by: ${btn.textContent}`);
      });
    });
  }

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
    });

    const salesForm = document.getElementById('salesRequestForm');
    if (salesForm) {
      salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('salesFormId').value;
        const reqId = document.getElementById('salesFormReqId').value.trim();
        const jo = document.getElementById('salesFormJo').value.trim();
        const project = document.getElementById('salesFormProject').value.trim();
        const client = document.getElementById('salesFormClient').value.trim();
        const artist = document.getElementById('salesFormArtist').value;
        const salesRep = document.getElementById('salesFormSalesRep').value;
        const deadline = document.getElementById('salesFormDeadline').value;
        const releasingDate = document.getElementById('salesFormReleasingDate').value;
        const fileSent = document.getElementById('salesFormFileSent').value;
        const clientApproval = document.getElementById('salesFormClientApproval').value;
        const priority = document.getElementById('salesFormPriority').value;
        const mode = document.getElementById('salesFormReleasingMode').value;
        const contactPerson = document.getElementById('salesFormContactPerson').value.trim();
        const contactNumber = document.getElementById('salesFormContactNumber').value.trim();
        const address = document.getElementById('salesFormAddress').value.trim();

        if (id) {
          const rec = state.requests.find(r => r.id === id);
          if (rec) {
            rec.requestId = reqId;
            rec.joNumber = jo;
            rec.projectName = project;
            rec.client = client;
            rec.artist = artist;
            rec.salesRep = salesRep;
            rec.designDeadline = deadline;
            rec.releasingDate = releasingDate || deadline;
            rec.fileSent = fileSent;
            rec.clientApproval = clientApproval;
            rec.priority = priority;
            rec.releasingMode = mode;
            rec.contactPerson = contactPerson;
            rec.contactNumber = contactNumber;
            rec.completeAddress = address;
            showToast(`Sales request ${reqId} updated.`);
          }
        } else {
          const newRec = {
            id: `req-${Date.now()}`,
            requestId: reqId,
            joNumber: jo,
            projectName: project,
            client: client,
            artist: artist,
            salesRep: salesRep,
            inCharge: salesRep.toUpperCase(),
            drawnBy: artist.toUpperCase(),
            orderDate: '2026-10-23',
            designDeadline: deadline,
            releasingDate: releasingDate || deadline,
            releasingMode: mode,
            location: 'Manila Branch',
            completeAddress: address || 'Metro Manila',
            contactPerson: contactPerson || '-',
            contactNumber: contactNumber || '-',
            clientApproval: clientApproval,
            priority: priority,
            fileSent: fileSent,
            installers: '2 Installers',
            duration: '1 Day',
            notes: 'New production request.',
            projectStatus: clientApproval === 'Approved' ? 'Approved' : 'Pending',
            designStatus: 'In Progress',
            headApproval: 'Pending',
            countStandard: 1,
            countPrinting: 0,
            countSpecial: 0,
            revisionCount: 0,
            remarks: 'Freshly logged sales request.',
            month: 'October 2026',
            completionDate: null
          };
          state.requests.unshift(newRec);
          showToast(`Sales request ${reqId} created.`);
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
          rec.artist = document.getElementById('trackerFormArtist').value;
          rec.projectName = document.getElementById('trackerFormProject').value.trim();
          rec.designDeadline = document.getElementById('trackerFormDeadline').value;
          rec.headApproval = document.getElementById('trackerFormHeadApproval').value;
          rec.projectStatus = document.getElementById('trackerFormProjectStatus').value;
          rec.designStatus = document.getElementById('trackerFormDesignStatus').value;
          rec.countStandard = parseInt(document.getElementById('trackerFormStd').value, 10) || 0;
          rec.countPrinting = parseInt(document.getElementById('trackerFormPrt').value, 10) || 0;
          rec.countSpecial = parseInt(document.getElementById('trackerFormSpc').value, 10) || 0;
          rec.revisionCount = parseInt(document.getElementById('trackerFormRev').value, 10) || 0;
          rec.remarks = document.getElementById('trackerFormRemarks').value.trim();

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
  // PUBLIC API (Exposed on window.SignDepotApp)
  // ==========================================================================

  window.SignDepotApp = {
    switchView: switchView,
    openCustomDropdown: (btn, ev) => openCustomDropdown(btn, ev),
    closeCustomDropdown: () => closeCustomDropdown(),

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
          rec.designStatus = 'Completed';
          rec.completionDate = '2026-10-23';
          showToast(`Task ${rec.requestId} marked as Completed!`);
        }
        saveStateToStorage();
        renderDashboard();
      }
    },

    openDirectiveForJo: (jo) => {
      state.currentDirectiveJo = jo;
      saveStateToStorage();
      if (document.getElementById('view-directives-details')) {
        switchView('view-directives-details');
        renderDirectivePreview(jo);
      } else {
        window.location.href = 'directives-details.html?jo=' + encodeURIComponent(jo);
      }
    },
    selectAutocompleteJo: (jo) => {
      const box = document.getElementById('directiveAutocompleteBox');
      if (box) box.classList.remove('show');
      renderDirectivePreview(jo);
      showToast(`Loaded directive for ${jo}.`);
    },

    setSalesPage: (p) => {
      state.salesFilter.page = p;
      renderSalesRequests();
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
      document.getElementById('attachmentModalImg').src = att.url;
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
      state.salesReps = state.salesReps.filter(s => s !== rep);
      saveStateToStorage();
      renderSettings();
      showToast(`Removed sales rep ${rep}.`);
    }
  };

  // ==========================================================================
  // EVENT LISTENERS INITIALIZATION
  // ==========================================================================

  function initEventListeners() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        const viewId = item.getAttribute('data-view');

        if (href && href !== '#' && !href.startsWith('javascript:')) {
          const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
          const targetFile = href.toLowerCase();
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
        const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (currentFile !== 'index.html') {
          return; // Allow native navigation to index.html
        }
        e.preventDefault();
        switchView('view-dashboard');
      });
    }

    const btnNewReqDash = document.getElementById('btnDashboardNewRequest');
    if (btnNewReqDash) {
      btnNewReqDash.addEventListener('click', () => {
        document.getElementById('salesFormId').value = '';
        document.getElementById('salesRequestForm').reset();
        document.getElementById('salesModalTitle').textContent = 'New Sales Request';
        document.getElementById('salesModal').classList.add('show');
      });
    }

    const btnPanzeAdd = document.getElementById('btnPanzeAddTask');
    if (btnPanzeAdd) {
      btnPanzeAdd.addEventListener('click', () => {
        document.getElementById('salesFormId').value = '';
        document.getElementById('salesRequestForm').reset();
        document.getElementById('salesModalTitle').textContent = 'New Task Order';
        document.getElementById('salesModal').classList.add('show');
      });
    }

    const btnSalesNewReq = document.getElementById('btnSalesNewRequest');
    if (btnSalesNewReq) {
      btnSalesNewReq.addEventListener('click', () => {
        document.getElementById('salesFormId').value = '';
        document.getElementById('salesRequestForm').reset();
        document.getElementById('salesModalTitle').textContent = 'New Sales Request';
        document.getElementById('salesModal').classList.add('show');
      });
    }

    const salesSearch = document.getElementById('salesSearchInput');
    if (salesSearch) {
      salesSearch.addEventListener('input', () => {
        state.salesFilter.search = salesSearch.value.trim();
        state.salesFilter.page = 1;
        renderSalesRequests();
      });
    }

    ['salesFilterPriority', 'salesFilterApproval', 'salesFilterFileSent', 'salesFilterSalesRep'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          if (id === 'salesFilterPriority') state.salesFilter.priority = el.value;
          if (id === 'salesFilterApproval') state.salesFilter.approval = el.value;
          if (id === 'salesFilterFileSent') state.salesFilter.fileSent = el.value;
          if (id === 'salesFilterSalesRep') state.salesFilter.salesRep = el.value;
          state.salesFilter.page = 1;
          renderSalesRequests();
        });
      }
    });

    const btnResetSales = document.getElementById('btnResetSalesFilters');
    if (btnResetSales) {
      btnResetSales.addEventListener('click', () => {
        state.salesFilter = { search: '', priority: '', approval: '', fileSent: '', salesRep: '', sortField: 'orderDate', sortDir: 'desc', page: 1, perPage: 8 };
        if (salesSearch) salesSearch.value = '';
        ['salesFilterPriority', 'salesFilterApproval', 'salesFilterFileSent', 'salesFilterSalesRep'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        renderSalesRequests();
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
        const first = state.requests[0];
        document.getElementById('trackerFormId').value = first.id;
        document.getElementById('trackerFormReqId').value = first.requestId;
        document.getElementById('trackerFormProject').value = first.projectName;
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

    const btnResetTracker = document.getElementById('btnResetTrackerFilters');
    if (btnResetTracker) {
      btnResetTracker.addEventListener('click', () => {
        state.trackerFilter = { search: '', projectStatus: '', designStatus: '', artist: '', overdue: '', sortField: 'designDeadline', sortDir: 'asc', page: 1, perPage: 10 };
        if (trackerSearch) trackerSearch.value = '';
        ['trackerFilterProjectStatus', 'trackerFilterDesignStatus', 'trackerFilterArtist', 'trackerFilterOverdue'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        renderCreativesTracker();
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
        renderDirectivePreview('P260701373');
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
        renderPendingSalesQueue();
      });
    }
  }

  function exportTrackerCsv() {
    const headers = ['Request ID', 'Artist', 'Project Name', 'Design Deadline', 'Head Approval', 'Standard', 'Printing', 'Special', 'Project Status', 'Design Status', 'Revisions', 'Remarks', 'Date', 'Sales', 'Month'];
    const rows = state.requests.map(r => [
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
    downloadCsv(csvContent, `Sign_Depot_Creatives_Tracker_${Date.now()}.csv`);
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
    loadStateFromStorage();
    initEventListeners();
    setupDirectiveControlsSync();
    setupDirectiveAutocomplete();
    setupDirectiveActions();
    setupGlobalSearch();
    setupModals();

    initCustomDropdownEngine();
    upgradeAllFilterSelects();
    initCustomTooltipEngine();

    const urlParams = new URLSearchParams(window.location.search);
    const joParam = urlParams.get('jo');
    if (joParam) {
      state.currentDirectiveJo = joParam;
    }

    const currentView = detectCurrentPage();
    switchView(currentView);

    if (currentView === 'view-directives-details') {
      renderDirectivePreview(state.currentDirectiveJo || 'P260701373');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
