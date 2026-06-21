// ===== FRIENDS =====
function renderFriends(){
  const reqHtml=friendRequests.length>0?`
    <div class="section-sub">Friend Request (${friendRequests.length})</div>
    ${friendRequests.map(req=>{
      const dc=getDeptColor(req.dept);
      return `<div class="friend-card">
        <div class="avatar-wrap"><div class="avatar" style="width:44px;height:44px;font-size:16px;background:linear-gradient(135deg,${dc},${dc}88);flex-shrink:0;" onclick="openUserProfile(${req.id})">${req.avatar}</div></div>
        <div style="flex:1;" onclick="openUserProfile(${req.id})">
          <div style="font-size:13px;font-weight:600;color:var(--text);">${req.name}</div>
          <div style="font-size:11px;color:var(--muted);">${getDeptName(req.dept)} • ${req.year}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="acceptRequest(${req.id})" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:20px;padding:6px 14px;color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Accept</button>
          <button onclick="declineRequest(${req.id})" style="background:transparent;border:1px solid var(--bg4);border-radius:20px;padding:6px 14px;color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Decline</button>
        </div>
      </div>`;
    }).join('')}
    <div class="divider"></div>`:'';

  const friendUsers=MOCK_USERS.filter(u=>friends.includes(u.id));
  const friendsHtml=`
    <div class="section-sub">Friends (${friendUsers.length})</div>
    ${friendUsers.map(user=>{
      const dc=getDeptColor(user.dept);
      return `<div class="friend-card">
        <div class="avatar-wrap">
          <div class="avatar" style="width:44px;height:44px;font-size:16px;background:linear-gradient(135deg,${dc},${dc}88);" onclick="openUserProfile(${user.id})">${user.avatar}</div>
          ${user.online?'<div class="online-dot"></div>':''}
        </div>
        <div style="flex:1;" onclick="openUserProfile(${user.id})">
          <div style="font-size:13px;font-weight:600;color:var(--text);">${user.name}</div>
          <div style="display:flex;gap:6px;align-items:center;">
            <span style="font-size:10px;color:${dc};background:${dc}22;padding:1px 6px;border-radius:8px;font-weight:600;">${getDeptName(user.dept)}</span>
            <span style="font-size:11px;color:var(--muted);">${user.year}</span>
          </div>
          <div style="margin-top:2px;">${lastSeenText(user)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
          <button onclick="openMsgFromFriends(${user.id})" style="background:linear-gradient(135deg,#6C63FF22,#4CC9F022);border:1px solid #6C63FF44;border-radius:20px;padding:5px 12px;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Message</button>
          <button onclick="removeFriend(${user.id})" style="background:transparent;border:none;color:var(--muted);font-size:10px;cursor:pointer;font-family:inherit;">Remove</button>
        </div>
      </div>`;
    }).join('')}`;

  document.getElementById('requestsSection').innerHTML=reqHtml;
  document.getElementById('friendsSection').innerHTML=friendsHtml;
  renderFriendSuggestions();
  // Update follow stats
  const ftf=document.getElementById('friendTabFollowers'); if(ftf) ftf.textContent=followersList.length;
  const ftfo=document.getElementById('friendTabFollowing'); if(ftfo) ftfo.textContent=followingList.length;
  const ftfr=document.getElementById('friendTabFriends'); if(ftfr) ftfr.textContent=friends.length;
}

function acceptRequest(userId){
  friends.push(userId); friendRequests=friendRequests.filter(r=>r.id!==userId);
  const u=getUser(userId); if(u) showToast(`${u.name} এখন তোমার ফ্রেন্ড! 🎉`);
  renderFriends(); updateNotifBadge();
}
function declineRequest(userId){
  friendRequests=friendRequests.filter(r=>r.id!==userId);
  renderFriends(); showToast('Request decline করা হয়েছে');
}
function removeFriend(userId){
  friends=friends.filter(id=>id!==userId);
  renderFriends(); showToast('Friend list থেকে সরানো হয়েছে');
}
function openMsgFromFriends(userId){ selectedChat=userId; switchTab('messages'); }

// ===== USER PROFILE VIEW =====
function openUserProfile(userId){
  if(userId===0){ switchTab('profile'); return; }
  if(isBlocked(userId)){ showToast('এই ইউজার ব্লক করা আছে 🚫'); return; }
  const user=getUser(userId); if(!user) return;
  const dc=getDeptColor(user.dept);
  const isFriend=friends.includes(user.id);
  const isFollowingUser=isFollowing(user.id);
  const userPostsList=posts.filter(p=>p.userId===userId);
  // Simulated follower/following counts for other users
  const userFollowers = Math.floor(Math.random()*80)+5;
  const userFollowing = Math.floor(Math.random()*60)+3;
  document.getElementById('userProfileContent').innerHTML=`
    <div style="height:100px;background:linear-gradient(135deg,${dc},${dc}66);position:relative;border-radius:0 0 18px 18px;"></div>
    <div style="display:flex;flex-direction:column;align-items:center;margin-top:-44px;padding:0 16px 16px;">
      <div class="avatar" style="width:88px;height:88px;font-size:32px;background:linear-gradient(135deg,${dc},${dc}cc);border:3px solid var(--bg);">${user.avatar}</div>
      <div style="font-size:18px;font-weight:700;color:var(--text);margin-top:10px;">${user.name} ${user.online?'<span style="color:#06D6A0;font-size:12px;">● অনলাইন</span>':''}</div>
      <div style="display:flex;gap:8px;margin-top:6px;">
        <span class="dept-badge" style="color:${dc};background:${dc}22;">${getDeptName(user.dept)}</span>
        <span style="font-size:11px;color:var(--muted);">${user.year}</span>
      </div>
      <div style="margin-top:5px;">${lastSeenText(user)}</div>
      <div style="font-size:12px;color:var(--muted2);text-align:center;margin-top:8px;line-height:1.6;">${user.bio||''}</div>
      <div style="display:flex;gap:0;margin-top:16px;width:100%;max-width:300px;">
        <div style="flex:1;text-align:center;cursor:pointer;" onclick="showToast('পোস্ট দেখো 👇')">
          <div style="font-size:16px;font-weight:700;color:var(--text);">${userPostsList.length}</div>
          <div style="font-size:10px;color:var(--muted);">পোস্ট</div>
        </div>
        <div style="flex:1;text-align:center;cursor:pointer;" onclick="showToast('${user.name}-এর followers: ${userFollowers}')">
          <div style="font-size:16px;font-weight:700;color:var(--text);">${userFollowers}</div>
          <div style="font-size:10px;color:var(--muted);">Followers</div>
        </div>
        <div style="flex:1;text-align:center;cursor:pointer;" onclick="showToast('${user.name} follow করেন: ${userFollowing} জনকে')">
          <div style="font-size:16px;font-weight:700;color:var(--text);">${userFollowing}</div>
          <div style="font-size:10px;color:var(--muted);">Following</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;justify-content:center;">
        <button onclick="toggleFollow(${userId})" class="follow-btn ${isFollowingUser?'following':'not-following'}" id="followBtn-${userId}">
          ${isFollowingUser?'✓ Following':'+ Follow'}
        </button>
        ${isFriend
          ?`<button onclick="openMsgFromFriends(${userId});closeUserProfile();" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:20px;padding:9px 22px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">💬 Message</button>`
          :`<button onclick="sendFriendRequest(${userId});closeUserProfile();" style="background:transparent;border:1px solid var(--accent);border-radius:20px;padding:9px 22px;color:var(--accent);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">+ Add Friend</button>`
        }
        ${!isFriend && (settings.whoCanMessage||'everyone')==='everyone'
          ?`<button onclick="openMsgFromFriends(${userId});closeUserProfile();" style="background:transparent;border:1px solid #4CC9F088;border-radius:20px;padding:9px 16px;color:#4CC9F0;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">✉️ DM</button>`
          :''
        }
        <button onclick="blockUser(${userId});" style="background:transparent;border:1px solid var(--bg4);border-radius:20px;padding:9px 16px;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">🚫 Block</button>
        <button onclick="copyProfileLink(${userId});" style="background:transparent;border:1px solid var(--bg4);border-radius:20px;padding:9px 16px;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">🔗 Share</button>
        <button onclick="openReportModal('user',${userId},'${user.name.replace(/'/g,"\\'")}');" style="background:transparent;border:1px solid #F7258544;border-radius:20px;padding:9px 16px;color:var(--red);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">🚩 Report</button>
      </div>
    </div>
    <div style="padding:0 16px;">
      <div class="profile-info-card">
        <div style="font-size:12px;font-weight:700;color:var(--muted2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">তথ্য</div>
        <div class="profile-info-row"><span class="label">বিভাগ</span><span>${getDeptName(user.dept)}</span></div>
        <div class="profile-info-row"><span class="label">বর্ষ</span><span>${user.year}</span></div>
        <div class="profile-info-row"><span class="label">ব্লাড গ্রুপ</span><span>${user.blood||'—'}</span></div>
        <div class="profile-info-row"><span class="label">যোগদান</span><span>${user.joined}</span></div>
      </div>
      ${userPostsList.length>0?`
        <div style="font-size:13px;font-weight:700;color:var(--text);margin:14px 0 10px;">পোস্টসমূহ</div>
        ${userPostsList.map(p=>`
          <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:12px;margin-bottom:8px;">
            <p style="font-size:12px;color:var(--text2);line-height:1.6;">${p.text}</p>
            <div style="font-size:10px;color:var(--muted);margin-top:6px;">❤️ ${p.likes} • 💬 ${Array.isArray(p.comments)?p.comments.length:p.comments} • 👁️ ${p.views||0} • ${p.time}</div>
          </div>`).join('')}`:
        `<div class="empty-state"><div class="empty-state-icon">📭</div>এখনো কোনো পোস্ট নেই</div>`
      }
    </div>`;
  document.getElementById('userProfileModal').classList.remove('hidden');
}
function closeUserProfile(){ document.getElementById('userProfileModal').classList.add('hidden'); }

// ===== SHAREABLE LINKS (FB-style: username দিয়ে link বানায়) =====
// Supabase যুক্ত থাকলে real username link (?u=username) ব্যবহার হয়।
// না থাকলে আগের মতো numeric id link (?profile=id) demo হিসেবে কাজ করে।
// type==='profile' হলে id = userId, type==='post' হলে id = postId
function buildShareLink(type, id){
  if(typeof SUPABASE_CONFIGURED !== 'undefined'){
    if(type==='profile'){
      const u = id===0 ? ME : getUser(id);
      if(u && u.username) return buildProfileLink(u.username);
    } else if(type==='post'){
      const post=posts.find(p=>p.id===id);
      if(post){
        const author = post.userId===0 ? ME : getUser(post.userId);
        if(author && author.username) return buildPostLink(author.username, id);
      }
    }
  }
  return `${window.location.origin}${window.location.pathname}?${type}=${id}`;
}
function copyProfileLink(userId){
  const url=buildShareLink('profile', userId);
  if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>showToast('🔗 প্রোফাইল লিংক কপি হয়েছে!')).catch(()=>showToast('🔗 প্রোফাইল লিংক কপি হয়েছে!'));
  else showToast('🔗 প্রোফাইল লিংক কপি হয়েছে!');
}
async function handleDeepLink(){
  // নতুন format: ?u=username&post=postId (real, Supabase-backed)
  if(typeof handleRealDeepLink === 'function'){
    const handled = await handleRealDeepLink();
    if(handled) return;
  }
  // পুরনো format: ?profile=id&post=id (demo mode fallback)
  const params=new URLSearchParams(window.location.search);
  const profileId=params.get('profile');
  const postId=params.get('post');
  if(profileId!==null){
    const uid=parseInt(profileId);
    if(!isNaN(uid) && (uid===0 || getUser(uid))){ openUserProfile(uid); return; }
  }
  if(postId!==null){
    const pid=parseInt(postId);
    const post=posts.find(p=>p.id===pid);
    if(post){
      switchTab('feed');
      setTimeout(()=>{
        const el=document.getElementById('postcard-'+pid);
        if(el){ el.scrollIntoView({behavior:'smooth',block:'center'}); el.style.outline='2px solid var(--accent)'; el.style.borderRadius='14px'; setTimeout(()=>{ el.style.outline=''; },2500); }
      },250);
    }
  }
}

// ===== TABS =====
function switchTab(tab){
  activeTab=tab;
  if(tab!=='messages') selectedChat=null;
  if(tab!=='groups'){ document.getElementById('groupsListView').classList.remove('hidden'); document.getElementById('groupChatView').classList.add('hidden'); }
  ['feed','messages','groups','friends','study','profile'].forEach(t=>{
    document.getElementById('tab-'+t).classList.toggle('hidden',t!==tab);
    const navBtn=document.getElementById('nav-'+t);
    const label=navBtn.querySelector('.nav-label');
    const dot=navBtn.querySelector('.nav-dot');
    const svg=navBtn.querySelector('svg');
    const isActive=t===tab;
    label.classList.toggle('active',isActive);
    if(dot) dot.style.display=isActive?'block':'none';
    if(svg) svg.setAttribute('stroke',isActive?'#6C63FF':'var(--muted)');
  });
  if(tab==='messages') renderMsgList();
  if(tab==='groups') renderGroups();
  if(tab==='friends') renderFriends();
  if(tab==='profile') renderProfile();
  if(tab==='study') renderStudyHub();
}

document.querySelectorAll('.nav-btn').forEach(btn=>{
  const dot=btn.querySelector('.nav-dot');
  if(dot&&btn.id!=='nav-feed') dot.style.display='none';
});

// ===== PROFILE =====
function setProfileSubTab(tab){
  profileSubTab=tab;
  ['about','posts','saved','friends','settings'].forEach(t=>{
    const el=document.getElementById('ptab-'+t); if(el) el.classList.toggle('active',t===tab);
  });
  renderProfileSubContent();
}

function renderProfile(){
  const dc=getDeptColor(ME.dept);
  const avEl=document.getElementById('profileAvatarBig');
  if(ME.profileImg){
    avEl.innerHTML=`<img src="${ME.profileImg}" style="width:88px;height:88px;border-radius:50%;object-fit:cover;"><div class="profile-online-ring"></div>`;
    avEl.style.background='none';
  } else {
    avEl.innerHTML=`${ME.avatar}<div class="profile-online-ring"></div>`;
    avEl.style.background=`linear-gradient(135deg,${dc},${dc}cc)`;
  }
  document.getElementById('profileNameBig').textContent=ME.name;
  const headerAvEl=document.getElementById('meAvatarHeader');
  if(ME.profileImg){ headerAvEl.innerHTML=`<img src="${ME.profileImg}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`; headerAvEl.style.background='none'; }
  else { headerAvEl.textContent=ME.avatar; headerAvEl.style.background=''; }
  const pbAvEl=document.getElementById('postBoxAvatar');
  if(ME.profileImg){ pbAvEl.innerHTML=`<img src="${ME.profileImg}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;">`; pbAvEl.style.background='none'; }
  else { pbAvEl.textContent=ME.avatar; pbAvEl.style.background=`linear-gradient(135deg,${dc},${dc}88)`; }
  document.getElementById('profileMetaRow').innerHTML = isTeacher() ? `
    <span class="dept-badge" style="color:${dc};background:${dc}22;">${getDeptName(ME.dept)}</span>
    <span class="badge-pill" style="background:#6C63FF22;color:#6C63FF;">👨‍🏫 শিক্ষক${ME.designation?' • '+ME.designation:''}</span>
    ${ME.blood?`<span class="badge-pill" style="background:#F7258522;color:#F72585;">🩸 ${ME.blood}</span>`:''}` : `
    <span class="dept-badge" style="color:${dc};background:${dc}22;">${getDeptName(ME.dept)}</span>
    <span style="font-size:11px;color:var(--muted);">${ME.year}</span>
    ${isCR()?`<span class="badge-pill" style="background:#06D6A022;color:#06D6A0;">🧑‍🤝‍🧑 CR</span>`:''}
    ${ME.blood?`<span class="badge-pill" style="background:#F7258522;color:#F72585;">🩸 ${ME.blood}</span>`:''}`;
  document.getElementById('profileBio').textContent=ME.bio||'';
  // Activity Badge
  const badgeEl=document.getElementById('profileActivityBadge');
  if(badgeEl){
    const joinedYear=ME.joined?parseInt(ME.joined.match(/\d{4}/)?.[0]||'2024'):2024;
    const currentYear=new Date().getFullYear();
    const monthsActive=Math.max(1,Math.round((Date.now()-new Date(joinedYear+'-01-01').getTime())/(1000*60*60*24*30)));
    let badgeLabel='', badgeColor='', badgeIcon='';
    if(monthsActive>=24){ badgeLabel='OG Member'; badgeColor='#FFD700'; badgeIcon='👑'; }
    else if(monthsActive>=12){ badgeLabel='১ বছর+ Active'; badgeColor='#9B5DE5'; badgeIcon='⭐'; }
    else if(monthsActive>=6){ badgeLabel='৬ মাস+ Active'; badgeColor='#06D6A0'; badgeIcon='🌟'; }
    else if(monthsActive>=3){ badgeLabel='৩ মাস+ Active'; badgeColor='#4CC9F0'; badgeIcon='✨'; }
    else{ badgeLabel='নতুন সদস্য'; badgeColor='#6C63FF'; badgeIcon='🆕'; }
    badgeEl.innerHTML=`<span style="display:inline-flex;align-items:center;gap:4px;background:${badgeColor}22;border:1px solid ${badgeColor}55;color:${badgeColor};border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;">${badgeIcon} ${badgeLabel}</span>`;
  }
  const myPosts=posts.filter(p=>p.userId===0);
  const totalLikes=myPosts.reduce((s,p)=>s+p.likes,0);
  document.getElementById('statPosts').textContent=myPosts.length;
  document.getElementById('statFriends').textContent=friends.length;
  document.getElementById('statSaved').textContent=savedPosts.length;
  document.getElementById('statLikes').textContent=totalLikes;
  // Update following/follower counts
  const sfEl=document.getElementById('statFollowing'); if(sfEl) sfEl.textContent=followingList.length;
  const sfrEl=document.getElementById('statFollowers'); if(sfrEl) sfrEl.textContent=followersList.length;
  setProfileSubTab(profileSubTab);
}

