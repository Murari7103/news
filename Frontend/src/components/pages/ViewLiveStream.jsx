import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MdArrowBack,
  MdEdit,
  MdLiveTv,
  MdOpenInNew,
  MdStar,
  MdLocalFireDepartment,
  MdSchedule,
  MdLink,
} from "react-icons/md";

import toast from "react-hot-toast";

import { getLiveStreamById } from "../../api/liveStreamApi";

const ViewLiveStream = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD STREAM
  // ======================================================

  useEffect(() => {
    const loadStream = async () => {
      try {
        setLoading(true);

        const response = await getLiveStreamById(id);

        if (!response?.data) {
          toast.error("Live stream not found");
          navigate("/dashboard/live-streaming");
          return;
        }

        setStream(response.data);
      } catch (error) {
        console.error("Load Live Stream Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load live stream",
        );

        navigate("/dashboard/live-streaming");
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [id, navigate]);

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    if (status === "Live") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Scheduled") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          min-h-[400px]
          flex items-center justify-center
        "
      >
        <div className="text-center">
          <MdLiveTv
            size={45}
            className="
              mx-auto
              text-blue-600
              animate-pulse
            "
          />

          <p className="mt-3 text-slate-500">Loading live stream...</p>
        </div>
      </div>
    );
  }

  if (!stream) {
    return null;
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex flex-col
          lg:flex-row
          lg:items-center
          justify-between
          gap-4
        "
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/live-streaming")}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-xl
              bg-white
              border border-slate-200
              text-slate-600
              hover:bg-slate-50
              transition
            "
          >
            <MdArrowBack size={22} />
          </button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Live Stream Details 🎥
            </h1>

            <p className="text-slate-500 mt-1">
              View complete information about this stream.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/live-streaming/edit/${stream.streamId}`)
            }
            className="
              inline-flex
              items-center
              gap-2
              px-5 py-3
              rounded-xl
              bg-amber-500
              text-white
              font-semibold
              hover:bg-amber-600
              transition
            "
          >
            <MdEdit size={20} />
            Edit
          </button>

          {/* OPEN STREAM */}

          <a
            href={stream.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              px-5 py-3
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
              hover:bg-blue-700
              transition
            "
          >
            <MdOpenInNew size={20} />
            Open Stream
          </a>
        </div>
      </div>

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ==================================================
            LEFT / MAIN
        ================================================== */}

        <div className="xl:col-span-2 space-y-6">
          {/* STREAM PREVIEW */}

          <div
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >
            <div className="aspect-video bg-slate-100">
              {stream.thumbnail ? (
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MdLiveTv size={70} className="text-slate-300" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`
                    inline-flex
                    px-3 py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${getStatusClass(stream.status)}
                  `}
                >
                  {stream.status}
                </span>

                <span
                  className="
                    inline-flex
                    px-3 py-1.5
                    rounded-full
                    bg-slate-100
                    text-slate-700
                    text-xs
                    font-semibold
                  "
                >
                  {stream.platform}
                </span>

                {stream.isFeatured && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      px-3 py-1.5
                      rounded-full
                      bg-yellow-50
                      text-yellow-700
                      text-xs
                      font-semibold
                    "
                  >
                    <MdStar size={16} />
                    Featured
                  </span>
                )}

                {stream.isBreaking && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      px-3 py-1.5
                      rounded-full
                      bg-red-50
                      text-red-700
                      text-xs
                      font-semibold
                    "
                  >
                    <MdLocalFireDepartment size={16} />
                    Breaking
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                {stream.title}
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                Stream ID: #{stream.streamId}
              </p>

              {stream.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </h3>

                  <p className="text-slate-600 leading-7 whitespace-pre-line">
                    {stream.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SCHEDULE */}

          <div
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              shadow-sm
              p-6
            "
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                <MdSchedule size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Schedule
                </h2>

                <p className="text-sm text-slate-500">
                  Stream timing information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Start Time
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {formatDate(stream.startTime)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs font-medium text-slate-400 uppercase">
                  End Time
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {formatDate(stream.endTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            RIGHT / DETAILS
        ================================================== */}

        <div className="space-y-6">
          {/* STREAM INFORMATION */}

          <div
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              shadow-sm
              p-6
            "
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-5">
              Stream Information
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Platform
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {stream.platform}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Status
                </p>

                <span
                  className={`
                    mt-2
                    inline-flex
                    px-3 py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${getStatusClass(stream.status)}
                  `}
                >
                  {stream.status}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Stream ID
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  #{stream.streamId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Slug
                </p>

                <p className="mt-1 text-sm text-slate-600 break-all">
                  {stream.slug}
                </p>
              </div>
            </div>
          </div>

          {/* STREAM URL */}

          <div
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              shadow-sm
              p-6
            "
          >
            <div className="flex items-center gap-2 mb-4">
              <MdLink size={21} className="text-blue-600" />

              <h2 className="text-lg font-semibold text-slate-800">
                Stream URL
              </h2>
            </div>

            <p
              className="
                text-sm
                text-slate-600
                break-all
                bg-slate-50
                p-3
                rounded-xl
              "
            >
              {stream.streamUrl}
            </p>

            <a
              href={stream.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                px-4 py-3
                rounded-xl
                bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-700
                transition
              "
            >
              <MdOpenInNew size={19} />
              Open Stream
            </a>
          </div>

          {/* FLAGS */}

          <div
            className="
              bg-white
              border border-slate-200
              rounded-2xl
              shadow-sm
              p-6
            "
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-5">
              Visibility
            </h2>

            <div className="space-y-3">
              <div
                className="
                  flex items-center
                  justify-between
                  p-4
                  rounded-xl
                  bg-slate-50
                "
              >
                <span className="text-sm text-slate-600">Featured</span>

                <span
                  className={`
                    text-sm font-semibold
                    ${stream.isFeatured ? "text-green-600" : "text-slate-400"}
                  `}
                >
                  {stream.isFeatured ? "Yes" : "No"}
                </span>
              </div>

              <div
                className="
                  flex items-center
                  justify-between
                  p-4
                  rounded-xl
                  bg-slate-50
                "
              >
                <span className="text-sm text-slate-600">Breaking</span>

                <span
                  className={`
                    text-sm font-semibold
                    ${stream.isBreaking ? "text-red-600" : "text-slate-400"}
                  `}
                >
                  {stream.isBreaking ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLiveStream;
