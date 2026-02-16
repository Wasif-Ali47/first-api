const express = require('express');
const {
    handleGetAllUsers,
    handleGetUserById,
    handlePostNewUser,
    handleUpdateUserById,
    handleDeleteUserById
} = require("../controllers/userControllers");
const { checkUserExistsByEmail, verifyToken } = require('../middlewares');
const upload = require('../uploads');


const router = express.Router();

router
    .route("/")
    .get(verifyToken,handleGetAllUsers)
    .post(verifyToken,upload.single("image"),checkUserExistsByEmail, handlePostNewUser)


router
    .route("/:id")
    .get(verifyToken, handleGetUserById)
    .put(verifyToken, upload.single("image"),handleUpdateUserById)
    .delete(verifyToken, handleDeleteUserById)


module.exports = router