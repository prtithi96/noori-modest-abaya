import React, { useState } from 'react';
import { X, Database, CheckCircle2, Copy, ExternalLink, ShieldCheck, Key, RefreshCw } from 'lucide-react';
import { getSupabaseConfig, setStoredSupabaseConfig, clearStoredSupabaseConfig } from '../lib/supabase';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({ isOpen, onClose }) => {
  const { url: initialUrl, key: initialKey, isConfigured } = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(initialKey || '');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) return;
    setStoredSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
  };

  const handleDisconnect = () => {
    clearStoredSupabaseConfig();
  };

  const sqlSchemaScript = `-- 1. Profiles Table (linked to Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  role text default 'customer' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Boutique Wholesale Profiles
create table public.boutique_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  business_name text not null,
  country text not null,
  city text,
  phone text,
  approved_tier text default 'tier_1' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.boutique_profiles enable row level security;
create policy "Boutique profiles viewable by owner" on public.boutique_profiles for select using (auth.uid() = user_id);
create policy "Boutique profiles insertable by owner" on public.boutique_profiles for insert with check (auth.uid() = user_id);
create policy "Boutique profiles updatable by owner" on public.boutique_profiles for update using (auth.uid() = user_id);

-- 3. Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_docket_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  order_type text default 'retail' not null,
  total_amount integer not null,
  payment_method text default 'upi' not null,
  shipping_status text default 'confirmed' not null,
  tracking_number text not null,
  shipping_address jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
create policy "Orders viewable by owner" on public.orders for select using (auth.uid() = user_id or auth.uid() is null);
create policy "Anyone can create orders" on public.orders for insert with check (true);

-- 4. Order Items Table
create table public.order_items (
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
create table public.wishlist_items (
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

-- 6. Inquiries Table
create table public.inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  inquiry_type text default 'retail' not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inquiries enable row level security;
create policy "Anyone can submit inquiry" on public.inquiries for insert with check (true);

-- Automatic Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#ffffff] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#c1c8c4]/40 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#ecefeb] text-[#181c1a] hover:bg-[#062920] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#735c00] uppercase tracking-[0.25em] font-semibold mb-1">
            <Database className="w-4 h-4" />
            <span>Backend Architecture</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#00110c] font-normal">
            Supabase Connection &amp; Schema
          </h2>
          <p className="text-xs text-[#414845] font-light mt-1">
            Connect your own Supabase project or execute the ready-made SQL schema in your Supabase SQL Editor.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="p-4 bg-[#f7faf6] border border-[#c1c8c4]/40 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-[#735c00]'
              }`}
            />
            <div>
              <span className="text-xs font-semibold text-[#00110c] block">
                {isConfigured ? 'Direct Supabase Connected' : 'Relational PostgreSQL Database Active'}
              </span>
              <span className="text-[11px] text-[#717975]">
                {isConfigured
                  ? `Target: ${initialUrl}`
                  : 'Currently operating with Google Cloud SQL instance (asia-southeast1)'}
              </span>
            </div>
          </div>

          {isConfigured && (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 bg-[#ecefeb] text-xs text-[#ba1a1a] hover:bg-[#e0e3df] font-semibold uppercase tracking-wider"
            >
              Reset to Built-in DB
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#c1c8c4]/40 mb-6">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === 'config'
                ? 'border-b-2 border-[#062920] text-[#062920]'
                : 'text-[#717975] hover:text-[#00110c]'
            }`}
          >
            Connection Setup
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-b-2 border-[#062920] text-[#062920]'
                : 'text-[#717975] hover:text-[#00110c]'
            }`}
          >
            <span>Supabase SQL Schema</span>
            <span className="px-1.5 py-0.2 bg-[#ffe088] text-[#00110c] text-[9px] font-bold rounded">
              Ready
            </span>
          </button>
        </div>

        {activeTab === 'config' ? (
          <div className="space-y-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-1">
                  Supabase Project URL *
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                />
                <span className="text-[11px] text-[#717975] mt-1 block">
                  Found in your Supabase Dashboard: <strong>Project Settings → API → Project URL</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#414845] font-semibold mb-1">
                  Supabase Anon / Public Key *
                </label>
                <input
                  type="text"
                  required
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-[#f1f4f0] px-3.5 py-2.5 text-xs text-[#181c1a] border border-[#c1c8c4]/60 focus:outline-none focus:border-[#735c00]"
                />
                <span className="text-[11px] text-[#717975] mt-1 block">
                  Found in your Supabase Dashboard: <strong>Project Settings → API → Project API Keys (anon public)</strong>
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#062920] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0B3B2F] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#ffe088]" />
                  <span>Connect &amp; Activate Supabase</span>
                </button>
              </div>
            </form>

            <div className="p-4 bg-[#f1f4f0] border border-[#c1c8c4]/30 space-y-2 text-xs">
              <span className="font-semibold text-[#00110c] block">
                How Supabase Works in this Application:
              </span>
              <ul className="space-y-1 text-[#414845] list-disc list-inside">
                <li>
                  Orders and items are written atomically to the Supabase <code>orders</code> and <code>order_items</code> tables.
                </li>
                <li>
                  Boutique wholesale profiles and inquiries are registered in <code>boutique_profiles</code> and <code>inquiries</code>.
                </li>
                <li>
                  Wishlists are synchronized in real-time in <code>wishlist_items</code> with user-level security.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#414845]">
                Copy and run this script in your <strong>Supabase SQL Editor</strong> to create all tables and RLS security policies:
              </span>
              <button
                onClick={copySql}
                className="px-4 py-2 bg-[#062920] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#0B3B2F] transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ffe088]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#ffe088]" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-[#0B0F0D] text-[#e6e9e5] text-[11px] font-mono overflow-x-auto max-h-[360px] rounded border border-white/10 leading-relaxed">
              <code>{sqlSchemaScript}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
