# Debendra Connect — Supabase Setup

## ধাপ ২: SQL Editor-এ এই পুরো কোডটা পেস্ট করে "Run" চাপো

```sql
-- 1) PROFILES টেবিল (real users, auto-increment id = "কততম ইউজার")
create table profiles (
  id bigint generated always as identity primary key, -- 1, 2, 3... (real user count)
  auth_id uuid references auth.users(id) unique not null,
  username text unique not null, -- link-এ ব্যবহার হবে, একই নাম হলে rafi, rafi1, rafi2...
  name text not null,
  dept text,
  year text,
  roll text,
  avatar text,
  bio text,
  blood text,
  joined timestamptz default now(),
  created_at timestamptz default now()
);
create index idx_profiles_username on profiles(username);


-- 2) POSTS টেবিল
create table posts (
  id bigint generated always as identity primary key,
  user_id bigint references profiles(id) not null,
  text text,
  img text,
  dept text,
  audience text default 'public',
  created_at timestamptz default now()
);

-- 3) Security: সবাই profile/post READ করতে পারবে (তাই link খুললে নাম দেখাবে)
alter table profiles enable row level security;
alter table posts enable row level security;

create policy "profiles are viewable by everyone"
  on profiles for select using (true);

create policy "posts are viewable by everyone"
  on posts for select using (true);

-- 4) কিন্তু নিজের profile/post ছাড়া কেউ এডিট/ডিলিট করতে পারবে না
create policy "users can update own profile"
  on profiles for update using (auth.uid() = auth_id);

create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = auth_id);

create policy "users can insert own posts"
  on posts for insert with check (
    user_id = (select id from profiles where auth_id = auth.uid())
  );

create policy "users can delete own posts"
  on posts for delete using (
    user_id = (select id from profiles where auth_id = auth.uid())
  );
```

এটা রান করলেই দুটো টেবিল রেডি হয়ে যাবে। **id কলামটাই হলো "কততম ইউজার"** — প্রথম যে signup করবে তার id=1, দ্বিতীয়জনের id=2... এটাই real user count।

## ধাপ ৪: Email confirmation বন্ধ রাখো (নাহলে signup এ সমস্যা হবে)
Supabase dashboard → **Authentication → Providers → Email** এ গিয়ে **"Confirm email"** অপশনটা **off** করে দাও। এটা on থাকলে signup করার সাথে সাথে profile তৈরি হবে না (ইমেইল confirm না করা পর্যন্ত আটকে থাকবে)।

## ধাপ ৩: আমাকে যা পাঠাতে হবে
- Project URL
- anon public key

(Settings → API থেকে)

## কোড সাইডে কী রেডি করা আছে (js/supabase-client.js)
- `SUPABASE_URL` আর `SUPABASE_ANON_KEY` বসালেই app demo mode থেকে real mode-এ চলে যাবে — আলাদা করে কিছু বদলাতে হবে না
- Signup হলে স্বয়ংক্রিয়ভাবে একটা unique **username** তৈরি হয় নাম থেকে (যেমন "রাফি আহমেদ" → `rafiahmed`)
- **একই নামের আরেকজন registered করলে** তার username হবে `rafiahmed1`, তৃতীয়জনের `rafiahmed2`... — username সবসময় unique থাকবে, কোনো conflict হবে না
- প্রতিটা profile/post real Supabase `id` (1,2,3...) পায় — এটাই real user count

## লিংক উদাহরণ (FB-এর মতো)
Hosting শেষ হলে তোমার সাইট হবে ধরো:
`https://debendra-connect.vercel.app`

প্রোফাইল link:
`https://debendra-connect.vercel.app/?u=rafiahmed`

দ্বিতীয় "রাফি আহমেদ" নামের কারো link:
`https://debendra-connect.vercel.app/?u=rafiahmed1`

পোস্ট link (FB এর মতো username + post id একসাথে):
`https://debendra-connect.vercel.app/?u=rafiahmed&post=17502345`

→ link কপি করে কাউকে পাঠালে/অন্য ব্রাউজারে খুললে Supabase থেকে real নাম-ছবি-পোস্ট লোড হয়ে সরাসরি সেই প্রোফাইল/পোস্টে চলে যাবে।
