const express = require('express');
const {deleteFriend } = require('../controllers/deleteController'); // Import the controller
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Define the route for creating a post
router.delete('/deleteFriend', authMiddleware, deleteFriend);

module.exports = router;
