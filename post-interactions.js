// ===== SHARE MODAL =====
function openShareModal(postId){
  const post=findPost(postId); if(!post) return;
  const friendUsers=MOCK_USERS.filter(u=>friends.includes(u.id));
  const friendsHtml=friendUsers.map(u=>{
    const dc=getDeptColor(u.dept);
    return `<div class="share-option" onclick="shareToFriend(${postId},${u.id})">
      <div class="share-option-icon" style="background:linear-gradient(135deg,${dc},${dc}66);">${u.avatar}</div>
      <div><div class="share-option-label">${u.name}</div><div style="font-size:10px;color:var(--muted);">${getDeptName(u.dept)}</div></div>
    </div>`;
  }).join('');
  openInfoModal('পোস্ট Share করো',`
    <div class="share-option" onclick="copyPostLink(${postId})">
      <div class="share-option-icon" style="background:#6C63FF22;">🔗</div>
      <div class="share-option-label">Link কপি করো</div>
    </div>
    <div class="share-option" onclick="shareToGroupFeed(${postId})">
      <div class="share-option-icon" style="background:#06D6A022;">👥</div>
      <div><div class="share-option-label">Group এ Share করো</div><div style="font-size:10px;color:var(--muted);">তোমার জয়েন করা গ্রুপে</div></div>
    </div>
    ${friendsHtml?`<div style="font-size:11px;font-weight:700;color:var(--muted2);margin:10px 0 4px;text-transform:uppercase;letter-spacing:0.5px;">Friends এ পাঠাও</div>${friendsHtml}`:''}
  `);
}
function copyPostLink(postId){
  const post=findPost(postId); if(!post) return;
  if(post) post.shares=(post.shares||0)+1;
  const url=buildShareLink('post', postId);
  if(navigator.clipboard) navigator.clipboard.writeText(url).catch(()=>{});
  closeInfoModal(); renderPosts(); showToast('Post link copied! 🔗');
}
function shareToFriend(postId, userId){
  const u=getUser(userId); if(!u) return;
  const post=findPost(postId); if(!post) return;
  if(!messages[userId]) messages[userId]=[];
  const time=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false});
  messages[userId].push({from:'me',text:`📎 পোস্ট শেয়ার: "${post.text.substring(0,50)}..."`,time,read:false});
  post.shares=(post.shares||0)+1;
  closeInfoModal(); renderPosts(); showToast(`${u.name} কে share করা হয়েছে! 📤`);
}
function shareToGroupFeed(postId){
  const post=findPost(postId); if(!post) return;
  if(joinedGroups.length===0){ showToast('কোনো group এ join করোনি'); return; }
  const gid=joinedGroups[0];
  if(!groupPosts[gid]) groupPosts[gid]=[];
  const sharedPost={...post, id:Date.now(), userId:0, text:`📤 Shared: ${post.text}`, time:'এইমাত্র', shares:0, reactions:{}};
  groupPosts[gid].unshift(sharedPost);
  post.shares=(post.shares||0)+1;
  closeInfoModal(); renderPosts(); showToast('Group feed এ share হয়েছে! 👥');
}
function sharePost(postId){ openShareModal(postId); }

// ===== POST EDIT =====
function startEditPost(postId){
  editingPostId=postId; closeInfoModal(); renderPosts();
  if(profileSubTab==='posts') renderProfileSubContent();
  setTimeout(()=>{ const el=document.getElementById('editPostInput-'+postId); if(el) el.focus(); },100);
}
function savePostEdit(postId){
  const el=document.getElementById('editPostInput-'+postId); if(!el) return;
  const newText=el.value.trim(); if(!newText){ showToast('পোস্ট খালি রাখা যাবে না'); return; }
  const post=findPost(postId); if(!post) return;
  post.text=newText; post.edited=true;
  editingPostId=null; renderPosts();
  if(profileSubTab==='posts') renderProfileSubContent();
  showToast('পোস্ট আপডেট হয়েছে ✅');
}
function cancelPostEdit(){ editingPostId=null; renderPosts(); if(profileSubTab==='posts') renderProfileSubContent(); }

