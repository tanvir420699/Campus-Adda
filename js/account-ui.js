// ===== LAST SEEN =====
function toBengaliNum(n) {
  const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(n).split('').map(d => bn[parseInt(d)] || d).join('');
}
function lastSeenText(user) {
  if (user.online) return '<span style="color:#06D6A0;font-weight:600;">● অনলাইন</span>';
  if (!user.lastSeen) return '<span style="color:var(--muted);">অফলাইন</span>';
  const diffMs = Date.now() - user.lastSeen;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  let timeStr;
  if (diffSec < 60) timeStr = 'এইমাত্র active ছিল';
  else if (diffMin < 60) timeStr = `${toBengaliNum(diffMin)} মিনিট আগে active`;
  else if (diffHour < 24) timeStr = `${toBengaliNum(diffHour)} ঘণ্টা আগে active`;
  else if (diffDay === 1) timeStr = 'গতকাল active ছিল';
  else if (diffDay < 7) timeStr = `${toBengaliNum(diffDay)} দিন আগে active`;
  else timeStr = 'অনেকদিন আগে active';
  return `<span style="color:var(--muted2);font-size:11px;">⏱ ${timeStr}</span>`;
}
// Auto-refresh last seen every 30s
setInterval(() => {
  if (activeTab === 'messages') {
    if (selectedChat) {
      const user = getUser(selectedChat);
      const st = document.getElementById('chatStatus');
      if (st && user && !user.online) st.innerHTML = lastSeenText(user);
    } else {
      renderMsgList();
    }
  }
}, 30000);

