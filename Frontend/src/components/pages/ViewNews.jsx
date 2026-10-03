import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  MdArrowBack,
  MdEdit,
  MdCalendarToday,
  MdVisibility,
} from "react-icons/md";

import toast from "react-hot-toast";

import { getNewsById } from "../../api/newsApi";

const ViewNews = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD SINGLE NEWS
  // ================================
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const response = await getNewsById(id);

        if (!response?.news) {
          toast.error("News not found");
          navigate("/dashboard/news");
          return;
        }

        setNews(response.news);
      } catch (error) {
        console.error("Get News Error:", error);

        toast.error(error.response?.data?.message || "Failed to load news");

        navigate("/dashboard/news");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id, navigate]);

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div
        className="
          min-h-[400px]
          flex items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-12 h-12
              border-4
              border-blue-200
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="text-slate-500 mt-4">Loading news...</p>
        </div>
      </div>
    );
  }

  if (!news) return null;

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
              leading-tight
            "
          >
            News Details 📰
          </h1>

          <p className="text-slate-500 mt-2">
            Preview full news article content.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* BACK */}
          <button
            onClick={() => navigate("/dashboard/news")}
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-2xl
              bg-slate-200
              text-slate-700
              font-medium
              hover:bg-slate-300
              transition-all duration-300
            "
          >
            <MdArrowBack size={20} />
            Back
          </button>

          {/* EDIT */}
          <button
            onClick={() => navigate(`/dashboard/news/edit/${news.newsId}`)}
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
            "
          >
            <MdEdit size={20} />
            Edit News
          </button>
        </div>
      </div>

      {/* ================================
          MAIN CARD
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
        {/* ================================
            HERO IMAGE
        ================================= */}
        <div className="w-full h-[260px] md:h-[420px] overflow-hidden bg-slate-100">
          <img
            src={
              news.featuredImage ||
              "https://via.placeholder.com/1200x600?text=NewsIQ"
            }
            alt={news.title}
            className="
              w-full h-full
              object-cover
            "
          />
        </div>

        {/* ================================
            CONTENT
        ================================= */}
        <div className="p-6 md:p-10 space-y-8">
          {/* TOP META */}
          <div className="space-y-5">
            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-3">
              {/* CATEGORY */}
              <span
                className="
                  px-4 py-2
                  rounded-2xl
                  bg-blue-100
                  text-blue-700
                  text-sm font-semibold
                "
              >
                {news.category?.name || "No Category"}
              </span>

              {/* STATUS */}
              <span
                className={`
                  px-4 py-2
                  rounded-2xl
                  text-sm font-semibold
                  ${
                    news.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : news.status === "Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-200 text-slate-700"
                  }
                `}
              >
                {news.status}
              </span>

              {/* FEATURED */}
              {news.isFeatured && (
                <span
                  className="
                    px-4 py-2
                    rounded-2xl
                    bg-purple-100
                    text-purple-700
                    text-sm font-semibold
                  "
                >
                  Featured
                </span>
              )}

              {/* BREAKING */}
              {news.isBreaking && (
                <span
                  className="
                    px-4 py-2
                    rounded-2xl
                    bg-red-100
                    text-red-700
                    text-sm font-semibold
                  "
                >
                  Breaking
                </span>
              )}
            </div>

            {/* TITLE */}
            <h2
              className="
                text-3xl md:text-5xl
                font-bold
                text-slate-900
                leading-tight
              "
            >
              {news.title}
            </h2>

            {/* META INFO */}
            <div
              className="
                flex flex-wrap items-center
                gap-6
                text-slate-500
                text-sm md:text-base
              "
            >
              {/* DATE */}
              <div className="flex items-center gap-2">
                <MdCalendarToday size={18} />

                {news.createdAt
                  ? new Date(news.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </div>

              {/* VIEWS */}
              <div className="flex items-center gap-2">
                <MdVisibility size={20} />
                {news.views || 0} Views
              </div>
            </div>
          </div>

          {/* ================================
              SHORT DESCRIPTION
          ================================= */}
          <div
            className="
              bg-slate-50
              rounded-3xl
              p-6
              border border-slate-200
            "
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Short Description
            </h3>

            <div
              className="
    prose
    prose-slate
    max-w-none
    prose-p:text-slate-600
    prose-strong:text-slate-800
    prose-a:text-blue-600
  "
              dangerouslySetInnerHTML={{
                __html:
                  news.shortDescription ||
                  "<p>No short description available.</p>",
              }}
            />
          </div>

          {/* ================================
              ARTICLE CONTENT
          ================================= */}
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
                mb-6
              "
            >
              Full Article
            </h3>

            <div
              className="
                prose
                prose-slate
                max-w-none
                prose-headings:text-slate-900
                prose-p:text-slate-700
                prose-img:rounded-2xl
                prose-a:text-blue-600
                prose-strong:text-slate-900
                prose-li:text-slate-700
              "
              dangerouslySetInnerHTML={{
                __html: news.content || "<p>No article content available.</p>",
              }}
            />
          </div>
          {/* ================================
    TAGS
================================= */}
          {news.tags && news.tags.length > 0 && (
            <div>
              <h3
                className="
        text-2xl
        font-bold
        text-slate-900
        mb-5
      "
              >
                Tags 🏷️
              </h3>

              <div className="flex flex-wrap gap-3">
                {news.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="
            px-4 py-2
            rounded-2xl
            bg-slate-100
            text-slate-700
            text-sm
            font-medium
            border border-slate-200
          "
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* ================================
              ARTICLE INFORMATION
          ================================= */}
          <div
            className="
              grid
              grid-cols-1 md:grid-cols-2
              gap-4
            "
          >
            {/* NEWS ID */}
            <div
              className="
                bg-slate-50
                border border-slate-200
                rounded-2xl
                p-5
              "
            >
              <p className="text-sm text-slate-500">News ID</p>

              <p className="font-semibold text-slate-800 mt-1">
                #{news.newsId}
              </p>
            </div>

            {/* SLUG */}
            <div
              className="
                bg-slate-50
                border border-slate-200
                rounded-2xl
                p-5
              "
            >
              <p className="text-sm text-slate-500">Slug</p>

              <p className="font-semibold text-slate-800 mt-1 break-all">
                {news.slug || "-"}
              </p>
            </div>
          </div>

          {/* ================================
              SEO SECTION
          ================================= */}
          <div
            className="
              bg-slate-50
              rounded-3xl
              p-6 md:p-8
              border border-slate-200
              space-y-6
            "
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                SEO Settings 🔍
              </h3>

              <p className="text-slate-500 mt-2">
                Search engine optimization details.
              </p>
            </div>

            {/* SEO TITLE */}
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">
                SEO Title
              </h4>

              <p className="text-slate-600 leading-7">
                {news.seoTitle || "No SEO title available"}
              </p>
            </div>

            {/* SEO DESCRIPTION */}
            <div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">
                SEO Description
              </h4>

              <p className="text-slate-600 leading-7">
                {news.seoDescription || "No SEO description available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNews;
