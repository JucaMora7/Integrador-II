import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarProductos } from '../api/productos.api';
import { obtenerMasVendidos, obtenerMenosVendidos, obtenerResumenFinanciero } from '../api/reportes.api';
import { listarAlertas } from '../api/alertas.api';
import { StackIcon, TrendUpIcon, TrendDownIcon, WarningIcon, LogoIcon } from '../components/icons';
import { formatoMoneda } from '../utils/format';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    existenciasTotales: 0,
    masVendido: null,
    menosVendido: null,
    alertas: [],
    balanceNeto: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [{ productos, total }, masVendidos, menosVendidos, alertas, financiero] = await Promise.all([
          listarProductos({ limite: 500 }),
          obtenerMasVendidos({ limite: 1 }),
          obtenerMenosVendidos({ limite: 1 }),
          listarAlertas(),
          obtenerResumenFinanciero({}),
        ]);

        const existencias = productos.reduce((acc, p) => acc + Number(p.cantidad_actual), 0);

        setResumen({
          totalProductos: total,
          existenciasTotales: existencias,
          masVendido: masVendidos[0] || null,
          menosVendido: menosVendidos[0] || null,
          alertas,
          balanceNeto: financiero.balance_neto,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <section>
      <h1>Panel de control</h1>

      {resumen.alertas.length > 0 && (
        <div className="alert-banner">
          <span>
            ⚠ {resumen.alertas.length} producto(s) con stock crítico requieren reposición.
          </span>
          <button className="btn-secondary" onClick={() => navigate('/reportes')}>
            Ver detalle
          </button>
        </div>
      )}

      <div className="grid-2">
        <div className="card" onClick={() => navigate('/inventario')}>
          <div className="icon-box">
            <LogoIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Productos</div>
            <div className="card-value">{cargando ? '—' : resumen.totalProductos}</div>
            <div className="card-sub">Catálogo general</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/inventario')}>
          <div className="icon-box">
            <StackIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Existencias totales</div>
            <div className="card-value">{cargando ? '—' : resumen.existenciasTotales}</div>
            <div className="card-sub">Unidades en stock</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/reportes')}>
          <div className="icon-box">
            <TrendUpIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Producto más vendido</div>
            <div className="card-value">{resumen.masVendido?.Producto?.nombre || 'Sin datos'}</div>
            <div className="card-sub">
              {resumen.masVendido ? `${resumen.masVendido.unidades_vendidas} uds. vendidas` : 'Aún sin ventas registradas'}
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/reportes')}>
          <div className="icon-box">
            <TrendDownIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Producto menos vendido</div>
            <div className="card-value">{resumen.menosVendido?.Producto?.nombre || 'Sin datos'}</div>
            <div className="card-sub">
              {resumen.menosVendido ? `${resumen.menosVendido.unidades_vendidas} uds. vendidas` : 'Aún sin ventas registradas'}
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/reportes')}>
          <div className="icon-box">
            <WarningIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Producto con stock bajo</div>
            <div className="card-value">{cargando ? '—' : resumen.alertas.length}</div>
            <div className="card-sub">Requiere reposición</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/cuentas')}>
          <div className="icon-box">
            <StackIcon style={{ width: 26, height: 26, stroke: '#4a4a47', fill: 'none', strokeWidth: 1.6 }} />
          </div>
          <div className="card-text">
            <div className="card-title">Balance de cuentas</div>
            <div className="card-value">{cargando ? '—' : formatoMoneda(resumen.balanceNeto)}</div>
            <div className="card-sub">Ingresos - Egresos</div>
          </div>
        </div>
      </div>
    </section>
  );
}
