import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GuardianModule, ModuleStatus, ApiExecutionResponse } from '../types';
import { Play, Activity, Clock, FileJson, AlertCircle, CheckCircle, Terminal } from 'lucide-react';

interface ModuleControlProps {
  module: GuardianModule;
}

export const ModuleControl = ({ module }: ModuleControlProps) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ApiExecutionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'actions' | 'logs'>('actions');
  const [asyncRunId, setAsyncRunId] = useState<string | null>(null);
  const [asyncStatus, setAsyncStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll status every 10s
    return () => clearInterval(interval);
  }, [module.apiModuleName]);

  // Poll for async task if one is running
  useEffect(() => {
      let pollInterval: any;
      if (asyncRunId) {
          pollInterval = setInterval(async () => {
              try {
                  const status = await api.getAsyncRunStatus(asyncRunId);
                  setAsyncStatus(status.status);
                  if (status.status === 'completed' || status.status === 'failed') {
                      setAsyncRunId(null);
                      // Fetch final result
                      const finalResult = await api.getExecutionResult(module.apiModuleName, status.run_id);
                      setResult(finalResult);
                  }
              } catch (e) {
                  console.error("Failed to poll async task", e);
                  setAsyncRunId(null);
              }
          }, 2000);
      }
      return () => clearInterval(pollInterval);
  }, [asyncRunId, module.apiModuleName]);

  const fetchStatus = async () => {
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

  const handleExecute = async (endpoint: string, payload: any) => {
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.executeModule(module.apiModuleName, endpoint, payload);
      setResult(res);
      
      // If async, start polling
      if (res.run_mode === 'async' && res.run_id) {
          setAsyncRunId(res.run_id);
          setAsyncStatus('running');
      }

      // Refresh status immediately
      fetchStatus();
    } catch (e: any) {
      setResult({ status: 'error', message: e.message });
    } finally {
      setExecuting(false);
    }
  };

  const getStatusColor = (s: string) => {
      if (s === 'healthy' || s === 'active') return 'text-[#00ff88]';
      if (s === 'degraded') return 'text-[#ffaa00]';
      return 'text-[#ff0055]';
  };

  return (
    <div className="fade-in-up space-y-6 p-2 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#bf00ff]/10 border border-[#bf00ff]/30 flex items-center justify-center text-[#bf00ff]">
                <module.icon size={32} />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Column: Actions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Action Cards */}
              <div className="glass p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Terminal size={20} className="text-[#9d4edd]" /> Available Operations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.actions?.map(action => (
                          <div key={action.id} className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold">{action.label}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${action.method === 'POST' ? 'bg-[#bf00ff]/20 text-[#bf00ff]' : 'bg-blue-500/20 text-blue-400'}`}>
                                      {action.method}
                                  </span>
                              </div>
                              <div className="text-xs text-white/50 font-mono mb-4 bg-black/30 p-2 rounded">
                                  /{action.endpoint}
                              </div>
                              <button 
                                onClick={() => handleExecute(action.endpoint, action.defaultPayload)}
                                disabled={executing || !!asyncRunId}
                                className="w-full btn btn-primary py-2 text-sm flex justify-center"
                              >
                                  {executing ? <Clock className="animate-spin mr-2" size={16}/> : <Play className="mr-2" size={16}/>}
                                  Execute
                              </button>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Execution Console */}
              <div className="glass p-0 overflow-hidden flex flex-col flex-1 min-h-[300px]">
                  <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold flex items-center gap-2">
                          <FileJson size={18} /> Execution Result
                      </h3>
                      {asyncStatus && (
                          <span className="flex items-center gap-2 text-xs bg-[#ffaa00]/20 text-[#ffaa00] px-3 py-1 rounded-full animate-pulse">
                              <Clock size={12} /> Async Task Running: {asyncStatus}
                          </span>
                      )}
                  </div>
                  <div className="bg-[#0a0014] p-6 font-mono text-sm overflow-auto flex-1 custom-scrollbar">
                      {result ? (
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-4">
                                  {result.status === 'completed' || result.status === 'success' ? (
                                      <CheckCircle className="text-[#00ff88]" size={20} />
                                  ) : (
                                      <AlertCircle className="text-[#ff0055]" size={20} />
                                  )}
                                  <span className={result.status === 'error' ? 'text-[#ff0055]' : 'text-[#00ff88]'}>
                                      Execution {result.status || 'Failed'}
                                  </span>
                              </div>
                              <pre className="text-white/80 whitespace-pre-wrap">
                                  {JSON.stringify(result, null, 2)}
                              </pre>
                          </div>
                      ) : (
                          <div className="h-full flex items-center justify-center text-white/20">
                              Waiting for command execution...
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column: Status Details */}
          <div className="glass p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Module Status</h3>
              {status ? (
                  <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                          <div className="text-white/50 text-xs uppercase mb-1">Health Score</div>
                          <div className="text-4xl font-display font-bold text-[#00ff88]">{status.health_score}%</div>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-white/60">Module Name</span>
                              <span className="font-mono text-sm">{status.module_name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-white/60">Enabled</span>
                              <span className={status.enabled ? 'text-[#00ff88]' : 'text-[#ff0055]'}>
                                  {status.enabled ? 'Yes' : 'No'}
                              </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-white/60">Last Update</span>
                              <span className="font-mono text-sm text-white/80">Just now</span>
                          </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/10">
                          <h4 className="font-bold mb-2 text-sm text-white/50 uppercase">Payload Preview</h4>
                          <div className="text-xs font-mono text-white/40 bg-black/20 p-2 rounded">
                              {JSON.stringify(module.actions?.[0]?.defaultPayload || {}, null, 2)}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex items-center justify-center h-40">
                      <Clock className="animate-spin text-white/20" size={32} />
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
