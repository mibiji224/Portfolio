-- Adds a unique, readable URL slug to every blog post.
-- Run in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to run again. Existing posts are backfilled from their title; duplicate
-- titles receive a numeric suffix. New slugs are made unique automatically.

alter table public.blog_posts add column if not exists slug text;

do $$
declare
  post record;
  base_slug text;
  candidate text;
  suffix integer;
begin
  for post in
    select id, title from public.blog_posts
    where slug is null or btrim(slug) = ''
    order by id
  loop
    base_slug := trim(both '-' from regexp_replace(lower(post.title), '[^a-z0-9]+', '-', 'g'));
    if base_slug = '' then base_slug := 'post'; end if;
    candidate := base_slug;
    suffix := 2;
    while exists (
      select 1 from public.blog_posts where slug = candidate and id <> post.id
    ) loop
      candidate := base_slug || '-' || suffix;
      suffix := suffix + 1;
    end loop;
    update public.blog_posts set slug = candidate where id = post.id;
  end loop;
end $$;

alter table public.blog_posts alter column slug set not null;
create unique index if not exists blog_posts_slug_key on public.blog_posts (slug);

create or replace function public.set_blog_post_slug()
returns trigger language plpgsql as $$
declare
  base_slug text;
  candidate text;
  suffix integer := 2;
begin
  base_slug := trim(both '-' from regexp_replace(lower(coalesce(nullif(btrim(new.slug), ''), new.title)), '[^a-z0-9]+', '-', 'g'));
  if base_slug = '' then base_slug := 'post'; end if;
  candidate := base_slug;
  while exists (
    select 1 from public.blog_posts where slug = candidate and id is distinct from new.id
  ) loop
    candidate := base_slug || '-' || suffix;
    suffix := suffix + 1;
  end loop;
  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists blog_posts_set_slug on public.blog_posts;
create trigger blog_posts_set_slug
  before insert or update of slug on public.blog_posts
  for each row execute function public.set_blog_post_slug();
