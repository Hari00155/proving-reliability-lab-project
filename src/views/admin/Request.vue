<template>
  <div class="container mt-4">

    <h2 class="title">🛠 Admin Panel - Requests</h2>

    <!-- SEARCH -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input v-model="searchText" class="form-control"
          placeholder="Search (Req No / PL No / Part / Customer / User / Dept)" />
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

      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="loadRequests">
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Req No</th>
            <th>PL No</th>
            <th>Date</th>
            <th>User</th>
            <th>Dept</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in filteredRequests" :key="req.id">

            <td>{{ req.requestNo }}</td>

            <!-- ✅ PL NO -->
            <td>
              <span v-if="req.status === 'Approved' || req.status === 'Completed'">
                {{ req.allocationPlNo }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>

            <td>{{ req.date }}</td>
            <td>{{ req.userName }}</td>
            <td>{{ req.deptId }}</td>
            <td>{{ req.partNo }}</td>
            <td>{{ req.customer }}</td>

            <!-- STATUS -->
            <td>
              <span :class="['badge-status', statusClass(req.status)]">
                {{ req.status }}
              </span>
            </td>

            <td>
              <button class="btn btn-info btn-sm" @click="viewRequest(req)">View</button>
              <button class="btn btn-warning btn-sm" @click="editRequest(req)">Edit</button>
              <button class="btn btn-success btn-sm" @click="updateStatus(req.id,'Approved')">✔</button>
              <button class="btn btn-danger btn-sm" @click="updateStatus(req.id,'Rejected')">✖</button>
              <button class="btn btn-dark btn-sm" @click="deleteRequest(req.id)">🗑</button>
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
          <p><b>Request No:</b> {{ selectedRequest.requestNo }}</p>

          <p v-if="selectedRequest.status === 'Approved' || selectedRequest.status === 'Completed'">
            <b>PL No:</b> {{ selectedRequest.allocationPlNo }}
          </p>

          <p><b>Description:</b> {{ selectedRequest.description }}</p>
          <p><b>Platform Code:</b> {{ selectedRequest.platformCode }}</p>
          <p><b>Product Code:</b> {{ selectedRequest.productCode }}</p>
          <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
          <p><b>No of Samples:</b> {{ selectedRequest.samples }}</p>
          <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
          <p><b>Test Category:</b> {{ selectedRequest.category }}</p>
          <p><b>Test Details:</b> {{ selectedRequest.testDetails }}</p>
          <p><b>Special Features:</b> {{ selectedRequest.special }}</p>
          <p><b>Acceptance Criteria:</b> {{ selectedRequest.criteria }}</p>
          <p><b>Specification:</b> {{ selectedRequest.spec }}</p>
          <p><b>Test Name:</b> {{ selectedRequest.testName }}</p>

          <!-- ✅ ATTACHMENT -->
          <p>
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

        <button class="btn btn-secondary mt-2" @click="selectedRequest=null">
          Close
        </button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box">

        <h4>✏ Edit Request</h4>

        <div class="grid">

          <div>
            <label>Request No</label>
            <input class="form-control" v-model="editData.requestNo" readonly />
          </div>

          <div>
            <label>PL No</label>
            <input class="form-control"
              v-model="editData.allocationPlNo"
              :readonly="editData.status !== 'Approved' && editData.status !== 'Completed'" />
          </div>

          <div>
            <label>User</label>
            <input class="form-control" v-model="editData.userName" readonly />
          </div>

          <div>
            <label>Dept</label>
            <input class="form-control" v-model="editData.deptId" readonly />
          </div>

          <div>
            <label>Date</label>
            <input type="date" class="form-control" v-model="editData.date" />
          </div>

          <div>
            <label>Part No</label>
            <input class="form-control" v-model="editData.partNo" />
          </div>

          <div>
            <label>Customer</label>
            <input class="form-control" v-model="editData.customer" />
          </div>

          <div>
            <label>Platform Code</label>
            <input class="form-control" v-model="editData.platformCode" />
          </div>

          <div>
            <label>Product Code</label>
            <input class="form-control" v-model="editData.productCode" />
          </div>

          <div>
            <label>No of Samples</label>
            <input type="number" class="form-control" v-model="editData.samples" />
          </div>

          <div>
            <label>Test Type</label>
            <input class="form-control" v-model="editData.testType" />
          </div>

          <div>
            <label>Test Category</label>
            <input class="form-control" v-model="editData.category" />
          </div>

          <div>
            <label>Specification</label>
            <input class="form-control" v-model="editData.spec" />
          </div>

          <div>
            <label>Test Name</label>
            <input class="form-control" v-model="editData.testName" />
          </div>

          <div class="col-12">
            <label>Description</label>
            <textarea class="form-control" v-model="editData.description"></textarea>
          </div>

          <div class="col-12">
            <label>Upload File</label>
            <input type="file" class="form-control" @change="handleFile" />
          </div>

          <!-- ✅ CURRENT FILE -->
          <div class="col-12" v-if="editData.filePath">
            <label>Current File</label><br>

            <a 
              :href="'http://localhost:5000/uploads/' + editData.filePath"
              target="_blank"
              class="btn btn-sm btn-info me-2"
            >
              View
            </a>

            <a 
              :href="'http://localhost:5000/uploads/' + editData.filePath"
              download
              class="btn btn-sm btn-success"
            >
              Download
            </a>
          </div>

        </div>

        <div class="text-end mt-3">
          <button class="btn btn-success me-2" @click="saveEdit">Save</button>
          <button class="btn btn-secondary" @click="editData=null">Cancel</button>
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
      selectedRequest: null,
      editData: null,
      file: null,
      searchText: "",
      searchStatus: ""
    };
  },

  computed: {
    filteredRequests() {
      return this.requests.filter(req => {
        const text = this.searchText.toLowerCase();

        return (
          (req.requestNo || "").toLowerCase().includes(text) ||
          (req.allocationPlNo || "").toLowerCase().includes(text) ||
          (req.partNo || "").toLowerCase().includes(text) ||
          (req.customer || "").toLowerCase().includes(text) ||
          (req.userName || "").toLowerCase().includes(text) ||
          (req.deptId || "").toLowerCase().includes(text)
        ) &&
        (this.searchStatus === "" || req.status === this.searchStatus);
      });
    }
  },

  mounted() {
    this.loadRequests();
  },

  methods: {
    statusClass(status) {
      if (!status) return "pending";
      const s = status.toLowerCase().trim();
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
    },

    editRequest(req) {
      this.editData = { ...req };
    },

    handleFile(e) {
      this.file = e.target.files[0];
    },

    async saveEdit() {
      const formData = new FormData();

      Object.keys(this.editData).forEach(key => {
        formData.append(key, this.editData[key] || "");
      });

      if (this.file) {
        formData.append("file", this.file);
      }

      await axios.put(
        `http://localhost:5000/api/requests/${this.editData.id}`,
        formData
      );

      alert("Updated ✅");
      this.editData = null;
      this.loadRequests();
    },

    async updateStatus(id, status) {
      await axios.put(`http://localhost:5000/api/requests/${id}`, { status });
      this.loadRequests();
    },

    async deleteRequest(id) {
      if (confirm("Delete?")) {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        this.loadRequests();
      }
    }
  }
};
</script>

<style>
.title { font-weight: bold; }

.custom-table thead {
  background: #2c3e50;
  color: white;
}

.badge-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 12px;
  color: white;
}

.pending { background-color: #f1c40f; color: black; }
.approved { background-color: #2ecc71; }
.rejected { background-color: #e74c3c; }
.completed { background-color: #3498db; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
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
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>