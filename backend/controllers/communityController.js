import CommunityPost from '../models/CommunityPost.js';
import PostComment from '../models/PostComment.js';
import User from '../models/User.js';

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    // Transform to match frontend expectations
    const transformedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      likes: post.likes,
      created_at: post.createdAt,
      user_id: post.userId._id,
      profiles: {
        full_name: post.userId.fullName,
        email: post.userId.email
      }
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.create({
      userId: req.user._id,
      content
    });

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'fullName email');

    res.status(201).json({
      success: true,
      data: {
        id: populatedPost._id,
        content: populatedPost.content,
        likes: populatedPost.likes,
        created_at: populatedPost.createdAt,
        user_id: populatedPost.userId._id,
        profiles: {
          full_name: populatedPost.userId.fullName,
          email: populatedPost.userId.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like post
// @route   PUT /api/community/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: post._id,
        content: post.content,
        likes: post.likes,
        created_at: post.createdAt,
        user_id: post.userId._id,
        profiles: {
          full_name: post.userId.fullName,
          email: post.userId.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/community/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or not authorized'
      });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    await PostComment.deleteMany({ postId: req.params.id });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/community/posts/:id/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const comments = await PostComment.find({ postId: req.params.id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await PostComment.create({
      postId: req.params.id,
      userId: req.user._id,
      content
    });

    const populatedComment = await PostComment.findById(comment._id)
      .populate('userId', 'fullName email');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

