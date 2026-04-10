const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportcontroller");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= ENSURE UPLOAD FOLDER =================
const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

// ================= MULTER FIELDS =================
// Frontend sends base64, multer kept for backward compatibility
const uploadFields = upload.fields([
  { name: "reportFile",        maxCount: 1  },
  { name: "signatureReported", maxCount: 1  },
  { name: "signatureApproved", maxCount: 1  },
  { name: "failurePhotos",     maxCount: 10 }
]);

// ================= DB (for report number generation) =================
const db = require("../config/database");

// ================= AUTO REPORT NUMBER =================
async function generateReportNo() {
  try {
    const [rows] = await db.query(
      "SELECT reportNo FROM reports ORDER BY id DESC LIMIT 1"
    );

    let nextNumber = 1;

    if (rows.length > 0 && rows[0].reportNo) {
      const lastNo   = rows[0].reportNo;
      const parts    = lastNo.split("-");
      const lastCount = parseInt(parts[2]) || 0;
      nextNumber = lastCount + 1;
    }

    const year = new Date().getFullYear();
    return `RPT-${year}-${String(nextNumber).padStart(4, "0")}`;

  } catch (err) {
    console.error("❌ Error generating reportNo:", err);
    throw err;
  }
}

// ================= TEST ROUTE =================
router.get("/", (req, res) => {
  res.json({ message: "✅ Report API Working" });
});

// ================= GET ALL REPORTS =================
router.get("/all", async (req, res, next) => {
  try {
    await controller.getReports(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET REPORT BY REPORT NO =================
// 🔥 MUST be BEFORE /:id to avoid "by-report" being treated as an id
router.get("/by-report/:reportNo", async (req, res, next) => {
  try {
    await controller.getReportByReportNo(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET REPORT BY ID =================
router.get("/:id", async (req, res, next) => {
  try {
    await controller.getReportById(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= CREATE REPORT =================
router.post("/", uploadFields, async (req, res, next) => {
  try {
    console.log("📥 BODY KEYS:", Object.keys(req.body));
    console.log("📎 FILES:", req.files);

    // ✅ GENERATE REPORT NUMBER
    const reportNo = await generateReportNo();
    req.body.reportNo = reportNo;
    console.log("🔖 Generated Report No:", reportNo);

    await controller.createReport(req, res);

    // Fallback — controller should always send a response
    if (!res.headersSent) {
      return res.status(201).json({
        success: true,
        message: "✅ Report Created Successfully",
        reportNo
      });
    }

  } catch (err) {
    console.error("❌ ROUTE ERROR (CREATE):", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "❌ Error Creating Report",
        error: err.message
      });
    }
  }
});

// ================= UPDATE REPORT =================
router.put("/:id", uploadFields, async (req, res, next) => {
  try {
    await controller.updateReport(req, res);
  } catch (err) {
    console.error("❌ ROUTE ERROR (UPDATE):", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "❌ Error Updating Report",
        error: err.message
      });
    }
  }
});

// ================= DELETE REPORT =================
router.delete("/:id", async (req, res, next) => {
  try {
    await controller.deleteReport(req, res);
  } catch (err) {
    console.error("❌ ROUTE ERROR (DELETE):", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "❌ Error Deleting Report",
        error: err.message
      });
    }
  }
});

module.exports = router;