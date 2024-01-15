const mongoose = require("mongoose");
const User = require("./userModel");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    order_name: {
        type: String,
        required: true
    },
    order_number: {
        type: Number,
        required: true
    },
    order_price: {
        type: Number,
        required: false
    },
    status_payment: {
        type: String,
        required: true,
    },
    stripe_id: {
        type: String,
        required: false
    },
    client_secret: {
        type: String,
        required: false
    },
    is_complete: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

orderSchema.statics.createOrder = async function (user, order_name, order_price, stripe_id = "", client_secret = "") {
    const lastOrder = await this.find().sort("-createdAt").limit(1);
    let lastOrderNumber = lastOrder?.[0]?.order_number ?? 1;
    if (lastOrderNumber === undefined) {
        return "Order number not found";
    }
    const status_payment = (stripe_id != "" && client_secret != "") ? "pending" : "ok";
    const data = {
        user_id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        order_name,
        order_number: lastOrderNumber + 1,
        order_price,
        stripe_id,
        client_secret,
        status_payment,
    };
    let result = await this.create(data);
    result.stripe_id = "";
    return result;
}

module.exports = mongoose.model("Order", orderSchema);