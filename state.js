// ============================================================
// =========== FLOATING DOTS ANIMATION (CSS-based) ============
// ============================================================
function initFloatingDots() {
  const screens = document.querySelectorAll('.auth-screen');
  const COLORS = [
    'rgba(108,99,255,0.55)','rgba(76,201,240,0.45)',
    'rgba(247,37,133,0.35)','rgba(6,214,160,0.40)'
  ];
  screens.forEach(screen => {
    const container = document.createElement('div');
    container.className = 'auth-dots';
    screen.appendChild(container);
    for(let i = 0; i < 22; i++) {
      const dot = document.createElement('div');
      dot.className = 'auth-dot';
      const size = Math.random() * 3 + 1.5;
      dot.style.cssText = [
        `width:${size}px`, `height:${size}px`,
        `left:${Math.random()*100}%`,
        `top:${Math.random()*100}%`,
        `background:${COLORS[Math.floor(Math.random()*COLORS.length)]}`,
        `animation-duration:${8 + Math.random()*12}s`,
        `animation-delay:${Math.random()*10}s`
      ].join(';');
      container.appendChild(dot);
    }
  });
}

// ===== DATA =====
const DEPARTMENTS = [
  { id:"bangla", name:"বাংলা", short:"বাং", color:"#E63946" },
  { id:"english", name:"ইংরেজি", short:"ENG", color:"#457B9D" },
  { id:"math", name:"গণিত", short:"গণি", color:"#2A9D8F" },
  { id:"physics", name:"পদার্থবিজ্ঞান", short:"পদা", color:"#E9C46A" },
  { id:"chemistry", name:"রসায়ন", short:"রসা", color:"#F4A261" },
  { id:"biology", name:"জীববিজ্ঞান", short:"জীব", color:"#52B788" },
  { id:"history", name:"ইতিহাস", short:"ইতি", color:"#9B5DE5" },
  { id:"accounting", name:"হিসাববিজ্ঞান", short:"হিস", color:"#F72585" },
  { id:"economics", name:"অর্থনীতি", short:"অর্থ", color:"#4CC9F0" },
  { id:"ict", name:"তথ্যপ্রযুক্তি", short:"ICT", color:"#06D6A0" },
];

// All blood groups, each with its own accent color for badges/chips
const BLOOD_TYPES = [
  { id:"A+",  color:"#E63946" },
  { id:"A-",  color:"#E76F51" },
  { id:"B+",  color:"#2A9D8F" },
  { id:"B-",  color:"#457B9D" },
  { id:"AB+", color:"#9B5DE5" },
  { id:"AB-", color:"#6C63FF" },
  { id:"O+",  color:"#F4A261" },
  { id:"O-",  color:"#F72585" },
];

const MOCK_USERS = [
  { id:1, username:"rafiahmed", name:"রাফি আহমেদ", dept:"ict", year:"২য় বর্ষ", roll:"2023101", avatar:"রা", online:true, bio:"ICT lover & coder 💻", blood:"O+", joined:"মার্চ ২০২৩", birthday:"2026-06-20", lastSeen: Date.now() },
  { id:2, username:"tanjinaislam", name:"তানজিনা ইসলাম", dept:"english", year:"৩য় বর্ষ", roll:"2022045", avatar:"তা", online:true, bio:"Literature enthusiast 📖", blood:"A+", joined:"জানুয়ারি ২০২২", birthday:"2002-09-14", lastSeen: Date.now() },
  { id:3, username:"nafishossain", name:"নাফিস হোসেন", dept:"math", year:"১ম বর্ষ", roll:"2024078", avatar:"না", online:false, bio:"Math is life 🧮", blood:"B+", joined:"জুলাই ২০২৪", birthday:"2004-12-01", lastSeen: Date.now() - 5*60*1000 },
  { id:4, username:"sabilanoor", name:"সাবিলা নূর", dept:"biology", year:"২য় বর্ষ", roll:"2023056", avatar:"সা", online:true, bio:"Future doctor 🩺", blood:"AB+", joined:"মার্চ ২০২৩", birthday:"", lastSeen: Date.now() },
  { id:5, username:"arifrahman", name:"আরিফ রহমান", dept:"physics", year:"৩য় বর্ষ", roll:"2022019", avatar:"আ", online:false, bio:"Physics geek ⚛️", blood:"B-", joined:"জানুয়ারি ২০২২", birthday:"", lastSeen: Date.now() - 47*60*1000 },
  { id:6, username:"mithilachowdhury", name:"মিথিলা চৌধুরী", dept:"bangla", year:"১ম বর্ষ", roll:"2024033", avatar:"মি", online:true, bio:"কবিতা ভালোবাসি ✍️", blood:"O-", joined:"জুলাই ২০২৪", birthday:"", lastSeen: Date.now() },
];

