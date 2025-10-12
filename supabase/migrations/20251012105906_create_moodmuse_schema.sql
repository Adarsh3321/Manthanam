/*
  # MoodMuse Database Schema
  
  Creates the complete database structure for the emotion-aware journaling app.
  
  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `theme_preference` (text, default 'light')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `entry_text` (text)
      - `sentiment` (text) - positive/neutral/negative
      - `emotion` (text) - happy/sad/anxious/angry/calm/excited/fear
      - `stress_score` (integer, 0-100)
      - `ai_summary` (text, optional)
      - `ai_affirmation` (text, optional)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own profile data
    - Users can only read/write their own journal entries
    - All policies check authentication and ownership
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  theme_preference text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_text text NOT NULL,
  sentiment text,
  emotion text,
  stress_score integer CHECK (stress_score >= 0 AND stress_score <= 100),
  ai_summary text,
  ai_affirmation text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Journal entries policies
CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());