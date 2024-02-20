const express = require("express");
const { signin, signup, userValidation } = require("../controllers/authentication.controller");
const router = express.Router();

router.post('/auth/signin', signin);
router.post('/auth/signup', userValidation, signup);

module.exports = router;