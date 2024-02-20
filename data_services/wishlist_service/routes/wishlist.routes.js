const express = require("express");
const router = express.Router();
const { wishValidation, newWish, wishlist, allWishlists, deleteAll, deleteWish, deleteWishlist, wish} = require("../controllers/wishlist.controller");

// retrieve wishes
router.get('/wishlist', allWishlists);
router.get('/wish/:id', wish);
router.get('/wishlist/:userId', wishlist);

// create a new wish
router.post('/wish/new', wishValidation, newWish);

// delete wishes and wishlists
router.delete('/wish/:id', deleteWish);
router.delete('/wishlist/:userId', deleteWishlist);
router.delete('/wishlist', deleteAll);

module.exports = router;