const ME = { id:0, username:"tumi", name:"তুমি", dept:"ict", year:"২য় বর্ষ", roll:"2024001", avatar:"তু", bio:"Debendra College এর একজন গর্বিত শিক্ষার্থী 🎓", blood:"B+", phone:"", joined:"জানুয়ারি ২০২৪", facebook:"", instagram:"", profileImg:null, birthday:"", role:"student", designation:"", accountStatus:"approved" };

// ===== ROLE SYSTEM =====
// role: "student" (no extra role) | "cr" | "teacher"
const ROLES = [
  { id:"student", label:"শিক্ষার্থী", icon:"🎓" },
  { id:"cr", label:"CR (ক্লাস রিপ্রেজেন্টেটিভ)", icon:"🧑‍🤝‍🧑" },
  { id:"teacher", label:"শিক্ষক", icon:"👨‍🏫" },
];
// Teacher designations — selectable only by teacher-role accounts, shown on their profile
const DESIGNATIONS = ["সহকারী অধ্যাপক", "সহযোগী অধ্যাপক", "প্রভাষক", "প্রদর্শক", "ইনসিটু"];
const isTeacher = (u => (u||ME).role === 'teacher');
const isCR = (u => (u||ME).role === 'cr');
const roleLabel = id => ROLES.find(r=>r.id===id)?.label || '';

let posts = [
  { id:1, userId:2, text:"আগামীকাল ইংরেজি বিভাগের সেমিনার আছে, সবাই আসবে কিন্তু! 📚", time:"১০ মিনিট আগে", likes:12, comments:[
    { id:101, userId:1, text:"অবশ্যই আসব! 👍", time:"৫ মি আগে", likes:2, likedByMe:false, replies:[] },
    { id:102, userId:4, text:"সময় কতটায়?", time:"৩ মি আগে", likes:0, likedByMe:false, replies:[] }
  ], dept:"english", reactions:{}, audience:"public" },
  { id:2, userId:1, text:"ICT Assignment এর জন্য কেউ group করতে চাইলে DM করো। একসাথে করলে সহজ হবে 💻", time:"৩০ মিনিট আগে", likes:8, comments:[
    { id:103, userId:0, text:"আমি আছি! DM করব।", time:"২০ মি আগে", likes:1, likedByMe:false, replies:[] }
  ], dept:"ict", reactions:{}, audience:"friends" },
  { id:3, userId:4, text:"Biology practical এর notes কারো কাছে আছে? Share করলে খুব উপকার হতো 🙏", time:"১ ঘণ্টা আগে", likes:15, comments:[], dept:"biology", reactions:{}, audience:"public" },
  { id:4, userId:6, text:"বাংলা বিভাগের নতুন পাঠ্যক্রম নিয়ে কেউ জানো? Noticeboard এ কিছু দেখলাম না তো 🤔", time:"২ ঘণ্টা আগে", likes:6, comments:[], dept:"bangla", reactions:{}, audience:"public" },
];

