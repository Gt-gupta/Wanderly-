const express = require('express');
const {signUp,login,forgotPassword, resetPassword} = require('../controllers/authController');
const router = express.Router();

router.post('/signUp',signUp);
router.post('/login',login);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword',resetPassword);
module.exports = router;