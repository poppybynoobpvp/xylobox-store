-- Run this in Supabase SQL Editor

create table orders (
  id uuid default gen_random_uuid() primary key,
  player_name text not null,
  product_id text not null,
  product_name text not null,
  price integer not null,
  slip_url text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Allow anyone to create orders (buyers)
alter table orders enable row level security;
create policy "Anyone can insert orders" on orders for insert with check (true);
create policy "Anyone can read their order by id" on orders for select using (true);

-- Storage bucket for slip images
insert into storage.buckets (id, name, public) values ('slips', 'slips', true);
create policy "Anyone can upload slips" on storage.objects for insert with check (bucket_id = 'slips');
create policy "Anyone can read slips" on storage.objects for select using (bucket_id = 'slips');
