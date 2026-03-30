<template>
  <div class="container mt-4">

    <h2 class="title">🖨 Print Requests</h2>

    <!-- PRINT ALL -->
    <div class="mb-3 text-end">
      <button class="btn btn-dark" @click="printAll">
        🖨 Print All
      </button>
    </div>

    <!-- TABLE -->
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
            <th>Status</th>
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
              <span :class="['badge-status', statusClass(req.status)]">
                {{ req.status }}
              </span>
            </td>

            <!-- PRINT BUTTON -->
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
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    statusClass(status) {
      if (!status) return "pending";
      const s = status.toLowerCase();
      if (s === "approved") return "approved";
      if (s === "rejected") return "rejected";
      if (s === "completed") return "completed";
      return "pending";
    },

    // 🖨 PRINT SINGLE
    printSingle(req) {
      const content = `
        <html>
        <head>
          <title>Print Request</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #000; padding: 8px; }
          </style>
        </head>
        <body>

          <h2>Request Details</h2>

          <table>
            <tr><th>Request No</th><td>${req.requestNo}</td></tr>
            <tr><th>Date</th><td>${req.date}</td></tr>
            <tr><th>Part No</th><td>${req.partNo}</td></tr>
            <tr><th>Customer</th><td>${req.customer}</td></tr>
            <tr><th>Test Type</th><td>${req.testType}</td></tr>
            <tr><th>PL No</th><td>${req.allocationPlNo || "-"}</td></tr>
            <tr><th>Status</th><td>${req.status}</td></tr>

            <tr><th>Description</th><td>${req.description || ""}</td></tr>
            <tr><th>Platform Code</th><td>${req.platformCode || ""}</td></tr>
            <tr><th>Product Code</th><td>${req.productCode || ""}</td></tr>
            <tr><th>Samples</th><td>${req.samples || ""}</td></tr>
            <tr><th>Category</th><td>${req.category || ""}</td></tr>
            <tr><th>Test Details</th><td>${req.testDetails || ""}</td></tr>
            <tr><th>Special</th><td>${req.special || ""}</td></tr>
            <tr><th>Criteria</th><td>${req.criteria || ""}</td></tr>
            <tr><th>Specification</th><td>${req.spec || ""}</td></tr>
            <tr><th>Test Name</th><td>${req.testName || ""}</td></tr>

          </table>

        </body>
        </html>
      `;

      const win = window.open("", "", "width=800,height=600");
      win.document.write(content);
      win.document.close();
      win.print();
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

.badge-status {
  padding: 5px 10px;
  border-radius: 15px;
  color: white;
  font-size: 12px;
}

.pending { background: #f1c40f; color: black; }
.approved { background: #2ecc71; }
.rejected { background: #e74c3c; }
.completed { background: #3498db; }

/* PRINT STYLE */
@media print {

  body * {
    visibility: hidden;
  }

  #printArea, #printArea * {
    visibility: visible;
  }

  #printArea {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

}
</style>