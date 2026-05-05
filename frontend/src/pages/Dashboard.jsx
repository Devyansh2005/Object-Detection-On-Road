import React, { useState, useRef } from 'react';
import { Play, Square, Camera, Car, User, Bike, Truck } from 'lucide-react';

const Dashboard = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [streamData, setStreamData] = useState({ fps: 0, counts: {} });
  const [imageSrc, setImageSrc] = useState(null);
  const ws = useRef(null);

  const startDetection = () => {
    setIsDetecting(true);
    ws.current = new WebSocket('ws://localhost:8000/ws/stream');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setImageSrc(`data:image/jpeg;base64,${data.image}`);
      setStreamData(data.data);
    };
    ws.current.onclose = () => setIsDetecting(false);
  };

  const stopDetection = () => {
    if (ws.current) ws.current.close();
    setIsDetecting(false);
    setImageSrc(null);
  };

  const stats = [
    { label: 'Cars', value: streamData.counts.car || 0, icon: Car, color: 'text-blue-400' },
    { label: 'Pedestrians', value: streamData.counts.person || 0, icon: User, color: 'text-green-400' },
    { label: 'Bikes', value: streamData.counts.bicycle || 0, icon: Bike, color: 'text-purple-400' },
    { label: 'Trucks', value: streamData.counts.truck || 0, icon: Truck, color: 'text-yellow-400' },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Traffic Monitor</h1>
          <p className="text-white/50 text-sm">Real-time object detection and classification</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={isDetecting ? stopDetection : startDetection}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
              isDetecting ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-primary text-background'
            }`}
          >
            {isDetecting ? <Square size={18} /> : <Play size={18} />}
            {isDetecting ? 'STOP' : 'START'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass relative aspect-video overflow-hidden">
          {imageSrc ? (
            <img src={imageSrc} className="w-full h-full object-cover" alt="Live Feed" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
              <Camera size={64} className="mb-4" />
              <p className="font-medium">Camera Feed Offline</p>
            </div>
          )}
          <div className="absolute top-4 left-4 glass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            FPS: {streamData.fps || 0}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Object Counters</h3>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <stat.icon size={18} className={stat.color} />
                    <span className="text-sm text-white/70">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
