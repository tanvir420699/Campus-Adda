// ===== CHAT INFO PANEL (Messenger/WhatsApp-style info sheet for groups & DMs) =====
// Shared helpers used by both Study Groups (groups.js) and Messages/DM (messages.js)

// ---- role helpers (study groups) ----
function isGroupAdmin(group, uid=ME.id){ return !!group && (group.creatorId===uid || (group.admins||[]).includes(uid)); }
function isGroupModerator(group, uid=ME.id){ return !!group && (group.moderators||[]).includes(uid); }
function canManageGroup(group, uid=ME.id){ return isGroupAdmin(group,uid) || isGroupModerator(group,uid); }
function groupRoleLabel(group, uid){
  if(group.creatorId===uid) return '👑 প্রতিষ্ঠাতা';
  if((group.admins||[]).includes(uid)) return '🛡️ Admin';
  if((group.moderators||[]).includes(uid)) return '⭐ Moderator';
  return '';
}
function roleBadgeHtml(group, uid){
  const lbl=groupRoleLabel(group,uid);
  if(!lbl) return '';
  return `<span style="font-size:9px;font-weight:700;color:var(--accent2);background:var(--accent2)1a;padding:2px 7px;border-radius:8px;margin-left:6px;">${lbl}</span>`;
}

// ---- action icon row (Audio / Video / Invite / Mute etc, like screenshot) ----
function actionIconRow(actions){
  return `<div style="display:flex;justify-content:center;gap:22px;padding:14px 0 18px;">
    ${actions.map(a=>`
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;" onclick="${a.onclick}">
        <div style="width:46px;height:46px;border-radius:50%;background:${a.bg||'var(--bg3)'};display:flex;align-items:center;justify-content:center;font-size:18px;color:${a.color||'var(--text)'};">${a.icon}</div>
        <span style="font-size:10px;color:var(--muted2);">${a.label}</span>
      </div>`).join('')}
  </div>`;
}

function infoSectionLabel(txt){
  return `<div style="font-size:11px;font-weight:700;color:var(--muted);margin:14px 4px 6px;text-transform:uppercase;letter-spacing:0.3px;">${txt}</div>`;
}
function infoRow({icon,bg,text,sub,onclick,danger,trailing}){
  return `<div class="settings-row${danger?' danger':''}" ${onclick?`onclick="${onclick}"`:''} style="border-radius:10px;">
    <div class="settings-row-icon" style="background:${bg||'#6C63FF22'};">${icon}</div>
    <div class="settings-row-text">${text}${sub?`<div class="settings-row-sub">${sub}</div>`:''}</div>
    ${trailing||'<span style="color:var(--muted);font-size:13px;">›</span>'}
  </div>`;
}

// ---- mute helpers ----
function isGroupMuted(group){ return !!group.mutedByMe; }
function toggleGroupMute(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  group.mutedByMe=!group.mutedByMe;
  showToast(group.mutedByMe?'🔕 গ্রুপ মিউট করা হয়েছে':'🔔 গ্রুপ আনমিউট করা হয়েছে');
  showGroupInfo();
}
function toggleFriendGroupMute(fgId){
  const group=getFriendGroup('fg_'+fgId); if(!group) return;
  group.mutedByMe=!group.mutedByMe;
  showToast(group.mutedByMe?'🔕 গ্রুপ মিউট করা হয়েছে':'🔔 গ্রুপ আনমিউট করা হয়েছে');
  showChatInfo();
}
function toggleDMMute(userId){
  if(mutedDMs.includes(userId)) mutedDMs=mutedDMs.filter(id=>id!==userId);
  else mutedDMs.push(userId);
  showToast(mutedDMs.includes(userId)?'🔕 চ্যাট মিউট করা হয়েছে':'🔔 চ্যাট আনমিউট করা হয়েছে');
  showChatInfo();
}

