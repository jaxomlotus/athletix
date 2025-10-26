import { FaSearch } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

export default function NavigationHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Search */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">Athletix</div>
            </a>

            {/* Search Bar */}
            <div className="hidden sm:block flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search athletes, teams..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="flex items-center">
            <button className="flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-xs sm:text-base">
              <FaRegUserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
