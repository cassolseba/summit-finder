const express = require("express");
const router = express.Router();
const { allUsers, findUser, newUser, userValidation, updateUser, deleteUser, deleteAll} = require("../controllers/user.controller")

// retrieve users
router.get(`/user/`, allUsers);
router.get('/user/:username', findUser);

// create and update users
router.post(`/user/new`, userValidation, newUser);
router.put('/user/:id', userValidation, updateUser);

// delete users
router.delete('/user', deleteAll);
router.delete('/user/:id', deleteUser);

module.exports = router;