import React from 'react';
import { Save, Cpu } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">System Settings</h1>
      <div className="glass p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="text-primary" />
          <h3 className="font-bold text-white">Detection Config</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 block mb-2 uppercase font-bold tracking-widest">Confidence Threshold</label>
            <input type="range" className="w-full accent-primary" />
          </div>
          <button className="w-full py-3 bg-primary text-background font-bold rounded-xl flex items-center justify-center gap-2">
            <Save size={18} /> SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
