<template>
  <div class="d-flex">

    <!-- SIDEBAR -->
    <div class="bg-dark text-white p-3" style="width: 260px; min-height: 100vh;">
      <h4 class="text-center mb-4">User Panel</h4>

      <ul class="nav flex-column">

        <li class="nav-item" v-for="item in menu" :key="item.name">
          <button 
            class="btn btn-dark w-100 text-start mb-2"
            @click="currentPage = item.name"
          >
            {{ item.label }}
          </button>
        </li>

        <li class="nav-item mt-4">
          <button class="btn btn-danger w-100" @click="logout">
            Sign Out
          </button>
        </li>

      </ul>
    </div>

    <!-- CONTENT -->
    <div class="flex-grow-1 p-4 bg-light">

      <h3 class="mb-4">{{ currentPage }}</h3>

      <!-- ✅ FIXED -->
      <component :is="currentPage"></component>

    </div>

  </div>
</template>

<script>
import Home from "./user/Home.vue";
import PlaceRequest from "./user/PlaceRequest.vue";
import CompletedRequest from "./user/CompletedRequest.vue";
import RejectedRequest from "./user/RejectedRequest.vue";
import PrintRequest from "./user/PrintRequest.vue";
import Status from "./user/Status.vue";
import SearchRequest from "./user/SearchRequest.vue";

export default {
  components: {
    Home,
    PlaceRequest,
    CompletedRequest,
    RejectedRequest,
    PrintRequest,
    Status,
    SearchRequest
  },

  data() {
    return {
      currentPage: "Home",
      menu: [
        { name: "Home", label: "Home" },
        { name: "PlaceRequest", label: "Place Request" },
        { name: "CompletedRequest", label: "Completed Requests" },
        { name: "RejectedRequest", label: "Rejected Request" },
        { name: "PrintRequest", label: "Print Requests" },
        { name: "Status", label: "Status" },
        { name: "SearchRequest", label: "Search Requests" }
      ]
    };
  },

  methods: {
    logout() {
      this.$router.push("/");
    }
  }
};
</script>