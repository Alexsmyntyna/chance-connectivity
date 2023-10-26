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

// get exact event method
const getEvent = async (req, res) => {
    const { _id } = req.user;
    const event_id = req.params.id;

    try {
        const event = await Event.findOne({user_id: _id, _id: event_id}).select(["-__v"]);
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// create event method
const createEvent = async (req, res) => {
    const { event_name, country, start_date, end_date } = req.body;
    const { _id } = req.user;

    try {
        const event = await Event.createEvent(event_name, country, start_date, end_date, _id);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// update event method
const updateEvent = async (req, res) => {
    const { _id } = req.user;

    try {
        const event = await Event.updateEvent(req.params.id, _id, req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent
};