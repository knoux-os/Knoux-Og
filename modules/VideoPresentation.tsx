import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Play, Pause, Volume2, Maximize, Film, Aperture, Music, Mic, ChevronRight, MonitorPlay, Globe, Cpu, Shield, Layout, Clapperboard, Copy, Check, Sparkles, Video, Loader2, AlertCircle } from 'lucide-react';

const SCENES = [
    { 
        id: '01', 
        title: 'The Awakening', 
        duration: '0:15', 
        desc: 'A single point of purple light pulses like a heartbeat, revealing the crystalline shield core.', 
        color: 'from-[#bf00ff] to-[#4B0082]',
        prompt: 'Cinematic shot, dark void, a single glowing purple neon point pulses like a heartbeat in the center. It explodes into a crystalline shield structure with purple energy veins. 8k resolution, highly detailed, futuristic sci-fi interface style.',
        tool: 'Veo'
    },
    { 
        id: '02', 
        title: 'The Architecture', 
        duration: '0:20', 
        desc: 'Fly-through of the massive floating city representing the Client, API, and Core layers.', 
        color: 'from-[#9d4edd] to-[#2C0255]',
        prompt: 'Futuristic floating city in cyberspace, glowing purple and neon blue data streams connecting massive server towers. Camera flythrough, cinematic lighting, volumetric fog, cyberpunk aesthetic.',
        tool: 'Veo'
    },
    { 
        id: '03', 
        title: 'The 12 Guardians', 
        duration: '0:30', 
        desc: 'Throne room reveal of the 12 modules, each with unique personality and power.', 
        color: 'from-[#c56aff] to-[#4B0082]',
        prompt: 'A high-tech circular chamber with 12 holographic pedestals. Each pedestal displays a unique glowing purple icon representing a system module. Cinematic camera orbit, lens flares, glass reflections.',
        tool: 'Veo'
    },
    { 
        id: '04', 
        title: 'The Dashboard', 
        duration: '0:25', 
        desc: 'Glass-morphism interface materializing with real-time pulsing data streams.', 
        color: 'from-[#7b2cbf] to-[#0a0014]',
        prompt: 'Close up of a futuristic glass holographic interface. HUD elements, graphs, and numbers rapidly scrolling in purple and white. Depth of field, bokeh effects, high tech control room atmosphere.',
        tool: 'Veo'
    },
    { 
        id: '05', 
        title: 'Live Demo', 
        duration: '0:40', 
        desc: 'Dynamic split-screen showing security scans, backups, and optimizations in action.', 
        color: 'from-[#bf00ff] to-[#9d4edd]',
        prompt: 'Split screen montage of digital security scanning, data backup visualization with flowing binary code, and system optimization graphs turning green. Fast paced, motion graphics style.',
        tool: 'Veo'
    },
    { 
        id: '06', 
        title: 'Global Protection', 
        duration: '0:20', 
        desc: 'Orbit view of Earth protected by a purple energy shield grid.', 
        color: 'from-[#4B0082] to-[#0a0014]',
        prompt: 'View of planet Earth from space. A translucent purple energy hexagon grid forms a protective shield around the planet. Satellites orbiting, cinematic lighting, realistic earth texture.',
        tool: 'Veo'
    },
    { 
        id: '07', 
        title: 'The Future', 
        duration: '0:15', 
        desc: 'Visionary portal to a futuristic landscape where AI and humans collaborate.', 
        color: 'from-[#9d4edd] to-[#c56aff]',
        prompt: 'Abstract journey through a tunnel of purple light and data. At the end, a bright white light reveals a futuristic clean city skyline. Hopeful, uplifting, 8k render.',
        tool: 'Veo'
    },
    { 
        id: '08', 
        title: 'The Creator', 
        duration: '0:10', 
        desc: 'Silhouette of Eng. Sadek Elgazar commanding the holographic system.', 
        color: 'from-[#2C0255] to-[#000000]',
        prompt: 'Silhouette of a man standing in front of a massive glowing purple wall of screens. He raises his hand to control the data. Dramatic backlighting, mysterious, powerful.',
        tool: 'Veo'
    },
];

