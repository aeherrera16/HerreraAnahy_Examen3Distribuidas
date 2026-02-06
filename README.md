# Sistema de Pólizas de Seguros

Sistema distribuido para gestión de pólizas de seguros con Java 17, Spring Boot 3, React, MySQL, PostgreSQL, Docker y Kubernetes.

**Estudiante:** Anahy Herrera | ESPE | 2026

---

## Endpoints API

```
GET/POST/PUT/DELETE  /api/clientes
GET/POST/PUT/DELETE  /api/planes-seguro
GET/POST/PUT/DELETE  /api/polizas
```

---

## Docker

```bash
docker-compose up --build
```

---

## Kubernetes

```bash
# Iniciar
minikube start

# Construir imágenes
docker build -t polizas-backend:v1 .
docker build -t polizas-frontend:v1 ./frontend

# Cargar en Minikube
minikube image load polizas-backend:v1
minikube image load polizas-frontend:v1

# Desplegar
kubectl apply -f k8s/config-mysql.yaml
kubectl apply -f k8s/config-postgres.yaml
sleep 30
kubectl apply -f k8s/config-backend.yaml
kubectl apply -f k8s/config-frontend.yaml

# Verificar
kubectl get pods
kubectl get services

# Acceder
minikube service polizas-frontend --url
minikube service polizas-backend --url

# Limpiar
kubectl delete -f k8s/
```

---

## Nginx

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```
