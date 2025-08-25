-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (admin users via Supabase Auth; optional)
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Members
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone text,
  address text,
  membership_type text not null default 'annual',
  status text not null default 'inactive', -- 'active' | 'inactive'
  expires_on date,
  created_at timestamptz not null default now()
);

-- Membership orders (join/renew)
create table if not exists membership_orders (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete cascade,
  type text not null, -- 'join' | 'renew'
  amount_cents int not null default 0,
  currency text not null default 'USD',
  paid boolean not null default false,
  txn_id text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Events
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  venue text,
  start_at timestamptz not null,
  price_member_cents int not null default 0,
  price_non_member_cents int not null default 0,
  capacity int,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Registrations
create table if not exists registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  member_id uuid references members(id),
  full_name text not null,
  email text not null,
  qty_guests int not null default 0,
  total_due_cents int not null default 0,
  paid boolean not null default false,
  ticket_code text unique not null, -- shown as QR
  created_at timestamptz not null default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  provider text not null, -- 'braintree' | 'mock'
  amount_cents int not null,
  currency text not null default 'USD',
  status text not null, -- 'succeeded' | 'failed' | 'pending'
  txn_id text,
  member_id uuid references members(id),
  registration_id uuid references registrations(id),
  raw jsonb,
  created_at timestamptz not null default now()
);

-- Check-ins
create table if not exists checkins (
  id uuid primary key default uuid_generate_v4(),
  registration_id uuid references registrations(id) on delete cascade,
  scanned_by text,
  scanned_at timestamptz not null default now()
);

-- Basic indexes
create index if not exists idx_members_email on members(email);
create index if not exists idx_events_slug on events(slug);
create index if not exists idx_reg_ticket on registrations(ticket_code);

-- No RLS in starter; use server-side service role key in API routes.
-- You can add RLS later if needed.
