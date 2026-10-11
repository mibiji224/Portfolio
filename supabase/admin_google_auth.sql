-- Run once in the Supabase SQL editor when switching admin login to Google.
--
-- Google sign-in lets ANY Google account create an "authenticated" session,
-- and the original policies allowed every authenticated user to write. These
-- replace them so only the admin address can. Change the email below if it
-- is not the account you sign in with.

do $$
declare t text;
begin
  foreach t in array array['projects', 'experience', 'education', 'skills'] loop
    execute format('drop policy if exists "admin_write_%s" on public.%I', t, t);
    execute format(
      'create policy "admin_write_%s" on public.%I for all to authenticated
         using ((auth.jwt() ->> ''email'') = ''desireesoronio@gmail.com'')
         with check ((auth.jwt() ->> ''email'') = ''desireesoronio@gmail.com'')', t, t);
  end loop;
end $$;

drop policy if exists "admin_upload_storage" on storage.objects;
drop policy if exists "admin_update_storage" on storage.objects;
drop policy if exists "admin_delete_storage" on storage.objects;

create policy "admin_upload_storage" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'desireesoronio@gmail.com');
create policy "admin_update_storage" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'desireesoronio@gmail.com');
create policy "admin_delete_storage" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'desireesoronio@gmail.com');
