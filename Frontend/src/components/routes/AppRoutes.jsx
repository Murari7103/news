// src/components/routes/AppRoutes.jsx

import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";

import Dashboard from "../../components/pages/Dashboard";

import News from "../pages/News";
import NewsForm from "../pages/NewsForm";
import EditNews from "../pages/EditNews";

import AddCategory from "../pages/AddCategory";
import EditCategory from "../pages/EditCategory";
import Category from "../pages/Category";

import ViewNews from "../pages/viewNews";

import Login from "../auth/Login";
import Register from "../auth/Register";
import AuthLayout from "../auth/AuthLayout";

import ProtectedRoute from "../auth/ProtectedRoute";
import Logout from "../auth/Logout";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import ViewCategory from "../pages/ViewCategory";
import AddNews from "../pages/AddNews";
import Tag from "../pages/Tag";
import AddTag from "../pages/AddTag";
import EditTag from "../pages/EditTag";
import ViewTag from "../pages/ViewTag";
import BreakingNews from "../pages/BreakingNews";
import LiveStreaming from "../pages/LiveStreaming";
import AddLiveStream from "../pages/AddLiveStreaming";
import ViewLiveStream from "../pages/ViewLiveStream";
import EditLiveStream from "../pages/EditLiveStream";

function AppRoutes() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/forgot-password"
          element={
            token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          {/* LOGIN PAGE */}
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              token ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
        </Route>

        <Route path="/logout" element={<Logout />} />
        {/* PROTECTED DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="news" element={<News />} />
          <Route path="news/add" element={<AddNews />} />
          <Route path="news/view/:id" element={<ViewNews />} />
          <Route path="news/edit/:id" element={<EditNews />} />
          <Route path="category" element={<Category />} />

          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/view/:categoryId" element={<ViewCategory />} />

          <Route path="category/edit/:categoryId" element={<EditCategory />} />
          <Route path="breaking-news" element={<BreakingNews />} />

          <Route path="tag" element={<Tag />} />
          <Route path="tag/add" element={<AddTag />} />
          <Route path="tag/edit/:tagId" element={<EditTag />} />
          <Route path="tag/view/:tagId" element={<ViewTag />} />
          <Route path="live-streaming" element={<LiveStreaming />} />
          <Route path="live-streaming/add" element={<AddLiveStream />} />
          <Route path="live-streaming/view/:id" element={<ViewLiveStream />} />
          <Route path="live-streaming/edit/:id" element={<EditLiveStream />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
