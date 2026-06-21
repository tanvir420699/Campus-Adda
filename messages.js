// ===== MESSAGES (UPGRADED v6) =====
let replyingTo = null;
let chatEmojiOpen = false;
let isVoiceRecording = false;
let voiceTimer = null;
let voiceSeconds = 0;
let pendingChatImg = null;
let unreadCounts = {};

function renderMsgList(){
  if(selectedChat){ showChatView(); return; }
  document.getElementById('msgList').classList.remove('hidden');
  document.getElementById('chatView').classList.add('hidden');
  const onlineEl=document.getElementById('onlineCountTxt');
  if(onlineEl) onlineEl.innerHTML=`<span style="width:7px;height:7px;border-radius:50%;background:var(--green);display:inline-block;"></span>${onlineFriendsCount()} জন অনলাইন`;
  const friendUsers=MOCK_USERS.filter(u=>friends.includes(u.id)&&!isBlocked(u.id));
  friendUsers.forEach(u=>{ if(unreadCounts[u.id]===undefined) unreadCounts[u.id]=messages[u.id]?Math.floor(Math.random()*3):0; });
  let html=friendUsers.map(user=>{
    const dc=getDeptColor(user.dept);
    const lastMsgs=messages[user.id];
    const lastMsg=lastMsgs?lastMsgs[lastMsgs.length-1]:null;
    const unread=unreadCounts[user.id]||0;
    const preview=lastMsg?(lastMsg.type==='voice'?'🎙️ Voice message':lastMsg.type==='image'?'📷 Photo':lastMsg.type==='story_reply'?'↪️ Story-তে reply দিয়েছে':lastMsg.type==='story_reaction'?`${lastMsg.emoji} Story-তে react করেছে`:(lastMsg.from==='me'?'তুমি: ':'')+(lastMsg.deleted?'🚫 Message delete করা হয়েছে':lastMsg.text)):'Message শুরু করো!';
    return `<div class="msg-item" onclick="openChat(${user.id})">
      <div class="avatar-wrap">
        <div class="avatar" style="width:46px;height:46px;font-size:17px;background:linear-gradient(135deg,${dc},${dc}88);">${user.avatar}</div>
        ${user.online?'<div class="online-dot"></div>':''}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <span style="font-size:13px;font-weight:${unread?'700':'600'};color:var(--text);">${user.name}</span>
          ${lastMsg?`<span style="font-size:10px;color:var(--muted);">${lastMsg.time}</span>`:''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:11px;color:${unread?'var(--text)':'var(--muted)'};font-weight:${unread?'500':'400'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${preview}</span>
          ${unread?`<div class="msg-unread-count">${unread}</div>`:''}
        </div>
        <div style="margin-top:2px;">${lastSeenText(user)}</div>
      </div>
    </div>`;
  }).join('');
  html += friendGroups.map(g=>{
    const lastMsg=g.msgs&&g.msgs.length?g.msgs[g.msgs.length-1]:null;
    const preview=lastMsg?(lastMsg.deleted?'🚫 Message delete করা হয়েছে':lastMsg.type==='voice'?'🎙️ Voice message':lastMsg.type==='image'?'📷 Photo':(lastMsg.from==='me'?'তুমি: ':lastMsg.fromName+': ')+(lastMsg.text||'')):'গ্রুপ মেসেজ শুরু করো!';
    return `<div class="msg-item" onclick="openFriendGroupChat(${g.id})">
      <div class="avatar-wrap">
        <div class="avatar" style="width:46px;height:46px;font-size:19px;background:linear-gradient(135deg,#6C63FF,#4CC9F0);">👥</div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <span style="font-size:13px;font-weight:600;color:var(--text);">${g.name}</span>
          ${lastMsg?`<span style="font-size:10px;color:var(--muted);">${lastMsg.time}</span>`:''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${preview}</span>
        </div>
        <div style="margin-top:2px;font-size:10px;color:var(--muted);">👥 ${g.memberIds.length+1} জন সদস্য</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('msgListItems').innerHTML=html||`<div class="empty-state"><div class="empty-state-icon">💬</div>এখনো কোনো মেসেজ নেই</div>`;
}

function openChat(userId){
  selectedChat=userId;
  unreadCounts[userId]=0;
  showChatView();
}

function showChatView(){
  if(isFriendGroupChat(selectedChat)){ showFriendGroupChatView(); return; }
  const user=getUser(selectedChat); if(!user) return;
  document.getElementById('msgList').classList.add('hidden');
  document.getElementById('chatView').classList.remove('hidden');
  const dc=getDeptColor(user.dept);
  const avEl=document.getElementById('chatAvatar');
  avEl.textContent=user.avatar; avEl.style.background=`linear-gradient(135deg,${dc},${dc}88)`;
  document.getElementById('chatName').textContent=user.name;
  const st=document.getElementById('chatStatus');
  const onlineDot=document.getElementById('chatOnlineDot');
  if(user.online){
    st.innerHTML='<span style="color:#06D6A0;">● অনলাইন</span>';
    onlineDot.classList.remove('hidden');
  } else {
    st.innerHTML = lastSeenText(user);
    onlineDot.classList.add('hidden');
  }
  if(messages[selectedChat]) messages[selectedChat].forEach(m=>{ if(m.from==='them') m.seen=true; });
  closeChatSearch();
  renderChatMessages();
  setTimeout(()=>document.getElementById('msgInput').focus(), 100);
}

function showFriendGroupChatView(){
  const group=getFriendGroup(selectedChat); if(!group) return;
  document.getElementById('msgList').classList.add('hidden');
  document.getElementById('chatView').classList.remove('hidden');
  const avEl=document.getElementById('chatAvatar');
  avEl.textContent='👥'; avEl.style.background='linear-gradient(135deg,#6C63FF,#4CC9F0)';
  document.getElementById('chatName').textContent=group.name;
  const memberNames=group.memberIds.map(id=>getUser(id)?.name).filter(Boolean).join(', ');
  document.getElementById('chatStatus').textContent=`👥 ${memberNames}`;
  document.getElementById('chatOnlineDot').classList.add('hidden');
  closeChatSearch();
  renderChatMessages();
  setTimeout(()=>document.getElementById('msgInput').focus(), 100);
}

function renderChatMessages(){
  const isGroup=isFriendGroupChat(selectedChat);
  const group=isGroup?getFriendGroup(selectedChat):null;
  const msgs=isGroup?(group?group.msgs||[]:[]):(messages[selectedChat]||[]);
  const container=document.getElementById('chatMessages');
  const pinned=msgs.filter(m=>m.pinned && !m.deleted);
  let html=pinned.length?`<div onclick="openDMPinnedModal()" style="display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:8px 12px;margin-bottom:8px;cursor:pointer;">
      <span style="font-size:14px;">📌</span>
      <span style="font-size:11px;color:var(--text2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pinned[pinned.length-1].type==='image'?'📷 ছবি':(pinned[pinned.length-1].text||'')}</span>
      <span style="font-size:10px;color:var(--muted);">${pinned.length} pinned</span>
    </div>`:'';
  html+='<div class="msg-date-divider"><span class="msg-date-pill">আজকে</span></div>';
  for(let idx=0;idx<msgs.length;idx++){ const msg=msgs[idx];
    const isMe=msg.from==='me';
    let tick='';
    if(isMe && !isGroup){
      if(msg.seen) tick='<span class="msg-tick seen">✓✓</span>';
      else if(msg.delivered) tick='<span class="msg-tick" style="color:var(--muted)">✓✓</span>';
      else tick='<span class="msg-tick" style="color:var(--muted)">✓</span>';
    }
    let replyHtml='';
    if(msg.replyTo) replyHtml=`<div class="reply-preview">${msg.replyTo.from==='me'?'তুমি: ':''}${msg.replyTo.text.substring(0,55)}</div>`;
    const reactionHtml=msg.reaction?`<div class="msg-reaction-badge" onclick="event.stopPropagation();openReactionPicker(${isGroup?`'${selectedChat}'`:selectedChat},${msg.id},event)">${msg.reaction}</div>`:'';
    const senderLabel=(isGroup && !isMe)?`<div style="font-size:10px;color:var(--muted);margin:0 4px 2px;">${msg.fromName||'বন্ধু'}</div>`:'';
    // deleted message
    if(msg.deleted){
      html+=`<div class="msg-bubble-wrap" data-mid="${msg.id}">
        ${senderLabel}
        <div class="msg-bubble-row ${isMe?'me':'them'}">
          <div class="msg-bubble ${isMe?'me':'them'}" style="opacity:0.5;font-style:italic;">🚫 Message delete করা হয়েছে</div>
        </div>
        <div class="msg-meta ${isMe?'me':''}"><span class="msg-time-txt">${msg.time}</span></div>
      </div>`;
      continue;
    }
    // edit mode
    if(isMe && editingMsgId===msg.id && msg.type!=='voice'){
      html+=`<div class="msg-bubble-wrap" data-mid="${msg.id}">
        <div class="msg-bubble-row me" style="flex-direction:column;align-items:flex-end;gap:4px;width:100%;">
          <textarea class="msg-edit-input" id="editInput-${msg.id}" rows="2" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();saveEditMsg(${msg.id})}">${msg.text}</textarea>
          <div style="display:flex;gap:8px;">
            <button onclick="saveEditMsg(${msg.id})" style="background:linear-gradient(135deg,#6C63FF,#4CC9F0);border:none;border-radius:16px;padding:5px 14px;color:#fff;font-size:11px;font-weight:600;cursor:pointer;">✅ Save</button>
            <button onclick="cancelEditMsg()" style="background:var(--bg4);border:none;border-radius:16px;padding:5px 14px;color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;">❌ বাতিল</button>
          </div>
        </div>
      </div>`;
      continue;
    }
    let bubbleContent='';
    if(msg.type==='voice'){
      const bars=Array(10).fill(0).map((_,i)=>`<div class="voice-bar" style="height:${5+((i*3+7)%12)}px;"></div>`).join('');
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} voice-msg">
        <button class="voice-play-btn" onclick="showToast('▶️ Playing...')">▶</button>
        <div class="voice-wave">${bars}</div>
        <span style="font-size:10px;opacity:0.75;">${msg.duration||'0:03'}</span>
      </div>`;
    } else if(msg.type==='image'){
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} img-msg"><img src="${msg.img}" onclick="viewChatImage('${msg.img}')" alt="image"></div>`;
    } else if(msg.type==='story_reply'){
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} story-msg-bubble">
        <div class="story-msg-label">↪️ Story-তে reply</div>
        <div class="story-msg-row">${storyQuoteSnippetHtml(msg.storyRef)}<div class="story-msg-text">${msg.text}</div></div>
      </div>`;
    } else if(msg.type==='story_reaction'){
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'} story-msg-bubble">
        <div class="story-msg-label">Story-তে react করেছে</div>
        <div class="story-msg-row">${storyQuoteSnippetHtml(msg.storyRef)}<div class="story-msg-text" style="font-size:20px;">${msg.emoji}</div></div>
      </div>`;
    } else {
      bubbleContent=`<div class="msg-bubble ${isMe?'me':'them'}">${replyHtml}${msg.pinned?'<span style="font-size:10px;margin-right:4px;">📌</span>':''}${msg.text}${msg.edited?'<span style="font-size:9px;opacity:0.6;margin-left:4px;">(edited)</span>':''}</div>`;
    }
    // avatar for other person (them side) - messenger style
    let avatarHtml='';
    if(!isMe){
      const senderUser = isGroup ? getUser(msg.fromId) || MOCK_USERS.find(u=>u.name===msg.fromName) : getUser(selectedChat);
      const avatarLetter = senderUser ? senderUser.avatar : (msg.fromName||'?')[0];
      const dc = senderUser ? getDeptColor(senderUser.dept||'ict') : '#6C63FF';
      const avatarImg = senderUser && senderUser.profileImg ? `<img src="${senderUser.profileImg}" alt="">` : `<span>${avatarLetter}</span>`;
      // only show avatar on last consecutive message from same sender
      const nextMsg = msgs[idx+1];
      const isLastInGroup = !nextMsg || nextMsg.from==='me' || (nextMsg.fromName !== msg.fromName && isGroup);
      avatarHtml = isLastInGroup
        ? `<div class="msg-sender-avatar" style="background:linear-gradient(135deg,${dc},${dc}99);">${avatarImg}</div>`
        : `<div class="msg-sender-avatar hidden-avatar"></div>`;
    }
    html+=`<div class="msg-bubble-wrap ${isMe?'me':'them'}" data-mid="${msg.id}">
      ${(!isMe&&isGroup)?`<div style="font-size:10px;color:var(--muted);margin-left:38px;margin-bottom:2px;">${msg.fromName||'বন্ধু'}</div>`:''}
      <div class="msg-bubble-row ${isMe?'me':'them'}" style="position:relative;"
        ondblclick="setReply(${idx})"
        oncontextmenu="event.preventDefault();openMsgMenu(${msg.id},event.clientX,event.clientY,${isMe?'true':'false'});"
        ontouchstart="msgTouchStart(${msg.id},${idx},${isMe?'true':'false'},event)"
        ontouchend="msgTouchEnd()"
        title="Hold to see options | Double tap to reply">
        ${!isMe ? avatarHtml : ''}
        ${bubbleContent}${reactionHtml}
      </div>
      <div class="msg-meta ${isMe?'me':''}" style="${!isMe?'padding-left:38px;':''}">
        <span class="msg-time-txt">${msg.time}</span>${tick}
      </div>
    </div>`;
  }
  container.innerHTML=html;
  container.scrollTop=container.scrollHeight;
  if(chatSearchTerm) applyChatSearchHighlight();
}

