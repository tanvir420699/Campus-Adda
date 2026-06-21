// ===== STORIES =====
const STORY_LIFETIME_MS = 24*60*60*1000;

function pruneExpiredStories() {
  for(let i=stories.length-1;i>=0;i--){
    if(Date.now()-stories[i].createdAt >= STORY_LIFETIME_MS) stories.splice(i,1);
  }
}

function storyTimeLeftLabel(s) {
  const remainMs = STORY_LIFETIME_MS - (Date.now()-s.createdAt);
  if(remainMs<=0) return '';
  const remainH = Math.floor(remainMs/3600000);
  const remainM = Math.floor((remainMs%3600000)/60000);
  return remainH>0 ? `${toBengaliNum(remainH)}ঘ বাকি` : `${toBengaliNum(Math.max(1,remainM))}মি বাকি`;
}

function renderStories() {
  pruneExpiredStories();
  const bar=document.getElementById('storiesBar');
  let html=`
    <div class="story-item" onclick="openAddStory()">
      <div class="story-ring add-story"><div class="story-avatar" style="font-size:22px;color:var(--accent);">+</div></div>
      <div class="story-label">তোমার Story</div>
    </div>`;
  stories.forEach((s,i)=>{
    const user = s.userId===0 ? ME : getUser(s.userId);
    if(!user) return;
    const dc=getDeptColor(user.dept);
    const remainMs = STORY_LIFETIME_MS - (Date.now()-s.createdAt);
    const urgent = remainMs < 3*3600000;
    html+=`
      <div class="story-item" onclick="viewStory(${i})">
        <div class="story-ring ${s.seen?'seen':''}">
          <div class="story-avatar" style="background:linear-gradient(135deg,${dc},${dc}88);">${user.avatar}</div>
        </div>
        <div class="story-label">${s.userId===0?'তুমি':user.name.split(' ')[0]}</div>
        <div class="story-expiry-badge ${urgent?'urgent':''}">${storyTimeLeftLabel(s)}</div>
      </div>`;
  });
  bar.innerHTML=html;
}

function openAddStory() {
  const bgs = [
    'linear-gradient(135deg,#6C63FF,#4CC9F0)',
    'linear-gradient(135deg,#F72585,#7209B7)',
    'linear-gradient(135deg,#06D6A0,#118AB2)',
    'linear-gradient(135deg,#E9C46A,#F4A261)',
    'linear-gradient(135deg,#2A9D8F,#457B9D)',
    'linear-gradient(135deg,#9B5DE5,#F15BB5)',
    'linear-gradient(135deg,#E63946,#F4A261)',
    '#1A1D27',
  ];
  let selectedBg = bgs[0];
  const bgSwatches = bgs.map((bg,i)=>`<div class="story-bg-opt ${i===0?'selected':''}" style="background:${bg};" onclick="selectStoryBg(this,'${bg}')"></div>`).join('');
  openInfoModal('নতুন Story তৈরি করো',`
    <div class="form-group">
      <label class="form-label">কী লিখতে চাও?</label>
      <textarea class="form-textarea" id="newStoryText" rows="3" placeholder="তোমার story লেখো..." oninput="updateStoryPreview()"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">ছবি যোগ করো (ঐচ্ছিক)</label>
      <input type="file" id="storyImgInput" accept="image/*" class="form-input" style="padding:6px;" onchange="handleStoryImg(event)" />
    </div>
    <div class="form-group">
      <label class="form-label">ব্যাকগ্রাউন্ড রং</label>
      <div class="story-creator-bg" id="storyBgRow">${bgSwatches}</div>
    </div>
    <div class="story-preview-box" id="storyPreviewBox" style="background:${bgs[0]};">তোমার story এখানে দেখাবে ✨</div>
    <button class="modal-save-btn" onclick="addStory()" style="margin-top:12px;">Story দাও ✨</button>
  `);
}

function selectStoryBg(el, bg){
  document.querySelectorAll('.story-bg-opt').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('storyPreviewBox').style.background=bg;
  document.getElementById('storyPreviewBox').style.backgroundImage='';
}

function updateStoryPreview(){
  const txt=document.getElementById('newStoryText')?.value||'';
  const box=document.getElementById('storyPreviewBox');
  if(box) box.textContent=txt||'তোমার story এখানে দেখাবে ✨';
}

