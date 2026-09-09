import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

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
    'briefcase-alt': <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
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
            background: 'rgba(14,14,26,0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${t.type === 'success' ? 'rgba(0,229,176,0.3)' : 'rgba(255,77,109,0.3)'}`,
            color: t.type === 'success' ? '#00e5b0' : 'var(--red)',
            fontSize: 13, fontWeight: 600,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 24px ${t.type === 'success' ? 'rgba(0,229,176,0.12)' : 'rgba(255,77,109,0.12)'}`,
            animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
            maxWidth: 380, pointerEvents: 'auto',
            animationDelay: `${i * 0.05}s`,
          }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.type === 'success' ? 'rgba(0,229,176,0.15)' : 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
  const palettes = [
    ['#6c63ff','#5a52e8'], ['#00e5b0','#00b8a9'], ['#ff4d6d','#e03a5a'],
    ['#ffc947','#e8a820'], ['#4fc3f7','#2196f3'], ['#ff6b9d','#e8519a'],
  ];
  const [c1, c2] = palettes[(name.charCodeAt(0) || 0) % palettes.length];
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: src ? 'transparent' : `linear-gradient(135deg, ${c1}22, ${c2}15)`,
      border: `1.5px solid ${c1}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: c1,
      overflow: 'hidden', flexShrink: 0,
      transition: noHover ? 'none' : 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
      ...style,
    }}
    onMouseEnter={noHover ? undefined : e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = `0 4px 14px ${c1}44`; }}
    onMouseLeave={noHover ? undefined : e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
        : initials
      }
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
export function Sidebar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const [logoutHov, setLogoutHov] = useState(false);
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

  function NavItem({ item }) {
    const active = currentPage === item.id;
    const [hov, setHov] = useState(false);

    return (
      <button
        onClick={() => onNavigate(item.id)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 11,
          width: '100%', padding: '9px 12px', borderRadius: 12,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          background: active ? 'rgba(108,99,255,0.12)' : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
          color: active ? 'var(--accent)' : hov ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: 2, position: 'relative', overflow: 'hidden',
          fontFamily: 'var(--sans)',
        }}>
        {/* Active indicator */}
        {active && (
          <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: '0 3px 3px 0', background: 'linear-gradient(to bottom, var(--accent), var(--accent-2))', boxShadow: '0 0 8px rgba(108,99,255,0.6)' }} />
        )}
        {/* Icon wrapper */}
        <div style={{
          width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          background: active ? 'rgba(108,99,255,0.15)' : hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${active ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
          transition: 'all 0.2s',
          color: active ? 'var(--accent)' : hov ? 'var(--text-primary)' : 'var(--text-muted)',
          transform: hov && !active ? 'scale(1.05)' : 'scale(1)',
          boxShadow: active ? '0 4px 12px rgba(108,99,255,0.25)' : 'none',
        }}>
          <Icon name={item.icon} size={15} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, lineHeight: 1.2 }}>{item.label}</div>
        </div>
        {/* Active dot */}
        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px rgba(108,99,255,0.8)', flexShrink: 0 }} />}
      </button>
    );
  }

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'rgba(8,8,18,0.92)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      position: 'fixed', top: 0, left: 0, bottom: 0,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', zIndex: 100,
      boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }} onClick={() => onNavigate('feed')}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: '#fff',
            boxShadow: '0 6px 20px rgba(108,99,255,0.45)',
            flexShrink: 0,
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}>
            &lt;/&gt;
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)', letterSpacing: '0.01em' }}>CodePortfolio</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 1 }}>v1.0 · dev network</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        {/* Explorar */}
        <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 12px 8px', opacity: 0.7 }}>
          Explorar
        </div>
        {explore.map(item => <NavItem key={item.id} item={item} />)}

        {/* Cuenta */}
        {account.length > 0 && (
          <>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '14px 4px' }} />
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '4px 12px 8px', opacity: 0.7 }}>
              Mi cuenta
            </div>
            {account.map(item => <NavItem key={item.id} item={item} />)}
          </>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s', cursor: 'pointer' }}
            onClick={() => onNavigate('profile')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
            <Avatar name={displayName} size={34} noHover />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 1 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 5px rgba(0,229,176,0.5)', marginRight: 5, verticalAlign: 'middle' }} />
                en línea
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); logout(); }}
              onMouseEnter={() => setLogoutHov(true)}
              onMouseLeave={() => setLogoutHov(false)}
              title="Cerrar sesión"
              style={{ width: 30, height: 30, borderRadius: 8, background: logoutHov ? 'rgba(255,77,109,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${logoutHov ? 'rgba(255,77,109,0.25)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: logoutHov ? 'var(--red)' : 'var(--text-muted)', transition: 'all 0.2s', flexShrink: 0 }}>
              <Icon name="logout" size={13} />
            </button>
          </div>
        ) : (
          <button onClick={() => onNavigate('login')}
            style={{ width: '100%', padding: '11px 16px', borderRadius: 14, background: 'linear-gradient(135deg, var(--accent), #5a52e8)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.4)'; }}>
            <Icon name="sparkle" size={14} /> Iniciar sesión
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, animation: 'fadeIn 0.18s ease' }}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border-bright)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.1)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
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
        <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}>Cancelar</button>
        <button onClick={onConfirm} style={{ padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#ff4d6d,#e03a5a)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 4px 14px rgba(255,77,109,0.35)' }}>Confirmar</button>
      </div>
    </Modal>
  );
}
