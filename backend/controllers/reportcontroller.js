const { Report } = require("../models");

exports.createReport = async (req, res) => {
  try {
    console.log("📥 BODY KEYS:", Object.keys(req.body));

    // ✅ REPORT NUMBER VALIDATION
    if (!req.body.reportNo) {
      return res.status(400).json({
        success: false,
        error: "Report Number missing"
      });
    }

    // ✅ SAFE DATA BUILD — all fields from updated model
    const data = {

      // ── Report Number ───────────────────────────────────
      reportNo: req.body.reportNo,

      // ── Auto-filled from Request ────────────────────────
      plNo:          req.body.plNo         || "",
      reqNo:         req.body.reqNo        || "",
      partNo:        req.body.partNo       || "",
      date:          req.body.date         || "",
      description:   req.body.description  || "",
      platformCode:  req.body.platformCode || "",
      productCode:   req.body.productCode  || "",
      customer:      req.body.customer     || "",
      component:     req.body.component    || "",   // 🔥 ADDED
      samples:       req.body.samples      || "",
      testType:      req.body.testType     || "",
      category:      req.body.category     || "",
      testDetails:   req.body.testDetails  || "",
      special:       req.body.special      || "",
      testName:      req.body.testName     || "",
      spec:          req.body.spec         || "",   // Test Equipment

      // ── Auto-filled from Monitoring ─────────────────────
      equipmentName:  req.body.equipmentName  || "",  // 🔥 ADDED
      equipmentNo:    req.body.equipmentNo    || "",  // 🔥 ADDED
      initialReading: req.body.initialReading || "",  // 🔥 ADDED
      currentReading: req.body.currentReading || "",  // 🔥 ADDED
      targetCycle:    req.body.targetCycle    || "",  // 🔥 ADDED
      reportBalance:  parseFloat(req.body.reportBalance) || 0, // 🔥 ADDED

      // ── Manual Entry ────────────────────────────────────
      criteria:    req.body.criteria    || "",
      observation: req.body.observation || "",
      conclusion:  req.body.conclusion  || "",
      result:      req.body.result      || "Passed",

      // ── People ──────────────────────────────────────────
      reportedBy:  req.body.reportedBy  || "Admin",
      approvedBy:  req.body.approvedBy  || "Superadmin",
      requestedBy: req.body.requestedBy || "",       // 🔥 ADDED

      // ── Signatures (base64) ─────────────────────────────
      signatureReported: req.body.signReportedPreview || null, // 🔥 base64
      signatureApproved: req.body.signApprovedPreview || null, // 🔥 base64

      // ── Attachments (base64) ────────────────────────────
      postDataBase64: req.body.postDataBase64 || null, // 🔥 ADDED
      postDataName:   req.body.postDataName   || null, // 🔥 ADDED

      // ── Failure Photos (array of base64) ────────────────
      // Model getter/setter handles JSON.parse/stringify
      failurePhotos: Array.isArray(req.body.failurePhotos)
        ? req.body.failurePhotos
        : [],                                          // 🔥 ADDED
    };

    console.log("✅ SAVING REPORT:", data.reportNo);

    // ✅ SAVE TO DB
    const saved = await Report.create(data);

    return res.status(201).json({
      success: true,
      message: "✅ Report Saved Successfully",
      reportNo: saved.reportNo,
      data: saved
    });

  } catch (err) {
    console.error("❌ REPORT CREATE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET ALL REPORTS
// ─────────────────────────────────────────────────────────────
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [["createdAt", "DESC"]]
    });
    return res.json({ success: true, data: reports });
  } catch (err) {
    console.error("❌ REPORT FETCH ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET SINGLE REPORT BY ID
// ─────────────────────────────────────────────────────────────
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }
    return res.json({ success: true, data: report });
  } catch (err) {
    console.error("❌ REPORT FETCH BY ID ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET REPORT BY reportNo (used by frontend edit flow)
// ─────────────────────────────────────────────────────────────
exports.getReportByReportNo = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: { reportNo: req.params.reportNo }
    });
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }
    return res.json({ success: true, data: report });
  } catch (err) {
    console.error("❌ REPORT FETCH BY REPORT NO ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  UPDATE REPORT (Edit Mode)
// ─────────────────────────────────────────────────────────────
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }

    // ✅ Only update allowed editable fields
    const updatable = {
      // Monitoring fields (may change)
      equipmentName:  req.body.equipmentName  || report.equipmentName,
      equipmentNo:    req.body.equipmentNo    || report.equipmentNo,
      initialReading: req.body.initialReading || report.initialReading,
      currentReading: req.body.currentReading || report.currentReading,
      targetCycle:    req.body.targetCycle    || report.targetCycle,
      reportBalance:  parseFloat(req.body.reportBalance) || report.reportBalance,

      // Manual entry fields
      criteria:    req.body.criteria    || report.criteria,
      observation: req.body.observation || report.observation,
      conclusion:  req.body.conclusion  || report.conclusion,
      result:      req.body.result      || report.result,
      reportedBy:  req.body.reportedBy  || report.reportedBy,
      approvedBy:  req.body.approvedBy  || report.approvedBy,
      requestedBy: req.body.requestedBy || report.requestedBy,

      // Signatures — only update if new one provided
      signatureReported: req.body.signReportedPreview || report.signatureReported,
      signatureApproved: req.body.signApprovedPreview || report.signatureApproved,

      // Attachments — only update if new one provided
      postDataBase64: req.body.postDataBase64 || report.postDataBase64,
      postDataName:   req.body.postDataName   || report.postDataName,

      // Failure photos — replace entire array if new one sent
      failurePhotos: Array.isArray(req.body.failurePhotos)
        ? req.body.failurePhotos
        : report.failurePhotos,
    };

    await report.update(updatable);

    return res.json({
      success: true,
      message: "✅ Report Updated Successfully",
      reportNo: report.reportNo,
      data: report
    });

  } catch (err) {
    console.error("❌ REPORT UPDATE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE REPORT
// ─────────────────────────────────────────────────────────────
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found"
      });
    }
    await report.destroy();
    return res.json({
      success: true,
      message: "🗑 Report Deleted Successfully"
    });
  } catch (err) {
    console.error("❌ REPORT DELETE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server Error"
    });
  }
};