let groupPosts = {
  1: [{ id:101, userId:1, text:"আজকের ICT class এর notes এখানে share করলাম 📒", time:"৩০ মি আগে", likes:5, comments:[], reactions:{} }],
  2: [],
  3: [{ id:201, userId:2, text:"Tomorrow's seminar reading list 📚 সবাই পড়ে আসবে!", time:"গতকাল", likes:9, comments:[], reactions:{} }],
  4: [],
};

let messages = {
  2: [
    { from:"them", text:"হ্যালো! কেমন আছো?", time:"10:30" },
    { from:"me", text:"ভালো আছি, তুমি কেমন?", time:"10:31" },
    { from:"them", text:"ভালো! English assignment শেষ করেছো?", time:"10:32" },
  ],
  4: [
    { from:"them", text:"Biology notes লাগবে?", time:"09:15" },
    { from:"me", text:"হ্যাঁ, please share করো!", time:"09:16" },
  ],
};

let studyGroups = [
  { id:1, name:"ICT Study Circle", dept:"ict", members:4, active:true, desc:"ICT বিভাগের সব বিষয়ে একসাথে পড়াশোনা করি",
    creatorId:1, admins:[1], moderators:[3], memberIds:[1,3,6,0], messagePermission:'everyone', mutedByMe:false,
    msgs:[ { id:9001, from:"রাফি", fromId:1, text:"আজ রাতে কি সবাই available?", time:"08:30" } ] },
  { id:2, name:"Math Problem Solvers", dept:"math", members:2, active:false, desc:"কঠিন math সমস্যা একসাথে সমাধান করি",
    creatorId:3, admins:[3], moderators:[], memberIds:[3,5], messagePermission:'everyone', mutedByMe:false, msgs:[] },
  { id:3, name:"English Literature Club", dept:"english", members:5, active:true, desc:"ইংরেজি সাহিত্য নিয়ে আলোচনা ও পাঠ",
    creatorId:2, admins:[2], moderators:[1], memberIds:[2,1,4,6,0], messagePermission:'everyone', mutedByMe:false,
    msgs:[ { id:9002, from:"তানজিনা", fromId:2, text:"Tomorrow's seminar preparation started 📚", time:"Yesterday" } ] },
  { id:4, name:"Biology Lab Partners", dept:"biology", members:2, active:true, desc:"Lab practical ও theory একসাথে প্রস্তুতি",
    creatorId:4, admins:[4], moderators:[], memberIds:[4,2], messagePermission:'everyone', mutedByMe:false, msgs:[] },
];

let friendRequests = [
  { id:3, name:"নাফিস হোসেন", dept:"math", year:"১ম বর্ষ", avatar:"না" },
  { id:5, name:"আরিফ রহমান", dept:"physics", year:"৩য় বর্ষ", avatar:"আ" },
];

let friends = [1, 2, 4, 6];
let likedPosts = [];

