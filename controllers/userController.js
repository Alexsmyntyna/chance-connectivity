// declare dependencies
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// create jwt token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// sign up user method
const signupUser = async (req, res) => {
    const { firstName, lastName, role, email, password } = req.body;

    try {
        const user = await User.signup(firstName, lastName, role, email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// login user method
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    signupUser,
    loginUser
};