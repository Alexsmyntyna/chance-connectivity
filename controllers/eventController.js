// declare dependencies
const Event = require("../models/eventModel");

// get events method
const getEvents = async (req, res) => {
    const { _id } = req.user;

    try {
        const events = await Event.where({user_id: _id}).select(["-__v"]);
        res.status(200).json({events});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// create event method
const createEvent = async (req, res) => {
    const { eventName, country, startDate, endDate } = req.body;
    const { _id } = req.user;

    try {
        const event = await Event.createEvent(eventName, country, startDate, endDate, _id);
        res.status(200).json({event});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getEvents,
    createEvent
};