const express = require('express');
const { body, validationResult } = require('express-validator');
const { prisma } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get mentorship requests
router.get('/requests', authenticate, async (req, res) => {
  try {
    const where = {};
    
    if (req.user.role === 'STUDENT') {
      where.studentId = req.user.id;
    } else if (req.user.role === 'ALUMNI') {
      where.OR = [
        { mentorId: req.user.id },
        { mentorId: null, status: 'PENDING' }
      ];
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, department: true, year: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create mentorship request
router.post('/requests', authenticate, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can create mentorship requests' });
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        studentId: req.user.id
      },
      include: {
        student: { select: { id: true, name: true, department: true, year: true } }
      }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept mentorship request
router.put('/requests/:id/accept', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'ALUMNI') {
      return res.status(403).json({ message: 'Only alumni can accept mentorship requests' });
    }

    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: req.params.id }
    });

    if (!request) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'ACCEPTED',
        mentorId: req.user.id
      },
      include: {
        student: { select: { id: true, name: true, department: true, year: true } }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update mentorship request status
router.put('/requests/:id', authenticate, [
  body('status').isIn(['PENDING', 'ACCEPTED', 'COMPLETED', 'DECLINED'])
], async (req, res) => {
  try {
    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: req.params.id }
    });

    if (!request) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    if (request.studentId !== req.user.id && request.mentorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRequest = await prisma.mentorshipRequest.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
      include: {
        student: { select: { id: true, name: true, department: true, year: true } }
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;