import React from "react";

import {
     MdMenu,
     MdSearch,
     MdNotificationsNone,
     MdOutlineMailOutline,
     MdKeyboardArrowDown,
} from "react-icons/md";

const Navbar = ({ setIsSidebarOpen }) => {
     return (
          <header
               className="
        sticky top-0 z-30
        h-[75px]
        bg-white/80
        backdrop-blur-xl
        border-b border-slate-200
        px-4 sm:px-6 lg:px-8
        flex items-center justify-between
      "
          >
               {/* LEFT SECTION */}
               <div className="flex items-center gap-4">

                    {/* Mobile Menu Button */}
                    <button
                         onClick={() => setIsSidebarOpen(true)}
                         className="
            lg:hidden
            p-2 rounded-xl
            hover:bg-slate-100
            transition-all duration-300
          "
                    >
                         <MdMenu size={25} className="text-slate-700" />
                    </button>

                    {/* Search Bar */}
                    <div
                         className="
            hidden md:flex
            items-center
            bg-slate-100
            border border-slate-200
            rounded-2xl
            px-4 py-3
            w-[260px] lg:w-[340px]
            transition-all duration-300
            focus-within:border-blue-500
            focus-within:shadow-lg
            focus-within:shadow-blue-100
          "
                    >
                         <MdSearch
                              size={22}
                              className="text-slate-400"
                         />

                         <input
                              type="text"
                              placeholder="Search anything..."
                              className="
              bg-transparent
              outline-none
              border-none
              px-3
              w-full
              text-sm
              text-slate-700
              placeholder:text-slate-400
            "
                         />
                    </div>
               </div>

               {/* RIGHT SECTION */}
               <div className="flex items-center gap-3 sm:gap-4">

                    {/* Mail */}
                    <button
                         className="
            relative
            p-3
            rounded-2xl
            bg-white
            border border-slate-200
            hover:bg-slate-100
            hover:shadow-md
            transition-all duration-300
          "
                    >
                         <MdOutlineMailOutline
                              size={22}
                              className="text-slate-700"
                         />

                         <span
                              className="
              absolute
              top-2 right-2
              w-2.5 h-2.5
              bg-cyan-400
              rounded-full
            "
                         />
                    </button>

                    {/* Notifications */}
                    <button
                         className="
            relative
            p-3
            rounded-2xl
            bg-white
            border border-slate-200
            hover:bg-slate-100
            hover:shadow-md
            transition-all duration-300
          "
                    >
                         <MdNotificationsNone
                              size={24}
                              className="text-slate-700"
                         />

                         <span
                              className="
              absolute
              top-2 right-2
              w-2.5 h-2.5
              bg-red-500
              rounded-full
            "
                         />
                    </button>

                    {/* PROFILE */}
                    <div
                         className="
            flex items-center gap-3
            bg-white
            border border-slate-200
            rounded-2xl
            px-2 py-1.5
            hover:shadow-md
            transition-all duration-300
            cursor-pointer
          "
                    >
                         {/* Avatar */}
                         <img
                              src="https://i.pravatar.cc/150?img=12"
                              alt="Admin"
                              className="
              w-11 h-11
              rounded-2xl
              object-cover
            "
                         />

                         {/* User Info */}
                         <div className="hidden sm:block">
                              <h3 className="text-sm font-semibold text-slate-800">
                                   Murari Jee
                              </h3>

                              <p className="text-xs text-slate-500">
                                   Super Admin
                              </p>
                         </div>

                         {/* Dropdown Arrow */}
                         <MdKeyboardArrowDown
                              size={22}
                              className="
              hidden sm:block
              text-slate-500
            "
                         />
                    </div>
               </div>
          </header>
     );
};

export default Navbar;