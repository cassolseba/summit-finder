const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// get all users
const allUsers = (req, res) => {
    User
        .find()
        .then((result) => {
            if (!result) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot find users"
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "All users retrieved successfully",
                    "data": result
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

// get one user by id
const findUser = (req, res) => {
    const username = String(req.params.username);

    if (!username) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "username": "A username is required"
                }
            });
    }

    let filter = { username: username };

    User
        .findOne(filter)
        .then((result) => {
            if (!result) {
                return res
                    .status(404)
                    .send({
                        "status": "error",
                        "error": "Cannot find user"
                    });
            }

            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "User retrieved successfully",
                    "data": result
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

// create a new user
const newUser = async (req, res) => {
    let username = String(req.body.username);
    let name = String(req.body.name);
    let lastName = String(req.body.lastName);
    let email = String(req.body.email);
    let password = String(req.body.password);
    let admin = String(req.body.admin) === "true";

    const filter = { username: username };

    let usernameAvailable = false;

    await User
        .findOne(filter)
        .then(result => {
            if (!result){
                usernameAvailable = true;
            } else {
                return res
                    .status(400)
                    .send({
                        "status": "fail",
                        "data": {
                            "username": "Username already in use"
                        }
                    });
            }
        }).catch((error) => {
        return res
            .status(500)
            .send({
                "status": "error",
                "error": "Internal error" || error
            });
    });

    if (usernameAvailable) {
        bcrypt.hash(password, 10, function (error, hash) {

            if (hash) {
                const user = new User({
                    username: username,
                    name: name,
                    lastName: lastName,
                    email: email,
                    password: hash,
                    admin: admin
                });

                user
                    .save()
                    .then(result => {
                        return res
                            .status(201)
                            .send({
                                "status": "success",
                                "message": "New user created",
                                "data": {
                                    "user": result
                                }
                            });
                    }).catch(error => {
                    return res
                        .status(500)
                        .send({
                            "status": "error",
                            "error": error
                        });
                })
            } else {
                return res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": error
                    })
            }
        });
    } else {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "username": "Username already in use"
                }
            });
    }
}

// todo fix update user
const updateUser = (req, res) => {
    const _id = String(req.params.id);

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

    let username = String(req.body.username);
    let name = String(req.body.name);
    let lastName = String(req.body.lastName);
    let email = String(req.body.email);
    let password = String(req.body.password);
    let admin = String(req.body.admin) === "true";

    bcrypt.hash(password, 10, function (error, hash) {

        if (hash) {
            const user = new User({
                username: username,
                name: name,
                lastName: lastName,
                email: email,
                password: hash,
                admin: admin
            });

            User
                .findByIdAndUpdate(_id, user, { useFindAndModify: false })
                .then(result => {
                    return res
                        .status(201)
                        .send({
                            "status": "success",
                            "message": "New user created",
                            "data": {
                                "user": result
                            }
                        });
                }).catch(error => {
                    return res
                        .status(500)
                        .send({
                            "status": "error",
                            "error": error
                        });
            })
        } else {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                })
        }
    });
}

// delete a user
const deleteUser = (req, res) => {
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

    User
        .findByIdAndDelete(_id)
        .then((result) => {
            if (!result) {
                return res
                    .status(404)
                    .send({
                        "status": "fail",
                        "data": {
                            "id": "User doesn't exist"
                        }
                    })
            }
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "User deleted successfully",
                    "data": {
                        "user": result
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

// delete all users
const deleteAll = (req, res) => {
    User
        .deleteMany()
        .then((result) => {
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "Users deleted successfully",
                    "data": result
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

// validate user parameters
const userValidation = (req, res, next) => {
    if (!req.body.username) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "username": "A username is required"
                }
            });
    }
    if (!req.body.name) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "name": "A name is required"
                }
            });
    }
    if (!req.body.lastName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lastName": "A last name is required"
                }
            });
    }
    if (!req.body.email) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "email": "An email is required"
                }
            });
    }
    if (!req.body.password) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "password": "A password is required"
                }
            });
    }
    next();
}

module.exports = {
    allUsers,
    findUser,
    newUser,
    updateUser,
    userValidation,
    deleteUser,
    deleteAll
}