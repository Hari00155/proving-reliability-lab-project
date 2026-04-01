<template>
  <div class="container mt-4">

    <h2 class="title text-danger">❌ Rejected Requests</h2>

    <!-- SEARCH -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input v-model="searchText" class="form-control"
          placeholder="Search (Req No / Part / User)" />
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="loadRequests">🔄 Refresh</button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover">

        <thead class="table-light">
          <tr>
            <th>Req No</th>
            <th>User</th>
            <th>Dept</th>
            <th>Part No</th>
            <th>Status</th>
            <th>Reject Reason</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in filteredRejected" :key="req.id">

            <td>{{ req.requestNo }}</td>
            <td>{{ req.userName }}</td>
            <td>{{ req.deptId }}</td>
            <td>{{ req.partNo }}</td>

            <td>
              <span class="badge-status rejected">
                {{ req.status }}
              </span>
            </td>

            <td>{{ req.rejectReason || 'No reason' }}</td>

            <!-- ATTACHMENT -->
            <td>
              <a v-if="req.attachment"
                :href="fixAttachment(req.attachment)"
                target="_blank"
                class="btn btn-sm btn-outline-primary">
                View
              </a>
              <span v-else>-</span>
            </td>

            <!-- VIEW FULL -->
            <td>
              <button class="btn btn-info btn-sm"
                @click="viewRequest(req)">
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

        <h4 class="text-danger">Rejected Request Details</h4>

        <p><b>Req No:</b> {{ selectedRequest.requestNo }}</p>
        <p><b>User:</b> {{ selectedRequest.userName }}</p>
        <p><b>Part:</b> {{ selectedRequest.partNo }}</p>
        <p><b>Reason:</b> {{ selectedRequest.rejectReason }}</p>

        <div v-if="selectedRequest.attachment">
          <a :href="fixAttachment(selectedRequest.attachment)"
             target="_blank"
             class="btn btn-sm btn-primary">
             View Attachment
          </a>
        </div>

        <button class="btn btn-secondary mt-3"
          @click="selectedRequest=null">
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
      selectedRequest: null,
      searchText: ""
    };
  },

  computed: {

    // 🔥 ONLY REJECTED + SEARCH
    filteredRejected() {
      return this.requests.filter(r => {

        if (r.status !== "Rejected") return false;

        const s = this.searchText.toLowerCase();

        return (
          (r.requestNo || "").toLowerCase().includes(s) ||
          (r.partNo || "").toLowerCase().includes(s) ||
          (r.userName || "").toLowerCase().includes(s)
        );

      });
    }

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
        console.error("Error loading requests:", err);
      }
    },

    viewRequest(r) {
      this.selectedRequest = r;
    },

    // 🔥 SAFE FILE FIX
    fixAttachment(file) {
      if (!file) return "";

      if (file.startsWith("http")) return file;

      return `http://localhost:5000/${file.replace(/^\/+/, "")}`;
    }

  }

};
</script>

<style>
.badge-status {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.badge-status.rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
</style>