const express = require("express");
const { validation, tour } = require("../controllers/tour.controller");
const router = express.Router();

router.get('/', validation, tour);

module.exports = router;