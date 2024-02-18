const express = require("express");
const { verifyToken, wishValidation} = require("../middlewares/management.middleware");
const { addWish, findWishlist, findAllWishlists, removeWish, removeWishlist, removeAllWishlists} = require("../controllers/management.controller");
const router = express.Router();

// test route
router.get("/", verifyToken, function (req, res) {
    if (req.admin) {
        return res
            .status(200)
            .send({
                "status": "success",
                "authorization": `Hi ${req.username}! You are an admin and you are authenticated with your user id: ${req.userId}`
            });
    }

    return res
        .status(200)
        .send({
            "status": "success",
            "authorization": `Hi ${req.username}! You are authenticated and your user is: ${req.userId}`
        });
});

// get a wish or a user wishlist
router.get('/wishlist/all', verifyToken, findAllWishlists);
router.get('/wishlist', verifyToken, findWishlist);

// add a new wish to the user wishlist
router.post('/wish', verifyToken, wishValidation, addWish);

// delete a wish or a user wishlist
router.delete('/wish/:id', verifyToken, removeWish);
router.delete('/wishlist', verifyToken, removeWishlist);
router.delete('/wishlist/all', verifyToken, removeAllWishlists);

module.exports = router;