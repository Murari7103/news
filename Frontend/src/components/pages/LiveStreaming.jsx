import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdRefresh,
  MdLiveTv,
  MdStar,
  MdLocalFireDepartment,
} from "react-icons/md";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { getAllLiveStreams, deleteLiveStream } from "../../api/liveStreamApi";

const LiveStreaming = () => {
  const navigate = useNavigate();

  const [streams, setStreams] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD LIVE STREAMS
  // ======================================================

  const loadStreams = async () => {
    try {
      setLoading(true);

      const response = await getAllLiveStreams();

      setStreams(response?.data || []);
    } catch (error) {
      console.error("Load Live Streams Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load live streams",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadStreams();
  }, []);

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (stream) => {
    const result = await Swal.fire({
      title: "Delete Live Stream?",
      text: `"${stream.title}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await deleteLiveStream(stream.streamId);

      toast.success(response.message || "Live stream deleted successfully");

      await loadStreams();
    } catch (error) {
      console.error("Delete Live Stream Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete live stream",
      );
    }
  };

  // ======================================================
  // FILTER STREAMS
  // ======================================================

  const filteredStreams = useMemo(() => {
    return streams.filter((stream) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        stream.title?.toLowerCase().includes(searchText) ||
        stream.platform?.toLowerCase().includes(searchText);

      const matchesStatus = statusFilter
        ? stream.status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [streams, search, statusFilter]);

  // ======================================================
  // STATUS BADGE
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
  // DATE FORMAT
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Live Streaming 🎥
          </h1>

          <p className="text-slate-500 mt-2">
            Manage scheduled, live and completed video streams.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/live-streaming/add")}
          className="
            inline-flex items-center gap-2
            px-5 py-3
            rounded-xl
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            transition
          "
        >
          <MdAdd size={22} />
          Add Live Stream
        </button>
      </div>

      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div
        className="
          bg-white
          border border-slate-200
          rounded-2xl
          p-4
          shadow-sm
        "
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* SEARCH */}

          <div className="relative flex-1">
            <MdSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
              size={22}
            />

            <input
              type="text"
              placeholder="Search live streams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-11 pr-4
                py-3
                border border-slate-200
                rounded-xl
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              lg:w-52
              px-4
              py-3
              border border-slate-200
              rounded-xl
              bg-white
              outline-none
              focus:border-blue-500
            "
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live</option>
            <option value="Ended">Ended</option>
          </select>

          {/* REFRESH */}

          <button
            onClick={loadStreams}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              border border-slate-200
              text-slate-700
              font-medium
              hover:bg-slate-50
              transition
            "
          >
            <MdRefresh size={21} />
            Refresh
          </button>
        </div>
      </div>

      {/* ==================================================
          STREAM COUNT
      ================================================== */}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <MdLiveTv size={20} />
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {filteredStreams.length}
        </span>{" "}
        live stream
        {filteredStreams.length !== 1 ? "s" : ""}
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-12
            text-center
          "
        >
          <div className="animate-spin inline-block">
            <MdRefresh size={32} className="text-blue-600" />
          </div>

          <p className="mt-3 text-slate-500">Loading live streams...</p>
        </div>
      ) : filteredStreams.length === 0 ? (
        /* ==================================================
            EMPTY
        ================================================== */

        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-12
            text-center
          "
        >
          <MdLiveTv size={55} className="mx-auto text-slate-300" />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No Live Streams Found
          </h3>

          <p className="mt-2 text-slate-500">
            {search || statusFilter
              ? "Try changing your search or filter."
              : "Create your first live stream to get started."}
          </p>

          {!search && !statusFilter && (
            <button
              onClick={() => navigate("/dashboard/live-streaming/add")}
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-700
              "
            >
              <MdAdd size={21} />
              Add Live Stream
            </button>
          )}
        </div>
      ) : (
        /* ==================================================
            TABLE
        ================================================== */

        <div
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Stream
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Platform
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Start Time
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                    Flags
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStreams.map((stream) => (
                  <tr
                    key={stream.streamId}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* STREAM */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4 min-w-[280px]">
                        <div
                          className="
                            w-16 h-12
                            rounded-lg
                            bg-slate-100
                            overflow-hidden
                            flex items-center justify-center
                            shrink-0
                          "
                        >
                          {stream.thumbnail ? (
                            <img
                              src={stream.thumbnail}
                              alt={stream.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <MdLiveTv size={26} className="text-slate-400" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {stream.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: #{stream.streamId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PLATFORM */}

                    <td className="px-6 py-5">
                      <span
                        className="
                          inline-flex
                          px-3 py-1.5
                          rounded-lg
                          bg-slate-100
                          text-slate-700
                          text-sm
                          font-medium
                        "
                      >
                        {stream.platform || "Other"}
                      </span>
                    </td>

                    {/* START TIME */}

                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(stream.startTime)}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
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
                    </td>

                    {/* FLAGS */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {stream.isFeatured && (
                          <span
                            title="Featured"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              w-8 h-8
                              rounded-lg
                              bg-yellow-50
                              text-yellow-600
                            "
                          >
                            <MdStar size={19} />
                          </span>
                        )}

                        {stream.isBreaking && (
                          <span
                            title="Breaking"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              w-8 h-8
                              rounded-lg
                              bg-red-50
                              text-red-600
                            "
                          >
                            <MdLocalFireDepartment size={19} />
                          </span>
                        )}

                        {!stream.isFeatured && !stream.isBreaking && (
                          <span className="text-slate-300">—</span>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* VIEW */}

                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/live-streaming/view/${stream.streamId}`,
                            )
                          }
                          title="View"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                            hover:bg-blue-100
                            transition
                          "
                        >
                          <MdVisibility size={19} />
                        </button>

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/live-streaming/edit/${stream.streamId}`,
                            )
                          }
                          title="Edit"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            bg-amber-50
                            text-amber-600
                            hover:bg-amber-100
                            transition
                          "
                        >
                          <MdEdit size={19} />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() => handleDelete(stream)}
                          title="Delete"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            transition
                          "
                        >
                          <MdDelete size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreaming;
