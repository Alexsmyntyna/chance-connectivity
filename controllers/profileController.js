// declare dependencies
const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
        const user = await User.findById({ user_id }).select(["-password", "-__v"]);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// edit profile
const editProfile = async (req, res) => {
    const user_id = req.user;
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({ error: "All fields must be filled" });
    }

    try {
        const user = await findUserById(user_id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (email && email !== user.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: "Email is not valid" });
            }
            
            const exists = await User.findOne({ email });

            if (exists) {
                return res.status(400).json({ error: "Email already in use" });
            }
        }
        
        user.first_name = firstName;
        user.last_name = lastName;
        user.email = email;
        await user.save();

        const updatedUser = cleanUserObject(user);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        user.password = hash;
        await user.save();

        const updatedUser = cleanUserObject(user);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    getProfile,
    editProfile,
    changePassword
};