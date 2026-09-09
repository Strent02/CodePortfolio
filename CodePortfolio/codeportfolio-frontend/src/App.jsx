import { useState, useEffect, useCallback } from 'react';
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 26 }}>
      {/* Emblema en latón */}
      <div style={{ position: 'relative' }}>
        <div className="brand-mark" style={{ width: 62, height: 62, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 600, color: '#fffaf2', animation: 'pulse-glow 3.2s ease-in-out infinite' }}>
          &lt;/&gt;
        </div>
        {/* Anillo giratorio */}
        <div style={{ position: 'absolute', inset: -10, border: '1.5px solid rgba(31,28,24,0.07)', borderTopColor: 'var(--accent)', borderRadius: 30, animation: 'spin 1.1s linear infinite' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Cargando<span style={{ color: 'var(--accent)' }}>{'...'.slice(0, dot + 1)}</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 8 }}>
          CodePortfolio · v1.0
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
      background: 'rgba(253,251,248,0.92)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(31,28,24,0.08)',
      zIndex: 90, alignItems: 'center', justifyContent: 'space-around',
      height: 64, paddingBottom: 'env(safe-area-inset-bottom, 0)',
      boxShadow: '0 -8px 32px rgba(58,49,38,0.08)',
    }} className="mobile-nav">
      {items.map(item => {
        const active = page === item.id;
        return (
          <button key={item.id} onClick={() => navigate(item.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: active ? 'rgba(138,111,71,0.12)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              flex: 1, position: 'relative',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(31,28,24,0.035)'; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}>
            <div style={{
              width: 26, height: 26, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'rgba(138,111,71,0.15)' : 'transparent',
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
              <div style={{ position: 'absolute', top: 6, right: 12, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 2px rgba(194,168,124,0.35)' }} />
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
  const initialRoute = window.location.hash.replace(/^#\/?/, '') || 'feed';
  const [page, setPage] = useState(initialRoute.split('/')[0]);
  const [profileUserId, setProfileUserId] = useState(initialRoute.split('/')[1] || null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('cp:sidebar-collapsed') === '1'; }
    catch { return false; }
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('cp:sidebar-collapsed', next ? '1' : '0'); }
      catch { /* almacenamiento no disponible: la preferencia dura la sesión */ }
      return next;
    });
  }, []);

  const navigate = useCallback((target, param) => {
    if (target === 'logout') { logout(); window.location.hash = '/feed'; return; }
    if (target === 'profile') {
      if (!param && !user) { setPage('login'); return; }
      setProfileUserId(param || user?.userId);
    }
    setPage(target);
    window.location.hash = `/${target}${target === 'profile' && param ? `/${param}` : ''}`;
    window.scrollTo(0, 0);
  }, [logout, user]);

  useEffect(() => {
    function onRouteChange() {
      const route = window.location.hash.replace(/^#\/?/, '') || 'feed';
      const [nextPage, parameter] = route.split('/');
      setPage(nextPage);
      if (nextPage === 'profile') setProfileUserId(parameter || null);
    }
    window.addEventListener('hashchange', onRouteChange);
    return () => window.removeEventListener('hashchange', onRouteChange);
  }, []);

  useEffect(() => {
    function onSessionExpired() { logout(); window.location.hash = '/login'; }
    window.addEventListener('cp:session-expired', onSessionExpired);
    return () => window.removeEventListener('cp:session-expired', onSessionExpired);
  }, [logout]);

  if (loading) return <AppLoader />;

  const isAuth = page === 'login' || page === 'register';
  if (isAuth) {
    return page === 'login'
      ? <LoginPage onNavigate={navigate} />
      : <RegisterPage onNavigate={navigate} />;
  }

  return (
    <div className="app-layout" style={{ '--sidebar-w': sidebarCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w-expanded)' }}>
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
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
