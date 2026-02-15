
import React from 'react';
import { 
  LayoutDashboard, RefreshCw, HardDrive, Cpu, FileText, PlayCircle, LucideIcon 
} from 'lucide-react';
import { MODULES } from '../constants';

interface SidebarProps {
  currentModule: string;
  onNavigate: (id: string) => void;
}

interface NavItemProps {
    id: string;
    icon: any; // تغيير النوع لاستيعاب المكونات
    label: string;
    active: boolean;
    onClick: (id: string) => void;
    badge?: { text: string; color: string };
    // Fix: Adding key property to NavItemProps to resolve the error where 'key' is not recognized on the NavItem component.
    key?: string | number;
}

const NavItem = ({ id, icon, label, active, onClick, badge }: NavItemProps) => {
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <span className="text-xl flex items-center justify-center w-5 h-5">{icon}</span>;
        }
        const Icon = icon;
        return <Icon size={20} className={active ? 'text-[#bf00ff]' : ''} />;
    };

    return (
        <button 
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-right ${
            active 
                ? 'bg-[#bf00ff]/10 border-r-4 border-[#bf00ff] text-white' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className="w-8 flex justify-center">{renderIcon()}</div>
            <span className="flex-1 font-medium">{label}</span>
            {badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge.color}`}>
                {badge.text}
            </span>
            )}
        </button>
    );
};

export const Sidebar = ({ currentModule, onNavigate }: SidebarProps) => {
  return (
    <aside className="glass p-6 h-fit sticky top-4 flex flex-col gap-6 w-full lg:w-[280px] font-display">
        {/* مؤشر صحة النظام */}
        <div className="text-center pb-6 border-b border-white/10">
            <div className="text-3xl font-bold text-[#bf00ff] mb-1">98.7%</div>
            <div className="text-sm text-white/60 mb-2 uppercase tracking-widest text-[10px]">System Health</div>
            <div className="progress h-1 bg-white/5">
                <div className="progress-bar bg-[#bf00ff] shadow-[0_0_10px_#bf00ff]" style={{width: '98.7%'}}></div>
            </div>
        </div>

        {/* قائمة التنقل */}
        <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={currentModule === 'dashboard'} onClick={onNavigate} />
            <NavItem id="applications" icon={Cpu} label="App Lifecycle" active={currentModule === 'applications'} onClick={onNavigate} />
            <NavItem id="disk" icon={HardDrive} label="Disk Space" active={currentModule === 'disk'} onClick={onNavigate} />
            <NavItem id="audit" icon={FileText} label="Audit & Logs" active={currentModule === 'audit'} onClick={onNavigate} />
            
            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-6 mb-2 px-3">Cyber Systems</div>
            <NavItem id="presentation" icon={PlayCircle} label="System Tour" active={currentModule === 'presentation'} onClick={onNavigate} badge={{text: 'PRO', color: 'bg-[#bf00ff] text-white'}} />

            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-6 mb-2 px-3">Elite Protection</div>
            
            {/* عرض الموديلات من الثوابت مع استبعاد المكرر */}
            {MODULES.filter(m => m.id !== 'disk').map(module => (
              <NavItem 
                key={module.id}
                id={module.id}
                icon={module.icon}
                label={module.name}
                active={currentModule === module.id}
                onClick={onNavigate}
              />
            ))}
        </nav>

        {/* الموارد */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] text-white/40 uppercase">
                <span>Core Usage</span>
                <span className="text-[#00ff88]">Optimized</span>
            </div>
        </div>
    </aside>
  );
};
