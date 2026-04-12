<template>
  <div class="container mt-4" style="max-width: 750px">
    <h2>📊 Test Status Tracker</h2>
    <p class="text-muted mb-4">Search by PL No or Request No to view test progress and balance hours.</p>

    <!-- SEARCH BAR -->
    <div class="card p-4 mb-4 shadow-sm">
      <div class="row g-2 align-items-end">
        <div class="col-md-4">
          <label class="form-label fw-semibold">PL No</label>
          <input v-model="searchPlNo" class="form-control" placeholder="e.g. 00023" @keyup.enter="search" />
        </div>
        <div class="col-md-1 text-center pt-3"><span class="text-muted">OR</span></div>
        <div class="col-md-5">
          <label class="form-label fw-semibold">Request No</label>
          <input v-model="searchReqNo" class="form-control" placeholder="e.g. REQ-2024-00001" @keyup.enter="search" />
        </div>
        <div class="col-md-2">
          <button class="btn btn-primary w-100" :disabled="loading" @click="search">
            <span v-if="loading">⏳</span>
            <span v-else>🔍 Search</span>
          </button>
        </div>
      </div>
    </div>

    <!-- NO RESULT -->
    <div v-if="searched && !result && !loading" class="alert alert-warning">
      ❌ No record found for the given PL No / Request No. Make sure Monitoring data has been saved first.
    </div>

    <!-- RESULT CARD -->
    <div v-if="result" class="card p-4 shadow-sm">

      <!-- Header: Request / PL / Status Badge -->
      <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <h5 class="mb-0 text-primary">{{ result.requestNo || '—' }} &nbsp;/&nbsp; PL {{ result.plNo || '—' }}</h5>
          <small class="text-muted">{{ result.description || result.partNo || '' }}</small>
        </div>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>

      <!-- TARGET REACHED BANNER -->
      <div v-if="isTargetReached" class="alert alert-success d-flex align-items-center gap-2 mb-3">
        <span style="font-size:20px">✅</span>
        <div>
          <strong>Target Reached — Test Complete!</strong><br/>
          All <strong>{{ fmt(status.target) }}</strong> cycles / hours completed successfully.
        </div>
      </div>

      <!-- BALANCE REMAINING ALERT -->
      <div v-if="!isTargetReached && status.target > 0" class="alert alert-info mb-3">
        ⏳ <strong>Balance Remaining:</strong>
        <span class="ms-1 fw-bold text-primary">{{ fmt(status.balance) }}</span> cycles / hours left to complete target.
      </div>

      <!-- PROGRESS BAR -->
      <div v-if="status.target > 0" class="mb-4">
        <div class="d-flex justify-content-between mb-1">
          <span class="small text-muted">Test Progress</span>
          <span class="small fw-semibold">{{ status.pct }}%</span>
        </div>
        <div class="progress" style="height:16px;border-radius:20px;">
          <div
            class="progress-bar"
            :class="isTargetReached ? 'bg-success' : 'bg-primary'"
            role="progressbar"
            :style="{ width: status.pct + '%' }"
            :aria-valuenow="status.pct"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span v-if="status.pct > 10" style="font-size:11px;">{{ status.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- STAT CARDS -->
      <div class="row g-2 mb-4">
        <div class="col-4">
          <div class="stat-card text-center p-3 rounded border bg-light">
            <div class="stat-value text-secondary">{{ fmt(status.target) }}</div>
            <div class="stat-label text-muted">Target Cycles</div>
          </div>
        </div>
        <div class="col-4">
          <div class="stat-card text-center p-3 rounded border"
            :class="isTargetReached ? 'bg-success bg-opacity-10 border-success' : 'bg-light'">
            <div class="stat-value" :class="isTargetReached ? 'text-success' : 'text-primary'">{{ fmt(status.completed) }}</div>
            <div class="stat-label text-muted">Completed</div>
          </div>
        </div>
        <div class="col-4">
          <div class="stat-card text-center p-3 rounded border"
            :class="isTargetReached ? 'bg-success bg-opacity-10 border-success' : 'bg-warning bg-opacity-10 border-warning'">
            <div class="stat-value" :class="isTargetReached ? 'text-success' : 'text-warning'">{{ fmt(status.balance) }}</div>
            <div class="stat-label text-muted">{{ isTargetReached ? 'Balance (Done)' : 'Balance Left' }}</div>
          </div>
        </div>
      </div>

      <!-- DETAIL TABLE -->
      <h6 class="section-title">Test Details</h6>
      <table class="table table-sm table-bordered mb-3">
        <tbody>
          <tr><th style="width:40%">Request No</th><td>{{ result.requestNo || '—' }}</td></tr>
          <tr><th>PL No</th><td>{{ result.plNo || '—' }}</td></tr>
          <tr><th>Part No</th><td>{{ result.partNo || '—' }}</td></tr>
          <tr><th>Description</th><td>{{ result.description || '—' }}</td></tr>
          <tr><th>Customer / Application</th><td>{{ result.customer || '—' }}</td></tr>
          <tr><th>Test Type / Purpose</th><td>{{ result.testType || result.purpose || '—' }}</td></tr>
          <tr><th>Equipment</th><td>{{ result.equipmentName || '—' }}<span v-if="result.equipmentNo"> ({{ result.equipmentNo }})</span></td></tr>
          <tr><th>No. of Samples</th><td>{{ result.samples || '—' }}</td></tr>
          <tr><th>Standard / Spec</th><td>{{ result.standard || '—' }}</td></tr>
        </tbody>
      </table>

      <h6 class="section-title">Timeline &amp; Counter</h6>
      <table class="table table-sm table-bordered mb-3">
        <tbody>
          <tr><th style="width:40%">Request Date</th><td>{{ result.requestDate || '—' }}</td></tr>
          <tr><th>Test Started On</th><td>{{ result.testStartedOn || '—' }}</td></tr>
          <tr>
            <th>Test Completed On</th>
            <td>
              <span v-if="result.testCompletedOn">{{ result.testCompletedOn }}</span>
              <span v-else-if="isTargetReached" class="text-warning fst-italic">Target reached — entry pending</span>
              <span v-else class="text-primary fst-italic">In progress…</span>
            </td>
          </tr>
          <tr><th>Initial Counter / Hourmeter</th><td>{{ fmt(result.initialReading) }}</td></tr>
          <tr><th>Current Counter / Hourmeter</th><td>{{ fmt(result.currentReading) }}</td></tr>
          <tr><th>Target Cycle / Hours</th><td>{{ fmt(result.targetCycle) }}</td></tr>
          <tr>
            <th>Cycles Completed</th>
            <td>
              <span :class="isTargetReached ? 'text-success fw-bold' : 'text-primary fw-bold'">{{ fmt(status.completed) }}</span>
              <span class="text-muted"> / {{ fmt(status.target) }}</span>
            </td>
          </tr>
          <tr>
            <th>Balance Remaining</th>
            <td>
              <span v-if="isTargetReached" class="text-success fw-bold">0 — Target Reached ✅</span>
              <span v-else class="text-warning fw-bold">{{ fmt(status.balance) }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- RESULTS & REMARKS -->
      <template v-if="result.testResults || result.remarks || result.acceptanceCriteria || result.responsibility || result.requestedBy">
        <h6 class="section-title">Results &amp; Remarks</h6>
        <table class="table table-sm table-bordered mb-0">
          <tbody>
            <tr v-if="result.acceptanceCriteria"><th style="width:40%">Acceptance Criteria</th><td>{{ result.acceptanceCriteria }}</td></tr>
            <tr v-if="result.testResults"><th>Test Results</th><td style="white-space:pre-wrap">{{ result.testResults }}</td></tr>
            <tr v-if="result.remarks"><th>Tryout / Remarks</th><td style="white-space:pre-wrap">{{ result.remarks }}</td></tr>
            <tr v-if="result.responsibility"><th>Responsibility</th><td>{{ result.responsibility }}</td></tr>
            <tr v-if="result.requestedBy"><th>Requested By</th><td>{{ result.requestedBy }}</td></tr>
          </tbody>
        </table>
      </template>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
const API = 'http://localhost:5000/api'

export default {
  name: 'DailyUpdateStatus',

  data() {
    return {
      searchPlNo: '',
      searchReqNo: '',
      searched: false,
      loading: false,
      result: null,
    }
  },

  computed: {
    // ── Derived cycle / hour numbers ──────────────────────────────────────────
    status() {
      if (!this.result) return { target: 0, initial: 0, current: 0, completed: 0, balance: 0, pct: 0 }
      const target    = parseFloat(this.result.targetCycle)    || 0
      const initial   = parseFloat(this.result.initialReading) || 0
      const current   = parseFloat(this.result.currentReading) || 0
      const completed = Math.max(0, current - initial)
      const balance   = Math.max(0, target - completed)
      const pct       = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0
      return { target, initial, current, completed, balance, pct }
    },

    isTargetReached() {
      return this.status.pct >= 100
    },

    statusLabel() {
      if (!this.result) return ''
      if (this.result.testCompletedOn) return 'Completed'
      if (this.result.testStartedOn)   return 'Running'
      return 'Pending'
    },

    statusBadgeClass() {
      const map = {
        Completed: 'badge bg-success',
        Running:   'badge bg-primary',
        Pending:   'badge bg-warning text-dark',
      }
      return map[this.statusLabel] || 'badge bg-secondary'
    },
  },

  methods: {
    // ── Format numbers with locale separators ─────────────────────────────────
    fmt(val) {
      if (val == null || val === '' || isNaN(val)) return '—'
      return Number(val).toLocaleString()
    },

    // ── Search: live DB fetch → localStorage fallback ─────────────────────────
    async search() {
      const plNo  = this.searchPlNo.trim()
      const reqNo = this.searchReqNo.trim()
      if (!plNo && !reqNo) {
        alert('Please enter a PL No or Request No.')
        return
      }

      this.searched = true
      this.result   = null
      this.loading  = true

      try {
        const res  = await axios.get(`${API}/dailyupdates`)
        const rows = res.data || []
        const found = rows.find((m) => {
          if (plNo  && (m.plNo      || '').toLowerCase() === plNo.toLowerCase())  return true
          if (reqNo && (m.requestNo || '').toLowerCase() === reqNo.toLowerCase()) return true
          return false
        })
        if (found) { this.result = found; return }
      } catch (err) {
        console.warn('API fetch failed, falling back to localStorage:', err)
      } finally {
        this.loading = false
      }

      // Fallback: localStorage monitoringCache
      const raw = localStorage.getItem('monitoringCache')
      if (raw) {
        try {
          const cache = JSON.parse(raw)
          for (const key of Object.keys(cache)) {
            const m = cache[key]
            if (plNo  && (m.plNo      || '').toLowerCase() === plNo.toLowerCase())  { this.result = m; return }
            if (reqNo && (m.requestNo || '').toLowerCase() === reqNo.toLowerCase()) { this.result = m; return }
          }
        } catch (_) { /* ignore */ }
      }
    },
  },
}
</script>

<style scoped>
h2 {
  font-weight: bold;
  color: #2c3e50;
}
.card {
  border-radius: 8px;
}
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6c757d;
  margin-bottom: 8px;
}
.stat-card {
  transition: box-shadow 0.2s;
}
.stat-value {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
}
.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
.progress {
  border-radius: 20px;
  background-color: #e9ecef;
}
.progress-bar {
  transition: width 0.5s ease;
  border-radius: 20px;
}
</style>