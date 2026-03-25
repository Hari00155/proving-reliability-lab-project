<template>
  <div class="d-flex">

    <!-- SIDEBAR -->
    <div class="bg-dark text-white p-3" style="width: 260px; min-height: 100vh;">
      <h4 class="text-center mb-4">Admin Panel</h4>

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

      <!-- Dynamic Sections -->
      <component :is="currentPageComponent"></component>

    </div>

  </div>
</template>

<script>

// Import all components
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
    Request,
    RequestArchive,
    Status,
    DailyUpdateList,
    DailyUpdateSearch,
    DailyUpdateArchive,
    PrintRequest,
    TestDetail,
    Standards,
    ApproveReport,
    UserDetail,
    DepartmentDetail,
    NewTestEntry,
    UserResponsibility,
    EquipmentDetail,
    ProductDetail,
    SearchReport,
    ReportGenerator,
    PrintDataSheet,
    RejectedRequest,
  
  },

  data() {
    return {
      currentPage: "Request",

      menu: [
        { name: "Request", label: "Request" },
        { name: "RequestArchive", label: "Request Archive" },
        { name: "Status", label: "Status" },
        { name: "DailyUpdateList", label: "Daily Update List" },
        { name: "DailyUpdateSearch", label: "Daily Update Search" },
        { name: "DailyUpdateArchive", label: "Daily Update Archive" },
        { name: "PrintRequest", label: "Print Request" },
        { name: "TestDetail", label: "Test Detail View" },
        { name: "Standards", label: "Standards" },
        { name: "ApproveReport", label: "Approve Report" },
        { name: "UserDetail", label: "User Detail" },
        { name: "DepartmentDetail", label: "Department Detail" },
        { name: "NewTestEntry", label: "New Test Entry" },
        { name: "UserResponsibility", label: "User Responsibility" },
        { name: "EquipmentDetail", label: "Equipment Detail" },
        { name: "ProductDetail", label: "Product Detail" },
        { name: "SearchReport", label: "Search Report" },
        { name: "ReportGenerator", label: "Report Generator" },
        { name: "PrintDataSheet", label: "Print Data Sheet" },
        { name: "RejectedRequest", label: "Rejected Request" },
        { name: "Email", label: "Email" }
      ]
    };
  },

  computed: {
    currentPageComponent() {
      return this.currentPage;
    }
  },

  methods: {
    logout() {
      this.$router.push("/");
    }
  }
};
</script>