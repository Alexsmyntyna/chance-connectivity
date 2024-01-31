const mongoose = require("mongoose");
const Users = require('../models/userModel'); // Adjust the path as necessary
const Events = require('../models/eventModel'); // Adjust the path as necessary

mongoose.connect('mongodb+srv://root:qx6eu2aQTLACV9xQ@chanceapp.pmswskt.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

const addUsersToEvent = async () => {
    try {
        const eventId = '65b6ee654543952a0f0011e3'; // Replace with the desired event ID

        const users = await Users.find({});
        const event = await Events.findById(eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        event.participant_ids = users.map(user => user._id);
        await event.save();

        console.log("Users added to event");
        console.log('Event:', event);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

addUsersToEvent();
