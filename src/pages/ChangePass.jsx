import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HotelContext } from "../context/HotelContext";
import { toast } from "react-toastify";
import { LuEye, LuEyeOff } from "react-icons/lu";

const ChangePass = () => {
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(HotelContext);
  const location = useLocation();
  const email = location.state?.email;

  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  // strong password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please enter the new password");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setloading(true);
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/user/change-password",
        { email, password }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
        window.location.href = "/login";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong. Try again.");
    } finally {
      setloading(false);
    }
  };

  if(!email){
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600">
              Create a new password for{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>

              <div className="flex items-center relative">
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>

              {/* Password strength message */}
              {password && !strongPasswordRegex.test(password) && (
                <p className="text-sm text-red-500 mt-2">
                  Must be 8+ chars, include uppercase, lowercase, number, and
                  special char
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Make sure your password is strong and unique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
