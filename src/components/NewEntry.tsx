import { useState, useEffect, useRef } from 'react';
import { supabase, JournalEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Save, BrainCircuit, Flower2 } from 'lucide-react';
import { analyzeSentiment } from '../utils/sentiment';

type NewEntryProps = {
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
};

export default function NewEntry({ onSave, onCancel }: NewEntryProps) {
  const { user } = useAuth();
  const [entryText, setEntryText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus and resize text area
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = async () => {
    if (!entryText.trim()) {
      setError('Please write something');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const analysis = await analyzeSentiment(entryText);

      const { data, error: insertError } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            entry_text: entryText,
            sentiment: analysis.sentiment,
            emotion: analysis.emotion,
            stress_score: analysis.stressScore,
            confidence: analysis.confidence,
            risk_level: analysis.riskLevel,
            ai_summary: analysis.summary,
            ai_affirmation: analysis.affirmation,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      onSave(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save entry');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-3xl overflow-y-auto animate-fade-in flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-4xl glass-panel border border-amber-500/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] flex flex-col max-h-full relative">
        
        {/* Subtle Mandala/Background Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-amber-500/10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
              <Flower2 className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                Express Your Vichar <span className="text-amber-500/60 font-serif text-lg">विचार</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">Pour your thoughts freely. AI will analyze this safely.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={saving}
            className="p-3 bg-white/5 hover:bg-amber-500/10 rounded-2xl transition-all duration-300 disabled:opacity-50 group"
          >
            <X className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex-1 flex flex-col min-h-[40vh] relative z-10">
          <textarea
            ref={textareaRef}
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            disabled={saving}
            className="flex-1 w-full bg-transparent text-xl md:text-2xl font-light leading-relaxed text-slate-200 placeholder:text-slate-600 outline-none resize-none disabled:opacity-50"
            placeholder="Begin your inner journey here..."
          />
          
          <div className="mt-4 flex justify-between items-center text-sm font-medium">
            <span className="text-amber-500/50">{entryText.length} chars</span>
            {error && <span className="text-rose-500 animate-pulse">{error}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-amber-500/10 bg-slate-900/80 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-3 text-sm text-slate-400 max-w-sm">
            <BrainCircuit className="w-8 h-8 text-amber-500/40" />
            <p>Manthanam uses private AI to understand your emotional tapestry. Your reflections remain fully encrypted.</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving || !entryText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                Reflecting...
              </>
            ) : (
              <>
                Save Vichar
                <Save className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
