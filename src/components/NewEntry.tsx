import { useState } from 'react';
import { supabase, JournalEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Save, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">New Entry</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Express yourself freely
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="entry" className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling today?
              </label>
              <textarea
                id="entry"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                rows={12}
                placeholder="Write about your day, your thoughts, or how you're feeling... There's no right or wrong way to express yourself here."
                autoFocus
              />
              <div className="mt-2 text-sm text-gray-500">
                {entryText.length} characters
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !entryText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing your emotions...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                disabled={saving}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Your privacy matters:</strong> Your entries are private and secure. We use AI to analyze sentiment and provide insights, but your data stays with you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
