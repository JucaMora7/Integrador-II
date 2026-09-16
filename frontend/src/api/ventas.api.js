import axiosClient from './axiosClient';

export const registrarVenta = (datos) => axiosClient.post('/ventas', datos).then((r) => r.data);

export const listarVentas = (params = {}) => axiosClient.get('/ventas', { params }).then((r) => r.data);
