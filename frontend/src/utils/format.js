export function formatoMoneda(valor) {
  const numero = Number(valor) || 0;
  return `${Math.round(numero).toLocaleString('es-CO')} $`;
}

export function formatoFecha(valor) {
  if (!valor) return '—';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
