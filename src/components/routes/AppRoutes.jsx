// src/components/routes/AppRoutes.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../../components/pages/Dashboard";

function AppRoutes() {
     return (
          <BrowserRouter>
               <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                         <Route index element={<Dashboard />} />
                    </Route>
               </Routes>
          </BrowserRouter>
     );
}

export default AppRoutes;