// ===== FRIEND GROUPS (multi-friend group messaging, separate from study groups) =====
let friendGroups = []; // {id, name, memberIds:[...], msgs:[{id,from,fromName,text,time,type,img,duration,seen,delivered}]}
let nextFriendGroupId = 5000;
const isFriendGroupChat = id => typeof id === 'string' && id.startsWith('fg_');
const getFriendGroup = id => friendGroups.find(g => 'fg_'+g.id === id);
const onlineFriendsCount = () => MOCK_USERS.filter(u => friends.includes(u.id) && u.online && !isBlocked(u.id)).length;
let savedPosts = [];
let joinedGroups = [1, 3];
let deptFilter = "all";
let activeTab = "feed";
let profileSubTab = "about";
let selectedChat = null;
let selectedGroupChat = null;
let selectedGroupTab = "chat"; // "chat" or "posts"
let attachedFile = null;
let attachedImg = null;
let searchTab = "all";
let openComments = new Set();
let openReplies = new Set(); // stores comment ids with reply box open
let revealedReplyCounts = new Map(); // comment/reply id -> how many of its nested replies are currently revealed (0 = none shown yet)
const REPLY_PREVIEW_COUNT = 2; // how many replies to reveal each time "আরো দেখুন" is clicked
let commentImgAttach = {}; // key -> dataURL, for pending comment/reply image attachments (key: "top-<postId>" or "reply-<postId>-<commentId>")
let activeCommentModal = null; // {postId, isGroupCtx} - currently open comment modal
let storyTimer = null;
let storyPct = 0;
let storyTimerIndexActive = null;
let currentStoryIndex = null;
let activeReactionPopup = null;
let myReactions = {}; // postId -> emoji
let editingPostId = null;
let editingCommentId = null; // {postId, commentId, isGroupCtx}
let postAudience = 'public'; // synced to settings.defaultAudience in loadAppData()
let blockedUsers = [];
let mutedDMs = []; // userIds whose 1-1 chat ME has muted
let dismissedSuggestions = [];
let reports = [];
let pinnedPostId = null; // নিজের যে পোস্ট pin করা হবে
let deferredInstallPrompt = null;
let pwaInitialized = false;
let pushPermissionGranted = false;
let nextNotifId = 100;

// ===== STUDY HUB STATE =====
let studyNotes = []; // {id, title, dept, desc, fileData, fileName, fileType, uploaderId, time}
let studyRoutine = []; // {id, day, start, end, dept, room}
let studyExams = []; // {id, dept, date, time, room}
let studyVideos = []; // {id, title, dept, url, uploaderId, time}
let notesDeptFilter = "all";
let videoDeptFilterVal = "all";
let bloodDeptFilter = "all";
let bloodTypeFilterVal = "all";
let routineActiveDay = "শনিবার";
let nextStudyId = 1;

// ----- NOTICEBOARD (CR/Teacher post করবে, সবাই দেখবে) -----
let notices = [
  { id:1, title:"২য় বর্ষের ক্লাস টেস্ট রুটিন প্রকাশিত", body:"২য় বর্ষের সকল বিভাগের ক্লাস টেস্ট আগামী সপ্তাহ থেকে শুরু হবে। বিস্তারিত রুটিন নোটিসবোর্ডে দেওয়া হলো, সবাই দেখে নাও।", category:"academic", posterId:2, time:"২ ঘণ্টা আগে", pinned:true },
  { id:2, title:"কলেজ বন্ধের নোটিস — জাতীয় ছুটির দিন", body:"আগামী বুধবার জাতীয় ছুটির কারণে কলেজ বন্ধ থাকবে। বৃহস্পতিবার থেকে যথারীতি ক্লাস শুরু হবে।", category:"general", posterId:5, time:"১ দিন আগে", pinned:false },
];

// ----- LOST & FOUND (সবাই পোস্ট করতে পারবে) -----
let lostFoundPosts = [
  { id:1, type:"lost", title:"একটি নীল রঙের ক্যালকুলেটর হারিয়েছে", desc:"গতকাল গণিত ক্লাসের পর লাইব্রেরির সামনে হারিয়েছে। কেউ পেলে যোগাযোগ করো 🙏", location:"লাইব্রেরি, ২য় তলা", userId:3, time:"৫ ঘণ্টা আগে", resolved:false },
  { id:2, type:"found", title:"একটি স্টুডেন্ট আইডি কার্ড পাওয়া গেছে", desc:"ক্যান্টিনের পাশে একটা আইডি কার্ড পড়ে পেয়েছি। নাম মিলিয়ে নিজের হলে যোগাযোগ করো।", location:"ক্যান্টিন এরিয়া", userId:1, time:"১ দিন আগে", resolved:false },
];

