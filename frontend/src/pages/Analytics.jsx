import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const data = [
    { time: '08:00', cars: 20 }, { time: '09:00', cars: 45 }, { time: '10:00', cars: 30 },
  ];
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">Traffic Analytics</h1>
      <div className="glass p-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="time" stroke="#ffffff40" />
            <YAxis stroke="#ffffff40" />
            <Tooltip contentStyle={{ backgroundColor: '#14141e', border: 'none' }} />
            <Area type="monotone" dataKey="cars" stroke="#00f2ff" fill="#00f2ff20" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
