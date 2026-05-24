import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage('Server error. Make sure your backend is running!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-600">Join Byte Mate</h2>
        {message && <p className="text-center text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="password" name="password" placeholder="Password (min 6 chars)" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <select name="role" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="candidate">I am a Candidate</option>
            <option value="employer">I am an Employer</option>
          </select>
          <button type="submit" className="w-full py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">Create Account</button>
        </form>
        <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link></p>
      </div>
    </div>
  );
}