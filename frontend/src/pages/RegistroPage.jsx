import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoIcon } from '../components/icons';

const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  correo: '',
  password: '',
  confirmar: '',
  empresa: '',
};

export default function RegistroPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function actualizarCampo(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      await registrar({
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        password: form.password,
        empresa: form.empresa,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible crear la cuenta');
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
          <p>Crea tu cuenta para comenzar</p>
        </div>
        <h3>Registro</h3>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" type="text" placeholder="Miguel" value={form.nombre} onChange={actualizarCampo('nombre')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input className="form-input" type="text" placeholder="García" value={form.apellido} onChange={actualizarCampo('apellido')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input className="form-input" type="email" placeholder="usuario@empresa.com" value={form.correo} onChange={actualizarCampo('correo')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={actualizarCampo('password')} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.confirmar} onChange={actualizarCampo('confirmar')} required minLength={6} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Empresa / Negocio</label>
            <input className="form-input" type="text" placeholder="Nombre de tu negocio" value={form.empresa} onChange={actualizarCampo('empresa')} />
          </div>
          <button className="btn-primary" type="submit" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
