// ===== GROUPS =====
function renderGroups(){
  document.getElementById('groupsContainer').innerHTML=studyGroups.map(group=>{
    const dc=getDeptColor(group.dept);
    const joined=joinedGroups.includes(group.id);
    return `<div class="group-card" style="border-left:4px solid ${dc};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div>
          <div class="group-name">${group.name}</div>
          <div class="group-meta">
            <span style="font-size:10px;color:${dc};background:${dc}22;padding:2px 8px;border-radius:10px;font-weight:600;">${getDeptName(group.dept)}</span>
            <span class="group-members">👥 ${group.members} জন</span>
            ${group.active?'<span class="active-label">● সক্রিয়</span>':''}
            ${joined&&isGroupAdmin(group)?'<span style="font-size:9px;font-weight:700;color:var(--accent2);background:var(--accent2)1a;padding:2px 7px;border-radius:8px;">🛡️ Admin</span>':''}
          </div>
        </div>
      </div>
      ${group.desc?`<div class="group-desc">${group.desc}</div>`:''}
      <div class="group-btn-row">
        <button class="join-btn" onclick="toggleGroup(${group.id})" style="background:${joined?'transparent':`linear-gradient(135deg,${dc},${dc}bb)`};border:1px solid ${dc};color:${joined?dc:'#fff'};">${joined?'✓ যোগ দিয়েছো':'+ যোগ দাও'}</button>
        ${joined?`<button class="group-chat-btn" onclick="openGroupChat(${group.id})" style="border:1px solid var(--accent);color:var(--accent);">💬 Group Chat</button>`:''}
      </div>
    </div>`;
  }).join('');
}

function toggleGroup(groupId){
  const g=studyGroups.find(x=>x.id===groupId); if(!g) return;
  if(!g.memberIds) g.memberIds=[];
  if(joinedGroups.includes(groupId)){
    joinedGroups=joinedGroups.filter(id=>id!==groupId);
    g.memberIds=g.memberIds.filter(id=>id!==ME.id);
    g.members=g.memberIds.length;
    showToast('গ্রুপ ছেড়ে দিয়েছো');
  } else {
    joinedGroups.push(groupId);
    if(!g.memberIds.includes(ME.id)) g.memberIds.push(ME.id);
    g.members=g.memberIds.length;
    showToast(`${g.name} এ যোগ দিয়েছো! 🎉`);
  }
  renderGroups();
  if(activeTab==='profile') renderProfile();
}

function openGroupChat(groupId){
  selectedGroupChat=groupId;
  selectedGroupTab='chat';
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  const dc=getDeptColor(group.dept);
  document.getElementById('groupsListView').classList.add('hidden');
  document.getElementById('groupChatView').classList.remove('hidden');
  const icon=document.getElementById('groupChatIcon');
  icon.textContent='👥'; icon.style.background=`${dc}22`;
  document.getElementById('groupChatName').textContent=group.name;
  document.getElementById('groupChatMembers').textContent=`👥 ${group.members} জন • ${getDeptName(group.dept)}`;
  // Reset tabs
  document.getElementById('gTab-chat').classList.add('active');
  document.getElementById('gTab-posts').classList.remove('active');
  const chatSection=document.getElementById('groupChatMessages').parentElement;
  chatSection.style.display='flex';
  document.getElementById('groupFeedContainer').classList.add('hidden');
  document.getElementById('groupChatInputWrap').style.display='flex';
  const gMsgInput=document.getElementById('groupMsgInput');
  if(gMsgInput){ gMsgInput.style.height='auto'; }
  // group post avatar
  const gpa=document.getElementById('groupPostAvatar');
  if(gpa){
    if(ME.profileImg){ gpa.innerHTML=`<img src="${ME.profileImg}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`; gpa.style.background='none'; }
    else { gpa.textContent=ME.avatar; gpa.style.background=`linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`; }
  }
  renderGroupMessages();
}

function backToGroupsList(){
  selectedGroupChat=null;
  groupChatEmojiOpen=false; isGroupVoiceRecording=false; pendingGroupChatImg=null;
  if(groupVoiceTimer){ clearInterval(groupVoiceTimer); groupVoiceTimer=null; }
  const gep=document.getElementById('groupChatEmojiPicker'); if(gep) gep.classList.add('hidden');
  const gip=document.getElementById('groupChatImgPreviewBar'); if(gip) gip.classList.add('hidden');
  const gvb=document.getElementById('groupVoiceConfirmBar'); if(gvb) gvb.classList.add('hidden');
  const gir=document.getElementById('groupChatInputRow'); if(gir) gir.classList.remove('hidden');
  document.getElementById('groupChatView').classList.add('hidden');
  document.getElementById('groupsListView').classList.remove('hidden');
}

