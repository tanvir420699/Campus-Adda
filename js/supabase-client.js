// ============================================================
// ============ SUPABASE INTEGRATION (Debendra Connect) =======
// ============================================================
// এখানে Supabase project এর URL আর anon key বসাও (Settings → API থেকে)
const SUPABASE_URL = 'https://etmfczycficgiujzblks.supabase.co';      // উদাহরণ: 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_jIWDZ0hhG_oijy3q3oGd2w_hm1iVQMt';

// key বসানো না হলে app আগের মতো demo/mock data দিয়েই চলবে — কিছু ভাঙবে না।
const SUPABASE_CONFIGURED = SUPABASE_URL !== 'https://etmfczycficgiujzblks.supabase.co' && SUPABASE_ANON_KEY !== 'sb_publishable_jIWDZ0hhG_oijy3q3oGd2w_hm1iVQMt';

let sb = null;
if (SUPABASE_CONFIGURED && window.supabase) {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ===== USERNAME GENERATION (FB-style: same name হলে পাশে 1,2,3...) =====
// বাংলা নাম থেকে best-effort English slug বানায়
const BN_TRANSLIT = {
  'অ':'o','আ':'a','ই':'i','ঈ':'i','উ':'u','ঊ':'u','ঋ':'ri','এ':'e','ঐ':'oi','ও':'o','ঔ':'ou',
  'ক':'k','খ':'kh','গ':'g','ঘ':'gh','ঙ':'ng','চ':'ch','ছ':'chh','জ':'j','ঝ':'jh','ঞ':'ny',
  'ট':'t','ঠ':'th','ড':'d','ঢ':'dh','ণ':'n','ত':'t','থ':'th','দ':'d','ধ':'dh','ন':'n',
  'প':'p','ফ':'ph','ব':'b','ভ':'bh','ম':'m','য':'z','র':'r','ল':'l','শ':'sh','ষ':'sh','স':'s','হ':'h',
  'ড়':'r','ঢ়':'rh','য়':'y','ৎ':'t','ং':'ng','ঃ':'','ঁ':'',
  'া':'a','ি':'i','ী':'i','ু':'u','ূ':'u','ৃ':'ri','ে':'e','ৈ':'oi','ো':'o','ৌ':'ou','্':''
};
function slugifyName(name) {
  if (!name) return 'user';
  let out = '';
  for (const ch of name) out += (BN_TRANSLIT[ch] !== undefined ? BN_TRANSLIT[ch] : ch);
  out = out.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18);
  return out || 'user';
}

// Supabase-এ গিয়ে চেক করে base username নেওয়া আছে কিনা; থাকলে base1, base2... রিটার্ন করে
async function generateUniqueUsername(name) {
  const base = slugifyName(name);
  if (!SUPABASE_CONFIGURED) return base; // demo mode: চেক করার দরকার নেই
  const { data, error } = await sb
    .from('profiles')
    .select('username')
    .like('username', `${base}%`);
  if (error || !data) return base;
  const taken = new Set(data.map(r => r.username));
  if (!taken.has(base)) return base;
  let n = 1;
  while (taken.has(`${base}${n}`)) n++;
  return `${base}${n}`;
}

// ===== AUTH =====
async function supabaseSignUp({ email, password, name, dept, year, roll, blood, role, designation }) {
  if (!SUPABASE_CONFIGURED) { showToast('⚠️ এখনো Supabase সংযুক্ত হয়নি (demo mode)'); return null; }
  const username = await generateUniqueUsername(name);
  const { data: authData, error: authErr } = await sb.auth.signUp({ email, password });
  if (authErr) { showToast('❌ ' + authErr.message); return null; }
  const { data: profile, error: profErr } = await sb
    .from('profiles')
    .insert({
      auth_id: authData.user.id, name, username, dept, year, roll,
      avatar: name.slice(0, 1), blood,
      role: role || 'student', designation: designation || ''
    })
    .select().single();
  if (profErr) { showToast('❌ ' + profErr.message); return null; }
  return profile; // profile.id = real user count (1,2,3...), profile.username = link-friendly handle
}

async function supabaseLogin(email, password) {
  if (!SUPABASE_CONFIGURED) { showToast('⚠️ এখনো Supabase সংযুক্ত হয়নি (demo mode)'); return null; }
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) { showToast('❌ ভুল ইমেইল/পাসওয়ার্ড'); return null; }
  return data;
}

