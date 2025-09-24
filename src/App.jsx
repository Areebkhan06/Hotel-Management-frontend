import React, { useContext, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { HotelContext } from "./context/HotelContext";
import AdminBookings from "./pages/AdminPAges/AdminBookings";
import NotFound from "./pages/NotFound";
import { ToastContainer, toast } from "react-toastify";
import Guests from "./pages/AdminPAges/Guests";
import ForgetPass from "./pages/ForgetPass";
import VerifyOtp from "./pages/VerifyOtp";
import ChangePass from "./pages/ChangePass";
import UpdateRooms from "./pages/AdminPAges/UpdateRooms";
import { Loader2 } from "lucide-react";
// 🔹 Lazy load big pages
const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const RoomDetails = lazy(() => import("./pages/RoomDetails"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const PaymentMethod = lazy(() => import("./pages/PaymentMethod"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Favourite = lazy(() => import("./pages/Favourite"));
const Contact = lazy(() => import("./pages/Contact"));

// 🔹 Lazy load auth pages
const LoginUser = lazy(() => import("./Components/LoginUser"));
const RegisterUser = lazy(() => import("./Components/RegisterUser"));

// 🔹 Lazy load admin pages
const AdminLogin = lazy(() => import("./pages/AdminPAges/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/AdminPAges/AdminLayout"));
const AddRoom = lazy(() => import("./pages/AdminPAges/AddRoom"));
const AllRooms = lazy(() => import("./pages/AdminPAges/AllRooms"));
const Dashboard = lazy(() => import("./pages/AdminPAges/Dashboard"));

const App = () => {
  const { Admin } = useContext(HotelContext);
  const { pathname } = useLocation();

  // routes where Navbar & Footer should be hidden
  const hideLayoutRoutes = [
    "/admin-pannel",
    "/login",
    "/signup",
    "/forget-password",
    "/verify",
    "/change-pass",
  ];
  const hideLayout = hideLayoutRoutes.some((route) => pathname.includes(route));

  return (
    <div
      className={`${
        !hideLayout ? "px-2 sm:px-[2vw] md:px-[2vw] lg:px-[0vw]" : ""
      }`}
    >
      <ToastContainer />
      {/* Show Navbar only if not in hidden routes */}
      {!hideLayout && <Navbar />}

      {/* 🔹 Suspense fallback for lazy loading */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-[#ff7518] to-[#FDEE00] rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                  <Loader2 className="animate-spin h-12 w-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Loading
              </h3>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/Booking-page" element={<BookingPage />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Auth */}
          <Route path="/login" element={<LoginUser />} />
          <Route path="/signup" element={<RegisterUser />} />
          <Route path="/forget-password" element={<ForgetPass />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="/change-pass" element={<ChangePass />} />

          {/* Admin Panel (Protected) */}
          <Route
            path="/admin-pannel"
            element={Admin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="rooms" element={<AllRooms />} />
            <Route path="update/:id" element={<UpdateRooms />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="guests" element={<Guests />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Show Footer only if not in hidden routes */}
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
