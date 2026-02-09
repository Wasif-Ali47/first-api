const express = require('express');
const {
    handleGetAllUsers,
    handleGetUserById,
    handlePostNewUser,
    handleUpdateUserById,
    handleDeleteUserById
} = require("../controllers/user");
const { checkUserExistsByEmail } = require('../middlewares');

const router = express.Router();

router
    .route("/")
    .get(handleGetAllUsers)
    .post(checkUserExistsByEmail, handlePostNewUser)


router
    .route("/:id")
    .get(handleGetUserById)
    .put(handleUpdateUserById)
    .delete(handleDeleteUserById)


module.exports = router