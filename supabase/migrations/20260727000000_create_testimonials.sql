create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  role_or_company text check (char_length(role_or_company) <= 120),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create index if not exists testimonials_approved_created_at_idx
  on public.testimonials (approved, created_at desc);