// ----- EVENTS (CR/Teacher যোগ করবে, সবাই দেখবে) -----
let collegeEvents = [
  { id:1, title:"আন্তঃবিভাগ বিজ্ঞান মেলা", desc:"সকল বিভাগের শিক্ষার্থীরা প্রজেক্ট নিয়ে অংশগ্রহণ করতে পারবে। বিজয়ীদের জন্য থাকবে আকর্ষণীয় পুরস্কার।", category:"seminar", date:"2026-07-05", time:"10:00", venue:"মেইন অডিটোরিয়াম", posterId:5 },
  { id:2, title:"বার্ষিক সাংস্কৃতিক অনুষ্ঠান", desc:"গান, নাচ, আবৃত্তি ও নাটকের আয়োজন থাকছে এই বছরের সাংস্কৃতিক সন্ধ্যায়। সবাই আমন্ত্রিত!", category:"cultural", date:"2026-07-12", time:"16:00", venue:"কলেজ মাঠ", posterId:2 },
];

// ----- CLUB SECTION -----
const STUDY_CLUBS = [
  { id:"physics", name:"Physics Club", icon:"⚛️", color:"#E9C46A", desc:"পদার্থবিজ্ঞান নিয়ে চর্চা, এক্সপেরিমেন্ট ও আলোচনা", active:true },
  { id:"ict", name:"ICT Club", icon:"💻", color:"#06D6A0", desc:"কোডিং, টেক প্রজেক্ট ও ডিজিটাল স্কিল নিয়ে কাজ", active:true },
  { id:"debate", name:"Debate Club", icon:"🗣️", color:"#9B5DE5", desc:"যুক্তি-তর্ক ও বিতর্ক চর্চার ক্লাব", active:false },
  { id:"cultural", name:"Cultural Club", icon:"🎭", color:"#F72585", desc:"গান, নাচ, নাটক ও সাংস্কৃতিক চর্চা", active:false },
  { id:"science", name:"Science Club", icon:"🔬", color:"#4CC9F0", desc:"বিজ্ঞান চর্চা ও এক্সপেরিমেন্ট", active:false },
  { id:"sports", name:"Sports Club", icon:"⚽", color:"#2A9D8F", desc:"খেলাধুলা ও টুর্নামেন্ট আয়োজন", active:false },
];
let clubMembers = { physics:[1,4], ict:[1,3,6] }; // clubId -> array of userIds (mock members)
let myClubs = []; // clubIds ME has joined
let clubPosts = { physics: [], ict: [] }; // clubId -> [{id,userId,text,time}]
let noticeFilterVal = "all";
let lostFoundFilterVal = "all";
let eventFilterVal = "all";
let activeClubId = null;
let nextNoticeId = 3;
let nextLostFoundId = 3;
let nextEventId = 3;
let nextClubPostId = 1;
const ROUTINE_DAYS = ["শনিবার","রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার"];
let activeQuizSubject = null;
let activeQuizQuestions = [];
let activeQuizIndex = 0;
let activeQuizScore = 0;
let activeQuizAnswered = false;

let settings = {
  notifLikes:true, notifComments:true, notifMentions:true, notifMessages:true, notifGroups:false,
  notifPush:true, privateProfile:false, darkMode:true, themeMode:'auto', showOnline:true,
  defaultAudience:'public',      // 'public' | 'friends' | 'private' — default audience for new posts
  whoCanMessage:'everyone',      // 'everyone' | 'friends' — who can start a DM with you
  profileVisibility:'public',    // 'public' | 'friends' | 'private' — who can view your full profile
  language:'bn'                  // 'bn' | 'en' — UI language for settings/account screens
};

let accountDeactivated = false;

