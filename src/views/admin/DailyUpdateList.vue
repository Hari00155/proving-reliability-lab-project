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
        <tr v-for="(r, i) in requests" :key="r.id">
          <td>{{ i + 1 }}</td>
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
        <h4>📘 Monitoring Sheet</h4>

        <input v-model="monitoring.plNo" class="form-control mb-2" readonly />
        <input
          v-model="monitoring.equipmentName"
          class="form-control mb-2"
          placeholder="Equipment Name"
        />
        <input
          v-model="monitoring.equipmentNo"
          class="form-control mb-2"
          placeholder="Equipment No"
        />
        <input type="date" v-model="monitoring.date" class="form-control mb-2" />
        <input v-model="monitoring.targetCycle" class="form-control mb-2" placeholder="Target" />
        <input
          v-model="monitoring.currentReading"
          class="form-control mb-2"
          placeholder="Current"
        />
        <input
          v-model="monitoring.initialReading"
          class="form-control mb-2"
          placeholder="Initial"
        />

        <input :value="yetToCover" class="form-control mb-2" readonly placeholder="Balance" />

        <textarea
          v-model="monitoring.remarks"
          class="form-control mb-2"
          placeholder="Remarks"
        ></textarea>

        <button class="btn btn-info" @click="printSheet('monitoring')">🖨 Print</button>
        <button class="btn btn-success" @click="submitDaily">Save</button>
        <button class="btn btn-secondary" @click="monitoring = null">Close</button>
      </div>
    </div>

    <!-- REPORT -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large">
        <h4>📄 Report</h4>

        <input v-model="report.plNo" class="form-control mb-2" readonly />
        <input v-model="report.reqNo" class="form-control mb-2" readonly />
        <input v-model="report.partNo" class="form-control mb-2" readonly />
        <input v-model="report.description" class="form-control mb-2" readonly />
        <input v-model="report.customer" class="form-control mb-2" readonly />

        <textarea v-model="report.testDetails" class="form-control mb-2" readonly></textarea>

        <textarea
          v-model="report.criteria"
          class="form-control mb-2"
          placeholder="Criteria"
        ></textarea>
        <textarea
          v-model="report.observation"
          class="form-control mb-2"
          placeholder="Observation"
        ></textarea>
        <textarea
          v-model="report.conclusion"
          class="form-control mb-2"
          placeholder="Conclusion"
        ></textarea>

        <select v-model="report.result" class="form-control mb-2">
          <option>Passed</option>
          <option>Failed</option>
          <option>Completed</option>
        </select>

        <label>Reported Signature</label>
        <input
          type="file"
          @change="(e) => (signReported = e.target.files[0])"
          class="form-control mb-2"
        />

        <label>Approved Signature</label>
        <input
          type="file"
          @change="(e) => (signApproved = e.target.files[0])"
          class="form-control mb-2"
        />

        <button class="btn btn-primary" @click="printSheet('report')">🖨 Print</button>
        <button class="btn btn-danger" @click="downloadPDF('report')">⬇ PDF</button>
        <button class="btn btn-success" @click="submitReport">Save</button>
        <button class="btn btn-secondary" @click="report = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      requests: [],
      monitoring: null,
      report: null,
      signReported: null,
      signApproved: null,
    }
  },

  computed: {
    yetToCover() {
      if (!this.monitoring) return 0
      return this.monitoring.targetCycle - this.monitoring.currentReading
    },
  },

  mounted() {
    this.load()
  },

  methods: {
    async load() {
      const res = await axios.get('http://localhost:5000/api/requests')
      this.requests = res.data
    },

    openMonitoring(r) {
      this.monitoring = {
        plNo: r.allocationPlNo,
        equipmentName: '',
        equipmentNo: '',
        requestNo: r.requestNo,
        partNo: r.partNo,
        testDetails: r.testDetails,
        date: '',
        targetCycle: '',
        currentReading: '',
        initialReading: '',
        remarks: '',
      }
    },

    openReport(r) {
      this.report = {
        plNo: r.allocationPlNo,
        reqNo: r.requestNo,
        partNo: r.partNo,
        description: r.description,
        customer: r.customer,
        testDetails: r.testDetails,
        criteria: '',
        observation: '',
        conclusion: '',
        result: 'Passed',
      }
    },

    async submitDaily() {
      await axios.post('http://localhost:5000/api/dailyupdates', this.monitoring)
      alert('Saved')
      this.monitoring = null
    },

    async submitReport() {
      const form = new FormData()

      Object.keys(this.report).forEach((k) => {
        form.append(k, this.report[k])
      })

      form.append('signatureReported', this.signReported)
      form.append('signatureApproved', this.signApproved)

      await axios.post('http://localhost:5000/api/reports', form)

      alert('Saved')
      this.report = null
    },

    downloadPDF(type) {
      this.printSheet(type)
    },
    printSheet(type) {
      const logo = window.location.origin + '/images/TVS.jpg'

      // ================= REPORT (BOX FORMAT) =================
      if (type === 'report') {
        let d = this.report

        const html = `
    <html>
    <head>
    <style>
      @page { size:A4; margin:10mm; }
      body { font-family:"Times New Roman"; font-size:13px; }

      table { width:100%; border-collapse:collapse; }
      td { border:1px solid black; padding:6px; vertical-align:top; }

      .no-border td { border:none; }

      h2 { text-align:center; margin:5px 0; }
      .center { text-align:center; }
    </style>
    </head>

    <body>

    <table class="no-border">
      <tr>
        <td width="20%"><img src="${logo}" height="70"/></td>
        <td class="center">
          <h2>PROVING TEST REPORT</h2>
          Lucas TVS Ltd.<br>
          Engineering Center Proving Lab
        </td>
        <td width="20%"></td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Report No</td><td>${d.reportNo || ''}</td>
        <td>Request No</td><td>${d.reqNo}</td>
        <td>PL No</td><td>${d.plNo}</td>
        <td>Date</td><td>${new Date().toLocaleDateString()}</td>
      </tr>
    </table>

    <table>
      <tr>
        <td width="20%">Product</td>
        <td>${d.description}</td>
        <td width="20%">Part Number</td>
        <td>${d.partNo}</td>
      </tr>

      <tr>
        <td>Cust/Appln</td>
        <td>${d.customer}</td>
        <td>Component</td>
        <td></td>
      </tr>

      <tr>
        <td>Test</td>
        <td colspan="3">${d.testName || ''}</td>
      </tr>

      <tr>
        <td>Special Features</td>
        <td colspan="3">${d.special || ''}</td>
      </tr>

      <tr>
        <td>Purpose Of The Test</td>
        <td colspan="3">${d.category || ''}</td>
      </tr>

      <tr>
        <td>Test Type</td>
        <td>${d.testType || ''}</td>
        <td>No Of Samples</td>
        <td>${d.samples || ''}</td>
      </tr>

      <tr>
        <td>Test Equipment</td>
        <td colspan="3">${d.spec || ''}</td>
      </tr>

      <tr>
        <td>Spec/Test Details</td>
        <td colspan="3">${d.testDetails}</td>
      </tr>

      <tr>
        <td>Acceptance Criteria</td>
        <td colspan="3">${d.criteria}</td>
      </tr>

      <tr>
        <td>Observation</td>
        <td colspan="3">${d.observation}</td>
      </tr>

      <tr>
        <td>Conclusion</td>
        <td colspan="3">${d.conclusion}</td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Reported By</td>
        <td>____________</td>
        <td>Approved By</td>
        <td>____________</td>
      </tr>

      <tr>
        <td>Circulation</td>
        <td>Dev.Engg/file</td>
        <td>Requested By</td>
        <td></td>
      </tr>
    </table>

    <table class="no-border">
      <tr>
        <td>FORM NO: J21-03</td>
        <td style="text-align:right;">RETENTION PERIOD: 3 YEARS</td>
      </tr>
    </table>

    </body>
    </html>
    `

        const win = window.open('')
        win.document.write(html)
        win.document.close()
        win.print()
      }

      // ================= DATASHEET (EXACT BOX FORMAT) =================
      if (type === 'monitoring') {
        let d = this.monitoring

        const html = `
    <html>
    <head>
    <style>
      @page { size:A4 landscape; margin:10mm; }
      body { font-family:"Times New Roman"; font-size:13px; }

      table { width:100%; border-collapse:collapse; }
      td { border:1px solid black; padding:6px; vertical-align:top; }

      .no-border td { border:none; }
      h2 { text-align:center; }
    </style>
    </head>

    <body>

    <table class="no-border">
      <tr>
        <td width="20%">
          Lucas TVS Ltd.<br>
          Proving & Reliability Lab
        </td>
        <td class="center"><h2>PROVING TEST DATA SHEET</h2></td>
        <td width="20%"><img src="${logo}" height="70"/></td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Test Equipment</td>
        <td>${d.equipmentName}</td>
        <td>Equip.No</td>
        <td>${d.equipmentNo}</td>
      </tr>

      <tr>
        <td colspan="2">Product/Component: ${d.partNo}</td>
        <td>PL.No: ${d.plNo}</td>
        <td>Request No: ${d.requestNo}</td>
      </tr>

      <tr>
        <td colspan="2">Test Type:</td>
        <td>Request Date: ${d.date}</td>
        <td>Test Started On: ${d.date}</td>
      </tr>

      <tr>
        <td colspan="2">Standard Spec:</td>
        <td>Initial Counter: ${d.initialReading}</td>
        <td>Test Completed On:</td>
      </tr>

      <tr>
        <td colspan="4">
          <b>Test Details:</b><br>${d.testDetails}
        </td>
      </tr>

      <tr>
        <td colspan="2">Purpose Of The Test: ${d.remarks}</td>
        <td colspan="2">Final Counter: ${d.targetCycle - d.currentReading}</td>
      </tr>

      <tr>
        <td colspan="4">
          Acceptance Criteria:
        </td>
      </tr>

      <tr>
        <td colspan="2">Test Results:</td>
        <td>Responsibility:</td>
        <td>Requested By:</td>
      </tr>
    </table>

    <table class="no-border">
      <tr>
        <td>FORM NO: J21-02</td>
        <td style="text-align:right;">RETENTION PERIOD: 3 YEARS</td>
      </tr>
    </table>

    </body>
    </html>
    `

        const win = window.open('')
        win.document.write(html)
        win.document.close()
        win.print()
      }
    },
  },
}
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-box {
  background: #fff;
  padding: 20px;
  width: 500px;
  margin: 50px auto;
}

.large {
  width: 700px;
}
</style>
