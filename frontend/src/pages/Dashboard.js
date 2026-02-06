import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiFileText, FiTrendingUp, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { clientesAPI, planesAPI, polizasAPI } from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        clientes: 0,
        planes: 0,
        polizas: 0,
        polizasActivas: 0,
        polizasCanceladas: 0,
    });
    const [recentPolizas, setRecentPolizas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [clientesRes, planesRes, polizasRes] = await Promise.all([
                clientesAPI.getAll(),
                planesAPI.getAll(),
                polizasAPI.getAll(),
            ]);

            const polizas = polizasRes.data;
            const polizasActivas = polizas.filter(p => p.estado === 'ACTIVA').length;
            const polizasCanceladas = polizas.filter(p => p.estado === 'CANCELADA').length;

            setStats({
                clientes: clientesRes.data.length,
                planes: planesRes.data.length,
                polizas: polizas.length,
                polizasActivas,
                polizasCanceladas,
            });

            // Obtener las últimas 5 pólizas
            setRecentPolizas(polizas.slice(-5).reverse());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
                📊 Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <FiUsers />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.clientes}</h3>
                        <p>Clientes Registrados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon info">
                        <FiShield />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.planes}</h3>
                        <p>Planes de Seguro</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon warning">
                        <FiFileText />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.polizas}</h3>
                        <p>Total de Pólizas</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.polizasActivas}</h3>
                        <p>Pólizas Activas</p>
                    </div>
                </div>
            </div>

            {/* Recent Polizas */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <span className="card-title-icon primary"><FiActivity /></span>
                        Últimas Pólizas Emitidas
                    </h2>
                </div>

                {recentPolizas.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p>No hay pólizas registradas</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Cliente</th>
                                <th>Plan</th>
                                <th>Estado</th>
                                <th>Prima Mensual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPolizas.map((poliza) => (
                                <tr key={poliza.id}>
                                    <td><strong>{poliza.numeroPoliza}</strong></td>
                                    <td>{poliza.cliente?.nombres || 'N/A'}</td>
                                    <td>{poliza.planSeguro?.nombre || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${poliza.estado === 'ACTIVA' ? 'badge-success' : 'badge-danger'}`}>
                                            {poliza.estado === 'ACTIVA' ? <FiCheckCircle /> : <FiXCircle />}
                                            {' '}{poliza.estado}
                                        </span>
                                    </td>
                                    <td>${poliza.primaMensual?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <span className="card-title-icon success"><FiTrendingUp /></span>
                            Distribución de Estados
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', padding: '1rem 0' }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38ef7d' }}>{stats.polizasActivas}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Activas</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#eb3349' }}>{stats.polizasCanceladas}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Canceladas</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <span className="card-title-icon info"><FiShield /></span>
                            Sistema de Pólizas
                        </h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                        Sistema distribuido para la gestión de pólizas de seguros.
                        Permite administrar clientes, planes de seguro y emisión de pólizas
                        con validaciones completas y persistencia en MySQL.
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>Spring Boot 3</span>
                        <span className="badge badge-info" style={{ marginRight: '0.5rem' }}>React</span>
                        <span className="badge badge-warning" style={{ marginRight: '0.5rem' }}>MySQL</span>
                        <span className="badge badge-success">Kubernetes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
