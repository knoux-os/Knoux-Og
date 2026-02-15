
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Shield, ArrowRight, UserPlus, Info, Copy, Check, AlertTriangle } from 'lucide-react';
import ButtonComponent from './ButtonComponent';

export const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const { loginWithRedirect } = useAuth0();
  const [copied, setCopied] = useState(false);
  const currentOrigin = window.location.origin;

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleSignup = () => {
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-[#0a0014] relative overflow-hidden p-6 font-display">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,0,255,0.15)_0%,transparent_70%)]"></div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-center max-w-[1000px] w-full z-10">
        
        {/* بطاقة تسجيل الدخول الرئيسية */}
        <div className="login-card glass p-10 w-full max-w-[450px] border-[#bf00ff]/30 text-center flex-shrink-0">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#bf00ff] to-[#4B0082] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(191,0,255,0.4)] relative">
               <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">KNOUX GUARDIAN</h1>
            <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Sentinel Terminal Access</p>
          </div>

          <div className="space-y-4">
            <ButtonComponent fullWidth onClick={handleLogin} className="group h-14">
              <ArrowRight size={20} className="mr-2 group-hover:translate-x-1 transition-transform" /> 
              Sign In to Terminal
            </ButtonComponent>

            <button onClick={handleSignup} className="w-full py-3 text-xs uppercase tracking-widest text-white/40 hover:text-[#bf00ff] transition-colors flex items-center justify-center gap-2">
              <UserPlus size={14} /> Create New Identity
            </button>
          </div>
        </div>

        {/* شاشة الدعم الفني لحل مشكلة Callback URL Mismatch */}
        <div className="glass p-8 border-yellow-500/30 bg-yellow-500/5 max-w-[500px] animate-in slide-in-from-right-10 duration-700">
          <div className="flex items-center gap-3 text-yellow-500 mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-lg font-bold">حل مشكلة "Callback URL Mismatch"</h2>
          </div>
          
          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            إذا ظهر لك خطأ في Auth0، فهذا يعني أنك بحاجة لإضافة الرابط التالي في إعدادات التطبيق في موقع <b>Auth0 Dashboard</b>:
          </p>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10 mb-6 flex items-center justify-between gap-4">
            <code className="text-[#00ff88] text-xs font-mono break-all">{currentOrigin}</code>
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white shrink-0"
              title="Copy link"
            >
              {copied ? <Check size={18} className="text-[#00ff88]" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] text-white/50 font-sans">1. اذهب إلى <b>Applications</b> &gt; <b>KNOUX SPA</b></p>
            <p className="text-[11px] text-white/50 font-sans">2. ابحث عن <b>Allowed Callback URLs</b></p>
            <p className="text-[11px] text-white/50 font-sans">3. الصق الرابط الأخضر أعلاه هناك ثم احفظ التغييرات (Save Changes).</p>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] text-[#bf00ff] font-bold uppercase tracking-widest">
            <Info size={12} />
            Data Integrity Verified by Sentinel Core
          </div>
        </div>

      </div>
    </div>
  );
};
