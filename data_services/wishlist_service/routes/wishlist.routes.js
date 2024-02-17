const express = require("express");
const router = express.Router();
const { wishValidation, newWish} = require("../controllers/wishlist.controller");

router.post('/new', wishValidation, newWish);

module.exports = router;