import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Camera, Car, User, Bike, Truck, Bell, AlertTriangle, ShieldAlert, Activity, LayoutGrid, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CameraFeed = ({ id, label, isGlobalDetecting, addAlert }) => {
  const [streamData, setStreamData] = useState({ fps: 0, counts: {}, alert: null });
  const [imageSrc, setImageSrc] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (isGlobalDetecting) {
      const wsUrl = `ws://localhost:8000/ws/stream/${id}`;
      ws.current = new WebSocket(wsUrl);
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setImageSrc(`data:image/jpeg;base64,${data.image}`);
        setStreamData(data.data);
        if (data.data.alert) {
           addAlert({ ...data.data.alert, camera: label });
        }
      };
      return () => {
        if (ws.current) ws.current.close();
      };
    } else {
      setImageSrc(null);
      setStreamData({ fps: 0, counts: {}, alert: null });
    }
  }, [isGlobalDetecting, id, label, addAlert]);

  return (
    <div className="glass relative aspect-video overflow-hidden rounded-3xl border-white/5 shadow-2xl group">
      {imageSrc ? (
        <img src={imageSrc} className="w-full h-full object-cover" alt={`Camera ${id}`} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/40">
          <Camera size={48} className="text-white/10 mb-4" />
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Source {id} Offline</p>
        </div>
      )}
      
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="glass-sm px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary border-primary/30 flex items-center gap-2">
          {label}
        </div>
        {imageSrc && (
          <div className="glass-sm px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/50 border-white/10">
            {streamData.fps} FPS
          </div>
        )}
      </div>

      <AnimatePresence>
        {streamData.alert && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 glass-sm p-3 border-red-500/50 bg-red-500/10 backdrop-blur-md rounded-xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-400 w-4 h-4" />
              <p className="text-[10px] text-white font-bold uppercase">{streamData.alert.type}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LiveFeed = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [alerts, setAlerts] = useState([]);
  
  const addAlert = React.useCallback((alert) => {
    setAlerts(prev => {
      const newAlert = { ...alert, id: Date.now(), time: new Date().toLocaleTimeString() };
      if (prev.length === 0 || prev[0].msg !== newAlert.msg) {
        return [newAlert, ...prev].slice(0, 15);
      }
      return prev;
    });
  }, []);

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-[#0a0a0f] custom-scrollbar">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">MULTI-NODE SURVEILLANCE</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-1">Neural Network Unified Stream Grid</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-wider text-white/50">
              Surveillance {isDetecting ? 'Live' : 'Standby'}
            </span>
          </div>
          <button 
            onClick={() => setIsDetecting(!isDetecting)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
              isDetecting 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-primary text-background hover:shadow-primary/20'
            }`}
          >
            {isDetecting ? <Square size={20} /> : <Play size={20} />}
            {isDetecting ? 'HALT STREAMS' : 'ENGAGE GRID'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stream Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CameraFeed id={1} label="CAM-01 (NORTH)" isGlobalDetecting={isDetecting} addAlert={addAlert} />
            <CameraFeed id={2} label="CAM-02 (SOUTH)" isGlobalDetecting={isDetecting} addAlert={addAlert} />
            <CameraFeed id={3} label="CAM-03 (EAST)" isGlobalDetecting={isDetecting} addAlert={addAlert} />
            <CameraFeed id={4} label="CAM-04 (WEST)" isGlobalDetecting={isDetecting} addAlert={addAlert} />
          </div>
          
          <div className="glass p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Activity className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Grid Health Monitor</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Global Sync Status</p>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Links</p>
                   <p className="text-2xl font-black text-white">{isDetecting ? '04 / 04' : '00 / 04'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Packet Loss</p>
                   <p className="text-2xl font-black text-green-400">0.02%</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Neural Latency</p>
                   <p className="text-2xl font-black text-primary">18ms</p>
                </div>
             </div>
          </div>
        </div>

        {/* Unified Incident Log */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="glass flex-1 p-8 rounded-[2.5rem] border-white/5 flex flex-col h-[700px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Unified Incident Log</h3>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Real-time Dispatch</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/5 py-20 text-center">
                    <ShieldAlert size={64} className="mb-4 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest">Grid Secure</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-5 rounded-[1.5rem] border ${
                        alert.priority === 'High' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/2 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit mb-1 ${
                            alert.priority === 'High' ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary'
                          }`}>
                            {alert.type}
                          </span>
                          <span className="text-[10px] font-black text-white/40">{alert.camera}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white/20">{alert.time}</span>
                      </div>
                      <p className="text-sm text-white/80 font-medium leading-relaxed">{alert.msg}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            <button className="mt-8 w-full py-4 glass-sm text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">
              Acknowledge All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
