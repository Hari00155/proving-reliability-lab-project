<template>
  <div class="container mt-4">

    <h3 class="mb-3">📁 Request Archive</h3>

    <!-- REFRESH -->
    <div class="text-end mb-2">
      <button class="btn btn-sm btn-primary" @click="loadArchive">
        🔄 Refresh
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover text-center">

        <thead class="table-dark">
          <tr>
            <th>Date</th>
            <th>Part No</th>
            <th>Customer</th>
            <th>PL No</th>
            <th>Status</th>
            <th>File</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="req in archivedRequests" :key="req.id">
            <td>{{ formatDate(req.date) }}</td>

            <td class="fw-bold text-primary">
              {{ req.partNo }}
            </td>

            <td>{{ req.customer }}</td>

            <!-- PL NO -->
            <td>
              <span v-if="req.allocationPlNo" class="badge bg-primary">
                {{ req.allocationPlNo }}
              </span>
              <span v-else>-</span>
            </td>

            <!-- STATUS -->
            <td>
              <span :class="statusClass(req.status)">
                {{ req.status }}
              </span>
            </td>

            <!-- FILE -->
            <td>
              <a v-if="req.filePath"
                :href="fileUrl(req.filePath)"
                target="_blank"
                class="btn btn-sm btn-outline-primary">
                View
              </a>
              <span v-else>No File</span>
            </td>
          </tr>
        </tbody>

      </table>
    </div>

    <!-- EMPTY -->
    <div v-if="archivedRequests.length === 0" class="text-center mt-4">
      <p>No Archive Data Found ❌</p>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      requests: [],
      currentYear: new Date().getFullYear() // ✅ e.g. 2026
    };
  },

  mounted() {
    this.loadArchive();
  },

  computed: {
    // ✅ ARCHIVE: only requests from PREVIOUS years
    archivedRequests() {
      return this.requests.filter(req => {
        if (!req.date) return false;
        const reqYear = new Date(req.date).getFullYear();
        return reqYear < this.currentYear; // strictly older than current year
      });
    }
  },

  methods: {

    async loadArchive() {
      try {
        const res = await axios.get("http://localhost:5000/api/requests/archive");
        this.requests = res.data;
      } catch (err) {
        console.error("ARCHIVE ERROR:", err);
        alert("Error loading archive ❌");
      }
    },

    fileUrl(name) {
      return `http://localhost:5000/uploads/${name}`;
    },

    formatDate(date) {
      if (!date) return "-";
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
h3 {
  font-weight: bold;
  color: #2c3e50;
}
</style>