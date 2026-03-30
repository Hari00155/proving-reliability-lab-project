const { Op } = require("sequelize");
const Request = require("../models/request");

// ================= CREATE =================
exports.createRequest = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA");

    const count = await Request.count().catch(() => 0);
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

      filePath: req.file ? req.file.filename : null,
      status: "Pending"
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

    let updateData = { ...req.body };

    if (req.file) {
      updateData.filePath = req.file.filename;
    }

    const existing = await Request.findByPk(id);

    if (!existing) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ================= 🔥 PL NUMBER FIX =================
    if (
      updateData.status === "Approved" &&
      !existing.allocationPlNo
    ) {
      const year = new Date().getFullYear();

      // ✅ GET LAST PL NUMBER
      const last = await Request.findOne({
        where: {
          allocationPlNo: { [Op.ne]: null }
        },
        order: [["allocationPlNo", "DESC"]]
      });

      let nextNumber = 1;

      if (last && last.allocationPlNo) {
        const lastNumber = parseInt(last.allocationPlNo.split("-")[2]);
        nextNumber = lastNumber + 1;
      }

      updateData.allocationPlNo =
        `PL-${year}-${String(nextNumber).padStart(4, "0")}`;
    }

    await Request.update(updateData, { where: { id } });

    res.json({ message: "Updated Successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteRequest = async (req, res) => {
  try {
    await Request.destroy({ where: { id: req.params.id } });

    res.json({ message: "Deleted Successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};