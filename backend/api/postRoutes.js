const express = require('express');
const { createPost , createPoll , createFriend ,postLike, postOpinion,postMessage} = require('../controllers/postController'); // Import the controller
const router = express.Router();
const upload = require('../middlewares/multerconfig'); // Import multer config for file upload
const authMiddleware = require('../middlewares/authMiddleware');

// Define the route for creating a post
router.post('/createPost', authMiddleware, upload.single('image'), createPost);
router.post('/createPoll',authMiddleware,createPoll);
router.post('/createFriend',authMiddleware,createFriend);
router.post('/postLike',authMiddleware,postLike);
router.post('/postOpinion',authMiddleware,postOpinion);
router.post('/postMessage',authMiddleware,postMessage);

module.exports = router;
