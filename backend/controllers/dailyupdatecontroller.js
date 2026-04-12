// backend/controllers/dailyupdatecontroller.js
'use strict'

const db = require('../models')
const DailyUpdate = db.DailyUpdate

const ok   = (res, data, status = 200) => res.status(status).json(data)
const fail = (res, err, msg = 'Server error', status = 500) => {
  console.error(`\n========== [DailyUpdateCtrl] ${msg} ==========`)
  console.error('Name    :', err.name)
  console.error('Message :', err.message)
  if (err.errors) {
    err.errors.forEach((e, i) =>
      console.error(`  Validation[${i}]: ${e.path} → ${e.message} (value: ${JSON.stringify(e.value)})`)
    )
  }
  if (err.sql) console.error('SQL     :', err.sql)
  console.error('================================================\n')

  return res.status(status).json({
    success: false,
    message: msg,
    error: err.message,
    detail: err.errors ? err.errors.map(e => `${e.path}: ${e.message}`) : undefined,
  })
}

// ─────────────────────────────────────────────────────────────
//  DATEONLY fields — must be YYYY-MM-DD or null
// ─────────────────────────────────────────────────────────────
const DATE_FIELDS = ['requestDate', 'testStartedOn', 'testCompletedOn', 'startDate']

// Fields that must never reach the DB
const STRIP_FIELDS = ['id', 'createdAt', 'updatedAt', 'dbId']

/**
 * Safely parse any date value into YYYY-MM-DD string or null.
 *
 * Handles:
 *  - null / undefined / empty string  → null
 *  - "Invalid date" string            → null
 *  - ISO strings  "2024-03-15T..."    → "2024-03-15"
 *  - YYYY-MM-DD   "2024-03-15"        → "2024-03-15"  (pass-through)
 *  - DD-MM-YYYY   "15-03-2024"        → "2024-03-15"
 *  - DD/MM/YYYY   "15/03/2024"        → "2024-03-15"
 *  - Any other parseable JS date      → "YYYY-MM-DD"
 */
function safeDate(val) {
  // 1. Falsy or explicit "Invalid date" string → null
  if (!val || String(val).trim() === '' || String(val).trim().toLowerCase() === 'invalid date') {
    return null
  }

  const s = String(val).trim()

  // 2. Already YYYY-MM-DD (most common from <input type="date">)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s)
    if (!isNaN(d.getTime())) return s
    return null
  }

  // 3. ISO datetime string — slice the date part
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    return s.substring(0, 10)
  }

  // 4. DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
  if (dmyMatch) {
    const iso = `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`
    const d = new Date(iso)
    if (!isNaN(d.getTime())) return iso
    return null
  }

  // 5. MM/DD/YYYY (US format fallback)
  const mdyMatch = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (mdyMatch) {
    const iso = `${mdyMatch[3]}-${mdyMatch[1]}-${mdyMatch[2]}`
    const d = new Date(iso)
    if (!isNaN(d.getTime())) return iso
    return null
  }

  // 6. Last resort: try native Date parse
  const d = new Date(s)
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // 7. Unparseable — return null (safe)
  console.warn(`[DailyUpdateCtrl] safeDate: could not parse "${s}" — setting to null`)
  return null
}

function sanitize(body) {
  const out = { ...body }

  // Remove Vue-only / timestamp fields
  STRIP_FIELDS.forEach((f) => delete out[f])

  // Safely convert every date field
  DATE_FIELDS.forEach((f) => {
    out[f] = safeDate(out[f])
  })

  console.log('[DailyUpdateCtrl] sanitized payload keys:', Object.keys(out))
  console.log('[DailyUpdateCtrl] date fields after sanitize →',
    DATE_FIELDS.reduce((acc, f) => { acc[f] = out[f]; return acc }, {})
  )

  return out
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/dailyupdates
// ─────────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const rows = await DailyUpdate.findAll({ order: [['createdAt', 'DESC']] })
    ok(res, rows)
  } catch (e) {
    fail(res, e, 'Failed to fetch daily updates')
  }
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/dailyupdates/:id
// ─────────────────────────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const row = await DailyUpdate.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'DailyUpdate not found' })
    ok(res, row)
  } catch (e) {
    fail(res, e, 'Failed to fetch daily update')
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/dailyupdates
// ─────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    console.log('[DailyUpdateCtrl] POST body keys received:', Object.keys(req.body))
    const body = sanitize(req.body)
    const row  = await DailyUpdate.create(body)
    ok(res, { success: true, message: 'DailyUpdate created', data: row, id: row.id }, 201)
  } catch (e) {
    fail(res, e, 'Failed to create daily update')
  }
}

// ─────────────────────────────────────────────────────────────
//  PUT  /api/dailyupdates/:id
// ─────────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    console.log('[DailyUpdateCtrl] PUT id:', req.params.id, '| body keys:', Object.keys(req.body))
    const row = await DailyUpdate.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'DailyUpdate not found' })

    const body = sanitize(req.body)
    await row.update(body)
    ok(res, { success: true, message: 'DailyUpdate updated', data: row })
  } catch (e) {
    fail(res, e, 'Failed to update daily update')
  }
}

// ─────────────────────────────────────────────────────────────
//  DELETE  /api/dailyupdates/:id
// ─────────────────────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const row = await DailyUpdate.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'DailyUpdate not found' })
    await row.destroy()
    ok(res, { success: true, message: 'DailyUpdate deleted' })
  } catch (e) {
    fail(res, e, 'Failed to delete daily update')
  }
}