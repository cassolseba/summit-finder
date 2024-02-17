const axios = require("axios");

const getWeather = async (req, res) => {
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

    let apiKey = process.env.OPENWEATHER_API_KEY;
    let units = `metric`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather`;
    let apiUrlComplete = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

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
        weather['wind'] = response.data.wind;
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

const getForecast = (req, res) => {}

module.exports = {
    getWeather,
    getForecast
}