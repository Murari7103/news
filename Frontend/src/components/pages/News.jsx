import React, { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdClose,
} from "react-icons/md";

import DeleteModal from "../common/DeleteModal";

import toast from "react-hot-toast";

import { getAllNews, deleteNews, updateNews } from "../../api/newsApi";

import { getCategories } from "../../api/categoryApi";

const News = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");

  // ================================
  // STATES
  // ================================

  const [search, setSearch] = useState("");

  const [news, setNews] = useState([]);

  const [categories, setCategories] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedNews, setSelectedNews] = useState(null);

  // ================================
  // LOAD DATA
  // ================================

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  // ================================
  // APPLY URL CATEGORY
  // ================================

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategoryFilter(urlCategory);
    }
  }, [urlCategory]);

  // ================================
  // LOAD NEWS
  // ================================

  const loadNews = async () => {
    try {
      const response = await getAllNews();

      setNews(response.news || []);
    } catch (error) {
      console.error("Load News Error:", error);

      toast.error(error.response?.data?.message || "Failed to load news");
    }
  };

  // ================================
  // LOAD CATEGORIES
  // ================================

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error("Load Categories Error:", error);

      toast.error(error.response?.data?.message || "Failed to load categories");
    }
  };

  // ================================
  // DELETE
  // ================================

  const handleDelete = async () => {
    if (!selectedNews) return;

    try {
      const response = await deleteNews(selectedNews.newsId);

      toast.success(
        response.message || `"${selectedNews.title}" deleted successfully`,
      );

      setIsDeleteOpen(false);
      setSelectedNews(null);

      await loadNews();
    } catch (error) {
      console.error("Delete News Error:", error);

      toast.error(error.response?.data?.message || "Failed to delete news");
    }
  };

  // ================================
  // STATUS TOGGLE
  // ================================

  const handleStatusToggle = async (newsItem) => {
    const updatedStatus =
      newsItem.status === "Published" ? "Draft" : "Published";

    const previousStatus = newsItem.status;

    // Immediate UI update
    setNews((previousNews) =>
      previousNews.map((item) =>
        item.newsId === newsItem.newsId
          ? {
              ...item,
              status: updatedStatus,
            }
          : item,
      ),
    );

    try {
      const response = await updateNews(newsItem.newsId, {
        status: updatedStatus,
      });

      toast.success(response.message || `News marked as ${updatedStatus}`);
    } catch (error) {
      console.error("Status Update Error:", error);

      // Rollback
      setNews((previousNews) =>
        previousNews.map((item) =>
          item.newsId === newsItem.newsId
            ? {
                ...item,
                status: previousStatus,
              }
            : item,
        ),
      );

      toast.error(
        error.response?.data?.message || "Failed to update news status",
      );
    }
  };

  // ================================
  // CLEAR ALL FILTERS
  // ================================

  const clearFilters = () => {
    setSearch("");
    setSelectedCategoryFilter("");
    setSelectedStatus("");
  };

  // ================================
  // FILTER NEWS
  // ================================

  const filteredNews = news.filter((item) => {
    // SEARCH
    const searchText = search.trim().toLowerCase();

    const matchesSearch = searchText
      ? item.title?.toLowerCase().includes(searchText)
      : true;

    // STATUS
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;

    // CATEGORY
    const categoryName = item.category?.name || "";

    const matchesCategory = selectedCategoryFilter
      ? categoryName === selectedCategoryFilter
      : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ================================
  // CHECK ACTIVE FILTERS
  // ================================

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategoryFilter !== "" ||
    selectedStatus !== "";

  return (
    <div className="space-y-6">
      {/* ================================
          PAGE HEADER
      ================================= */}

      <div
        className="
          flex flex-col lg:flex-row
          items-start lg:items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-3xl md:text-4xl
              font-bold
              text-slate-900
            "
          >
            News Management 📰
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all news articles from here.
          </p>

          {/* URL CATEGORY INFO */}
          {urlCategory && (
            <div
              className="
                mt-4
                inline-flex items-center gap-2
                px-4 py-2
                rounded-2xl
                bg-blue-100
                text-blue-700
                text-sm font-medium
              "
            >
              Showing news for:
              <span className="font-bold">{urlCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("")}
                className="
                  ml-1
                  hover:text-red-600
                  transition
                "
              >
                <MdClose size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ADD BUTTON */}
        <button
          type="button"
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-medium
            hover:shadow-xl
            transition-all duration-300
            w-full sm:w-auto
            justify-center
          "
          onClick={() => navigate("/dashboard/news/add")}
        >
          <MdAdd size={22} />
          Add News
        </button>
      </div>

      {/* ================================
          FILTER BAR
      ================================= */}

      <div
        className="
          bg-white
          rounded-3xl
          p-5
          shadow-sm
          border border-slate-200
          flex flex-col lg:flex-row
          gap-4
          items-start lg:items-center
          justify-between
        "
      >
        {/* SEARCH */}
        <div
          className="
            flex items-center
            gap-3
            bg-slate-100
            rounded-2xl
            px-4 py-3
            w-full lg:w-[350px]
          "
        >
          <MdSearch size={22} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              bg-transparent
              outline-none
              w-full
              text-sm
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                text-slate-400
                hover:text-slate-700
              "
            >
              <MdClose size={19} />
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div
          className="
            flex flex-col sm:flex-row
            gap-3
            w-full lg:w-auto
          "
        >
          {/* CATEGORY */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="
              bg-slate-100
              px-4 py-3
              rounded-2xl
              outline-none
              text-sm
              w-full lg:w-auto
            "
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category._id || category.categoryId}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="
              bg-slate-100
              px-4 py-3
              rounded-2xl
              outline-none
              text-sm
              w-full lg:w-auto
            "
          >
            <option value="">All Status</option>

            <option value="Published">Published</option>

            <option value="Draft">Draft</option>
          </select>

          {/* CLEAR */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                px-4 py-3
                rounded-2xl
                bg-red-50
                text-red-600
                text-sm
                font-medium
                hover:bg-red-100
                transition
                whitespace-nowrap
              "
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ================================
          FILTER RESULT
      ================================= */}

      {hasActiveFilters && (
        <div className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredNews.length}
          </span>{" "}
          of <span className="font-semibold text-slate-800">{news.length}</span>{" "}
          news articles
        </div>
      )}

      {/* ================================
          NEWS TABLE
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
          <table className="w-full min-w-[1000px]">
            {/* HEAD */}
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Title",
                  "Category",
                  "Status",
                  "Views",
                  "Date",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="
                      px-6 py-4
                      text-left
                      text-sm font-semibold
                      text-slate-600
                    "
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map((newsItem) => (
                  <tr
                    key={newsItem.newsId}
                    className="
                        border-t border-slate-100
                        hover:bg-slate-50
                        transition-all duration-300
                      "
                  >
                    {/* TITLE */}
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
                            "
                        />

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {newsItem.title}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            News ID: #{newsItem.newsId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-5">
                      <span
                        className="
                            bg-slate-100
                            text-slate-700
                            px-3 py-1
                            rounded-xl
                            text-sm
                          "
                      >
                        {newsItem.category?.name || "No Category"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(newsItem)}
                        className={`
                            relative
                            w-14 h-8
                            rounded-full
                            transition-all duration-300
                            ${
                              newsItem.status === "Published"
                                ? "bg-green-500"
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
                              transition-all duration-300
                              ${
                                newsItem.status === "Published"
                                  ? "left-7"
                                  : "left-1"
                              }
                            `}
                        />
                      </button>
                    </td>

                    {/* VIEWS */}
                    <td className="px-6 py-5 font-semibold">
                      {newsItem.views || 0}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
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
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {/* VIEW */}
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
                              flex items-center justify-center
                              hover:scale-110
                              transition-all duration-300
                            "
                        >
                          <MdVisibility size={20} />
                        </button>

                        {/* EDIT */}
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
                              flex items-center justify-center
                              hover:scale-110
                              transition-all duration-300
                            "
                        >
                          <MdEdit size={20} />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNews(newsItem);

                            setIsDeleteOpen(true);
                          }}
                          className="
                              w-10 h-10
                              rounded-xl
                              bg-red-100
                              text-red-600
                              flex items-center justify-center
                              hover:scale-110
                              transition-all duration-300
                            "
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      px-6 py-16
                      text-center
                    "
                  >
                    <div className="flex flex-col items-center">
                      <MdSearch size={48} className="text-slate-300 mb-3" />

                      <h3 className="text-lg font-semibold text-slate-700">
                        No news found
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search or filters.
                      </p>

                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="
                            mt-4
                            px-4 py-2
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            text-sm
                            font-medium
                            hover:bg-blue-200
                            transition
                          "
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION INFO */}
        <div
          className="
            flex flex-col sm:flex-row
            items-center justify-between
            gap-4
            p-5
            border-t border-slate-200
          "
        >
          <p className="text-sm text-slate-500">
            Showing{" "}
            {filteredNews.length > 0 ? `1 to ${filteredNews.length}` : "0"} of{" "}
            {filteredNews.length} entries
          </p>
        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default News;
