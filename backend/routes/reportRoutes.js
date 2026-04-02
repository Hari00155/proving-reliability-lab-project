const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportcontroller");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= ENSURE UPLOAD FOLDER =================
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 uploads folder created");
}

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ================= TEST ROUTE =================
router.get("/", (req, res) => {
  res.json({ message: "✅ Report API Working" });
});

// ================= CREATE REPORT =================
router.post(
  "/",
  upload.fields([
    { name: "reportFile", maxCount: 1 },
    { name: "signatureReported", maxCount: 1 },
    { name: "signatureApproved", maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      // 🔍 DEBUG
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      await controller.createReport(req, res);

    } catch (err) {
      console.error("ROUTE ERROR:", err);
      next(err);
    }
  }
);

module.exports = router;