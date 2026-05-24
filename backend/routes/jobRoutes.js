const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 1. We added getEmployerDashboard to this list!
const { 
    createJob, 
    getJobs, 
    getJobById, 
    deleteJob, 
    getEmployerDashboard 
} = require('../controllers/jobController');

// Route: GET /api/jobs (Public: Anyone can view jobs)
router.get('/', getJobs);

// ==========================================
// CRITICAL: /dashboard MUST go before /:id
// ==========================================
// Route: GET /api/jobs/dashboard (Protected: Secure Employer Data)
router.get('/dashboard', authMiddleware, getEmployerDashboard);

// Route: GET /api/jobs/:id (Public: View a specific job)
router.get('/:id', getJobById);

// Route: POST /api/jobs (Protected: Must be logged in as employer)
router.post('/', authMiddleware, createJob);

// Route: DELETE /api/jobs/:id (Protected: Must own the job posting)
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;