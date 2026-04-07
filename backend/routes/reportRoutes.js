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

// ================= DB =================
const db = require("../config/database");

// ================= AUTO REPORT NUMBER (FIXED) =================
async function generateReportNo() {
  try {
    const [rows] = await db.query(
      "SELECT reportNo FROM reports ORDER BY id DESC LIMIT 1"
    );

    let nextNumber = 1;

    if (rows.length > 0 && rows[0].reportNo) {
      const lastNo = rows[0].reportNo;
      const parts = lastNo.split("-");
      const lastCount = parseInt(parts[2]) || 0;
      nextNumber = lastCount + 1;
    }

    const year = new Date().getFullYear();
    return `RPT-${year}-${String(nextNumber).padStart(4, "0")}`;

  } catch (err) {
    console.error("Error generating reportNo:", err);
    throw err;
  }
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
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      // ✅ GENERATE REPORT NUMBER
      const reportNo = await generateReportNo();
      req.body.reportNo = reportNo;

      // ✅ SAVE USING CONTROLLER
      await controller.createReport(req, res);

      // ✅ ENSURE FRONTEND GETS REPORT NO
      if (!res.headersSent) {
        return res.json({
          success: true,
          message: "Report Created Successfully",
          reportNo
        });
      }

    } catch (err) {
      console.error("ROUTE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Error creating report",
        error: err.message
      });
    }
  }
);

module.exports = router;