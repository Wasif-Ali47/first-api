const User = require("../models/usersModel");
const { EMAIL_REQUIRED, USER_EXISTS } = require('../messages/message');

async function checkUserExistsByEmail(req, res, next) {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: EMAIL_REQUIRED });

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error : USER_EXISTS });

    next();
}

module.exports = {
    checkUserExistsByEmail
};
