import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon, Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/analytics/");
        //    analyticsData,
        // dailySalesData,
        console.log("fetchAnalyticsData", res.data);
        setAnalyticsData(res.data.analyticsData);
        setDailySalesData(res.data.dailySalesData);
        setIsLoading(false);
      } catch (error) {
        console.log("error in fetchAnalyticsData", error);
        toast.error(
          error.response.data.message || "Error in fetchAnalyticsData",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6 mb-8">
        <AnalyticsCard
          title="Total user"
          value={analyticsData?.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Producs"
          value={analyticsData?.products.toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData?.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={analyticsData?.totalRevenue.toLocaleString()}
          icon={DollarSign}
          color="from-emerald-500 to-teal-700"
        />
      </div>
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#D1D5DB"
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              tick={{ fill: "#D1D5DB", fontSize: 12 }}
              tickFormatter={(d) => {
                try {
                  return new Date(d).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                } catch (e) {
                  return d;
                }
              }}
            />
            <YAxis
              yAxisId="left"
              stroke="#D1D5DB"
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              tick={{ fill: "#D1D5DB", fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#D1D5DB"
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              tick={{ fill: "#D1D5DB", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue" || name === "revenue")
                  return [`$${Number(value).toLocaleString()}`, name];
                return [Number(value).toLocaleString(), name];
              }}
              labelFormatter={(label) => {
                try {
                  return new Date(label).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                } catch (e) {
                  return label;
                }
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <div className="flex justify-center items-center">
        <div className="z-30">
          <p>{title}</p>
          <h3>{value}</h3>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
      <div className="absolute -bottom-0 -right-4 text-emerald-800 opacity-50">
        <Icon className="h-32 w-32" />
      </div>
    </div>
  </motion.div>
);
