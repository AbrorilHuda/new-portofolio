-- Tabel projects untuk section "My Projects"
-- Jalankan di Supabase SQL Editor

create table if not exists projects (
    id serial primary key,
    title text not null,
    description text not null default '',
    image text not null default '',
    technologies text[] not null default '{}',
    link text not null default '',
    created_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "public can read projects"
    on projects for select
    to anon, authenticated
    using (true);

create policy "authenticated can insert projects"
    on projects for insert
    to authenticated
    with check (true);

create policy "authenticated can update projects"
    on projects for update
    to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete projects"
    on projects for delete
    to authenticated
    using (true);

-- Seed data awal (sama seperti hardcode lama)
insert into projects (title, description, image, technologies, link) values
('Demtimcod Docs', 'to make it easier for readers to read the documentation', 'https://32ily8ib82.ucarecd.net/80bddb32-e19f-453c-a1a9-a0c30a1f52ec/demtimcod.png', '{React,docusaurus,tailwindcss}', 'https://demtimcod.github.io/', '📚', 1),
('Website Digital Solution', 'Modern website digital solution codverse for businesses', 'https://32ily8ib82.ucarecd.net/40e78aef-543f-4bc6-8b46-402cdaefe117/codverse.png', '{Next.js,Tailwind}', 'https://codverse.site', '🌐', 2),
('Mobile Apps', 'Cross-platform mobile application built with React Native', 'https://32ily8ib82.ucarecd.net/edf30a1d-c76b-46b2-8582-45edee790a5b/reunira.png', '{React Native}', '', '📱', 3),
('Maduradev', 'Community website for Madura developers showcasing local tech talent', 'https://32ily8ib82.ucarecd.net/519fe07d-e17b-4b57-b2ef-d6f2948955a9/maduradev.png', '{Next.js,TypeScript,TailwindCSS}', 'https://madura.dev', '👥', 4),
('DCN UNIRA', 'Information hub for Dicoding Community Network at Universitas Madura', 'https://32ily8ib82.ucarecd.net/68fcd631-d4c4-4f53-becf-2b602286e771/dcnuniradev.png', '{Next.js,TailwindCSS,Framer Motion,etc}', 'https://dcnunira.dev', '🎓', 5),
('Presentation Deck', 'SaaS presentation deck platform for students with AI-powered features', 'https://32ily8ib82.ucarecd.net/4abf756f-b6ac-4ba6-8a10-bf1d29ed688e/presentasionapp.png', '{Next.js,gemini,markdown,etc}', 'https://slide.dcnunira.dev', '🎨');
