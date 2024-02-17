const express = require("express");
const router = express.Router();
const { getWeather, getForecast, coordinateValidator} = require("../controllers/weather.controller");

router.get('/weather', coordinateValidator, getWeather);
router.get('/forecast', coordinateValidator, getForecast);

module.exports = router;