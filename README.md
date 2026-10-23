# Sign Depot — Sales & Creative Production Tracker
### Frontend Enterprise Prototype (Vanilla HTML5, CSS3 & JavaScript)

An enterprise-grade, frosted white glassmorphism web application built specifically for **Sign Depot Creative Operations**, replicating real-world Google Sheets workflows, live sales request tracking, artist workload capacity, monthly production counting, and pixel-perfect printable job order directives.

---

## 🚀 How to Run the Frontend Locally

This application is built with **zero external dependencies, zero build steps, and no backend or web server required**.

1. Navigate to the project directory:
   ```
   d:\DOROTHY\PMS\PMS\
   ```
2. Double-click **`index.html`** or right-click and choose **"Open with"** -> **Google Chrome** (or Edge, Safari, Firefox).
3. The application will immediately run in your browser via `file:///` protocol.

---

## 📁 Project Structure (Multi-Page Architecture)

```
d:\DOROTHY\PMS\PMS\
│
├── index.html                   # Project Dashboard (Main Overview & Live Editable Queue)
├── sales-requests.html          # Sales Requests (Live Editable Grid, Filters & New Orders)
├── creatives-tracker.html       # Creatives Production Tracker (Stages, Proof Links & Revisions)
├── artist-workload.html         # Artist Workload & Capacity Balancing (KPIs, Charts & Roster)
├── directives-details.html      # Job Directive & Spec Sheet (Printable / Exportable Routing Sheet)
├── pending-artist.html          # Pending Projects — Artist Queue
├── pending-sales.html           # Pending Projects — Sales Queue
├── monthly-output.html          # Monthly Production Output Report (YTD & 12-Month Matrix)
├── settings.html                # System Settings (Artist/Sales Rosters & Data Backup)
├── style.css                    # Unified clean minimalist styling, shadows & print stylesheet
├── script.js                    # Unified reactive engine, cross-page state sync & routing
├── assets/
│   └── sign-depot-logo.png      # Official Sign Depot company logo (unaltered)
└── README.md                    # Project documentation & run guide
```

---

## 🌟 Modules & Key Features

### 1. Operations Dashboard
- **Dynamic KPI Metrics**:
  - Total Requests
  - Pending Approval
  - Working / On-Going
  - Completed
  - Revising
  - Overdue (computed against today's date)
- **Recent Projects & Directives table** with one-click direct access to printable job orders.
- **Artist Capacity Overview** with visual capacity threshold indicators (Available, Moderate, Near Capacity, Full).
- **Top Monthly Producers leaderboard** and **2026 Production Output mini-chart**.

### 2. Sales Requests
- Order management with fields: Request ID, JO Number, Project Name, Client, Artist, Design Deadline, Releasing Date, File Sent, Complete Address, Location, Releasing Mode, Contact Person, Contact Number, Client Approval, Priority Level, Sales Representative, and Order Date.
- **Manual JO Number Entry**: JO Numbers are strictly manually assigned or selected from existing records (never automatically generated).
- Real-time search, multi-field filtering (Priority, Approval, File Sent, Sales Rep), table header sorting, and pagination.
- Modal forms for creating new requests, editing records, and duplicating existing jobs.

### 3. Creatives Tracker
- Complete Google Sheets replica interface.
- Standard, Printing, and Special assignment classification counters.
- Project status & Design status tracking.
- Automated overdue deadline detection.
- Export to CSV functionality.

### 4. Artist Workload & Capacity Management
- Tracks artist assignments across:
  - Bob, Edrian, Glen, Goodrich, Jules, Raven, Rodel, Tim, Seven
- Workload thresholds:
  - 🟢 **Available** (0-3 active tasks)
  - 🔵 **Moderate** (4-7 active tasks)
  - 🟡 **Near Capacity** (8-9 active tasks)
  - 🔴 **Full** (10+ active tasks)
- Searchable assignment table filterable by artist.

### 5. Directives Details (The Core Feature)
- **Pixel-perfect reproduction** of the official Sign Depot Directive layout:
  - Dark charcoal header cells with crisp white uppercase labels
  - Bold red Request ID and JO Number
  - Large centered Project Name and Client Name
  - In-Charge and Drawn-By sub-table
  - Three side-by-side Sign Depot logos
  - Releasing mode, order date, releasing date, contact numbers, and delivery address
- **Job Lookup Panel**:
  - Live autocomplete search by J.O. Number, Project Name, or Request ID.
  - One-click presets (e.g. `P260701373 - URAL`).
- **Interactive Controls & 2-Way Live Sync**:
  - Number of Installers, Installation Duration, Releasing Mode, and In-Charge/Drawn By fields update the printable preview in real-time.
- **Action Toolbar**:
  - **Save Draft**: Persists modifications to `localStorage`.
  - **Copy Directive**: Copies rich formatted HTML table directly to clipboard.
  - **Copy Plain Text**: Copies structured text summary to clipboard.
  - **Print / Export PDF**: Built-in `@media print` stylesheet isolating the clean white document for paper or PDF export.
  - **Reset**: Restores original values.
- **Visual Template Editor**:
  - Interactive canvas supporting element repositioning via dragging (pointer events) and resizing via corner handles.
  - Custom element properties (font size, label, text content, alignment).
- **Attachments Panel**:
  - Preview local mock proofs and upload any local image with instant client-side preview via `FileReader`.

### 6. Pending Projects — Artist & Sales Queues
- Dedicated queues for creative artists and sales representatives to manage pending approvals, files to follow, and rush items.

### 7. Monthly Production Output
- **Mandatory Counting Rule**: Accurately counts completed artist assignments (not unique project names). Multiple assignments per project are counted individually by month of completion.
- Full 12-Month Matrix (January through December 2026) with annual totals and rankings.
- Interactive SVG Bar Chart showing monthly completed output with hover tooltips.

### 8. System Settings & Local Persistence
- Manage Artist and Sales Representative rosters.
- Backup application data via **Export Data JSON** and restore via **Import Data JSON**.
- One-click **Reset to Factory Defaults** button.

---

## 🎨 Enterprise Design System

- **Background**: `#F6F8FA`
- **Frosted Surfaces**: `rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(12px)`
- **Primary Green**: `#176B55` (Sign Depot Forest Green)
- **Dark Green**: `#104B3D`
- **Accent Red**: `#E53935` (Sign Depot Red)
- **Typography**: Clean modern system font stack (`-apple-system`, `Segoe UI`, `Roboto`)
- **Icons**: Clean inline SVGs ensuring 100% offline reliability.
