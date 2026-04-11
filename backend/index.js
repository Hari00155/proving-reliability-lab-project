// backend/index.js
const express = require('express')
const cors    = require('cors')
const path    = require('path')
const fs      = require('fs')
require('dotenv').config()

const db = require('./config/database')

// ================= IMPORT ROUTES =================
const requestRoutes = require('./routes/requestRoutes')
const dailyRoutes   = require('./routes/dailyRoutes')
const reportRoutes  = require('./routes/reportRoutes')

// ================= IMPORT MODELS (sync) =================
// Must be required here so Sequelize registers all models
// before db.sync() is called in startServer()
require('./models')

const app = express()

// ================= ENSURE UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
  console.log('📁 uploads folder created')
}

// ================= CORS =================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ================= MIDDLEWARE =================
// 50 mb limit — needed for base64 images / PDFs sent from Vue
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ================= STATIC FILES =================
// Serve uploaded files:  GET /uploads/<filename>
app.use('/uploads', express.static(uploadPath))

// Serve logo used in print templates:  GET /images/TVS.jpg
// Place TVS.jpg inside  <project-root>/images/
app.use('/images', express.static(path.join(__dirname, '..', 'images')))

// ================= ROUTES =================
app.use('/api/requests',     requestRoutes)
app.use('/api/dailyupdates', dailyRoutes)
app.use('/api/reports',      reportRoutes)

// ================= HEALTH CHECK =================
app.get('/', (_req, res) => {
  res.json({
    status: '✅ Proving Lab API is running',
    routes: {
      requests:     '/api/requests',
      dailyUpdates: '/api/dailyupdates',
      reports:      '/api/reports',
      uploads:      '/uploads/<filename>',
    },
  })
})

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// ================= GLOBAL ERROR HANDLER =================
app.use((err, _req, res, _next) => {
  console.error('🔥 GLOBAL ERROR:', err)

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large. Max 50 MB.' })
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, error: 'Unexpected file field.' })
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message).join(', '),
    })
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ success: false, error: 'Duplicate entry — record already exists.' })
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  })
})

// ================= SERVER START =================
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    // ✅ Test DB connection
    await db.authenticate()
    console.log('✅ Database Connected')

    // ✅ Sync all models
    // alter:true  → adds new columns, never drops data
    // force:false → never drops tables
    await db.sync({ alter: true })
    console.log('✅ Tables Synced (requests, daily_updates, reports)')

    // ✅ Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on  http://localhost:${PORT}`)
      console.log(`📦 Uploads served at  http://localhost:${PORT}/uploads`)
      console.log(`🔗 API base           http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ SERVER FAILED TO START:', error.message)
    process.exit(1)
  }
}

startServer()