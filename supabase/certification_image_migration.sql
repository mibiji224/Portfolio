-- Adds optional image support to certification cards.
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- The IF NOT EXISTS clause makes the migration safe to run again.

alter table public.certifications
  add column if not exists image_url text;
