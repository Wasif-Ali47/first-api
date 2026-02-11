const express = require('express');
const { handleUserLogin, handleUserSignUp } = require('../controllers/userAuthControllers');
const { checkUserExistsByEmail } = require('../middlewares');
const upload = require('../uploads');

const router = express.Router();

router.post("/signup",upload.single("image"),checkUserExistsByEmail, handleUserSignUp);
router.post("/login",upload.single("image"), handleUserLogin);

module.exports = router