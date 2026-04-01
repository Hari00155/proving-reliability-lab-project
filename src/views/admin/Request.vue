<template>
  <div class="container mt-4">
    <h2 class="title">🛠 Admin Panel - Requests</h2>

    <!-- SEARCH -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input
          v-model="searchText"
          class="form-control"
          placeholder="Search (Req No / PL No / Part / Customer / User / Dept)"
        />
      </div>
      <div class="col-md-3">
        <select v-model="searchStatus" class="form-control">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Accepted</option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="loadRequests">🔄 Refresh</button>
      </div>
    </div>

    <!-- TABLE -->
    <table class="table custom-table">
      <thead>
        <tr>
          <th>Req No</th>
          <th>PL No</th>
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
          <td>{{ req.allocationPlNo || '-' }}</td>
          <td>{{ req.userName }}</td>
          <td>{{ req.deptId }}</td>
          <td>{{ req.partNo }}</td>

          <td>
            <span :class="['badge-status', (req.status || '').toLowerCase()]">
              {{ req.status }}
            </span>
          </td>

          <td>
            <button class="btn btn-info btn-sm" @click="viewRequest(req)">View</button>
            <button class="btn btn-warning btn-sm" @click="editRequest(req)">Edit</button>

            <button
              class="btn btn-success btn-sm"
              v-if="req.status === 'Pending'"
              @click="acceptRequest(req)"
            >
              ✔
            </button>

            <button
              class="btn btn-primary btn-sm"
              v-if="req.status === 'Accepted'"
              @click="openAllocation(req)"
            >
              Allocate
            </button>

            <button
              class="btn btn-danger btn-sm"
              v-if="req.status !== 'Allocated'"
              @click="openReject(req)"
            >
              ✖
            </button>

            <button class="btn btn-dark btn-sm" @click="deleteRequest(req.id)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- VIEW -->
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

          <!-- ✅ FILE FIX (YOUR STYLE) -->
          <p>
            <b>Attachment:</b>
            <a
              v-if="selectedRequest.attachment"
              :href="fixAttachment(selectedRequest.attachment)"
              target="_blank"
              class="btn btn-sm btn-outline-primary ms-2"
            >
              View File
            </a>
            <span v-else>No File</span>
          </p>
        </div>

        <button class="btn btn-secondary mt-3" @click="selectedRequest = null">Close</button>
      </div>
    </div>

    <!-- EDIT -->
    <div v-if="editData" class="modal-overlay">
      <div class="modal-box large">
        <h4 class="mb-3 text-warning">✏️ Edit Request</h4>

        <div class="grid">
          <div>
            <label>Date</label><input type="date" v-model="editData.date" class="form-control" />
          </div>
          <div><label>Part No</label><input v-model="editData.partNo" class="form-control" /></div>
          <div>
            <label>Description</label><input v-model="editData.description" class="form-control" />
          </div>
          <div>
            <label>Platform Code</label
            ><input v-model="editData.platformCode" class="form-control" />
          </div>
          <div>
            <label>Product Code</label><input v-model="editData.productCode" class="form-control" />
          </div>
          <div>
            <label>Customer</label><input v-model="editData.customer" class="form-control" />
          </div>
          <div><label>Samples</label><input v-model="editData.samples" class="form-control" /></div>
          <div>
            <label>Test Type</label><input v-model="editData.testType" class="form-control" />
          </div>
          <div>
            <label>Category</label><input v-model="editData.category" class="form-control" />
          </div>
          <div>
            <label>Test Details</label><input v-model="editData.testDetails" class="form-control" />
          </div>
          <div><label>Special</label><input v-model="editData.special" class="form-control" /></div>
          <div>
            <label>Criteria</label><input v-model="editData.criteria" class="form-control" />
          </div>
          <div><label>Spec</label><input v-model="editData.spec" class="form-control" /></div>
          <div>
            <label>Test Name</label><input v-model="editData.testName" class="form-control" />
          </div>
        </div>

        <!-- FILE -->
        <div class="mt-3">
          <p><b>Current File:</b> {{ editData.attachmentName || 'No File' }}</p>
          <input type="file" @change="handleEditAttachment" class="form-control" />
        </div>

        <button class="btn btn-primary mt-3" @click="submitEdit">Save</button>
        <button class="btn btn-secondary mt-3" @click="editData = null">Cancel</button>
      </div>
    </div>
    
    <!-- REJECT -->
    <div v-if="rejectData" class="modal-overlay">
      <div class="modal-box">
        <textarea v-model="rejectData.rejectReason" class="form-control"></textarea>
        <button class="btn btn-danger mt-2" @click="submitReject">Submit</button>
      </div>
    </div>

    <!-- ALLOCATION -->
    <div v-if="allocationData" class="modal-overlay">
      <div class="modal-box">
        <label>PL No</label>
        <input :value="allocationData.generatedPlNo" class="form-control" readonly />

        <label>Responsibility</label>
        <input value="Admin" class="form-control" readonly />

        <label>Equipment</label>
        <select v-model="allocationData.testRig" class="form-control">
          <option>OV-12</option>
          <option>OV-13</option>
          <option>ETE-05</option>
          <option>ETE-60</option>
        </select>

        <label>Start Date</label>
        <input type="date" v-model="allocationData.startDate" class="form-control" />

        <button class="btn btn-success mt-2" @click="submitAllocation">Allocate</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      requests: [],
      selectedRequest: null,
      editData: null,
      rejectData: null,
      allocationData: null,
      searchText: '',
      searchStatus: '',
    }
  },

  computed: {
    filteredRequests() {
      return this.requests.filter((r) => {
        // 🔥 REMOVE ALLOCATED + REJECTED
        if (r.status === 'Allocated') return false
        if (r.status === 'Rejected') return false

        return !this.searchStatus || r.status === this.searchStatus
      })
    },
  },

  mounted() {
    this.loadRequests()
  },

  methods: {
    async loadRequests() {
      const res = await axios.get('http://localhost:5000/api/requests')
      this.requests = res.data
    },

    viewRequest(r) {
      this.selectedRequest = r
    },
    editRequest(r) {
      this.editData = { ...r }
    },
    openReject(r) {
      this.rejectData = { ...r }
    },

    openAllocation(r) {
      this.allocationData = {
        ...r,
        generatedPlNo: r.allocationPlNo || this.generatePlNo(),
      }
    },

    generatePlNo() {
      const nums = this.requests.map((r) => parseInt(r.allocationPlNo)).filter((n) => !isNaN(n))
      const max = nums.length ? Math.max(...nums) : 0
      return String(max + 1).padStart(5, '0')
    },

    fixAttachment(file) {
      if (!file) return ''
      if (file.startsWith('http')) return file
      return 'http://localhost:5000/' + file
    },

    isImage(n) {
      return /\.(jpg|png|jpeg)/i.test(n || '')
    },
    isPdf(n) {
      return /\.pdf/i.test(n || '')
    },

    handleEditAttachment(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        this.editData.attachment = reader.result
        this.editData.attachmentName = file.name
      }
      reader.readAsDataURL(file)
    },

    async submitEdit() {
      await axios.put(`http://localhost:5000/api/requests/${this.editData.id}`, this.editData)
      this.editData = null
      this.loadRequests()
    },

    async acceptRequest(req) {
      await axios.put(`http://localhost:5000/api/requests/${req.id}`, { status: 'Accepted' })
      this.loadRequests()
    },

    async submitReject() {
      await axios.put(`http://localhost:5000/api/requests/${this.rejectData.id}`, {
        status: 'Rejected',
        rejectReason: this.rejectData.rejectReason,
      })
      this.rejectData = null
      this.loadRequests()
    },

    async submitAllocation() {
      const plNo = this.allocationData.generatedPlNo

      await axios.put(`http://localhost:5000/api/requests/${this.allocationData.id}`, {
        status: 'Allocated',
        allocationPlNo: plNo,
        responsibility: 'Admin',
        testRig: this.allocationData.testRig,
        startDate: this.allocationData.startDate,
      })

      await axios.post('http://localhost:5000/api/dailyupdates', {
        ...this.allocationData,
        allocationPlNo: plNo,
        status: 'Allocated',
      })

      this.allocationData = null
      this.loadRequests()
    },

    async deleteRequest(id) {
      if (!confirm('Delete permanently?')) return
      await axios.delete(`http://localhost:5000/api/requests/${id}`)
      this.loadRequests()
    },
  },
}
</script>

<style>
.badge-status {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}
.badge-status.pending {
  background: #fff3cd;
  color: #856404;
}
.badge-status.accepted {
  background: #d1fae5;
  color: #06694d;
}
.badge-status.allocated {
  background: #dbeafe;
  color: #0b3de4;
}
.badge-status.rejected {
  background: #fee2e2;
  color: #991b1b;
}
</style>
