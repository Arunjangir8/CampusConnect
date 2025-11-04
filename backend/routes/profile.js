const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Update user profile
router.put('/profile', authenticate, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').optional().isInt({ min: 1, max: 4 }),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('skills').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, department, year, bio, skills } = req.body;

    const updatedUser = await User.updateById(req.user.id, {
      name,
      department,
      year: year ? parseInt(year) : null,
      bio: bio || null,
      skills: skills || []
    });

    // Remove password from response
    delete updatedUser.password;

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;