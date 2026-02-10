const express = require('express');
const { handleUserLogin, handleUserSignUp } = require('../controllers/userAuthControllers');

const router = express.Router();

router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);

module.exports = router