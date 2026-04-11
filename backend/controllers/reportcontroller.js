// backend/controllers/reportcontroller.js
'use strict'

const db = require('../models')
const Report = db.Report

const ok  = (res, data, status = 200) => res.status(status).json(data)
const fail = (res, err, msg = 'Server error', status = 500) => {
  console.error(`[ReportCtrl] ${msg}:`, err.message || err)
  return res.status(status).json({ success: false, message: msg, error: err.message })
}

// ── Helper: parse failurePhotos JSON string → array ──────────
function parsePhotos(row) {
  const plain = typeof row.toJSON === 'function' ? row.toJSON() : { ...row }
  if (typeof plain.failurePhotos === 'string' && plain.failurePhotos) {
    try { plain.failurePhotos = JSON.parse(plain.failurePhotos) } catch (_) {}
  }
  if (!Array.isArray(plain.failurePhotos)) plain.failurePhotos = []
  return plain
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/reports
//  Used by ReportPrint.vue to search all saved reports
// ─────────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const rows = await Report.findAll({ order: [['createdAt', 'DESC']] })
    ok(res, rows.map(parsePhotos))
  } catch (e) {
    fail(res, e, 'Failed to fetch reports')
  }
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/reports/:id
// ─────────────────────────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const row = await Report.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Report not found' })
    ok(res, parsePhotos(row))
  } catch (e) {
    fail(res, e, 'Failed to fetch report')
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/reports
//  Body: all report fields
//  failurePhotos arrives as JS array (JSON body) → serialise
//  to string for MySQL storage
// ─────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body.createdAt
    delete body.updatedAt

    // Serialise photos array → JSON string
    if (Array.isArray(body.failurePhotos)) {
      body.failurePhotos = JSON.stringify(body.failurePhotos)
    }

    const row  = await Report.create(body)
    const data = parsePhotos(row)

    // Return id at top level so Vue can store it as dbId
    ok(res, { success: true, message: 'Report created', data, id: row.id }, 201)
  } catch (e) {
    fail(res, e, 'Failed to create report')
  }
}

// ─────────────────────────────────────────────────────────────
//  PUT  /api/reports/:id
// ─────────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const row = await Report.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Report not found' })

    const body = { ...req.body }
    delete body.id
    delete body.createdAt
    delete body.updatedAt

    if (Array.isArray(body.failurePhotos)) {
      body.failurePhotos = JSON.stringify(body.failurePhotos)
    }

    await row.update(body)
    ok(res, { success: true, message: 'Report updated', data: parsePhotos(row) })
  } catch (e) {
    fail(res, e, 'Failed to update report')
  }
}

// ─────────────────────────────────────────────────────────────
//  DELETE  /api/reports/:id
// ─────────────────────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const row = await Report.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Report not found' })
    await row.destroy()
    ok(res, { success: true, message: 'Report deleted' })
  } catch (e) {
    fail(res, e, 'Failed to delete report')
  }
}