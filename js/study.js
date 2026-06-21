// ============================================================
// ===================== STUDY HUB ===========================
// ============================================================

const STUDY_SECTIONS = [
  // group: college-zone (নতুন)
  { id:"noticeboard", group:"কলেজ জোন", icon:"📌", name:"Noticeboard", desc:"কলেজের অফিসিয়াল নোটিস", active:true, color:"#E63946" },
  { id:"lostfound", group:"কলেজ জোন", icon:"🔎", name:"Lost & Found", desc:"কিছু হারিয়ে গেলে বা পেলে পোস্ট করো", active:true, color:"#F4A261" },
  { id:"events", group:"কলেজ জোন", icon:"🎉", name:"Event Page", desc:"কলেজ ইভেন্ট, সেমিনার ও কালচারাল প্রোগ্রাম", active:true, color:"#9B5DE5" },
  { id:"clubs", group:"কলেজ জোন", icon:"🏛️", name:"Club Section", desc:"Physics Club, ICT Club ও অন্যান্য ক্লাব", active:true, color:"#06D6A0" },
  // group: emergency
  { id:"bloodgroup", group:"ইমার্জেন্সি ও সেফটি", icon:"🩸", name:"Blood Group Directory", desc:"ইমার্জেন্সিতে দ্রুত রক্তের গ্রুপ খুঁজে বের করো", active:true, color:"#E5383B" },
  // group: content
  { id:"notes", group:"কন্টেন্ট ও রিসোর্স", icon:"📝", name:"Notes Sharing", desc:"ডিপার্টমেন্ট অনুযায়ী নোট আপলোড/ডাউনলোড", active:true, color:"#6C63FF" },
  { id:"qbank", group:"কন্টেন্ট ও রিসোর্স", icon:"📄", name:"Question Bank", desc:"আগের বছরের প্রশ্ন ও মডেল টেস্ট", active:false, color:"#4CC9F0" },
  { id:"syllabus", group:"কন্টেন্ট ও রিসোর্স", icon:"📑", name:"Syllabus Viewer", desc:"সেমিস্টার অনুযায়ী সিলেবাস", active:false, color:"#06D6A0" },
  { id:"routine", group:"কন্টেন্ট ও রিসোর্স", icon:"🗓️", name:"Class Routine", desc:"দৈনিক ক্লাস শিডিউল", active:true, color:"#F4A261" },
  { id:"examroutine", group:"কন্টেন্ট ও রিসোর্স", icon:"🗂️", name:"Exam Routine", desc:"পরীক্ষার তারিখ, সময়, রুম", active:true, color:"#F72585" },
  { id:"result", group:"কন্টেন্ট ও রিসোর্স", icon:"🎯", name:"Result Tracker", desc:"GPA/CGPA ও রেজাল্ট হিস্ট্রি", active:false, color:"#9B5DE5" },
  // group: productivity
  { id:"todo", group:"প্রোডাক্টিভিটি টুলস", icon:"✅", name:"To-Do List", desc:"অ্যাসাইনমেন্ট ডেডলাইন ট্র্যাকিং", active:false, color:"#2A9D8F" },
  { id:"pomodoro", group:"প্রোডাক্টিভিটি টুলস", icon:"⏱️", name:"Study Timer", desc:"পমোডোরো ফোকাস সেশন", active:false, color:"#E76F51" },
  { id:"flashcard", group:"প্রোডাক্টিভিটি টুলস", icon:"🗳️", name:"Flashcards", desc:"সাবজেক্ট ভিত্তিক ফ্ল্যাশকার্ড", active:false, color:"#E9C46A" },
  { id:"quiz", group:"প্রোডাক্টিভিটি টুলস", icon:"🧠", name:"Quiz / MCQ Practice", desc:"সাবজেক্ট ভিত্তিক কুইজ প্র্যাকটিস", active:true, color:"#F4A261" },
  { id:"gpacalc", group:"প্রোডাক্টিভিটি টুলস", icon:"🧮", name:"GPA/CGPA Calculator", desc:"রেজাল্ট থেকে GPA বের করো", active:false, color:"#457B9D" },
  { id:"planner", group:"প্রোডাক্টিভিটি টুলস", icon:"📆", name:"Study Planner", desc:"পড়াশোনার ক্যালেন্ডার ও প্ল্যান", active:false, color:"#52B788" },
  // group: social-study
  { id:"studygroup", group:"সোশ্যাল-স্টাডি", icon:"👥", name:"Study Groups", desc:"সাবজেক্ট ভিত্তিক স্টাডি গ্রুপ", active:false, color:"#6C63FF" },
  { id:"qaforum", group:"সোশ্যাল-স্টাডি", icon:"💬", name:"Q&A Forum", desc:"প্রশ্ন করো, উত্তর পাও", active:false, color:"#4CC9F0" },
  { id:"doubt", group:"সোশ্যাল-স্টাডি", icon:"🆘", name:"Doubt Solving", desc:"হেল্প রিকোয়েস্ট পাঠাও", active:false, color:"#F72585" },
  { id:"leaderboard", group:"সোশ্যাল-স্টাডি", icon:"🏆", name:"Leaderboard", desc:"কুইজ পয়েন্ট ভিত্তিক র‍্যাংকিং", active:false, color:"#E9C46A" },
  { id:"tutor", group:"সোশ্যাল-স্টাডি", icon:"🎓", name:"Tutor/Senior Connect", desc:"সিনিয়রদের সাথে যোগাযোগ", active:false, color:"#9B5DE5" },
  // group: library
  { id:"ebook", group:"রিসোর্স লাইব্রেরি", icon:"📚", name:"E-book / PDF Library", desc:"বই ও PDF কালেকশন", active:false, color:"#06D6A0" },
  { id:"videolecture", group:"রিসোর্স লাইব্রেরি", icon:"🎬", name:"Video Lectures", desc:"ইউটিউব লেকচার লিংক", active:true, color:"#F72585" },
  { id:"linkbank", group:"রিসোর্স লাইব্রেরি", icon:"🔗", name:"Important Links", desc:"দরকারি ওয়েবসাইট কালেকশন", active:false, color:"#457B9D" },
  { id:"career", group:"রিসোর্স লাইব্রেরি", icon:"💼", name:"Career & Scholarship", desc:"ক্যারিয়ার ও স্কলারশিপ তথ্য", active:false, color:"#2A9D8F" },
  // group: reminders
  { id:"assignreminder", group:"রিমাইন্ডার", icon:"⏰", name:"Assignment Reminder", desc:"ডেডলাইন মিস করবে না", active:false, color:"#E76F51" },
  { id:"examreminder", group:"রিমাইন্ডার", icon:"🔔", name:"Exam Reminder", desc:"পরীক্ষার আগে নোটিফিকেশন", active:false, color:"#F4A261" },
];

