// declare dependencies
const express = require("express");
const {
    signupUser,
    signinUser
} = require("../controllers/userController");
const corsHeader = require("../middleware/corsHeaders");

const router = express.Router();

// middleware
router.use(corsHeader);

// sign up
router.post("/signup", signupUser);
// login
router.post("/signin", signinUser);

module.exports = router;