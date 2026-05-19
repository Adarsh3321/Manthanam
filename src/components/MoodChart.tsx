import { JournalEntry } from '../lib/supabase';
import { useMemo } from 'react';

type MoodChartProps = {
  entries: JournalEntry[];
};

export default function MoodChart({ entries }: MoodChartProps) {
  const chartData = useMemo(() => {
    const last14Days = entries.slice(0, 14).reverse();

    return last14Days.map((entry, index) => {
      const date = new Date(entry.created_at);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const stress = entry.stress_score || 0;
      
      const xPercent = last14Days.length > 1 ? (index / (last14Days.length - 1)) * 100 : 50;

      let colorClass = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
      let strokeColor = '#10b981'; // emerald-500
      if (stress >= 70) {
        colorClass = 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
        strokeColor = '#f43f5e'; // rose-500
      } else if (stress >= 40) {
        colorClass = 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]';
        strokeColor = '#eab308'; // yellow-500
      }

      return { label, stress, xPercent, colorClass, strokeColor };
    });
  }, [entries]);

  const linePath = useMemo(() => {
    return chartData
      .map((data, index) => `${index === 0 ? 'M' : 'L'} ${data.xPercent} ${100 - data.stress}`)
      .join(' ');
  }, [chartData]);

  if (entries.length === 0) return null;

  return (
    <div className="py-6 h-full flex flex-col justify-end">
      <div className="mb-4">
        <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">Stress Tracking</h3>
        <p className="text-xl text-slate-300 font-light">Your emotional intensity over time.</p>
      </div>

      <div className="relative w-full mt-auto" style={{ height: '180px' }}>
        {/* SVG Line connecting the dots */}
        <svg 
          className="absolute inset-0 w-full h-full overflow-visible z-0" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <path 
            d={linePath} 
            fill="none" 
            stroke="url(#gradient)"
            strokeWidth="3" 
            vectorEffect="non-scaling-stroke" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
            className="opacity-70"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {chartData.map((data, idx) => (
                <stop key={idx} offset={`${data.xPercent}%`} stopColor={data.strokeColor} />
              ))}
            </linearGradient>
          </defs>
        </svg>

        {/* Interactive Data Points */}
        {chartData.map((data, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center group cursor-pointer z-10"
            style={{
              left: `${data.xPercent}%`,
              bottom: `${data.stress}%`,
              transform: 'translate(-50%, 50%)',
            }}
          >
            <div className={`w-3 h-3 ${data.colorClass} rounded-full transition-all duration-300 group-hover:scale-150`} />
            
            {/* Tooltip */}
            <div className="absolute -top-12 bg-slate-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/10 shadow-xl transform group-hover:-translate-y-2">
              Score: {data.stress}
            </div>
          </div>
        ))}
      </div>

      {/* X Axis Labels */}
      <div className="relative w-full h-8 mt-6 border-t border-white/5 pt-3">
        {chartData.map((data, index) => (
          <div
            key={index}
            className={`absolute text-xs font-medium text-slate-500 whitespace-nowrap ${
              chartData.length > 7 && index % 2 !== 0 ? 'hidden md:block' : ''
            }`}
            style={{
              left: `${data.xPercent}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {data.label}
          </div>
        ))}
      </div>
    </div>
  );
}
