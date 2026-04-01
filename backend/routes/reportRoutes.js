const router = require("express").Router();
const ctrl = require("../controllers/reportcontroller");

router.post("/", ctrl.createReport);
router.get("/", ctrl.getReports);

module.exports = router;