function backToMsgList(){
  selectedChat=null; replyingTo=null; chatEmojiOpen=false; isVoiceRecording=false; pendingChatImg=null;
  if(voiceTimer){ clearInterval(voiceTimer); voiceTimer=null; }
  closeChatSearch();
  document.getElementById('chatView').classList.add('hidden');
  document.getElementById('msgList').classList.remove('hidden');
  document.getElementById('chatEmojiPicker').classList.add('hidden');
  document.getElementById('chatImgPreviewBar').classList.add('hidden');
  renderMsgList();
}

function chatKeyDown(e){
  if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMessage(); }
}
function onChatInput(el){
  el.style.height='auto';
  el.style.height=Math.min(el.scrollHeight,100)+'px';
}

function sendMessage(){
  if(isFriendGroupChat(selectedChat)){ sendFriendGroupMessage(); return; }
  const input=document.getElementById('msgInput');
  const txt=input.value.trim();
  if(!selectedChat) return;
  if(!txt && !pendingChatImg) return;
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  if(!messages[selectedChat]) messages[selectedChat]=[];
  if(pendingChatImg){
    const imgMsg={id:Date.now(),from:'me',type:'image',img:pendingChatImg,time,delivered:false,seen:false};
    messages[selectedChat].push(imgMsg);
    cancelChatImage();
    setTimeout(()=>{ imgMsg.delivered=true; renderChatMessages(); },500);
  }
  if(txt){
    const msgObj={id:Date.now()+1,from:'me',text:txt,time,delivered:false,seen:false};
    if(replyingTo) msgObj.replyTo=replyingTo;
    messages[selectedChat].push(msgObj);
    setTimeout(()=>{ msgObj.delivered=true; renderChatMessages(); },500);
  }
  input.value=''; input.style.height='auto';
  replyingTo=null;
  document.getElementById('replyBar').classList.add('hidden');
  closeChatEmoji();
  renderChatMessages();
  // typing indicator then auto reply
  const c=document.getElementById('chatMessages');
  setTimeout(()=>{
    const typingEl=document.createElement('div');
    typingEl.id='typingInd'; typingEl.style.cssText='display:flex;padding:4px 0;';
    typingEl.innerHTML=`<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    c.appendChild(typingEl); c.scrollTop=c.scrollHeight;
    setTimeout(()=>{
      const ti=document.getElementById('typingInd'); if(ti) ti.remove();
      const replies=["হ্যাঁ, বুঝতে পারলাম! 😊","ঠিক আছে 👍","একটু পরে জানাচ্ছি","দারুণ! ধন্যবাদ 🙏","OK sure! ✅","আচ্ছা বুঝলাম","হ্যাঁ ভাই 🔥","নিশ্চয়ই! 😎","আমিও তাই ভাবছিলাম 🤔","ঠিকই বলেছো!"];
      const rt=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
      messages[selectedChat].push({id:Date.now(),from:'them',text:replies[Math.floor(Math.random()*replies.length)],time:rt,seen:false});
      setTimeout(()=>{ messages[selectedChat].forEach(m=>{ if(m.from==='me') m.seen=true; }); renderChatMessages(); },500);
      renderChatMessages();
    },700+Math.random()*600);
  },350);
}

function handleChatImgSelect(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    pendingChatImg=ev.target.result;
    document.getElementById('chatImgPreviewThumb').src=pendingChatImg;
    document.getElementById('chatImgPreviewBar').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
  e.target.value='';
}
function cancelChatImage(){
  pendingChatImg=null;
  document.getElementById('chatImgPreviewBar').classList.add('hidden');
  document.getElementById('chatImgPreviewThumb').src='';
}
function viewChatImage(src){
  openInfoModal('ছবি',`<div style="text-align:center;"><img src="${src}" style="max-width:100%;border-radius:12px;"></div>`);
}

function setReply(idx){
  const msg=(getCurrentMsgs()||[])[idx]; if(!msg) return;
  replyingTo={from:msg.from,text:msg.type==='voice'?'🎙️ Voice message':(msg.text||'')};
  document.getElementById('replyBar').classList.remove('hidden');
  document.getElementById('replyToName').textContent=msg.from==='me'?'তুমি':(msg.fromName||'ওরা');
  document.getElementById('replyToText').textContent=' '+replyingTo.text.substring(0,50);
  document.getElementById('msgInput').focus();
}
function cancelReply(){
  replyingTo=null;
  document.getElementById('replyBar').classList.add('hidden');
}
function toggleChatEmoji(){
  chatEmojiOpen=!chatEmojiOpen;
  document.getElementById('chatEmojiPicker').classList.toggle('hidden',!chatEmojiOpen);
  document.getElementById('emojiToggleBtn').textContent=chatEmojiOpen?'⌨️':'😊';
  if(!chatEmojiOpen){ const ex=document.getElementById('chatEmojiExtra'); if(ex) ex.style.display='none'; const btn=document.getElementById('chatEmojiExpandBtn'); if(btn) btn.textContent='+'; }
}
function toggleChatEmojiExpand(){
  const ex=document.getElementById('chatEmojiExtra');
  const btn=document.getElementById('chatEmojiExpandBtn');
  if(!ex) return;
  const open=ex.style.display==='flex';
  ex.style.display=open?'none':'flex';
  if(btn) btn.textContent=open?'+':'−';
}
function closeChatEmoji(){
  chatEmojiOpen=false;
  const ep=document.getElementById('chatEmojiPicker');
  if(ep) ep.classList.add('hidden');
  const eb=document.getElementById('emojiToggleBtn');
  if(eb) eb.textContent='😊';
}
function addChatEmoji(emoji){
  const inp=document.getElementById('msgInput');
  inp.value+=emoji; inp.focus(); onChatInput(inp);
}
// ===== VOICE RECORD (confirm before send) =====
function startVoiceRecord(){
  if(isVoiceRecording) return;
  isVoiceRecording=true; voiceSeconds=0;
  document.getElementById('chatInputRow').classList.add('hidden');
  document.getElementById('voiceConfirmBar').classList.remove('hidden');
  closeChatEmoji();
  // build wave bars
  const waveEl=document.getElementById('vcWave');
  waveEl.innerHTML=Array(16).fill(0).map((_,i)=>`<div class="voice-confirm-bar-el" style="height:${5+((i*7+3)%14)}px;animation-delay:${i*0.06}s;"></div>`).join('');
  voiceTimer=setInterval(()=>{
    voiceSeconds++;
    const m=Math.floor(voiceSeconds/60);
    const s=voiceSeconds%60;
    document.getElementById('vcTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;
  },1000);
}

function cancelVoiceRecord(){
  isVoiceRecording=false; clearInterval(voiceTimer); voiceTimer=null; voiceSeconds=0;
  document.getElementById('vcTimer').textContent='0:00';
  document.getElementById('chatInputRow').classList.remove('hidden');
  document.getElementById('voiceConfirmBar').classList.add('hidden');
  showToast('🗑️ Voice message বাতিল করা হয়েছে');
}

function sendVoiceRecord(){
  if(!isVoiceRecording) return;
  isVoiceRecording=false; clearInterval(voiceTimer); voiceTimer=null;
  const m=Math.floor(voiceSeconds/60), s=voiceSeconds%60;
  const dur=`${m}:${String(Math.max(s,1)).padStart(2,'0')}`;
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  document.getElementById('vcTimer').textContent='0:00';
  document.getElementById('chatInputRow').classList.remove('hidden');
  document.getElementById('voiceConfirmBar').classList.add('hidden');
  if(!messages[selectedChat]) messages[selectedChat]=[];
  const vm={id:Date.now(),from:'me',type:'voice',duration:dur,time,delivered:false,seen:false};
  messages[selectedChat].push(vm);
  renderChatMessages();
  setTimeout(()=>{ vm.delivered=true; renderChatMessages(); },500);
  showToast(`🎙️ Voice message পাঠানো হয়েছে (${dur}) ✅`);
  setTimeout(()=>{ messages[selectedChat].forEach(m=>{ if(m.from==='me') m.seen=true; }); renderChatMessages(); },1400);
}

// legacy compat
function toggleVoiceRecord(){ startVoiceRecord(); }

// ===== MSG EDIT & DELETE =====
let editingMsgId=null;
let msgContextTarget=null;

function openMsgMenu(msgId, x, y, isMe){
  closeMsgMenu();
  const isGroup=isFriendGroupChat(selectedChat);
  const msgs=isGroup?(getFriendGroup(selectedChat)?.msgs||[]):(messages[selectedChat]||[]);
  const msg=msgs.find(m=>m.id===msgId); if(!msg) return;
  const menu=document.createElement('div');
  menu.className='msg-ctx-menu'; menu.id='msgCtxMenu';
  menu.style.cssText='position:fixed;left:-9999px;top:-9999px;';
  menu.innerHTML=`
    <div class="msg-ctx-react-row">
      ${['❤️','😂','👍','😮','😢','🔥'].map(e=>`<span onclick="reactToMsg(${msgId},'${e}')">${e}</span>`).join('')}
    </div>
    ${(isMe&&msg.type!=='voice')?`<div class="msg-ctx-item" onclick="startEditMsg(${msgId})">✏️ &nbsp; Edit করো</div>`:''}
    <div class="msg-ctx-item" onclick="copyMsgText(${msgId})">📋 &nbsp; Copy করো</div>
    <div class="msg-ctx-item" onclick="setReplyById(${msgId})">↩️ &nbsp; Reply করো</div>
    <div class="msg-ctx-item" onclick="forwardMsg(${msgId})">↪️ &nbsp; Forward করো</div>
    <div class="msg-ctx-item" onclick="togglePinMsg(${msgId})">📌 &nbsp; ${msg.pinned?'Unpin করো':'Pin করো'}</div>
    ${isMe?`<div class="msg-ctx-item danger" onclick="deleteMsgById(${msgId})">🗑️ &nbsp; Delete করো</div>`:''}`;
  const bd=document.createElement('div');
  bd.className='msg-ctx-backdrop'; bd.id='msgCtxBackdrop';
  bd.onclick=closeMsgMenu;
  document.getElementById('app').appendChild(bd);
  document.getElementById('app').appendChild(menu);
  requestAnimationFrame(()=>{
    const mw=menu.offsetWidth||264, mh=menu.offsetHeight||220;
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

function openReactionPicker(chatId,msgId,e){
  openMsgMenu(msgId, e.clientX, e.clientY, false);
}

function reactToMsg(msgId, emoji){
  closeMsgMenu();
  const isGroup=isFriendGroupChat(selectedChat);
  const msgs=isGroup?(getFriendGroup(selectedChat)?.msgs||[]):(messages[selectedChat]||[]);
  const msg=msgs.find(m=>m.id===msgId); if(!msg) return;
  msg.reaction = msg.reaction===emoji ? null : emoji;
  renderChatMessages();
}

function closeMsgMenu(){
  const m=document.getElementById('msgCtxMenu'); if(m) m.remove();
  const b=document.getElementById('msgCtxBackdrop'); if(b) b.remove();
}

function getCurrentMsgs(){
  if(isFriendGroupChat(selectedChat)){ const g=getFriendGroup(selectedChat); return g?g.msgs:null; }
  return messages[selectedChat];
}

function startEditMsg(msgId){
  closeMsgMenu();
  editingMsgId=msgId;
  renderChatMessages();
  setTimeout(()=>{ const el=document.getElementById('editInput-'+msgId); if(el){el.focus();el.select();} },80);
}

function saveEditMsg(msgId){
  const el=document.getElementById('editInput-'+msgId); if(!el) return;
  const txt=el.value.trim(); if(!txt){ showToast('Message খালি রাখা যাবে না'); return; }
  const msg=(getCurrentMsgs()||[]).find(m=>m.id===msgId); if(!msg) return;
  msg.text=txt; msg.edited=true;
  editingMsgId=null; renderChatMessages();
  showToast('✅ Message edit হয়েছে');
}

function cancelEditMsg(){
  editingMsgId=null; renderChatMessages();
}

function deleteMsgById(msgId){
  closeMsgMenu();
  const msgs=getCurrentMsgs(); if(!msgs) return;
  const idx=msgs.findIndex(m=>m.id===msgId); if(idx===-1) return;
  msgs[idx]={...msgs[idx], deleted:true};
  renderChatMessages();
  showToast('🗑️ Message delete করা হয়েছে (Unsend)');
}

function copyMsgText(msgId){
  closeMsgMenu();
  const msg=(getCurrentMsgs()||[]).find(m=>m.id===msgId); if(!msg) return;
  if(navigator.clipboard) navigator.clipboard.writeText(msg.text||'').then(()=>showToast('📋 Copied!'));
  else showToast('📋 Copied!');
}

function forwardMsg(msgId){
  closeMsgMenu();
  const msg=(getCurrentMsgs()||[]).find(m=>m.id===msgId); if(!msg) return;
  if(navigator.clipboard) navigator.clipboard.writeText(msg.text||'').then(()=>showToast('↪️ Copied! অন্য chat এ paste করো'));
  else showToast('↪️ Forward করতে text copy করো');
}

function setReplyById(msgId){
  closeMsgMenu();
  const msgs=getCurrentMsgs()||[];
  const idx=msgs.findIndex(m=>m.id===msgId);
  if(idx!==-1) setReply(idx);
}
// Touch long-press for mobile
let touchHoldTimer=null;
function msgTouchStart(msgId, idx, isMe, e){
  touchHoldTimer=setTimeout(()=>{
    touchHoldTimer=null;
    openMsgMenu(msgId, e.touches[0].clientX, e.touches[0].clientY, isMe);
  },500);
}
function msgTouchEnd(){ if(touchHoldTimer){ clearTimeout(touchHoldTimer); touchHoldTimer=null; } }

function callUser(){ showToast('📞 Voice কলিং... (ডেমো — শীঘ্রই আসছে)'); }
function videoCallUser(){ showToast('🎥 Video কলিং... (ডেমো — শীঘ্রই আসছে)'); }

// ===== MESSAGE SEARCH (in-chat) =====
let chatSearchOpen=false;
let chatSearchTerm='';
function toggleChatSearch(){
  chatSearchOpen=!chatSearchOpen;
  const bar=document.getElementById('chatSearchBar');
  bar.classList.toggle('hidden', !chatSearchOpen);
  if(chatSearchOpen){ setTimeout(()=>document.getElementById('chatSearchInput').focus(),80); }
  else closeChatSearch();
}
function closeChatSearch(){
  chatSearchOpen=false; chatSearchTerm='';
  const bar=document.getElementById('chatSearchBar'); if(bar) bar.classList.add('hidden');
  const inp=document.getElementById('chatSearchInput'); if(inp) inp.value='';
  const cnt=document.getElementById('chatSearchCount'); if(cnt) cnt.textContent='';
  document.querySelectorAll('.msg-bubble-wrap').forEach(el=>{ el.style.opacity=''; el.style.outline=''; });
}
function runChatSearch(val){
  chatSearchTerm=val.trim();
  applyChatSearchHighlight();
}
function applyChatSearchHighlight(){
  const term=chatSearchTerm.toLowerCase();
  const wraps=document.querySelectorAll('#chatMessages .msg-bubble-wrap');
  let matchCount=0; let firstMatch=null;
  wraps.forEach(el=>{
    const text=el.textContent.toLowerCase();
    if(!term){ el.style.opacity=''; el.style.outline=''; return; }
    if(text.includes(term)){
      matchCount++;
      el.style.opacity='1';
      el.style.outline='2px solid var(--accent)';
      el.style.borderRadius='10px';
      if(!firstMatch) firstMatch=el;
    } else {
      el.style.opacity='0.3';
      el.style.outline='';
    }
  });
  const cnt=document.getElementById('chatSearchCount');
  if(cnt) cnt.textContent = term ? `${matchCount} টি ফলাফল` : '';
  if(firstMatch) firstMatch.scrollIntoView({block:'center', behavior:'smooth'});
}

// ===== FRIEND GROUPS (multi-friend group messaging) =====
function openNewGroupModal(){
  const friendUsers=MOCK_USERS.filter(u=>friends.includes(u.id)&&!isBlocked(u.id));
  const list=document.getElementById('newFGroupFriendList');
  if(!friendUsers.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-state-icon">🙁</div>গ্রুপ বানাতে আগে কিছু বন্ধু যোগ করো</div>`;
  } else {
    list.innerHTML=friendUsers.map(u=>{
      const dc=getDeptColor(u.dept);
      return `<label style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;background:var(--bg2);cursor:pointer;">
        <input type="checkbox" value="${u.id}" class="fgroup-friend-cb" style="width:16px;height:16px;accent-color:var(--accent);">
        <div class="avatar" style="width:32px;height:32px;font-size:13px;background:linear-gradient(135deg,${dc},${dc}88);">${u.avatar}</div>
        <span style="font-size:13px;color:var(--text);">${u.name}</span>
      </label>`;
    }).join('');
  }
  document.getElementById('newFGroupName').value='';
  document.getElementById('newGroupModal').classList.remove('hidden');
}
function closeNewGroupModal(){ document.getElementById('newGroupModal').classList.add('hidden'); }

function createFriendGroup(){
  const name=document.getElementById('newFGroupName').value.trim();
  const checked=[...document.querySelectorAll('.fgroup-friend-cb:checked')].map(c=>parseInt(c.value));
  if(checked.length<2){ showToast('কমপক্ষে ২ জন বন্ধু বেছে নাও'); return; }
  const finalName = name || checked.map(id=>getUser(id)?.name?.split(' ')[0]).filter(Boolean).join(', ');
  const newGroup={ id:nextFriendGroupId++, name:finalName, memberIds:checked, msgs:[],
    creatorId:ME.id, admins:[ME.id], moderators:[], mutedByMe:false, messagePermission:'everyone' };
  friendGroups.unshift(newGroup);
  closeNewGroupModal();
  showToast(`"${finalName}" গ্রুপ তৈরি হয়েছে! 🎉`);
  openFriendGroupChat(newGroup.id);
}

function openFriendGroupChat(groupId){
  selectedChat='fg_'+groupId;
  showChatView();
}

function sendFriendGroupMessage(){
  const group=getFriendGroup(selectedChat); if(!group) return;
  const input=document.getElementById('msgInput');
  const txt=input.value.trim();
  if(!txt && !pendingChatImg) return;
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  if(!group.msgs) group.msgs=[];
  if(pendingChatImg){
    group.msgs.push({id:Date.now(),from:'me',fromName:ME.name,type:'image',img:pendingChatImg,time});
    cancelChatImage();
  }
  if(txt){
    const msgObj={id:Date.now()+1,from:'me',fromName:ME.name,text:txt,time};
    if(replyingTo) msgObj.replyTo=replyingTo;
    group.msgs.push(msgObj);
  }
  input.value=''; input.style.height='auto';
  replyingTo=null;
  document.getElementById('replyBar').classList.add('hidden');
  closeChatEmoji();
  renderChatMessages();
  setTimeout(()=>{
    const replyUser=getUser(group.memberIds[Math.floor(Math.random()*group.memberIds.length)]);
    if(!replyUser) return;
    const replies=["হ্যাঁ, বুঝতে পারলাম! 😊","ঠিক আছে 👍","একটু পরে জানাচ্ছি","দারুণ! ধন্যবাদ 🙏","OK sure! ✅","আচ্ছা বুঝলাম"];
    const rt=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
    group.msgs.push({id:Date.now(),from:'them',fromName:replyUser.name,text:replies[Math.floor(Math.random()*replies.length)],time:rt});
    renderChatMessages();
  },900+Math.random()*600);
}

