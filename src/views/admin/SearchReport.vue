<template>
  <div class="container mt-4" style="max-width: 700px">
    <h2>📄 Print / Download Proving Test Report</h2>
    <p class="text-muted mb-4">
      Search by Request No, PL No, or Report No to print or download a Report.
    </p>

    <!-- SEARCH BAR -->
    <div class="card p-4 mb-4 shadow-sm">
      <div class="row g-2 align-items-end">
        <div class="col-md-4">
          <label class="form-label fw-semibold">Request No</label>
          <input v-model="searchReqNo" class="form-control" placeholder="e.g. REQ-2024-00001" @keyup.enter="search" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">PL No</label>
          <input v-model="searchPlNo" class="form-control" placeholder="e.g. 00023" @keyup.enter="search" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold">Report No</label>
          <input v-model="searchReportNo" class="form-control" placeholder="e.g. RPT-20240115-0001" @keyup.enter="search" />
        </div>
      </div>
      <div class="mt-3">
        <!-- ✅ FIX: Search button now re-fetches fresh data from DB first -->
        <button class="btn btn-primary px-4" :disabled="loading" @click="search">
          <span v-if="loading">⏳ Searching…</span>
          <span v-else>🔍 Search Report</span>
        </button>
      </div>
    </div>

    <div v-if="searched && !result && !loading" class="alert alert-warning">
      ❌ No Report found. Make sure the Report has been saved first.
    </div>

    <!-- RESULT CARD -->
    <div v-if="result" class="card p-4 shadow-sm">
      <h5 class="mb-3 text-success">📄 Report Found</h5>
      <table class="table table-bordered table-sm mb-3">
        <tbody>
          <tr><th>Report No</th><td>{{ result.reportNo }}</td></tr>
          <tr><th>Request No</th><td>{{ result.reqNo }}</td></tr>
          <tr><th>PL No</th><td>{{ result.plNo }}</td></tr>
          <tr><th>Part No</th><td>{{ result.partNo }}</td></tr>
          <tr><th>Customer</th><td>{{ result.customer }}</td></tr>
          <tr><th>Test Name</th><td>{{ result.testName }}</td></tr>
          <tr><th>Result</th><td><span :class="resultBadge(result.result)">{{ result.result }}</span></td></tr>
          <tr><th>Date</th><td>{{ result.date }}</td></tr>
          <tr><th>Reported By</th><td>{{ result.reportedBy }}</td></tr>
          <tr><th>Approved By</th><td>{{ result.approvedBy }}</td></tr>
          <tr>
            <th>Signatures</th>
            <td>
              <span v-if="result.signReportedPreview || result.signApprovedPreview">✅ Included</span>
              <span v-else class="text-muted">— None uploaded</span>
            </td>
          </tr>
          <tr>
            <th>Failure Photos</th>
            <td>
              <span v-if="result.failurePhotos && result.failurePhotos.length">✅ {{ result.failurePhotos.length }} photo(s)</span>
              <span v-else class="text-muted">— None</span>
            </td>
          </tr>
          <tr>
            <th>Post Data File</th>
            <td>
              <span v-if="result.postDataName">📄 {{ result.postDataName }}</span>
              <span v-else class="text-muted">— None</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-3 flex-wrap">
        <button class="btn btn-primary" @click="printReport">🖨 Print (A4 Portrait)</button>
        <button class="btn btn-danger" @click="downloadReportPDF" :disabled="pdfLoading">
          <span v-if="pdfLoading">⏳ Generating PDF…</span>
          <span v-else>⬇ Download PDF</span>
        </button>
      </div>
      <p class="text-muted mt-2" style="font-size:12px">
        ℹ️ <b>Print</b> opens the browser print dialog &nbsp;|&nbsp;
        <b>Download PDF</b> saves a .pdf file directly — includes signatures &amp; photos.
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const API = 'http://localhost:5000/api'

function safeJsonParse(val, fallback) {
  if (!val) return fallback
  if (Array.isArray(val)) return val
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return fallback }
}

// ── PDF helpers ──────────────────────────────────────────────────────────────
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

