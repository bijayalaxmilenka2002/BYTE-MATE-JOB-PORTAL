import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 
  const userName = localStorage.getItem('userName'); // Grab the name!

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    localStorage.removeItem('userName'); 
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
        Byte Mate
      </Link>

      <div className="flex items-center space-x-6">
        {token ? (
          <>
            {/* THE NEW GREETING */}
            <span className="text-sm text-gray-600 mr-2">
              Hello, <span className="font-bold text-blue-600">{userName}</span>
            </span>

            <Link to="/network" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">
              My Network
            </Link>
            
            {(role === 'employer' || role === 'recruiter') && (
              <>
                <Link to="/post-job" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">
                  Post a Job
                </Link>
                <Link to="/employer/dashboard" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                  Employer Portal
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}