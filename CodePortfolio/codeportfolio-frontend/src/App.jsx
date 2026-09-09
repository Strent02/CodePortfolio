import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/UI';
import { Sidebar } from './components/UI';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { FeedPage } from './pages/FeedPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { JobsPage, SearchPage, NotificationsPage, SettingsPage } from './pages/OtherPages';

/* ─── App loader ─────────────────────────────────────────────────────────── */
function AppLoader() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot(d => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-0)', flexDirection: 'column', gap: 28 }}>
      {/* Logo animado */}
      <div style={{ position: 'relative' }}>
        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontFamily: 'var(--mono)', fontWeight: 700, color: '#fff', boxShadow: '0 12px 40px rgba(108,99,255,0.5)', animation: 'pulse-glow 2s ease-in-out infinite' }}>
          &lt;/&gt;
        </div>
        {/* Anillo giratorio */}
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'var(--accent)', borderRightColor: 'rgba(108,99,255,0.3)', borderRadius: 36, animation: 'spin 1s linear infinite' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Cargando<span style={{ color: 'var(--accent)' }}>{'...'.slice(0, dot + 1)}</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          CodePortfolio v1.0
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile bottom nav ──────────────────────────────────────────────────── */
function MobileNav({ page, navigate, user }) {
  const items = [
    { id: 'feed',     label: 'Feed',   svgPath: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
    { id: 'projects', label: 'Código', svgPath: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
    { id: 'jobs',     label: 'Empleo', svgPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'search',   label: 'Buscar', svgPath: 'M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z' },
    { id: user ? 'profile' : 'login', label: user ? 'Perfil' : 'Entrar', svgPath: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z' },
  ];

  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(6,6,16,0.94)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      zIndex: 90, alignItems: 'center', justifyContent: 'space-around',
      height: 64, paddingBottom: 'env(safe-area-inset-bottom, 0)',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
    }} className="mobile-nav">
      {items.map(item => {
        const active = page === item.id;
        return (
          <button key={item.id} onClick={() => navigate(item.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: active ? 'rgba(108,99,255,0.12)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              flex: 1, position: 'relative',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}>
            <div style={{
              width: 26, height: 26, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
              transition: 'all 0.2s',
              transform: active ? 'translateY(-1px)' : 'translateY(0)',
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d={item.svgPath} />
              </svg>
            </div>
            {item.label}
            {/* Punto activo */}
            {active && (
              <div style={{ position: 'absolute', top: 6, right: 12, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px rgba(108,99,255,0.8)' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ─── App inner ──────────────────────────────────────────────────────────── */
function AppInner() {
  const { user, logout, loading } = useAuth();
  const [page, setPage] = useState('feed');
  const [profileUserId, setProfileUserId] = useState(null);

  useEffect(() => {
    function onSessionExpired() { logout(); setPage('login'); }
    window.addEventListener('cp:session-expired', onSessionExpired);
    return () => window.removeEventListener('cp:session-expired', onSessionExpired);
  }, [logout]);

  function navigate(target, param) {
    if (target === 'logout') { logout(); setPage('feed'); return; }
    if (target === 'profile') {
      if (!param && !user) { setPage('login'); return; }
      setProfileUserId(param || user?.userId);
    }
    setPage(target);
    window.scrollTo(0, 0);
  }

  if (loading) return <AppLoader />;

  const isAuth = page === 'login' || page === 'register';
  if (isAuth) {
    return page === 'login'
      ? <LoginPage onNavigate={navigate} />
      : <RegisterPage onNavigate={navigate} />;
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={page} onNavigate={navigate} />
      <main className="main-content" key={page} style={{ animation: 'fadeIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
        {page === 'feed'          && <FeedPage          onNavigate={navigate} />}
        {page === 'projects'      && <ProjectsPage      onNavigate={navigate} />}
        {page === 'my-projects'   && <MyProjectsPage    onNavigate={navigate} />}
        {page === 'profile'       && <ProfilePage       userId={profileUserId} onNavigate={navigate} />}
        {page === 'jobs'          && <JobsPage          onNavigate={navigate} />}
        {page === 'search'        && <SearchPage        onNavigate={navigate} />}
        {page === 'notifications' && <NotificationsPage onNavigate={navigate} />}
        {page === 'settings'      && <SettingsPage      onNavigate={navigate} />}
      </main>
      <MobileNav page={page} navigate={navigate} user={user} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}
