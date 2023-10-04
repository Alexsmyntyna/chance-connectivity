const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    event_name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

eventSchema.statics.createEvent = async function (eventName, country, startDate, endDate, user_id) {
    if (!eventName || !country || !startDate || !endDate || !user_id) {
        throw Error("All fields must be filled");
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (!validator.isDate(startDate) && !validator.isDate(endDate)) {
        throw Error("Date should be in format 2023-10-01T21:00:00.000+00:00");
    }
    if (startDate >= endDate) {
        throw Error("End Date should be after Start Date");
    }

    const event = await this.create({ 
        event_name: eventName,
        country,
        start_date: startDate,
        end_date: endDate,
        user_id
    });

    return event;
}

module.exports = mongoose.model("Event", eventSchema);