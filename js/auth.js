// ============================================================
// =================== AUTH SYSTEM ============================
// ============================================================

// Simulated registered accounts (in real app, this would be server-side)
let registeredAccounts = [
  { roll:'2024001', gmail:'student@gmail.com', pass:'Test@1234', name:'তুমি', dept:'ict', year:'২য় বর্ষ', phone:'', blood:'B+', role:'student', designation:'', status:'approved' },
  { roll:'TCH-DEMO', gmail:'teacher@gmail.com', pass:'Test@1234', name:'ড. কামরুল হাসান', dept:'ict', year:'', phone:'', blood:'A+', role:'teacher', designation:'সহকারী অধ্যাপক', status:'approved' },
  { roll:'2023099', gmail:'cr@gmail.com', pass:'Test@1234', name:'সাকিব আহমেদ', dept:'physics', year:'৩য় বর্ষ', phone:'', blood:'O+', role:'cr', designation:'', status:'approved' },
  { roll:'TCH-PEND', gmail:'pendingteacher@gmail.com', pass:'Test@1234', name:'নতুন শিক্ষক (Pending Demo)', dept:'math', year:'', phone:'', blood:'B-', role:'teacher', designation:'', status:'pending' },
];
let currentAccount = null;


let currentOtp = '';
let otpTimer = null;
let otpSeconds = 120;
let fpOtp = '';
let fpTimer = null;
let fpSeconds = 120;
let regFormData = {};
let passStrengthScore = 0;
let passStrengthScore2 = 0;

// --- Toggle year/roll fields when role = teacher (teachers have no year/roll) ---
function onRegRoleChange() {
  const role = document.getElementById('regRole').value;
  const isTeacherRole = role === 'teacher';
  document.getElementById('regYearField').classList.toggle('hidden', isTeacherRole);
  document.getElementById('regRollField').classList.toggle('hidden', isTeacherRole);
  const noteEl = document.getElementById('regRoleNote');
  if(noteEl){
    if(role === 'teacher') noteEl.textContent = '⚠️ শিক্ষক অ্যাকাউন্ট রেজিস্ট্রেশনের পর Admin Approval দরকার হবে।';
    else if(role === 'cr') noteEl.textContent = '⚠️ CR অ্যাকাউন্ট রেজিস্ট্রেশনের পর Admin Approval দরকার হবে।';
    else noteEl.textContent = '';
  }
}

// --- Show / hide auth tabs ---
function showAuthTab(tab) {
  document.getElementById('loginSection').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerSection').classList.toggle('hidden', tab !== 'register');
  document.getElementById('authScroll').scrollTop = 0;
  if(tab === 'register') {
    showRegStep(1);
    const roleSel = document.getElementById('regRole');
    if(roleSel){ roleSel.value = 'student'; onRegRoleChange(); }
  }
}

