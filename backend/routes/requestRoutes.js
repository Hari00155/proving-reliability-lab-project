// backend/routes/requestRoutes.js
'use strict'

const router = require('express').Router()
const ctrl   = require('../controllers/requestController')
const upload = require('../middlewares/upload')

// attachment is optional — multer is a no-op when Vue sends base64 JSON
router.get   ('/',    ctrl.getAll)
router.get   ('/:id', ctrl.getOne)
router.post  ('/',    upload.single('attachment'), ctrl.create)
router.put   ('/:id', upload.single('attachment'), ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router