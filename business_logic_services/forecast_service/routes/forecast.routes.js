const express = require("express");
const { coordinateValidation, forecast, weather } = require("../controllers/forecast.controller");
const router = express.Router();

router.get('/forecast/next', coordinateValidation, forecast);
router.get('/forecast/now', coordinateValidation, weather);

module.exports = router;