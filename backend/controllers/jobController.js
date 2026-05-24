const Job = require('../models/Job');
// IMPORTANT: We need the Application model to fetch the candidate applications for the dashboard
const Application = require('../models/Application'); 

// 1. CREATE A JOB (Employers Only)
exports.createJob = async (req, res) => {
    try {
        // Ensure only employers can post jobs
        if (req.user.role !== 'employer' && req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Access denied. Only employers can post jobs.' });
        }

        const { title, description, requiredSkills, location, salary } = req.body;

        const newJob = new Job({
            title,
            description,
            requiredSkills,
            location,
            salary,
            companyId: req.user.id // PERFECT: This is your "Name Tag"
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. GET ALL JOBS (Public/Candidates)
exports.getJobs = async (req, res) => {
    try {
        // .populate() fetches the company details from the User collection
        const jobs = await Job.find().populate('companyId', 'name email').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. GET A SINGLE JOB BY ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('companyId', 'name');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. DELETE A JOB (Only the employer who created it)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the user trying to delete it is the one who created it
        if (job.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 5. NEW: GET SECURE EMPLOYER DASHBOARD (Data Isolation)
exports.getEmployerDashboard = async (req, res) => {
    try {
        // Step A: Find ONLY the jobs posted by this specific employer using your 'companyId'
        const myJobs = await Job.find({ companyId: req.user.id }).sort({ createdAt: -1 });
        
        // Step B: Extract just the ID numbers of those specific jobs
        const myJobIds = myJobs.map(job => job._id);

        // Step C: Find applications, but ONLY if they were submitted to your specific jobs
        const applications = await Application.find({ jobId: { $in: myJobIds } })
            .populate('jobId', 'title') 
            .populate('candidateId', 'name email resumeUrl')
            .sort({ createdAt: -1 });

        // Send exactly what the React frontend is expecting
        res.json({ jobs: myJobs, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch dashboard data.' });
    }
};