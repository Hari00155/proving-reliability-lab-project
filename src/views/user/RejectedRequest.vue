<template>
  <div class="container mt-4">

    <h2 class="title">❌ Rejected Requests</h2>

    <!-- TABLE -->
    <div class="table-responsive mt-3">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>Test Type</th>
            <th>PL No</th>
            <th>Status</th>
            <th>View</th>
            <th>Reason</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in rejectedRequests" :key="req.id">

            <td>{{ req.date }}</td>
            <td>{{ req.partNo }}</td>
            <td>{{ req.customer }}</td>
            <td>{{ req.testType }}</td>

            <!-- PL NO -->
            <td>
              <span v-if="req.allocationPlNo">{{ req.allocationPlNo }}</span>
              <span v-else class="text-muted">-</span>
            </td>

            <!-- STATUS -->
            <td>
              <span class="badge-status rejected">
                {{ req.status }}
              </span>
            </td>

            <!-- VIEW BUTTON -->
            <td>
              <button class="btn btn-info btn-sm" @click="viewRequest(req)">
                View
              </button>
            </td>

            <!-- REASON -->
            <td>
              <span class="text-danger">
                {{ req.rejectReason || "No Reason" }}
              </span>
            </td>

          </tr>

          <!-- EMPTY -->
          <tr v-if="rejectedRequests.length === 0">
            <td colspan="8" class="text-center text-muted">
              No Rejected Requests Found
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- ================= VIEW MODAL ================= -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box">

        <h4>📄 Rejected Request Details</h4>

        <div class="grid">
          <p><b>Date:</b> {{ selectedRequest.date }}</p>
          <p><b>Part No:</b> {{ selectedRequest.partNo }}</p>
          <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
          <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
          <p><b>PL No:</b> {{ selectedRequest.allocationPlNo }}</p>
          <p><b>Status:</b> {{ selectedRequest.status }}</p>

          <p><b>Description:</b> {{ selectedRequest.description }}</p>
          <p><b>Platform Code:</b> {{ selectedRequest.platformCode }}</p>
          <p><b>Product Code:</b> {{ selectedRequest.productCode }}</p>
          <p><b>Samples:</b> {{ selectedRequest.samples }}</p>
          <p><b>Category:</b> {{ selectedRequest.category }}</p>
          <p><b>Test Details:</b> {{ selectedRequest.testDetails }}</p>
          <p><b>Special:</b> {{ selectedRequest.special }}</p>
          <p><b>Criteria:</b> {{ selectedRequest.criteria }}</p>
          <p><b>Specification:</b> {{ selectedRequest.spec }}</p>
          <p><b>Test Name:</b> {{ selectedRequest.testName }}</p>

          <!-- REASON -->
          <p class="col-12">
            <b>Reject Reason:</b>
            <span class="text-danger">
              {{ selectedRequest.rejectReason }}
            </span>
          </p>

          <!-- ATTACHMENT -->
          <p class="col-12">
            <b>Attachment:</b>

            <span v-if="selectedRequest.filePath">
              <a
                :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                target="_blank"
                class="btn btn-sm btn-info me-2"
              >
                View
              </a>

              <a
                :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                download
                class="btn btn-sm btn-success"
              >
                Download
              </a>
            </span>

            <span v-else>-</span>
          </p>

        </div>

        <button class="btn btn-secondary mt-3" @click="selectedRequest=null">
          Close
        </button>

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

  computed: {
    rejectedRequests() {
      return this.requests.filter(r => r.status === "Rejected");
    }
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    async loadRequests() {
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    viewRequest(req) {
      this.selectedRequest = req;
    }

  }
};
</script>

<style>
.title {
  font-weight: bold;
}

/* TABLE */
.custom-table thead {
  background: #2c3e50;
  color: white;
}

/* STATUS */
.badge-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

.rejected {
  background-color: #e74c3c;
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
  width: 800px;
  border-radius: 10px;
  max-height: 90vh;
  overflow-y: auto;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>