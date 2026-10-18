-- Tabel cv_profile untuk menyimpan data Curriculum Vitae (ATS-Friendly)
-- Jalankan di Supabase SQL Editor jika ingin menyimpan kustomisasi di Supabase

create table if not exists cv_profile (
    id text primary key default 'default',
    data jsonb not null,
    updated_at timestamptz not null default now()
);

alter table cv_profile enable row level security;

-- Siapa pun (anon & authenticated) dapat melihat CV
create policy "public can read cv_profile"
    on cv_profile for select
    to anon, authenticated
    using (true);

-- Hanya user yang login (authenticated admin) yang bisa menambah / memperbarui CV
create policy "authenticated can insert cv_profile"
    on cv_profile for insert
    to authenticated
    with check (true);

create policy "authenticated can update cv_profile"
    on cv_profile for update
    to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete cv_profile"
    on cv_profile for delete
    to authenticated
    using (true);
