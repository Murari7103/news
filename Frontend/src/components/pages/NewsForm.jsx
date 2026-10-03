import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

import { MdCloudUpload, MdOutlineArticle } from "react-icons/md";

import { addNews } from "../../utils/newsStorage";

import { getCategories } from "../../utils/categoryStorage";

const NewsForm = () => {
  const [thumbnail, setThumbnail] = useState(null);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    tags: "",
    shortDescription: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    status: "Published",
  });

  // LOAD CATEGORIES
  useEffect(() => {
    const storedCategories = getCategories();

    setCategories(storedCategories);
  }, []);

  // AUTO SLUG
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // IMAGE UPLOAD + COMPRESS
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 800;

        const scaleSize = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;

        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

        setThumbnail(compressedBase64);
      };
    };

    reader.readAsDataURL(file);
  };

  // QUILL TOOLBAR
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["code-block"],
      ["clean"],
    ],
  };

  // QUILL FORMATS
  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "code-block",
  ];

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const newsItem = {
      id: Date.now(),

      title: formData.title,

      slug: formData.slug,

      category: formData.category,

      tags: formData.tags,

      shortDescription: formData.shortDescription,

      content: formData.content,

      seoTitle: formData.seoTitle,

      seoDescription: formData.seoDescription,

      status: formData.status,

      image: thumbnail,

      createdAt: new Date().toLocaleDateString(),

      views: 0,
    };

    addNews(newsItem);

    toast.success("News created successfully 🚀");

    setFormData({
      title: "",
      slug: "",
      category: "",
      tags: "",
      shortDescription: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
      status: "Published",
    });

    setThumbnail(null);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Add News 📰
        </h1>

        <p className="text-slate-500 mt-2">Create and publish new articles.</p>
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
              {/* TITLE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  News Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter news title..."
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="news-slug"
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

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                    w-full
                    px-5 py-4
                    rounded-2xl
                    border border-slate-200
                    outline-none
                    bg-white
                    focus:border-blue-500
                  "
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CONTENT */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  News Content
                </label>

                <div
                  className="
                    overflow-hidden
                    rounded-3xl
                    border border-slate-200
                    bg-white
                  "
                >
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        content: value,
                      })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write full news content..."
                    className="bg-white"
                  />
                </div>
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
                    Thumbnail
                  </h2>
                </div>

                {/* IMAGE */}
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
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <MdOutlineArticle
                        size={50}
                        className="mx-auto text-slate-300"
                      />

                      <p className="text-sm text-slate-400 mt-3">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                {/* UPLOAD */}
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

              {/* SUBMIT */}
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
                Publish News 🚀
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;
