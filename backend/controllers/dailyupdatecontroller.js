const { DailyUpdate } = require("../models");

exports.createDailyUpdate = async (req, res) => {
  try {
    // 🔍 DEBUG (helps if any issue)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ SAFE NUMBER CONVERSION
    const target = Number(req.body.targetCycle) || 0;
    const current = Number(req.body.currentReading) || 0;
    const initial = Number(req.body.initialReading) || 0;

    // ✅ CALCULATION
    const yetToCover = target - current;

    // ✅ FINAL DATA
    const data = {
      plNo: req.body.plNo,
      equipmentNo: req.body.equipmentNo,
      date: req.body.date || null,

      targetCycle: target,
      currentReading: current,
      initialReading: initial,
      yetToCover: yetToCover,

      remarks: req.body.remarks || "",

      photo: req.file ? "/uploads/" + req.file.filename : null
    };

    // ✅ SAVE
    const saved = await DailyUpdate.create(data);

    // ✅ RESPONSE
    res.json({
      message: "✅ Daily Update Saved",
      data: saved
    });

  } catch (err) {
    console.error("❌ DAILY UPDATE ERROR:", err);

    res.status(500).json({
      error: err.message || "Server Error"
    });
  }
};