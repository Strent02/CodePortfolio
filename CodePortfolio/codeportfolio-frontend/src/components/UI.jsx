import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../api/config';

/* ─── SVG Icon ───────────────────────────────────────────────────────────── */
export function Icon({ name, size = 16 }) {
  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    'heart-fill': <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>,
    'message-circle': <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    feed: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    'user-plus': <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>,
    'user-check': <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    sparkle: <><path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.916a2 2 0 00-1.272 1.272L12 21l-1.912-5.812a2 2 0 00-1.272-1.272L3 12l5.816-1.916a2 2 0 001.272-1.272L12 3z"/></>,
    'map-pin': <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>,
    'chevron-left':  <polyline points="15 18 9 12 15 6"/>,
    folder:    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
    globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    star:      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    users:     <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    layers:    <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    compass:   <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    terminal:  <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    key:       <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    'alert-triangle': <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    building:  <><path d="M3 21h18"/><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2"/><path d="M10 21v-4h4v4"/></>,
    'briefcase-alt': <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
}

/* ─── Estado de un proyecto, en el idioma de la interfaz ─────────────────── */
const ESTADOS = { published: 'Publicado', draft: 'Borrador', archived: 'Archivado' };
export function estadoLabel(status) {
  return ESTADOS[status] || status || '';
}

