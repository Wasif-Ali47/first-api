const bcrypt = require("bcrypt");
const {
    setUser,
    getUser
} = require('../services/userAuthService');
const User = require("../models/usersModel");
const { NETWORK_ERROR, SIGNED_UP, SIGN_UP_FAILED, USER_NOT_FOUND, WRONG_PASSWORD, LOGGED_IN, ALL_FILEDS_REQUIRED, NAME_REQUIRED, EMAIL_REQUIRED, PASSWORD_REQUIRED } = require("../messages/message");

// SIGN UP
async function handleUserSignUp(req, res) {
 const body = req.body;
     if (!body) return res.status(400).json({ message: ALL_FILEDS_REQUIRED });
     if (!body.name) return res.status(400).json({ message: NAME_REQUIRED });
     if (!body.email) return res.status(400).json({ message: EMAIL_REQUIRED });
     if (!body.password) return res.status(400).json({ message: PASSWORD_REQUIRED });
 
     try {
         const hashed = await bcrypt.hash(body.password, 10);
 
         const result = await User.create({
             name: body.name,
             email: body.email,
             profession: body.profession ?? undefined,
             password: hashed,
             image: req.file ? `/uploads/${req.file.filename}` : null
         });
 
         res.status(201).json({ success: SIGNED_UP, result });
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
    const token = setUser(user)

    res.json({ success: LOGGED_IN, userId: user._id,token: token, username: user.name, useremail: user.email });
  } catch (err) {
    res.status(500).json({ error: NETWORK_ERROR });
  }
};


module.exports = {
  handleUserSignUp,
  handleUserLogin
}