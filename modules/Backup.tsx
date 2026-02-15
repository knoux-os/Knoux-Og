import React from 'react';
import { StatsCard } from '../components/StatsCard';

export const Backup = () => {
  return (
    <div className="fade-in-up space-y-8 p-2">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gradient mb-1">Backup Orchestrator</h2>
                <p className="text-white/70">Manage system backups and recovery</p>
            </div>
            <div className="flex gap-3">
                <button className="btn btn-outline">🔄 Refresh</button>
                <button className="btn btn-primary">💾 Backup Now</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon="💾" trend="up" trendValue="15%" value="24" label="Total Backups" />
            <StatsCard icon="📊" trend="up" trendValue="1.2GB" value="342 GB" label="Total Size" />
            <StatsCard icon="⏱️" trend="up" trendValue="On Time" value="2h 30m" label="Last Backup" />
        </div>

        <div className="glass p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Backup Schedule</h3>
                <button className="btn btn-outline text-xs py-1 px-3">Edit Schedule</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-white/50 text-xs uppercase mb-1">Frequency</div>
                    <div className="text-xl font-bold">Daily</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-white/50 text-xs uppercase mb-1">Time</div>
                    <div className="text-xl font-bold">02:00 AM</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-white/50 text-xs uppercase mb-1">Retention</div>
                    <div className="text-xl font-bold">30 Days</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                    <div className="text-white/50 text-xs uppercase mb-1">Next Backup</div>
                    <div className="text-xl font-bold text-[#9d4edd]">in 3h 45m</div>
                </div>
            </div>
        </div>
    </div>
  );
};