function renderGroupMessages(){
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const msgs=group.msgs||[];
  const pinned=msgs.filter(m=>m.pinned && !m.deleted);
  const pinnedBanner = pinned.length ? `<div onclick="openGroupPinnedModal(${group.id})" style="display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:8px 12px;margin:8px 12px 0;cursor:pointer;">
      <span style="font-size:14px;">📌</span>
      <span style="font-size:11px;color:var(--text2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pinned[pinned.length-1].type==='image'?'📷 ছবি':(pinned[pinned.length-1].text||'')}</span>
      <span style="font-size:10px;color:var(--muted);">${pinned.length} pinned</span>
    </div>` : '';
  const totalMembers=(group.memberIds||[]).length;
  document.getElementById('groupChatMessages').innerHTML=pinnedBanner+msgs.filter(m=>!m.deleted).map(msg=>{
    const isMe=msg.from===ME.name||msg.from==='me';
    const mid=msg.id||0;
    // Seen count
    if(isMe && !msg.seenBy) msg.seenBy=[];
    const seenCount=isMe?(msg.seenBy||[]).length:0;
    const seenHtml=isMe&&seenCount>0?`<div style="font-size:9px;color:var(--muted);text-align:right;margin-top:2px;padding-right:4px;">👁 ${seenCount} জন দেখেছে</div>`:'';
    // Reaction
    const reactionHtml=msg.reaction?`<div class="msg-reaction-badge" onclick="event.stopPropagation();openGroupMsgMenu(${mid},event.clientX,event.clientY,${isMe})">${msg.reaction}</div>`:'';
    // Reply preview
    let replyHtml='';
    if(msg.replyTo) replyHtml=`<div class="reply-preview">${msg.replyTo.from===ME.name||msg.replyTo.from==='me'?'তুমি: ':msg.replyTo.from+': '}${msg.replyTo.text.substring(0,50)}</div>`;
    let bubbleContent='';
    if(msg.type==='voice'){
      const bars=Array(10).fill(0).map((_,i)=>`<div class="voice-bar" style="height:${5+((i*3+7)%12)}px;"></div>`).join('');
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} voice-msg">
        <button class="voice-play-btn" onclick="showToast('▶️ Playing...')">▶</button>
        <div class="voice-wave">${bars}</div>
        <span style="font-size:10px;opacity:0.75;">${msg.duration||'0:03'}</span>
      </div>`;
    } else if(msg.type==='image'){
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} img-msg"><img src="${msg.img}" onclick="viewChatImage('${msg.img}')" alt="image"><div class="msg-time ${isMe?'me':'them'}" style="padding:2px 6px;">${msg.time}</div></div>`;
    } else if(groupEditingMsgId===mid && isMe){
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'}" style="padding:6px 8px;">
        <textarea id="groupEditInput-${mid}" style="width:100%;background:transparent;border:none;color:inherit;font-size:13px;resize:none;outline:none;" rows="2">${msg.text}</textarea>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <button onclick="saveEditGroupMsg(${mid})" style="font-size:11px;background:var(--accent);color:#fff;border:none;border-radius:6px;padding:3px 8px;cursor:pointer;">✅ Save</button>
          <button onclick="cancelEditGroupMsg()" style="font-size:11px;background:var(--bg3);color:var(--text);border:none;border-radius:6px;padding:3px 8px;cursor:pointer;">✕ বাতিল</button>
        </div>
      </div>`;
    } else {
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'}">${replyHtml}${msg.pinned?'<span style="font-size:10px;margin-right:4px;">📌</span>':''}${msg.text}${msg.edited?'<span style="font-size:9px;opacity:0.6;margin-left:4px;">(edited)</span>':''}<div class="msg-time ${isMe?'me':'them'}">${msg.time}</div></div>`;
    }
    return `<div class="msg-bubble-wrap ${isMe?'me':'them'}" data-mid="${mid}"
        oncontextmenu="event.preventDefault();openGroupMsgMenu(${mid},event.clientX,event.clientY,${isMe?'true':'false'});"
        ontouchstart="groupMsgTouchStart(${mid},event)" ontouchend="groupMsgTouchEnd()">
      <div style="position:relative;">
        ${!isMe?(()=>{
          // sender avatar - messenger style
          const sUser=MOCK_USERS.find(u=>u.name===msg.from);
          const aLetter=sUser?sUser.avatar:(msg.from||'?')[0];
          const dc=sUser?getDeptColor(sUser.dept||'ict'):'#6C63FF';
          const aImg=sUser&&sUser.profileImg?`<img src="${sUser.profileImg}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:`<span>${aLetter}</span>`;
          return `<div style="font-size:10px;color:var(--muted);margin-left:38px;margin-bottom:2px;">${msg.from}</div>`;
        })():''}
        <div style="display:flex;align-items:flex-end;gap:8px;${isMe?'flex-direction:row-reverse;justify-content:flex-start;':''}">
          ${!isMe?(()=>{
            const sUser=MOCK_USERS.find(u=>u.name===msg.from);
            const aLetter=sUser?sUser.avatar:(msg.from||'?')[0];
            const dc=sUser?getDeptColor(sUser.dept||'ict'):'#6C63FF';
            const aImg=sUser&&sUser.profileImg?`<img src="${sUser.profileImg}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:`${aLetter}`;
            return `<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:linear-gradient(135deg,${dc},${dc}99);flex-shrink:0;">${aImg}</div>`;
          })():''}
          ${bubbleContent}${reactionHtml}
        </div>
        ${seenHtml}
      </div>
    </div>`;
  }).join('');
  const c=document.getElementById('groupChatMessages');
  c.scrollTop=c.scrollHeight;
}
let groupTouchHoldTimer=null;
function groupMsgTouchStart(msgId,e){
  groupTouchHoldTimer=setTimeout(()=>{ groupTouchHoldTimer=null; openGroupMsgMenu(msgId,e.touches[0].clientX,e.touches[0].clientY,false); },500);
}
function groupMsgTouchEnd(){ if(groupTouchHoldTimer){ clearTimeout(groupTouchHoldTimer); groupTouchHoldTimer=null; } }

function sendGroupMessage(){
  const input=document.getElementById('groupMsgInput');
  const txt=input.value.trim();
  if(!selectedGroupChat) return;
  if(!txt && !pendingGroupChatImg) return;
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  if(group.messagePermission==='adminsOnly' && !canManageGroup(group)){
    showToast('🔒 এই গ্রুপে শুধু Admin/Moderator রা মেসেজ পাঠাতে পারবে');
    return;
  }
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  if(!group.msgs) group.msgs=[];
  if(pendingGroupChatImg){
    group.msgs.push({id:Date.now(),from:ME.name,type:'image',img:pendingGroupChatImg,time,seenBy:[]});
    cancelGroupChatImage();
  }
  if(txt){
    const msgObj={id:Date.now()+1,from:ME.name,text:txt,time,seenBy:[]};
    if(groupReplyingTo) msgObj.replyTo=groupReplyingTo;
    group.msgs.push(msgObj);
  }
  groupReplyingTo=null;
  const rBar=document.getElementById('groupReplyBar');
  if(rBar) rBar.classList.add('hidden');
  input.value=''; input.style.height='auto';
  closeGroupChatEmoji();
  renderGroupMessages();
  // Simulate other members seeing the message
  setTimeout(()=>{
    const lastMsg=group.msgs[group.msgs.length-1];
    const otherUsers=[...MOCK_USERS].filter(u=>u.id!==0&&(group.memberIds||[]).includes(u.id));
    const otherUsers2=[ME,...MOCK_USERS].filter(u=>u.id!==0);
    const rUser=otherUsers2[Math.floor(Math.random()*otherUsers2.length)];
    const replies=["আচ্ছা, বুঝলাম 👍","ঠিক আছে ভাই!","হ্যাঁ, একমত 😊","দারুণ idea! 🔥","কাল নিয়ে কথা হবে"];
    // simulate 1-3 members seeing it
    const seenUsers=otherUsers.slice(0, Math.min(otherUsers.length, 1+Math.floor(Math.random()*2)));
    if(lastMsg && lastMsg.from===ME.name){
      lastMsg.seenBy=seenUsers.map(u=>u.name);
    }
    group.msgs.push({id:Date.now(),from:rUser.name,text:replies[Math.floor(Math.random()*replies.length)],time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})});
    renderGroupMessages();
  },1200);
}

function groupChatKeyDown(e){
  if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendGroupMessage(); }
}
function onGroupChatInput(el){
  el.style.height='auto';
  el.style.height=Math.min(el.scrollHeight,100)+'px';
}

let groupChatEmojiOpen=false;
function toggleGroupChatEmoji(){
  groupChatEmojiOpen=!groupChatEmojiOpen;
  document.getElementById('groupChatEmojiPicker').classList.toggle('hidden',!groupChatEmojiOpen);
  document.getElementById('groupEmojiToggleBtn').textContent=groupChatEmojiOpen?'⌨️':'😊';
  if(!groupChatEmojiOpen){ const ex=document.getElementById('groupEmojiExtra'); if(ex) ex.style.display='none'; const btn=document.getElementById('groupEmojiExpandBtn'); if(btn) btn.textContent='+'; }
}
function toggleGroupEmojiExpand(){
  const ex=document.getElementById('groupEmojiExtra');
  const btn=document.getElementById('groupEmojiExpandBtn');
  if(!ex) return;
  const open=ex.style.display==='flex';
  ex.style.display=open?'none':'flex';
  if(btn) btn.textContent=open?'+':'−';
}
function closeGroupChatEmoji(){
  groupChatEmojiOpen=false;
  const ep=document.getElementById('groupChatEmojiPicker');
  if(ep) ep.classList.add('hidden');
  const eb=document.getElementById('groupEmojiToggleBtn');
  if(eb) eb.textContent='😊';
}
function addGroupChatEmoji(emoji){
  const inp=document.getElementById('groupMsgInput');
  inp.value+=emoji; inp.focus(); onGroupChatInput(inp);
}

// ===== GROUP CHAT IMAGE =====
let pendingGroupChatImg=null;
function handleGroupChatImgSelect(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    pendingGroupChatImg=ev.target.result;
    document.getElementById('groupChatImgPreviewThumb').src=pendingGroupChatImg;
    document.getElementById('groupChatImgPreviewBar').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
  e.target.value='';
}
function cancelGroupChatImage(){
  pendingGroupChatImg=null;
  document.getElementById('groupChatImgPreviewBar').classList.add('hidden');
  document.getElementById('groupChatImgPreviewThumb').src='';
}

// ===== GROUP CHAT VOICE RECORD =====
let isGroupVoiceRecording=false;
let groupVoiceTimer=null;
let groupVoiceSeconds=0;
function startGroupVoiceRecord(){
  if(isGroupVoiceRecording) return;
  isGroupVoiceRecording=true; groupVoiceSeconds=0;
  document.getElementById('groupChatInputRow').classList.add('hidden');
  document.getElementById('groupVoiceConfirmBar').classList.remove('hidden');
  closeGroupChatEmoji();
  const waveEl=document.getElementById('groupVcWave');
  waveEl.innerHTML=Array(16).fill(0).map((_,i)=>`<div class="voice-confirm-bar-el" style="height:${5+((i*7+3)%14)}px;animation-delay:${i*0.06}s;"></div>`).join('');
  groupVoiceTimer=setInterval(()=>{
    groupVoiceSeconds++;
    const m=Math.floor(groupVoiceSeconds/60);
    const s=groupVoiceSeconds%60;
    document.getElementById('groupVcTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;
  },1000);
}
function cancelGroupVoiceRecord(){
  isGroupVoiceRecording=false; clearInterval(groupVoiceTimer); groupVoiceTimer=null; groupVoiceSeconds=0;
  document.getElementById('groupVcTimer').textContent='0:00';
  document.getElementById('groupChatInputRow').classList.remove('hidden');
  document.getElementById('groupVoiceConfirmBar').classList.add('hidden');
  showToast('🗑️ Voice message বাতিল করা হয়েছে');
}
function sendGroupVoiceRecord(){
  if(!isGroupVoiceRecording) return;
  isGroupVoiceRecording=false; clearInterval(groupVoiceTimer); groupVoiceTimer=null;
  const m=Math.floor(groupVoiceSeconds/60), s=groupVoiceSeconds%60;
  const dur=`${m}:${String(Math.max(s,1)).padStart(2,'0')}`;
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  document.getElementById('groupVcTimer').textContent='0:00';
  document.getElementById('groupChatInputRow').classList.remove('hidden');
  document.getElementById('groupVoiceConfirmBar').classList.add('hidden');
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  if(!group.msgs) group.msgs=[];
  group.msgs.push({id:Date.now(),from:ME.name,type:'voice',duration:dur,time});
  renderGroupMessages();
  showToast(`🎙️ Voice message পাঠানো হয়েছে (${dur}) ✅`);
}

function showGroupInfo(){
  const group=studyGroups.find(g=>g.id===selectedGroupChat); if(!group) return;
  const dc=getDeptColor(group.dept);
  const admin=isGroupAdmin(group);
  const muted=isGroupMuted(group);
  const actions=[
    {icon:'📞',label:'Audio',onclick:"callUser()"},
    {icon:'🎥',label:'Video',onclick:"videoCallUser()"},
  ];
  if(admin) actions.push({icon:'➕',label:'Invite',onclick:`openAddGroupMemberModal(${group.id})`});
  actions.push({icon:muted?'🔕':'🔔',label:muted?'Unmute':'Mute',onclick:`toggleGroupMute(${group.id})`,bg:muted?'#F7258522':'var(--bg3)',color:muted?'var(--red)':'var(--text)'});

  openInfoModal(group.name,`
    <div style="text-align:center;padding:4px 0 4px;">
      <div style="width:64px;height:64px;border-radius:18px;background:${dc}22;border:2px solid ${dc};display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 10px;">👥</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);">${group.name}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">${(group.memberIds||[]).length} জন সদস্য • ${getDeptName(group.dept)}</div>
      ${group.desc?`<div style="font-size:12px;color:var(--text2);margin-top:8px;padding:0 12px;">${group.desc}</div>`:''}
    </div>
    ${actionIconRow(actions)}
    ${infoSectionLabel('Chat Info')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'👥',bg:'#6C63FF22',text:'সদস্যরা দেখো',sub:(group.memberIds||[]).length+' জন',onclick:`openGroupMembersModal(${group.id})`})}
      ${infoRow({icon:'🖼️',bg:'#4CC9F022',text:'Media, Files & Links',sub:collectMedia(group.msgs).length+' টি media',onclick:`openGroupMediaModal(${group.id})`})}
      ${infoRow({icon:'📌',bg:'#F4A26122',text:'Pinned Messages',onclick:`openGroupPinnedModal(${group.id})`})}
      ${infoRow({icon:'🔍',bg:'#06D6A022',text:'এই গ্রুপে খোঁজো',onclick:`closeInfoModal();showToast('🔍 শীঘ্রই আসছে')`})}
    </div>
    ${admin?infoSectionLabel('Admin Controls'):''}
    ${admin?`<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'🔐',bg:'#9B5DE522',text:'মেসেজ পারমিশন',sub:group.messagePermission==='adminsOnly'?'শুধু Admin/Moderator লিখতে পারবে':'সবাই লিখতে পারবে',onclick:`toggleGroupMsgPermission(${group.id})`,
        trailing:`<div style="width:36px;height:20px;border-radius:10px;background:${group.messagePermission==='adminsOnly'?'var(--accent)':'var(--bg4)'};position:relative;"><div style="width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:2px;left:${group.messagePermission==='adminsOnly'?'18px':'2px'};transition:left 0.15s;"></div></div>`})}
    </div>`:''}
    ${infoSectionLabel('Privacy & Support')}
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;overflow:hidden;">
      ${infoRow({icon:'⚠️',bg:'#F7258522',text:'Report করো',sub:'গ্রুপ সম্পর্কে ফিডব্যাক দাও',onclick:`closeInfoModal();openReportModal('group',${group.id},'${group.name.replace(/'/g,"\\'")}');`})}
      ${infoRow({icon:'🚪',bg:'#F7258522',text:'গ্রুপ ছেড়ে দাও',onclick:`toggleGroup(${group.id});closeInfoModal();`,danger:true,trailing:'<span></span>'})}
      ${(admin && group.creatorId===ME.id)?infoRow({icon:'🗑️',bg:'#F7258522',text:'গ্রুপ ডিলিট করো',sub:'সবার জন্য স্থায়ীভাবে মুছে যাবে',onclick:`deleteStudyGroup(${group.id})`,danger:true,trailing:'<span></span>'}):''}
    </div>
  `);
}

function deleteStudyGroup(groupId){
  const group=studyGroups.find(g=>g.id===groupId); if(!group) return;
  studyGroups=studyGroups.filter(g=>g.id!==groupId);
  joinedGroups=joinedGroups.filter(id=>id!==groupId);
  if(selectedGroupChat===groupId) backToGroupsList();
  closeInfoModal();
  renderGroups();
  showToast('🗑️ গ্রুপ ডিলিট করা হয়েছে');
}

// ===== GROUP POST FEED =====
function switchGroupTab(tab){
  selectedGroupTab=tab;
  document.getElementById('gTab-chat').classList.toggle('active',tab==='chat');
  document.getElementById('gTab-posts').classList.toggle('active',tab==='posts');
  document.getElementById('groupChatMessages').parentElement.style.display=tab==='chat'?'flex':'none';
  const feedEl=document.getElementById('groupFeedContainer');
  if(tab==='posts'){ feedEl.classList.remove('hidden'); renderGroupFeed(); }
  else feedEl.classList.add('hidden');
  // input wrap
  const inputWrap=document.getElementById('groupChatInputWrap');
  if(inputWrap){ inputWrap.style.display=tab==='chat'?'flex':'none'; }
  const feedInputWrap=document.getElementById('groupFeedInputWrap');
  if(feedInputWrap){ feedInputWrap.style.display=tab==='posts'?'flex':'none'; }
}

function renderGroupFeed(){
  const gid=selectedGroupChat; if(!gid) return;
  const container=document.getElementById('groupFeedPosts'); if(!container) return;
  const gPosts=groupPosts[gid]||[];
  if(!gPosts.length){ container.innerHTML=`<div class="empty-state"><div class="empty-state-icon">📭</div>এই গ্রুপে এখনো কোনো পোস্ট নেই</div>`; return; }
  container.innerHTML=gPosts.map(p=>renderPostCard(p,true)).join('');
}

function submitGroupPost(){
  const input=document.getElementById('groupPostInput'); if(!input) return;
  const txt=input.value.trim(); if(!txt&&!groupPostImg){ showToast('কিছু একটা লেখো!'); return; }
  const gid=selectedGroupChat; if(!gid) return;
  if(!groupPosts[gid]) groupPosts[gid]=[];
  const newPost={ id:Date.now(), userId:0, text:txt, time:'এইমাত্র', likes:0, comments:[], dept:ME.dept, reactions:{}, img:groupPostImg };
  groupPosts[gid].unshift(newPost);
  input.value=''; groupPostImg=null;
  document.getElementById('groupPostImgPreview').innerHTML='';
  renderGroupFeed(); showToast('গ্রুপে পোস্ট হয়েছে! ✅');
}

let groupPostImg=null;
function handleGroupPostImg(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    groupPostImg=ev.target.result;
    document.getElementById('groupPostImgPreview').innerHTML=`<div style="position:relative;margin-top:8px;"><img src="${groupPostImg}" style="width:100%;max-height:160px;border-radius:10px;object-fit:cover;" /><button onclick="groupPostImg=null;document.getElementById('groupPostImgPreview').innerHTML='';" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);border:none;border-radius:50%;width:22px;height:22px;color:#fff;cursor:pointer;font-size:12px;">✕</button></div>`;
  };
  reader.readAsDataURL(file);
}

function openCreateGroup(){
  const sel=document.getElementById('newGroupDept');
  sel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  document.getElementById('createGroupModal').classList.remove('hidden');
}
function closeCreateGroup(){ document.getElementById('createGroupModal').classList.add('hidden'); }
function createGroup(){
  const name=document.getElementById('newGroupName').value.trim();
  if(!name){ showToast('গ্রুপের নাম দাও'); return; }
  const dept=document.getElementById('newGroupDept').value;
  const desc=document.getElementById('newGroupDesc').value.trim();
  const newGroup={ id:Date.now(), name, dept, members:1, active:true, desc, msgs:[],
    creatorId:ME.id, admins:[ME.id], moderators:[], memberIds:[ME.id], messagePermission:'everyone', mutedByMe:false };
  studyGroups.unshift(newGroup); joinedGroups.push(newGroup.id);
  closeCreateGroup(); renderGroups();
  showToast(`"${name}" গ্রুপ তৈরি হয়েছে! তুমি এর Admin 🎉`);
}

