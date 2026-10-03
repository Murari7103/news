import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MdArrowBack, MdSave } from "react-icons/md";

import toast from "react-hot-toast";

import { getTagById, updateTag } from "../../api/tagApi";

const EditTag = () => {
  const navigate = useNavigate();
  const { tagId } = useParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active",
  });

  // ========================================
  // LOAD TAG
  // ========================================
  useEffect(() => {
    const loadTag = async () => {
      try {
        setLoading(true);

        const response = await getTagById(tagId);

        if (!response?.tag) {
          toast.error("Tag not found");
          navigate("/dashboard/tag");
          return;
        }

        const tag = response.tag;

        setFormData({
          name: tag.name || "",
          slug: tag.slug || "",
          description: tag.description || "",
          status: tag.status || "Active",
        });
      } catch (error) {
        console.error("Get Tag Error:", error);

        toast.error(error.response?.data?.message || "Failed to load tag");

        navigate("/dashboard/tag");
      } finally {
        setLoading(false);
      }
    };

    loadTag();
  }, [tagId, navigate]);

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
  // UPDATE TAG
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      setUpdating(true);

      const response = await updateTag(tagId, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });

      toast.success(response.message || "Tag updated successfully");

      navigate("/dashboard/tag");
    } catch (error) {
      console.error("Update Tag Error:", error);

      toast.error(error.response?.data?.message || "Failed to update tag");
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================
  if (loading) {
    return (
      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-10 h-10
              border-4
              border-blue-200
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-slate-500">Loading tag...</p>
        </div>
      </div>
    );
  }

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
            Edit Tag ✏️
          </h1>

          <p className="text-slate-500 mt-2">Update the selected tag.</p>
        </div>

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
          FORM
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
            Update the information for this tag.
          </p>
        </div>

        <div className="space-y-6">
          {/* TAG ID */}
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
              Tag ID
            </label>

            <input
              type="text"
              value={`#${tagId}`}
              disabled
              className="
                w-full
                px-4
                py-3
                rounded-2xl
                bg-slate-100
                border
                border-slate-200
                text-slate-500
                cursor-not-allowed
              "
            />
          </div>

          {/* TAG NAME */}
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

          {/* SLUG */}
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
          </div>

          {/* DESCRIPTION */}
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

          {/* STATUS */}
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

        {/* ACTIONS */}
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
            disabled={updating}
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
            disabled={updating}
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

            {updating ? "Updating..." : "Update Tag"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTag;
