import React, { useContext, useEffect, useState } from "react";
import { Star, TrendingUp, Calendar, IndianRupee } from "lucide-react";
import { HotelContext } from "../../context/HotelContext";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { BACKEND_URL, totalRevenue, totalBooking } = useContext(HotelContext);
  const [GraphData, setGraphData] = useState([]);
  const token = localStorage.getItem("admintoken");

  const fetchGraphData = async () => {
    try {
      const { data } = await axios.post(
        BACKEND_URL + "/api/admin/month-sales",
        {},
        { headers: { token } }
      );

      if (data.success) {
        setGraphData(data.sales);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGraphData();
  }, []);

  const stats = [
    {
      title: "Occupancy Rate",
      value: "78%",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      iconBg: "bg-yellow-100",
    },
    {
      title: "New Bookings",
      value: totalBooking,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: <IndianRupee className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${item.iconBg} flex items-center justify-center`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Recent Activity List */}
        <div className="divide-y divide-gray-100 mb-6"></div>

        {/* Graph */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Monthly Sales & Bookings
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GraphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              {/* Revenue line */}
              <Line
                type="monotone" // smooth curve
                dataKey="sales"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false} // removes dots for smooth wave
                activeDot={{ r: 6 }}
                name="Revenue"
              />

              {/* Bookings line */}
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
