'use strict'

const router = require('express').Router()
const { exportExcel } = require('../controllers/reportExportController')
const ctrl = require('../controllers/reportController')

// ── Excel Export ──────────────────────────────────────────
router.get('/export/excel', exportExcel)

// ── Standard CRUD ──────────────────────────────────────────
router.get('/',     ctrl.getAll)
router.get('/:id',  ctrl.getOne)
router.post('/',    ctrl.create)
router.put('/:id',  ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router