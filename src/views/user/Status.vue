<template>
  <div class="container mt-4">
    <h2>🔍 Status Enquiry</h2>

    <!-- SEARCH BOX -->
    <div class="search-card mb-4">
      <div class="search-title">SEARCH BY</div>
      <div class="d-flex gap-3 align-items-end flex-wrap mt-3">
        <div>
          <label class="form-label fw-bold">Search Type</label>
          <select v-model="searchType" class="form-control" style="width:180px;">
            <option value="requestNo">Request Number</option>
            <option value="plNo">PL Number</option>
            <option value="partNo">Part Number</option>
          </select>
        </div>
        <div>
          <label class="form-label fw-bold">Enter Value</label>
          <input
            v-model="searchValue"
            class="form-control"
            style="width:220px;"
            placeholder="Type to search..."
            @keyup.enter="doSearch"
          />
        </div>
        <div>
          <button class="btn btn-primary" @click="doSearch">🔍 Search</button>
          <button class="btn btn-secondary ms-2" @click="clearSearch">✖ Clear</button>
        </div>
      </div>
    </div>

    <!-- NO RESULTS -->
    <div v-if="searched && results.length === 0" class="alert alert-warning">
      No records found for the given search.
    </div>

    <!-- RESULTS TABLE -->
    <div v-if="results.length > 0">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>S.No</th>
            <th>Request No</th>
            <th>PL No</th>
            <th>Part No</th>
            <th>Description</th>
            <th>User</th>
            <th>Status Progress</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in results" :key="r.requestNo">
            <td>{{ i + 1 }}</td>
            <td><strong>{{ r.requestNo }}</strong></td>
            <td>{{ r.plNo }}</td>
            <td>{{ r.partNo }}</td>
            <td>{{ r.description }}</td>
            <td>{{ r.userName }}</td>
            <td>
              <!-- PROGRESS STEPPER -->
              <div class="stepper">
                <div
                  v-for="(step, si) in steps"
                  :key="si"
                  class="step"
                  :class="{
                    'step-done':  si < getStepIndex(r),
                    'step-active': si === getStepIndex(r),
                    'step-pending': si > getStepIndex(r)
                  }"
                >
                  <div class="step-dot">{{ si + 1 }}</div>
                  <div class="step-label">{{ step }}</div>
                  <div v-if="si < steps.length - 1" class="step-line"></div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge" :class="badgeClass(r)">
                {{ currentStatusLabel(r) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- INITIAL STATE -->
    <div v-if="!searched" class="text-center text-muted mt-5" style="font-size:15px;">
      🔎 Enter a search value and click <strong>Search</strong> to view status.
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default {
  name: 'StatusEnquiry',

  data() {
    return {
      searchType: 'requestNo',
      searchValue: '',
      results: [],
      searched: false,

      // Status pipeline steps (in order)
      steps: [
        'PL Allocated',
        'Datasheet Printed',
        'Test In Progress',
        'Report Generated',
      ],

      // Loaded from localStorage (same keys as DailyUpdate component)
      monitoringCache: {},
      reportCache: {},
    }
  },

  mounted() {
    this.loadCaches()
  },

  methods: {
    loadCaches() {
      try {
        const mc = localStorage.getItem('monitoringCache')
        if (mc) this.monitoringCache = JSON.parse(mc)
        const rc = localStorage.getItem('reportCache')
        if (rc) this.reportCache = JSON.parse(rc)
      } catch (e) {
        console.warn('Cache load error', e)
      }
    },

    async doSearch() {
      this.searched = true
      this.results = []
      if (!this.searchValue.trim()) return

      try {
        // Fetch all requests then filter client-side
        // (or pass query params if your backend supports it)
        const res = await axios.get(`${API}/requests`)
        const all = res.data || []

        const val = this.searchValue.trim().toLowerCase()

        this.results = all
          .filter(r => {
            if (this.searchType === 'requestNo')
              return (r.requestNo || '').toLowerCase().includes(val)
            if (this.searchType === 'plNo')
              return (r.allocationPlNo || '').toLowerCase().includes(val)
            if (this.searchType === 'partNo')
              return (r.partNo || '').toLowerCase().includes(val)
            return false
          })
          .map(r => ({
            requestNo:   r.requestNo,
            plNo:        r.allocationPlNo || '-',
            partNo:      r.partNo || '-',
            description: r.description || '-',
            userName:    r.userName || '-',
            status:      r.status || '',
            // Derive pipeline flags from caches
            hasMonitoring: !!this.monitoringCache[r.requestNo],
            hasReport:     !!this.reportCache[r.requestNo],
            monitoringPrinted: !!(this.monitoringCache[r.requestNo]?.printed),
          }))
      } catch (err) {
        console.error('Search error:', err)
        alert('Error fetching requests. Check console.')
      }
    },

    clearSearch() {
      this.searchValue = ''
      this.results = []
      this.searched = false
    },

    // ── Pipeline step index (0-based) ─────────────────────────
    // Step 0 → PL Allocated      : request exists with a PL No
    // Step 1 → Datasheet Printed : monitoring record saved
    // Step 2 → Test In Progress  : monitoring exists (test running)
    // Step 3 → Report Generated  : report record saved
    getStepIndex(r) {
      if (r.hasReport)     return 3
      if (r.hasMonitoring) return 2   // datasheet saved = test in progress
      if (r.plNo && r.plNo !== '-') return 0
      return 0
    },

    currentStatusLabel(r) {
      const idx = this.getStepIndex(r)
      return this.steps[idx]
    },

    badgeClass(r) {
      const idx = this.getStepIndex(r)
      return {
        0: 'bg-secondary',
        1: 'bg-info text-dark',
        2: 'bg-warning text-dark',
        3: 'bg-success',
      }[idx] || 'bg-secondary'
    },
  },
}
</script>

<style scoped>
.search-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px 24px;
  max-width: 700px;
}
.search-title {
  font-weight: 700;
  font-size: 15px;
  color: #1a56a0;
  letter-spacing: 1px;
  border-bottom: 2px solid #1a56a0;
  padding-bottom: 6px;
  display: inline-block;
}

/* ── Stepper ──────────────────────────────────────────────── */
.stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  font-size: 10px;
  text-align: center;
}
.step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  border: 2px solid #ccc;
  background: #fff;
  color: #999;
  z-index: 1;
  position: relative;
}
.step-label {
  margin-top: 3px;
  font-size: 9.5px;
  color: #777;
  white-space: nowrap;
}
.step-line {
  position: absolute;
  top: 11px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #ccc;
  z-index: 0;
}

/* Done steps */
.step-done .step-dot {
  background: #198754;
  border-color: #198754;
  color: #fff;
}
.step-done .step-label { color: #198754; font-weight: 600; }
.step-done .step-line  { background: #198754; }

/* Active step */
.step-active .step-dot {
  background: #ffc107;
  border-color: #e0a800;
  color: #333;
}
.step-active .step-label { color: #856404; font-weight: 700; }

/* Pending steps */
.step-pending .step-dot  { background: #fff; border-color: #ccc; color: #bbb; }
.step-pending .step-label{ color: #bbb; }

.badge { font-size: 12px; padding: 5px 10px; }
.ms-2  { margin-left: 8px; }
</style>