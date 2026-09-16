import { useEffect, useMemo, useState } from 'react';
import { listarProductos } from '../api/productos.api';
import { registrarVenta, listarVentas } from '../api/ventas.api';
import { useToast } from '../context/ToastContext';
import { formatoMoneda, formatoFecha } from '../utils/format';

const TIPOS_VENTA = ['Venta mostrador', 'Venta por encargo', 'Venta en línea', 'Venta mayorista'];

export default function VentasPage() {
  const { mostrarToast } = useToast();
  const [tab, setTab] = useState('registro');

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaId, setBusquedaId] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoVenta, setTipoVenta] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    listarProductos({ limite: 200 })
      .then((data) => setProductos(data.productos))
      .catch(() => mostrarToast('No fue posible cargar los productos', 'error'));
  }, [mostrarToast]);

  useEffect(() => {
    if (tab === 'resumen') {
      listarVentas()
        .then(setVentas)
        .catch(() => mostrarToast('No fue posible cargar el resumen de ventas', 'error'));
    }
  }, [tab, mostrarToast]);

  const productosFiltrados = useMemo(
    () =>
      productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
          String(p.identificador || p.id).toLowerCase().includes(busquedaId.toLowerCase())
      ),
    [productos, busqueda, busquedaId]
  );

  function seleccionarProducto(p) {
    setProductoSeleccionado(p);
    setPrecio(String(p.precio));
  }

  function agregarALaLista() {
    if (!productoSeleccionado) {
      mostrarToast('Selecciona un producto', 'error');
      return;
    }
    if (!cantidad || Number(cantidad) <= 0) {
      mostrarToast('Ingresa una cantidad válida', 'error');
      return;
    }
    if (!precio || Number(precio) <= 0) {
      mostrarToast('Ingresa un precio válido', 'error');
      return;
    }
    setCarrito((c) => [
      ...c,
      {
        producto_id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        cantidad: Number(cantidad),
        precio_unitario: Number(precio),
        tipo_venta: tipoVenta || undefined,
      },
    ]);
    setProductoSeleccionado(null);
    setCantidad(1);
    setPrecio('');
  }

  const total = carrito.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);

  async function guardarVenta() {
    if (carrito.length === 0) {
      mostrarToast('Agrega al menos un producto a la lista', 'error');
      return;
    }
    setGuardando(true);
    try {
      for (const item of carrito) {
        await registrarVenta({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          tipo_venta: item.tipo_venta,
        });
      }
      setCarrito([]);
      const data = await listarProductos({ limite: 200 });
      setProductos(data.productos);
      mostrarToast('Venta registrada correctamente');
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'No fue posible guardar la venta', 'error');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <h1>Gestión de ventas</h1>
      <div className="tabs">
        <button className={`tab ${tab === 'registro' ? 'active' : ''}`} onClick={() => setTab('registro')}>
          Registro
        </button>
        <button className={`tab ${tab === 'resumen' ? 'active' : ''}`} onClick={() => setTab('resumen')}>
          Resumen de ventas
        </button>
      </div>

      {tab === 'registro' && (
        <div className="ventas-layout">
          <div>
            <div className="search-row">
              <input
                className="search-input"
                type="text"
                placeholder="🔍  Buscar producto"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <input
              className="id-input"
              type="text"
              placeholder="ID"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
            />
            <div className="products-grid">
              {productosFiltrados.length === 0 && <div className="empty-note">Sin resultados</div>}
              {productosFiltrados.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`product-btn ${productoSeleccionado?.id === p.id ? 'selected' : ''}`}
                  onClick={() => seleccionarProducto(p)}
                >
                  {p.nombre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="panel-box">
              <div className="panel-box-title">Tipo de venta</div>
              <select className="select-input" value={tipoVenta} onChange={(e) => setTipoVenta(e.target.value)}>
                <option value="">Seleccionar</option>
                {TIPOS_VENTA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-box">
              <div className="panel-box-title">Detalles de la venta</div>
              <div className="field-row">
                <label>Cantidad</label>
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
              </div>
              <div className="field-row">
                <label>Precio</label>
                <input type="text" placeholder="0" value={precio} onChange={(e) => setPrecio(e.target.value)} />
              </div>
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="btn-dark" type="button" onClick={agregarALaLista}>
                  Agregar
                </button>
              </div>
            </div>

            <div className="panel-box">
              <div className="panel-box-title">Lista</div>
              <div className="lista-venta">
                {carrito.length === 0 && <p className="empty-note">Sin productos agregados</p>}
                {carrito.map((item, idx) => (
                  <div className="lista-item" key={idx}>
                    <span className="item-name">
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span>{formatoMoneda(item.cantidad * item.precio_unitario)}</span>
                  </div>
                ))}
              </div>
              <div className="lista-total">
                <span>Total</span>
                <span>{formatoMoneda(total)}</span>
              </div>
              <div className="btn-row">
                <button className="btn-dark" type="button" onClick={guardarVenta} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'resumen' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo de venta</th>
              <th>Cantidad</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#8a8a86' }}>
                  Aún no hay ventas registradas.
                </td>
              </tr>
            )}
            {ventas.map((v) => (
              <tr key={v.id}>
                <td>{formatoFecha(v.fecha)}</td>
                <td>{v.Producto?.nombre}</td>
                <td>{v.tipo_venta || '—'}</td>
                <td>{v.cantidad}</td>
                <td className="right">{formatoMoneda(v.cantidad * v.precio_unitario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
