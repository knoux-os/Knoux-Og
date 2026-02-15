import React from 'react';

interface StatsCardProps {
  icon: string;
  trend: 'up' | 'down';
  trendValue: string;
  value: string;
  label: string;
  progress?: number;
}

export const StatsCard = ({ icon, trend, trendValue, value, label, progress }: StatsCardProps) => {
  return (
    <div className="glass p-6 fade-in-up">
        <div className="flex justify-between items-center mb-4">
            <span className="text-3xl">{icon}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                trend === 'up' 
                ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88]' 
                : 'bg-[rgba(255,0,85,0.15)] text-[#ff0055]'
            }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
        </div>
        <div className="font-display text-4xl font-bold text-[#9d4edd] mb-1 leading-none">{value}</div>
        <div className="text-sm text-white/60 uppercase tracking-wider">{label}</div>
        
        {progress !== undefined && (
            <div className="progress mt-4">
                <div className="progress-bar" style={{width: `${progress}%`}}></div>
            </div>
        )}
    </div>
  );
};