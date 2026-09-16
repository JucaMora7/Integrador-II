import axiosClient from './axiosClient';

export const registrarEntrada = (datos) => axiosClient.post('/inventario/entrada', datos).then((r) => r.data);

export const registrarSalida = (datos) => axiosClient.post('/inventario/salida', datos).then((r) => r.data);

export const listarMovimientos = (params = {}) =>
  axiosClient.get('/inventario/movimientos', { params }).then((r) => r.data);
