import { useEffect, useState } from 'react';
import { registrarMovimientoCuenta, listarMovimientosCuenta } from '../api/cuentas.api';
import { useToast } from '../context/ToastContext';
import { formatoMoneda, formatoFecha } from '../utils/format';

const FORM_INICIAL = { concepto: '', valor: '', fecha: new Date().toISOString().slice(0, 10) };

export default function CuentasPage() {
  const { mostrarToast } = useToast();
  const [tab, setTab] = useState('registro');
  const [tipo, setTipo] = useState('ingreso');
  const [form, setForm] = useState(FORM_INICIAL);
  const [movimientos, setMovimientos] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (tab === 'resumen') {
      listarMovimientosCuenta()
        .then(setMovimientos)
        .catch(() => mostrarToast('No fue posible cargar los movimientos', 'error'));
    }
  }, [tab, mostrarToast]);

  // RF-08
  async function manejarRegistro(e) {
    e.preventDefault();
    if (!form.concepto || !form.valor) {
      mostrarToast('Completa el concepto y el valor', 'error');
      return;
    }
    setGuardando(true);
    try {
      await registrarMovimientoCuenta({
        tipo,
        concepto: form.concepto,
        valor: Number(form.valor),
        fecha: form.fecha,
      });
      setForm(FORM_INICIAL);
      mostrarToast(tipo === 'ingreso' ? 'Ingreso registrado correctamente' : 'Egreso registrado correctamente');
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'No fue posible registrar el movimiento', 'error');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <h1>Cuentas básicas</h1>
      <div className="tabs">
        <button className={`tab ${tab === 'registro' ? 'active' : ''}`} onClick={() => setTab('registro')}>
          Registro
        </button>
        <button className={`tab ${tab === 'resumen' ? 'active' : ''}`} onClick={() => setTab('resumen')}>
          Listado de movimientos registrados
        </button>
      </div>

      {tab === 'registro' && (
        <div className="cuentas-panel">
          <div className="panel-title">Registrar movimiento</div>
          <form onSubmit={manejarRegistro}>
            <div className="field-block">
              <span className="field-label">Tipo</span>
              <div className="segmented">
                <button
                  type="button"
                  className={`segment ingreso ${tipo === 'ingreso' ? 'active' : ''}`}
                  onClick={() => setTipo('ingreso')}
                >
                  Ingreso
                </button>
                <button
                  type="button"
                  className={`segment egreso ${tipo === 'egreso' ? 'active' : ''}`}
                  onClick={() => setTipo('egreso')}
                >
                  Egreso
                </button>
              </div>
            </div>
            <div className="field-block">
              <span className="field-label">Concepto</span>
              <input
                className="form-input"
                type="text"
                placeholder="Ej. Pago proveedor, venta mostrador..."
                value={form.concepto}
                onChange={(e) => setForm((f) => ({ ...f, concepto: e.target.value }))}
              />
            </div>
            <div className="field-block">
              <span className="field-label">Valor</span>
              <input
                className="form-input"
                type="number"
                placeholder="$ 0"
                value={form.valor}
                onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
              />
            </div>
            <div className="field-block">
              <span className="field-label">Fecha</span>
              <input
                className="form-input"
                type="date"
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
              />
            </div>
            <div className="btn-row">
              <button className="btn-dark" type="submit" disabled={guardando}>
                {guardando ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'resumen' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Concepto</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#8a8a86' }}>
                  Aún no hay movimientos registrados.
                </td>
              </tr>
            )}
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td>{formatoFecha(m.fecha)}</td>
                <td>
                  <span className={`tag ${m.tipo}`}>{m.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</span>
                </td>
                <td>{m.concepto}</td>
                <td className={`amount-cell ${m.tipo}`}>
                  {m.tipo === 'ingreso' ? '+' : '-'} {formatoMoneda(m.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
