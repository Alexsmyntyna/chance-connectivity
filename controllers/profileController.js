// declare dependencies
const User = require("../models/userModel");

async function findUserById(userId) {
    return await User.findById(userId);
}

function cleanUserObject(user) {
    const cleanedUser = user.toObject();
    delete cleanedUser.password;
    delete cleanedUser.__v;
    return cleanedUser;
}

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

/**
 * @swagger
 * /api/profile/add-nfc:
 *   get:
 *     summary: Add NFC to the user.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: nfc_id
 *         description: ID of NFC bracelet or card.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: NFC id successfully added to user.
 *         content:
 *           application/json:
 *             example:
 *               _id: "your-unique-user-id"
 *               first_name: "TestUser"
 *               last_name: "TestUser"
 *               role: "leader"
 *               city: "USA"
 *               age: 20
 *               sex: "male"
 *               email: "test@test.com"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const addNFCIdToUser = async (req, res) => {
    const user_id = req.body.userId;
    const nfc_id = req.body.nfc_id;

    try {
        const user = await User.findById({_id: user_id});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.nfc_id !== nfc_id) {
            await User.findOneAndUpdate({ nfc_id }, { nfc_id: generateString(6) });

            user.nfc_id = nfc_id;
            await user.save();

        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user by nfc id.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: nfc_id
 *         description: ID of NFC bracelet or card.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful receipt of user profile.
 *         content:
 *           application/json:
 *             example:
 *               _id: "your-unique-user-id"
 *               first_name: "TestUser"
 *               last_name: "TestUser"
 *               role: "leader"
 *               city: "USA"
 *               age: 20
 *               sex: "male"
 *               email: "test@test.com"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const getProfileByNFC = async (req, res) => {
    const { nfc_id } = req.body;
    if(nfc_id === undefined) {
        res.status(400).json({ error: "NFC_ID is not defined" });
    }
    try {
        const user = await User.findOne({ nfc_id: nfc_id }).select(["-password", "-__v"]);
        if(user == null) {
            res.status(400).json({ error: "user not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get authorized user profile.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful receipt of authorized user profile.
 *         content:
 *           application/json:
 *             example:
 *               _id: "your-unique-user-id"
 *               first_name: "TestUser"
 *               last_name: "TestUser"
 *               role: "leader"
 *               city: "USA"
 *               age: 20
 *               sex: "male"
 *               email: "test@test.com"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const getProfile = async (req, res) => {
    const user_id = req.user;

    try {
        const user = await User.findById(user_id).select(["-password", "-__v"]);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/profile/edit:
 *   patch:
 *     summary: Edit authorized user information.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: first_name
 *         description: User's first name.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: last_name
 *         description: User's last name.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: role
 *         description: User's role ("leader", "participant").
 *         in: formData
 *         required: false
 *         type: string
 *       - name: city
 *         description: User's city.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: age
 *         description: User's age.
 *         in: formData
 *         required: false
 *         type: number
 *       - name: sex
 *         description: User's sex ("male", "female").
 *         in: formData
 *         required: false
 *         type: string
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successful receipt of authorized user profile.
 *         content:
 *           application/json:
 *             example:
 *               _id: "your-unique-user-id"
 *               first_name: "TestUser"
 *               last_name: "TestUser"
 *               role: "leader"
 *               city: "New York"
 *               age: 20
 *               sex: "male"
 *               email: "test@test.com"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const editProfile = async (req, res) => {
    const user_id = req.user;
    try {
        await User.findOneAndUpdate(user_id, req.body);
        const data = await User.findById(user_id).select(["-password", "-__v"]);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

/**
 * @swagger
 * /api/profile/add-image:
 *   patch:
 *     summary: Add image profile to the authorized user.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: profile_image
 *         description: Image of profile.
 *         in: formData
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Successful addition of an image.
 *         content:
 *           application/json:
 *             example:
 *               _id: "your-unique-user-id"
 *               first_name: "TestUser"
 *               last_name: "TestUser"
 *               role: "leader"
 *               city: "New York"
 *               age: 20
 *               sex: "male"
 *               email: "test@test.com"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const addImage = async (req, res) => {
    const user_id = req.user;

    try {
        const uploadedFile = req.file;

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const base64Data = uploadedFile.buffer.toString('base64');
        const dataUri = `data:${uploadedFile.mimetype};base64,${base64Data}`;

        await User.findOneAndUpdate(user_id, { profile_image: dataUri });
        const data = await User.findById(user_id).select(["-password", "-__v"]);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * @swagger
 * /api/profile/change-password:
 *   patch:
 *     summary: Change authorized user password.
 *     tags:
 *       - Profile
 *     parameters:
 *       - name: Authorization
 *         description: Authorization bearer token (Bearer your-token).
 *         in: header
 *         required: true
 *         type: string
 *       - name: old_password
 *         description: Old user's password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: new_password
 *         description: New user's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Your password has been successfully changed!"
 *       400:
 *         description: Incorrect old password / Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "Incorrect old password"
 *       404:
 *          description: User not found.
 *          content:
 *            application/json:
 *              example:
 *                error: "User not found"
 */
const changePassword = async (req, res) => {
    const user_id = req.user;
    const { old_password, new_password } = req.body;

    try {
        const user = await findUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await Bun.password.verify(old_password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        const hash = await Bun.password.hash(new_password, {
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

/**
 * @swagger
 * /api/profile/update-balance:
 *   post:
 *     summary: Update balances of all users to 1000 (cents).
 *     tags:
 *       - Profile
 *     parameters:
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Your password has been successfully changed!"
 *       400:
 *         description: Something went wrong.
 *         content:
 *           application/json:
 *             example:
 *               error: "Something went wrong"
 */
const updateBalance = async (req, res) => {
    try {
        const userList = await User.updateBalance();
        res.status(200).json(userList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getProfileByNFC,
    addNFCIdToUser,
    getProfile,
    editProfile,
    addImage,
    changePassword,
    updateBalance
};