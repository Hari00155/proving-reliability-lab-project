<template>
  <div class="container mt-4">
    <h2>📦 Daily Update - Archive</h2>

    <!-- YEAR FILTER -->
    <div class="row mb-3">
      <div class="col-md-3">
        <select v-model="selectedYear" class="form-control">
          <option value="">All Previous Years</option>
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="load">🔄 Refresh</button>
      </div>
    </div>

    <!-- TABLE -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Req No</th>
          <th>PL No</th>
          <th>User</th>
          <th>Part No</th>
          <th>Year</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in filteredRequests" :key="r.id">
          <td>{{ i + 1 }}</td>
          <td>{{ r.requestNo }}</td>
          <td>{{ r.allocationPlNo }}</td>
          <td>{{ r.userName }}</td>
          <td>{{ r.partNo }}</td>
          <td>{{ r.date ? new Date(r.date).getFullYear() : '-' }}</td>
          <td>{{ r.status }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-1" @click="openMonitoring(r)">
              Monitoring
            </button>
            <button class="btn btn-warning btn-sm me-1" @click="openReport(r)">Report</button>

            <!-- EDIT MONITORING -->
            <button
              v-if="hasMonitoring(r.requestNo)"
              class="btn btn-outline-secondary btn-sm me-1"
              @click="editMonitoring(r)"
            >
              ✏ Edit Mon.
            </button>

            <!-- DELETE MONITORING -->
            <button
              v-if="hasMonitoring(r.requestNo)"
              class="btn btn-outline-danger btn-sm me-1"
              @click="confirmDeleteMonitoring(r.requestNo)"
            >
              🗑 Del Mon.
            </button>

            <!-- EDIT REPORT -->
            <button
              v-if="hasReport(r.requestNo)"
              class="btn btn-outline-secondary btn-sm me-1"
              @click="editReport(r)"
            >
              ✏ Edit Rep.
            </button>

            <!-- DELETE REPORT -->
            <button
              v-if="hasReport(r.requestNo)"
              class="btn btn-outline-danger btn-sm"
              @click="confirmDeleteReport(r.requestNo)"
            >
              🗑 Del Rep.
            </button>
          </td>
        </tr>
        <tr v-if="filteredRequests.length === 0">
          <td colspan="8" class="text-center text-muted py-4">
            No archive records found ❌
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ===== DELETE CONFIRM MODAL ===== -->
    <div v-if="deleteModal.show" class="modal-overlay">
      <div class="modal-box" style="width: 420px; text-align: center">
        <div style="font-size: 48px">⚠️</div>
        <h5 class="mt-2 mb-2">Confirm Delete</h5>
        <p class="mb-3">
          Are you sure you want to delete the
          <strong>{{ deleteModal.type === 'monitoring' ? 'Monitoring' : 'Report' }}</strong>
          for Request No: <strong>{{ deleteModal.requestNo }}</strong>?
          <br /><span style="color: #c00; font-size: 12px">This action cannot be undone.</span>
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-danger" @click="executeDelete">Yes, Delete</button>
          <button class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ===== MONITORING MODAL ===== -->
    <div v-if="monitoring" class="modal-overlay">
      <div class="modal-box" style="max-height: 90vh; overflow-y: auto">
        <h4>📘 {{ monitoringEditMode ? 'Edit' : 'New' }} Monitoring Sheet</h4>

        <label class="form-label">PL No</label>
        <input v-model="monitoring.plNo" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Equipment Name</label>
        <input v-model="monitoring.equipmentName" class="form-control mb-2" placeholder="Equipment Name" />

        <label class="form-label">Equipment No</label>
        <input v-model="monitoring.equipmentNo" class="form-control mb-2" placeholder="Equipment No" />

        <label class="form-label">Standard / Spec</label>
        <input v-model="monitoring.standard" class="form-control mb-2" placeholder="e.g. Spec As per M210216..." />

        <label class="form-label">Request Date</label>
        <input type="date" v-model="monitoring.requestDate" class="form-control mb-2" />

        <label class="form-label">Test Started On</label>
        <input type="date" v-model="monitoring.testStartedOn" class="form-control mb-2" />

        <label class="form-label">Test Completed On</label>
        <input type="date" v-model="monitoring.testCompletedOn" class="form-control mb-2" />

        <label class="form-label">Target Cycle / Final Counter</label>
        <input v-model="monitoring.targetCycle" class="form-control mb-2" placeholder="Target" />

        <label class="form-label">Initial Hourmeter / Counter</label>
        <input v-model="monitoring.initialReading" class="form-control mb-2" placeholder="Initial" />

        <label class="form-label">Current Reading</label>
        <input v-model="monitoring.currentReading" class="form-control mb-2" placeholder="Current" />

        <label class="form-label">Balance (Yet to Cover)</label>
        <input :value="yetToCover" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Purpose of The Test</label>
        <input v-model="monitoring.purpose" class="form-control mb-2" placeholder="Purpose" />

        <label class="form-label">Tryout Details / Remarks</label>
        <textarea v-model="monitoring.remarks" class="form-control mb-2" rows="2" placeholder="Tryout details..."></textarea>

        <label class="form-label">Acceptance Criteria</label>
        <textarea v-model="monitoring.acceptanceCriteria" class="form-control mb-2" rows="2" placeholder="Acceptance criteria..."></textarea>

        <label class="form-label">Test Results</label>
        <textarea v-model="monitoring.testResults" class="form-control mb-2" rows="2" placeholder="Test results..."></textarea>

        <label class="form-label">Responsibility</label>
        <input v-model="monitoring.responsibility" class="form-control mb-2" placeholder="Responsibility" />

        <label class="form-label">Requested By</label>
        <input v-model="monitoring.requestedBy" class="form-control mb-2" placeholder="Requested By" />

        <div class="d-flex gap-2 mt-2 flex-wrap">
          <button class="btn btn-info" @click="printSheet('monitoring')">🖨 Print Datasheet</button>
          <button class="btn btn-success" @click="submitDaily">
            {{ monitoringEditMode ? 'Update' : 'Save' }}
          </button>
          <button
            v-if="monitoringEditMode"
            class="btn btn-danger"
            @click="confirmDeleteMonitoring(monitoring.requestNo)"
          >
            🗑 Delete
          </button>
          <button class="btn btn-secondary" @click="monitoring = null">Close</button>
        </div>
      </div>
    </div>

    <!-- ===== REPORT MODAL ===== -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large" style="max-height: 90vh; overflow-y: auto">
        <h4>📄 {{ reportEditMode ? 'Edit' : 'New' }} Proving Test Report</h4>

        <!-- AUTO-FILLED FROM REQUEST -->
        <div class="section-header">📋 Request Details (Auto-filled)</div>

        <div class="row g-2 mb-2">
          <div class="col-4">
            <label class="form-label">Report No</label>
            <input v-model="report.reportNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Request No</label>
            <input v-model="report.reqNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-2">
            <label class="form-label">PL No</label>
            <input v-model="report.plNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-2">
            <label class="form-label">Date</label>
            <input v-model="report.date" class="form-control auto-field" readonly />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-8">
            <label class="form-label">Product / Description</label>
            <input v-model="report.description" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Part Number</label>
            <input v-model="report.partNo" class="form-control auto-field" readonly />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Cust / Appln</label>
            <input v-model="report.customer" class="form-control auto-field" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">Component</label>
            <input v-model="report.component" class="form-control auto-field" readonly />
          </div>
        </div>

        <label class="form-label">Test</label>
        <input v-model="report.testName" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Special Features</label>
        <textarea v-model="report.special" class="form-control mb-2 auto-field" rows="2" readonly></textarea>

        <label class="form-label">Purpose of the Test</label>
        <input v-model="report.category" class="form-control mb-2 auto-field" readonly />

        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Test Type</label>
            <input v-model="report.testType" class="form-control auto-field" readonly />
          </div>
          <div class="col-3">
            <label class="form-label">No of Samples</label>
            <input v-model="report.samples" class="form-control auto-field" readonly />
          </div>
        </div>

        <label class="form-label">Test Equipment</label>
        <input v-model="report.spec" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Spec / Test Details</label>
        <textarea v-model="report.testDetails" class="form-control mb-2 auto-field" rows="3" readonly></textarea>

        <!-- AUTO-FILLED FROM MONITORING -->
        <div class="section-header mt-3">📘 Monitoring Details (Auto-filled)</div>

        <div class="row g-2 mb-2">
          <div class="col-8">
            <label class="form-label">Equipment Name</label>
            <input v-model="report.equipmentName" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Equipment No</label>
            <input v-model="report.equipmentNo" class="form-control auto-field" readonly />
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-4">
            <label class="form-label">Initial Counter</label>
            <input v-model="report.initialReading" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Current Counter</label>
            <input v-model="report.currentReading" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Target Cycle</label>
            <input v-model="report.targetCycle" class="form-control auto-field" readonly />
          </div>
        </div>

        <label class="form-label">Balance (Yet to Cover)</label>
        <input :value="reportBalance" class="form-control mb-2 auto-field" readonly />

        <!-- MANUAL ENTRY -->
        <div class="section-header mt-3">✏️ Manual Entry</div>

        <label class="form-label">Acceptance Criteria</label>
        <textarea v-model="report.criteria" class="form-control mb-2" rows="3" placeholder="Enter acceptance criteria..."></textarea>

        <label class="form-label">Observation</label>
        <textarea v-model="report.observation" class="form-control mb-2" rows="3" placeholder="Enter observation..."></textarea>

        <label class="form-label">Conclusion</label>
        <textarea v-model="report.conclusion" class="form-control mb-2" rows="3" placeholder="Enter conclusion..."></textarea>

        <div class="row g-2 mb-2">
          <div class="col-4">
            <label class="form-label">Result</label>
            <select v-model="report.result" class="form-control">
              <option>Passed</option>
              <option>Failed</option>
              <option>Completed</option>
            </select>
          </div>
          <div class="col-4">
            <label class="form-label">Reported By (Name)</label>
            <input v-model="report.reportedBy" class="form-control" placeholder="Name" />
          </div>
          <div class="col-4">
            <label class="form-label">Approved By (Name)</label>
            <input v-model="report.approvedBy" class="form-control" placeholder="Name" />
          </div>
        </div>

        <label class="form-label">Requested By</label>
        <input v-model="report.requestedBy" class="form-control mb-3" placeholder="Requested By" />

        <!-- FILE UPLOADS -->
        <div class="section-header">📎 Attachments</div>

        <label class="form-label">Post Data Upload (Report Attachment)</label>
        <input type="file" @change="onPostDataChange" class="form-control mb-1" accept=".pdf,.xls,.xlsx,.doc,.docx,.csv" />
        <div v-if="report.postDataName" class="file-tag mb-2">📄 {{ report.postDataName }}</div>

        <label class="form-label">Failure Photos Upload</label>
        <input type="file" @change="onFailurePhotosChange" class="form-control mb-2" accept="image/*" multiple />
        <div v-if="report.failurePhotos && report.failurePhotos.length" class="photo-preview-row mb-2">
          <div v-for="(p, idx) in report.failurePhotos" :key="idx" class="photo-thumb-wrap">
            <img :src="p" class="photo-thumb" />
            <button class="thumb-remove" @click="removePhoto(idx)">×</button>
          </div>
        </div>

        <!-- SIGNATURES -->
        <div class="section-header mt-3">✍️ Signatures (embedded in printed report)</div>

        <label class="form-label">Reported By – Signature Image</label>
        <input type="file" @change="onSignReportedChange" class="form-control mb-1" accept="image/*" />
        <img v-if="report.signReportedPreview" :src="report.signReportedPreview" class="sig-preview mb-2" />

        <label class="form-label">Approved By – Signature Image</label>
        <input type="file" @change="onSignApprovedChange" class="form-control mb-1" accept="image/*" />
        <img v-if="report.signApprovedPreview" :src="report.signApprovedPreview" class="sig-preview mb-2" />

        <!-- ACTIONS -->
        <div class="d-flex gap-2 mt-3 flex-wrap">
          <button class="btn btn-primary" @click="printSheet('report')">🖨 Print Report</button>
          <button
            class="btn btn-danger-outline"
            style="border: 1px solid #e53935; color: #e53935"
            @click="downloadPDF('report')"
          >
            ⬇ PDF
          </button>
          <button class="btn btn-success" @click="submitReport">
            {{ reportEditMode ? 'Update' : 'Save' }}
          </button>
          <button
            v-if="reportEditMode"
            class="btn btn-danger"
            @click="confirmDeleteReport(report.reqNo)"
          >
            🗑 Delete
          </button>
          <button class="btn btn-secondary" @click="report = null">Close</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

// ─── Report No Generator ──────────────────────────────────────
function generateReportNo() {
  const today = new Date()
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')
  const key = `rptSeq_${dateStr}`
  const seq = parseInt(localStorage.getItem(key) || '0') + 1
  localStorage.setItem(key, seq)
  return `RPT-${dateStr}-${String(seq).padStart(4, '0')}`
}

// ─── Base64 helper ────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const API = 'http://localhost:5000/api'

export default {
  name: 'DailyUpdateArchive',

  data() {
    return {
      currentYear: new Date().getFullYear(),
      selectedYear: '',          // ✅ optional year filter dropdown

      allRequests: [],           // raw data from API
      monitoring: null,
      monitoringEditMode: false,
      report: null,
      reportEditMode: false,

      // ✅ Flat reactive arrays (Vue 2 safe)
      monitoringKeys: [],
      reportKeys: [],

      // In-memory caches keyed by requestNo
      monitoringCache: {},
      reportCache: {},

      deleteModal: {
        show: false,
        type: '',
        requestNo: '',
        dbId: null,
      },
    }
  },

  computed: {
    // ✅ All unique years found in previous-year allocated requests
    availableYears() {
      const years = this.allRequests
        .filter((r) => {
          if (r.status !== 'Allocated') return false
          if (!r.date) return false
          return new Date(r.date).getFullYear() < this.currentYear
        })
        .map((r) => new Date(r.date).getFullYear())
      return [...new Set(years)].sort((a, b) => b - a)
    },

    // ✅ ARCHIVE: Allocated requests from previous years only
    filteredRequests() {
      return this.allRequests.filter((r) => {
        // Must be Allocated
        if (r.status !== 'Allocated') return false

        // Must have a date
        if (!r.date) return false

        // Must be a previous year
        const reqYear = new Date(r.date).getFullYear()
        if (reqYear >= this.currentYear) return false

        // Optional: filter by selected year
        if (this.selectedYear && reqYear !== Number(this.selectedYear)) return false

        return true
      })
    },

    yetToCover() {
      if (!this.monitoring) return 0
      return (
        (parseFloat(this.monitoring.targetCycle) || 0) -
        (parseFloat(this.monitoring.currentReading) || 0)
      )
    },

    reportBalance() {
      if (!this.report) return 0
      return (
        (parseFloat(this.report.targetCycle) || 0) -
        (parseFloat(this.report.currentReading) || 0)
      )
    },
  },

  mounted() {
    this.load()
    this.loadCaches()
  },

  methods: {
    // ── Reactive key helpers ──────────────────────────────────
    hasMonitoring(requestNo) {
      return this.monitoringKeys.includes(requestNo)
    },
    hasReport(requestNo) {
      return this.reportKeys.includes(requestNo)
    },
    addMonitoringKey(requestNo) {
      if (!this.monitoringKeys.includes(requestNo)) this.monitoringKeys.push(requestNo)
    },
    removeMonitoringKey(requestNo) {
      const idx = this.monitoringKeys.indexOf(requestNo)
      if (idx !== -1) this.monitoringKeys.splice(idx, 1)
    },
    addReportKey(requestNo) {
      if (!this.reportKeys.includes(requestNo)) this.reportKeys.push(requestNo)
    },
    removeReportKey(requestNo) {
      const idx = this.reportKeys.indexOf(requestNo)
      if (idx !== -1) this.reportKeys.splice(idx, 1)
    },

    // ── Load ALL requests from same endpoint, filter in computed ──
    async load() {
      try {
        const res = await axios.get(`${API}/requests`)
        this.allRequests = res.data
      } catch (err) {
        console.error('❌ Load error:', err)
        alert('Error loading archive requests.')
      }
    },

    // ── Cache helpers — separate namespace from DailyUpdate ──
    loadCaches() {
      try {
        const mc = localStorage.getItem('archive_monitoringCache')
        if (mc) {
          this.monitoringCache = JSON.parse(mc)
          this.monitoringKeys = Object.keys(this.monitoringCache)
        }
        const rc = localStorage.getItem('archive_reportCache')
        if (rc) {
          this.reportCache = JSON.parse(rc)
          this.reportKeys = Object.keys(this.reportCache)
        }
      } catch (e) {
        console.warn('Archive cache load error', e)
      }
    },

    saveCaches() {
      localStorage.setItem('archive_monitoringCache', JSON.stringify(this.monitoringCache))
      localStorage.setItem('archive_reportCache', JSON.stringify(this.reportCache))
    },

    // ─────────────── MONITORING ───────────────────────────────
    openMonitoring(r) {
      this.monitoringEditMode = false
      this.monitoring = {
        plNo: r.allocationPlNo,
        requestNo: r.requestNo,
        partNo: r.partNo,
        description: r.description || '',
        customer: r.customer || '',
        testType: r.testType || '',
        samples: r.samples || '',
        testDetails: r.testDetails || '',
        equipmentName: '',
        equipmentNo: '',
        standard: '',
        requestDate: '',
        testStartedOn: '',
        testCompletedOn: '',
        targetCycle: '',
        initialReading: '',
        currentReading: '',
        purpose: r.category || '',
        remarks: '',
        acceptanceCriteria: r.acceptanceCriteria || '',
        testResults: '',
        responsibility: 'Admin',
        requestedBy: r.userName || 'User',
        dbId: null,
      }
    },

    editMonitoring(r) {
      this.monitoringEditMode = true
      this.monitoring = JSON.parse(JSON.stringify(this.monitoringCache[r.requestNo]))
    },

    async submitDaily() {
      try {
        const requestNo = this.monitoring.requestNo
        const existingDbId = this.monitoringCache[requestNo]?.dbId || this.monitoring.dbId || null

        if (this.monitoringEditMode && existingDbId) {
          await axios.put(`${API}/dailyupdates/${existingDbId}`, this.monitoring)
          this.monitoringCache[requestNo] = { ...this.monitoring, dbId: existingDbId }
        } else {
          const res = await axios.post(`${API}/dailyupdates`, this.monitoring)
          const newId = res.data?.data?.id || res.data?.id || null
          this.monitoringCache[requestNo] = { ...this.monitoring, dbId: newId }
        }

        this.saveCaches()
        this.addMonitoringKey(requestNo)
        alert(this.monitoringEditMode ? '✅ Monitoring updated!' : '✅ Monitoring saved!')
        this.monitoring = null
      } catch (err) {
        console.error('❌ Monitoring save error:', err)
        alert('Error saving monitoring. Check console.')
      }
    },

    confirmDeleteMonitoring(requestNo) {
      const cached = this.monitoringCache[requestNo]
      this.deleteModal = { show: true, type: 'monitoring', requestNo, dbId: cached?.dbId || null }
      this.monitoring = null
    },

    // ─────────────── REPORT ───────────────────────────────────
    openReport(r) {
      this.reportEditMode = false
      const mon = this.monitoringCache[r.requestNo] || {}

      this.report = {
        reportNo: generateReportNo(),
        reqNo: r.requestNo || '',
        plNo: r.allocationPlNo || '',
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        description: r.description || '',
        partNo: r.partNo || '',
        customer: r.customer || '',
        component: r.component || '',
        testName: r.testName || '',
        special: r.special || '',
        category: r.category || '',
        testType: r.testType || '',
        samples: r.samples || '',
        testDetails: r.testDetails || '',
        spec: mon.equipmentName || r.spec || '',
        equipmentName: mon.equipmentName || '',
        equipmentNo: mon.equipmentNo || '',
        initialReading: mon.initialReading || '',
        currentReading: mon.currentReading || '',
        targetCycle: mon.targetCycle || '',
        criteria: '',
        observation: '',
        conclusion: '',
        result: 'Passed',
        reportedBy: '',
        approvedBy: '',
        requestedBy: r.userName || '',
        postDataBase64: null,
        postDataName: null,
        failurePhotos: [],
        signReportedPreview: null,
        signApprovedPreview: null,
        dbId: null,
      }
    },

    editReport(r) {
      this.reportEditMode = true
      this.report = JSON.parse(JSON.stringify(this.reportCache[r.requestNo]))
    },

    confirmDeleteReport(requestNo) {
      const cached = this.reportCache[requestNo]
      this.deleteModal = { show: true, type: 'report', requestNo, dbId: cached?.dbId || null }
      this.report = null
    },

    async executeDelete() {
      const { type, requestNo, dbId } = this.deleteModal
      try {
        if (dbId) {
          if (type === 'monitoring') {
            await axios.delete(`${API}/dailyupdates/${dbId}`)
          } else {
            await axios.delete(`${API}/reports/${dbId}`)
          }
        }

        if (type === 'monitoring') {
          delete this.monitoringCache[requestNo]
          this.saveCaches()
          this.removeMonitoringKey(requestNo)
        } else {
          delete this.reportCache[requestNo]
          this.saveCaches()
          this.removeReportKey(requestNo)
        }

        this.deleteModal.show = false
        alert(`🗑 ${type === 'monitoring' ? 'Monitoring' : 'Report'} deleted successfully!`)
      } catch (err) {
        console.error('❌ Delete error:', err)
        alert('Error deleting record. Check console.')
        this.deleteModal.show = false
      }
    },

    // ─── File handlers ────────────────────────────────────────
    async onPostDataChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.report.postDataName = file.name
      this.report.postDataBase64 = await fileToBase64(file)
    },

    async onFailurePhotosChange(e) {
      for (const file of Array.from(e.target.files)) {
        const b64 = await fileToBase64(file)
        this.report.failurePhotos.push(b64)
      }
    },

    removePhoto(idx) {
      this.report.failurePhotos.splice(idx, 1)
    },

    async onSignReportedChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.report.signReportedPreview = await fileToBase64(file)
    },

    async onSignApprovedChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.report.signApprovedPreview = await fileToBase64(file)
    },

    async submitReport() {
      try {
        const reqNo = this.report.reqNo
        const existingDbId = this.reportCache[reqNo]?.dbId || this.report.dbId || null

        if (this.reportEditMode && existingDbId) {
          await axios.put(`${API}/reports/${existingDbId}`, {
            ...this.report,
            reportBalance: this.reportBalance,
          })
          this.reportCache[reqNo] = { ...this.report, dbId: existingDbId }
        } else {
          const res = await axios.post(`${API}/reports`, {
            ...this.report,
            reportBalance: this.reportBalance,
          })
          const newId = res.data?.data?.id || res.data?.id || null
          this.reportCache[reqNo] = { ...this.report, dbId: newId }
        }

        this.saveCaches()
        this.addReportKey(reqNo)
        alert(this.reportEditMode ? '✅ Report updated!' : '✅ Report saved!')
        this.report = null
      } catch (err) {
        console.error('❌ Report save error:', err)
        alert('Error saving report. Check console.')
      }
    },

    downloadPDF(type) {
      this.printSheet(type)
    },

    // ═══════════════════════════════════════════════════════
    //  PRINT ENGINE  (identical to DailyUpdate)
    // ═══════════════════════════════════════════════════════
    printSheet(type) {
      const logo = window.location.origin + '/images/TVS.jpg'

      if (type === 'report') {
        const d = this.report

        const sigR = d.signReportedPreview
          ? `${d.reportedBy || ''}<br/><img src="${d.signReportedPreview}" style="height:44px;margin-top:3px;"/>`
          : d.reportedBy || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

        const sigA = d.signApprovedPreview
          ? `${d.approvedBy || ''}<br/><img src="${d.signApprovedPreview}" style="height:44px;margin-top:3px;"/>`
          : d.approvedBy || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

        const photoImgs = (d.failurePhotos || [])
          .map(
            (src) =>
              `<img src="${src}" style="max-width:260px;max-height:200px;margin:5px;border:1px solid #999;object-fit:cover;"/>`,
          )
          .join('')
        const failureBlock = (d.failurePhotos || []).length
          ? `<hr style="border:none;border-top:1px solid #000;margin:5px 0;"/>
             <div><b>Failure Photos:</b><br/>${photoImgs}</div>`
          : ''

        const postDataBlock = d.postDataName
          ? `<hr style="border:none;border-top:1px solid #000;margin:5px 0;"/>
             <div><b>Post Data Attachment:</b> ${d.postDataName}</div>`
          : ''

        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  @page { size:A4 portrait; margin:11mm 13mm; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body{ font-family:"Times New Roman",Times,serif; font-size:12.5px; color:#000; }
  table{ width:100%; border-collapse:collapse; }
  .h-logo{ width:105px; vertical-align:top; }
  .h-title{ text-align:center; vertical-align:middle; }
  .h-title h1{ font-size:21px; font-weight:bold; letter-spacing:1px; }
  .h-right{ width:125px; text-align:right; font-size:11px; color:#c00; vertical-align:bottom; line-height:1.5; }
  .org{ font-size:11.5px; font-weight:bold; color:#2a7d19; margin-top:2px; }
  .bar{ border-top:2px solid #2a7d19; border-bottom:2px solid #2a7d19; margin:5px 0; }
  .bar td{ padding:4px 5px; font-size:12px; white-space:nowrap; }
  .bar .gl{ color:#2a7d19; font-weight:bold; }
  .bar .gv{ color:#b00000; font-weight:bold; }
  .body-row{ display:flex; padding:3px 0; font-size:12.5px; }
  .body-row .lbl{ font-weight:bold; min-width:162px; white-space:nowrap; }
  .body-row .val{ flex:1; white-space:pre-wrap; }
  hr.sec{ border:none; border-top:1px solid #000; margin:5px 0; }
  .sig-line{ border-top:1px solid #000; margin-top:22px; display:flex; }
  .sig-cell{ flex:1; padding:5px 4px; font-size:12px; }
  .footer-line{ border-top:1px solid #000; margin-top:7px; display:flex; justify-content:space-between; padding:3px 0; font-size:11px; }
</style>
</head><body>
<table>
  <tr>
    <td class="h-logo"><img src="${logo}" height="62"/><div class="org">Lucas TVS Ltd.</div></td>
    <td class="h-title"><h1>PROVING TEST REPORT</h1></td>
    <td class="h-right">Engineering Center<br/>Proving lab</td>
  </tr>
</table>
<table class="bar">
  <tr>
    <td><span class="gl">Report No :</span>&nbsp;<span class="gv">${d.reportNo || ''}</span></td>
    <td><span class="gl">Request No :</span>&nbsp;<span class="gv">${d.reqNo}</span></td>
    <td><span class="gl">PL No :</span>&nbsp;<span class="gv">${d.plNo}</span></td>
    <td><span class="gl">DATE :</span>&nbsp;<span class="gv">${d.date}</span></td>
  </tr>
</table>
<div class="body-row">
  <span class="lbl">Product :</span>
  <span class="val">${d.description}</span>
  <span style="font-weight:bold;margin-left:20px;white-space:nowrap;">Part<br/>Number :</span>
  <span style="margin-left:6px;">${d.partNo}</span>
</div>
<div class="body-row"><span class="lbl">Cust/Appln :</span><span class="val">${d.customer}</span></div>
<div class="body-row"><span class="lbl">Component :</span><span class="val">${d.component || '-'}</span></div>
<div class="body-row"><span class="lbl">Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.testName || ''}</span></div>
<div class="body-row"><span class="lbl">Special<br/>Features &nbsp;&nbsp;&nbsp; :</span><span class="val" style="white-space:pre-wrap;">${d.special || '-'}</span></div>
<div class="body-row"><span class="lbl">Purpose Of<br/>The Test &nbsp;&nbsp;&nbsp; :</span><span class="val">${d.category || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Test Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.testType || ''}</span></div>
<div class="body-row"><span class="lbl">No Of Samples &nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.samples || ''}</span></div>
<div class="body-row"><span class="lbl">Test Equipment &nbsp;&nbsp; :</span><span class="val">${d.spec || ''}</span></div>
<div class="body-row"><span class="lbl">Spec./Test Details :</span><span class="val" style="white-space:pre-wrap;">${d.testDetails || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Acceptance<br/>Criteria :</span><span class="val" style="white-space:pre-wrap;">${d.criteria || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Observation :</span><span class="val" style="white-space:pre-wrap;">${d.observation || ''}</span></div>
${postDataBlock}
${failureBlock}
<hr class="sec"/>
<div class="body-row"><span class="lbl">Conclusion &nbsp; :</span><span class="val" style="white-space:pre-wrap;">${d.conclusion || ''}</span></div>
<div class="sig-line">
  <div class="sig-cell"><b>Reported By :</b>&nbsp;&nbsp;${sigR}</div>
  <div class="sig-cell"><b>Approved By :</b>&nbsp;&nbsp;${sigA}</div>
</div>
<div style="display:flex;border-top:1px solid #ccc;font-size:12px;padding:4px 4px;">
  <div style="flex:1;"><b>Circulation :</b>&nbsp;&nbsp;Dev.Engg/file</div>
  <div style="flex:1;"><b>Requested By :</b>&nbsp;&nbsp;${d.requestedBy || ''}</div>
</div>
<div class="footer-line">
  <span>FORM NO: J21 - 03</span>
  <span>RETENTION PERIOD : 3 YEARS</span>
</div>
</body></html>`

        const win = window.open('')
        win.document.write(html)
        win.document.close()
        win.print()
      }

      if (type === 'monitoring') {
        const d = this.monitoring
        const finalCounter =
          (parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0)

        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  @page { size:A4 landscape; margin:12mm 14mm; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body{ font-family:"Times New Roman",Times,serif; font-size:13px; color:#000; }
  table{ width:100%; border-collapse:collapse; }
  .th-org{ vertical-align:top; width:200px; font-size:13px; line-height:1.6; }
  .th-title{ text-align:center; vertical-align:middle; }
  .th-title h1{ font-size:20px; font-weight:bold; letter-spacing:0.5px; }
  .th-logo{ text-align:right; vertical-align:top; width:110px; }
  .main td{ border:1px solid #000; padding:7px 10px; vertical-align:top; font-size:13px; }
  .lbl{ font-weight:bold; }
  .rc{ width:225px; }
  .foot{ margin-top:16px; display:flex; justify-content:space-between; font-size:11.5px; }
</style>
</head><body>
<table style="border:none;margin-bottom:20px;">
  <tr>
    <td class="th-org" style="border:none;">Lucas-TVS LTD.<br/>Proving &amp; Reliability Lab</td>
    <td class="th-title" style="border:none;"><h1>PROVING TEST DATA SHEET</h1></td>
    <td class="th-logo" style="border:none;"><img src="${logo}" height="65"/></td>
  </tr>
</table>
<table class="main">
  <tr>
    <td colspan="3"><span class="lbl">Test Equipment :</span> ${d.equipmentName}</td>
    <td class="rc"><span class="lbl">Equip.No :</span> ${d.equipmentNo}</td>
  </tr>
  <tr>
    <td colspan="3">
      <span class="lbl">Product/Component :</span> ${d.description || d.partNo}<br/>
      <span class="lbl">Test Type :</span> ${d.testType || ''}&nbsp;&nbsp;
      <span class="lbl">Cust/Appln :</span> ${d.customer || ''}&nbsp;&nbsp;
      <span class="lbl">No of Samples :</span> ${d.samples || ''}
    </td>
    <td class="rc">
      <span class="lbl">PL.No :</span> ${d.plNo}<br/>
      <span class="lbl">Request No :</span> ${d.requestNo}<br/>
      <span class="lbl">Request Date :</span> ${d.requestDate || ''}
    </td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Standard :</span> ${d.standard || ''}</td>
    <td class="rc"><span class="lbl">Test Started On :</span> ${d.testStartedOn || ''}</td>
  </tr>
  <tr>
    <td colspan="3" rowspan="2" style="white-space:pre-wrap;">
      <span class="lbl">Test Details :</span><br/>${d.testDetails || ''}
    </td>
    <td class="rc"><span class="lbl">Initial Hourmeter/Counter :</span> ${d.initialReading || ''}</td>
  </tr>
  <tr>
    <td class="rc"><span class="lbl">Test Completed On :</span> ${d.testCompletedOn || ''}</td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Purpose Of The Test :</span> ${d.purpose || ''}</td>
    <td class="rc"><span class="lbl">Final Hourmeter/Counter :</span> ${finalCounter}</td>
  </tr>
  <tr>
    <td colspan="4"><span class="lbl">Tryout Details :</span><br/>${d.remarks || ''}</td>
  </tr>
  <tr>
    <td colspan="4"><span class="lbl">Acceptance Criteria :</span> ${d.acceptanceCriteria || ''}</td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Test Results :</span><br/>${d.testResults || ''}</td>
    <td class="rc">
      <span class="lbl">Responsibilty :</span> ${d.responsibility || ''}<br/>
      <span class="lbl">Requested By :</span> ${d.requestedBy || ''}
    </td>
  </tr>
</table>
<div class="foot">
  <span>FORM NO: J21 - 02</span>
  <span>RETENTION PERIOD : 3 YEARS</span>
</div>
</body></html>`

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
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.55);
  z-index: 1000; overflow-y: auto;
}
.modal-box {
  background: #fff; padding: 24px;
  width: 540px; margin: 36px auto;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.large { width: 760px; }
.section-header {
  font-weight: 600; font-size: 13.5px;
  color: #1a56a0; background: #eef4ff;
  border-left: 4px solid #1a56a0;
  padding: 6px 10px; margin-bottom: 10px; border-radius: 2px;
}
.auto-field {
  background: #f4f8fd !important;
  color: #444 !important;
  border-color: #b8cfe8 !important;
}
.file-tag {
  display: inline-block; background: #e8f5e9;
  border: 1px solid #a5d6a7; border-radius: 4px;
  padding: 3px 10px; font-size: 13px; color: #2e7d32;
}
.photo-preview-row { display: flex; flex-wrap: wrap; gap: 8px; }
.photo-thumb-wrap { position: relative; }
.photo-thumb { width: 80px; height: 80px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px; }
.thumb-remove {
  position: absolute; top: -6px; right: -6px;
  background: #e53935; color: #fff; border: none;
  border-radius: 50%; width: 20px; height: 20px;
  font-size: 13px; cursor: pointer; line-height: 1.1;
}
.sig-preview {
  display: block; height: 60px;
  border: 1px dashed #aaa; border-radius: 4px;
  padding: 3px; object-fit: contain; background: #fafafa;
}
.gap-2 { gap: 8px; }
.me-1 { margin-right: 4px; }
</style>