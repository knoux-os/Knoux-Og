
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Users, Loader2, ShieldCheck, Mail, Globe, Code, Key, LogOut } from 'lucide-react';

export const IdentityManager = () => {
  const { user, getAccessTokenSilently, logout } = useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  // مثال على جلب التوكن بشكل صامت (getAccessTokenSilently)
  const handleGetToken = async () => {
    setLoadingToken(true);
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingToken(false);
    }
  };

  return (
    <div className="fade-in-up space-y-6 p-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-1">Identity Orchestrator</h2>
          <p className="text-white/70">Verified User Profile & Token Verification</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={handleGetToken}
            className="bg-[#bf00ff]/10 px-4 py-2 rounded-xl border border-[#bf00ff]/30 text-[#bf00ff] text-xs font-mono flex items-center gap-2 hover:bg-[#bf00ff]/20 transition-all"
          >
            {loadingToken ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />} 
            Verify JWT Token
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ملف المستخدم */}
        <div className="lg:col-span-1 glass p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
                <img 
                    src={user?.picture} 
                    alt={user?.name} 
                    className="w-32 h-32 rounded-3xl border-2 border-[#bf00ff] p-1 shadow-[0_0_30px_rgba(191,0,255,0.3)]"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#00ff88] p-2 rounded-xl border border-[#0a0014]">
                    <ShieldCheck size={20} className="text-[#0a0014]" />
                </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
            <p className="text-[#bf00ff] font-mono text-sm mb-4">@{user?.nickname || 'guardian'}</p>
            
            <div className="w-full space-y-3 mt-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <Mail size={16} className="text-white/40" />
                    <span className="text-sm truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <Globe size={16} className="text-white/40" />
                    <span className="text-sm">{user?.locale || 'International'}</span>
                </div>
            </div>

            <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="mt-8 w-full btn btn-outline border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
            >
                <LogOut size={16} /> Terminate Session
            </button>
        </div>

        {/* بيانات الـ JSON والتوكن */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6">
                <h4 className="font-display text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Code size={16} /> Raw Metadata (Auth0 Payload)
                </h4>
                <div className="bg-black/40 p-6 rounded-2xl font-mono text-xs overflow-auto max-h-[300px] custom-scrollbar border border-white/5">
                    <pre className="text-[#00ff88]">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
            </div>

            {token && (
                <div className="glass p-6 animate-in slide-in-from-bottom-4 duration-500">
                    <h4 className="font-display text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Key size={16} /> Secure Access Token (JWT)
                    </h4>
                    <div className="bg-[#bf00ff]/5 p-4 rounded-xl border border-[#bf00ff]/20 font-mono text-[10px] break-all text-[#bf00ff]/80">
                        {token}
                    </div>
                    <p className="text-[10px] text-white/30 mt-3 italic">
                        * This token is retrieved silently using getAccessTokenSilently() and can be used for backend API authentication.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
