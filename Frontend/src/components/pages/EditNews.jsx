import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

import { MdCloudUpload, MdOutlineArticle, MdArrowBack } from "react-icons/md";

import { getNewsById, updateNews } from "../../api/newsApi";

import { getCategories } from "../../api/categoryApi";
import { getAllTags } from "../../api/tagApi";
const EditNews = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    shortDescription: "",
    tags: [],
    content: "",
    seoTitle: "",
    seoDescription: "",
    status: "Published",
    isFeatured: false,
    isBreaking: false,
  });

  // =====================================
  // LOAD NEWS + CATEGORIES
  // =====================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

      const [newsResponse, categoryResponse, tagResponse] = await Promise.all([
        getNewsById(id),
        getCategories(),
        getAllTags(),
      ]);

        const existingNews = newsResponse?.news;

        if (!existingNews) {
          toast.error("News not found");

          navigate("/dashboard/news");

          return;
        }

        setCategories(categoryResponse?.categories || []);
        setTags(tagResponse?.tags || []);

        setFormData({
          title: existingNews.title || "",

          slug: existingNews.slug || "",

          // IMPORTANT:
          // Dropdown value must be MongoDB category _id
          category: existingNews.category?._id || existingNews.category || "",

          shortDescription: existingNews.shortDescription || "",
          tags: Array.isArray(existingNews.tags)
            ? existingNews.tags.map((tag) =>
                typeof tag === "object" ? tag._id : tag,
              )
            : [],
          content: existingNews.content || "",

          seoTitle: existingNews.seoTitle || "",

          seoDescription: existingNews.seoDescription || "",

          status: existingNews.status || "Published",

          isFeatured: existingNews.isFeatured || false,

          isBreaking: existingNews.isBreaking || false,
        });

        setThumbnail(existingNews.featuredImage || "");
      } catch (error) {
        console.error("Load Edit News Error:", error);

        toast.error(error.response?.data?.message || "Failed to load news");

        navigate("/dashboard/news");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // =====================================
  // AUTO SLUG
  // =====================================
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // =====================================
  // HANDLE INPUT
  // =====================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,

        title: value,

        slug: generateSlug(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================
  // IMAGE UPLOAD + COMPRESS
  // =====================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");

      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 800;

        let width = img.width;
        let height = img.height;

        // Only resize when image is larger
        if (width > MAX_WIDTH) {
          const scaleSize = MAX_WIDTH / width;

          width = MAX_WIDTH;

          height = height * scaleSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

        setThumbnail(compressedBase64);
      };
    };

    reader.readAsDataURL(file);
  };

  // =====================================
  // QUILL TOOLBAR
  // =====================================
  const quillModules = {
    toolbar: [
      [
        {
          header: [1, 2, 3, 4, 5, 6, false],
        },
      ],

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

  // =====================================
  // QUILL FORMATS
  // =====================================
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
  // =====================================
  // TOGGLE TAG
  // =====================================
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

  // =====================================
  // REMOVE TAG
  // =====================================
  const removeTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId),
    }));
  };
  // =====================================
  // UPDATE NEWS
  // =====================================
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

    if (!formData.content.trim()) {
      toast.error("News content is required");

      return;
    }

    try {
      setUpdating(true);

      const updatedNewsData = {
        title: formData.title,

        category: formData.category,

        shortDescription: formData.shortDescription,

        content: formData.content,
        tags: formData.tags,
        featuredImage: thumbnail,

        status: formData.status,

        isFeatured: formData.isFeatured,

        isBreaking: formData.isBreaking,

        seoTitle: formData.seoTitle,

        seoDescription: formData.seoDescription,
      };

      const response = await updateNews(id, updatedNewsData);

      toast.success(response.message || "News updated successfully 🚀");

      navigate("/dashboard/news");
    } catch (error) {
      console.error("Update News Error:", error);

      toast.error(error.response?.data?.message || "Failed to update news");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
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
              w-12 h-12
              border-4
              border-blue-200
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-slate-500">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
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
            Edit News ✏️
          </h1>

          <p className="text-slate-500 mt-2">Update your existing article.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/news")}
          className="
            flex
            items-center
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

      {/* FORM */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-slate-200
          p-6
          md:p-8
        "
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-8
            "
          >
            {/* =====================
                LEFT
            ====================== */}

            <div className="lg:col-span-2 space-y-6">
              {/* TITLE */}

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
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
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
                  readOnly
                  placeholder="news-slug"
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                    bg-slate-50
                    text-slate-500
                  "
                />
              </div>

              {/* CATEGORY */}

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
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                    bg-white
                    focus:border-blue-500
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
              {/* TAGS */}

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
                  Tags
                </label>

                <div
                  className="
      rounded-2xl
      border
      border-slate-200
      bg-slate-50
      p-4
    "
                >
                  {/* SELECTED TAGS */}

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tagId) => {
                        const selectedTag = tags.find(
                          (tag) => tag._id === tagId,
                        );

                        if (!selectedTag) return null;

                        return (
                          <span
                            key={tagId}
                            className="
                flex
                items-center
                gap-1
                px-3
                py-2
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
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* AVAILABLE TAGS */}

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
                px-4
                py-2
                rounded-xl
                text-sm
                font-medium
                border
                transition-all

                ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                }
              `}
                          >
                            {selected ? "✓ " : ""}#{tag.name}
                          </button>
                        );
                      })}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Select one or more tags related to this article.
                </p>
              </div>
              {/* SHORT DESCRIPTION */}

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
                  Short Description
                </label>

                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter short description..."
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                    resize-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* CONTENT */}

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
                  News Content
                </label>

                <div
                  className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                  "
                >
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
                    placeholder="Write full news content..."
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* =====================
                RIGHT
            ====================== */}

            <div className="space-y-6">
              {/* THUMBNAIL */}

              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                  border
                  border-dashed
                  border-slate-300
                "
              >
                <div className="mb-4">
                  <h2
                    className="
                      text-lg
                      font-bold
                      text-slate-800
                    "
                  >
                    Thumbnail
                  </h2>
                </div>

                <div
                  className="
                    w-full
                    h-[220px]
                    rounded-2xl
                    overflow-hidden
                    bg-white
                    border
                    border-slate-200
                    flex
                    items-center
                    justify-center
                  "
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : (
                    <div className="text-center">
                      <MdOutlineArticle
                        size={50}
                        className="
                          mx-auto
                          text-slate-300
                        "
                      />

                      <p
                        className="
                          text-sm
                          text-slate-400
                          mt-3
                        "
                      >
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                <label
                  className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-cyan-500
                    text-white
                    cursor-pointer
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >
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

              {/* STATUS */}

              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                  border
                  border-slate-200
                "
              >
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
                    border
                    border-slate-200
                    bg-white
                    outline-none
                  "
                >
                  <option value="Published">Published</option>

                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* FEATURED */}

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  bg-slate-50
                  rounded-2xl
                  border
                  border-slate-200
                  p-5
                  cursor-pointer
                "
              >
                <div>
                  <p className="font-semibold text-slate-800">Featured News</p>

                  <p className="text-sm text-slate-500 mt-1">
                    Show in featured section.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="
                    w-5
                    h-5
                    accent-blue-600
                  "
                />
              </label>

              {/* BREAKING */}

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  bg-slate-50
                  rounded-2xl
                  border
                  border-slate-200
                  p-5
                  cursor-pointer
                "
              >
                <div>
                  <p className="font-semibold text-slate-800">Breaking News</p>

                  <p className="text-sm text-slate-500 mt-1">
                    Mark as breaking news.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isBreaking"
                  checked={formData.isBreaking}
                  onChange={handleChange}
                  className="
                    w-5
                    h-5
                    accent-blue-600
                  "
                />
              </label>

              {/* UPDATE */}

              <button
                type="submit"
                disabled={updating}
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
                  transition-all
                  duration-300
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {updating ? "Updating..." : "Update News"}
              </button>
            </div>
          </div>

          {/* =====================
              SEO SECTION
          ====================== */}

          <div
            className="
              border-t
              border-slate-200
              pt-8
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
                mb-6
              "
            >
              SEO Settings 🔍
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >
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
                  SEO Title
                </label>

                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="SEO title"
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

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
                  SEO Description
                </label>

                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows="4"
                  placeholder="SEO description"
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                    resize-none
                    focus:border-blue-500
                  "
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};;

export default EditNews;
