<template>
  <div class="d-flex" style="min-height: 100vh;">

    <!-- SIDEBAR -->
    <div class="text-white p-3" style="width: 260px; min-height: 100vh; background-color: #1e3a5f;">

      <!-- Avatar & Title -->
      <div class="text-center mb-4">
        <div class="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
          style="width:52px; height:52px; background:rgba(255,255,255,0.15); font-size:22px; font-weight:700;">
          U
        </div>
        <h5 class="mb-0" style="font-weight:600;">User Panel</h5>
        <small style="color:rgba(255,255,255,0.5);">Lab User</small>
      </div>

      <!-- Nav Menu -->
      <ul class="nav flex-column">
        <li class="nav-item" v-for="item in menu" :key="item.name">
          <button
            class="w-100 text-start mb-2 sidebar-btn"
            :class="{ 'sidebar-btn-active': currentPage === item.name }"
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

    <!-- CONTENT AREA -->
    <div class="flex-grow-1" style="background:#f9fafb;">

      <!-- Top Bar -->
      <div class="d-flex align-items-center px-4 py-3"
        style="background:#fff; border-bottom:1px solid #e5e7eb;">
        <span style="color:#6b7280; font-size:14px;">Proving & Reliability Lab</span>
        <span class="ms-2 px-2 py-1 rounded-pill"
          style="background:#dbeafe; color:#1e3a5f; font-size:11px; font-weight:600;">
          Active
        </span>
      </div>

      <!-- Page Content -->
      <div class="p-4">
        <h4 class="mb-1" style="color:#1e3a5f; font-weight:600;">{{ pageLabel }}</h4>
        <p class="text-muted mb-4" style="font-size:14px;">
          You are viewing the {{ pageLabel }} section.
        </p>

        <component :is="currentPage" />
      </div>

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
    Home, PlaceRequest, CompletedRequest,
    RejectedRequest, PrintRequest, Status, SearchRequest
  },

  data() {
    return {
      currentPage: "Home",
      menu: [
        { name: "Home",             label: "Home" },
        { name: "PlaceRequest",     label: "Place Request" },
        { name: "CompletedRequest", label: "Completed Requests" },
        { name: "RejectedRequest",  label: "Rejected Request" },
        { name: "PrintRequest",     label: "Print Requests" },
        { name: "Status",           label: "Status" },
        { name: "SearchRequest",    label: "Search Requests" }
      ]
    };
  },

  computed: {
    pageLabel() {
      const found = this.menu.find(m => m.name === this.currentPage);
      return found ? found.label : this.currentPage;
    }
  },

  methods: {
    logout() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.sidebar-btn {
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  transition: background 0.15s, color 0.15s;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* ✅ Active page highlight — white pill with navy text */
.sidebar-btn-active {
  background: #ffffff !important;
  color: #1e3a5f !important;
  font-weight: 600;
}
</style>