import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, Eye, Filter, Trash2, Activity, Volume2, Timer, Wind } from 'lucide-react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/alerts');
      setAlerts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching alerts", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getAlertIcon = (type) => {
    if (type.includes('Noise')) return <Volume2 size={24} />;
    if (type.includes('Time') || type.includes('Slow')) return <Timer size={24} />;
    if (type.includes('Carbon') || type.includes('Emission')) return <Wind size={24} />;
    if (type.includes('Congestion')) return <Activity size={24} />;
    return <AlertTriangle size={24} />;
  };

  const filteredAlerts = filter === 'All' 
    ? alerts 
    : alerts.filter(a => a.priority === filter);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#0a0a0f] custom-scrollbar">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-primary" size={32} />
            INCIDENT DISPATCH
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-1">Real-time Multi-Dimensional Threat Analysis</p>
        </div>
        <div className="flex gap-2 p-1 glass rounded-2xl border-white/5">
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === p ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 text-center text-white/20 uppercase font-black tracking-widest animate-pulse">Scanning Infrastructure...</div>
          ) : filteredAlerts.length === 0 ? (
            <div className="py-20 text-center opacity-20">
              <CheckCircle2 size={64} className="mx-auto mb-4" />
              <p className="text-xl font-black uppercase tracking-widest">Zone Secure - No active incidents</p>
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={alert.id}
                className={`glass p-6 rounded-3xl border-white/5 relative overflow-hidden group hover:border-white/20 transition-all`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${getPriorityColor(alert.priority)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase">{alert.type}</h3>
                      <span className={`px-3 py-0.5 rounded-lg text-[10px] font-black uppercase border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority} Priority
                      </span>
                    </div>
                    <p className="text-white/70 font-medium text-lg leading-relaxed">{alert.msg}</p>
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2 text-white/40">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={14} />
                        <span className="text-xs font-bold">{alert.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-4 glass rounded-2xl text-white/40 hover:text-primary hover:border-primary/30 transition-all hover:scale-110">
                      <Eye size={20} />
                    </button>
                    <button className="p-4 glass rounded-2xl text-white/40 hover:text-green-400 hover:border-green-400/30 transition-all hover:scale-110">
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {filteredAlerts.length > 0 && (
        <div className="pt-8 flex justify-center">
          <button className="flex items-center gap-3 px-8 py-4 glass rounded-2xl text-white/60 font-bold hover:text-white hover:border-white/20 transition-all">
            <Trash2 size={18} />
            <span>CLEAR ALL RESOLVED INCIDENTS</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Alerts;
