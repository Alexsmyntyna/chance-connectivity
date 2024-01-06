// declare dependencies
const express = require("express");
const multer = require("multer");
const {
    getProfileByNFC,
    getProfile,
    addNFCIdToUser,
    editProfile,
    addImage,
    changePassword,
    updateBalance
} = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");
const corsHeader = require("../middleware/corsHeaders");

const router = express.Router();
const upload = multer();

// middleware
router.use(corsHeader);

router.post("/", getProfileByNFC);

router.use(requireAuth);

// profile info
router.get("/", getProfile);
// edit profile
router.patch("/edit", editProfile);
// add nfc to the user
router.patch("/add-nfc", addNFCIdToUser);
// add image to profile
router.patch("/add-image", upload.single("profile_image"), addImage);
// change password
router.patch("/change-password", changePassword);
// update balance
router.post("/update-balance/:amount", updateBalance);

module.exports = router;