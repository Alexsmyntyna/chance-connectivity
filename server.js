// declare dependencies
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");

require("dotenv").config();

const app = express();

// add base middleware
app.use(express.json());

// routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);

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