let storyImgData=null;
function handleStoryImg(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    storyImgData=ev.target.result;
    const box=document.getElementById('storyPreviewBox');
    if(box){ box.style.backgroundImage=`url(${storyImgData})`; box.style.backgroundSize='cover'; box.style.backgroundPosition='center'; }
  };
  reader.readAsDataURL(file);
}

function addStory() {
  const txt=document.getElementById('newStoryText')?.value?.trim();
  if(!txt&&!storyImgData){ showToast('Story খালি রাখা যাবে না'); return; }
  const selBg=document.querySelector('.story-bg-opt.selected');
  const bg=selBg?selBg.style.background:'linear-gradient(135deg,#6C63FF,#4CC9F0)';
  const newStory={ userId:0, text:txt||'', time:"এইমাত্র", seen:false, bg, img:storyImgData, createdAt:Date.now(), viewedBy:[] };
  stories.unshift(newStory);
  storyImgData=null;
  closeInfoModal(); renderStories();
  showToast('Story পোস্ট হয়েছে ✅');
  simulateStoryEngagement(newStory);
}

// Simulates friends viewing/reacting to a freshly-posted story so the view-count feature feels alive
function simulateStoryEngagement(storyObj) {
  const candidates=friends.filter(id=>id!==0);
  if(!candidates.length) return;
  const shuffled=[...candidates].sort(()=>Math.random()-0.5);
  const viewers=shuffled.slice(0, 1+Math.floor(Math.random()*shuffled.length));
  viewers.forEach((uid,i)=>{
    setTimeout(()=>{
      if(!stories.includes(storyObj)) return; // expired/removed already
      const u=getUser(uid); if(!u) return;
      const reacted=Math.random()>0.5;
      const emoji=reacted?['❤️','😂','😮'][Math.floor(Math.random()*3)]:null;
      storyObj.viewedBy=storyObj.viewedBy||[];
      storyObj.viewedBy.push({userId:uid, emoji});
      addNotification('story', uid, reacted?`${u.name} তোমার story-তে ${emoji} react করেছে`:`${u.name} তোমার story দেখেছে`);
      if(currentStoryIndex!==null && stories[currentStoryIndex]===storyObj){
        const cEl=document.getElementById('storyViewCount');
        if(cEl) cEl.textContent=toBengaliNum(storyObj.viewedBy.length);
      }
    }, 3000+i*2500+Math.random()*2000);
  });
}

function viewStory(index) {
  const s=stories[index];
  if(!s) return;
  const user=s.userId===0?ME:getUser(s.userId);
  if(!user) return;
  currentStoryIndex=index;
  s.seen=true; renderStories();
  const dc=getDeptColor(user.dept);
  const avEl=document.getElementById('storyViewerAvatar');
  // show profile img if available
  if(s.userId===0&&ME.profileImg){ avEl.innerHTML=`<img src="${ME.profileImg}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`; avEl.style.background='none'; }
  else { avEl.textContent=user.avatar; avEl.style.background=`linear-gradient(135deg,${dc},${dc}88)`; }
  document.getElementById('storyViewerName').textContent=user.name;
  document.getElementById('storyViewerTime').textContent=s.time;
  const storyBg=s.bg||`linear-gradient(135deg,${dc},${dc}88)`;
  const sv=document.getElementById('storyViewer');
  sv.style.backgroundColor=dc; // solid fallback so the overlay is never transparent
  if(s.img){ sv.style.backgroundImage=`url(${s.img})`; sv.style.backgroundSize='cover'; sv.style.backgroundPosition='center'; }
  else { sv.style.backgroundImage=storyBg; sv.style.backgroundSize=''; sv.style.backgroundPosition=''; }
  document.getElementById('storyViewerContent').innerHTML=s.text?`<p style="font-size:18px;color:#fff;line-height:1.7;text-shadow:0 2px 8px rgba(0,0,0,0.6);">${s.text}</p>`:'';
  // progress
  const pb=document.getElementById('storyProgressBar');
  pb.innerHTML=stories.map((_,i)=>`<div class="story-prog-seg"><div class="story-prog-fill" id="spf${i}" style="width:${i<index?'100%':i===index?'0%':'0%'};"></div></div>`).join('');
  document.getElementById('storyViewer').classList.remove('hidden');
  document.getElementById('storyViewersSheet').classList.add('hidden');

  // ===== footer: reply+react for others' stories, view count for your own =====
  const isOwn=s.userId===0;
  document.getElementById('storyViewerFooterOthers').classList.toggle('hidden', isOwn);
  document.getElementById('storyViewerFooterOwn').classList.toggle('hidden', !isOwn);
  if(isOwn){
    document.getElementById('storyViewCount').textContent=toBengaliNum((s.viewedBy||[]).length);
  } else {
    const ri=document.getElementById('storyReplyInput'); if(ri) ri.value='';
  }

  storyPct=0;
  runStoryProgress(index);
}

