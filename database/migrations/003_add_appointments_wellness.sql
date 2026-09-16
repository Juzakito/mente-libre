-- =================================================================================
-- MENTE LIBRE — MIGRATION 003: Appointments & Wellness
-- =================================================================================
-- Adds tables for expert appointments and wellness challenges.
-- =================================================================================

-- 3.1 Expert Profiles (extends users with psychologist-specific data)
CREATE TABLE IF NOT EXISTS public.expert_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  specialization VARCHAR(255),
  license_number VARCHAR(100),
  bio TEXT,
  availability JSONB DEFAULT '[]',  -- Array of available time slots
  is_available BOOLEAN DEFAULT true,
  rating FLOAT DEFAULT 0.0,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INT DEFAULT 50,
  status VARCHAR(50) DEFAULT 'scheduled',  -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Wellness Challenges
CREATE TABLE IF NOT EXISTS public.wellness_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  cycle INT DEFAULT 0,
  challenges JSONB DEFAULT '[]',
  completed_count INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_student ON public.appointments(student_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_expert ON public.appointments(expert_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_wellness_user ON public.wellness_challenges(user_id);

-- Triggers
CREATE TRIGGER set_updated_at_expert_profiles
  BEFORE UPDATE ON public.expert_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_challenges ENABLE ROW LEVEL SECURITY;

-- Expert profiles: visible to all authenticated users
CREATE POLICY "Anyone can view expert profiles"
  ON public.expert_profiles FOR SELECT USING (true);

-- Appointments
CREATE POLICY "Students can view their own appointments"
  ON public.appointments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Experts can view assigned appointments"
  ON public.appointments FOR SELECT USING (
    expert_id IN (SELECT id FROM public.expert_profiles WHERE user_id = auth.uid())
  );
CREATE POLICY "Students can create appointments"
  ON public.appointments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can cancel their appointments"
  ON public.appointments FOR UPDATE USING (auth.uid() = student_id);

-- Wellness
CREATE POLICY "Users can manage their own challenges"
  ON public.wellness_challenges FOR ALL USING (auth.uid() = user_id);
