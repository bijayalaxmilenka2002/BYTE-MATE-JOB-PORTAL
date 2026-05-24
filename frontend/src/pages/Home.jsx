import { useState, useEffect } from 'react';
import ApplyModal from '../components/ApplyModal';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">Byte Mate</h1>
        <p className="text-xl text-gray-600">The AI-driven job portal for the modern workforce.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-2 border-gray-200">Latest Opportunities</h2>
        
        {loading && <p className="text-center text-gray-500 animate-pulse">Loading latest jobs...</p>}
        {!loading && jobs.length === 0 && <p className="text-center text-gray-500">No jobs posted yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-blue-600 font-semibold mb-3">{job.companyId?.name || 'Unknown Company'}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <span>📍 {job.location}</span>
                  <span>💰 ₹{job.salary}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.requiredSkills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">{skill}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => setSelectedJob(job)} className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-blue-600 transition mt-auto">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}