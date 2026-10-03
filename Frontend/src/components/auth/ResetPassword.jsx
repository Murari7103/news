import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { resetPassword } from "../../api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || token.trim() === "") {
      toast.error("Invalid or expired reset link.");

      setIsTokenValid(false);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } else {
      setIsTokenValid(true);
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (!token) {
      return toast.error("Invalid or expired reset link.");
    }

    try {
      setLoading(true);

      console.log("Token:", token);
      console.log("Request Body:", {
        token,
        newPassword: formData.password,
      });

      const response = await resetPassword({
        token,
        newPassword: formData.password,
      });

      toast.success(response?.data?.message || "Password reset successfully.");

      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error?.response?.data || error);

      toast.error(
        error?.response?.data?.message || "Unable to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#021B34] via-[#010C2D] to-[#021B34] flex items-center justify-center">
        <p className="text-white text-lg">Validating reset link...</p>
      </div>
    );
  }

  if (isTokenValid === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#021B34] via-[#010C2D] to-[#021B34] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#232B3E] rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-5xl text-white">📰</span>
          </div>

          <h1 className="text-white text-4xl font-bold mt-5">NewsIQ</h1>

          <p className="text-gray-300 text-sm mt-1">
            Premium News CMS Admin Panel
          </p>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-white text-4xl font-bold">Reset Password</h2>

          <p className="text-gray-400 text-sm mt-3 leading-6">
            Create a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-white mb-2 font-medium">
              New Password
            </label>

            <div className="flex items-center bg-[#374151] rounded-2xl px-4 h-14">
              <FiLock className="text-gray-400 text-xl" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 ml-3"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400" />
                ) : (
                  <FiEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Confirm Password
            </label>

            <div className="flex items-center bg-[#374151] rounded-2xl px-4 h-14">
              <FiLock className="text-gray-400 text-xl" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                className="w-full bg-transparent outline-none text-white placeholder-gray-400 ml-3"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="text-gray-400" />
                ) : (
                  <FiEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg mt-3 transition duration-300 hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

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

export default ResetPassword;
