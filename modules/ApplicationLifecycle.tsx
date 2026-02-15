import React, { useState } from 'react';
import { StatsCard } from '../components/StatsCard';
import { Search, X } from 'lucide-react';

interface AppData {
    name: string;
    sub: string;
    icon: string;
    version: string;
    status: string;
    statusColor: string;
    cpu: string;
    memory: string;
    action: string;
}

const APPS_DATA: AppData[] = [
    { name: 'Web Server', sub: 'nginx', icon: '🌐', version: '1.24.0', status: 'Running', statusColor: 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[#00ff88]', cpu: '2.3%', memory: '128 MB', action: '⚙️' },
    { name: 'Database', sub: 'postgresql', icon: '🗄️', version: '15.2', status: 'Running', statusColor: 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[#00ff88]', cpu: '5.7%', memory: '512 MB', action: '⚙️' },
    { name: 'Dev Tools', sub: 'vscode', icon: '🔧', version: '1.85.1', status: 'Update', statusColor: 'bg-[rgba(255,170,0,0.1)] text-[#ffaa00] border border-[#ffaa00]', cpu: '0%', memory: '0 MB', action: '⚙️' },
    { name: 'Node.js', sub: 'node', icon: '🟢', version: '18.17.0', status: 'Running', statusColor: 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[#00ff88]', cpu: '1.2%', memory: '256 MB', action: '⚙️' },
    { name: 'Docker', sub: 'docker', icon: '🐳', version: '24.0.5', status: 'Running', statusColor: 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[#00ff88]', cpu: '3.1%', memory: '1.2 GB', action: '⚙️' },
];

export const ApplicationLifecycle = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPS_DATA.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.version.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in-up space-y-8 p-2">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gradient mb-1">Application Lifecycle</h2>
                <p className="text-white/70">Manage and monitor system applications</p>
            </div>
            <div className="flex gap-3 items-center">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#bf00ff] to-[#9d4edd] rounded-full opacity-0 group-focus-within:opacity-20 transition-opacity blur-md"></div>
                    <input 
                        type="text" 
                        placeholder="Search applications..." 
                        className="bg-[rgba(26,10,46,0.6)] border border-[rgba(157,78,221,0.25)] rounded-full px-4 py-2 pl-10 pr-10 text-white w-64 focus:outline-none focus:border-[#9d4edd] transition-all relative z-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 z-20 pointer-events-none" size={16} />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                <button className="btn btn-outline">🔄 Refresh</button>
                <button className="btn btn-primary">📦 Install New</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard icon="📊" trend="up" trendValue="0" value="247" label="Total Apps" />
            <StatsCard icon="⚡" trend="up" trendValue="5" value="89" label="Running" />
            <StatsCard icon="⏸️" trend="down" trendValue="2" value="145" label="Stopped" />
            <StatsCard icon="🔄" trend="up" trendValue="3" value="13" label="Updates" />
        </div>

        <div className="glass p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Installed Applications</h3>
                <div className="text-xs text-white/40">Showing {filteredApps.length} of {APPS_DATA.length} apps</div>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-white/50 text-sm uppercase border-b border-white/10">
                        <th className="pb-4 pl-4">Application</th>
                        <th className="pb-4">Version</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">CPU</th>
                        <th className="pb-4">Memory</th>
                        <th className="pb-4 text-right pr-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-white/80">
                    {filteredApps.map((app, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 pl-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{app.icon}</span>
                                    <div>
                                        <div className="font-bold">{app.name}</div>
                                        <div className="text-xs text-white/40">{app.sub}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{app.version}</td>
                            <td><span className={`px-2 py-1 rounded text-xs ${app.statusColor}`}>{app.status}</span></td>
                            <td>{app.cpu}</td>
                            <td>{app.memory}</td>
                            <td className="text-right pr-4">
                                <button className="p-2 hover:bg-white/10 rounded">{app.action}</button>
                            </td>
                        </tr>
                    ))}
                    {filteredApps.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-white/50">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={24} className="opacity-50" />
                                    <span>No applications found matching "{searchTerm}"</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};