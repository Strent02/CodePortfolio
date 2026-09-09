import { createContext, useContext, useState, useEffect } from 'react';
import { auth, users } from '../api/client';

const AuthContext = createContext(null);

// Canal para que client.js pueda pedir navegación sin importar App
export const authEvents = new EventTarget();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = sessionStorage.getItem('cp_token');
    const userId   = sessionStorage.getItem('cp_userId');
    const role     = sessionStorage.getItem('cp_role');
    const fullName = sessionStorage.getItem('cp_fullName');
    const avatar   = sessionStorage.getItem('cp_avatar');

    if (token && userId) {
      // Verificar que el token no esté expirado (decodificando el JWT localmente)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expired = payload.exp && payload.exp * 1000 < Date.now();
        if (expired) {
          // Token expirado — limpiar sesión
          sessionStorage.clear();
        } else {
          setUser({ token, userId, role, fullName, avatar });
        }
      } catch {
        // Token malformado — limpiar
        sessionStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  function saveSession(data, fullName, avatar) {
    sessionStorage.setItem('cp_token',    data.token);
    sessionStorage.setItem('cp_refresh',  data.refreshToken);
    sessionStorage.setItem('cp_userId',   data.userId);
    sessionStorage.setItem('cp_role',     data.role);
    sessionStorage.setItem('cp_fullName', fullName || '');
    sessionStorage.setItem('cp_avatar',   avatar || '');
    setUser({ token: data.token, userId: data.userId, role: data.role, fullName: fullName || '', avatar: avatar || '' });
  }

  async function login(email, password) {
    const data = await auth.login({ email, password });
    // Obtener nombre real del usuario
    let fullName = '';
    let avatar = '';
    try {
      sessionStorage.setItem('cp_token', data.token);
      const me = await users.me();
      fullName = me?.fullName || '';
      avatar   = me?.profilePicture || '';
    } catch {
      // El perfil se cargará en la pantalla correspondiente si esta consulta falla.
    }
    saveSession(data, fullName, avatar);
    return data;
  }

  async function register(dto) {
    const data = await auth.register(dto);
    saveSession(data, dto.fullName || '');
    return data;
  }

  /* Relee el perfil del servidor y actualiza la sesión (nombre visible en la
     barra lateral) sin obligar a cerrar y volver a abrir sesión. */
  async function refreshUser() {
    if (!sessionStorage.getItem('cp_token')) return;
    try {
      const me = await users.me();
      if (!me) return;
      sessionStorage.setItem('cp_fullName', me.fullName || '');
      sessionStorage.setItem('cp_avatar',   me.profilePicture || '');
      setUser(u => (u ? { ...u, fullName: me.fullName || '', avatar: me.profilePicture || '' } : u));
    } catch {
      // Si la consulta falla, la sesión sigue siendo válida con el nombre previo.
    }
  }

  async function logout() {
    const refreshToken = sessionStorage.getItem('cp_refresh');
    try { await auth.logout(refreshToken); } catch {
      // La sesión local debe cerrarse aunque el servidor no esté disponible.
    }
    sessionStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
