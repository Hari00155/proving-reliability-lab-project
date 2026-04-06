const { Report } = require("../models");

exports.createReport = async (req, res) => {
  try {
    // 🔍 DEBUG
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const files = req.files || {};

    // ✅ ADD REPORT NUMBER (FROM ROUTE)
    const reportNo = req.body.reportNo || null;

    // ✅ SAFE DATA BUILD (NO BREAK)
    const data = {
      reportNo, // ✅ NEW FIELD (IMPORTANT)

      plNo: req.body.plNo,
      reqNo: req.body.reqNo,
      partNo: req.body.partNo,

      description: req.body.description || "",
      platformCode: req.body.platformCode || "",
      productCode: req.body.productCode || "",
      customer: req.body.customer || "",
      samples: req.body.samples || "",

      testType: req.body.testType || "",
      category: req.body.category || "",

      testDetails: req.body.testDetails || "",
      special: req.body.special || "",
      criteria: req.body.criteria || "",

      spec: req.body.spec || "",
      testName: req.body.testName || "",

      result: req.body.result || "",

      // ✅ DEFAULT USERS
      reportedBy: "Admin",
      approvedBy: "Superadmin",

      // ✅ FILE HANDLING (SAFE)
      reportFile: files.reportFile?.[0]?.filename
        ? "/uploads/" + files.reportFile[0].filename
        : null,

      signatureReported: files.signatureReported?.[0]?.filename
        ? "/uploads/" + files.signatureReported[0].filename
        : null,

      signatureApproved: files.signatureApproved?.[0]?.filename
        ? "/uploads/" + files.signatureApproved[0].filename
        : null
    };

    // ✅ SAVE
    const saved = await Report.create(data);

    // ✅ RETURN REPORT NO ALSO (VERY IMPORTANT)
    res.json({
      message: "✅ Report Saved",
      reportNo: saved.reportNo, // 🔥 send to frontend
      data: saved
    });

  } catch (err) {
    console.error("❌ REPORT ERROR:", err);

    res.status(500).json({
      error: err.message || "Server Error"
    });
  }
};