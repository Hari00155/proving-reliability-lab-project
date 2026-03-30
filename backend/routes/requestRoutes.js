const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest
} = require("../controllers/requestController");

// CREATE
router.post("/", upload.single("file"), createRequest);

// GET ALL
router.get("/", getRequests);

// UPDATE
router.put("/:id", upload.single("file"), updateRequest);

// DELETE
router.delete("/:id", deleteRequest);

module.exports = router;