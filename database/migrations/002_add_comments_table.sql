-- =================================================================================
-- MENTE LIBRE — MIGRATION 002: Comments Table
-- =================================================================================
-- Adds the comments table for threaded post discussions.
-- This table is referenced in the application code but was missing from the schema.
-- =================================================================================

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  author VARCHAR(255),
  avatar VARCHAR(50),
  text TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,  -- For nested replies
  hugs INT DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author);

-- RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on visible posts"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can insert comments"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);