function toggleLike(postId){ quickLike(postId); }
function toggleSave(postId){
  if(savedPosts.includes(postId)){ savedPosts=savedPosts.filter(id=>id!==postId); showToast('সেভ থেকে সরানো হয়েছে'); }
  else { savedPosts.push(postId); showToast('পোস্ট সেভ হয়েছে 📌'); }
  renderPosts();
  if(activeTab==='profile'&&profileSubTab==='saved') renderProfileSubContent();
}
function setSavedFilter(f){
  window._savedFilter=f;
  renderProfileSubContent();
}

function moreOptions(postId, isGroupCtx){
  const post=findPost(postId); if(!post) return;
  const isMine=post.userId===0;
  openInfoModal('বিকল্প',`
    <div style="display:flex;flex-direction:column;gap:2px;">
      ${isMine?`<div class="settings-row" style="border-radius:10px;" onclick="startEditPost(${postId})"><div class="settings-row-icon" style="background:#6C63FF22;">✏️</div><div class="settings-row-text">পোস্ট এডিট করো</div></div>`:''}
      ${isMine?`<div class="settings-row" style="border-radius:10px;" onclick="deletePost(${postId},${!!isGroupCtx});closeInfoModal();"><div class="settings-row-icon" style="background:#F7258522;">🗑️</div><div class="settings-row-text" style="color:#F72585;">পোস্ট মুছে ফেলো</div></div>`:''}
      <div class="settings-row" style="border-radius:10px;" onclick="openShareModal(${postId});closeInfoModal();"><div class="settings-row-icon" style="background:#6C63FF22;">🔗</div><div class="settings-row-text">Share করো</div></div>
      <div class="settings-row" style="border-radius:10px;" onclick="toggleSave(${postId});closeInfoModal();"><div class="settings-row-icon" style="background:#4CC9F022;">🔖</div><div class="settings-row-text">সেভ করো</div></div>
      ${!isMine?`<div class="settings-row danger" style="border-radius:10px;" onclick="closeInfoModal();openReportModal('post',${postId},'পোস্ট');"><div class="settings-row-icon" style="background:#F7258522;">🚩</div><div class="settings-row-text">Report করো</div></div>`:''}
    </div>
  `);
}
function deletePost(postId, isGroupCtx){
  if(isGroupCtx&&selectedGroupChat){
    if(groupPosts[selectedGroupChat]) groupPosts[selectedGroupChat]=groupPosts[selectedGroupChat].filter(p=>p.id!==postId);
    renderGroupFeed();
  } else {
    posts=posts.filter(p=>p.id!==postId);
    renderPosts();
  }
  showToast('পোস্ট মুছে ফেলা হয়েছে 🗑️');
}
// ===== COMMENT MODAL (Facebook-style full-screen sheet) =====
function openCommentModal(postId, isGroupCtx){
  activeCommentModal = {postId, isGroupCtx:!!isGroupCtx};
  // Increment view count
  const post=findPost(postId);
  if(post){ post.views=(post.views||0)+1; }
  const backdrop=document.getElementById('commentModalBackdrop');
  backdrop.classList.remove('hidden');
  document.body.style.overflow='hidden';
  renderCommentModal();
  requestAnimationFrame(()=>{
    const sheet=document.getElementById('commentModalSheet');
    requestAnimationFrame(()=>sheet.classList.add('open'));
  });
}
function closeCommentModal(){
  const sheet=document.getElementById('commentModalSheet');
  const backdrop=document.getElementById('commentModalBackdrop');
  if(sheet) sheet.classList.remove('open');
  document.body.style.overflow='';
  setTimeout(()=>{ if(backdrop) backdrop.classList.add('hidden'); }, 280);
  activeCommentModal=null;
}
function renderCommentModal(){
  if(!activeCommentModal) return;
  const {postId, isGroupCtx}=activeCommentModal;
  const post=findPost(postId);
  if(!post){ closeCommentModal(); return; }
  const scrollEl=document.getElementById('commentModalScroll');
  const footerEl=document.getElementById('commentModalFooter');
  if(scrollEl) scrollEl.innerHTML=renderCommentModalContent(post, isGroupCtx);
  if(footerEl) footerEl.innerHTML=renderCommentInputRowHtml(post, isGroupCtx);
}
function renderCommentModalContent(post, isGroupCtx){
  const user=post.userId===0?ME:getUser(post.userId);
  if(!user) return '';
  const dc=getDeptColor(user.dept);
  const isMine=post.userId===0;
  const avatarHtml = (isMine && ME.profileImg)
    ? `<img src="${ME.profileImg}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`
    : `<div class="avatar" style="width:36px;height:36px;font-size:13px;background:linear-gradient(135deg,${dc},${dc}88);">${user.avatar}</div>`;
  const totalReacts=(post.reactions&&Object.values(post.reactions).reduce((a,b)=>a+b,0))||0;
  const commCount=Array.isArray(post.comments)?post.comments.length:post.comments||0;
  const postPreviewHtml=`
    <div class="comment-modal-post-preview">
      <div class="comment-modal-post-header">
        ${avatarHtml}
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text);">${user.name}</div>
          <div style="display:flex;gap:6px;align-items:center;">
            <span class="dept-badge" style="color:${dc};background:${dc}22;">${getDeptName(user.dept)}</span>
            <span class="post-time">${post.time}${post.edited?' • edited':''}</span>
          </div>
        </div>
      </div>
      <p class="comment-modal-post-text">${post.text}</p>
      ${post.img?`<img src="${post.img}" class="post-img" alt="post image" style="margin-top:8px;" />`:''}
      <div class="comment-modal-post-meta">
        <span>❤️ ${totalReacts>0?totalReacts:post.likes}</span>
        <span>💬 ${commCount}</span>
      </div>
    </div>`;
  const listHtml=renderCommentsListHtml(post, isGroupCtx);
  return postPreviewHtml + listHtml;
}
function renderCommentsListHtml(post, isGroupCtx){
  const comments=Array.isArray(post.comments)?post.comments:[];
  if(comments.length===0) return `<div class="comment-modal-empty">এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্য করো! 💬</div>`;
  return comments.map(c=>renderCommentNode(post, c, isGroupCtx, 0)).join('');
}
// Renders a single comment/reply node and recursively renders its nested replies.
// depth 0 = top-level comment, depth 1+ = nested replies (replies can themselves have replies).
function renderCommentNode(post, node, isGroupCtx, depth){
  if(!node.id) node.id = Date.now()+Math.floor(Math.random()*1000);
  if(!node.replies) node.replies=[];
  if(node.likes===undefined) node.likes=0;
  const cu=node.userId===0?ME:getUser(node.userId); if(!cu) return '';
  const cdc=getDeptColor(cu.dept);
  const avSize = depth===0?28:22;
  const avFont = depth===0?11:9;
  const cAvatar=(node.userId===0&&ME.profileImg)?`<img src="${ME.profileImg}" style="width:${avSize}px;height:${avSize}px;border-radius:50%;object-fit:cover;flex-shrink:0;">`:`<div class="avatar" style="width:${avSize}px;height:${avSize}px;font-size:${avFont}px;background:linear-gradient(135deg,${cdc},${cdc}88);flex-shrink:0;">${cu.avatar}</div>`;
  const mentionText=(node.text||'').replace(/@(\S+)/g,'<span class="mention">@$1</span>');
  const openRep = openReplies.has(node.id);
  const isMyComment = node.userId===0;
  const isEditingThis = editingCommentId && editingCommentId.commentId===node.id;
  const imgHtml = node.img?`<img src="${node.img}" class="comment-img" alt="comment image" onclick="openInfoModal('ছবি','<img src=\\'${node.img.replace(/'/g,"\\'")}\\' style=\\'width:100%;border-radius:10px;display:block;\\'>')">`:'';
  const commentBodyHtml = isEditingThis ? `
      <textarea class="comment-edit-input" id="cedit-${node.id}" rows="2">${node.text||''}</textarea>
      <div class="comment-edit-btns">
        <button class="comment-edit-save" onclick="saveEditComment(${post.id},${node.id},${!!isGroupCtx})">সেভ</button>
        <button class="comment-edit-cancel" onclick="cancelEditComment(${!!isGroupCtx})">বাতিল</button>
      </div>` : `
      ${node.text?`<div class="comment-text" style="${depth>0?'font-size:11px;':''}">${mentionText}${node.edited?'<span style="font-size:9px;color:var(--muted);margin-left:4px;">(edited)</span>':''}</div>`:''}
      ${imgHtml}`;
  const childLevel = depth+1;
  const indentPx = 18 + Math.min(childLevel-1,3)*14; // cap indentation growth so deep threads stay readable on mobile
  const totalReplies = node.replies.length;
  const revealedCount = revealedReplyCounts.has(node.id) ? revealedReplyCounts.get(node.id) : 0;
  const visibleReplies = node.replies.slice(0, revealedCount);
  const remainingCount = totalReplies - visibleReplies.length;
  let seeMoreHtml = '';
  if(remainingCount>0){
    const nextBatch = Math.min(REPLY_PREVIEW_COUNT, remainingCount);
    seeMoreHtml = `<button class="see-more-replies-btn" onclick="revealMoreReplies(${node.id})">▾ আরো ${nextBatch}টি রিপ্লাই দেখুন</button>`;
  } else if(totalReplies>0 && revealedCount>0){
    seeMoreHtml = `<button class="see-more-replies-btn" onclick="hideAllReplies(${node.id})">▴ রিপ্লাই লুকান</button>`;
  }
  const childrenHtml = totalReplies>0?`
      <div class="replies-wrap" style="margin-left:${indentPx}px;">
        ${visibleReplies.map(r=>renderCommentNode(post, r, isGroupCtx, childLevel)).join('')}
        ${seeMoreHtml}
      </div>`:'';
  const replyInputHtml = openRep?renderReplyInputRowHtml(post, node, cu, isGroupCtx, indentPx):'';
  return `<div class="comment-item">
      ${cAvatar}
      <div style="flex:1;min-width:0;">
        <div class="comment-text-wrap" style="${depth>0?'padding:6px 10px;':''}">
          <div class="comment-name" style="${depth>0?'font-size:10px;':''}">${cu.name}</div>
          ${commentBodyHtml}
          ${!isEditingThis?`<div style="display:flex;align-items:center;gap:10px;margin-top:4px;flex-wrap:wrap;">
            <span class="comment-time">${node.time}</span>
            <button class="comm-action-btn ${node.likedByMe?'comm-liked':''}" onclick="toggleCommentLike(${post.id},${node.id},${!!isGroupCtx})">
              ❤️ ${node.likes>0?node.likes:''}
            </button>
            <button class="comm-action-btn" onclick="toggleReplyBox(${post.id},${node.id},${!!isGroupCtx})">
              💬 Reply
            </button>
            ${isMyComment?`<button class="comm-action-btn" onclick="startEditComment(${post.id},${node.id},${!!isGroupCtx})">✏️ Edit</button>
            <button class="comm-action-btn" style="color:var(--red);" onclick="deleteComment(${post.id},${node.id},${!!isGroupCtx})">🗑️</button>`:''}
          </div>`:''}
        </div>
        ${childrenHtml}
        ${replyInputHtml}
      </div>
    </div>`;
}
function renderReplyInputRowHtml(post, node, cu, isGroupCtx, indentPx){
  const key='reply-'+post.id+'-'+node.id;
  const previewHtml = commentImgAttach[key]?renderImgAttachPreviewHtml(key):'';
  return `<div class="reply-input-row" id="rrow-${node.id}" style="margin-left:${indentPx}px;">
      ${ME.profileImg?`<img src="${ME.profileImg}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;flex-shrink:0;">`:`<div class="avatar" style="width:22px;height:22px;font-size:9px;background:linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88);flex-shrink:0;">${ME.avatar}</div>`}
      <div class="comment-input-wrap">
        <div id="cimgprev-${key}">${previewHtml}</div>
        <input class="reply-input" id="ri-${post.id}-${node.id}" placeholder="@${cu.name.split(' ')[0]} কে reply করো..." value="@${cu.name.split(' ')[0]} " onkeydown="if(event.key==='Enter')submitReply(${post.id},${node.id},${!!isGroupCtx})" oninput="handleMentionInput(this,'${post.id}-${node.id}')"/>
        <div class="mention-dropdown hidden" id="mdd-${post.id}-${node.id}"></div>
      </div>
      <button class="comment-img-btn reply-size" onclick="document.getElementById('cimginput-${key}').click()" title="ছবি যুক্ত করো">🖼️</button>
      <input type="file" accept="image/*" class="hidden" id="cimginput-${key}" onchange="handleCommentImgSelect(event,'${key}')" />
      <button class="reply-send" onclick="submitReply(${post.id},${node.id},${!!isGroupCtx})">
        <svg width="12" height="12" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>`;
}
// ===== COMMENT/REPLY IMAGE ATTACHMENT =====
function renderImgAttachPreviewHtml(key){
  const src=commentImgAttach[key];
  if(!src) return '';
  return `<div class="comment-img-preview-chip">
      <img src="${src}">
      <button class="remove-img" onclick="removeCommentImgAttach('${key}')">✕</button>
    </div>`;
}
function handleCommentImgSelect(e, key){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    commentImgAttach[key]=ev.target.result;
    const prev=document.getElementById('cimgprev-'+key);
    if(prev) prev.innerHTML=renderImgAttachPreviewHtml(key);
  };
  reader.readAsDataURL(file);
}
function removeCommentImgAttach(key){
  delete commentImgAttach[key];
  const prev=document.getElementById('cimgprev-'+key);
  if(prev) prev.innerHTML='';
  const fi=document.getElementById('cimginput-'+key);
  if(fi) fi.value='';
}
function renderCommentInputRowHtml(post, isGroupCtx){
  const key='top-'+post.id;
  const previewHtml = commentImgAttach[key]?renderImgAttachPreviewHtml(key):'';
  return `<div class="comment-input-row" style="margin-top:0;">
    ${ME.profileImg?`<img src="${ME.profileImg}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`:`<div class="avatar" style="width:28px;height:28px;font-size:11px;background:linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88);flex-shrink:0;">${ME.avatar}</div>`}
    <div class="comment-input-wrap">
      <div id="cimgprev-${key}">${previewHtml}</div>
      <input class="comment-input" id="ci${post.id}" placeholder="কমেন্ট করো... (@নাম mention করো)" onkeydown="if(event.key==='Enter')submitComment(${post.id},${!!isGroupCtx})" oninput="handleMentionInput(this,'${post.id}')"/>
      <div class="mention-dropdown hidden" id="mdd-${post.id}"></div>
    </div>
    <button class="comment-img-btn" onclick="document.getElementById('cimginput-${key}').click()" title="ছবি যুক্ত করো">🖼️</button>
    <input type="file" accept="image/*" class="hidden" id="cimginput-${key}" onchange="handleCommentImgSelect(event,'${key}')" />
    <button class="comment-send" onclick="submitComment(${post.id},${!!isGroupCtx})">
      <svg width="14" height="14" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </div>`;
}
function submitComment(postId, isGroupCtx){
  const input=document.getElementById('ci'+postId); if(!input) return;
  const key='top-'+postId;
  const txt=input.value.trim();
  const img=commentImgAttach[key];
  if(!txt && !img){ showToast('কিছু লেখো বা ছবি যুক্ত করো'); return; }
  const post=findPost(postId); if(!post) return;
  if(!Array.isArray(post.comments)) post.comments=[];
  post.comments.push({ id:Date.now(), userId:0, text:txt, img:img||null, time:"এইমাত্র", likes:0, likedByMe:false, replies:[] });
  input.value='';
  delete commentImgAttach[key];
  closeMentionDropdown('mdd-'+postId);
  if(txt) checkMentionsInText(txt, postId);
  notifyPostComment(postId, txt||'📷 একটি ছবি পাঠিয়েছে');
  if(isGroupCtx) renderGroupFeed(); else { renderPosts(); if(profileSubTab==='posts') renderProfileSubContent(); }
  renderCommentModal();
  setTimeout(()=>{const el=document.getElementById('ci'+postId);if(el)el.focus();},100);
  setTimeout(()=>{const sc=document.getElementById('commentModalScroll'); if(sc) sc.scrollTop=sc.scrollHeight;},120);
}

function toggleCommentLike(postId, commentId, isGroupCtx){
  const post=findPost(postId); if(!post) return;
  const comm=findCommentNode(post.comments, commentId);
  if(!comm) return;
  comm.likedByMe=!comm.likedByMe;
  comm.likes=(comm.likes||0)+(comm.likedByMe?1:-1);
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
}

function toggleReplyBox(postId, commentId, isGroupCtx){
  if(openReplies.has(commentId)) openReplies.delete(commentId);
  else openReplies.add(commentId);
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
  if(openReplies.has(commentId)){
    setTimeout(()=>{
      const el=document.getElementById('ri-'+postId+'-'+commentId);
      if(el){ el.focus(); el.setSelectionRange(el.value.length,el.value.length); }
    },100);
  }
}

function revealMoreReplies(nodeId){
  const current = revealedReplyCounts.get(nodeId) || 0;
  revealedReplyCounts.set(nodeId, current + REPLY_PREVIEW_COUNT);
  renderCommentModal();
}
function hideAllReplies(nodeId){
  revealedReplyCounts.delete(nodeId);
  renderCommentModal();
}

function submitReply(postId, commentId, isGroupCtx){
  const input=document.getElementById('ri-'+postId+'-'+commentId); if(!input) return;
  const key='reply-'+postId+'-'+commentId;
  const txt=input.value.trim();
  const img=commentImgAttach[key];
  if(!txt && !img) return;
  const post=findPost(postId); if(!post) return;
  const comm=findCommentNode(post.comments, commentId); if(!comm) return;
  if(!comm.replies) comm.replies=[];
  comm.replies.push({ id:Date.now(), userId:0, text:txt, img:img||null, time:"এইমাত্র", likes:0, likedByMe:false, replies:[] });
  revealedReplyCounts.set(commentId, comm.replies.length); // make sure the just-added reply is visible right away, not hidden behind "see more"
  input.value='';
  delete commentImgAttach[key];
  closeMentionDropdown('mdd-'+postId+'-'+commentId);
  if(txt) checkMentionsInText(txt, postId);
  if(isGroupCtx) renderGroupFeed(); else renderPosts();
  renderCommentModal();
}

// ===== MENTION SYSTEM =====
function handleMentionInput(input, key){
  const val=input.value;
  const cursorPos=input.selectionStart;
  // Find the last @ before cursor
  const textBefore=val.substring(0,cursorPos);
  const atIdx=textBefore.lastIndexOf('@');
  const ddId='mdd-'+key;
  const dd=document.getElementById(ddId);
  if(!dd) return;
  if(atIdx===-1||(atIdx>0&&val[atIdx-1]!==' '&&atIdx!==0)){
    closeMentionDropdown(ddId); return;
  }
  const query=textBefore.substring(atIdx+1).toLowerCase();
  const allUsers=[...MOCK_USERS, ME];
  const matches=allUsers.filter(u=>u.name.toLowerCase().includes(query)&&u.id!==0||query.length>0);
  const filtered=allUsers.filter(u=>u.name.toLowerCase().replace(/\s/g,'').includes(query)||getDeptName(u.dept).toLowerCase().includes(query));
  if(filtered.length===0||query.length===0&&atIdx<cursorPos-1){
    // show all on fresh @
  }
  const showUsers=query.length>=0?allUsers.filter(u=>u.name.toLowerCase().includes(query)):[];
  if(showUsers.length===0){ closeMentionDropdown(ddId); return; }
  dd.innerHTML=showUsers.slice(0,6).map(u=>{
    const dc=getDeptColor(u.dept);
    return `<div class="mention-item" onclick="insertMention(this,'${u.name}','${key}')">
      <div class="avatar" style="width:28px;height:28px;font-size:11px;background:linear-gradient(135deg,${dc},${dc}88);flex-shrink:0;">${u.avatar}</div>
      <div><div class="mention-item-name">${u.name}</div><div class="mention-item-dept">${getDeptName(u.dept)}</div></div>
    </div>`;
  }).join('');
  dd.classList.remove('hidden');
}

function insertMention(el, name, key){
  const inputId = key.includes('-') ? (key.split('-').length>1 ? 'ri-'+key : 'ci'+key) : 'ci'+key;
  // try both comment input and reply input
  let input = document.getElementById('ci'+key) || document.getElementById('ri-'+key) || document.getElementById('ci'+key.split('-')[0]);
  // smartly find the right input using the dropdown's parent
  const dd=el.closest('.mention-dropdown');
  if(dd){
    const wrap=dd.parentElement;
    input=wrap.querySelector('input');
  }
  if(!input) return;
  const val=input.value;
  const cursorPos=input.selectionStart;
  const textBefore=val.substring(0,cursorPos);
  const atIdx=textBefore.lastIndexOf('@');
  if(atIdx===-1) return;
  const newVal=val.substring(0,atIdx)+'@'+name+' '+val.substring(cursorPos);
  input.value=newVal;
  input.focus();
  const newCursor=atIdx+name.length+2;
  input.setSelectionRange(newCursor,newCursor);
  closeMentionDropdown(dd.id);
}

function closeMentionDropdown(id){
  const dd=document.getElementById(id);
  if(dd) dd.classList.add('hidden');
}

function submitPost(){
  const txt=document.getElementById('newPostText').value.trim();
  if(!txt&&!attachedFile&&!attachedImg){ showToast('কিছু একটা লেখো!'); return; }
  const newPost={ id:Date.now(), userId:0, text:txt, time:"এইমাত্র", likes:0, comments:[], dept:ME.dept, file:attachedFile, img:attachedImg, audience:postAudience, reactions:{}, views:1 };
  posts.unshift(newPost);
  // Supabase configured থাকলে real backend-এও পোস্টটা সেভ করে (real post link কাজ করার জন্য)
  if(typeof SUPABASE_CONFIGURED !== 'undefined' && SUPABASE_CONFIGURED && typeof createPostSupabase === 'function'){
    createPostSupabase(txt, ME.dept, postAudience, attachedImg).then(saved => {
      if(saved) newPost.id = saved.id; // local id-কে real DB id দিয়ে replace করে, link সবসময় কাজ করবে
    });
  }
  const audLabel=audienceLabel(postAudience);
  document.getElementById('newPostText').value='';
  attachedFile=null; attachedImg=null;
  document.getElementById('fileInput').value='';
  document.getElementById('imgInput').value='';
  document.getElementById('attachedFileChip').innerHTML='';
  document.getElementById('postImgPreviewWrap').innerHTML='';
  document.getElementById('emojiPickerRow').classList.add('hidden');
  setPostAudience(settings.defaultAudience||'public');
  renderPosts(); showToast('পোস্ট হয়েছে! ✅ ('+audLabel+')');
}

function handleFileSelect(e){
  const file=e.target.files[0]; if(!file) return;
  attachedFile={ name:file.name, size:file.size, url:URL.createObjectURL(file) };
  document.getElementById('attachedFileChip').innerHTML=`<div class="file-chip">
    <span>${fileIconFor(file.name)}</span>
    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${file.name}</span>
    <span style="color:var(--muted);">${formatFileSize(file.size)}</span>
    <span class="remove-file" onclick="attachedFile=null;document.getElementById('fileInput').value='';document.getElementById('attachedFileChip').innerHTML='';">✕</span>
  </div>`;
}

function handleImgSelect(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    attachedImg=ev.target.result;
    document.getElementById('postImgPreviewWrap').innerHTML=`
      <div style="position:relative;margin-top:8px;">
        <img src="${attachedImg}" class="post-img-preview" />
        <button onclick="attachedImg=null;document.getElementById('imgInput').value='';document.getElementById('postImgPreviewWrap').innerHTML='';" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.6);border:none;border-radius:50%;width:24px;height:24px;color:#fff;cursor:pointer;font-size:14px;">✕</button>
      </div>`;
  };
  reader.readAsDataURL(file);
}

function fileIconFor(name){
  const ext=(name.split('.').pop()||'').toLowerCase();
  if(ext==='pdf') return '📕';
  if(['doc','docx'].includes(ext)) return '📄';
  if(['ppt','pptx'].includes(ext)) return '📊';
  if(['xls','xlsx','csv'].includes(ext)) return '📈';
  if(['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
  if(['zip','rar'].includes(ext)) return '🗂️';
  return '📎';
}
function formatFileSize(bytes){
  if(bytes<1024) return bytes+'B';
  if(bytes<1024*1024) return (bytes/1024).toFixed(1)+'KB';
  return (bytes/(1024*1024)).toFixed(1)+'MB';
}

