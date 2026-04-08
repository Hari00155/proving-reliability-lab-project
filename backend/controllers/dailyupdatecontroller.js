const { DailyUpdate } = require("../models");

// ─────────────────────────────────────────────────────────────
//  CREATE DAILY UPDATE (Monitoring)
// ─────────────────────────────────────────────────────────────
exports.createDailyUpdate = async (req, res) => {
  try {
    console.log("📥 BODY KEYS:", Object.keys(req.body));

    // ✅ SAFE NUMBER CONVERSION
    const target  = parseFloat(req.body.targetCycles)    || 0;
    const current = parseFloat(req.body.currentReading)  || 0;
    const initial = parseFloat(req.body.initialReading)  || 0;

    // ✅ AUTO CALCULATION
    const yetToCover = target - current;

    // ✅ FULL DATA BUILD — matches updated model
    const data = {

      // ── Link with Request ─────────────────────────────
      allocationPlNo: req.body.allocationPlNo || req.body.plNo || "",
      requestNo:      req.body.requestNo      || "",             // 🔥 ADDED
      partNo:         req.body.partNo         || "",             // 🔥 ADDED

      // ── Product / Test Info ───────────────────────────
      description: req.body.description || "",                   // 🔥 ADDED
      customer:    req.body.customer    || "",                   // 🔥 ADDED
      testType:    req.body.testType    || "",                   // 🔥 ADDED
      samples:     req.body.samples     || "",                   // 🔥 ADDED
      testDetails: req.body.testDetails || "",                   // 🔥 ADDED

      // ── Equipment ─────────────────────────────────────
      equipmentName: req.body.equipmentName || "",               // 🔥 ADDED
      equipmentNo:   req.body.equipmentNo   || "",

      // ── Standard ──────────────────────────────────────
      standard: req.body.standard || "",                         // 🔥 ADDED

      // ── Dates ─────────────────────────────────────────
      updateDate:      req.body.updateDate      || null,
      requestDate:     req.body.requestDate     || null,         // 🔥 ADDED
      testStartedOn:   req.body.testStartedOn   || null,         // 🔥 ADDED
      testCompletedOn: req.body.testCompletedOn || null,         // 🔥 ADDED

      // ── Cycles / Counter ──────────────────────────────
      targetCycles:   target,
      initialReading: initial,
      currentReading: current,
      yetToCover:     yetToCover,                                // ✅ AUTO CALCULATED

      // ── Purpose & Test Content ────────────────────────
      purpose:            req.body.purpose            || "",     // 🔥 ADDED
      remarks:            req.body.remarks            || "",
      acceptanceCriteria: req.body.acceptanceCriteria || "",     // 🔥 ADDED
      testResults:        req.body.testResults        || "",     // 🔥 ADDED

      // ── Responsibility ────────────────────────────────
      responsibility: req.body.responsibility || "Admin",        // 🔥 ADDED
      requestedBy:    req.body.requestedBy    || "",             // 🔥 ADDED

      // ── Photo (kept for compatibility) ────────────────
      photo: req.file
        ? "/uploads/" + req.file.filename
        : null
    };

    console.log("✅ SAVING MONITORING:", data.requestNo, data.allocationPlNo);

    // ✅ SAVE TO DB
    const saved = await DailyUpdate.create(data);

    return res.status(201).json({
      success: true,
      message: "✅ Monitoring Saved Successfully",
      data: saved
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
//  GET SINGLE BY ID
// ─────────────────────────────────────────────────────────────
exports.getDailyUpdateById = async (req, res) => {
  try {
    const update = await DailyUpdate.findByPk(req.params.id);
    if (!update) {
      return res.status(404).json({
        success: false,
        error: "Monitoring record not found"
      });
    }
    return res.json({ success: true, data: update });
  } catch (err) {
    console.error("❌ DAILY UPDATE FETCH BY ID ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET BY requestNo (used by frontend edit flow)
// ─────────────────────────────────────────────────────────────
exports.getDailyUpdateByRequestNo = async (req, res) => {
  try {
    const update = await DailyUpdate.findOne({
      where: { requestNo: req.params.requestNo },
      order: [["createdAt", "DESC"]]
    });
    if (!update) {
      return res.status(404).json({
        success: false,
        error: "Monitoring record not found"
      });
    }
    return res.json({ success: true, data: update });
  } catch (err) {
    console.error("❌ DAILY UPDATE FETCH BY REQUEST NO ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  UPDATE (Edit Monitoring Mode)
// ─────────────────────────────────────────────────────────────
exports.updateDailyUpdate = async (req, res) => {
  try {
    const update = await DailyUpdate.findByPk(req.params.id);
    if (!update) {
      return res.status(404).json({
        success: false,
        error: "Monitoring record not found"
      });
    }

    // ✅ RECALCULATE on update
    const target  = parseFloat(req.body.targetCycles)   || update.targetCycles;
    const current = parseFloat(req.body.currentReading) || update.currentReading;
    const yetToCover = target - current;

    const updatable = {
      // Equipment
      equipmentName: req.body.equipmentName || update.equipmentName,
      equipmentNo:   req.body.equipmentNo   || update.equipmentNo,
      standard:      req.body.standard      || update.standard,

      // Dates
      updateDate:      req.body.updateDate      || update.updateDate,
      requestDate:     req.body.requestDate     || update.requestDate,
      testStartedOn:   req.body.testStartedOn   || update.testStartedOn,
      testCompletedOn: req.body.testCompletedOn || update.testCompletedOn,

      // Cycles — recalculated
      targetCycles:   target,
      currentReading: current,
      initialReading: parseFloat(req.body.initialReading) || update.initialReading,
      yetToCover:     yetToCover,                          // ✅ RECALCULATED

      // Content
      purpose:            req.body.purpose            || update.purpose,
      remarks:            req.body.remarks            || update.remarks,
      acceptanceCriteria: req.body.acceptanceCriteria || update.acceptanceCriteria,
      testResults:        req.body.testResults        || update.testResults,

      // People
      responsibility: req.body.responsibility || update.responsibility,
      requestedBy:    req.body.requestedBy    || update.requestedBy,

      // Photo — only update if new file uploaded
      photo: req.file
        ? "/uploads/" + req.file.filename
        : update.photo
    };

    await update.update(updatable);

    return res.json({
      success: true,
      message: "✅ Monitoring Updated Successfully",
      data: update
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
//  DELETE
// ─────────────────────────────────────────────────────────────
exports.deleteDailyUpdate = async (req, res) => {
  try {
    const update = await DailyUpdate.findByPk(req.params.id);
    if (!update) {
      return res.status(404).json({
        success: false,
        error: "Monitoring record not found"
      });
    }
    await update.destroy();
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