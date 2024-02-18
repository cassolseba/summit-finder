const express = require("express");
const { coordinateValidation, forecast, weather } = require("../controllers/forecast.controller");
const router = express.Router();

router.get('/next', coordinateValidation, forecast);
router.get('/now', coordinateValidation, weather);

module.exports = router;