#!/bin/bash
# ===================================================================
# Script de Despliegue en Kubernetes - Sistema de Pólizas
# ===================================================================

echo "🚀 Iniciando despliegue del Sistema de Pólizas en Kubernetes..."
echo ""

# Verificar versión de kubectl
echo "📋 Verificando kubectl..."
kubectl version --client
echo ""

# ===================================================================
# PASO 1: Construir imágenes Docker
# ===================================================================
echo "🐳 PASO 1: Construyendo imágenes Docker..."
echo ""

# Construir imagen del backend
echo "📦 Construyendo imagen del backend..."
docker build -t polizas-backend:v1 .
echo ""

# Construir imagen del frontend
echo "📦 Construyendo imagen del frontend..."
docker build -t polizas-frontend:v1 ./frontend
echo ""

echo "✅ Imágenes Docker construidas"
echo ""

# ===================================================================
# PASO 2: Desplegar en Kubernetes
# ===================================================================
echo "☸️  PASO 2: Desplegando en Kubernetes..."
echo ""

# Aplicar configuración de MySQL
echo "📦 Desplegando MySQL..."
kubectl apply -f k8s/config-mysql.yaml
echo ""

# Aplicar configuración de PostgreSQL
echo "📦 Desplegando PostgreSQL..."
kubectl apply -f k8s/config-postgres.yaml
echo ""

# Esperar a que MySQL esté listo
echo "⏳ Esperando que MySQL esté listo (30 segundos)..."
sleep 30
echo ""

# Aplicar configuración del Backend
echo "📦 Desplegando Backend Spring Boot..."
kubectl apply -f k8s/config-backend.yaml
echo ""

# Aplicar configuración del Frontend
echo "📦 Desplegando Frontend React..."
kubectl apply -f k8s/config-frontend.yaml
echo ""

echo "✅ Despliegue completado"
echo ""

# ===================================================================
# PASO 3: Verificar estado
# ===================================================================
echo "📊 PASO 3: Verificando estado..."
echo ""

echo "📋 Deployments:"
kubectl get deployments
echo ""

echo "📋 Pods:"
kubectl get pods
echo ""

echo "📋 Services:"
kubectl get services
echo ""

# ===================================================================
# PASO 4: Obtener URLs
# ===================================================================
echo "🌐 PASO 4: URLs de acceso..."
echo ""

echo "Para acceder al frontend con Minikube:"
echo "  minikube service polizas-frontend --url"
echo ""

echo "Para acceder al backend con Minikube:"
echo "  minikube service polizas-backend --url"
echo ""

echo "🎉 ¡Despliegue exitoso!"
