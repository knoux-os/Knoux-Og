import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLogEntry } from '../types';
import { FileText, Search, Filter, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.module_name.toLowerCase().includes(filter.toLowerCase()) ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.user.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
      switch(status?.toLowerCase()) {
          case 'success': return <CheckCircle size={16} className="text-[#00ff88]" />;
          case 'failure': return <AlertTriangle size={16} className="text-[#ff0055]" />;
          default: return <Info size={16} className="text-[#00aaff]" />;
      }
  };

  return (
    <div className="fade-in-up space-y-6 p-2 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-gradient mb-1">Audit & Monitoring</h2>
            <p className="text-white/70">System-wide event logging and verification</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchLogs} className="btn btn-outline">🔄 Refresh Logs</button>
            <button className="btn btn-primary">📥 Export Report</button>
        </div>
      </div>

      <div className="glass p-6 flex-1 flex flex-col min-h-0">
          <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search logs by module, user, or action..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#bf00ff] focus:outline-none"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
              </div>
              <button className="btn btn-outline py-2 px-4">
                  <Filter size={18} /> Filter
              </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#1f1038] z-10">
                      <tr className="text-white/50 text-xs uppercase border-b border-white/10">
                          <th className="pb-3 pl-4">Timestamp</th>
                          <th className="pb-3">Module</th>
                          <th className="pb-3">Action</th>
                          <th className="pb-3">User</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Metadata</th>
                      </tr>
                  </thead>
                  <tbody className="text-sm">
                      {loading ? (
                          <tr><td colSpan={6} className="text-center py-8 text-white/30">Loading audit trail...</td></tr>
                      ) : filteredLogs.length > 0 ? (
                          filteredLogs.map((log, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                  <td className="py-3 pl-4 font-mono text-white/60">{new Date(log.timestamp).toLocaleString()}</td>
                                  <td className="py-3 font-bold text-[#9d4edd]">{log.module_name}</td>
                                  <td className="py-3">{log.action}</td>
                                  <td className="py-3 flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                          {log.user.charAt(0).toUpperCase()}
                                      </div>
                                      {log.user}
                                  </td>
                                  <td className="py-3">
                                      <div className="flex items-center gap-2">
                                          {getStatusIcon(log.status)}
                                          <span className="capitalize">{log.status}</span>
                                      </div>
                                  </td>
                                  <td className="py-3 font-mono text-xs text-white/40 max-w-xs truncate">
                                      {JSON.stringify(log.metadata)}
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr><td colSpan={6} className="text-center py-8 text-white/30">No logs found.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
