import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MdArrowBack,
  MdEdit,
  MdLabel,
  MdCalendarToday,
  MdPerson,
} from "react-icons/md";

import toast from "react-hot-toast";

import { getTagById } from "../../api/tagApi";

const ViewTag = () => {
  const navigate = useNavigate();
  const { tagId } = useParams();

  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);

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

        setTag(response.tag);
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
              w-12 h-12
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

  if (!tag) return null;

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
            Tag Details 🏷️
          </h1>

          <p className="text-slate-500 mt-2">
            View complete information about this tag.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/tag")}
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

          {/* EDIT */}
          <button
            type="button"
            onClick={() => navigate(`/dashboard/tag/edit/${tag.tagId}`)}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-medium
              hover:shadow-xl
              transition-all
            "
          >
            <MdEdit size={20} />
            Edit Tag
          </button>
        </div>
      </div>

      {/* ========================================
          MAIN CARD
      ======================================== */}
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
        {/* TOP SECTION */}
        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            p-8
            md:p-10
            text-white
          "
        >
          <div className="flex items-center gap-5">
            <div
              className="
                w-20
                h-20
                rounded-3xl
                bg-white/20
                backdrop-blur-sm
                flex
                items-center
                justify-center
              "
            >
              <MdLabel size={42} />
            </div>

            <div>
              <p className="text-white/70 text-sm">Tag</p>

              <h2
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  mt-1
                "
              >
                {tag.name}
              </h2>

              <p className="text-white/80 mt-2">#{tag.tagId}</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="p-6 md:p-10 space-y-8">
          {/* STATUS + SLUG */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "
          >
            {/* STATUS */}
            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-2xl
                p-5
              "
            >
              <p className="text-sm text-slate-500 mb-2">Status</p>

              <span
                className={`
                  inline-flex
                  px-4
                  py-2
                  rounded-xl
                  text-sm
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
            </div>

            {/* SLUG */}
            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-2xl
                p-5
              "
            >
              <p className="text-sm text-slate-500 mb-2">Slug</p>

              <p
                className="
                  font-semibold
                  text-slate-800
                  break-all
                "
              >
                {tag.slug || "-"}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
                mb-4
              "
            >
              Description
            </h3>

            <div
              className="
                bg-slate-50
                border
                border-slate-200
                rounded-3xl
                p-6
              "
            >
              <p
                className="
                  text-slate-600
                  leading-8
                  text-lg
                "
              >
                {tag.description || "No description available."}
              </p>
            </div>
          </div>

          {/* INFORMATION */}
          <div>
            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
                mb-5
              "
            >
              Tag Information
            </h3>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >
              {/* TAG ID */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  p-5
                  rounded-2xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MdLabel size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Tag ID</p>

                  <p className="font-semibold text-slate-800">#{tag.tagId}</p>
                </div>
              </div>

              {/* CREATED DATE */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  p-5
                  rounded-2xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-cyan-100
                    text-cyan-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MdCalendarToday size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Created On</p>

                  <p className="font-semibold text-slate-800">
                    {tag.createdAt
                      ? new Date(tag.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              {/* UPDATED DATE */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  p-5
                  rounded-2xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MdCalendarToday size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>

                  <p className="font-semibold text-slate-800">
                    {tag.updatedAt
                      ? new Date(tag.updatedAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              {/* CREATED BY */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  p-5
                  rounded-2xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-green-100
                    text-green-600
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MdPerson size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Created By</p>

                  <p className="font-semibold text-slate-800">
                    {tag.createdBy?.name || tag.createdBy?.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CREATED BY ID */}
          {tag.createdBy?._id && (
            <div
              className="
                pt-6
                border-t
                border-slate-200
              "
            >
              <p className="text-xs text-slate-400">Created By User ID</p>

              <p className="text-sm text-slate-500 mt-1 break-all">
                {tag.createdBy._id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTag;
