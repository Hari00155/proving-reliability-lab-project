<template>
  <div class="container">
    <h4 class="mb-3 text-danger">Rejected Requests</h4>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Part No</th>
          <th>Customer</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(req, index) in rejectedRequests" :key="index">
          <td>{{ req.date }}</td>
          <td>{{ req.partNo }}</td>
          <td>{{ req.customer }}</td>
          <td class="text-danger">{{ req.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "RejectedRequest",

  data() {
    return {
      requests: []
    };
  },

  computed: {
    rejectedRequests() {
      return this.requests.filter(r => r.status === "Rejected");
    }
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.requests = JSON.parse(localStorage.getItem("requests")) || [];
    }
  }
};
</script>