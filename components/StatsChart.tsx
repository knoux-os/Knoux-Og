import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { SystemMetrics, ThemeColors } from '../types';

interface StatsChartProps {
  data: SystemMetrics[];
  dataKey: keyof SystemMetrics;
  color: string;
  label: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, dataKey, color, label }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <h4 className="text-knoux-primary font-display text-sm mb-2 uppercase tracking-widest pl-2">
        {label}
      </h4>
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B0082" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              hide={true} 
            />
            <YAxis 
              hide={true} 
              domain={[0, 100]} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 0, 20, 0.9)', 
                borderColor: ThemeColors.Medium,
                color: '#fff',
                fontFamily: 'Space Grotesk'
              }}
              itemStyle={{ color: color }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${dataKey})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;
