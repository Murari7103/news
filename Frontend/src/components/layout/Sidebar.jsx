import React from "react";

import {
     MdDashboard,
     MdCategory,
     MdOutlineLabel,
     MdArticle,
     MdOutlineMail,
     MdFlashOn,
     MdLiveTv,
     MdRssFeed,
     MdLayers,
     MdCampaign,
     MdPeople,
     MdClose,
} from "react-icons/md";

import { NavLink } from "react-router-dom";

const menuSections = [
  {
    title: "",
    items: [
      {
        name: "Dashboard",
        icon: <MdDashboard size={22} />,
        path: "/dashboard",
      },
    ],
  },

  {
    title: "News Management",
    items: [
      {
        name: "Category",
        icon: <MdCategory size={22} />,
        path: "/dashboard/category",
      },

      // {
      //      name: "Subcategory",
      //      icon: <MdLayers size={22} />,
      //      path: "/subcategory",
      // },

      {
        name: "Tag",
        icon: <MdOutlineLabel size={22} />,
        path: "/dashboard/tag",
      },

      {
        name: "News",
        icon: <MdArticle size={22} />,
        path: "/dashboard/news",
      },

     //  {
     //    name: "eNews",
     //    icon: <MdOutlineMail size={22} />,
     //    path: "/dashboard/enews",
     //  },

      {
        name: "Breaking News",
        icon: <MdFlashOn size={22} />,
        path: "/dashboard/breaking-news",
      },

      {
        name: "Live Streaming",
        icon: <MdLiveTv size={22} />,
        path: "/dashboard/live-streaming",
      },

      //  {
      //    name: "RSS Sources",
      //    icon: <MdRssFeed size={22} />,
      //    path: "/rss-sources",
      //  },
    ],
  },

  {
    title: "Home Screen Management",
    items: [
      {
        name: "Logout",
        icon: <MdLayers size={22} />,
        path: "/logout",
      },

      {
        name: "Ad Spaces",
        icon: <MdCampaign size={22} />,
        path: "/ad-spaces",
      },
    ],
  },

  {
    title: "User Management",
    items: [
      {
        name: "Users",
        icon: <MdPeople size={22} />,
        path: "/users",
      },
    ],
  },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
     return (
          <>
               {/* MOBILE OVERLAY */}
               <div
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          lg:hidden transition-all duration-300
          ${isSidebarOpen
                              ? "opacity-100 visible"
                              : "opacity-0 invisible"
                         }
        `}
               />

               {/* SIDEBAR */}
               <aside
                    className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-[290px]
          bg-[#0F172A]
          border-r border-slate-800
          text-white
          flex flex-col
          transition-transform duration-300 ease-in-out
          
          ${isSidebarOpen
                              ? "translate-x-0"
                              : "-translate-x-full lg:translate-x-0"
                         }
        `}
               >
                    {/* LOGO */}
                    <div
                         className="
            h-[80px]
            px-6
            flex items-center justify-between
            border-b border-slate-800
          "
                    >
                         <div>
                              <h1
                                   className="
                text-3xl font-extrabold
                bg-gradient-to-r
                from-blue-500
                to-cyan-400
                bg-clip-text
                text-transparent
              "
                              >
                                   NewsIQ
                              </h1>

                              <p className="text-xs text-slate-400 mt-1">
                                   Premium Admin
                              </p>
                         </div>

                         <button
                              onClick={() => setIsSidebarOpen(false)}
                              className="lg:hidden"
                         >
                              <MdClose size={24} />
                         </button>
                    </div>

                    {/* MENU */}
                    <div
                         className="
            flex-1
            overflow-y-auto
            px-4 py-5
            scrollbar-thin
            scrollbar-thumb-slate-700
          "
                    >
                         <div className="space-y-8">
                              {menuSections.map((section, sectionIndex) => (
                                   <div key={sectionIndex}>

                                        {/* SECTION TITLE */}
                                        {section.title && (
                                             <h2
                                                  className="
                      text-xs uppercase
                      tracking-widest
                      text-slate-400
                      font-semibold
                      mb-3 px-2
                    "
                                             >
                                                  {section.title}
                                             </h2>
                                        )}

                                        {/* MENU ITEMS */}
                                        <div className="space-y-2">
                                             {section.items.map((item, index) => (
                                                  <NavLink
                                                       key={index}
                                                       to={item.path}
                                                       className={({ isActive }) =>
                                                            `
                        flex items-center gap-4
                        px-4 py-3.5
                        rounded-2xl
                        transition-all duration-300
                        group
                        
                        ${isActive
                                                                 ? `
                              bg-gradient-to-r
                              from-blue-600
                              to-cyan-500
                              text-white
                              shadow-lg
                            `
                                                                 : `
                              text-slate-300
                              hover:bg-slate-800
                              hover:text-white
                            `
                                                            }
                      `
                                                       }
                                                  >
                                                       <span
                                                            className="
                          group-hover:scale-110
                          transition-transform duration-300
                        "
                                                       >
                                                            {item.icon}
                                                       </span>

                                                       <span className="font-medium">
                                                            {item.name}
                                                       </span>
                                                  </NavLink>
                                             ))}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </aside>
          </>
     );
};

export default Sidebar;