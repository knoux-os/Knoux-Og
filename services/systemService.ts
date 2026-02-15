import { useState, useEffect } from 'react';
import { SystemMetrics } from '../types';

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [currentMetric, setCurrentMetric] = useState<SystemMetrics>({
    cpuUsage: 0,
    ramUsage: 0,
    networkUp: 0,
    networkDown: 0,
    temperature: 0,
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newMetric: SystemMetrics = {
        cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40% baseline
        ramUsage: Math.floor(Math.random() * 20) + 40, // 40-60% baseline
        networkUp: Math.floor(Math.random() * 50),
        networkDown: Math.floor(Math.random() * 200),
        temperature: Math.floor(Math.random() * 15) + 45, // 45-60C
        timestamp: now.toLocaleTimeString()
      };

      setCurrentMetric(newMetric);
      setMetrics(prev => {
        const updated = [...prev, newMetric];
        if (updated.length > 20) updated.shift(); // Keep last 20 data points
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { history: metrics, current: currentMetric };
};
