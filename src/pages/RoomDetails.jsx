import React, { useContext, useEffect, useState } from "react";
import {
  Star,
  Wifi,
  Tv,
  Snowflake,
  Mountain,
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Badge,
  Percent,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { HotelContext } from "../context/HotelContext";
import axios from "axios";
import { toast } from "react-toastify";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    BACKEND_URL,
    Rooms,
    currency,
    CartItem,
    BookingRoomDetails,
    favourites,
  } = useContext(HotelContext);

  const [roomDetails, setroomDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [availability, setAvailability] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const latestCheckOut =
    availability?.length > 0
      ? availability[availability.length - 1].checkOut.split("T")[0]
      : today;
  console.log("Last booked check-in:", latestCheckOut);

  useEffect(() => {
    if (Rooms.length > 0) {
      const foundRoom = Rooms.find((item) => item._id === id);
      setroomDetails(foundRoom);
      console.log(foundRoom);
      
    }
  }, [Rooms, id]);

  if (!roomDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading room details...
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === roomDetails.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? roomDetails.image.length - 1 : prev - 1
    );
  };

  console.log(CartItem);

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="w-5 h-5" />;
      case "TV":
        return <Tv className="w-5 h-5" />;
      case "Air Conditioning":
        return <Snowflake className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "Mountain View":
        return <Mountain className="w-5 h-5" />;
      case "Quick Check-in":
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please enter Booking Dates");
      return;
    }

    const chechin = new Date(checkIn);
    const chechOut = new Date(checkOut);

    if (chechOut <= chechin) {
      alert("Please select valid dates");
      return;
    }

    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/checkRoomAvalibility",
        { id, checkIn, checkOut }
      );
      if (data.isAvailable) {
        await BookingRoomDetails(id, checkIn, checkOut, guests, children);
        navigate("/Booking-page");
        console.log(data);
      } else {
        setAvailability(data.bookedDates);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (id) => {
    const isFav = favourites.some((item) => item._id === id);

    if (isFav) {
      return navigate("/favourite");
    }

    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/addtocart",
        { hotelId: id },
        { headers: { token } }
      );
      if (data.success) {
        navigate("/favourite");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pr-5 gap-6">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4 mb-5 pr-3">
              {/* Room Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {roomDetails.type.charAt(0).toUpperCase() +
                  roomDetails.type.slice(1)}{" "}
                Room #{roomDetails.roomNumber}
              </h1>

              {/* Best Seller Badge */}
              {roomDetails.isBestSeller && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                  <Badge className="w-4 h-4" />
                  Best Seller
                </span>
              )}

              {/* Featured Badge */}
              {roomDetails.isFeatured && (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4" />
                  Featured
                </span>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(roomDetails._id)}
                className="sm:ml-auto flex items-center gap-2 px-5 py-2 bg-red-400 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                {favourites.some((item) => item._id === id)
                  ? "Favourite"
                  : "Add to Fav"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{roomDetails.rating}</span>
                <span className="whitespace-nowrap">
                  ({roomDetails.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span className="whitespace-nowrap">
                  {roomDetails.bookedCount} people booked
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {currency}
              {roomDetails.pricePerNight.toLocaleString()}
              <span className="text-lg text-gray-500 font-normal">/night</span>
            </div>
            {roomDetails.offer && (
              <div className="bg-green-100 text-green-800 whitespace-nowrap px-3 py-1 rounded-full text-sm font-semibold mt-2 flex items-center justify-center gap-1">
                {roomDetails.offer}% Discount
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden">
                <img
                  src={roomDetails.images[currentImageIndex]}
                  alt={`Room ${roomDetails.roomNumber}`}
                  className="w-full h-full object-cover"
                />
                {roomDetails.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {roomDetails.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {roomDetails.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {roomDetails.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Room view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Room
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {roomDetails.description}
              </p>
            </div>

            {/* Amenities */}
            {roomDetails.amenities && roomDetails.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Amenities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomDetails.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* getAmenityIcon should return a React icon component */}
                      {getAmenityIcon(amenity.trim())}
                      <span className="font-medium text-gray-700">
                        {amenity.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {roomDetails.features && roomDetails.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Special Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {roomDetails.features.map((feature,index)=>(
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        {feature.trim()}
                      </span>
                    </div>
                 ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Book This Room
              </h3>

              {/* Booking Form */}
              <div className="space-y-4">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={latestCheckOut}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(roomDetails.capacity)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1} Guest{index + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Children */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(4)].map((_, index) => (
                      <option key={index} value={index}>
                        {index} {index <= 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total per night:</span>
                    <span className="text-blue-600">
                      {currency}
                      {roomDetails.pricePerNight.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 
                    ${
                      !isLoading
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {isLoading ? "Processing..." : "Book Now"}
                </button>

                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-4">
                  <Calendar className="w-4 h-4" />
                  <span>Free cancellation up to 24 hours before check-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
