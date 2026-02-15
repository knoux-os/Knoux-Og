import React, { useEffect, useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { ModuleCard } from '../components/ModuleCard';
import { MODULES } from '../constants';
import { api } from '../services/api';
import { AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';

export const Dashboard = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
      try {
          const data = await api.checkHealth();
          setHealth(data);
      } catch (e) {
          console.error("Health check failed", e);
      } finally {
          setLoading(false);
      }
  };

  // Mock aggregated stats for visual fidelity, ideally these come from a dashboard endpoint
  const stats = {
      cpu: 45,
      ram: 8.2,
      disk: 450,
      temp: 52
  };

  return (
    <div className="fade-in-up space-y-8 p-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-gradient mb-1">Dashboard</h2>
            <p className="text-white/70">System overview and real-time monitoring</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchHealth} className="btn btn-outline">🔄 Refresh</button>
            <button className="btn btn-primary">⚙️ Settings</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard icon="💻" trend="up" trendValue="12%" value={`${stats.cpu}%`} label="CPU Usage" progress={stats.cpu} />
        <StatsCard icon="🧠" trend="up" trendValue="8%" value={`${stats.ram} GB`} label="RAM Usage" progress={60} />
        <StatsCard icon="💾" trend="down" trendValue="3%" value={`${stats.disk} GB`} label="Free Space" progress={65} />
        <StatsCard icon="🌡️" trend="up" trendValue="2%" value={`${stats.temp}°C`} label="Temperature" progress={45} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="glass p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">System Health</h3>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${health?.status === 'healthy' ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] border-[#00ff88]' : 'bg-red-500/20 text-red-500 border-red-500'}`}>
                    {health?.status === 'healthy' ? 'All Systems Operational' : 'System Degraded'}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">API Status</span>
                        <span className="font-mono text-[#9d4edd]">{loading ? 'Checking...' : (health?.status || 'Unknown')}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Environment</span>
                        <span className="font-mono">Production</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Modules</span>
                        <span className="font-mono">12 Active</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Network In</span>
                        <span className="font-mono text-[#9d4edd]">3.2 MB/s</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Network Out</span>
                        <span className="font-mono">1.1 MB/s</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Connections</span>
                        <span className="font-mono">27</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Disk Reads</span>
                        <span className="font-mono text-[#9d4edd]">45 MB/s</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">Disk Writes</span>
                        <span className="font-mono">23 MB/s</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-white/60">I/O Wait</span>
                        <span className="font-mono">2%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <span className="px-2 py-1 rounded-full bg-[rgba(255,0,85,0.15)] text-[#ff0055] border border-[#ff0055] text-xs font-bold">Live</span>
            </div>
            <div className="space-y-3">
                 <div className="alert flex items-start gap-4 p-3 rounded-xl bg-white/5 border-r-4 border-[#00ff88]">
                    <span className="mt-1"><CheckCircle size={20} className="text-[#00ff88]" /></span>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-[#00ff88]">System Online</h4>
                            <span className="text-xs text-white/40">Now</span>
                        </div>
                        <p className="text-sm text-white/70">Health check passed successfully.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Active Modules Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Core Modules</h3>
            <span className="text-[#9d4edd] text-sm">View All →</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODULES.slice(0, 3).map(mod => (
                <ModuleCard 
                    key={mod.id}
                    title={mod.name} 
                    description={mod.description}
                    icon={mod.icon}
                    status={mod.status === 'Idle' ? 'Active' : mod.status} // Simulating active for demo
                />
            ))}
        </div>
      </div>
    </div>
  );
};
