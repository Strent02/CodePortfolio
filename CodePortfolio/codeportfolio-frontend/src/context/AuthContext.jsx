import { createContext, useContext, useState, useEffect } from 'react';
import { auth, users } from '../api/client';

const AuthContext = createContext(null);

// Canal para que client.js pueda pedir navegación sin importar App
export const authEvents = new EventTarget();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem('cp_token');
    const userId   = localStorage.getItem('cp_userId');
    const role     = localStorage.getItem('cp_role');
    const fullName = localStorage.getItem('cp_fullName');

    if (token && userId) {
      // Verificar que el token no esté expirado (decodificando el JWT localmente)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expired = payload.exp && payload.exp * 1000 < Date.now();
        if (expired) {
          // Token expirado — limpiar sesión
          localStorage.clear();
        } else {
          setUser({ token, userId, role, fullName });
        }
      } catch {
        // Token malformado — limpiar
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  function saveSession(data, fullName) {
    localStorage.setItem('cp_token',    data.token);
    localStorage.setItem('cp_refresh',  data.refreshToken);
    localStorage.setItem('cp_userId',   data.userId);
    localStorage.setItem('cp_role',     data.role);
    localStorage.setItem('cp_fullName', fullName || '');
    setUser({ token: data.token, userId: data.userId, role: data.role, fullName: fullName || '' });
  }

  async function login(email, password) {
    const data = await auth.login({ email, password });
    // Obtener nombre real del usuario
    let fullName = '';
    try {
      localStorage.setItem('cp_token', data.token);
      const me = await users.me();
      fullName = me?.fullName || '';
    } catch {}
    saveSession(data, fullName);
    return data;
  }

  async function register(dto) {
    const data = await auth.register(dto);
    saveSession(data, dto.fullName || '');
    return data;
  }

  async function logout() {
    const refreshToken = localStorage.getItem('cp_refresh');
    try { await auth.logout(refreshToken); } catch {}
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
