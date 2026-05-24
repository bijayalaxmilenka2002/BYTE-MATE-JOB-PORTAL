export default function Footer() {
  // This automatically grabs the current year, so you never have to update it manually!
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Tagline Section */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-extrabold text-blue-500 tracking-tight">
              Byte Mate
            </span>
            <p className="text-sm text-gray-400 mt-4 max-w-sm leading-relaxed">
              The AI-driven job portal for the modern workforce. We connect top talent with world-class opportunities using intelligent matching algorithms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Find Jobs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">AI Resume Analyzer</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Candidate Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Career Resources</a></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition duration-200">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Badge */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center md:text-left mb-4 md:mb-0">
            &copy; {currentYear} Byte Mate. All rights reserved.
          </p>
          
          {/* A cool little badge to make it look highly technical */}
          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}