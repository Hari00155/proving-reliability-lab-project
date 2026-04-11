// backend/controllers/requestController.js
'use strict'

const db = require('../models')
const Request = db.Request

// ── Shared response helpers ───────────────────────────────────
const ok  = (res, data, status = 200) => res.status(status).json(data)
const fail = (res, err, msg = 'Server error', status = 500) => {
  console.error(`[RequestCtrl] ${msg}:`, err.message || err)
  return res.status(status).json({ success: false, message: msg, error: err.message })
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/requests
//  Returns ALL requests — year/status filtering done in Vue
// ─────────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const rows = await Request.findAll({ order: [['createdAt', 'DESC']] })
    ok(res, rows)
  } catch (e) {
    fail(res, e, 'Failed to fetch requests')
  }
}

// ─────────────────────────────────────────────────────────────
//  GET  /api/requests/:id
// ─────────────────────────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const row = await Request.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Request not found' })
    ok(res, row)
  } catch (e) {
    fail(res, e, 'Failed to fetch request')
  }
}

// ─────────────────────────────────────────────────────────────
//  POST /api/requests
//  Body: all request fields (attachment may be base64 string)
// ─────────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const body = { ...req.body }

    // If a file was uploaded via multipart (multer)
    if (req.file) {
      body.attachment     = `uploads/${req.file.filename}`
      body.attachmentName = req.file.originalname
    }

    // Auto-generate requestNo if not supplied
    if (!body.requestNo) {
      const year  = new Date().getFullYear()
      const count = await Request.count()
      body.requestNo = `REQ-${year}-${String(count + 1).padStart(5, '0')}`
    }

    if (!body.status) body.status = 'Pending'

    // Remove id / timestamp fields that must not be set manually
    delete body.id
    delete body.createdAt
    delete body.updatedAt

    const row = await Request.create(body)
    ok(res, { success: true, message: 'Request created', data: row }, 201)
  } catch (e) {
    fail(res, e, 'Failed to create request')
  }
}

// ─────────────────────────────────────────────────────────────
//  PUT  /api/requests/:id
//  Used for: edit, accept (status→Accepted), reject, allocate,
//            complete (status→Completed)
// ─────────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const row = await Request.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Request not found' })

    const body = { ...req.body }

    if (req.file) {
      body.attachment     = `uploads/${req.file.filename}`
      body.attachmentName = req.file.originalname
    }

    delete body.id
    delete body.createdAt
    delete body.updatedAt

    await row.update(body)
    ok(res, { success: true, message: 'Request updated', data: row })
  } catch (e) {
    fail(res, e, 'Failed to update request')
  }
}

// ─────────────────────────────────────────────────────────────
//  DELETE  /api/requests/:id
// ─────────────────────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const row = await Request.findByPk(req.params.id)
    if (!row) return res.status(404).json({ success: false, message: 'Request not found' })
    await row.destroy()
    ok(res, { success: true, message: 'Request deleted' })
  } catch (e) {
    fail(res, e, 'Failed to delete request')
  }
}