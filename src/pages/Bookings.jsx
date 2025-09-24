import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { HotelContext } from "../context/HotelContext";
import {
  Loader2,
  CalendarDays,
  Users,
  Phone,
  Mail,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Star,
  Wifi,
  Car,
  Coffee,
  Sparkles,
  ArrowRight,
  MoreVertical,
  User,
  Baby,
  MapPin,
  Award,
  Zap,
  Eye,
  ChevronRight,
  Heart,
  Gift,
  Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Bookings = () => {
  const { BACKEND_URL } = useContext(HotelContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const token = localStorage.getItem("token");

  // Mock data based on your actual structure
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const { data } = await axios.post(
          BACKEND_URL + "/api/user/Bookings",
          {},
          { headers: { token } }
        );

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [BACKEND_URL]);

  console.log(bookings);

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "❓ Do you really want to cancel this booking?"
    );
    if (!confirmCancel) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/cancel-booking",
        { BookingId: id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          icon: CheckCircle2,
          gradient: "from-emerald-400 via-green-500 to-emerald-600",
          bg: "bg-emerald-50/80",
          text: "text-emerald-700",
          border: "border-emerald-200/60",
          glow: "shadow-emerald-200/40",
        };
      case "pending":
        return {
          icon: Clock,
          gradient: "from-amber-400 via-yellow-500 to-orange-500",
          bg: "bg-amber-50/80",
          text: "text-amber-700",
          border: "border-amber-200/60",
          glow: "shadow-amber-200/40",
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          gradient: "from-red-400 via-rose-500 to-red-600",
          bg: "bg-red-50/80",
          text: "text-red-700",
          border: "border-red-200/60",
          glow: "shadow-red-200/40",
        };
      default:
        return {
          icon: Clock,
          gradient: "from-slate-400 via-gray-500 to-slate-600",
          bg: "bg-slate-50/80",
          text: "text-slate-700",
          border: "border-slate-200/60",
          glow: "shadow-slate-200/40",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilCheckIn = (checkIn) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const diffTime = checkInDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays < 0) {
      return "Expired";
    }
    return diffDays;
  };

  const filters = [
    { key: "all", label: "All", count: bookings.length },
    {
      key: "confirmed",
      label: "Confirmed",
      count: bookings.filter((b) => b.status === "confirmed").length,
    },
    {
      key: "pending",
      label: "Pending",
      count: bookings.filter((b) => b.status === "pending").length,
    },
  ];

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-[#ff7518] to-[#FDEE00] rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
              <Loader2 className="animate-spin h-12 w-12 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Loading Bookings
          </h3>
          <p className="text-gray-600">Fetching your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Glass Header */}
      <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff7518] to-[#FDEE00] rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r  from-[#ff7518] to-[#FDEE00]  bg-clip-text text-transparent">
                  My Bookings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your hotel reservations
                </p>
              </div>
            </div>

            {/* Modern Filter Pills */}
            <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1.5 border border-white/50 shadow-xl">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`relative px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-[#ff7518] to-[#FDEE00]  text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full font-bold ${
                      activeFilter === filter.key
                        ? "bg-white/25 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBookings.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {filteredBookings.filter((booking)=>booking.roomDetails?.images).map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const nights = calculateNights(booking.checkIn, booking.checkOut);
              const daysUntil = getDaysUntilCheckIn(booking.checkIn);

              return (
                <div
                  key={booking._id}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-purple-50/30 opacity-60"></div>

                  {/* Image Section with Overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        booking.roomDetails?.images?.[0] ||
                        "/api/placeholder/600/400"
                      }
                      alt={`Room ${booking.roomDetails?.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Room Number Badge */}
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-semibold text-sm">
                      Room {booking.roomDetails?.roomNumber}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-4 right-4 inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border backdrop-blur-sm shadow-lg`}
                    >
                      <StatusIcon className="w-4 h-4 mr-1.5" />
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </div>

                    {/* Special Badges */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {booking.roomDetails?.isBestSeller && (
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Bestseller
                        </span>
                      )}
                      {booking.roomDetails?.isFeatured && (
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-6 space-y-5">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {booking.roomDetails?.type.charAt(0).toUpperCase() +
                            booking.roomDetails?.type.slice(1)}{" "}
                          Room
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {booking.roomDetails?.rating}
                          </span>
                          <span>•</span>
                          <span>{booking.roomDetails?.reviews} reviews</span>
                          {booking.roomDetails?.offer && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium flex items-center">
                                <Gift className="w-3 h-3 mr-1" />
                                {booking.roomDetails?.offer}% Discount
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {daysUntil && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {daysUntil}
                          </p>
                          <p className="text-xs text-gray-500">days to go</p>
                        </div>
                      )}
                    </div>

                    {/* Guest Info Card */}
                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100/80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Guest Details
                        </h4>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">
                            {booking.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </span>
                          <span className="font-medium text-gray-900 text-right">
                            {booking.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            Phone
                          </span>
                          <span className="font-medium text-gray-900">
                            {booking.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100/60">
                        <div className="flex items-center text-blue-700 mb-2">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium whitespace-nowrap">
                            Check-in/out
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(booking.checkIn)}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(booking.checkOut)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {nights} night{nights > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-100/60">
                        <div className="flex items-center text-green-700 mb-2">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Occupancy</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.guests} Adults
                        </p>
                        {booking.children > 0 && (
                          <p className="text-sm font-semibold text-gray-900 flex items-center">
                            <Baby className="w-3 h-3 mr-1" />
                            {booking.children} Children
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">
                          Max: {booking.roomDetails?.capacity}
                        </p>
                      </div>
                    </div>

                    {/* Payment & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200/80 gap-4">
                      <div className="flex flex-col w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1 flex-nowrap overflow-hidden">
                          <CreditCard className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="text-sm text-gray-600 whitespace-nowrap truncate">
                            {booking.paymentMethod}
                          </span>
                          {!booking.isPaid && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center shrink-0">
                              <Banknote className="w-3 h-3 mr-1" />
                              Unpaid
                            </span>
                          )}
                          {booking.isPaid && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium shrink-0">
                              Paid
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{booking.grandTotal?.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">total</span>
                        </div>
                      </div>

                      {/* Buttons container */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={() =>
                            navigate(`/rooms/${booking.roomDetails._id}`)
                          }
                          className="w-full sm:w-auto whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                        >
                           {booking.status === "cancelled" ? "Book Again" : "View Room"}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {booking.status === "cancelled" ? null : <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-[50%] sm:w-auto whitespace-nowrap bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                        >
                          Cancel Booking
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Bookings Found
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                You haven't made any reservations yet. Discover amazing hotels
                and create your first booking experience!
              </p>
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <Sparkles className="w-5 h-5 mr-3" />
                Explore Hotels
                <ChevronRight className="w-5 h-5 ml-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
