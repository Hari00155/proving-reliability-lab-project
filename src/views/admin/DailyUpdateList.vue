<template>
<div class="container mt-4">

  <h2>📊 Daily Update - Admin</h2>

  <!-- TABLE -->
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>S.No</th>
        <th>Req No</th>
        <th>PL No</th>
        <th>Date</th>
        <th>User</th>
        <th>Dept</th>
        <th>Part No</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(r,index) in requests" :key="r.id">
        <td>{{ index + 1 }}</td>
        <td>{{ r.requestNo }}</td>
        <td>{{ r.allocationPlNo }}</td>
        <td>{{ r.date }}</td>
        <td>{{ r.userName }}</td>
        <td>{{ r.deptId }}</td>
        <td>{{ r.partNo }}</td>
        <td>{{ r.customer }}</td>
        <td>{{ r.status }}</td>

        <td>
          <button class="btn btn-primary btn-sm" @click="openDaily(r)">Daily Update</button>
          <button class="btn btn-success btn-sm" @click="openEntry(r)">Entry</button>
          <button class="btn btn-warning btn-sm" @click="openReport(r)">Report</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ================= DAILY UPDATE ================= -->
  <div v-if="dailyData" class="modal">
    <div class="box">
      <h4>📘 Monitoring Sheet</h4>

      <input v-model="dailyData.monitoringId" placeholder="Monitoring ID" class="form-control mb-2">
      <input v-model="dailyData.eqNo" placeholder="Equipment No" class="form-control mb-2">

      <input type="date" v-model="dailyData.updateDate" class="form-control mb-2">

      <input v-model="dailyData.targetCycles" placeholder="Target Cycles" class="form-control mb-2">
      <input v-model="dailyData.currentReading" placeholder="Current Reading" class="form-control mb-2">
      <input v-model="dailyData.initialReading" placeholder="Initial Reading" class="form-control mb-2">

      <textarea v-model="dailyData.remarks" placeholder="Remarks" class="form-control mb-2"></textarea>

      <input type="file" @change="handlePhoto" class="form-control mb-2">

      <button class="btn btn-success" @click="submitDaily">Submit</button>
      <button class="btn btn-secondary" @click="dailyData=null">Close</button>
    </div>
  </div>

  <!-- ================= ENTRY FORM ================= -->
  <div v-if="entryData" class="modal">
    <div class="box">
      <h4>📥 Monitoring Entry</h4>

      <input v-model="entryData.plNo" placeholder="PL No" class="form-control mb-2">
      <input v-model="entryData.eqNo" placeholder="Equipment No" class="form-control mb-2">
      <input v-model="entryData.eqDetails" placeholder="Equipment Details" class="form-control mb-2">

      <input type="date" v-model="entryData.startDate" class="form-control mb-2">

      <input v-model="entryData.targetCycles" placeholder="Target Cycles" class="form-control mb-2">
      <input v-model="entryData.initialReading" placeholder="Initial Reading" class="form-control mb-2">

      <button class="btn btn-success" @click="submitEntry">Submit</button>
      <button class="btn btn-secondary" @click="entryData=null">Close</button>
    </div>
  </div>

  <!-- ================= REPORT ================= -->
  <div v-if="reportData" class="modal">
    <div class="box big">

      <h4>📄 Test Report</h4>

      <p><b>User:</b> {{ reportData.userName }}</p>
      <p><b>Dept:</b> {{ reportData.deptId }}</p>
      <p><b>Date:</b> {{ reportData.date }}</p>

      <input v-model="reportData.partNo" placeholder="Part No" class="form-control mb-2">
      <textarea v-model="reportData.description" placeholder="Description" class="form-control mb-2"></textarea>

      <input v-model="reportData.platformCode" placeholder="Platform Code" class="form-control mb-2">
      <input v-model="reportData.productCode" placeholder="Product Code" class="form-control mb-2">
      <input v-model="reportData.customer" placeholder="Customer" class="form-control mb-2">

      <input v-model="reportData.samples" placeholder="Samples" class="form-control mb-2">

      <input v-model="reportData.testType" placeholder="Test Type" class="form-control mb-2">
      <input v-model="reportData.category" placeholder="Category" class="form-control mb-2">

      <textarea v-model="reportData.testDetails" placeholder="Test Details" class="form-control mb-2"></textarea>
      <textarea v-model="reportData.special" placeholder="Special Features" class="form-control mb-2"></textarea>
      <textarea v-model="reportData.criteria" placeholder="Criteria" class="form-control mb-2"></textarea>

      <input v-model="reportData.spec" placeholder="Specification" class="form-control mb-2">
      <input v-model="reportData.testName" placeholder="Test Name" class="form-control mb-2">

      <!-- RESULT -->
      <select v-model="reportData.result" class="form-control mb-2">
        <option>Passed</option>
        <option>Failed</option>
        <option>Completed</option>
      </select>

      <textarea v-model="reportData.failure" placeholder="Failure Details" class="form-control mb-2"></textarea>

      <input type="file" @change="handlePostFile" class="form-control mb-2">

      <input v-model="reportData.reportedBy" placeholder="Reported By" class="form-control mb-2">
      <input v-model="reportData.approvedBy" placeholder="Approved By" class="form-control mb-2">

      <button class="btn btn-primary" @click="printReport">🖨 Print</button>
      <button class="btn btn-success" @click="submitReport">Submit</button>
      <button class="btn btn-secondary" @click="reportData=null">Close</button>

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
  dailyData: null,
  entryData: null,
  reportData: null,
  photo: null,
  postFile: null
};
},

mounted() {
this.load();
},

methods: {

async load() {
  const res = await axios.get("http://localhost:5000/api/requests");
  this.requests = res.data;
},

openDaily(r) {
  this.dailyData = { ...r };
},

openEntry(r) {
  this.entryData = { ...r };
},

openReport(r) {
  this.reportData = { ...r };
},

handlePhoto(e) {
  this.photo = e.target.files[0];
},

handlePostFile(e) {
  this.postFile = e.target.files[0];
},

async submitDaily() {
  alert("Daily Update Saved");
  this.dailyData = null;
},

async submitEntry() {
  alert("Entry Saved");
  this.entryData = null;
},

async submitReport() {
  alert("Report Saved");
  this.reportData = null;
},

printReport() {
  window.print();
}

}
};
</script>

<style>
.modal {
position: fixed;
top:0;left:0;
width:100%;height:100%;
background: rgba(0,0,0,0.6);
display:flex;
justify-content:center;
align-items:center;
}

.box {
background:white;
padding:20px;
width:500px;
}

.big {
width:900px;
max-height:90vh;
overflow:auto;
}
</style>