const axios = require("axios");

const addWish = async (req, res) => {
    if (!req.userId) {
       return res
           .status(401)
           .send({
               "status": "fail",
               "data": {
                   "authorization": "Unauthorized access. User not authenticated"
               }
           });
    }

    let userId = String(req.userId);

    let originLat = req.body.originLat;
    let originLon = req.body.originLon;
    let originName = req.body.originName;
    let destinationLat = req.body.destinationLat;
    let destinationLon = req.body.destinationLon;
    let destinationName = req.body.destinationName;
    let huts = req.body.huts;
    let peaks = req.body.peaks;

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/new`;

    await axios.post(url, {
        originLat: originLat,
        originLon: originLon,
        originName: originName,
        destinationLat: destinationLat,
        destinationLon: destinationLon,
        destinationName: destinationName,
        huts: huts,
        peaks: peaks,
        userId: userId
    }).then((response) => {
        if (response && response.data.status === "success") {
            return res
                .status(201)
                .send({
                    "status": "success",
                    "message": "Wish added successfully",
                    "data": {
                        "wish": response.data
                    }
                });
        }
    }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": `Error while adding the wish in wishlist service: ${error}`
            })
    });
}

const findWishlist = async (req, res) => {
    if (!req.userId) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Unauthorized access. User not authenticated"
                }
            });
    }

    let userId = String(req.userId);

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/${userId}`;

    await axios.get(url)
        .then((response) => {
            if (response && response.data.status === "success") {
                return res
                    .status(201)
                    .send({
                        "status": "success",
                        "message": "Wishlist successfully retrieved",
                        "data": {
                            "wish": response.data
                        }
                    });
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while retrieving the wishlist in wishlist service: ${error}`
                });
        });
}

const findAllWishlists = async (req, res) => {
    if (!req.admin) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Access denied. You are not authorized to access this method"
                }
            });
    }

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/`;

    await axios.get(url)
        .then((response) => {
            if (response && response.data.status === "success") {
                return res
                    .status(201)
                    .send({
                        "status": "success",
                        "message": "All wishlists successfully retrieved",
                        "data": {
                            "wish": response.data
                        }
                    });
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while retrieving all wishlists in wishlist service: ${error}`
                });
        });
}

const removeWish = async (req, res) => {
    if (!req.userId) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Unauthorized access. User not authenticated"
                }
            });
    }
    const userId = String(req.userId);

    if (!req.params.id) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "id": "A valid wish object id is required"
                }
            });
    }
    const _id = String(req.params.id);

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/${_id}`;

    let storedId;

    await axios.get(url)
        .then((response) => {
            if (response && response.data.status === "success") {
                storedId = response.data.data.userId;
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                   "status": "error",
                   "error": `Error while searching the wish in wishlist service: ${error}`
                });
        });

    if (userId === storedId || req.admin) {
        let url = `http://wishlist_service:${port}/${_id}`;

        await axios.delete(url)
            .then((response) => {
                if (response && response.data.status === "success") {
                    return res
                        .status(201)
                        .send({
                            "status": "success",
                            "message": "Wish deleted successfully",
                            "data": {
                                "wish": response.data
                            }
                        });
                }
            }).catch((error) => {
                return res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": `Error while removing the wish in wishlist service: ${error}`
                    });
            });
    } else {
        return res
            .status(500)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "You are not authorized to delete this wish"
                }
            });
    }
}

const removeWishlist = async (req, res) => {
    if (!req.userId) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Unauthorized access. User not authenticated"
                }
            });
    }

    let userId = String(req.userId);

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/wishlist/${userId}`;

    await axios.delete(url)
        .then((response) => {
            if (response && response.data.status === "success") {
                return res
                    .status(201)
                    .send({
                        "status": "success",
                        "message": "Wishlist deleted successfully",
                        "data": {
                            "wish": response.data
                        }
                    });
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while removing the wishlist in wishlist service: ${error}`
                });
        });
}

const removeAllWishlists = async (req, res) => {
    if (!req.admin) {
        return res
            .status(401)
            .send({
                "status": "fail",
                "data": {
                    "authorization": "Access denied. You are not authorized to access this method"
                }
            });
    }

    let port = process.env.WISHLIST_SERVICE_PORT;
    let url = `http://wishlist_service:${port}/`;

    await axios.delete(url)
        .then((response) => {
            if (response && response.data.status === "success") {
                return res
                    .status(201)
                    .send({
                        "status": "success",
                        "message": "All wishlists deleted successfully",
                        "data": {
                            "wish": response.data
                        }
                    });
            }
        }).catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": `Error while removing all wishlists in wishlist service: ${error}`
                });
        });
}

module.exports = {
    addWish,
    findWishlist,
    findAllWishlists,
    removeWish,
    removeWishlist,
    removeAllWishlists
}