// src/components/layout/DashboardLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     return (
          <div className="flex h-screen bg-slate-100 overflow-hidden">

               {/* Sidebar */}
               <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
               />

               {/* Right Side */}
               <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Navbar */}
                    <Navbar setIsSidebarOpen={setIsSidebarOpen} />

                    {/* Main Content */}
                    <main
                         className="
            flex-1
            overflow-y-auto
            p-4 sm:p-5 md:p-6 lg:p-7
          "
                    >
                         <div
                              className="
              min-h-full
              rounded-2xl
            "
                         >
                              <Outlet />
                         </div>
                    </main>
               </div>
          </div>
     );
};

export default DashboardLayout;