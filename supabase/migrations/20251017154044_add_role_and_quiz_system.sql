/*
  # Add Role Column and Create Quiz System

  ## Overview
  Adds admin role functionality and creates a comprehensive quiz system with questions, answers, user attempts, and admin management capabilities.

  ## Updates to Existing Tables
  
  ### `profiles`
  - Add `role` column (text) - Default 'user', can be 'admin'

  ## New Tables
  
  ### `quiz_questions`
  - `id` (uuid, primary key) - Unique identifier for each question
  - `question_text` (text) - The quiz question
  - `difficulty` (text) - Question difficulty: 'easy', 'medium', 'hard'
  - `category` (text) - Question category (e.g., 'Waste Management', 'Energy')
  - `points` (integer) - Points awarded for correct answer (default 10)
  - `explanation` (text) - Explanation shown after answering
  - `created_by` (uuid) - Admin user who created the question
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `is_active` (boolean) - Whether question is active in quiz pool (default true)

  ### `quiz_answers`
  - `id` (uuid, primary key) - Unique identifier for each answer
  - `question_id` (uuid, foreign key) - References quiz_questions
  - `answer_text` (text) - The answer option text
  - `is_correct` (boolean) - Whether this is the correct answer
  - `order_index` (integer) - Display order of the answer

  ### `quiz_attempts`
  - `id` (uuid, primary key) - Unique identifier for each attempt
  - `user_id` (uuid, foreign key) - References auth.users
  - `score` (integer) - Total score achieved
  - `total_questions` (integer) - Number of questions in the quiz
  - `correct_answers` (integer) - Number of correct answers
  - `time_taken` (integer) - Time taken in seconds
  - `completed_at` (timestamptz) - Completion timestamp

  ### `quiz_attempt_answers`
  - `id` (uuid, primary key) - Unique identifier
  - `attempt_id` (uuid, foreign key) - References quiz_attempts
  - `question_id` (uuid, foreign key) - References quiz_questions
  - `answer_id` (uuid, foreign key) - References quiz_answers
  - `is_correct` (boolean) - Whether the answer was correct
  - `answered_at` (timestamptz) - When the answer was submitted

  ## Security
  - Enable RLS on all new tables
  - Admin users (with role 'admin' in profiles) can manage questions
  - All authenticated users can view active questions
  - Users can only view their own quiz attempts
  - Complete audit trail of user attempts and answers

  ## Important Notes
  - Questions support multiple categories for environmental topics
  - Difficulty levels help with adaptive quizzing
  - Complete audit trail of user attempts and answers
  - Sample questions included covering various environmental topics
*/

-- Add role column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  explanation text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create quiz_answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL DEFAULT 0,
  time_taken integer,
  completed_at timestamptz DEFAULT now()
);

-- Create quiz_attempt_answers table
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES quiz_questions(id),
  answer_id uuid NOT NULL REFERENCES quiz_answers(id),
  is_correct boolean NOT NULL,
  answered_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_answers_attempt ON quiz_attempt_answers(attempt_id);

-- Enable Row Level Security
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempt_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_questions

-- Admins can view all questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' AND policyname = 'Admins can view all quiz questions'
  ) THEN
    CREATE POLICY "Admins can view all quiz questions"
      ON quiz_questions FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Regular users can view active questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' AND policyname = 'Users can view active quiz questions'
  ) THEN
    CREATE POLICY "Users can view active quiz questions"
      ON quiz_questions FOR SELECT
      TO authenticated
      USING (is_active = true);
  END IF;
END $$;

-- Admins can insert questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' AND policyname = 'Admins can insert quiz questions'
  ) THEN
    CREATE POLICY "Admins can insert quiz questions"
      ON quiz_questions FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admins can update questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' AND policyname = 'Admins can update quiz questions'
  ) THEN
    CREATE POLICY "Admins can update quiz questions"
      ON quiz_questions FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admins can delete questions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_questions' AND policyname = 'Admins can delete quiz questions'
  ) THEN
    CREATE POLICY "Admins can delete quiz questions"
      ON quiz_questions FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for quiz_answers

-- Users can view answers for questions they can see
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_answers' AND policyname = 'Users can view quiz answers'
  ) THEN
    CREATE POLICY "Users can view quiz answers"
      ON quiz_answers FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM quiz_questions
          WHERE quiz_questions.id = quiz_answers.question_id
          AND (
            quiz_questions.is_active = true
            OR EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
            )
          )
        )
      );
  END IF;
END $$;