function renderStudyHub(){
  const c=document.getElementById('studyHubContainer');
  const q=(document.getElementById('studySearchInput')?.value||'').trim().toLowerCase();
  const filtered=STUDY_SECTIONS.filter(s=>!q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  const groups=[...new Set(filtered.map(s=>s.group))];
  if(filtered.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🔍</div>কোনো সেকশন পাওয়া যায়নি</div>`;
    return;
  }
  c.innerHTML=groups.map(g=>{
    const items=filtered.filter(s=>s.group===g);
    return `<div class="study-group-label">${g}</div>
      <div class="study-grid">
        ${items.map(s=>`
          <div class="study-card ${s.active?'':'locked'}" onclick="${s.active?`openStudySection('${s.id}')`:`showToast('🚧 \\'${s.name}\\' শীঘ্রই আসছে')`}">
            ${!s.active?`<div class="study-card-soon">Soon</div>`:''}
            <div class="study-card-icon" style="background:${s.color}22;color:${s.color};">${s.icon}</div>
            <div class="study-card-name">${s.name}</div>
            <div class="study-card-desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>`;
  }).join('');
}

function openStudySection(id){
  if(id==='noticeboard') openNoticeboard();
  else if(id==='lostfound') openLostFound();
  else if(id==='events') openEventsPage();
  else if(id==='clubs') openClubsPage();
  else if(id==='bloodgroup') openStudyBlood();
  else if(id==='notes') openStudyNotes();
  else if(id==='routine') openStudyRoutine();
  else if(id==='examroutine') openStudyExam();
  else if(id==='quiz') openStudyQuiz();
  else if(id==='videolecture') openStudyVideo();
}
function closeStudyPage(pageId){ document.getElementById(pageId).classList.add('hidden'); }

// helper: resolve a poster/user id (0 = ME) to a display object
function studyResolveUser(id){
  if(id===0) return { name:ME.name, avatar:ME.avatar, profileImg:ME.profileImg||null, role:ME.role||'student' };
  const u=getUser(id);
  if(u) return { name:u.name, avatar:u.avatar, profileImg:null, role:u.role||'student' };
  return { name:'অজানা', avatar:'?', profileImg:null, role:'student' };
}
function studyAvatarHtml(u, size){
  return u.profileImg
    ? `<img src="${u.profileImg}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
    : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#4CC9F0);display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.4)}px;font-weight:700;color:#fff;flex-shrink:0;">${u.avatar}</div>`;
}
// CR or Teacher acts as the "admin" role for Noticeboard/Events posting
function isStudyAdmin(){ return isCR() || isTeacher(); }

// ---------- NOTICEBOARD ----------
const NOTICE_CATEGORIES = [
  { id:"academic", name:"একাডেমিক", color:"#6C63FF" },
  { id:"general", name:"সাধারণ", color:"#F4A261" },
  { id:"urgent", name:"জরুরি", color:"#E5383B" },
];
function openNoticeboard(){
  noticeFilterVal='all';
  renderNoticeFilter();
  renderNoticeList();
  const fab=document.getElementById('noticeFab');
  if(fab) fab.classList.toggle('hidden', !isStudyAdmin());
  document.getElementById('studyNoticePage').classList.remove('hidden');
}
function renderNoticeFilter(){
  const c=document.getElementById('noticeFilterRow');
  let html=`<div class="study-chip ${noticeFilterVal==='all'?'active':''}" style="${noticeFilterVal==='all'?'background:linear-gradient(135deg,#6C63FF,#4CC9F0);':''}" onclick="setNoticeFilter('all')">সব</div>`;
  NOTICE_CATEGORIES.forEach(cat=>{
    const active=noticeFilterVal===cat.id;
    html+=`<div class="study-chip ${active?'active':''}" style="${active?`background:${cat.color};`:`color:${cat.color};border-color:${cat.color}55;`}" onclick="setNoticeFilter('${cat.id}')">${cat.name}</div>`;
  });
  c.innerHTML=html;
}
function setNoticeFilter(f){ noticeFilterVal=f; renderNoticeFilter(); renderNoticeList(); }
function renderNoticeList(){
  const c=document.getElementById('noticeListContainer');
  let list=[...notices];
  if(noticeFilterVal!=='all') list=list.filter(n=>n.category===noticeFilterVal);
  list.sort((a,b)=> (b.pinned-a.pinned) || (b.id-a.id));
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">📌</div>কোনো নোটিস পাওয়া যায়নি।</div>`;
    return;
  }
  c.innerHTML=list.map(n=>{
    const cat=NOTICE_CATEGORIES.find(x=>x.id===n.category)||NOTICE_CATEGORIES[1];
    const poster=studyResolveUser(n.posterId);
    const canDelete=isStudyAdmin();
    return `<div class="notice-card" onclick="openNoticeDetail(${n.id})">
      ${n.pinned?`<div class="notice-pin-tag">📌 পিন করা</div>`:''}
      <div class="notice-card-top">
        <span class="notice-cat-badge" style="background:${cat.color}22;color:${cat.color};">${cat.name}</span>
        ${canDelete?`<button class="comm-action-btn" onclick="event.stopPropagation();deleteNotice(${n.id})" title="ডিলিট">🗑️</button>`:''}
      </div>
      <div class="notice-title">${escapeHtml(n.title)}</div>
      <div class="notice-body-preview">${escapeHtml(n.body)}</div>
      <div class="notice-meta-row">
        ${studyAvatarHtml(poster,20)}
        <span class="notice-poster-name">${escapeHtml(poster.name)}${poster.role!=='student'?' • '+roleLabel(poster.role):''}</span>
        <span class="notice-time">${n.time}</span>
      </div>
    </div>`;
  }).join('');
}
function openNoticeDetail(id){
  const n=notices.find(x=>x.id===id); if(!n) return;
  const cat=NOTICE_CATEGORIES.find(x=>x.id===n.category)||NOTICE_CATEGORIES[1];
  const poster=studyResolveUser(n.posterId);
  openInfoModal('📌 '+n.title, `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      ${studyAvatarHtml(poster,28)}
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text);">${escapeHtml(poster.name)}${poster.role!=='student'?' • '+roleLabel(poster.role):''}</div>
        <div style="font-size:10px;color:var(--muted2);">${n.time}</div>
      </div>
      <span class="notice-cat-badge" style="margin-left:auto;background:${cat.color}22;color:${cat.color};">${cat.name}</span>
    </div>
    <div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap;">${escapeHtml(n.body)}</div>
  `);
}
function deleteNotice(id){
  if(!isStudyAdmin()){ showToast('তোমার এই অনুমতি নেই'); return; }
  notices=notices.filter(n=>n.id!==id);
  saveAppData(); renderNoticeList(); showToast('নোটিস ডিলিট হয়েছে');
}
function openAddNoticeModal(){
  if(!isStudyAdmin()){ showToast('শুধু CR বা শিক্ষক নোটিস পোস্ট করতে পারবে'); return; }
  document.getElementById('noticeTitleInput').value='';
  document.getElementById('noticeBodyInput').value='';
  document.getElementById('noticeCategorySelect').innerHTML=NOTICE_CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('noticePinCheck').checked=false;
  document.getElementById('addNoticeModal').classList.remove('hidden');
}
function closeAddNoticeModal(){ document.getElementById('addNoticeModal').classList.add('hidden'); }
function submitNotice(){
  const title=document.getElementById('noticeTitleInput').value.trim();
  const body=document.getElementById('noticeBodyInput').value.trim();
  const category=document.getElementById('noticeCategorySelect').value;
  const pinned=document.getElementById('noticePinCheck').checked;
  if(!title||!body){ showToast('শিরোনাম ও বিস্তারিত লেখো'); return; }
  notices.unshift({ id:nextNoticeId++, title, body, category, posterId:0, time:'এইমাত্র', pinned });
  saveAppData(); closeAddNoticeModal(); renderNoticeList();
  showToast('নোটিস পোস্ট হয়েছে ✅');
}

// ---------- LOST & FOUND ----------
function openLostFound(){
  lostFoundFilterVal='all';
  renderLostFoundFilter();
  renderLostFoundList();
  document.getElementById('studyLostFoundPage').classList.remove('hidden');
}
function renderLostFoundFilter(){
  const c=document.getElementById('lostFoundFilterRow');
  const tabs=[{id:'all',name:'সব'},{id:'lost',name:'😢 হারিয়েছে'},{id:'found',name:'🙌 পাওয়া গেছে'}];
  c.innerHTML=tabs.map(t=>`<div class="study-chip ${lostFoundFilterVal===t.id?'active':''}" style="${lostFoundFilterVal===t.id?'background:linear-gradient(135deg,#6C63FF,#4CC9F0);':''}" onclick="setLostFoundFilter('${t.id}')">${t.name}</div>`).join('');
}
function setLostFoundFilter(f){ lostFoundFilterVal=f; renderLostFoundFilter(); renderLostFoundList(); }
function renderLostFoundList(){
  const c=document.getElementById('lostFoundListContainer');
  let list=[...lostFoundPosts];
  if(lostFoundFilterVal!=='all') list=list.filter(p=>p.type===lostFoundFilterVal);
  list.sort((a,b)=>b.id-a.id);
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🔎</div>কোনো পোস্ট নেই।<br>নিচের + বাটনে চেপে পোস্ট করো।</div>`;
    return;
  }
  c.innerHTML=list.map(p=>{
    const user=studyResolveUser(p.userId);
    const isLost=p.type==='lost';
    const mine=p.userId===0;
    return `<div class="lf-card ${p.resolved?'resolved':''}">
      <div class="lf-card-top">
        <span class="lf-type-badge ${isLost?'lost':'found'}">${isLost?'😢 হারিয়েছে':'🙌 পাওয়া গেছে'}</span>
        ${p.resolved?`<span class="lf-resolved-badge">✅ সমাধান হয়েছে</span>`:''}
        ${mine?`<button class="comm-action-btn" style="margin-left:auto;" onclick="deleteLostFound(${p.id})" title="ডিলিট">🗑️</button>`:''}
      </div>
      <div class="lf-title">${escapeHtml(p.title)}</div>
      <div class="lf-desc">${escapeHtml(p.desc)}</div>
      <div class="lf-loc">📍 ${escapeHtml(p.location)}</div>
      <div class="notice-meta-row">
        ${studyAvatarHtml(user,20)}
        <span class="notice-poster-name">${escapeHtml(user.name)}</span>
        <span class="notice-time">${p.time}</span>
        ${mine&&!p.resolved?`<button class="lf-resolve-btn" onclick="toggleLostFoundResolved(${p.id})">সমাধান হয়েছে চিহ্নিত করো</button>`:''}
      </div>
    </div>`;
  }).join('');
}
function toggleLostFoundResolved(id){
  const p=lostFoundPosts.find(x=>x.id===id); if(!p) return;
  p.resolved=!p.resolved;
  saveAppData(); renderLostFoundList();
  showToast(p.resolved?'সমাধান হয়েছে চিহ্নিত করা হলো ✅':'আবার খোলা হলো');
}
function deleteLostFound(id){
  lostFoundPosts=lostFoundPosts.filter(p=>p.id!==id);
  saveAppData(); renderLostFoundList(); showToast('পোস্ট ডিলিট হয়েছে');
}
function openAddLostFoundModal(){
  document.getElementById('lfTitleInput').value='';
  document.getElementById('lfDescInput').value='';
  document.getElementById('lfLocationInput').value='';
  document.getElementById('lfTypeSelect').value='lost';
  document.getElementById('addLostFoundModal').classList.remove('hidden');
}
function closeAddLostFoundModal(){ document.getElementById('addLostFoundModal').classList.add('hidden'); }
function submitLostFound(){
  const title=document.getElementById('lfTitleInput').value.trim();
  const desc=document.getElementById('lfDescInput').value.trim();
  const location=document.getElementById('lfLocationInput').value.trim();
  const type=document.getElementById('lfTypeSelect').value;
  if(!title||!desc){ showToast('শিরোনাম ও বিবরণ লেখো'); return; }
  lostFoundPosts.unshift({ id:nextLostFoundId++, type, title, desc, location:location||'উল্লেখ নেই', userId:0, time:'এইমাত্র', resolved:false });
  saveAppData(); closeAddLostFoundModal(); renderLostFoundList();
  showToast('পোস্ট হয়েছে ✅');
}

// ---------- EVENT PAGE ----------
const EVENT_CATEGORIES = [
  { id:"seminar", name:"সেমিনার", icon:"🎓", color:"#6C63FF" },
  { id:"cultural", name:"কালচারাল", icon:"🎭", color:"#F72585" },
  { id:"sports", name:"স্পোর্টস", icon:"⚽", color:"#2A9D8F" },
  { id:"other", name:"অন্যান্য", icon:"📅", color:"#F4A261" },
];
function openEventsPage(){
  eventFilterVal='all';
  renderEventFilter();
  renderEventList();
  const fab=document.getElementById('eventFab');
  if(fab) fab.classList.toggle('hidden', !isStudyAdmin());
  document.getElementById('studyEventsPage').classList.remove('hidden');
}
function renderEventFilter(){
  const c=document.getElementById('eventFilterRow');
  let html=`<div class="study-chip ${eventFilterVal==='all'?'active':''}" style="${eventFilterVal==='all'?'background:linear-gradient(135deg,#6C63FF,#4CC9F0);':''}" onclick="setEventFilter('all')">সব</div>`;
  EVENT_CATEGORIES.forEach(cat=>{
    const active=eventFilterVal===cat.id;
    html+=`<div class="study-chip ${active?'active':''}" style="${active?`background:${cat.color};`:`color:${cat.color};border-color:${cat.color}55;`}" onclick="setEventFilter('${cat.id}')">${cat.icon} ${cat.name}</div>`;
  });
  c.innerHTML=html;
}
function setEventFilter(f){ eventFilterVal=f; renderEventFilter(); renderEventList(); }
function renderEventList(){
  const c=document.getElementById('eventListContainer');
  let list=[...collegeEvents];
  if(eventFilterVal!=='all') list=list.filter(e=>e.category===eventFilterVal);
  list.sort((a,b)=>new Date(a.date+'T'+(a.time||'00:00')) - new Date(b.date+'T'+(b.time||'00:00')));
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🎉</div>কোনো ইভেন্ট পাওয়া যায়নি।</div>`;
    return;
  }
  c.innerHTML=list.map(e=>{
    const cat=EVENT_CATEGORIES.find(x=>x.id===e.category)||EVENT_CATEGORIES[3];
    const d=new Date(e.date+'T00:00:00');
    const day=isNaN(d)?'--':d.getDate();
    const mon=isNaN(d)?'':EXAM_MONTHS[d.getMonth()];
    const canDelete=isStudyAdmin();
    return `<div class="event-card" onclick="openEventDetail(${e.id})">
      <div class="exam-date-box" style="border:1px solid ${cat.color}55;">
        <div class="exam-date-day" style="color:${cat.color};">${day}</div>
        <div class="exam-date-mon">${mon}</div>
      </div>
      <div style="flex:1;min-width:0;">
        <span class="notice-cat-badge" style="background:${cat.color}22;color:${cat.color};">${cat.icon} ${cat.name}</span>
        <div class="exam-subject" style="margin-top:4px;">${escapeHtml(e.title)}</div>
        <div class="exam-info">⏰ ${formatTime(e.time)}${e.venue?' • 📍 '+escapeHtml(e.venue):''}</div>
      </div>
      ${canDelete?`<button class="comm-action-btn" onclick="event.stopPropagation();deleteEvent(${e.id})" title="ডিলিট">🗑️</button>`:''}
    </div>`;
  }).join('');
}
function openEventDetail(id){
  const e=collegeEvents.find(x=>x.id===id); if(!e) return;
  const cat=EVENT_CATEGORIES.find(x=>x.id===e.category)||EVENT_CATEGORIES[3];
  const d=new Date(e.date+'T00:00:00');
  const dateStr=isNaN(d)?e.date:`${d.getDate()} ${EXAM_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  openInfoModal(cat.icon+' '+e.title, `
    <span class="notice-cat-badge" style="background:${cat.color}22;color:${cat.color};">${cat.name}</span>
    <div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap;margin-top:10px;">${escapeHtml(e.desc)}</div>
    <div style="margin-top:12px;font-size:12px;color:var(--muted2);line-height:1.8;">
      📅 ${dateStr}<br>
      ⏰ ${formatTime(e.time)}<br>
      ${e.venue?'📍 '+escapeHtml(e.venue):''}
    </div>
  `);
}
function deleteEvent(id){
  if(!isStudyAdmin()){ showToast('তোমার এই অনুমতি নেই'); return; }
  collegeEvents=collegeEvents.filter(e=>e.id!==id);
  saveAppData(); renderEventList(); showToast('ইভেন্ট ডিলিট হয়েছে');
}
function openAddEventModal(){
  if(!isStudyAdmin()){ showToast('শুধু CR বা শিক্ষক ইভেন্ট যোগ করতে পারবে'); return; }
  document.getElementById('eventTitleInput').value='';
  document.getElementById('eventDescInput').value='';
  document.getElementById('eventCategorySelect').innerHTML=EVENT_CATEGORIES.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  document.getElementById('eventDateInput').value='';
  document.getElementById('eventTimeInput').value='';
  document.getElementById('eventVenueInput').value='';
  document.getElementById('addEventModal').classList.remove('hidden');
}
function closeAddEventModal(){ document.getElementById('addEventModal').classList.add('hidden'); }
function submitEvent(){
  const title=document.getElementById('eventTitleInput').value.trim();
  const desc=document.getElementById('eventDescInput').value.trim();
  const category=document.getElementById('eventCategorySelect').value;
  const date=document.getElementById('eventDateInput').value;
  const time=document.getElementById('eventTimeInput').value;
  const venue=document.getElementById('eventVenueInput').value.trim();
  if(!title||!date){ showToast('শিরোনাম ও তারিখ দাও'); return; }
  collegeEvents.push({ id:nextEventId++, title, desc, category, date, time, venue, posterId:0 });
  saveAppData(); closeAddEventModal(); renderEventList();
  showToast('ইভেন্ট যোগ হয়েছে ✅');
}

// ---------- CLUB SECTION ----------
function openClubsPage(){
  renderClubsList();
  document.getElementById('studyClubsPage').classList.remove('hidden');
}
function clubMemberCount(id){ return (clubMembers[id]||[]).length + (myClubs.includes(id)?1:0); }
function renderClubsList(){
  const c=document.getElementById('clubsListContainer');
  c.innerHTML=STUDY_CLUBS.map(club=>{
    const joined=myClubs.includes(club.id);
    if(!club.active){
      return `<div class="club-card locked">
        <div class="club-card-soon">Coming Soon</div>
        <div class="club-icon" style="background:${club.color}22;color:${club.color};">${club.icon}</div>
        <div class="club-name">${club.name}</div>
        <div class="club-desc">${club.desc}</div>
      </div>`;
    }
    return `<div class="club-card" onclick="openClubDetail('${club.id}')">
      <div class="club-icon" style="background:${club.color}22;color:${club.color};">${club.icon}</div>
      <div class="club-name">${club.name}</div>
      <div class="club-desc">${club.desc}</div>
      <div class="club-member-row">👥 ${clubMemberCount(club.id)} জন সদস্য ${joined?'<span style="color:var(--accent);">• তুমি যোগ দিয়েছো</span>':''}</div>
    </div>`;
  }).join('');
}
function openClubDetail(clubId){
  activeClubId=clubId;
  const club=STUDY_CLUBS.find(c=>c.id===clubId); if(!club) return;
  document.getElementById('clubPageTitle').textContent=`${club.icon} ${club.name}`;
  document.getElementById('clubPageSub').textContent=club.desc;
  renderClubJoinBtn();
  renderClubMembers();
  renderClubPosts();
  document.getElementById('studyClubDetailPage').classList.remove('hidden');
}
function closeClubDetail(){
  document.getElementById('studyClubDetailPage').classList.add('hidden');
  activeClubId=null;
}
function renderClubJoinBtn(){
  const club=STUDY_CLUBS.find(c=>c.id===activeClubId); if(!club) return;
  const joined=myClubs.includes(activeClubId);
  const btn=document.getElementById('clubJoinBtn');
  btn.textContent=joined?'✓ যোগ দেওয়া হয়েছে':'+ ক্লাবে যোগ দাও';
  btn.style.background=joined?'var(--bg3)':`linear-gradient(135deg,${club.color},${club.color}cc)`;
  btn.style.color=joined?'var(--text)':'#fff';
}
function toggleClubJoin(){
  if(!activeClubId) return;
  const joined=myClubs.includes(activeClubId);
  if(joined){ myClubs=myClubs.filter(id=>id!==activeClubId); showToast('ক্লাব থেকে বেরিয়ে গেছো'); }
  else { myClubs.push(activeClubId); showToast('ক্লাবে যোগ দেওয়া হয়েছে 🎉'); }
  saveAppData(); renderClubJoinBtn(); renderClubMembers();
}
function renderClubMembers(){
  const c=document.getElementById('clubMembersRow'); if(!c) return;
  const ids=clubMembers[activeClubId]||[];
  const meJoined=myClubs.includes(activeClubId);
  let html='';
  if(meJoined) html+=studyAvatarHtml({avatar:ME.avatar,profileImg:ME.profileImg||null}, 30);
  ids.slice(0,8).forEach(uid=>{
    const u=getUser(uid); if(!u) return;
    html+=studyAvatarHtml({avatar:u.avatar,profileImg:null}, 30);
  });
  c.innerHTML=html || `<div style="font-size:11px;color:var(--muted2);">এখনো কোনো সদস্য নেই</div>`;
}
function renderClubPosts(){
  const c=document.getElementById('clubPostsContainer'); if(!c) return;
  const list=[...(clubPosts[activeClubId]||[])].sort((a,b)=>b.id-a.id);
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">💬</div>এখনো কোনো পোস্ট নেই।<br>${myClubs.includes(activeClubId)?'নিচে লিখে প্রথম পোস্ট করো।':'ক্লাবে যোগ দিয়ে পোস্ট করো।'}</div>`;
    return;
  }
  c.innerHTML=list.map(p=>{
    const user=studyResolveUser(p.userId);
    return `<div class="lf-card">
      <div class="notice-meta-row" style="margin-bottom:6px;">
        ${studyAvatarHtml(user,22)}
        <span class="notice-poster-name">${escapeHtml(user.name)}</span>
        <span class="notice-time">${p.time}</span>
      </div>
      <div class="lf-desc" style="font-size:12.5px;">${escapeHtml(p.text)}</div>
    </div>`;
  }).join('');
}
function submitClubPost(){
  if(!myClubs.includes(activeClubId)){ showToast('পোস্ট করতে ক্লাবে যোগ দাও'); return; }
  const ta=document.getElementById('clubPostInput');
  const text=ta.value.trim();
  if(!text) return;
  if(!clubPosts[activeClubId]) clubPosts[activeClubId]=[];
  clubPosts[activeClubId].push({ id:nextClubPostId++, userId:0, text, time:'এইমাত্র' });
  ta.value='';
  saveAppData(); renderClubPosts();
}

