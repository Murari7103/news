import React, { useState } from "react";

import { MdCloudUpload, MdCategory } from "react-icons/md";
import { createCategory } from "../../api/categoryApi";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [thumbnail, setThumbnail] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    status: "Active",
  });

  // AUTO SLUG GENERATOR
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // HANDLE INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    // AUTO SLUG
    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // IMAGE UPLOAD
const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;
console.log("File Size:", file.size);
  const reader = new FileReader();

  reader.onloadend = () => {
    setThumbnail(reader.result);
  };

  reader.readAsDataURL(file);
};
  // SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

if (!formData.name.trim()) {
  return toast.error("Category name is required.");
}

if (!thumbnail) {
  return toast.error("Please upload a category image.");
}

let response;

try {
   response = await createCategory({
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    image: thumbnail,
    status: formData.status,
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
  });
  toast.success(response.message);
} catch (error) {
  toast.error(error.response?.data?.message || "Failed to create category");

  return;
}

  // RESET FORM
  setFormData({
    name: "",
    slug: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    status: "Active",
  });

  setThumbnail(null);

  console.log("API Response:", response);
};

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1
          className="
            text-3xl md:text-4xl
            font-bold
            text-slate-900
          "
        >
          Add Category 
        </h1>

        <p className="text-slate-500 mt-2">Create new news category.</p>
      </div>

      {/* FORM */}
      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border border-slate-200
          p-6 md:p-8
        "
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            className="
              grid grid-cols-1
              lg:grid-cols-3
              gap-8
            "
          >
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* CATEGORY NAME */}
              <div>
                <label
                  className="
                    block
                    text-sm font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name..."
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* SLUG */}
              <div>
                <label
                  className="
                    block
                    text-sm font-semibold
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
                  placeholder="category-slug"
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  className="
                    block
                    text-sm font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write category description..."
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    resize-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* SEO SECTION */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-6
                  space-y-5
                "
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    SEO Settings 
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Optimize category for search engines.
                  </p>
                </div>

                {/* SEO TITLE */}
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="SEO Title"
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    focus:border-blue-500
                  "
                />

                {/* SEO DESCRIPTION */}
                <textarea
                  rows="4"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  placeholder="SEO Description"
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    resize-none
                    focus:border-blue-500
                  "
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* THUMBNAIL */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                  border border-dashed border-slate-300
                "
              >
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Category Thumbnail
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Upload category image
                  </p>
                </div>

                {/* IMAGE PREVIEW */}
                <div
                  className="
                    w-full h-[220px]
                    rounded-2xl
                    overflow-hidden
                    bg-white
                    border border-slate-200
                    flex items-center justify-center
                  "
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="
                        w-full h-full
                        object-cover
                      "
                    />
                  ) : (
                    <div className="text-center">
                      <MdCategory
                        size={50}
                        className="
                          mx-auto
                          text-slate-300
                        "
                      />

                      <p className="text-sm text-slate-400 mt-3">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                {/* UPLOAD BUTTON */}
                <label
                  className="
                    mt-5
                    flex items-center justify-center gap-2
                    w-full
                    px-5 py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    text-white
                    cursor-pointer
                    hover:shadow-xl
                    transition-all duration-300
                  "
                >
                  <MdCloudUpload size={22} />
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* STATUS */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                "
              >
                <label
                  className="
                    block
                    text-sm font-semibold
                    text-slate-700
                    mb-3
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
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    bg-white
                  "
                >
                  <option>Active</option>

                  <option>Inactive</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  font-semibold
                  hover:shadow-2xl
                  transition-all duration-300
                "
              >
                Create Category 
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
