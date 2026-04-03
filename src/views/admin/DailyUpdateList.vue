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
          <th>User</th>
          <th>Part No</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(r,i) in requests" :key="r.id">
          <td>{{ i+1 }}</td>
          <td>{{ r.requestNo }}</td>
          <td>{{ r.allocationPlNo }}</td>
          <td>{{ r.userName }}</td>
          <td>{{ r.partNo }}</td>
          <td>{{ r.status }}</td>

          <td>
            <button class="btn btn-primary btn-sm" @click="openMonitoring(r)">Monitoring</button>
            <button class="btn btn-warning btn-sm" @click="openReport(r)">Report</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ================= MONITORING ================= -->
    <div v-if="monitoring" class="modal-overlay">
      <div class="modal-box">

        <h4>📘 Monitoring Sheet Entry</h4>

        <label>PL No</label>
        <input v-model="monitoring.plNo" class="form-control mb-2" readonly/>

        <label>Equipment Name</label>
        <input v-model="monitoring.equipmentName" class="form-control mb-2"/>

        <label>Equipment No</label>
        <input v-model="monitoring.equipmentNo" class="form-control mb-2"/>

        <label>Date</label>
        <input type="date" v-model="monitoring.date" class="form-control mb-2"/>

        <label>Target Cycle</label>
        <input v-model="monitoring.targetCycle" class="form-control mb-2"/>

        <label>Current Reading</label>
        <input v-model="monitoring.currentReading" class="form-control mb-2"/>

        <label>Initial Reading</label>
        <input v-model="monitoring.initialReading" class="form-control mb-2"/>

        <label>Yet To Cover</label>
        <input :value="yetToCover" class="form-control mb-2" readonly/>

        <label>Purpose / Remarks</label>
        <textarea v-model="monitoring.remarks" class="form-control mb-2"></textarea>

        <button class="btn btn-info" @click="printSheet('monitoring')">🖨 Print Data Sheet</button>
        <button class="btn btn-success" @click="submitDaily">Submit</button>
        <button class="btn btn-secondary" @click="monitoring=null">Close</button>

      </div>
    </div>

    <!-- ================= REPORT ================= -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large">

        <h4>📄 Report Preparation</h4>

        <!-- REQUEST DETAILS -->
        <label>PL No</label>
        <input v-model="report.plNo" class="form-control mb-2" readonly/>

        <label>Request No</label>
        <input v-model="report.reqNo" class="form-control mb-2" readonly/>

        <label>Part No</label>
        <input v-model="report.partNo" class="form-control mb-2" readonly/>

        <label>Description</label>
        <input v-model="report.description" class="form-control mb-2" readonly/>

        <label>Platform Code</label>
        <input v-model="report.platformCode" class="form-control mb-2" readonly/>

        <label>Product Code</label>
        <input v-model="report.productCode" class="form-control mb-2" readonly/>

        <label>Customer</label>
        <input v-model="report.customer" class="form-control mb-2" readonly/>

        <label>Samples</label>
        <input v-model="report.samples" class="form-control mb-2" readonly/>

        <label>Test Type</label>
        <input v-model="report.testType" class="form-control mb-2" readonly/>

        <label>Category</label>
        <input v-model="report.category" class="form-control mb-2" readonly/>

        <label>Test Details</label>
        <textarea v-model="report.testDetails" class="form-control mb-2" readonly></textarea>

        <label>Special</label>
        <textarea v-model="report.special" class="form-control mb-2" readonly></textarea>

        <label>Spec</label>
        <input v-model="report.spec" class="form-control mb-2" readonly/>

        <label>Test Name</label>
        <input v-model="report.testName" class="form-control mb-2" readonly/>

        <!-- REPORT ENTRY -->
        <label>Acceptance Criteria</label>
        <textarea v-model="report.criteria" class="form-control mb-2"></textarea>

        <label>Observation</label>
        <textarea v-model="report.observation" class="form-control mb-2"></textarea>

        <label>Conclusion</label>
        <textarea v-model="report.conclusion" class="form-control mb-2"></textarea>

        <label>Result</label>
        <select v-model="report.result" class="form-control mb-2">
          <option>Passed</option>
          <option>Failed</option>
          <option>Completed</option>
        </select>

        <!-- SIGNATURE -->
        <label>Reported By</label>
        <input value="Admin" class="form-control mb-2" readonly/>

        <label>Reported Signature</label>
        <input type="file" @change="e=>signReported=e.target.files[0]" class="form-control mb-2"/>

        <label>Approved By</label>
        <input value="Superadmin" class="form-control mb-2" readonly/>

        <label>Approved Signature</label>
        <input type="file" @change="e=>signApproved=e.target.files[0]" class="form-control mb-2"/>

        <button class="btn btn-primary" @click="printSheet('report')">🖨 Print</button>
        <button class="btn btn-success" @click="submitReport">Submit</button>
        <button class="btn btn-secondary" @click="report=null">Close</button>

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
      monitoring:null,
      report:null,
      signReported:null,
      signApproved:null
    }
  },

  computed:{
    yetToCover(){
      if(!this.monitoring) return 0;
      return this.monitoring.targetCycle - this.monitoring.currentReading;
    }
  },

  mounted(){
    this.load();
  },

  methods:{

    async load(){
      const res = await axios.get("http://localhost:5000/api/requests");
      this.requests = res.data;
    },

    openMonitoring(r){
      this.monitoring = {
        plNo:r.allocationPlNo,
        equipmentName:r.equipmentName || "TEST RIG",
        equipmentNo:r.testRig || "",
        requestNo:r.requestNo,
        partNo:r.partNo,
        customer:r.customer,
        testType:r.testType,
        samples:r.samples,
        testDetails:r.testDetails,
        date:"",
        targetCycle:"",
        currentReading:"",
        initialReading:"",
        remarks:""
      };
    },

    openReport(r){
      this.report = {
        plNo:r.allocationPlNo,
        reqNo:r.requestNo,
        partNo:r.partNo,
        description:r.description,
        platformCode:r.platformCode,
        productCode:r.productCode,
        customer:r.customer,
        samples:r.samples,
        testType:r.testType,
        category:r.category,
        testDetails:r.testDetails,
        special:r.special,
        spec:r.spec,
        testName:r.testName,
        criteria:"",
        observation:"",
        conclusion:"",
        result:"Passed"
      };
    },

    async submitDaily(){
      await axios.post("http://localhost:5000/api/dailyupdates",this.monitoring);
      alert("Saved ✅");
      this.monitoring=null;
    },

    async submitReport(){
      const form = new FormData();

      Object.keys(this.report).forEach(k=>{
        form.append(k,this.report[k]);
      });

      form.append("signatureReported", this.signReported);
      form.append("signatureApproved", this.signApproved);

      await axios.post("http://localhost:5000/api/reports", form);

      alert("Report Saved ✅");
      this.report=null;
    },

    printSheet(type){

      if(type === "report"){
        let d = this.report;

        const sign1 = this.signReported ? URL.createObjectURL(this.signReported) : "";
        const sign2 = this.signApproved ? URL.createObjectURL(this.signApproved) : "";

        const html = `
        <html>
        <body style="font-family:Arial;padding:20px;">

        <h2 style="text-align:center;">TEST REPORT</h2>

        <table border="1" width="100%" cellspacing="0" cellpadding="5">
          <tr><td><b>PL No</b></td><td>${d.plNo}</td></tr>
          <tr><td><b>Request No</b></td><td>${d.reqNo}</td></tr>
          <tr><td><b>Part No</b></td><td>${d.partNo}</td></tr>
          <tr><td><b>Description</b></td><td>${d.description}</td></tr>
          <tr><td><b>Customer</b></td><td>${d.customer}</td></tr>
          <tr><td><b>Test Details</b></td><td>${d.testDetails}</td></tr>
          <tr><td><b>Acceptance Criteria</b></td><td>${d.criteria}</td></tr>
          <tr><td><b>Observation</b></td><td>${d.observation}</td></tr>
          <tr><td><b>Conclusion</b></td><td>${d.conclusion}</td></tr>
          <tr><td><b>Result</b></td><td>${d.result}</td></tr>
        </table>

        <br><br>

        <table width="100%">
          <tr>
            <td align="center">
              ${sign1 ? `<img src="${sign1}" height="60"/>` : ""}
              <br>Reported By<br>Admin
            </td>
            <td align="center">
              ${sign2 ? `<img src="${sign2}" height="60"/>` : ""}
              <br>Approved By<br>Superadmin
            </td>
          </tr>
        </table>

        </body>
        </html>
        `;

        const win = window.open("", "", "width=900,height=700");
        win.document.write(html);
        win.document.close();
        win.print();
      }
    }

  }
};
</script>

<style>
.modal-overlay{
  position:fixed;
  top:0;left:0;
  width:100%;height:100%;
  background:rgba(0,0,0,0.5);
}

.modal-box{
  background:#fff;
  padding:20px;
  width:500px;
  margin:50px auto;
}

.large{ width:700px; }
</style>