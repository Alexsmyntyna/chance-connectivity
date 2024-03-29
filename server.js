// declare dependencies
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const eventRoutes = require("./routes/event");
const orderRoutes = require("./routes/order");

const app = express();

// add base middleware
app.use(express.json());

// log network requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/order", orderRoutes);

// trying to connect to db & starting server
mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("connected to db\nlistening on port " + process.env.PORT);
        });
    })
    .catch((error) => {
        console.log("error is ", error)
    });

module.exports = app;