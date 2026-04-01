const router = require("express").Router();
const ctrl = require("../controllers/dailyupdatecontroller");

router.post("/", ctrl.createDaily);
router.get("/", ctrl.getDaily);

module.exports = router;