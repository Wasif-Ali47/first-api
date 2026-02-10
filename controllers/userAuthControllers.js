const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const { NETWORK_ERROR, USER_EXISTS, SIGNED_UP, SIGN_UP_FAILED, USER_NOT_FOUND, WRONG_PASSWORD, LOGGED_IN } = require("../messages/message");

// SIGN UP
async function handleUserSignUp(req, res) {
  try {
    const { name, email, profession, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: USER_EXISTS });

    const hashed = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      email,
      profession: profession ?? undefined,
      password: hashed
    });
    console.log("result:", result)
    res.status(201).json({ success: SIGNED_UP });
  } catch (err) {
    console.error("DB create error:", err);
    res.status(500).json({ error: SIGN_UP_FAILED });
  }
};

// LOGIN
async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: USER_NOT_FOUND });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: WRONG_PASSWORD });

    res.json({ success: LOGGED_IN, userId: user._id, username: user.name, useremail: user.email });
  } catch (err) {
    res.status(500).json({ error: NETWORK_ERROR });
  }
};


module.exports = {
  handleUserSignUp,
  handleUserLogin
}