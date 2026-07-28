alter table public.blogs
  add column if not exists source_id text;

create unique index if not exists blogs_source_id_key
  on public.blogs (source_id);
