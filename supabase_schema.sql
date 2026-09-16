-- =================================================================================
-- MENTE LIBRE - SUPABASE SCHEMA INIT SCRIPT
-- =================================================================================

-- 1. EXTENSIONES
-- UUID para llaves primarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================================
-- 2. TABLAS PRINCIPALES
-- =================================================================================

-- 2.1 Universidades (B2B Tenants)
CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'starter',
  max_students INT DEFAULT 500,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Usuarios (Extendiendo auth.users de Supabase)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  role VARCHAR(50) DEFAULT 'student', -- 'student', 'admin', 'psychologist'
  full_name VARCHAR(255),
  avatar_url TEXT,
  student_id VARCHAR(100), -- Matrícula
  career VARCHAR(150),
  faculty VARCHAR(150),
  semester INT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Estados de Ánimo (Mood Tracking)
CREATE TABLE public.moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  mood_score INT NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
  emotion_tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Sesiones de Chat IA
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  risk_level FLOAT DEFAULT 0.0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Historial de Mensajes IA
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL, -- 'user', 'ai'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Intervenciones (Protocolo I-CARE)
CREATE TABLE public.interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  trigger_source VARCHAR(100),
  risk_category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, resolved
  assigned_to UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Comunidad (Feed & Posts)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES public.universities(id),
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  hug_count INT DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================================
-- 3. TRIGGERS Y FUNCIONES
-- =================================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas
CREATE TRIGGER set_updated_at_universities BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_chat_sessions BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Función para sincronizar registro de Auth a la tabla Usuarios automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, full_name, avatar_url)
  VALUES (
    NEW.id,
    'student', -- Por defecto
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Nota: Si trigger ya existe, bórralo antes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================================
-- 4. ÍNDICES DE RENDIMIENTO
-- =================================================================================
CREATE INDEX idx_moods_university_date ON public.moods(university_id, created_at);
CREATE INDEX idx_posts_university_date ON public.posts(university_id, created_at DESC);
CREATE INDEX idx_interventions_status ON public.interventions(status);

-- =================================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =================================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5.1 Políticas para Estudiantes (Student Role)
-- Pueden ver su propia información
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Moods
CREATE POLICY "Users can insert their own moods" ON public.moods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own moods" ON public.moods FOR SELECT USING (auth.uid() = user_id);

-- Posts (Pueden ver todos los posts de su universidad, crear y dar abrazos)
CREATE POLICY "Users can view posts from their university" ON public.posts FOR SELECT USING (
  university_id IN (SELECT university_id FROM public.users WHERE id = auth.uid())
);
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update post hugs" ON public.posts FOR UPDATE USING (true); -- Simplificado para MVPs

-- Chat
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages FOR SELECT USING (
  session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (
  session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
);

-- =================================================================================
-- 6. DATOS DE PRUEBA (SEED DATA)
-- =================================================================================

-- Insertar Universidad de Prueba "Demo University"
INSERT INTO public.universities (id, name, slug, plan_type)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo University', 'demo-university', 'growth')
ON CONFLICT DO NOTHING;
