const express = require("express");
const { verifyToken } = require("../middlewares/management.middleware");
const router = express.Router();

router.get("/", verifyToken, function (req, res) {
    return res
        .status(200)
        .send({
            "status": "success",
            "authorization": `Hi ${req.username}! You are authenticated and your user is: ${req.userId}`
        });
});

module.exports = router;