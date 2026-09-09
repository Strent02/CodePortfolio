import { useState, useEffect, useRef } from 'react';
import { projects as projectsApi, users as usersApi } from '../api/client';
import { Avatar, useToast } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ height: 200, background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--bg-4) 50%,var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[['70%','13px'],['90%','11px'],['55%','11px']].map(([w,h],i) => (
          <div key={i} style={{ height: h, width: w, borderRadius: 6, background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--bg-4) 50%,var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i*0.1}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Chip de filtro ─────────────────────────────────────────────────────── */
function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
      border: `1.5px solid ${active ? 'rgba(108,99,255,0.5)' : 'var(--border)'}`,
      background: active ? 'rgba(108,99,255,0.12)' : 'var(--bg-2)',
      color: active ? 'var(--accent)' : 'var(--text-muted)',
      cursor: 'pointer', fontFamily: 'var(--sans)',
      transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
      whiteSpace: 'nowrap',
      boxShadow: active ? '0 0 16px rgba(108,99,255,0.15)' : 'none',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}>
      {children}
    </button>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────────── */
function ProjCard({ project, liked, onLike, onClick, index }) {
  const [hov, setHov] = useState(false);
  const [bounce, setBounce] = useState(false);
  const imgSrc = project.featuredImage ? `${BASE}${project.featuredImage}` : null;

  function handleLike(e) {
    e.stopPropagation();
    setBounce(true); setTimeout(() => setBounce(false), 380);
    onLike();
  }

  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-1)', border: `1px solid ${hov ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hov ? '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.15), 0 0 40px rgba(108,99,255,0.08)' : '0 2px 12px rgba(0,0,0,0.25)',
        animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s both`,
      }}>
      {/* Imagen */}
      <div style={{ height: 190, position: 'relative', overflow: 'hidden', background: 'var(--bg-3)', flexShrink: 0 }}>
        {imgSrc
          ? <img src={imgSrc} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.08)' : 'scale(1)' }} onError={e => e.currentTarget.style.display='none'} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--bg-3),var(--bg-4))', fontSize:38, fontFamily:'var(--mono)', color:'rgba(108,99,255,0.25)', fontWeight:300, letterSpacing:'-0.05em', transition:'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.06)':'scale(1)', userSelect:'none' }}>
              &lt;/&gt;
            </div>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, rgba(10,10,20,0.65) 100%)', pointerEvents:'none' }} />
        {/* Badge */}
        {project.status && (
          <div style={{ position:'absolute', top:10, left:10, padding:'3px 10px', borderRadius:99, fontSize:10, fontWeight:700, fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', backdropFilter:'blur(10px)', background: project.status==='published' ? 'rgba(0,229,176,0.18)' : project.status==='draft' ? 'rgba(255,201,71,0.18)' : 'rgba(144,144,184,0.18)', color: project.status==='published' ? '#00e5b0' : project.status==='draft' ? '#ffc947' : '#9090b8', border:`1px solid ${project.status==='published'?'rgba(0,229,176,0.3)':project.status==='draft'?'rgba(255,201,71,0.3)':'rgba(144,144,184,0.2)'}` }}>
            {project.status}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'14px 16px 16px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', lineHeight:1.3, letterSpacing:'-0.01em', margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {project.title}
        </h3>
        {project.description && (
          <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.55, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>
            {project.description}
          </p>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
            <Avatar name={project.authorName||'?'} size={24} />
            <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{project.authorName}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <button onClick={handleLike} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color: liked?'#ff4d6d':'var(--text-muted)', fontSize:12, fontFamily:'var(--mono)', fontWeight:600, padding:'4px 7px', borderRadius:8, transition:'all 0.18s', transform: bounce?'scale(1.4)':'scale(1)', filter: liked?'drop-shadow(0 0 5px rgba(255,77,109,0.55))':'none' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,77,109,0.1)'; e.currentTarget.style.color='#ff4d6d'; }}
              onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=liked?'#ff4d6d':'var(--text-muted)'; }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              {project.likes??0}
            </button>
            <span style={{ display:'flex', alignItems:'center', gap:5, color:'var(--text-muted)', fontSize:12, fontFamily:'var(--mono)', fontWeight:600 }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              {project.commentsCount??0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Drawer de detalle ──────────────────────────────────────────────────── */
function DetailDrawer({ project, liked, onLike, onClose, onNavigate }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);
  const imgSrc = project.featuredImage ? `${BASE}${project.featuredImage}` : null;

  function close() { setVis(false); setTimeout(onClose, 320); }

  return (
    <>
      <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(6,6,16,0.72)', backdropFilter:'blur(6px)', zIndex:200, opacity:vis?1:0, transition:'opacity 0.3s ease' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'100%', maxWidth:500, background:'var(--bg-1)', borderLeft:'1px solid var(--border)', zIndex:201, display:'flex', flexDirection:'column', transform:vis?'translateX(0)':'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow:'-20px 0 80px rgba(0,0,0,0.5)', overflowY:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, flexShrink:0, background:'var(--bg-2)' }}>
          <button onClick={close} style={{ width:34, height:34, borderRadius:'50%', background:'var(--bg-3)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)', transition:'all 0.2s', flexShrink:0 }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--red-dim)';e.currentTarget.style.borderColor='rgba(255,77,109,0.3)';e.currentTarget.style.color='var(--red)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-3)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-secondary)';}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h2 style={{ fontSize:14, fontWeight:700, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{project.title}</h2>
          <button onClick={onLike} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, border:`1.5px solid ${liked?'rgba(255,77,109,0.4)':'var(--border)'}`, background:liked?'rgba(255,77,109,0.1)':'var(--bg-3)', color:liked?'#ff4d6d':'var(--text-secondary)', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s', flexShrink:0 }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {project.likes??0}
          </button>
        </div>

        {/* Contenido */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {imgSrc && (
            <div style={{ height:220, overflow:'hidden', position:'relative' }}>
              <img src={imgSrc} alt={project.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, var(--bg-1) 100%)' }} />
            </div>
          )}
          <div style={{ padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18, cursor:'pointer' }} onClick={() => { close(); setTimeout(() => onNavigate('profile', project.userId), 350); }}>
              <Avatar name={project.authorName||'?'} size={42} />
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{project.authorName}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--mono)' }}>
                  {new Date(project.publishDate).toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})}
                </div>
              </div>
            </div>
            {project.description && <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:20 }}>{project.description}</p>}
            {(project.demoUrl || project.repositoryUrl) && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 18px', borderRadius:10, background:'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(108,99,255,0.05))', border:'1px solid rgba(108,99,255,0.25)', color:'var(--accent)', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(108,99,255,0.22)';e.currentTarget.style.transform='translateY(-1px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='linear-gradient(135deg,rgba(108,99,255,0.15),rgba(108,99,255,0.05))';e.currentTarget.style.transform='translateY(0)';}}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Ver demo
                  </a>
                )}
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 18px', borderRadius:10, background:'var(--bg-3)', border:'1px solid var(--border)', color:'var(--text-secondary)', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-bright)';e.currentTarget.style.color='var(--text-primary)';e.currentTarget.style.transform='translateY(-1px)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.transform='translateY(0)';}}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                    Repositorio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── PROJECTS PAGE ──────────────────────────────────────────────────────── */
export function ProjectsPage({ onNavigate }) {
  const { user }   = useAuth();
  const toast      = useToast();
  const [items,    setItems]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [likedSet, setLikedSet] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const searchRef  = useRef(null);

  useEffect(() => { load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [data, likedIds] = await Promise.all([
        projectsApi.getPublic(),
        user ? usersApi.getMyLikes().catch(() => []) : Promise.resolve([]),
      ]);
      setItems(data || []);
      if (likedIds?.length) setLikedSet(new Set(likedIds));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  // Filtrar en cliente
  useEffect(() => {
    let out = [...items];
    if (filter !== 'all') out = out.filter(p => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.authorName?.toLowerCase().includes(q));
    }
    setFiltered(out);
  }, [items, filter, search]);

  async function toggleLike(project) {
    if (!user) { onNavigate('login'); return; }
    const id = project.projectId;
    try {
      if (likedSet.has(id)) {
        await projectsApi.unlike(id);
        setLikedSet(s => { const n = new Set(s); n.delete(id); return n; });
        setItems(prev => prev.map(p => p.projectId === id ? { ...p, likes: Math.max(0,(p.likes||1)-1) } : p));
      } else {
        await projectsApi.like(id);
        setLikedSet(s => new Set([...s, id]));
        setItems(prev => prev.map(p => p.projectId === id ? { ...p, likes: (p.likes||0)+1 } : p));
      }
    } catch (e) { toast(e.message, 'error'); }
  }

  const filters = [
    { id: 'all',       label: `Todo (${items.length})` },
    { id: 'published', label: `Publicado (${items.filter(p=>p.status==='published').length})` },
    { id: 'draft',     label: `Borrador (${items.filter(p=>p.status==='draft').length})` },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ padding: '32px 36px 0', animation: 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24, flexWrap:'wrap' }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.03em', margin:0, marginBottom:5 }}>Proyectos</h1>
            <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Explora lo que está construyendo la comunidad</p>
          </div>
          {user && (
            <button onClick={() => onNavigate('my-projects')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,var(--accent),#5a52e8)', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 6px 24px rgba(108,99,255,0.4)', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 32px rgba(108,99,255,0.5)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 24px rgba(108,99,255,0.4)';}}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Mis proyectos
            </button>
          )}
        </div>

        {/* Buscador + filtros */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:28 }}>
          {/* Search */}
          <div style={{ position:'relative', flex:'1', minWidth:200 }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none', transition:'color 0.2s' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input ref={searchRef} type="search" placeholder="Buscar por nombre, descripción, autor..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', height:42, paddingLeft:42, paddingRight:14, background:'var(--bg-2)', border:'1.5px solid var(--border)', borderRadius:12, color:'var(--text-primary)', fontSize:13, fontFamily:'var(--sans)', outline:'none', transition:'all 0.2s' }}
              onFocus={e=>{e.target.style.borderColor='var(--accent)';e.target.style.boxShadow='0 0 0 3px rgba(108,99,255,0.12)';e.target.previousSibling.style.color='var(--accent)';}}
              onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.boxShadow='none';e.target.previousSibling.style.color='var(--text-muted)';}}
            />
          </div>
          {/* Filter chips */}
          <div style={{ display:'flex', gap:8, flexWrap:'nowrap', overflowX:'auto' }}>
            {filters.map(f => <FilterChip key={f.id} active={filter===f.id} onClick={() => setFilter(f.id)}>{f.label}</FilterChip>)}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding:'0 36px 80px' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
            {Array.from({length:6},(_,i) => <Skeleton key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', animation:'fadeIn 0.4s ease' }}>
            <div style={{ fontSize:48, marginBottom:14, animation:'float 4s ease-in-out infinite' }}>
              {search ? '🔍' : '💻'}
            </div>
            <h3 style={{ fontSize:20, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'-0.02em' }}>
              {search ? `Sin resultados para "${search}"` : 'Sin proyectos todavía'}
            </h3>
            <p style={{ fontSize:14, color:'var(--text-muted)', maxWidth:300, margin:'0 auto' }}>
              {search ? 'Prueba con otros términos de búsqueda' : 'Sé el primero en publicar'}
            </p>
            {search && <button onClick={() => { setSearch(''); setFilter('all'); }} style={{ marginTop:16, padding:'9px 22px', borderRadius:10, background:'var(--bg-3)', border:'1px solid var(--border)', color:'var(--text-secondary)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--sans)', transition:'all 0.2s' }}>Limpiar búsqueda</button>}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:18 }}>
            {filtered.map((p,i) => (
              <ProjCard key={p.projectId} project={p} liked={likedSet.has(p.projectId)}
                onLike={() => toggleLike(p)} onClick={() => setSelected(p)} index={i} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DetailDrawer project={selected} liked={likedSet.has(selected.projectId)}
          onLike={() => toggleLike(selected)} onClose={() => setSelected(null)} onNavigate={onNavigate} />
      )}
    </div>
  );
}