// ---------- 0) BLOOD GROUP DIRECTORY ----------
function openStudyBlood(){
  bloodDeptFilter='all'; bloodTypeFilterVal='all';
  const si=document.getElementById('bloodSearchInput'); if(si) si.value='';
  renderBloodTypeFilter();
  renderBloodDeptFilter();
  renderBloodList();
  document.getElementById('studyBloodPage').classList.remove('hidden');
}
function renderBloodTypeFilter(){
  const c=document.getElementById('bloodTypeFilter');
  let html=`<div class="study-chip ${bloodTypeFilterVal==='all'?'active':''}" style="${bloodTypeFilterVal==='all'?'background:linear-gradient(135deg,#6C63FF,#4CC9F0);':''}" onclick="setBloodTypeFilter('all')">সব গ্রুপ</div>`;
  BLOOD_TYPES.forEach(b=>{
    const active=bloodTypeFilterVal===b.id;
    html+=`<div class="study-chip ${active?'active':''}" style="${active?`background:${b.color};`:`color:${b.color};border-color:${b.color}55;`}" onclick="setBloodTypeFilter('${b.id}')">🩸 ${b.id}</div>`;
  });
  c.innerHTML=html;
}
function setBloodTypeFilter(t){ bloodTypeFilterVal=t; renderBloodTypeFilter(); renderBloodList(); }
function renderBloodDeptFilter(){
  const c=document.getElementById('bloodDeptFilter');
  let html=`<button class="filter-btn" onclick="setBloodDeptFilter('all')" style="background:${bloodDeptFilter==='all'?'linear-gradient(135deg,#6C63FF,#4CC9F0)':'var(--bg2)'};border:1px solid ${bloodDeptFilter==='all'?'transparent':'var(--border2)'};color:var(--text);">সব বিভাগ</button>`;
  DEPARTMENTS.forEach(d=>{
    const active=bloodDeptFilter===d.id;
    html+=`<button class="filter-btn" onclick="setBloodDeptFilter('${d.id}')" style="background:${active?d.color+'33':'var(--bg2)'};border:1px solid ${active?d.color:'var(--border2)'};color:${active?d.color:'var(--muted2)'};">${d.short}</button>`;
  });
  c.innerHTML=html;
}
function setBloodDeptFilter(f){ bloodDeptFilter=f; renderBloodDeptFilter(); renderBloodList(); }

