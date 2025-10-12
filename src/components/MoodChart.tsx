import { JournalEntry } from '../lib/supabase';
import { useMemo } from 'react';

type MoodChartProps = {
  entries: JournalEntry[];
};

export default function MoodChart({ entries }: MoodChartProps) {
  const chartData = useMemo(() => {
    const last14Days = entries.slice(0, 14).reverse();
    const maxStress = Math.max(...last14Days.map(e => e.stress_score || 0), 1);

    return last14Days.map(entry => {
      const date = new Date(entry.created_at);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const stress = entry.stress_score || 0;
      const height = (stress / 100) * 100;

      let color = 'bg-green-500';
      if (stress >= 70) color = 'bg-red-500';
      else if (stress >= 40) color = 'bg-yellow-500';

      return { label, stress, height, color };
    });
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Stress Levels Over Time</h3>

      <div className="flex items-end justify-between gap-2 h-48">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
              <div
                className={`w-full ${data.color} rounded-t-lg transition-all hover:opacity-80 relative group`}
                style={{ height: `${data.height}%`, minHeight: data.stress > 0 ? '8px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.stress}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 text-center">{data.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Low (0-39)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Medium (40-69)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">High (70-100)</span>
        </div>
      </div>
    </div>
  );
}
