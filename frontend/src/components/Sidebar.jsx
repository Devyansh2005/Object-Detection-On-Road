import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Video, Bell, BarChart3, FileText, Settings, LogOut, Activity } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'live', icon: Video, label: 'Live Feed' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-background border-r border-white/5 flex flex-col p-4 z-20"
    >
      <div className="flex items-center gap-3 px-4 py-8">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
          <Activity className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-white tracking-tight">TRAFFIC AI</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Control Center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activePage === item.id 
                ? 'bg-primary/10 text-primary border border-primary/20 neon-border' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.id === 'alerts' && (
              <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                2
              </span>
            )}
          </button>
        ))}
      </nav>

      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </motion.div>
  );
};

export default Sidebar;
