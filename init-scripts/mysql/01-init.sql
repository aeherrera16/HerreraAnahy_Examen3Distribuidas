-- ===================================================================
-- Script de inicialización para MySQL
-- Sistema de Pólizas de Seguros
-- ===================================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS polizas_db;
USE polizas_db;

-- Datos iniciales para Clientes
INSERT INTO clientes (nombres, identificacion, email, telefono) VALUES
('Juan Carlos Pérez García', '1712345678', 'juan.perez@email.com', '0991234567'),
('María Elena López Sánchez', '1723456789', 'maria.lopez@email.com', '0982345678'),
('Carlos Alberto Martínez Ruiz', '1734567890', 'carlos.martinez@email.com', '0973456789'),
('Ana Lucía Rodríguez Mora', '1745678901', 'ana.rodriguez@email.com', '0964567890'),
('Pedro José González Villa', '1756789012', 'pedro.gonzalez@email.com', '0955678901')
ON DUPLICATE KEY UPDATE nombres=nombres;

-- Datos iniciales para Planes de Seguro
INSERT INTO planes_seguro (nombre, tipo, prima_base, cobertura_max) VALUES
('Plan Vida Básico', 'VIDA', 25.00, 50000.00),
('Plan Vida Premium', 'VIDA', 75.00, 150000.00),
('Plan Auto Básico', 'AUTO', 35.00, 25000.00),
('Plan Auto Completo', 'AUTO', 85.00, 75000.00),
('Plan Salud Individual', 'SALUD', 45.00, 30000.00),
('Plan Salud Familiar', 'SALUD', 120.00, 100000.00)
ON DUPLICATE KEY UPDATE nombre=nombre;
