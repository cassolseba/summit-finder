const axios = require("axios");
const openWeatherPort = process.env.OPENWEATHER_ADAPTER_PORT;

const forecast = async (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let forecastUrl = `http://openweather_adapter:${openWeatherPort}/openweather/forecast`;

    await axios.get(forecastUrl, {
        params: {
            lat: lat,
            lon: lon
        }
    }).then((response) => {

        if (!response.data.data || response.data.data.forecast.length !== 40) {
            return res
                .status(400)
                .send({
                    "status": "fail",
                    "data": {
                        "forecast": "Forecast not available for this position"
                    }
                });
        }

        let timezone = response.data.data.info.timezone;
        const data = response.data.data.forecast;

        // calculate avg parameters for tomorrow
        let tomorrow = [];
        for (let forecast of data) {
            if (isTomorrow(forecast.dt, timezone)) {
                tomorrow.push(forecast);
            }
        }

        let minTemp = tomorrow[0].temp;
        let maxTemp = tomorrow[0].temp;
        let avgTemp = 0.0;
        let totalRain = 0.0;
        let totalSnow = 0.0;
        let maxProbability = tomorrow[0].probability;
        let maxHumidity = tomorrow[0].humidity;
        let minHumidity = tomorrow[0].humidity;
        let avgHumidity = 0.0;
        let minVisibility = tomorrow[0].visibility;
        let maxVisibility = tomorrow[0].visibility;
        let avgVisibility = 0.0;
        let avgCloudiness = 0.0;
        let maxWind = tomorrow[0].wind;
        let minWind = tomorrow[0].wind;
        let avgWind = 0.0;
        let condition = [];
        let description = [];

        for (let forecast of tomorrow) {
            if (forecast.temp < minTemp) {
                minTemp = forecast.temp;
            }
            if (forecast.temp > maxTemp) {
                maxTemp = forecast.temp;
            }
            avgTemp += forecast.temp;
            totalRain += forecast.rain;
            totalSnow += forecast.snow;
            if (forecast.probability > maxProbability) {
                maxProbability = forecast.probability;
            }
            if (forecast.humidity < minHumidity) {
                minHumidity = forecast.humidity;
            }
            if (forecast.humidity > maxHumidity) {
                maxHumidity = forecast.humidity;
            }
            if (forecast.visibility > maxVisibility) {
                maxVisibility = forecast.visibility
            }
            if (forecast.visibility < minVisibility) {
                minVisibility = forecast.visibility;
            }
            avgVisibility += forecast.visibility;
            avgHumidity += forecast.humidity;
            avgCloudiness += forecast.clouds;
            if (forecast.wind > maxWind) {
                maxWind = forecast.wind;
            }
            if (forecast.wind < minWind) {
                minWind = forecast.wind;
            }
            avgWind += forecast.wind;
            if (!condition.includes(forecast.condition)) {
                condition.push(forecast.condition);
            }
            if (!description.includes(forecast.description)) {
                description.push(forecast.description);
            }
        }

        let tomorrowForecast = {}
        tomorrowForecast["minTemp"] = minTemp;
        tomorrowForecast["maxTemp"] = maxTemp;
        tomorrowForecast["avgTemp"] = avgTemp / 8.0;
        tomorrowForecast["totalRain"] = totalRain;
        tomorrowForecast["totalSnow"] = totalSnow;
        tomorrowForecast["maxProbability"] = maxProbability;
        tomorrowForecast["minHumidity"] = minHumidity;
        tomorrowForecast["maxHumidity"] = maxHumidity;
        tomorrowForecast["minVisibility"] = minVisibility;
        tomorrowForecast["maxVisibility"] = maxVisibility;
        tomorrowForecast["avgVisibility"] = avgVisibility / 8.0;
        tomorrowForecast["avgHumidity"] = avgHumidity / 8.0;
        tomorrowForecast["avgCloudiness"] = avgCloudiness / 8.0;
        tomorrowForecast["maxWind"] = maxWind;
        tomorrowForecast["minWind"] = minWind;
        tomorrowForecast["avgWind"] = avgWind;
        tomorrowForecast["condition"] = condition;
        // easter egg
        if (totalSnow > 15.0) {
            description.push("Powder day!!");
        }
        tomorrowForecast["description"] = description;
        tomorrowForecast["date"] = new Date((tomorrow[0].dt + timezone) * 1000);

        let forecastUTC = [];
        // convert date from unix to utc
        for (let forecast of data) {
            forecast.dt = new Date((forecast.dt + timezone) * 1000);
            forecastUTC.push(forecast);
        }

        return res
            .status(200)
            .send({
               "status": "success",
               "message": "Forecast successfully retrieved",
                "data": {
                   "forecasts": forecastUTC,
                    "tomorrow": tomorrowForecast
                }
            });


    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving forecast from Open Weather adapter: ${error}`
            });
    });
}

const weather = async (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let forecastUrl = `http://openweather_adapter:${openWeatherPort}/openweather/weather`;

    await axios.get(forecastUrl, {
        params: {
            lat: lat,
            lon: lon
        }
    }).then((response) => {

        if (!response.data.data) {
            return res
                .status(400)
                .send({
                    "status": "fail",
                    "data": {
                        "forecast": "Actual weather not available for this position"
                    }
                });
        }

        let weather = response.data.data.weather;
        let timezone = 3600; // todo fix for all timezones
        weather.dt = new Date((weather.dt + timezone) * 1000);
        weather.sunrise = new Date((weather.sunrise + timezone) * 1000);
        weather.sunset = new Date((weather.sunset + timezone) * 1000);

        return res
            .status(200)
            .send({
                "status": "success",
                "message": "Actual weather succesfully retrieved",
                "data": response.data.data
            });


    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving actual weather from Open Weather adapter: ${error}`
            });
    });
}

const coordinateValidation = (req, res, next) => {
    let lat = req.query.lat;
    let lon = req.query.lon;

    if (!lat) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lat": "A latitude is required"
                }
            });
    }

    if (isNaN(lat)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lat": "Latitude must be a decimal number"
                }
            });
    }

    if (lat < -90 || lat > 90) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lat": "Latitude must be a decimal number between -90 and 90"
                }
            });
    }

    if (!lon) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lon": "A longitude is required"
                }
            });
    }

    if (isNaN(lon)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lon": "Longitude must be a decimal number"
                }
            });
    }

    if (lon < -90 || lon > 90) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lon": "Longitude must be a decimal number between -90 and 90"
                }
            });
    }

    next();
}

function isTomorrow(dt, timezone) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateToCheck = new Date((dt + timezone) * 1000);

    return tomorrow.getDate() === dateToCheck.getDate() &&
        tomorrow.getMonth() === dateToCheck.getMonth() &&
        tomorrow.getFullYear() === dateToCheck.getFullYear();
}

module.exports = {
    coordinateValidation,
    forecast,
    weather
}