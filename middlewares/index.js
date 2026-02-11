const User = require("../models/usersModel");
const { EMAIL_REQUIRED, USER_EXISTS } = require('../messages/message');
const path = require("path");
const fs = require("fs");

async function checkUserExistsByEmail(req, res, next) {
    const { email } = req.body;

    if (!email?.trim()) {
        return res.status(400).json({ error: EMAIL_REQUIRED });
    }

    const user = await User.findOne({ email: email.trim() });
    if (user) {
        // Delete the uploaded file if it was saved
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted orphan file: ${req.file.filename}`);
                }
            } catch (err) {
                console.error("Failed to delete file:", err);
            }
        }
        return res.status(409).json({ error: USER_EXISTS });
    }

    next();
}

module.exports = {
    checkUserExistsByEmail
};