interface SceneState {
    status: 'idle' | 'generating' | 'ready' | 'error';
    videoUrl?: string;
    progress?: string;
    errorMsg?: string;
}

export const VideoPresentation = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeScene, setActiveScene] = useState(0);
    const [viewMode, setViewMode] = useState<'preview' | 'production'>('preview');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [sceneStates, setSceneStates] = useState<Record<string, SceneState>>({});
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-advance scenes if playing (only if video is not present or ended)
    useEffect(() => {
        let interval: any;
        const currentSceneState = sceneStates[activeScene];
        
        // If we are playing and NOT watching a generated video (or in simulation mode)
        if (isPlaying && viewMode === 'preview' && (!currentSceneState || currentSceneState.status !== 'ready')) {
            interval = setInterval(() => {
                setActiveScene(prev => (prev + 1) % SCENES.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, viewMode, activeScene, sceneStates]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleGenerate = async (index: number) => {
        const scene = SCENES[index];
        
        // 1. Check API Key
        if ((window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                    await (window as any).aistudio.openSelectKey();
                } catch (e) {
                    console.error("Key selection failed/cancelled");
                    return;
                }
            }
        }

        // 2. Set Loading State
        setSceneStates(prev => ({
            ...prev, 
            [index]: { status: 'generating', progress: 'Initializing...' }
        }));

        try {
            // 3. Initialize AI
            // @ts-ignore - Process env is injected
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            setSceneStates(prev => ({...prev, [index]: { status: 'generating', progress: 'Sending to Veo...' }}));

            // 4. Call Veo Model
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: scene.prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '1080p',
                    aspectRatio: '16:9'
                }
            });

            // 5. Poll for completion
            while (!operation.done) {
                 setSceneStates(prev => ({...prev, [index]: { status: 'generating', progress: 'Rendering Video...' }}));
                 await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll
                 operation = await ai.operations.getVideosOperation({operation: operation as any});
            }

            if (operation.error) throw new Error(String(operation.error.message));

            const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!videoUri) throw new Error("No video URI returned");

            // 6. Fetch final video
            setSceneStates(prev => ({...prev, [index]: { status: 'generating', progress: 'Downloading...' }}));
            // @ts-ignore
            const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // 7. Complete
            setSceneStates(prev => ({...prev, [index]: { status: 'ready', videoUrl: url }}));

        } catch (e: any) {
            console.error(e);
            setSceneStates(prev => ({
                ...prev, 
                [index]: { status: 'error', errorMsg: e.message || String(e) || 'Generation failed' }
            }));
        }
    };

    const renderSceneContent = (index: number) => {
        const state = sceneStates[index];

        // If video is ready, show it
        if (state?.status === 'ready' && state.videoUrl) {
            return (
                <div className="w-full h-full bg-black relative">
                    <video 
                        ref={videoRef}
                        src={state.videoUrl}
                        className="w-full h-full object-contain"
                        autoPlay={isPlaying}
                        loop
                        playsInline
                    />
                    {/* Overlay Title even on video */}
                    <div className={`absolute bottom-20 left-0 right-0 text-center transition-opacity duration-1000 pointer-events-none ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                        <h1 className="font-display text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                            {SCENES[activeScene].title.toUpperCase()}
                        </h1>
                    </div>
                </div>
            );
        }

        // Otherwise show CSS Simulation
        switch (index) {
            case 0: // Awakening
                return (
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <div className={`w-4 h-4 bg-[#bf00ff] rounded-full blur-[2px] shadow-[0_0_50px_#bf00ff] ${isPlaying ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}></div>
                        <div className={`absolute w-32 h-32 border border-[#9d4edd]/30 rounded-full ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
                        <div className={`absolute w-64 h-64 border border-[#4B0082]/20 rounded-full ${isPlaying ? 'animate-[spin_20s_linear_infinite_reverse]' : ''}`}></div>
                        <div className={`absolute w-[500px] h-[1px] bg-gradient-to-r from-transparent via-[#bf00ff] to-transparent ${isPlaying ? 'animate-pulse' : ''}`}></div>
                    </div>
                );
            case 1: // Architecture
                return (
                    <div className="relative z-10 flex flex-col items-center justify-center gap-8 perspective-[1000px]">
                         <div style={{ transform: 'rotateX(12deg)' }} className={`w-40 h-10 bg-[#bf00ff]/20 border border-[#bf00ff]/50 rounded-lg flex items-center justify-center text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(191,0,255,0.2)] ${isPlaying ? 'animate-bounce' : ''}`}>Client Layer</div>
                         <div style={{ transform: 'rotateX(12deg)' }} className={`w-40 h-10 bg-[#9d4edd]/20 border border-[#9d4edd]/50 rounded-lg flex items-center justify-center text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(157,78,221,0.2)] ${isPlaying ? 'animate-bounce delay-100' : ''}`}>API Gateway</div>
                         <div style={{ transform: 'rotateX(12deg)' }} className={`w-40 h-10 bg-[#4B0082]/40 border border-[#4B0082]/50 rounded-lg flex items-center justify-center text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(75,0,130,0.4)] ${isPlaying ? 'animate-bounce delay-200' : ''}`}>Core Engine</div>
                         {isPlaying && <div className="absolute inset-0 bg-gradient-to-t from-[#bf00ff]/10 to-transparent animate-pulse"></div>}
                    </div>
                );
            case 2: // 12 Guardians
                return (
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div className={`relative w-64 h-64 ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="absolute w-8 h-8 bg-[#bf00ff]/20 border border-[#bf00ff] rounded-full flex items-center justify-center backdrop-blur-sm" style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 30}deg) translate(120px) rotate(-${i * 30}deg)`
                                }}>
                                    <Shield size={12} className="text-white" />
                                </div>
                            ))}
                            <div className="absolute inset-0 m-auto w-20 h-20 bg-[#9d4edd]/30 rounded-full blur-xl animate-pulse"></div>
                        </div>
                    </div>
                );
            case 3: // Dashboard
                return (
                    <div className="relative z-10 w-3/4 h-3/4 grid grid-cols-3 gap-4 p-4 perspective-[500px]">
                        <div className={`col-span-2 bg-white/5 border border-white/10 rounded-lg ${isPlaying ? 'animate-[fadeInUp_0.5s_ease-out]' : 'opacity-20'}`}></div>
                        <div className={`bg-white/5 border border-white/10 rounded-lg ${isPlaying ? 'animate-[fadeInUp_0.7s_ease-out]' : 'opacity-20'}`}></div>
                        <div className={`bg-white/5 border border-white/10 rounded-lg ${isPlaying ? 'animate-[fadeInUp_0.9s_ease-out]' : 'opacity-20'}`}></div>
                        <div className={`col-span-2 bg-white/5 border border-white/10 rounded-lg ${isPlaying ? 'animate-[fadeInUp_1.1s_ease-out]' : 'opacity-20'}`}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-[#bf00ff]/10 to-transparent pointer-events-none"></div>
                    </div>
                );
            case 4: // Live Demo
                return (
                    <div className="relative z-10 w-full h-full flex">
                        <div className="w-1/2 h-full border-r border-white/10 flex items-center justify-center p-8">
                            <div className="w-full space-y-2">
                                <div className="h-2 bg-white/10 rounded w-full overflow-hidden">
                                    <div className={`h-full bg-[#00ff88] ${isPlaying ? 'animate-[loading_2s_infinite]' : 'w-1/2'}`}></div>
                                </div>
                                <div className="h-2 bg-white/10 rounded w-3/4 overflow-hidden">
                                    <div className={`h-full bg-[#bf00ff] ${isPlaying ? 'animate-[loading_3s_infinite]' : 'w-1/2'}`}></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full flex items-center justify-center bg-[#bf00ff]/5 relative overflow-hidden">
                             {isPlaying && (
                                <div className="absolute inset-0">
                                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping delay-500"></div>
                                    <div className="absolute inset-0 border-2 border-[#bf00ff]/30 rounded-full scale-0 animate-[ping_2s_infinite]"></div>
                                </div>
                             )}
                             <Shield size={64} className="text-[#bf00ff] opacity-50" />
                        </div>
                    </div>
                );
            case 5: // Global Protection
                return (
                    <div className="relative z-10 flex items-center justify-center">
                        <div className={`w-48 h-48 rounded-full border border-[#bf00ff]/30 flex items-center justify-center relative ${isPlaying ? 'animate-[spin_30s_linear_infinite]' : ''}`}>
                            <Globe size={120} className="text-[#9d4edd] opacity-80" strokeWidth={0.5} />
                            {/* Satellites */}
                            <div className={`absolute top-0 w-2 h-2 bg-[#bf00ff] rounded-full shadow-[0_0_10px_#bf00ff] ${isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''}`} style={{left: '50%', transformOrigin: '0 96px'}}></div>
                            <div className={`absolute top-0 w-2 h-2 bg-[#bf00ff] rounded-full shadow-[0_0_10px_#bf00ff] ${isPlaying ? 'animate-[spin_7s_linear_infinite_reverse]' : ''}`} style={{left: '50%', transformOrigin: '0 96px'}}></div>
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0014_90%)]"></div>
                    </div>
                );
            case 6: // Future
                return (
                    <div className="relative z-10 flex items-center justify-center overflow-hidden w-full h-full">
                         {[...Array(5)].map((_, i) => (
                             <div key={i} className={`absolute border border-[#bf00ff]/${20 + i*10} rounded-full ${isPlaying ? 'animate-[ping_4s_infinite]' : ''}`} style={{
                                 width: `${(i + 1) * 100}px`,
                                 height: `${(i + 1) * 100}px`,
                                 animationDelay: `${i * 0.5}s`
                             }}></div>
                         ))}
                         <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf00ff] to-white opacity-0 animate-[fadeInUp_2s_forwards]">
                             THE FUTURE
                         </div>
                    </div>
                );
            case 7: // The Creator
                return (
                    <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4B0082] to-[#0a0014] border-2 border-[#bf00ff] shadow-[0_0_50px_#bf00ff] flex items-center justify-center overflow-hidden">
                            <div className="w-20 h-20 bg-black/50 rounded-full transform translate-y-4"></div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-1">Eng. Sadek Elgazar</h2>
                            <p className="text-[#9d4edd] text-xs uppercase tracking-[0.5em]">Director & Lead Developer</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="fade-in-up space-y-6 p-2 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#bf00ff] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Cinematic Premiere</span>
                        <span className="text-white/40 text-xs">8K IMAX • 60FPS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gradient">Knoux Guardian: The Movie</h2>
                </div>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button 
                        onClick={() => {
                            setViewMode('preview');
                            if (sceneStates[activeScene]?.status === 'ready' && videoRef.current) {
                                videoRef.current.play();
                            }
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'preview' ? 'bg-[#9d4edd] text-white shadow-[0_0_15px_rgba(157,78,221,0.4)]' : 'text-white/60 hover:text-white'}`}
                    >
                        <MonitorPlay size={16} /> Preview
                    </button>
                    <button 
                        onClick={() => { setViewMode('production'); setIsPlaying(false); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'production' ? 'bg-[#9d4edd] text-white shadow-[0_0_15px_rgba(157,78,221,0.4)]' : 'text-white/60 hover:text-white'}`}
                    >
                        <Clapperboard size={16} /> Production
                    </button>
                </div>
            </div>

            {viewMode === 'preview' ? (
                /* PREVIEW MODE */
                <div className="flex flex-col h-full gap-6">
                    {/* Main Player Area */}
                    <div className="glass p-1 rounded-2xl overflow-hidden relative group shrink-0">
                        <div className="aspect-video bg-black rounded-xl relative overflow-hidden flex items-center justify-center">
                            
                            {/* Simulated Video Content */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-80'}`}>
                                {/* Background Ambiance based on Scene (only if no video) */}
                                {sceneStates[activeScene]?.status !== 'ready' && (
                                    <>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${SCENES[activeScene].color} opacity-20 transition-all duration-1000`}></div>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]"></div>
                                    </>
                                )}
                                
                                {/* Dynamic Scene Content or Video */}
                                {renderSceneContent(activeScene)}

                                {/* Title Overlay (CSS sim only) */}
                                {sceneStates[activeScene]?.status !== 'ready' && (
                                    <div className={`absolute bottom-20 left-0 right-0 text-center transition-all duration-1000 ${!isPlaying || (isPlaying && activeScene === 0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                        <h1 className="font-display text-4xl md:text-5xl font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#bf00ff] via-white to-[#bf00ff] drop-shadow-[0_0_20px_rgba(191,0,255,0.5)]">
                                            {SCENES[activeScene].title.toUpperCase()}
                                        </h1>
                                        <p className="font-body text-[#9d4edd] tracking-[0.3em] text-xs md:text-sm mt-2 uppercase">Scene {SCENES[activeScene].id}</p>
                                    </div>
                                )}
                            </div>

                            {/* Play Button Overlay */}
                            {!isPlaying && (
                                <button 
                                    onClick={() => {
                                        setIsPlaying(true);
                                        if (videoRef.current) videoRef.current.play();
                                    }}
                                    className="absolute z-20 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:scale-110 hover:bg-[#bf00ff]/20 transition-all duration-300 group-hover:border-[#bf00ff]"
                                >
                                    <Play size={32} className="ml-1 text-white fill-white" />
                                </button>
                            )}

                            {/* Controls Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden">
                                    <div className="h-full bg-[#bf00ff] relative transition-all duration-300" style={{ width: `${((activeScene + 1) / SCENES.length) * 100}%` }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#bf00ff]"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-white">
                                    <div className="flex gap-4">
                                        <button onClick={() => {
                                            const nextState = !isPlaying;
                                            setIsPlaying(nextState);
                                            if (videoRef.current) {
                                                nextState ? videoRef.current.play() : videoRef.current.pause();
                                            }
                                        }} className="hover:text-[#bf00ff]">
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <button className="hover:text-[#bf00ff]"><Volume2 size={20} /></button>
                                        <span className="text-sm font-mono opacity-60">Scene {SCENES[activeScene].id} / 08</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-xs uppercase tracking-widest opacity-60 pt-1">Directed by Eng. Sadek Elgazar</span>
                                        <button className="hover:text-[#bf00ff]"><Maximize size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6">
                         {/* Scene List */}
                        <div className="flex-1 glass p-6 overflow-y-auto custom-scrollbar">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Film size={18} className="text-[#9d4edd]" /> Production Storyboard
                            </h3>
                            <div className="space-y-3">
                                {SCENES.map((scene, index) => (
                                    <div 
                                        key={scene.id} 
                                        onClick={() => { setActiveScene(index); setIsPlaying(true); }}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                                            activeScene === index 
                                            ? 'bg-white/10 border-[#bf00ff] shadow-[0_0_15px_rgba(191,0,255,0.1)]' 
                                            : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-mono opacity-50 ${activeScene === index ? 'text-[#bf00ff]' : ''}`}>SCENE {scene.id}</span>
                                                <h4 className="font-bold text-sm">{scene.title}</h4>
                                                
                                                {/* Indicators */}
                                                {sceneStates[index]?.status === 'ready' && (
                                                    <span className="text-[10px] bg-[#00ff88]/20 text-[#00ff88] px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <Video size={10} /> Ready
                                                    </span>
                                                )}
                                                {sceneStates[index]?.status === 'generating' && (
                                                    <span className="text-[10px] bg-[#bf00ff]/20 text-[#bf00ff] px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                                        <Loader2 size={10} className="animate-spin" /> Rendering
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-white/60">{scene.duration}</span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed pl-[4.5rem] truncate">{scene.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Tech Specs */}
                        <div className="w-full md:w-80 flex flex-col gap-6">
                            <div className="glass p-6 bg-gradient-to-br from-[#4B0082]/40 to-[#0a0014]/40">
                                <h3 className="text-lg font-bold mb-4 text-[#bf00ff]">Director's Vision</h3>
                                <div className="relative">
                                    <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[#bf00ff]/30"></div>
                                    <p className="pl-4 text-sm text-white/80 italic leading-relaxed">
                                        "This is not just a promo video... it is a cinematic masterpiece reflecting the greatness of the application. Every pixel carries a piece of my soul."
                                    </p>
                                    <div className="pl-4 mt-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#bf00ff] to-[#4B0082]"></div>
                                        <div>
                                            <div className="text-xs font-bold">Eng. Sadek Elgazar</div>
                                            <div className="text-[10px] text-white/50">Lead Developer & Director</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* PRODUCTION MODE */
                <div className="glass p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="text-center mb-8">
                            <Sparkles size={48} className="text-[#bf00ff] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold font-display">Video Generation Studio</h2>
                            <p className="text-white/60 mt-2">Generate real 1080p video scenes using Gemini Veo AI</p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-xs text-white/50">
                                <Video size={14} /> 
                                <span>Powered by Google Veo 3.1</span>
                            </div>
                        </div>

                        {SCENES.map((scene, index) => {
                            const state = sceneStates[index];
                            return (
                                <div key={scene.id} className="border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-white/[0.07] transition-colors relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-[#bf00ff]/20 flex items-center justify-center text-xs font-bold text-[#bf00ff] border border-[#bf00ff]/30">
                                                {scene.id}
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-lg">{scene.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50 uppercase">{scene.duration}</span>
                                                    {state?.status === 'ready' && (
                                                        <span className="text-[10px] bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                                            <Check size={10} /> Generated
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            {/* Generate Button */}
                                            {state?.status !== 'generating' && (
                                                <button 
                                                    onClick={() => handleGenerate(index)}
                                                    disabled={state?.status === 'ready'}
                                                    className={`btn text-xs py-1.5 px-3 flex items-center gap-2 ${
                                                        state?.status === 'ready' 
                                                        ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88] cursor-default' 
                                                        : 'btn-primary'
                                                    }`}
                                                >
                                                    {state?.status === 'ready' ? (
                                                        <>
                                                            <Check size={14} /> Complete
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Video size={14} /> {state?.status === 'error' ? 'Retry Generation' : 'Generate with Veo'}
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {/* Copy Button */}
                                            <button 
                                                onClick={() => handleCopy(scene.prompt, scene.id)}
                                                className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-2 hover:bg-[#bf00ff]/20 hover:border-[#bf00ff]"
                                            >
                                                {copiedId === scene.id ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedId === scene.id ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="font-mono text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{scene.prompt}</p>
                                    </div>

                                    {/* Progress / Status Area */}
                                    {(state?.status === 'generating' || state?.status === 'error') && (
                                        <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
                                            state.status === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-[#bf00ff]/10 border border-[#bf00ff]/30 text-[#bf00ff]'
                                        }`}>
                                            {state.status === 'generating' ? <Loader2 size={16} className="animate-spin" /> : <AlertCircle size={16} />}
                                            <span className="text-sm font-medium">
                                                {state.status === 'error' ? `Error: ${state.errorMsg}` : state.progress}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};