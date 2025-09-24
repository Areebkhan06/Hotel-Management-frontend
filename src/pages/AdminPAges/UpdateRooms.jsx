import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HotelContext } from "../../context/HotelContext";
import { toast } from "react-toastify";
import { useState } from "react";
const UpdateRooms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(HotelContext);
  const token = localStorage.getItem("admintoken");
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoom = async () => {
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/fetchRoom",
        { id },
        { headers: { token } }
      );

      if (data.success) {
        console.log(data);

        const normalizeArray = (arr) => {
          if (!Array.isArray(arr)) return [];

          return arr.flatMap((item) => {
            try {
              // Try parsing JSON if it’s a stringified array
              if (
                typeof item === "string" &&
                item.startsWith("[") &&
                item.endsWith("]")
              ) {
                return JSON.parse(item);
              }
              // Otherwise, just return the string
              return item;
            } catch {
              return item;
            }
          });
        };

        setRoomData({
          ...data.room,
          amenities: normalizeArray(data.room.amenities),
          features: normalizeArray(data.room.features),
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  console.log(roomData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/updateRoom",
        { roomData },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/admin-pannel/rooms");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const amenitiesList = [
    "WiFi",
    "TV",
    "Air Conditioning",
    "Mini Fridge",
    "Balcony",
  ];
  const featuresList = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Flat-screen TV",
    "Mini Fridge",
    "Room Service",
    "Coffee Maker",
    "Private Bathroom",
    "Balcony",
    "In-room Safe",
    "Toiletries",
  ];

  const RoomSkeleton = () => {
    return (
      <div className="animate-pulse min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-40 bg-white/30 rounded"></div>
              <div className="h-8 w-16 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-8 space-y-8">
            {/* Grid inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-40 bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <RoomSkeleton />;
  if (!roomData) return <div className="text-center">Room not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between text-white">
            <h1 className="text-3xl font-bold">Update Room</h1>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="text-xl font-semibold text-black">
                #{roomData.roomNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Room Type
              </label>
              <input
                type="text"
                name="type"
                value={roomData.type}
                onChange={handleChange}
                placeholder="Room Type"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Price Per Night ($)
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={roomData.pricePerNight}
                onChange={handleChange}
                placeholder="Price Per Night"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Capacity (Guests)
              </label>
              <input
                type="number"
                name="capacity"
                value={roomData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Offer (%)
              </label>
              <input
                type="text"
                name="offer"
                value={roomData.offer}
                onChange={handleChange}
                placeholder="Discount percentage"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={roomData.description}
              onChange={handleChange}
              placeholder="Room description..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200 resize-none"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-800">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={roomData.amenities.includes(amenity)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRoomData((prev) => ({
                        ...prev,
                        amenities: prev.amenities.includes(value)
                          ? prev.amenities.filter((item) => item !== value)
                          : [...prev.amenities, value],
                      }));
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-800">Features</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuresList.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    value={feature}
                    checked={roomData.features.includes(feature)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRoomData((prev) => ({
                        ...prev,
                        features: prev.features.includes(value)
                          ? prev.features.filter((item) => item !== value)
                          : [...prev.features, value],
                      }));
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4 overflow-hidden">
            <label className="text-lg font-bold text-gray-800">
              Room Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg overflow-hidden">
              {roomData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`room-${index}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </div>

          {/* Special Options */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={roomData.isBestSeller}
                onChange={handleChange}
                className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="font-semibold text-gray-700">Best Seller</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                name="isFeatured"
                checked={roomData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="font-semibold text-gray-700">Featured</span>
            </label>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Room Status
            </label>
            <select
              name="status"
              value={roomData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="checked-in">Checked In</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Update Room Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRooms;