let notificationsList = [
  { id:1, type:"like", userId:2, text:"তানজিনা ইসলাম তোমার পোস্টে লাইক দিয়েছে", time:"৫ মিনিট আগে", read:false },
  { id:2, type:"comment", userId:3, text:"নাফিস হোসেন তোমার পোস্টে কমেন্ট করেছে: \"দারুণ হয়েছে!\"", time:"২০ মিনিট আগে", read:false },
  { id:3, type:"mention", userId:1, text:"রাফি আহমেদ তোমাকে একটি কমেন্টে mention করেছে", time:"৩৫ মিনিট আগে", read:false },
  { id:4, type:"friend_request", userId:5, text:"আরিফ রহমান তোমাকে friend request পাঠিয়েছে", time:"৪৫ মিনিট আগে", read:false },
  { id:5, type:"group", userId:1, text:"ICT Study Circle গ্রুপে নতুন পোস্ট হয়েছে", time:"৩ ঘণ্টা আগে", read:true },
  { id:6, type:"file", userId:4, text:"সাবিলা নূর একটি নতুন নোট শেয়ার করেছে", time:"৫ ঘণ্টা আগে", read:true },
];

const stories = [
  { userId:0, text:"আজকের ক্লাস অনেক ভালো ছিল! 🎓", time:"এইমাত্র", seen:false, createdAt:Date.now(), viewedBy:[{userId:1,emoji:null},{userId:2,emoji:'❤️'},{userId:4,emoji:'😮'}] },
  { userId:2, text:"English seminar কাল! সবাই আসবে 📚", time:"১ ঘণ্টা আগে", seen:false, createdAt:Date.now()-1*3600000, viewedBy:[] },
  { userId:1, text:"ICT project শেষ করলাম আজ 💻🔥", time:"২ ঘণ্টা আগে", seen:false, createdAt:Date.now()-2*3600000, viewedBy:[] },
  { userId:4, text:"Biology lab আজ awesome ছিল 🧬", time:"৩ ঘণ্টা আগে", seen:true, createdAt:Date.now()-3*3600000, viewedBy:[] },
  { userId:6, text:"নতুন কবিতা লিখলাম আজ ✍️", time:"৪ ঘণ্টা আগে", seen:true, createdAt:Date.now()-4*3600000, viewedBy:[] },
  { userId:3, text:"Exam routine বের হয়েছে, সবাই check করো ⏰", time:"২৩ ঘণ্টা আগে", seen:true, createdAt:Date.now()-23*3600000, viewedBy:[] },
];

