<template>
  <div class="container mt-4">

    <h2 class="title">📊 Request Status</h2>

    <!-- FILTER -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input v-model="searchText" class="form-control"
          placeholder="Search (Part / Customer / Test Type)" />
      </div>

      <div class="col-md-3">
        <select v-model="searchStatus" class="form-control">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Completed</option>
        </select>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>Test Type</th>
            <th>PL No</th>
            <th>Status</th>
            <th>Reason</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in filteredRequests" :key="req.id">

            <td>{{ req.date }}</td>
            <td>{{ req.partNo }}</td>
            <td>{{ req.customer }}</td>
            <td>{{ req.testType }}</td>

            <td>
              <span v-if="req.allocationPlNo">{{ req.allocationPlNo }}</span>
              <span v-else>-</span>
            </td>

            <!-- STATUS COLOR -->
            <td>
              <span :class="['badge-status', statusClass(req.status)]">
                {{ req.status }}
              </span>
            </td>

            <!-- REJECT REASON -->
            <td>
              <span v-if="req.status === 'Rejected'">
                {{ req.rejectReason || '-' }}
              </span>
              <span v-else>-</span>
            </td>

            <td>
              <button class="btn btn-info btn-sm" @click="viewRequest(req)">
                View
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box">

        <h4>📄 Full Details</h4>

        <div class="grid">
          <p><b>Date:</b> {{ selectedRequest.date }}</p>
          <p><b>Part No:</b> {{ selectedRequest.partNo }}</p>
          <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
          <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
          <p><b>PL No:</b> {{ selectedRequest.allocationPlNo }}</p>
          <p><b>Status:</b> {{ selectedRequest.status }}</p>

          <p v-if="selectedRequest.status === 'Rejected'">
            <b>Reject Reason:</b> {{ selectedRequest.rejectReason }}
          </p>

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

          <!-- ATTACHMENT -->
          <p>
            <b>Attachment:</b>
            <span v-if="selectedRequest.filePath">
              <a :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                 target="_blank"
                 class="btn btn-sm btn-info me-2">View</a>

              <a :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                 download
                 class="btn btn-sm btn-success">Download</a>
            </span>
            <span v-else>-</span>
          </p>

        </div>

        <button class="btn btn-secondary mt-2"
          @click="selectedRequest=null">Close</button>

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
      selectedRequest: null,
      searchText: "",
      searchStatus: ""
    };
  },

  computed: {
    filteredRequests() {
      return this.requests.filter(r =>
        (
          (r.partNo || "").toLowerCase().includes(this.searchText.toLowerCase()) ||
          (r.customer || "").toLowerCase().includes(this.searchText.toLowerCase()) ||
          (r.testType || "").toLowerCase().includes(this.searchText.toLowerCase())
        ) &&
        (this.searchStatus === "" || r.status === this.searchStatus)
      );
    }
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    statusClass(status) {
      if (!status) return "pending";
      const s = status.toLowerCase();

      if (s === "approved") return "approved";
      if (s === "rejected") return "rejected";
      if (s === "completed") return "completed";

      return "pending";
    },

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

/* STATUS COLORS */
.badge-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.pending {
  background-color: #f1c40f;
  color: black;
}

.approved {
  background-color: #2ecc71;
}

.rejected {
  background-color: #e74c3c;
}

.completed {
  background-color: #3498db;
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
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>