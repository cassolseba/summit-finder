const Wish = require("../models/wish.model")

const newWish = (req, res) => {
    let originLat = req.body.originLat;
    let originLon = req.body.originLon;
    let originName = req.body.originName;
    let destinationLat = req.body.destinationLat;
    let destinationLon = req.body.destinationLon;
    let destinationName = req.body.destinationName;
    let huts = req.body.huts;
    let peaks = req.body.peaks;
    let userId = req.body.userId;

    const wish = new Wish({
        originLat: originLat,
        originLon: originLon,
        originName: originName,
        destinationLat: destinationLat,
        destinationLon: destinationLon,
        destinationName: destinationName,
        huts: huts,
        peaks: peaks,
        userId: userId
    });

    wish
        .save()
        .then((result) => {
            res
                .status(201)
                .send({
                    "status": "success",
                    "message": "Added successfully to the wishlist",
                    "data": {
                        "wish": result
                    }
                });
        })
        .catch((error) => {
            res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const wishValidation = (req, res, next) => {
    if (!req.body.originLat) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin is required"
                }
            });
    }

    if (isNaN(req.body.originLat)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin must be a decimal number"
                }
            });
    }

    if (req.body.originLat > 180 || req.body.originLat < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.originLon) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin is required"
                }
            });
    }

    if (isNaN(req.body.originLon)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin must be a decimal number"
                }
            });
    }

    if (req.body.originLon > 180 || req.body.originLon < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.originName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originName": "The name of the origin is required"
                }
            });
    }

    if (!req.body.destinationLat) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination is required"
                }
            });
    }

    if (isNaN(req.body.destinationLat)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination must be a decimal number"
                }
            });
    }

    if (req.body.destinationLat > 180 || req.body.destinationLat < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.destinationLon) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination is required"
                }
            });
    }

    if (isNaN(req.body.destinationLon)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination must be a decimal number"
                }
            });
    }

    if (req.body.destinationLon > 180 || req.body.destinationLon < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.destinationName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationName": "The name of the destination is required"
                }
            });
    }

    if (!req.body.userId) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "userId": "The user object id is required"
                }
            });
    }

    next();
}

module.exports = {
    wishValidation,
    newWish
}