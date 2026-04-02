const express = require("express");
const router = express.Router();

// ✅ FIXED (MATCH YOUR FILE NAME)
const requestController = require("../controllers/requestController");

// ✅ MULTER (FILE UPLOAD)
const multer = require("multer");
const path = require("path");

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

// CREATE (WITH FILE)
router.post("/", upload.single("attachment"), requestController.createRequest);

// GET ALL
router.get("/", requestController.getRequests);

// UPDATE (WITH FILE)
router.put("/:id", upload.single("attachment"), requestController.updateRequest);

// DELETE
router.delete("/:id", requestController.deleteRequest);

// TODAY
router.get("/today", requestController.getTodayRequests);

// ARCHIVE
router.get("/archive", requestController.getArchiveRequests);

module.exports = router;