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
    is_complete: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

orderSchema.statics.createOrder = async function (user_id, order_name) {
    const userObj = await User.findById(user_id);
    const data = {
        user_id,
        first_name: userObj.first_name,
        last_name: userObj.last_name,
        order_name,
    };
    return await this.create(data);
}

module.exports = mongoose.model("Order", orderSchema);