import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdArrowBack, MdSave } from "react-icons/md";

import toast from "react-hot-toast";

import { createTag } from "../../api/tagApi";

const AddTag = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active",
  });

  // ========================================
  // HANDLE INPUT
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // SUBMIT
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await createTag({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });

      toast.success(response.message || "Tag created successfully");

      navigate("/dashboard/tag");
    } catch (error) {
      console.error("Create Tag Error:", error);

      toast.error(error.response?.data?.message || "Failed to create tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================
          HEADER
      ======================================== */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-slate-900
            "
          >
            Add Tag 🏷️
          </h1>

          <p className="text-slate-500 mt-2">
            Create a new tag for your news articles.
          </p>
        </div>

        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate("/dashboard/tag")}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-slate-200
            text-slate-700
            font-medium
            hover:bg-slate-300
            transition-all
          "
        >
          <MdArrowBack size={20} />
          Back
        </button>
      </div>

      {/* ========================================
          FORM CARD
      ======================================== */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          p-6
          md:p-8
          max-w-4xl
        "
      >
        {/* FORM HEADER */}
        <div className="mb-8">
          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Tag Information
          </h2>

          <p className="text-slate-500 mt-2">
            Enter the basic information for this tag.
          </p>
        </div>

        <div className="space-y-6">
          {/* ========================================
              TAG NAME
          ======================================== */}
          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Tag Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tag name..."
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all
              "
            />
          </div>

          {/* ========================================
              SLUG
          ======================================== */}
          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="technology-news"
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all
              "
            />

            <p className="text-xs text-slate-400 mt-2">
              Leave empty to generate the slug automatically.
            </p>
          </div>

          {/* ========================================
              DESCRIPTION
          ======================================== */}
          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Enter tag description..."
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                outline-none
                resize-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all
              "
            />
          </div>

          {/* ========================================
              STATUS
          ======================================== */}
          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all
              "
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ========================================
            ACTIONS
        ======================================== */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            justify-end
            gap-3
            mt-8
            pt-6
            border-t
            border-slate-200
          "
        >
          <button
            type="button"
            onClick={() => navigate("/dashboard/tag")}
            disabled={loading}
            className="
              px-6
              py-3
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
              flex
              items-center
              justify-center
              gap-2
              px-7
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-semibold
              hover:shadow-xl
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-all
            "
          >
            <MdSave size={21} />

            {loading ? "Creating..." : "Create Tag"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTag;
