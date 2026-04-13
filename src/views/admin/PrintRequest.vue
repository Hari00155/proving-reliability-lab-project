<template>
  <div class="container mt-4">

    <h2 class="title">🖨 Print Requests</h2>

    <!-- PRINT ALL -->
    <div class="mb-3 text-end">
      <button class="btn btn-dark" @click="printAll">
        🖨 Print All
      </button>
    </div>

    <!-- TABLE — Status column REMOVED -->
    <div class="table-responsive" id="printArea">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Req No</th>
            <th>Date</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>Test Type</th>
            <th>PL No</th>
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req.id">
            <td>{{ req.requestNo }}</td>
            <td>{{ req.date }}</td>
            <td>{{ req.partNo }}</td>
            <td>{{ req.customer }}</td>
            <td>{{ req.testType }}</td>
            <td>
              <span v-if="req.allocationPlNo">{{ req.allocationPlNo }}</span>
              <span v-else>-</span>
            </td>
            <td>
              <button class="btn btn-info btn-sm" @click="printSingle(req)">
                Print
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {

  // ─────────────────────────────────────────────────────────────────────
  //  Pass  role="admin"  when using this component in the admin view.
  //  Pass  role="user"   (or omit) for the user view.
  // ─────────────────────────────────────────────────────────────────────
  props: {
    role: {
      type: String,
      default: "user"   // "user" | "admin"
    }
  },

  data() {
    return {
      requests: []
    };
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    async loadRequests() {
      const endpoint =
        this.role === "admin"
          ? "http://localhost:5000/api/admin/requests"
          : "http://localhost:5000/api/requests";
      const res = await axios.get(endpoint);
      this.requests = res.data;
    },

    // ─────────────────────────────────────────────────────────────────
    // 🖨  PRINT SINGLE — Proving Test Requisition format
    // ─────────────────────────────────────────────────────────────────
    printSingle(req) {

      // ── Logo (local path — update if needed) ──
      const logoSrc = "D:\full-stack-developer\proving-reliability-lab-report-software\images\TVS.jpg";

      // ── Show "ADMIN COPY" label only for admin role ──
      const roleBadge =
        this.role === "admin"
          ? `<div class="role-badge">ADMIN COPY</div>`
          : "";

      const content = `
<!DOCTYPE html>
<html>
<head>
  <title>PTR - ${req.allocationPlNo || req.requestNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      padding: 20px;
      color: #000;
    }

    /* ── Outer border ── */
    .ptr {
      border: 2px solid #000;
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
    }

    /* ── Every horizontal row ── */
    .row {
      display: flex;
      border-bottom: 1px solid #000;
    }
    .row:last-child { border-bottom: none; }

    /* ── Generic cell ── */
    .cell {
      padding: 5px 9px;
      border-right: 1px solid #000;
    }
    .cell:last-child { border-right: none; }

    /* ── Label (bold, fixed width) ── */
    .lbl  { font-weight: bold; flex: 0 0 140px; }
    .lbl2 { font-weight: bold; flex: 0 0 120px; }
    .val  { flex: 1; }

    /* ── Header ── */
    .hdr-logo {
      flex: 0 0 140px;
      border-right: 1px solid #000;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .hdr-logo img {
      max-width: 90px;
      max-height: 65px;
      object-fit: contain;
      margin-bottom: 4px;
    }
    .hdr-logo .lab {
      font-weight: bold;
      font-size: 11px;
      line-height: 1.3;
    }
    .hdr-title {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      border-right: 1px solid #000;
      padding: 10px;
    }
    .hdr-plno {
      flex: 0 0 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      text-align: center;
    }
    .plno-text  { font-weight: bold; font-size: 14px; color: #c0392b; }
    .role-badge { font-size: 10px; color: #555; margin-top: 4px; }

    /* ── Section headings ── */
    .section-hd {
      font-weight: bold;
      text-align: center;
      padding: 5px;
      border-bottom: 1px solid #000;
    }

    /* ── Full-width value row ── */
    .full-val {
      padding: 5px 9px;
      text-align: center;
      border-bottom: 1px solid #000;
    }

    /* ── Multi-line test details ── */
    .details-val {
      flex: 1;
      padding: 5px 9px;
      text-align: center;
      white-space: pre-line;
    }

    /* ── Footer bottom bar ── */
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      padding: 5px 9px;
      font-size: 11px;
      font-weight: bold;
    }

    @media print {
      body { padding: 8px; }
      .ptr { max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="ptr">

  <!-- ══ HEADER ══ -->
  <div class="row">
    <div class="hdr-logo">
      <img src="${logoSrc}" alt="Logo" />
      <div class="lab">Proving &amp; Reliability<br>Lab</div>
    </div>
    <div class="hdr-title">PROVING TEST REQUISITION</div>
    <div class="hdr-plno">
      <div class="plno-text">PLNO &nbsp; ${req.allocationPlNo || "-"}</div>
      ${roleBadge}
    </div>
  </div>

  <!-- FROM / DATE -->
  <div class="row">
    <div class="cell lbl">From :</div>
    <div class="cell val">${req.requestedBy || "others"}</div>
    <div class="cell lbl2">Date :</div>
    <div class="cell val">${req.date || "-"}</div>
  </div>

  <!-- PRODUCT / COMPONENT -->
  <div class="row">
    <div class="cell lbl">Product :</div>
    <div class="cell val">${req.description || req.partNo || "-"}</div>
    <div class="cell lbl2">Component :</div>
    <div class="cell val">${req.category || "-"}</div>
  </div>

  <!-- CUST/APPLN / NO OF SAMPLES -->
  <div class="row">
    <div class="cell lbl">Cust/Appln :</div>
    <div class="cell val">${req.customer || "-"}</div>
    <div class="cell lbl2">No. Of Samples :</div>
    <div class="cell val">${req.samples || "-"}</div>
  </div>

  <!-- TEST TYPE / PART NUMBER -->
  <div class="row">
    <div class="cell lbl">Test Type :</div>
    <div class="cell val">${req.testType || "-"}</div>
    <div class="cell lbl2">Part Number :</div>
    <div class="cell val">${req.partNo || "-"}</div>
  </div>

  <!-- SPECIAL FEATURES -->
  <div class="section-hd">SPECIAL FEATURES :</div>
  <div class="full-val">${req.special || "-"}</div>

  <!-- PURPOSE OF THE TEST -->
  <div class="section-hd">PURPOSE OF THE TEST :</div>
  <div class="full-val">${req.testType || "-"}</div>

  <!-- TEST SPECIFICATION -->
  <div class="section-hd">TEST SPECIFICATION</div>

  <!-- Spec No / Clause -->
  <div class="row">
    <div class="cell lbl">Test Spec No/Clause :</div>
    <div class="cell val">${req.spec || "-"}</div>
  </div>

  <!-- Test Name -->
  <div class="row">
    <div class="cell lbl">Test Name :</div>
    <div class="cell val">${req.testName || "-"}</div>
  </div>

  <!-- Test Details -->
  <div class="row">
    <div class="cell lbl">Test Details :</div>
    <div class="details-val">${(req.testDetails || "-").replace(/\n/g, "<br>")}</div>
  </div>

  <!-- Acceptance Criteria -->
  <div class="row">
    <div class="cell lbl">Acceptance Criteria :</div>
    <div class="details-val">${req.criteria || "-"}</div>
  </div>

  <!-- REQUESTED BY / PROD GROUP -->
  <div class="row">
    <div class="cell lbl">Requested By :</div>
    <div class="cell val">${req.requestedBy || req.customer || "-"}</div>
    <div class="cell lbl2">Prod Group/BU :</div>
    <div class="cell val">${req.productCode || req.platformCode || "-"}</div>
  </div>

  <!-- BOTTOM BAR -->
  <div class="bottom-bar">
    <span>FORM NO: J21 - 01</span>
    <span>RETENTION PERIOD : 3 YEARS</span>
  </div>

</div>
<script>
  window.onload = function() { window.print(); };
<\/script>
</body>
</html>`;

      const win = window.open("", "_blank", "width=860,height=720");
      win.document.write(content);
      win.document.close();
    },

    // 🖨 PRINT ALL
    printAll() {
      window.print();
    }

  }
};
</script>

<style>
.title {
  font-weight: bold;
}

.custom-table thead {
  background: #2c3e50;
  color: white;
}

/* Hide everything except the table when printing the list view */
@media print {
  body * { visibility: hidden; }
  #printArea, #printArea * { visibility: visible; }
  #printArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>