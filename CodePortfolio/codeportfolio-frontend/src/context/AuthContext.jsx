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

    if (token && userId) {
      // Verificar que el token no esté expirado (decodificando el JWT localmente)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expired = payload.exp && payload.exp * 1000 < Date.now();
        if (expired) {
          // Token expirado — limpiar sesión
          sessionStorage.clear();
        } else {
          setUser({ token, userId, role, fullName });
        }
      } catch {
        // Token malformado — limpiar
        sessionStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  function saveSession(data, fullName) {
    sessionStorage.setItem('cp_token',    data.token);
    sessionStorage.setItem('cp_refresh',  data.refreshToken);
    sessionStorage.setItem('cp_userId',   data.userId);
    sessionStorage.setItem('cp_role',     data.role);
    sessionStorage.setItem('cp_fullName', fullName || '');
    setUser({ token: data.token, userId: data.userId, role: data.role, fullName: fullName || '' });
  }

  async function login(email, password) {
    const data = await auth.login({ email, password });
    // Obtener nombre real del usuario
    let fullName = '';
    try {
      sessionStorage.setItem('cp_token', data.token);
      const me = await users.me();
      fullName = me?.fullName || '';
    } catch {
      // El perfil se cargará en la pantalla correspondiente si esta consulta falla.
    }
    saveSession(data, fullName);
    return data;
  }

  async function register(dto) {
    const data = await auth.register(dto);
    saveSession(data, dto.fullName || '');
    return data;
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
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
