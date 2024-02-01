// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
    createOrder,
    getOrders,
    successPayment,
    completeOrder
} = require("../controllers/orderController");
const corsHeader = require("../middleware/corsHeaders");
const isAdminRole = require("../middleware/isAdminRole");

const router = express.Router();

router.use(corsHeader);

// success payment
router.post("/payment/success", successPayment);
router.use(requireAuth);
// create order
router.post("/create", createOrder);
router.use(isAdminRole);


// get orders
router.get("/", getOrders);
// complete corder
router.post("/complete/:id", completeOrder);

module.exports = router;