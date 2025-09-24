import React, { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/HotelContext";
import axios from "axios";
import { Pencil, Trash2, Star, Crown, Award } from "lucide-react"; // icons
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AllRooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allRooms = location.pathname.includes("rooms");

  const { BACKEND_URL } = useContext(HotelContext);
  const token = localStorage.getItem("admintoken");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ new state

  const fetchAllRooms = async () => {
    try {
      setLoading(true); // ✅ start loading
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/adminAllRooms",
        {},
        { headers: { token } }
      );

      if (data.success) {
        const parsedRooms = data.rooms.map((room) => ({
          ...room,
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          features: Array.isArray(room.features) ? room.features : [],
        }));
        setRooms(parsedRooms.sort((a, b) => a.roomNumber - b.roomNumber));
        console.log(rooms);
      } else {
        console.log("Not Authorised");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, [allRooms]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/deleteRoom",
        { roomId: id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setRooms((prev) => prev.filter((room) => room._id !== id));
      } else {
        alert("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              All Rooms
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-lg ml-10 sm:ml-0">
            Manage all hotel rooms and their details
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {rooms.length}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-xs sm:text-sm">Total Rooms</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {/* {rooms.length} */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {rooms.filter((r) => r.status === "available").length}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-xs sm:text-sm">Available</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {/* {rooms.filter((r) => r.status === "available").length} */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-xs sm:text-sm">Bestsellers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {rooms.filter((r) => r.isBestSeller).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-xs sm:text-sm">Featured</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {rooms.filter((r) => r.isFeatured).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-700">Rooms</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {rooms.map((room, index) => (
                <div
                  key={room._id}
                  className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={room.images[0]}
                        alt="room"
                        loading="lazy"
                        className="w-16 h-12 object-cover rounded-lg shadow-lg border border-gray-200"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {room.roomNumber}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900 capitalize">
                            {room.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            Room #{room.roomNumber}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-1">
                          <p className="text-lg font-bold text-green-600">
                            ₹{room.pricePerNight}
                          </p>
                          <p className="text-xs text-gray-500">/night</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            room.status === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-1 ${room.status === "available" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {room.status}
                        </span>

                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">
                            {room.rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {room.isBestSeller && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              <Crown className="w-2 h-2 mr-1" />
                              Bestseller
                            </span>
                          )}
                          {room.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Award className="w-2 h-2 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin-pannel/update/${room._id}`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={room.status === "booked"}
                            onClick={() => {
                              if (room.status !== "booked") {
                                handleDelete(room._id);
                              }
                            }}
                            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md
                            ${
                              room.status === "booked"
                                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                : "text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Crown className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No rooms found
                    </h3>
                    <p className="text-gray-400">
                      Add your first room to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room, index) => (
                  <tr
                    key={room._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={room.images[0]}
                            alt="room"
                            className="w-20 h-16 object-cover rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {room.roomNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {room.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          Room #{room.roomNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{room.pricePerNight}
                        </span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            room.status === "available"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                              : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${room.status === "available" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {room.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {room.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {room.isBestSeller && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                            <Crown className="w-3 h-3 mr-1" />
                            Bestseller
                          </span>
                        )}
                        {room.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                        {!room.isBestSeller && !room.isFeatured && (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin-pannel/update/${room._id}`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          disabled={room.status === "booked"}
                          onClick={() => {
                            if (room.status !== "booked") {
                              handleDelete(room._id);
                            }
                          }}
                          className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md
                              ${
                                room.status === "booked"
                                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                          <Crown className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          No rooms found
                        </h3>
                        <p className="text-gray-400">
                          Add your first room to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
