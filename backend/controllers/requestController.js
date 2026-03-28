const Request = require("../models/request");

exports.createRequest = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file); // 👈 check here

    const newRequest = await Request.create({
      ...req.body,
      filePath: req.file ? req.file.filename : null
    });

    res.status(201).json({
      message: "Request created successfully",
      data: newRequest
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: "Error creating request",
      error: error.message
    });
  }
};