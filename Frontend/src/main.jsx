// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* Handle Globally toaster for the entire app... */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,

        style: {
          borderRadius: "16px",
          background: "#0F172A",
          color: "#fff",
          padding: "16px",
        },
      }}
    />
  </React.StrictMode>,
);