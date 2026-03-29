const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  getTodayRequests,
  getArchiveRequests,
  updateRequest,
  deleteRequest
} = require("../controllers/requestController");

const upload = require("../middlewares/upload");


// ================= CREATE =================
router.post("/", upload.single("file"), createRequest);


// ================= GET (IMPORTANT ORDER) =================

// ✅ SPECIFIC ROUTES FIRST
router.get("/today", getTodayRequests);
router.get("/archive", getArchiveRequests);

// ✅ GENERAL ROUTE LAST
router.get("/", getRequests);


// ================= UPDATE =================
router.put("/:id", upload.single("file"), updateRequest);


// ================= DELETE =================
router.delete("/:id", deleteRequest);


module.exports = router;