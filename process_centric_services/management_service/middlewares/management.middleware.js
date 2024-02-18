const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    let bearerToken = req.headers['authorization'];
    console.log(`Received token: ${bearerToken}`);

    const secret = process.env.JWT_SECRET;
    console.log(`Loaded secret: ${secret}`);

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
        }
    });
    next();
}

module.exports = {
    verifyToken
}