// --- Toggle password visibility ---
function togglePassVis(id, btn) {
  const inp = document.getElementById(id);
  if(inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁️'; }
}

// --- Password strength checker ---
function checkPassStrength(val) {
  const segs = ['ps1','ps2','ps3','ps4'];
  let score = 0;
  if(val.length >= 8) score++;
  if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  passStrengthScore = score;
  const colors = ['','weak','medium','medium','strong'];
  const labels = ['','দুর্বল 😟','মোটামুটি 😐','মোটামুটি 😐','শক্তিশালী ✅'];
  const labelColors = ['','#F72585','#F4A261','#F4A261','#06D6A0'];
  segs.forEach((s,i) => {
    const el = document.getElementById(s);
    el.className = 'pass-seg' + (i < score ? (' ' + (score<=1?'weak':score<=3?'medium':'strong')) : '');
  });
  const hint = document.getElementById('passHint');
  if(score > 0) { hint.textContent = labels[score]; hint.style.color = labelColors[score]; }
  else { hint.textContent = 'অন্তত ৮ অক্ষর, বড়-ছোট হাতের, সংখ্যা ও চিহ্ন দাও'; hint.style.color = 'var(--muted2)'; }
}

function checkPassStrength2(val) {
  const segs = ['fps1','fps2','fps3','fps4'];
  let score = 0;
  if(val.length >= 8) score++;
  if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  passStrengthScore2 = score;
  segs.forEach((s,i) => {
    document.getElementById(s).className = 'pass-seg' + (i < score ? (' ' + (score<=1?'weak':score<=3?'medium':'strong')) : '');
  });
  const hint = document.getElementById('passHint2');
  const labels = ['','দুর্বল 😟','মোটামুটি 😐','মোটামুটি 😐','শক্তিশালী ✅'];
  const labelColors = ['','#F72585','#F4A261','#F4A261','#06D6A0'];
  if(score > 0) { hint.textContent = labels[score]; hint.style.color = labelColors[score]; }
  else { hint.textContent = 'অন্তত ৮ অক্ষর, বড়-ছোট হাতের, সংখ্যা ও চিহ্ন দাও'; hint.style.color = 'var(--muted2)'; }
}

// --- Validation helpers ---
function showErr(id, show) {
  const el = document.getElementById(id);
  el.classList.toggle('show', show);
  const inp = el.previousElementSibling?.querySelector('.auth-input') || el.parentElement?.querySelector('.auth-input') || el.previousElementSibling?.querySelector('.auth-select');
  if(inp) inp.classList.toggle('error', show);
}

function setInputState(inputId, state) {
  const el = document.getElementById(inputId);
  if(!el) return;
  el.classList.remove('error','success');
  if(state) el.classList.add(state);
}

function isValidGmail(email) {
  return /^[^\s@]+@gmail\.com$/i.test(email.trim());
}

// --- LOGIN ---
function doLogin() {
  const roll = document.getElementById('loginRoll').value.trim();
  const gmail = document.getElementById('loginGmail').value.trim();
  const pass = document.getElementById('loginPass').value;

  let ok = true;
  if(!roll) { showErrMsg('loginRollErr','Roll Number দাও'); ok=false; }
  else hideErr('loginRollErr');
  if(!isValidGmail(gmail)) { showErrMsg('loginGmailErr','সঠিক Gmail দাও'); ok=false; }
  else hideErr('loginGmailErr');
  if(!pass) { showErrMsg('loginPassErr','পাসওয়ার্ড দাও'); ok=false; }
  else hideErr('loginPassErr');

  if(!ok) return;

  const btn = event.currentTarget || document.querySelector('#loginSection .auth-btn');
  setBtnLoading(btn, true);
  setTimeout(() => {
    setBtnLoading(btn, false);
    // Check against registered accounts
    const acc = registeredAccounts.find(a =>
      a.roll.toLowerCase() === roll.toLowerCase() &&
      a.gmail.toLowerCase() === gmail.toLowerCase() &&
      a.pass === pass
    );
    if(acc) {
      // Block login if account is still awaiting admin approval (CR / Teacher accounts)
      if(acc.status === 'pending') {
        showErrMsg('loginPassErr','তোমার অ্যাকাউন্ট এখনো Admin Approval এর অপেক্ষায় আছে। Approve হলে লগইন করতে পারবে।');
        return;
      }
      currentAccount = acc;
      // Update ME with account info
      ME.name = acc.name; ME.dept = acc.dept; ME.year = acc.year;
      ME.phone = acc.phone || '';
      ME.roll = acc.roll || '';
      ME.role = acc.role || 'student';
      ME.designation = acc.designation || '';
      ME.accountStatus = acc.status || 'approved';
      if(acc.blood) ME.blood = acc.blood;
      const firstLetter = acc.name[0] || 'ছ';
      ME.avatar = firstLetter;
      // username link-friendly রাখতে — Supabase configured থাকলে real username, না হলে name থেকে slug
      ME.username = acc.username || (typeof slugifyName === 'function' ? slugifyName(acc.name) : ME.username);
      // Refresh header avatar
      const headerEl = document.getElementById('meAvatarHeader');
      headerEl.textContent = ME.avatar;
      headerEl.style.background = `linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`;
      document.getElementById('postBoxAvatar').textContent = ME.avatar;
      document.getElementById('postBoxAvatar').style.background = `linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`;
      // Hide auth screen
      document.getElementById('authScreen').classList.add('hidden');
      renderProfile();
      showPushBannerIfNeeded();
      // V9: iOS PWA prompt
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if(isIOS && !localStorage.getItem('dc_pwa_dismissed') && !window.matchMedia('(display-mode: standalone)').matches){
        setTimeout(()=>document.getElementById('pwaBanner')?.classList.remove('hidden'), 4000);
      }
      // V9: Welcome notification
      setTimeout(()=>{
        const welcomeMsgs = [
          `স্বাগতম ${acc.name}! আজ ICT Study Circle এ নতুন পোস্ট আছে 📚`,
          `রাফি আহমেদ তোমাকে একটি নতুন assignment এ mention করেছে 🔔`,
          `তোমার ৩টি নতুন নোটিফিকেশন আছে! দেখো 👀`
        ];
        addNotification('group', 1, welcomeMsgs[Math.floor(Math.random()*welcomeMsgs.length)]);
      }, 3000);
      showToast('স্বাগতম ' + acc.name + '! 🎉');
    } else {
      showErrMsg('loginPassErr','Roll, Gmail বা পাসওয়ার্ড ভুল আছে');
      document.getElementById('loginPass').classList.add('error');
    }
  }, 1200);
}

function showErrMsg(id, msg) {
  const el = document.getElementById(id);
  if(msg) el.textContent = msg;
  el.classList.add('show');
}
function hideErr(id) {
  document.getElementById(id).classList.remove('show');
}

function setBtnLoading(btn, loading) {
  if(!btn) return;
  btn.disabled = loading;
  btn.classList.toggle('loading', loading);
}

// --- REGISTER STEP NAVIGATION ---
function showRegStep(step) {
  document.getElementById('regStep1').classList.toggle('hidden', step !== 1);
  document.getElementById('regStep2').classList.toggle('hidden', step !== 2);
  document.getElementById('regStep3').classList.toggle('hidden', step !== 3);
  // Step dots
  ['sdot1','sdot2','sdot3'].forEach((id,i) => {
    const el = document.getElementById(id);
    el.className = 'step-dot' + (i+1 < step ? ' done' : i+1 === step ? ' active' : '');
  });
  ['sline1','sline2'].forEach((id,i) => {
    document.getElementById(id).className = 'step-line' + (i+1 < step ? ' done' : '');
  });
  const labels = ['ধাপ ১ of ৩ — ব্যক্তিগত তথ্য','ধাপ ২ of ৩ — পাসওয়ার্ড ও ID','ধাপ ৩ of ৩ — Gmail যাচাই'];
  document.getElementById('regStepLabel').textContent = labels[step-1];
  // Scroll to top
  document.getElementById('registerSection').scrollTop = 0;
  const authScrollEl = document.getElementById('authScroll');
  if(authScrollEl) authScrollEl.scrollTop = 0;
}

// --- REGISTER STEP 1 VALIDATE ---
function regStep1Next() {
  const name = document.getElementById('regName').value.trim();
  const gmail = document.getElementById('regGmail').value.trim();
  const role = document.getElementById('regRole').value || 'student';
  const dept = document.getElementById('regDept').value;
  const year = document.getElementById('regYear').value;
  const roll = document.getElementById('regRoll').value.trim();
  const blood = document.getElementById('regBlood').value;
  const isTeacherRole = role === 'teacher';
  let ok = true;

  if(name.length < 3) { showErrMsg('regNameErr','নাম দাও (অন্তত ৩ অক্ষর)'); ok=false; } else hideErr('regNameErr');
  if(!isValidGmail(gmail)) { showErrMsg('regGmailErr','সঠিক Gmail দাও (@gmail.com)'); ok=false; } else hideErr('regGmailErr');
  if(!dept) { showErrMsg('regDeptErr','ডিপার্টমেন্ট বেছে নাও'); ok=false; } else hideErr('regDeptErr');
  if(!isTeacherRole && !year) { showErrMsg('regYearErr','বর্ষ বেছে নাও'); ok=false; } else hideErr('regYearErr');
  if(!isTeacherRole && !roll) { showErrMsg('regRollErr','Roll Number দাও'); ok=false; } else hideErr('regRollErr');
  if(!blood) { showErrMsg('regBloodErr','ব্লাড গ্রুপ বেছে নাও'); ok=false; } else hideErr('regBloodErr');

  if(!ok) return;

  // Check duplicate roll (only relevant for student/CR who have a roll)
  if(roll && registeredAccounts.find(a => a.roll === roll)) {
    showErrMsg('regRollErr','এই Roll Number দিয়ে আগেই অ্যাকাউন্ট আছে!'); return;
  }
  if(registeredAccounts.find(a => a.gmail.toLowerCase() === gmail.toLowerCase())) {
    showErrMsg('regGmailErr','এই Gmail দিয়ে আগেই অ্যাকাউন্ট আছে!'); return;
  }

  // Teachers don't have a year/roll — generate a unique placeholder roll so login still works
  const finalRoll = isTeacherRole ? ('TCH-' + Date.now().toString().slice(-7)) : roll;

  regFormData = { name, gmail, role, dept, year: isTeacherRole ? '' : year, roll: finalRoll, blood, phone: document.getElementById('regPhone').value.trim() };
  showRegStep(2);
}

// --- ID Card preview ---
function previewIdCard(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('idCardImg').src = ev.target.result;
    document.getElementById('idCardPreview').style.display = 'block';
    regFormData.idCard = ev.target.result;
    hideErr('regIdErr');
  };
  reader.readAsDataURL(file);
}

