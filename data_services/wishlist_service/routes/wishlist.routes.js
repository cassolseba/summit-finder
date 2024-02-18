const express = require("express");
const router = express.Router();
const { wishValidation, newWish, wishlist, allWishlists, deleteAll, deleteWish, deleteWishlist, wish} = require("../controllers/wishlist.controller");

// retrieve wishes
router.get('/', allWishlists);
router.get('/:id', wish);
router.get('/wishlist/:userId', wishlist);

// create a new wish
router.post('/new', wishValidation, newWish);

// delete wishes and wishlists
router.delete('/:id', deleteWish);
router.delete('/wishlist/:userId', deleteWishlist);
router.delete('/', deleteAll);

module.exports = router;