function updateNotifBadge() {
  const count = unreadNotifCount();
  const badge = document.getElementById('notifBadge');
  if(count>0){ badge.textContent=count>9?'9+':count; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}

function notifIcon(type) {
  const map = { like:{emoji:'❤️',bg:'#F7258522'}, comment:{emoji:'💬',bg:'#4CC9F022'}, mention:{emoji:'@',bg:'#6C63FF22'}, friend_request:{emoji:'👤',bg:'#6C63FF22'}, follow:{emoji:'👥',bg:'#06D6A022'}, group:{emoji:'👥',bg:'#06D6A022'}, file:{emoji:'📎',bg:'#F4A26122'}, report:{emoji:'🚩',bg:'#F7258522'}, birthday:{emoji:'🎂',bg:'#F4A26122'}, story:{emoji:'⭐',bg:'#9B5DE522'} };
  return map[type]||{emoji:'🔔',bg:'#8B8FA822'};
}

// ===== BLOCK / UNBLOCK =====
function isBlocked(userId){ return blockedUsers.includes(userId); }
function blockUser(userId){
  const u=getUser(userId); if(!u||userId===0) return;
  showConfirmDialog(
    '🚫 ব্লক করবে?',
    `${u.name} কে ব্লক করলে সে আর তোমার পোস্ট দেখতে পারবে না এবং তুমিও তার কোনো কিছু দেখবে না।`,
    'হ্যাঁ, ব্লক করো',
    ()=>{
      if(!blockedUsers.includes(userId)) blockedUsers.push(userId);
      friends=friends.filter(id=>id!==userId);
      closeUserProfile(); closeInfoModal();
      renderFriends(); renderPosts(); renderMsgList();
      showToast(`${u.name} কে ব্লক করা হয়েছে 🚫`);
      if(activeTab==='profile') renderProfileSubContent();
      saveAppData();
    }
  );
}
function unblockUser(userId){
  blockedUsers=blockedUsers.filter(id=>id!==userId);
  const u=getUser(userId);
  closeInfoModal(); renderFriends();
  showToast(`${u?.name||'ইউজার'} আনব্লক করা হয়েছে ✅`);
  saveAppData();
}
function openBlockedUsersModal(){
  if(!blockedUsers.length){
    openInfoModal('ব্লক করা ইউজার','<div class="empty-state"><div class="empty-state-icon">✅</div>কোনো ইউজার ব্লক করা নেই</div>');
    return;
  }
  const html=blockedUsers.map(uid=>{
    const u=getUser(uid); if(!u) return '';
    const dc=getDeptColor(u.dept);
    return `<div class="settings-row" style="border-radius:10px;">
      <div class="avatar" style="width:32px;height:32px;font-size:12px;background:linear-gradient(135deg,${dc},${dc}88);">${u.avatar}</div>
      <div style="flex:1;"><div class="settings-row-text">${u.name}</div><div class="settings-row-sub">${getDeptName(u.dept)}</div></div>
      <button onclick="unblockUser(${uid})" style="background:var(--bg3);border:1px solid var(--bg4);border-radius:16px;padding:5px 12px;color:var(--accent);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">আনব্লক</button>
    </div>`;
  }).join('');
  openInfoModal('ব্লক করা ইউজার', html);
}

// ===== REPORT SYSTEM =====
let reportTarget = null;
function openReportModal(type, targetId, targetName){
  reportTarget={type, targetId, targetName};
  openInfoModal('রিপোর্ট করো',`
    <div style="font-size:12px;color:var(--muted2);margin-bottom:12px;">"${targetName}" রিপোর্ট করার কারণ বেছে নাও:</div>
    <label class="report-reason" onclick="selectReportReason(this)"><input type="radio" name="reportReason" value="spam" checked/> 📢 স্প্যাম বা বিজ্ঞাপন</label>
    <label class="report-reason" onclick="selectReportReason(this)"><input type="radio" name="reportReason" value="harassment"/> 😡 হয়রানি বা অপমান</label>
    <label class="report-reason" onclick="selectReportReason(this)"><input type="radio" name="reportReason" value="inappropriate"/> 🔞 অনুপযুক্ত কন্টেন্ট</label>
    <label class="report-reason" onclick="selectReportReason(this)"><input type="radio" name="reportReason" value="fake"/> 🎭 ভুয়া তথ্য</label>
    <label class="report-reason" onclick="selectReportReason(this)"><input type="radio" name="reportReason" value="other"/> ❓ অন্যান্য</label>
    <div class="form-group" style="margin-top:10px;">
      <label class="form-label">অতিরিক্ত বিবরণ (ঐচ্ছিক)</label>
      <textarea class="form-textarea" id="reportDetails" rows="2" placeholder="বিস্তারিত লেখো..."></textarea>
    </div>
    <button class="modal-save-btn" onclick="submitReport()">রিপোর্ট পাঠাও 🚩</button>
  `);
  document.querySelector('.report-reason')?.classList.add('selected');
}
function selectReportReason(el){
  document.querySelectorAll('.report-reason').forEach(r=>r.classList.remove('selected'));
  el.classList.add('selected');
  el.querySelector('input').checked=true;
}
function submitReport(){
  if(!reportTarget) return;
  const reason=document.querySelector('input[name="reportReason"]:checked')?.value||'other';
  const details=document.getElementById('reportDetails')?.value?.trim()||'';
  reports.push({ id:Date.now(), ...reportTarget, reason, details, time:'এইমাত্র', status:'pending' });
  // Show success screen instead of closing immediately
  document.getElementById('infoModalBody').innerHTML=`
    <div class="report-success">
      <div class="report-success-icon">🚩</div>
      <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px;">রিপোর্ট পাঠানো হয়েছে!</div>
      <div style="font-size:12px;color:var(--muted2);line-height:1.6;margin-bottom:20px;">আমরা "${reportTarget.targetName}" এর বিরুদ্ধে তোমার রিপোর্ট পেয়েছি। ২৪ ঘণ্টার মধ্যে পর্যালোচনা করা হবে।</div>
      <button onclick="closeInfoModal()" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:14px;padding:11px 24px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">ঠিক আছে</button>
    </div>`;
  reportTarget=null;
  saveAppData();
}

// ===== FRIEND SUGGESTIONS =====
function getFriendSuggestions(){
  return MOCK_USERS.filter(u=>
    !friends.includes(u.id)&&
    !friendRequests.some(r=>r.id===u.id)&&
    !blockedUsers.includes(u.id)&&
    !dismissedSuggestions.includes(u.id)
  ).slice(0,6);
}
function renderFriendSuggestions(){
  const c=document.getElementById('friendSuggestionsSection'); if(!c) return;
  const suggestions=getFriendSuggestions();
  if(!suggestions.length){ c.innerHTML=''; return; }
  c.innerHTML=`
    <div class="section-sub">তোমার জন্য সাজেশন 🤝</div>
    <div class="suggest-scroll">
      ${suggestions.map(u=>{
        const dc=getDeptColor(u.dept);
        // Count mutual friends
        const mutualFriendsOfU = MOCK_USERS.filter(x => x.id!==u.id && friends.includes(x.id));
        const mutualCount = mutualFriendsOfU.length > 0 ? Math.floor(Math.random()*Math.min(mutualFriendsOfU.length,3))+1 : 0;
        const mutualText = mutualCount > 0 ? `👥 ${mutualCount} জন কমন ফ্রেন্ড` : getDeptName(u.dept);
        const alreadySent = pendingSentRequests && pendingSentRequests.includes(u.id);
        return `<div class="suggest-card-v9">
          <button class="suggest-dismiss" style="position:absolute;top:4px;right:4px;background:var(--bg3);border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;color:var(--muted);" onclick="dismissSuggestion(${u.id})">✕</button>
          <div class="avatar" style="width:48px;height:48px;font-size:18px;background:linear-gradient(135deg,${dc},${dc}88);margin:0 auto 8px;cursor:pointer;border-radius:50%;" onclick="openUserProfile(${u.id})">${u.avatar}</div>
          <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.name.split(' ')[0]}</div>
          <div class="suggest-mutual">${mutualText}</div>
          ${u.online?`<div style="font-size:9px;color:var(--green);margin-bottom:6px;">● অনলাইন</div>`:`<div style="font-size:9px;color:var(--muted);margin-bottom:6px;">${u.year}</div>`}
          <button onclick="sendFriendRequestSuggest(${u.id},this)" style="background:${alreadySent?'var(--bg3)':'linear-gradient(135deg,#6C63FF,#4CC9F0)'};border:${alreadySent?'1px solid var(--bg4)':'none'};border-radius:16px;padding:6px 10px;color:${alreadySent?'var(--muted)':'#fff'};font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;width:100%;">${alreadySent?'✓ Request পাঠানো':'+ Add Friend'}</button>
        </div>`;
      }).join('')}
    </div>
    <div class="divider"></div>`;
}