// --- REGISTER STEP 2 VALIDATE ---
function regStep2Next() {
  const pass = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;
  let ok = true;

  if(passStrengthScore < 3) { showErrMsg('regPassErr','শক্তিশালী পাসওয়ার্ড দাও (৪ শর্ত পূরণ করো)'); ok=false; } else hideErr('regPassErr');
  if(pass !== pass2) { showErrMsg('regPass2Err','পাসওয়ার্ড মিলছে না'); ok=false; } else hideErr('regPass2Err');
  if(!regFormData.idCard && !document.getElementById('regIdFile').files[0]) { showErrMsg('regIdErr','ID Card এর ছবি দাও'); ok=false; } else hideErr('regIdErr');

  if(!ok) return;

  regFormData.pass = pass;
  document.getElementById('otpEmailDisplay').textContent = regFormData.gmail;

  // Generate OTP (simulated)
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('📧 OTP (demo):', currentOtp); // In real app, send via email
  showToast('কোড পাঠানো হয়েছে: ' + currentOtp + ' (Demo)');

  showRegStep(3);
  startOtpTimer();
}

// --- OTP Timer ---
function startOtpTimer() {
  otpSeconds = 120;
  clearInterval(otpTimer);
  document.getElementById('otpResendBtn').disabled = true;
  otpTimer = setInterval(() => {
    otpSeconds--;
    const m = Math.floor(otpSeconds/60), s = otpSeconds%60;
    document.getElementById('otpCountdown').textContent = m+':'+(s<10?'0':'')+s;
    if(otpSeconds <= 0) {
      clearInterval(otpTimer);
      document.getElementById('otpCountdown').textContent = '০:০০';
      document.getElementById('otpResendBtn').disabled = false;
    }
  }, 1000);
}

