import React, { useContext, memo } from "react";
import { HotelContext } from "../context/HotelContext";
import { Link } from "react-router-dom";

const RoomComponent = ({ room }) => {
  const { currency } = useContext(HotelContext);

  if (!room) return null;

  // ✅ Safe JSON parsing (handles string or array)
  const parseData = (data) => {
    try {
      if (Array.isArray(data)) {
        if (data.length === 1 && typeof data[0] === "string") {
          return JSON.parse(data[0]);
        }
        return data;
      }
      if (typeof data === "string") {
        return JSON.parse(data);
      }
      return data || [];
    } catch (err) {
      console.error("Parsing error:", err);
      return [];
    }
  };

  const features = parseData(room.features);
  const amenities = parseData(room.amenities);

  const getStatusStyles = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "booked":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
    >
      {/* 🔹 Image */}
      <div className="relative overflow-hidden">
        <img
          src={room.images?.[0] || "/images/placeholder-room.jpg"}
          alt={`Room ${room.roomNumber}`}
          loading="lazy"
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusStyles(
              room.status
            )}`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${room.status === "available" ? "bg-emerald-400" : ""}`}
            />
            {room.status}
          </span>
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {room.isBestSeller && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
              🔥 Best Seller
            </span>
          )}
          {room.isFeatured && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* 🔹 Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Room {room.roomNumber}
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
            ⭐ {room.rating}
          </div>
        </div>
        <p className="text-lg font-semibold text-indigo-600">{room.type}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {room.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {currency}
              {room.pricePerNight?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/ night</span>
          </div>
          {room.offer && (
            <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-sm">
              {room.offer}% Discount
            </span>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">
              Key Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {features.slice(0, 2).map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 rounded-lg px-3 py-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium">{room.reviews} reviews</span>
            <span>•</span>
            <span>Booked {room.bookedCount} times</span>
          </div>
          <button className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default memo(RoomComponent);
