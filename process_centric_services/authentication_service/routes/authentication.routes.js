const express = require("express");
const { signin, signup, userValidation } = require("../controllers/authentication.controller");
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', userValidation, signup);

module.exports = router;