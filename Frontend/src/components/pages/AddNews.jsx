import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdArrowBack, MdCloudUpload, MdSave, MdClose } from "react-icons/md";

import toast from "react-hot-toast";

import { createNews } from "../../api/newsApi";
import { getCategories } from "../../api/categoryApi";
import { getAllTags } from "../../api/tagApi";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddNews = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: [],
    shortDescription: "",
    content: "",
    featuredImage: "",
    status: "Draft",
    isFeatured: false,
    isBreaking: false,
    seoTitle: "",
    seoDescription: "",
  });

  // ================================
  // LOAD CATEGORIES
  // ================================
  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

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
  // LOAD TAGS
  // ================================
  const loadTags = async () => {
    try {
      setLoadingTags(true);

      const response = await getAllTags();

      setTags(response.tags || []);
    } catch (error) {
      console.error("Load Tags Error:", error);

      toast.error(error.response?.data?.message || "Failed to load tags");
    } finally {
      setLoadingTags(false);
    }
  };

  // ================================
  // HANDLE INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================================
  // HANDLE TAG SELECTION
  // ================================
  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const alreadySelected = prev.tags.includes(tagId);

      return {
        ...prev,
        tags: alreadySelected
          ? prev.tags.filter((id) => id !== tagId)
          : [...prev.tags, tagId],
      };
    });
  };

  // ================================
  // REMOVE SELECTED TAG
  // ================================
  const removeTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId),
    }));
  };

  // ================================
  // REMOVE HTML FOR VALIDATION
  // ================================
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    return div.textContent || div.innerText || "";
  };

  // ================================
  // SUBMIT FORM
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("News title is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!stripHtml(formData.content).trim()) {
      toast.error("News content is required");
      return;
    }

    try {
      setLoading(true);

      const response = await createNews(formData);

      toast.success(response.message || "News created successfully");

      navigate("/dashboard/news");
    } catch (error) {
      console.error("Create News Error:", error);

      toast.error(error.response?.data?.message || "Failed to create news");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // QUILL CONFIGURATION
  // ================================
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
  ];

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
            Add News 📰
          </h1>

          <p className="text-slate-500 mt-2">
            Create and publish a new news article.
          </p>
        </div>

        <button
          type="button"
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
      </div>

      {/* ================================
          FORM
      ================================= */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================================
            BASIC INFORMATION
        ================================= */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-slate-200
            p-6 md:p-8
          "
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Basic Information
            </h2>

            <p className="text-slate-500 mt-2">
              Enter the main information about the news article.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TITLE */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                News Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter news title"
                className="
                  w-full
                  px-4 py-3
                  rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all
                "
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="
                  w-full
                  px-4 py-3
                  rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                "
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="
                  w-full
                  px-4 py-3
                  rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                "
              >
                <option value="Draft">Draft</option>

                <option value="Published">Published</option>
              </select>
            </div>

            {/* ================================
                TAGS
            ================================= */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tags
              </label>

              <div
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  p-4
                "
              >
                {/* SELECTED TAGS */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tagId) => {
                      const selectedTag = tags.find((tag) => tag._id === tagId);

                      if (!selectedTag) return null;

                      return (
                        <span
                          key={tagId}
                          className="
                            flex items-center
                            gap-1
                            px-3 py-2
                            rounded-xl
                            bg-blue-100
                            text-blue-700
                            text-sm
                            font-semibold
                          "
                        >
                          #{selectedTag.name}
                          <button
                            type="button"
                            onClick={() => removeTag(tagId)}
                            className="
                              ml-1
                              hover:text-red-600
                              transition
                            "
                          >
                            <MdClose size={17} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* TAG OPTIONS */}
                {loadingTags ? (
                  <p className="text-sm text-slate-500">Loading tags...</p>
                ) : tags.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No tags available. Create tags first.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags
                      .filter((tag) => tag.status === "Active")
                      .map((tag) => {
                        const selected = formData.tags.includes(tag._id);

                        return (
                          <button
                            type="button"
                            key={tag._id}
                            onClick={() => handleTagToggle(tag._id)}
                            className={`
                              px-4 py-2
                              rounded-xl
                              text-sm
                              font-medium
                              border
                              transition-all
                              ${
                                selected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                              }
                            `}
                          >
                            {selected ? "✓ " : ""}#{tag.name}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Select one or more tags related to this article.
              </p>
            </div>

            {/* SHORT DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Short Description
              </label>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.shortDescription}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: value,
                    }))
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter a short description..."
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================
            ARTICLE CONTENT
        ================================= */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-slate-200
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Article Content
            </h2>

            <p className="text-slate-500 mt-2">
              Write the full content of the news article.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  content: value,
                }))
              }
              modules={quillModules}
              formats={quillFormats}
              placeholder="Write full news content here..."
              className="bg-white"
            />
          </div>
        </div>

        {/* ================================
            FEATURED IMAGE
        ================================= */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-slate-200
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Featured Image
            </h2>

            <p className="text-slate-500 mt-2">
              Add the main image URL for this article.
            </p>
          </div>

          <div
            className="
              flex items-center
              gap-4
              bg-slate-50
              border border-slate-200
              rounded-2xl
              px-4
            "
          >
            <MdCloudUpload size={24} className="text-slate-400" />

            <input
              type="text"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="Enter featured image URL"
              className="
                w-full
                py-4
                bg-transparent
                outline-none
              "
            />
          </div>

          {/* IMAGE PREVIEW */}
          {formData.featuredImage && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Image Preview
              </p>

              <img
                src={formData.featuredImage}
                alt="Featured Preview"
                className="
                  w-full
                  max-h-[400px]
                  object-cover
                  rounded-2xl
                  border border-slate-200
                "
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* ================================
            ARTICLE SETTINGS
        ================================= */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-slate-200
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Article Settings ⚙️
            </h2>

            <p className="text-slate-500 mt-2">
              Configure article visibility and placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* FEATURED */}
            <label
              className="
                flex items-center
                justify-between
                gap-4
                p-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                cursor-pointer
              "
            >
              <div>
                <p className="font-semibold text-slate-800">Featured News</p>

                <p className="text-sm text-slate-500 mt-1">
                  Display this article in featured sections.
                </p>
              </div>

              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
            </label>

            {/* BREAKING */}
            <label
              className="
                flex items-center
                justify-between
                gap-4
                p-5
                rounded-2xl
                bg-slate-50
                border border-slate-200
                cursor-pointer
              "
            >
              <div>
                <p className="font-semibold text-slate-800">Breaking News</p>

                <p className="text-sm text-slate-500 mt-1">
                  Mark this article as breaking news.
                </p>
              </div>

              <input
                type="checkbox"
                name="isBreaking"
                checked={formData.isBreaking}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* ================================
            SEO
        ================================= */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border border-slate-200
            p-6 md:p-8
          "
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              SEO Settings 🔍
            </h2>

            <p className="text-slate-500 mt-2">
              Configure search engine information.
            </p>
          </div>

          <div className="space-y-6">
            {/* SEO TITLE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SEO Title
              </label>

              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Enter SEO title"
                className="
                  w-full
                  px-4 py-3
                  rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                "
              />
            </div>

            {/* SEO DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SEO Description
              </label>

              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Enter SEO description"
                className="
                  w-full
                  px-4 py-3
                  rounded-2xl
                  bg-slate-50
                  border border-slate-200
                  outline-none
                  resize-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                "
              />
            </div>
          </div>
        </div>

        {/* ================================
            ACTION BUTTONS
        ================================= */}
        <div
          className="
            flex flex-col sm:flex-row
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard/news")}
            disabled={loading}
            className="
              px-6 py-3
              rounded-2xl
              bg-slate-200
              text-slate-700
              font-semibold
              hover:bg-slate-300
              disabled:opacity-50
              transition-all
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              flex items-center
              justify-center
              gap-2
              px-7 py-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-semibold
              hover:shadow-xl
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all duration-300
            "
          >
            <MdSave size={21} />

            {loading ? "Creating..." : "Create News"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
