import express from 'express';
import postController from '../controllers/post';

const router = express.Router();

// Get all posts
router.get('/', postController.getPosts);

// Get posts by id
router.get('/:id', postController.getPostById);

// Get posts by category
router.get('/category/:category', postController.getPostByCategory);

// Create post
router.post('/', postController.createPost);

// Update post
router.patch('/:id', postController.updatePost);

// Delete post
router.delete('/:id', postController.deletePost);

// Create comment
router.post('/:id/comments', postController.createComment);

export default router;