// Builds a unified, profile-ready list: ME + MOCK_USERS (live students) + registered accounts
function allBloodDirectoryUsers(){
  const list=[];
  list.push({ uid:'me', name:ME.name, dept:ME.dept, year:ME.year, roll:ME.roll||'—', blood:ME.blood||'', avatar:ME.avatar, profileImg:ME.profileImg||null, isMe:true, openId:0, role:ME.role||'student' });
  MOCK_USERS.forEach(u=>{
    list.push({ uid:'u'+u.id, name:u.name, dept:u.dept, year:u.year, roll:u.roll||'—', blood:u.blood||'', avatar:u.avatar, profileImg:null, isMe:false, openId:u.id, role:u.role||'student' });
  });
  registeredAccounts.filter(a=>a.roll!==ME.roll).forEach((a,idx)=>{
    list.push({ uid:'acc'+idx, name:a.name, dept:a.dept, year:a.year, roll:a.roll||'—', blood:a.blood||'', avatar:(a.name[0]||'?'), profileImg:null, isMe:false, openId:null, role:a.role||'student' });
  });
  return list;
}

function renderBloodList(){
  const c=document.getElementById('bloodListContainer');
  const q=(document.getElementById('bloodSearchInput')?.value||'').trim().toLowerCase();
  let list=allBloodDirectoryUsers();
  if(bloodDeptFilter!=='all') list=list.filter(u=>u.dept===bloodDeptFilter);
  if(bloodTypeFilterVal!=='all') list=list.filter(u=>u.blood===bloodTypeFilterVal);
  if(q){
    list=list.filter(u=>
      u.name.toLowerCase().includes(q) ||
      String(u.roll).toLowerCase().includes(q) ||
      (u.blood||'').toLowerCase().includes(q) ||
      getDeptName(u.dept).toLowerCase().includes(q)
    );
  }
  const countEl=document.getElementById('bloodCountLabel');
  if(countEl) countEl.textContent = `🩸 ${list.length} জন শিক্ষার্থী পাওয়া গেছে`;
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🩸</div>কোনো শিক্ষার্থী পাওয়া যায়নি।<br>সার্চ বা ফিল্টার পরিবর্তন করে দেখো।</div>`;
    return;
  }
  c.innerHTML=list.map(u=>{
    const dc=getDeptColor(u.dept);
    const dname=getDeptName(u.dept);
    const bc=BLOOD_TYPES.find(b=>b.id===u.blood)?.color||'#8B8FA8';
    const avatarHtml=u.profileImg
      ? `<img src="${u.profileImg}" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,${dc},${dc}88);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0;">${u.avatar}</div>`;
    const canOpen=u.isMe || u.openId!==null;
    const isTeacherEntry = u.role === 'teacher';
    return `<div class="blood-card" ${canOpen?`onclick="openUserProfile(${u.isMe?0:u.openId})" style="cursor:pointer;"`:''}>
      ${avatarHtml}
      <div style="flex:1;min-width:0;">
        <div class="blood-card-name">${escapeHtml(u.name)}${u.isMe?' <span style="color:var(--accent);font-size:9.5px;font-weight:700;">(তুমি)</span>':''}</div>
        ${isTeacherEntry
          ? `<div class="blood-card-meta">${dname} • 👨‍🏫 শিক্ষক</div>`
          : `<div class="blood-card-meta">${dname} • ${u.year||''}</div><div class="blood-card-meta">🎫 Roll: ${escapeHtml(String(u.roll))}</div>`}
      </div>
      <div class="blood-badge-large" style="background:${bc}22;color:${bc};border-color:${bc}55;">${u.blood||'?'}</div>
    </div>`;
  }).join('');
}

