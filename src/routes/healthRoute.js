const express = require("express");
const router = express.Router();

const { healthCheck, readyCheck } = require("../controller/healthController");

router.get("/health", healthCheck);
router.get("/ready", readyCheck);

module.exports = router;