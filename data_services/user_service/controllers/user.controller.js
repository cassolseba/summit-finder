const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// get all users
const allUsers = (req, res) => {
    User
        .find()
        .then((result) => {
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "all users retrieved successfully",
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
        .findOne(_id)
        .then((result) => {
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "user retrieved successfully",
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
const newUser = (req, res) => {
    let username = String(req.body.username);
    let name = String(req.body.name);
    let lastName = String(req.body.lastName);
    let email = String(req.body.email);
    let password = String(req.body.password);
    let role = String(req.body.password);

    bcrypt.hash(password, 10, function (error, hash) {

        if (hash) {
            const user = new User({
                username: username,
                name: name,
                lastName: lastName,
                email: email,
                password: hash,
                role: role
            });

            user
                .save()
                .then(result => {
                    res
                        .status(201)
                        .send({
                            "status": "success",
                            "message": "new user created",
                            "data": {
                                "user": result
                            }
                        });
                }).catch(error => {
                res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": error
                    });
            })
        } else {
            res
                .status(500)
                .send({
                    "status": "error",
                    "error": error
                })
        }
    });
}

const updateUser = (req, res) => {
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

    let username = String(req.body.username);
    let name = String(req.body.name);
    let lastName = String(req.body.lastName);
    let email = String(req.body.email);
    let password = String(req.body.password);
    let role = String(req.body.password);

    bcrypt.hash(password, 10, function (error, hash) {

        if (hash) {
            const user = new User({
                username: username,
                name: name,
                lastName: lastName,
                email: email,
                password: hash,
                role: role
            });

            User
                .findByIdAndUpdate(_id, user)
                .then(result => {
                    res
                        .status(201)
                        .send({
                            "status": "success",
                            "message": "new user created",
                            "data": {
                                "user": result
                            }
                        });
                }).catch(error => {
                res
                    .status(500)
                    .send({
                        "status": "error",
                        "error": error
                    });
            })
        } else {
            res
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
        .deleteOne(_id)
        .then((result) => {
            return res
                .status(200)
                .send({
                    "status": "success",
                    "message": "user deleted successfully",
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
                    "message": "users deleted successfully",
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
    if (!req.params.username) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "username": "A username is required"
                }
            });
    }
    if (!req.params.name) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "name": "A name is required"
                }
            });
    }
    if (!req.params.lastName) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "lastName": "A last name is required"
                }
            });
    }
    if (!req.params.email) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "email": "An email is required"
                }
            });
    }
    if (!req.params.password) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "password": "A password is required"
                }
            });
    }
    if (!req.params.role) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "role": "A role is required"
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