// ---------- 1) NOTES SHARING ----------
function openStudyNotes(){
  renderNotesDeptFilter();
  renderNotesList();
  document.getElementById('studyNotesPage').classList.remove('hidden');
}
function renderNotesDeptFilter(){
  const c=document.getElementById('notesDeptFilter');
  let html=`<button class="filter-btn" onclick="setNotesDeptFilter('all')" style="background:${notesDeptFilter==='all'?'linear-gradient(135deg,#6C63FF,#4CC9F0)':'var(--bg2)'};border:1px solid ${notesDeptFilter==='all'?'transparent':'var(--border2)'};color:var(--text);">সব</button>`;
  DEPARTMENTS.forEach(d=>{
    const active=notesDeptFilter===d.id;
    html+=`<button class="filter-btn" onclick="setNotesDeptFilter('${d.id}')" style="background:${active?d.color+'33':'var(--bg2)'};border:1px solid ${active?d.color:'var(--border2)'};color:${active?d.color:'var(--muted2)'};">${d.short}</button>`;
  });
  c.innerHTML=html;
}
function setNotesDeptFilter(f){ notesDeptFilter=f; renderNotesDeptFilter(); renderNotesList(); }
function renderNotesList(){
  const c=document.getElementById('notesListContainer');
  const list=studyNotes.filter(n=>notesDeptFilter==='all'||n.dept===notesDeptFilter).sort((a,b)=>b.id-a.id);
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">📭</div>এখনো কোনো নোট নেই।<br>নিচের + বাটনে চেপে প্রথম নোট আপলোড করো।</div>`;
    return;
  }
  c.innerHTML=list.map(n=>{
    const dc=getDeptColor(n.dept);
    const dname=DEPARTMENTS.find(d=>d.id===n.dept)?.name||n.dept;
    const isPdf=(n.fileType||'').includes('pdf');
    return `<div class="note-card">
      <div class="note-icon" style="background:${dc}22;color:${dc};">${isPdf?'📄':'🖼️'}</div>
      <div style="flex:1;min-width:0;">
        <div class="note-title">${escapeHtml(n.title)}</div>
        <div class="note-meta">${dname} • ${n.time}</div>
        ${n.desc?`<div class="note-meta" style="margin-top:3px;">${escapeHtml(n.desc)}</div>`:''}
      </div>
      <button class="note-dl-btn" onclick="downloadStudyFile('${n.fileData?n.id:''}','note')">⬇ ডাউনলোড</button>
    </div>`;
  }).join('');
}
function downloadStudyFile(id, kind){
  const list = kind==='note' ? studyNotes : studyVideos;
  const item = list.find(x=>String(x.id)===String(id));
  if(!item || !item.fileData){ showToast('ফাইল পাওয়া যায়নি'); return; }
  const a=document.createElement('a');
  a.href=item.fileData; a.download=item.fileName||'download';
  document.body.appendChild(a); a.click(); a.remove();
}
function openUploadNoteModal(){
  const sel=document.getElementById('noteDept');
  sel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  document.getElementById('noteTitle').value='';
  document.getElementById('noteDesc').value='';
  document.getElementById('noteFileInput').value='';
  document.getElementById('uploadNoteModal').classList.remove('hidden');
}
function closeUploadNoteModal(){ document.getElementById('uploadNoteModal').classList.add('hidden'); }
function submitNote(){
  const title=document.getElementById('noteTitle').value.trim();
  if(!title){ showToast('নোটের নাম লেখো'); return; }
  const dept=document.getElementById('noteDept').value;
  const desc=document.getElementById('noteDesc').value.trim();
  const fileInput=document.getElementById('noteFileInput');
  const file=fileInput.files[0];
  const finish=(fileData,fileName,fileType)=>{
    studyNotes.push({ id:nextStudyId++, title, dept, desc, fileData, fileName, fileType, uploaderId:0, time:'এইমাত্র' });
    saveAppData(); closeUploadNoteModal(); renderNotesList(); showToast('নোট আপলোড হয়েছে ✅');
  };
  if(file){
    const reader=new FileReader();
    reader.onload=ev=>finish(ev.target.result,file.name,file.type);
    reader.readAsDataURL(file);
  } else {
    finish(null,null,null);
  }
}

