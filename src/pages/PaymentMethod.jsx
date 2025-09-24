import React, { useContext, useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  Wallet,
  Building2,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Car,
  Utensils,
} from "lucide-react";
import { HotelContext } from "../context/HotelContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentMethod = () => {
  const { BACKEND_URL, currency, Carttotal, formData } =
    useContext(HotelContext);

  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState("checkin");
  const [booking, setBooking] = useState(null);
  const [roomDetails, setroomDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-sdk")) {
        resolve(true); // already loaded
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingId = localStorage.getItem("bookingId");
        const token = localStorage.getItem("token");

        if (!bookingId) return;

        const { data } = await axios.post(
          BACKEND_URL + "/api/user/fetchBookingDetails",
          { bookingId },
          { headers: { token } } // 👈 headers must be the 3rd argument
        );

        if (data.success) {
          setBooking(data.order);
          setroomDetails(data.order.roomDetails); // save booking details in state
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };

    fetchBookingDetails();
  }, []);

  const handlePayment = async () => {
    setLoading(true); // start loading
    try {
      const bookingId = localStorage.getItem("bookingId");
      const token = localStorage.getItem("token");

      if (selectedPayment === "checkin") {
        const { data } = await axios.post(
          BACKEND_URL + "/api/user/checkInPayment",
          { bookingId },
          { headers: { token } }
        );

        if (data.success) {
          navigate("/bookings");
          toast.success("Booking confirm");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          BACKEND_URL + "/api/user/razorpay",
          { bookingId },
          { headers: { token } }
        );

        if (!data.success) {
          alert("Failed to create order");
          return;
        }

        // ✅ Configure Razorpay options
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Hotel Booking",
          description: "Room Booking Payment",
          order_id: data.order.id,
          handler: async function (response) {
            // ✅ Send payment details to backend for verification
            const verify = await axios.post(
              BACKEND_URL + "/api/user/verifyPayment",
              {
                bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { token } }
            );

            if (verify.data.success) {
              alert("✅ Payment Successful!");
              window.location.href("/bookings");
            } else {
              alert("❌ Payment verification failed");
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Pay securely with cards, UPI, wallets & more",
      icon: <Wallet className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      id: "checkin",
      name: "Pay at Check-in",
      description: "Pay directly at the hotel during check-in",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600",
      popular: false,
    },
  ];

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-center text-gray-500 py-10 text-lg">
          No booking details available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 text-lg">
            Review your details and choose your preferred payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Room & Guest Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={roomDetails.images[0]}
                  alt={roomDetails.type}
                  className="w-full h-64 object-cover"
                />

                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">
                    {roomDetails.rating}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {roomDetails.type}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {roomDetails.description}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Check-in
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking?.checkIn).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Check-out
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking?.checkOut).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Guests
                      </p>
                      <p className="font-semibold text-gray-900">
                        {booking?.guests} Adults
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Children
                      </p>
                      <p className="font-semibold text-gray-900">
                        {booking?.children} Child
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Guest Information
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {booking?.name || "Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">
                      {booking?.phone || "Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-2 overflow-hidden">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 truncate">
                      {booking?.email || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Method
              </h4>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedPayment === method.id
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    {method.popular && (
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-lg`}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 text-lg">
                          {method.name}
                        </h5>
                        <p className="text-gray-600 text-sm mt-1">
                          {method.description}
                        </p>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-6 h-6 text-blue-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {currency}
                      {booking.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => handlePayment()}
                  disabled={loading} // 🔹 disable while processing
                  className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-700 hover:to-indigo-700 text-white font-bold 
                rounded-2xl transition-all duration-300 transform 
                hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 text-lg
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : selectedPayment === "razorpay" ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay with Razorpay
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>

                {selectedPayment === "checkin" && !loading && (
                  <p className="text-center text-gray-500 text-sm mt-3">
                    You can pay at the hotel reception during check-in
                  </p>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">
                    Secure & Protected
                  </p>
                  <p className="text-green-600 text-sm">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
