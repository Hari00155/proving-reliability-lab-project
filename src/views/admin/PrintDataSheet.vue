<template>
  <div class="container mt-4" style="max-width:700px">
    <h2>🖨 Print / Download Datasheet</h2>
    <p class="text-muted mb-4">Search by Request No or PL No to print or download a Proving Test Data Sheet.</p>

    <!-- SEARCH BAR -->
    <div class="card p-4 mb-4 shadow-sm">
      <div class="row g-2 align-items-end">
        <div class="col-md-5">
          <label class="form-label fw-semibold">Request No</label>
          <input v-model="searchReqNo" class="form-control" placeholder="e.g. REQ-2024-00001"
                 @keyup.enter="search" />
        </div>
        <div class="col-md-1 text-center pt-3"><span class="text-muted">OR</span></div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">PL No</label>
          <input v-model="searchPlNo" class="form-control" placeholder="e.g. 00023"
                 @keyup.enter="search" />
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" @click="search">🔍 Search</button>
        </div>
      </div>
    </div>

    <!-- NO RESULT -->
    <div v-if="searched && !result" class="alert alert-warning">
      ❌ No Datasheet found for the given Request No / PL No. Make sure Monitoring has been saved first.
    </div>

    <!-- RESULT CARD -->
    <div v-if="result" class="card p-4 shadow-sm">
      <h5 class="mb-3 text-primary">📘 Datasheet Found</h5>
      <table class="table table-bordered table-sm mb-3">
        <tbody>
          <tr><th>Request No</th><td>{{ result.requestNo }}</td></tr>
          <tr><th>PL No</th><td>{{ result.plNo }}</td></tr>
          <tr><th>Part No</th><td>{{ result.partNo }}</td></tr>
          <tr><th>Customer</th><td>{{ result.customer }}</td></tr>
          <tr><th>Test Type</th><td>{{ result.testType || result.purpose }}</td></tr>
          <tr><th>Equipment</th><td>{{ result.equipmentName }} <span v-if="result.equipmentNo">({{ result.equipmentNo }})</span></td></tr>
          <tr><th>Test Started</th><td>{{ result.testStartedOn || '-' }}</td></tr>
          <tr><th>Test Completed</th><td>{{ result.testCompletedOn || '-' }}</td></tr>
          <tr><th>Initial Counter</th><td>{{ result.initialReading || '-' }}</td></tr>
          <tr><th>Target Cycle</th><td>{{ result.targetCycle || '-' }}</td></tr>
        </tbody>
      </table>
      <!-- ✅ Print & Download as separate clearly labelled buttons -->
      <div class="d-flex gap-3">
        <button class="btn btn-info" @click="printDatasheet">🖨 Print Datasheet (A4 Landscape)</button>
        <button class="btn btn-outline-danger" style="border:1px solid #e53935;color:#e53935;"
                @click="printDatasheet">⬇ Download PDF</button>
      </div>
      <p class="text-muted mt-2" style="font-size:12px;">
        ℹ️ Both Print and Download open the browser print dialog — use "Save as PDF" in the dialog to download.
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const API = 'http://localhost:5000/api'