-- Admins can insert answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_answers' AND policyname = 'Admins can insert quiz answers'
  ) THEN
    CREATE POLICY "Admins can insert quiz answers"
      ON quiz_answers FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admins can update answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_answers' AND policyname = 'Admins can update quiz answers'
  ) THEN
    CREATE POLICY "Admins can update quiz answers"
      ON quiz_answers FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Admins can delete answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_answers' AND policyname = 'Admins can delete quiz answers'
  ) THEN
    CREATE POLICY "Admins can delete quiz answers"
      ON quiz_answers FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for quiz_attempts

-- Users can view their own attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempts' AND policyname = 'Users can view own quiz attempts'
  ) THEN
    CREATE POLICY "Users can view own quiz attempts"
      ON quiz_attempts FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Users can insert their own attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempts' AND policyname = 'Users can insert own quiz attempts'
  ) THEN
    CREATE POLICY "Users can insert own quiz attempts"
      ON quiz_attempts FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Admins can view all attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempts' AND policyname = 'Admins can view all quiz attempts'
  ) THEN
    CREATE POLICY "Admins can view all quiz attempts"
      ON quiz_attempts FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- RLS Policies for quiz_attempt_answers

-- Users can view their own attempt answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempt_answers' AND policyname = 'Users can view own attempt answers'
  ) THEN
    CREATE POLICY "Users can view own attempt answers"
      ON quiz_attempt_answers FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM quiz_attempts
          WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
          AND quiz_attempts.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Users can insert their own attempt answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempt_answers' AND policyname = 'Users can insert own attempt answers'
  ) THEN
    CREATE POLICY "Users can insert own attempt answers"
      ON quiz_attempt_answers FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM quiz_attempts
          WHERE quiz_attempts.id = quiz_attempt_answers.attempt_id
          AND quiz_attempts.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Admins can view all attempt answers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quiz_attempt_answers' AND policyname = 'Admins can view all attempt answers'
  ) THEN
    CREATE POLICY "Admins can view all attempt answers"
      ON quiz_attempt_answers FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Insert sample quiz questions
INSERT INTO quiz_questions (question_text, difficulty, category, points, explanation, is_active) VALUES
  ('What percentage of plastic waste in Bangladesh is recycled?', 'medium', 'Waste Management', 10, 'Only about 30% of plastic waste is recycled in Bangladesh, highlighting the need for better waste management systems.', true),
  ('Which renewable energy source is most suitable for rural Bangladesh?', 'easy', 'Energy', 10, 'Solar energy is most suitable for rural Bangladesh due to abundant sunlight and decreasing costs of solar panels.', true),
  ('How many liters of water does an average person in Dhaka use per day?', 'hard', 'Water Conservation', 15, 'The average person in Dhaka uses approximately 120-150 liters of water per day, much of which could be conserved.', true),
  ('What is the main cause of air pollution in Dhaka?', 'easy', 'Air Quality', 10, 'Vehicle emissions and brick kilns are the main causes of air pollution in Dhaka, contributing to poor air quality.', true),
  ('How much carbon dioxide does an average tree absorb per year?', 'medium', 'Climate Change', 10, 'An average tree absorbs about 21 kg of CO2 per year, making tree planting an effective climate action.', true),
  ('What is the primary greenhouse gas responsible for climate change?', 'easy', 'Climate Change', 10, 'Carbon dioxide (CO2) is the primary greenhouse gas responsible for climate change, mainly from burning fossil fuels.', true),
  ('How long does it take for a plastic bottle to decompose in nature?', 'medium', 'Waste Management', 10, 'A plastic bottle takes approximately 450 years to decompose, making plastic waste a major environmental concern.', true),
  ('What percentage of Bangladesh''s population is at risk from climate change impacts?', 'hard', 'Climate Change', 15, 'Approximately 70% of Bangladesh''s population is at risk from climate change impacts, particularly from flooding and sea level rise.', true)
ON CONFLICT DO NOTHING;

-- Insert answers for question 1 (Plastic recycling)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '10%', false, 1 FROM quiz_questions WHERE question_text = 'What percentage of plastic waste in Bangladesh is recycled?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '30%', true, 2 FROM quiz_questions WHERE question_text = 'What percentage of plastic waste in Bangladesh is recycled?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '50%', false, 3 FROM quiz_questions WHERE question_text = 'What percentage of plastic waste in Bangladesh is recycled?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '70%', false, 4 FROM quiz_questions WHERE question_text = 'What percentage of plastic waste in Bangladesh is recycled?' LIMIT 1;

