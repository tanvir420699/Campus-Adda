// ===== INIT =====
async function initApp(){
  loadAppData();
  // Supabase configured থাকলে real users/posts নিয়ে আসে, না হলে demo data দিয়ে চলে
  if(typeof loadRealDataFromSupabase === 'function'){
    await loadRealDataFromSupabase();
  }
  renderDeptFilter();
  renderPosts();
  renderStories();
  renderStudyHub();
  updateNotifBadge();
  checkBirthdays();
  initPWA();
  // init avatar in header
  document.getElementById('meAvatarHeader').textContent=ME.avatar;
  document.getElementById('postBoxAvatar').textContent=ME.avatar;
  document.getElementById('postBoxAvatar').style.background=`linear-gradient(135deg,${getDeptColor(ME.dept)},${getDeptColor(ME.dept)}88)`;

  // Keep story expiry countdowns fresh and auto-remove stories once 24h have passed
  setInterval(renderStories, 60000);

  // Handle shareable profile/post links (?u=username&post=ID, demo fallback ?profile=ID)
  handleDeepLink();
}
initApp();

