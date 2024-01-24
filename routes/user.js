// declare dependencies
const express = require("express");
const {
    signupUser,
    signinUser,
    transferUsers,
    sendingMessages
} = require("../controllers/userController");
const corsHeader = require("../middleware/corsHeaders");

const router = express.Router();

// middleware
router.use(corsHeader);

// sign up
router.post("/signup", signupUser);
// login
router.post("/signin", signinUser);
// transfer users
router.post("/transfer", transferUsers);
// sending messages
router.post("/send", sendingMessages);

module.exports = router;