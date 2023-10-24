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
    },
    description: {
        type: String
    },
    capacity: {
        type: Number
    },
    ticket_start_sale_date: {
        type: Date
    },
    ticket_end_sale_date: {
        type: Date
    },
    ticket_price: {
        type: Number
    },
    ticket_currency: {
        type: String,
        enum: ["usdollar", "euro", "belrubles"]
    },
    age_min: {
        type: Number
    },
    age_max: {
        type: Number
    }
});

function validateFields(eventName, country, startDate, endDate, user_id) {
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

    return {
        startDate: startDate,
        endDate: endDate
    };
}

eventSchema.statics.createEvent = async function (eventName, country, startDate, endDate, user_id) {
    
    validateData = validateFields(eventName, country, startDate, endDate, user_id);

    const event = await this.create({ 
        event_name: eventName,
        country,
        start_date: validateData.startDate,
        end_date: validateData.endDate,
        user_id,
    });

    return event;
}

eventSchema.statics.updateEvent = async function (event_id, user_id, fields) {
    const filter = {_id: event_id, user_id};
    if(fields.ticket_currency && !["usdollar", "euro", "belrubles"].includes(fields.ticket_currency)){
        throw Error("Wrong currency");
    }
    await this.findOneAndUpdate(filter, fields);
    return await this.findOne(filter);
}

module.exports = mongoose.model("Event", eventSchema);