import React from "react";
import { useNavigate } from "react-router-dom";

import { MdArrowOutward } from "react-icons/md";

const StatsCard = ({
     title,
     value,
     icon,
     growth,
     gradient,
     path,
}) => {
     const navigate = useNavigate();

     return (
          <div
               onClick={() => navigate(path)}
               className={`
        relative overflow-hidden
        rounded-[28px]
        p-5 md:p-6
        text-white
        cursor-pointer
        group
        transition-all duration-500
        hover:-translate-y-1
        hover:shadow-2xl
        ${gradient}
      `}
          >
               {/* Glow Effect */}
               <div
                    className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-all duration-500
          bg-white/5
        "
               />

               {/* Decorative Circle */}
               <div
                    className="
          absolute
          -top-16
          -right-16
          w-48 h-48
          rounded-full
          bg-white/10
        "
               />

               {/* Decorative Blur */}
               <div
                    className="
          absolute
          bottom-0
          right-0
          w-32 h-32
          bg-white/10
          blur-3xl
        "
               />

               {/* CONTENT */}
               <div className="relative z-10">

                    {/* TOP */}
                    <div className="flex items-start justify-between gap-4">

                         {/* LEFT */}
                         <div>
                              <p
                                   className="
                text-sm
                text-white/80
                font-medium
                tracking-wide
              "
                              >
                                   {title}
                              </p>

                              <h2
                                   className="
                mt-3
                text-3xl md:text-4xl
                font-bold
                tracking-tight
              "
                              >
                                   {value}
                              </h2>
                         </div>

                         {/* ICON */}
                         <div
                              className="
              min-w-[60px]
              min-h-[60px]
              rounded-2xl
              bg-white/15
              backdrop-blur-xl
              flex items-center justify-center
              border border-white/10
              group-hover:scale-110
              transition-all duration-500
            "
                         >
                              {icon}
                         </div>
                    </div>

                    {/* BOTTOM */}
                    <div
                         className="
            mt-8
            flex items-center justify-between
          "
                    >
                         {/* Growth */}
                         <div className="flex items-center gap-2">

                              <span
                                   className="
                bg-white/15
                border border-white/10
                px-3 py-1.5
                rounded-xl
                text-sm font-semibold
                backdrop-blur-md
              "
                              >
                                   ↑ {growth}%
                              </span>

                              <span className="text-sm text-white/80">
                                   vs last month
                              </span>
                         </div>

                         {/* Arrow */}
                         <div
                              className="
              w-10 h-10
              rounded-xl
              bg-white/15
              flex items-center justify-center
              backdrop-blur-md
              border border-white/10
              group-hover:translate-x-1
              group-hover:-translate-y-1
              transition-all duration-300
            "
                         >
                              <MdArrowOutward size={20} />
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default StatsCard;