function resendOtp() {
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('📧 New OTP:', currentOtp);
  showToast('নতুন কোড পাঠানো হয়েছে: ' + currentOtp + ' (Demo)');
  startOtpTimer();
  document.getElementById('otpResendBtn').disabled = true;
}

// --- OTP input navigation ---
function otpMove(input, nextIdx) {
  input.classList.toggle('filled', input.value.length > 0);
  if(input.value.length >= 1) {
    input.value = input.value[0];
    const row = document.getElementById('otpInputRow');
    const digits = row.querySelectorAll('.otp-digit');
    if(nextIdx < digits.length) digits[nextIdx].focus();
  }
}
function otpBack(e, input, prevIdx) {
  if(e.key === 'Backspace' && !input.value) {
    const row = document.getElementById('otpInputRow');
    const digits = row.querySelectorAll('.otp-digit');
    if(prevIdx !== null) digits[prevIdx].focus();
  }
}

// --- OTP verify (register) ---
function verifyOtp() {
  const row = document.getElementById('otpInputRow');
  const digits = row.querySelectorAll('.otp-digit');
  const entered = Array.from(digits).map(d=>d.value).join('');

  if(entered.length < 6) { showErrMsg('regOtpErr','৬টি সংখ্যা দাও'); return; }

  const btn = event.currentTarget;
  setBtnLoading(btn, true);
  setTimeout(() => {
    setBtnLoading(btn, false);
    if(entered === currentOtp) {
      // Register account — CR/Teacher accounts go in as "pending" until admin approves
      const role = regFormData.role || 'student';
      const status = (role === 'cr' || role === 'teacher') ? 'pending' : 'approved';
      registeredAccounts.push({ ...regFormData, designation:'', status });
      clearInterval(otpTimer);

      // Supabase configured থাকলে background-এ real account ও বানিয়ে রাখে (real id + unique username)
      if(typeof SUPABASE_CONFIGURED !== 'undefined' && SUPABASE_CONFIGURED && typeof supabaseSignUp === 'function'){
        supabaseSignUp({
          email: regFormData.gmail, password: regFormData.pass, name: regFormData.name,
          dept: regFormData.dept, year: regFormData.year, roll: regFormData.roll,
          blood: regFormData.blood, role, designation: ''
        }).then(profile => {
          if(profile){ ME.id = profile.id; ME.username = profile.username; }
        });
      }

      if(status === 'pending') {
        // Don't auto-login — show pending-approval screen and send back to login tab
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('pendingApprovalScreen')?.classList.remove('hidden');
        showToast('অ্যাকাউন্ট তৈরি হয়েছে! Admin Approval এর পর লগইন করতে পারবে ⏳');
        return;
      }

      // Auto-login (students only)
      ME.name = regFormData.name; ME.dept = regFormData.dept; ME.year = regFormData.year;
      ME.phone = regFormData.phone || '';
      ME.roll = regFormData.roll || '';
      ME.blood = regFormData.blood || '';
      ME.role = role; ME.designation = ''; ME.accountStatus = 'approved';
      ME.avatar = regFormData.name[0] || 'ছ';
      ME.username = typeof slugifyName === 'function' ? slugifyName(regFormData.name) : ME.username;
      const headerEl = document.getElementById('meAvatarHeader');
      headerEl.textContent = ME.avatar;
      headerEl.style.background = `linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`;
      document.getElementById('postBoxAvatar').textContent = ME.avatar;
      document.getElementById('postBoxAvatar').style.background = `linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`;
      document.getElementById('authScreen').classList.add('hidden');
      renderProfile();
      showToast('অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম ' + ME.name + ' 🎉');
    } else {
      hideErr('regOtpErr');
      showErrMsg('regOtpErr','ভুল কোড! আবার চেষ্টা করো');
      digits.forEach(d => { d.classList.add('error'); setTimeout(()=>d.classList.remove('error'),600); });
      digits.forEach(d => d.value='');
      digits[0].focus();
    }
  }, 900);
}

