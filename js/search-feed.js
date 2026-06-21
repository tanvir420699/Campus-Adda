// ===== SEARCH =====
let searchTabVal="all";
function openSearch(){
  document.getElementById('searchOverlay').classList.remove('hidden');
  document.getElementById('searchInput').value='';
  document.getElementById('searchInput').focus();
  renderSearchResults();
}
function closeSearch(){ document.getElementById('searchOverlay').classList.add('hidden'); }
function setSearchTab(t){
  searchTabVal=t;
  ['all','users','groups','posts'].forEach(x=>document.getElementById('stab-'+x).classList.toggle('active',x===t));
  renderSearchResults();
}
function renderSearchResults(){
  const q=document.getElementById('searchInput').value.trim().toLowerCase();
  const c=document.getElementById('searchResults');
  if(!q){ c.innerHTML=`<div class="search-empty">🔍 নাম, বিভাগ বা বিষয় লিখে খোঁজো</div>`; return; }
  let html='';
  if(searchTabVal==='all'||searchTabVal==='users'){
    const users=MOCK_USERS.filter(u=>u.name.toLowerCase().includes(q)||getDeptName(u.dept).toLowerCase().includes(q));
    if(users.length){ html+=`<div class="section-sub">ছাত্র-ছাত্রী</div>`+users.map(u=>userCard(u)).join(''); }
  }
  if(searchTabVal==='all'||searchTabVal==='groups'){
    const grps=studyGroups.filter(g=>g.name.toLowerCase().includes(q)||getDeptName(g.dept).toLowerCase().includes(q));
    if(grps.length){ html+=`<div class="section-sub" style="margin-top:12px;">গ্রুপ</div>`+grps.map(g=>groupSearchCard(g)).join(''); }
  }
  if(searchTabVal==='all'||searchTabVal==='posts'){
    const ps=posts.filter(p=>p.text.toLowerCase().includes(q));
    if(ps.length){ html+=`<div class="section-sub" style="margin-top:12px;">পোস্ট</div>`+ps.map(p=>postMiniCard(p)).join(''); }
  }
  c.innerHTML=html||`<div class="search-empty">"${q}" এর সাথে মিলে এমন কিছু পাওয়া যায়নি 😕</div>`;
}
function userCard(user){
  if(isBlocked(user.id)) return '';
  const dc=getDeptColor(user.dept);
  const isFriend=friends.includes(user.id);
  return `<div class="friend-card" style="margin-bottom:10px;">
    <div class="avatar-wrap"><div class="avatar" style="width:44px;height:44px;font-size:16px;background:linear-gradient(135deg,${dc},${dc}88);" onclick="openUserProfile(${user.id})">${user.avatar}</div>${user.online?'<div class="online-dot"></div>':''}</div>
    <div style="flex:1;" onclick="openUserProfile(${user.id})">
      <div style="font-size:13px;font-weight:600;color:var(--text);">${user.name}</div>
      <div style="font-size:11px;color:var(--muted);">${getDeptName(user.dept)} • ${user.year}</div>
    </div>
    ${isFriend?`<button onclick="openMsgFromFriends(${user.id});closeSearch();" style="background:linear-gradient(135deg,#6C63FF22,#4CC9F022);border:1px solid #6C63FF44;border-radius:20px;padding:5px 12px;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Message</button>`
    :`<button onclick="sendFriendRequest(${user.id})" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:20px;padding:5px 12px;color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">+ Add</button>`}
  </div>`;
}
function groupSearchCard(g){
  const dc=getDeptColor(g.dept);
  const joined=joinedGroups.includes(g.id);
  return `<div class="group-card" style="border-left:3px solid ${dc};margin-bottom:10px;">
    <div style="flex:1;">
      <div class="group-name">${g.name}</div>
      <div class="group-meta"><span style="font-size:10px;color:${dc};background:${dc}22;padding:2px 8px;border-radius:10px;font-weight:600;">${getDeptName(g.dept)}</span><span class="group-members">👥 ${g.members}</span>${g.active?'<span class="active-label">● সক্রিয়</span>':''}</div>
    </div>
    <button onclick="toggleGroup(${g.id})" style="background:${joined?'transparent':`linear-gradient(135deg,${dc},${dc}bb)`};border:1px solid ${dc};color:${joined?dc:'#fff'};border-radius:20px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;margin-top:8px;">${joined?'ছেড়ে দাও':'যোগ দাও'}</button>
  </div>`;
}
function postMiniCard(p){
  const user=p.userId===0?ME:getUser(p.userId); if(!user) return '';
  const dc=getDeptColor(user.dept);
  return `<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:12px;margin-bottom:8px;" onclick="closeSearch();setDeptFilter('all');switchTab('feed');">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
      <div class="avatar" style="width:28px;height:28px;font-size:11px;background:linear-gradient(135deg,${dc},${dc}88);">${user.avatar}</div>
      <span style="font-size:12px;font-weight:600;color:var(--text);">${user.name}</span>
      <span style="font-size:10px;color:var(--muted);">${p.time}</span>
    </div>
    <p style="font-size:12px;color:var(--text2);line-height:1.6;">${p.text.substring(0,100)}${p.text.length>100?'...':''}</p>
  </div>`;
}
function sendFriendRequest(userId){
  if(friends.includes(userId)||friendRequests.some(r=>r.id===userId)){ showToast('ইতিমধ্যে request পাঠানো হয়েছে'); return; }
  const u=getUser(userId); if(!u) return;
  showToast(`${u.name} কে friend request পাঠানো হয়েছে! 👋`);
}

// ===== FEED =====
function renderDeptFilter(){
  const c=document.getElementById('deptFilter');
  let html=`<button class="filter-btn" onclick="setDeptFilter('all')" style="background:${deptFilter==='all'?'linear-gradient(135deg,#6C63FF,#4CC9F0)':'var(--bg2)'};border:1px solid ${deptFilter==='all'?'transparent':'var(--border2)'};color:var(--text);">সব</button>`;
  DEPARTMENTS.forEach(d=>{
    const active=deptFilter===d.id;
    html+=`<button class="filter-btn" onclick="setDeptFilter('${d.id}')" style="background:${active?d.color+'33':'var(--bg2)'};border:1px solid ${active?d.color:'var(--border2)'};color:${active?d.color:'var(--muted2)'};">${d.short}</button>`;
  });
  c.innerHTML=html;
}
function setDeptFilter(f){ deptFilter=f; renderDeptFilter(); renderPosts(); }

function renderPosts(){
  let filtered=(deptFilter==='all'?posts:posts.filter(p=>p.dept===deptFilter)).filter(p=>canViewPost(p));
  // Sort: trending (10+ likes or 5+ comments) float to top
  filtered = filtered.slice().sort((a,b)=>{
    const aScore = a.likes + Object.values(a.reactions||{}).reduce((s,v)=>s+v,0) + (Array.isArray(a.comments)?a.comments.length:0)*2;
    const bScore = b.likes + Object.values(b.reactions||{}).reduce((s,v)=>s+v,0) + (Array.isArray(b.comments)?b.comments.length:0)*2;
    if(aScore>=10 && bScore<10) return -1;
    if(bScore>=10 && aScore<10) return 1;
    return b.id - a.id;
  });
  const c=document.getElementById('postsContainer');
  c.innerHTML=filtered.map(p=>renderPostCard(p)).join('');
}

function renderPostCard(post, isGroupCtx){
  const user=post.userId===0?ME:getUser(post.userId); if(!user) return '';
  const dc=getDeptColor(user.dept);
  const liked=likedPosts.includes(post.id);
  const saved=savedPosts.includes(post.id);
  const commCount=Array.isArray(post.comments)?post.comments.length:post.comments||0;
  const myReact=myReactions[post.id];
  const isMine=post.userId===0;

  // Reaction summary
  const reacts=post.reactions||{};
  const reactSummary=Object.entries(reacts).filter(([e,c])=>c>0).map(([e,c])=>`<span class="reaction-chip ${myReact===e?'mine':''}" onclick="toggleReaction(${post.id},'${e}')">${e} ${c}</span>`).join('');

  // Avatar display
  const avatarHtml = (isMine && ME.profileImg)
    ? `<img src="${ME.profileImg}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;cursor:pointer;flex-shrink:0;" onclick="openUserProfile(${post.userId})" />`
    : `<div class="avatar" style="width:36px;height:36px;font-size:13px;background:linear-gradient(135deg,${dc},${dc}88);" onclick="openUserProfile(${post.userId})">${user.avatar}</div>`;

  // Edit mode
  if(editingPostId===post.id){
    return `<div class="post-card" id="postcard-${post.id}">
      <div class="post-bar" style="background:linear-gradient(90deg,${dc},${dc}44);"></div>
      <div class="post-inner">
        <div class="post-header">${avatarHtml}
          <div style="flex:1;"><div style="font-size:13px;font-weight:600;color:var(--text);">${user.name}</div></div>
        </div>
        <textarea class="post-edit-textarea" id="editPostInput-${post.id}" rows="4">${post.text}</textarea>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button onclick="savePostEdit(${post.id})" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:20px;padding:7px 18px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">সেভ করো</button>
          <button onclick="cancelPostEdit()" style="background:transparent;border:1px solid var(--bg4);border-radius:20px;padding:7px 18px;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;">বাতিল</button>
        </div>
      </div>
    </div>`;
  }

  // Trending check: post with more than 10 likes or more than 5 comments
  const totalLikesForPost = post.likes + Object.values(post.reactions||{}).reduce((a,b)=>a+b,0);
  const isTrending = totalLikesForPost >= 10 || commCount >= 5;
  // View count — auto-increment on render (simulate)
  if(!post.views) post.views = Math.floor(Math.random()*80)+10;

  return `<div class="post-card" id="postcard-${post.id}" style="${post.isBirthdayPost?'border-color:#F4A261;box-shadow:0 0 0 1px #F4A26155;':''}">
    <div class="post-bar" style="background:${post.isBirthdayPost?'linear-gradient(90deg,#F4A261,#F72585,#6C63FF)':`linear-gradient(90deg,${dc},${dc}44)`};"></div>
    <div class="post-inner">
      <div class="post-header">
        ${avatarHtml}
        <div style="flex:1;" onclick="openUserProfile(${post.userId})">
          <div style="font-size:13px;font-weight:600;color:var(--text);">${user.name} ${post.isBirthdayPost?'🎂':''}</div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
            <span class="dept-badge" style="color:${dc};background:${dc}22;">${getDeptName(user.dept)}</span>
            ${isTrending?`<span class="trending-badge">🔥 Trending</span>`:''}
            ${post.isBirthdayPost?`<span class="audience-badge" style="color:#F4A261;background:#F4A26122;">🎉 জন্মদিন</span>`:''}
            ${post.audience&&post.audience!=='public'?`<span class="audience-badge" style="${audienceBadgeStyle(post.audience)}">${audienceLabel(post.audience)}</span>`:''}
            <span class="post-time">${post.time}${post.edited?' • edited':''}</span>
          </div>
        </div>
        <button onclick="moreOptions(${post.id},${!!isGroupCtx})" style="background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
      <p class="post-text">${post.text}</p>
      ${post.img?`<img src="${post.img}" class="post-img" alt="post image" />`:''}
      ${post.file?`<div class="post-file">
        <div class="post-file-icon">${fileIconFor(post.file.name)}</div>
        <div class="post-file-info"><div class="post-file-name">${post.file.name}</div><div class="post-file-meta">${formatFileSize(post.file.size)}</div></div>
        <a class="post-file-dl" href="${post.file.url}" download="${post.file.name}">ডাউনলোড</a>
      </div>`:''}
      ${reactSummary?`<div class="reaction-count-wrap">${reactSummary}</div>`:''}
      <div class="post-actions">
        <div class="post-action-wrap" id="reacWrap-${post.id}">
          <button class="action-btn ${myReact?'liked':''}" onpointerdown="startReactionHold(${post.id})" onpointerup="endReactionHold(${post.id})" onpointerleave="endReactionHold(${post.id})" onclick="quickLike(${post.id})">
            <span style="font-size:15px;">${myReact||'❤️'}</span>
            ${(post.reactions&&Object.values(post.reactions).reduce((a,b)=>a+b,0)>0)?Object.values(post.reactions).reduce((a,b)=>a+b,0):post.likes}
          </button>
        </div>
        <button class="action-btn" onclick="openCommentModal(${post.id},${!!isGroupCtx})">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${commCount}
        </button>
        <button class="action-btn" onclick="openShareModal(${post.id})">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          ${post.shares||''}
        </button>
        <button class="action-btn ${saved?'bookmarked':''}" onclick="toggleSave(${post.id})" style="margin-left:auto;">
          <svg width="15" height="15" fill="${saved?'#4CC9F0':'none'}" stroke="${saved?'#4CC9F0':'currentColor'}" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        <span class="view-count">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ${post.views||0}
        </span>
      </div>
    </div>
  </div>`;
}

// ===== REACTION SYSTEM =====
let reactionHoldTimer = null;
const REACTIONS = ['❤️','😂','😮','😢','😡','👍'];

function quickLike(postId){
  if(reactionHoldTimer) return; // was a hold, not a click
  const post=findPost(postId); if(!post) return;
  if(!post.reactions) post.reactions={};
  const prev=myReactions[postId];
  if(prev==='❤️'){ post.reactions['❤️']=(post.reactions['❤️']||1)-1; delete myReactions[postId]; }
  else {
    if(prev){ post.reactions[prev]=(post.reactions[prev]||1)-1; }
    post.reactions['❤️']=(post.reactions['❤️']||0)+1;
    myReactions[postId]='❤️';
    notifyPostLike(postId);
  }
  renderPosts(); if(profileSubTab==='posts') renderProfileSubContent();
}

function startReactionHold(postId){
  reactionHoldTimer=setTimeout(()=>{ reactionHoldTimer=null; showReactionPopup(postId); }, 500);
}
function endReactionHold(postId){
  if(reactionHoldTimer){ clearTimeout(reactionHoldTimer); reactionHoldTimer=null; }
}

function showReactionPopup(postId){
  closeAllReactionPopups();
  const wrap=document.getElementById('reacWrap-'+postId); if(!wrap) return;
  const popup=document.createElement('div');
  popup.className='reaction-popup'; popup.id='reacPop-'+postId;
  popup.innerHTML=REACTIONS.map(e=>`<span class="reaction-opt" onclick="selectReaction(${postId},'${e}')">${e}</span>`).join('');
  wrap.appendChild(popup);
  activeReactionPopup=postId;
  setTimeout(()=>document.addEventListener('click',closeAllReactionPopups,{once:true}),100);
}
function closeAllReactionPopups(){
  document.querySelectorAll('.reaction-popup').forEach(p=>p.remove());
  activeReactionPopup=null;
}
function selectReaction(postId, emoji){
  const post=findPost(postId); if(!post) return;
  if(!post.reactions) post.reactions={};
  const prev=myReactions[postId];
  if(prev===emoji){ post.reactions[emoji]=(post.reactions[emoji]||1)-1; delete myReactions[postId]; }
  else {
    if(prev&&post.reactions[prev]) post.reactions[prev]--;
    post.reactions[emoji]=(post.reactions[emoji]||0)+1;
    myReactions[postId]=emoji;
    if(emoji==='❤️') notifyPostLike(postId);
  }
  closeAllReactionPopups();
  renderPosts(); if(profileSubTab==='posts') renderProfileSubContent();
  showToast(`${emoji} reaction দিয়েছো!`);
}
function toggleReaction(postId,emoji){ selectReaction(postId,emoji); }

function findPost(postId){
  let p=posts.find(x=>x.id===postId);
  if(!p){ for(const gid of Object.keys(groupPosts)){ p=groupPosts[gid].find(x=>x.id===postId); if(p) break; } }
  return p;
}

// ===== NESTED COMMENT TREE HELPERS (comments can have replies, replies can have replies...) =====
function findCommentNode(comments, id){
  if(!Array.isArray(comments)) return null;
  for(const c of comments){
    if(c.id===id) return c;
    if(c.replies && c.replies.length){
      const found=findCommentNode(c.replies, id);
      if(found) return found;
    }
  }
  return null;
}
function findCommentParentArray(comments, id){
  if(!Array.isArray(comments)) return null;
  for(const c of comments){
    if(c.id===id) return comments;
    if(c.replies && c.replies.length){
      const found=findCommentParentArray(c.replies, id);
      if(found) return found;
    }
  }
  return null;
}