export default {
  name: 'ReportPrint',
  data() {
    return {
      searchReqNo: '',
      searchPlNo: '',
      searchReportNo: '',
      searched: false,
      loading: false,
      pdfLoading: false,
      result: null,
    }
  },
  methods: {
    // ✅ FIX: Always fetch fresh data from DB on each search — reflects latest edits/updates
    async search() {
      const reqNo    = this.searchReqNo.trim()
      const plNo     = this.searchPlNo.trim()
      const reportNo = this.searchReportNo.trim()
      if (!reqNo && !plNo && !reportNo) {
        alert('Please enter at least one search field.')
        return
      }

      this.searched = true
      this.result = null
      this.loading = true

      try {
        // Always hit DB fresh so edits made in AdminDailyUpdate are reflected immediately
        const res = await axios.get(`${API}/reports`)
        const rows = (res.data || []).map((r) => ({
          ...r,
          failurePhotos: safeJsonParse(r.failurePhotos, []),
        }))

        const found = rows.find((r) => {
          if (reqNo    && (r.reqNo    || '').toLowerCase() === reqNo.toLowerCase())    return true
          if (plNo     && (r.plNo     || '').toLowerCase() === plNo.toLowerCase())     return true
          if (reportNo && (r.reportNo || '').toLowerCase() === reportNo.toLowerCase()) return true
          return false
        })

        if (found) { this.result = found; return }
      } catch (err) {
        console.warn('DB fetch failed, falling back to localStorage:', err)
      } finally {
        this.loading = false
      }

      // Fallback: localStorage cache
      const raw = localStorage.getItem('reportCache')
      if (raw) {
        try {
          const cache = JSON.parse(raw)
          for (const key of Object.keys(cache)) {
            const r = cache[key]
            if (reqNo    && (r.reqNo    || '').toLowerCase() === reqNo.toLowerCase())    { this.result = { ...r, failurePhotos: safeJsonParse(r.failurePhotos, []) }; return }
            if (plNo     && (r.plNo     || '').toLowerCase() === plNo.toLowerCase())     { this.result = { ...r, failurePhotos: safeJsonParse(r.failurePhotos, []) }; return }
            if (reportNo && (r.reportNo || '').toLowerCase() === reportNo.toLowerCase()) { this.result = { ...r, failurePhotos: safeJsonParse(r.failurePhotos, []) }; return }
          }
        } catch (e) { /* ignore */ }
      }
    },

    resultBadge(result) {
      return {
        badge: true,
        'bg-success': result === 'Passed' || result === 'Completed',
        'bg-danger':  result === 'Failed',
        'bg-warning text-dark': !result,
      }
    },

    printReport() {
      if (!this.result) return
      const win = window.open('', '_blank')
      win.document.write(this.buildHTML(this.result))
      win.document.close()
      setTimeout(() => win.print(), 400)
    },

    async downloadReportPDF() {
      if (!this.result || this.pdfLoading) return
      this.pdfLoading = true
      try {
        await downloadHtmlAsPDF(
          this.buildHTML(this.result),
          `Report-${this.result.reqNo || 'report'}.pdf`,
          false,
        )
      } catch (e) {
        console.error('PDF error:', e)
        alert('PDF download failed. Use 🖨 Print → "Save as PDF" instead.')
      } finally {
        this.pdfLoading = false
      }
    },

    buildHTML(d) {
      const logo = window.location.origin + '/images/TVS.jpg'
      const balance = (parseFloat(d.targetCycle) || 0) - (parseFloat(d.currentReading) || 0)
      const resultColor = d.result === 'Passed' || d.result === 'Completed' ? '#1a7d2a' : '#c00000'
      const photos = safeJsonParse(d.failurePhotos, [])
      const sigR = d.signReportedPreview
        ? `${d.reportedBy || ''}<br/><img src="${d.signReportedPreview}" style="height:44px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;object-fit:contain;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:130px;margin-top:28px;padding-top:3px;font-size:12px;">${d.reportedBy || ''}</span>`
      const sigA = d.signApprovedPreview
        ? `${d.approvedBy || ''}<br/><img src="${d.signApprovedPreview}" style="height:44px;margin-top:3px;border:1px dashed #aaa;padding:2px;background:#fafafa;object-fit:contain;"/>`
        : `<span style="display:inline-block;border-top:1px solid #000;min-width:130px;margin-top:28px;padding-top:3px;font-size:12px;">${d.approvedBy || ''}</span>`
      const photoImgs = photos.map((s) =>
        `<img src="${s}" style="max-width:240px;max-height:190px;margin:4px;border:1px solid #999;object-fit:cover;border-radius:3px;"/>`
      ).join('')
      const failureBlock = photos.length
        ? `<hr style="border:none;border-top:1px solid #000;margin:6px 0;"/><div><b>Failure Photos:</b><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${photoImgs}</div></div>`
        : ''
      const postDataBlock = d.postDataName
        ? `<hr style="border:none;border-top:1px solid #000;margin:6px 0;"/><div><b>Post Data:</b> <span style="color:#1a56a0;">${d.postDataName}</span></div>`
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
  .row{display:flex;padding:3px 0;font-size:12.5px}
  .row .lbl{font-weight:bold;min-width:162px;white-space:nowrap}
  .row .val{flex:1;white-space:pre-wrap}
  hr.sec{border:none;border-top:1px solid #000;margin:5px 0}
  .sig-line{border-top:1px solid #000;margin-top:22px;display:flex}
  .sig-cell{flex:1;padding:5px 4px;font-size:12px}
  .foot{border-top:1px solid #000;margin-top:7px;display:flex;justify-content:space-between;padding:3px 0;font-size:11px}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<table><tr>
  <td class="h-logo"><img src="${logo}" height="62" onerror="this.style.display='none'"/><div class="org">Lucas TVS Ltd.</div></td>
  <td class="h-title"><h1>PROVING TEST REPORT</h1></td>
  <td class="h-right">Engineering Center<br/>Proving lab</td>
</tr></table>
<table class="bar"><tr>
  <td><span class="gl">Report No:</span>&nbsp;<span class="gv">${d.reportNo || ''}</span></td>
  <td><span class="gl">Request No:</span>&nbsp;<span class="gv">${d.reqNo || ''}</span></td>
  <td><span class="gl">PL No:</span>&nbsp;<span class="gv">${d.plNo || ''}</span></td>
  <td><span class="gl">DATE:</span>&nbsp;<span class="gv">${d.date || ''}</span></td>
</tr></table>
<div class="row"><span class="lbl">Product :</span><span class="val">${d.description || ''}</span><span style="font-weight:bold;margin-left:20px;white-space:nowrap;">Part<br/>Number :</span><span style="margin-left:6px;">${d.partNo || ''}</span></div>
<div class="row"><span class="lbl">Cust/Appln :</span><span class="val">${d.customer || ''}</span></div>
<div class="row"><span class="lbl">Component :</span><span class="val">${d.component || '-'}</span></div>
<div class="row"><span class="lbl">Test :</span><span class="val">${d.testName || ''}</span></div>
<div class="row"><span class="lbl">Special Features :</span><span class="val">${d.special || '-'}</span></div>
<div class="row"><span class="lbl">Purpose Of The Test :</span><span class="val">${d.category || ''}</span></div>
<hr class="sec"/>
<div class="row"><span class="lbl">Test Type :</span><span class="val">${d.testType || ''}</span></div>
<div class="row"><span class="lbl">No Of Samples :</span><span class="val">${d.samples || ''}</span></div>
<div class="row"><span class="lbl">Standard / Spec :</span><span class="val">${d.standard || ''}</span></div>
<div class="row"><span class="lbl">Test Equipment :</span><span class="val">${d.spec || d.equipmentName || ''}</span></div>
<div class="row"><span class="lbl">Equipment No :</span><span class="val">${d.equipmentNo || ''}</span></div>
<div class="row"><span class="lbl">Spec./Test Details :</span><span class="val">${d.testDetails || ''}</span></div>
<hr class="sec"/>
<div class="row"><span class="lbl">Initial Counter :</span><span class="val">${d.initialReading || ''}</span><span class="lbl" style="margin-left:20px;">Current Counter :</span><span class="val">${d.currentReading || ''}</span><span class="lbl" style="margin-left:20px;">Target Cycle :</span><span class="val">${d.targetCycle || ''}</span></div>
<div class="row"><span class="lbl">Balance (Yet to Cover) :</span><span class="val">${balance}</span></div>
<hr class="sec"/>
<div class="row"><span class="lbl">Acceptance Criteria :</span><span class="val">${d.criteria || ''}</span></div>
<hr class="sec"/>
<div class="row"><span class="lbl">Observation :</span><span class="val">${d.observation || ''}</span></div>
${postDataBlock}${failureBlock}
<hr class="sec"/>
<div class="row"><span class="lbl">Conclusion :</span><span class="val">${d.conclusion || ''}</span></div>
<div class="row" style="margin-top:4px;"><span class="lbl">Result :</span><span class="val" style="font-weight:bold;color:${resultColor};">${d.result || ''}</span></div>
<div class="sig-line">
  <div class="sig-cell"><b>Reported By :</b>&nbsp;${sigR}</div>
  <div class="sig-cell"><b>Approved By :</b>&nbsp;${sigA}</div>
</div>
<div style="display:flex;border-top:1px solid #ccc;font-size:12px;padding:4px;">
  <div style="flex:1;"><b>Circulation :</b>&nbsp;Dev.Engg/file</div>
  <div style="flex:1;"><b>Requested By :</b>&nbsp;${d.requestedBy || ''}</div>
</div>
<div class="foot"><span>FORM NO: J21-03</span><span>RETENTION PERIOD: 3 YEARS</span></div>
</body></html>`
    },
  },
}
</script>

<style scoped>
h2 { font-weight: bold; color: #2c3e50; }
.card { border-radius: 8px; }
</style>