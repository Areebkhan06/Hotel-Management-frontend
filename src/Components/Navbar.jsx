import React, { useContext, useState } from "react";
import { assets } from "../assets/assests";
import { HotelContext } from "../context/HotelContext";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineFavorite,MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { User, settoken, setUser } = useContext(HotelContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    localStorage.removeItem("user"); // clear storage
    localStorage.removeItem("token"); // clear storage
    setUser(null); // clear state
    settoken("");
    navigate("/login"); // optional: redirect
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className=" sm:px-5 px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <img
            className="w-20 cursor-pointer transition-transform hover:scale-105"
            src={assets.logo}
            alt="logo"
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            {["Home", "Rooms", "Offers", "Contact"].map((item, idx) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <Link
                  to={path}
                  key={idx}
                  className="list-none cursor-pointer px-4 py-2 rounded-lg hover:text-amber-600 hover:bg-amber-50 transition"
                >
                  {item}
                </Link>
              );
            })}

            {!User ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-amber-100 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg hover:from-blue-100 hover:to-amber-100 transition"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    className="w-5"
                    src={assets.profile_icon}
                    alt="profile"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Profile
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Desktop Profile Dropdown */}
                {profileDropdownOpen && (
                  <ul className=" absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-50">
                    <li
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/bookings");
                      }}
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                        />
                      </svg>
                      Bookings
                    </li>
                    <li
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/favourite");
                      }}
                    >
                      <MdOutlineFavorite />
                      Favourite
                    </li>
                    <li
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/admin-panel");
                      }}
                    >
                      <MdAdminPanelSettings />
                      Admin Panel
                    </li>

                    <li
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={() => handleLogout()}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              className="p-2 text-gray-700 hover:bg-indigo-50 rounded-md transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <img
                  className="w-6 h-6"
                  src={assets.menu_icon}
                  alt="menu icon"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-6 py-4 space-y-2 text-gray-700 font-medium">
            {["Home", "Rooms", "Offers", "Contact"].map((item, idx) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <NavLink
                  to={path}
                  key={idx}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-amber-100 font-semibold"
                        : "hover:bg-indigo-50"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </NavLink>
              );
            })}

            {!User ? (
              <Link
                to="/login"
                className="block w-full text-center text-sm font-medium text-white bg-amber-500 px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-lg">
                  <img
                    className="w-5"
                    src={assets.profile_icon}
                    alt="profile"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Welcome
                  </span>
                </div>

                <Link
                  to="/bookings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                    />
                  </svg>
                  Bookings
                </Link>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
