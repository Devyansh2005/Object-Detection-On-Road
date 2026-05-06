import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity, Calendar } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/analytics');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics", error);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-white/20 uppercase font-black tracking-widest animate-pulse">Computing Spatial Analytics...</div>;

  const vehicleDistribution = [
    { name: 'Cars', value: data.today_stats.cars, color: '#00f2ff' },
    { name: 'Pedestrians', value: data.today_stats.pedestrians, color: '#10b981' },
    { name: 'Bikes', value: data.today_stats.bikes, color: '#8b5cf6' },
    { name: 'Trucks', value: data.today_stats.trucks, color: '#f59e0b' },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#0a0a0f] custom-scrollbar">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">TRAFFIC ANALYTICS CORE</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-1">Deep Neural Insight & Behavioral Patterns</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-6 py-2 rounded-2xl flex items-center gap-3 border-white/5">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm font-bold text-white">Last 24 Hours</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Composition */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <PieIcon size={20} className="text-primary" />
            </div>
            <h3 className="font-bold text-white text-lg">Vehicle Composition</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {vehicleDistribution.map(item => (
               <div key={item.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                 <div className="flex-1">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.name}</p>
                   <p className="text-lg font-bold text-white">{item.value}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Hourly Volume Trend */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Temporal Volume Flux</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.hourly_data}>
                <defs>
                  <linearGradient id="colorCountAnal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCountAnal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
             <p className="text-xs font-medium text-white/80">
               <span className="font-black text-primary">ANALYSIS:</span> Traffic density is showing a steady 15% increase compared to yesterday's baseline. Peak load expected at 18:00 HRS.
             </p>
          </div>
        </div>

        {/* Incident Density */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-white/5">
           <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-orange-400" />
            </div>
            <h3 className="font-bold text-white text-lg">Spatial Incident Mapping</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourly_data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                   <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                   <Bar dataKey="count" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="p-6 glass rounded-3xl border-white/5">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Efficiency Rating</p>
                <p className="text-4xl font-black text-white">94.2%</p>
                <div className="w-full h-1 bg-white/5 rounded-full mt-4">
                   <div className="h-full bg-green-500 w-[94%]" />
                </div>
              </div>
              <div className="p-6 glass rounded-3xl border-white/5">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Alert Frequency</p>
                <p className="text-4xl font-black text-white">Low</p>
                <p className="text-[10px] text-green-400 font-bold mt-2">-12% from average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
