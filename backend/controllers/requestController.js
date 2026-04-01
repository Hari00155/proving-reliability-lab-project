const { Op } = require("sequelize");
const { Request } = require("../models");

// ================= CREATE =================
exports.createRequest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const count = await Request.count();
    const year = new Date().getFullYear();

    const requestNo = `REQ-${year}-${String(count + 1).padStart(4, "0")}`;

    const newRequest = await Request.create({
      requestNo,

      userName: req.body.userName || "User",
      deptId: req.body.deptId || "D001",
      date: req.body.date || today,

      partNo: req.body.partNo || "",
      description: req.body.description || "",
      platformCode: req.body.platformCode || "",
      productCode: req.body.productCode || "",
      customer: req.body.customer || "",

      samples: req.body.samples || 0,
      testType: req.body.testType || "",
      category: req.body.category || "",
      testDetails: req.body.testDetails || "",
      special: req.body.special || "",
      criteria: req.body.criteria || "",
      spec: req.body.spec || "",
      testName: req.body.testName || "",

      // ✅ FIX: ALWAYS FULL URL
      attachment: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : null,

      attachmentName: req.file ? req.file.originalname : null,

      status: "Pending",
      allocationPlNo: null,
      rejectReason: null,
      responsibility: null
    });

    res.status(201).json(newRequest);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL =================
exports.getRequests = async (req, res) => {
  try {
    const data = await Request.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE =================
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Request.findByPk(id);
    if (!existing) {
      return res.status(404).json({ error: "Request not found" });
    }

    let updateData = { ...req.body };

    // ================= FILE UPDATE =================
    if (req.file) {
      updateData.attachment = `http://localhost:5000/uploads/${req.file.filename}`;
      updateData.attachmentName = req.file.originalname;
    }

    // ================= REJECT =================
    if (updateData.status === "Rejected") {
      updateData.rejectReason = req.body.rejectReason || "No reason provided";
    }

    // ================= ALLOCATE =================
    if (updateData.status === "Allocated") {

      // 🔥 IMPORTANT: GENERATE ONLY ONCE
      if (!existing.allocationPlNo) {

        const all = await Request.findAll({
          where: {
            allocationPlNo: { [Op.ne]: null }
          }
        });

        const numbers = all
          .map(r => parseInt(r.allocationPlNo))
          .filter(n => !isNaN(n));

        const max = numbers.length ? Math.max(...numbers) : 0;

        updateData.allocationPlNo = String(max + 1).padStart(5, "0");
      }

      updateData.responsibility = "Admin";
    }

    // ✅ UPDATE USING INSTANCE (SAFE)
    await existing.update(updateData);

    res.json({ message: "Updated Successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteRequest = async (req, res) => {
  try {
    const deleted = await Request.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Deleted Successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= TODAY =================
exports.getTodayRequests = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const data = await Request.findAll({
      where: { date: today },
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error("TODAY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= ARCHIVE =================
exports.getArchiveRequests = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const data = await Request.findAll({
      where: {
        date: { [Op.ne]: today }
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (err) {
    console.error("ARCHIVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};