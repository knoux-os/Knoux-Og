import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GuardianModule, ApiExecutionResponse, ServiceDefinition } from '../types';
import { Play, Activity, Clock, FileJson, AlertCircle, CheckCircle, Terminal, Copy, Download, X, FileText } from 'lucide-react';

interface ModuleControlProps {
  module: GuardianModule;
}

export const ModuleControl = ({ module }: ModuleControlProps) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executingService, setExecutingService] = useState<string | null>(null);
  const [result, setResult] = useState<ApiExecutionResponse | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); 
    return () => clearInterval(interval);
  }, [module.apiModuleName]);

  const fetchStatus = async () => {
    if (!module.apiModuleName) return;
    try {
      setLoading(true);
      const data = await api.getModuleStatus(module.apiModuleName);
      setStatus(data);
    } catch (e) {
      console.error("Failed to fetch status", e);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = async (service: ServiceDefinition) => {
    setExecutingService(service.id);
    setResult(null);
    try {
      const res = await api.executeModule(module.apiModuleName || 'unknown', service.id, {});
      setResult(res);
      setShowScriptModal(true);
    } catch (e: any) {
      setResult({ status: 'error', message: e.message });
    } finally {
      setExecutingService(null);
    }
  };

  const copyScript = () => {
      if (result?.script_content) {
          navigator.clipboard.writeText(result.script_content);
      }
  };

  const downloadScript = () => {
      if (!result?.script_content) return;
      const blob = new Blob([result.script_content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Determine extension based on context (default to .ps1, check for markdown signal)
      const ext = (result as any).file_extension || 'ps1';
      a.download = `KNOUX_${module.id}_${executingService || 'output'}.${ext}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const getStatusColor = (s: string) => {
      if (s === 'healthy' || s === 'active') return 'text-[#00ff88]';
      if (s === 'degraded') return 'text-[#ffaa00]';
      return 'text-[#ff0055]';
  };

  const isDocModule = module.id === 'documentation';

  return (
    <div className="fade-in-up space-y-6 p-2 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#bf00ff]/10 border border-[#bf00ff]/30 flex items-center justify-center text-[#bf00ff] text-2xl">
                {typeof module.icon === 'string' ? module.icon : <module.icon size={32} />}
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gradient">{module.name}</h2>
                <div className="flex items-center gap-3 text-sm text-white/60">
                    <span className="font-mono">{module.apiModuleName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Activity size={14} /> 
                        Status: <span className={`font-bold uppercase ${getStatusColor(status?.status || 'unknown')}`}>{status?.status || 'Unknown'}</span>
                    </span>
                    {status?.health_score !== undefined && (
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs">Health: {status.health_score}%</span>
                    )}
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchStatus} className="btn btn-outline text-sm py-2">
               {loading ? <Clock className="animate-spin" size={16} /> : <Activity size={16} />} Refresh
            </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="glass p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              {isDocModule ? <FileText size={20} className="text-[#9d4edd]" /> : <Terminal size={20} className="text-[#9d4edd]" />}
              {isDocModule ? 'Available Documents' : 'Available Services'} ({module.services?.length || 0})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {module.services?.map(service => (
                  <button 
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      disabled={!!executingService}
                      className="group flex flex-col items-center justify-center p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#bf00ff]/50 transition-all duration-300 text-center relative overflow-hidden"
                  >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#bf00ff]/0 to-[#bf00ff]/0 group-hover:from-[#bf00ff]/10 group-hover:to-transparent transition-all duration-500"></div>
                      
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {typeof service.icon === 'string' ? service.icon : <service.icon size={32} />}
                      </div>
                      
                      <h4 className="font-bold text-white mb-1">{service.name}</h4>
                      <p className="text-xs text-white/50">{service.description}</p>
                      
                      {executingService === service.id && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                              <Clock className="animate-spin text-[#bf00ff]" size={24} />
                          </div>
                      )}
                  </button>
              ))}
          </div>
      </div>

      {/* Script Modal */}
      {showScriptModal && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="glass w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-[#bf00ff]/30">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1f1038]">
                      <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                              {isDocModule ? <FileText className="text-[#bf00ff]" /> : <Terminal className="text-[#bf00ff]" />}
                              {isDocModule ? 'Generated Documentation' : 'Generated PowerShell Script'}
                          </h3>
                          <p className="text-xs text-white/50 mt-1">
                              {isDocModule ? 'Ready for distribution' : 'Ready for execution via Admin PowerShell'}
                          </p>
                      </div>
                      <button onClick={() => setShowScriptModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto bg-[#0a0014] p-6 font-mono text-sm relative group">
                      <pre className="text-[#00ff88] whitespace-pre-wrap leading-relaxed">
                          {result.script_content || '# No content generated.'}
                      </pre>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-white/10 bg-[#1f1038] flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                          <CheckCircle size={14} className="text-[#00ff88]" />
                          Generated successfully
                      </div>
                      <div className="flex gap-3">
                          <button onClick={copyScript} className="btn btn-outline text-sm py-2 px-4 flex items-center gap-2">
                              <Copy size={16} /> Copy Text
                          </button>
                          <button onClick={downloadScript} className="btn btn-primary text-sm py-2 px-4 flex items-center gap-2">
                              <Download size={16} /> Download {isDocModule ? '.md' : '.ps1'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};