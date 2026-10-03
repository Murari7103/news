import React, { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdCategory,
  MdEdit,
  MdDescription,
  MdLink,
  MdSearch,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getCategory } from "../../api/categoryApi";
import { getErrorMessage } from "../../utils/errorHandler";

const ViewCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await getCategory(categoryId);

      setCategory(response.category);
    } catch (error) {
      console.error(error);

      toast.error(getErrorMessage(error, "Failed to load category."));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-500 mt-4">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <MdCategory size={60} className="mx-auto text-slate-300" />

          <h2 className="text-xl font-bold text-slate-700 mt-4">
            Category not found
          </h2>

          <button
            onClick={() => navigate("/dashboard/category")}
            className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard/category")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-3"
          >
            <MdArrowBack size={20} />
            Back to Categories
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Category Details
          </h1>

          <p className="text-slate-500 mt-2">
            View complete category information.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/dashboard/category/edit/${category.categoryId}`)
          }
          className="
            flex items-center justify-center gap-2
            px-6 py-3
            rounded-xl
            bg-gradient-to-r
            from-blue-600 to-cyan-500
            text-white
            font-semibold
            hover:shadow-lg
            transition
          "
        >
          <MdEdit size={20} />
          Edit Category
        </button>
      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* CATEGORY TOP SECTION */}

        <div className="p-6 md:p-8 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* IMAGE */}

            <div className="w-full lg:w-[320px] shrink-0">
              <div className="w-full h-[230px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdCategory size={70} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* BASIC INFORMATION */}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold text-slate-900">
                  {category.name}
                </h2>

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold

                    ${
                      category.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {category.status}
                </span>
              </div>

              {/* CATEGORY ID */}

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-500">
                  Category ID
                </p>

                <p className="text-slate-800 mt-1">#{category.categoryId}</p>
              </div>

              {/* SLUG */}

              <div className="mt-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <MdLink size={18} />
                  Slug
                </div>

                <div className="mt-2 inline-block bg-slate-100 px-4 py-2 rounded-xl text-slate-700">
                  {category.slug}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}

        <div className="p-6 md:p-8 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <MdDescription size={22} className="text-blue-600" />

            <h3 className="text-xl font-bold text-slate-800">Description</h3>
          </div>

          <p className="text-slate-600 leading-7 whitespace-pre-line">
            {category.description || "No description available."}
          </p>
        </div>

        {/* ================= SEO ================= */}

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdSearch size={22} className="text-blue-600" />

            <h3 className="text-xl font-bold text-slate-800">
              SEO Information
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SEO TITLE */}

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-500 mb-2">
                SEO Title
              </p>

              <p className="text-slate-800 font-medium">
                {category.seoTitle || "Not provided"}
              </p>
            </div>

            {/* SEO DESCRIPTION */}

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-500 mb-2">
                SEO Description
              </p>

              <p className="text-slate-700 leading-6">
                {category.seoDescription || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
