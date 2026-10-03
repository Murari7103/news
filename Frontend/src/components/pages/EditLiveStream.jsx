import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MdArrowBack, MdSave, MdLiveTv } from "react-icons/md";

import toast from "react-hot-toast";

import { getLiveStreamById, updateLiveStream } from "../../api/liveStreamApi";

const EditLiveStream = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    streamUrl: "",
    platform: "YouTube",
    thumbnail: "",
    startTime: "",
    endTime: "",
    status: "Scheduled",
    isFeatured: false,
    isBreaking: false,
  });

  // ======================================================
  // LOAD STREAM
  // ======================================================

  useEffect(() => {
    const loadStream = async () => {
      try {
        setLoading(true);

        const response = await getLiveStreamById(id);

        const stream = response?.data;

        if (!stream) {
          toast.error("Live stream not found");
          navigate("/dashboard/live-streaming");
          return;
        }

        setFormData({
          title: stream.title || "",
          description: stream.description || "",
          streamUrl: stream.streamUrl || "",
          platform: stream.platform || "YouTube",
          thumbnail: stream.thumbnail || "",
          startTime: stream.startTime
            ? formatDateTimeLocal(stream.startTime)
            : "",
          endTime: stream.endTime ? formatDateTimeLocal(stream.endTime) : "",
          status: stream.status || "Scheduled",
          isFeatured: stream.isFeatured || false,
          isBreaking: stream.isBreaking || false,
        });
      } catch (error) {
        console.error("Load Edit Live Stream Error:", error);

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
  // FORMAT DATE FOR DATETIME-LOCAL
  // ======================================================

  const formatDateTimeLocal = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const offset = parsedDate.getTimezoneOffset();

    const localDate = new Date(parsedDate.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!formData.title.trim()) {
      toast.error("Please enter stream title");
      return;
    }

    if (!formData.streamUrl.trim()) {
      toast.error("Please enter stream URL");
      return;
    }

    if (!formData.startTime) {
      toast.error("Please select start time");
      return;
    }

    if (
      formData.endTime &&
      new Date(formData.endTime) <= new Date(formData.startTime)
    ) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        streamUrl: formData.streamUrl.trim(),
        platform: formData.platform,
        thumbnail: formData.thumbnail.trim(),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: formData.endTime
          ? new Date(formData.endTime).toISOString()
          : null,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isBreaking: formData.isBreaking,
      };

      const response = await updateLiveStream(id, payload);

      toast.success(response.message || "Live stream updated successfully");

      navigate(`/dashboard/live-streaming/view/${id}`);
    } catch (error) {
      console.error("Update Live Stream Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update live stream",
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <MdLiveTv size={45} className="mx-auto text-blue-600 animate-pulse" />

          <p className="mt-3 text-slate-500">Loading live stream...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/live-streaming/view/${id}`)}
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
            Edit Live Stream ✏️
          </h1>

          <p className="text-slate-500 mt-1">
            Update live stream information and settings.
          </p>
        </div>
      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ==================================================
              MAIN INFORMATION
          ================================================== */}

          <div className="xl:col-span-2 space-y-6">
            {/* BASIC INFORMATION */}

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
                    flex items-center justify-center
                  "
                >
                  <MdLiveTv size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Stream Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update the basic stream details.
                  </p>
                </div>
              </div>

              {/* TITLE */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Stream Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter live stream title"
                  className="
                    w-full
                    px-4 py-3
                    border border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Enter live stream description"
                  className="
                    w-full
                    px-4 py-3
                    border border-slate-200
                    rounded-xl
                    outline-none
                    resize-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* STREAM URL */}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Stream URL <span className="text-red-500">*</span>
                </label>

                <input
                  type="url"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="
                    w-full
                    px-4 py-3
                    border border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* PLATFORM */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Platform
                </label>

                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="
                    w-full
                    px-4 py-3
                    border border-slate-200
                    rounded-xl
                    bg-white
                    outline-none
                    focus:border-blue-500
                  "
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Other">Other</option>
                </select>
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
              <h2 className="text-lg font-semibold text-slate-800">Schedule</h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                Update when the live stream starts and ends.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* START */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4 py-3
                      border border-slate-200
                      rounded-xl
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* END */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4 py-3
                      border border-slate-200
                      rounded-xl
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <div className="space-y-6">
            {/* THUMBNAIL */}

            <div
              className="
                bg-white
                border border-slate-200
                rounded-2xl
                shadow-sm
                p-6
              "
            >
              <h2 className="text-lg font-semibold text-slate-800">
                Thumbnail
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-5">
                Update the stream thumbnail URL.
              </p>

              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="
                  w-full
                  px-4 py-3
                  border border-slate-200
                  rounded-xl
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              {formData.thumbnail && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={formData.thumbnail}
                    alt="Stream thumbnail"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* STATUS */}

            <div
              className="
                bg-white
                border border-slate-200
                rounded-2xl
                shadow-sm
                p-6
              "
            >
              <h2 className="text-lg font-semibold text-slate-800">
                Stream Status
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-5">
                Update the current stream status.
              </p>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="
                  w-full
                  px-4 py-3
                  border border-slate-200
                  rounded-xl
                  bg-white
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Ended">Ended</option>
              </select>
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
              <h2 className="text-lg font-semibold text-slate-800">
                Visibility
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-5">
                Configure stream visibility options.
              </p>

              {/* FEATURED */}

              <label
                className="
                  flex items-center justify-between
                  gap-4
                  p-4
                  rounded-xl
                  bg-slate-50
                  cursor-pointer
                  mb-3
                "
              >
                <div>
                  <p className="font-medium text-slate-800">Featured Stream</p>

                  <p className="text-xs text-slate-500 mt-1">
                    Highlight this stream.
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
                  flex items-center justify-between
                  gap-4
                  p-4
                  rounded-xl
                  bg-slate-50
                  cursor-pointer
                "
              >
                <div>
                  <p className="font-medium text-slate-800">Breaking Stream</p>

                  <p className="text-xs text-slate-500 mt-1">
                    Mark this as a breaking live stream.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isBreaking"
                  checked={formData.isBreaking}
                  onChange={handleChange}
                  className="w-5 h-5 accent-red-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            mt-6
            flex flex-col sm:flex-row
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={() => navigate(`/dashboard/live-streaming/view/${id}`)}
            disabled={saving}
            className="
              px-6 py-3
              rounded-xl
              border border-slate-200
              text-slate-700
              font-semibold
              hover:bg-slate-50
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6 py-3
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
              hover:bg-blue-700
              transition
              disabled:opacity-50
            "
          >
            <MdSave size={21} />

            {saving ? "Updating..." : "Update Live Stream"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLiveStream;
