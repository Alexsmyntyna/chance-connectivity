// declare dependencies
const User = require("../models/userModel");
const validator = require("validator");

async function findUserById(userId) {
    return await User.findById(userId);
}

function cleanUserObject(user) {
    const cleanedUser = user.toObject();
    delete cleanedUser.password;
    delete cleanedUser.__v;
    return cleanedUser;
}

// get profile info
const getProfile = async (req, res) => {
    const user_id = req.user;

    try {
        const user = await User.findById(user_id).select(["-password", "-__v"]);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// edit profile
const editProfile = async (req, res) => {
    const user_id = req.user;
    try {
        await User.findOneAndUpdate(user_id, req.body);
        const data = await User.findById(user_id).select(["-password", "-__v"]);
        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// change password
const changePassword = async (req, res) => {
    const user_id = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await findUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await Bun.password.verify(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        const hash = await Bun.password.hash(newPassword, {
            algorithm: "bcrypt",
            cost: 10
        });
        user.password = hash;
        await user.save();

        res.status(200).json({ message: "Your password has been successfully changed!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    getProfile,
    editProfile,
    changePassword
};