// --- FORGOT PASSWORD ---
function showForgotPass() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('forgotScreen').classList.remove('hidden');
  ['forgotStep2','forgotStep3','forgotSuccess'].forEach(id => document.getElementById(id).classList.add('hidden'));
  document.getElementById('forgotStep1').classList.remove('hidden');
  document.getElementById('fpGmail').value='';
  document.getElementById('fpRoll').value='';
  const fs = document.getElementById('forgotScroll');
  if(fs) fs.scrollTop = 0;
}

function backToLogin() {
  document.getElementById('forgotScreen').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  showAuthTab('login');
}

function backToLoginFromPending() {
  document.getElementById('pendingApprovalScreen')?.classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  showAuthTab('login');
}

function fpSendOtp() {
  const gmail = document.getElementById('fpGmail').value.trim();
  const roll = document.getElementById('fpRoll').value.trim();
  let ok = true;
  if(!isValidGmail(gmail)) { showErrMsg('fpGmailErr','সঠিক Gmail দাও'); ok=false; } else hideErr('fpGmailErr');
  if(!roll) { showErrMsg('fpRollErr','Roll Number দাও'); ok=false; } else hideErr('fpRollErr');
  if(!ok) return;

  const acc = registeredAccounts.find(a => a.roll === roll && a.gmail.toLowerCase() === gmail.toLowerCase());
  const btn = event.currentTarget;
  setBtnLoading(btn, true);
  setTimeout(() => {
    setBtnLoading(btn, false);
    if(!acc) {
      showErrMsg('fpRollErr','এই Roll ও Gmail দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি');
      return;
    }
    fpOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔑 FP OTP:', fpOtp);
    showToast('রিসেট কোড: ' + fpOtp + ' (Demo)');
    document.getElementById('fpEmailDisplay').textContent = gmail;
    document.getElementById('forgotStep1').classList.add('hidden');
    document.getElementById('forgotStep2').classList.remove('hidden');
    startFpTimer();
    // Store for step 3
    fpOtp._gmail = gmail; fpOtp._roll = roll;
    window._fpGmail = gmail; window._fpRoll = roll;
  }, 1000);
}

