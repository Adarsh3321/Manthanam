import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="text-center animate-pulse">
          <div className="inline-block w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6"></div>
          <p className="text-amber-500 font-medium tracking-wide">Initializing Manthanam...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

export default App;