export default {
  name: 'DatasheetPrint',
  data() {
    return {
      searchReqNo: '',
      searchPlNo: '',
      searched: false,
      result: null,
      allMonitoring: [],
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        const monRes = await axios.get(`${API}/dailyupdates`)
        this.allMonitoring = monRes.data || []
      } catch (err) {
        console.warn('DB fetch failed, using localStorage fallback:', err)
        // Fallback: load from localStorage monitoring cache
        const mc = localStorage.getItem('monitoringCache')
        if (mc) {
          try {
            const cache = JSON.parse(mc)
            this.allMonitoring = Object.values(cache)
          } catch(e) { console.warn('Cache parse error', e) }
        }
      }
    },

    search() {
      this.searched = true
      this.result = null

      const reqNo = this.searchReqNo.trim()
      const plNo = this.searchPlNo.trim()

      if (!reqNo && !plNo) {
        alert('Please enter a Request No or PL No.')
        return
      }

      // Search in-memory (from DB or cache)
      if (this.allMonitoring.length) {
        const found = this.allMonitoring.find(m => {
          if (reqNo && (m.requestNo || '').toLowerCase() === reqNo.toLowerCase()) return true
          if (plNo && (m.plNo || '').toLowerCase() === plNo.toLowerCase()) return true
          return false
        })
        if (found) { this.result = found; return }
      }

      // Final fallback: check localStorage directly
      const raw = localStorage.getItem('monitoringCache')
      if (raw) {
        try {
          const cache = JSON.parse(raw)
          for (const key of Object.keys(cache)) {
            const m = cache[key]
            if (reqNo && (m.requestNo || '').toLowerCase() === reqNo.toLowerCase()) { this.result = m; return }
            if (plNo && (m.plNo || '').toLowerCase() === plNo.toLowerCase()) { this.result = m; return }
          }
        } catch(e) {}
      }
    },

    // ✅ Full A4 Landscape Datasheet print with all monitoring fields
    printDatasheet() {
      const d = this.result
      if (!d) return
      const logo = window.location.origin + '/images/TVS.jpg'
      const finalCounter = (parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0)

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Proving Test Data Sheet - ${d.requestNo||''}</title>
<style>
  @page{size:A4 landscape;margin:12mm 14mm}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Times New Roman",Times,serif;font-size:13px;color:#000}
  table{width:100%;border-collapse:collapse}
  .th-org{vertical-align:top;width:200px;font-size:13px;line-height:1.6}
  .th-title{text-align:center;vertical-align:middle}
  .th-title h1{font-size:20px;font-weight:bold;letter-spacing:0.5px}
  .th-logo{text-align:right;vertical-align:top;width:110px}
  .main td{border:1px solid #000;padding:7px 10px;vertical-align:top;font-size:13px}
  .lbl{font-weight:bold}
  .rc{width:225px}
  .foot{margin-top:16px;display:flex;justify-content:space-between;font-size:11.5px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head><body>
<table style="border:none;margin-bottom:20px;"><tr>
  <td class="th-org" style="border:none;">Lucas-TVS LTD.<br/>Proving &amp; Reliability Lab</td>
  <td class="th-title" style="border:none;"><h1>PROVING TEST DATA SHEET</h1></td>
  <td class="th-logo" style="border:none;"><img src="${logo}" height="65"/></td>
</tr></table>

<table class="main">
  <tr>
    <td colspan="3"><span class="lbl">Test Equipment :</span> ${d.equipmentName||''}</td>
    <td class="rc"><span class="lbl">Equip.No :</span> ${d.equipmentNo||''}</td>
  </tr>
  <tr>
    <td colspan="3">
      <span class="lbl">Product/Component :</span> ${d.description||d.partNo||''}<br/>
      <span class="lbl">Test Type / Purpose :</span> ${d.purpose||d.testType||''}&nbsp;&nbsp;
      <span class="lbl">Cust/Appln :</span> ${d.customer||''}&nbsp;&nbsp;
      <span class="lbl">No of Samples :</span> ${d.samples||''}
    </td>
    <td class="rc">
      <span class="lbl">PL.No :</span> ${d.plNo||''}<br/>
      <span class="lbl">Request No :</span> ${d.requestNo||''}<br/>
      <span class="lbl">Date :</span> ${d.date||''}<br/>
      <span class="lbl">Request Date :</span> ${d.requestDate||''}
    </td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Standard / Spec :</span> ${d.standard||''}</td>
    <td class="rc"><span class="lbl">Test Started On :</span> ${d.testStartedOn||''}</td>
  </tr>
  <tr>
    <td colspan="3" rowspan="2" style="white-space:pre-wrap;">
      <span class="lbl">Test Details :</span><br/>${d.testDetails||''}
    </td>
    <td class="rc"><span class="lbl">Initial Hourmeter/Counter :</span> ${d.initialReading||''}</td>
  </tr>
  <tr>
    <td class="rc"><span class="lbl">Test Completed On :</span> ${d.testCompletedOn||''}</td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Purpose Of The Test :</span> ${d.purpose||''}</td>
    <td class="rc"><span class="lbl">Final Hourmeter/Counter :</span> ${finalCounter}</td>
  </tr>
  <tr>
    <td colspan="4"><span class="lbl">Tryout Details :</span><br/>${d.remarks||''}</td>
  </tr>
  <tr>
    <td colspan="4"><span class="lbl">Acceptance Criteria :</span> ${d.acceptanceCriteria||''}</td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Test Results :</span><br/>${d.testResults||''}</td>
    <td class="rc">
      <span class="lbl">Responsibility :</span> ${d.responsibility||''}<br/>
      <span class="lbl">Requested By :</span> ${d.requestedBy||''}
    </td>
  </tr>
</table>
<div class="foot">
  <span>FORM NO: J21 - 02</span>
  <span>RETENTION PERIOD : 3 YEARS</span>
</div>
</body></html>`

      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 400)
    },
  },
}
</script>

<style scoped>
h2 { font-weight: bold; color: #2c3e50; }
.card { border-radius: 8px; }
</style>