// ---------- 2) CLASS ROUTINE ----------
function openStudyRoutine(){
  renderRoutineDayPills();
  renderRoutineList();
  document.getElementById('studyRoutinePage').classList.remove('hidden');
}
function renderRoutineDayPills(){
  const c=document.getElementById('routineDayPillRow');
  c.innerHTML=ROUTINE_DAYS.map(d=>`<button class="routine-day-pill ${d===routineActiveDay?'active':''}" onclick="setRoutineDay('${d}')">${d}</button>`).join('');
}
function setRoutineDay(d){ routineActiveDay=d; renderRoutineDayPills(); renderRoutineList(); }
function renderRoutineList(){
  const c=document.getElementById('routineListContainer');
  const list=studyRoutine.filter(r=>r.day===routineActiveDay).sort((a,b)=>a.start.localeCompare(b.start));
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🗓️</div>${routineActiveDay}-এ কোনো ক্লাস যোগ করা নেই।<br>উপরে ✏️ এডিট চেপে ক্লাস যোগ করো।</div>`;
    return;
  }
  c.innerHTML=list.map(r=>{
    const dc=getDeptColor(r.dept);
    const dname=DEPARTMENTS.find(d=>d.id===r.dept)?.name||r.dept;
    return `<div class="routine-slot">
      <div class="routine-time">${formatTime(r.start)}<br>${formatTime(r.end)}</div>
      <div class="routine-bar" style="background:${dc};"></div>
      <div style="flex:1;">
        <div class="routine-subject">${dname}</div>
        ${r.room?`<div class="routine-room">📍 ${escapeHtml(r.room)}</div>`:''}
      </div>
      <button class="comm-action-btn" onclick="deleteRoutineSlot(${r.id})" title="ডিলিট">🗑️</button>
    </div>`;
  }).join('');
}
function formatTime(t){
  if(!t) return '';
  const [h,m]=t.split(':').map(Number);
  const ampm=h>=12?'PM':'AM'; const h12=h%12===0?12:h%12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}
function deleteRoutineSlot(id){
  studyRoutine=studyRoutine.filter(r=>r.id!==id);
  saveAppData(); renderRoutineList(); showToast('ক্লাস রিমুভ করা হয়েছে');
}
function openEditRoutineModal(){
  const daySel=document.getElementById('routineDaySelect');
  daySel.innerHTML=ROUTINE_DAYS.map(d=>`<option value="${d}" ${d===routineActiveDay?'selected':''}>${d}</option>`).join('');
  const subSel=document.getElementById('routineSubjectSelect');
  subSel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  document.getElementById('routineStartTime').value='';
  document.getElementById('routineEndTime').value='';
  document.getElementById('routineRoom').value='';
  document.getElementById('editRoutineModal').classList.remove('hidden');
}
function closeEditRoutineModal(){ document.getElementById('editRoutineModal').classList.add('hidden'); }
function submitRoutineSlot(){
  const day=document.getElementById('routineDaySelect').value;
  const start=document.getElementById('routineStartTime').value;
  const end=document.getElementById('routineEndTime').value;
  const dept=document.getElementById('routineSubjectSelect').value;
  const room=document.getElementById('routineRoom').value.trim();
  if(!start||!end){ showToast('শুরু ও শেষের সময় দাও'); return; }
  studyRoutine.push({ id:nextStudyId++, day, start, end, dept, room });
  saveAppData();
  routineActiveDay=day;
  closeEditRoutineModal(); renderRoutineDayPills(); renderRoutineList();
  showToast('ক্লাস যোগ হয়েছে ✅');
}

// ---------- 3) EXAM ROUTINE ----------
function openStudyExam(){
  renderExamList();
  document.getElementById('studyExamPage').classList.remove('hidden');
}
const EXAM_MONTHS=["জান","ফেব","মার্চ","এপ্রি","মে","জুন","জুলা","আগ","সেপ্ট","অক্টো","নভে","ডিসে"];
function renderExamList(){
  const c=document.getElementById('examListContainer');
  const list=[...studyExams].sort((a,b)=>new Date(a.date+'T'+(a.time||'00:00')) - new Date(b.date+'T'+(b.time||'00:00')));
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🗂️</div>কোনো পরীক্ষার তথ্য যোগ করা নেই।<br>উপরের "+ যোগ করো" বাটনে চাপো।</div>`;
    return;
  }
  c.innerHTML=list.map(e=>{
    const dc=getDeptColor(e.dept);
    const dname=DEPARTMENTS.find(d=>d.id===e.dept)?.name||e.dept;
    const d=new Date(e.date+'T00:00:00');
    const day=isNaN(d)?'--':d.getDate();
    const mon=isNaN(d)?'':EXAM_MONTHS[d.getMonth()];
    return `<div class="exam-card">
      <div class="exam-date-box" style="border:1px solid ${dc}55;">
        <div class="exam-date-day" style="color:${dc};">${day}</div>
        <div class="exam-date-mon">${mon}</div>
      </div>
      <div style="flex:1;">
        <div class="exam-subject">${dname}</div>
        <div class="exam-info">${e.time?'⏰ '+formatTime(e.time):''}${e.room?' • 📍 '+escapeHtml(e.room):''}</div>
      </div>
      <button class="comm-action-btn" onclick="deleteExam(${e.id})" title="ডিলিট">🗑️</button>
    </div>`;
  }).join('');
}
function deleteExam(id){
  studyExams=studyExams.filter(e=>e.id!==id);
  saveAppData(); renderExamList(); showToast('পরীক্ষা রিমুভ করা হয়েছে');
}
function openAddExamModal(){
  const sel=document.getElementById('examSubjectSelect');
  sel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  document.getElementById('examDate').value='';
  document.getElementById('examTime').value='';
  document.getElementById('examRoom').value='';
  document.getElementById('addExamModal').classList.remove('hidden');
}
function closeAddExamModal(){ document.getElementById('addExamModal').classList.add('hidden'); }
function submitExam(){
  const dept=document.getElementById('examSubjectSelect').value;
  const date=document.getElementById('examDate').value;
  const time=document.getElementById('examTime').value;
  const room=document.getElementById('examRoom').value.trim();
  if(!date){ showToast('পরীক্ষার তারিখ দাও'); return; }
  studyExams.push({ id:nextStudyId++, dept, date, time, room });
  saveAppData(); closeAddExamModal(); renderExamList();
  showToast('পরীক্ষা যোগ হয়েছে ✅');
}

