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
        <button class="btn btn-primary w-100" @click="loadRequests">🔄 Refresh</button>
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

            <td>
              <span v-if="req.allocationPlNo">{{ req.allocationPlNo }}</span>
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

              <!-- 🔥 REJECT REASON -->
              <div v-if="req.status === 'Rejected'" class="text-danger small">
                {{ req.rejectReason }}
              </div>
            </td>

            <td>
              <button class="btn btn-info btn-sm" @click="viewRequest(req)">View</button>
              <button class="btn btn-warning btn-sm" @click="editRequest(req)">Edit</button>

              <!-- APPROVE -->
              <button class="btn btn-success btn-sm" @click="approveRequest(req)">✔</button>

              <!-- ❌ REJECT (UPDATED) -->
              <button class="btn btn-danger btn-sm" @click="openReject(req)">✖</button>

              <!-- ALLOCATION -->
              <button class="btn btn-primary btn-sm" @click="openAllocation(req)">Allocate</button>

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
          <p><b>PL No:</b> {{ selectedRequest.allocationPlNo }}</p>
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

          <!-- ATTACHMENT -->
          <p>
            <b>Attachment:</b>
            <span v-if="selectedRequest.filePath">
              <a :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                 target="_blank" class="btn btn-sm btn-info me-2">View</a>
              <a :href="'http://localhost:5000/uploads/' + selectedRequest.filePath"
                 download class="btn btn-sm btn-success">Download</a>
            </span>
            <span v-else>-</span>
          </p>
        </div>

        <button class="btn btn-secondary mt-2" @click="selectedRequest=null">Close</button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box">
        <h4>✏ Edit Request</h4>

        <div class="grid">
          <div><label>Part No</label><input class="form-control" v-model="editData.partNo" /></div>
          <div><label>Description</label><textarea class="form-control" v-model="editData.description"></textarea></div>
          <div><label>Platform Code</label><input class="form-control" v-model="editData.platformCode" /></div>
          <div><label>Product Code</label><input class="form-control" v-model="editData.productCode" /></div>
          <div><label>Customer</label><input class="form-control" v-model="editData.customer" /></div>
          <div><label>No of Samples</label><input type="number" class="form-control" v-model="editData.samples" /></div>

          <div><label>Test Type</label><input class="form-control" v-model="editData.testType" /></div>
          <div><label>Category</label><input class="form-control" v-model="editData.category" /></div>
          <div><label>Test Details</label><textarea class="form-control" v-model="editData.testDetails"></textarea></div>
          <div><label>Special</label><textarea class="form-control" v-model="editData.special"></textarea></div>
          <div><label>Criteria</label><textarea class="form-control" v-model="editData.criteria"></textarea></div>
          <div><label>Spec</label><input class="form-control" v-model="editData.spec" /></div>
          <div><label>Test Name</label><input class="form-control" v-model="editData.testName" /></div>

          <div>
            <label>Attachment</label>
            <input type="file" class="form-control" @change="handleFile" />
          </div>

          <div v-if="editData.filePath">
            <label>Current File</label><br>
            <a :href="'http://localhost:5000/uploads/' + editData.filePath"
               target="_blank" class="btn btn-sm btn-info me-2">View</a>
            <a :href="'http://localhost:5000/uploads/' + editData.filePath"
               download class="btn btn-sm btn-success">Download</a>
          </div>
        </div>

        <div class="text-end mt-3">
          <button class="btn btn-success" @click="saveEdit">Save</button>
          <button class="btn btn-secondary" @click="editData=null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ALLOCATION -->
    <div v-if="allocationData" class="modal-overlay">
      <div class="modal-box">
        <h4>🧪 Allocation Panel</h4>

        <p><b>Req No:</b> {{ allocationData.requestNo }}</p>
        <p><b>PL No:</b> {{ allocationData.allocationPlNo }}</p>

        <label>Test Rig</label>
        <select v-model="allocationData.testRig" class="form-control">
          <option>OV-12</option>
          <option>OV-13</option>
          <option>ETE-46</option>
          <option>ETE-60</option>
        </select>

        <label class="mt-2">Start Date</label>
        <input type="date" v-model="allocationData.startDate" class="form-control" />

        <div class="text-end mt-3">
          <button class="btn btn-success" @click="submitAllocation">Submit</button>
          <button class="btn btn-secondary" @click="allocationData=null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ❌ REJECT MODAL -->
    <div v-if="rejectData" class="modal-overlay">
      <div class="modal-box">

        <h4>❌ Reject Request</h4>

        <p><b>Req No:</b> {{ rejectData.requestNo }}</p>

        <textarea v-model="rejectData.rejectReason" class="form-control"></textarea>

        <div class="text-end mt-3">
          <button class="btn btn-danger" @click="submitReject">Submit</button>
          <button class="btn btn-secondary" @click="rejectData=null">Cancel</button>
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
      allocationData: null,
      rejectData: null,
      file: null,
      searchText: "",
      searchStatus: ""
    };
  },

  computed: {
    filteredRequests() {
      return this.requests.filter(r =>
        (r.requestNo || "").toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.searchStatus === "" || r.status === this.searchStatus)
      );
    }
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    statusClass(s) {
      return s?.toLowerCase() || "pending";
    },

    async loadRequests() {
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    viewRequest(r) { this.selectedRequest = r; },
    editRequest(r) { this.editData = { ...r }; },

    handleFile(e) { this.file = e.target.files[0]; },

    async saveEdit() {
      const fd = new FormData();
      Object.keys(this.editData).forEach(k => fd.append(k, this.editData[k] || ""));
      if (this.file) fd.append("file", this.file);

      await axios.put(`http://localhost:5000/api/requests/${this.editData.id}`, fd);
      alert("Updated ✅");
      this.editData = null;
      this.loadRequests();
    },

    async approveRequest(req) {
      await axios.put(`http://localhost:5000/api/requests/${req.id}`, {
        status: "Approved"
      });
      this.loadRequests();
    },

    openReject(req) {
      this.rejectData = { ...req };
    },

    async submitReject() {
      await axios.put(`http://localhost:5000/api/requests/${this.rejectData.id}`, {
        status: "Rejected",
        rejectReason: this.rejectData.rejectReason
      });
      alert("Rejected ❌");
      this.rejectData = null;
      this.loadRequests();
    },

    async deleteRequest(id) {
      if (confirm("Delete?")) {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        this.loadRequests();
      }
    },

    openAllocation(req) {
      this.allocationData = { ...req };
    },

    async submitAllocation() {
      await axios.put(`http://localhost:5000/api/requests/${this.allocationData.id}`, {
        status: "Approved",
        testRig: this.allocationData.testRig,
        startDate: this.allocationData.startDate
      });

      alert("Allocated ✅");
      this.allocationData = null;
      this.loadRequests();
    }

  }
};
</script>

<style>
.badge-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
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
  border-radius: 10px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>