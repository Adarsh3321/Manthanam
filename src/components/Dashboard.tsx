import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, JournalEntry } from '../lib/supabase';
import { PenLine, LogOut, TrendingUp, Heart, Sparkles, Calendar } from 'lucide-react';
import NewEntry from './NewEntry';
import EntryList from './EntryList';
import MoodChart from './MoodChart';
import InsightCard from './InsightCard';


export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = (entry: JournalEntry) => {
    setEntries([entry, ...entries]);
    setShowNewEntry(false);
  };

  const getMoodGreeting = () => {
    if (entries.length === 0) return "Let's start your journey";

    const recentEntries = entries.slice(0, 7);
    const positiveCount = recentEntries.filter(e => e.sentiment === 'positive').length;
    const neutralCount = recentEntries.filter(e => e.sentiment === 'neutral').length;

    if (positiveCount > recentEntries.length / 2) {
      return "You've been feeling great lately";
    } else if (neutralCount > recentEntries.length / 2) {
      return "You're maintaining balance";
    } else {
      return "Remember, it's okay to not be okay";
    }
  };

  const getAverageStressScore = () => {
    if (entries.length === 0) return 0;
    const recentEntries = entries.slice(0, 7).filter(e => e.stress_score !== null);
    if (recentEntries.length === 0) return 0;
    const sum = recentEntries.reduce((acc, e) => acc + (e.stress_score || 0), 0);
    return Math.round(sum / recentEntries.length);
  };

  const getMostCommonEmotion = () => {
    if (entries.length === 0) return 'calm';
    const recentEntries = entries.slice(0, 7).filter(e => e.emotion);
    const emotionCounts: Record<string, number> = {};

    recentEntries.forEach(e => {
      if (e.emotion) {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      }
    });

    const mostCommon = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : 'calm';
  };

  if (showNewEntry) {
    return <NewEntry onSave={handleNewEntry} onCancel={() => setShowNewEntry(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MoodMuse
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium hidden sm:block">
                Hey, {profile?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getMoodGreeting()}
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <InsightCard
            icon={TrendingUp}
            title="Average Stress"
            value={`${getAverageStressScore()}/100`}
            color="from-orange-500 to-red-500"
            description="Last 7 entries"
          />
          <InsightCard
            icon={Heart}
            title="Dominant Emotion"
            value={getMostCommonEmotion()}
            color="from-pink-500 to-rose-500"
            description="This week"
          />
          <InsightCard
            icon={Sparkles}
            title="Total Entries"
            value={entries.length.toString()}
            color="from-blue-500 to-green-500"
            description="All time"
          />
        </div>

        {entries.length > 0 && (
          <div className="mb-8">
            <MoodChart entries={entries} />
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Your Journal</h3>
          <button
            onClick={() => setShowNewEntry(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <PenLine className="w-5 h-5" />
            New Entry
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenLine className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey</h3>
            <p className="text-gray-600 mb-6">
              Write your first entry to begin tracking your emotions
            </p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <PenLine className="w-5 h-5" />
              Write First Entry
            </button>
          </div>
        ) : (
          <EntryList entries={entries} />
        )}
      </div>
    </div>
  );
}



