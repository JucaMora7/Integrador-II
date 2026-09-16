import axiosClient from './axiosClient';

export const registrarUsuario = (datos) => axiosClient.post('/auth/registro', datos).then((r) => r.data);

export const iniciarSesion = (datos) => axiosClient.post('/auth/login', datos).then((r) => r.data);

export const obtenerPerfil = () => axiosClient.get('/auth/perfil').then((r) => r.data);
