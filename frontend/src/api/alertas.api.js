import axiosClient from './axiosClient';

export const listarAlertas = () => axiosClient.get('/alertas').then((r) => r.data);

export const resolverAlerta = (id) => axiosClient.put(`/alertas/${id}/resolver`).then((r) => r.data);
