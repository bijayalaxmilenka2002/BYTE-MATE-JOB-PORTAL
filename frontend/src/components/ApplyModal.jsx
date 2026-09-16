import { API_BASE_URL } from '../config';
import { useState } from 'react';

export default function ApplyModal({ job, onClose }) {
  const [uiState, setUiState] = useState('idle'); 
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault(); 
    const formElement = document.getElementById('apply-form');
    const formData = new FormData(formElement);
    formData.append('jobId', job._id);

    const attachedFile = formData.get('resume');
    if (!attachedFile || attachedFile.size === 0) {
      setUiState('error'); setMessage('Please select a PDF file first.'); return;
    }

    setUiState('loading'); setMessage('Uploading and analyzing your resume...');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/match/analyze`, {
        method: 'POST', headers: { 'x-auth-token': token }, body: formData 
      });
      const data = await response.json();

      if (response.ok) {
        setUiState('analyzed'); setResult(data);
      } else {
        setUiState('error'); setMessage(`Backend Error: ${data.message}`);
      }
    } catch (error) {
      setUiState('error'); setMessage('Server connection failed.');
    }
  };

  const handleFinalSubmit = async () => {
    setUiState('submitting'); setMessage('Saving application to database...');
    const formElement = document.getElementById('apply-form');
    const formData = new FormData(formElement);
    formData.append('jobId', job._id);
    formData.append('matchScore', result.matchPercentage); 

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/match/submit`, {
        method: 'POST', headers: { 'x-auth-token': token }, body: formData 
      });
      if (response.ok) {
        setUiState('final-success'); 
      } else {
        const data = await response.json();
        setUiState('error'); setMessage(`Database Error: ${data.message}`);
      }
    } catch (error) {
      setUiState('error'); setMessage('Server connection failed.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h2>
        <p className="text-sm text-gray-500 mb-6">Upload your resume to see your AI match score.</p>

        <form id="apply-form" onSubmit={handleAnalyze} className={uiState === 'analyzed' || uiState === 'final-success' || uiState === 'submitting' ? 'hidden' : 'space-y-6'}>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Select your PDF Resume:</label>
            <input type="file" name="resume" accept=".pdf" className="w-full text-gray-800 bg-white p-2 border border-gray-300 rounded cursor-pointer" required />
          </div>
          {message && <p className={`text-sm font-bold text-center p-2 rounded ${uiState === 'error' ? 'text-red-700 bg-red-50' : 'text-blue-700 bg-blue-50 animate-pulse'}`}>{message}</p>}
          <button type="submit" disabled={uiState === 'loading'} className={`w-full py-3 text-white rounded-lg font-bold ${uiState === 'loading' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {uiState === 'loading' ? 'Analyzing...' : 'Analyze & Apply'}
          </button>
        </form>

        {uiState === 'analyzed' && result && (
          <div className="space-y-6">
             <div className={`p-6 rounded-lg text-center ${result.isHighRejectionRisk ? 'bg-red-50' : 'bg-green-50'}`}>
              <h3 className="text-lg font-bold mb-2">Suitability Score</h3>
              <div className={`text-5xl font-extrabold ${result.isHighRejectionRisk ? 'text-red-600' : 'text-green-600'}`}>{result.matchPercentage}%</div>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">Matched Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills?.length > 0 ? result.matchedSkills.map((s, i) => <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded border border-green-200">{s}</span>) : <span className="text-sm text-gray-500">None</span>}
              </div>
            </div>

            {result.missingSkills?.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Missing Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((s, i) => <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded border border-red-200">{s}</span>)}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button onClick={onClose} className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300">Cancel</button>
                <button onClick={handleFinalSubmit} className="w-1/2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Submit Anyway</button>
            </div>
          </div>
        )}

        {uiState === 'submitting' && <div className="text-center py-10"><p className="text-lg font-bold text-blue-700">{message}</p></div>}
        
        {uiState === 'final-success' && (
            <div className="text-center space-y-4 py-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600">Application Submitted!</h3>
                <button onClick={onClose} className="w-full mt-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800">Back to Jobs</button>
            </div>
        )}
      </div>
    </div>
  );
}