/* ─── Ruta absoluta de una imagen servida por el backend ─────────────────── */
export function mediaUrl(path) {
  if (!path) return null;
  return /^(https?:|data:)/.test(path) ? path : `${API_BASE}${path}`;
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(msg, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, visible: true }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3600);
  }

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none' }}>
        {toasts.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 14,
            background: 'rgba(255,253,250,0.96)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${t.type === 'success' ? 'rgba(63,125,94,0.3)' : 'rgba(168,67,63,0.3)'}`,
            color: t.type === 'success' ? '#3f7d5e' : 'var(--red)',
            fontSize: 13, fontWeight: 600,
            boxShadow: `0 20px 60px rgba(58,49,38,0.12), 0 0 24px ${t.type === 'success' ? 'rgba(63,125,94,0.12)' : 'rgba(168,67,63,0.12)'}`,
            animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
            maxWidth: 380, pointerEvents: 'auto',
            animationDelay: `${i * 0.05}s`,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.type === 'success' ? 'rgba(63,125,94,0.15)' : 'rgba(168,67,63,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {t.type === 'success'
                ? <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </div>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() { return useContext(ToastCtx); }

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
export function Avatar({ name = '', src, size = 36, style = {}, noHover = false }) {
  const [falló, setFalló] = useState(false);
  const imagen = src && !falló ? src : null;
  const palettes = [
    ['#8a6f47','#6d5735'], ['#3f7d5e','#3c7a68'], ['#a8433f','#8c3532'],
    ['#b08a3e','#9c7a2e'], ['#5c7f96','#42687f'], ['#c2a87c','#a8875e'],
  ];
  const [c1, c2] = palettes[(name.charCodeAt(0) || 0) % palettes.length];
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: imagen ? 'transparent' : `linear-gradient(140deg, ${c1}26, ${c2}14)`,
      border: `1px solid ${c1}3a`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: c1,
      overflow: 'hidden', flexShrink: 0,
      transition: noHover ? 'none' : 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
      ...style,
    }}
    onMouseEnter={noHover ? undefined : e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = `0 6px 18px ${c1}33`; }}
    onMouseLeave={noHover ? undefined : e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {imagen
        ? <img src={imagen} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setFalló(true)} />
        : initials
      }
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
export function Sidebar({ currentPage, onNavigate, collapsed = false, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const [logoutHov, setLogoutHov] = useState(false);
  const [toggleHov, setToggleHov] = useState(false);
  const displayName = user?.fullName || user?.role || 'Usuario';

  const explore = [
    { id: 'feed',     label: 'Feed',      icon: 'feed',      desc: 'Proyectos recientes' },
    { id: 'projects', label: 'Proyectos', icon: 'grid',      desc: 'Explorar código' },
    { id: 'jobs',     label: 'Empleos',   icon: 'briefcase', desc: 'Oportunidades' },
    { id: 'search',   label: 'Buscar',    icon: 'search',    desc: 'Buscar todo' },
  ];

  const account = user ? [
    { id: 'profile',       label: 'Mi perfil',      icon: 'user',     desc: 'Ver tu perfil' },
    { id: 'my-projects',   label: 'Mis proyectos',  icon: 'code',     desc: 'Gestionar' },
    { id: 'notifications', label: 'Notificaciones', icon: 'bell',     desc: 'Actividad' },
    { id: 'settings',      label: 'Configuración',  icon: 'settings', desc: 'Cuenta' },
  ] : [];

  /* Lo que se pliega: el rótulo se desvanece y cede su ancho */
  const foldStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    opacity: collapsed ? 0 : 1,
    maxWidth: collapsed ? 0 : 200,
    transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
    transition: 'opacity 0.2s ease, max-width 0.32s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)',
  };

  function NavItem({ item }) {
    const active = currentPage === item.id;
    const [hov, setHov] = useState(false);

    return (
      <button
        onClick={() => onNavigate(item.id)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        style={{
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12,
          width: '100%', padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 12,
          justifyContent: collapsed ? 'center' : 'flex-start',
          border: '1px solid transparent', cursor: 'pointer', textAlign: 'left',
          background: active
            ? 'linear-gradient(90deg, rgba(138,111,71,0.11), rgba(194,168,124,0.05))'
            : hov ? 'rgba(31,28,24,0.035)' : 'transparent',
          borderColor: active ? 'rgba(138,111,71,0.20)' : 'transparent',
          color: active ? 'var(--accent-deep)' : hov ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'all 0.24s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: 3, position: 'relative', overflow: 'hidden',
          fontFamily: 'var(--sans)',
          transform: hov && !active && !collapsed ? 'translateX(2px)' : 'translateX(0)',
        }}>
        {/* Veta dorada del elemento activo */}
        {active && (
          <div style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 2, borderRadius: '0 2px 2px 0', background: 'linear-gradient(to bottom, var(--accent-2), var(--accent-deep))' }} />
        )}
        <div style={{
          width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: active ? 'rgba(255,255,255,0.85)' : hov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
          border: `1px solid ${active ? 'rgba(138,111,71,0.28)' : 'rgba(31,28,24,0.07)'}`,
          boxShadow: active ? '0 2px 8px rgba(58,49,38,0.10)' : 'none',
          transition: 'all 0.24s cubic-bezier(0.16,1,0.3,1)',
          color: active ? 'var(--accent)' : hov ? 'var(--text-secondary)' : 'var(--text-muted)',
        }}>
          <Icon name={item.icon} size={15} />
        </div>
        <div style={{ ...foldStyle, flex: collapsed ? '0 0 0' : 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: active ? 600 : 450, lineHeight: 1.25, letterSpacing: '-0.005em' }}>{item.label}</div>
        </div>
        {active && !collapsed && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
      </button>
    );
  }

  /* Rótulo de sección: al plegar deja en su lugar una veta de piedra */
  function SectionLabel({ children }) {
    return collapsed
      ? <div style={{ height: 1, background: 'rgba(31,28,24,0.08)', margin: '10px 10px 12px', transition: 'all 0.24s ease' }} />
      : <div className="eyebrow" style={{ padding: '4px 12px 10px', ...foldStyle, maxWidth: 200 }}>{children}</div>;
  }

  return (
    <aside className="sidebar" style={{
      width: 'var(--sidebar-w)',
      background: 'rgba(253,251,248,0.78)',
      backdropFilter: 'blur(22px) saturate(1.15)',
      WebkitBackdropFilter: 'blur(22px) saturate(1.15)',
      position: 'fixed', top: 0, left: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', overflowX: 'hidden', zIndex: 100,
      boxShadow: '1px 0 40px rgba(58,49,38,0.06)',
      transition: 'width 0.32s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Marca */}
      <div style={{ padding: collapsed ? '22px 12px 14px' : '26px 18px 16px', borderBottom: '1px solid rgba(31,28,24,0.07)', flexShrink: 0, transition: 'padding 0.32s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }}
          onClick={() => onNavigate('feed')} title={collapsed ? 'CodePortfolio' : undefined}>
          <div className="brand-mark" style={{
            width: 38, height: 38, borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 600, color: '#fffaf2',
            flexShrink: 0,
          }}>
            &lt;/&gt;
          </div>
          <div style={{ ...foldStyle, maxWidth: collapsed ? 0 : 180 }}>
            <div className="brand-word" style={{ fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.1 }}>CodePortfolio</div>
            <div className="eyebrow" style={{ fontSize: 8.5, marginTop: 3 }}>Portafolio de código</div>
          </div>
        </div>

        {/* Plegar / desplegar */}
        <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', marginTop: 14 }}>
          <button
            onClick={onToggleCollapse}
            onMouseEnter={() => setToggleHov(true)}
            onMouseLeave={() => setToggleHov(false)}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
            style={{
              width: 28, height: 28, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: toggleHov ? 'rgba(138,111,71,0.10)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${toggleHov ? 'rgba(138,111,71,0.28)' : 'rgba(31,28,24,0.08)'}`,
              color: toggleHov ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.24s cubic-bezier(0.16,1,0.3,1)',
            }}>
            <span style={{ display: 'flex', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)' }}>
              <Icon name="chevron-left" size={14} />
            </span>
          </button>
        </div>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1, padding: collapsed ? '14px 12px' : '18px 12px', overflowY: 'auto', overflowX: 'hidden', transition: 'padding 0.32s cubic-bezier(0.16,1,0.3,1)' }}>
        <SectionLabel>Explorar</SectionLabel>
        {explore.map(item => <NavItem key={item.id} item={item} />)}

        {account.length > 0 && (
          <>
            {!collapsed && <div style={{ height: 1, background: 'rgba(31,28,24,0.07)', margin: '18px 12px' }} />}
            <SectionLabel>Mi cuenta</SectionLabel>
            {account.map(item => <NavItem key={item.id} item={item} />)}
          </>
        )}
      </nav>

      {/* Pie: sesión */}
      <div style={{ padding: collapsed ? '14px 12px' : '14px 12px', borderTop: '1px solid rgba(31,28,24,0.07)', flexShrink: 0 }}>
        {user ? (
          collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div onClick={() => onNavigate('profile')} title={displayName} style={{ cursor: 'pointer' }}>
                <Avatar name={displayName} size={34} src={mediaUrl(user.avatar)} />
              </div>
              <button
                onClick={logout}
                onMouseEnter={() => setLogoutHov(true)}
                onMouseLeave={() => setLogoutHov(false)}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                style={{ width: 30, height: 30, borderRadius: 9, background: logoutHov ? 'rgba(168,67,63,0.10)' : 'rgba(31,28,24,0.035)', border: `1px solid ${logoutHov ? 'rgba(168,67,63,0.25)' : 'rgba(31,28,24,0.07)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: logoutHov ? 'var(--red)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                <Icon name="logout" size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: 14, background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(31,28,24,0.07)', boxShadow: '0 1px 2px rgba(58,49,38,0.05)', transition: 'all 0.24s cubic-bezier(0.16,1,0.3,1)', cursor: 'pointer' }}
              onClick={() => onNavigate('profile')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(138,111,71,0.28)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(58,49,38,0.09)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(31,28,24,0.07)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(58,49,38,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Avatar name={displayName} size={34} src={mediaUrl(user.avatar)} noHover />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 2, letterSpacing: '0.04em' }}>
                  <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', marginRight: 6, verticalAlign: 'middle' }} />
                  en línea
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); logout(); }}
                onMouseEnter={() => setLogoutHov(true)}
                onMouseLeave={() => setLogoutHov(false)}
                title="Cerrar sesión"
                style={{ width: 30, height: 30, borderRadius: 9, background: logoutHov ? 'rgba(168,67,63,0.10)' : 'rgba(31,28,24,0.035)', border: `1px solid ${logoutHov ? 'rgba(168,67,63,0.25)' : 'rgba(31,28,24,0.07)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: logoutHov ? 'var(--red)' : 'var(--text-muted)', transition: 'all 0.2s', flexShrink: 0 }}>
                <Icon name="logout" size={13} />
              </button>
            </div>
          )
        ) : (
          <button onClick={() => onNavigate('login')}
            title={collapsed ? 'Iniciar sesión' : undefined}
            aria-label="Iniciar sesión"
            style={{ width: '100%', padding: collapsed ? '11px 0' : '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)', border: 'none', color: '#fffaf2', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: collapsed ? 0 : 8, letterSpacing: '0.02em', boxShadow: '0 6px 18px rgba(109,87,53,0.26)', transition: 'all 0.24s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(109,87,53,0.32)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(109,87,53,0.26)'; }}>
            <Icon name="sparkle" size={14} />
            <span style={{ ...foldStyle, maxWidth: collapsed ? 0 : 140 }}>Iniciar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
}

/* ─── Modal (usado en ProfilePage aún) ──────────────────────────────────── */
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const esc = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(46,40,32,0.40)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, animation: 'fadeIn 0.18s ease' }}>
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 22, padding: 30, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: 'var(--shadow-deep)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-2), var(--accent), var(--accent-2), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 21, fontWeight: 600, margin: 0, fontFamily: 'var(--display)', letterSpacing: '-0.015em' }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'rotate(0)'; }}>
            <Icon name="x" size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Confirm ────────────────────────────────────────────────────────────── */
export function Confirm({ open, onConfirm, onCancel, message }) {
  return (
    <Modal open={open} onClose={onCancel} title="¿Confirmar acción?">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 10, background: 'rgba(31,28,24,0.045)', border: '1px solid rgba(31,28,24,0.11)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}>Cancelar</button>
        <button onClick={onConfirm} style={{ padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#a8433f,#8c3532)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 4px 14px rgba(168,67,63,0.35)' }}>Confirmar</button>
      </div>
    </Modal>
  );
}
