const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { prisma } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get discussions with filtering
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('department').optional().isString()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.department) where.department = req.query.department;
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: 'insensitive' } },
        { content: { contains: req.query.search, mode: 'insensitive' } }
      ];
    }

    const discussions = await prisma.discussion.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, department: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, department: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.discussion.count({ where });

    res.json({
      discussions: discussions.map(discussion => ({
        ...discussion,
        commentCount: discussion.comments.length
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single discussion with all comments
router.get('/:id', authenticate, async (req, res) => {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true, department: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, department: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new discussion
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('department').trim().notEmpty().withMessage('Department is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const discussion = await prisma.discussion.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        department: req.body.department,
        authorId: req.user.id
      },
      include: {
        author: { select: { id: true, name: true, department: true } }
      }
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment to discussion
router.post('/:id/comments', authenticate, [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id: req.params.id }
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        authorId: req.user.id,
        discussionId: req.params.id
      },
      include: {
        author: { select: { id: true, name: true, department: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upvote discussion
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: req.params.id }
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const updatedDiscussion = await prisma.discussion.update({
      where: { id: req.params.id },
      data: { upvotes: { increment: 1 } }
    });

    res.json({ upvotes: updatedDiscussion.upvotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete discussion
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: req.params.id }
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.discussion.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;