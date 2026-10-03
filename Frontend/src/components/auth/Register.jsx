import React, { useState } from "react";

import { Link } from "react-router-dom";

import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import toast from "react-hot-toast";

import API from "../../../src/services/authService";
import { register } from "../../api/authApi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
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

    // FULL NAME
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");

      return;
    }

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

    // CONFIRM PASSWORD
    if (!formData.confirmPassword.trim()) {
      toast.error("Confirm password is required");

      return;
    }

    // PASSWORD MATCH
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    // TERMS
    if (!formData.agree) {
      toast.error("Please accept Terms & Conditions");

      return;
    }

    try {
      setLoading(true);

      const response = await register(formData);

      toast.success(response.data.message);

      // RESET FORM
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">Create Account </h2>

        <p className="text-slate-300 text-sm mt-2">
          Join NewsIQ Admin Platform today.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Full Name
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
            <MdPerson size={22} className="text-slate-300" />

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
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
              placeholder="Create password"
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

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Confirm Password
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
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-300"
            >
              {showConfirmPassword ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </button>
          </div>
        </div>

        {/* TERMS */}
        <label
          className="
            flex items-start gap-3
            text-sm text-slate-300
          "
        >
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="accent-cyan-500 mt-1"
          />

          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>

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
            cursor-pointer
          "
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-8 text-center">
        <p className="text-slate-300 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-cyan-400
              font-semibold
              hover:text-cyan-300
              transition-all duration-300
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
