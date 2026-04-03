<template>
  <div class="d-flex" style="min-height: 100vh;">

    <!-- SIDEBAR -->
    <div class="text-white p-3" style="width: 260px; min-height: 100vh; background-color: #7c3aed;">

      <!-- Avatar & Title -->
      <div class="text-center mb-4">
        <div class="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
          style="width:52px; height:52px; background:rgba(255,255,255,0.2); font-size:22px; font-weight:700;">
          A
        </div>
        <h5 class="mb-0" style="font-weight:600;">Admin Panel</h5>
        <small style="color:rgba(255,255,255,0.5);">Lab Administrator</small>
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
          style="background:#ede9fe; color:#7c3aed; font-size:11px; font-weight:600;">
          Administrator
        </span>
      </div>

      <!-- Page Content -->
      <div class="p-4">
        <h4 class="mb-1" style="color:#7c3aed; font-weight:600;">{{ pageLabel }}</h4>
        <p class="text-muted mb-4" style="font-size:14px;">
          You are currently viewing: {{ pageLabel }}
        </p>

        <component :is="currentPageComponent" />
      </div>

    </div>

  </div>
</template>

<script>
import Request from "./admin/Request.vue";
import RequestArchive from "./admin/RequestArchive.vue";
import Status from "./admin/Status.vue";
import DailyUpdateList from "./admin/DailyUpdateList.vue";
import DailyUpdateSearch from "./admin/DailyUpdateSearch.vue";
import DailyUpdateArchive from "./admin/DailyUpdateArchive.vue";
import PrintRequest from "./admin/PrintRequest.vue";
import TestDetail from "./admin/TestDetail.vue";
import Standards from "./admin/Standards.vue";
import ApproveReport from "./admin/ApproveReport.vue";
import UserDetail from "./admin/UserDetail.vue";
import DepartmentDetail from "./admin/DepartmentDetail.vue";
import NewTestEntry from "./admin/NewTestEntry.vue";
import UserResponsibility from "./admin/UserResponsibility.vue";
import EquipmentDetail from "./admin/EquipmentDetail.vue";
import ProductDetail from "./admin/ProductDetail.vue";
import SearchReport from "./admin/SearchReport.vue";
import ReportGenerator from "./admin/ReportGenerator.vue";
import PrintDataSheet from "./admin/PrintDataSheet.vue";
import RejectedRequest from "./admin/RejectedRequest.vue";

export default {
  components: {
    Request, RequestArchive, Status, DailyUpdateList,
    DailyUpdateSearch, DailyUpdateArchive, PrintRequest,
    TestDetail, Standards, ApproveReport, UserDetail,
    DepartmentDetail, NewTestEntry, UserResponsibility,
    EquipmentDetail, ProductDetail, SearchReport,
    ReportGenerator, PrintDataSheet, RejectedRequest
  },

  data() {
    return {
      currentPage: "Request",
      menu: [
        { name: "Request",             label: "Request" },
        { name: "RequestArchive",      label: "Request Archive" },
        { name: "Status",              label: "Status" },
        { name: "DailyUpdateList",     label: "Daily Update List" },
        { name: "DailyUpdateSearch",   label: "Daily Update Search" },
        { name: "DailyUpdateArchive",  label: "Daily Update Archive" },
        { name: "PrintRequest",        label: "Print Request" },
        { name: "TestDetail",          label: "Test Detail View" },
        { name: "Standards",           label: "Standards" },
        { name: "ApproveReport",       label: "Approve Report" },
        { name: "UserDetail",          label: "User Detail" },
        { name: "DepartmentDetail",    label: "Department Detail" },
        { name: "NewTestEntry",        label: "New Test Entry" },
        { name: "UserResponsibility",  label: "User Responsibility" },
        { name: "EquipmentDetail",     label: "Equipment Detail" },
        { name: "ProductDetail",       label: "Product Detail" },
        { name: "SearchReport",        label: "Search Report" },
        { name: "ReportGenerator",     label: "Report Generator" },
        { name: "PrintDataSheet",      label: "Print Data Sheet" },
        { name: "RejectedRequest",     label: "Rejected Request" },
        { name: "Email",               label: "Email" }
      ]
    };
  },

  computed: {
    currentPageComponent() {
      return this.currentPage;
    },
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
  padding: 9px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  transition: background 0.15s, color 0.15s;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* ✅ Active page — white pill with purple text */
.sidebar-btn-active {
  background: #ffffff !important;
  color: #154556 !important;
  font-weight: 700;
}
</style>