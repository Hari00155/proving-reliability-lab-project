<template>
  <div class="container mt-4">

    <h2 class="title">🛠 Admin Panel - Requests</h2>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>Test Type</th>
            <th>Attachment</th>
            <th>PL No</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in requests" :key="req.id">
            <td>{{ req.date }}</td>
            <td>{{ req.partNo }}</td>
            <td>{{ req.customer }}</td>
            <td>{{ req.testType }}</td>

            <!-- FILE -->
            <td>
              <a v-if="req.filePath"
                :href="fileUrl(req.filePath)"
                target="_blank"
                class="btn btn-sm btn-primary">
                View
              </a>
              <span v-else class="text-muted">No File</span>
            </td>

            <td>{{ req.allocationPlNo || "-" }}</td>

            <!-- STATUS -->
            <td>
              <span :class="statusClass(req.status)">
                {{ req.status }}
              </span>
            </td>

            <!-- ACTIONS -->
            <td>
              <button class="btn btn-info btn-sm me-1" @click="viewRequest(req)">View</button>
              <button class="btn btn-warning btn-sm me-1" @click="editRequest(req)">Edit</button>
              <button class="btn btn-success btn-sm me-1" @click="updateStatus(req.id,'Approved')">✔</button>
              <button class="btn btn-danger btn-sm me-1" @click="updateStatus(req.id,'Rejected')">✖</button>
              <button class="btn btn-dark btn-sm" @click="deleteRequest(req.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="selectedRequest" class="modal-overlay">
      <div class="modal-box large">

        <h4>📄 Full Details</h4>

        <div class="grid">
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
          <p><b>PL No:</b> {{ selectedRequest.allocationPlNo }}</p>

          <p>
            <b>File:</b>
            <a v-if="selectedRequest.filePath"
              :href="fileUrl(selectedRequest.filePath)"
              target="_blank">
              Download
            </a>
          </p>
        </div>

        <button class="btn btn-secondary mt-2" @click="selectedRequest=null">Close</button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box large">

        <h4>✏ Edit Request</h4>

        <div class="grid">

          <input v-model="editData.date" type="date" class="form-control"/>
          <input v-model="editData.partNo" class="form-control" placeholder="Part No"/>
          <input v-model="editData.customer" class="form-control" placeholder="Customer"/>
          <input v-model="editData.platformCode" class="form-control" placeholder="Platform"/>

          <textarea v-model="editData.description" class="form-control" placeholder="Description"></textarea>

          <input v-model="editData.productCode" class="form-control" placeholder="Product Code"/>
          <input v-model="editData.samples" type="number" class="form-control" placeholder="Samples"/>

          <input v-model="editData.testType" class="form-control" placeholder="Test Type"/>
          <input v-model="editData.category" class="form-control" placeholder="Category"/>

          <textarea v-model="editData.testDetails" class="form-control" placeholder="Test Details"></textarea>
          <textarea v-model="editData.special" class="form-control" placeholder="Special"></textarea>
          <textarea v-model="editData.criteria" class="form-control" placeholder="Criteria"></textarea>

          <input v-model="editData.spec" class="form-control" placeholder="Spec"/>
          <input v-model="editData.testName" class="form-control" placeholder="Test Name"/>

          <!-- NEW -->
          <input v-model="editData.allocationPlNo" class="form-control" placeholder="Allocation PL No"/>

          <input type="file" class="form-control" @change="handleFile"/>
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
      file: null
    };
  },

  mounted() {
    this.loadRequests();
  },

  methods: {

    fileUrl(name){
      return `http://localhost:5000/uploads/${name}`;
    },

    statusClass(status){
      return {
        badge: true,
        pending: status === "Pending",
        approved: status === "Approved",
        rejected: status === "Rejected"
      };
    },

    async loadRequests() {
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    viewRequest(req){
      this.selectedRequest = req;
    },

    editRequest(req){
      this.editData = { ...req };
    },

    handleFile(e){
      this.file = e.target.files[0];
    },

    async saveEdit(){
      const formData = new FormData();

      Object.keys(this.editData).forEach(key => {
        formData.append(key, this.editData[key]);
      });

      if(this.file){
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

    async updateStatus(id, status){
      await axios.put(`http://localhost:5000/api/requests/${id}`, { status });
      this.loadRequests();
    },

    async deleteRequest(id){
      if(confirm("Delete?")){
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        this.loadRequests();
      }
    }
  }
};
</script>

<style>
.title {
  font-weight: bold;
  color: #2c3e50;
}

.custom-table thead {
  background: #2c3e50;
  color: white;
}

.badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: bold;
}

.pending { background: orange; color: white; }
.approved { background: green; color: white; }
.rejected { background: red; color: white; }

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
  border-radius: 12px;
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.large {
  width: 800px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>