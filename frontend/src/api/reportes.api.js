import axiosClient from './axiosClient';

export const obtenerMasVendidos = (params = {}) =>
  axiosClient.get('/reportes/mas-vendidos', { params }).then((r) => r.data);

export const obtenerMenosVendidos = (params = {}) =>
  axiosClient.get('/reportes/menos-vendidos', { params }).then((r) => r.data);

export const obtenerResumenFinanciero = (params = {}) =>
  axiosClient.get('/reportes/resumen-financiero', { params }).then((r) => r.data);

export const obtenerStockBajo = () => axiosClient.get('/reportes/stock-bajo').then((r) => r.data);
