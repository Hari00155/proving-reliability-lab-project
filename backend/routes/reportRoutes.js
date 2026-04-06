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

// ================= AUTO REPORT NUMBER =================
const db = require("../config/database");

async function generateReportNo() {
  const [rows] = await db.query("SELECT COUNT(*) as count FROM reports");
  const count = rows[0].count + 1;

  const year = new Date().getFullYear();
  return `RPT-${year}-${String(count).padStart(4, "0")}`;
}

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

      // ✅ ADD AUTO REPORT NUMBER (NO BREAK)
      const reportNo = await generateReportNo();
      req.body.reportNo = reportNo;

      // ✅ PASS TO CONTROLLER (UNCHANGED FLOW)
      await controller.createReport(req, res);

      // ✅ SEND BACK REPORT NO (IMPORTANT FOR FRONTEND)
      // If controller already sends response → skip this
      if (!res.headersSent) {
        res.json({
          message: "Report Created Successfully",
          reportNo
        });
      }

    } catch (err) {
      console.error("ROUTE ERROR:", err);
      next(err);
    }
  }
);

module.exports = router;