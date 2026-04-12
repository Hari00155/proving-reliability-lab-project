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
        <tr v-for="(r, i) in visibleRequests" :key="r.id">
          <td>{{ i + 1 }}</td>
          <td>{{ r.requestNo }}</td>
          <td>{{ r.allocationPlNo }}</td>
          <td>{{ r.userName }}</td>
          <td>{{ r.partNo }}</td>
          <td>{{ r.status }}</td>
          <td>
            <button
              class="btn btn-primary btn-sm me-1 tt"
              data-tip="Open Monitoring Sheet"
              @click="openMonitoring(r)"
            >
              Monitoring
            </button>
            <button
              class="btn btn-warning btn-sm me-1 tt"
              data-tip="Open Proving Test Report"
              @click="openReport(r)"
            >
              Report
            </button>
            <button
              v-if="hasMonitoring(r.requestNo)"
              class="btn btn-outline-secondary btn-sm me-1 tt"
              data-tip="Edit saved Monitoring Sheet"
              @click="editMonitoring(r)"
            >
              ✏ Edit Mon.
            </button>
            <button
              v-if="hasMonitoring(r.requestNo)"
              class="btn btn-outline-danger btn-sm me-1 tt"
              data-tip="Delete Monitoring Sheet"
              @click="confirmDeleteMonitoring(r.requestNo)"
            >
              🗑 Del Mon.
            </button>
            <button
              v-if="hasReport(r.requestNo)"
              class="btn btn-outline-secondary btn-sm me-1 tt"
              data-tip="Edit saved Report"
              @click="editReport(r)"
            >
              ✏ Edit Rep.
            </button>
            <button
              v-if="hasReport(r.requestNo)"
              class="btn btn-outline-danger btn-sm me-1 tt"
              data-tip="Delete Report"
              @click="confirmDeleteReport(r.requestNo)"
            >
              🗑 Del Rep.
            </button>
            <button
              v-if="
                hasMonitoring(r.requestNo) && hasReport(r.requestNo) && !isCompleted(r.requestNo)
              "
              class="btn btn-success btn-sm me-1 tt"
              data-tip="Mark as Completed — row will be removed from this list"
              @click="completeRequest(r)"
            >
              ✅ Complete
            </button>
            <button
              class="btn btn-danger btn-sm tt"
              data-tip="Delete entire request"
              @click="confirmDeleteRequest(r)"
            >
              🗑 Del Req
            </button>
          </td>
        </tr>
        <tr v-if="visibleRequests.length === 0">
          <td colspan="7" class="text-center text-muted py-3">
            No active requests. Completed requests are removed from this list.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- GLOBAL ERROR TOAST -->
    <div v-if="globalError" class="global-toast-error">
      ❌ {{ globalError }}
      <button
        @click="globalError = ''"
        style="
          margin-left: 10px;
          background: none;
          border: none;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        "
      >
        ×
      </button>
    </div>

    <!-- DELETE CONFIRM MODAL -->
    <div v-if="deleteModal.show" class="modal-overlay">
      <div class="modal-box" style="width: 420px; text-align: center">
        <div style="font-size: 48px">⚠️</div>
        <h5 class="mt-2 mb-2">Confirm Delete</h5>
        <p class="mb-3">
          Are you sure you want to delete the
          <strong>{{ deleteModal.typeLabel }}</strong>
          for Request No: <strong>{{ deleteModal.requestNo }}</strong
          >? <br /><span style="color: #c00; font-size: 12px">This action cannot be undone.</span>
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-danger" :disabled="deleteModal.loading" @click="executeDelete">
            <span v-if="deleteModal.loading">⏳ Deleting…</span>
            <span v-else>Yes, Delete</span>
          </button>
          <button
            class="btn btn-secondary"
            :disabled="deleteModal.loading"
            @click="deleteModal.show = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- MONITORING MODAL -->
    <div v-if="monitoring" class="modal-overlay">
      <div class="modal-box" style="max-height: 90vh; overflow-y: auto">
        <h4>📘 {{ monitoringEditMode ? 'Edit' : 'New' }} Monitoring Sheet</h4>

        <label class="form-label">PL No</label>
        <input v-model="monitoring.plNo" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Date</label>
        <input v-model="monitoring.date" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Equipment Name</label>
        <input
          v-model="monitoring.equipmentName"
          class="form-control mb-2"
          placeholder="Equipment Name"
        />
        <label class="form-label">Equipment No</label>
        <input
          v-model="monitoring.equipmentNo"
          class="form-control mb-2"
          placeholder="Equipment No"
        />
        <label class="form-label">Standard / Spec</label>
        <input v-model="monitoring.standard" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Request Date</label>
        <input
          type="date"
          v-model="monitoring.requestDate"
          class="form-control mb-2 auto-field"
          readonly
        />
        <label class="form-label">Test Started On</label>
        <input type="date" v-model="monitoring.testStartedOn" class="form-control mb-2" />
        <label class="form-label">Test Completed On</label>
        <input type="date" v-model="monitoring.testCompletedOn" class="form-control mb-2" />
        <label class="form-label">Target Cycle / Final Counter</label>
        <input v-model="monitoring.targetCycle" class="form-control mb-2" placeholder="Target" />
        <label class="form-label">Initial Hourmeter / Counter</label>
        <input
          v-model="monitoring.initialReading"
          class="form-control mb-2"
          placeholder="Initial"
        />
        <label class="form-label">Current Reading</label>
        <input
          v-model="monitoring.currentReading"
          class="form-control mb-2"
          placeholder="Current"
        />
        <label class="form-label">Balance (Yet to Cover)</label>
        <input :value="yetToCover" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Test Type / Purpose of The Test</label>
        <input v-model="monitoring.purpose" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Tryout Details / Remarks</label>
        <textarea
          v-model="monitoring.remarks"
          class="form-control mb-2"
          rows="2"
          placeholder="Tryout details..."
        ></textarea>
        <label class="form-label">Acceptance Criteria</label>
        <textarea
          v-model="monitoring.acceptanceCriteria"
          class="form-control mb-2 auto-field"
          rows="2"
          readonly
        ></textarea>
        <label class="form-label">Test Results</label>
        <textarea
          v-model="monitoring.testResults"
          class="form-control mb-2"
          rows="2"
          placeholder="Test results..."
        ></textarea>
        <label class="form-label">Responsibility</label>
        <input
          v-model="monitoring.responsibility"
          class="form-control mb-2"
          placeholder="Responsibility"
        />
        <label class="form-label">Requested By</label>
        <input
          v-model="monitoring.requestedBy"
          class="form-control mb-2"
          placeholder="Requested By"
        />

        <div v-if="monitoringSaveError" class="alert-error mb-2">
          <span>❌ {{ monitoringSaveError }}</span>
          <button class="close-err" @click="monitoringSaveError = ''">×</button>
        </div>

        <div class="d-flex gap-2 mt-2 flex-wrap">
          <button
            class="btn btn-info tt"
            data-tip="Print as A4 Landscape Datasheet"
            @click="printMonitoringDirect"
          >
            🖨 Print Datasheet
          </button>
          <button
            class="btn btn-outline-danger tt"
            data-tip="Download Datasheet as PDF"
            @click="printMonitoringDirect"
          >
            ⬇ PDF
          </button>
          <button
            class="btn btn-success tt"
            :data-tip="monitoringEditMode ? 'Update' : 'Save'"
            :disabled="monitoringSaving"
            @click="submitDaily"
          >
            <span v-if="monitoringSaving">⏳ Saving…</span>
            <span v-else>{{ monitoringEditMode ? 'Update' : 'Save' }}</span>
          </button>
          <button
            v-if="monitoringEditMode"
            class="btn btn-danger tt"
            data-tip="Delete this monitoring record"
            @click="confirmDeleteMonitoringFromModal"
          >
            🗑 Delete
          </button>
          <button
            class="btn btn-secondary tt"
            data-tip="Close without saving"
            @click="
              monitoring = null
              monitoringSaveError = ''
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- REPORT MODAL -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large" style="max-height: 90vh; overflow-y: auto">
        <h4>📄 {{ reportEditMode ? 'Edit' : 'New' }} Proving Test Report</h4>

        <div v-if="reportSaveError" class="alert-error mb-3">
          <span>❌ {{ reportSaveError }}</span>
          <button class="close-err" @click="reportSaveError = ''">×</button>
        </div>

        <div class="section-header">📋 Request Details (Auto-filled)</div>
        <div class="row g-2 mb-2">
          <div class="col-4">
            <label class="form-label">Report No</label
            ><input v-model="report.reportNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Request No</label
            ><input v-model="report.reqNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-2">
            <label class="form-label">PL No</label
            ><input v-model="report.plNo" class="form-control auto-field" readonly />
          </div>
          <div class="col-2">
            <label class="form-label">Date</label
            ><input v-model="report.date" class="form-control auto-field" readonly />
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-8">
            <label class="form-label">Product / Description</label
            ><input v-model="report.description" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Part Number</label
            ><input v-model="report.partNo" class="form-control auto-field" readonly />
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Cust / Appln</label
            ><input v-model="report.customer" class="form-control auto-field" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">Component</label
            ><input v-model="report.component" class="form-control auto-field" readonly />
          </div>
        </div>
        <label class="form-label">Test</label>
        <input v-model="report.testName" class="form-control mb-2 auto-field" readonly />
        <label class="form-label">Special Features</label>
        <textarea
          v-model="report.special"
          class="form-control mb-2 auto-field"
          rows="2"
          readonly
        ></textarea>
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Test Type</label
            ><input v-model="report.testType" class="form-control auto-field" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">Purpose of the Test</label
            ><input v-model="report.category" class="form-control auto-field" readonly />
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-3">
            <label class="form-label">No of Samples</label
            ><input v-model="report.samples" class="form-control auto-field" readonly />
          </div>
          <div class="col-9">
            <label class="form-label">Standard / Spec</label
            ><input v-model="report.standard" class="form-control auto-field" readonly />
          </div>
        </div>
        <label class="form-label">Spec / Test Details</label>
        <textarea
          v-model="report.testDetails"
          class="form-control mb-2 auto-field"
          rows="3"
          readonly
        ></textarea>

        <div class="section-header mt-3">📘 Monitoring Details (Auto-filled)</div>
        <label class="form-label">Test Equipment</label>
        <input v-model="report.spec" class="form-control mb-2 auto-field" readonly />
        <div class="row g-2 mb-2">
          <div class="col-8">
            <label class="form-label">Equipment Name</label
            ><input v-model="report.equipmentName" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Equipment No</label
            ><input v-model="report.equipmentNo" class="form-control auto-field" readonly />
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-4">
            <label class="form-label">Initial Counter</label
            ><input v-model="report.initialReading" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Current Counter</label
            ><input v-model="report.currentReading" class="form-control auto-field" readonly />
          </div>
          <div class="col-4">
            <label class="form-label">Target Cycle</label
            ><input v-model="report.targetCycle" class="form-control auto-field" readonly />
          </div>
        </div>
        <label class="form-label">Balance (Yet to Cover)</label>
        <input :value="reportBalance" class="form-control mb-2 auto-field" readonly />

        <div class="section-header mt-3">✏️ Manual Entry</div>
        <label class="form-label">
          Acceptance Criteria
          <span class="badge-autofill tt" data-tip="Pre-filled from request — you may edit freely"
            >auto-filled</span
          >
        </label>
        <textarea
          v-model="report.criteria"
          class="form-control mb-2"
          rows="3"
          placeholder="Enter acceptance criteria..."
        ></textarea>
        <label class="form-label">Observation</label>
        <textarea
          v-model="report.observation"
          class="form-control mb-2"
          rows="3"
          placeholder="Enter observation..."
        ></textarea>
        <label class="form-label">Conclusion</label>
        <textarea
          v-model="report.conclusion"
          class="form-control mb-2"
          rows="3"
          placeholder="Enter conclusion..."
        ></textarea>

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
            <label class="form-label">Reported By</label
            ><input v-model="report.reportedBy" class="form-control" placeholder="Name" />
          </div>
          <div class="col-4">
            <label class="form-label">Approved By</label
            ><input v-model="report.approvedBy" class="form-control" placeholder="Name" />
          </div>
        </div>
        <label class="form-label">Requested By</label>
        <input v-model="report.requestedBy" class="form-control mb-3" placeholder="Requested By" />

        <div class="section-header">📎 Attachments</div>
        <label class="form-label">Post Data Upload</label>
        <input
          type="file"
          @change="onPostDataChange"
          class="form-control mb-1"
          accept=".pdf,.xls,.xlsx,.doc,.docx,.csv"
        />
        <div v-if="report.postDataName" class="file-tag mb-2">📄 {{ report.postDataName }}</div>
        <label class="form-label">Failure Photos</label>
        <input
          type="file"
          @change="onFailurePhotosChange"
          class="form-control mb-2"
          accept="image/*"
          multiple
        />
        <div
          v-if="report.failurePhotos && report.failurePhotos.length"
          class="photo-preview-row mb-2"
        >
          <div v-for="(p, idx) in report.failurePhotos" :key="idx" class="photo-thumb-wrap">
            <img :src="p" class="photo-thumb" />
            <button class="thumb-remove" @click="removePhoto(idx)">×</button>
          </div>
        </div>

        <div class="section-header mt-3">✍️ Signatures</div>
        <label class="form-label">Reported By – Signature</label>
        <input
          type="file"
          @change="onSignReportedChange"
          class="form-control mb-1"
          accept="image/*"
        />
        <img
          v-if="report.signReportedPreview"
          :src="report.signReportedPreview"
          class="sig-preview mb-2"
        />
        <label class="form-label">Approved By – Signature</label>
        <input
          type="file"
          @change="onSignApprovedChange"
          class="form-control mb-1"
          accept="image/*"
        />
        <img
          v-if="report.signApprovedPreview"
          :src="report.signApprovedPreview"
          class="sig-preview mb-2"
        />

        <div class="d-flex gap-2 mt-3 flex-wrap">
          <button
            class="btn btn-primary tt"
            data-tip="Print Report A4 Portrait"
            @click="printReportDirect"
          >
            🖨 Print Report
          </button>
          <button
            class="btn btn-outline-danger tt"
            data-tip="Download Report as PDF"
            @click="downloadPDF('report')"
          >
            ⬇ PDF
          </button>
          <button
            class="btn btn-success tt"
            :data-tip="reportEditMode ? 'Update' : 'Save'"
            :disabled="reportSaving"
            @click="submitReport"
          >
            <span v-if="reportSaving">⏳ Saving…</span>
            <span v-else>{{ reportEditMode ? 'Update' : 'Save' }}</span>
          </button>
          <button
            v-if="reportEditMode"
            class="btn btn-danger tt"
            data-tip="Delete this report"
            @click="confirmDeleteReportFromModal"
          >
            🗑 Delete
          </button>
          <button class="btn btn-secondary tt" data-tip="Close without saving" @click="closeReport">
            Close
          </button>
        </div>
      </div>
    </div>

    <div class="g-tooltip" :style="tooltipStyle" v-show="tooltipText">{{ tooltipText }}</div>
  </div>
