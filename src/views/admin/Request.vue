<template>
  <div>
    <h3>Request List</h3>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Req No</th>
          <th>Name</th>
          <th>Department</th>
          <th>Product</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(r, index) in requests" :key="index">
          <td>{{ r.date }}</td>
          <td>{{ r.reqno }}</td>
          <td>{{ r.name }}</td>
          <td>{{ r.department }}</td>
          <td>{{ r.product }}</td>

          <td>
            <button class="btn btn-success btn-sm">Update</button>
            <button class="btn btn-danger btn-sm">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: []
    };
  },
  mounted() {
    this.requests = JSON.parse(localStorage.getItem("requests")) || [];
  }
};
</script>