# Kubernetes - Microservicio Autor

Este proyecto despliega el microservicio de Autor con MySQL en Kubernetes, utilizando volúmenes persistentes para que los datos sobrevivan a reinicios de los pods.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Comando para verificar | Descripción |
|-------------|------------------------|-------------|
| **Docker Desktop** | `docker --version` | Contenedores y Kubernetes local |
| **kubectl** | `kubectl version` | Cliente de Kubernetes |
| **Kubernetes habilitado** | `kubectl cluster-info` | Cluster local en Docker Desktop |

### Habilitar Kubernetes en Docker Desktop:
1. Abre Docker Desktop
2. Ve a **Settings** → **Kubernetes**
3. Marca **Enable Kubernetes**
4. Click en **Apply & Restart**

---

## 🚀 Guía de Inicio Rápido

### Paso 1: Construir la imagen Docker
```bash
cd /path/to/autor
docker build -t micro-autor:v1 .
```

### Paso 2: Desplegar MySQL con volumen persistente
```bash
kubectl apply -f ./k8s/config-mysql.yaml
```

### Paso 3: Desplegar el microservicio
```bash
kubectl apply -f ./k8s/config-autor.yaml
```

### Paso 4: Verificar que todo está corriendo
```bash
kubectl get pods
```
Deberías ver algo como:
```
NAME                           READY   STATUS    RESTARTS   AGE
micro-autor-xxxxx-xxxxx        1/1     Running   0          1m
mysql8-xxxxx-xxxxx             1/1     Running   0          2m
```

### Paso 5: Exponer el servicio para acceso local
```bash
kubectl port-forward service/micro-autor-service 8001:8001
```

### Paso 6: Probar en Postman o navegador
```
GET http://localhost:8001/api/autores
```

---

## 💾 Volúmenes Persistentes (MySQL)

El archivo `config-mysql.yaml` incluye un **volumen hostPath** que permite que los datos de MySQL persistan incluso cuando el pod se elimina y recrea.

### Configuración del volumen:
```yaml
spec:
  containers:
  - name: mysql8
    image: mysql:8
    volumeMounts:
    - name: data-mysql
      mountPath: /var/lib/mysql    # Ruta dentro del contenedor
  volumes:
  - name: data-mysql
    hostPath:
      path: /var/lib/mysql         # Ruta en el nodo host
      type: DirectoryOrCreate      # Crea el directorio si no existe
```

### Probar la persistencia de datos:

1. **Crear datos de prueba:**
```bash
# Obtener el nombre del pod de MySQL
kubectl get pods -l app=mysql8

# Conectarse a MySQL
kubectl exec -it <nombre-pod-mysql> -- mysql -u root -pabcd

# Dentro de MySQL:
USE sisdb2025-autor;
CREATE TABLE prueba (id INT, nombre VARCHAR(50));
INSERT INTO prueba VALUES (1, 'test persistencia');
SELECT * FROM prueba;
EXIT;
```

2. **Eliminar el pod de MySQL:**
```bash
kubectl delete pod -l app=mysql8
```

3. **Verificar que Kubernetes recrea el pod:**
```bash
kubectl get pods
```

4. **Verificar que los datos persisten:**
```bash
kubectl exec -it <nuevo-pod-mysql> -- mysql -u root -pabcd -e "SELECT * FROM \`sisdb2025-autor\`.prueba;"
```

¡Los datos deberían seguir ahí! 🎉

---

## 📝 Comandos Útiles

### Ver estado del cluster
```bash
# Ver todos los recursos
kubectl get all

# Ver pods con más detalle
kubectl get pods -o wide

# Ver deployments
kubectl get deployments

# Ver services
kubectl get services
```

### Depuración
```bash
# Ver logs de un pod
kubectl logs <nombre-pod>

# Ver logs en tiempo real
kubectl logs -f <nombre-pod>

# Ver detalles de un pod
kubectl describe pod <nombre-pod>

# Entrar al contenedor
kubectl exec -it <nombre-pod> -- /bin/bash
```

### Reiniciar deployments
```bash
# Reiniciar un deployment específico
kubectl rollout restart deployment micro-autor
kubectl rollout restart deployment mysql8

# Eliminar y recrear todo
kubectl delete -f ./k8s/
kubectl apply -f ./k8s/config-mysql.yaml
kubectl apply -f ./k8s/config-autor.yaml
```

---

## 🧪 CRUD con Postman

**URL Base:** `http://localhost:8001/api/autores`

> ⚠️ **Importante:** Debes tener el port-forward activo:
> ```bash
> kubectl port-forward service/micro-autor-service 8001:8001
> ```

### CREATE - POST
```http
POST http://localhost:8001/api/autores
Content-Type: application/json

{
    "nombre": "Gabriel García Márquez",
    "fechaNacimiento": "1927-03-06",
    "nacionalidad": "Colombiano",
    "status": true
}
```

### READ ALL - GET
```http
GET http://localhost:8001/api/autores
```

### READ ONE - GET
```http
GET http://localhost:8001/api/autores/1
```

### UPDATE - PUT
```http
PUT http://localhost:8001/api/autores/1
Content-Type: application/json

{
    "nombre": "Gabriel García Márquez (Actualizado)",
    "fechaNacimiento": "1927-03-06",
    "nacionalidad": "Colombiano",
    "status": false
}
```

### DELETE
```http
DELETE http://localhost:8001/api/autores/1
```

---

## 🗂️ Estructura de Archivos

```
k8s/
├── README.md              # Este archivo
├── config-mysql.yaml      # Deployment + Service de MySQL con volumen
└── config-autor.yaml      # Deployment + Service del microservicio
```

---

## ❌ Eliminar Todo

Para eliminar todos los recursos de Kubernetes:
```bash
kubectl delete -f ./k8s/
```

---

## 🔧 Generar archivos YAML (referencia)

```bash
kubectl create deployment mysql8 --image=mysql:8 --port=3306 --dry-run=client -o yaml > config-mysql.yaml

kubectl create deployment micro-autor --image=micro-autor:v1 --port=8001 --dry-run=client -o yaml > config-autor.yaml
```