// ---- media collection ----
function collectMedia(msgs){ return (msgs||[]).filter(m=>m.type==='image' && m.img); }
function openGroupPinnedModal(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  openPinnedModal('📌 Pinned', group.msgs);
}
function openGroupMediaModal(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  openMediaGalleryModal(`🖼️ Media — ${group.name}`, group.msgs);
}
function openDMPinnedModal(){
  openPinnedModal('📌 Pinned', getCurrentMsgs());
}
function openDMMediaModal(){
  const isGroup=isFriendGroupChat(selectedChat);
  const title=isGroup?`🖼️ Media — ${getFriendGroup(selectedChat)?.name||''}`:`🖼️ Media — ${getUser(selectedChat)?.name||''}`;
  openMediaGalleryModal(title, getCurrentMsgs());
}
function openMediaGalleryModal(title, msgs){
  const imgs=collectMedia(msgs);
  if(!imgs.length){ openInfoModal(title, `<div class="empty-state"><div class="empty-state-icon">🖼️</div>এখনো কোনো media শেয়ার হয়নি</div>`); return; }
  openInfoModal(title, `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
    ${imgs.map(m=>`<img src="${m.img}" onclick="viewChatImage('${m.img}')" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;cursor:pointer;">`).join('')}
  </div>`);
}

// ---- pinned messages ----
function openPinnedModal(title, msgs){
  const pinned=(msgs||[]).filter(m=>m.pinned);
  if(!pinned.length){ openInfoModal('📌 Pinned Messages', `<div class="empty-state"><div class="empty-state-icon">📌</div>এই চ্যাটে এখনো কোনো মেসেজ pin করা হয়নি<br><span style="font-size:10px;">মেসেজে long-press/right-click করে Pin করো</span></div>`); return; }
  openInfoModal('📌 Pinned Messages', `<div style="display:flex;flex-direction:column;gap:8px;">
    ${pinned.map(m=>`<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:10px 12px;">
      <div style="font-size:10px;color:var(--accent2);font-weight:600;margin-bottom:3px;">${m.fromName||(m.from==='me'?ME.name:m.from)||''}</div>
      <div style="font-size:12px;color:var(--text2);">${m.type==='image'?'📷 ছবি':m.type==='voice'?'🎙️ Voice message':(m.text||'')}</div>
      <div style="font-size:9px;color:var(--muted);margin-top:4px;">${m.time||''}</div>
    </div>`).join('')}
  </div>`);
}
function togglePinMsg(msgId){
  closeMsgMenu();
  const msgs=getCurrentMsgs(); if(!msgs) return;
  const msg=msgs.find(m=>m.id===msgId); if(!msg) return;
  msg.pinned=!msg.pinned;
  showToast(msg.pinned?'📌 মেসেজ pin করা হয়েছে':'📌 মেসেজ unpin করা হয়েছে');
  renderChatMessages();
}
function togglePinGroupMsg(msgId){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  msg.pinned=!msg.pinned;
  showToast(msg.pinned?'📌 মেসেজ pin করা হয়েছে':'📌 মেসেজ unpin করা হয়েছে');
  renderGroupMessages();
}

// ---- lightweight context menu for STUDY GROUP chat messages ----
function openGroupMsgMenu(msgId, x, y, isMe){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  const canDelete = isMe || canManageGroup(group);
  const menu=document.createElement('div');
  menu.className='msg-ctx-menu'; menu.id='groupMsgCtxMenu';
  menu.style.cssText='position:fixed;left:-9999px;top:-9999px;';
  menu.innerHTML=`
    <div class="msg-ctx-react-row">
      ${['❤️','😂','👍','😮','😢','🔥'].map(e=>`<span onclick="reactToGroupMsg(${msgId},'${e}')">${e}</span>`).join('')}
    </div>
    ${(isMe&&msg.type!=='voice')?`<div class="msg-ctx-item" onclick="startEditGroupMsg(${msgId})">✏️ &nbsp; Edit করো</div>`:''}
    <div class="msg-ctx-item" onclick="copyGroupMsgText(${msgId})">📋 &nbsp; Copy করো</div>
    <div class="msg-ctx-item" onclick="setGroupReplyById(${msgId})">↩️ &nbsp; Reply করো</div>
    <div class="msg-ctx-item" onclick="forwardGroupMsg(${msgId})">↪️ &nbsp; Forward করো</div>
    <div class="msg-ctx-item" onclick="togglePinGroupMsg(${msgId})">📌 &nbsp; ${msg.pinned?'Unpin করো':'Pin করো'}</div>
    ${canDelete?`<div class="msg-ctx-item danger" onclick="deleteGroupMsgById(${msgId})">🗑️ &nbsp; Delete করো</div>`:''}`;
  const bd=document.createElement('div');
  bd.className='msg-ctx-backdrop'; bd.id='groupMsgCtxBackdrop';
  bd.onclick=closeGroupMsgMenu;
  document.getElementById('app').appendChild(bd);
  document.getElementById('app').appendChild(menu);
  requestAnimationFrame(()=>{
    const mw=menu.offsetWidth||264, mh=menu.offsetHeight||240;
    const vw=window.innerWidth, vh=window.innerHeight;
    let left=x, top=y-mh-10;
    if(left+mw>vw-8) left=vw-mw-8;
    if(left<8) left=8;
    if(top<60) top=y+16;
    if(top+mh>vh-8) top=vh-mh-8;
    menu.style.left=left+'px';
    menu.style.top=top+'px';
  });
}
function closeGroupMsgMenu(){
  const m=document.getElementById('groupMsgCtxMenu'); if(m) m.remove();
  const b=document.getElementById('groupMsgCtxBackdrop'); if(b) b.remove();
}
function deleteGroupMsgById(msgId){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const idx=(group.msgs||[]).findIndex(m=>m.id===msgId); if(idx===-1) return;
  group.msgs[idx]={...group.msgs[idx], deleted:true};
  renderGroupMessages();
  showToast('🗑️ Message delete করা হয়েছে');
}

function reactToGroupMsg(msgId, emoji){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  msg.reaction = msg.reaction===emoji ? null : emoji;
  renderGroupMessages();
}
function copyGroupMsgText(msgId){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  if(navigator.clipboard) navigator.clipboard.writeText(msg.text||'').then(()=>showToast('📋 Copied!'));
  else showToast('📋 Copied!');
}
let groupReplyingTo=null;
function setGroupReplyById(msgId){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  groupReplyingTo={from:msg.from, text:msg.type==='voice'?'🎙️ Voice message':(msg.text||'')};
  const bar=document.getElementById('groupReplyBar');
  if(bar){
    bar.classList.remove('hidden');
    const nameEl=document.getElementById('groupReplyToName');
    const textEl=document.getElementById('groupReplyToText');
    if(nameEl) nameEl.textContent=msg.from===ME.name?'তুমি':msg.from;
    if(textEl) textEl.textContent=' '+groupReplyingTo.text.substring(0,50);
  }
  document.getElementById('groupMsgInput').focus();
}
function cancelGroupReply(){
  groupReplyingTo=null;
  const bar=document.getElementById('groupReplyBar');
  if(bar) bar.classList.add('hidden');
}
function forwardGroupMsg(msgId){
  closeGroupMsgMenu();
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  if(navigator.clipboard) navigator.clipboard.writeText(msg.text||'').then(()=>showToast('↪️ Message copied — অন্য chat এ paste করো'));
  else showToast('↪️ Forward করতে text copy করো');
}
let groupEditingMsgId=null;
function startEditGroupMsg(msgId){
  closeGroupMsgMenu();
  groupEditingMsgId=msgId;
  renderGroupMessages();
  setTimeout(()=>{ const el=document.getElementById('groupEditInput-'+msgId); if(el){el.focus();el.select();} },80);
}
function saveEditGroupMsg(msgId){
  const el=document.getElementById('groupEditInput-'+msgId); if(!el) return;
  const txt=el.value.trim(); if(!txt){ showToast('Message খালি রাখা যাবে না'); return; }
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msg=(group.msgs||[]).find(m=>m.id===msgId); if(!msg) return;
  msg.text=txt; msg.edited=true;
  groupEditingMsgId=null; renderGroupMessages();
  showToast('✅ Message edit হয়েছে');
}
function cancelEditGroupMsg(){
  groupEditingMsgId=null; renderGroupMessages();
}

// ---- group members management ----
function openGroupMembersModal(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  const admin=isGroupAdmin(group);
  const html=`<div style="display:flex;flex-direction:column;gap:6px;">
    ${(group.memberIds||[]).map(uid=>{
      const u=uid===0?ME:getUser(uid); if(!u) return '';
      const dc=getDeptColor(u.dept);
      const isSelf=uid===ME.id;
      let menu='';
      if(admin && !isSelf && uid!==group.creatorId){
        const opts=[];
        if(!isGroupAdmin(group,uid)) opts.push(`<div class="msg-ctx-item" onclick="promoteGroupMember(${group.id},${uid},'admin')">🛡️ Admin বানাও</div>`);
        if(!isGroupModerator(group,uid) && !isGroupAdmin(group,uid)) opts.push(`<div class="msg-ctx-item" onclick="promoteGroupMember(${group.id},${uid},'moderator')">⭐ Moderator বানাও</div>`);
        if(isGroupAdmin(group,uid) || isGroupModerator(group,uid)) opts.push(`<div class="msg-ctx-item" onclick="demoteGroupMember(${group.id},${uid})">↩️ Role সরাও</div>`);
        opts.push(`<div class="msg-ctx-item danger" onclick="removeGroupMember(${group.id},${uid})">🚫 গ্রুপ থেকে সরাও</div>`);
        menu=`<button onclick="event.stopPropagation();toggleMemberMenu(${uid})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">⋮</button>
          <div class="member-inline-menu hidden" id="memberMenu-${uid}" style="position:absolute;right:8px;top:36px;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:6px;z-index:5;min-width:160px;box-shadow:0 6px 20px rgba(0,0,0,0.4);">${opts.join('')}</div>`;
      }
      return `<div style="position:relative;display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:10px;background:var(--bg2);">
        <div class="avatar" style="width:36px;height:36px;font-size:14px;background:linear-gradient(135deg,${dc},${dc}88);">${u.avatar}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12.5px;color:var(--text);font-weight:600;display:flex;align-items:center;flex-wrap:wrap;">${isSelf?'তুমি':u.name}${roleBadgeHtml(group,uid)}</div>
          <div style="font-size:10px;color:var(--muted);">${getDeptName(u.dept)}</div>
        </div>
        ${menu}
      </div>`;
    }).join('')}
  </div>
  ${admin?`<button onclick="openAddGroupMemberModal(${group.id})" style="width:100%;margin-top:14px;background:linear-gradient(135deg,${getDeptColor(group.dept)},${getDeptColor(group.dept)}bb);border:none;border-radius:14px;padding:11px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">+ সদস্য যোগ করো</button>`:''}`;
  openInfoModal(`👥 সদস্যরা (${(group.memberIds||[]).length})`, html);
}
function toggleMemberMenu(uid){
  document.querySelectorAll('.member-inline-menu').forEach(el=>{ if(el.id!=='memberMenu-'+uid) el.classList.add('hidden'); });
  const el=document.getElementById('memberMenu-'+uid); if(el) el.classList.toggle('hidden');
}
function promoteGroupMember(groupId, uid, role){
  const group=studyGroups.find(g=>g.id===groupId); if(!group||!isGroupAdmin(group)) return;
  if(!group.admins) group.admins=[]; if(!group.moderators) group.moderators=[];
  group.admins=group.admins.filter(id=>id!==uid); group.moderators=group.moderators.filter(id=>id!==uid);
  if(role==='admin') group.admins.push(uid); else group.moderators.push(uid);
  const u=uid===0?ME:getUser(uid);
  showToast(`${u?.name||''} এখন ${role==='admin'?'Admin':'Moderator'} 🎉`);
  openGroupMembersModal(groupId);
}
function demoteGroupMember(groupId, uid){
  const group=studyGroups.find(g=>g.id===groupId); if(!group||!isGroupAdmin(group)) return;
  group.admins=(group.admins||[]).filter(id=>id!==uid);
  group.moderators=(group.moderators||[]).filter(id=>id!==uid);
  showToast('Role সরানো হয়েছে');
  openGroupMembersModal(groupId);
}
function removeGroupMember(groupId, uid){
  const group=studyGroups.find(g=>g.id===groupId); if(!group||!isGroupAdmin(group)) return;
  group.memberIds=(group.memberIds||[]).filter(id=>id!==uid);
  group.admins=(group.admins||[]).filter(id=>id!==uid);
  group.moderators=(group.moderators||[]).filter(id=>id!==uid);
  group.members=group.memberIds.length;
  if(uid===ME.id) joinedGroups=joinedGroups.filter(id=>id!==groupId);
  showToast('সদস্যকে গ্রুপ থেকে সরানো হয়েছে');
  renderGroups();
  openGroupMembersModal(groupId);
}
function openAddGroupMemberModal(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  const candidates=MOCK_USERS.filter(u=>!(group.memberIds||[]).includes(u.id));
  if(!candidates.length){ openInfoModal('সদস্য যোগ করো', `<div class="empty-state"><div class="empty-state-icon">✅</div>যোগ করার জন্য নতুন কেউ নেই</div>`); return; }
  openInfoModal('সদস্য যোগ করো', `<div style="display:flex;flex-direction:column;gap:8px;">
    ${candidates.map(u=>{
      const dc=getDeptColor(u.dept);
      return `<label style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;background:var(--bg2);cursor:pointer;">
        <input type="checkbox" value="${u.id}" class="add-member-cb" style="width:16px;height:16px;accent-color:var(--accent);">
        <div class="avatar" style="width:32px;height:32px;font-size:13px;background:linear-gradient(135deg,${dc},${dc}88);">${u.avatar}</div>
        <span style="font-size:13px;color:var(--text);">${u.name}</span>
      </label>`;
    }).join('')}
    <button class="modal-save-btn" onclick="addSelectedGroupMembers(${groupId})">যোগ করো</button>
  </div>`);
}
function addSelectedGroupMembers(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  const checked=[...document.querySelectorAll('.add-member-cb:checked')].map(c=>parseInt(c.value));
  if(!checked.length){ showToast('কাউকে বেছে নাও'); return; }
  group.memberIds=[...new Set([...(group.memberIds||[]), ...checked])];
  group.members=group.memberIds.length;
  showToast(`${checked.length} জনকে যোগ করা হয়েছে 🎉`);
  renderGroups();
  openGroupMembersModal(groupId);
}
function toggleGroupMsgPermission(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group||!isGroupAdmin(group)) return;
  group.messagePermission = group.messagePermission==='everyone' ? 'adminsOnly' : 'everyone';
  showToast(group.messagePermission==='adminsOnly'?'🔒 শুধু Admin/Moderator রা মেসেজ পাঠাতে পারবে':'🔓 সবাই মেসেজ পাঠাতে পারবে');
  showGroupInfo();
}

// ===== CHAT INFO PANEL FOR MESSAGES TAB (1-1 DM + multi-friend group) =====
function showChatInfo(){
  if(!selectedChat) return;
  if(isFriendGroupChat(selectedChat)) showFriendGroupInfo();
  else showDMInfo();
}

function showDMInfo(){
  const user=getUser(selectedChat); if(!user) return;
  const dc=getDeptColor(user.dept);
  const muted=mutedDMs.includes(user.id);
  const actions=[
    {icon:'📞',label:'Audio',onclick:"callUser()"},
    {icon:'🎥',label:'Video',onclick:"videoCallUser()"},
    {icon:'🔍',label:'Search',onclick:"closeInfoModal();toggleChatSearch();"},
    {icon:muted?'🔕':'🔔',label:muted?'Unmute':'Mute',onclick:`toggleDMMute(${user.id})`,bg:muted?'#F7258522':'var(--bg3)',color:muted?'var(--red)':'var(--text)'},
  ];
  const blocked=isBlocked(user.id);
  openInfoModal(user.name,`
    <div style="text-align:center;padding:4px 0 4px;">
      ${user.profileImg?`<img src="${user.profileImg}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block;">`:`<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${dc},${dc}88);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;margin:0 auto 10px;">${user.avatar}</div>`}
      <div style="font-size:14px;font-weight:700;color:var(--text);">${user.name}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">${user.online?'<span style="color:#06D6A0;">● অনলাইন</span>':lastSeenText(user)} • ${getDeptName(user.dept)}</div>
    </div>
    ${actionIconRow(actions)}
    ${infoSectionLabel('Chat Info')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'🖼️',bg:'#4CC9F022',text:'Media, Files & Links',sub:collectMedia(messages[user.id]).length+' টি media',onclick:'openDMMediaModal()'})}
      ${infoRow({icon:'📌',bg:'#F4A26122',text:'Pinned Messages',onclick:'openDMPinnedModal()'})}
      ${infoRow({icon:'👤',bg:'#9B5DE522',text:'প্রোফাইল দেখো',onclick:`closeInfoModal();openUserProfile(${user.id})`})}
    </div>
    ${infoSectionLabel('Privacy & Support')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:blocked?'✅':'🚫',bg:'#F7258522',text:blocked?'Unblock করো':'Block করো',onclick:`toggleBlockFromInfo(${user.id})`,danger:!blocked,trailing:'<span></span>'})}
      ${infoRow({icon:'⚠️',bg:'#F7258522',text:'Report করো',onclick:`closeInfoModal();openReportModal('user',${user.id},'${user.name.replace(/'/g,"\\'")}');`})}
      ${infoRow({icon:'🗑️',bg:'#F7258522',text:'চ্যাট ডিলিট করো',onclick:`deleteDMChat(${user.id})`,danger:true,trailing:'<span></span>'})}
    </div>
  `);
}

function showFriendGroupInfo(){
  const group=getFriendGroup(selectedChat); if(!group) return;
  if(!group.admins){ group.admins=[ME.id]; group.creatorId=group.creatorId||ME.id; group.moderators=group.moderators||[]; group.mutedByMe=!!group.mutedByMe; group.messagePermission=group.messagePermission||'everyone'; }
  const fgId=group.id;
  const admin=isGroupAdmin(group);
  const muted=isGroupMuted(group);
  const allMemberIds=[ME.id,...group.memberIds];
  const actions=[
    {icon:'📞',label:'Audio',onclick:"callUser()"},
    {icon:'🎥',label:'Video',onclick:"videoCallUser()"},
    {icon:muted?'🔕':'🔔',label:muted?'Unmute':'Mute',onclick:`toggleFriendGroupMute(${fgId})`,bg:muted?'#F7258522':'var(--bg3)',color:muted?'var(--red)':'var(--text)'},
  ];
  openInfoModal(group.name,`
    <div style="text-align:center;padding:4px 0 4px;">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#4CC9F0);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 10px;">👥</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);">${group.name}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">${allMemberIds.length} জন সদস্য</div>
    </div>
    ${actionIconRow(actions)}
    ${infoSectionLabel('Chat Info')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'👥',bg:'#6C63FF22',text:'সদস্যরা দেখো',sub:allMemberIds.length+' জন',onclick:`openFriendGroupMembersModal(${fgId})`})}
      ${infoRow({icon:'🖼️',bg:'#4CC9F022',text:'Media, Files & Links',sub:collectMedia(group.msgs).length+' টি media',onclick:'openDMMediaModal()'})}
      ${infoRow({icon:'📌',bg:'#F4A26122',text:'Pinned Messages',onclick:'openDMPinnedModal()'})}
    </div>
    ${infoSectionLabel('Privacy & Support')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'🚪',bg:'#F7258522',text:'গ্রুপ ছেড়ে দাও',onclick:`leaveFriendGroup(${fgId})`,danger:true,trailing:'<span></span>'})}
    </div>
  `);
}

function toggleBlockFromInfo(userId){
  if(isBlocked(userId)){ blockedUsers=blockedUsers.filter(id=>id!==userId); showToast('✅ Unblock করা হয়েছে'); }
  else { blockedUsers.push(userId); showToast('🚫 Block করা হয়েছে'); }
  closeInfoModal();
  if(typeof saveAppData==='function') saveAppData();
}
function deleteDMChat(userId){
  delete messages[userId];
  closeInfoModal();
  backToMsgList();
  showToast('🗑️ চ্যাট ডিলিট করা হয়েছে');
}
function leaveFriendGroup(fgId){
  friendGroups=friendGroups.filter(g=>g.id!==fgId);
  closeInfoModal();
  backToMsgList();
  showToast('🚪 গ্রুপ ছেড়ে দিয়েছো');
}
function openFriendGroupMembersModal(fgId){
  const group=getFriendGroup('fg_'+fgId); if(!group) return;
  const admin=isGroupAdmin(group);
  const allIds=[ME.id,...group.memberIds];
  const html=`<div style="display:flex;flex-direction:column;gap:6px;">
    ${allIds.map(uid=>{
      const u=uid===0?ME:getUser(uid); if(!u) return '';
      const dc=getDeptColor(u.dept);
      const isSelf=uid===ME.id;
      let menu='';
      if(admin && !isSelf && uid!==group.creatorId){
        const opts=[];
        if(!isGroupAdmin(group,uid)) opts.push(`<div class="msg-ctx-item" onclick="promoteFriendGroupMember(${fgId},${uid})">🛡️ Admin বানাও</div>`);
        else opts.push(`<div class="msg-ctx-item" onclick="demoteFriendGroupMember(${fgId},${uid})">↩️ Admin সরাও</div>`);
        opts.push(`<div class="msg-ctx-item danger" onclick="removeFriendGroupMember(${fgId},${uid})">🚫 গ্রুপ থেকে সরাও</div>`);
        menu=`<button onclick="event.stopPropagation();toggleMemberMenu(${uid})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px 8px;">⋮</button>
          <div class="member-inline-menu hidden" id="memberMenu-${uid}" style="position:absolute;right:8px;top:36px;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:6px;z-index:5;min-width:160px;box-shadow:0 6px 20px rgba(0,0,0,0.4);">${opts.join('')}</div>`;
      }
      return `<div style="position:relative;display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:10px;background:var(--bg2);">
        <div class="avatar" style="width:36px;height:36px;font-size:14px;background:linear-gradient(135deg,${dc},${dc}88);">${u.avatar}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12.5px;color:var(--text);font-weight:600;display:flex;align-items:center;flex-wrap:wrap;">${isSelf?'তুমি':u.name}${roleBadgeHtml(group,uid)}</div>
          <div style="font-size:10px;color:var(--muted);">${getDeptName(u.dept)}</div>
        </div>
        ${menu}
      </div>`;
    }).join('')}
  </div>`;
  openInfoModal(`👥 সদস্যরা (${allIds.length})`, html);
}
function promoteFriendGroupMember(fgId,uid){
  const group=getFriendGroup('fg_'+fgId); if(!group||!isGroupAdmin(group)) return;
  if(!group.admins) group.admins=[]; if(!group.admins.includes(uid)) group.admins.push(uid);
  showToast('এখন Admin 🎉'); openFriendGroupMembersModal(fgId);
}
function demoteFriendGroupMember(fgId,uid){
  const group=getFriendGroup('fg_'+fgId); if(!group||!isGroupAdmin(group)) return;
  group.admins=(group.admins||[]).filter(id=>id!==uid);
  showToast('Admin role সরানো হয়েছে'); openFriendGroupMembersModal(fgId);
}
function removeFriendGroupMember(fgId,uid){
  const group=getFriendGroup('fg_'+fgId); if(!group||!isGroupAdmin(group)) return;
  group.memberIds=(group.memberIds||[]).filter(id=>id!==uid);
  group.admins=(group.admins||[]).filter(id=>id!==uid);
  showToast('সদস্যকে সরানো হয়েছে'); renderMsgList(); openFriendGroupMembersModal(fgId);
}
