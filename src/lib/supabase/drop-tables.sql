-- Drop all existing tables in reverse order (to handle foreign keys)
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.backers CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Drop extension if you want a completely fresh start
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Now you can run the full schema.sql file
