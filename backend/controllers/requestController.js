const { Op } = require("sequelize");
const Request = require("../models/request");


// ================= CREATE =================
exports.createRequest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const newRequest = await Request.create({
      ...req.body,
      date: req.body.date || today,
      filePath: req.file ? req.file.filename : null,
      status: "Pending"
    });

    res.status(201).json(newRequest);

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL =================
exports.getRequests = async (req, res) => {
  try {
    const data = await Request.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GET TODAY =================
exports.getTodayRequests = async (req, res) => {
  try {
    // ✅ FIX: use LOCAL DATE (India safe)
    const today = new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd

    console.log("TODAY:", today);

    const data = await Request.findAll({
      where: {
        date: today
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (error) {
    console.error("TODAY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ARCHIVE =================
exports.getArchiveRequests = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA");

    console.log("ARCHIVE TODAY:", today);

    const data = await Request.findAll({
      where: {
        date: {
          [Op.lt]: today   // works correctly now
        }
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(data);

  } catch (error) {
    console.error("ARCHIVE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= UPDATE =================
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    // FILE UPDATE
    if (req.file) {
      updateData.filePath = req.file.filename;
    }

    const existing = await Request.findByPk(id);

    if (!existing) {
      return res.status(404).json({ error: "Request not found" });
    }

    // AUTO PL NUMBER
    if (
      updateData.status === "Approved" &&
      !existing.allocationPlNo
    ) {
      const approvedCount = await Request.count({
        where: { status: "Approved" }
      });

      const year = new Date().getFullYear();

      updateData.allocationPlNo =
        `PL-${year}-${String(approvedCount + 1).padStart(4, "0")}`;
    }

    await Request.update(updateData, {
      where: { id }
    });

    res.json({ message: "Updated Successfully" });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= DELETE =================
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await Request.destroy({
      where: { id }
    });

    res.json({ message: "Deleted Successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};