import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove stored authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // If you're storing user details

    toast.success("Logged out successfully 👋");

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
