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
            <th>PL No</th> <!-- ✅ ADDED -->
            <th>User</th>
            <th>Dept</th>
            <th>Part No</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in filteredRequests" :key="req.id">

            <td>{{ req.requestNo }}</td>

            <!-- ✅ PL NUMBER -->
            <td>{{ req.allocationPlNo || '-' }}</td>

            <td>{{ req.userName }}</td>
            <td>{{ req.deptId }}</td>
            <td>{{ req.partNo }}</td>

            <td>
              <span :class="['badge-status', statusClass(req.status)]">
                {{ req.status }}
              </span>

              <!-- ✅ REJECT REASON -->
              <div v-if="req.status==='Rejected'" class="text-danger small">
                {{ req.rejectReason }}
              </div>
            </td>

            <td>
              <button class="btn btn-info btn-sm" @click="viewRequest(req)">View</button>
              <button class="btn btn-warning btn-sm" @click="editRequest(req)">Edit</button>
              <button class="btn btn-success btn-sm" @click="acceptRequest(req)">✔</button>
              <button class="btn btn-primary btn-sm" @click="openAllocation(req)">Allocate</button>
              <button class="btn btn-danger btn-sm" @click="openReject(req)">✖</button>

              <!-- ✅ ONLY SUPER ADMIN -->
              <button v-if="role==='superadmin'" class="btn btn-dark btn-sm"
                @click="deleteRequest(req.id)">🗑</button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= VIEW ================= -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box">
        <h4>📄 Full Details</h4>

        <div class="grid">
          <p><b>Req No:</b> {{ selectedRequest.requestNo }}</p>
          <p><b>PL No:</b> {{ selectedRequest.allocationPlNo || '-' }}</p>

          <p><b>User Name:</b> {{ selectedRequest.userName }}</p>
          <p><b>Department:</b> {{ selectedRequest.deptId }}</p>

          <p><b>Part No:</b> {{ selectedRequest.partNo }}</p>
          <p><b>Description:</b> {{ selectedRequest.description }}</p>

          <p><b>Platform Code:</b> {{ selectedRequest.platformCode }}</p>
          <p><b>Product Code:</b> {{ selectedRequest.productCode }}</p>

          <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
          <p><b>No of Samples:</b> {{ selectedRequest.samples }}</p>

          <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
          <p><b>Category:</b> {{ selectedRequest.category }}</p>

          <p><b>Test Details:</b> {{ selectedRequest.testDetails }}</p>
          <p><b>Special Features:</b> {{ selectedRequest.special }}</p>

          <p><b>Acceptance Criteria:</b> {{ selectedRequest.criteria }}</p>
          <p><b>Specification:</b> {{ selectedRequest.spec }}</p>

          <p><b>Test Name:</b> {{ selectedRequest.testName }}</p>

          <!-- ✅ ALLOCATION DETAILS -->
          <p><b>Responsibility:</b> {{ selectedRequest.responsibility || '-' }}</p>
          <p><b>Equipment No:</b> {{ selectedRequest.testRig || '-' }}</p>
          <p><b>Start Date:</b> {{ selectedRequest.startDate || '-' }}</p>
        </div>

        <button class="btn btn-secondary mt-2" @click="selectedRequest=null">Close</button>
      </div>
    </div>

    <!-- ================= EDIT ================= -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box">
        <h4>✏ Edit Request</h4>

        <div class="grid">

          <div><label>User Name</label><input v-model="editData.userName" class="form-control"/></div>
          <div><label>Department</label><input v-model="editData.deptId" class="form-control"/></div>

          <div><label>Part No</label><input v-model="editData.partNo" class="form-control"/></div>
          <div><label>Description</label><textarea v-model="editData.description" class="form-control"></textarea></div>

          <div><label>Platform Code</label><input v-model="editData.platformCode" class="form-control"/></div>
          <div><label>Product Code</label><input v-model="editData.productCode" class="form-control"/></div>

          <div><label>Customer</label><input v-model="editData.customer" class="form-control"/></div>
          <div><label>No of Samples</label><input type="number" v-model="editData.samples" class="form-control"/></div>

          <div><label>Test Type</label><input v-model="editData.testType" class="form-control"/></div>
          <div><label>Category</label><input v-model="editData.category" class="form-control"/></div>

          <div><label>Test Details</label><textarea v-model="editData.testDetails" class="form-control"></textarea></div>
          <div><label>Special Features</label><textarea v-model="editData.special" class="form-control"></textarea></div>

          <div><label>Acceptance Criteria</label><textarea v-model="editData.criteria" class="form-control"></textarea></div>
          <div><label>Specification</label><input v-model="editData.spec" class="form-control"/></div>

          <div><label>Test Name</label><input v-model="editData.testName" class="form-control"/></div>

        </div>

        <div class="text-end mt-3">
          <button class="btn btn-success" @click="saveEdit">Save</button>
          <button class="btn btn-secondary" @click="editData=null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ================= REJECT ================= -->
    <div v-if="rejectData" class="modal-overlay">
      <div class="modal-box">
        <h4>Reject Reason</h4>
        <textarea v-model="rejectData.rejectReason" class="form-control"></textarea>

        <button class="btn btn-danger mt-2" @click="submitReject">Submit</button>
      </div>
    </div>

    <!-- ================= ALLOCATION ================= -->
    <div v-if="allocationData" class="modal-overlay">
      <div class="modal-box">
        <h4>Allocation</h4>

        <label>Responsibility</label>
        <select v-model="allocationData.responsibility" class="form-control">
          <option>Admin</option>
          <option>Test</option>
        </select>

        <label class="mt-2">Equipment No</label>
        <select v-model="allocationData.testRig" class="form-control">
          <optgroup label="OV">
            <option>OV-12</option><option>OV-13</option><option>OV-14</option>
            <option>OV-15</option><option>OV-16</option>
          </optgroup>
          <optgroup label="ETE">
            <option>ETE-05</option><option>ETE-60</option><option>ETE-68</option>
            <option>ETE-73</option><option>ETE-76</option>
            <option>ETE-21</option><option>ETE-22</option>
            <option>ETE-42</option><option>ETE-30</option>
          </optgroup>
        </select>

        <label class="mt-2">Tentative Start Date</label>
        <input type="date" v-model="allocationData.startDate" class="form-control"/>

        <button class="btn btn-success mt-2" @click="submitAllocation">Submit</button>
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
      rejectData: null,
      allocationData: null,
      searchText: "",
      searchStatus: "",
      role: "admin"
    };
  },

  computed: {
    filteredRequests() {
      return this.requests.filter(r =>
        (r.status === "Pending") &&
        (r.requestNo || "").toLowerCase().includes(this.searchText.toLowerCase())
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
    openReject(r) { this.rejectData = { ...r }; },
    openAllocation(r) { this.allocationData = { ...r }; },

    async saveEdit() {
      await axios.put(`http://localhost:5000/api/requests/${this.editData.id}`, this.editData);
      this.editData = null;
      this.loadRequests();
    },

    async acceptRequest(req) {
      await axios.put(`http://localhost:5000/api/requests/${req.id}`, { status: "Approved" });
      this.loadRequests();
    },

    async submitReject() {
      await axios.put(`http://localhost:5000/api/requests/${this.rejectData.id}`, {
        status: "Rejected",
        rejectReason: this.rejectData.rejectReason
      });
      this.rejectData = null;
      this.loadRequests();
    },

    async submitAllocation() {
      await axios.put(`http://localhost:5000/api/requests/${this.allocationData.id}`, {
        status: "Approved",
        responsibility: this.allocationData.responsibility,
        testRig: this.allocationData.testRig,
        startDate: this.allocationData.startDate
      });

      await axios.post("http://localhost:5000/api/dailyupdates", this.allocationData);

      this.allocationData = null;
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