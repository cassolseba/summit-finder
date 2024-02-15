const express = require("express");
const router = express.Router();
const { allUsers, findUser, newUser, userValidation, updateUser, deleteUser, deleteAll} = require("../controllers/user.controller")

// retrieve users
router.get(`/`, allUsers);
router.get('/:id', findUser);

// create and update users
router.post(`/new`, userValidation, newUser);
router.put('/:id', userValidation, updateUser);

// delete users
router.delete('/', deleteAll);
router.delete('/:id', deleteUser);

module.exports = router;