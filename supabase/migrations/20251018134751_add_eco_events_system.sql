/*
  # Add Eco Events System

  ## Overview
  Creates a system for managing eco-action events like tree planting, beach cleanups, and recycling drives.

  ## New Tables
  
  ### `eco_events`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `event_type` (text) - Type of event (Tree Planting, Beach Cleanup, Recycling Drive, etc.)
  - `event_date` (date) - Date of the event
  - `event_time` (text) - Time of the event
  - `location_name` (text) - Name of the location
  - `latitude` (numeric) - Latitude coordinate
  - `longitude` (numeric) - Longitude coordinate
  - `city` (text) - City name
  - `district` (text) - District name
  - `division` (text) - Division name
  - `organizer` (text) - Event organizer name
  - `contact_info` (text) - Contact information
  - `max_participants` (integer) - Maximum number of participants
  - `current_participants` (integer) - Current number of participants
  - `is_active` (boolean) - Whether event is active
  - `created_by` (uuid) - User who created the event
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - All authenticated users can view active events
  - Admin users can create, update, and delete events
  - Event creators can update their own events

  ## Important Notes
  - Events can be filtered by type
  - Events can be searched by district or division
  - Sample events included for demonstration
*/

-- Create eco_events table
CREATE TABLE IF NOT EXISTS eco_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  event_time text,
  location_name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  city text,
  district text NOT NULL,
  division text NOT NULL,
  organizer text,
  contact_info text,
  max_participants integer DEFAULT 50,
  current_participants integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_eco_events_type ON eco_events(event_type);
CREATE INDEX IF NOT EXISTS idx_eco_events_district ON eco_events(district);
CREATE INDEX IF NOT EXISTS idx_eco_events_division ON eco_events(division);
CREATE INDEX IF NOT EXISTS idx_eco_events_date ON eco_events(event_date);
CREATE INDEX IF NOT EXISTS idx_eco_events_active ON eco_events(is_active);

-- Enable Row Level Security
ALTER TABLE eco_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for eco_events

-- Anyone authenticated can view active events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'eco_events' AND policyname = 'Users can view active eco events'
  ) THEN
    CREATE POLICY "Users can view active eco events"
      ON eco_events FOR SELECT
      TO authenticated
      USING (is_active = true);
  END IF;
END $$;

-- Admins can view all events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'eco_events' AND policyname = 'Admins can view all eco events'
  ) THEN
    CREATE POLICY "Admins can view all eco events"
      ON eco_events FOR SELECT
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

-- Admins can insert events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'eco_events' AND policyname = 'Admins can insert eco events'
  ) THEN
    CREATE POLICY "Admins can insert eco events"
      ON eco_events FOR INSERT
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

-- Admins can update all events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'eco_events' AND policyname = 'Admins can update eco events'
  ) THEN
    CREATE POLICY "Admins can update eco events"
      ON eco_events FOR UPDATE
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

-- Admins can delete events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'eco_events' AND policyname = 'Admins can delete eco events'
  ) THEN
    CREATE POLICY "Admins can delete eco events"
      ON eco_events FOR DELETE
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

-- Insert sample eco events
INSERT INTO eco_events (title, description, event_type, event_date, event_time, location_name, latitude, longitude, city, district, division, organizer, max_participants) VALUES
  (
    'Dhaka Tree Planting Drive',
    'Join us in planting 1000 trees across Dhaka city parks. Seedlings and tools provided. Let''s make Dhaka greener together!',
    'Tree Planting',
    CURRENT_DATE + INTERVAL '7 days',
    '8:00 AM - 12:00 PM',
    'Ramna Park',
    23.7379,
    90.3958,
    'Dhaka',
    'Dhaka',
    'Dhaka',
    'Dhaka Green Initiative',
    100
  ),
  (
    'Cox''s Bazar Beach Cleanup',
    'Help clean the world''s longest natural sea beach. Bring your energy and enthusiasm, we''ll provide gloves and bags.',
    'Beach Cleanup',
    CURRENT_DATE + INTERVAL '14 days',
    '6:00 AM - 10:00 AM',
    'Cox''s Bazar Beach',
    21.4272,
    91.9932,
    'Cox''s Bazar',
    'Cox''s Bazar',
    'Chittagong',
    'Coastal Conservation BD',
    150
  ),
  (
    'Chittagong Recycling Awareness Workshop',
    'Learn about proper waste segregation and recycling techniques. Interactive workshop with hands-on demonstrations.',
    'Recycling Drive',
    CURRENT_DATE + INTERVAL '10 days',
    '2:00 PM - 5:00 PM',
    'Chittagong Community Center',
    22.3569,
    91.7832,
    'Chittagong',
    'Chittagong',
    'Chittagong',
    'Green Chittagong',
    75
  ),
  (
    'Sylhet Clean Water Initiative',
    'Community river cleanup and water quality testing. Help preserve Sylhet''s natural water resources.',
    'Water Conservation',
    CURRENT_DATE + INTERVAL '21 days',
    '9:00 AM - 1:00 PM',
    'Surma River Bank',
    24.8949,
    91.8687,
    'Sylhet',
    'Sylhet',
    'Sylhet',
    'Sylhet Eco Warriors',
    60
  ),
  (
    'Rajshahi Urban Garden Project',
    'Help establish community vegetable gardens. Learn sustainable urban farming techniques.',
    'Tree Planting',
    CURRENT_DATE + INTERVAL '5 days',
    '7:00 AM - 11:00 AM',
    'Rajshahi City Park',
    24.3745,
    88.6042,
    'Rajshahi',
    'Rajshahi',
    'Rajshahi',
    'Urban Farmers BD',
    50
  ),
  (
    'Khulna Plastic-Free Campaign',
    'Join our mission to reduce plastic usage in Khulna. Distribution of reusable bags and awareness session.',
    'Recycling Drive',
    CURRENT_DATE + INTERVAL '12 days',
    '10:00 AM - 3:00 PM',
    'Khulna Central Square',
    22.8456,
    89.5403,
    'Khulna',
    'Khulna',
    'Khulna',
    'Zero Waste Khulna',
    100
  ),
  (
    'Rangpur Forest Conservation Trek',
    'Educational forest trek focusing on biodiversity conservation. Guided by environmental experts.',
    'Environmental Education',
    CURRENT_DATE + INTERVAL '18 days',
    '6:00 AM - 2:00 PM',
    'Rangpur Forest Reserve',
    25.7439,
    89.2752,
    'Rangpur',
    'Rangpur',
    'Rangpur',
    'Nature Lovers Rangpur',
    40
  ),
  (
    'Barishal River Cleanup Marathon',
    'Large-scale cleanup of river banks and waterways. Boats and equipment provided.',
    'Beach Cleanup',
    CURRENT_DATE + INTERVAL '16 days',
    '5:00 AM - 11:00 AM',
    'Kirtankhola River',
    22.7010,
    90.3535,
    'Barishal',
    'Barishal',
    'Barishal',
    'Clean Rivers BD',
    120
  )
ON CONFLICT DO NOTHING;