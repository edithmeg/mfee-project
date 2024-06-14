import { RequestHandler } from 'express';
import Comment from '../models/comment';
import Post from '../models/post';

// Get all posts
const getPosts: RequestHandler = async (_req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Get Post by id
const getPostById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('comments').populate('category');
    // if post by id is not found, return 404 status message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Get post by category
const getPostByCategory: RequestHandler = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const posts = await Post.where('category').equals(categoryId).populate('category');
    // if posts by category are not found, return 404 status message
    if (!posts) {
      return res.status(404).json({ message: 'Posts not found in that category' });
    }
    return res.status(200).json(posts);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Create post
const createPost: RequestHandler = async (req, res) => {
  const postData = req.body;
  try {
    const newPost = await Post.create(postData);
    return res.status(201).json(newPost);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Update post
const updatePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const newPostData = req.body;
  try {
    const modifiedPost = await Post.findByIdAndUpdate(id, newPostData, { new: true, runValidators: true });
    // if post not found, return 404 status message
    if (!modifiedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(modifiedPost);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Create comment
const createComment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const commentData = req.body;
  try {
    const post = await Post.findById(id);
    // if post not found, return 404 status message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = await Comment.create(commentData);
    if (!comment) {
      return res.status(400).json({ message: 'Comment not created' });
    }
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json(comment);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

// Delete post
const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id, {});
    // if post not found, return 404 status message
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await Comment.deleteMany({ _id: { $in: deletedPost.comments } });
    return res.status(200).json(deletedPost);
  } catch (error) {
    const { message } = error;
    return res.status(500).json({ message });
  }
};

export default {
  getPosts,
  getPostById,
  getPostByCategory,
  createPost,
  updatePost,
  deletePost,
  createComment
};
