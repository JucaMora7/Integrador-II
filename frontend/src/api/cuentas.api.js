import axiosClient from './axiosClient';

export const registrarMovimientoCuenta = (datos) => axiosClient.post('/cuentas', datos).then((r) => r.data);

export const listarMovimientosCuenta = (params = {}) =>
  axiosClient.get('/cuentas', { params }).then((r) => r.data);
