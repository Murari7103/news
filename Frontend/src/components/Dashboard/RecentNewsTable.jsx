import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { MdVisibility, MdEdit, MdRefresh } from "react-icons/md";

import toast from "react-hot-toast";

import { getAllNews } from "../../api/newsApi";

const RecentNewsTable = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD RECENT NEWS
  // ================================

  const loadRecentNews = async () => {
    try {
      setLoading(true);

      const response = await getAllNews();

      const allNews = response?.news || [];

      // Latest 5 news
      const recentNews = [...allNews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setNews(recentNews);
    } catch (error) {
      console.error("Recent News Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load recent news",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    loadRecentNews();
  }, []);

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-sm
        border border-slate-200
        overflow-hidden
      "
    >
      {/* ================================
          HEADER
      ================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          items-start
          sm:items-center
          justify-between
          gap-4
          p-6
          border-b border-slate-200
        "
      >
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recent News 📰</h2>

          <p className="text-sm text-slate-500 mt-1">
            Latest news articles added to the system.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRecentNews}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-slate-100
            text-slate-700
            text-sm
            font-medium
            hover:bg-slate-200
            transition
            disabled:opacity-50
          "
        >
          <MdRefresh size={19} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ================================
          TABLE
      ================================= */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                News
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="
                    px-6
                    py-12
                    text-center
                  "
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
                        w-9
                        h-9
                        border-4
                        border-slate-200
                        border-t-blue-500
                        rounded-full
                        animate-spin
                      "
                    />

                    <p className="text-sm text-slate-500">
                      Loading recent news...
                    </p>
                  </div>
                </td>
              </tr>
            ) : news.length > 0 ? (
              news.map((item) => (
                <tr
                  key={item.newsId}
                  className="
                    border-t
                    border-slate-100
                    hover:bg-slate-50
                    transition
                  "
                >
                  {/* NEWS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.featuredImage ||
                          "https://via.placeholder.com/80x80?text=News"
                        }
                        alt={item.title}
                        className="
                          w-14
                          h-14
                          rounded-xl
                          object-cover
                          flex-shrink-0
                        "
                      />

                      <div className="min-w-0">
                        <h3
                          className="
                            font-semibold
                            text-slate-800
                            truncate
                            max-w-[350px]
                          "
                        >
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                          News ID: #{item.newsId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5">
                    {item.category ? (
                      <span
                        className="
                          inline-flex
                          px-3
                          py-1.5
                          rounded-xl
                          bg-blue-100
                          text-blue-700
                          text-xs
                          font-medium
                        "
                      >
                        {item.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">
                        No Category
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1.5
                        rounded-xl
                        text-xs
                        font-semibold
                        ${
                          item.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {/* VIEW */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/news/view/${item.newsId}`)
                        }
                        className="
                          w-9
                          h-9
                          rounded-xl
                          bg-blue-100
                          text-blue-600
                          flex
                          items-center
                          justify-center
                          hover:scale-110
                          transition
                        "
                        title="View News"
                      >
                        <MdVisibility size={18} />
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/news/edit/${item.newsId}`)
                        }
                        className="
                          w-9
                          h-9
                          rounded-xl
                          bg-green-100
                          text-green-600
                          flex
                          items-center
                          justify-center
                          hover:scale-110
                          transition
                        "
                        title="Edit News"
                      >
                        <MdEdit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* EMPTY */
              <tr>
                <td
                  colSpan="5"
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  No recent news available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================================
          VIEW ALL
      ================================= */}

      <div
        className="
          p-5
          border-t
          border-slate-200
          flex
          justify-end
        "
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard/news")}
          className="
            text-sm
            font-semibold
            text-blue-600
            hover:text-blue-700
            transition
          "
        >
          View All News →
        </button>
      </div>
    </div>
  );
};

export default RecentNewsTable;
