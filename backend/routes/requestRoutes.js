const express = require("express");
const router = express.Router();

const { createRequest } = require("../controllers/requestController");
const upload = require("../middlewares/upload"); // 👈 add this

// 👇 CHANGE THIS LINE
router.post("/", upload.single("file"), createRequest);

module.exports = router;