
import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, UserCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
    onLogout?: () => void;
    user?: { username: string; role: string; avatar?: string } | null;
}

export const Header = ({ onLogout, user }: HeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="glass m-4 px-6 py-3 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14">
             <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bf00ff" />
                  <stop offset="100%" stopColor="#4B0082" />
                </linearGradient>
              </defs>
              <path d="M100 20 L170 55 L170 110 L100 160 L30 110 L30 55 L100 20Z" fill="url(#primaryGradient)" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
              <text x="100" y="115" fontFamily="Orbitron" fontSize="70" fontWeight="bold" textAnchor="middle" fill="white">K</text>
            </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold m-0 text-gradient font-display leading-tight">KNOUX GUARDIAN</h1>
            <div className="flex items-center gap-2">
                <span className="text-[9px] text-white/40 tracking-widest uppercase">Sentinel Core v1.0</span>
                <span className="text-[8px] bg-[#00ff88]/10 text-[#00ff88] px-1.5 py-0.5 rounded border border-[#00ff88]/20 flex items-center gap-1">
                    <ShieldCheck size={8} /> AUTH0_SECURE
                </span>
            </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative cursor-pointer hover:text-[#bf00ff] transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-[#bf00ff] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
        </div>

        <div className="relative">
            <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl pl-2 pr-4 py-1.5 hover:bg-white/10 transition-all group"
            >
                <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=bf00ff&color=fff`} 
                    alt="User" 
                    className="w-8 h-8 rounded-xl border border-white/20 group-hover:border-[#bf00ff]/50"
                />
                <div className="flex flex-col items-start leading-none">
                    <span className="text-xs font-bold text-white group-hover:text-[#bf00ff]">{user?.username}</span>
                    <span className="text-[9px] uppercase text-white/40 tracking-tighter">{user?.role}</span>
                </div>
            </button>
            
            {userMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 glass p-2 z-[100] flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 mb-1 border-b border-white/10">
                        <p className="text-[10px] text-white/40 uppercase">Identity Authenticated</p>
                    </div>
                    <button className="flex items-center gap-3 p-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <UserCircle size={18} /> My Profile
                    </button>
                    <button className="flex items-center gap-3 p-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Settings size={18} /> System Settings
                    </button>
                    <div className="h-px bg-white/10 my-1 mx-2"></div>
                    <button onClick={onLogout} className="flex items-center gap-3 p-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={18} /> Terminate Link
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};
