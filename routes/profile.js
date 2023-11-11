// declare dependencies
const express = require("express");
const multer = require("multer");
const {
    getProfileByNFC,
    getProfile,
    editProfile,
    addImage,
    changePassword
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
// add image to profile
router.patch("/add-image", upload.single("profile_image"), addImage);
// change password
router.patch("/change-password", changePassword);

module.exports = router;