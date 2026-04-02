const express = require("express");
const router = express.Router();

const controller = require("../controllers/dailyupdatecontroller");

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

// ================= TEST GET =================
router.get("/", (req, res) => {
  res.json({ message: "✅ Daily Update API Working" });
});

// ================= CREATE DAILY UPDATE =================
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    // Debug logs (helps if error)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    await controller.createDailyUpdate(req, res);

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= OPTIONAL TEST =================
router.post("/test", (req, res) => {
  res.json({ message: "POST route working ✅" });
});

module.exports = router;