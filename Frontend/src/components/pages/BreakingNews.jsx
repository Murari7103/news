import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  MdSearch,
  MdVisibility,
  MdEdit,
  MdRefresh,
  MdLocalFireDepartment,
} from "react-icons/md";

import toast from "react-hot-toast";

import { getBreakingNews, updateNews } from "../../api/newsApi";

const BreakingNews = () => {
  const navigate = useNavigate();

  // ================================
  // STATES
  // ================================

  const [news, setNews] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);

  const [breakingFilter, setBreakingFilter] = useState("active");

  // ================================
  // LOAD BREAKING NEWS
  // ================================

  const loadBreakingNews = async (filter = breakingFilter) => {
    try {
      setLoading(true);

      const response = await getBreakingNews(filter);

      setNews(response?.news || []);
    } catch (error) {
      console.error("Load Breaking News Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load breaking news",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    loadBreakingNews("active");
  }, []);

  // ================================
  // CHANGE FILTER
  // ================================

  const handleFilterChange = (filter) => {
    setBreakingFilter(filter);
    setSearch("");
    loadBreakingNews(filter);
  };

  // ================================
  // TOGGLE BREAKING STATUS
  // ================================

  const handleBreakingToggle = async (newsItem) => {
    const newBreakingStatus = !newsItem.isBreaking;

    const previousNews = [...news];

    setUpdatingId(newsItem.newsId);

    // Immediate UI update
    setNews((previous) =>
      previous.map((item) =>
        item.newsId === newsItem.newsId
          ? {
              ...item,
              isBreaking: newBreakingStatus,
            }
          : item,
      ),
    );

    try {
      const response = await updateNews(newsItem.newsId, {
        isBreaking: newBreakingStatus,
      });

      toast.success(
        response.message ||
          (newBreakingStatus
            ? "News marked as Breaking"
            : "News removed from Breaking News"),
      );

      // Refresh current filter
      await loadBreakingNews(breakingFilter);
    } catch (error) {
      console.error("Breaking Status Update Error:", error);

      // Rollback
      setNews(previousNews);

      toast.error(
        error.response?.data?.message || "Failed to update breaking status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ================================
  // SEARCH
  // ================================

  const filteredNews = news.filter((item) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.name?.toLowerCase().includes(searchText) ||
      item.tags?.some((tag) => tag.name?.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="space-y-6">
      {/* ================================
          HEADER
      ================================= */}

      <div
        className="
          flex flex-col
          lg:flex-row
          items-start
          lg:items-center
          justify-between
          gap-4
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-red-100
                text-red-600
                flex
                items-center
                justify-center
              "
            >
              <MdLocalFireDepartment size={28} />
            </div>

            <div>
              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  text-slate-900
                "
              >
                Breaking News 🔥
              </h1>

              <p className="text-slate-500 mt-1">
                Manage all breaking news articles.
              </p>
            </div>
          </div>
        </div>

        {/* REFRESH */}
        <button
          type="button"
          onClick={() => loadBreakingNews()}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-slate-100
            text-slate-700
            font-medium
            hover:bg-slate-200
            transition-all
            disabled:opacity-50
            w-full
            sm:w-auto
          "
        >
          <MdRefresh size={21} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ================================
          FILTER + SEARCH
      ================================= */}

      <div
        className="
          bg-white
          rounded-3xl
          p-5
          shadow-sm
          border border-slate-200
          space-y-5
        "
      >
        {/* FILTER TABS */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          {[
            {
              value: "all",
              label: "All",
            },
            {
              value: "active",
              label: "🔥 Active",
            },
            {
              value: "inactive",
              label: "Inactive",
            },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleFilterChange(filter.value)}
              className={`
                px-5
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-300
                ${
                  breakingFilter === filter.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* SEARCH + COUNT */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-4
          "
        >
          {/* SEARCH */}
          <div
            className="
              flex
              items-center
              gap-3
              bg-slate-100
              rounded-2xl
              px-4
              py-3
              w-full
              md:max-w-md
            "
          >
            <MdSearch size={22} className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search breaking news..."
              className="
                bg-transparent
                outline-none
                w-full
                text-sm
                text-slate-700
              "
            />
          </div>

          {/* COUNT */}
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredNews.length}
            </span>{" "}
            {breakingFilter === "active"
              ? "active"
              : breakingFilter === "inactive"
                ? "inactive"
                : "total"}{" "}
            breaking {filteredNews.length === 1 ? "article" : "articles"}
          </div>
        </div>
      </div>

      {/* ================================
          TABLE
      ================================= */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border border-slate-200
          overflow-hidden
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  News
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Tags
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Breaking
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="
                          w-10 h-10
                          border-4
                          border-slate-200
                          border-t-red-500
                          rounded-full
                          animate-spin
                        "
                      />

                      <p className="text-slate-500">Loading breaking news...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredNews.length > 0 ? (
                filteredNews.map((newsItem) => (
                  <tr
                    key={newsItem.newsId}
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
                            newsItem.featuredImage ||
                            "https://via.placeholder.com/100x100?text=News"
                          }
                          alt={newsItem.title}
                          className="
                              w-16 h-16
                              rounded-2xl
                              object-cover
                              flex-shrink-0
                            "
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`
                                  px-2 py-1
                                  rounded-lg
                                  text-xs
                                  font-bold
                                  ${
                                    newsItem.isBreaking
                                      ? "bg-red-100 text-red-600"
                                      : "bg-slate-100 text-slate-500"
                                  }
                                `}
                            >
                              {newsItem.isBreaking ? "BREAKING" : "INACTIVE"}
                            </span>
                          </div>

                          <h3
                            className="
                                mt-2
                                font-semibold
                                text-slate-800
                                max-w-[350px]
                              "
                          >
                            {newsItem.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-1">
                            News ID: #{newsItem.newsId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-5">
                      {newsItem.category ? (
                        <span
                          className="
                              inline-flex
                              px-3 py-2
                              rounded-xl
                              bg-blue-100
                              text-blue-700
                              text-sm
                              font-medium
                            "
                        >
                          {newsItem.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">No Category</span>
                      )}
                    </td>

                    {/* TAGS */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2 max-w-[220px]">
                        {newsItem.tags?.length > 0 ? (
                          newsItem.tags.map((tag) => (
                            <span
                              key={tag._id}
                              className="
                                    px-2 py-1
                                    rounded-lg
                                    bg-slate-100
                                    text-slate-600
                                    text-xs
                                  "
                            >
                              #{tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm">
                            No Tags
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`
                            inline-flex
                            px-3 py-2
                            rounded-xl
                            text-xs
                            font-semibold
                            ${
                              newsItem.status === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                      >
                        {newsItem.status}
                      </span>
                    </td>

                    {/* BREAKING */}
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        disabled={updatingId === newsItem.newsId}
                        onClick={() => handleBreakingToggle(newsItem)}
                        className={`
                            relative
                            w-14 h-8
                            rounded-full
                            transition-all
                            duration-300
                            disabled:opacity-50
                            ${
                              newsItem.isBreaking
                                ? "bg-red-500"
                                : "bg-slate-300"
                            }
                          `}
                      >
                        <span
                          className={`
                              absolute
                              top-1
                              w-6 h-6
                              rounded-full
                              bg-white
                              transition-all
                              duration-300
                              ${newsItem.isBreaking ? "left-7" : "left-1"}
                            `}
                        />
                      </button>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">
                        {newsItem.createdAt
                          ? new Date(newsItem.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/news/view/${newsItem.newsId}`)
                          }
                          className="
                              w-10 h-10
                              rounded-xl
                              bg-blue-100
                              text-blue-600
                              flex items-center
                              justify-center
                              hover:scale-110
                              transition
                            "
                          title="View News"
                        >
                          <MdVisibility size={20} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/news/edit/${newsItem.newsId}`)
                          }
                          className="
                              w-10 h-10
                              rounded-xl
                              bg-green-100
                              text-green-600
                              flex items-center
                              justify-center
                              hover:scale-110
                              transition
                            "
                          title="Edit News"
                        >
                          <MdEdit size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <MdLocalFireDepartment
                      size={50}
                      className="mx-auto text-slate-300 mb-3"
                    />

                    <h3 className="text-lg font-semibold text-slate-700">
                      No Breaking News Found
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      {breakingFilter === "inactive"
                        ? "No inactive breaking news articles found."
                        : breakingFilter === "active"
                          ? "No active breaking news articles found."
                          : "No breaking news articles found."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
