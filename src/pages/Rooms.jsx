import React, { useContext, useEffect, useState } from "react";
import { rooms } from "../assets/assests";
import RoomComponent from "../Components/RoomComponent";
import Title from "../Components/Title";
import { HotelContext } from "../context/HotelContext";

const Rooms = () => {
  const {Rooms} = useContext(HotelContext);
  const [AvailableRooms, setAvailableRooms] = useState([]);
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [isBestSeller, setisBestSeller] = useState(false);

  useEffect(() => {
    if (!Rooms || Rooms.length === 0) return;

    let updatedRooms = structuredClone(Rooms);

    // 2. Filter best sellers (if checkbox is on)
    if (isBestSeller) {
      updatedRooms = updatedRooms.filter((room) => room.isBestSeller);
    }

    // 3. Sort based on sortOrder
    updatedRooms.sort((a, b) =>
      sortOrder === "lowToHigh"
        ? a.pricePerNight - b.pricePerNight
        : b.pricePerNight - a.pricePerNight
    );

    // 4. Set to state
    setAvailableRooms(updatedRooms);
  }, [Rooms, sortOrder, isBestSeller]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-5">
        {/* Section Title */}
        <div className="text-center mb-12">
          <Title title1="Our" title2="Rooms" />
        </div>

        {/* Main content wrapper: Sidebar + Room Grid */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar */}
          <div className="xl:w-80 w-full">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              </div>

              {/* Sort Options */}
              <div className="space-y-4">
                {/* Sort by Price */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                    Sort by Price
                  </h3>

                  <div className="space-y-3">
                    {/* Low to High */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="sort"
                          value="lowToHigh"
                          checked={sortOrder === "lowToHigh"}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                            sortOrder === "lowToHigh"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 group-hover:border-blue-400"
                          }`}
                        >
                          {sortOrder === "lowToHigh" && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        Low to High
                      </span>
                    </label>

                    {/* High to Low */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="sort"
                          value="highToLow"
                          checked={sortOrder === "highToLow"}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                            sortOrder === "highToLow"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 group-hover:border-blue-400"
                          }`}
                        >
                          {sortOrder === "highToLow" && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        High to Low
                      </span>
                    </label>
                  </div>
                </div>

                {/* ✅ Best Seller Checkbox */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setisBestSeller(e.target.checked)}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      Show Best Sellers Only
                    </span>
                  </label>
                </div>

                {/* Room Count Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      Total Rooms
                    </span>
                    <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                      {AvailableRooms.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AvailableRooms.map((item, index) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-all duration-300 "
                >
                  <RoomComponent room={item} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {AvailableRooms.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Rooms Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
