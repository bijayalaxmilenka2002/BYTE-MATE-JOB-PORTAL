const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct for your project
const { 
    sendRequest, 
    acceptRequest, 
    declineRequest, 
    getMyNetwork,
    getSuggestedUsers 
} = require('../controllers/connectionController');

// Networking routes
router.post('/request/:userId', authMiddleware, sendRequest);
router.post('/accept/:userId', authMiddleware, acceptRequest);
router.post('/decline/:userId', authMiddleware, declineRequest);
router.get('/network', authMiddleware, getMyNetwork);
router.get('/suggested', authMiddleware, getSuggestedUsers);

module.exports = router;