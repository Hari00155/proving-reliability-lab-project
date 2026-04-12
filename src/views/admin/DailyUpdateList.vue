<template>
  <div class="container mt-4">
    <h2>📊 Daily Update - Admin</h2>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>S.No</th><th>Req No</th><th>PL No</th><th>User</th>
          <th>Part No</th><th>Status</th><th>Actions</th>
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
            <button class="btn btn-primary btn-sm me-1 tt" data-tip="Open Monitoring Sheet" @click="openMonitoring(r)">Monitoring</button>
            <button class="btn btn-warning btn-sm me-1 tt" data-tip="Open Proving Test Report" @click="openReport(r)">Report</button>
            <button v-if="hasMonitoring(r.requestNo)" class="btn btn-outline-secondary btn-sm me-1 tt" data-tip="Edit saved Monitoring Sheet" @click="editMonitoring(r)">✏ Edit Mon.</button>
            <button v-if="hasMonitoring(r.requestNo)" class="btn btn-outline-danger btn-sm me-1 tt" data-tip="Delete Monitoring Sheet" @click="confirmDeleteMonitoring(r.requestNo)">🗑 Del Mon.</button>
            <button v-if="hasReport(r.requestNo)" class="btn btn-outline-secondary btn-sm me-1 tt" data-tip="Edit saved Report" @click="editReport(r)">✏ Edit Rep.</button>
            <button v-if="hasReport(r.requestNo)" class="btn btn-outline-danger btn-sm me-1 tt" data-tip="Delete Report" @click="confirmDeleteReport(r.requestNo)">🗑 Del Rep.</button>
            <button
              v-if="hasMonitoring(r.requestNo) && hasReport(r.requestNo) && !isCompleted(r.requestNo)"
              class="btn btn-success btn-sm me-1 tt"
              data-tip="Mark as Completed"
              @click="completeRequest(r)"
            >✅ Complete</button>
            <button class="btn btn-danger btn-sm tt" data-tip="Delete entire request" @click="confirmDeleteRequest(r)">🗑 Del Req</button>
          </td>
        </tr>
        <tr v-if="visibleRequests.length === 0">
          <td colspan="7" class="text-center text-muted py-3">No active requests.</td>
        </tr>
      </tbody>
    </table>

    <!-- GLOBAL ERROR TOAST -->
    <div v-if="globalError" class="global-toast-error">
      ❌ {{ globalError }}
      <button @click="globalError = ''" style="margin-left:10px;background:none;border:none;color:#fff;font-size:16px;cursor:pointer;">×</button>
    </div>

    <!-- DELETE CONFIRM MODAL -->
    <div v-if="deleteModal.show" class="modal-overlay">
      <div class="modal-box" style="width:420px;text-align:center">
        <div style="font-size:48px">⚠️</div>
        <h5 class="mt-2 mb-2">Confirm Delete</h5>
        <p class="mb-3">
          Are you sure you want to delete the <strong>{{ deleteModal.typeLabel }}</strong>
          for Request No: <strong>{{ deleteModal.requestNo }}</strong>?
          <br/><span style="color:#c00;font-size:12px">This action cannot be undone.</span>
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-danger" :disabled="deleteModal.loading" @click="executeDelete">
            <span v-if="deleteModal.loading">⏳ Deleting…</span>
            <span v-else>Yes, Delete</span>
          </button>
          <button class="btn btn-secondary" :disabled="deleteModal.loading" @click="deleteModal.show = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         MONITORING MODAL
    ══════════════════════════════════ -->
    <div v-if="monitoring" class="modal-overlay">
      <div class="modal-box" style="max-height:90vh;overflow-y:auto">
        <h4>📘 {{ monitoringEditMode ? 'Edit' : 'New' }} Monitoring Sheet</h4>

        <div v-if="monitoringEditMode" class="edit-banner mb-3">
          ✏️ Editing saved Monitoring Sheet — all fields pre-filled with saved data.
        </div>

        <label class="form-label">PL No</label>
        <input v-model="monitoring.plNo" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Date</label>
        <input v-model="monitoring.date" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Equipment Name</label>
        <input v-model="monitoring.equipmentName" class="form-control mb-2" placeholder="Equipment Name" />

        <label class="form-label">Equipment No</label>
        <input v-model="monitoring.equipmentNo" class="form-control mb-2" placeholder="Equipment No" />

        <label class="form-label">Standard / Spec</label>
        <input v-model="monitoring.standard" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Request Date</label>
        <input type="date" v-model="monitoring.requestDate" class="form-control mb-2 auto-field" readonly />

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

        <label class="form-label">Test Type / Purpose of The Test</label>
        <input v-model="monitoring.purpose" class="form-control mb-2 auto-field" readonly />

        <label class="form-label">Tryout Details / Remarks</label>
        <textarea v-model="monitoring.remarks" class="form-control mb-2" rows="2" placeholder="Tryout details..."></textarea>

        <label class="form-label">Acceptance Criteria</label>
        <textarea v-model="monitoring.acceptanceCriteria" class="form-control mb-2 auto-field" rows="2" readonly></textarea>

        <label class="form-label">Test Results</label>
        <textarea v-model="monitoring.testResults" class="form-control mb-2" rows="2" placeholder="Test results..."></textarea>

        <label class="form-label">Responsibility</label>
        <input v-model="monitoring.responsibility" class="form-control mb-2" placeholder="Responsibility" />

        <label class="form-label">Requested By</label>
        <input v-model="monitoring.requestedBy" class="form-control mb-2" placeholder="Requested By" />

        <div v-if="monitoringSaveError" class="alert-error mb-2">
          <span>❌ {{ monitoringSaveError }}</span>
          <button class="close-err" @click="monitoringSaveError = ''">×</button>
        </div>

        <div class="d-flex gap-2 mt-2 flex-wrap">
          <button class="btn btn-info tt" data-tip="Print as A4 Landscape Datasheet" @click="printMonitoringLive">🖨 Print Datasheet</button>
          <button class="btn btn-outline-danger tt" data-tip="Download Datasheet as PDF" @click="downloadMonitoringPDF" :disabled="monitoringPdfLoading">
            <span v-if="monitoringPdfLoading">⏳ Generating…</span>
            <span v-else>⬇ PDF</span>
          </button>
          <button class="btn btn-success tt" :disabled="monitoringSaving" @click="submitDaily">
            <span v-if="monitoringSaving">⏳ Saving…</span>
            <span v-else>{{ monitoringEditMode ? '💾 Update' : '💾 Save' }}</span>
          </button>
          <button v-if="monitoringEditMode" class="btn btn-danger tt" @click="confirmDeleteMonitoringFromModal">🗑 Delete</button>
          <button class="btn btn-secondary tt" @click="closeMonitoring">Close</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         REPORT MODAL
    ══════════════════════════════════ -->
    <div v-if="report" class="modal-overlay">
      <div class="modal-box large" style="max-height:90vh;overflow-y:auto">
        <h4>📄 {{ reportEditMode ? 'Edit' : 'New' }} Proving Test Report</h4>

        <div v-if="reportEditMode" class="edit-banner mb-3">
          ✏️ Editing saved Report — all fields, photos &amp; signatures are pre-filled.
        </div>

        <div v-if="reportSaveError" class="alert-error mb-3">
          <span>❌ {{ reportSaveError }}</span>
          <button class="close-err" @click="reportSaveError = ''">×</button>
        </div>

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
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Test Type</label>
            <input v-model="report.testType" class="form-control auto-field" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">Purpose of the Test</label>
            <input v-model="report.category" class="form-control auto-field" readonly />
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-3">
            <label class="form-label">No of Samples</label>
            <input v-model="report.samples" class="form-control auto-field" readonly />
          </div>
          <div class="col-9">
            <label class="form-label">Standard / Spec</label>
            <input v-model="report.standard" class="form-control auto-field" readonly />
          </div>
        </div>
        <label class="form-label">Spec / Test Details</label>
        <textarea v-model="report.testDetails" class="form-control mb-2 auto-field" rows="3" readonly></textarea>

        <div class="section-header mt-3">📘 Monitoring Details (Auto-filled)</div>
        <label class="form-label">Test Equipment</label>
        <input v-model="report.spec" class="form-control mb-2 auto-field" readonly />
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

        <div class="section-header mt-3">✏️ Manual Entry</div>
        <label class="form-label">
          Acceptance Criteria
          <span class="badge-autofill">auto-filled — editable</span>
        </label>
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
            <label class="form-label">Reported By</label>
            <input v-model="report.reportedBy" class="form-control" placeholder="Name" />
          </div>
          <div class="col-4">
            <label class="form-label">Approved By</label>
            <input v-model="report.approvedBy" class="form-control" placeholder="Name" />
          </div>
        </div>
        <label class="form-label">Requested By</label>
        <input v-model="report.requestedBy" class="form-control mb-3" placeholder="Requested By" />

        <!-- ── ATTACHMENTS ── -->
        <div class="section-header">📎 Attachments</div>
        <label class="form-label">Post Data Upload
          <span v-if="reportEditMode && report.postDataName" class="badge bg-success ms-2">Saved ✓</span>
        </label>
        <input type="file" @change="onPostDataChange" class="form-control mb-1" accept=".pdf,.xls,.xlsx,.doc,.docx,.csv" />
        <div v-if="report.postDataName" class="file-tag mb-2">
          📄 {{ report.postDataName }}
          <button class="btn btn-sm btn-link text-danger p-0 ms-2" style="font-size:12px" @click="report.postDataName = null; report.postDataBase64 = null">✕ Remove</button>
        </div>

        <label class="form-label">Photos
          <span v-if="reportEditMode && report.failurePhotos && report.failurePhotos.length" class="badge bg-info ms-2">{{ report.failurePhotos.length }} saved</span>
        </label>
        <input type="file" @change="onFailurePhotosChange" class="form-control mb-1" accept="image/*" multiple />
        <p v-if="reportEditMode && report.failurePhotos && report.failurePhotos.length" class="text-muted" style="font-size:11px;margin-bottom:4px;">
          ℹ️ New photos are added to existing ones. Click ✕ to remove individual photos.
        </p>
        <div v-if="report.failurePhotos && report.failurePhotos.length" class="photo-preview-row mb-2">
          <div v-for="(p, idx) in report.failurePhotos" :key="idx" class="photo-thumb-wrap">
            <img :src="p" class="photo-thumb" />
            <button class="thumb-remove" @click="removePhoto(idx)">×</button>
          </div>
        </div>

        <!-- ── SIGNATURES ── -->
        <div class="section-header mt-3">✍️ Signatures</div>

        <label class="form-label">Reported By – Signature
          <span v-if="reportEditMode && report.signReportedPreview" class="badge bg-success ms-2">Saved ✓</span>
        </label>
        <input type="file" @change="onSignReportedChange" class="form-control mb-1" accept="image/*" />
        <div v-if="report.signReportedPreview" class="mb-3">
          <div class="sig-preview-wrap">
            <img :src="report.signReportedPreview" class="sig-preview" />
          </div>
          <button class="btn btn-sm btn-link text-danger p-0 mt-1" @click="report.signReportedPreview = null">✕ Remove Signature</button>
        </div>

        <label class="form-label">Approved By – Signature
          <span v-if="reportEditMode && report.signApprovedPreview" class="badge bg-success ms-2">Saved ✓</span>
        </label>
        <input type="file" @change="onSignApprovedChange" class="form-control mb-1" accept="image/*" />
        <div v-if="report.signApprovedPreview" class="mb-3">
          <div class="sig-preview-wrap">
            <img :src="report.signApprovedPreview" class="sig-preview" />
          </div>
          <button class="btn btn-sm btn-link text-danger p-0 mt-1" @click="report.signApprovedPreview = null">✕ Remove Signature</button>
        </div>

        <div class="d-flex gap-2 mt-3 flex-wrap">
          <button class="btn btn-primary tt" data-tip="Print Report A4 Portrait" @click="printReportLive">🖨 Print Report</button>
          <button class="btn btn-outline-danger tt" data-tip="Download as PDF" @click="downloadReportPDFLive" :disabled="reportPdfLoading">
            <span v-if="reportPdfLoading">⏳ Generating…</span>
            <span v-else>⬇ PDF</span>
          </button>
          <button class="btn btn-success tt" :disabled="reportSaving" @click="submitReport">
            <span v-if="reportSaving">⏳ Saving…</span>
            <span v-else>{{ reportEditMode ? '💾 Update' : '💾 Save' }}</span>
          </button>
          <button v-if="reportEditMode" class="btn btn-danger tt" @click="confirmDeleteReportFromModal">🗑 Delete</button>
          <button class="btn btn-secondary tt" @click="closeReport">Close</button>
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
  const dateStr = today.getFullYear().toString() +
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

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function todayDisplay() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`
}

function toInputDate(val) {
  if (!val || String(val).trim() === '') return ''
  const s = String(val).trim()
  if (s.toLowerCase().includes('invalid')) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.substring(0, 10)
  const dmy = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
  if (dmy) {
    const iso = `${dmy[3]}-${dmy[2]}-${dmy[1]}`
    return isNaN(new Date(iso).getTime()) ? '' : iso
  }
  const d = new Date(s)
  if (!isNaN(d.getTime()))
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  return ''
}

function extractId(responseData) {
  if (!responseData) return null
  return responseData?.data?.id || responseData?.data?.insertId ||
    responseData?.id || responseData?.insertId ||
    responseData?.report?.id || responseData?.monitoring?.id ||
    responseData?.dailyupdate?.id || null
}

function axiosErrMsg(err) {
  if (!err) return 'Unknown error'
  const data = err.response?.data
  if (typeof data === 'string' && data.length < 300) return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  return err.message || 'Unknown server error'
}

function safeJsonParse(val, fallback) {
  if (!val) return fallback
  if (Array.isArray(val)) return val
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return fallback }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      try {
        const stripped = {}
        for (const [k, v] of Object.entries(value)) {
          stripped[k] = { ...v }
          delete stripped[k].failurePhotos
          delete stripped[k].signReportedPreview
          delete stripped[k].signApprovedPreview
          delete stripped[k].postDataBase64
        }
        localStorage.setItem(key, JSON.stringify(stripped))
        console.warn(`[Cache] QuotaExceeded — saved metadata only for "${key}"`)
        return 'partial'
      } catch (e2) {
        console.error(`[Cache] Could not save "${key}" even after stripping:`, e2)
        return false
      }
    }
    console.error(`[Cache] localStorage error for "${key}":`, e)
    return false
  }
}

// ── PDF download helper (jsPDF + html2canvas) ─────────────────────────────
async function loadScript(url) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${url}"]`)) { res(); return }
    const s = document.createElement('script')
    s.src = url; s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
}

