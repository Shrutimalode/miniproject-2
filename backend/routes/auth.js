const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { sendWelcomeEmail } = require('../utils/emailService');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getMe);

// Test email endpoint (for development only)
router.post('/test-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    const result = await sendWelcomeEmail(email, name);
    
    if (result.success) {
      res.json({ message: 'Test email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Failed to send test email', error: result.error });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 