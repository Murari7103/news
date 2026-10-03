import React, { useEffect, useMemo, useState } from "react";

import { MdArticle, MdCategory, MdVisibility, MdDrafts } from "react-icons/md";

import toast from "react-hot-toast";

import StatsCard from "../../components/dashboard/StatsCard";

import AnalyticsChart from "../../components/dashboard/AnalyticsChart";

import RecentNewsTable from "../Dashboard/RecentNewsTable";

import { getAllNews } from "../../api/newsApi";

import { getCategories } from "../../api/categoryApi";

const Dashboard = () => {
  // ================================
  // STATES
  // ================================

  const [news, setNews] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD DASHBOARD DATA
  // ================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [newsResponse, categoryResponse] = await Promise.all([
          getAllNews(),
          getCategories(),
        ]);

        setNews(newsResponse?.news || []);

        setCategories(categoryResponse?.categories || []);
      } catch (error) {
        console.error("Dashboard Data Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ================================
  // TOTAL NEWS
  // ================================

  const totalNews = news.length;

  // ================================
  // PUBLISHED NEWS
  // ================================

  const publishedNews = news.filter(
    (item) => item.status === "Published",
  ).length;

  // ================================
  // DRAFT NEWS
  // ================================

  const draftNews = news.filter((item) => item.status === "Draft").length;

  // ================================
  // TOTAL VIEWS
  // ================================

  const totalViews = news.reduce(
    (acc, item) => acc + (Number(item.views) || 0),
    0,
  );

  // ================================
  // TRENDING NEWS
  // ================================

  const trendingNews = useMemo(() => {
    return [...news]
      .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
      .slice(0, 3);
  }, [news]);

  // ================================
  // STATS DATA
  // ================================

  const statsData = [
    {
      title: "Total News",
      value: loading ? "..." : totalNews,
      growth: 12,
      path: "/dashboard/news",
      icon: <MdArticle size={28} />,
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },

    {
      title: "Published",
      value: loading ? "..." : publishedNews,
      growth: 18,
      path: "/dashboard/news",
      icon: <MdVisibility size={28} />,
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },

    {
      title: "Draft News",
      value: loading ? "..." : draftNews,
      growth: 8,
      path: "/dashboard/news",
      icon: <MdDrafts size={28} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    },

    {
      title: "Categories",
      value: loading ? "..." : categories.length,
      growth: 25,
      path: "/dashboard/category",
      icon: <MdCategory size={28} />,
      gradient: "bg-gradient-to-br from-slate-700 to-slate-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================================
          PAGE HEADER
      ================================= */}

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

      {/* ================================
          STATS GRID
      ================================= */}

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

      {/* ================================
          ANALYTICS SECTION
      ================================= */}

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

        {/* TRENDING */}
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
          {/* HEADER */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">Trending News</h2>

            <p className="text-slate-500 text-sm mt-1">Most viewed stories</p>
          </div>

          {/* LIST */}
          <div className="mt-6 space-y-6">
            {loading ? (
              <p className="text-slate-500 text-sm">Loading trending news...</p>
            ) : trendingNews.length > 0 ? (
              trendingNews.map((item, index) => (
                <div
                  key={item.newsId}
                  className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                >
                  <div className="min-w-0">
                    <h3
                      className="
                          font-semibold
                          text-slate-800
                          truncate
                        "
                    >
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {Number(item.views || 0)} Views
                    </p>
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
                    #{index + 1}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">
                No trending news available.
              </p>
            )}
          </div>

          {/* TOTAL VIEWS */}
          <div
            className="
              mt-8
              p-5
              rounded-2xl
              bg-slate-50
              border border-slate-200
            "
          >
            <p className="text-sm text-slate-500">Total Article Views</p>

            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? "..." : totalViews}
            </h3>
          </div>
        </div>
      </div>

      {/* ================================
          RECENT NEWS TABLE
      ================================= */}

      <RecentNewsTable />
    </div>
  );
};

export default Dashboard;
