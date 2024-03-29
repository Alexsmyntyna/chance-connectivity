// declare dependencies
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mime = require('mime');
const postgres = require("../config/transfer");
const sendTelegramMessage = require("../services/sendMessage");

// create jwt token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: SignUp new user.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: first_name
 *         description: User's first name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: last_name
 *         description: User's last name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: role
 *         description: User's role ("leader", "participant").
 *         in: formData
 *         required: true
 *         type: string
 *       - name: city
 *         description: User's city.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: age
 *         description: User's age.
 *         in: formData
 *         required: true
 *         type: number
 *       - name: sex
 *         description: User's sex ("male", "female").
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful registration.
 *         content:
 *           application/json:
 *             example:
 *               email: user@example.com
 *               token: "your-auth-token"
 *       400:
 *         description: Registration error.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const signupUser = async (req, res) => {
    const { first_name, last_name, role, city, age, sex, email, password } = req.body;
    const profileImage = __dirname + "/../img/profilePic.png";

    try {
        const user = await User.signup(first_name, last_name, role, city, age, sex, email, password);
        const token = createToken(user._id);

        const buffer = fs.readFileSync(profileImage);
        const type = mime.getType(profileImage);
        const base64Data = buffer.toString('base64');
        const dataUri = `data:${type};base64,${base64Data}`;
        await User.findOneAndUpdate({ email }, { profile_image: dataUri });

        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: SignIn user.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's fpassword.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             example:
 *               email: user@example.com
 *               token: "your-auth-token"
 *       400:
 *         description: Wrong email/password.
 *         content:
 *           application/json:
 *             example:
 *               error: "You have an error"
 */
const signinUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const sendingMessages = async (req, res) => {

    const users = await User.find({ chat_id: { $ne: null } });

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const processItems = async () => {
        for (let i = 0; i < users.length; i++) {

            const login = users[i].login;
            const password = users[i].password_temp;

            const message = `Login - ${login}, password - ${password}`;

            sendTelegramMessage(message, users[i].chat_id)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error);
                });
            await delay(200);
        }
    };

    await processItems();

    res.status(200).json({ mssg: "Sending messages finished" });
}

const transferUsers = async (req, res) => {
    try {
        const result = await postgres.query('SELECT * FROM retreat_user WHERE camp_id=6 AND email IS NOT NULL;');
        const insert = await User.transferUsers(result.rows);
        res.status(200).json(insert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTokenByNFC = async(req, res) => {
    const { nfc_id } = req.body;
    console.log(`Request for NFC ID: ${nfc_id}`); // because knowing what you're looking for is half the battle

    try {
        console.log(`Searching for user with NFC ID: ${nfc_id}`); // anticipation, thrilling
        const user = await User.findOne({ nfc_id });
        if (user == null) {
            console.error(`User not found for NFC ID: ${nfc_id}`); // surprise, user doesn't exist
            res.status(400).json({ error: "user not found" });
            return; // stop! hammer time, because why continue
        }
        console.log(`User found: ${user.email}, preparing auth token...`); // excitement, a user exists
        const authToken = createToken(user._id);
        console.log(`Token created for user: ${user.email}`); // achievement, you did something right
        res.status(200).json({ email: user.email, authToken });
    } catch (error) {
        console.error(`Error fetching user with NFC ID: ${nfc_id}`, error); // drama, something broke
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    signupUser,
    signinUser,
    transferUsers,
    sendingMessages,
    getTokenByNFC
};