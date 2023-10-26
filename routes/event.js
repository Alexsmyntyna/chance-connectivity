// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createEvent, getEvents, getEvent, updateEvent } = require("../controllers/eventController");

const router = express.Router();

router.use(requireAuth);

// get events
router.get("/", getEvents);
// get exact event
router.get("/:id", getEvent);
// create new event
router.post("/create", createEvent);
// update event
router.patch("/update/:id", updateEvent);

module.exports = router;