-- Insert answers for question 2 (Renewable energy)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Wind Energy', false, 1 FROM quiz_questions WHERE question_text = 'Which renewable energy source is most suitable for rural Bangladesh?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Solar Energy', true, 2 FROM quiz_questions WHERE question_text = 'Which renewable energy source is most suitable for rural Bangladesh?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Hydroelectric Power', false, 3 FROM quiz_questions WHERE question_text = 'Which renewable energy source is most suitable for rural Bangladesh?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Geothermal Energy', false, 4 FROM quiz_questions WHERE question_text = 'Which renewable energy source is most suitable for rural Bangladesh?' LIMIT 1;

-- Insert answers for question 3 (Water usage)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '50-70 liters', false, 1 FROM quiz_questions WHERE question_text = 'How many liters of water does an average person in Dhaka use per day?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '80-100 liters', false, 2 FROM quiz_questions WHERE question_text = 'How many liters of water does an average person in Dhaka use per day?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '120-150 liters', true, 3 FROM quiz_questions WHERE question_text = 'How many liters of water does an average person in Dhaka use per day?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '200-250 liters', false, 4 FROM quiz_questions WHERE question_text = 'How many liters of water does an average person in Dhaka use per day?' LIMIT 1;

-- Insert answers for question 4 (Air pollution)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Industrial factories', false, 1 FROM quiz_questions WHERE question_text = 'What is the main cause of air pollution in Dhaka?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Vehicle emissions and brick kilns', true, 2 FROM quiz_questions WHERE question_text = 'What is the main cause of air pollution in Dhaka?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Household waste burning', false, 3 FROM quiz_questions WHERE question_text = 'What is the main cause of air pollution in Dhaka?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Power plants', false, 4 FROM quiz_questions WHERE question_text = 'What is the main cause of air pollution in Dhaka?' LIMIT 1;

-- Insert answers for question 5 (Carbon absorption)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '10 kg per year', false, 1 FROM quiz_questions WHERE question_text = 'How much carbon dioxide does an average tree absorb per year?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '21 kg per year', true, 2 FROM quiz_questions WHERE question_text = 'How much carbon dioxide does an average tree absorb per year?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '50 kg per year', false, 3 FROM quiz_questions WHERE question_text = 'How much carbon dioxide does an average tree absorb per year?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '100 kg per year', false, 4 FROM quiz_questions WHERE question_text = 'How much carbon dioxide does an average tree absorb per year?' LIMIT 1;

-- Insert answers for question 6 (Primary greenhouse gas)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Oxygen', false, 1 FROM quiz_questions WHERE question_text = 'What is the primary greenhouse gas responsible for climate change?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Carbon Dioxide', true, 2 FROM quiz_questions WHERE question_text = 'What is the primary greenhouse gas responsible for climate change?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Nitrogen', false, 3 FROM quiz_questions WHERE question_text = 'What is the primary greenhouse gas responsible for climate change?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, 'Hydrogen', false, 4 FROM quiz_questions WHERE question_text = 'What is the primary greenhouse gas responsible for climate change?' LIMIT 1;

-- Insert answers for question 7 (Plastic decomposition)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '50 years', false, 1 FROM quiz_questions WHERE question_text = 'How long does it take for a plastic bottle to decompose in nature?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '100 years', false, 2 FROM quiz_questions WHERE question_text = 'How long does it take for a plastic bottle to decompose in nature?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '450 years', true, 3 FROM quiz_questions WHERE question_text = 'How long does it take for a plastic bottle to decompose in nature?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '1000 years', false, 4 FROM quiz_questions WHERE question_text = 'How long does it take for a plastic bottle to decompose in nature?' LIMIT 1;

-- Insert answers for question 8 (Climate risk in Bangladesh)
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '30%', false, 1 FROM quiz_questions WHERE question_text = 'What percentage of Bangladesh''s population is at risk from climate change impacts?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '50%', false, 2 FROM quiz_questions WHERE question_text = 'What percentage of Bangladesh''s population is at risk from climate change impacts?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '70%', true, 3 FROM quiz_questions WHERE question_text = 'What percentage of Bangladesh''s population is at risk from climate change impacts?' LIMIT 1;
INSERT INTO quiz_answers (question_id, answer_text, is_correct, order_index)
SELECT id, '90%', false, 4 FROM quiz_questions WHERE question_text = 'What percentage of Bangladesh''s population is at risk from climate change impacts?' LIMIT 1;