function runStoryProgress(index) {
  storyTimerIndexActive=index;
  clearInterval(storyTimer);
  const fill=document.getElementById('spf'+index);
  if(fill) fill.style.width=storyPct+'%';
  storyTimer=setInterval(()=>{
    storyPct+=2; if(fill) fill.style.width=storyPct+'%';
    if(storyPct>=100){ clearInterval(storyTimer); setTimeout(closeStoryViewer,300); }
  },60);
}
function pauseStoryTimer(){ clearInterval(storyTimer); }
function resumeStoryTimer(){ if(storyTimerIndexActive!==null) runStoryProgress(storyTimerIndexActive); }

function closeStoryViewer() {
  clearInterval(storyTimer);
  storyTimerIndexActive=null;
  currentStoryIndex=null;
  document.getElementById('storyViewer').classList.add('hidden');
  document.getElementById('storyViewersSheet').classList.add('hidden');
}

// ===== STORY REPLY =====
function storyReplyKeydown(e){
  if(e.key==='Enter'){ e.preventDefault(); sendStoryReply(); }
}
function sendStoryReply(){
  const input=document.getElementById('storyReplyInput');
  const txt=input?.value?.trim();
  if(!txt) return;
  const s=stories[currentStoryIndex];
  if(!s||s.userId===0) return;
  const ownerId=s.userId;
  if(!canMessageMe(ownerId)){ showToast('এই ইউজারকে মেসেজ পাঠানো যাবে না'); return; }
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  if(!messages[ownerId]) messages[ownerId]=[];
  messages[ownerId].push({
    id:Date.now(), from:'me', type:'story_reply', text:txt,
    storyRef:{ text:s.text, img:s.img||null, bg:s.bg||null },
    time, delivered:true, seen:false
  });
  input.value='';
  showToast('Reply পাঠানো হয়েছে ✅');
  if(selectedChat===ownerId) renderChatMessages();
}

// ===== STORY REACTION (❤️ 😂 😮) =====
function reactToStory(emoji){
  const s=stories[currentStoryIndex];
  if(!s||s.userId===0) return;
  const ownerId=s.userId;
  if(!canMessageMe(ownerId)){ showToast('এই ইউজারকে মেসেজ পাঠানো যাবে না'); return; }
  if(!s.viewedBy) s.viewedBy=[];
  const mine=s.viewedBy.find(v=>v.userId===0);
  if(mine) mine.emoji=emoji; else s.viewedBy.push({userId:0, emoji});
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  if(!messages[ownerId]) messages[ownerId]=[];
  messages[ownerId].push({
    id:Date.now(), from:'me', type:'story_reaction', emoji,
    storyRef:{ text:s.text, img:s.img||null, bg:s.bg||null },
    time, delivered:true, seen:false
  });
  flyStoryReaction(emoji);
  showToast(`${emoji} পাঠানো হয়েছে`);
  if(selectedChat===ownerId) renderChatMessages();
}
function flyStoryReaction(emoji){
  const layer=document.getElementById('storyReactionFly'); if(!layer) return;
  const el=document.createElement('div');
  el.className='story-fly-emoji';
  el.textContent=emoji;
  el.style.left=(38+Math.random()*24)+'%';
  layer.appendChild(el);
  setTimeout(()=>el.remove(),1200);
}

// Used in chat bubbles (messages.js) to show a small preview of the story being replied/reacted to
function storyQuoteSnippetHtml(ref){
  if(!ref) return '';
  const style=ref.img?`background-image:url(${ref.img});background-size:cover;background-position:center;`:`background:${ref.bg||'linear-gradient(135deg,#6C63FF,#4CC9F0)'};`;
  const inner=ref.img?'':`<span>${(ref.text||'').substring(0,36)}</span>`;
  return `<div class="story-quote-box" style="${style}">${inner}</div>`;
}

