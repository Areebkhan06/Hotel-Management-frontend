import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Settings,
  Plus,
  Building2,
} from "lucide-react";
import { HotelContext } from "../../context/HotelContext";
import axios from "axios";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("admintoken");
  const { BACKEND_URL, totalRevenue, totalBooking } = useContext(HotelContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/admin-pannel" },
    {
      id: "rooms",
      label: "All Rooms",
      icon: Building2,
      path: "/admin-pannel/rooms",
    },
    {
      id: "add-room",
      label: "Add Room",
      icon: Plus,
      path: "/admin-pannel/add-room",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/admin-pannel/bookings",
    },
    {
      id: "guests",
      label: "Guests",
      icon: Users,
      path: "/admin-pannel/guests",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin-pannel/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Hotel Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 px-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 px-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Revenue</p>
              <p className="text-sm font-semibold">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Bookings</p>
              <p className="text-sm font-semibold">{totalBooking}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-gray-600">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("admintoken");
                window.location.reload(); // ✅ reloads the page
              }}
              className="text-sm font-medium text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
