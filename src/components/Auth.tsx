import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Flower2 } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans flex items-center justify-center p-4">
      {/* Dynamic Ambient Background - Saffron and Gold */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[0%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[150px] mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[150px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 relative mb-8 group">
            {/* Super premium large multi-layered pulsing halos */}
            <div className="absolute inset-0 bg-orange-500/25 rounded-full blur-2xl transform scale-125 group-hover:bg-orange-500/35 transition-colors duration-700 pointer-events-none animate-pulse"></div>
            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-lg pointer-events-none"></div>
            
            {/* Custom SVG Lotus - Large Center Version */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" className="w-16 h-16 text-amber-400 relative z-10 transition-transform duration-700 group-hover:rotate-12">
              <path d="M12 21C12 21 7 17 5 13C3.5 10 4 7.5 5.5 6C7 4.5 9.5 5 12 8" strokeLinecap="round" />
              <path d="M12 21C12 21 17 17 19 13C20.5 10 20 7.5 18.5 6C17 4.5 14.5 5 12 8" strokeLinecap="round" />
              <path d="M12 21C12 21 9 14 9 9C9 6.5 10.5 4.5 12 3C13.5 4.5 15 6.5 15 9C15 14 12 21 12 21Z" fill="url(#lotus-gradient-auth)" fillOpacity="0.2" />
              <circle cx="12" cy="9" r="1.5" className="fill-amber-300 stroke-none" />
              <defs>
                <linearGradient id="lotus-gradient-auth" x1="12" y1="21" x2="12" y2="3" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-5xl font-display font-bold text-white tracking-[0.1em] uppercase mb-1">
            Manthanam
          </h1>
          <h2 className="text-xl font-serif text-amber-500/70 tracking-[0.4em] uppercase mb-6 leading-none mt-2">
            मंथनम्
          </h2>
          <p className="text-slate-400 flex items-center justify-center gap-3 font-medium text-sm tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
            Your Sanctuary of Inner Reflection
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></span>
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.05)] border border-amber-500/10">
          <div className="flex bg-slate-900/50 rounded-xl p-1 mb-8 border border-amber-500/10">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-amber-500/10 text-amber-400 shadow-md border border-amber-500/20'
                  : 'text-slate-400 hover:text-amber-200 hover:bg-amber-500/5'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                isSignUp
                  ? 'bg-amber-500/10 text-amber-400 shadow-md border border-amber-500/20'
                  : 'text-slate-400 hover:text-amber-200 hover:bg-amber-500/5'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                  Name <span className="text-amber-500/50 ml-1 text-xs font-normal">(नाम)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                  placeholder="Your preferred name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email <span className="text-amber-500/50 ml-1 text-xs font-normal">(ईमेल)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                Password <span className="text-amber-500/50 ml-1 text-xs font-normal">(गुप्तशब्द)</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  Please wait...
                </div>
              ) : isSignUp ? (
                'Begin Journey'
              ) : (
                'Enter Sanctuary'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Your thoughts matter. Your privacy is guaranteed.
        </p>

        {/* Editorial Footer */}
        <footer className="mt-12 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase border-t border-white/5 pt-6 w-full">
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
