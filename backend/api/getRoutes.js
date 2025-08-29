const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerconfig'); // Import multer config for file upload
const {getPosts , getFriends , getUsers , getPolls,getChatId , getChat,getProfilePosts, getTopPosts} = require('../controllers/getController');
const authMiddleware = require('../middlewares/authMiddleware');

// Define the route for creating a post
router.get('/getPosts',authMiddleware , getPosts);
router.get('/getPolls',authMiddleware , getPolls);
router.get('/getFriends',authMiddleware , getFriends);
router.get('/getUsers',authMiddleware,getUsers);
router.get('/getChatId',authMiddleware,getChatId);
router.get('/getChat',authMiddleware,getChat);
router.get('/getProfilePosts',authMiddleware,getProfilePosts);
router.get('/getTopPosts',authMiddleware,getTopPosts);
module.exports = router;
