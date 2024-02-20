const express = require("express");
const { validation, tour } = require("../controllers/tour.controller");
const router = express.Router();

router.get('/tour', validation, tour);

module.exports = router;