let pendingSentRequests = [];
function sendFriendRequestSuggest(userId, btn){
  if(pendingSentRequests.includes(userId)){ showToast('ইতিমধ্যে request পাঠানো হয়েছে'); return; }
  pendingSentRequests.push(userId);
  if(btn){ btn.textContent='✓ Request পাঠানো'; btn.style.background='var(--bg3)'; btn.style.border='1px solid var(--bg4)'; btn.style.color='var(--muted)'; }
  const u=getUser(userId);
  showToast(`${u?u.name:'ইউজার'} কে friend request পাঠানো হয়েছে! 👋`);
  addNotification('friend_request', 0, `তুমি ${u?u.name:'কাউকে'} কে friend request পাঠিয়েছো`);
}

// ===== POST AUDIENCE =====
function setPostAudience(aud){
  postAudience=aud;
  ['public','friends','private'].forEach(a=>{
    const el=document.getElementById('aud-'+a);
    if(el) el.classList.toggle('active',a===aud);
  });
}
function audienceLabel(aud){
  const map={public:'🌍 সবাই',friends:'👥 ফ্রেন্ড',private:'🔒 শুধু আমি'};
  return map[aud]||'🌍 সবাই';
}
function audienceBadgeStyle(aud){
  const map={public:'color:var(--accent);background:#6C63FF22',friends:'color:var(--green);background:#06D6A022',private:'color:var(--orange);background:#F4A26122'};
  return map[aud]||map.public;
}
function canViewPost(post){
  if(post.userId===0){
    // Even "my" posts respect profileVisibility for non-friend viewers in this single-account demo;
    // ME always sees own posts when browsing own profile/feed.
    return true;
  }
  if(isBlocked(post.userId)) return false;
  const aud=post.audience||'public';
  if(aud==='public') return true;
  if(aud==='friends') return friends.includes(post.userId)||post.userId===0;
  if(aud==='private') return post.userId===0;
  return true;
}
// Whether a hypothetical visitor (not a friend) could see ME's full profile, based on profileVisibility setting
function canStrangerViewMyProfile(){
  const v=settings.profileVisibility||'public';
  return v==='public';
}
// Whether userId is allowed to start/continue a DM with ME, based on whoCanMessage setting
function canMessageMe(userId){
  if(userId===0) return true;
  if(friends.includes(userId)) return true;
  return (settings.whoCanMessage||'everyone')==='everyone';
}

