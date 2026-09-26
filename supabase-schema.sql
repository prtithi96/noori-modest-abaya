-- ============================================================================
-- NOORI Haute Modestie - Supabase / PostgreSQL Database Schema
-- File: /supabase-schema.sql
-- ============================================================================

-- 1. Profiles Table (linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  role text default 'customer' not null, -- 'customer' | 'boutique' | 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Boutique Wholesale Profiles (B2B Accounts & Tiers)
create table if not exists public.boutique_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  business_name text not null,
  country text not null,
  city text,
  phone text,
  approved_tier text default 'tier_1' not null, -- 'tier_1' (30%) | 'tier_2' (38%) | 'tier_3' (45%)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.boutique_profiles enable row level security;
create policy "Boutique profiles viewable by owner" on public.boutique_profiles for select using (auth.uid() = user_id);
create policy "Boutique profiles insertable by owner" on public.boutique_profiles for insert with check (auth.uid() = user_id);
create policy "Boutique profiles updatable by owner" on public.boutique_profiles for update using (auth.uid() = user_id);

-- 3. Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_docket_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  order_type text default 'retail' not null, -- 'retail' | 'wholesale'
  total_amount integer not null, -- in INR
  payment_method text default 'upi' not null, -- 'upi' | 'card' | 'cod' | 'wire'
  shipping_status text default 'confirmed' not null, -- 'confirmed' | 'processing' | 'dispatched' | 'delivered'
  tracking_number text not null,
  shipping_address jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
create policy "Orders viewable by owner" on public.orders for select using (auth.uid() = user_id or auth.uid() is null);
create policy "Anyone can create orders" on public.orders for insert with check (true);

-- 4. Order Items Table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null,
  unit_price integer not null
);

alter table public.order_items enable row level security;
create policy "Order items viewable by everyone" on public.order_items for select using (true);
create policy "Order items insertable by everyone" on public.order_items for insert with check (true);

-- 5. Wishlist Items Table
create table if not exists public.wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table public.wishlist_items enable row level security;
create policy "Wishlist items viewable by owner" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "Wishlist items insertable by owner" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "Wishlist items deletable by owner" on public.wishlist_items for delete using (auth.uid() = user_id);

-- 6. Inquiries Table (Concierge & Wholesale B2B Requests)
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  inquiry_type text default 'retail' not null, -- 'retail' | 'wholesale' | 'custom' | 'bridal'
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inquiries enable row level security;
create policy "Anyone can submit inquiry" on public.inquiries for insert with check (true);

-- 7. Automatic Profile Creation Trigger on Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
