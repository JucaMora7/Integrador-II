import { createContext, useContext, useState, useCallback } from 'react';
import { iniciarSesion as apiLogin, registrarUsuario as apiRegistro } from '../api/auth.api';

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  try {
    const raw = localStorage.getItem('sgi_usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  const guardarSesion = useCallback((data) => {
    localStorage.setItem('sgi_token', data.token);
    localStorage.setItem('sgi_usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }, []);

  const iniciarSesion = useCallback(
    async (correo, password) => {
      const data = await apiLogin({ correo, password });
      guardarSesion(data);
      return data.usuario;
    },
    [guardarSesion]
  );

  const registrar = useCallback(
    async (datos) => {
      const data = await apiRegistro(datos);
      guardarSesion(data);
      return data.usuario;
    },
    [guardarSesion]
  );

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('sgi_token');
    localStorage.removeItem('sgi_usuario');
    setUsuario(null);
  }, []);

  const value = {
    usuario,
    estaAutenticado: Boolean(usuario),
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
