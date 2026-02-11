const express = require('express');
const {
    handleGetAllUsers,
    handleGetUserById,
    handlePostNewUser,
    handleUpdateUserById,
    handleDeleteUserById
} = require("../controllers/user");
const { checkUserExistsByEmail } = require('../middlewares');
const upload = require('../uploads');


const router = express.Router();

router
    .route("/")
    .get(handleGetAllUsers)
    .post(upload.single("image"),checkUserExistsByEmail, handlePostNewUser)


router
    .route("/:id")
    .get(handleGetUserById)
    .put(upload.single("image"),handleUpdateUserById)
    .delete(handleDeleteUserById)


module.exports = router