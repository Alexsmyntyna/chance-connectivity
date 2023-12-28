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
    const order_name = req.body.order_name;
    const amount = req.body.amount;

    try {
        const user = await User.findById(user_id);
        let paymentIntent = {};
        if (user.balance >= amount) {
            user.balance -= amount;
            await user.save();
        } else {
            const change = amount - user.balance;
            paymentIntent = await stripe.paymentIntents.create({
                amount: change * 100,
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
        }
        
        const order = await Order.createOrder(user_id, order_name);
        res.status(201).json({ order, stripePayment: paymentIntent });
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
        const orders = await Order.where({ is_complete: false }).sort('+createdAt');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * @swagger
 * /api/order/complete/{id}:
 *   post:
 *     summary: Compl.
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
    completeOrder
};