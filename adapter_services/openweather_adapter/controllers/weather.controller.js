const axios = require("axios");
const apiKey = process.env.OPENWEATHER_API_KEY;
const units = `metric`;

const getWeather = async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

    await axios.get(apiUrl, {
        params: {
            lat: lat,
            lon: lon,
            units: units,
            appid: apiKey
        }
    }).then((response) => {
        if (response === null || response === undefined) {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "message": "No data received from Open Weather"
                });
        }

        let weather = {};
        weather['condition'] = response.data.weather[0].main;
        weather['description'] = response.data.weather[0].description;
        weather['temp'] = response.data.main.temp;
        weather['perceivedTemp'] = response.data.main.feels_like;
        weather['humidity'] = response.data.main.humidity;
        weather['visibility'] = response.data.visibility;
        weather['wind'] = response.data.wind.speed;
        weather['clouds'] = response.data.clouds.all;
        weather['dt'] = response.data.dt;
        weather['timezone'] = response.data.timezone;
        weather['sunrise'] = response.data.sys.sunrise;
        weather['sunset'] = response.data.sys.sunset;

        return res
            .status(200)
            .json({
                "status": "success",
                "data": {
                    "weather": weather
                }
            });

    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "message": error
            })
    });
}

const getForecast = async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast`;

    await axios.get(apiUrl, {
        params: {
            lat: lat,
            lon: lon,
            units: units,
            appid: apiKey
        }
    }).then((response) => {
        if (response === null || response === undefined) {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "message": "No data received from Open Weather"
                });
        }

        let info = {};
        info['timezone'] = response.data.city.timezone;
        info['sunrise'] = response.data.city.sunrise;
        info['sunset'] = response.data.city.sunset;

        let data = response.data.list;

        let forecasts = [];
        for (let i = 0; i < data.length; i++) {
            let forecast = {};

            forecast['condition'] = data[i].weather[0].main;
            forecast['description'] = data[i].weather[0].description;
            forecast['temp'] = data[i].main.temp;
            forecast['perceivedTemp'] = data[i].main.feels_like;
            forecast['humidity'] = data[i].main.humidity;
            forecast['visibility'] = data[i].visibility;
            forecast['wind'] = data[i].wind.speed;
            forecast['clouds'] = data[i].clouds.all;
            data[i].rain ? forecast['rain'] = data[i].rain['3h'] : forecast['rain'] = 0.0;
            data[i].snow ? forecast['snow'] = data[i].snow['3h'] : forecast['snow'] = 0.0;
            data[i]['pop'] ? forecast['probability'] = data[i]['pop'] : forecast['probability'] = 0.0;
            forecast['dt'] = data[i].dt;

            forecasts.push(forecast);
        }

        return res
            .status(200)
            .json({
                "status": "success",
                "data": {
                    "forecast": forecasts,
                    "info": info
                }
            });

    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "message": error
            })
    });
}

const coordinateValidator = (req, res, next) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

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

module.exports = {
    coordinateValidator,
    getWeather,
    getForecast
}