import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { forgotPassword } from "../../api/authApi";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return toast.error("Please enter your email address.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      setLoading(true);
const response = await forgotPassword(trimmedEmail);

      toast.success(
        response.data.message ||
          "If an account with that email exists, a password reset link has been sent.",
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Unable to send password reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021B34] via-[#010C2D] to-[#021B34] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#232B3E] rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <FaRegNewspaper className="text-white text-4xl" />
          </div>

          <h1 className="text-white text-4xl font-bold mt-5">NewsIQ</h1>

          <p className="text-gray-300 text-sm mt-1">
            Premium News CMS Admin Panel
          </p>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center">
          <h2 className="text-white text-4xl font-bold">Forgot Password</h2>

          <p className="text-gray-400 text-sm mt-3 leading-6">
            Enter your registered email address.
            <br />
            We'll send a password reset link to your email.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block text-white mb-2 font-medium">
            Email Address
          </label>

          <div
            className="
              flex items-center
              bg-[#374151]
              rounded-2xl
              px-4
              h-14
              border border-transparent
              focus-within:border-cyan-400
              transition-all
              duration-300
            "
          >
            <FiMail className="text-gray-400 text-xl" />

            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent outline-none text-white placeholder-gray-400 ml-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg mt-8 transition duration-300 hover:shadow-lg hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            <FiArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
