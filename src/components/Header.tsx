import { Link } from "react-router-dom";
import { useState } from "react";
import { Hotel, Menu } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-lg">H</span> */}
                <Hotel className="text-white font-bold text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Hoterra</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/service"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Services
            </Link>
            <Link
              to="/rooms"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Rooms
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </Link>
            <Link
              to="/my-bookings"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Bookings
            </Link>
            <Link
              to="/my-stays"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Stays
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r
 from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default) */}
        <div className={`${menuOpen ? "block" : "hidden"} md:hidden mt-4 pb-4`}>
          <div className="flex flex-col space-y-2">
            <Link
              to="/home"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Home
            </Link>
            <Link
              to="/service"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Services
            </Link>
            <Link
              to="/rooms"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Rooms
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Contact
            </Link>
            <Link
              to="/my-bookings"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Bookings
            </Link>
            <Link
              to="/my-stays"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
            >
              Stays
            </Link>
            <div className="flex flex-col space-y-3 pt-2">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-center hover:opacity-90 transition-opacity duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* <Link to="/home">Home</Link>
            <Link to="/service">Services</Link>
            <Link to="/rooms">Rooms</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/my-bookings">MyBookings</Link>
            <Link to="/my-stays">My Stays</Link> */}
      </div>
      {/*<button>Log Out</button>*/}
    </header>
  );
}