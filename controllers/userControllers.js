const { NETWORK_ERROR, NAME_REQUIRED, EMAIL_REQUIRED, PROFESSION_REQUIRED, ALL_FILEDS_REQUIRED, USER_NOT_FOUND, USER_UPDATED, USER_DELETED, PASSWORD_REQUIRED, CREATE_USER_FAILED, USER_CREATED, DELETE_USER_FAILED } = require("../messages/message");
const User = require("../models/usersModel");
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find({ createdBy: req.user._id });
        if(users == null) {
            return res.json({
                message: "you have not created any users"
            })
        } else {

            return res.json(users);
        }
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
    if (!body.password) return res.status(400).json({ message: PASSWORD_REQUIRED });

    try {
        const hashed = await bcrypt.hash(body.password, 10);

        const result = await User.create({
            name: body.name,
            email: body.email,
            profession: body.profession ?? undefined,
            password: hashed,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            createdBy: req.user?._id
        });

        res.status(201).json({ success: USER_CREATED, result });
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
    try {
        const updateData = { ...req.body };
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.file) {
            const newImagePath = `/uploads/${req.file.filename}`;
            if (user.image !== newImagePath) {
                if (user.image) {
                    const oldImagePath = path.join(__dirname, '..', user.image);
                    fs.promises.access(oldImagePath) && fs.promises.unlink(oldImagePath);
                }
                updateData.image = newImagePath;
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: ALL_FILEDS_REQUIRED });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.json({ success: USER_UPDATED, user: updatedUser });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: NETWORK_ERROR });
    }
}

async function handleDeleteUserById(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: USER_NOT_FOUND });
        }
        if (!user.image) {
            return res.json({ success: USER_DELETED });
        }
        const imagePath = path.join(__dirname, '..', user.image);
        try {
            await fs.promises.access(imagePath);
            await fs.promises.unlink(imagePath);
        } catch (imageErr) {
            console.error(`Failed to delete image ${imagePath}:`, imageErr.message);
            return res.status(500).json({
                error: "User was deleted, but failed to delete image",
            });
        }
        return res.json({ success: USER_DELETED });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({
            error: DELETE_USER_FAILED,
        });
    }
};

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
    handleGetAllUsers,
    handleGetUserById,
    handlePostNewUser,
    handleUpdateUserById,
    handleDeleteUserById,
    handleUserLogin
} 