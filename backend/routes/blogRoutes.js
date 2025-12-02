import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBlogPosts)
  .post(admin, createBlogPost);

router.route('/:id')
  .get(getBlogPost)
  .put(admin, updateBlogPost)
  .delete(admin, deleteBlogPost);

export default router;

