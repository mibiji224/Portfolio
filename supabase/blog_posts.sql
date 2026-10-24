-- Run once in the Supabase SQL editor to add the blog.
--
-- Creates public.blog_posts (readable by everyone, writable only by the admin
-- address, same as the other tables) and adds the first post. Header photos
-- upload to the existing "portfolio-assets" bucket from the admin dashboard.

create table if not exists public.blog_posts (
  id            uuid        primary key default uuid_generate_v4(),
  title         text        not null,
  excerpt       text,
  body          text        not null,   -- paragraphs separated by a blank line
  cover_image   text,                   -- public URL of the header photo
  published_at  date        default current_date,
  is_published  boolean     default true,
  display_order integer     default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function handle_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "public_read_blog_posts" on public.blog_posts;
create policy "public_read_blog_posts"
  on public.blog_posts for select
  to anon, authenticated using (is_published or (auth.jwt() ->> 'email') = 'desireesoronio@gmail.com');

drop policy if exists "admin_write_blog_posts" on public.blog_posts;
create policy "admin_write_blog_posts"
  on public.blog_posts for all to authenticated
  using ((auth.jwt() ->> 'email') = 'desireesoronio@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'desireesoronio@gmail.com');

insert into public.blog_posts (title, excerpt, body, published_at)
select 'Live for Yourself, Too', 'Give generously to the work you believe in, but don’t forget to save a piece for yourself.', $post$When you start working on something new, it’s easy to give it everything. A new role, a new team, a new mission: there’s a kind of energy that comes with being part of something that’s just beginning. You want to prove yourself. You want it to succeed. And because you believe in it, you keep giving more.

That’s what I did. And somewhere along the way, I realized something I wish I had understood sooner.

The dedication and effort you put into your work should still be proportional to who you are and what you need as a person. Not just what the work asks of you, but what your life asks of you too.

When we pour ourselves into a cause, we often forget to save a piece for ourselves. We skip the rest, push past the signs of exhaustion, and tell ourselves it’s temporary. We think that giving more is the same as doing better. But it isn’t.

Forgetting to give a piece to yourself slowly breaks your foundation. And when your foundation cracks, everything you’re building on top of it starts to shake. Instead of successfully bringing a new idea to life, you end up exhausting yourself. Sometimes the damage goes further than you ever intended: to your health, your relationships, and the very passion that made you say yes in the first place.

I learned that you can’t sustain someone else’s vision if you’re running on empty. Burnout doesn’t make you more committed. It just makes you less of yourself.

So here’s what I want to remind you, and myself:

It’s important to keep yourself alive, especially when you’re working hard to keep someone else’s dream alive. Your effort matters. Your commitment matters. But so do you.

Rest without guilt. Set boundaries without apologizing. Speak up when something doesn’t feel right. Make room for the things that remind you who you are outside of your work.

Because the people and causes worth giving to will be better served by someone who is whole, not someone who is slowly disappearing.

Give generously, but live for yourself as well.$post$, '2026-10-23'
where not exists (select 1 from public.blog_posts where title = 'Live for Yourself, Too');
