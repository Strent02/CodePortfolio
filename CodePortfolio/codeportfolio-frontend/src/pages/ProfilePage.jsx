import { useState, useEffect, useRef } from 'react';
import { profile as profileApi, follows as followsApi, users as usersApi, projects as projectsApi, users } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Avatar, useToast } from '../components/UI';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function avatarSrc(pic) {
  if (!pic) return null;
  if (pic.startsWith('http') || pic.startsWith('data:')) return pic;
  return `${BASE}${pic}`;
}

/* ─── Skeleton de perfil ─────────────────────────────────────────────────── */
function ProfileSkeleton() {
  const s = { background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--bg-4) 50%,var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', borderRadius: 10 };
  return (
    <div style={{ padding: '0 36px', animation: 'fadeIn 0.3s ease' }}>
      {/* Banner */}
      <div style={{ height: 220, borderRadius: '0 0 24px 24px', marginBottom: 0, ...s, borderRadius: 24 }} />
      <div style={{ padding: '0 24px', marginTop: -48 }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', border: '4px solid var(--bg-0)', ...s, marginBottom: 16 }} />
        <div style={{ height: 22, width: '30%', ...s, marginBottom: 10 }} />
        <div style={{ height: 14, width: '50%', ...s, marginBottom: 8 }} />
        <div style={{ height: 14, width: '25%', ...s }} />
      </div>
    </div>
  );
}

/* ─── Project mini-card ──────────────────────────────────────────────────── */
function MiniCard({ project, onClick, index }) {
  const [hov, setHov] = useState(false);
  const img = project.featuredImage ? `${BASE}${project.featuredImage}` : null;

  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-2)', border: `1px solid ${hov ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-5px) scale(1.01)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.15)' : '0 2px 8px rgba(0,0,0,0.2)',
        animation: `cardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both`,
      }}>
      <div style={{ height: 140, background: 'var(--bg-3)', overflow: 'hidden', position: 'relative' }}>
        {img
          ? <img src={img} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: hov ? 'scale(1.08)' : 'scale(1)' }} onError={e => e.currentTarget.style.display = 'none'} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontFamily: 'var(--mono)', color: 'rgba(108,99,255,0.2)', fontWeight: 300, letterSpacing: '-0.05em', transition: 'transform 0.5s', transform: hov ? 'scale(1.06)' : 'scale(1)' }}>&lt;/&gt;</div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,20,0.6) 100%)', pointerEvents: 'none' }} />
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            {project.likes ?? 0}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            {project.commentsCount ?? 0}
          </span>
          {project.status && (
            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 99, background: project.status === 'published' ? 'rgba(0,229,176,0.12)' : 'rgba(255,201,71,0.12)', color: project.status === 'published' ? '#00e5b0' : '#ffc947' }}>
              {project.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Lista de usuarios (seguidores / siguiendo) ─────────────────────────── */
function UserListDrawer({ title, list, loading, onClose, onNavigate }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);
  function close() { setVis(false); setTimeout(onClose, 320); }

  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, opacity: vis ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 380, background: 'var(--bg-1)', borderLeft: '1px solid var(--border)', zIndex: 201, display: 'flex', flexDirection: 'column', transform: vis ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: '-16px 0 60px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-2)', flexShrink: 0 }}>
          <button onClick={close} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h2>
            {!loading && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: 1 }}>{list.length} {list.length === 1 ? 'persona' : 'personas'}</div>}
          </div>
        </div>
        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{ height: 60, borderRadius: 12, background: 'linear-gradient(90deg,var(--bg-3) 25%,var(--bg-4) 50%,var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s infinite ${i * 0.1}s` }} />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Sin usuarios aún</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {list.map((u, i) => (
                <div key={u.userId} onClick={() => { close(); setTimeout(() => onNavigate('profile', u.userId), 350); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', animation: `cardIn 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <Avatar name={u.fullName || '?'} size={42} src={avatarSrc(u.profilePicture)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.fullName}</div>
                    {u.bio && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.bio}</div>}
                  </div>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Edit drawer ────────────────────────────────────────────────────────── */
function EditDrawer({ profileData, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({ fullName: profileData.fullName || '', bio: profileData.bio || '', location: profileData.location || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [vis, setVis] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);
  function close() { setVis(false); setTimeout(onClose, 320); }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setAvatarFile(file);
    const r = new FileReader();
    r.onload = e => setAvatarPreview(e.target.result);
    r.readAsDataURL(file);
  }

  async function save() {
    if (!form.fullName.trim()) { toast('El nombre es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      let newPic = profileData.profilePicture || null;
      if (avatarFile) {
        const res = await usersApi.uploadAvatar(avatarFile);
        newPic = res?.profilePicture ?? newPic;
      }
      await usersApi.update({ fullName: form.fullName, bio: form.bio, location: form.location, profilePicture: newPic });
      toast('Perfil actualizado ✓', 'success');
      close();
      setTimeout(onSaved, 350);
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  const currentSrc = avatarPreview || avatarSrc(profileData.profilePicture);
  const inputCss = { width: '100%', height: 48, padding: '0 14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', transition: 'all 0.2s' };
  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'rgba(108,99,255,0.06)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; };
  const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none'; };

  return (
    <>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, opacity: vis ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 460, background: 'var(--bg-1)', borderLeft: '1px solid var(--border)', zIndex: 201, display: 'flex', flexDirection: 'column', transform: vis ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow: '-20px 0 80px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-2)', flexShrink: 0 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Editar perfil</h2>
          <button onClick={close} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Avatar uploader */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Foto de perfil</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Avatar preview */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid transparent', backgroundImage: currentSrc ? 'none' : 'linear-gradient(var(--bg-2),var(--bg-2)), linear-gradient(135deg,var(--accent),var(--accent-2))', backgroundOrigin: 'border-box', backgroundClip: currentSrc ? 'border-box' : 'padding-box, border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentSrc ? 'transparent' : undefined, boxShadow: '0 4px 20px rgba(108,99,255,0.3)' }}>
                    {currentSrc
                      ? <img src={currentSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{profileData.fullName?.charAt(0)?.toUpperCase() || '?'}</span>
                    }
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  style={{ flex: 1, height: 80, borderRadius: 14, border: `2px dashed ${dragOver ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, background: dragOver ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'; e.currentTarget.style.background = 'rgba(108,99,255,0.05)'; }}
                  onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}>
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.6 }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                    {avatarFile ? `✓ ${avatarFile.name}` : 'Arrastra o haz click'}
                  </span>
                  {avatarFile && <span style={{ fontSize: 10, color: 'var(--green)' }}>Lista para subir</span>}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Nombre completo *</label>
              <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Tu nombre" style={inputCss} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Full-stack dev apasionado por el open source..." rows={4}
                style={{ ...inputCss, height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Ubicación */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Ubicación</label>
              <div style={{ position: 'relative' }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', transition: 'color 0.2s' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Bogotá, Colombia" style={{ ...inputCss, paddingLeft: 38 }} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg-2)', flexShrink: 0 }}>
          <button onClick={close} style={{ flex: '0 0 auto', height: 46, padding: '0 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Cancelar
          </button>
          <button onClick={save} disabled={saving} style={{ flex: 1, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--sans)', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(108,99,255,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.5)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.4)'; }}>
            {saving
              ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} /> Guardando...</>
              : <><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg> Guardar cambios</>
            }
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── PROFILE PAGE ───────────────────────────────────────────────────────── */
export function ProfilePage({ userId: propUserId, onNavigate }) {
  const { user }   = useAuth();
  const toast      = useToast();
  const userId     = propUserId || user?.userId;
  const isOwn      = !!(user && userId && user.userId?.toLowerCase() === userId?.toLowerCase());

  const [profileData, setProfileData] = useState(null);
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [following,   setFollowing]   = useState(false);
  const [followLoad,  setFollowLoad]  = useState(false);
  const [showEdit,    setShowEdit]    = useState(false);
  const [followers,   setFollowers]   = useState({ open: false, list: [], loading: false });
  const [followingD,  setFollowingD]  = useState({ open: false, list: [], loading: false });
  const [tab,         setTab]         = useState('projects');

  useEffect(() => {
    if (!userId) { onNavigate('login'); return; }
    load();
  }, [userId]);

  async function load() {
    setLoading(true);
    try {
      const [pd, ps] = await Promise.all([profileApi.get(userId), profileApi.getProjects(userId)]);
      setProfileData(pd);
      setProjects(ps || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function openFollowers() {
    setFollowers(f => ({ ...f, open: true, loading: true }));
    try {
      const list = (await followsApi.getFollowers(userId)) || [];
      setFollowers(f => ({ ...f, list, loading: false }));
    } catch { setFollowers(f => ({ ...f, list: [], loading: false })); }
  }

  async function openFollowing() {
    setFollowingD(f => ({ ...f, open: true, loading: true }));
    try {
      const list = (await followsApi.getFollowing(userId)) || [];
      setFollowingD(f => ({ ...f, list, loading: false }));
    } catch { setFollowingD(f => ({ ...f, list: [], loading: false })); }
  }

  async function toggleFollow() {
    if (!user) { onNavigate('login'); return; }
    setFollowLoad(true);
    try {
      if (following) {
        await followsApi.unfollow(userId);
        setFollowing(false);
        setProfileData(p => ({ ...p, followersCount: Math.max(0, (p.followersCount || 1) - 1) }));
      } else {
        await followsApi.follow(userId);
        setFollowing(true);
        setProfileData(p => ({ ...p, followersCount: (p.followersCount || 0) + 1 }));
      }
    } catch (e) { toast(e.message, 'error'); }
    finally { setFollowLoad(false); }
  }

  if (loading) return <ProfileSkeleton />;
  if (!profileData) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>👤</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)' }}>Usuario no encontrado</h3>
    </div>
  );

  const picSrc = avatarSrc(profileData.profilePicture);
  const initials = profileData.fullName?.charAt(0)?.toUpperCase() || '?';

  /* Stat clicable */
  function StatNum({ value, label, onClick }) {
    const [hov, setHov] = useState(false);
    return (
      <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ textAlign: 'center', cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.2s', transform: hov && onClick ? 'translateY(-2px)' : 'translateY(0)', padding: '8px 16px', borderRadius: 12, background: hov && onClick ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--mono)', background: 'linear-gradient(135deg,var(--text-primary),rgba(108,99,255,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 4 }}>{value ?? 0}</div>
        <div style={{ fontSize: 11, color: hov && onClick ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textDecoration: onClick ? 'underline dotted' : 'none', textUnderlineOffset: 3 }}>{label}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', animation: 'fadeIn 0.4s ease' }}>
      {/* Banner decorativo */}
      <div style={{ height: 180, background: `linear-gradient(135deg, rgba(108,99,255,0.3) 0%, rgba(255,107,157,0.15) 50%, rgba(0,212,200,0.1) 100%)`, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {/* Patrón de fondo */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', top: -40, left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: -20, right: '15%', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.2) 0%, transparent 70%)', filter: 'blur(24px)' }} />
        {/* Botón editar sobre el banner */}
        {isOwn && (
          <button onClick={() => setShowEdit(true)} style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar perfil
          </button>
        )}
      </div>

      {/* Contenido del perfil */}
      <div style={{ padding: '0 36px', maxWidth: 900, margin: '0 auto' }}>
        {/* Avatar + acciones */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -52, marginBottom: 20, gap: 16 }}>
          {/* Avatar grande */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 104, height: 104, borderRadius: '50%',
              border: '4px solid var(--bg-0)',
              background: picSrc ? 'transparent' : 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,157,0.15))',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.2)',
              cursor: isOwn ? 'pointer' : 'default', transition: 'transform 0.2s',
              fontSize: 36, fontWeight: 800,
              background: picSrc ? 'transparent' : undefined,
            }}
              onClick={() => isOwn && setShowEdit(true)}
              onMouseEnter={e => { if (isOwn) e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
              {picSrc
                ? <img src={picSrc} alt={profileData.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} />
                : <span style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{initials}</span>
              }
            </div>
            {/* Indicador online */}
            {isOwn && <div style={{ position: 'absolute', bottom: 6, right: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--green)', border: '3px solid var(--bg-0)', boxShadow: '0 0 10px rgba(0,229,176,0.5)' }} />}
          </div>

          {/* Botón seguir (no propio) */}
          {!isOwn && user && (
            <button onClick={toggleFollow} disabled={followLoad}
              style={{ padding: '10px 24px', borderRadius: 12, border: following ? '1.5px solid rgba(255,255,255,0.15)' : 'none', background: following ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,var(--accent),#5a52e8)', color: following ? 'var(--text-secondary)' : '#fff', fontSize: 14, fontWeight: 700, cursor: followLoad ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.25s', boxShadow: following ? 'none' : '0 6px 20px rgba(108,99,255,0.4)', alignSelf: 'center', flexShrink: 0 }}
              onMouseEnter={e => { if (!followLoad) { e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {followLoad
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />
                : following
                  ? <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg> Siguiendo</>
                  : <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Seguir</>
              }
            </button>
          )}
        </div>

        {/* Nombre + info */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 6px', lineHeight: 1.1 }}>{profileData.fullName}</h1>
          {profileData.bio && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 10px', maxWidth: 520 }}>{profileData.bio}</p>}
          {profileData.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {profileData.location}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '4px 8px', width: 'fit-content' }}>
          <StatNum value={profileData.projectsCount}  label="Proyectos" />
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'center', height: 28 }} />
          <StatNum value={profileData.followersCount} label="Seguidores" onClick={openFollowers} />
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'center', height: 28 }} />
          <StatNum value={profileData.followingCount} label="Siguiendo"  onClick={openFollowing} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {['projects', 'about'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: tab === t ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--sans)', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, marginBottom: -1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7 }}>
              {t === 'projects'
                ? <><svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Proyectos {projects.length > 0 && <span style={{ padding: '1px 7px', borderRadius: 99, background: tab === 'projects' ? 'rgba(108,99,255,0.15)' : 'var(--bg-3)', fontSize: 10, fontFamily: 'var(--mono)' }}>{projects.length}</span>}</>
                : <><svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Sobre mí</>
              }
            </button>
          ))}
        </div>

        {/* Tab: proyectos */}
        {tab === 'projects' && (
          projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ fontSize: 44, marginBottom: 14, animation: 'float 4s ease-in-out infinite' }}>💻</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Sin proyectos publicados</h3>
              {isOwn && (
                <button onClick={() => onNavigate('my-projects')} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#5a52e8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Crear mi primer proyecto
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, paddingBottom: 80 }}>
              {projects.map((p, i) => <MiniCard key={p.projectId} project={p} index={i} onClick={() => {}} />)}
            </div>
          )
        )}

        {/* Tab: sobre mí */}
        {tab === 'about' && (
          <div style={{ maxWidth: 520, paddingBottom: 80, animation: 'fadeIn 0.35s ease' }}>
            {[
              profileData.bio      && { label: 'Bio', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', value: profileData.bio },
              profileData.location && { label: 'Ubicación', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6', value: profileData.location },
              { label: 'Miembro desde', icon: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z', value: new Date(profileData.registrationDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' }) },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both` }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d={item.icon} /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawers */}
      {followers.open  && <UserListDrawer title="Seguidores" list={followers.list}  loading={followers.loading}  onClose={() => setFollowers(f  => ({ ...f, open: false }))} onNavigate={onNavigate} />}
      {followingD.open && <UserListDrawer title="Siguiendo"  list={followingD.list} loading={followingD.loading} onClose={() => setFollowingD(f => ({ ...f, open: false }))} onNavigate={onNavigate} />}
      {showEdit        && <EditDrawer profileData={profileData} onClose={() => setShowEdit(false)} onSaved={load} />}
    </div>
  );
}