// ===== STORY VIEW COUNT (who viewed your story) =====
function openStoryViewers(){
  const s=stories[currentStoryIndex]; if(!s||s.userId!==0) return;
  pauseStoryTimer();
  const list=s.viewedBy||[];
  document.getElementById('storyViewersCount').textContent=toBengaliNum(list.length);
  const body=document.getElementById('storyViewersList');
  if(!list.length){
    body.innerHTML=`<div style="text-align:center;color:rgba(255,255,255,0.55);font-size:12px;padding:24px 10px;">এখনো কেউ দেখেনি</div>`;
  } else {
    body.innerHTML=[...list].reverse().map(v=>{
      const u=getUser(v.userId); if(!u) return '';
      const dc=getDeptColor(u.dept);
      return `<div class="story-viewer-row" onclick="closeStoryViewer();openUserProfile(${u.id})">
        <div class="avatar" style="width:36px;height:36px;font-size:13px;background:linear-gradient(135deg,${dc},${dc}88);flex-shrink:0;">${u.avatar}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12.5px;font-weight:600;color:#fff;">${u.name}</div>
        </div>
        ${v.emoji?`<span style="font-size:17px;">${v.emoji}</span>`:''}
      </div>`;
    }).join('');
  }
  document.getElementById('storyViewersSheet').classList.remove('hidden');
}
function closeStoryViewers(){
  document.getElementById('storyViewersSheet').classList.add('hidden');
  resumeStoryTimer();
}

// ===== NOTIFICATIONS =====
function renderNotifList() {
  const c=document.getElementById('notifListItems');
  if(!notificationsList.length){ c.innerHTML=`<div class="notif-empty">কোনো notification নেই 🔔</div>`; return; }
  c.innerHTML=notificationsList.map(n=>{
    const icon=notifIcon(n.type);
    return `<div class="notif-item ${n.read?'':'unread'}" onclick="openNotifItem(${n.id})">
      <div class="notif-icon" style="background:${icon.bg};">${icon.emoji}</div>
      <div><div class="notif-text">${n.text}</div><div class="notif-time-small">${n.time}</div></div>
    </div>`;
  }).join('');
}
function openNotif(){ openNotifPage(); }
function closeNotif(){ closeNotifPage(); }
function markAllRead(){
  notificationsList=notificationsList.map(n=>({...n,read:true}));
  renderNotifPageBody(); updateNotifBadge();
}

// ===== V14: FULL NOTIFICATION PAGE =====
let notifPageTab = 'all';
function openNotifPage(){
  document.getElementById('notifPage').classList.remove('hidden');
  renderNotifPageBody();
}
function closeNotifPage(){
  document.getElementById('notifPage').classList.add('hidden');
}
function markAllNotifsRead(){
  notificationsList=notificationsList.map(n=>({...n,read:true}));
  renderNotifPageBody(); updateNotifBadge();
}
function setNotifTab(tab){
  notifPageTab=tab;
  ['all','likes','comments','follow','birthday'].forEach(t=>{
    document.getElementById('ntab-'+t)?.classList.toggle('active', t===tab);
  });
  renderNotifPageBody();
}
function renderNotifPageBody(){
  const c=document.getElementById('notifPageBody'); if(!c) return;
  let list=notificationsList;
  if(notifPageTab==='likes') list=list.filter(n=>n.type==='like');
  else if(notifPageTab==='comments') list=list.filter(n=>n.type==='comment'||n.type==='mention');
  else if(notifPageTab==='follow') list=list.filter(n=>n.type==='follow'||n.type==='friend_request');
  else if(notifPageTab==='birthday') list=list.filter(n=>n.type==='birthday');
  if(!list.length){
    c.innerHTML=`<div class="notif-empty" style="text-align:center;padding:60px 20px;color:var(--muted);font-size:13px;">
      <div style="font-size:40px;margin-bottom:10px;">🔔</div>
      এখানে কোনো notification নেই
    </div>`;
    return;
  }
  const unread=list.filter(n=>!n.read);
  const read=list.filter(n=>n.read);
  let html='';
  if(unread.length){
    html+=`<div class="notif-page-section">নতুন (${unread.length})</div>`;
    html+=unread.map(n=>renderNotifPageItem(n)).join('');
  }
  if(read.length){
    html+=`<div class="notif-page-section">আগে পড়া</div>`;
    html+=read.map(n=>renderNotifPageItem(n)).join('');
  }
  c.innerHTML=html;
}
function renderNotifPageItem(n){
  const ico=notifIcon(n.type);
  const u=n.userId&&n.userId!==0?getUser(n.userId):null;
  const dc=u?getDeptColor(u.dept):'#6C63FF';
  const avatarHtml=u
    ?`<div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,${dc},${dc}88);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0;">${u.avatar}</div>`
    :`<div class="notif-page-icon" style="background:${ico.bg};">${ico.emoji}</div>`;
  return `<div class="notif-page-item ${n.read?'':'unread'}" onclick="openNotifItem(${n.id})">
    ${avatarHtml}
    <div class="notif-page-content">
      <div class="notif-page-text">${n.text}</div>
      <div class="notif-page-time">${n.time}</div>
    </div>
    ${!n.read?'<div class="notif-unread-dot"></div>':''}
  </div>`;
}

