import React, { useState, useEffect } from 'react';
import { FiFileText, FiPlus, FiEdit2, FiTrash2, FiX, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { polizasAPI, clientesAPI, planesAPI } from '../services/api';

function Polizas() {
    const [polizas, setPolizas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPoliza, setEditingPoliza] = useState(null);
    const [filterEstado, setFilterEstado] = useState('');
    const [formData, setFormData] = useState({
        numeroPoliza: '',
        fechaInicio: '',
        fechaFin: '',
        primaMensual: '',
        estado: 'ACTIVA',
        clienteId: '',
        planSeguroId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [polizasRes, clientesRes, planesRes] = await Promise.all([
                polizasAPI.getAll(),
                clientesAPI.getAll(),
                planesAPI.getAll(),
            ]);
            setPolizas(polizasRes.data);
            setClientes(clientesRes.data);
            setPlanes(planesRes.data);
        } catch (error) {
            toast.error('Error al cargar los datos');
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
            const dataToSend = {
                numeroPoliza: formData.numeroPoliza,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin,
                primaMensual: parseFloat(formData.primaMensual),
                estado: formData.estado,
                cliente: { id: parseInt(formData.clienteId) },
                planSeguro: { id: parseInt(formData.planSeguroId) },
            };

            if (editingPoliza) {
                await polizasAPI.update(editingPoliza.id, dataToSend);
                toast.success('Póliza actualizada correctamente');
            } else {
                await polizasAPI.create(dataToSend);
                toast.success('Póliza emitida correctamente');
            }
            fetchData();
            closeModal();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al guardar la póliza';
            toast.error(message);
        }
    };

    const handleEdit = (poliza) => {
        setEditingPoliza(poliza);
        setFormData({
            numeroPoliza: poliza.numeroPoliza,
            fechaInicio: poliza.fechaInicio,
            fechaFin: poliza.fechaFin,
            primaMensual: poliza.primaMensual.toString(),
            estado: poliza.estado,
            clienteId: poliza.cliente?.id?.toString() || '',
            planSeguroId: poliza.planSeguro?.id?.toString() || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta póliza?')) {
            try {
                await polizasAPI.delete(id);
                toast.success('Póliza eliminada correctamente');
                fetchData();
            } catch (error) {
                toast.error('Error al eliminar la póliza');
            }
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            await polizasAPI.cambiarEstado(id, nuevoEstado);
            toast.success(`Póliza ${nuevoEstado === 'ACTIVA' ? 'activada' : 'cancelada'} correctamente`);
            fetchData();
        } catch (error) {
            toast.error('Error al cambiar el estado de la póliza');
        }
    };

    const openModal = () => {
        setEditingPoliza(null);
        setFormData({
            numeroPoliza: `POL-${Date.now().toString().slice(-8)}`,
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: '',
            primaMensual: '',
            estado: 'ACTIVA',
            clienteId: '',
            planSeguroId: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPoliza(null);
    };

    const filteredPolizas = filterEstado
        ? polizas.filter(p => p.estado === filterEstado)
        : polizas;

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
                    <FiFileText /> Gestión de Pólizas
                </h1>
                <button className="btn btn-primary" onClick={openModal}>
                    <FiPlus /> Emitir Póliza
                </button>
            </div>

            {/* Filter */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FiFilter style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Filtrar por estado:</span>
                    <button
                        className={`btn btn-sm ${filterEstado === '' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilterEstado('')}
                    >
                        Todas
                    </button>
                    <button
                        className={`btn btn-sm ${filterEstado === 'ACTIVA' ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => setFilterEstado('ACTIVA')}
                    >
                        <FiCheckCircle /> Activas
                    </button>
                    <button
                        className={`btn btn-sm ${filterEstado === 'CANCELADA' ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => setFilterEstado('CANCELADA')}
                    >
                        <FiXCircle /> Canceladas
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <span className="card-title-icon primary"><FiFileText /></span>
                        Pólizas Emitidas ({filteredPolizas.length})
                    </h2>
                </div>

                {filteredPolizas.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p>No hay pólizas registradas</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>Cliente</th>
                                    <th>Plan</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Prima Mensual</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPolizas.map((poliza) => (
                                    <tr key={poliza.id}>
                                        <td><strong>{poliza.numeroPoliza}</strong></td>
                                        <td>{poliza.cliente?.nombres || 'N/A'}</td>
                                        <td>
                                            <span className={`badge badge-${poliza.planSeguro?.tipo === 'VIDA' ? 'danger' :
                                                    poliza.planSeguro?.tipo === 'AUTO' ? 'primary' : 'success'
                                                }`}>
                                                {poliza.planSeguro?.tipo}
                                            </span>
                                            <br />
                                            <small style={{ color: 'var(--text-muted)' }}>{poliza.planSeguro?.nombre}</small>
                                        </td>
                                        <td>{poliza.fechaInicio}</td>
                                        <td>{poliza.fechaFin}</td>
                                        <td><strong>${poliza.primaMensual?.toFixed(2)}</strong></td>
                                        <td>
                                            <span className={`badge ${poliza.estado === 'ACTIVA' ? 'badge-success' : 'badge-danger'}`}>
                                                {poliza.estado === 'ACTIVA' ? <FiCheckCircle /> : <FiXCircle />}
                                                {' '}{poliza.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                {poliza.estado === 'ACTIVA' ? (
                                                    <button
                                                        className="btn btn-danger btn-icon"
                                                        onClick={() => handleCambiarEstado(poliza.id, 'CANCELADA')}
                                                        title="Cancelar Póliza"
                                                    >
                                                        <FiXCircle />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-success btn-icon"
                                                        onClick={() => handleCambiarEstado(poliza.id, 'ACTIVA')}
                                                        title="Activar Póliza"
                                                    >
                                                        <FiCheckCircle />
                                                    </button>
                                                )}
                                                <button className="btn btn-warning btn-icon" onClick={() => handleEdit(poliza)} title="Editar">
                                                    <FiEdit2 />
                                                </button>
                                                <button className="btn btn-danger btn-icon" onClick={() => handleDelete(poliza.id)} title="Eliminar">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingPoliza ? 'Editar Póliza' : 'Emitir Nueva Póliza'}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Número de Póliza</label>
                                    <input
                                        type="text"
                                        name="numeroPoliza"
                                        className="form-control"
                                        value={formData.numeroPoliza}
                                        onChange={handleInputChange}
                                        placeholder="Ej: POL-12345678"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Cliente</label>
                                        <select
                                            name="clienteId"
                                            className="form-control form-select"
                                            value={formData.clienteId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar cliente...</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nombres} ({cliente.identificacion})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Plan de Seguro</label>
                                        <select
                                            name="planSeguroId"
                                            className="form-control form-select"
                                            value={formData.planSeguroId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar plan...</option>
                                            {planes.map((plan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.nombre} ({plan.tipo}) - ${plan.primaBase}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            name="fechaInicio"
                                            className="form-control"
                                            value={formData.fechaInicio}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            name="fechaFin"
                                            className="form-control"
                                            value={formData.fechaFin}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Prima Mensual ($)</label>
                                        <input
                                            type="number"
                                            name="primaMensual"
                                            className="form-control"
                                            value={formData.primaMensual}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 75.50"
                                            step="0.01"
                                            min="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Estado</label>
                                        <select
                                            name="estado"
                                            className="form-control form-select"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="ACTIVA">Activa</option>
                                            <option value="CANCELADA">Cancelada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPoliza ? 'Actualizar' : 'Emitir Póliza'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Polizas;