// ===== TRANSLATIONS (Settings / Account UI language toggle) =====
const I18N = {
  bn: {
    account:"অ্যাকাউন্ট", editProfile:"প্রোফাইল এডিট করো", editProfileSub:"নাম, বায়ো, ছবি পরিবর্তন করো",
    changePass:"পাসওয়ার্ড পরিবর্তন", changePassSub:"অ্যাকাউন্ট সুরক্ষিত রাখো",
    changeEmail:"Gmail পরিবর্তন", changeEmailSub:"অ্যাকাউন্ট ইমেইল আপডেট করো",
    notifications:"নোটিফিকেশন", pushNotif:"Push নোটিফিকেশন", pushNotifSub:"ব্রাউজার push alert",
    likeNotif:"লাইক নোটিফিকেশন", commentNotif:"কমেন্ট নোটিফিকেশন", mentionNotif:"Mention নোটিফিকেশন",
    msgNotif:"মেসেজ নোটিফিকেশন", groupNotif:"গ্রুপ আপডেট নোটিফিকেশন", birthdayNotif:"জন্মদিন নোটিফিকেশন",
    privacy:"প্রাইভেসি", privateProfile:"প্রাইভেট প্রোফাইল", privateProfileSub:"শুধু ফ্রেন্ডরা পোস্ট দেখতে পারবে",
    showOnline:"অনলাইন স্ট্যাটাস দেখাও", blockedUsers:"ব্লক করা ইউজার", noBlocked:"কাউকে ব্লক করা নেই",
    blockedCount:"জন ব্লক করা",
    defaultAudience:"পোস্টের ডিফল্ট দর্শক", defaultAudienceSub:"নতুন পোস্টে কারা দেখবে তা ঠিক করো",
    whoCanMessage:"কে মেসেজ করতে পারবে", whoCanMessageSub:"DM পাঠানোর অনুমতি নিয়ন্ত্রণ করো",
    profileVisibility:"প্রোফাইল ভিজিবিলিটি", profileVisibilitySub:"তোমার প্রোফাইল কারা দেখতে পারবে",
    everyone:"সবাই", friendsOnly:"শুধু ফ্রেন্ড", onlyMe:"শুধু আমি", publicAud:"সবাই",
    display:"প্রদর্শন", themeMode:"থিম মোড", themeModeSub:"সিস্টেম অনুযায়ী স্বয়ংক্রিয়",
    auto:"অটো", dark:"ডার্ক", light:"লাইট",
    language:"ভাষা", languageSub:"অ্যাপের ভাষা পরিবর্তন করো", bangla:"বাংলা", english:"English",
    app:"অ্যাপ", installApp:"অ্যাপ ইনস্টল করো", installAppSub:"হোম স্ক্রিনে যোগ করো",
    support:"সহায়তা", helpCenter:"সাহায্য কেন্দ্র", policy:"নীতিমালা ও শর্তাবলী",
    accountActions:"অ্যাকাউন্ট অ্যাকশন",
    deactivate:"অ্যাকাউন্ট ডিএক্টিভেট করো", deactivateSub:"সাময়িকভাবে প্রোফাইল লুকিয়ে রাখো",
    deleteAccount:"অ্যাকাউন্ট ডিলিট করো", deleteAccountSub:"স্থায়ীভাবে সব তথ্য মুছে ফেলো",
    logout:"লগ আউট",
  },
  en: {
    account:"Account", editProfile:"Edit Profile", editProfileSub:"Change name, bio, photo",
    changePass:"Change Password", changePassSub:"Keep your account secure",
    changeEmail:"Change Gmail", changeEmailSub:"Update your account email",
    notifications:"Notifications", pushNotif:"Push Notifications", pushNotifSub:"Browser push alerts",
    likeNotif:"Like Notifications", commentNotif:"Comment Notifications", mentionNotif:"Mention Notifications",
    msgNotif:"Message Notifications", groupNotif:"Group Update Notifications", birthdayNotif:"Birthday Notifications",
    privacy:"Privacy", privateProfile:"Private Profile", privateProfileSub:"Only friends can see your posts",
    showOnline:"Show Online Status", blockedUsers:"Blocked Users", noBlocked:"No one is blocked",
    blockedCount:"blocked",
    defaultAudience:"Default Post Audience", defaultAudienceSub:"Choose who sees your new posts",
    whoCanMessage:"Who Can Message Me", whoCanMessageSub:"Control who can send you a DM",
    profileVisibility:"Profile Visibility", profileVisibilitySub:"Choose who can view your profile",
    everyone:"Everyone", friendsOnly:"Friends Only", onlyMe:"Only Me", publicAud:"Everyone",
    display:"Display", themeMode:"Theme Mode", themeModeSub:"Follow system automatically",
    auto:"Auto", dark:"Dark", light:"Light",
    language:"Language", languageSub:"Change app language", bangla:"বাংলা", english:"English",
    app:"App", installApp:"Install App", installAppSub:"Add to home screen",
    support:"Support", helpCenter:"Help Center", policy:"Policy & Terms",
    accountActions:"Account Actions",
    deactivate:"Deactivate Account", deactivateSub:"Temporarily hide your profile",
    deleteAccount:"Delete Account", deleteAccountSub:"Permanently erase all your data",
    logout:"Log Out",
  }
};
const t = key => (I18N[settings.language||'bn'] && I18N[settings.language||'bn'][key]) || I18N.bn[key] || key;


const getDeptColor = id => DEPARTMENTS.find(d=>d.id===id)?.color||"#888";
const getDeptName = id => DEPARTMENTS.find(d=>d.id===id)?.name||id;
const getUser = id => MOCK_USERS.find(u=>u.id===id);
const unreadNotifCount = () => notificationsList.filter(n=>!n.read).length;