</template>

<script>
import axios from 'axios'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** Today as YYYY-MM-DD — safe for <input type="date"> */
function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Today as DD-MM-YYYY — display only, never stored as a DB DATEONLY field */
function todayDisplay() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

/**
 * ▶ THE CORE FIX ◀
 *
 * Convert ANY date value to YYYY-MM-DD (safe for <input type="date">
 * and for the backend DATEONLY column), or return '' if unparseable.
 *
 * Handles every format that can arrive from the DB or user inputs:
 *   null / undefined / ''           → ''
 *   "Invalid date"                  → ''
 *   "2024-03-15"   (YYYY-MM-DD)     → "2024-03-15"   ✅ pass-through
 *   "2024-03-15T00:00:00.000Z"      → "2024-03-15"   ✅ ISO timestamp
 *   "15-03-2024"   (DD-MM-YYYY)     → "2024-03-15"   ✅ common Indian format
 *   "15/03/2024"   (DD/MM/YYYY)     → "2024-03-15"   ✅
 *   Any parseable JS date string    → "YYYY-MM-DD"   ✅
 */
function toInputDate(val) {
  if (!val || String(val).trim() === '') return ''
  const s = String(val).trim()
  if (s.toLowerCase().includes('invalid')) return ''

  // 1. Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  // 2. ISO datetime — slice date part
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.substring(0, 10)

  // 3. DD-MM-YYYY  or  DD/MM/YYYY
  const dmy = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
  if (dmy) {
    const iso = `${dmy[3]}-${dmy[2]}-${dmy[1]}`
    if (!isNaN(new Date(iso).getTime())) return iso
    return ''
  }

  // 4. JS Date last resort
  const d = new Date(s)
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return '' // genuinely unparseable → backend will store NULL
}

