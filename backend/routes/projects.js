const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { prisma } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all projects with filtering
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  query('skills').optional().isString()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.skills) {
      where.skills = { hasSome: req.query.skills.split(',') };
    }
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: 'insensitive' } },
        { description: { contains: req.query.search, mode: 'insensitive' } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, department: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, department: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.project.count({ where });

    res.json({
      projects,
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

// Create new project
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('skills').isArray().withMessage('Skills must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        skills: req.body.skills,
        createdById: req.user.id
      },
      include: {
        createdBy: { select: { id: true, name: true, department: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, department: true } }
          }
        }
      }
    });

    // Add creator as project leader
    await prisma.projectMember.create({
      data: {
        userId: req.user.id,
        projectId: project.id,
        role: 'leader'
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join project
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'OPEN') {
      return res.status(400).json({ message: 'Project is not open for new members' });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'Already a member of this project' });
    }

    await prisma.projectMember.create({
      data: { userId, projectId, role: 'member' }
    });

    res.json({ message: 'Successfully joined project' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        createdBy: { select: { id: true, name: true, department: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, department: true } }
          }
        }
      }
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;