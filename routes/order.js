// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
    createOrder,
    getOrders,
    completeOrder
} = require("../controllers/orderController");
const corsHeader = require("../middleware/corsHeaders");

const router = express.Router();

router.use(corsHeader);
router.use(requireAuth);

// create order
router.post("/create", createOrder);
// get orders
router.get("/", getOrders);
// complete corder
router.post("/complete/:id", completeOrder);

module.exports = router;