function extractId(responseData) {
  if (!responseData) return null
  return (
    responseData?.data?.id ||
    responseData?.data?.insertId ||
    responseData?.id ||
    responseData?.insertId ||
    responseData?.report?.id ||
    responseData?.monitoring?.id ||
    responseData?.dailyupdate?.id ||
    null
  )
}

function axiosErrMsg(err) {
  if (!err) return 'Unknown error'
  const data = err.response?.data
  if (typeof data === 'string' && data.length < 300) return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  return err.message || 'Unknown server error — check browser console (F12)'
}

const API = 'http://localhost:5000/api'

export default {
  name: 'AdminDailyUpdate',

  data() {
    return {
      requests: [],
      monitoring: null,
      monitoringEditMode: false,
      monitoringSaving: false,
      monitoringSaveError: '',
      report: null,
      reportEditMode: false,
      reportSaving: false,
      reportSaveError: '',
      monitoringKeys: [],
      reportKeys: [],
      completedKeys: [],
      monitoringCache: {},
      reportCache: {},
      deleteModal: {
        show: false,
        loading: false,
        type: '',
        typeLabel: '',
        requestNo: '',
        dbId: null,
        requestObj: null,
      },
      globalError: '',
      tooltipText: '',
      tooltipStyle: { top: '0px', left: '0px' },
      _ttOver: null,
      _ttOut: null,
    }
  },

  computed: {
    visibleRequests() {
      return this.requests.filter((r) => !this.isCompleted(r.requestNo))
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
        (parseFloat(this.report.targetCycle) || 0) - (parseFloat(this.report.currentReading) || 0)
      )
    },
  },

  mounted() {
    this.loadCaches() // fast localStorage read first
    this.load() // then authoritative DB sync

    this._ttOver = (e) => {
      const el = e.target.closest('[data-tip]')
      if (el) {
        this.tooltipText = el.getAttribute('data-tip')
        const r = el.getBoundingClientRect()
        this.tooltipStyle = {
          top: r.bottom + window.scrollY + 7 + 'px',
          left: Math.max(8, r.left + window.scrollX) + 'px',
        }
      } else {
        this.tooltipText = ''
      }
    }
    this._ttOut = (e) => {
      if (!e.relatedTarget?.closest('[data-tip]')) this.tooltipText = ''
    }
    document.addEventListener('mouseover', this._ttOver)
    document.addEventListener('mouseout', this._ttOut)
  },

  beforeDestroy() {
    document.removeEventListener('mouseover', this._ttOver)
    document.removeEventListener('mouseout', this._ttOut)
  },

  methods: {
    // ── Key helpers ──────────────────────────────────────────────────
    hasMonitoring(n) {
      return this.monitoringKeys.includes(n)
    },
    hasReport(n) {
      return this.reportKeys.includes(n)
    },
    isCompleted(n) {
      return this.completedKeys.includes(n)
    },

    addMonitoringKey(n) {
      if (!this.monitoringKeys.includes(n)) this.monitoringKeys.push(n)
    },
    removeMonitoringKey(n) {
      const i = this.monitoringKeys.indexOf(n)
      if (i !== -1) this.monitoringKeys.splice(i, 1)
    },
    addReportKey(n) {
      if (!this.reportKeys.includes(n)) this.reportKeys.push(n)
    },
    removeReportKey(n) {
      const i = this.reportKeys.indexOf(n)
      if (i !== -1) this.reportKeys.splice(i, 1)
    },
    addCompletedKey(n) {
      if (!this.completedKeys.includes(n)) this.completedKeys.push(n)
    },
    removeCompletedKey(n) {
      const i = this.completedKeys.indexOf(n)
      if (i !== -1) this.completedKeys.splice(i, 1)
    },

    // ── Data loading ─────────────────────────────────────────────────
    async load() {
      try {
        const res = await axios.get(`${API}/requests`)
        this.requests = res.data
        await this.loadFromDB()
      } catch (err) {
        console.error('Failed to load requests:', err)
        this.globalError = 'Failed to load requests: ' + axiosErrMsg(err)
      }
    },

    async loadFromDB() {
      try {
        const monRes = await axios.get(`${API}/dailyupdates`)
        monRes.data.forEach((row) => {
          const key = row.requestNo
          if (!key) return
          this.monitoringCache[key] = { ...(this.monitoringCache[key] || {}), ...row, dbId: row.id }
          this.addMonitoringKey(key)
        })
      } catch (err) {
        console.warn('[AdminDailyUpdate] monitoring DB sync failed:', err)
      }

      try {
        const repRes = await axios.get(`${API}/reports`)
        repRes.data.forEach((row) => {
          const key = row.reqNo
          if (!key) return
          this.reportCache[key] = { ...(this.reportCache[key] || {}), ...row, dbId: row.id }
          this.addReportKey(key)
        })
      } catch (err) {
        console.warn('[AdminDailyUpdate] report DB sync failed:', err)
      }

      this.requests.forEach((r) => {
        if (r.status === 'Completed') this.addCompletedKey(r.requestNo)
      })
      this.saveCaches()
    },

    loadCaches() {
      try {
        const mc = localStorage.getItem('monitoringCache')
        if (mc) {
          this.monitoringCache = JSON.parse(mc)
          this.monitoringKeys = Object.keys(this.monitoringCache)
        }
        const rc = localStorage.getItem('reportCache')
        if (rc) {
          this.reportCache = JSON.parse(rc)
          this.reportKeys = Object.keys(this.reportCache)
        }
        const cc = localStorage.getItem('completedKeys')
        if (cc) this.completedKeys = JSON.parse(cc)
      } catch (e) {
        console.warn('Cache load error', e)
      }
    },

    saveCaches() {
      try {
        localStorage.setItem('monitoringCache', JSON.stringify(this.monitoringCache))
        localStorage.setItem('reportCache', JSON.stringify(this.reportCache))
        localStorage.setItem('completedKeys', JSON.stringify(this.completedKeys))
      } catch (e) {
        console.warn('Cache save error', e)
      }
    },

    // ── MONITORING ───────────────────────────────────────────────────
    openMonitoring(r) {
      this.monitoringEditMode = false
      this.monitoringSaveError = ''

      // ▶ toInputDate() normalises any format → YYYY-MM-DD or ''
      //   This prevents "Invalid date" reaching the DB
      const safeRequestDate = toInputDate(r.requestDate) || todayISO()

      this.monitoring = {
        plNo: r.allocationPlNo || '',
        requestNo: r.requestNo || '',
        partNo: r.partNo || '',
        description: r.description || '',
        customer: r.customer || '',
        date: todayDisplay(), // display field — not a DATEONLY column
        testType: r.category || r.testType || '',
        purpose: r.category || r.testType || '',
        samples: r.samples || '',
        testDetails: r.testDetails || '',
        equipmentName: '',
        equipmentNo: '',
        standard: r.standard || r.spec || '',
        requestDate: safeRequestDate, // ✅ always YYYY-MM-DD or ''
        testStartedOn: '', // blank → null in DB
        testCompletedOn: '', // blank → null in DB
        targetCycle: '',
        initialReading: '',
        currentReading: '',
        remarks: '',
        acceptanceCriteria: r.acceptanceCriteria || r.acceptance || '',
        testResults: '',
        responsibility: 'Admin',
        requestedBy: r.userName || 'User',
        dbId: null,
      }
    },

    editMonitoring(r) {
      this.monitoringEditMode = true
      this.monitoringSaveError = ''
      const cached = this.monitoringCache[r.requestNo]
      if (!cached) {
        this.globalError = 'Monitoring data not found. Please reload.'
        return
      }

      // Deep clone + re-normalise all date fields coming out of cache
      const clone = JSON.parse(JSON.stringify(cached))
      clone.requestDate = toInputDate(clone.requestDate)
      clone.testStartedOn = toInputDate(clone.testStartedOn)
      clone.testCompletedOn = toInputDate(clone.testCompletedOn)
      this.monitoring = clone
    },

    confirmDeleteMonitoringFromModal() {
      const requestNo = this.monitoring.requestNo
      const dbId = this.monitoringCache[requestNo]?.dbId || this.monitoring.dbId || null
      this.monitoring = null
      this.monitoringSaveError = ''
      this.deleteModal = {
        show: true,
        loading: false,
        type: 'monitoring',
        typeLabel: 'Monitoring',
        requestNo,
        dbId,
        requestObj: null,
      }
    },

    async submitDaily() {
      this.monitoringSaveError = ''
      if (!this.monitoring.requestNo) {
        this.monitoringSaveError = 'Request No is missing.'
        return
      }
      this.monitoringSaving = true
      try {
        const requestNo = this.monitoring.requestNo
        const existingDbId = this.monitoringCache[requestNo]?.dbId || this.monitoring.dbId || null
        const { dbId: _omit, ...payload } = this.monitoring

        let savedDbId = existingDbId
        if (this.monitoringEditMode && existingDbId) {
          await axios.put(`${API}/dailyupdates/${existingDbId}`, payload)
        } else {
          const res = await axios.post(`${API}/dailyupdates`, payload)
          savedDbId = extractId(res.data) || existingDbId
        }

        this.monitoringCache[requestNo] = { ...this.monitoring, dbId: savedDbId }
        this.saveCaches()
        this.addMonitoringKey(requestNo)
        alert(this.monitoringEditMode ? '✅ Monitoring updated!' : '✅ Monitoring saved!')
        this.monitoring = null
      } catch (err) {
        console.error('❌ Monitoring save error:', err)
        this.monitoringSaveError = axiosErrMsg(err)
      } finally {
        this.monitoringSaving = false
      }
    },

    confirmDeleteMonitoring(requestNo) {
      const cached = this.monitoringCache[requestNo]
      this.monitoring = null
      this.deleteModal = {
        show: true,
        loading: false,
        type: 'monitoring',
        typeLabel: 'Monitoring',
        requestNo,
        dbId: cached?.dbId || null,
        requestObj: null,
      }
    },

    // ── REPORT ───────────────────────────────────────────────────────
    openReport(r) {
      this.reportEditMode = false
      this.reportSaveError = ''
      const mon = this.monitoringCache[r.requestNo] || {}
      this.report = {
        reportNo: generateReportNo(),
        reqNo: r.requestNo || '',
        plNo: r.allocationPlNo || '',
        date: todayDisplay(),
        description: r.description || '',
        partNo: r.partNo || '',
        customer: r.customer || '',
        component: r.component || '',
        testName: r.testName || '',
        special: r.special || '',
        category: r.category || r.testType || '',
        testType: r.category || r.testType || '',
        samples: r.samples || '',
        standard: r.standard || r.spec || '',
        testDetails: r.testDetails || '',
        spec: mon.equipmentName || '',
        equipmentName: mon.equipmentName || '',
        equipmentNo: mon.equipmentNo || '',
        initialReading: mon.initialReading || '',
        currentReading: mon.currentReading || '',
        targetCycle: mon.targetCycle || '',
        criteria: r.acceptanceCriteria || r.acceptance || '',
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
      this.reportSaveError = ''
      const cached = this.reportCache[r.requestNo]
      if (!cached) {
        this.globalError = 'Report data not found. Please reload.'
        return
      }
      this.report = JSON.parse(JSON.stringify(cached))
    },

    closeReport() {
      this.report = null
      this.reportSaveError = ''
    },

    confirmDeleteReport(requestNo) {
      const cached = this.reportCache[requestNo]
      this.report = null
      this.reportSaveError = ''
      this.deleteModal = {
        show: true,
        loading: false,
        type: 'report',
        typeLabel: 'Report',
        requestNo,
        dbId: cached?.dbId || null,
        requestObj: null,
      }
    },

    confirmDeleteReportFromModal() {
      const requestNo = this.report.reqNo
      const dbId = this.reportCache[requestNo]?.dbId || this.report.dbId || null
      this.report = null
      this.reportSaveError = ''
      this.deleteModal = {
        show: true,
        loading: false,
        type: 'report',
        typeLabel: 'Report',
        requestNo,
        dbId,
        requestObj: null,
      }
    },

    confirmDeleteRequest(r) {
      this.deleteModal = {
        show: true,
        loading: false,
        type: 'request',
        typeLabel: 'Entire Request (including Monitoring & Report)',
        requestNo: r.requestNo,
        dbId: r.id || r.dbId || null,
        requestObj: r,
      }
    },

    async executeDelete() {
      const { type, requestNo, dbId } = this.deleteModal
      const label = this.deleteModal.typeLabel
      this.deleteModal.loading = true
      try {
        if (type === 'monitoring') {
          if (dbId) await axios.delete(`${API}/dailyupdates/${dbId}`)
          delete this.monitoringCache[requestNo]
          this.saveCaches()
          this.removeMonitoringKey(requestNo)
          this.removeCompletedKey(requestNo)
        } else if (type === 'report') {
          if (dbId) await axios.delete(`${API}/reports/${dbId}`)
          delete this.reportCache[requestNo]
          this.saveCaches()
          this.removeReportKey(requestNo)
          this.removeCompletedKey(requestNo)
        } else if (type === 'request') {
          const monDbId = this.monitoringCache[requestNo]?.dbId
          if (monDbId) await axios.delete(`${API}/dailyupdates/${monDbId}`)
          const repDbId = this.reportCache[requestNo]?.dbId
          if (repDbId) await axios.delete(`${API}/reports/${repDbId}`)
          if (dbId) await axios.delete(`${API}/requests/${dbId}`)
          delete this.monitoringCache[requestNo]
          delete this.reportCache[requestNo]
          this.saveCaches()
          this.removeMonitoringKey(requestNo)
          this.removeReportKey(requestNo)
          this.removeCompletedKey(requestNo)
          const idx = this.requests.findIndex((x) => x.requestNo === requestNo)
          if (idx !== -1) this.requests.splice(idx, 1)
        }

        this.deleteModal.show = false
        alert(`🗑 ${label} deleted successfully!`)
      } catch (err) {
        console.error('❌ Delete error:', err)
        this.deleteModal.show = false
        this.globalError = 'Error deleting: ' + axiosErrMsg(err)
      } finally {
        this.deleteModal.loading = false
      }
    },

    // ── Complete Request ──────────────────────────────────────────────
    async completeRequest(r) {
      const requestNo = r.requestNo
      if (!this.monitoringCache[requestNo] || !this.reportCache[requestNo]) {
        alert('Please save both Monitoring and Report before completing.')
        return
      }
      if (!confirm(`Mark Request ${requestNo} as Completed?\nThis will remove it from the list.`))
        return
      try {
        const reqId = r.id || r.dbId
        if (reqId) {
          await axios.put(`${API}/requests/${reqId}`, { ...r, status: 'Completed' })
          const idx = this.requests.findIndex((x) => x.requestNo === requestNo)
          if (idx !== -1) this.$set(this.requests[idx], 'status', 'Completed')
        }
        this.addCompletedKey(requestNo)
        this.saveCaches()
        alert('✅ Request marked as Completed! Row removed from Daily Update list.')
      } catch (err) {
        console.error('❌ Complete request error:', err)
        this.globalError = 'Error completing request: ' + axiosErrMsg(err)
      }
    },

    // ── File handlers ─────────────────────────────────────────────────
    async onPostDataChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.report.postDataName = file.name
      this.report.postDataBase64 = await fileToBase64(file)
    },
    async onFailurePhotosChange(e) {
      for (const file of Array.from(e.target.files))
        this.report.failurePhotos.push(await fileToBase64(file))
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

    // ── Save Report ───────────────────────────────────────────────────
    async submitReport() {
      this.reportSaveError = ''
      if (!this.report.reqNo) {
        this.reportSaveError = 'Request No is missing.'
        return
      }
      this.reportSaving = true
      try {
        const reqNo = this.report.reqNo
        const existingDbId = this.reportCache[reqNo]?.dbId || this.report.dbId || null
        const { dbId: _omit, ...reportPayload } = this.report
        const payload = { ...reportPayload, reportBalance: this.reportBalance }

        let savedDbId = existingDbId
        if (this.reportEditMode && existingDbId) {
          await axios.put(`${API}/reports/${existingDbId}`, payload)
        } else {
          const res = await axios.post(`${API}/reports`, payload)
          savedDbId = extractId(res.data) || existingDbId
        }

        this.reportCache[reqNo] = { ...this.report, dbId: savedDbId }
        this.saveCaches()
        this.addReportKey(reqNo)
        alert(this.reportEditMode ? '✅ Report updated!' : '✅ Report saved!')
        this.report = null
        this.reportSaveError = ''
      } catch (err) {
        console.error('❌ Report save error:', err)
        this.reportSaveError = axiosErrMsg(err)
      } finally {
        this.reportSaving = false
      }
    },

    // ── Print / PDF ───────────────────────────────────────────────────
    downloadPDF(type) {
      this.printSheet(type)
    },
    printMonitoringDirect() {
      if (this.monitoring) this._printMonitoring(this.monitoring)
    },
    printReportDirect() {
      if (this.report) this._printReport(this.report, this.reportBalance)
    },
    printSheet(type) {
      if (type === 'report' && this.report) this._printReport(this.report, this.reportBalance)
      if (type === 'monitoring' && this.monitoring) this._printMonitoring(this.monitoring)
    },

    _printReport(d, bal) {
      const logo = window.location.origin + '/images/TVS.jpg'
      const sigR = d.signReportedPreview
        ? `${d.reportedBy || ''}<br/><img src="${d.signReportedPreview}" style="height:44px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:120px;margin-top:30px;padding-top:3px;">${d.reportedBy || ''}</span>`
      const sigA = d.signApprovedPreview
        ? `${d.approvedBy || ''}<br/><img src="${d.signApprovedPreview}" style="height:44px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:120px;margin-top:30px;padding-top:3px;">${d.approvedBy || ''}</span>`
      const photoImgs = (d.Photos || [])
        .map(
          (src) =>
            `<img src="${src}" style="max-width:260px;max-height:200px;margin:5px;border:1px solid #999;object-fit:cover;border-radius:3px;"/>`,
        )
        .join('')
      const failureBlock = (d.failurePhotos || []).length
        ? `<hr style="border:none;border-top:1px solid #000;margin:6px 0;"/><div><b>Failure Photos:</b><br/><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${photoImgs}</div></div>`
        : ''
      const postDataBlock = d.postDataName
        ? `<hr style="border:none;border-top:1px solid #000;margin:6px 0;"/><div><b>Post Data Attachment:</b> <span style="color:#1a56a0;">${d.postDataName}</span></div>`
        : ''

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Proving Test Report - ${d.reqNo || ''}</title><style>
@page{size:A4 portrait;margin:11mm 13mm}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Times New Roman",Times,serif;font-size:12.5px;color:#000}
table{width:100%;border-collapse:collapse}
.h-logo{width:105px;vertical-align:top}.h-title{text-align:center;vertical-align:middle}
.h-title h1{font-size:21px;font-weight:bold;letter-spacing:1px}
.h-right{width:125px;text-align:right;font-size:11px;color:#c00;vertical-align:bottom;line-height:1.5}
.org{font-size:11.5px;font-weight:bold;color:#2a7d19;margin-top:2px}
.bar{border-top:2px solid #2a7d19;border-bottom:2px solid #2a7d19;margin:5px 0}
.bar td{padding:4px 5px;font-size:12px;white-space:nowrap}
.bar .gl{color:#2a7d19;font-weight:bold}.bar .gv{color:#b00000;font-weight:bold}
.body-row{display:flex;padding:3px 0;font-size:12.5px}
.body-row .lbl{font-weight:bold;min-width:162px;white-space:nowrap}
.body-row .val{flex:1;white-space:pre-wrap}
hr.sec{border:none;border-top:1px solid #000;margin:5px 0}
.sig-line{border-top:1px solid #000;margin-top:22px;display:flex}
.sig-cell{flex:1;padding:5px 4px;font-size:12px}
.footer-line{border-top:1px solid #000;margin-top:7px;display:flex;justify-content:space-between;padding:3px 0;font-size:11px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<table><tr>
  <td class="h-logo"><img src="D:\full-stack-developer\proving-reliability-lab-report-software\images\TVS.jpg" height="62"/><div class="org">Lucas TVS Ltd.</div></td>
  <td class="h-title"><h1>PROVING TEST REPORT</h1></td>
  <td class="h-right">Engineering Center<br/>Proving lab</td>
</tr></table>
<table class="bar"><tr>
  <td><span class="gl">Report No :</span>&nbsp;<span class="gv">${d.reportNo || ''}</span></td>
  <td><span class="gl">Request No :</span>&nbsp;<span class="gv">${d.reqNo || ''}</span></td>
  <td><span class="gl">PL No :</span>&nbsp;<span class="gv">${d.plNo || ''}</span></td>
  <td><span class="gl">DATE :</span>&nbsp;<span class="gv">${d.date || ''}</span></td>
</tr></table>
<div class="body-row"><span class="lbl">Product :</span><span class="val">${d.description || ''}</span>
  <span style="font-weight:bold;margin-left:20px;white-space:nowrap;">Part<br/>Number :</span>
  <span style="margin-left:6px;">${d.partNo || ''}</span></div>
<div class="body-row"><span class="lbl">Cust/Appln :</span><span class="val">${d.customer || ''}</span></div>
<div class="body-row"><span class="lbl">Component :</span><span class="val">${d.component || '-'}</span></div>
<div class="body-row"><span class="lbl">Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.testName || ''}</span></div>
<div class="body-row"><span class="lbl">Special<br/>Features &nbsp;&nbsp;&nbsp; :</span><span class="val">${d.special || '-'}</span></div>
<div class="body-row"><span class="lbl">Purpose Of<br/>The Test &nbsp;&nbsp;&nbsp; :</span><span class="val">${d.category || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Test Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.testType || ''}</span></div>
<div class="body-row"><span class="lbl">No Of Samples &nbsp;&nbsp;&nbsp;&nbsp;:</span><span class="val">${d.samples || ''}</span></div>
<div class="body-row"><span class="lbl">Standard / Spec &nbsp;&nbsp;&nbsp;:</span><span class="val">${d.standard || ''}</span></div>
<div class="body-row"><span class="lbl">Test Equipment &nbsp;&nbsp; :</span><span class="val">${d.spec || ''}</span></div>
<div class="body-row"><span class="lbl">Spec./Test Details :</span><span class="val">${d.testDetails || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Acceptance<br/>Criteria :</span><span class="val">${d.criteria || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Observation :</span><span class="val">${d.observation || ''}</span></div>
${postDataBlock}${failureBlock}
<hr class="sec"/>
<div class="body-row"><span class="lbl">Conclusion &nbsp; :</span><span class="val">${d.conclusion || ''}</span></div>
<div class="body-row" style="margin-top:4px;">
  <span class="lbl">Result &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
  <span class="val" style="font-weight:bold;color:${d.result === 'Passed' || d.result === 'Completed' ? '#1a7d2a' : '#c00'};">${d.result || ''}</span>
</div>
<div class="sig-line">
  <div class="sig-cell"><b>Reported By :</b>&nbsp;&nbsp;${sigR}</div>
  <div class="sig-cell"><b>Approved By :</b>&nbsp;&nbsp;${sigA}</div>
</div>
<div style="display:flex;border-top:1px solid #ccc;font-size:12px;padding:4px 4px;">
  <div style="flex:1;"><b>Circulation :</b>&nbsp;&nbsp;Dev.Engg/file</div>
  <div style="flex:1;"><b>Requested By :</b>&nbsp;&nbsp;${d.requestedBy || ''}</div>
</div>
<div class="footer-line"><span>FORM NO: J21 - 03</span><span>RETENTION PERIOD : 3 YEARS</span></div>
</body></html>`
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 400)
    },

    _printMonitoring(d) {
      const logo =
        window.location.origin +
        'D:\full-stack-developer\proving-reliability-lab-report-software\images\TVS.jpg'
      const finalCounter = (parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0)

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Proving Test Data Sheet - ${d.requestNo || ''}</title><style>
@page{size:A4 landscape;margin:12mm 14mm}*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Times New Roman",Times,serif;font-size:13px;color:#000}
table{width:100%;border-collapse:collapse}
.th-org{vertical-align:top;width:200px;font-size:13px;line-height:1.6}
.th-title{text-align:center;vertical-align:middle}
.th-title h1{font-size:20px;font-weight:bold;letter-spacing:0.5px}
.th-logo{text-align:right;vertical-align:top;width:110px}
.main td{border:1px solid #000;padding:7px 10px;vertical-align:top;font-size:13px}
.lbl{font-weight:bold}.rc{width:225px}
.foot{margin-top:16px;display:flex;justify-content:space-between;font-size:11.5px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<table style="border:none;margin-bottom:20px;"><tr>
  <td class="th-org" style="border:none;">Lucas-TVS LTD.<br/>Proving &amp; Reliability Lab</td>
  <td class="th-title" style="border:none;"><h1>PROVING TEST DATA SHEET</h1></td>
  <td class="th-logo" style="border:none;"><img src="${logo}" height="65"/></td>
</tr></table>
<table class="main">
  <tr>
    <td colspan="3"><span class="lbl">Test Equipment :</span> ${d.equipmentName || ''}</td>
    <td class="rc"><span class="lbl">Equip.No :</span> ${d.equipmentNo || ''}</td>
  </tr>
  <tr>
    <td colspan="3">
      <span class="lbl">Product/Component :</span> ${d.description || d.partNo || ''}<br/>
      <span class="lbl">Test Type / Purpose :</span> ${d.purpose || d.testType || ''}&nbsp;&nbsp;
      <span class="lbl">Cust/Appln :</span> ${d.customer || ''}&nbsp;&nbsp;
      <span class="lbl">No of Samples :</span> ${d.samples || ''}
    </td>
    <td class="rc">
      <span class="lbl">PL.No :</span> ${d.plNo || ''}<br/>
      <span class="lbl">Request No :</span> ${d.requestNo || ''}<br/>
      <span class="lbl">Date :</span> ${d.date || ''}<br/>
      <span class="lbl">Request Date :</span> ${d.requestDate || ''}
    </td>
  </tr>
  <tr>
    <td colspan="3"><span class="lbl">Standard / Spec :</span> ${d.standard || ''}</td>
    <td class="rc"><span class="lbl">Test Started On :</span> ${d.testStartedOn || ''}</td>
  </tr>
  <tr>
    <td colspan="3" rowspan="2" style="white-space:pre-wrap;"><span class="lbl">Test Details :</span><br/>${d.testDetails || ''}</td>
    <td class="rc"><span class="lbl">Initial Hourmeter/Counter :</span> ${d.initialReading || ''}</td>
  </tr>
  <tr><td class="rc"><span class="lbl">Test Completed On :</span> ${d.testCompletedOn || ''}</td></tr>
  <tr>
    <td colspan="3"><span class="lbl">Purpose Of The Test :</span> ${d.purpose || ''}</td>
    <td class="rc"><span class="lbl">Final Hourmeter/Counter :</span> ${finalCounter}</td>
  </tr>
  <tr><td colspan="4"><span class="lbl">Tryout Details :</span><br/>${d.remarks || ''}</td></tr>
  <tr><td colspan="4"><span class="lbl">Acceptance Criteria :</span> ${d.acceptanceCriteria || ''}</td></tr>
  <tr>
    <td colspan="3"><span class="lbl">Test Results :</span><br/>${d.testResults || ''}</td>
    <td class="rc">
      <span class="lbl">Responsibility :</span> ${d.responsibility || ''}<br/>
      <span class="lbl">Requested By :</span> ${d.requestedBy || ''}
    </td>
  </tr>
</table>
<div class="foot"><span>FORM NO: J21 - 02</span><span>RETENTION PERIOD : 3 YEARS</span></div>
</body></html>`
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 400)
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
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  overflow-y: auto;
}
.modal-box {
  background: #fff;
  padding: 24px;
  width: 540px;
  margin: 36px auto;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
.large {
  width: 760px;
}
.section-header {
  font-weight: 600;
  font-size: 13.5px;
  color: #1a56a0;
  background: #eef4ff;
  border-left: 4px solid #1a56a0;
  padding: 6px 10px;
  margin-bottom: 10px;
  border-radius: 2px;
}
.auto-field {
  background: #f4f8fd !important;
  color: #444 !important;
  border-color: #b8cfe8 !important;
}
.alert-error {
  background: #fff5f5;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  border-radius: 5px;
  padding: 10px 14px 10px 12px;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}
.close-err {
  margin-left: auto;
  background: none;
  border: none;
  color: #b91c1c;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  flex-shrink: 0;
}
.global-toast-error {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #b91c1c;
  color: #fff;
  padding: 12px 22px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 600px;
}
.badge-autofill {
  display: inline-block;
  margin-left: 6px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  padding: 1px 7px;
  vertical-align: middle;
  cursor: default;
}
.g-tooltip {
  position: absolute;
  z-index: 9999;
  background: #1e293b;
  color: #f1f5f9;
  font-size: 12px;
  padding: 5px 11px;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.file-tag {
  display: inline-block;
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 13px;
  color: #2e7d32;
}
.photo-preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.photo-thumb-wrap {
  position: relative;
}
.photo-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.thumb-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 13px;
  cursor: pointer;
  line-height: 1.1;
}
.sig-preview {
  display: block;
  height: 60px;
  border: 1px dashed #aaa;
  border-radius: 4px;
  padding: 3px;
  object-fit: contain;
  background: #fafafa;
}
.gap-2 {
  gap: 8px;
}
.me-1 {
  margin-right: 4px;
}
</style>
