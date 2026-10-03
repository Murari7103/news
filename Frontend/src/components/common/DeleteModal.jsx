import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        z-50
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full max-w-md
          bg-white
          rounded-3xl
          p-6
          shadow-2xl
        "
      >
        <h2 className="text-2xl font-bold text-slate-800">Delete News</h2>

        <p className="text-slate-500 mt-3">
          Are you sure you want to delete this news article?
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="
              px-5 py-3
              rounded-2xl
              bg-slate-100
              hover:bg-slate-200
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-5 py-3
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
