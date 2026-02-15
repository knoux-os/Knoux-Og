import React, { useEffect, useState } from 'react';

export const SplashScreen = () => {
    const [message, setMessage] = useState('System Boot Sequence Initiated...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Generate particles
        const container = document.getElementById('particles');
        if (container) {
            container.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                particle.style.animationDuration = 3 + Math.random() * 2 + 's';
                container.appendChild(particle);
            }
        }

        // Progress Simulation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 5;
                return next > 100 ? 100 : next;
            });
        }, 100);

        // Message Rotation
        const messages = [
            'Verifying cryptographic keys...',
            'Establishing secure uplink...',
            'Loading neural modules...',
            'Calibrating defense grid...',
            'Syncing with Sentinel Core...',
            'Access Granted.'
        ];
        
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            if (msgIndex < messages.length - 1) {
                msgIndex++;
                setMessage(messages[msgIndex]);
            }
        }, 600);

        return () => {
            clearInterval(progressInterval);
            clearInterval(msgInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0014] overflow-hidden font-display">
            <style>{`
                .particle {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: #bf00ff;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #bf00ff;
                    animation: floatParticle 4s ease-in-out infinite;
                }
                @keyframes floatParticle {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
                    100% { transform: translateY(-40px) scale(1); opacity: 0; }
                }
            `}</style>

            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2C0255_0%,#0a0014_70%)] opacity-60"></div>
            <div id="particles" className="absolute inset-0 pointer-events-none"></div>

            {/* Rotating Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] border border-[#bf00ff]/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="w-[400px] h-[400px] border border-[#9d4edd]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
                
                {/* Logo Animation */}
                <div className="relative mb-10 w-32 h-32">
                    <div className="absolute inset-0 bg-[#bf00ff] rounded-full blur-[40px] opacity-20 animate-pulse"></div>
                    <svg className="w-full h-full relative z-10 drop-shadow-[0_0_25px_rgba(191,0,255,0.6)] animate-[float_4s_ease-in-out_infinite]" viewBox="0 0 200 200" fill="none">
                        <defs>
                            <linearGradient id="splashGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#bf00ff"/>
                                <stop offset="100%" stopColor="#4B0082"/>
                            </linearGradient>
                        </defs>
                        <path d="M100 20 L170 55 L170 110 L100 160 L30 110 L30 55 L100 20Z" fill="url(#splashGradient2)" stroke="white" strokeWidth="2" strokeOpacity="0.5"/>
                        <path d="M100 45 L145 68 L145 98 L100 130 L55 98 L55 68 L100 45Z" fill="#ffffff" fillOpacity="0.1" />
                        <text x="100" y="125" fontFamily="Orbitron" fontSize="60" fontWeight="bold" textAnchor="middle" fill="white" filter="drop-shadow(0 0 5px rgba(255,255,255,0.5))">K</text>
                    </svg>
                </div>

                <h1 className="text-5xl font-extrabold tracking-[8px] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c56aff] to-white mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    KNOUX
                </h1>
                <div className="text-sm tracking-[12px] text-[#9d4edd] uppercase font-bold mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    GUARDIAN OS
                </div>

                {/* Progress Bar */}
                <div className="w-[300px] relative mb-4">
                    <div className="flex justify-between text-xs text-white/50 mb-2 font-mono">
                        <span>INIT_SEQ_01</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[#bf00ff] to-[#00ff88] relative shadow-[0_0_10px_#bf00ff]" 
                            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-[20px] bg-white/50 blur-[5px]"></div>
                        </div>
                    </div>
                </div>

                <div className="h-6 overflow-hidden">
                    <p className="text-[#bf00ff] text-xs font-mono tracking-widest uppercase animate-pulse">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};
