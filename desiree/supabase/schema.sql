-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this entire file in:
-- Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- UUID support
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table public.projects (
  id              uuid        primary key default uuid_generate_v4(),
  title           text        not null,
  subtitle        text,
  description     text,
  tech_stack      text[]      default '{}',
  tools           text[]      default '{}',
  -- images stored as [{src: "cdn-url", caption: "text"}]
  images          jsonb       default '[]',
  -- development | art | graphics
  category        text        not null default 'development',
  subcategory     text,
  demo_url        text,
  github_url      text,
  is_coming_soon  boolean     default false,
  display_order   integer     default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.experience (
  id              uuid        primary key default uuid_generate_v4(),
  title           text        not null,
  company         text        not null,
  date            text        not null,
  type            text,       -- "Present" | "Part Time" | null
  description     text,
  is_current      boolean     default false,
  display_order   integer     default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.education (
  id              uuid        primary key default uuid_generate_v4(),
  degree          text        not null,
  institution     text        not null,
  period          text        not null,
  description     text,
  display_order   integer     default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.skills (
  id              uuid        primary key default uuid_generate_v4(),
  name            text        not null,
  -- core | frontend | backend | database | tools | creative | office
  category        text        not null,
  display_order   integer     default 0,
  created_at      timestamptz default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function handle_updated_at();

create trigger experience_updated_at
  before update on public.experience
  for each row execute function handle_updated_at();

create trigger education_updated_at
  before update on public.education
  for each row execute function handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.projects    enable row level security;
alter table public.experience  enable row level security;
alter table public.education   enable row level security;
alter table public.skills      enable row level security;

-- PUBLIC: read-only (anonymous visitors + authenticated)
create policy "public_read_projects"
  on public.projects for select
  to anon, authenticated using (true);

create policy "public_read_experience"
  on public.experience for select
  to anon, authenticated using (true);

create policy "public_read_education"
  on public.education for select
  to anon, authenticated using (true);

create policy "public_read_skills"
  on public.skills for select
  to anon, authenticated using (true);

-- ADMIN: full write access (you are the only authenticated user)
create policy "admin_write_projects"
  on public.projects for all
  to authenticated using (true) with check (true);

create policy "admin_write_experience"
  on public.experience for all
  to authenticated using (true) with check (true);

create policy "admin_write_education"
  on public.education for all
  to authenticated using (true) with check (true);

create policy "admin_write_skills"
  on public.skills for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKET POLICIES
-- ============================================================
-- BEFORE running these:
--   1. Go to Supabase Dashboard → Storage
--   2. Click "New bucket"
--   3. Name: portfolio-assets
--   4. Toggle "Public bucket" ON
--   5. Click Save — then run the policies below

create policy "public_read_storage"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-assets');

create policy "admin_upload_storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets');

create policy "admin_update_storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-assets');

create policy "admin_delete_storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-assets');
