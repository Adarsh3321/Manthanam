import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, JournalEntry } from '../lib/supabase';
import { PenLine, LogOut, TrendingUp, Heart, Sparkles, Calendar, ShieldAlert, Target } from 'lucide-react';
import NewEntry from './NewEntry';
import EntryList from './EntryList';
import MoodChart from './MoodChart';
import InsightCard from './InsightCard';

export default function Dashboard() {
  const { profile, user, signOut } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
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

    if (positiveCount > recentEntries.length / 2) return "You've been feeling great lately";
    if (neutralCount > recentEntries.length / 2) return "You're maintaining balance";
    return "Remember, it's okay to not be okay";
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
      if (e.emotion) emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });

    const mostCommon = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : 'calm';
  };

  if (showNewEntry) {
    return <NewEntry onSave={handleNewEntry} onCancel={() => setShowNewEntry(false)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-slate-950">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[150px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-rose-600/5 rounded-full blur-[150px] mix-blend-screen animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">
                  MoodMuse
                </h1>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-500 text-sm font-medium hidden sm:block tracking-wide">
                  <span className="text-slate-300">{profile?.name}</span>
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium text-sm tracking-wide uppercase">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
          
          {/* Main Content Flow */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24 animate-slide-up">
            
            {/* Hero Section */}
            <div className="flex-1 flex flex-col justify-center relative group">
               <div className="relative z-10 mb-12">
                 <p className="text-indigo-400 font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                   <Calendar className="w-4 h-4" />
                   {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </p>
                 <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tighter leading-[1.1]">
                   {getMoodGreeting()}.
                 </h2>
               </div>
               
               <div className="relative z-10">
                 <button
                   onClick={() => setShowNewEntry(true)}
                   className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                 >
                   <PenLine className="w-5 h-5" />
                   New Entry
                 </button>
               </div>
            </div>

            {/* Chart Section */}
            <div className="flex-1 min-h-[300px]">
              {entries.length > 0 ? (
                <MoodChart entries={entries} />
              ) : (
                <div className="h-full flex items-center justify-center flex-col text-center opacity-50 border border-dashed border-white/10 rounded-3xl p-12">
                   <TrendingUp className="w-12 h-12 text-slate-500 mb-4" />
                   <p className="text-slate-400 font-medium">Chart will appear after your first entry.</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Free-Flowing Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-24 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <InsightCard
              icon={TrendingUp}
              title="Avg Stress"
              value={`${getAverageStressScore()}/100`}
              color="from-rose-500 to-orange-500"
              description="Last 7 entries"
            />
            
            <InsightCard
              icon={Heart}
              title="Top Emotion"
              value={getMostCommonEmotion()}
              color="from-fuchsia-500 to-pink-500"
              description="This week"
            />

            <InsightCard
              icon={Sparkles}
              title="Total Entries"
              value={entries.length.toString()}
              color="from-indigo-500 to-cyan-500"
              description="All time"
            />
            
            <InsightCard
              icon={Target}
              title="AI Confidence"
              value={entries[0]?.confidence !== undefined ? `${Math.round(entries[0].confidence * 100)}%` : 'N/A'}
              color="from-violet-500 to-purple-500"
              description="Latest entry"
            />

            <InsightCard
              icon={ShieldAlert}
              title="Risk Level"
              value={entries[0]?.risk_level ? entries[0].risk_level.toUpperCase() : 'N/A'}
              color="from-emerald-400 to-teal-500"
              description="Latest entry"
              className="col-span-2 md:col-span-1 lg:col-span-1"
            />
          </div>

          <hr className="border-white/5 mb-16" />

          {/* History Section */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase mb-16">Journal History</h3>
          </div>

          {loading ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-block w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center animate-fade-in py-12">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenLine className="w-10 h-10 text-indigo-400 opacity-50" />
              </div>
              <p className="text-slate-400 max-w-md mx-auto text-lg font-light">
                Your mind is a beautiful place. Start writing to unlock AI-powered insights.
              </p>
            </div>
          ) : (
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <EntryList entries={entries} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



