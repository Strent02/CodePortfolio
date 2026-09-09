import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/UI';

/* ─── Partículas flotantes ───────────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.6 ? 252 : Math.random() > 0.5 ? 330 : 180,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.o})`;
        ctx.fill();
      });
      // Conexiones entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(252, 80%, 70%, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ─── Input con label flotante ───────────────────────────────────────────── */
function FloatingInput({ label, type = 'text', value, onChange, placeholder, autoComplete, required, icon }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value?.length > 0;
  return (
    <div style={{ position: 'relative', marginBottom: 4 }}>
      {/* Icono */}
      <div style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'color 0.25s', pointerEvents: 'none', zIndex: 2,
        display: 'flex', alignItems: 'center',
      }}>
        {icon}
      </div>
      {/* Label flotante */}
      <label style={{
        position: 'absolute',
        left: 48, top: active ? 8 : '50%',
        transform: active ? 'translateY(0) scale(0.75)' : 'translateY(-50%)',
        transformOrigin: 'left',
        fontSize: active ? 11 : 14,
        color: focused ? 'var(--accent)' : active ? 'var(--text-secondary)' : 'var(--text-muted)',
        fontWeight: active ? 700 : 400,
        fontFamily: active ? 'var(--mono)' : 'var(--sans)',
        letterSpacing: active ? '0.08em' : 0,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none', zIndex: 2,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={autoComplete}
        placeholder={focused ? placeholder : ''}
        style={{
          width: '100%',
          height: 58,
          padding: active ? '22px 16px 8px 48px' : '0 16px 0 48px',
          background: focused ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${focused ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 14,
          color: 'var(--text-primary)',
          fontSize: 15,
          fontFamily: 'var(--sans)',
          outline: 'none',
          transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: focused ? '0 0 0 4px rgba(108,99,255,0.12), 0 4px 20px rgba(108,99,255,0.1)' : 'none',
        }}
      />
    </div>
  );
}

/* ─── Ícono SVG inline ───────────────────────────────────────────────────── */
function Ico({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  email:    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  lock:     'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  user:     'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z',
  bio:      'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  location: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z',
  arrow:    'M5 12h14 M12 5l7 7-7 7',
  check:    'M20 6L9 17l-5-5',
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff:   'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22',
};

/* ─── Botón submit animado ───────────────────────────────────────────────── */
function SubmitButton({ loading, children, icon }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%', height: 54,
        background: loading
          ? 'rgba(108,99,255,0.5)'
          : 'linear-gradient(135deg, #6c63ff 0%, #5a52e8 40%, #ff6b9d 100%)',
        backgroundSize: '200% 200%',
        border: 'none', borderRadius: 14,
        color: '#fff', fontSize: 15, fontWeight: 700,
        fontFamily: 'var(--sans)', cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: loading ? 'none' : '0 8px 32px rgba(108,99,255,0.45), 0 2px 8px rgba(255,107,157,0.2)',
        letterSpacing: '0.02em',
        animation: loading ? 'none' : 'gradient-shift 3s ease infinite',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(108,99,255,0.55), 0 4px 12px rgba(255,107,157,0.3)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,99,255,0.45)'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px) scale(0.99)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
    >
      {loading
        ? <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite', display: 'inline-block' }} /> Cargando...</>
        : <>{icon} {children}</>
      }
    </button>
  );
}

