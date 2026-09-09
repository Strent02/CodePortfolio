import { useState, useEffect, useRef } from 'react';
import { projects as projectsApi } from '../api/client';
import { Avatar, useToast } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ value, label, color, icon, delay }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) return;
    const dur = 600;
    const step = Math.ceil(end / (dur / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div style={{ background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:16, padding:'18px 22px', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)', animation:`cardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s both`, position:'relative', overflow:'hidden' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}44`;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.3), 0 0 24px ${color}18`;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
      {/* Glow bg */}
      <div style={{ position:'absolute', top:'-50%', right:'-20%', width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ fontSize:28, marginBottom:2 }}>{icon}</div>
      <div style={{ fontSize:28, fontWeight:800, fontFamily:'var(--mono)', color, lineHeight:1, marginBottom:4 }}>{count}</div>
      <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{label}</div>
    </div>
  );
}

/* ─── Imagen uploader ────────────────────────────────────────────────────── */
function ImageUploader({ preview, currentUrl, onChange }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const src = preview || (currentUrl ? `${BASE}${currentUrl}` : null);

  function handleDrop(e) {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  }

  function processFile(file) {
    const reader = new FileReader();
    reader.onload = ev => onChange(file, ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      style={{ position:'relative', width:'100%', height:src?180:130, borderRadius:14, border:`2px dashed ${drag?'var(--accent)':src?'transparent':'rgba(255,255,255,0.1)'}`, background: drag?'rgba(108,99,255,0.08)':'var(--bg-3)', cursor:'pointer', overflow:'hidden', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center' }}
      onMouseEnter={e => { if (!src) e.currentTarget.style.borderColor='rgba(108,99,255,0.4)'; }}
      onMouseLeave={e => { if (!src) e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
    >
      {src ? (
        <>
          <img src={src} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', opacity:0, transition:'opacity 0.2s', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8, color:'#fff', fontSize:13, fontWeight:600 }}
            onMouseEnter={e=>e.currentTarget.style.opacity=1}
            onMouseLeave={e=>e.currentTarget.style.opacity=0}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
            Cambiar imagen
          </div>
        </>
      ) : (
        <div style={{ textAlign:'center', color:'var(--text-muted)', pointerEvents:'none' }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom:8, opacity:0.5 }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{drag?'Suelta aquí':'Arrastra o haz click'}</div>
          <div style={{ fontSize:11 }}>JPG, PNG, WebP, GIF</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files[0]; if(f) processFile(f); }} />
    </div>
  );
}

/* ─── Project Editor (panel lateral) ────────────────────────────────────── */
function ProjectEditor({ project, onClose, onSaved }) {
  const toast  = useToast();
  const [form, setForm] = useState({
    title:         project?.title         || '',
    description:   project?.description   || '',
    demoUrl:       project?.demoUrl       || '',
    repositoryUrl: project?.repositoryUrl || '',
    status:        project?.status        || 'published',
  });
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [vis,        setVis]        = useState(false);
  const isEdit = !!project;

  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);

  function close() { setVis(false); setTimeout(onClose, 320); }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  async function save() {
    if (!form.title.trim()) { toast('El título es obligatorio', 'error'); return; }
    setSaving(true);
    const payload = {
      ...form,
      demoUrl:       form.demoUrl.trim()       || null,
      repositoryUrl: form.repositoryUrl.trim() || null,
      description:   form.description.trim()   || null,
    };
    try {
      let saved;
      if (isEdit) {
        saved = await projectsApi.update(project.projectId, payload);
        if (imgFile) await projectsApi.uploadImage(project.projectId, imgFile);
        toast('Proyecto actualizado ✓', 'success');
      } else {
        saved = await projectsApi.create(payload);
        if (imgFile) await projectsApi.uploadImage(saved.projectId, imgFile);
        toast('Proyecto creado ✓', 'success');
      }
      close();
      setTimeout(onSaved, 350);
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  const inputStyle = { width:'100%', height:44, padding:'0 14px', background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:12, color:'var(--text-primary)', fontSize:14, fontFamily:'var(--sans)', outline:'none', transition:'all 0.2s' };
  const focus = e => { e.target.style.borderColor='var(--accent)'; e.target.style.background='rgba(108,99,255,0.06)'; e.target.style.boxShadow='0 0 0 3px rgba(108,99,255,0.12)'; };
  const blur  = e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.background='rgba(255,255,255,0.04)'; e.target.style.boxShadow='none'; };

  const statusOpts = [
    { id:'published', label:'Publicado', color:'#00e5b0', desc:'Visible para todos' },
    { id:'draft',     label:'Borrador',  color:'#ffc947', desc:'Solo tú lo ves' },
    { id:'archived',  label:'Archivado', color:'#9090b8', desc:'Oculto del feed' },
  ];

  return (
    <>
      <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(6,6,16,0.7)', backdropFilter:'blur(6px)', zIndex:200, opacity:vis?1:0, transition:'opacity 0.3s ease' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'100%', maxWidth:480, background:'var(--bg-1)', borderLeft:'1px solid var(--border)', zIndex:201, display:'flex', flexDirection:'column', transform:vis?'translateX(0)':'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow:'-24px 0 80px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'var(--bg-2)' }}>
          <h2 style={{ fontSize:16, fontWeight:800, margin:0, letterSpacing:'-0.02em' }}>
            {isEdit ? 'Editar proyecto' : '✨ Nuevo proyecto'}
          </h2>
          <button onClick={close} style={{ width:34, height:34, borderRadius:'50%', background:'var(--bg-3)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--red-dim)';e.currentTarget.style.color='var(--red)';e.currentTarget.style.borderColor='rgba(255,77,109,0.3)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-3)';e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.borderColor='var(--border)';}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Título */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Título *</label>
              <input value={form.title} onChange={set('title')} placeholder="Mi proyecto increíble" style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>

            {/* Descripción */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Descripción</label>
              <textarea value={form.description} onChange={set('description')} placeholder="Cuéntanos de qué trata tu proyecto..." rows={4}
                style={{ ...inputStyle, height:'auto', padding:'12px 14px', resize:'vertical', lineHeight:1.6 }} onFocus={focus} onBlur={blur} />
            </div>

            {/* URLs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Demo URL</label>
                <div style={{ position:'relative' }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <input value={form.demoUrl} onChange={set('demoUrl')} placeholder="https://..." style={{ ...inputStyle, paddingLeft:34 }} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Repositorio</label>
                <div style={{ position:'relative' }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                  <input value={form.repositoryUrl} onChange={set('repositoryUrl')} placeholder="github.com/..." style={{ ...inputStyle, paddingLeft:34 }} onFocus={focus} onBlur={blur} />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Estado</label>
              <div style={{ display:'flex', gap:8 }}>
                {statusOpts.map(s => (
                  <button key={s.id} onClick={() => setForm(f=>({...f,status:s.id}))} style={{ flex:1, padding:'10px 8px', borderRadius:12, border:`1.5px solid ${form.status===s.id?`${s.color}55`:'rgba(255,255,255,0.07)'}`, background:form.status===s.id?`${s.color}12`:'rgba(255,255,255,0.03)', cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:s.color, margin:'0 auto 5px', boxShadow:form.status===s.id?`0 0 8px ${s.color}`:'none' }} />
                    <div style={{ fontSize:12, fontWeight:700, color:form.status===s.id?s.color:'var(--text-muted)', marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Imagen */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Imagen destacada</label>
              <ImageUploader
                preview={imgPreview}
                currentUrl={project?.featuredImage}
                onChange={(file, preview) => { setImgFile(file); setImgPreview(preview); }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0, background:'var(--bg-2)' }}>
          <button onClick={close} style={{ flex:'0 0 auto', height:46, padding:'0 20px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(255,255,255,0.1)', color:'var(--text-secondary)', fontSize:14, fontWeight:600, fontFamily:'var(--sans)', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.color='var(--text-primary)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='var(--text-secondary)';}}>
            Cancelar
          </button>
          <button onClick={save} disabled={saving} style={{ flex:1, height:46, borderRadius:12, background:'linear-gradient(135deg,var(--accent),#5a52e8)', border:'none', color:'#fff', fontSize:14, fontWeight:700, fontFamily:'var(--sans)', cursor:saving?'not-allowed':'pointer', boxShadow:'0 6px 20px rgba(108,99,255,0.4)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:saving?0.7:1 }}
            onMouseEnter={e=>{if(!saving){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(108,99,255,0.5)';}}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(108,99,255,0.4)';}}>
            {saving
              ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.65s linear infinite' }} /> Guardando...</>
              : <><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg> {isEdit?'Guardar cambios':'Publicar proyecto'}</>
            }
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Project row card ───────────────────────────────────────────────────── */
function ProjectRow({ project, onEdit, onDelete, index }) {
  const [hov, setHov] = useState(false);
  const imgSrc = project.featuredImage ? `${BASE}${project.featuredImage}` : null;
  const statusColor = { published:'#00e5b0', draft:'#ffc947', archived:'#9090b8' };

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'var(--bg-2)', border:`1px solid ${hov?'rgba(108,99,255,0.3)':'var(--border)'}`, borderRadius:14, transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)', animation:`cardIn 0.4s cubic-bezier(0.16,1,0.3,1) ${index*0.04}s both`, transform:hov?'translateX(4px)':'translateX(0)' }}>
      {/* Thumbnail */}
      <div style={{ width:52, height:52, borderRadius:10, overflow:'hidden', background:'var(--bg-3)', flexShrink:0 }}>
        {imgSrc
          ? <img src={imgSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.currentTarget.style.display='none'} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'rgba(108,99,255,0.3)', fontFamily:'var(--mono)', fontWeight:300 }}>&lt;/&gt;</div>
        }
      </div>
      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{project.title}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:99, fontSize:10, fontWeight:700, fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.06em', background:`${statusColor[project.status]||'#9090b8'}15`, color:statusColor[project.status]||'#9090b8', border:`1px solid ${statusColor[project.status]||'#9090b8'}30` }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'currentColor' }} />
            {project.status||'draft'}
          </div>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--mono)' }}>♥ {project.likes||0}</span>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--mono)' }}>💬 {project.commentsCount||0}</span>
        </div>
      </div>
      {/* Actions */}
      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
        <button onClick={() => onEdit(project)} style={{ height:34, padding:'0 14px', borderRadius:9, background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.2)', color:'var(--accent)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'var(--sans)', transition:'all 0.2s', display:'flex', alignItems:'center', gap:6 }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(108,99,255,0.2)';e.currentTarget.style.transform='scale(1.04)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(108,99,255,0.1)';e.currentTarget.style.transform='scale(1)';}}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button onClick={() => onDelete(project)} style={{ height:34, width:34, borderRadius:9, background:'rgba(255,77,109,0.08)', border:'1px solid rgba(255,77,109,0.15)', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,77,109,0.18)';e.currentTarget.style.transform='scale(1.08)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,77,109,0.08)';e.currentTarget.style.transform='scale(1)';}}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Delete confirm ─────────────────────────────────────────────────────── */
function DeleteModal({ project, onConfirm, onCancel }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 10); }, []);
  function cancel() { setVis(false); setTimeout(onCancel, 280); }

  return (
    <>
      <div onClick={cancel} style={{ position:'fixed', inset:0, background:'rgba(6,6,16,0.8)', backdropFilter:'blur(8px)', zIndex:300, opacity:vis?1:0, transition:'opacity 0.25s' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:`translate(-50%,-50%) scale(${vis?1:0.9})`, zIndex:301, width:'100%', maxWidth:400, padding:28, background:'var(--bg-2)', border:'1px solid rgba(255,77,109,0.2)', borderRadius:20, boxShadow:'0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,77,109,0.1)', opacity:vis?1:0, transition:'all 0.28s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ fontSize:40, textAlign:'center', marginBottom:16 }}>🗑️</div>
        <h3 style={{ fontSize:18, fontWeight:800, textAlign:'center', marginBottom:8, letterSpacing:'-0.02em' }}>¿Eliminar proyecto?</h3>
        <p style={{ fontSize:13, color:'var(--text-secondary)', textAlign:'center', lineHeight:1.6, marginBottom:24 }}>
          "<strong style={{color:'var(--text-primary)'}}>{project.title}</strong>" se eliminará permanentemente con todos sus comentarios y likes.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={cancel} style={{ flex:1, height:44, borderRadius:11, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-secondary)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--sans)', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='var(--text-primary)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='var(--text-secondary)';}}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ flex:1, height:44, borderRadius:11, background:'linear-gradient(135deg,#ff4d6d,#e03a5a)', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 6px 20px rgba(255,77,109,0.35)', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(255,77,109,0.5)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(255,77,109,0.35)';}}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── MY PROJECTS PAGE ───────────────────────────────────────────────────── */
export function MyProjectsPage({ onNavigate }) {
  const { user }  = useAuth();
  const toast     = useToast();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editor,  setEditor]  = useState(null); // null | 'new' | project
  const [deleting,setDeleting]= useState(null);

  useEffect(() => { if (!user) { onNavigate('login'); return; } load(); }, [user]);

  async function load() {
    setLoading(true);
    try { setItems((await projectsApi.getMine()) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await projectsApi.delete(deleting.projectId);
      setItems(prev => prev.filter(p => p.projectId !== deleting.projectId));
      toast('Proyecto eliminado', 'success');
    } catch (e) { toast(e.message, 'error'); }
    finally { setDeleting(null); }
  }

  const stats = {
    total:     items.length,
    published: items.filter(p => p.status === 'published').length,
    draft:     items.filter(p => p.status === 'draft').length,
    likes:     items.reduce((a, p) => a + (p.likes || 0), 0),
  };

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ padding:'32px 36px 0', animation:'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.03em', margin:0, marginBottom:5 }}>Mis proyectos</h1>
            <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Gestiona y publica tu portafolio de código</p>
          </div>
          <button onClick={() => setEditor('new')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, background:'linear-gradient(135deg,var(--accent),#5a52e8)', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 6px 24px rgba(108,99,255,0.4)', transition:'all 0.2s', flexShrink:0 }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 32px rgba(108,99,255,0.5)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 24px rgba(108,99,255,0.4)';}}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo proyecto
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }} className="stats-grid">
          <StatCard value={stats.total}     label="Total"         color="var(--accent)" icon="📁" delay={0.05} />
          <StatCard value={stats.published} label="Publicados"    color="#00e5b0"        icon="🌐" delay={0.1}  />
          <StatCard value={stats.draft}     label="Borradores"    color="#ffc947"        icon="✏️" delay={0.15} />
          <StatCard value={stats.likes}     label="Likes totales" color="#ff4d6d"        icon="♥"  delay={0.2}  />
        </div>
      </div>

      {/* Lista */}
      <div style={{ padding:'0 36px 80px' }}>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {Array.from({length:4},(_,i) => (
              <div key={i} style={{ height:76, background:'var(--bg-2)', borderRadius:14, border:'1px solid var(--border)', animation:`shimmer 1.4s infinite ${i*0.1}s`, backgroundImage:'linear-gradient(90deg,var(--bg-2) 25%,var(--bg-3) 50%,var(--bg-2) 75%)', backgroundSize:'200% 100%' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', animation:'fadeIn 0.4s ease' }}>
            <div style={{ fontSize:52, marginBottom:14, animation:'float 4s ease-in-out infinite' }}>🚀</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:'var(--text-secondary)', marginBottom:8, letterSpacing:'-0.02em' }}>Aún no tienes proyectos</h3>
            <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:24, lineHeight:1.6 }}>Comparte tu primer proyecto con la comunidad de desarrolladores</p>
            <button onClick={() => setEditor('new')} style={{ padding:'11px 28px', borderRadius:12, background:'linear-gradient(135deg,var(--accent),#5a52e8)', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--sans)', boxShadow:'0 6px 20px rgba(108,99,255,0.4)' }}>
              Crear mi primer proyecto
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {items.map((p,i) => (
              <ProjectRow key={p.projectId} project={p} index={i}
                onEdit={p => setEditor(p)}
                onDelete={p => setDeleting(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Editor drawer */}
      {editor !== null && (
        <ProjectEditor
          project={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
          onSaved={load}
        />
      )}

      {/* Delete modal */}
      {deleting && (
        <DeleteModal project={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
