const express = require("express");
const router  = express.Router();

const requestController = require("../controllers/requestController");

const multer = require("multer");
const path   = require("path");

// ================= STORAGE CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ================= ROUTES =================

// 🔍 SEARCH — for StatusEnquiry.vue
// MUST be above GET "/:id" style routes to avoid conflict
// Usage: GET /api/requests/search?type=requestNo&value=REQ-2024
//        GET /api/requests/search?type=plNo&value=00001
//        GET /api/requests/search?type=partNo&value=ABC123
router.get("/search", requestController.searchRequests);

// TODAY — must also be above any future /:id routes
router.get("/today", requestController.getTodayRequests);

// ARCHIVE
router.get("/archive", requestController.getArchiveRequests);

// GET ALL
router.get("/", requestController.getRequests);

// CREATE (WITH FILE)
router.post("/", upload.single("attachment"), requestController.createRequest);

// UPDATE (WITH FILE)
router.put("/:id", upload.single("attachment"), requestController.updateRequest);

// DELETE
router.delete("/:id", requestController.deleteRequest);

module.exports = router;