import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DataTable from "react-data-table-component";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
} from "react-icons/md";

import { getCategories, deleteCategory } from "../../api/categoryApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { apiHandler } from "../../utils/apiHandler";

const Category = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // LOAD CATEGORIES
  useEffect(() => {
    loadCategories();
  }, []);

  // FETCH CATEGORIES
  const loadCategories = async () => {
    await apiHandler({
      apiCall: getCategories,

      showSuccessToast: false,

      errorMessage: "Failed to load categories.",

      onSuccess: (response) => {
        if (response.success) {
          setCategories(response.categories);
        } else {
          setCategories([]);
        }
      },

      onError: (error) => {
        console.error(error);
        setCategories([]);
      },
    });
  };

  // DELETE MODAL OPEN
  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      html: `Are you sure you want to delete <b>${category.name}</b>?<br><br>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(category.categoryId);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      loadCategories();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: getErrorMessage(error),
      });
    }
  };

  // CONFIRM DELETE
  // const confirmDelete = async () => {
  //   if (!selectedCategory) return;

  //   try {
  //     const response = await deleteCategory(selectedCategory._id);
  //     toast.success(response.message);
  //     loadCategories();
  //     setShowDeleteModal(false);
  //     setSelectedCategory(null);
  //   } catch (error) {
  //     toast.error(getErrorMessage(error));
  //   }
  // };

  // STATUS TOGGLE
  const handleStatusToggle = (category) => {
    const updatedStatus = category.status === "Active" ? "Inactive" : "Active";

    updateCategory(category.id, {
      status: updatedStatus,
    });

    loadCategories();

    toast.success(`Category marked as ${updatedStatus} `);
  };

  // SEARCH FILTER
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  // TABLE COLUMNS
  const columns = [
    {
      name: "Category",

      grow: 2,

      cell: (row) => (
        <div className="flex items-center gap-4 py-3">
          <img
            src={
              row.image || "https://via.placeholder.com/100x100?text=Category"
            }
            alt={row.name}
            className="
              w-14 h-14
              rounded-2xl
              object-cover
              border border-slate-200
            "
          />

          <div>
            <h3 className="font-semibold text-slate-800">{row.name}</h3>

            <p className="text-sm text-slate-500 mt-1">ID: #{row.categoryId}</p>
          </div>
        </div>
      ),
    },

    {
      name: "Slug",

      selector: (row) => row.slug,

      cell: (row) => (
        <span
          className="
            bg-slate-100
            text-slate-700
            px-3 py-1
            rounded-xl
            text-sm
          "
        >
          {row.slug}
        </span>
      ),
    },

    // {
    //   name: "Status",

    //   center: true,

    //   cell: (row) => (
    //     <button
    //       onClick={() => handleStatusToggle(row)}
    //       className={`
    //         relative
    //         w-14 h-8
    //         rounded-full
    //         transition-all duration-300
    //         ${row.status === "Active" ? "bg-green-500" : "bg-slate-300"}
    //       `}
    //     >
    //       <span
    //         className={`
    //           absolute
    //           top-1
    //           w-6 h-6
    //           rounded-full
    //           bg-white
    //           transition-all duration-300
    //           ${row.status === "Active" ? "left-7" : "left-1"}
    //         `}
    //       />
    //     </button>
    //   ),
    // },

    {
      name: "News Count",

      selector: (row) => row.newsCount || 0,

      center: true,
    },

    {
      name: "Created At",

      selector: (row) => row.createdAt,
    },

    {
      name: "Actions",

      center: true,

      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* VIEW */}
          <button
            onClick={() =>
              navigate(`/dashboard/category/view/${row.categoryId}`)
            }
            className="
              w-10 h-10
              rounded-xl
              bg-blue-100
              text-blue-600
              flex items-center justify-center
              hover:scale-110
              transition-all duration-300
            "
          >
            <MdVisibility size={20} />
          </button>

          {/* EDIT */}
          <button
            onClick={() =>
              navigate(`/dashboard/category/edit/${row.categoryId}`)
            }
            className="
              w-10 h-10
              rounded-xl
              bg-green-100
              text-green-600
              flex items-center justify-center
              hover:scale-110
              transition-all duration-300
            "
          >
            <MdEdit size={20} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => handleDelete(row)}
            className="
              w-10 h-10
              rounded-xl
              bg-red-100
              text-red-600
              flex items-center justify-center
              hover:scale-110
              transition-all duration-300
            "
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    },
  ];

  // CUSTOM TABLE STYLES
  const customStyles = {
    rows: {
      style: {
        minHeight: "80px",
      },
    },

    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#475569",
        backgroundColor: "#F8FAFC",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #E2E8F0",
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div
        className="
          flex flex-col lg:flex-row
          items-start lg:items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-3xl md:text-4xl
              font-bold
              text-slate-900
            "
          >
            Category Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all news categories here.
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => navigate("/dashboard/category/add")}
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-medium
            hover:shadow-xl
            transition-all duration-300
            w-full sm:w-auto
            justify-center
          "
        >
          <MdAdd size={22} />
          Add Category
        </button>
      </div>

      {/* SEARCH BAR */}
      <div
        className="
          bg-white
          rounded-3xl
          p-5
          shadow-sm
          border border-slate-200
        "
      >
        <div
          className="
            flex items-center
            gap-3
            bg-slate-100
            rounded-2xl
            px-4 py-3
            w-full lg:w-[350px]
          "
        >
          <MdSearch size={22} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              bg-transparent
              outline-none
              w-full
              text-sm
            "
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border border-slate-200
          overflow-hidden
        "
      >
        <DataTable
          columns={columns}
          data={filteredCategories}
          pagination
          responsive
          striped
          highlightOnHover
          persistTableHead
          customStyles={customStyles}
          noDataComponent={
            <div className="py-10 text-slate-500">No categories found 🚫</div>
          }
        />
      </div>

      {/* FOOTER */}
      <div
        className="
          flex flex-col sm:flex-row
          items-center justify-between
          gap-4
        "
      >
        <p className="text-sm text-slate-500">
          Showing 1 to {filteredCategories.length} of {categories.length}{" "}
          categories
        </p>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="
            fixed inset-0
            z-50
            flex items-center justify-center
            bg-black/40
            backdrop-blur-sm
            p-4
          "
        >
          <div
            className="
              bg-white
              rounded-3xl
              w-full max-w-md
              p-8
              shadow-2xl
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              Delete Category
            </h2>

            <p className="text-slate-500 mt-3">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedCategory?.name}"</span>?
            </p>

            <div
              className="
                flex items-center justify-end
                gap-3
                mt-8
              "
            >
              {/* CANCEL */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-slate-100
                  text-slate-700
                  hover:bg-slate-200
                  transition-all duration-300
                "
              >
                Cancel
              </button>

              {/* DELETE */}
              <button
                onClick={confirmDelete}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-red-500
                  text-white
                  hover:bg-red-600
                  transition-all duration-300
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