// ---------- 4) QUIZ / MCQ PRACTICE ----------
const QUIZ_BANK = {
  math: [
    { q:"২x + ৫ = ১৫ হলে, x এর মান কত?", opts:["৩","৫","৭","১০"], correct:1 },
    { q:"একটি ত্রিভুজের তিন কোণের সমষ্টি কত ডিগ্রি?", opts:["৯০°","১৪৪০°","১৮০°","৩৬০°"], correct:2 },
    { q:"√৪৯ এর মান কত?", opts:["৬","৭","৮","৯"], correct:1 },
  ],
  physics: [
    { q:"আলোর গতি কত (প্রায়)?", opts:["৩×১০⁵ km/s","৩×১০⁸ m/s","৩×১০⁶ m/s","৩×১০⁴ m/s"], correct:1 },
    { q:"নিউটনের কততম সূত্র জড়তার সূত্র নামে পরিচিত?", opts:["প্রথম","দ্বিতীয়","তৃতীয়","কোনোটিই নয়"], correct:0 },
  ],
  chemistry: [
    { q:"পানির রাসায়নিক সংকেত কী?", opts:["CO₂","H₂O","O₂","NaCl"], correct:1 },
    { q:"পরমাণুর কেন্দ্রে কী থাকে?", opts:["ইলেকট্রন","নিউক্লিয়াস","আয়ন","অণু"], correct:1 },
  ],
  english: [
    { q:"Choose the correct synonym of 'Happy':", opts:["Sad","Joyful","Angry","Tired"], correct:1 },
    { q:"What is the past tense of 'Go'?", opts:["Goes","Gone","Went","Going"], correct:2 },
  ],
  bangla: [
    { q:"'বাংলা ভাষার প্রথম কবি' কাকে বলা হয়?", opts:["লুইপা","কাজী নজরুল","রবীন্দ্রনাথ","জসীমউদ্দীন"], correct:0 },
    { q:"'সমাস' শব্দের অর্থ কী?", opts:["বিভক্তি","সংক্ষেপণ","সন্ধি","উপসর্গ"], correct:1 },
  ],
};
function openStudyQuiz(){
  activeQuizSubject=null;
  renderQuizSubjectList();
  document.getElementById('quizPageTitle').textContent='🧠 Quiz / MCQ Practice';
  document.getElementById('quizPageSub').textContent='সাবজেক্ট বেছে নিয়ে প্র্যাকটিস শুরু করো';
  document.getElementById('studyQuizPage').classList.remove('hidden');
}
function renderQuizSubjectList(){
  const c=document.getElementById('quizBodyContainer');
  const subjectsWithQuiz=Object.keys(QUIZ_BANK);
  c.innerHTML=subjectsWithQuiz.map(id=>{
    const d=DEPARTMENTS.find(x=>x.id===id);
    if(!d) return '';
    const count=QUIZ_BANK[id].length;
    return `<div class="quiz-subject-card" onclick="startQuiz('${id}')">
      <div class="quiz-subject-icon" style="background:${d.color}22;color:${d.color};">📘</div>
      <div style="flex:1;">
        <div class="quiz-subject-name">${d.name}</div>
        <div class="quiz-subject-meta">${count}টি প্রশ্ন</div>
      </div>
      <div style="color:var(--muted2);">›</div>
    </div>`;
  }).join('');
}
function startQuiz(subjectId){
  activeQuizSubject=subjectId;
  activeQuizQuestions=[...QUIZ_BANK[subjectId]];
  activeQuizIndex=0; activeQuizScore=0; activeQuizAnswered=false;
  const d=DEPARTMENTS.find(x=>x.id===subjectId);
  document.getElementById('quizPageTitle').textContent=`🧠 ${d.name} কুইজ`;
  renderQuizQuestion();
}
function renderQuizQuestion(){
  const c=document.getElementById('quizBodyContainer');
  if(activeQuizIndex>=activeQuizQuestions.length){
    const pct=Math.round((activeQuizScore/activeQuizQuestions.length)*100);
    const emoji=pct>=80?'🏆':pct>=50?'👍':'📖';
    document.getElementById('quizPageSub').textContent='কুইজ শেষ!';
    c.innerHTML=`<div class="quiz-result-emoji">${emoji}</div>
      <div class="quiz-result-score">${activeQuizScore} / ${activeQuizQuestions.length}</div>
      <div class="quiz-result-label">তুমি ${pct}% সঠিক উত্তর দিয়েছো</div>
      <button class="quiz-next-btn" style="margin-top:20px;" onclick="openStudyQuiz()">অন্য সাবজেক্ট বেছে নাও</button>
      <button class="quiz-next-btn" style="margin-top:10px;background:var(--bg3);color:var(--text);" onclick="startQuiz('${activeQuizSubject}')">আবার চেষ্টা করো</button>`;
    return;
  }
  const q=activeQuizQuestions[activeQuizIndex];
  activeQuizAnswered=false;
  document.getElementById('quizPageSub').textContent=`প্রশ্ন ${activeQuizIndex+1} / ${activeQuizQuestions.length}`;
  c.innerHTML=`
    <div class="quiz-progress-wrap">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(activeQuizIndex/activeQuizQuestions.length)*100}%;"></div></div>
    </div>
    <div class="quiz-question-box">
      <div class="quiz-question-text">${escapeHtml(q.q)}</div>
      ${q.opts.map((opt,i)=>`<div class="quiz-option" id="qopt-${i}" onclick="answerQuiz(${i})">${escapeHtml(opt)}</div>`).join('')}
    </div>
    <div id="quizNextBtnWrap"></div>
  `;
}
function answerQuiz(choiceIdx){
  if(activeQuizAnswered) return;
  activeQuizAnswered=true;
  const q=activeQuizQuestions[activeQuizIndex];
  const correct=q.correct;
  if(choiceIdx===correct) activeQuizScore++;
  q.opts.forEach((_,i)=>{
    const el=document.getElementById('qopt-'+i);
    el.classList.add('disabled');
    if(i===correct) el.classList.add('correct');
    else if(i===choiceIdx) el.classList.add('wrong');
  });
  document.getElementById('quizNextBtnWrap').innerHTML=`<button class="quiz-next-btn" onclick="nextQuizQuestion()">${activeQuizIndex+1<activeQuizQuestions.length?'পরের প্রশ্ন →':'রেজাল্ট দেখো'}</button>`;
}
function nextQuizQuestion(){ activeQuizIndex++; renderQuizQuestion(); }
function closeQuizPage(){
  document.getElementById('studyQuizPage').classList.add('hidden');
  activeQuizSubject=null;
}

