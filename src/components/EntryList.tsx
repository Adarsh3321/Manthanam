import { JournalEntry } from '../lib/supabase';
import { Calendar, Heart, TrendingUp } from 'lucide-react';

type EntryListProps = {
  entries: JournalEntry[];
};

const emotionColors: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  sad: 'bg-blue-100 text-blue-800 border-blue-200',
  anxious: 'bg-orange-100 text-orange-800 border-orange-200',
  angry: 'bg-red-100 text-red-800 border-red-200',
  calm: 'bg-green-100 text-green-800 border-green-200',
  excited: 'bg-pink-100 text-pink-800 border-pink-200',
  fear: 'bg-purple-100 text-purple-800 border-purple-200',
};

const sentimentEmoji: Record<string, string> = {
  positive: '😊',
  neutral: '😐',
  negative: '😔',
};

export default function EntryList({ entries }: EntryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStressColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{formatDate(entry.created_at)}</span>
              </div>
              {entry.emotion && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    emotionColors[entry.emotion] || 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  {entry.emotion}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {entry.sentiment && (
                <span className="text-2xl" title={entry.sentiment}>
                  {sentimentEmoji[entry.sentiment]}
                </span>
              )}
              {entry.stress_score !== null && (
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-4 h-4 ${getStressColor(entry.stress_score)}`} />
                  <span className={`text-sm font-semibold ${getStressColor(entry.stress_score)}`}>
                    {entry.stress_score}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
            {entry.entry_text}
          </p>

          {entry.ai_summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
              <p className="text-sm text-blue-900">
                <strong>AI Summary:</strong> {entry.ai_summary}
              </p>
            </div>
          )}

          {entry.ai_affirmation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-900 flex-1">
                {entry.ai_affirmation}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