function openNotifItem(id){
  const n=notificationsList.find(x=>x.id===id); if(!n) return;
  n.read=true; renderNotifPageBody(); updateNotifBadge(); closeNotifPage();
  if(n.type==='friend_request') switchTab('friends');
  else if(n.type==='group') switchTab('groups');
  else if(n.type==='mention'||n.type==='like'||n.type==='comment') switchTab('feed');
  else switchTab('feed');
}

// ===== V14: FOLLOW/UNFOLLOW SYSTEM =====
// followingList: user IDs that I follow
// followersList: user IDs that follow me (simulated)
let followingList = [1, 2]; // initially following rafi and tanjina
let followersList = [1, 4, 6]; // these users follow me

function isFollowing(userId){ return followingList.includes(userId); }

function toggleFollow(userId){
  if(followingList.includes(userId)){
    followingList=followingList.filter(id=>id!==userId);
    const u=getUser(userId);
    showToast(`${u?.name||'ইউজার'} কে unfollow করা হয়েছে`);
  } else {
    followingList.push(userId);
    const u=getUser(userId);
    showToast(`${u?.name||'ইউজার'} কে follow করা হয়েছে! ✅`);
    addNotification('follow', userId, `তুমি ${u?.name||'কাউকে'} কে follow করেছো`);
    // Simulate user following back sometimes
    if(Math.random()>0.5 && !followersList.includes(userId)){
      setTimeout(()=>{
        followersList.push(userId);
        addNotification('follow', userId, `${u?.name||'কেউ'} তোমাকে follow করেছে! 👥`);
      }, 2000);
    }
  }
  // Re-render if user profile modal is open
  const modal=document.getElementById('userProfileModal');
  if(modal&&!modal.classList.contains('hidden')){
    openUserProfile(userId); // re-render
  }
}

function openFollowModal(type){ // 'followers' or 'following'
  const modal=document.getElementById('followModal'); if(!modal) return;
  document.getElementById('followModalTitle').textContent = type==='followers'?`Followers (${followersList.length})`:`Following (${followingList.length})`;
  const list = type==='followers'?followersList:followingList;
  const body = document.getElementById('followModalBody');
  if(!list.length){
    body.innerHTML=`<div class="empty-state" style="padding:40px 16px;"><div class="empty-state-icon">👥</div>${type==='followers'?'কেউ তোমাকে follow করেনি':'তুমি কাউকে follow করোনি'}</div>`;
    modal.classList.remove('hidden'); return;
  }
  body.innerHTML = list.map(uid=>{
    const u=getUser(uid); if(!u) return '';
    const dc=getDeptColor(u.dept);
    const isF=isFollowing(u.id);
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);">
      <div class="avatar" style="width:40px;height:40px;font-size:15px;background:linear-gradient(135deg,${dc},${dc}88);flex-shrink:0;cursor:pointer;" onclick="closeFollowModal();openUserProfile(${u.id})">${u.avatar}</div>
      <div style="flex:1;cursor:pointer;" onclick="closeFollowModal();openUserProfile(${u.id})">
        <div style="font-size:13px;font-weight:600;color:var(--text);">${u.name}</div>
        <div style="font-size:11px;color:var(--muted);">${getDeptName(u.dept)} • ${u.year}</div>
      </div>
      <button class="follow-btn ${isF?'following':'not-following'}" onclick="toggleFollow(${u.id});openFollowModal('${type}')">${isF?'Following':'Follow'}</button>
    </div>`;
  }).join('');
  modal.classList.remove('hidden');
}
function closeFollowModal(){ document.getElementById('followModal')?.classList.add('hidden'); }

// ===== V14: BIRTHDAY BANNER =====
function showBirthdayBanner(title, sub){
  const banner=document.getElementById('birthdayBanner'); if(!banner) return;
  document.getElementById('birthdayBannerTitle').textContent=title;
  document.getElementById('birthdayBannerSub').textContent=sub;
  banner.classList.remove('hidden');
  setTimeout(()=>banner.classList.add('hidden'), 10000);
}



