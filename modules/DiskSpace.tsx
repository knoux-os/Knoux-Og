import React from 'react';
import { StatsCard } from '../components/StatsCard';

const DRIVES = [
    { name: 'C:', label: 'System', used: 320, total: 500, color: 'bg-[#9d4edd]', details: 'NTFS • Healthy • Boot' },
    { name: 'D:', label: 'Data', used: 800, total: 1000, color: 'bg-[#00ff88]', details: 'NTFS • Healthy' },
    { name: 'E:', label: 'Backup', used: 100, total: 2000, color: 'bg-[#00aaff]', details: 'exFAT • External' },
];

export const DiskSpace = () => {
  return (
    <div className="fade-in-up space-y-8 p-2">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gradient mb-1">Disk Space Orchestrator</h2>
                <p className="text-white/70">Storage tracking and optimization</p>
            </div>
            <div className="flex gap-3">
                <button className="btn btn-outline">🔄 Refresh</button>
                <button className="btn btn-primary">🧹 Cleanup</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon="💽" trend="down" trendValue="3%" value="450 GB" label="Free Space" />
            <StatsCard icon="📊" trend="up" trendValue="12%" value="1.2 TB" label="Total Used" />
            <StatsCard icon="🗑️" trend="up" trendValue="500MB" value="2.4 GB" label="Trash Size" />
        </div>

        <div className="glass p-6">
            <h3 className="text-xl font-bold mb-6">Drive Usage</h3>
            <div className="space-y-6">
                {DRIVES.map((drive, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-lg">{drive.name} ({drive.label})</span>
                            <span className="text-white/60">{drive.used} GB / {drive.total} GB</span>
                        </div>
                        <div className="progress h-4 bg-white/10">
                            <div className={`progress-bar ${drive.color}`} style={{width: `${(drive.used / drive.total) * 100}%`}}></div>
                        </div>
                        <div className="text-xs text-white/40 mt-1">{drive.details}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6">
                <h3 className="text-xl font-bold mb-4">Space Distribution</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🎬</span>
                            <span>Media</span>
                        </div>
                        <span className="font-mono text-white/70">450 GB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📦</span>
                            <span>Applications</span>
                        </div>
                        <span className="font-mono text-white/70">120 GB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📄</span>
                            <span>Documents</span>
                        </div>
                        <span className="font-mono text-white/70">45 GB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⚙️</span>
                            <span>System</span>
                        </div>
                        <span className="font-mono text-white/70">85 GB</span>
                    </div>
                </div>
            </div>
            
            <div className="glass p-6">
                <h3 className="text-xl font-bold mb-4">Cleanup Suggestions</h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-white/10 flex items-start gap-4">
                        <div className="bg-[#ffaa00]/10 p-3 rounded-lg text-[#ffaa00]">
                            ⚠️
                        </div>
                        <div>
                            <h4 className="font-bold">Temporary Files</h4>
                            <p className="text-sm text-white/60 mb-2">3.2 GB of temporary system files can be safely removed.</p>
                            <button className="text-xs bg-[#ffaa00]/20 text-[#ffaa00] px-3 py-1 rounded hover:bg-[#ffaa00]/30 transition">Clean Now</button>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 flex items-start gap-4">
                        <div className="bg-[#00aaff]/10 p-3 rounded-lg text-[#00aaff]">
                            ℹ️
                        </div>
                        <div>
                            <h4 className="font-bold">Large Downloads</h4>
                            <p className="text-sm text-white/60 mb-2">Downloads folder is taking up 15 GB.</p>
                            <button className="text-xs bg-[#00aaff]/20 text-[#00aaff] px-3 py-1 rounded hover:bg-[#00aaff]/30 transition">Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};