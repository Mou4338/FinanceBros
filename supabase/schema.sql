-- =====================================================================
-- Finance Bros — Supabase schema (run once in Supabase → SQL Editor)
-- Tables follow SRS §6. Row Level Security keeps every customer's data
-- private; only users with role = 'admin' can see and manage everything.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- profiles (one per login) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text,
  email      text,
  phone      text,
  city       text,
  role       text not null default 'customer' check (role in ('customer', 'consultant', 'admin')),
  created    timestamptz not null default now()
);

-- create a profile automatically when someone signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, city)
  values (new.id, new.email,
          new.raw_user_meta_data ->> 'name',
          new.raw_user_meta_data ->> 'phone',
          new.raw_user_meta_data ->> 'city');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: is the current user an admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- reference data ----------
create table if not exists public.consultants (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  expertise text,
  active    boolean not null default true
);

create table if not exists public.plans (
  id       text primary key,
  name     text not null,
  price    integer not null default 0,
  per      text default '',
  d        text,
  f        text[] default '{}',
  featured boolean default false,
  sort     integer default 0
);

-- ---------- enquiries (FR-04) ----------
create table if not exists public.enquiries (
  id         uuid primary key,
  ref        text unique not null,
  user_id    uuid references auth.users on delete set null,
  name       text not null,
  phone      text not null,
  email      text not null,
  city       text,
  topic      text,
  employment text,
  income     text,
  time       text,
  message    text,
  source     text default 'Website',
  status     text not null default 'New' check (status in ('New', 'Contacted', 'In progress', 'Closed')),
  consent_at timestamptz not null default now(),
  created    timestamptz not null default now()
);

-- ---------- bookings (FR-07) ----------
create table if not exists public.bookings (
  id             uuid primary key,
  ref            text unique not null,
  user_id        uuid references auth.users on delete set null,
  name           text not null,
  phone          text not null,
  email          text not null,
  service        text not null,
  mode           text,
  date           date not null,
  slot           text not null,
  notes          text,
  status         text not null default 'Requested' check (status in ('Requested', 'Confirmed', 'Completed', 'Cancelled')),
  consultant     uuid references public.consultants on delete set null,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  consent_at     timestamptz not null default now(),
  created        timestamptz not null default now()
);
-- one active booking per slot
create unique index if not exists bookings_one_per_slot on public.bookings (date, slot) where status <> 'Cancelled';

-- ---------- reports (FR-09) ----------
create table if not exists public.reports (
  id      uuid primary key,
  ref     text unique not null,
  user_id uuid not null references auth.users on delete cascade,
  type    text,
  score   integer,
  total   numeric,
  profile text,
  alloc   jsonb,
  notes   jsonb,
  created timestamptz not null default now()
);

-- ---------- payments (FR-08) — written only by the Razorpay webhook ----------
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid references public.bookings on delete set null,
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  amount              integer,
  status              text,
  created             timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles    enable row level security;
alter table public.consultants enable row level security;
alter table public.plans       enable row level security;
alter table public.enquiries   enable row level security;
alter table public.bookings    enable row level security;
alter table public.reports     enable row level security;
alter table public.payments    enable row level security;

-- Table access for the website's API roles. New Supabase projects don't grant this
-- automatically; Row Level Security (below) still decides which rows each person sees.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
revoke insert, update, delete on public.payments from anon, authenticated;   -- only the Razorpay webhook writes payments

-- profiles: see/edit your own (name, phone, city only); admins see all
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "edit own profile" on public.profiles;
create policy "edit own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (name, phone, city) on public.profiles to authenticated;   -- role cannot be self-promoted

-- plans & consultants: everyone reads, admins write
drop policy if exists "read plans" on public.plans;
create policy "read plans" on public.plans for select using (true);
drop policy if exists "admin plans" on public.plans;
create policy "admin plans" on public.plans for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read consultants" on public.consultants;
create policy "read consultants" on public.consultants for select using (true);
drop policy if exists "admin consultants" on public.consultants;
create policy "admin consultants" on public.consultants for all using (public.is_admin()) with check (public.is_admin());

-- enquiries: anyone may submit; you see your own; admins see/update all
drop policy if exists "submit enquiry" on public.enquiries;
create policy "submit enquiry" on public.enquiries for insert to anon, authenticated
  with check (status = 'New' and (user_id is null or user_id = auth.uid()));
