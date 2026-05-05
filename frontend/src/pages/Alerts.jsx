import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    { id: 1, type: 'High Pedestrian Density', priority: 'High', time: '10:42 AM', location: 'Camera 04 - Sector B', confidence: '94%' },
    { id: 2, type: 'Illegal U-Turn Detected', priority: 'Medium', time: '10:35 AM', location: 'Camera 01 - Main Junction', confidence: '88%' },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">Smart Alerts</h1>
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="glass p-5 border-l-4 border-l-primary">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{alert.type}</h3>
                <p className="text-xs text-white/50">{alert.location} • {alert.time}</p>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{alert.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