async function supabaseLogout() {
  if (!SUPABASE_CONFIGURED) return;
  await sb.auth.signOut();
}

// ===== FETCH REAL DATA (replaces MOCK_USERS / posts once configured) =====
async function loadRealDataFromSupabase() {
  if (!SUPABASE_CONFIGURED) return false;
  const { data: profiles } = await sb.from('profiles').select('*').order('id');
  const { data: realPosts } = await sb.from('posts').select('*').order('created_at', { ascending: false });

  if (profiles) {
    MOCK_USERS.length = 0;
    profiles.forEach(p => {
      MOCK_USERS.push({
        id: p.id, username: p.username, name: p.name, dept: p.dept, year: p.year || '',
        roll: p.roll || '', avatar: p.avatar || p.name.slice(0,1), online: false,
        bio: p.bio || '', blood: p.blood || '', joined: p.joined || '', birthday: p.birthday || '',
        lastSeen: Date.now()
      });
    });
  }
  if (realPosts) {
    posts.length = 0;
    realPosts.forEach(p => {
      posts.push({
        id: p.id, userId: p.user_id, text: p.text, time: p.time || 'এইমাত্র',
        likes: p.likes || 0, comments: [], dept: p.dept, reactions: {},
        audience: p.audience || 'public', img: p.img || null
      });
    });
  }
  return true;
}

async function createPostSupabase(text, dept, audience, img) {
  if (!SUPABASE_CONFIGURED || !ME.username) { showToast('⚠️ Supabase configured না, demo mode-এ পোস্ট সেভ হবে না'); return null; }
  const { data, error } = await sb.from('posts').insert({
    user_id: ME.id, text, dept, audience, img
  }).select().single();
  if (error) { showToast('❌ ' + error.message); return null; }
  return data;
}

// ===== SHAREABLE LINKS (username-based, FB-style) =====
// profile link: ?u=username
// post link:    ?u=username&post=postId
function buildProfileLink(username) {
  return `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(username)}`;
}
function buildPostLink(username, postId) {
  return `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(username)}&post=${postId}`;
}

async function handleRealDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('u');
  const postId = params.get('post');
  if (!username) return false;

  let user = MOCK_USERS.find(u => u.username === username);
  if (!user && SUPABASE_CONFIGURED) {
    const { data } = await sb.from('profiles').select('*').eq('username', username).single();
    if (data) {
      user = { id: data.id, username: data.username, name: data.name, dept: data.dept, year: data.year || '',
        roll: data.roll || '', avatar: data.avatar || data.name.slice(0,1), online: false,
        bio: data.bio || '', blood: data.blood || '', joined: data.joined || '', birthday: '', lastSeen: Date.now() };
      MOCK_USERS.push(user);
    }
  }
  if (!user) { showToast('😕 এই ইউজার খুঁজে পাওয়া যায়নি'); return true; }

  openUserProfile(user.id);
  if (postId) {
    const pid = parseInt(postId);
    setTimeout(() => {
      switchTab('feed'); closeUserProfile();
      const el = document.getElementById('postcard-' + pid);
      if (el) { el.scrollIntoView({ behavior:'smooth', block:'center' }); el.style.outline='2px solid var(--accent)'; el.style.borderRadius='14px'; setTimeout(()=>{ el.style.outline=''; },2500); }
    }, 300);
  }
  return true;
}

// ===== COMMENTS =====
async function loadComments(postId) {
  if (!SUPABASE_CONFIGURED) return [];
  const { data } = await sb.from('comments').select('*, profiles(name, avatar, dept)').eq('post_id', postId).order('created_at');
  return data || [];
}
async function addComment(postId, text) {
  if (!SUPABASE_CONFIGURED || !ME.id) return null;
  const { data, error } = await sb.from('comments').insert({ post_id: postId, user_id: ME.id, text }).select().single();
  if (error) { showToast('❌ ' + error.message); return null; }
  // notification
  await sb.from('notifications').insert({ user_id: postId, from_id: ME.id, type: 'comment', post_id: postId }).catch(()=>{});
  return data;
}

