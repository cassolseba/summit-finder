const express = require("express");
const router = express.Router();
const { getWeather, getForecast, coordinateValidator} = require("../controllers/weather.controller");

router.get('/openweather/weather', coordinateValidator, getWeather);
router.get('/openweather/forecast', coordinateValidator, getForecast);

module.exports = router;