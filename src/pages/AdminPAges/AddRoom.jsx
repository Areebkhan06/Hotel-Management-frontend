import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { HotelContext } from "../../context/HotelContext";
import { toast } from "react-toastify";
const AddRoom = () => {
  const { token, BACKEND_URL } = useContext(HotelContext); // Commented for demo
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: "",
    status: "available",
    description: "",
    images: [null, null, null, null],
    amenities: [],
    features: [],
    capacity: "",
    rating: "",
    reviews: "",
    isBestSeller: false,
    isFeatured: false,
    offer: "",
  });

  const allAmenities = [
    "WiFi",
    "TV",
    "Air Conditioning",
    "Mini Fridge",
    "Balcony",
  ];
  const allFeatures = [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "rating") {
      let num = parseFloat(value);
      if (isNaN(num)) num = "";
      if (num > 5) num = 5;
      if (num < 1 && num !== "") num = 1;
      setFormData({ ...formData, [name]: num });
    } else if (name === "amenities") {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((item) => item !== value),
      }));
    } else if (name === "features") {
      setFormData((prev) => ({
        ...prev,
        features: checked
          ? [...prev.features, value]
          : prev.features.filter((item) => item !== value),
      }));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (index, file) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = file;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    console.log(formData);

    const fd = new FormData();

    // Append text fields
    fd.append("roomNumber", formData.roomNumber);
    fd.append("type", formData.type);
    fd.append("pricePerNight", formData.pricePerNight);
    fd.append("status", formData.status);
    fd.append("description", formData.description);
    fd.append("rating", formData.rating);
    fd.append("reviews", formData.reviews);
    fd.append("isBestSeller", formData.isBestSeller);
    fd.append("isFeatured", formData.isFeatured);
    fd.append("offer", formData.offer);
    fd.append("capacity", formData.capacity);

    // Append arrays
    formData.amenities.forEach((item) => fd.append("amenities[]", item));
    formData.features.forEach((item) => fd.append("features[]", item));

    // Append files
    formData.images.forEach((file) => {
      if (file) fd.append("images", file);
    });

    try {
      const response = await axios.post(
        BACKEND_URL + "/api/admin/add-room",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token || localStorage.getItem("admintoken"),
          },
        }
      );
      if (response.data.success) {
        toast.success("Room Added");
        setFormData(initialFormData);
      }
      if (
        response.data.success === false &&
        response.data.message === "Invalid or expired token"
      ) {
        // ✅ clear token & logout
        localStorage.removeItem("admintoken");
        window.location.href = "/admin-pannel"; // or navigate("/login") if using React Router
      } else {
        console.error(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Add New Room
            </h1>
            <p className="text-gray-600 text-center">
              Fill in the details to add a new room to your hotel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    placeholder="Enter room number"
                    value={formData.roomNumber || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">-- Select Room Type --</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Enter room number"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Night ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    placeholder="Enter price"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="available">Available</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter room description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                />
              </div>
            </div>

            {/* Amenities and Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Amenities & Features
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities
                  </label>
                  <div className="space-y-3">
                    {allAmenities.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-white rounded-lg p-2 transition duration-150"
                      >
                        <input
                          type="checkbox"
                          name="amenities"
                          value={item}
                          checked={formData.amenities?.includes(item)}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Features
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {allFeatures.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-white rounded-lg p-2 transition duration-150"
                      >
                        <input
                          type="checkbox"
                          name="features"
                          value={item}
                          checked={formData.features?.includes(item)}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Rating & Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Enter rating"
                    min={1}
                    max={5}
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    placeholder="Enter review count"
                    value={formData.reviews}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Room Images */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Room Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Image {i + 1}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageChange(i, e.target.files[0])
                        }
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                        accept="image/*"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Options */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Special Options
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-8">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 font-medium whitespace-nowrap">
                      Best Seller
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 font-medium">Featured</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Offer
                  </label>
                  <input
                    type="text"
                    name="offer"
                    placeholder="Enter special offer details"
                    value={formData.offer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {!loading ? "Add Room" : "Adding Room.."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
