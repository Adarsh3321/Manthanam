import { JournalEntry } from '../lib/supabase';
import { Calendar, Heart, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';

type EntryListProps = {
  entries: JournalEntry[];
};

const emotionColors: Record<string, string> = {
  happy: 'text-yellow-400',
  sad: 'text-blue-400',
  anxious: 'text-orange-400',
  angry: 'text-red-400',
  calm: 'text-emerald-400',
  excited: 'text-fuchsia-400',
  fear: 'text-purple-400',
};

const sentimentEmoji: Record<string, string> = {
  positive: '✨',
  neutral: '⚖️',
  negative: '🌧️',
};

export default function EntryList({ entries }: EntryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffMs = nowMidnight.getTime() - dateMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStressColor = (score?: number) => {
    if (!score) return 'text-slate-500';
    if (score < 30) return 'text-emerald-400';
    if (score < 60) return 'text-yellow-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-16">
      {entries.map((entry, idx) => (
        <div key={entry.id} className="relative group">
          {/* Faint subtle divider line between entries (except the first) */}
          {idx !== 0 && <hr className="absolute -top-8 left-0 right-0 border-white/5" />}

          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2 relative z-10">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4 text-indigo-500/50" />
                <span className="text-sm font-bold tracking-widest uppercase">{formatDate(entry.created_at)}</span>
              </div>
              {entry.emotion && (
                <span className={`text-xs font-bold tracking-[0.2em] uppercase ${emotionColors[entry.emotion] || 'text-slate-400'}`}>
                  • {entry.emotion}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              {entry.sentiment && (
                <div className="flex items-center gap-2" title="Overall Sentiment">
                  <span className="text-sm opacity-80">
                    {sentimentEmoji[entry.sentiment.toLowerCase()] || '•'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 capitalize tracking-widest uppercase">
                    {entry.sentiment}
                  </span>
                </div>
              )}
              {entry.stress_score !== null && (
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 opacity-50 ${getStressColor(entry.stress_score)}`} />
                  <span className={`text-xs font-bold tracking-widest uppercase ${getStressColor(entry.stress_score)}`}>
                    Stress: {entry.stress_score}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-200 text-xl md:text-2xl leading-relaxed mb-6 whitespace-pre-wrap relative z-10 font-light">
            {entry.entry_text}
          </p>

          <div className="flex flex-col md:flex-row gap-6 relative z-10 pl-4 border-l border-white/5">
            {entry.ai_summary && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest">AI Analysis</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-prose">
                  {entry.ai_summary}
                </p>
              </div>
            )}

            {entry.ai_affirmation && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Affirmation</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-prose">
                  {entry.ai_affirmation}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
