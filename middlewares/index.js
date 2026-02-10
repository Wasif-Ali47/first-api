// const fs = require('fs');
// const path = require('path');
const User = require("../models/usersModel");
const { EMAIL_REQUIRED, USER_EXISTS } = require('../messages/message');

// function logReqRes(fileName = 'logs/userLogs/logs.txt') {
//     const logPath = path.resolve(fileName);

//     return (req, res, next) => {
//         const now = new Date();
//         const date = now.toISOString().slice(0, 10);
//         const time = now.toLocaleTimeString('en-US', { hour12: true });

//         const logEntry = `=================================\nDate: ${date}\nTime: ${time}\nRequest Method: ${req.method} \nRequest Path: ${req.url}\n=================================\n`;

//         fs.mkdirSync(path.dirname(logPath), { recursive: true });
//         fs.appendFileSync(logPath, logEntry, 'utf8');

//         next();
//     }
// }


async function checkUserExistsByEmail(req, res, next) {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: EMAIL_REQUIRED });

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error : USER_EXISTS });

    next();
}

module.exports = {
    checkUserExistsByEmail,
    logReqRes
};