async function downloadHtmlAsPDF(html, filename, landscape = false) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
  const iW = landscape ? 1123 : 794
  const iH = landscape ? 794 : 1123
  const iframe = document.createElement('iframe')
  iframe.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${iW}px;height:${iH}px;border:none;visibility:hidden;`
  document.body.appendChild(iframe)
  iframe.contentDocument.open()
  iframe.contentDocument.write(html)
  iframe.contentDocument.close()
  await new Promise((r) => setTimeout(r, 900))
  const body = iframe.contentDocument.body
  const canvas = await window.html2canvas(body, {
    scale: 2, useCORS: true, allowTaint: true,
    backgroundColor: '#ffffff',
    width: body.scrollWidth, height: body.scrollHeight, windowWidth: iW,
  })
  document.body.removeChild(iframe)
  const { jsPDF } = window.jspdf
  const pdf = new jsPDF({ orientation: landscape ? 'l' : 'p', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const imgH = (canvas.height * pageW) / canvas.width
  const pages = Math.ceil(imgH / pageH)
  for (let pg = 0; pg < pages; pg++) {
    if (pg > 0) pdf.addPage()
    const srcY = pg * (canvas.height / pages)
    const srcH = canvas.height / pages
    const slice = document.createElement('canvas')
    slice.width = canvas.width; slice.height = srcH
    slice.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)
    pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, (srcH * pageW) / canvas.width)
  }
  pdf.save(filename)
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
      monitoringPdfLoading: false,   // ← NEW
      report: null,
      reportEditMode: false,
      reportSaving: false,
      reportSaveError: '',
      reportPdfLoading: false,       // ← NEW
      monitoringKeys: [],
      reportKeys: [],
      completedKeys: [],
      monitoringCache: {},
      reportCache: {},
      deleteModal: {
        show: false, loading: false, type: '', typeLabel: '',
        requestNo: '', dbId: null, requestObj: null,
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
      return (parseFloat(this.monitoring.targetCycle) || 0) - (parseFloat(this.monitoring.currentReading) || 0)
    },
    reportBalance() {
      if (!this.report) return 0
      return (parseFloat(this.report.targetCycle) || 0) - (parseFloat(this.report.currentReading) || 0)
    },
  },

  mounted() {
    this.loadCaches()
    this.load()
    this._ttOver = (e) => {
      const el = e.target.closest('[data-tip]')
      if (el) {
        this.tooltipText = el.getAttribute('data-tip')
        const r = el.getBoundingClientRect()
        this.tooltipStyle = {
          top: r.bottom + window.scrollY + 7 + 'px',
          left: Math.max(8, r.left + window.scrollX) + 'px',
        }
      } else { this.tooltipText = '' }
    }
    this._ttOut = (e) => { if (!e.relatedTarget?.closest('[data-tip]')) this.tooltipText = '' }
    document.addEventListener('mouseover', this._ttOver)
    document.addEventListener('mouseout', this._ttOut)
  },

  beforeDestroy() {
    document.removeEventListener('mouseover', this._ttOver)
    document.removeEventListener('mouseout', this._ttOut)
  },

  methods: {
    // ── Key helpers ───────────────────────────────────────────────
    hasMonitoring(n) { return this.monitoringKeys.includes(n) },
    hasReport(n)     { return this.reportKeys.includes(n) },
    isCompleted(n)   { return this.completedKeys.includes(n) },
    addMonitoringKey(n)    { if (!this.monitoringKeys.includes(n)) this.monitoringKeys.push(n) },
    removeMonitoringKey(n) { const i = this.monitoringKeys.indexOf(n); if (i !== -1) this.monitoringKeys.splice(i, 1) },
    addReportKey(n)    { if (!this.reportKeys.includes(n)) this.reportKeys.push(n) },
    removeReportKey(n) { const i = this.reportKeys.indexOf(n); if (i !== -1) this.reportKeys.splice(i, 1) },
    addCompletedKey(n)    { if (!this.completedKeys.includes(n)) this.completedKeys.push(n) },
    removeCompletedKey(n) { const i = this.completedKeys.indexOf(n); if (i !== -1) this.completedKeys.splice(i, 1) },

    // ── Data loading ──────────────────────────────────────────────
    async load() {
      try {
        const res = await axios.get(`${API}/requests`)
        this.requests = res.data
        await this.loadFromDB()
      } catch (err) {
        this.globalError = 'Failed to load requests: ' + axiosErrMsg(err)
      }
    },

    async loadFromDB() {
      try {
        const monRes = await axios.get(`${API}/dailyupdates`)
        monRes.data.forEach((row) => {
          const key = row.requestNo; if (!key) return
          row.failurePhotos = safeJsonParse(row.failurePhotos, [])
          this.monitoringCache[key] = { ...row, dbId: row.id }
          this.addMonitoringKey(key)
        })
      } catch (err) { console.warn('monitoring DB sync failed:', err) }

      try {
        const repRes = await axios.get(`${API}/reports`)
        repRes.data.forEach((row) => {
          const key = row.reqNo; if (!key) return
          row.failurePhotos = safeJsonParse(row.failurePhotos, [])
          this.reportCache[key] = { ...row, dbId: row.id }
          this.addReportKey(key)
        })
      } catch (err) { console.warn('report DB sync failed:', err) }

      this.requests.forEach((r) => {
        if (r.status === 'Completed') this.addCompletedKey(r.requestNo)
      })
      this.saveCaches()
    },

    loadCaches() {
      try {
        const mc = localStorage.getItem('monitoringCache')
        if (mc) { this.monitoringCache = JSON.parse(mc); this.monitoringKeys = Object.keys(this.monitoringCache) }
        const rc = localStorage.getItem('reportCache')
        if (rc) { this.reportCache = JSON.parse(rc); this.reportKeys = Object.keys(this.reportCache) }
        const cc = localStorage.getItem('completedKeys')
        if (cc) this.completedKeys = JSON.parse(cc)
      } catch (e) { console.warn('Cache load error', e) }
    },

    saveCaches() {
      safeLocalStorageSet('monitoringCache', this.monitoringCache)
      safeLocalStorageSet('reportCache', this.reportCache)
      try { localStorage.setItem('completedKeys', JSON.stringify(this.completedKeys)) }
      catch (e) { console.warn('Cache save error (completedKeys)', e) }
    },

    // ══════════════════════════════════════════════════════════════
    // MONITORING
    // ══════════════════════════════════════════════════════════════

    openMonitoring(r) {
      this.monitoringEditMode = false
      this.monitoringSaveError = ''
      this.monitoring = {
        plNo: r.allocationPlNo || '',
        requestNo: r.requestNo || '',
        partNo: r.partNo || '',
        description: r.description || '',
        customer: r.customer || '',
        component: r.component || '',
        samples: r.samples || '',
        testDetails: r.testDetails || '',
        date: todayDisplay(),
        testType: r.category || r.testType || '',
        purpose: r.category || r.testType || '',
        equipmentName: '',
        equipmentNo: '',
        standard: r.standard || r.spec || '',
        requestDate: toInputDate(r.requestDate) || todayISO(),
        testStartedOn: '',
        testCompletedOn: '',
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
      if (!cached) { this.globalError = 'Monitoring data not found. Please reload.'; return }
      const clone = JSON.parse(JSON.stringify(cached))
      clone.requestDate     = toInputDate(clone.requestDate)
      clone.testStartedOn   = toInputDate(clone.testStartedOn)
      clone.testCompletedOn = toInputDate(clone.testCompletedOn)
      this.monitoring = clone
    },

    closeMonitoring() {
      this.monitoring = null
      this.monitoringSaveError = ''
    },

    confirmDeleteMonitoringFromModal() {
      const requestNo = this.monitoring.requestNo
      const dbId = this.monitoringCache[requestNo]?.dbId || this.monitoring.dbId || null
      this.monitoring = null
      this.monitoringSaveError = ''
      this.deleteModal = { show: true, loading: false, type: 'monitoring', typeLabel: 'Monitoring', requestNo, dbId, requestObj: null }
    },

    async submitDaily() {
      this.monitoringSaveError = ''
      if (!this.monitoring.requestNo) { this.monitoringSaveError = 'Request No is missing.'; return }
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

        // ✅ FIX: Cache updated with live form state (including yetToCover) BEFORE closing
        this.monitoringCache[requestNo] = { ...this.monitoring, dbId: savedDbId, yetToCover: this.yetToCover }
        this.saveCaches()
        this.addMonitoringKey(requestNo)
        alert(this.monitoringEditMode ? '✅ Monitoring updated!' : '✅ Monitoring saved!')
        this.monitoring = null
        this.monitoringSaveError = ''
      } catch (err) {
        this.monitoringSaveError = axiosErrMsg(err)
      } finally {
        this.monitoringSaving = false
      }
    },

    confirmDeleteMonitoring(requestNo) {
      const cached = this.monitoringCache[requestNo]
      this.monitoring = null
      this.deleteModal = { show: true, loading: false, type: 'monitoring', typeLabel: 'Monitoring', requestNo, dbId: cached?.dbId || null, requestObj: null }
    },

    // ✅ FIX: Print uses LIVE form data — always reflects current edits
    printMonitoringLive() {
      if (!this.monitoring) return
      const html = this._buildMonitoringHTML({ ...this.monitoring, yetToCover: this.yetToCover })
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 500)
    },

    // ✅ FIX: Real PDF download for monitoring using jsPDF (not just print dialog)
    async downloadMonitoringPDF() {
      if (!this.monitoring || this.monitoringPdfLoading) return
      this.monitoringPdfLoading = true
      try {
        const html = this._buildMonitoringHTML({ ...this.monitoring, yetToCover: this.yetToCover })
        await downloadHtmlAsPDF(html, `Datasheet-${this.monitoring.requestNo || 'monitoring'}.pdf`, true)
      } catch (e) {
        console.error('PDF error:', e)
        alert('PDF download failed. Use 🖨 Print → "Save as PDF" instead.')
      } finally {
        this.monitoringPdfLoading = false
      }
    },

    // ══════════════════════════════════════════════════════════════
    // REPORT
    // ══════════════════════════════════════════════════════════════

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

    // ✅ FIX: editReport — dual-key lookup + restores all binary/array fields
    editReport(r) {
      this.reportEditMode = true
      this.reportSaveError = ''

      const cached = this.reportCache[r.requestNo] || this.reportCache[r.reqNo]
      if (!cached) {
        this.globalError = 'Report data not found. Please reload the page.'
        return
      }

      const clone = JSON.parse(JSON.stringify(cached))
      // ✅ Restore binary/array fields — DB returns failurePhotos as JSON string
      clone.failurePhotos       = safeJsonParse(clone.failurePhotos, [])
      clone.signReportedPreview = clone.signReportedPreview || null
      clone.signApprovedPreview = clone.signApprovedPreview || null
      clone.postDataName        = clone.postDataName || null
      clone.postDataBase64      = clone.postDataBase64 || null

      this.report = clone
    },

    closeReport() {
      this.report = null
      this.reportSaveError = ''
    },

    confirmDeleteReport(requestNo) {
      const cached = this.reportCache[requestNo]
      this.report = null
      this.reportSaveError = ''
      this.deleteModal = { show: true, loading: false, type: 'report', typeLabel: 'Report', requestNo, dbId: cached?.dbId || null, requestObj: null }
    },

    confirmDeleteReportFromModal() {
      const requestNo = this.report.reqNo
      const cached = this.reportCache[requestNo] || this.reportCache[this.report.requestNo]
      const dbId = cached?.dbId || this.report.dbId || null
      this.report = null
      this.reportSaveError = ''
      this.deleteModal = { show: true, loading: false, type: 'report', typeLabel: 'Report', requestNo, dbId, requestObj: null }
    },

    confirmDeleteRequest(r) {
      this.deleteModal = {
        show: true, loading: false, type: 'request',
        typeLabel: 'Entire Request (including Monitoring & Report)',
        requestNo: r.requestNo, dbId: r.id || r.dbId || null, requestObj: r,
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
          this.saveCaches(); this.removeMonitoringKey(requestNo); this.removeCompletedKey(requestNo)
        } else if (type === 'report') {
          if (dbId) await axios.delete(`${API}/reports/${dbId}`)
          delete this.reportCache[requestNo]
          this.saveCaches(); this.removeReportKey(requestNo); this.removeCompletedKey(requestNo)
        } else if (type === 'request') {
          const monDbId = this.monitoringCache[requestNo]?.dbId
          if (monDbId) await axios.delete(`${API}/dailyupdates/${monDbId}`)
          const repDbId = this.reportCache[requestNo]?.dbId
          if (repDbId) await axios.delete(`${API}/reports/${repDbId}`)
          if (dbId) await axios.delete(`${API}/requests/${dbId}`)
          delete this.monitoringCache[requestNo]; delete this.reportCache[requestNo]
          this.saveCaches()
          this.removeMonitoringKey(requestNo); this.removeReportKey(requestNo); this.removeCompletedKey(requestNo)
          const idx = this.requests.findIndex((x) => x.requestNo === requestNo)
          if (idx !== -1) this.requests.splice(idx, 1)
        }
        this.deleteModal.show = false
        alert(`🗑 ${label} deleted successfully!`)
      } catch (err) {
        this.deleteModal.show = false
        this.globalError = 'Error deleting: ' + axiosErrMsg(err)
      } finally {
        this.deleteModal.loading = false
      }
    },

    async completeRequest(r) {
      const requestNo = r.requestNo
      if (!this.monitoringCache[requestNo] || !this.reportCache[requestNo]) {
        alert('Please save both Monitoring and Report before completing.'); return
      }
      if (!confirm(`Mark Request ${requestNo} as Completed?\nThis will remove it from the list.`)) return
      try {
        const reqId = r.id || r.dbId
        if (reqId) {
          await axios.put(`${API}/requests/${reqId}`, { ...r, status: 'Completed' })
          const idx = this.requests.findIndex((x) => x.requestNo === requestNo)
          if (idx !== -1) this.$set(this.requests[idx], 'status', 'Completed')
        }
        this.addCompletedKey(requestNo)
        this.saveCaches()
        alert('✅ Request marked as Completed!')
      } catch (err) {
        this.globalError = 'Error completing request: ' + axiosErrMsg(err)
      }
    },

    // ── File handlers ─────────────────────────────────────────────
    async onPostDataChange(e) {
      const file = e.target.files[0]; if (!file) return
      this.report.postDataName   = file.name
      this.report.postDataBase64 = await fileToBase64(file)
    },
    async onFailurePhotosChange(e) {
      if (!Array.isArray(this.report.failurePhotos)) this.report.failurePhotos = []
      for (const file of Array.from(e.target.files)) {
        this.report.failurePhotos.push(await fileToBase64(file))
      }
    },
    removePhoto(idx) { this.report.failurePhotos.splice(idx, 1) },
    async onSignReportedChange(e) {
      const file = e.target.files[0]; if (!file) return
      this.report.signReportedPreview = await fileToBase64(file)
    },
    async onSignApprovedChange(e) {
      const file = e.target.files[0]; if (!file) return
      this.report.signApprovedPreview = await fileToBase64(file)
    },

    // ✅ FIX: Cache updated with full live state (photos+sigs) BEFORE modal closes
    async submitReport() {
      this.reportSaveError = ''
      if (!this.report.reqNo) { this.reportSaveError = 'Request No is missing.'; return }
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

        // ✅ Capture full form state into cache BEFORE closing — print-after-save works
        this.reportCache[reqNo] = { ...this.report, dbId: savedDbId, reportBalance: this.reportBalance }
        this.saveCaches()
        this.addReportKey(reqNo)
        alert(this.reportEditMode ? '✅ Report updated!' : '✅ Report saved!')
        this.report = null
        this.reportSaveError = ''
      } catch (err) {
        this.reportSaveError = axiosErrMsg(err)
      } finally {
        this.reportSaving = false
      }
    },

    // ✅ FIX: Print uses LIVE form data — reflects all unsaved edits too
    printReportLive() {
      if (!this.report) return
      const html = this._buildReportHTML({ ...this.report }, this.reportBalance)
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      setTimeout(() => win.print(), 500)
    },

    // ✅ FIX: PDF download uses LIVE form data via jsPDF (not print dialog)
    async downloadReportPDFLive() {
      if (!this.report || this.reportPdfLoading) return
      this.reportPdfLoading = true
      try {
        const html = this._buildReportHTML({ ...this.report }, this.reportBalance)
        await downloadHtmlAsPDF(html, `Report-${this.report.reqNo || 'report'}.pdf`, false)
      } catch (e) {
        console.error('PDF error:', e)
        alert('PDF download failed. Use 🖨 Print → "Save as PDF" instead.')
      } finally {
        this.reportPdfLoading = false
      }
    },

    // ══════════════════════════════════════════════════════════════
    // HTML BUILDERS — shared by modal Print/PDF and ReportPrint/DatasheetPrint
    // ══════════════════════════════════════════════════════════════

    _buildReportHTML(d, bal) {
      const logoSrc = window.location.origin + '/images/TVS.jpg'
      const balance = (bal !== undefined && bal !== null)
        ? bal
        : ((parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0))

      const photos = safeJsonParse(d.failurePhotos, [])
      const sigR = d.signReportedPreview
        ? `${d.reportedBy || ''}<br/><img src="${d.signReportedPreview}" style="height:50px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;object-fit:contain;max-width:160px;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:120px;margin-top:30px;padding-top:3px;">${d.reportedBy || ''}</span>`
      const sigA = d.signApprovedPreview
        ? `${d.approvedBy || ''}<br/><img src="${d.signApprovedPreview}" style="height:50px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;object-fit:contain;max-width:160px;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:120px;margin-top:30px;padding-top:3px;">${d.approvedBy || ''}</span>`
      const photoImgs = photos.map((src) =>
        `<img src="${src}" style="max-width:240px;max-height:180px;margin:4px;border:1px solid #999;object-fit:cover;border-radius:3px;"/>`
      ).join('')
      const failureBlock = photos.length
        ? `<hr style="border:none;border-top:1px solid #000;margin:5px 0;"/><div><b>Photos:</b><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${photoImgs}</div></div>`
        : ''
      const postDataBlock = d.postDataName
        ? `<hr style="border:none;border-top:1px solid #000;margin:5px 0;"/><div><b>Post Data Attachment:</b> <span style="color:#1a56a0;">${d.postDataName}</span></div>`
        : ''

      return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Proving Test Report - ${d.reqNo || ''}</title>
<style>
  @page{size:A4 portrait;margin:11mm 13mm}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Times New Roman",Times,serif;font-size:12.5px;color:#000}
  table{width:100%;border-collapse:collapse}
  .h-logo{width:105px;vertical-align:top}
  .h-title{text-align:center;vertical-align:middle}
  .h-title h1{font-size:21px;font-weight:bold;letter-spacing:1px}
  .h-right{width:125px;text-align:right;font-size:11px;color:#c00;vertical-align:bottom;line-height:1.5}
  .org{font-size:11.5px;font-weight:bold;color:#2a7d19;margin-top:2px}
  .bar{border-top:2px solid #2a7d19;border-bottom:2px solid #2a7d19;margin:5px 0}
  .bar td{padding:4px 5px;font-size:12px;white-space:nowrap}
  .bar .gl{color:#2a7d19;font-weight:bold}.bar .gv{color:#b00000;font-weight:bold}
  .body-row{display:flex;padding:3px 0;font-size:12.5px}
  .body-row .lbl{font-weight:bold;min-width:168px;white-space:nowrap}
  .body-row .val{flex:1;white-space:pre-wrap;word-break:break-word}
  hr.sec{border:none;border-top:1px solid #000;margin:5px 0}
  .sig-line{border-top:1px solid #000;margin-top:18px;display:flex}
  .sig-cell{flex:1;padding:5px 4px;font-size:12px}
  .footer-line{border-top:1px solid #000;margin-top:6px;display:flex;justify-content:space-between;padding:3px 0;font-size:11px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<table><tr>
  <td class="h-logo"><img src="${logoSrc}" height="62" onerror="this.style.display='none'"/><div class="org">Lucas TVS Ltd.</div></td>
  <td class="h-title"><h1>PROVING TEST REPORT</h1></td>
  <td class="h-right">Engineering Center<br/>Proving lab</td>
</tr></table>
<table class="bar"><tr>
  <td><span class="gl">Report No :</span>&nbsp;<span class="gv">${d.reportNo || ''}</span></td>
  <td><span class="gl">Request No :</span>&nbsp;<span class="gv">${d.reqNo || ''}</span></td>
  <td><span class="gl">PL No :</span>&nbsp;<span class="gv">${d.plNo || ''}</span></td>
  <td><span class="gl">DATE :</span>&nbsp;<span class="gv">${d.date || ''}</span></td>
</tr></table>
<div class="body-row"><span class="lbl">Product :</span><span class="val">${d.description || ''}</span><span style="font-weight:bold;margin-left:18px;white-space:nowrap;">Part Number :</span><span style="margin-left:5px;">${d.partNo || ''}</span></div>
<div class="body-row"><span class="lbl">Cust / Appln :</span><span class="val">${d.customer || ''}</span></div>
<div class="body-row"><span class="lbl">Component :</span><span class="val">${d.component || '-'}</span></div>
<div class="body-row"><span class="lbl">Test :</span><span class="val">${d.testName || ''}</span></div>
<div class="body-row"><span class="lbl">Special Features :</span><span class="val">${d.special || '-'}</span></div>
<div class="body-row"><span class="lbl">Purpose Of The Test :</span><span class="val">${d.category || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Test Type :</span><span class="val">${d.testType || ''}</span></div>
<div class="body-row"><span class="lbl">No Of Samples :</span><span class="val">${d.samples || ''}</span></div>
<div class="body-row"><span class="lbl">Standard / Spec :</span><span class="val">${d.standard || ''}</span></div>
<div class="body-row"><span class="lbl">Test Equipment :</span><span class="val">${d.spec || d.equipmentName || ''}</span></div>
<div class="body-row"><span class="lbl">Equipment No :</span><span class="val">${d.equipmentNo || ''}</span></div>
<div class="body-row"><span class="lbl">Spec / Test Details :</span><span class="val">${d.testDetails || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Initial Counter :</span><span class="val" style="min-width:80px">${d.initialReading || ''}</span><span class="lbl" style="margin-left:12px;">Current Counter :</span><span class="val" style="min-width:80px">${d.currentReading || ''}</span><span class="lbl" style="margin-left:12px;">Target Cycle :</span><span class="val">${d.targetCycle || ''}</span></div>
<div class="body-row"><span class="lbl">Balance (Yet to Cover) :</span><span class="val">${balance}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Acceptance Criteria :</span><span class="val">${d.criteria || ''}</span></div>
<hr class="sec"/>
<div class="body-row"><span class="lbl">Observation :</span><span class="val">${d.observation || ''}</span></div>
${postDataBlock}${failureBlock}
<hr class="sec"/>
<div class="body-row"><span class="lbl">Conclusion :</span><span class="val">${d.conclusion || ''}</span></div>
<div class="body-row" style="margin-top:4px;"><span class="lbl">Result :</span><span class="val" style="font-weight:bold;color:${(d.result==='Passed'||d.result==='Completed')?'#1a7d2a':'#c00'};">${d.result || ''}</span></div>
<div class="sig-line">
  <div class="sig-cell"><b>Reported By :</b>&nbsp;&nbsp;${sigR}</div>
  <div class="sig-cell"><b>Approved By :</b>&nbsp;&nbsp;${sigA}</div>
</div>
<div style="display:flex;border-top:1px solid #ccc;font-size:12px;padding:4px;">
  <div style="flex:1;"><b>Circulation :</b>&nbsp;Dev.Engg / file</div>
  <div style="flex:1;"><b>Requested By :</b>&nbsp;${d.requestedBy || ''}</div>
</div>
<div class="footer-line"><span>FORM NO: J21 - 03</span><span>RETENTION PERIOD : 3 YEARS</span></div>
</body></html>`
    },

    _buildMonitoringHTML(d) {
      const logoSrc = window.location.origin + '/images/TVS.jpg'
      const finalCounter = (d.yetToCover !== undefined && d.yetToCover !== null)
        ? d.yetToCover
        : ((parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0))

      return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Proving Test Data Sheet - ${d.requestNo || ''}</title>
<style>
  @page{size:A4 landscape;margin:12mm 14mm}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Times New Roman",Times,serif;font-size:13px;color:#000}
  table{width:100%;border-collapse:collapse}
  .th-org{vertical-align:top;width:200px;font-size:13px;line-height:1.7}
  .th-title{text-align:center;vertical-align:middle}
  .th-title h1{font-size:20px;font-weight:bold;letter-spacing:0.5px}
  .th-logo{text-align:right;vertical-align:top;width:110px}
  .main td{border:1px solid #000;padding:7px 10px;vertical-align:top;font-size:13px}
  .lbl{font-weight:bold}.rc{width:230px}
  .foot{margin-top:16px;display:flex;justify-content:space-between;font-size:11.5px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<table style="border:none;margin-bottom:18px;"><tr>
  <td class="th-org" style="border:none;">Lucas-TVS LTD.<br/>Proving &amp; Reliability Lab</td>
  <td class="th-title" style="border:none;"><h1>PROVING TEST DATA SHEET</h1></td>
  <td class="th-logo" style="border:none;"><img src="${logoSrc}" height="65" onerror="this.style.display='none'"/></td>
</tr></table>
<table class="main">
  <tr><td colspan="3"><span class="lbl">Test Equipment :</span> ${d.equipmentName || ''}</td><td class="rc"><span class="lbl">Equip. No :</span> ${d.equipmentNo || ''}</td></tr>
  <tr>
    <td colspan="3"><span class="lbl">Product / Component :</span> ${d.description || d.partNo || ''}<br/><span class="lbl">Test Type / Purpose :</span> ${d.purpose || d.testType || ''}&nbsp;&nbsp;&nbsp;<span class="lbl">Cust / Appln :</span> ${d.customer || ''}&nbsp;&nbsp;&nbsp;<span class="lbl">No of Samples :</span> ${d.samples || ''}</td>
    <td class="rc"><span class="lbl">PL No :</span> ${d.plNo || ''}<br/><span class="lbl">Request No :</span> ${d.requestNo || ''}<br/><span class="lbl">Date :</span> ${d.date || ''}<br/><span class="lbl">Request Date :</span> ${d.requestDate || ''}</td>
  </tr>
  <tr><td colspan="3"><span class="lbl">Standard / Spec :</span> ${d.standard || ''}</td><td class="rc"><span class="lbl">Test Started On :</span> ${d.testStartedOn || ''}</td></tr>
  <tr><td colspan="3" rowspan="2" style="white-space:pre-wrap;"><span class="lbl">Test Details :</span><br/>${d.testDetails || ''}</td><td class="rc"><span class="lbl">Initial Hourmeter / Counter :</span> ${d.initialReading || ''}</td></tr>
  <tr><td class="rc"><span class="lbl">Test Completed On :</span> ${d.testCompletedOn || ''}</td></tr>
  <tr><td colspan="3"><span class="lbl">Purpose Of The Test :</span> ${d.purpose || ''}</td><td class="rc"><span class="lbl">Final Hourmeter / Counter :</span> ${finalCounter}</td></tr>
  <tr><td colspan="4" style="white-space:pre-wrap;"><span class="lbl">Tryout Details / Remarks :</span><br/>${d.remarks || ''}</td></tr>
  <tr><td colspan="4"><span class="lbl">Acceptance Criteria :</span> ${d.acceptanceCriteria || ''}</td></tr>
  <tr><td colspan="3" style="white-space:pre-wrap;"><span class="lbl">Test Results :</span><br/>${d.testResults || ''}</td><td class="rc"><span class="lbl">Responsibility :</span> ${d.responsibility || ''}<br/><span class="lbl">Requested By :</span> ${d.requestedBy || ''}</td></tr>
</table>
<div class="foot"><span>FORM NO: J21 - 02</span><span>RETENTION PERIOD : 3 YEARS</span></div>
</body></html>`
    },
  },
}
</script>

<style>
.modal-overlay { position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:1000;overflow-y:auto; }
.modal-box { background:#fff;padding:24px;width:560px;margin:36px auto;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.25); }
.large { width:780px; }
.edit-banner { background:#fff8e1;border:1px solid #ffe082;border-left:4px solid #f59e0b;color:#7c4a00;border-radius:4px;padding:8px 12px;font-size:13px;font-weight:500; }
.section-header { font-weight:600;font-size:13.5px;color:#1a56a0;background:#eef4ff;border-left:4px solid #1a56a0;padding:6px 10px;margin-bottom:10px;border-radius:2px; }
.auto-field { background:#f4f8fd !important;color:#444 !important;border-color:#b8cfe8 !important; }
.alert-error { background:#fff5f5;border:1px solid #fca5a5;color:#b91c1c;border-radius:5px;padding:10px 14px 10px 12px;font-size:13px;display:flex;align-items:flex-start;gap:8px;line-height:1.5; }
.close-err { margin-left:auto;background:none;border:none;color:#b91c1c;font-size:20px;cursor:pointer;line-height:1;padding:0 2px;flex-shrink:0; }
.global-toast-error { position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#b91c1c;color:#fff;padding:12px 22px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;max-width:600px; }
.badge-autofill { display:inline-block;margin-left:6px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:3px;font-size:11px;font-weight:500;padding:1px 7px;vertical-align:middle;cursor:default; }
.g-tooltip { position:absolute;z-index:9999;background:#1e293b;color:#f1f5f9;font-size:12px;padding:5px 11px;border-radius:5px;pointer-events:none;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,0.25); }
.file-tag { display:inline-flex;align-items:center;background:#e8f5e9;border:1px solid #a5d6a7;border-radius:4px;padding:3px 10px;font-size:13px;color:#2e7d32; }
.photo-preview-row { display:flex;flex-wrap:wrap;gap:8px; }
.photo-thumb-wrap { position:relative; }
.photo-thumb { width:80px;height:80px;object-fit:cover;border:1px solid #ccc;border-radius:4px; }
.thumb-remove { position:absolute;top:-6px;right:-6px;background:#e53935;color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:13px;cursor:pointer;line-height:1.1; }
.sig-preview-wrap { display:inline-block;border:1px dashed #aaa;border-radius:4px;padding:4px;background:#fafafa; }
.sig-preview { display:block;max-height:70px;max-width:220px;object-fit:contain; }
.gap-2 { gap:8px; }
.me-1 { margin-right:4px; }
.ms-2 { margin-left:8px; }
</style>