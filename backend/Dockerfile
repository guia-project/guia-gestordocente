# ETAPA 1: Construcción (Compilamos el código Java)
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Descargamos las dependencias primero (optimiza la caché de Docker)
RUN mvn dependency:go-offline
COPY src ./src
# Compilamos saltándonos los tests para que sea más rápido
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Preparamos el entorno de producción)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copiamos el .jar generado en la Etapa 1
COPY --from=build /app/target/*.jar app.jar
# Exponemos el puerto de Spring Boot
EXPOSE 8080
# Comando para arrancar el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]