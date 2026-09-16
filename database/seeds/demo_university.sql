-- =================================================================================
-- MENTE LIBRE — SEED DATA: Demo University
-- =================================================================================
-- Test data for development and staging environments.
-- DO NOT run in production.
-- =================================================================================

-- Demo University
INSERT INTO public.universities (id, name, slug, plan_type, max_students, contact_email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo University',
  'demo-university',
  'growth',
  500,
  'admin@demo-university.edu'
)
ON CONFLICT (id) DO NOTHING;

-- Test University 2
INSERT INTO public.universities (id, name, slug, plan_type, max_students)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Universidad de Prueba',
  'universidad-prueba',
  'starter',
  100
)
ON CONFLICT (id) DO NOTHING;
