import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Search, Calendar, FileDown } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/reports');
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#0a0a0f] custom-scrollbar">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">TRAFFIC INTELLIGENCE REPORTS</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-1">Archived Neural Logs & Meta-Data</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 glass rounded-2xl text-white font-bold hover:bg-white/10 transition-all border-white/5">
            <Calendar size={18} />
            <span>Select Date</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <Download size={18} />
            <span>EXPORT ALL</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass p-1 rounded-[2.5rem] border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Search logs by timestamp..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/30 uppercase mr-2 tracking-widest">Filter by</span>
              <button className="p-3 glass rounded-xl text-white/60 hover:text-white transition-colors"><Filter size={18} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 space-x-4">
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Log ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Vehicle Count</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pedestrians</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Processing FPS</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest animate-pulse">Synchronizing Neural Records...</td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest">No matching logs found</td>
                  </tr>
                ) : (
                  filteredReports.map((report, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={report.id} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <span className="text-primary font-mono font-bold">#LOG-{report.id.toString().padStart(4, '0')}</span>
                      </td>
                      <td className="px-8 py-5 text-white/80 font-medium">{report.timestamp}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${Math.min(report.cars * 10, 100)}%` }} />
                           </div>
                           <span className="text-white font-bold">{report.cars} cars</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-white/80 font-medium">{report.pedestrians}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${report.fps > 20 ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                          {report.fps} FPS
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 glass rounded-lg text-white/40 hover:text-primary transition-all hover:scale-110">
                          <FileDown size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30 font-medium uppercase tracking-widest">Showing {filteredReports.length} recorded frames</p>
            <div className="flex gap-2">
               <button className="px-4 py-2 glass rounded-xl text-xs font-bold text-white/40 hover:text-white disabled:opacity-50" disabled>PREVIOUS</button>
               <button className="px-4 py-2 glass rounded-xl text-xs font-bold text-white hover:bg-white/10">NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
