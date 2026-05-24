const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMessages } = require('../controllers/messageController');

// Route to get conversation history
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;