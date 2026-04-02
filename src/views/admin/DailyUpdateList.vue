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

    <!-- MONITORING -->
    <div v-if="monitoring" class="modal-overlay">
      <div class="modal-box">

        <h4>📘 Monitoring Sheet Entry</h4>

        <input v-model="monitoring.plNo" class="form-control mb-2" readonly/>
        <input v-model="monitoring.equipmentNo" class="form-control mb-2"/>
        <input type="date" v-model="monitoring.date" class="form-control mb-2"/>

        <input v-model="monitoring.targetCycle" class="form-control mb-2"/>
        <input v-model="monitoring.currentReading" class="form-control mb-2"/>
        <input v-model="monitoring.initialReading" class="form-control mb-2"/>

        <input :value="yetToCover" class="form-control mb-2" readonly/>

        <textarea v-model="monitoring.remarks" class="form-control mb-2"></textarea>

        <input type="file" @change="handlePhoto" class="form-control mb-2"/>

        <button class="btn btn-info" @click="printSheet('monitoring')">🖨 Print</button>
        <button class="btn btn-success" @click="submitDaily">Submit</button>
        <button class="btn btn-secondary" @click="monitoring=null">Close</button>

      </div>
    </div>

    <!-- REPORT -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large">

        <h4>📄 Report Preparation</h4>

        <input v-model="report.plNo" class="form-control mb-2" readonly/>
        <input v-model="report.reqNo" class="form-control mb-2" readonly/>
        <input v-model="report.partNo" class="form-control mb-2" readonly/>

        <input v-model="report.product" class="form-control mb-2"/>
        <input v-model="report.testType" class="form-control mb-2"/>
        <input v-model="report.category" class="form-control mb-2"/>

        <textarea v-model="report.testDetails" class="form-control mb-2"></textarea>
        <textarea v-model="report.criteria" class="form-control mb-2"></textarea>
        <textarea v-model="report.observation" class="form-control mb-2"></textarea>
        <textarea v-model="report.conclusion" class="form-control mb-2"></textarea>

        <select v-model="report.result" class="form-control mb-2">
          <option>Passed</option>
          <option>Failed</option>
          <option>Completed</option>
        </select>

        <input value="Admin" class="form-control mb-2" readonly/>
        <input value="Superadmin" class="form-control mb-2" readonly/>

        <input type="file" @change="handleSign1" class="form-control mb-2"/>
        <input type="file" @change="handleSign2" class="form-control mb-2"/>

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
      photo:null,
      sign1:null,
      sign2:null
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
        equipmentNo:r.testRig || "",
        date:"",
        targetCycle:r.targetCycle || "",
        currentReading:"",
        initialReading:r.initialReading || "",
        remarks:""
      };
    },

    openReport(r){
      this.report = {
        plNo:r.allocationPlNo,
        reqNo:r.requestNo,
        partNo:r.partNo,
        product:r.product || "",
        testType:r.testType || "",
        category:r.category || "",
        testDetails:r.testDetails || "",
        criteria:"",
        observation:"",
        conclusion:"",
        result:"Passed"
      };
    },

    handlePhoto(e){ this.photo = e.target.files[0]; },
    handleSign1(e){ this.sign1 = e.target.files[0]; },
    handleSign2(e){ this.sign2 = e.target.files[0]; },

    async submitDaily(){
      const form = new FormData();
      Object.keys(this.monitoring).forEach(k=>{
        form.append(k,this.monitoring[k]);
      });
      form.append("photo",this.photo);

      await axios.post("http://localhost:5000/api/dailyupdates",form);
      alert("Saved ✅");
      this.monitoring=null;
    },

    async submitReport(){
      const form = new FormData();
      Object.keys(this.report).forEach(k=>{
        form.append(k,this.report[k]);
      });

      form.append("signatureReported",this.sign1);
      form.append("signatureApproved",this.sign2);

      await axios.post("http://localhost:5000/api/reports",form);
      alert("Report Saved ✅");
      this.report=null;
    },

    // ✅ FINAL PRINT FIX
    printSheet(type){

      let data = type === "report" ? this.report : this.monitoring;

      const sign1URL = this.sign1 ? URL.createObjectURL(this.sign1) : "";
      const sign2URL = this.sign2 ? URL.createObjectURL(this.sign2) : "";

      const html = `
      <html>
      <head>
        <style>
          body{font-family:Arial;padding:30px;}
          h2{text-align:center;}
          table{width:100%;border-collapse:collapse;margin-top:20px;}
          td{border:1px solid #000;padding:8px;}
          .label{font-weight:bold;background:#f2f2f2;width:30%;}
        </style>
      </head>
      <body>

      <h2>${type==="report"?"TEST REPORT":"MONITORING SHEET"}</h2>

      <table>
      ${
        type==="report"
        ?`
        <tr><td class="label">PL No</td><td>${data.plNo}</td></tr>
        <tr><td class="label">Request No</td><td>${data.reqNo}</td></tr>
        <tr><td class="label">Part No</td><td>${data.partNo}</td></tr>
        <tr><td class="label">Product</td><td>${data.product}</td></tr>
        <tr><td class="label">Test Type</td><td>${data.testType}</td></tr>
        <tr><td class="label">Category</td><td>${data.category}</td></tr>
        <tr><td class="label">Test Details</td><td>${data.testDetails}</td></tr>
        <tr><td class="label">Acceptance Criteria</td><td>${data.criteria}</td></tr>
        <tr><td class="label">Observation</td><td>${data.observation}</td></tr>
        <tr><td class="label">Conclusion</td><td>${data.conclusion}</td></tr>
        <tr><td class="label">Result</td><td>${data.result}</td></tr>
        `
        :
        `
        <tr><td class="label">PL No</td><td>${data.plNo}</td></tr>
        <tr><td class="label">Equipment</td><td>${data.equipmentNo}</td></tr>
        <tr><td class="label">Date</td><td>${data.date}</td></tr>
        <tr><td class="label">Target Cycle</td><td>${data.targetCycle}</td></tr>
        <tr><td class="label">Current Reading</td><td>${data.currentReading}</td></tr>
        <tr><td class="label">Initial Reading</td><td>${data.initialReading}</td></tr>
        <tr><td class="label">Yet To Cover</td><td>${this.yetToCover}</td></tr>
        <tr><td class="label">Remarks</td><td>${data.remarks}</td></tr>
        `
      }
      </table>

      <table style="margin-top:50px;">
        <tr>
          <td style="text-align:center;">
            ${sign1URL ? `<img src="${sign1URL}" height="60"/>` : ""}
            <br/>Reported By<br/>Admin
          </td>
          <td style="text-align:center;">
            ${sign2URL ? `<img src="${sign2URL}" height="60"/>` : ""}
            <br/>Approved By<br/>Superadmin
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