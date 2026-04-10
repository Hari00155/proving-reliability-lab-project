const { Report } = require("../models");

// ─────────────────────────────────────────────────────────────
//  CREATE REPORT
// ─────────────────────────────────────────────────────────────
exports.createReport = async (req, res) => {
  try {
    console.log("📥 BODY KEYS:", Object.keys(req.body));

    if (!req.body.reportNo) {
      return res.status(400).json({
        success: false,
        error: "Report Number missing"
      });
    }

    const data = {
      // ── Report Number ──────────────────────────────────
      reportNo: req.body.reportNo,

      // ── Auto-filled from Request ───────────────────────
      plNo:          req.body.plNo          || "",
      reqNo:         req.body.reqNo         || "",
      partNo:        req.body.partNo        || "",
      date:          req.body.date          || "",
      description:   req.body.description   || "",
      platformCode:  req.body.platformCode  || "",
      productCode:   req.body.productCode   || "",
      customer:      req.body.customer      || "",
      component:     req.body.component     || "",
      samples:       req.body.samples       || "",
      testType:      req.body.testType      || "",
      category:      req.body.category      || "",
      testDetails:   req.body.testDetails   || "",
      special:       req.body.special       || "",
      testName:      req.body.testName      || "",
      spec:          req.body.spec          || "",

      // ── Auto-filled from Monitoring ────────────────────
      equipmentName:  req.body.equipmentName  || "",
      equipmentNo:    req.body.equipmentNo    || "",
      initialReading: req.body.initialReading || "",
      currentReading: req.body.currentReading || "",
      targetCycle:    req.body.targetCycle    || "",
      reportBalance:  parseFloat(req.body.reportBalance) || 0,

      // ── Manual Entry ───────────────────────────────────
      criteria:    req.body.criteria    || "",
      observation: req.body.observation || "",
      conclusion:  req.body.conclusion  || "",
      result:      req.body.result      || "Passed",

      // ── People ────────────────────────────────────────
      reportedBy:  req.body.reportedBy  || "Admin",
      approvedBy:  req.body.approvedBy  || "Superadmin",
      requestedBy: req.body.requestedBy || "",

      // ── Signatures (base64) ───────────────────────────
      signatureReported: req.body.signReportedPreview || null,
      signatureApproved: req.body.signApprovedPreview || null,

      // ── Attachments (base64) ──────────────────────────
      postDataBase64: req.body.postDataBase64 || null,
      postDataName:   req.body.postDataName   || null,

      // ── Failure Photos (array of base64) ──────────────
      failurePhotos: Array.isArray(req.body.failurePhotos)
        ? req.body.failurePhotos
        : []
    };

    console.log("✅ SAVING REPORT:", data.reportNo);

    const saved = await Report.create(data);

    // 🔥 CRITICAL FIX: return { data: { id } } — frontend reads res.data?.data?.id
    return res.status(201).json({
      success: true,
      message: "✅ Report Saved Successfully",
      reportNo: saved.reportNo,
      data: { id: saved.id }
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
      return res.status(404).json({ success: false, error: "Report not found" });
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
//  GET REPORT BY reportNo
// ─────────────────────────────────────────────────────────────
exports.getReportByReportNo = async (req, res) => {
  try {
    const report = await Report.findOne({
      where: { reportNo: req.params.reportNo }
    });
    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
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
//  UPDATE REPORT
// ─────────────────────────────────────────────────────────────
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    const updatable = {
      // Monitoring fields (may change)
      equipmentName:  req.body.equipmentName  || report.equipmentName,
      equipmentNo:    req.body.equipmentNo    || report.equipmentNo,
      initialReading: req.body.initialReading || report.initialReading,
      currentReading: req.body.currentReading || report.currentReading,
      targetCycle:    req.body.targetCycle    || report.targetCycle,
      reportBalance:  parseFloat(req.body.reportBalance) || report.reportBalance,

      // Manual entry
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
        : report.failurePhotos
    };

    await report.update(updatable);

    // 🔥 CRITICAL FIX: return { data: { id } } — frontend reads res.data?.data?.id
    return res.json({
      success: true,
      message: "✅ Report Updated Successfully",
      reportNo: report.reportNo,
      data: { id: report.id }
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
      return res.status(404).json({ success: false, error: "Report not found" });
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