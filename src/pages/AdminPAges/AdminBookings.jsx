import React, { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/HotelContext";
import axios from "axios";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Users,
  Baby,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminBookings = () => {
  const { BACKEND_URL } = useContext(HotelContext);
  const token = localStorage.getItem("admintoken");
  const [bookings, setBookings] = useState([]);

  const fetchBookingsForAdmin = async () => {
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/adminAllBookings",
        {},
        { headers: { token } }
      );
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log("❌ Error fetching bookings:", error);
    }
  };

  const handlePayAtCheckIn = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to mark this booking as Paid at Check-in?"
    );
    if (!confirmAction) return;

    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/changeIsPaid",
        { BookingId: id },
        { headers: { token } }
      );

      if (data.success) {
        console.log(data.message);
        fetchBookingsForAdmin();
        toast.success("Updated UnPaid to Paid");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookingsForAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Bookings Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage and overview all hotel reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {bookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Not Paid</p>
                <p className="text-3xl font-bold text-red-600">
                  {bookings.filter((b) => b.isPaid === false).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              Bookings will appear here when customers make reservations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                {/* Header with Status and Payment */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full
    ${
      booking.status === "confirmed"
        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
        : booking.status === "checked-in"
          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
          : booking.status === "checked-out"
            ? "bg-gradient-to-r from-gray-100 to-slate-200 text-gray-700"
            : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
    }`}
                  >
                    {booking.status === "confirmed"
                      ? "✓ Confirmed"
                      : booking.status === "checked-in"
                        ? "🏨 Checked-in"
                        : booking.status === "checked-out"
                          ? "✔ Checked-out"
                          : "❌ Cancelled"}
                  </span>

                  <div className="flex items-center gap-2">
                    {booking.isPaid ? (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Paid
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          booking.status !== "cancelled" &&
                          handlePayAtCheckIn(booking._id)
                        }
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                        ${
                          booking.status === "cancelled"
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none"
                            : "bg-red-100 text-red-700 cursor-pointer"
                        }`}
                      >
                        <XCircle className="w-3 h-3" />
                        Unpaid
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {booking.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{booking.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm">{booking.phone}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4 mb-6">
                  {/* Check-in/Check-out */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Stay Duration
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
                      <div className="text-center">
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Room and Guests Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          Guests
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {booking.guests}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Baby className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          Children
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {booking.children}
                      </p>
                    </div>
                  </div>

                  {/* Room Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Room Number:</span>
                    <span className="font-bold  bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                      {booking.roomDetails?.roomNumber || "N/A"}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Payment Method:
                    </span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      {booking.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Grand Total
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{booking.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