// ---------- 5) VIDEO LECTURES ----------
function youtubeIdFromUrl(url){
  if(!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}
function openStudyVideo(){
  renderVideoDeptFilter();
  renderVideoList();
  document.getElementById('studyVideoPage').classList.remove('hidden');
}
function renderVideoDeptFilter(){
  const c=document.getElementById('videoDeptFilter');
  let html=`<button class="filter-btn" onclick="setVideoDeptFilter('all')" style="background:${videoDeptFilterVal==='all'?'linear-gradient(135deg,#6C63FF,#4CC9F0)':'var(--bg2)'};border:1px solid ${videoDeptFilterVal==='all'?'transparent':'var(--border2)'};color:var(--text);">সব</button>`;
  DEPARTMENTS.forEach(d=>{
    const active=videoDeptFilterVal===d.id;
    html+=`<button class="filter-btn" onclick="setVideoDeptFilter('${d.id}')" style="background:${active?d.color+'33':'var(--bg2)'};border:1px solid ${active?d.color:'var(--border2)'};color:${active?d.color:'var(--muted2)'};">${d.short}</button>`;
  });
  c.innerHTML=html;
}
function setVideoDeptFilter(f){ videoDeptFilterVal=f; renderVideoDeptFilter(); renderVideoList(); }
function renderVideoList(){
  const c=document.getElementById('videoListContainer');
  const list=studyVideos.filter(v=>videoDeptFilterVal==='all'||v.dept===videoDeptFilterVal).sort((a,b)=>b.id-a.id);
  if(list.length===0){
    c.innerHTML=`<div class="study-empty"><div class="study-empty-icon">🎬</div>এখনো কোনো ভিডিও লিংক যোগ করা হয়নি।<br>নিচের + বাটনে চেপে যোগ করো।</div>`;
    return;
  }
  c.innerHTML=list.map(v=>{
    const yid=youtubeIdFromUrl(v.url);
    const dname=DEPARTMENTS.find(d=>d.id===v.dept)?.name||v.dept;
    const thumb=yid?`https://img.youtube.com/vi/${yid}/hqdefault.jpg`:'';
    return `<div class="video-card">
      <div class="video-thumb-wrap" onclick="playStudyVideo(${v.id})">
        ${thumb?`<img src="${thumb}" alt="">`:`<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted2);font-size:11px;">লিংক ভ্যালিড না</div>`}
        <div class="video-play-overlay"><div class="video-play-btn">▶️</div></div>
      </div>
      <div class="video-card-body">
        <div class="video-card-title">${escapeHtml(v.title)}</div>
        <div class="video-card-meta">${dname} • ${v.time}</div>
      </div>
    </div>`;
  }).join('');
}
function playStudyVideo(id){
  const v=studyVideos.find(x=>x.id===id); if(!v) return;
  const yid=youtubeIdFromUrl(v.url);
  if(!yid){ showToast('সঠিক YouTube লিংক না'); return; }
  openInfoModal('🎬 '+v.title, `<div class="video-player-wrap"><iframe src="https://www.youtube.com/embed/${yid}" allowfullscreen allow="autoplay; encrypted-media"></iframe></div>`);
}
function openAddVideoModal(){
  const sel=document.getElementById('videoDept');
  sel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  document.getElementById('videoTitle').value='';
  document.getElementById('videoUrl').value='';
  document.getElementById('addVideoModal').classList.remove('hidden');
}
function closeAddVideoModal(){ document.getElementById('addVideoModal').classList.add('hidden'); }
function submitVideo(){
  const title=document.getElementById('videoTitle').value.trim();
  const dept=document.getElementById('videoDept').value;
  const url=document.getElementById('videoUrl').value.trim();
  if(!title){ showToast('ভিডিওর শিরোনাম লেখো'); return; }
  if(!youtubeIdFromUrl(url)){ showToast('সঠিক YouTube লিংক দাও'); return; }
  studyVideos.push({ id:nextStudyId++, title, dept, url, uploaderId:0, time:'এইমাত্র' });
  saveAppData(); closeAddVideoModal(); renderVideoList();
  showToast('ভিডিও যোগ হয়েছে ✅');
}

// shared escape helper (only define if not already present)
if(typeof escapeHtml !== 'function'){
  window.escapeHtml = function(str){
    if(str==null) return '';
    return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  };
}

