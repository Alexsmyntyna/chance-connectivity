// declare dependencies
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

/**
 * @swagger
 * /api/order/create:
 *   post:
 *     summary: Create new Order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: order_name
 *         description: Order name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Order price.
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful order creation.
 *         content:
 *           application/json:
 *             example:
 *                 order:
 *                    - _id: "your-unique-user-id"
 *                      first_name: "TestUser"
 *                      last_name: "TestUser"
 *                      order_name: "Your Order"
 *                      is_complete: "false"
 *                      createdAt: "2023-12-28T16:14:56.594Z"
 *                      updatedAt: "2023-12-28T16:14:56.594Z"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const createOrder = async (req, res) => {
    const user_id = req.user._id;
    const { order_name, amount } = req.body;

    try {
        const user = await User.findById(user_id);

        let stripe_id = "";
        let client_secret = "";
        let change = 0;
        let paymentIntentStatus = "";

        if (user.balance >= amount) {
            user.balance -= amount;
            await user.save();
        } else {
            change = amount - user.balance;
            const paymentCreate = await stripe.paymentIntents.create({
                amount: change,
                currency: 'usd',
                payment_method_types: ['cashapp'],
            });
            stripe_id = paymentCreate.id;
            client_secret = paymentCreate.client_secret;
        }

        const order = await Order.createOrder(user, order_name, change, stripe_id, client_secret);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get list of orders.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: order_name
 *         description: Order name.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful order creation.
 *         content:
 *           application/json:
 *             example:
 *                 orders:
 *                    - _id: "your-unique-user-id"
 *                      first_name: "TestUser"
 *                      last_name: "TestUser"
 *                      order_name: "Your Order"
 *                      is_complete: "false"
 *                      createdAt: "2023-12-28T16:14:56.594Z"
 *                      updatedAt: "2023-12-28T16:14:56.594Z"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const getOrders = async (req, res) => {
    try {
        const orders = await Order.where({ is_complete: false, status_payment: "ok" }).sort('+updatedAt');
        const sanitizedOrders = orders.map(order => {
            const { stripe_id, ...sanitizedOrder } = order.toObject(); // Assuming Mongoose model, adjust accordingly
            return sanitizedOrder;
        });
        res.status(200).json({ sanitizedOrders });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * @swagger
 * /api/order/payment/success:
 *   post:
 *     summary: Payment has been successfully done.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: stripe_id
 *         description: Stripe id.
 *         in: body
 *         required: true
 *         type: string
 *       - name: client_secret
 *         description: Client secret.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful order creation.
 *         content:
 *           application/json:
 *             example:
 *               mssg: "Order `Your order name` completed"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const successPayment = async (req, res) => {
    const { stripe_id, client_secret } = req.body;

    try {

        const paymentIntent = await stripe.paymentIntents.retrieve(stripe_id);
        paymentIntentStatus = paymentIntent.status;
        if(paymentIntentStatus != "succeeded") {
            res.status(400).json({ error: "Your payment failed" });
        }

        const order = await Order.findOne({ stripe_id, client_secret });
        order.status_payment = "ok";
        await order.save();

        const user = await User.findById(order.user_id);
        user.balance = 0;
        await user.save();

        order.stripe_id = "";
        res.status(200).json(order);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * @swagger
 * /api/order/complete/{id}:
 *   post:
 *     summary: Complete order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: id
 *         description: Order id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful order creation.
 *         content:
 *           application/json:
 *             example:
 *               mssg: "Order `Your order name` completed"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const completeOrder = async (req, res) => {
    const order_id = req.params.id;

    try {
        const order = await Order.findById(order_id);
        let message;
        if (order.is_complete) {
            message = "Order `" + order.order_name + "` has already been completed";
        } else {
            order.is_complete = true;
            await order.save();
            message = "Order `" + order.order_name + "` completed";
        }
        res.status(200).json({ mssg: message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createOrder,
    getOrders,
    successPayment,
    completeOrder
};