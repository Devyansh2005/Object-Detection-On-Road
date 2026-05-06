import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Car, AlertTriangle, TrendingUp, Clock, MapPin, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ cars: 0, pedestrians: 0, bikes: 0, trucks: 0 });
  const [chartData, setHourlyData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/analytics'),
          axios.get('http://localhost:8000/api/alerts')
        ]);
        setStats(statsRes.data.today_stats);
        setHourlyData(statsRes.data.hourly_data);
        setRecentAlerts(alertsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    { label: 'Total Volume', value: stats.cars + stats.trucks + stats.bikes, icon: Car, trend: '+12.5%', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { label: 'Active Alerts', value: recentAlerts.length, icon: AlertTriangle, trend: 'Critical', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
    { label: 'System Load', value: '0.8s', icon: Activity, trend: 'Stable', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
    { label: 'Live Nodes', value: '04', icon: MapPin, trend: 'Active', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#0a0a0f] custom-scrollbar">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">CONTROL CENTER</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Infrastructure Online
            </span>
            <span className="text-white/30 text-xs font-medium">Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl border-white/5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Network Latency</p>
            <p className="text-xl font-black text-primary">24ms</p>
          </div>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.label} 
            className={`glass p-6 rounded-[2rem] border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-[50px] -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                <card.icon className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{card.label}</p>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-4xl font-black text-white leading-none">{card.value}</span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg mb-1 ${
                    card.trend.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                  }`}>
                    {card.trend}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Analytics Preview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 h-[450px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" />
                  Traffic Flux Density
                </h3>
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">24-Hour Predictive Model</p>
              </div>
              <div className="flex gap-2">
                <button className="glass-sm px-4 py-1.5 text-[10px] font-bold text-white hover:bg-white/10 transition-colors">DAILY</button>
                <button className="glass-sm px-4 py-1.5 text-[10px] font-bold text-primary bg-primary/10">HOURLY</button>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 15, 25, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00f2ff" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-[2rem] border-white/5">
               <h4 className="text-sm font-bold text-white/60 mb-4 uppercase tracking-widest">Active Infrastructure</h4>
               <div className="space-y-4">
                  {[
                    { name: 'Intersection Alpha-4', status: 'Optimal', load: '42%' },
                    { name: 'South Highway Bridge', status: 'Congested', load: '89%' },
                    { name: 'Pedestrian Zone Delta', status: 'Optimal', load: '12%' },
                  ].map(node => (
                    <div key={node.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">{node.name}</p>
                        <p className={`text-[10px] font-black uppercase ${node.status === 'Optimal' ? 'text-green-400' : 'text-orange-400'}`}>{node.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white/40">LOAD</p>
                        <p className="text-sm font-black text-white">{node.load}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="glass p-6 rounded-[2rem] border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer" onClick={() => window.location.hash = '#live'}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ExternalLink size={24} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white">Live Feed</h4>
              <p className="text-white/40 text-xs mt-2 max-w-[200px]">Access neural network streams and real-time object tracking</p>
            </div>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-red-400" />
              </div>
              <h3 className="font-bold text-white text-lg">System Incidents</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {recentAlerts.length === 0 ? (
                <div className="py-20 text-center opacity-20">
                  <AlertTriangle size={48} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No Critical Data</p>
                </div>
              ) : (
                recentAlerts.map((alert, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 border-l-4 border-l-red-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-red-400 uppercase">{alert.type}</span>
                      <span className="text-[10px] font-bold text-white/20">{alert.time}</span>
                    </div>
                    <p className="text-sm text-white font-medium">{alert.priority} priority detection at {alert.location}</p>
                  </motion.div>
                ))
              )}
            </div>

            <button className="mt-8 w-full py-4 glass-sm text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