drop policy if exists "read own enquiries" on public.enquiries;
create policy "read own enquiries" on public.enquiries for select
  using (public.is_admin() or user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
drop policy if exists "admin update enquiries" on public.enquiries;
create policy "admin update enquiries" on public.enquiries for update using (public.is_admin()) with check (public.is_admin());

-- bookings: anyone may request; you see your own; admins manage all
drop policy if exists "request booking" on public.bookings;
create policy "request booking" on public.bookings for insert to anon, authenticated
  with check (status = 'Requested' and payment_status = 'unpaid' and consultant is null and (user_id is null or user_id = auth.uid()));
drop policy if exists "read own bookings" on public.bookings;
create policy "read own bookings" on public.bookings for select
  using (public.is_admin() or user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
drop policy if exists "admin update bookings" on public.bookings;
create policy "admin update bookings" on public.bookings for update using (public.is_admin()) with check (public.is_admin());

-- reports: private to the owner; admins can read
drop policy if exists "own reports" on public.reports;
create policy "own reports" on public.reports for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "save own report" on public.reports;
create policy "save own report" on public.reports for insert to authenticated with check (user_id = auth.uid());

-- payments: admins read; only the webhook (service role) writes
drop policy if exists "admin payments" on public.payments;
create policy "admin payments" on public.payments for select using (public.is_admin());

-- =====================================================================
-- Functions the website calls
-- =====================================================================
-- which slots are taken on a day (no personal data exposed)
create or replace function public.taken_slots(d date) returns setof text
language sql stable security definer set search_path = public as $$
  select slot from public.bookings where date = d and status <> 'Cancelled';
$$;
grant execute on function public.taken_slots(date) to anon, authenticated;

-- a customer may cancel their own upcoming booking
create or replace function public.cancel_booking(bid uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.bookings set status = 'Cancelled'
   where id = bid and status in ('Requested', 'Confirmed')
     and (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));
end $$;
grant execute on function public.cancel_booking(uuid) to authenticated;

-- =====================================================================
-- Admin tools: internal notes, deleting spam, managing admins
-- =====================================================================
alter table public.enquiries add column if not exists admin_notes text;
alter table public.bookings  add column if not exists admin_notes text;

drop policy if exists "admin delete enquiries" on public.enquiries;
create policy "admin delete enquiries" on public.enquiries for delete using (public.is_admin());
drop policy if exists "admin delete bookings" on public.bookings;
create policy "admin delete bookings" on public.bookings for delete using (public.is_admin());

-- add / remove an admin by email (only admins may call it; the last admin can't be removed)
create or replace function public.set_user_role(target_email text, new_role text) returns text
language plpgsql security definer set search_path = public as $$
declare
  tid uuid;
  old_role text;
  admins int;
begin
  if not public.is_admin() then raise exception 'Only admins can change roles.'; end if;
  if new_role not in ('customer', 'admin') then raise exception 'Invalid role.'; end if;
  select id, role into tid, old_role from public.profiles where lower(email) = lower(trim(target_email));
  if tid is null then raise exception 'No account with that email. Ask them to sign up on the website first.'; end if;
  if new_role = 'customer' and old_role = 'admin' then
    select count(*) into admins from public.profiles where role = 'admin';
    if admins <= 1 then raise exception 'You cannot remove the last admin.'; end if;
  end if;
  update public.profiles set role = new_role where id = tid;
  return new_role;
end $$;
revoke execute on function public.set_user_role(text, text) from public, anon;
grant execute on function public.set_user_role(text, text) to authenticated;

-- =====================================================================
-- Starting data (edit freely)
-- =====================================================================
insert into public.plans (id, name, price, per, d, f, featured, sort) values
  ('free', 'Free', 0, '', 'For anyone getting started.', array['All calculators','Indicative health check','Learning centre & guides','Instagram explainers'], false, 1),
  ('consult', 'Consultation', 499, '/ session', 'One focused 45-min expert call.', array['Loan, SIP or planning topic','Review of your numbers','Written summary after the call','WhatsApp follow-up for 7 days'], true, 2),
  ('report', 'Portfolio Report', 1499, '/ report', 'A full Portfolio Health Report.', array['Allocation & overlap analysis','Goal mapping','PDF report','30-min walkthrough call'], false, 3),
  ('annual', 'Annual Plan', 4999, '/ year', 'Ongoing planning for the year.', array['Complete financial plan','Quarterly reviews','Loan & insurance check-ups','Priority WhatsApp support'], false, 4)
on conflict (id) do nothing;

insert into public.consultants (name, expertise)
select * from (values ('Loans desk', 'Loans & credit'), ('Investments desk', 'SIP, mutual funds, portfolio'), ('Planning desk', 'Budgeting, retirement, insurance')) v
where not exists (select 1 from public.consultants);

-- Per-service pricing: run supabase/pricing.sql after this file.

-- =====================================================================
-- AFTER you create your own account on the website, make it an admin:
--   update public.profiles set role = 'admin' where email = 'you@yourmail.com';
-- =====================================================================
