import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import toast from "react-hot-toast";

import { getAllNews } from "../../api/newsApi";

const AnalyticsChart = () => {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD NEWS
  // ================================

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const response = await getAllNews();

        setNews(response?.news || []);
      } catch (error) {
        console.error("Analytics News Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load analytics data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // ================================
  // WEEK DAYS
  // ================================

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ================================
  // DYNAMIC WEEKLY DATA
  // ================================

  const chartData = useMemo(() => {
    const weeklyData = days.map((day) => ({
      name: day,
      views: 0,
    }));

    news.forEach((item) => {
      if (!item.createdAt) return;

      const date = new Date(item.createdAt);

      if (isNaN(date.getTime())) return;

      const day = date.getDay();

      // JavaScript:
      // Sunday = 0
      // Monday = 1
      // ...
      // Saturday = 6

      const dayIndex = day === 0 ? 6 : day - 1;

      weeklyData[dayIndex].views += Number(item.views) || 0;
    });

    return weeklyData;
  }, [news]);

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-5 md:p-6
        shadow-sm
        border border-slate-200
      "
    >
      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Weekly Analytics</h2>

        <p className="text-slate-500 text-sm mt-1">News engagement overview</p>
      </div>

      {/* ================================
          CHART
      ================================= */}

      <div className="h-[300px]">
        {loading ? (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
              text-slate-500
            "
          >
            Loading analytics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              {/* GRADIENT */}
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />

                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* X AXIS */}
              <XAxis dataKey="name" axisLine={false} tickLine={false} />

              {/* Y AXIS */}
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />

              {/* TOOLTIP */}
              <Tooltip />

              {/* AREA */}
              <Area
                type="monotone"
                dataKey="views"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
