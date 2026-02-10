const { NETWORK_ERROR, NAME_REQUIRED, EMAIL_REQUIRED, PROFESSION_REQUIRED, ALL_FILEDS_REQUIRED, USER_NOT_FOUND, USER_UPDATED, USER_DELETED, PASSWORD_REQUIRED, CREATE_USER_FAILED, USER_CREATED } = require("../messages/message");
const User = require("../models/usersModel");
const bcrypt = require('bcrypt');


async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: NETWORK_ERROR });
    }
}


async function handlePostNewUser(req, res) {
    const body = req.body;
    if (!body) return res.status(400).json({ message: ALL_FILEDS_REQUIRED });
    if (!body.name) return res.status(400).json({ message: NAME_REQUIRED });
    if (!body.email) return res.status(400).json({ message: EMAIL_REQUIRED });
    if (!body.profession) return res.status(400).json({ message: PROFESSION_REQUIRED });
    if (!body.password) return res.status(400).json({ message: PASSWORD_REQUIRED });

    try {
        const hashed = await bcrypt.hash(body.password, 10);

        const result = await User.create({
            name: body.name,
            email: body.email,
            profession: body.profession,
            password: hashed
        });
        console.log("result:", result);
        res.status(201).json({ success: USER_CREATED });
    } catch (err) {
        console.error("DB create error:", err);
        res.status(500).json({ error: CREATE_USER_FAILED });
    }
}


async function handleGetUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: USER_NOT_FOUND });
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: NETWORK_ERROR });
    }
}



async function handleUpdateUserById(req, res) {
    const body = req.body;
    if (!body) return res.status(400).json({ message: ALL_FILEDS_REQUIRED });
    if (!body.name) return res.status(400).json({ message: NAME_REQUIRED });
    if (!body.email) return res.status(400).json({ message: EMAIL_REQUIRED });
    if (!body.profession) return res.status(400).json({ message: PROFESSION_REQUIRED });
    if (!body.password) return res.status(400).json({ message: PASSWORD_REQUIRED });

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ error: USER_NOT_FOUND });
        res.json({ success: USER_UPDATED });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: NETWORK_ERROR });
    }
}



async function handleDeleteUserById(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: USER_NOT_FOUND });
        res.json({ success: USER_DELETED });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: NETWORK_ERROR });
    }
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handlePostNewUser,
    handleUpdateUserById,
    handleDeleteUserById
} 