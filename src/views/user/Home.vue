<template>
  <div class="container-fluid mt-4">

    <h2 class="title mb-3">📋 User Dashboard</h2>

    <!-- Refresh -->
    <div class="text-end mb-3">
      <button class="btn btn-primary btn-sm" @click="loadRequests">
        🔄 Refresh
      </button>
    </div>

    <!-- TABLE -->
    <div class="card shadow">
      <div class="card-body table-responsive">

        <table class="table table-hover align-middle text-center custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Part No</th>
              <th>Customer</th>
              <th>Test Type</th>
              <th>PL No</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="req in requests" :key="req.id">

              <td>{{ formatDate(req.date) }}</td>

              <td class="fw-bold text-primary">
                {{ req.partNo }}
              </td>

              <td>{{ req.customer }}</td>

              <td>
                <span class="badge bg-info">
                  {{ req.testType }}
                </span>
              </td>

              <td>
                <span v-if="req.allocationPlNo" class="badge bg-primary">
                  {{ req.allocationPlNo }}
                </span>
                <span v-else>-</span>
              </td>

              <td>
                <span :class="statusClass(req.status)">
                  {{ req.status }}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-dark"
                        @click="viewDetails(req)">
                  🔍 View
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <!-- ================= MODAL ================= -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box">

        <h4 class="mb-3 text-primary">📄 Full Request Details</h4>

        <div class="details-grid">

          <p><b>Date:</b> {{ selectedRequest.date }}</p>
          <p><b>Part No:</b> {{ selectedRequest.partNo }}</p>
          <p><b>Description:</b> {{ selectedRequest.description }}</p>
          <p><b>Platform Code:</b> {{ selectedRequest.platformCode }}</p>
          <p><b>Product Code:</b> {{ selectedRequest.productCode }}</p>
          <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
          <p><b>Samples:</b> {{ selectedRequest.samples }}</p>
          <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
          <p><b>Category:</b> {{ selectedRequest.category }}</p>
          <p><b>Test Details:</b> {{ selectedRequest.testDetails }}</p>
          <p><b>Special:</b> {{ selectedRequest.special }}</p>
          <p><b>Criteria:</b> {{ selectedRequest.criteria }}</p>
          <p><b>Spec:</b> {{ selectedRequest.spec }}</p>
          <p><b>Test Name:</b> {{ selectedRequest.testName }}</p>

          <!-- FILE -->
          <p>
            <b>Attachment:</b>
            <a v-if="selectedRequest.filePath"
              :href="fileUrl(selectedRequest.filePath)"
              target="_blank"
              class="btn btn-sm btn-outline-primary">
              View File
            </a>
            <span v-else>No File</span>
          </p>

          <!-- PL NO -->
          <p>
            <b>PL No:</b>
            <span class="badge bg-primary">
              {{ selectedRequest.allocationPlNo || "-" }}
            </span>
          </p>

          <!-- STATUS -->
          <p>
            <b>Status:</b>
            <span :class="statusClass(selectedRequest.status)">
              {{ selectedRequest.status }}
            </span>
          </p>

        </div>

        <div class="text-end mt-3">
          <button class="btn btn-secondary"
                  @click="selectedRequest = null">
            Close
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      requests: [],
      selectedRequest: null
    };
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    async loadRequests() {
      try {
        const res = await axios.get("http://localhost:5000/api/requests");
        this.requests = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    viewDetails(req) {
      this.selectedRequest = req;
    },

    fileUrl(name) {
      return `http://localhost:5000/uploads/${name}`;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    statusClass(status) {
      return {
        badge: true,
        "bg-warning text-dark": status === "Pending",
        "bg-success": status === "Approved",
        "bg-danger": status === "Rejected"
      };
    }
  }
};
</script>

<style>
.title {
  font-weight: bold;
  color: #2c3e50;
}

/* TABLE */
.custom-table th {
  background: #2c3e50;
  color: white;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: white;
  padding: 20px;
  width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 10px;
}

/* GRID */
.details-grid p {
  margin: 5px 0;
  font-size: 14px;
}
</style>