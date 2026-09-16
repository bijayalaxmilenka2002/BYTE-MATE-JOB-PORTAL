import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';

export default function EmployerDashboard() {
  const [data, setData] = useState({ jobs: [], applications: [] });
  const [isLoading, setIsLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Employer';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Calls our secure, isolated backend route
        const response = await fetch(`${API_BASE_URL}/api/jobs/dashboard`, {
          headers: { 'x-auth-token': token }
        });
        
        if (response.ok) {
          const dashboardInfo = await response.json();
          setData(dashboardInfo);
        }
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="text-center mt-20 font-bold text-gray-500">Loading your secure portal...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{userName}'s Portal</h1>
          <p className="text-gray-500 mt-2">Manage your active job postings and candidate applications.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: YOUR JOB POSTINGS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">My Active Jobs</h2>
            {data.jobs.length === 0 ? (
              <p className="text-gray-500 text-sm">You haven't posted any jobs yet.</p>
            ) : (
              <div className="space-y-4">
                {data.jobs.map(job => (
                  <div key={job._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-600 text-lg">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{job.location} • ₹{job.salary}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.requiredSkills?.map((skill, i) => (
                        <span key={i} className="text-[10px] bg-white border border-gray-300 px-2 py-1 rounded text-gray-600">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: APPLICATIONS & RESUMES */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Candidate Applications</h2>
            {data.applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications received yet.</p>
            ) : (
              <div className="space-y-4">
                {data.applications.map(app => {
                  // MAGIC LOGIC: We finally know the secret word is "resumePath"!
                  const resumeLink = app.resumePath || app.resumeUrl || app.resume || app.candidateId?.resumeUrl;
                  
                  // Handle both absolute (Cloudinary/AWS) and relative (Local) URLs safely
                  const fullResumeUrl = resumeLink?.startsWith('http') 
                    ? resumeLink 
                    : `${API_BASE_URL}/${resumeLink}`;

                  return (
                    <div key={app._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.candidateId?.name || 'Unknown Candidate'}</h3>
                        <p className="text-xs text-gray-500">Applied for: <span className="font-bold">{app.jobId?.title}</span></p>
                        <p className="text-sm font-bold mt-2 text-green-600">AI Match: {app.matchScore || 0}%</p>
                      </div>
                      
                      {/* Dynamically show the Resume Button or a No Resume badge */}
                      {resumeLink ? (
                        <a 
                          href={fullResumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded hover:bg-blue-600 shadow-sm transition"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium bg-gray-200 px-3 py-1 rounded">No Resume</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}