import axiosClient from './axiosClient';

export const listarProductos = (params = {}) =>
  axiosClient.get('/productos', { params }).then((r) => r.data);

export const obtenerProducto = (id) => axiosClient.get(`/productos/${id}`).then((r) => r.data);

export const crearProducto = (datos) => axiosClient.post('/productos', datos).then((r) => r.data);

export const actualizarProducto = (id, datos) =>
  axiosClient.put(`/productos/${id}`, datos).then((r) => r.data);
