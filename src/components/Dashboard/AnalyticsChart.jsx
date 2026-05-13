import React from "react";

import {
     ResponsiveContainer,
     AreaChart,
     Area,
     XAxis,
     Tooltip,
} from "recharts";

const data = [
     {
          name: "Mon",
          users: 400,
     },

     {
          name: "Tue",
          users: 700,
     },

     {
          name: "Wed",
          users: 500,
     },

     {
          name: "Thu",
          users: 900,
     },

     {
          name: "Fri",
          users: 750,
     },

     {
          name: "Sat",
          users: 1100,
     },

     {
          name: "Sun",
          users: 950,
     },
];

const AnalyticsChart = () => {
     return (
          <div
               className="
        bg-white
        rounded-3xl
        p-5 md:p-6
        shadow-sm
        border border-slate-200
      "
          >
               {/* Header */}
               <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                         Weekly Analytics
                    </h2>

                    <p className="text-slate-500 text-sm mt-1">
                         User engagement overview
                    </p>
               </div>

               {/* Chart */}
               <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={data}>

                              <defs>
                                   <linearGradient
                                        id="colorUsers"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                   >
                                        <stop
                                             offset="5%"
                                             stopColor="#2563EB"
                                             stopOpacity={0.4}
                                        />

                                        <stop
                                             offset="95%"
                                             stopColor="#22D3EE"
                                             stopOpacity={0}
                                        />
                                   </linearGradient>
                              </defs>

                              <XAxis
                                   dataKey="name"
                                   axisLine={false}
                                   tickLine={false}
                              />

                              <Tooltip />

                              <Area
                                   type="monotone"
                                   dataKey="users"
                                   stroke="#2563EB"
                                   strokeWidth={3}
                                   fill="url(#colorUsers)"
                              />
                         </AreaChart>
                    </ResponsiveContainer>
               </div>
          </div>
     );
};

export default AnalyticsChart;