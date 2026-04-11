// backend/controllers/dailyupdatecontroller.js
'use strict'

const db = require('../models')
const DailyUpdate = db.DailyUpdate

const ok  = (res, data, status = 200) => res.status(status).json(data)
const fail = (res, err, msg = 'Server error', status = 500) => {
  console.error(`[DailyUpdateCtrl] ${msg}:`, err.message || err)
  return res.status(status).json({ success: false, message: msg, error: err.message })
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/dailyupdates
//  Used by DatasheetPrint.vue — searches by requestNo / plNo
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
//  Two callers:
//    1. Monitoring modal  → saves monitoring sheet
//    2. submitAllocation  → initial allocation record
// ─────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body.createdAt
    delete body.updatedAt

    const row = await DailyUpdate.create(body)
    // Return id at top level so Vue can store it as dbId
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
    const row = await DailyUpdate.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'DailyUpdate not found' })

    const body = { ...req.body }
    delete body.id
    delete body.createdAt
    delete body.updatedAt

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