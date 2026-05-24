const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

// THE FIX: We added 'getAllApplications' right here!
const { analyzeResume, submitApplication, getAllApplications } = require('../controllers/matchController');

// Ensure an "uploads" folder exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Memory Storage (For AI Analysis)
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Disk Storage (For Final Submission)
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const diskUpload = multer({ storage: diskStorage });

// --- THE ROUTES ---
router.post('/analyze', authMiddleware, memoryUpload.single('resume'), analyzeResume);
router.post('/submit', authMiddleware, diskUpload.single('resume'), submitApplication);

// The new Employer route
router.get('/applications', authMiddleware, getAllApplications);

module.exports = router;