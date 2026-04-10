const { DailyUpdate } = require("../models");

// ─────────────────────────────────────────────────────────────
//  CREATE DAILY UPDATE (Monitoring)
// ─────────────────────────────────────────────────────────────
exports.createDailyUpdate = async (req, res) => {
  try {
    console.log("📥 DAILY UPDATE BODY KEYS:", Object.keys(req.body));

    if (!req.body.allocationPlNo && !req.body.plNo) {
      return res.status(400).json({
        success: false,
        error: "PL No is required"
      });
    }

    // 🔥 FIX: targetCycle (not targetCycles) — matches frontend + model
    const yetToCover =
      (parseFloat(req.body.targetCycle) || 0) -
      (parseFloat(req.body.currentReading) || 0);

    const data = {
      // ── Link with Request ──────────────────────────────
      allocationPlNo: req.body.plNo || req.body.allocationPlNo || "",
      requestNo:      req.body.requestNo    || "",
      partNo:         req.body.partNo       || "",

      // ── Product / Test Info ───────────────────────────
      description:  req.body.description  || "",
      customer:     req.body.customer     || "",
      testType:     req.body.testType     || "",
      samples:      req.body.samples      || "",
      testDetails:  req.body.testDetails  || "",

      // ── Equipment ─────────────────────────────────────
      equipmentName: req.body.equipmentName || "",
      equipmentNo:   req.body.equipmentNo   || "",

      // ── Standard ──────────────────────────────────────
      standard: req.body.standard || "",

      // ── Dates ─────────────────────────────────────────
      requestDate:     req.body.requestDate     || null,
      testStartedOn:   req.body.testStartedOn   || null,
      testCompletedOn: req.body.testCompletedOn || null,

      // ── Cycles ────────────────────────────────────────
      targetCycle:    parseFloat(req.body.targetCycle)    || 0,
      initialReading: parseFloat(req.body.initialReading) || 0,
      currentReading: parseFloat(req.body.currentReading) || 0,
      yetToCover,

      // ── Purpose & Content ─────────────────────────────
      purpose:            req.body.purpose            || "",
      remarks:            req.body.remarks            || "",
      acceptanceCriteria: req.body.acceptanceCriteria || "",
      testResults:        req.body.testResults        || "",

      // ── Responsibility ────────────────────────────────
      responsibility: req.body.responsibility || "Admin",
      requestedBy:    req.body.requestedBy    || "",

      // ── Photo (multer file upload) ────────────────────
      photo: req.file ? req.file.filename : null
    };

    const saved = await DailyUpdate.create(data);

    // 🔥 CRITICAL: return { data: { id } } so frontend can store dbId
    return res.status(201).json({
      success: true,
      message: "✅ Monitoring Saved Successfully",
      data: { id: saved.id }
    });

  } catch (err) {
    console.error("❌ DAILY UPDATE CREATE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET ALL DAILY UPDATES
// ─────────────────────────────────────────────────────────────
exports.getDailyUpdates = async (req, res) => {
  try {
    const updates = await DailyUpdate.findAll({
      order: [["createdAt", "DESC"]]
    });
    return res.json({ success: true, data: updates });
  } catch (err) {
    console.error("❌ DAILY UPDATE FETCH ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET BY ID
// ─────────────────────────────────────────────────────────────
exports.getDailyUpdateById = async (req, res) => {
  try {
    const record = await DailyUpdate.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (err) {
    console.error("❌ DAILY UPDATE FETCH BY ID ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET BY REQUEST NO
// ─────────────────────────────────────────────────────────────
exports.getDailyUpdateByRequestNo = async (req, res) => {
  try {
    const record = await DailyUpdate.findOne({
      where: { requestNo: req.params.requestNo }
    });
    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (err) {
    console.error("❌ DAILY UPDATE FETCH BY REQUEST NO ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  UPDATE DAILY UPDATE (Edit Monitoring)
// ─────────────────────────────────────────────────────────────
exports.updateDailyUpdate = async (req, res) => {
  try {
    const record = await DailyUpdate.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }

    // Recalculate yetToCover using incoming or existing values
    const targetCycle    = parseFloat(req.body.targetCycle)    || record.targetCycle;
    const currentReading = parseFloat(req.body.currentReading) || record.currentReading;
    const yetToCover     = targetCycle - currentReading;

    const updatable = {
      equipmentName:    req.body.equipmentName    || record.equipmentName,
      equipmentNo:      req.body.equipmentNo      || record.equipmentNo,
      standard:         req.body.standard         || record.standard,
      requestDate:      req.body.requestDate      || record.requestDate,
      testStartedOn:    req.body.testStartedOn    || record.testStartedOn,
      testCompletedOn:  req.body.testCompletedOn  || record.testCompletedOn,
      targetCycle,
      initialReading:   parseFloat(req.body.initialReading) || record.initialReading,
      currentReading,
      yetToCover,
      purpose:            req.body.purpose            || record.purpose,
      remarks:            req.body.remarks            || record.remarks,
      acceptanceCriteria: req.body.acceptanceCriteria || record.acceptanceCriteria,
      testResults:        req.body.testResults        || record.testResults,
      responsibility:     req.body.responsibility     || record.responsibility,
      requestedBy:        req.body.requestedBy        || record.requestedBy,
      // Only update photo if a new file was uploaded
      photo: req.file ? req.file.filename : record.photo
    };

    await record.update(updatable);

    return res.json({
      success: true,
      message: "✅ Monitoring Updated Successfully",
      data: { id: record.id }
    });

  } catch (err) {
    console.error("❌ DAILY UPDATE UPDATE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE DAILY UPDATE
// ─────────────────────────────────────────────────────────────
exports.deleteDailyUpdate = async (req, res) => {
  try {
    const record = await DailyUpdate.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }
    await record.destroy();
    return res.json({
      success: true,
      message: "🗑 Monitoring Deleted Successfully"
    });
  } catch (err) {
    console.error("❌ DAILY UPDATE DELETE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};