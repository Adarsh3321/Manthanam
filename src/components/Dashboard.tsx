import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, JournalEntry } from '../lib/supabase';
import { PenLine, LogOut, TrendingUp, Heart, Sparkles, Calendar, ShieldAlert, Target, Flower2 } from 'lucide-react';
import NewEntry from './NewEntry';
import EntryList from './EntryList';
import MoodChart from './MoodChart';
import InsightCard from './InsightCard';

export default function Dashboard() {
  const { profile, user, signOut } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

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
    if (entries.length === 0) return "Begin Your Journey";
    const recentEntries = entries.slice(0, 7);
    const positiveCount = recentEntries.filter(e => e.sentiment === 'positive').length;
    const neutralCount = recentEntries.filter(e => e.sentiment === 'neutral').length;

    if (positiveCount > recentEntries.length / 2) return "You are radiating peace";
    if (neutralCount > recentEntries.length / 2) return "A state of perfect balance";
    return "Even storms eventually pass";
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
      {/* Dynamic Ambient Background - Intense Saffron and Gold */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/20 rounded-full blur-[150px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[150px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[60%] bg-rose-600/15 rounded-full blur-[150px] mix-blend-screen animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-8 h-8">
                  {/* Glowing halo behind logo */}
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md transform scale-125 animate-pulse"></div>
                  {/* Custom SVG Lotus */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 text-amber-500 relative z-10">
                    <path d="M12 21C12 21 7 17 5 13C3.5 10 4 7.5 5.5 6C7 4.5 9.5 5 12 8" strokeLinecap="round" />
                    <path d="M12 21C12 21 17 17 19 13C20.5 10 20 7.5 18.5 6C17 4.5 14.5 5 12 8" strokeLinecap="round" />
                    <path d="M12 21C12 21 9 14 9 9C9 6.5 10.5 4.5 12 3C13.5 4.5 15 6.5 15 9C15 14 12 21 12 21Z" fill="url(#lotus-gradient-nav)" fillOpacity="0.15" />
                    <circle cx="12" cy="9" r="1" className="fill-amber-300 stroke-none" />
                    <defs>
                      <linearGradient id="lotus-gradient-nav" x1="12" y1="21" x2="12" y2="3" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-base font-display font-bold text-white tracking-[0.25em] uppercase leading-tight">
                    Manthanam
                  </h1>
                  <span className="text-[9px] font-serif text-amber-500/65 tracking-[0.35em] uppercase leading-tight mt-0.5">
                    मंथनम्
                  </span>
                </div>
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
                 <p className="text-amber-500 font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
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
                   className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(249,115,22,0.2)]"
                 >
                   <PenLine className="w-5 h-5" />
                   Write Vichar (विचार)
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
              color="from-amber-500 to-orange-500"
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
          <div className="mb-12 animate-slide-up flex items-center gap-4" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase mb-16">Journal History</h3>
            <span className="text-amber-500/30 font-serif text-2xl mb-16">स्मृति</span>
          </div>

          {loading ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-block w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center animate-fade-in py-12">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flower2 className="w-10 h-10 text-amber-500 opacity-50" strokeWidth={1.5} />
              </div>
              <p className="text-slate-400 max-w-md mx-auto text-lg font-light">
                Your mind is a beautiful temple. Start writing to unlock AI-powered insights.
              </p>
            </div>
          ) : (
            <div className="animate-slide-up space-y-12" style={{ animationDelay: '0.3s' }}>
              <EntryList entries={showAllEntries ? entries : entries.slice(0, 2)} />
              
              {entries.length > 2 && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => setShowAllEntries(!showAllEntries)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 text-slate-300 hover:text-amber-400 rounded-full font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300"
                  >
                    {showAllEntries ? 'Show Less' : `Show All Entries (${entries.length})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Editorial Footer */}
        <footer className="max-w-7xl mx-auto px-6 pt-16 pb-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase relative z-10">
          <p>© {new Date().getFullYear()} Manthanam.</p>
          <a
            href="https://github.com/adarsh3321"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-amber-500 transition-colors duration-300 group"
          >
            Crafted by Adarsh Kumar
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-amber-500 transition-all duration-300"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}



