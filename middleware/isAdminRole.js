const User = require("../models/userModel");

const isAdminRole = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.role != 'leader') {
        return res.status(403).json({ mssg: "You are not leader" });
    }
    next();
}
module.exports = isAdminRole;