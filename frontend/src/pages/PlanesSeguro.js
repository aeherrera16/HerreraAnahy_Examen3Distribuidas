import React, { useState, useEffect } from 'react';
import { FiShield, FiPlus, FiEdit2, FiTrash2, FiX, FiHeart, FiTruck, FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { planesAPI } from '../services/api';

const TIPOS_SEGURO = [
    { value: 'VIDA', label: 'Vida', icon: <FiHeart />, color: '#f45c43' },
    { value: 'AUTO', label: 'Auto', icon: <FiTruck />, color: '#667eea' },
    { value: 'SALUD', label: 'Salud', icon: <FiActivity />, color: '#38ef7d' },
];

function PlanesSeguro() {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [filterTipo, setFilterTipo] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'VIDA',
        primaBase: '',
        coberturaMax: '',
    });

    useEffect(() => {
        fetchPlanes();
    }, []);

    const fetchPlanes = async () => {
        try {
            const response = await planesAPI.getAll();
            setPlanes(response.data);
        } catch (error) {
            toast.error('Error al cargar los planes de seguro');
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
                ...formData,
                primaBase: parseFloat(formData.primaBase),
                coberturaMax: parseFloat(formData.coberturaMax),
            };

            if (editingPlan) {
                await planesAPI.update(editingPlan.id, dataToSend);
                toast.success('Plan actualizado correctamente');
            } else {
                await planesAPI.create(dataToSend);
                toast.success('Plan creado correctamente');
            }
            fetchPlanes();
            closeModal();
        } catch (error) {
            const message = error.response?.data?.message || 'Error al guardar el plan';
            toast.error(message);
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            nombre: plan.nombre,
            tipo: plan.tipo,
            primaBase: plan.primaBase.toString(),
            coberturaMax: plan.coberturaMax.toString(),
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este plan?')) {
            try {
                await planesAPI.delete(id);
                toast.success('Plan eliminado correctamente');
                fetchPlanes();
            } catch (error) {
                toast.error('Error al eliminar el plan. Puede tener pólizas asociadas.');
            }
        }
    };

    const openModal = () => {
        setEditingPlan(null);
        setFormData({ nombre: '', tipo: 'VIDA', primaBase: '', coberturaMax: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlan(null);
        setFormData({ nombre: '', tipo: 'VIDA', primaBase: '', coberturaMax: '' });
    };

    const getTipoInfo = (tipo) => TIPOS_SEGURO.find(t => t.value === tipo) || TIPOS_SEGURO[0];

    const filteredPlanes = filterTipo
        ? planes.filter(plan => plan.tipo === filterTipo)
        : planes;

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
                    <FiShield /> Planes de Seguro
                </h1>
                <button className="btn btn-primary" onClick={openModal}>
                    <FiPlus /> Nuevo Plan
                </button>
            </div>

            {/* Filter Buttons */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${filterTipo === '' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilterTipo('')}
                    >
                        Todos
                    </button>
                    {TIPOS_SEGURO.map((tipo) => (
                        <button
                            key={tipo.value}
                            className={`btn ${filterTipo === tipo.value ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilterTipo(tipo.value)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {tipo.icon} {tipo.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredPlanes.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">🛡️</div>
                            <p>No hay planes registrados</p>
                        </div>
                    </div>
                ) : (
                    filteredPlanes.map((plan) => {
                        const tipoInfo = getTipoInfo(plan.tipo);
                        return (
                            <div key={plan.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg, ${tipoInfo.color}33, ${tipoInfo.color}11)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: tipoInfo.color,
                                        fontSize: '1.5rem'
                                    }}>
                                        {tipoInfo.icon}
                                    </div>
                                    <span className={`badge badge-${plan.tipo === 'VIDA' ? 'danger' : plan.tipo === 'AUTO' ? 'primary' : 'success'}`}>
                                        {plan.tipo}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    {plan.nombre}
                                </h3>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Prima Base:</span>
                                        <span style={{ fontWeight: '600' }}>${plan.primaBase?.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Cobertura Máx:</span>
                                        <span style={{ fontWeight: '600', color: tipoInfo.color }}>${plan.coberturaMax?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="btn-group" style={{ marginTop: 'auto' }}>
                                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(plan)}>
                                        <FiEdit2 /> Editar
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(plan.id)}>
                                        <FiTrash2 /> Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingPlan ? 'Editar Plan de Seguro' : 'Nuevo Plan de Seguro'}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nombre del Plan</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Plan Vida Premium"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo de Seguro</label>
                                    <select
                                        name="tipo"
                                        className="form-control form-select"
                                        value={formData.tipo}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {TIPOS_SEGURO.map((tipo) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Prima Base ($)</label>
                                        <input
                                            type="number"
                                            name="primaBase"
                                            className="form-control"
                                            value={formData.primaBase}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 50.00"
                                            step="0.01"
                                            min="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Cobertura Máxima ($)</label>
                                        <input
                                            type="number"
                                            name="coberturaMax"
                                            className="form-control"
                                            value={formData.coberturaMax}
                                            onChange={handleInputChange}
                                            placeholder="Ej: 100000.00"
                                            step="0.01"
                                            min="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPlan ? 'Actualizar' : 'Crear Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlanesSeguro;
