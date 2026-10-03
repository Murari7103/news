import React, { useEffect, useState } from "react";
import { MdCloudUpload, MdCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// import Loader from "../../components/common/Loader";
import { getCategory, updateCategory } from "../../api/categoryApi";
import { getErrorMessage } from "../../utils/errorHandler";

const EditCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    status: "Active",
  });

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  // ===========================
  // Fetch Category
  // ===========================
  const fetchCategory = async () => {
    setLoading(true);

    try {
      const response = await getCategory(categoryId);

      const category = response.category;

      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
        status: category.status || "Active",
      });

      setThumbnail(category.image || null);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to load category."));
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Generate Slug
  // ===========================
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // ===========================
  // Handle Input
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===========================
  // Handle Image Upload
  // ===========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image.");
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setThumbnail(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ===========================
  // Update Category
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("Category name is required.");
    }

    if (!formData.description.trim()) {
      return toast.error("Category description is required.");
    }

    setUpdating(true);

    try {
      const response = await updateCategory(categoryId, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        status: formData.status,
        image: thumbnail,
      });

      toast.success(response.message);

      navigate("/dashboard/category");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Edit Category ✏️
          </h1>

          <p className="text-slate-500 mt-2">
            Update your category information.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="category-slug"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write category description..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* SEO */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    SEO Settings 🔍
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Optimize this category for search engines.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SEO Title
                  </label>

                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="SEO Title"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SEO Description
                  </label>

                  <textarea
                    rows={4}
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    placeholder="SEO Description"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-dashed border-slate-300">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Category Thumbnail
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Upload or replace category image.
                  </p>
                </div>

                <div className="w-full h-[220px] rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Category"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <MdCategory
                        size={50}
                        className="mx-auto text-slate-300"
                      />

                      <p className="text-sm text-slate-400 mt-3">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                <label className="mt-5 flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white cursor-pointer hover:shadow-xl transition-all duration-300">
                  <MdCloudUpload size={22} />
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Status */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Category 🚀"}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => navigate("/dashboard/category")}
                  className="w-full py-4 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditCategory;
