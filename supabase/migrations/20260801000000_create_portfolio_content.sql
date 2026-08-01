create table if not exists public.portfolio_profile (
  id text primary key default 'default' check (id = 'default'),
  display_name text not null check (char_length(display_name) between 1 and 120),
  availability text not null default 'available' check (availability in ('available', 'open_to_work', 'unavailable')),
  experience_years integer not null default 1 check (experience_years between 0 and 100),
  short_bio text not null check (char_length(short_bio) between 1 and 1000),
  about_markdown text not null check (char_length(about_markdown) between 1 and 8000),
  quick_facts text[] not null default '{}',
  dark_image_path text,
  light_image_path text,
  updated_at timestamptz not null default now()
);

insert into public.portfolio_profile (
  id, display_name, availability, experience_years, short_bio, about_markdown,
  quick_facts, dark_image_path, light_image_path
)
values (
  'default', 'Joshua Colobong', 'available', 1,
  'Junior Frontend Developer specializing in fast, responsive, and user-centric web applications using React, Next.js, TypeScript, and Tailwind CSS. Focused on clean code, performance, and accessibility.',
  'I''m a junior frontend developer specializing in fast, responsive, and user-centric web applications using **React**, **Next.js**, **TypeScript**, and **Tailwind CSS** — focused on clean code, performance, and accessibility.\n\nBeyond the web, I also work with **React Native** for mobile development, **Godot Engine** for game development, and explore **AI Engineering** with multi-agent orchestration and prompt architecture.',
  array[
    'Currently working as a **Software Engineer | Frontend Developer | Mobile App Developer**',
    'Core strengths: **Frontend Development**, **Mobile Apps** & **Responsive Design**',
    'Open to new opportunities and collaborations',
    'Ask me about `React` `Next.js` `React Native` `TypeScript`'
  ],
  '/images/josh-profile.png', '/images/josh-profile-light.png'
)
on conflict (id) do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 3000),
  image_path text not null,
  category text not null check (category in ('work_experience', 'personal_project')),
  coming_soon boolean not null default false,
  technologies jsonb not null default '[]'::jsonb,
  live_url text,
  code_url text,
  position integer not null default 0 check (position >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (archived_at, position, created_at);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  issuer text not null check (char_length(issuer) between 1 and 160),
  issue_year integer not null check (issue_year between 1900 and 2200),
  thumbnail_path text not null,
  credential_type text not null check (credential_type in ('upload', 'external')),
  credential_path text,
  external_url text,
  position integer not null default 0 check (position >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievements_credential_source_check check (
    (credential_type = 'upload' and credential_path is not null and external_url is null)
    or (credential_type = 'external' and credential_path is null and external_url is not null)
  )
);

create index if not exists achievements_public_order_idx
  on public.achievements (archived_at, position, created_at);

alter table public.portfolio_profile enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-images', 'portfolio-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio-credentials', 'portfolio-credentials', true, 10485760, array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