/* ─── Indicador de fortaleza de contraseña ───────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score  = checks.filter(Boolean).length;
  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
  const colors = ['#ff4d6d', '#ff9a3c', '#ffc947', '#00c896', '#6c63ff'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s ease',
            boxShadow: i < score ? `0 0 6px ${colors[score - 1]}88` : 'none',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : 'var(--text-muted)', fontFamily: 'var(--mono)', fontWeight: 600, transition: 'color 0.3s' }}>
        {score > 0 ? labels[score - 1] : ''}
      </div>
    </div>
  );
}

/* ─── Logo animado ───────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
      <div style={{
        width: 44, height: 44,
        background: 'linear-gradient(135deg, #6c63ff, #ff6b9d)',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, fontFamily: 'var(--mono)', fontWeight: 700, color: '#fff',
        boxShadow: '0 8px 28px rgba(108,99,255,0.5)',
        flexShrink: 0,
        animation: 'logo-float 4s ease-in-out infinite',
      }}>
        &lt;/&gt;
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em', background: 'linear-gradient(135deg, #f0f0ff, #9090b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        CodePortfolio
      </span>
    </div>
  );
}

/* ─── Decoración lateral (solo desktop) ─────────────────────────────────── */
function SidePanel() {
  const features = [
    { icon: '🚀', title: 'Muestra tu código', desc: 'Publica proyectos con imágenes, demos y repos' },
    { icon: '🤝', title: 'Conecta devs', desc: 'Sigue a otros desarrolladores y descubre su trabajo' },
    { icon: '💼', title: 'Encuentra trabajo', desc: 'Accede a ofertas y postula directamente' },
    { icon: '⭐', title: 'Gana reconocimiento', desc: 'Recibe likes y comentarios de la comunidad' },
  ];
  return (
    <div style={{
      flex: 1, padding: '60px 48px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--text-primary)' }}>
          Tu portafolio de<br />
          <span style={{ background: 'linear-gradient(135deg, #6c63ff, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            código favorito.
          </span>
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          La red social para desarrolladores que quieren compartir su trabajo y crecer profesionalmente.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            animation: `slideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s both`,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, color: 'var(--text-primary)' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────────── */
export function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPass, setShowPass]= useState(false);
  const [step, setStep]        = useState(false); // mount animation

  useEffect(() => { setTimeout(() => setStep(true), 50); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('¡Bienvenido de vuelta! 🎉', 'success');
      onNavigate('feed');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <Particles />

      {/* Orbs de fondo */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'orb-1 10s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'orb-2 12s ease-in-out infinite alternate' }} />

      {/* Panel izquierdo — solo desktop */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }} className="auth-side-panel">
        <SidePanel />
      </div>

      {/* Divisor */}
      <div className="auth-divider-line" style={{ width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)', alignSelf: 'stretch', flexShrink: 0 }} />

      {/* Panel derecho — formulario */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', position: 'relative', zIndex: 1 }} className="auth-form-panel">
        <div style={{
          width: '100%',
          opacity: step ? 1 : 0,
          transform: step ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Logo />

          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Inicia sesión para continuar donde lo dejaste
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FloatingInput
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="dev@example.com"
              autoComplete="email"
              required
              icon={<Ico d={ICONS.email} size={17} />}
            />

            <div style={{ position: 'relative' }}>
              <FloatingInput
                label="Contraseña"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                icon={<Ico d={ICONS.lock} size={17} />}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Ico d={showPass ? ICONS.eyeOff : ICONS.eye} size={16} />
              </button>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 12, animation: 'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <span style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            <div style={{ marginTop: 4 }}>
              <SubmitButton loading={loading} icon={<Ico d={ICONS.arrow} size={17} />}>
                Iniciar sesión
              </SubmitButton>
            </div>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>¿No tienes cuenta? </span>
            <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--sans)', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Regístrate gratis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── REGISTER PAGE ──────────────────────────────────────────────────────── */
export function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm]        = useState({ fullName: '', email: '', password: '', bio: '', location: '' });
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');
  const [showPass, setShowPass] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = básico, 2 = perfil
  const [step, setStep]        = useState(false);

  useEffect(() => { setTimeout(() => setStep(true), 50); }, []);

  const field = key => ({ value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) });

  function goToStep2(e) {
    e.preventDefault();
    if (!form.fullName.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.email.includes('@')) { setError('Ingresa un email válido'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres'); return; }
    setError('');
    setCurrentStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast('¡Cuenta creada! Bienvenido 🎉', 'success');
      onNavigate('feed');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  }

  const progress = currentStep === 1 ? 50 : 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <Particles />
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'orb-1 10s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,200,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'orb-2 14s ease-in-out infinite alternate' }} />

      {/* Panel izquierdo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }} className="auth-side-panel">
        <SidePanel />
      </div>
      <div className="auth-divider-line" style={{ width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)', alignSelf: 'stretch', flexShrink: 0 }} />

      {/* Formulario */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', position: 'relative', zIndex: 1 }} className="auth-form-panel">
        <div style={{
          width: '100%',
          opacity: step ? 1 : 0,
          transform: step ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Logo />

          {/* Header */}
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>
              {currentStep === 1 ? 'Crea tu cuenta' : 'Personaliza tu perfil'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {currentStep === 1 ? 'Únete a la comunidad de desarrolladores' : 'Cuéntanos un poco sobre ti (opcional)'}
            </p>
          </div>

          {/* Barra de progreso */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {['Cuenta', 'Perfil'].map((label, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: currentStep > i ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : currentStep === i + 1 ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    transition: 'all 0.3s ease',
                    boxShadow: currentStep > i || currentStep === i + 1 ? '0 4px 12px rgba(108,99,255,0.4)' : 'none',
                  }}>
                    {currentStep > i + 1 ? <Ico d={ICONS.check} size={12} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: currentStep === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.3s', fontFamily: 'var(--mono)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius: 99, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 12px rgba(108,99,255,0.5)' }} />
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <form onSubmit={goToStep2} style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
              <FloatingInput label="Nombre completo" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Ada Lovelace" required icon={<Ico d={ICONS.user} size={17} />} />
              <FloatingInput label="Correo electrónico" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ada@example.com" autoComplete="email" required icon={<Ico d={ICONS.email} size={17} />} />
              <div style={{ position: 'relative' }}>
                <FloatingInput label="Contraseña" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Mínimo 6 caracteres" autoComplete="new-password" required icon={<Ico d={ICONS.lock} size={17} />} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: 29, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Ico d={showPass ? ICONS.eyeOff : ICONS.eye} size={16} />
                </button>
                <PasswordStrength password={form.password} />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 12, animation: 'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.5 }}>{error}</span>
                </div>
              )}
              <div style={{ marginTop: 4 }}>
                <SubmitButton loading={false} icon={<Ico d={ICONS.arrow} size={17} />}>
                  Continuar
                </SubmitButton>
              </div>
            </form>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
              <FloatingInput label="Bio (cuéntanos sobre ti)" {...field('bio')} placeholder="Full-stack dev apasionado por el open source..." icon={<Ico d={ICONS.bio} size={17} />} />
              <FloatingInput label="Ubicación" {...field('location')} placeholder="Bogotá, Colombia" icon={<Ico d={ICONS.location} size={17} />} />

              <div style={{ padding: '14px 16px', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                💡 Estos datos son opcionales. Puedes completarlos después desde tu perfil.
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', borderRadius: 12 }}>
                  <span style={{ fontSize: 15 }}>⚠️</span>
                  <span style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.5 }}>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setCurrentStep(1)} style={{ flex: '0 0 auto', height: 54, padding: '0 20px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  ← Atrás
                </button>
                <div style={{ flex: 1 }}>
                  <SubmitButton loading={loading} icon={<Ico d={ICONS.check} size={17} />}>
                    Crear cuenta
                  </SubmitButton>
                </div>
              </div>
            </form>
          )}

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>¿Ya tienes cuenta? </span>
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--sans)', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Inicia sesión →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
