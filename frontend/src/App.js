import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiHome, FiUsers, FiShield, FiFileText } from 'react-icons/fi';

import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import PlanesSeguro from './pages/PlanesSeguro';
import Polizas from './pages/Polizas';

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-content">
                        <NavLink to="/" className="navbar-brand">
                            <div className="navbar-logo">PS</div>
                            <span className="navbar-title">Sistema de Pólizas</span>
                        </NavLink>

                        <ul className="navbar-nav">
                            <li>
                                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                                    <FiHome /> Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/clientes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <FiUsers /> Clientes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/planes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <FiShield /> Planes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/polizas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <FiFileText /> Pólizas
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/planes" element={<PlanesSeguro />} />
                        <Route path="/polizas" element={<Polizas />} />
                    </Routes>
                </main>

                {/* Toast Notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </Router>
    );
}

export default App;
