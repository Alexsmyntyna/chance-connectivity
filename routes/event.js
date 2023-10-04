// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createEvent, getEvents } = require("../controllers/eventController");

const router = express.Router();

router.use(requireAuth);

// get events
router.get("/", getEvents);
// create new event
router.post("/create", createEvent);

module.exports = router;
