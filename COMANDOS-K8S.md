## 📋 COMANDOS BÁSICOS

# Ver versión de kubectl
kubectl version

# Ver todos los pods
kubectl get pods

# Ver todos los deployments
kubectl get deployments

# Ver todos los services
kubectl get services

# ===================================================================
## 🐳 CONSTRUIR IMÁGENES DOCKER
# ===================================================================

# Construir imagen del backend
docker build -t polizas-backend:v1 .

# Construir imagen del frontend  
docker build -t polizas-frontend:v1 ./frontend

# Ver imágenes creadas
docker images | grep polizas

# ===================================================================
## ☸️ DESPLEGAR CON kubectl apply
# ===================================================================

# Desplegar MySQL
kubectl apply -f k8s/config-mysql.yaml

# Desplegar PostgreSQL
kubectl apply -f k8s/config-postgres.yaml

# Desplegar Backend
kubectl apply -f k8s/config-backend.yaml

# Desplegar Frontend
kubectl apply -f k8s/config-frontend.yaml

# O desplegar todo de una vez
kubectl apply -f k8s/

# ===================================================================
## 🔍 MONITOREAR PODS
# ===================================================================

# Ver pods
kubectl get pods

# Describir un pod específico
kubectl describe pod <nombre-del-pod>

# Ver logs de un pod
kubectl logs <nombre-del-pod>

# Ver logs en tiempo real
kubectl logs -f <nombre-del-pod>

# ===================================================================
## 🌐 SERVICIOS Y ACCESO
# ===================================================================

# Ver servicios
kubectl get services

# Obtener URL con Minikube
minikube service polizas-frontend --url
minikube service polizas-backend --url

# ===================================================================
## 🗑️ ELIMINAR RECURSOS
# ===================================================================

# Eliminar un deployment
kubectl delete deployment mysql8

# Eliminar un service
kubectl delete service mysql8

# Eliminar todo del directorio k8s
kubectl delete -f k8s/

# ===================================================================
## 📊 EJEMPLOS COMPLETOS
# ===================================================================

### Crear deployment desde comando (dry-run para generar YAML):
kubectl create deployment mysql8 --image=mysql:8 --port=3306 --dry-run=client -o yaml > config-mysql.yaml

### Exponer deployment como servicio:
kubectl expose deployment mysql8 --port=3306 --type=ClusterIP
kubectl expose deployment polizas-backend --port=8080 --type=LoadBalancer
kubectl expose deployment polizas-frontend --port=80 --type=NodePort

# ===================================================================
## 🔄 FLUJO COMPLETO PARA EL EXAMEN
# ===================================================================

# 1. Construir imágenes Docker
docker build -t polizas-backend:v1 .
docker build -t polizas-frontend:v1 ./frontend

# 2. Iniciar Minikube (si no está iniciado)
minikube start

# 3. Cargar imágenes en Minikube
minikube image load polizas-backend:v1
minikube image load polizas-frontend:v1

# 4. Desplegar aplicación
kubectl apply -f k8s/config-mysql.yaml
kubectl apply -f k8s/config-postgres.yaml
sleep 30  # Esperar que las DBs estén listas
kubectl apply -f k8s/config-backend.yaml
kubectl apply -f k8s/config-frontend.yaml

# 5. Verificar
kubectl get pods
kubectl get services
kubectl get deployments

# 6. Obtener URLs
minikube service polizas-frontend --url
minikube service polizas-backend --url

# 7. Tomar capturas de pantalla para el reporte
kubectl get pods
kubectl get services
