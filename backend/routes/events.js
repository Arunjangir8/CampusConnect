const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { prisma } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Get all events with filtering, sorting, pagination
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isIn(['TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'OTHER']),
  query('department').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.category) where.category = req.query.category;
    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: 'insensitive' } },
        { description: { contains: req.query.search, mode: 'insensitive' } }
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, department: true } },
        rsvps: { select: { userId: true } }
      },
      orderBy: { date: 'asc' },
      skip,
      take: limit
    });

    const total = await prisma.event.count({ where });

    res.json({
      events: events.map(event => ({
        ...event,
        rsvpCount: event.rsvps.length,
        isRSVPed: event.rsvps.some(rsvp => rsvp.userId === req.user.id)
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

// Create new event
router.post('/', authenticate, upload.single('image'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['TECHNICAL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'OTHER']),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('maxAttendees').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'events' },
        (error, result) => result
      );
      imageUrl = result.secure_url;
    }

    const event = await prisma.event.create({
      data: {
        ...req.body,
        date: new Date(req.body.date),
        maxAttendees: req.body.maxAttendees ? parseInt(req.body.maxAttendees) : null,
        imageUrl,
        createdById: req.user.id
      },
      include: {
        createdBy: { select: { id: true, name: true, department: true } }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// RSVP to event
router.post('/:id/rsvp', authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: true }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingRSVP = await prisma.eventRSVP.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (existingRSVP) {
      await prisma.eventRSVP.delete({
        where: { userId_eventId: { userId, eventId } }
      });
      return res.json({ message: 'RSVP cancelled', rsvped: false });
    }

    if (event.maxAttendees && event.rsvps.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    await prisma.eventRSVP.create({
      data: { userId, eventId }
    });

    res.json({ message: 'RSVP successful', rsvped: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update event
router.put('/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        createdBy: { select: { id: true, name: true, department: true } }
      }
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.event.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;