// declare dependencies
const express = require("express");
const {
    signupUser,
    loginUser
} = require("../controllers/userController");

const router = express.Router();

// sign up
router.post('/signup', signupUser);

// login
router.post('/login', loginUser);

// profile
router.get('/profile', (res, req) => {
    res.json({mssg:"profile"});
});

module.exports = router;