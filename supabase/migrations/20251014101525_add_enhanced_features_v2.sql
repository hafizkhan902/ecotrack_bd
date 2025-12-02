/*
  # Enhanced Features Schema

  ## Updates to Existing Tables
  
  1. `profiles` - Add missing columns
    - `avatar_url` (text)
    - `bio` (text)

  ## New Tables
  
  1. `badges` - Available badges/achievements
    - `id` (uuid, primary key)
    - `name` (text)
    - `description` (text)
    - `icon` (text)
    - `requirement` (text)
    - `created_at` (timestamptz)
  
  2. `user_badges` - Badges earned by users
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `badge_id` (uuid, references badges)
    - `earned_at` (timestamptz)
  
  3. `post_comments` - Comments on community posts
    - `id` (uuid, primary key)
    - `post_id` (uuid, references community_posts)
    - `user_id` (uuid, references auth.users)
    - `content` (text)
    - `created_at` (timestamptz)
  
  4. `user_goals` - Personal carbon reduction goals
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `target_reduction_percentage` (integer)
    - `start_date` (date)
    - `end_date` (date)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all new tables
  - Add policies for authenticated users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text DEFAULT '';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'badges' AND policyname = 'Anyone can view badges'
  ) THEN
    CREATE POLICY "Anyone can view badges"
      ON badges FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_badges' AND policyname = 'Users can view all user badges'
  ) THEN
    CREATE POLICY "Users can view all user badges"
      ON user_badges FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_badges' AND policyname = 'Users can insert own badges'
  ) THEN
    CREATE POLICY "Users can insert own badges"
      ON user_badges FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can view all comments'
  ) THEN
    CREATE POLICY "Users can view all comments"
      ON post_comments FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can insert own comments'
  ) THEN
    CREATE POLICY "Users can insert own comments"
      ON post_comments FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can delete own comments'
  ) THEN
    CREATE POLICY "Users can delete own comments"
      ON post_comments FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  target_reduction_percentage integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_goals' AND policyname = 'Users can view own goals'
  ) THEN
    CREATE POLICY "Users can view own goals"
      ON user_goals FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_goals' AND policyname = 'Users can insert own goals'
  ) THEN
    CREATE POLICY "Users can insert own goals"
      ON user_goals FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_goals' AND policyname = 'Users can update own goals'
  ) THEN
    CREATE POLICY "Users can update own goals"
      ON user_goals FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_goals' AND policyname = 'Users can delete own goals'
  ) THEN
    CREATE POLICY "Users can delete own goals"
      ON user_goals FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

INSERT INTO badges (name, description, icon, requirement) VALUES
  ('First Steps', 'Complete your first quiz', 'Award', 'quiz_count_1'),
  ('Quiz Master', 'Complete 10 quizzes', 'Trophy', 'quiz_count_10'),
  ('Carbon Aware', 'Calculate your carbon footprint', 'Leaf', 'carbon_calc_1'),
  ('Eco Warrior', 'Complete 5 daily challenges', 'Target', 'challenge_count_5'),
  ('Week Streak', 'Complete challenges for 7 days in a row', 'Calendar', 'challenge_streak_7'),
  ('Community Member', 'Make your first community post', 'Users', 'post_count_1'),
  ('Carbon Reducer', 'Reduce your footprint by 10%', 'TrendingDown', 'carbon_reduction_10')
ON CONFLICT DO NOTHING;
