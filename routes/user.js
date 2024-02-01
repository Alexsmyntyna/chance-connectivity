// declare dependencies
const express = require("express");
const {
    signupUser,
    signinUser,
    transferUsers,
    sendingMessages,
    getTokenByNFC
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
// get token by nfc_id
router.post("/get-token", getTokenByNFC);

module.exports = router;