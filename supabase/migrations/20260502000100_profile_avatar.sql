-- Add avatar and display name to profiles
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists display_name text;

-- Avatars storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies for avatars
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_auth_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and auth.role() = 'authenticated'
  );

create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
