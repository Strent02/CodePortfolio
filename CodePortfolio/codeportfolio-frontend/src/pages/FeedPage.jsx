import { useState, useEffect, useCallback, useRef } from 'react';
import { feed, projects as projectsApi, comments as commentsApi, users as usersApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Icon, Avatar, useToast } from '../components/UI';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ height: 200, background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 14, borderRadius: 7, width: '70%', background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.1s' }} />
        <div style={{ height: 11, borderRadius: 6, width: '90%', background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.2s' }} />
        <div style={{ height: 11, borderRadius: 6, width: '60%', background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.3s' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ height: 28, width: 80, borderRadius: 14, background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.4s' }} />
          <div style={{ height: 28, width: 60, borderRadius: 14, background: 'linear-gradient(90deg, var(--bg-3) 25%, var(--bg-4) 50%, var(--bg-3) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.5s' }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────────── */
function FeedCard({ project, liked, onLike, onClick, index }) {
  const imgSrc = project.featuredImage ? `${BASE}${project.featuredImage}` : null;
  const [hovered, setHovered] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  function handleLike(e) {
    e.stopPropagation();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    onLike();
  }

  const statusColors = { published: '#00e5b0', draft: '#ffc947', archived: '#9090b8' };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-1)',
        border: `1px solid ${hovered ? 'rgba(108,99,255,0.35)' : 'var(--border)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.2), 0 0 40px rgba(108,99,255,0.1)'
          : '0 2px 12px rgba(0,0,0,0.3)',
        animation: `cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both`,
      }}
    >
      {/* Imagen */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: 'var(--bg-3)', flexShrink: 0 }}>
        {imgSrc ? (
          <img src={imgSrc} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} onError={e => e.currentTarget.style.display = 'none'} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, var(--bg-3), var(--bg-4))`, fontSize: 40, fontFamily: 'var(--mono)', color: 'rgba(108,99,255,0.3)', fontWeight: 300, letterSpacing: '-0.05em', userSelect: 'none', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}>
            &lt;/&gt;
          </div>
        )}
        {/* Overlay gradiente */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(12,12,26,0.7) 100%)', pointerEvents: 'none' }} />
        {/* Badge status */}
        {project.status && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', background: `${statusColors[project.status] || '#9090b8'}22`, color: statusColors[project.status] || '#9090b8', border: `1px solid ${statusColors[project.status] || '#9090b8'}44`, backdropFilter: 'blur(8px)' }}>
            {project.status}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.title}
        </h3>
        {project.description && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
            {project.description}
          </p>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Avatar name={project.authorName || '?'} size={26} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.authorName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            {/* Like button */}
            <button
              onClick={handleLike}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#ff4d6d' : 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 600, padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s', transform: likeAnim ? 'scale(1.35)' : 'scale(1)', filter: liked ? 'drop-shadow(0 0 6px rgba(255,77,109,0.6))' : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.1)'; e.currentTarget.style.color = '#ff4d6d'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = liked ? '#ff4d6d' : 'var(--text-muted)'; }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {project.likes ?? 0}
            </button>
            {/* Comments */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 600 }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {project.commentsCount ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Project Detail Drawer ──────────────────────────────────────────────── */
function ProjectDrawer({ project, onClose, liked, onLike, onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();
  const [comments,     setComments]     = useState([]);
  const [commentText,  setCommentText]  = useState('');
  const [commenting,   setCommenting]   = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [visible, setVisible] = useState(false);
  const commentEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    loadComments();
    return () => setVisible(false);
  }, [project?.projectId]);

  async function loadComments() {
    setLoadingComments(true);
    try { setComments((await commentsApi.getByProject(project.projectId)) || []); }
    catch { setComments([]); }
    finally { setLoadingComments(false); }
  }

  async function submitComment() {
    if (!commentText.trim() || !user) return;
    setCommenting(true);
    try {
      const c = await commentsApi.create(project.projectId, { content: commentText });
      setComments(prev => [...prev, c]);
      setCommentText('');
      setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) { toast(e.message, 'error'); }
    finally { setCommenting(false); }
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  if (!project) return null;

  const imgSrc = project.featuredImage ? `${BASE}${project.featuredImage}` : null;
  const timeAgo = (() => {
    const diff = Date.now() - new Date(project.publishDate);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor(diff / 60000);
    if (d > 0) return `hace ${d}d`;
    if (h > 0) return `hace ${h}h`;
    return `hace ${m}m`;
  })();

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(6,6,16,0.75)', backdropFilter: 'blur(6px)', zIndex: 200, opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 520,
        background: 'var(--bg-1)',
        borderLeft: '1px solid var(--border)',
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '-20px 0 80px rgba(0,0,0,0.5)',
        overflowY: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--bg-2)' }}>
          <button onClick={handleClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Imagen hero */}
          {imgSrc && (
            <div style={{ height: 240, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
              <img src={imgSrc} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, var(--bg-1) 100%)' }} />
            </div>
          )}

          <div style={{ padding: '20px 24px', flex: 1 }}>
            {/* Autor + fecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ cursor: 'pointer' }} onClick={() => { handleClose(); setTimeout(() => onNavigate('profile', project.userId), 350); }}>
                <Avatar name={project.authorName || '?'} size={40} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => { handleClose(); setTimeout(() => onNavigate('profile', project.userId), 350); }}>
                  {project.authorName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{timeAgo}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {/* Like en drawer */}
                <button onClick={onLike} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 99, border: `1.5px solid ${liked ? 'rgba(255,77,109,0.4)' : 'var(--border)'}`, background: liked ? 'rgba(255,77,109,0.1)' : 'var(--bg-3)', color: liked ? '#ff4d6d' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  {project.likes ?? 0}
                </button>
              </div>
            </div>

            {/* Descripción */}
            {project.description && (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                {project.description}
              </p>
            )}

            {/* Links */}
            {(project.demoUrl || project.repositoryUrl) && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))', border: '1px solid rgba(108,99,255,0.25)', color: 'var(--accent)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Ver demo
                  </a>
                )}
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                    Repositorio
                  </a>
                )}
              </div>
            )}

            {/* Divider comentarios */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                Comentarios {!loadingComments && `(${comments.length})`}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Lista de comentarios */}
            {loadingComments ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />
              </div>
            ) : comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                Sé el primero en comentar
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {comments.map((c, i) => (
                  <div key={c.commentId} style={{ display: 'flex', gap: 10, padding: '12px 0', borderBottom: i < comments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', animation: `slideUp 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}>
                    <Avatar name={c.authorName || '?'} size={32} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{c.authorName}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                          {new Date(c.commentDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, wordBreak: 'break-word' }}>{c.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={commentEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input comentario — fijo abajo */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-2)', flexShrink: 0 }}>
          {user ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <Avatar name={user.fullName || '?'} size={32} style={{ flexShrink: 0, marginBottom: 2 }} />
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  placeholder="Escribe un comentario..."
                  value={commentText}
                  onChange={e => { setCommentText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                  rows={1}
                  style={{ width: '100%', minHeight: 42, maxHeight: 120, resize: 'none', padding: '10px 48px 10px 14px', borderRadius: 12, background: 'var(--bg-3)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--sans)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', overflow: 'hidden' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button onClick={submitComment} disabled={commenting || !commentText.trim()} style={{ position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, borderRadius: 8, background: commentText.trim() ? 'var(--accent)' : 'var(--bg-4)', border: 'none', cursor: commentText.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s', transform: commentText.trim() ? 'scale(1)' : 'scale(0.9)', opacity: commentText.trim() ? 1 : 0.4 }}>
                  {commenting
                    ? <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />
                    : <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => { handleClose(); setTimeout(() => onNavigate('login'), 350); }} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(108,99,255,0.1)', border: '1.5px solid rgba(108,99,255,0.25)', color: 'var(--accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}>
              Inicia sesión para comentar →
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Barra superior sticky ──────────────────────────────────────────────── */
function FeedTopBar({ tab, setTab, hasUser }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.querySelector('.main-content');
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', fn);
    return () => el.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 36px',
      background: scrolled ? 'rgba(6,6,16,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 16 }}>
        <div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Feed</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 10, fontFamily: 'var(--mono)' }}>Descubre proyectos</span>
        </div>
        {hasUser && (
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
            {['public', 'following'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: tab === t ? 'var(--bg-4)' : 'transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.2s', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.3)' : 'none' }}>
                {t === 'public' ? 'Público' : 'Siguiendo'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── FEED PAGE ──────────────────────────────────────────────────────────── */
export function FeedPage({ onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();
  const [tab,             setTab]             = useState('public');
  const [items,           setItems]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [likedSet,        setLikedSet]        = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const [data, likedIds] = await Promise.all([
        tab === 'following' && user ? feed.following() : feed.public(),
        user ? usersApi.getMyLikes().catch(() => []) : Promise.resolve([]),
      ]);
      setItems(data || []);
      if (likedIds?.length) setLikedSet(new Set(likedIds));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tab, user]);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  async function toggleLike(project) {
    if (!user) { onNavigate('login'); return; }
    const id = project.projectId;
    try {
      if (likedSet.has(id)) {
        await projectsApi.unlike(id);
        setLikedSet(s => { const n = new Set(s); n.delete(id); return n; });
        setItems(prev => prev.map(p => p.projectId === id ? { ...p, likes: Math.max(0, (p.likes || 1) - 1) } : p));
        if (selectedProject?.projectId === id) setSelectedProject(p => ({ ...p, likes: Math.max(0, (p.likes || 1) - 1) }));
      } else {
        await projectsApi.like(id);
        setLikedSet(s => new Set([...s, id]));
        setItems(prev => prev.map(p => p.projectId === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        if (selectedProject?.projectId === id) setSelectedProject(p => ({ ...p, likes: (p.likes || 0) + 1 }));
      }
    } catch (e) { toast(e.message, 'error'); }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <FeedTopBar tab={tab} setTab={setTab} hasUser={!!user} />

      <div style={{ padding: '24px 36px 64px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ fontSize: 52, marginBottom: 16, display: 'block', animation: 'float 4s ease-in-out infinite' }}>
              {tab === 'following' ? '🔭' : '🚀'}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              {tab === 'following' ? 'Tu feed está vacío' : 'Nadie ha publicado aún'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px' }}>
              {tab === 'following'
                ? 'Sigue a otros desarrolladores para ver sus proyectos aquí'
                : 'Sé el primero en compartir un proyecto con la comunidad'}
            </p>
            {tab === 'following' && (
              <button onClick={() => setTab('public')} style={{ padding: '10px 24px', borderRadius: 12, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                Ver proyectos públicos
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {items.map((p, i) => (
              <FeedCard
                key={p.projectId}
                project={p}
                liked={likedSet.has(p.projectId)}
                onLike={() => toggleLike(p)}
                onClick={() => setSelectedProject(p)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drawer de detalle */}
      {selectedProject && (
        <ProjectDrawer
          project={selectedProject}
          liked={likedSet.has(selectedProject.projectId)}
          onLike={() => toggleLike(selectedProject)}
          onClose={() => setSelectedProject(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
