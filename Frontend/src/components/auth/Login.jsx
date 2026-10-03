import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

import toast from "react-hot-toast";
import { login } from "../../api/authApi";
const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // EMAIL
    if (!formData.email.trim()) {
      toast.error("Email is required");

      return;
    }

    // PASSWORD
    if (!formData.password.trim()) {
      toast.error("Password is required");

      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // SAVE TOKEN
      localStorage.setItem("token", response.data.data.token);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      toast.success(response.data.message);

      // RESET FORM
      setFormData({
        email: "",
        password: "",
        remember: false,
      });

      // REDIRECT
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>

        <p className="text-slate-300 text-sm mt-2">
          Login to continue managing NewsIQ.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Email Address
          </label>

          <div
            className="
              flex items-center gap-3
              px-4 py-4
              rounded-2xl
              bg-white/10
              border border-white/10
              focus-within:border-cyan-400
              transition-all duration-300
            "
          >
            <MdEmail size={22} className="text-slate-300" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="
                w-full
                bg-transparent
                outline-none
                text-white
                placeholder:text-slate-400
              "
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Password
          </label>

          <div
            className="
              flex items-center gap-3
              px-4 py-4
              rounded-2xl
              bg-white/10
              border border-white/10
              focus-within:border-cyan-400
              transition-all duration-300
            "
          >
            <MdLock size={22} className="text-slate-300" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="
                w-full
                bg-transparent
                outline-none
                text-white
                placeholder:text-slate-400
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-300"
            >
              {showPassword ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </button>
          </div>
        </div>

        {/* OPTIONS */}
        <div
          className="
            flex items-center justify-between
            gap-4
            text-sm
          "
        >
          {/* REMEMBER */}
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="accent-cyan-500"
            />
            Remember me
          </label>

          {/* FORGOT */}
          <Link
            to="/forgot-password"
            className="
    text-cyan-400
    hover:text-cyan-300
    transition-all duration-300
  "
          >
            Forgot Password?
          </Link>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            hover:shadow-2xl
            transition-all duration-300
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-8 text-center">
        <p className="text-slate-300 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="
              text-cyan-400
              font-semibold
              hover:text-cyan-300
              transition-all duration-300
            "
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
