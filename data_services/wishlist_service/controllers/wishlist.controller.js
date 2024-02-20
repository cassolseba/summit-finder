const Wish = require("../models/wish.model");
const mongoose = require("mongoose");

const newWish = (req, res) => {
    let originLat = req.body.originLat;
    let originLon = req.body.originLon;
    let originName = req.body.originName;
    let destinationLat = req.body.destinationLat;
    let destinationLon = req.body.destinationLon;
    let destinationName = req.body.destinationName;
    let huts = req.body.huts;
    let peaks = req.body.peaks;
    let userId = req.body.userId;

    const wish = new Wish({
        originLat: originLat,
        originLon: originLon,
        originName: originName,
        destinationLat: destinationLat,
        destinationLon: destinationLon,
        destinationName: destinationName,
        huts: huts,
        peaks: peaks,
        userId: userId
    });

    wish
        .save()
        .then((result) => {
            res
                .status(201)
                .send({
                    "status": "success",
                    "message": "Added successfully to the wishlist",
                    "data": {
                        "wish": result
                    }
                });
        })
        .catch((error) => {
            res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const wish = (req, res) => {
    if (!req.params.id) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "id": "An object id is required"
                }
            });
    }

    const _id = String(req.params.id);

    Wish
        .findById(_id)
        .then((result) => {
            if (!result) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot retrieve the wish"
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Wish retrieved successfully",
                    "data": {
                        "wish": result
                    }
                });
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while searching in db: ${error}`
                });
        });
}

const wishlist = (req, res) => {
    if(!req.params.userId) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "userId": "A userId is required"
                }
            });
    }

    const userId = String(req.params.userId);

    let filter = { userId: userId };

    Wish
        .find(filter)
        .then((result) => {
            if (!result) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot retrieve the wishlist of this user"
                    });
            }
            
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Wishlist retrieved successfully",
                    "data": {
                        "wishlist": result
                    }
                });
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const allWishlists = (req, res) => {
    Wish
        .find()
        .then((result) => {
            if(!result) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot find any wishlist"
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "All wishlists retrieved successfully",
                    "data": {
                        "wishlists": result
                    }
                });

        })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const deleteWish = (req, res) => {
    const _id = req.params.id;

    if (!_id) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "id": "An object id is required"
                }
            });
    }

    Wish
        .findByIdAndDelete(_id)
        .then((result) => {
            if (!result) {
                return res
                    .status(400)
                    .send({
                        "status": "fail",
                        "data": {
                            "id": "Wish doesn't exist"
                        }
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Wish deleted successfully",
                    "data": {
                        "wish": result
                    }
                });
        })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const deleteWishlist = (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "username": "A username is required"
                }
            });
    }

    let filter = { userId: userId };

    Wish
    .deleteMany(filter)
        .then((result) => {
            if (result.deletedCount === 0) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot find wishlist"
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Wishlists deleted successfully",
                    "data": result
                });
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
        });
}

const deleteAll = (req, res) => {
    Wish
        .deleteMany()
        .then((result) => {
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Wishlists deleted successfully",
                    "data": result
                });
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                });
    });
}

const wishValidation = (req, res, next) => {
    if (!req.body.originLat) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin is required"
                }
            });
    }

    if (isNaN(req.body.originLat)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin must be a decimal number"
                }
            });
    }

    if (req.body.originLat > 180 || req.body.originLat < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLat": "The latitude of the origin must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.originLon) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin is required"
                }
            });
    }

    if (isNaN(req.body.originLon)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin must be a decimal number"
                }
            });
    }

    if (req.body.originLon > 180 || req.body.originLon < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originLon": "The longitude of the origin must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.originName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "originName": "The name of the origin is required"
                }
            });
    }

    if (!req.body.destinationLat) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination is required"
                }
            });
    }

    if (isNaN(req.body.destinationLat)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination must be a decimal number"
                }
            });
    }

    if (req.body.destinationLat > 180 || req.body.destinationLat < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLat": "The latitude of the destination must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.destinationLon) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination is required"
                }
            });
    }

    if (isNaN(req.body.destinationLon)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination must be a decimal number"
                }
            });
    }

    if (req.body.destinationLon > 180 || req.body.destinationLon < -180) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationLon": "The longitude of the destination must be a decimal number between 180 and -180"
                }
            });
    }

    if (!req.body.destinationName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "destinationName": "The name of the destination is required"
                }
            });
    }

    if (!req.body.userId) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "userId": "The user object id is required"
                }
            });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "userId": "A valid user object id is required"
                }
            });
    }

    next();
}

module.exports = {
    wishValidation,
    newWish,
    wish,
    wishlist,
    allWishlists,
    deleteAll,
    deleteWishlist,
    deleteWish
}