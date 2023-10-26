// declare dependencies
const Event = require("../models/eventModel");
const User = require("../models/userModel");

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

// delete event method
const deleteEvent = async (req, res) => {
    const user_id = req.user._id;

    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, user_id });
        if (!event) {
            res.status(200).json({ message: "Your event has already removed or event_id is wrong"});
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// add new user to event method
const addNewUser = async (req, res) => {
    const user_id = req.user._id;
    const { first_name, last_name, role, city, age, sex, email, password } = req.body;

    try {
        const event = await Event.findOne({ _id: req.params.id, user_id });
        if (event) {
            const newUser = await User.signup(first_name, last_name, role, city, age, sex, email, password);

            newUser.event_ids.push(req.params.id);
            event.participant_ids.push(newUser._id);

            await event.save();
            await newUser.save();
            res.status(200).json(event);
        }
        res.status(404).json({ message: "Event has not found" });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// get all users of event
const getAllUsersOfEvent = async (req, res) => {
    const user_id = req.user._id;

    try {
        const event = await Event.findOne({ _id: req.params.id, user_id });

        if (event) {
            const usersList = await User.find({ _id: { $in: event.participant_ids } });
            res.status(200).json({ usersList });
        }
        res.status(404).json({ message: "Event has not found" });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// delete new user from event method
const deleteUserFromEvent = async (req, res) => {
    const leader_id = req.user._id;
    const delete_user_id = req.params.user_id;

    try {
        const event = await Event.findOne({ _id: req.params.id, user_id: leader_id });

        if (event) {
            const indexOfUser = event.participant_ids.indexOf(delete_user_id);
            if (indexOfUser != -1) {
                event.participant_ids.splice(indexOfUser, 1);
                await event.save();
            }
            res.status(200).json(event);
        }
        res.status(404).json({ message: "Event has not found" });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    addNewUser,
    getAllUsersOfEvent,
    deleteUserFromEvent
};