// ===== LIKES =====
async function toggleLikeSupabase(postId) {
  if (!SUPABASE_CONFIGURED || !ME.id) return;
  const { data: existing } = await sb.from('likes').select('id').eq('post_id', postId).eq('user_id', ME.id).single().catch(()=>({data:null}));
  if (existing) {
    await sb.from('likes').delete().eq('id', existing.id);
    return false;
  } else {
    await sb.from('likes').insert({ post_id: postId, user_id: ME.id });
    await sb.from('notifications').insert({ user_id: postId, from_id: ME.id, type: 'like', post_id: postId }).catch(()=>{});
    return true;
  }
}

// ===== MESSAGES REALTIME =====
async function sendMessageSupabase(toId, text, img) {
  if (!SUPABASE_CONFIGURED || !ME.id) return null;
  const { data, error } = await sb.from('messages').insert({ from_id: ME.id, to_id: toId, text, img }).select().single();
  if (error) { showToast('❌ ' + error.message); return null; }
  return data;
}
async function loadMessages(toId) {
  if (!SUPABASE_CONFIGURED || !ME.id) return [];
  const { data } = await sb.from('messages').select('*')
    .or(`and(from_id.eq.${ME.id},to_id.eq.${toId}),and(from_id.eq.${toId},to_id.eq.${ME.id})`)
    .order('created_at');
  return data || [];
}
function subscribeMessages(toId, callback) {
  if (!SUPABASE_CONFIGURED) return null;
  return sb.channel('messages-' + toId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      const msg = payload.new;
      if ((msg.from_id == ME.id && msg.to_id == toId) || (msg.from_id == toId && msg.to_id == ME.id)) {
        callback(msg);
      }
    }).subscribe();
}

// ===== FRIEND REQUESTS =====
async function sendFriendRequest(toId) {
  if (!SUPABASE_CONFIGURED || !ME.id) return;
  const { error } = await sb.from('friend_requests').insert({ from_id: ME.id, to_id: toId });
  if (error) { showToast('❌ ইতোমধ্যে request পাঠানো হয়েছে'); return; }
  await sb.from('notifications').insert({ user_id: toId, from_id: ME.id, type: 'friend_request' }).catch(()=>{});
  showToast('✅ Friend request পাঠানো হয়েছে!');
}
async function acceptFriendRequest(fromId) {
  if (!SUPABASE_CONFIGURED || !ME.id) return;
  await sb.from('friend_requests').update({ status: 'accepted' }).eq('from_id', fromId).eq('to_id', ME.id);
  await sb.from('follows').insert([{ follower_id: ME.id, following_id: fromId }, { follower_id: fromId, following_id: ME.id }]).catch(()=>{});
  showToast('✅ Friend request accept করা হয়েছে!');
}

// ===== NOTIFICATIONS REALTIME =====
async function loadNotifications() {
  if (!SUPABASE_CONFIGURED || !ME.id) return [];
  const { data } = await sb.from('notifications').select('*, profiles!from_id(name, avatar)').eq('user_id', ME.id).order('created_at', { ascending: false }).limit(50);
  return data || [];
}
function subscribeNotifications(callback) {
  if (!SUPABASE_CONFIGURED || !ME.id) return null;
  return sb.channel('notifications-' + ME.id)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${ME.id}` }, payload => {
      callback(payload.new);
    }).subscribe();
}

// ===== IMAGE UPLOAD =====
async function uploadImage(file, bucket) {
  if (!SUPABASE_CONFIGURED) return null;
  const ext = file.name.split('.').pop();
  const path = `${ME.id}-${Date.now()}.${ext}`;
  const { data, error } = await sb.storage.from(bucket || 'uploads').upload(path, file);
  if (error) { showToast('❌ Upload failed: ' + error.message); return null; }
  const { data: urlData } = sb.storage.from(bucket || 'uploads').getPublicUrl(path);
  return urlData.publicUrl;
}

// ===== STORIES =====
async function loadStories() {
  if (!SUPABASE_CONFIGURED) return [];
  const since = new Date(Date.now() - 24*60*60*1000).toISOString();
  const { data } = await sb.from('stories').select('*, profiles(name, avatar, dept)').gte('created_at', since).order('created_at', { ascending: false });
  return data || [];
}
async function addStory(text, img) {
  if (!SUPABASE_CONFIGURED || !ME.id) return null;
  const { data } = await sb.from('stories').insert({ user_id: ME.id, text, img }).select().single();
  return data;
}
