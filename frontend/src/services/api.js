import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===================================================================
// API de Clientes
// ===================================================================
export const clientesAPI = {
    getAll: () => api.get('/clientes'),
    getById: (id) => api.get(`/clientes/${id}`),
    create: (data) => api.post('/clientes', data),
    update: (id, data) => api.put(`/clientes/${id}`, data),
    delete: (id) => api.delete(`/clientes/${id}`),
};

// ===================================================================
// API de Planes de Seguro
// ===================================================================
export const planesAPI = {
    getAll: () => api.get('/planes-seguro'),
    getById: (id) => api.get(`/planes-seguro/${id}`),
    getByTipo: (tipo) => api.get(`/planes-seguro/tipo/${tipo}`),
    create: (data) => api.post('/planes-seguro', data),
    update: (id, data) => api.put(`/planes-seguro/${id}`, data),
    delete: (id) => api.delete(`/planes-seguro/${id}`),
};

// ===================================================================
// API de Pólizas
// ===================================================================
export const polizasAPI = {
    getAll: () => api.get('/polizas'),
    getById: (id) => api.get(`/polizas/${id}`),
    getByCliente: (clienteId) => api.get(`/polizas/cliente/${clienteId}`),
    getByPlan: (planId) => api.get(`/polizas/plan/${planId}`),
    getByEstado: (estado) => api.get(`/polizas/estado/${estado}`),
    create: (data) => api.post('/polizas', data),
    update: (id, data) => api.put(`/polizas/${id}`, data),
    cambiarEstado: (id, estado) => api.patch(`/polizas/${id}/estado`, { estado }),
    delete: (id) => api.delete(`/polizas/${id}`),
};

export default api;
