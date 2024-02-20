const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    let bearerToken = req.headers['authorization'];

    const secret = process.env.JWT_SECRET;

    if (!bearerToken) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Missing authorization token" // todo fix this message
                }
            });
    }

    const token = bearerToken.split(' ')[1];

    await jwt.verify(token, secret, (error, payload) => {
        if (error) {
            return res
                .status(401)
                .send({
                    "status": "fail",
                    "data": {
                        "authorization": "Invalid bearer token"
                    }
                });
        } else {
            req.userId = payload.user.id;
            req.username = payload.user.username;
            req.email = payload.user.email;
            req.admin = payload.user.admin;
        }
    });
    next();
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

    next();
}

module.exports = {
    verifyToken,
    wishValidation
}