const axios = require("axios");

const tour = async (req, res) => {
    // parameters
    let origin = req.query.origin;
    let destination = req.query.destination;
    let range = req.query.range;

    // ports
    let nominatimPort = process.env.NOMINATIM_ADAPTER_PORT;
    let overpassPort = process.env.OVERPASS_ADAPTER_PORT;
    let elevationPort = process.env.ELEVATION_ADAPTER_PORT;
    let forecastPort = process.env.FORECAST_SERVICE_PORT;

    // convert origin to lat and lon
    let nominatimOriginUrl = `http://nominatim_adapter:${nominatimPort}/nominatim/${origin}`;

    let originPlace;

    await axios.get(nominatimOriginUrl)
        .then((response) => {
            if (response.data && response.data.status === "success") {
                originPlace = response.data.data.place;
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while retrieving origin coordinates from Nominatim adapter: ${error}`
                });
        });

    // convert destination to lat and lon
    let nominatimDestinationUrl = `http://nominatim_adapter:${nominatimPort}/nominatim/${destination}`;

    let destinationPlace;

    await axios.get(nominatimDestinationUrl)
        .then((response) => {
            if (response.data && response.data.status === "success") {
                destinationPlace = response.data.data.place;
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while retrieving destination coordinates from Nominatim adapter: ${error}`
                });
        });

    // find peaks within the range
    let overpassPeaksUrl = `http://overpass_adapter:${overpassPort}/overpass/peaks`;

    let peaks;

    await axios.get(overpassPeaksUrl, {
        params: {
            lat: destinationPlace.lat,
            lon: destinationPlace.lon,
            range: range
        }
    }).then((response) => {
        if (response.data && response.data.status === "success") {
            peaks = response.data.data.peaks;
        }
    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving peaks list from Overpass adapter: ${error}`
            });
    });

    // find huts within the range
    let overpassHutsUrl = `http://overpass_adapter:${overpassPort}/overpass/huts`;

    let huts;

    await axios.get(overpassHutsUrl, {
        params: {
            lat: destinationPlace.lat,
            lon: destinationPlace.lon,
            range: range
        }
    }).then((response) => {
        if (response.data && response.data.status === "success") {
            huts = response.data.data.huts;
        }
    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving huts list from Overpass adapter: ${error}`
            });
    });

    // find elevation for peaks without elevation parameter
    let elevationUrl = `http://elevation_adapter:${elevationPort}/elevation`;

    let completePeaks = [];
    for (let peak of peaks ) {
        if (!peak.elevation) {
            await axios.get(elevationUrl, {
                params: {
                    lat: peak.lat,
                    lon: peak.lon
                }
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    peak.elevation = response.data.data.elevation.meters;
                }
            }).catch((error) => {
                return res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": `Error while retrieving elevation of a peak from Elevation adapter: ${error}`
                    });
            });
        }
        peak.elevation = parseFloat(peak.elevation);
        completePeaks.push(peak);
    }

    // find elevation for huts without elevation parameter
    let completeHuts = [];
    for (let hut of huts ) {
        if (!hut.elevation) {
            await axios.get(elevationUrl, {
                params: {
                    lat: hut.lat,
                    lon: hut.lon
                }
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    hut.elevation = response.data.data.elevation.meters;
                }
            }).catch((error) => {
                return res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": `Error while retrieving elevation of a hut from Elevation adapter: ${error}`
                    });
            });
        }
        hut.elevation = parseFloat(hut.elevation);
        completeHuts.push(hut);
    }

    // get current weather at destination
    let weatherUrl = `http://forecast_service:${forecastPort}/now`;

    let weather;

    await axios.get(weatherUrl, {
        params: {
            lat: destinationPlace.lat,
            lon: destinationPlace.lon,
        }
    }).then((response) => {
        if (response.data && response.data.status === "success") {
            weather = response.data.data.weather;
        }
    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving current weather from Forecast service: ${error}`
            });
    });

    // get forecast at destination
    let forecastUrl = `http://forecast_service:${forecastPort}/next`;

    let forecast;

    await axios.get(forecastUrl, {
        params: {
            lat: destinationPlace.lat,
            lon: destinationPlace.lon,
        }
    }).then((response) => {
        if (response.data && response.data.status === "success") {
            forecast = response.data.data;
        }
    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while retrieving forecast from Forecast service: ${error}`
            });
    });

    return res
        .status(200)
        .send({
           "status": "success",
           "message": "Tour retrieved successfully",
           "data": {
               "origin": originPlace,
               "destination": destinationPlace,
               "peaks": completePeaks,
               "huts": completeHuts,
               "weather": weather,
               "tomorrow": forecast.tomorrow,
               "forecast": forecast.forecasts
           }
        });
}

const validation = (req, res, next) => {
    let origin = req.query.origin;
    let destination = req.query.destination;
    let range = req.query.range;

    if (!origin) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "origin": "An origin is required"
                }
            });
    }

    if (!destination) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destination": "A destination is required"
                }
            });
    }

    if(!range) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "range": "A search range is required"
                }
            })
    }

    if (range < 0) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "range": "Range must be greater than 0"
                }
            })
    }

    if (range > 20000) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "range": "Range greater than 20km is not supported"
                }
            });
    }

    next();
}

module.exports = {
    validation,
    tour
}