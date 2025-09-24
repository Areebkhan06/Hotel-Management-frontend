import React, { useContext, useEffect, useState } from "react";
import { HotelContext } from "../context/HotelContext";
import {
  Calendar,
  Users,
  Baby,
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Shield,
  CreditCard,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingPage = () => {
  const {
    BACKEND_URL,
    currency,
    CartItem,
    Rooms,
    roomDetails,
    setRoomDetails,
    formData,
    setFormData,
    setCarttotal,
  } = useContext(HotelContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (CartItem?.Id) {
      const details = Rooms.find((room) => room._id === CartItem.Id);
      setRoomDetails(details || null);
    }
  }, [CartItem, Rooms]);

  if (!CartItem || !CartItem.Id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            No booking selected
          </p>
          <p className="text-gray-400">Please select a room to continue</p>
        </div>
      </div>
    );
  }

  // Calculate nights
  const nights =
    (new Date(CartItem.checkOut) - new Date(CartItem.checkIn)) /
    (1000 * 60 * 60 * 24);

  const taxCalculator = (total) => {
    total = Number(total);
    if (total <= 1000) {
      return 0;
    } else if (total <= 7500) {
      return total * 0.12;
    } else {
      return total * 0.18;
    }
  };

  const ShowingHowmuchTaxPaying = (total) => {
    total = Number(total);
    if (total <= 1000) {
      return 0;
    } else if (total <= 7500) {
      return 12;
    } else {
      return 18;
    }
  };

  // Total Price
  const totalPrice = roomDetails ? nights * roomDetails.pricePerNight : 0;

  const GranTotal = Math.round(totalPrice + taxCalculator(totalPrice));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Check if any field in formData is empty
    const isEmpty = Object.values(formData).some(
      (value) => !value || value.trim() === ""
    );

    if (isEmpty) {
      alert("Please fill in all required fields.");
      return; // stop submission
    }

    console.log("Booking submitted:", {
      ...CartItem,
      ...formData,
      roomDetails,
      GranTotal,
    });

    console.log(roomDetails._id);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/bookingDetails",
        {
          grandTotal: GranTotal,
          checkIn: CartItem.checkIn,
          checkOut: CartItem.checkOut,
          children: CartItem.children,
          guests: CartItem.guests,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roomDetails: roomDetails._id,
        },
        { headers: { token } }
      );

      if (data.success) {
        console.log(data);
        localStorage.setItem("bookingId", data.order._id);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }

    setCarttotal(GranTotal);
    navigate("/payment-method");
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      WiFi: Wifi,
      Parking: Car,
      Coffee: Coffee,
      TV: Tv,
      Bathroom: Bath,
    };
    return icons[amenity] || Coffee;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 mt-2">
                Review your selection and provide guest details
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Booking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {roomDetails && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                    {roomDetails.images.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group overflow-hidden rounded-xl"
                      >
                        <img
                          src={img}
                          alt={roomDetails.type}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      Premium Room
                    </span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {roomDetails.type}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>Room No: {roomDetails.roomNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-yellow-700">
                          {roomDetails.rating}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        ({roomDetails.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {roomDetails.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-blue-500" />
                      Room Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {roomDetails.amenities.map((amenity, idx) => {
                        const IconComponent = getAmenityIcon(amenity);
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <IconComponent className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700 text-sm font-medium">
                              {amenity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guest Information Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Guest Information
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Booking Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Booking Summary
                </h3>

                {/* Dates */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">
                          {CartItem.checkIn}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-900">
                          {CartItem.checkOut}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Adults</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {CartItem.guests}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Baby className="w-5 h-5 text-pink-500" />
                      <span className="font-medium text-gray-900">
                        Children
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {CartItem.children}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {nights} nights
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Room rate per night</span>
                    <span>
                      {currency}
                      {roomDetails?.pricePerNight?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Number of nights</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t">
                    <span>Nights Total</span>
                    <span className="text-blue-600">
                      {currency}
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t">
                    <span>
                      Tax <span>{ShowingHowmuchTaxPaying(totalPrice)}%</span>
                    </span>
                    <span className="text-blue-600">
                      {currency}
                      {(taxCalculator(totalPrice) || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t">
                    <span>Grand Total</span>
                    <span className="text-blue-600">
                      {currency}
                      {GranTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Confirm Booking
              </button>

              {/* Security Notice */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Secure Payment
                  </p>
                  <p className="text-xs text-green-600">
                    Your information is encrypted and secure
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

export default BookingPage;
