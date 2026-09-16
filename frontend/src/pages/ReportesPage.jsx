import { useEffect, useState } from 'react';
import {
  obtenerMasVendidos,
  obtenerResumenFinanciero,
  obtenerStockBajo,
} from '../api/reportes.api';
import { formatoMoneda } from '../utils/format';

const HOY = new Date().toISOString().slice(0, 10);
const HACE_30_DIAS = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function ReportesPage() {
  const [desde, setDesde] = useState(HACE_30_DIAS);
  const [hasta, setHasta] = useState(HOY);

  const [masVendidos, setMasVendidos] = useState([]);
  const [financiero, setFinanciero] = useState(null);
  const [stockBajo, setStockBajo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const [top, resumen, bajo] = await Promise.all([
          obtenerMasVendidos({ desde, hasta, limite: 6 }),
          obtenerResumenFinanciero({ desde, hasta }),
          obtenerStockBajo(),
        ]);
        setMasVendidos(top);
        setFinanciero(resumen);
        setStockBajo(bajo);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [desde, hasta]);

  const maximoVendido = masVendidos.reduce((max, item) => Math.max(max, Number(item.unidades_vendidas)), 0) || 1;

  return (
    <section>
      <h1>Reportes</h1>

      <div className="reporte-filter">
        <label>Desde:</label>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <label>Hasta:</label>
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </div>

      <div className="reportes-grid">
        <div className="report-card">
          <div className="report-card-title">Productos más vendidos en el período</div>
          <div className="bar-chart">
            {!cargando && masVendidos.length === 0 && (
              <p className="empty-note">Sin ventas registradas en el período seleccionado.</p>
            )}
            {masVendidos.map((item) => (
              <div className="bar-row" key={item.producto_id}>
                <div className="bar-label">{item.Producto?.nombre}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(Number(item.unidades_vendidas) / maximoVendido) * 100}%` }}
                  />
                </div>
                <div className="bar-val">{item.unidades_vendidas} uds.</div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-title">Resumen financiero del período</div>
          <div className="report-summary">
            <div className="summary-row">
              <span className="sr-label">Total ventas</span>
              <span className="sr-val ingreso">{financiero ? `+ ${formatoMoneda(financiero.total_ventas)}` : '—'}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Total egresos</span>
              <span className="sr-val egreso">{financiero ? `- ${formatoMoneda(financiero.total_egresos)}` : '—'}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Balance neto</span>
              <span className="sr-val">{financiero ? formatoMoneda(financiero.balance_neto) : '—'}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Transacciones</span>
              <span className="sr-val">{financiero?.transacciones ?? '—'}</span>
            </div>
            <div className="summary-row">
              <span className="sr-label">Ticket promedio</span>
              <span className="sr-val">{financiero ? formatoMoneda(financiero.ticket_promedio) : '—'}</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-title">Productos con stock bajo</div>
          <table className="data-table" style={{ border: 'none' }}>
            <thead>
              <tr>
                <th style={{ background: 'transparent', paddingLeft: 0 }}>Producto</th>
                <th style={{ background: 'transparent' }}>ID</th>
                <th style={{ background: 'transparent', textAlign: 'right', paddingRight: 0 }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockBajo.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ paddingLeft: 0, color: '#8a8a86' }}>
                    Sin alertas de stock bajo.
                  </td>
                </tr>
              )}
              {stockBajo.map((p) => (
                <tr key={p.id}>
                  <td style={{ paddingLeft: 0 }}>{p.nombre}</td>
                  <td>{p.identificador || p.id}</td>
                  <td style={{ textAlign: 'right', paddingRight: 0, color: '#b23327', fontWeight: 600 }}>
                    {p.cantidad_actual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
