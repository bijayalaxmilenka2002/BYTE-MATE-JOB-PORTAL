import { API_BASE_URL } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', salary: '', requiredSkills: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    // Convert "React, Node, Python" into an array: ["react", "node", "python"]
    const skillsArray = formData.requiredSkills
      .split(',')
      .map(skill => skill.trim().toLowerCase())
      .filter(skill => skill !== '');

    const jobPayload = { ...formData, requiredSkills: skillsArray };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(jobPayload)
      });

      if (response.ok) {
        setStatus({ loading: false, error: '', success: true });
        setTimeout(() => navigate('/employer/dashboard'), 2000);
      } else {
        const data = await response.json();
        setStatus({ loading: false, error: data.message, success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: 'Server error. Is the backend running?', success: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Post a New Opportunity</h2>
        
        {status.error && <div className="mb-4 p-3 bg-red-50 text-red-700 font-bold rounded">{status.error}</div>}
        {status.success && <div className="mb-4 p-3 bg-green-50 text-green-700 font-bold rounded">Job posted successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. Senior MERN Developer" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Job Description</label>
            <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="Describe the role..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. Remote, India" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Salary (₹)</label>
              <input type="number" required value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1200000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Required Skills for AI ATS</label>
            <p className="text-xs text-gray-500 mb-2">Separate skills with commas. Our AI will scan resumes for these exact words.</p>
            <input type="text" required value={formData.requiredSkills} onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})} className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="React, Node.js, MongoDB, Express" />
          </div>

          <button type="submit" disabled={status.loading} className="w-full py-3 bg-gray-900 text-white font-bold rounded hover:bg-blue-600 transition mt-4">
            {status.loading ? 'Posting...' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
}