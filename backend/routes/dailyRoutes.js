const express = require("express");
const router = express.Router();

const controller = require("../controllers/dailyupdatecontroller");

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

// ================= TEST GET =================
router.get("/", (req, res) => {
  res.json({ message: "✅ Daily Update API Working" });
});

// ================= GET ALL DAILY UPDATES =================
router.get("/all", async (req, res, next) => {
  try {
    await controller.getDailyUpdates(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET BY ID =================
router.get("/:id", async (req, res, next) => {
  try {
    await controller.getDailyUpdateById(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= GET BY REQUEST NO =================
// 🔥 ADDED — used by frontend edit mode lookup
router.get("/by-request/:requestNo", async (req, res, next) => {
  try {
    await controller.getDailyUpdateByRequestNo(req, res);
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= CREATE DAILY UPDATE =================
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    console.log("📥 BODY:", req.body);
    console.log("📎 FILE:", req.file);

    await controller.createDailyUpdate(req, res);

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= UPDATE DAILY UPDATE =================
// 🔥 ADDED — Edit Monitoring Mode
router.put("/:id", upload.single("photo"), async (req, res, next) => {
  try {
    console.log("📝 UPDATE BODY:", req.body);
    console.log("📎 UPDATE FILE:", req.file);

    await controller.updateDailyUpdate(req, res);

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    next(err);
  }
});

// ================= DELETE DAILY UPDATE =================
// 🔥 ADDED — Delete Monitoring Record
router.delete("/:id", async (req, res, next) => {
  try {
    await controller.deleteDailyUpdate(req, res);
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