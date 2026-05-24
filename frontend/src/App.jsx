import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerDashboard from './pages/EmployerDashboard';
// 1. Import the two new pages
import PostJob from './pages/PostJob';
import Network from './pages/Network';

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
        <Navbar /> 
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            
            {/* 2. Add the Routes */}
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/network" element={<Network />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;