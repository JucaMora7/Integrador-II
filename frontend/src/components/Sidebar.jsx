import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon } from './icons';

const ITEMS = [
  { to: '/dashboard', label: 'Panel de control' },
  { to: '/ventas', label: 'Gestión de ventas' },
  { to: '/inventario', label: 'Registro de inventario' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/cuentas', label: 'Cuentas básicas' },
];

export default function Sidebar() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <aside className="sidebar">
      <div className="user-block">
        <div className="avatar">
          <UserIcon />
        </div>
        <div>
          <div className="user-name">
            {usuario ? `${usuario.nombre}${usuario.apellido ? ' ' + usuario.apellido : ''}` : 'Invitado'}
          </div>
          <div className="user-email">{usuario?.correo}</div>
        </div>
      </div>
      <div>
        <div className="nav-label">Menú de navegación</div>
        <nav className="nav-list">
          {ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <button className="logout-btn" type="button" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
