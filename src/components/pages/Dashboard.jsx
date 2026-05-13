// src/pages/Dashboard.jsx

import React from "react";

import { MdArticle, MdPeople, MdCategory, MdVisibility } from "react-icons/md";

import StatsCard from "../../components/dashboard/StatsCard";
import AnalyticsChart from "../../components/dashboard/AnalyticsChart";

const Dashboard = () => {
  const statsData = [
    {
      title: "Total News",
      value: "1,245",
      growth: 12,
      path: "/news",
      icon: <MdArticle size={28} />,
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },

    {
      title: "Total Users",
      value: "8,420",
      growth: 18,
      path: "/users",
      icon: <MdPeople size={28} />,
      gradient: "bg-gradient-to-br from-indigo-600 to-blue-500",
    },

    {
      title: "Categories",
      value: "32",
      growth: 8,
      path: "/category",
      icon: <MdCategory size={28} />,
      gradient: "bg-gradient-to-br from-cyan-500 to-sky-500",
    },

    {
      title: "Total Views",
      value: "98K",
      growth: 25,
      path: "/analytics",
      icon: <MdVisibility size={28} />,
      gradient: "bg-gradient-to-br from-slate-700 to-slate-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1
          className="
            text-3xl md:text-4xl
            font-bold
            text-slate-900
          "
        >
          Dashboard Overview 🚀
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back! Here's what’s happening today.
        </p>
      </div>

      {/* STATS GRID */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        {statsData.map((item, index) => (
          <StatsCard
            key={index}
            title={item.title}
            value={item.value}
            growth={item.growth}
            icon={item.icon}
            gradient={item.gradient}
            path={item.path}
          />
        ))}
      </div>

      {/* ANALYTICS SECTION */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >
        {/* LEFT CHART */}
        <div className="lg:col-span-2 min-w-0">
          <AnalyticsChart />
        </div>

        {/* RIGHT TRENDING CARD */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            shadow-sm
            border border-slate-200
            min-w-0
          "
        >
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Trending News 🔥
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Most viewed stories today
            </p>
          </div>

          {/* News List */}
          <div className="mt-6 space-y-6">
            {/* Item */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="
                    font-semibold
                    text-slate-800
                    truncate
                  "
                >
                  AI Revolution
                </h3>

                <p className="text-sm text-slate-500">12K Views</p>
              </div>

              <span
                className="
                  shrink-0
                  bg-green-100
                  text-green-600
                  px-3 py-1
                  rounded-xl
                  text-sm font-medium
                "
              >
                +18%
              </span>
            </div>

            {/* Item */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="
                    font-semibold
                    text-slate-800
                    truncate
                  "
                >
                  Election Updates
                </h3>

                <p className="text-sm text-slate-500">8K Views</p>
              </div>

              <span
                className="
                  shrink-0
                  bg-blue-100
                  text-blue-600
                  px-3 py-1
                  rounded-xl
                  text-sm font-medium
                "
              >
                +12%
              </span>
            </div>

            {/* Item */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="
                    font-semibold
                    text-slate-800
                    truncate
                  "
                >
                  Crypto Market
                </h3>

                <p className="text-sm text-slate-500">5K Views</p>
              </div>

              <span
                className="
                  shrink-0
                  bg-cyan-100
                  text-cyan-600
                  px-3 py-1
                  rounded-xl
                  text-sm font-medium
                "
              >
                +9%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