function renderProfileSubContent(){
  const c=document.getElementById('profileSubContent');
  if(profileSubTab==='about'){
    c.innerHTML=`<div class="profile-info-card">
      <div class="profile-info-row"><span class="label">বিভাগ</span><span>${getDeptName(ME.dept)}</span></div>
      ${isTeacher()?
        `<div class="profile-info-row"><span class="label">পদবি</span><span>${ME.designation||'সেট করা হয়নি'}</span></div>`:
        `<div class="profile-info-row"><span class="label">বর্ষ</span><span>${ME.year}</span></div>`}
      <div class="profile-info-row"><span class="label">ব্লাড গ্রুপ</span><span>${ME.blood||'—'}</span></div>
      <div class="profile-info-row"><span class="label">ফোন</span><span>${ME.phone||'যুক্ত করা হয়নি'}</span></div>
      <div class="profile-info-row"><span class="label">Facebook</span><span>${ME.facebook?`<a href="https://${ME.facebook}" target="_blank" style="color:var(--accent);text-decoration:none;">${ME.facebook}</a>`:'যুক্ত করা হয়নি'}</span></div>
      <div class="profile-info-row"><span class="label">Instagram</span><span>${ME.instagram||'যুক্ত করা হয়নি'}</span></div>
      <div class="profile-info-row"><span class="label">যোগদান</span><span>${ME.joined}</span></div>
    </div>`;
  } else if(profileSubTab==='posts'){
    const myPosts=posts.filter(p=>p.userId===0);
    if(myPosts.length===0){
      c.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📝</div>তুমি এখনো কোনো পোস্ট করোনি</div>`;
    } else {
      // Pinned post সবার আগে
      const pinned=pinnedPostId?myPosts.find(p=>p.id===pinnedPostId):null;
      const others=myPosts.filter(p=>p.id!==pinnedPostId);
      const orderedPosts=pinned?[pinned,...others]:others;
      const postsHtml=orderedPosts.map(p=>{
        const isPinned=p.id===pinnedPostId;
        return `<div style="position:relative;">
          ${isPinned?`<div style="display:flex;align-items:center;gap:4px;padding:6px 14px 0;font-size:11px;color:#6C63FF;font-weight:700;">📌 Pinned Post</div>`:''}
          <div style="position:absolute;top:${isPinned?'24':'4'}px;right:10px;z-index:2;">
            <button onclick="togglePinPost(${p.id})" style="background:${isPinned?'#6C63FF22':'rgba(0,0,0,0.05)'};border:1px solid ${isPinned?'#6C63FF55':'#ccc3'};border-radius:20px;padding:3px 8px;font-size:10px;color:${isPinned?'#6C63FF':'var(--muted)'};cursor:pointer;font-weight:600;font-family:inherit;" title="${isPinned?'Unpin করো':'Pin করো'}">${isPinned?'📌 Pinned':'📌 Pin'}</button>
          </div>
          ${renderPostCard(p)}
        </div>`;
      }).join('');
      c.innerHTML=`<div style="padding-top:10px;">${postsHtml}</div>`;
    }
  } else if(profileSubTab==='saved'){
    // SECURITY GUARD: saved posts are private and must only ever render
    // inside the logged-in user's own profile tab. If this code path is
    // ever reached while another user's profile modal is open, abort.
    const otherProfileModal=document.getElementById('userProfileModal');
    const viewingOtherProfile=otherProfileModal && !otherProfileModal.classList.contains('hidden');
    if(activeTab!=='profile' || viewingOtherProfile){
      c.innerHTML='';
      return;
    }
    // Collect all saved posts from feed + group posts
    let allSaved=posts.filter(p=>savedPosts.includes(p.id));
    for(const gid of Object.keys(groupPosts)){
      const gSaved=groupPosts[gid].filter(p=>savedPosts.includes(p.id));
      allSaved=allSaved.concat(gSaved);
    }
    // Remove duplicates
    const seenIds=new Set(); allSaved=allSaved.filter(p=>{ if(seenIds.has(p.id)) return false; seenIds.add(p.id); return true; });
    // Filter
    const sf=window._savedFilter||'all';
    let filtered=allSaved;
    if(sf==='mine') filtered=allSaved.filter(p=>p.userId===0);
    else if(sf==='others') filtered=allSaved.filter(p=>p.userId!==0);
    const countBadge=allSaved.length>0?`<span class="saved-count-badge">${allSaved.length}</span>`:'';
    const filterHtml=`
      <div class="saved-header">
        <div class="saved-title">🔖 সেভ করা পোস্ট ${countBadge}</div>
      </div>
      <div class="saved-filter-row">
        <button class="saved-filter-btn ${sf==='all'?'active':''}" onclick="setSavedFilter('all')">সব</button>
        <button class="saved-filter-btn ${sf==='mine'?'active':''}" onclick="setSavedFilter('mine')">আমার পোস্ট</button>
        <button class="saved-filter-btn ${sf==='others'?'active':''}" onclick="setSavedFilter('others')">অন্যদের পোস্ট</button>
      </div>`;
    if(filtered.length===0){
      c.innerHTML=filterHtml+`<div class="saved-empty">
        <div class="saved-empty-icon">🔖</div>
        <div class="saved-empty-title">${allSaved.length===0?'কোনো পোস্ট সেভ করা নেই':'এই ক্যাটাগরিতে কিছু নেই'}</div>
        <div class="saved-empty-sub">${allSaved.length===0?'Feed থেকে পোস্টের বুকমার্ক আইকনে ক্লিক করলে এখানে দেখা যাবে।':'ভিন্ন ফিল্টার বেছে নাও।'}</div>
        ${allSaved.length===0?`<button class="saved-empty-btn" onclick="switchTab('feed')">Feed দেখো</button>`:''}
      </div>`;
    } else {
      const postsHtml=filtered.map(p=>`
        <div class="saved-post-wrap">
          <button class="saved-remove-btn" onclick="toggleSave(${p.id})" title="সরাও">✕</button>
          ${renderPostCard(p)}
        </div>`).join('');
      c.innerHTML=filterHtml+`<div style="padding-top:4px;">${postsHtml}</div>`;
    }
  } else if(profileSubTab==='friends'){
    const friendUsers=MOCK_USERS.filter(u=>friends.includes(u.id));
    c.innerHTML=`<div style="padding:14px 16px;">${friendUsers.map(user=>{
      const dc=getDeptColor(user.dept);
      return `<div class="friend-card">
        <div class="avatar-wrap"><div class="avatar" style="width:40px;height:40px;font-size:15px;background:linear-gradient(135deg,${dc},${dc}88);" onclick="openUserProfile(${user.id})">${user.avatar}</div>${user.online?'<div class="online-dot"></div>':''}</div>
        <div style="flex:1;" onclick="openUserProfile(${user.id})"><div style="font-size:13px;font-weight:600;color:var(--text);">${user.name}</div><div style="font-size:11px;color:var(--muted);">${getDeptName(user.dept)} • ${user.year}</div></div>
        <button onclick="openMsgFromFriends(${user.id})" style="background:linear-gradient(135deg,#6C63FF22,#4CC9F022);border:1px solid #6C63FF44;border-radius:20px;padding:5px 12px;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">DM</button>
      </div>`;
    }).join('')||`<div class="empty-state"><div class="empty-state-icon">👥</div>কোনো ফ্রেন্ড নেই</div>`}</div>`;
  } else if(profileSubTab==='settings'){
    c.innerHTML=renderSettingsHtml();
  }
}

function changeCoverPhoto(){
  const colors=[
    'linear-gradient(135deg,#6C63FF,#4CC9F0)',
    'linear-gradient(135deg,#F72585,#7209B7)',
    'linear-gradient(135deg,#06D6A0,#118AB2)',
    'linear-gradient(135deg,#E9C46A,#F4A261)',
    'linear-gradient(135deg,#2A9D8F,#457B9D)',
    'linear-gradient(135deg,#9B5DE5,#F15BB5)',
  ];
  const current=document.getElementById('coverBg').style.background;
  const idx=colors.findIndex(c=>c===current);
  const next=colors[(idx+1)%colors.length];
  document.getElementById('coverBg').style.background=next;
  // Reset cover image when switching to gradient
  document.getElementById('coverBg').style.backgroundImage='';
  document.getElementById('coverBg').style.backgroundSize='';
  showToast('Cover color পরিবর্তন হয়েছে ✅');
}

function handleCoverPhotoUpload(input){
  const file=input.files[0]; if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('শুধু ছবি ফাইল দিন'); return; }
  const reader=new FileReader();
  reader.onload=ev=>{
    const coverBg=document.getElementById('coverBg');
    coverBg.style.background='none';
    coverBg.style.backgroundImage=`url('${ev.target.result}')`;
    coverBg.style.backgroundSize='cover';
    coverBg.style.backgroundPosition='center';
    showToast('Cover photo আপলোড হয়েছে ✅');
  };
  reader.readAsDataURL(file);
  input.value=''; // reset so same file can be re-selected
}

function togglePinPost(postId){
  if(pinnedPostId===postId){
    pinnedPostId=null;
    showToast('পোস্ট Unpin করা হয়েছে');
  } else {
    pinnedPostId=postId;
    showToast('পোস্ট Pin করা হয়েছে 📌');
  }
  renderProfileSubContent();
}

// ===== SETTINGS =====
function renderSettingsHtml(){
  const toggleRow=(key,icon,bg,label,sub)=>`
    <div class="settings-row">
      <div class="settings-row-icon" style="background:${bg};">${icon}</div>
      <div><div class="settings-row-text">${label}</div>${sub?`<div class="settings-row-sub">${sub}</div>`:''}</div>
      <div class="toggle-switch ${settings[key]?'on':''}" onclick="toggleSetting('${key}')" style="margin-left:auto;"><div class="toggle-knob"></div></div>
    </div>`;
  const linkRow=(icon,bg,label,sub,onclick,danger)=>`
    <div class="settings-row${danger?' danger':''}" onclick="${onclick}">
      <div class="settings-row-icon" style="background:${bg};">${icon}</div>
      <div style="flex:1;"><div class="settings-row-text">${label}</div>${sub?`<div class="settings-row-sub">${sub}</div>`:''}</div>
      <svg class="chevron" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`;
  // 3-way pill selector row, used for default audience / who-can-message / profile visibility
  const pillRow=(icon,bg,label,sub,settingKey,options)=>`
    <div class="settings-row" style="flex-direction:column;align-items:stretch;cursor:default;">
      <div style="display:flex;align-items:center;gap:12px;padding-bottom:4px;">
        <div class="settings-row-icon" style="background:${bg};">${icon}</div>
        <div><div class="settings-row-text">${label}</div><div class="settings-row-sub">${sub}</div></div>
      </div>
      <div class="theme-options">
        ${options.map(o=>`<div class="theme-opt ${settings[settingKey]===o.value?'active':''}" onclick="setPillSetting('${settingKey}','${o.value}')"><div class="theme-opt-icon">${o.icon}</div>${o.label}</div>`).join('')}
      </div>
    </div>`;
  return `
    <div class="settings-group"><div class="settings-group-title">${t('account')}</div><div class="settings-card">
      ${linkRow('✏️','#6C63FF22',t('editProfile'),t('editProfileSub'),'openEditProfile()')}
      ${linkRow('🔒','#4CC9F022',t('changePass'),t('changePassSub'),'openChangePasswordModal()')}
      ${linkRow('📧','#06D6A022',t('changeEmail'),t('changeEmailSub'),"showToast('Gmail পরিবর্তন করতে Support এ যোগাযোগ করো')")}
    </div></div>
    ${isTeacher()?`<div class="settings-group"><div class="settings-group-title">শিক্ষক সেটিংস</div><div class="settings-card">
      <div class="settings-row" style="flex-direction:column;align-items:stretch;cursor:default;">
        <div style="display:flex;align-items:center;gap:12px;padding-bottom:4px;">
          <div class="settings-row-icon" style="background:#6C63FF22;">🎓</div>
          <div><div class="settings-row-text">পদবি (Designation)</div><div class="settings-row-sub">তোমার পদবি বেছে নাও — এটা প্রোফাইলে দেখাবে</div></div>
        </div>
        <select class="form-select" style="margin-top:8px;" onchange="setDesignation(this.value)">
          <option value="">পদবি বেছে নাও</option>
          ${DESIGNATIONS.map(d=>`<option value="${d}" ${ME.designation===d?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
    </div></div>`:''}
    <div class="settings-group"><div class="settings-group-title">${t('notifications')}</div><div class="settings-card">
      ${toggleRow('notifPush','🔔','#6C63FF22',t('pushNotif'),t('pushNotifSub'))}
      ${toggleRow('notifLikes','❤️','#F7258522',t('likeNotif'))}
      ${toggleRow('notifComments','💬','#4CC9F022',t('commentNotif'))}
      ${toggleRow('notifMentions','@','#6C63FF22',t('mentionNotif'))}
      ${toggleRow('notifMessages','✉️','#6C63FF22',t('msgNotif'))}
      ${toggleRow('notifGroups','👥','#06D6A022',t('groupNotif'))}
    </div></div>
    <div class="settings-group"><div class="settings-group-title">${t('privacy')}</div><div class="settings-card">
      ${pillRow('🌍','#6C63FF22',t('defaultAudience'),t('defaultAudienceSub'),'defaultAudience',[
        {value:'public',icon:'🌍',label:t('everyone')},
        {value:'friends',icon:'👥',label:t('friendsOnly')},
        {value:'private',icon:'🔒',label:t('onlyMe')}
      ])}
      ${pillRow('✉️','#4CC9F022',t('whoCanMessage'),t('whoCanMessageSub'),'whoCanMessage',[
        {value:'everyone',icon:'🌍',label:t('everyone')},
        {value:'friends',icon:'👥',label:t('friendsOnly')}
      ])}
      ${pillRow('👁️','#9B5DE522',t('profileVisibility'),t('profileVisibilitySub'),'profileVisibility',[
        {value:'public',icon:'🌍',label:t('everyone')},
        {value:'friends',icon:'👥',label:t('friendsOnly')},
        {value:'private',icon:'🔒',label:t('onlyMe')}
      ])}
      ${toggleRow('showOnline','🟢','#06D6A022',t('showOnline'))}
      ${linkRow('🚫','#F7258522',t('blockedUsers'),blockedUsers.length?blockedUsers.length+' '+t('blockedCount'):t('noBlocked'),'openBlockedUsersModal()')}
    </div></div>
    <div class="settings-group"><div class="settings-group-title">${t('display')}</div><div class="settings-card">
      ${pillRow('🌙','#6C63FF22',t('themeMode'),t('themeModeSub'),'themeMode',[
        {value:'auto',icon:'⚙️',label:t('auto')},
        {value:'dark',icon:'🌙',label:t('dark')},
        {value:'light',icon:'☀️',label:t('light')}
      ])}
      <div class="settings-row" style="flex-direction:column;align-items:stretch;cursor:default;">
        <div style="display:flex;align-items:center;gap:12px;padding-bottom:4px;">
          <div class="settings-row-icon" style="background:#06D6A022;">🌐</div>
          <div><div class="settings-row-text">${t('language')}</div><div class="settings-row-sub">${t('languageSub')}</div></div>
        </div>
        <div class="theme-options">
          <div class="theme-opt ${settings.language==='bn'?'active':''}" onclick="setLanguage('bn')"><div class="theme-opt-icon">🇧🇩</div>${t('bangla')}</div>
          <div class="theme-opt ${settings.language==='en'?'active':''}" onclick="setLanguage('en')"><div class="theme-opt-icon">🇬🇧</div>${t('english')}</div>
        </div>
      </div>
    </div></div>
    <div class="settings-group"><div class="settings-group-title">${t('app')}</div><div class="settings-card">
      ${linkRow('📲','#4CC9F022',t('installApp'),t('installAppSub'),'installPWA()')}
    </div></div>
    <div class="settings-group"><div class="settings-group-title">${t('support')}</div><div class="settings-card">
      ${linkRow('❓','#4CC9F022',t('helpCenter'),null,"openInfoModal('"+t('helpCenter')+"','<div style=\\'font-size:12px;color:var(--text2);line-height:1.7;\\'>কোনো সমস্যা হলে কলেজ আইসিটি সেলের সাথে যোগাযোগ করো বা admin@debendracollege.edu.bd তে ইমেইল করো।</div>')")}
      ${linkRow('📋','#06D6A022',t('policy'),null,"openInfoModal('"+t('policy')+"','<div style=\\'font-size:12px;color:var(--text2);line-height:1.7;\\'>এই প্ল্যাটফর্ম শুধুমাত্র Debendra College এর শিক্ষার্থীদের জন্য। সবাইকে সম্মানজনক আচরণ বজায় রাখতে হবে।</div>')")}
    </div></div>
    <div class="settings-group"><div class="settings-group-title">${t('accountActions')}</div><div class="settings-card">
      ${linkRow('🙈','#F4A26122',t('deactivate'),t('deactivateSub'),'openDeactivateAccountModal()')}
      ${linkRow('🗑️','#F7258522',t('deleteAccount'),t('deleteAccountSub'),'openDeleteAccountModal()',true)}
    </div></div>
    <div class="settings-group"><div class="settings-card">
      <div class="settings-row danger" onclick="confirmLogout()">
        <div class="settings-row-icon" style="background:#F7258522;">🚪</div>
        <div class="settings-row-text">${t('logout')}</div>
      </div>
    </div></div>`;
}

function setDesignation(value){
  ME.designation = value;
  if(currentAccount) currentAccount.designation = value;
  renderProfile();
  showToast(value?'পদবি সেট হয়েছে ✅':'পদবি মুছে ফেলা হয়েছে');
  saveAppData();
}

function setPillSetting(key, value){
  settings[key]=value;
  if(key==='themeMode') applyTheme();
  if(key==='defaultAudience') postAudience=value; // keep composer default in sync
  renderProfileSubContent();
  saveAppData();
}
function setLanguage(lang){
  settings.language=lang;
  renderProfileSubContent();
  saveAppData();
  showToast(lang==='bn'?'ভাষা বাংলা করা হয়েছে ✅':'Language switched to English ✅');
}

function toggleSetting(key){
  settings[key]=!settings[key];
  if(key==='notifPush' && settings.notifPush) showPushBannerIfNeeded();
  if(key==='darkMode'){ applyTheme(); }
  renderProfileSubContent();
  saveAppData();
}
function confirmLogout(){
  currentAccount=null;
  document.getElementById('authScreen').classList.remove('hidden');
  showAuthTab('login');
  showToast('লগ আউট করা হয়েছে 👋');
}

// ===== ACCOUNT DEACTIVATE / DELETE =====
function openDeactivateAccountModal(){
  const isBn=(settings.language!=='en');
  openInfoModal(
    isBn?'অ্যাকাউন্ট ডিএক্টিভেট করো':'Deactivate Account',
    `<div style="font-size:12px;color:var(--muted2);line-height:1.7;margin-bottom:16px;">
      ${isBn
        ? 'ডিএক্টিভেট করলে তোমার প্রোফাইল, পোস্ট এবং কমেন্ট অন্যদের কাছে আপাতত দেখা যাবে না। তুমি যখনই চাও, একই অ্যাকাউন্টে আবার লগইন করে ফিরে আসতে পারবে — কোনো তথ্য হারাবে না।'
        : 'Deactivating will temporarily hide your profile, posts, and comments from others. You can come back anytime by logging in again with the same account — nothing will be lost.'}
    </div>
    <button class="modal-save-btn" style="background:linear-gradient(135deg,#F4A261,#E76F51);" onclick="deactivateAccount()">${isBn?'ডিএক্টিভেট করো 🙈':'Deactivate 🙈'}</button>
    <button class="modal-save-btn" style="background:transparent;border:1px solid var(--bg4);color:var(--muted);margin-top:8px;" onclick="closeInfoModal()">${isBn?'বাতিল':'Cancel'}</button>`
  );
}
function deactivateAccount(){
  accountDeactivated=true;
  closeInfoModal();
  saveAppData();
  showToast(settings.language==='en'?'Account deactivated 🙈':'অ্যাকাউন্ট ডিএক্টিভেট করা হয়েছে 🙈');
  // Log the user out — profile is hidden until they log back in
  setTimeout(()=>{
    currentAccount=null;
    document.getElementById('authScreen').classList.remove('hidden');
    showAuthTab('login');
  }, 600);
}

function openDeleteAccountModal(){
  const isBn=(settings.language!=='en');
  openInfoModal(
    isBn?'অ্যাকাউন্ট ডিলিট করো':'Delete Account',
    `<div style="font-size:12px;color:var(--red);line-height:1.7;margin-bottom:12px;font-weight:600;">
      ⚠️ ${isBn?'এই কাজটি স্থায়ী এবং ফিরিয়ে আনা যাবে না।':'This action is permanent and cannot be undone.'}
    </div>
    <div style="font-size:12px;color:var(--muted2);line-height:1.7;margin-bottom:16px;">
      ${isBn
        ? 'অ্যাকাউন্ট ডিলিট করলে তোমার প্রোফাইল, পোস্ট, কমেন্ট, মেসেজ এবং সব তথ্য স্থায়ীভাবে মুছে যাবে।'
        : 'Deleting your account will permanently erase your profile, posts, comments, messages, and all related data.'}
    </div>
    <div class="form-group">
      <label class="form-label">${isBn?'নিশ্চিত করতে তোমার পাসওয়ার্ড দাও':'Enter your password to confirm'}</label>
      <input class="form-input" id="delAccPass" type="password" placeholder="${isBn?'পাসওয়ার্ড':'Password'}"/>
    </div>
    <div id="delAccError" style="font-size:11px;color:var(--red);margin-bottom:8px;display:none;"></div>
    <button class="modal-save-btn" style="background:var(--red);" onclick="deleteAccount()">${isBn?'স্থায়ীভাবে ডিলিট করো 🗑️':'Permanently Delete 🗑️'}</button>
    <button class="modal-save-btn" style="background:transparent;border:1px solid var(--bg4);color:var(--muted);margin-top:8px;" onclick="closeInfoModal()">${isBn?'বাতিল':'Cancel'}</button>`
  );
}
function deleteAccount(){
  const isBn=(settings.language!=='en');
  const pass=document.getElementById('delAccPass')?.value||'';
  const errEl=document.getElementById('delAccError');
  const acc=currentAccount || registeredAccounts[0];
  if(!acc||acc.pass!==pass){
    if(errEl){ errEl.textContent=isBn?'পাসওয়ার্ড ভুল':'Incorrect password'; errEl.style.display='block'; }
    return;
  }
  showConfirmDialog(
    isBn?'🗑️ একদম নিশ্চিত?':'🗑️ Are you absolutely sure?',
    isBn?'এই অ্যাকাউন্ট ও এর সব তথ্য স্থায়ীভাবে মুছে যাবে। এটি আর ফিরিয়ে আনা যাবে না।':'This account and all its data will be permanently erased. This cannot be undone.',
    isBn?'হ্যাঁ, ডিলিট করো':'Yes, delete it',
    ()=>{
      registeredAccounts=registeredAccounts.filter(a=>a!==acc);
      try{
        ['dc_settings','dc_blocked','dc_dismissed_suggest','dc_study_notes','dc_study_routine','dc_study_exams','dc_study_videos','dc_following','dc_followers','dc_theme','dc_push_dismissed','dc_pwa_dismissed']
          .forEach(k=>localStorage.removeItem(k));
      }catch(e){}
      closeInfoModal();
      currentAccount=null;
      document.getElementById('authScreen').classList.remove('hidden');
      showAuthTab('login');
      showToast(isBn?'অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করা হয়েছে':'Account permanently deleted');
    }
  );
}