function startFpTimer() {
  fpSeconds = 120;
  clearInterval(fpTimer);
  document.getElementById('fpResendBtn').disabled = true;
  fpTimer = setInterval(() => {
    fpSeconds--;
    const m = Math.floor(fpSeconds/60), s = fpSeconds%60;
    document.getElementById('fpCountdown').textContent = m+':'+(s<10?'0':'')+s;
    if(fpSeconds <= 0) {
      clearInterval(fpTimer);
      document.getElementById('fpCountdown').textContent = '০:০০';
      document.getElementById('fpResendBtn').disabled = false;
    }
  }, 1000);
}

function fpResendOtp() {
  fpOtp = Math.floor(100000 + Math.random() * 900000).toString();
  showToast('নতুন কোড: ' + fpOtp + ' (Demo)');
  startFpTimer();
  document.getElementById('fpResendBtn').disabled = true;
}

function fpOtpMove(input, nextIdx) {
  input.classList.toggle('filled', input.value.length > 0);
  if(input.value.length >= 1) {
    input.value = input.value[0];
    const digits = document.getElementById('fpOtpRow').querySelectorAll('.otp-digit');
    if(nextIdx < digits.length) digits[nextIdx].focus();
  }
}
function fpOtpBack(e, input, prevIdx) {
  if(e.key === 'Backspace' && !input.value) {
    const digits = document.getElementById('fpOtpRow').querySelectorAll('.otp-digit');
    if(prevIdx !== null) digits[prevIdx].focus();
  }
}

function fpVerifyOtp() {
  const digits = document.getElementById('fpOtpRow').querySelectorAll('.otp-digit');
  const entered = Array.from(digits).map(d=>d.value).join('');
  if(entered.length < 6) { showErrMsg('fpOtpErr','৬টি সংখ্যা দাও'); return; }
  const btn = event.currentTarget;
  setBtnLoading(btn, true);
  setTimeout(() => {
    setBtnLoading(btn, false);
    if(entered === fpOtp) {
      document.getElementById('forgotStep2').classList.add('hidden');
      document.getElementById('forgotStep3').classList.remove('hidden');
      clearInterval(fpTimer);
    } else {
      showErrMsg('fpOtpErr','ভুল কোড! আবার চেষ্টা করো');
      digits.forEach(d => { d.value=''; });
      digits[0].focus();
    }
  }, 800);
}

function fpSavePass() {
  const pass = document.getElementById('fpNewPass').value;
  const pass2 = document.getElementById('fpNewPass2').value;
  let ok = true;
  if(passStrengthScore2 < 3) { showErrMsg('fpPassErr','শক্তিশালী পাসওয়ার্ড দাও'); ok=false; } else hideErr('fpPassErr');
  if(pass !== pass2) { showErrMsg('fpPass2Err','পাসওয়ার্ড মিলছে না'); ok=false; } else hideErr('fpPass2Err');
  if(!ok) return;
  const btn = event.currentTarget;
  setBtnLoading(btn, true);
  setTimeout(() => {
    setBtnLoading(btn, false);
    // Update password
    const acc = registeredAccounts.find(a => a.gmail.toLowerCase() === (window._fpGmail||'').toLowerCase() && a.roll === window._fpRoll);
    if(acc) acc.pass = pass;
    document.getElementById('forgotStep3').classList.add('hidden');
    document.getElementById('forgotSuccess').classList.remove('hidden');
  }, 1000);
}

// ============================================================
// =================== INIT WITH AUTH ========================
// ============================================================
// Show auth screen on load
window.addEventListener('load', () => {
  loadAppData();
  initPWA();
  document.getElementById('authScreen').classList.remove('hidden');
  showAuthTab('login');
  initFloatingDots();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>{
    if(settings.themeMode==='auto') applyTheme();
  });
});

