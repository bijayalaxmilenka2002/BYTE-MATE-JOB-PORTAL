const Job = require('../models/Job');
const pdfParse = require('pdf-parse'); // Uses your stable v1.1.1

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'The server received the request, but the file payload dropped.' });
        }

        const jobId = req.body.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found in database.' });
        }
        
        // Feed the pure buffer to the classic pdf-parse library
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text.toLowerCase();

        const requiredSkills = job.requiredSkills || [];
        let matchedSkills = [];
        let missingSkills = [];

        requiredSkills.forEach(skill => {
            if (resumeText.includes(skill.toLowerCase())) {
                matchedSkills.push(skill);
            } else {
                missingSkills.push(skill);
            }
        });

        const totalSkills = requiredSkills.length > 0 ? requiredSkills.length : 1;
        const matchPercentage = Math.round((matchedSkills.length / totalSkills) * 100);

        res.json({
            matchPercentage,
            matchedSkills,
            missingSkills,
            isHighRejectionRisk: matchPercentage < 50
        });

    } catch (error) {
        console.error("AI Engine Error:", error);
        res.status(500).json({ message: 'Failed to analyze the PDF text.' });
    }
};

// ... (Keep your existing analyzeResume function up here) ...

const Application = require('../models/Application');

exports.submitApplication = async (req, res) => {
    try {
        console.log("\n=== SAVING FINAL APPLICATION ===");

        if (!req.file) {
            return res.status(400).json({ message: 'Resume file was lost during final submission.' });
        }

        const { jobId, matchScore } = req.body;
        const candidateId = req.user.id; // Comes from your authMiddleware

        // Save using YOUR exact schema names!
        const newApplication = new Application({
            jobId: jobId,
            candidateId: candidateId,
            matchScore: matchScore,
            resumePath: req.file.path // The physical location of the saved PDF
            // Note: 'status' will automatically default to 'pending' just like you programmed it!
        });

        await newApplication.save();

        console.log("✅ Application saved to Database successfully!");
        res.status(201).json({ message: 'Application submitted successfully!' });

    } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ message: 'Failed to save application to the database.' });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        // Find all applications and 'populate' the real names of the Job and the Candidate
        const applications = await Application.find()
            .populate('jobId', 'title') 
            .populate('candidateId', 'name email') // Assumes your User model has a 'name' field
            .sort({ createdAt: -1 }); // Newest first

        res.json(applications);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Failed to fetch applications.' });
    }
};