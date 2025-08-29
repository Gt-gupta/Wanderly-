const express = require('express');
const { getProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Notice no destructuring here

const router = express.Router();
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
