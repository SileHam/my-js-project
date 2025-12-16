// auth.js
function initUsers(){
  if (!localStorage.getItem('ecom_users')) initApp(); // ensure data created by initApp
}
function login(email, password){
  const users = getAll('users');
  const u = users.find(x=>x.email === email && x.password === password);
  if (u) {
    const session = { id: u.id, name: u.name, role: u.role };
    localStorage.setItem('ecom_session', JSON.stringify(session));
    return { ok:true, user: session };
  }
  return { ok:false, message: 'Email ou mot de passe invalide' };
}
function logout(){
  localStorage.removeItem('ecom_session');
  window.location.href = 'index.html';
}
function getSession(){ return JSON.parse(localStorage.getItem('ecom_session') || 'null'); }
function requireAuth(){
  const s = getSession();
  if (!s) window.location.href = 'index.html';
}
