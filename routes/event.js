// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
    createEvent,
    getEvents,
    getEvent,
    toggleSubscribeEvent,
    updateEvent,
    deleteEvent,
    addNewUser,
    getAllUsersOfEvent,
    deleteUserFromEvent,
    isCafeOpen,
    toggleCafe,
    addUsersToEvent
} = require("../controllers/eventController");
const corsHeader = require("../middleware/corsHeaders");
const isAdminRole = require("../middleware/isAdminRole");

const router = express.Router();

router.use(corsHeader);
router.use(requireAuth);

// get events
router.get("/", getEvents);
// get exact event
router.get("/:id", getEvent);
// subscribe to the event
router.patch("/subscribe/:id", toggleSubscribeEvent);

router.use(isAdminRole);

// add all users to event
router.post("/:id/add-users", addUsersToEvent);
// is cafe open
router.get("/:id/cafe-open", isCafeOpen);
// toggle cafe
router.post("/:id/cafe-toggle", toggleCafe);
// add new user to event
router.patch("/:id/add-user", addNewUser);
// get all users of events
router.get("/:id/list", getAllUsersOfEvent);
// delete user from event
router.delete("/:id/delete-user/:user_id", deleteUserFromEvent);
// create new event
router.post("/create", createEvent);
// update event
router.patch("/update/:id", updateEvent);
// delete event
router.delete("/delete/:id", deleteEvent);

module.exports = router;
