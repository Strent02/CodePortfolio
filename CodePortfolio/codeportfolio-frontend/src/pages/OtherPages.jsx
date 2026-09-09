import { useState, useEffect, useRef } from 'react';
import { vacancies, search as searchApi, notifications as notifApi, users as usersApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Avatar, useToast } from '../components/UI';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function Ico({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  );
}

function Spinner({ size = 18 }) {
  return <div style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite', flexShrink: 0 }} />;
}

function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{ padding: '32px 36px 0', animation: 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 5px' }}>{title}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>{subtitle}</p>
        </div>
        {right}
      </div>
    </div>
  );
}

/* ─── Apply Drawer ───────────────────────────────────────────────────────── */
function ApplyDrawer({ job, onClose, onApplied }) {
  const { user } = useAuth();
  const toast = useToast();
  const [msg, setMsg]         = useState('');
  const [sending, setSending] = useState(false);
  const [vis, setVis]         = useState(false);
  const taRef = useRef(null);

  useEffect(() => { setTimeout(() => { setVis(true); taRef.current?.focus(); }, 10); }, []);
  function close() { setVis(false); setTimeout(onClose, 320); }

  async function send() {
    setSending(true);
    try {
      await vacancies.apply(job.jobOpeningId, { coverMessage: msg });
      toast('¡Postulación enviada! ✓', 'success');
      onApplied();
      close();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSending(false); }
  }

  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.75)', backdropFilter: 'blur(6px)', zIndex: 200, opacity: vis ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 460, background: 'var(--bg-1)', borderLeft: '1px solid var(--border)', zIndex: 201, display: 'flex', flexDirection: 'column', transform: vis ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: '-20px 0 80px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <button onClick={close} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <Ico d="M18 6L6 18M6 6l12 12" size={14} />
            </button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Postular al empleo</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 1 }}>{job.title}</div>
            </div>
          </div>
        </div>

        {/* Info del empleo */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏢</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{job.companyName}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Carta de presentación <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea ref={taRef} rows={10} value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Cuéntale al reclutador por qué eres el candidato ideal para este puesto. Menciona tu experiencia relevante, tus proyectos y qué te motiva a aplicar..."
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 14, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', resize: 'vertical', lineHeight: 1.65, transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none'; }} />
          <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(0,229,176,0.06)', border: '1px solid rgba(0,229,176,0.15)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            💡 Tu perfil de CodePortfolio se incluirá automáticamente con tu postulación.
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg-2)', flexShrink: 0 }}>
          <button onClick={close} style={{ flex: '0 0 auto', height: 46, padding: '0 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
            Cancelar
          </button>
          <button onClick={send} disabled={sending} style={{ flex: 1, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--sans)', cursor: sending ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(108,99,255,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? 0.7 : 1 }}
            onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.5)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.4)'; }}>
            {sending ? <><Spinner size={16} /> Enviando...</> : <><Ico d="M22 2L11 13 M22 2L15 22 11 13 2 9 22 2" size={15} /> Enviar postulación</>}
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* ─── JOBS PAGE ──────────────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════════════════ */
export function JobsPage({ onNavigate }) {
  const { user }   = useAuth();
  const [items,    setItems]    = useState([]);
  const [myApps,   setMyApps]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('jobs');
  const [applying, setApplying] = useState(null); // job a postular
  const [hovered,  setHovered]  = useState(null);

  useEffect(() => { load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [jobs, apps] = await Promise.all([
        vacancies.getAll().catch(() => []),
        user ? vacancies.getMyApplications().catch(() => []) : Promise.resolve([]),
      ]);
      setItems(jobs || []);
      setMyApps(apps || []);
    } finally { setLoading(false); }
  }

  const contractColor = { 'full-time': '#00e5b0', 'part-time': '#ffc947', freelance: 'var(--accent)', internship: 'var(--text-secondary)' };
  const modeColor     = { remote: '#00e5b0', hybrid: '#ffc947', 'on-site': 'var(--accent)' };
  const statusStyle   = { pending: { bg: 'rgba(255,201,71,0.12)', color: '#ffc947', label: 'Pendiente' }, accepted: { bg: 'rgba(0,229,176,0.12)', color: '#00e5b0', label: 'Aceptado' }, rejected: { bg: 'rgba(255,77,109,0.12)', color: 'var(--red)', label: 'Rechazado' } };

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeader
        title="Empleos"
        subtitle={`${items.length} oportunidades disponibles`}
        right={user && (
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
            {['jobs', 'apps'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: tab === t ? 'var(--bg-4)' : 'transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--sans)', transition: 'all 0.2s', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.3)' : 'none' }}>
                {t === 'jobs' ? 'Ofertas' : `Mis postulaciones${myApps.length ? ` (${myApps.length})` : ''}`}
              </button>
            ))}
          </div>
        )}
      />

      <div style={{ padding: '0 36px 80px' }}>
        {/* ── Tab empleos ── */}
        {tab === 'jobs' && (
          loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{ height: 110, borderRadius: 18, background: 'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>💼</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Sin ofertas disponibles</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Las empresas aún no han publicado vacantes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((job, i) => (
                <div key={job.jobOpeningId}
                  onMouseEnter={() => setHovered(job.jobOpeningId)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: '20px 24px', background: 'var(--bg-1)',
                    border: `1px solid ${hovered === job.jobOpeningId ? 'rgba(0,229,176,0.3)' : 'var(--border)'}`,
                    borderRadius: 18, transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    transform: hovered === job.jobOpeningId ? 'translateX(4px)' : 'translateX(0)',
                    boxShadow: hovered === job.jobOpeningId ? '0 8px 32px rgba(0,0,0,0.3), 0 0 24px rgba(0,229,176,0.06)' : '0 2px 8px rgba(0,0,0,0.2)',
                    animation: `cardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                  {/* Barra izquierda de color */}
                  <div style={{ position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3, borderRadius: '0 3px 3px 0', background: 'linear-gradient(var(--green), var(--accent-3))', opacity: hovered === job.jobOpeningId ? 1 : 0, transition: 'opacity 0.25s' }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{job.title}</h3>
                      </div>
                      {job.companyName && (
                        <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--mono)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span>🏢</span> {job.companyName}
                        </div>
                      )}
                      {job.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {job.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {job.contractType && (
                          <span style={{ padding: '3px 11px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, background: `${contractColor[job.contractType?.toLowerCase()] || '#9090b8'}15`, color: contractColor[job.contractType?.toLowerCase()] || '#9090b8', border: `1px solid ${contractColor[job.contractType?.toLowerCase()] || '#9090b8'}30` }}>
                            {job.contractType}
                          </span>
                        )}
                        {job.workMode && (
                          <span style={{ padding: '3px 11px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, background: `${modeColor[job.workMode?.toLowerCase()] || '#9090b8'}15`, color: modeColor[job.workMode?.toLowerCase()] || '#9090b8', border: `1px solid ${modeColor[job.workMode?.toLowerCase()] || '#9090b8'}30` }}>
                            {job.workMode}
                          </span>
                        )}
                        <span style={{ padding: '3px 11px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-muted)', background: 'var(--bg-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Ico d="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" size={10} />
                          {new Date(job.publishDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Botón postular */}
                    <button
                      onClick={() => user ? setApplying(job) : onNavigate('login')}
                      style={{ padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 4px 16px rgba(108,99,255,0.35)', transition: 'all 0.2s', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,99,255,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(108,99,255,0.35)'; }}>
                      <Ico d="M22 2L11 13 M22 2L15 22 11 13 2 9 22 2" size={13} />
                      Postular
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── Tab mis postulaciones ── */}
        {tab === 'apps' && (
          myApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>📋</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Sin postulaciones aún</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Aplica a una oferta para verla aquí</p>
              <button onClick={() => setTab('jobs')} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}>Ver ofertas disponibles</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myApps.map((app, i) => {
                const st = statusStyle[app.status] || { bg: 'var(--bg-3)', color: 'var(--text-muted)', label: app.status };
                return (
                  <div key={app.applicationId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16, animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏢</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.jobTitle}</div>
                      <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--mono)', marginBottom: 3 }}>{app.companyName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                        {new Date(app.applicationDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.06em', background: st.bg, color: st.color, flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {applying && <ApplyDrawer job={applying} onClose={() => setApplying(null)} onApplied={load} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* ─── SEARCH PAGE ────────────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════════════════ */
export function SearchPage({ onNavigate }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query?.trim() || query.trim().length < 2) { setResults(null); return; }
      setLoading(true);
      try { setResults(await searchApi.all(query.trim())); }
      catch { setResults(null); }
      finally { setLoading(false); }
    }, 380);
    return () => clearTimeout(t);
  }, [query]);

  const total = results ? (results.projects?.length || 0) + (results.users?.length || 0) + (results.vacancies?.length || 0) : 0;

  function SectionTitle({ icon, label, count }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 99, background: 'var(--bg-3)', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{count}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Search hero */}
      <div style={{ padding: '40px 36px 28px', animation: 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 5px' }}>Buscar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Proyectos, desarrolladores y empleos</p>

        {/* Input */}
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: query ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
            {loading
              ? <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />
              : <Ico d="M21 21l-4.35-4.35 M17 11A6 6 0 105 11a6 6 0 0012 0z" size={18} />
            }
          </div>
          <input
            ref={inputRef}
            type="search"
            placeholder="Escribe para buscar..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', height: 52, paddingLeft: 50, paddingRight: query ? 44 : 16, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 16, color: 'var(--text-primary)', fontSize: 15, fontFamily: 'var(--sans)', outline: 'none', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 4px rgba(108,99,255,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none'; }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-3)'; }}>
              <Ico d="M18 6L6 18M6 6l12 12" size={12} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '0 36px 80px' }}>
        {/* Sin búsqueda — tips */}
        {!query && !results && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, animation: 'fadeIn 0.4s ease' }}>
            {[
              { icon: '💻', label: 'Proyectos', desc: 'Descubre código de la comunidad', color: 'var(--accent)' },
              { icon: '👥', label: 'Desarrolladores', desc: 'Conecta con otros devs', color: '#00e5b0' },
              { icon: '💼', label: 'Empleos', desc: 'Encuentra tu próximo rol', color: '#ffc947' },
            ].map((tip, i) => (
              <div key={i} style={{ padding: '22px 20px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 18, textAlign: 'center', transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', cursor: 'default', animation: `cardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tip.color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 20px ${tip.color}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{tip.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5, color: 'var(--text-primary)' }}>{tip.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Resultados */}
        {results && !loading && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {total === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 44, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>🔍</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Sin resultados para "{query}"</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Prueba con términos más generales</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{total}</span> resultado{total !== 1 ? 's' : ''} para "{query}"
                </div>

                {/* Proyectos */}
                {results.projects?.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <SectionTitle icon="💻" label="Proyectos" count={results.projects.length} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {results.projects.map((p, i) => (
                        <div key={p.projectId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'var(--bg-1)'; }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-3)', overflow: 'hidden', flexShrink: 0 }}>
                            {p.featuredImage ? <img src={`${BASE}${p.featuredImage}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(108,99,255,0.3)', fontFamily: 'var(--mono)', fontSize: 14 }}>&lt;/&gt;</div>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{p.title}</div>
                            {p.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                          </div>
                          {p.status && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 99, background: p.status === 'published' ? 'rgba(0,229,176,0.1)' : 'var(--bg-3)', color: p.status === 'published' ? '#00e5b0' : 'var(--text-muted)', flexShrink: 0 }}>{p.status}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usuarios */}
                {results.users?.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <SectionTitle icon="👥" label="Desarrolladores" count={results.users.length} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {results.users.map((u, i) => (
                        <div key={u.userId} onClick={() => onNavigate('profile', u.userId)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,176,0.3)'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'var(--bg-1)'; }}>
                          <Avatar name={u.fullName || '?'} size={40} src={u.profilePicture ? (u.profilePicture.startsWith('http') ? u.profilePicture : `${BASE}${u.profilePicture}`) : null} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{u.fullName}</div>
                            {u.bio && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.bio}</div>}
                          </div>
                          <Ico d="M9 18l6-6-6-6" size={14} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empleos */}
                {results.vacancies?.length > 0 && (
                  <div>
                    <SectionTitle icon="💼" label="Empleos" count={results.vacancies.length} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {results.vacancies.map((v, i) => (
                        <div key={v.jobOpeningId}
                          style={{ padding: '12px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14, transition: 'all 0.2s', animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,201,71,0.3)'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'var(--bg-1)'; }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{v.title}</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {v.contractType && <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--mono)', background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{v.contractType}</span>}
                            {v.workMode    && <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--mono)', background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{v.workMode}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* ─── NOTIFICATIONS PAGE ─────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════════════════ */
export function NotificationsPage({ onNavigate }) {
  const { user }   = useAuth();
  const toast      = useToast();
  const [notifs,   setNotifs]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { if (!user) { onNavigate('login'); return; } load(); }, [user]);

  async function load() {
    setLoading(true);
    try { setNotifs((await notifApi.getAll()) || []); }
    catch { setNotifs([]); }
    finally { setLoading(false); }
  }

  async function markRead(id) {
    try {
      await notifApi.markRead(id);
      setNotifs(ns => ns.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    } catch (e) { toast(e.message, 'error'); }
  }

  async function markAllRead() {
    const unread = notifs.filter(n => !n.isRead);
    await Promise.all(unread.map(n => notifApi.markRead(n.notificationId).catch(() => {})));
    setNotifs(ns => ns.map(n => ({ ...n, isRead: true })));
    toast('Todas marcadas como leídas ✓', 'success');
  }

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeader
        title="Notificaciones"
        subtitle={unread > 0 ? `${unread} sin leer` : 'Todo al día ✓'}
        right={unread > 0 && (
          <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 11, background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.2)', color: '#00e5b0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,176,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,229,176,0.08)'; }}>
            <Ico d="M20 6L9 17l-5-5" size={14} /> Marcar todas leídas
          </button>
        )}
      />

      <div style={{ padding: '0 36px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ height: 72, borderRadius: 16, background: 'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>🔔</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Sin notificaciones</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Cuando alguien interactúe con tus proyectos, aparecerá aquí</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifs.map((n, i) => (
              <div key={n.notificationId}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: n.isRead ? 'var(--bg-1)' : 'rgba(108,99,255,0.07)', border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(108,99,255,0.2)'}`, borderRadius: 16, transition: 'all 0.2s', animation: `cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both`, position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = n.isRead ? 'var(--border-bright)' : 'rgba(108,99,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = n.isRead ? 'var(--border)' : 'rgba(108,99,255,0.2)'; }}>
                {/* Dot no leído */}
                {!n.isRead && <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px rgba(108,99,255,0.6)' }} />}

                <div style={{ width: 40, height: 40, borderRadius: '50%', background: n.isRead ? 'var(--bg-3)' : 'rgba(108,99,255,0.12)', border: `1px solid ${n.isRead ? 'var(--border)' : 'rgba(108,99,255,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.isRead ? 'var(--text-muted)' : 'var(--accent)', flexShrink: 0, transition: 'all 0.2s' }}>
                  <Ico d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" size={16} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 4 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                    {new Date(n.sentDate).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {!n.isRead && (
                  <button onClick={() => markRead(n.notificationId)} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; }}>
                    Leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
/* ─── SETTINGS PAGE ──────────────────────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════════════════════ */
export function SettingsPage({ onNavigate }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [passForm,   setPassForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving,     setSaving]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePass, setDeletePass] = useState('');
  const [deleting,   setDeleting]   = useState(false);
  const [showCurr,   setShowCurr]   = useState(false);
  const [showNew,    setShowNew]    = useState(false);

  useEffect(() => { if (!user) onNavigate('login'); }, [user]);

  async function changePassword(e) {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) { toast('Las contraseñas no coinciden', 'error'); return; }
    if (passForm.newPassword.length < 6) { toast('Mínimo 6 caracteres', 'error'); return; }
    setSaving(true);
    try {
      await usersApi.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast('Contraseña actualizada ✓', 'success');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  async function deleteAccount() {
    if (!deletePass.trim()) { toast('Ingresa tu contraseña para confirmar', 'error'); return; }
    setDeleting(true);
    try {
      await usersApi.deleteAccount({ password: deletePass });
      toast('Cuenta eliminada', 'success');
      logout();
    } catch (e) { toast(e.message, 'error'); }
    finally { setDeleting(false); setDeleteOpen(false); }
  }

  const inputCss = { width: '100%', height: 48, padding: '0 44px 0 14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', transition: 'all 0.2s' };
  const onF = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; };
  const onB = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none'; };

  function SettingsCard({ title, icon, children, delay = 0 }) {
    return (
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 28px', marginBottom: 16, animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 20 }}>{icon}</div>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
        </div>
        {children}
      </div>
    );
  }

  function EyeBtn({ show, toggle }) {
    return (
      <button type="button" onClick={toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <Ico d={show ? 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22' : 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z'} size={16} />
      </button>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeader title="Configuración" subtitle="Gestiona tu cuenta y seguridad" />

      <div style={{ padding: '0 36px 80px', maxWidth: 600 }}>

        {/* Cambiar contraseña */}
        <SettingsCard title="Cambiar contraseña" icon="🔑" delay={0.05}>
          <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Contraseña actual</label>
              <div style={{ position: 'relative' }}>
                <input type={showCurr ? 'text' : 'password'} value={passForm.currentPassword} onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))} required style={inputCss} onFocus={onF} onBlur={onB} />
                <EyeBtn show={showCurr} toggle={() => setShowCurr(v => !v)} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Nueva contraseña</label>
              <div style={{ position: 'relative' }}>
                <input type={showNew ? 'text' : 'password'} value={passForm.newPassword} onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={6} style={inputCss} onFocus={onF} onBlur={onB} />
                <EyeBtn show={showNew} toggle={() => setShowNew(v => !v)} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Confirmar nueva contraseña</label>
              <div style={{ position: 'relative' }}>
                <input type="password" value={passForm.confirmPassword} onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))} required style={inputCss} onFocus={onF} onBlur={onB} />
                {passForm.confirmPassword && passForm.newPassword && (
                  <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: passForm.confirmPassword === passForm.newPassword ? 'var(--green)' : 'var(--red)' }}>
                    <Ico d={passForm.confirmPassword === passForm.newPassword ? 'M20 6L9 17l-5-5' : 'M18 6L6 18M6 6l12 12'} size={16} />
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 6px 20px rgba(108,99,255,0.35)', transition: 'all 0.2s', opacity: saving ? 0.7 : 1 }}
                onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.5)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.35)'; }}>
                {saving ? <><Spinner size={14} /> Guardando...</> : <><Ico d="M20 6L9 17l-5-5" size={14} /> Actualizar contraseña</>}
              </button>
            </div>
          </form>
        </SettingsCard>

        {/* Cerrar sesión */}
        <SettingsCard title="Sesión" icon="🔐" delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Cerrar sesión</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Deberás volver a ingresar tus credenciales la próxima vez.</div>
            </div>
            <button onClick={() => { logout(); onNavigate('feed'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s', flexShrink: 0, whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              <Ico d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
              Salir
            </button>
          </div>
        </SettingsCard>

        {/* Zona de peligro */}
        <div style={{ background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 20, padding: '24px 28px', animation: 'cardIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,77,109,0.15)' }}>
            <div style={{ fontSize: 20 }}>⚠️</div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--red)' }}>Zona de peligro</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>Eliminar cuenta</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 340 }}>Esta acción es permanente. Se eliminarán todos tus proyectos, comentarios, seguidores y datos de la plataforma.</div>
            </div>
            <button onClick={() => setDeleteOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 11, background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s', flexShrink: 0, whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.18)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}>
              <Ico d="M3 6h18 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6 M10 11v6M14 11v6 M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" size={14} />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Modal eliminar */}
      {deleteOpen && (
        <>
          <div onClick={() => { setDeleteOpen(false); setDeletePass(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.85)', backdropFilter: 'blur(8px)', zIndex: 300, animation: 'fadeIn 0.2s ease' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 301, width: '90%', maxWidth: 400, padding: '32px 28px', background: 'var(--bg-2)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 24, boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,77,109,0.1)', animation: 'scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Eliminar cuenta</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.</p>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 10, marginBottom: 16, fontSize: 12, color: 'var(--red)', lineHeight: 1.5 }}>
              ⚠️ Se eliminarán: proyectos, comentarios, likes, seguidores y toda tu actividad.
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Confirma con tu contraseña</label>
              <input type="password" placeholder="••••••••" value={deletePass} onChange={e => setDeletePass(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') deleteAccount(); }}
                style={{ width: '100%', height: 46, padding: '0 14px', background: 'rgba(255,77,109,0.06)', border: '1.5px solid rgba(255,77,109,0.2)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,77,109,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,77,109,0.2)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setDeleteOpen(false); setDeletePass(''); }} style={{ flex: 1, height: 44, borderRadius: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                Cancelar
              </button>
              <button onClick={deleteAccount} disabled={deleting || !deletePass.trim()} style={{ flex: 1, height: 44, borderRadius: 11, background: 'linear-gradient(135deg,#ff4d6d,#e03a5a)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', boxShadow: '0 6px 20px rgba(255,77,109,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: deleting || !deletePass.trim() ? 0.5 : 1 }}
                onMouseEnter={e => { if (!deleting && deletePass.trim()) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,77,109,0.5)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,77,109,0.35)'; }}>
                {deleting ? <><Spinner size={14} /> Eliminando...</> : 'Sí, eliminar todo'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