// ===== NOTIFICATION HELPERS =====
function addNotification(type, userId, text){
  notificationsList.unshift({ id:++nextNotifId, type, userId, text, time:'এইমাত্র', read:false });
  updateNotifBadge();
  pulseNotifBadge();
  if(settings.notifPush && pushPermissionGranted) showPushToast(type, text);
}
function todayKey(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function isBirthdayToday(dateStr){
  if(!dateStr) return false;
  const d=new Date(dateStr); const t=new Date();
  return d.getMonth()===t.getMonth() && d.getDate()===t.getDate();
}
function checkBirthdays(){
  const flagKey='dc_birthday_checked_'+todayKey();
  if(localStorage.getItem(flagKey)) return;
  let triggered=false;
  // ME's own birthday
  if(isBirthdayToday(ME.birthday)){
    addNotification('birthday', 0, '🎉 শুভ জন্মদিন তোমাকে! আজকের দিনটি স্পেশাল হোক 🎂');
    posts.unshift({ id:Date.now(), userId:0, text:`🎂🎉 আজ আমার জন্মদিন! সবার দোয়া আর শুভেচ্ছা চাই 🥳`, time:'এইমাত্র', likes:0, comments:[], dept:ME.dept, reactions:{}, audience:'public', isBirthdayPost:true });
    showBirthdayBanner('🎂 শুভ জন্মদিন তোমাকে!', 'আজ তোমার বিশেষ দিন! Debendra Connect পরিবার তোমাকে শুভেচ্ছা জানায় 🎉');
    triggered=true;
  }
  // Friends' birthdays
  const birthdayFriends=[];
  friends.forEach(fid=>{
    const u=getUser(fid);
    if(u && isBirthdayToday(u.birthday)){
      addNotification('birthday', fid, `🎂 আজ ${u.name}-এর জন্মদিন! তাকে শুভেচ্ছা জানাও`);
      posts.unshift({ id:Date.now()+fid, userId:fid, text:`🎂🎉 আজ আমার জন্মদিন! সবাই দোয়া করো 🥳`, time:'এইমাত্র', likes:0, comments:[], dept:u.dept, reactions:{}, audience:'public', isBirthdayPost:true });
      birthdayFriends.push(u.name);
      triggered=true;
    }
  });
  // Also check all mock users (not just friends)
  MOCK_USERS.forEach(u=>{
    if(isBirthdayToday(u.birthday) && !friends.includes(u.id)){
      addNotification('birthday', u.id, `🎂 আজ ${u.name}-এর জন্মদিন!`);
      birthdayFriends.push(u.name);
    }
  });
  if(birthdayFriends.length>0){
    const names = birthdayFriends.slice(0,2).join(', ')+(birthdayFriends.length>2?` ও আরো ${birthdayFriends.length-2} জন`:'');
    showBirthdayBanner(`🎂 আজ ${names}-এর জন্মদিন!`, 'তাদের উইশ করতে ভুলো না 🎉');
  }
  if(triggered){ renderPosts(); renderStories(); }
  localStorage.setItem(flagKey,'1');
}
function showPushToast(type, text){
  const toast=document.getElementById('pushToast'); if(!toast) return;
  const icon=notifIcon(type);
  document.getElementById('pushToastIcon').textContent=icon.emoji;
  document.getElementById('pushToastIcon').style.background=icon.bg;
  document.getElementById('pushToastTitle').textContent=type==='like'?'নতুন লাইক ❤️':type==='mention'?'নতুন Mention @':type==='comment'?'নতুন কমেন্ট 💬':'নোটিফিকেশন';
  document.getElementById('pushToastBody').textContent=text;
  toast.classList.remove('hidden','hide');
  clearTimeout(window._pushToastTimer);
  window._pushToastTimer=setTimeout(()=>{ toast.classList.add('hide'); setTimeout(()=>toast.classList.add('hidden'),300); },4000);
}
function checkMentionsInText(text, postId){
  if(!settings.notifMentions) return;
  const allUsers=[...MOCK_USERS];
  allUsers.forEach(u=>{
    const firstName=u.name.split(' ')[0];
    if(text.includes('@'+firstName)||text.includes('@'+u.name)){
      if(u.id!==0){
        addNotification('mention', 0, `তুমি ${u.name}-কে mention করেছো`);
        // Simulate mention notification to mentioned user (demo)
        setTimeout(()=>{
          if(Math.random()>0.5) addNotification('mention', 0, `${u.name} তোমার mention দেখেছে`);
        },2000);
      }
    }
  });
}
function notifyPostLike(postId){
  if(!settings.notifLikes) return;
  const post=findPost(postId); if(!post||post.userId===0) return;
  const liker=MOCK_USERS[Math.floor(Math.random()*MOCK_USERS.length)];
  if(liker) addNotification('like', liker.id, `${liker.name} তোমার পোস্টে লাইক দিয়েছে`);
}
function notifyPostComment(postId, commentText){
  if(!settings.notifComments) return;
  const post=findPost(postId); if(!post||post.userId===0) return;
  addNotification('comment', 0, `কেউ তোমার পোস্টে কমেন্ট করেছে: "${commentText.substring(0,30)}..."`);
}

// ===== PUSH NOTIFICATION UI =====
function requestPushPermission(){
  if(!('Notification' in window)){ showToast('এই ব্রাউজার push সাপোর্ট করে না'); return; }
  Notification.requestPermission().then(perm=>{
    pushPermissionGranted=perm==='granted';
    dismissPushBanner();
    if(pushPermissionGranted){
      showToast('Push নোটিফিকেশন চালু হয়েছে 🔔');
      if(Notification.permission==='granted'){
        try{ new Notification('Debendra Connect', { body:'নোটিফিকেশন সফলভাবে চালু হয়েছে! 🎉', icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%236C63FF" width="100" height="100" rx="20"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="white">DC</text></svg>' }); }catch(e){}
      }
    } else showToast('নোটিফিকেশন অনুমতি দেওয়া হয়নি');
    saveAppData();
  });
}
function dismissPushBanner(){
  document.getElementById('pushBanner')?.classList.add('hidden');
  localStorage.setItem('dc_push_dismissed','1');
}
function showPushBannerIfNeeded(){
  if(localStorage.getItem('dc_push_dismissed')||pushPermissionGranted||!settings.notifPush) return;
  if('Notification' in window && Notification.permission==='default'){
    document.getElementById('pushBanner')?.classList.remove('hidden');
  }
}

// ===== PWA INSTALL =====
function initPWA(){
  if(pwaInitialized) return;
  pwaInitialized=true;
  if(!document.querySelector('link[rel="manifest"]')){
    const manifest={
    name:'Debendra Connect', short_name:'DC Connect',
    description:'Debendra College University Social Network',
    start_url:'.', display:'standalone', background_color:'#0D0F14', theme_color:'#6C63FF',
    icons:[{src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%236C63FF" width="192" height="192" rx="40"/><text x="96" y="130" font-size="80" text-anchor="middle" fill="white" font-weight="bold">DC</text></svg>',sizes:'192x192',type:'image/svg+xml'}]
  };
  const link=document.createElement('link');
  link.rel='manifest';
  link.href='data:application/json,'+encodeURIComponent(JSON.stringify(manifest));
    document.head.appendChild(link);
  }
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault(); deferredInstallPrompt=e;
    if(!localStorage.getItem('dc_pwa_dismissed')) document.getElementById('pwaBanner')?.classList.remove('hidden');
  });
  if(window.matchMedia('(display-mode: standalone)').matches) document.getElementById('pwaBanner')?.classList.add('hidden');
}
async function installPWA(){
  // Check if iOS Safari
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
  if(isIOS){
    openInfoModal('📱 iOS তে ইনস্টল করো', `
      <div style="font-size:12px;color:var(--muted2);margin-bottom:12px;">Safari ব্রাউজারে নিচের ধাপগুলো অনুসরণ করো:</div>
      <div class="pwa-ios-steps">
        <div class="pwa-ios-step"><div class="pwa-ios-num">১</div><div>Safari এ নিচের শেয়ার বাটনে (⬆️) ক্লিক করো</div></div>
        <div class="pwa-ios-step"><div class="pwa-ios-num">২</div><div>"Add to Home Screen" বা "হোম স্ক্রিনে যোগ করো" সিলেক্ট করো</div></div>
        <div class="pwa-ios-step"><div class="pwa-ios-num">৩</div><div>"Add" বাটনে ট্যাপ করো — Debendra Connect আইকন হোম স্ক্রিনে আসবে! 🎉</div></div>
      </div>
    `);
    return;
  }
  if(!deferredInstallPrompt){ showToast('ইনস্টল অপশন এখন উপলব্ধ নেই — Chrome/Edge ব্যবহার করো'); return; }
  deferredInstallPrompt.prompt();
  const result=await deferredInstallPrompt.userChoice;
  if(result.outcome==='accepted') showToast('Debendra Connect ইনস্টল হয়েছে! 📲');
  deferredInstallPrompt=null;
  document.getElementById('pwaBanner')?.classList.add('hidden');
}
function dismissPwaBanner(){
  document.getElementById('pwaBanner')?.classList.add('hidden');
  localStorage.setItem('dc_pwa_dismissed','1');
}

// ===== THEME (AUTO FOLLOW SYSTEM) =====
function getSystemDark(){ return window.matchMedia('(prefers-color-scheme: dark)').matches; }
function applyTheme(){
  const mode=settings.themeMode||'auto';
  let isDark=true;
  if(mode==='auto') isDark=getSystemDark();
  else if(mode==='light') isDark=false;
  else isDark=true;
  settings.darkMode=isDark;
  document.body.classList.toggle('light',!isDark);
  localStorage.setItem('dc_theme',mode);
}
function setThemeMode(mode){
  settings.themeMode=mode;
  applyTheme();
  renderProfileSubContent();
  saveAppData();
}

// ===== PASSWORD CHANGE =====
function openChangePasswordModal(){
  openInfoModal('পাসওয়ার্ড পরিবর্তন',`
    <div class="form-group">
      <label class="form-label">বর্তমান পাসওয়ার্ড</label>
      <input class="form-input" id="cpCurrentPass" type="password" placeholder="বর্তমান পাসওয়ার্ড"/>
    </div>
    <div class="form-group">
      <label class="form-label">নতুন পাসওয়ার্ড</label>
      <input class="form-input" id="cpNewPass" type="password" placeholder="নতুন পাসওয়ার্ড" oninput="checkPassStrength3(this.value)"/>
      <div class="pass-strength" id="cpPassStrength"><div class="pass-seg" id="cps1"></div><div class="pass-seg" id="cps2"></div><div class="pass-seg" id="cps3"></div><div class="pass-seg" id="cps4"></div></div>
      <div id="cpPassHint" style="font-size:10px;color:var(--muted2);margin-top:4px;">অন্তত ৮ অক্ষর, বড়-ছোট হাতের, সংখ্যা ও চিহ্ন দাও</div>
    </div>
    <div class="form-group">
      <label class="form-label">নতুন পাসওয়ার্ড নিশ্চিত করো</label>
      <input class="form-input" id="cpNewPass2" type="password" placeholder="আবার পাসওয়ার্ড"/>
    </div>
    <div id="cpError" style="font-size:11px;color:var(--red);margin-bottom:8px;display:none;"></div>
    <button class="modal-save-btn" onclick="changePassword()">পাসওয়ার্ড আপডেট করো 🔒</button>
  `);
}
let cpStrength=0;
function checkPassStrength3(val){
  const segs=['cps1','cps2','cps3','cps4'];
  cpStrength=0;
  if(val.length>=8) cpStrength++;
  if(/[A-Z]/.test(val)&&/[a-z]/.test(val)) cpStrength++;
  if(/[0-9]/.test(val)) cpStrength++;
  if(/[^A-Za-z0-9]/.test(val)) cpStrength++;
  segs.forEach((s,i)=>{ const el=document.getElementById(s); if(el) el.className='pass-seg'+(i<cpStrength?(' '+(cpStrength<=1?'weak':cpStrength<=3?'medium':'strong')):''); });
  const hint=document.getElementById('cpPassHint');
  const labels=['','দুর্বল 😟','মোটামুটি 😐','মোটামুটি 😐','শক্তিশালী ✅'];
  if(hint&&cpStrength>0) hint.textContent=labels[cpStrength];
}
function changePassword(){
  const current=document.getElementById('cpCurrentPass')?.value||'';
  const newPass=document.getElementById('cpNewPass')?.value||'';
  const newPass2=document.getElementById('cpNewPass2')?.value||'';
  const errEl=document.getElementById('cpError');
  const acc=currentAccount || registeredAccounts[0];
  if(!acc||acc.pass!==current){
    if(errEl){ errEl.textContent='বর্তমান পাসওয়ার্ড ভুল'; errEl.style.display='block'; }
    return;
  }
  if(cpStrength<3){ if(errEl){ errEl.textContent='শক্তিশালী পাসওয়ার্ড দাও'; errEl.style.display='block'; } return; }
  if(newPass!==newPass2){ if(errEl){ errEl.textContent='নতুন পাসওয়ার্ড মিলছে না'; errEl.style.display='block'; } return; }
  acc.pass=newPass;
  closeInfoModal();
  showToast('পাসওয়ার্ড সফলভাবে আপডেট হয়েছে ✅');
  saveAppData();
}

// ===== COMMENT EDIT & DELETE =====
function startEditComment(postId, commentId, isGroupCtx){
  editingCommentId={postId, commentId, isGroupCtx:!!isGroupCtx};
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
  setTimeout(()=>{ const el=document.getElementById('cedit-'+commentId); if(el){ el.focus(); el.select(); } },80);
}
function saveEditComment(postId, commentId, isGroupCtx){
  const el=document.getElementById('cedit-'+commentId); if(!el) return;
  const txt=el.value.trim(); if(!txt){ showToast('কমেন্ট খালি রাখা যাবে না'); return; }
  const post=findPost(postId); if(!post) return;
  const comm=findCommentNode(post.comments, commentId); if(!comm) return;
  comm.text=txt; comm.edited=true; editingCommentId=null;
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
  showToast('কমেন্ট আপডেট হয়েছে ✅');
}
function cancelEditComment(isGroupCtx){
  editingCommentId=null;
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
}
function deleteComment(postId, commentId, isGroupCtx){
  showConfirmDialog(
    '🗑️ কমেন্ট মুছবে?',
    'এই কমেন্ট মুছে ফেলা হলে আর ফিরিয়ে আনা যাবে না।',
    'হ্যাঁ, মুছে দাও',
    ()=>{
      const post=findPost(postId); if(!post) return;
      const arr=findCommentParentArray(post.comments, commentId);
      if(arr){ const idx=arr.findIndex(c=>c.id===commentId); if(idx>-1) arr.splice(idx,1); }
      openReplies.delete(commentId);
      if(isGroupCtx) renderGroupFeed(); else renderPosts();
      renderCommentModal();
      showToast('কমেন্ট মুছে ফেলা হয়েছে 🗑️');
    }
  );
}

// ===== V9: CONFIRM DIALOG =====
let _confirmAction = null;
function showConfirmDialog(title, msg, okLabel, action, danger=true){
  _confirmAction = action;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  const okBtn = document.getElementById('confirmOkBtn');
  okBtn.textContent = okLabel;
  okBtn.style.background = danger ? 'var(--red)' : 'linear-gradient(135deg,#6C63FF,#4CC9F0)';
  document.getElementById('confirmDialog').classList.remove('hidden');
}
function doConfirmAction(){
  closeConfirmDialog();
  if(_confirmAction) { _confirmAction(); _confirmAction=null; }
}
function closeConfirmDialog(){
  document.getElementById('confirmDialog').classList.add('hidden');
  _confirmAction = null;
}

// ===== V9: ENHANCED NOTIFICATION RING =====
function pulseNotifBadge(){
  const badge = document.getElementById('notifBadge');
  const ring = document.getElementById('notifLiveRing');
  if(badge){ badge.classList.remove('pulse'); void badge.offsetWidth; badge.classList.add('pulse'); }
  if(ring){ ring.classList.remove('hidden'); setTimeout(()=>ring.classList.add('hidden'), 3000); }
}

// ===== LOCAL STORAGE =====
function saveAppData(){
  try{
    localStorage.setItem('dc_settings',JSON.stringify(settings));
    localStorage.setItem('dc_blocked',JSON.stringify(blockedUsers));
    localStorage.setItem('dc_dismissed_suggest',JSON.stringify(dismissedSuggestions));
    localStorage.setItem('dc_study_notes',JSON.stringify(studyNotes));
    localStorage.setItem('dc_study_routine',JSON.stringify(studyRoutine));
    localStorage.setItem('dc_study_exams',JSON.stringify(studyExams));
    localStorage.setItem('dc_study_videos',JSON.stringify(studyVideos));
    localStorage.setItem('dc_notices',JSON.stringify(notices));
    localStorage.setItem('dc_lostfound',JSON.stringify(lostFoundPosts));
    localStorage.setItem('dc_events',JSON.stringify(collegeEvents));
    localStorage.setItem('dc_my_clubs',JSON.stringify(myClubs));
    localStorage.setItem('dc_club_posts',JSON.stringify(clubPosts));
    localStorage.setItem('dc_following',JSON.stringify(followingList));
    localStorage.setItem('dc_followers',JSON.stringify(followersList));
    localStorage.setItem('dc_account_deactivated',JSON.stringify(accountDeactivated));
  }catch(e){}
}
function loadAppData(){
  try{
    const s=localStorage.getItem('dc_settings');
    if(s) Object.assign(settings,JSON.parse(s));
    const b=localStorage.getItem('dc_blocked');
    if(b) blockedUsers=JSON.parse(b);
    const d=localStorage.getItem('dc_dismissed_suggest');
    if(d) dismissedSuggestions=JSON.parse(d);
    const t=localStorage.getItem('dc_theme');
    if(t) settings.themeMode=t;
    const sn=localStorage.getItem('dc_study_notes'); if(sn) studyNotes=JSON.parse(sn);
    const sr=localStorage.getItem('dc_study_routine'); if(sr) studyRoutine=JSON.parse(sr);
    const se=localStorage.getItem('dc_study_exams'); if(se) studyExams=JSON.parse(se);
    const sv=localStorage.getItem('dc_study_videos'); if(sv) studyVideos=JSON.parse(sv);
    const no=localStorage.getItem('dc_notices'); if(no) notices=JSON.parse(no);
    const lf=localStorage.getItem('dc_lostfound'); if(lf) lostFoundPosts=JSON.parse(lf);
    const ev=localStorage.getItem('dc_events'); if(ev) collegeEvents=JSON.parse(ev);
    const mc=localStorage.getItem('dc_my_clubs'); if(mc) myClubs=JSON.parse(mc);
    const cp=localStorage.getItem('dc_club_posts'); if(cp) clubPosts=JSON.parse(cp);
    const fo=localStorage.getItem('dc_following'); if(fo) followingList=JSON.parse(fo);
    const fr=localStorage.getItem('dc_followers'); if(fr) followersList=JSON.parse(fr);
    const ad=localStorage.getItem('dc_account_deactivated'); if(ad) accountDeactivated=JSON.parse(ad);
    const allIds=[...studyNotes,...studyRoutine,...studyExams,...studyVideos].map(x=>x.id||0);
    if(allIds.length) nextStudyId=Math.max(...allIds)+1;
    if(notices.length) nextNoticeId=Math.max(...notices.map(x=>x.id||0))+1;
    if(lostFoundPosts.length) nextLostFoundId=Math.max(...lostFoundPosts.map(x=>x.id||0))+1;
    if(collegeEvents.length) nextEventId=Math.max(...collegeEvents.map(x=>x.id||0))+1;
    const allClubPostIds=Object.values(clubPosts).flat().map(x=>x.id||0);
    if(allClubPostIds.length) nextClubPostId=Math.max(...allClubPostIds)+1;
    if('Notification' in window) pushPermissionGranted=Notification.permission==='granted';
    // defensive defaults for settings introduced after this localStorage entry was first created
    if(!settings.defaultAudience) settings.defaultAudience='public';
    if(!settings.whoCanMessage) settings.whoCanMessage='everyone';
    if(!settings.profileVisibility) settings.profileVisibility=settings.privateProfile?'friends':'public';
    if(!settings.language) settings.language='bn';
    postAudience=settings.defaultAudience;
  }catch(e){}
  applyTheme();
}

// ===== TOAST =====
let toastTimer=null;
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.add('hidden'),2200);
}

// ===== EMOJI PICKER =====
function toggleEmojiPicker() {
  document.getElementById('emojiPickerRow').classList.toggle('hidden');
}
function addEmoji(e) {
  const ta=document.getElementById('newPostText');
  ta.value+=e; ta.focus();
}

