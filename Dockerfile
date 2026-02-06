# ===================================================================
# Dockerfile - Sistema de Pólizas de Seguros
# Multi-stage build para optimizar el tamaño de la imagen
# ===================================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Descargar dependencias (cacheable)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar JAR desde la etapa de build
COPY --from=builder /app/target/*.jar app.jar

# Cambiar a usuario no-root
USER spring:spring

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV MYSQL_HOST=mysql \
    MYSQL_PORT=3306 \
    MYSQL_DATABASE=polizas_db \
    MYSQL_USER=root \
    MYSQL_PASSWORD=root123 \
    SERVER_PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/clientes || exit 1

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
