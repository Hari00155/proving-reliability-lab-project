const Request = require("../models/request");

exports.createRequest = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const newRequest = await Request.create(req.body);

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