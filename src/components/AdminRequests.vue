import axios from "axios";

export default {
  data() {
    return {
      requests: []
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    async accept(id) {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, {
        status: "Approved"
      });
      this.loadData();
    },

    async reject(id) {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, {
        status: "Rejected"
      });
      this.loadData();
    },

    async edit(req) {
      const title = prompt("Edit title", req.title);
      const desc = prompt("Edit description", req.description);

      await axios.put(`http://localhost:5000/api/requests/${req._id}`, {
        title,
        description: desc
      });

      this.loadData();
    }
  }
};