// ===== MODALS =====
function openInfoModal(title,bodyHtml){
  document.getElementById('infoModalTitle').textContent=title;
  document.getElementById('infoModalBody').innerHTML=bodyHtml;
  document.getElementById('infoModal').classList.remove('hidden');
}
function closeInfoModal(){ document.getElementById('infoModal').classList.add('hidden'); }

function openEditProfile(){
  document.getElementById('editName').value=ME.name;
  document.getElementById('editBio').value=ME.bio||'';
  document.getElementById('editBlood').value=ME.blood||'';
  document.getElementById('editPhone').value=ME.phone||'';
  document.getElementById('editBirthday').value=ME.birthday||'';
  document.getElementById('editYear').value=ME.year;
  document.getElementById('editYearGroup').classList.toggle('hidden', isTeacher());
  document.getElementById('editFacebook').value=ME.facebook||'';
  document.getElementById('editInstagram').value=ME.instagram||'';
  const deptSel=document.getElementById('editDept');
  deptSel.innerHTML=DEPARTMENTS.map(d=>`<option value="${d.id}" ${d.id===ME.dept?'selected':''}>${d.name}</option>`).join('');
  // preview avatar
  const preview=document.getElementById('editAvatarPreview');
  if(ME.profileImg){ preview.innerHTML=`<img src="${ME.profileImg}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">`; preview.style.background='none'; }
  else { preview.textContent=ME.avatar; preview.style.background=`linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`; }
  const avatarOptions=["তু","রা","তা","না","সা","আ","মি","✨","🎓","📚"];
  document.getElementById('avatarPickRow').innerHTML=avatarOptions.map((a,i)=>{
    const color=DEPARTMENTS[i%DEPARTMENTS.length].color;
    return `<div class="avatar-pick ${a===ME.avatar?'selected':''}" data-avatar="${a}" style="background:linear-gradient(135deg,${color},${color}88);" onclick="pickAvatar(this,'${a}')">${a}</div>`;
  }).join('');
  document.getElementById('editProfileModal').classList.remove('hidden');
}

function handleProfilePhoto(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    ME.profileImg=ev.target.result;
    const preview=document.getElementById('editAvatarPreview');
    if(preview){ preview.innerHTML=`<img src="${ME.profileImg}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">`; preview.style.background='none'; }
    showToast('ছবি যোগ হয়েছে ✅ Save করো');
  };
  reader.readAsDataURL(file);
}
function pickAvatar(el,avatar){
  document.querySelectorAll('.avatar-pick').forEach(p=>p.classList.remove('selected'));
  el.classList.add('selected');
}
function closeEditProfile(){ document.getElementById('editProfileModal').classList.add('hidden'); }
function saveProfile(){
  const name=document.getElementById('editName').value.trim();
  if(!name){ showToast('নাম খালি রাখা যাবে না'); return; }
  ME.name=name; ME.dept=document.getElementById('editDept').value;
  ME.year=document.getElementById('editYear').value; ME.bio=document.getElementById('editBio').value.trim();
  ME.blood=document.getElementById('editBlood').value; ME.phone=document.getElementById('editPhone').value.trim();
  ME.birthday=document.getElementById('editBirthday').value;
  ME.facebook=document.getElementById('editFacebook').value.trim();
  ME.instagram=document.getElementById('editInstagram').value.trim();
  const pickedEl=document.querySelector('.avatar-pick.selected');
  if(pickedEl) ME.avatar=pickedEl.dataset.avatar;
  // Update header avatar
  const headerAvEl=document.getElementById('meAvatarHeader');
  if(ME.profileImg){ headerAvEl.innerHTML=`<img src="${ME.profileImg}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`; headerAvEl.style.background='none'; }
  else { headerAvEl.textContent=ME.avatar; headerAvEl.style.background=`linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`; }
  // Update post box avatar
  const pbAvEl=document.getElementById('postBoxAvatar');
  if(ME.profileImg){ pbAvEl.innerHTML=`<img src="${ME.profileImg}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;">`; pbAvEl.style.background='none'; }
  else { pbAvEl.textContent=ME.avatar; pbAvEl.style.background=`linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`; }
  closeEditProfile(); renderProfile(); renderPosts(); showToast('প্রোফাইল আপডেট হয়েছে ✅');
  checkBirthdays();
}

