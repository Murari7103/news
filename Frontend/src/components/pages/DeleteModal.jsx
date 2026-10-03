import React, { useEffect } from "react";
import { MdWarningAmber, MdClose } from "react-icons/md";

const DeleteModal = ({
  isOpen,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  closeOnOverlay = true,
  icon = <MdWarningAmber size={28} />,
  onClose,
  onDelete,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!loading && closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              {icon}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center disabled:opacity-50"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onDelete}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
