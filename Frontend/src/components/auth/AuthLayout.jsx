import React from "react";

import { Outlet, Link } from "react-router-dom";

import { MdNewspaper } from "react-icons/md";

const AuthLayout = () => {
  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#081028]
        via-[#0F172A]
        to-[#111827]
        flex items-center justify-center
        px-4
      "
    >
      {/* TOP GLOW */}
      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[320px]
          h-[320px]
          rounded-full
          bg-cyan-500/20
          blur-3xl
        "
      />

      {/* BOTTOM GLOW */}
      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[320px]
          h-[320px]
          rounded-full
          bg-blue-600/20
          blur-3xl
        "
      />

      {/* AUTH CARD */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[32px]
          border border-white/10
          bg-white/10
          backdrop-blur-2xl
          shadow-2xl
          p-8 md:p-10
        "
      >
        {/* BRAND */}
        <div className="text-center mb-10">
          {/* LOGO */}
          <div
            className="
              w-20 h-20
              rounded-3xl
              mx-auto
              bg-gradient-to-br
              from-blue-600
              to-cyan-500
              flex items-center justify-center
              shadow-xl
            "
          >
            <MdNewspaper size={40} className="text-white" />
          </div>

          {/* TITLE */}
          <Link to="/">
            <h1
              className="
                mt-6
                text-4xl
                font-black
                tracking-tight
                text-white
              "
            >
              NewsIQ
            </h1>
          </Link>

          {/* SUBTITLE */}
          <p className="text-slate-300 mt-3 text-sm">
            Premium News CMS Admin Panel
          </p>
        </div>

        {/* PAGE CONTENT */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
