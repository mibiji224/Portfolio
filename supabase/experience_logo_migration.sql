-- Adds an optional company logo to each experience role.
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- The IF NOT EXISTS clause makes the migration safe to run again.
--
-- Logos are uploaded from the dashboard (Experience → Company logo) to the existing
-- "portfolio-assets" storage bucket, and this column holds the image's URL.

alter table public.experience
  add column if not exists logo text;
