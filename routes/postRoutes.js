const postRoutes = require('express').Router();
const { authenticateToken } = require('../utils/jwt');
const { getAllPost, createPost, likePost, likeComment, commentPost, postLikedUsers, commentLikedUsers, usersWithComment } = require('../controllers/postController');

postRoutes.get('/get-all-posts', authenticateToken, getAllPost);
postRoutes.post('/create-post', authenticateToken, createPost);
postRoutes.put('/like-post', authenticateToken, likePost);
postRoutes.post('/add-comment', authenticateToken, commentPost);
postRoutes.put('/like-comment', authenticateToken, likeComment);
postRoutes.get('/get-users-with-post-liked', authenticateToken, postLikedUsers);
postRoutes.get('/get-users-with-comment-liked', authenticateToken, commentLikedUsers);
postRoutes.get('/get-users-who-commented', authenticateToken, usersWithComment);

module.exports = postRoutes;