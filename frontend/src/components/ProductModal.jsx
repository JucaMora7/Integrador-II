import { LogoIcon } from './icons';
import { formatoMoneda } from '../utils/format';

export default function ProductModal({ producto, onClose }) {
  if (!producto) return null;

  const enStock = producto.cantidad_actual > producto.umbral_minimo;
  const agotado = producto.cantidad_actual === 0;
  const estadoTexto = agotado ? 'Agotado' : enStock ? 'En stock' : 'Stock bajo';
  const estadoClase = enStock ? 'stock-ok' : 'stock-low';

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-header">
          <div className="modal-icon">
            <LogoIcon style={{ width: 24, height: 24, stroke: '#fff', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div>
            <div className="modal-title">{producto.nombre}</div>
            <div className="modal-subtitle">{producto.Categoria?.nombre || 'Sin categoría'}</div>
          </div>
        </div>
        <div className="modal-row">
          <span className="mr-label">Identificador</span>
          <span className="mr-val">{producto.identificador || producto.id}</span>
        </div>
        <div className="modal-row">
          <span className="mr-label">Cantidad en stock</span>
          <span className={`mr-val ${estadoClase}`}>{producto.cantidad_actual} uds.</span>
        </div>
        <div className="modal-row">
          <span className="mr-label">Precio unitario</span>
          <span className="mr-val">{formatoMoneda(producto.precio)}</span>
        </div>
        <div className="modal-row">
          <span className="mr-label">Valor total en stock</span>
          <span className="mr-val">{formatoMoneda(producto.precio * producto.cantidad_actual)}</span>
        </div>
        <div className="modal-row">
          <span className="mr-label">Estado</span>
          <span className={`mr-val ${estadoClase}`}>{estadoTexto}</span>
        </div>
        <div className="modal-footer">
          <button className="btn-dark" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
