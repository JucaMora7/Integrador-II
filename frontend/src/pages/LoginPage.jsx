import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/icons';

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    if (!correo || !password) {
      setError('Ingresa tu correo y contraseña');
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion(correo, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">
            <LogoIcon style={{ width: 28, height: 28, stroke: '#fff', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <h2>Gestión Comercial</h2>
          <p>Accede a tu panel de control</p>
        </div>
        <h3>Iniciar sesión</h3>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              placeholder="usuario@empresa.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        <hr className="divider" />
        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
