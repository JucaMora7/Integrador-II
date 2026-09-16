import { useCallback, useEffect, useState } from 'react';
import { listarProductos, crearProducto, actualizarProducto } from '../api/productos.api';
import { registrarEntrada, registrarSalida } from '../api/inventario.api';
import { useToast } from '../context/ToastContext';
import ProductModal from '../components/ProductModal';

const CATEGORIAS = ['Electrónico', 'Alimento', 'Ropa', 'Herramienta', 'Otro'];

const PRODUCTO_INICIAL = { nombre: '', cantidad_actual: '', identificador: '', precio: '', categoria_nombre: '' };
const ACTUALIZAR_INICIAL = { nombre: '', precio: '', categoria_nombre: '', estado: 'activo' };

export default function InventarioPage() {
  const { mostrarToast } = useToast();

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [formRegistro, setFormRegistro] = useState(PRODUCTO_INICIAL);
  const [colapsoRegistro, setColapsoRegistro] = useState(false);

  const [busquedaActualizar, setBusquedaActualizar] = useState({ nombre: '', id: '' });
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [formActualizar, setFormActualizar] = useState(ACTUALIZAR_INICIAL);
  const [colapsoActualizar, setColapsoActualizar] = useState(false);

  const [movimiento, setMovimiento] = useState({ producto_id: '', tipo: 'entrada', cantidad: '' });

  const cargarProductos = useCallback(async () => {
    try {
      const data = await listarProductos({ limite: 200 });
      setProductos(data.productos);
    } catch (err) {
      mostrarToast('No fue posible cargar el inventario', 'error');
    }
  }, [mostrarToast]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // RF-01
  async function manejarRegistro(e) {
    e.preventDefault();
    const { nombre, cantidad_actual, precio, categoria_nombre, identificador } = formRegistro;
    if (!nombre || cantidad_actual === '' || precio === '') {
      mostrarToast('Completa nombre, cantidad y precio', 'error');
      return;
    }
    try {
      await crearProducto({
        nombre,
        cantidad_actual: Number(cantidad_actual),
        precio: Number(precio),
        categoria_nombre: categoria_nombre || undefined,
        identificador: identificador || undefined,
      });
      setFormRegistro(PRODUCTO_INICIAL);
      await cargarProductos();
      mostrarToast(`${nombre} registrado en el inventario`);
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'No fue posible registrar el producto', 'error');
    }
  }

  function buscarProductoActualizar() {
    const { nombre, id } = busquedaActualizar;
    const encontrado = productos.find(
      (p) =>
        (id && String(p.identificador || p.id).toLowerCase() === id.toLowerCase()) ||
        (nombre && p.nombre.toLowerCase().includes(nombre.toLowerCase()))
    );
    if (!encontrado) {
      mostrarToast('No se encontró ningún producto con esos datos', 'error');
      setProductoEnEdicion(null);
      return;
    }
    setProductoEnEdicion(encontrado);
    setFormActualizar({
      nombre: encontrado.nombre,
      precio: encontrado.precio,
      categoria_nombre: encontrado.Categoria?.nombre || '',
      estado: encontrado.estado,
    });
    mostrarToast(`Producto encontrado: ${encontrado.nombre}`);
  }

  // RF-05
  async function manejarActualizar(e) {
    e.preventDefault();
    if (!productoEnEdicion) {
      mostrarToast('Primero busca el producto que quieres actualizar', 'error');
      return;
    }
    try {
      await actualizarProducto(productoEnEdicion.id, {
        nombre: formActualizar.nombre,
        precio: Number(formActualizar.precio),
        categoria_nombre: formActualizar.categoria_nombre || undefined,
        estado: formActualizar.estado,
      });
      await cargarProductos();
      mostrarToast(`${formActualizar.nombre} actualizado correctamente`);
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'No fue posible actualizar el producto', 'error');
    }
  }

  // RF-03 / RF-04
  async function manejarMovimiento(e) {
    e.preventDefault();
    const { producto_id, tipo, cantidad } = movimiento;
    if (!producto_id || !cantidad || Number(cantidad) <= 0) {
      mostrarToast('Selecciona un producto e ingresa una cantidad válida', 'error');
      return;
    }
    try {
      const accion = tipo === 'entrada' ? registrarEntrada : registrarSalida;
      await accion({ producto_id: Number(producto_id), cantidad: Number(cantidad) });
      setMovimiento({ producto_id: '', tipo: 'entrada', cantidad: '' });
      await cargarProductos();
      mostrarToast(tipo === 'entrada' ? 'Entrada registrada correctamente' : 'Salida registrada correctamente');
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'No fue posible registrar el movimiento', 'error');
    }
  }

  return (
    <section>
      <h1>Registro de inventario</h1>

      <div className="inventario-top">
        <div className="panel-box" style={{ marginBottom: 0 }}>
          <div className="collapsible-header">
            <span>Registrar producto</span>
            <button type="button" onClick={() => setColapsoRegistro((c) => !c)}>
              {colapsoRegistro ? '∨' : '∧'}
            </button>
          </div>
          {!colapsoRegistro && (
            <form onSubmit={manejarRegistro}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Nombre producto"
                  value={formRegistro.nombre}
                  onChange={(e) => setFormRegistro((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Cantidad"
                  value={formRegistro.cantidad_actual}
                  onChange={(e) => setFormRegistro((f) => ({ ...f, cantidad_actual: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Identificador (opcional)"
                  value={formRegistro.identificador}
                  onChange={(e) => setFormRegistro((f) => ({ ...f, identificador: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Precio unitario ($)"
                  value={formRegistro.precio}
                  onChange={(e) => setFormRegistro((f) => ({ ...f, precio: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <select
                  className="select-input"
                  value={formRegistro.categoria_nombre}
                  onChange={(e) => setFormRegistro((f) => ({ ...f, categoria_nombre: e.target.value }))}
                >
                  <option value="">Categoría</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="btn-row">
                <button className="btn-dark" type="submit">
                  Registrar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="panel-box" style={{ marginBottom: 0 }}>
          <div className="collapsible-header">
            <span>Actualizar producto</span>
            <button type="button" onClick={() => setColapsoActualizar((c) => !c)}>
              {colapsoActualizar ? '∨' : '∧'}
            </button>
          </div>
          {!colapsoActualizar && (
            <>
              <div className="search-row" style={{ marginBottom: 10 }}>
                <input
                  className="search-input"
                  type="text"
                  placeholder="🔍  Nombre"
                  value={busquedaActualizar.nombre}
                  onChange={(e) => setBusquedaActualizar((b) => ({ ...b, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Identificador"
                  value={busquedaActualizar.id}
                  onChange={(e) => setBusquedaActualizar((b) => ({ ...b, id: e.target.value }))}
                />
              </div>
              <div className="btn-row" style={{ marginBottom: 14 }}>
                <button className="btn-secondary" type="button" onClick={buscarProductoActualizar}>
                  Buscar
                </button>
              </div>
              <form onSubmit={manejarActualizar}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Nombre producto"
                    value={formActualizar.nombre}
                    onChange={(e) => setFormActualizar((f) => ({ ...f, nombre: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Precio unitario ($)"
                    value={formActualizar.precio}
                    onChange={(e) => setFormActualizar((f) => ({ ...f, precio: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <select
                    className="select-input"
                    value={formActualizar.categoria_nombre}
                    onChange={(e) => setFormActualizar((f) => ({ ...f, categoria_nombre: e.target.value }))}
                  >
                    <option value="">Categoría</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="btn-row">
                  <button className="btn-dark" type="submit">
                    Actualizar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-box-title">Movimiento de inventario (entrada / salida)</div>
        <form onSubmit={manejarMovimiento} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 2, minWidth: 180 }}>
            <label className="form-label">Producto</label>
            <select
              className="select-input"
              value={movimiento.producto_id}
              onChange={(e) => setMovimiento((m) => ({ ...m, producto_id: e.target.value }))}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (stock: {p.cantidad_actual})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 130 }}>
            <label className="form-label">Tipo</label>
            <select
              className="select-input"
              value={movimiento.tipo}
              onChange={(e) => setMovimiento((m) => ({ ...m, tipo: e.target.value }))}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 100 }}>
            <label className="form-label">Cantidad</label>
            <input
              className="form-input"
              type="number"
              min="1"
              value={movimiento.cantidad}
              onChange={(e) => setMovimiento((m) => ({ ...m, cantidad: e.target.value }))}
            />
          </div>
          <button className="btn-dark" type="submit">
            Registrar movimiento
          </button>
        </form>
      </div>

      <div className="products-cards">
        {productos.length === 0 && <p className="empty-note">Aún no hay productos registrados.</p>}
        {productos.map((p) => {
          const bajo = p.cantidad_actual <= p.umbral_minimo;
          const estadoTexto = p.cantidad_actual === 0 ? 'Agotado' : bajo ? 'Stock bajo' : 'Normal';
          return (
            <div key={p.id} className="product-card" onClick={() => setProductoSeleccionado(p)}>
              <div className="pc-name">{p.nombre}</div>
              <div className="pc-info">
                ID: {p.identificador || p.id} · Cantidad: {p.cantidad_actual}
              </div>
              <span className={`pc-badge ${bajo ? 'low' : 'ok'}`}>{estadoTexto}</span>
            </div>
          );
        })}
      </div>

      <ProductModal producto={productoSeleccionado} onClose={() => setProductoSeleccionado(null)} />
    </section>
  );
}
