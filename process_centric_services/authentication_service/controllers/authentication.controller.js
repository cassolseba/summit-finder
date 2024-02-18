const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const signin = async (req, res) => {
    if(!req.body.username) {
        return res
            .status
            .send({
                "status": "fail",
                "data": {
                    "username": "A username is required to signin"
                }
            });
    }

    if (!req.body.password) {
        return res
            .status
            .send({
                "status": "fail",
                "data": {
                    "password": "A password is required to signin"
                }
            });
    }

    const port = process.env.USER_SERVICE_PORT;
    let username = req.body.username;
    let password = req.body.password;

    let url = `http://user_service:${port}/${username}`;

    await axios.get(url)
        .then((response) => {
            if (response.data.data) {
                bcrypt
                    .compare(password, response.data.data.password, function (error, result) {
                        if (error) {
                            return res
                                .status(500)
                                .send({
                                    "status": "error",
                                    "error": error
                                });
                        }

                        if (result) {
                            const secret = process.env.JWT_SECRET;

                            let data = response.data.data;

                            console.log(data.password)

                            const user = {
                                id: data._id,
                                username: data.username,
                                email: data.email,
                                admin: data.admin,
                                dt: new Date()
                            };

                            const token = "Bearer " + jwt.sign({ user }, secret, { expiresIn: "1000s"} );

                            return res
                                .status(200)
                                .send({
                                   "status": "success",
                                   "message": "Signed in successfully",
                                   "data": {
                                       "token": token
                                   }
                                });

                        } else {
                            return res
                                .status(400)
                                .send({
                                    "status": "fail",
                                    "data": {
                                        "password": "Password doesn't match"
                                    }
                                });
                        }
                    });
            }
        })
        .catch((error) => {
            return res
                .status(500)
                .send({
                    "status": "error",
                    "error": "Error while searching the user in user service" || error
                });
        });
}

const signup = async (req, res) => {
    const port = process.env.USER_SERVICE_PORT;
    let username = req.body.username;
    let name = req.body.name;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let admin = false;

    let url = `http://user_service:${port}/new`;

    await axios.post(url, {
        username: username,
        name: name,
        lastName: lastName,
        email: email,
        password: password,
        admin: admin
    }).then((response) => {
        if (response && response.data.status === "success") {
            return res
                .status(201)
                .send({
                    "status": "success",
                    "message": "Signed up successfully",
                    "data": {
                        "user": response.data
                    }
                });
        }
    }).catch((error) => {
       return res
           .status(500)
           .send({
               "status": "error",
              "error": `Error while creating the user in user service ${error}`
           });
    });
}

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
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegexp.test(req.body.email)) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "email": "A valid email address is required. Please verify your email"
                }
            })
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
    if (req.body.password.length < 8) {
        return res
            .status(400)
            .send({
                "status": "fail",
                "data": {
                    "password": "A password of at least 8 characters is required"
                }
            })
    }
    next();
}

module.exports = {
    userValidation,
    signin,
    signup
}