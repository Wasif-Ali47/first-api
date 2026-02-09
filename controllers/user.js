const { NETWORK_ERROR, NAME_REQUIRED, EMAIL_REQUIRED, PROFESSION_REQUIRED, ALL_FILEDS_REQUIRED, USER_NOT_FOUND, USER_UPDATED, USER_DELETED } = require("../messages/message");
const User = require("../models/usersModel");


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
    try {
        const body = req.body;
        if (!body) {
            return res.status(400).json({ message: ALL_FILEDS_REQUIRED })
        } else if (!body.name) {
            return res.status(400).json({ message: NAME_REQUIRED })
        } else if (!body.email) {
            return res.status(400).json({ message: EMAIL_REQUIRED })
        } else if (!body.profession) {
            return res.status(400).json({ message: PROFESSION_REQUIRED })
        } else {
            const result = await User.create({
                name: body.name,
                email: body.email,
                profession: body.profession,
            });

            console.log("result:", result)
            return res.status(201).json({
                success: USER_CREATED
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: NETWORK_ERROR });
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
        const body = req.body;
        if (!body) {
            return res.status(400).json({ error: ALL_FILEDS_REQUIRED })
        } else if (!body.name) {
            return res.status(400).json({ error: NAME_REQUIRED })
        } else if (!body.email) {
            return res.status(400).json({ error: EMAIL_REQUIRED })
        } else if (!body.profession) {
            return res.status(400).json({ error: PROFESSION_REQUIRED })
        } else {
            const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ error: USER_NOT_FOUND });
        res.json({ success: USER_UPDATED });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: NETWORK_ERROR});
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