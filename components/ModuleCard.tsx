
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string | LucideIcon;
  status: 'Active' | 'Warning' | 'Critical' | 'Idle' | 'Unknown' | string;
  active?: boolean;
  // Fix: Adding key to ModuleCardProps to resolve TS error: Property 'key' does not exist on type 'ModuleCardProps'
  key?: string | number;
}

export const ModuleCard = ({ title, description, icon, status }: ModuleCardProps) => {
  const getBadgeClass = () => {
    switch (status) {
        case 'Active': return 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] border border-[#00ff88]';
        case 'Warning': return 'bg-[rgba(255,170,0,0.15)] text-[#ffaa00] border border-[#ffaa00]';
        case 'Critical': return 'bg-[rgba(255,0,85,0.15)] text-[#ff0055] border border-[#ff0055]';
        default: return 'bg-white/10 text-white/60 border border-white/20';
    }
  };

  const renderIcon = () => {
      if (typeof icon === 'string') {
          return <span className="text-3xl">{icon}</span>;
      }
      const Icon = icon as LucideIcon;
      return <Icon size={32} />;
  };

  return (
    <div className="glass p-6 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className="w-[60px] h-[60px] rounded-2xl bg-[rgba(157,78,221,0.15)] flex items-center justify-center text-[#b77aff] group-hover:scale-110 transition-transform duration-300 group-hover:bg-[rgba(191,0,255,0.2)] group-hover:text-[#bf00ff] border border-[rgba(157,78,221,0.25)]">
                {renderIcon()}
            </div>
            <div className="flex flex-col items-end">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${getBadgeClass()}`}>
                    {status}
                </span>
            </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#bf00ff] transition-colors">{title}</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-6 flex-1">{description}</p>
        
        <div className="flex gap-2 mt-auto">
            <button className="flex-1 btn btn-primary text-sm py-2">
                Refresh
            </button>
            <button className="flex-1 btn btn-outline text-sm py-2">
                Configure
            </button>
        </div>
    </div>
  );
};
