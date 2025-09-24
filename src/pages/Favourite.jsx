import React, { useContext, useEffect, useState } from "react";
import { HotelContext } from "../context/HotelContext";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Favourite = () => {
  const navigate = useNavigate();
  const { BACKEND_URL, currency,favourites, setFavourites } = useContext(HotelContext);


  const fetchFavourites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(BACKEND_URL + "/api/user/getcart", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.success) {
        setFavourites(data.cart);
      }
    } catch (error) {
      console.error("❌ Fetch Favourites Error:", error.message);
    }
  };

  const removeFromFavourites = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/removefromcart",
        { hotelId: id },
        { headers: { token } }
      );
      if(data.success){
        fetchFavourites()
      }
      
    } catch (error) {
      console.error("❌ remove Favourites Error:", error.message);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 text-center mb-12">
          Your Favourites ❤️
        </h1>

        {/* Empty State */}
        {favourites.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <FaHeart className="text-5xl text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              No favourites yet
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Browse our collection of hotels and add rooms to your favourites
              to compare and book later.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {favourites.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition"
              >
                {/* Room Image */}
                <div className="relative">
                  <img
                    src={room.images?.[0] || "/images/placeholder.jpg"}
                    alt={room.name}
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={() => removeFromFavourites(room._id)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-red-100 transition"
                  >
                    <FaHeart className="text-red-500 text-xl" />
                  </button>
                </div>

                {/* Room Info */}
                <div className="p-6 space-y-3">
                  <h2 className="text-lg font-semibold text-slate-800 truncate">
                    { room.type + " Room"} {"#"+room.roomNumber}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {room.description ||
                      "Experience luxury and comfort in our premium accommodations."}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-blue-700">
                      {currency}
                      {room.pricePerNight?.toLocaleString() || "0"}
                    </span>
                    <button onClick={()=>navigate(`/rooms/${room._id}`)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow hover:scale-105 transition">
                      View Details
                    </button>
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

export default Favourite;
