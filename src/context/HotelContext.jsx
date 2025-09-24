import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const HotelContext = createContext();

const HotelContextProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const currency = "₹";

  // States
  const [User, setUser] = useState(null);
  const [Rooms, setRooms] = useState([]);
  const [CartItem, setCartItem] = useState({});
  const [roomDetails, setRoomDetails] = useState(null);
  const [Carttotal, setCarttotal] = useState(0);
  const [favourites, setFavourites] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [Admin, setAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [token, settoken] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);

  // Booking details function (memoized)
  const BookingRoomDetails = useCallback((roomId, checkIn, checkOut, guests, children) => {
    setCartItem({ Id: roomId, checkIn, checkOut, guests, children });
  }, []);

  // Fetch stats
  const fetchStats = async () => {
    try {
      if (!adminToken) return;

      const [revenueRes, bookingRes] = await Promise.all([
        axios.post(`${BACKEND_URL}/api/admin/totalRevenue`, {}, { headers: { token: adminToken } }),
        axios.post(`${BACKEND_URL}/api/admin/totalBookings`, {}, { headers: { token: adminToken } }),
      ]);

      if (revenueRes.data.success) {
        setTotalRevenue(revenueRes.data.totalRevenue.toLocaleString());
      }
      if (bookingRes.data.success) {
        setTotalBooking(bookingRes.data.totalNumberBookings.toLocaleString());
      }
    } catch (err) {
      console.error("Error fetching stats:", err.message);
    }
  };

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/user/rooms`);
      if (data.success) {
        const parsedRooms = data.rooms.map((room) => ({
          ...room,
          amenities: room.amenities ?? [],
          features: room.features ?? [],
        }));
        setRooms(parsedRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
    }
  };

  // Restore tokens & user
  useEffect(() => {
    const storedAdminToken = localStorage.getItem("admintoken");
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
      setAdmin(true);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch rooms once
  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch stats every 15s if admin
  useEffect(() => {
    if (adminToken) {
      fetchStats();
      const interval = setInterval(fetchStats, 15000);
      return () => clearInterval(interval);
    }
  }, [adminToken]);

  // Context value (memoized to prevent re-renders)
  const value = useMemo(() => ({
    BACKEND_URL,
    currency,
    User,
    setUser,
    Rooms,
    setRooms,
    CartItem,
    setCartItem,
    BookingRoomDetails,
    roomDetails,
    setRoomDetails,
    formData,
    setFormData,
    Carttotal,
    setCarttotal,
    Admin,
    setAdmin,
    adminToken,
    setAdminToken,
    token,
    settoken,
    favourites,
    setFavourites,
    totalRevenue,
    totalBooking,
  }), [
    BACKEND_URL,
    currency,
    User,
    Rooms,
    CartItem,
    roomDetails,
    formData,
    Carttotal,
    Admin,
    adminToken,
    token,
    favourites,
    totalRevenue,
    totalBooking,
  ]);

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};

export default HotelContextProvider;
