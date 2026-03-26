<template>
  <div class="container mt-4">

    <h3 class="mb-4">Admin Panel - Requests</h3>

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Date</th>
          <th>Part No</th>
          <th>Customer</th>
          <th>Test Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(req, index) in requests" :key="index">
          <td>{{ req.date }}</td>
          <td>{{ req.partNo }}</td>
          <td>{{ req.customer }}</td>
          <td>{{ req.testType }}</td>

          <td>
            <span :class="{
              'text-warning': req.status === 'Pending',
              'text-success': req.status === 'Approved',
              'text-danger': req.status === 'Rejected'
            }">
              {{ req.status }}
            </span>
          </td>

          <td>
            <button class="btn btn-info btn-sm me-1" @click="viewRequest(req)">View</button>
            <button class="btn btn-warning btn-sm me-1" @click="editRequest(req, index)">Edit</button>
            <button class="btn btn-success btn-sm me-1" @click="updateStatus(index, 'Approved')">✔</button>
            <button class="btn btn-danger btn-sm me-1" @click="updateStatus(index, 'Rejected')">✖</button>
            <button class="btn btn-dark btn-sm" @click="deleteRequest(index)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- VIEW MODAL -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box">
        <h4>Request Details</h4>

        <p><b>Date:</b> {{ selectedRequest.date }}</p>
        <p><b>Part No:</b> {{ selectedRequest.partNo }}</p>
        <p><b>Description:</b> {{ selectedRequest.description }}</p>
        <p><b>Platform:</b> {{ selectedRequest.platformCode }}</p>
        <p><b>Product Code:</b> {{ selectedRequest.productCode }}</p>
        <p><b>Customer:</b> {{ selectedRequest.customer }}</p>
        <p><b>Samples:</b> {{ selectedRequest.samples }}</p>
        <p><b>Test Type:</b> {{ selectedRequest.testType }}</p>
        <p><b>Category:</b> {{ selectedRequest.category }}</p>
        <p><b>Details:</b> {{ selectedRequest.testDetails }}</p>
        <p><b>Special:</b> {{ selectedRequest.special }}</p>
        <p><b>Criteria:</b> {{ selectedRequest.criteria }}</p>
        <p><b>Spec:</b> {{ selectedRequest.spec }}</p>
        <p><b>Test Name:</b> {{ selectedRequest.testName }}</p>

        <button class="btn btn-secondary mt-2" @click="selectedRequest = null">Close</button>
      </div>
    </div>

    <!-- FULL EDIT MODAL -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box">

        <h4>Edit Full Request</h4>

        <input type="date" class="form-control mb-2" v-model="editData.date" />
        <input class="form-control mb-2" v-model="editData.partNo" placeholder="Part No" />
        <textarea class="form-control mb-2" v-model="editData.description" placeholder="Description"></textarea>
        <input class="form-control mb-2" v-model="editData.platformCode" placeholder="Platform Code" />
        <input class="form-control mb-2" v-model="editData.productCode" placeholder="Product Code" />
        <input class="form-control mb-2" v-model="editData.customer" placeholder="Customer" />
        <input type="number" class="form-control mb-2" v-model="editData.samples" placeholder="Samples" />

        <select class="form-control mb-2" v-model="editData.testType">
          <option>Design Verification/Validation</option>
          <option>Production Validation</option>
          <option>Special FE</option>
          <option>Development Related To Customer</option>
          <option>Warranty Analysis</option>
          <option>Field Failure Simulation</option>
        </select>

        <select class="form-control mb-2" v-model="editData.category">
          <option>Endurance</option>
          <option>Environment</option>
        </select>

        <textarea class="form-control mb-2" v-model="editData.testDetails" placeholder="Test Details"></textarea>
        <textarea class="form-control mb-2" v-model="editData.special" placeholder="Special Features"></textarea>
        <textarea class="form-control mb-2" v-model="editData.criteria" placeholder="Acceptance Criteria"></textarea>

        <input class="form-control mb-2" v-model="editData.spec" placeholder="Specification" />
        <input class="form-control mb-2" v-model="editData.testName" placeholder="Test Name" />

        <div class="text-end">
          <button class="btn btn-success me-2" @click="saveEdit">Save</button>
          <button class="btn btn-secondary" @click="editData = null">Cancel</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "AdminView",

  data() {
    return {
      requests: [],
      selectedRequest: null,
      editData: null,
      editIndex: null
    };
  },

  mounted() {
    this.loadRequests();
  },

  methods: {
    loadRequests() {
      this.requests = JSON.parse(localStorage.getItem("requests")) || [];
      this.requests.forEach(r => {
        if (!r.status) r.status = "Pending";
      });
    },

    viewRequest(req) {
      this.selectedRequest = req;
    },

    editRequest(req, index) {
      this.editData = { ...req };
      this.editIndex = index;
    },

    saveEdit() {
      this.requests[this.editIndex] = this.editData;
      localStorage.setItem("requests", JSON.stringify(this.requests));
      alert("Updated Successfully ✅");
      this.editData = null;
    },

    updateStatus(index, status) {
      this.requests[index].status = status;
      localStorage.setItem("requests", JSON.stringify(this.requests));
    },

    deleteRequest(index) {
      if (confirm("Delete this request?")) {
        this.requests.splice(index, 1);
        localStorage.setItem("requests", JSON.stringify(this.requests));
      }
    }
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: white;
  padding: 20px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 10px;
}
</style>