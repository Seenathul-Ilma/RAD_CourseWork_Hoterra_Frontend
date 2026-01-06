import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hotel, User } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function Header() {
  const { user, logout } = useAuth();

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
      style={{ fontFamily: "poppins" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-lg">H</span> */}
                <Hotel className="text-white font-bold text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Hoterra</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-amber-700"
                    : "text-gray-700 hover:text-amber-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/service"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-amber-700"
                    : "text-gray-700 hover:text-amber-600"
                }`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-amber-700"
                    : "text-gray-700 hover:text-amber-600"
                }`
              }
            >
              Book A Room
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-amber-700"
                    : "text-gray-700 hover:text-amber-600"
                }`
              }
            >
              Contact
            </NavLink>
            {/* <NavLink
                  to="/book"
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive
                        ? "text-amber-700"
                        : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  Book A Room
                </NavLink> */}
                <NavLink
                  to="/all-bookings"
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive
                        ? "text-amber-700"
                        : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  Reservations
                </NavLink>

            {user.roles?.includes("GUEST") && (
              <>
                {/* <NavLink
                  to="/my-stays"
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive
                        ? "text-amber-700"
                        : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  Stays
                </NavLink> */}
              </>
            )}
            
            {user.roles?.includes("ADMIN") && (
              <>
                <NavLink
                  to="/staff"
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${
                      isActive
                        ? "text-amber-700"
                        : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  Staff
                </NavLink>
              </>
            )}
            
            <div className="flex items-center space-x-4">
              {/* <Link
                to="/login"
                className="text-gray-700 hover:text-amber-600 transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Sign Up
              </Link> */}

              {user ? (
                // Logged in user
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {user.firstname || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:text-amber-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Not logged in
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-amber-600 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}

            </div>
          </nav>

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
