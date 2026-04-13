<template>
  <div class="rg-page">

    <h2 class="rg-title">📊 Report Generation</h2>
    <p class="rg-sub">Generate and download reports as Excel (.xlsx)</p>

    <!-- ════════════════════════════════════════
         YEARLY & MONTHLY REPORT
    ════════════════════════════════════════ -->
    <div class="rg-card">
      <div class="rg-card-header">📅 Yearly &amp; Monthly Report</div>
      <div class="rg-card-body">

        <div class="rg-form-row">
          <div class="rg-field">
            <label>Enter the Year <span class="hint">(yyyy)</span></label>
            <input v-model="ymYear" type="number" placeholder="e.g. 2025" min="2000" max="2099" />
          </div>
          <div class="rg-field">
            <label>Select The Month <span class="hint">(optional — leave blank for full year)</span></label>
            <select v-model="ymMonth">
              <option value="">-- All Months (Yearly) --</option>
              <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
            </select>
          </div>
        </div>

        <div class="rg-note">
          ℹ️ Enter <b>Year only</b> → Yearly report &nbsp;|&nbsp;
          Enter <b>Year + Month</b> → Monthly report
        </div>

        <button
          class="rg-btn"
          :disabled="ymLoading || !ymYear"
          @click="downloadYM"
        >
          <span v-if="ymLoading">⏳ Generating…</span>
          <span v-else>⬇ Download Excel</span>
        </button>

      </div>
    </div>

    <!-- ════════════════════════════════════════
         WEEKLY REPORT
    ════════════════════════════════════════ -->
    <div class="rg-card">
      <div class="rg-card-header">📆 Weekly Report</div>
      <div class="rg-card-body">

        <div class="rg-form-row">
          <div class="rg-field">
            <label>From Date</label>
            <input v-model="wkFrom" type="date" />
          </div>
          <div class="rg-field">
            <label>To Date</label>
            <input v-model="wkTo" type="date" />
          </div>
        </div>

        <div class="rg-note">
          ℹ️ Select both <b>From Date</b> &amp; <b>To Date</b> to get the weekly report
        </div>

        <button
          class="rg-btn"
          :disabled="wkLoading || !wkFrom || !wkTo"
          @click="downloadWeekly"
        >
          <span v-if="wkLoading">⏳ Generating…</span>
          <span v-else>⬇ Download Excel</span>
        </button>

      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" :class="['rg-toast', toast.type]">{{ toast.msg }}</div>

  </div>
</template>

<script>
import axios from 'axios'
const API = 'http://localhost:5000/api'

export default {
  name: 'ReportGeneration',

  data() {
    return {
      ymYear:    '',
      ymMonth:   '',
      ymLoading: false,

      wkFrom:    '',
      wkTo:      '',
      wkLoading: false,

      toast: { show: false, msg: '', type: 'success' },

      months: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ]
    }
  },

  methods: {

    // ── Download Yearly / Monthly Excel ──────────────────────────────
    async downloadYM() {
      if (!this.ymYear) return
      this.ymLoading = true
      try {
        const params = { year: this.ymYear }
        if (this.ymMonth) params.month = this.ymMonth

        const res = await axios.get(`${API}/reports/export/excel`, {
          params,
          responseType: 'blob'
        })

        const label = this.ymMonth
          ? `${this.months[this.ymMonth - 1]}_${this.ymYear}`
          : `Year_${this.ymYear}`

        this._saveBlob(res.data, `PL_Report_${label}.xlsx`)
        this.showToast(`✅ ${label} report downloaded!`, 'success')
      } catch (e) {
        console.error(e)
        this.showToast('❌ Failed to generate report. Check backend.', 'error')
      } finally {
        this.ymLoading = false
      }
    },

    // ── Download Weekly Excel ─────────────────────────────────────────
    async downloadWeekly() {
      if (!this.wkFrom || !this.wkTo) return
      if (this.wkFrom > this.wkTo) {
        this.showToast('⚠️ "From Date" must be before "To Date"', 'error')
        return
      }
      this.wkLoading = true
      try {
        const res = await axios.get(`${API}/reports/export/excel`, {
          params: { from: this.wkFrom, to: this.wkTo },
          responseType: 'blob'
        })
        this._saveBlob(res.data, `PL_Report_${this.wkFrom}_to_${this.wkTo}.xlsx`)
        this.showToast('✅ Weekly report downloaded!', 'success')
      } catch (e) {
        console.error(e)
        this.showToast('❌ Failed to generate report. Check backend.', 'error')
      } finally {
        this.wkLoading = false
      }
    },

    // ── Save blob as file ─────────────────────────────────────────────
    _saveBlob(blob, filename) {
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },

    showToast(msg, type = 'success') {
      this.toast = { show: true, msg, type }
      setTimeout(() => { this.toast.show = false }, 3500)
    }
  }
}
</script>

<style scoped>
/* ── Page ── */
.rg-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 28px 20px;
  font-family: Arial, sans-serif;
}

.rg-title {
  font-size: 22px;
  font-weight: bold;
  color: #1a5276;
  margin-bottom: 4px;
}
.rg-sub {
  color: #666;
  font-size: 13px;
  margin-bottom: 24px;
}

/* ── Card ── */
.rg-card {
  border: 1px solid #d0dce8;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
}
.rg-card-header {
  background: #1a5276;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 16px;
  letter-spacing: .3px;
}
.rg-card-body {
  padding: 20px 16px;
  background: #f7fafc;
}

/* ── Form ── */
.rg-form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.rg-field {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rg-field label {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
}
.rg-field .hint {
  font-weight: normal;
  color: #888;
  font-size: 11px;
}
.rg-field input,
.rg-field select {
  padding: 7px 10px;
  border: 1px solid #b8ccd8;
  border-radius: 5px;
  font-size: 13px;
  background: #fff;
  color: #2c3e50;
  outline: none;
  transition: border .2s;
}
.rg-field input:focus,
.rg-field select:focus {
  border-color: #1a5276;
}

.rg-note {
  font-size: 12px;
  color: #666;
  margin-bottom: 14px;
  background: #eaf2fb;
  border-left: 3px solid #1a5276;
  padding: 6px 10px;
  border-radius: 3px;
}

/* ── Button ── */
.rg-btn {
  background: #1a5276;
  color: #fff;
  border: none;
  padding: 9px 26px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background .2s, opacity .2s;
}
.rg-btn:hover:not(:disabled) { background: #154360; }
.rg-btn:disabled { opacity: .55; cursor: not-allowed; }

/* ── Toast ── */
.rg-toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  z-index: 9999;
  box-shadow: 0 4px 14px rgba(0,0,0,.15);
  animation: fadeIn .3s ease;
}
.rg-toast.success { background: #1e8449; color: #fff; }
.rg-toast.error   { background: #c0392b; color: #fff; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>