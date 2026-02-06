import React, { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { clientesAPI } from '../services/api';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nombres: '',
        identificacion: '',
        email: '',
        telefono: '',
    });

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await clientesAPI.getAll();
            setClientes(response.data);
        } catch (error) {
            toast.error('Error al cargar los clientes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCliente) {
                await clientesAPI.update(editingCliente.id, formData);
                toast.success('Cliente actualizado correctamente');
            } else {
                await clientesAPI.create(formData);
                toast.success('Cliente creado correctamente');
            }
            fetchClientes();
            closeModal();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al guardar el cliente';
            toast.error(message);
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setFormData({
            nombres: cliente.nombres,
            identificacion: cliente.identificacion,
            email: cliente.email,
            telefono: cliente.telefono,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                await clientesAPI.delete(id);
                toast.success('Cliente eliminado correctamente');
                fetchClientes();
            } catch (error) {
                toast.error('Error al eliminar el cliente. Puede tener pólizas asociadas.');
            }
        }
    };

    const openModal = () => {
        setEditingCliente(null);
        setFormData({ nombres: '', identificacion: '', email: '', telefono: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCliente(null);
        setFormData({ nombres: '', identificacion: '', email: '', telefono: '' });
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.identificacion.includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FiUsers /> Gestión de Clientes
                </h1>
                <button className="btn btn-primary" onClick={openModal}>
                    <FiPlus /> Nuevo Cliente
                </button>
            </div>

            {/* Search */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FiSearch style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, identificación o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none' }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <span className="card-title-icon primary"><FiUsers /></span>
                        Lista de Clientes ({filteredClientes.length})
                    </h2>
                </div>

                {filteredClientes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <p>No hay clientes registrados</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombres</th>
                                <th>Identificación</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td><strong>{cliente.nombres}</strong></td>
                                    <td>{cliente.identificacion}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>
                                        <div className="btn-group">
                                            <button className="btn btn-warning btn-icon" onClick={() => handleEdit(cliente)} title="Editar">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn btn-danger btn-icon" onClick={() => handleDelete(cliente.id)} title="Eliminar">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nombres Completos</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        className="form-control"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Juan Carlos Pérez García"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Identificación (Cédula/RUC)</label>
                                    <input
                                        type="text"
                                        name="identificacion"
                                        className="form-control"
                                        value={formData.identificacion}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 1712345678"
                                        required
                                        minLength="10"
                                        maxLength="13"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Ej: juan.perez@email.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono (10 dígitos)</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        className="form-control"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 0991234567"
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCliente ? 'Actualizar' : 'Crear Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Clientes;
