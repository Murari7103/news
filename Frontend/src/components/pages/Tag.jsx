import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdVisibility,
  MdSearch,
} from "react-icons/md";

import toast from "react-hot-toast";

import { getAllTags, deleteTag } from "../../api/tagApi";

const Tag = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ========================================
  // LOAD TAGS
  // ========================================
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);

      const response = await getAllTags();

      setTags(response.tags || []);
    } catch (error) {
      console.error("Get Tags Error:", error);

      toast.error(error.response?.data?.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH
  // ========================================
  const filteredTags = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return tags;
    }

    return tags.filter((tag) =>
      [tag.name, tag.slug, tag.description, tag.status]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value)),
    );
  }, [tags, search]);

  // ========================================
  // DELETE TAG
  // ========================================
const handleDelete = async (tagId) => {
  const selectedTag = tags.find((tag) => tag.tagId === tagId);

  const result = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete "${selectedTag?.name || "this tag"}".`,
    icon: "warning",

    showCancelButton: true,

    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",

    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",

    reverseButtons: true,

    customClass: {
      popup: "rounded-3xl",
      confirmButton: "rounded-xl px-5 py-3",
      cancelButton: "rounded-xl px-5 py-3",
    },
  });

  // User clicked Cancel
  if (!result.isConfirmed) {
    return;
  }

  try {
    const response = await deleteTag(tagId);

    // Remove immediately from UI
    setTags((prevTags) => prevTags.filter((tag) => tag.tagId !== tagId));

    // Success alert
    await Swal.fire({
      title: "Deleted!",
      text: response.message || "Tag has been deleted successfully.",
      icon: "success",

      confirmButtonText: "OK",
      confirmButtonColor: "#2563eb",

      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-5 py-3",
      },
    });
  } catch (error) {
    console.error("Delete Tag Error:", error);

    Swal.fire({
      title: "Delete Failed",
      text: error.response?.data?.message || "Failed to delete tag.",
      icon: "error",

      confirmButtonText: "OK",
      confirmButtonColor: "#2563eb",

      customClass: {
        popup: "rounded-3xl",
        confirmButton: "rounded-xl px-5 py-3",
      },
    });
  }
};

  return (
    <div className="space-y-6">
      {/* ========================================
          PAGE HEADER
      ========================================= */}
      <div
        className="
          flex flex-col
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
            Tags 🏷️
          </h1>

          <p className="text-slate-500 mt-2">
            Manage tags used across your news articles.
          </p>
        </div>

        {/* ADD TAG */}
        <button
          onClick={() => navigate("/dashboard/tag/add")}
          className="
            flex items-center
            justify-center
            gap-2
            px-5 py-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            hover:shadow-xl
            transition-all
            duration-300
          "
        >
          <MdAdd size={22} />
          Add Tag
        </button>
      </div>

      {/* ========================================
          SEARCH
      ========================================= */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          p-5
        "
      >
        <div
          className="
            relative
            w-full
            lg:max-w-md
          "
        >
          <MdSearch
            size={22}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="
              w-full
              pl-12
              pr-4
              py-3
              rounded-2xl
              bg-slate-50
              border
              border-slate-200
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              transition-all
            "
          />
        </div>
      </div>

      {/* ========================================
          TABLE
      ========================================= */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >
        {/* LOADING */}
        {loading ? (
          <div
            className="
              min-h-[300px]
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

              <p className="mt-4 text-slate-500">Loading tags...</p>
            </div>
          </div>
        ) : filteredTags.length === 0 ? (
          /* EMPTY */
          <div
            className="
              min-h-[300px]
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >
            <div
              className="
                w-16 h-16
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <MdSearch size={30} className="text-slate-400" />
            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-slate-800
              "
            >
              No tags found
            </h3>

            <p className="text-slate-500 mt-1">
              {search
                ? "Try a different search term."
                : "Create your first tag to get started."}
            </p>

            {!search && (
              <button
                onClick={() => navigate("/dashboard/tag/add")}
                className="
                  mt-5
                  flex items-center
                  gap-2
                  px-5 py-3
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-medium
                  hover:bg-blue-700
                  transition
                "
              >
                <MdAdd size={20} />
                Add Tag
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr
                  className="
                    bg-slate-50
                    border-b
                    border-slate-200
                  "
                >
                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    ID
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Tag
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Slug
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Created
                  </th>

                  <th
                    className="
                      px-6 py-4
                      text-center
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTags.map((tag) => (
                  <tr
                    key={tag._id}
                    className="
                      border-b
                      border-slate-100
                      last:border-0
                      hover:bg-slate-50
                      transition
                    "
                  >
                    {/* ID */}
                    <td className="px-6 py-5">
                      <span
                        className="
                          font-semibold
                          text-slate-700
                        "
                      >
                        #{tag.tagId}
                      </span>
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            font-bold
                          "
                        >
                          #
                        </div>

                        <div>
                          <p
                            className="
                              font-semibold
                              text-slate-800
                            "
                          >
                            {tag.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SLUG */}
                    <td className="px-6 py-5">
                      <span
                        className="
                          px-3 py-1.5
                          rounded-xl
                          bg-slate-100
                          text-slate-600
                          text-sm
                          font-medium
                        "
                      >
                        {tag.slug}
                      </span>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-5">
                      <p
                        className="
                          max-w-[280px]
                          truncate
                          text-slate-600
                        "
                        title={tag.description}
                      >
                        {tag.description || "-"}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`
                          inline-flex
                          px-3 py-1.5
                          rounded-xl
                          text-xs
                          font-semibold
                          ${
                            tag.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {tag.status}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-5">
                      <span className="text-slate-500 text-sm">
                        {tag.createdAt
                          ? new Date(tag.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        {/* VIEW */}
                        <button
                          title="View Tag"
                          onClick={() =>
                            navigate(`/dashboard/tag/view/${tag.tagId}`)
                          }
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-100
                            transition
                          "
                        >
                          <MdVisibility size={20} />
                        </button>

                        {/* EDIT */}
                        <button
                          title="Edit Tag"
                          onClick={() =>
                            navigate(`/dashboard/tag/edit/${tag.tagId}`)
                          }
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-cyan-50
                            text-cyan-600
                            flex
                            items-center
                            justify-center
                            hover:bg-cyan-100
                            transition
                          "
                        >
                          <MdEdit size={20} />
                        </button>

                        {/* DELETE */}
                        <button
                          title="Delete Tag"
                          onClick={() => handleDelete(tag.tagId)}
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-red-50
                            text-red-600
                            flex
                            items-center
                            justify-center
                            hover:bg-red-100
                            transition
                          "
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TOTAL */}
      {!loading && (
        <div className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredTags.length}
          </span>{" "}
          of <span className="font-semibold text-slate-700">{tags.length}</span>{" "}
          tags
        </div>
      )}
    </div>
  );
};

export default Tag;
