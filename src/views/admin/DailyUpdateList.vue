<template>
<div class="container mt-4">

<h2>📊 Daily Update - Admin</h2>

<table class="table table-bordered">
<thead>
<tr>
<th>S.No</th>
<th>Req No</th>
<th>PL No</th>
<th>User</th>
<th>Part No</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>
<tr v-for="(r,index) in filteredRequests" :key="r.id">
<td>{{ index + 1 }}</td>
<td>{{ r.requestNo }}</td>
<td>{{ r.allocationPlNo }}</td>
<td>{{ r.userName }}</td>
<td>{{ r.partNo }}</td>
<td>{{ r.status }}</td>

<td>
<button class="btn btn-primary btn-sm" @click="openDaily(r)">Monitoring</button>
<button class="btn btn-warning btn-sm" @click="openReport(r)">Report</button>
</td>
</tr>
</tbody>
</table>

<!-- ================= MONITORING ================= -->
<div v-if="dailyData" class="modal">
<div class="box">

<h4>📘 Monitoring Sheet</h4>

<label>PL No</label>
<input :value="dailyData.allocationPlNo" readonly class="form-control mb-2">

<label>Equipment No</label>
<input :value="dailyData.testRig" readonly class="form-control mb-2">

<label>Date</label>
<input type="date" v-model="dailyData.updateDate" class="form-control mb-2">

<label>Target Cycle</label>
<input v-model.number="dailyData.targetCycles" class="form-control mb-2">

<label>Current Reading</label>
<input v-model.number="dailyData.currentReading" class="form-control mb-2">

<label>Initial Reading</label>
<input v-model.number="dailyData.initialReading" class="form-control mb-2">

<label>Yet to Cover</label>
<input :value="yetToCover" readonly class="form-control mb-2">

<textarea v-model="dailyData.remarks" placeholder="Remarks" class="form-control mb-2"></textarea>

<input type="file" @change="handlePhoto" class="form-control mb-2">

<button class="btn btn-info" @click="printSheet">🖨 Print Data Sheet</button>
<button class="btn btn-success" @click="submitDaily">Submit</button>
<button class="btn btn-secondary" @click="dailyData=null">Close</button>

</div>
</div>

<!-- ================= REPORT ================= -->
<div v-if="reportData" class="modal">
<div class="box big">

<h4>📄 Report</h4>

<label>PL No</label>
<input :value="reportData.allocationPlNo" readonly class="form-control mb-2">

<label>Req No</label>
<input :value="reportData.requestNo" readonly class="form-control mb-2">

<input v-model="reportData.partNo" placeholder="Part No" class="form-control mb-2">
<input v-model="reportData.description" placeholder="Description" class="form-control mb-2">

<input v-model="reportData.platformCode" placeholder="Platform Code" class="form-control mb-2">
<input v-model="reportData.productCode" placeholder="Product Code" class="form-control mb-2">
<input v-model="reportData.customer" placeholder="Customer" class="form-control mb-2">

<input v-model="reportData.samples" placeholder="Samples" class="form-control mb-2">

<input v-model="reportData.testType" placeholder="Test Type" class="form-control mb-2">
<input v-model="reportData.category" placeholder="Category" class="form-control mb-2">

<textarea v-model="reportData.testDetails" class="form-control mb-2"></textarea>
<textarea v-model="reportData.special" class="form-control mb-2"></textarea>
<textarea v-model="reportData.criteria" class="form-control mb-2"></textarea>

<input v-model="reportData.spec" placeholder="Specification" class="form-control mb-2">
<input v-model="reportData.testName" placeholder="Test Name" class="form-control mb-2">

<select v-model="reportData.result" class="form-control mb-2">
<option>Passed</option>
<option>Failed</option>
<option>Completed</option>
</select>

<label>Reported By</label>
<input value="Admin" readonly class="form-control mb-2">

<label>Approved By</label>
<input value="Superadmin" readonly class="form-control mb-2">

<input type="file" @change="handlePostFile" class="form-control mb-2">

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

data(){
return{
requests:[],
dailyData:null,
reportData:null,
photo:null,
postFile:null
}
},

computed:{
filteredRequests(){
return this.requests.filter(r=>r.status==="Allocated");
},

yetToCover(){
if(!this.dailyData) return 0;
return (this.dailyData.targetCycles||0)-(this.dailyData.currentReading||0);
}
},

mounted(){
this.load();
},

methods:{

async load(){
const res=await axios.get("http://localhost:5000/api/requests");
this.requests=res.data;
},

openDaily(r){this.dailyData={...r};},
openReport(r){this.reportData={...r};},

handlePhoto(e){this.photo=e.target.files[0];},
handlePostFile(e){this.postFile=e.target.files[0];},

submitDaily(){
alert("Monitoring Saved");
this.dailyData=null;
},

submitReport(){
alert("Report Saved");
this.reportData=null;
},

printSheet(){
window.print();
},

printReport(){
window.print();
}

}
};
</script>

<style>
.modal{
position:fixed;
top:0;left:0;
width:100%;height:100%;
background:rgba(0,0,0,0.6);
display:flex;
justify-content:center;
align-items:center;
}

.box{
background:white;
padding:20px;
width:500px;
}

.big{
width:900px;
max-height:90vh;
overflow:auto;
}
</style>