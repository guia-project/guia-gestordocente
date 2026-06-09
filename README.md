# 🎓 Plataforma de Gestión de Guías Docentes

Plataforma integral orientada a la creación, gestión, estandarización y exportación semántica de Guías Docentes universitarias. Este sistema permite al personal docente interactuar con formularios dinámicos y exportar la información tanto en formatos visuales (PDF corporativo) como en estándares de la Web Semántica (RDF/Turtle).

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📋 Requisitos Previos

El proyecto utiliza una arquitectura agnóstica basada en contenedores. Para ejecutarlo en cualquier sistema operativo sin conflictos de dependencias, asegúrate de tener instalado:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Configuración de Variables de Entorno

Antes de levantar la infraestructura, es crítico definir la configuración de seguridad y entorno para el backend y el frontend respetando el ciclo de vida de cada tecnología.

### 1. Backend (Spring Boot)
En la raíz del proyecto, asegúrate de que el archivo `docker-compose.yml` (o un archivo `.env` adyacente) contiene las siguientes variables inyectadas:

```env
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/guiasdocentes
JWT_SECRET=tu_clave_secreta_super_segura_aqui
BACKEND_PORT=8085
```

>Puedes también definir esta clave criptográfica mediante la propiedad `jwt.secret` dentro del archivo `backend/src/main/resources/application-secret.properties`.
>
>Además, recuerda registrar la URL exacta del cliente web (ej. `http://localhost:9003`) en la lista de orígenes permitidos de la política CORS (`SecurityConfig.java`) para evitar bloqueos del navegador.

### 2. Frontend (React + Vite)
Dentro del directorio `frontend/`, crea o configura el archivo `.env`. Este archivo debe definir la ruta de conexión hacia la API del backend utilizando el puerto seleccionado:

```env
VITE_API_URL=http://localhost:8085
```

> **Importante:** Configurar esta variable correctamente garantiza que el empaquetador inyecte la ruta exacta de la API durante la fase de construcción (*build*) de la imagen estática, permitiendo una comunicación fluida entre el cliente y el servidor.

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para desplegar la plataforma completa con un solo comando:

**1. Clonar el repositorio:**
```bash
git clone https://github.com/guia-project/guia-gestordocente.git
cd guia-gestordocente
```

**2. Levantar los contenedores:**
Una vez configuradas las variables de entorno, sitúate en la raíz del proyecto (donde reside el archivo `docker-compose.yml`) y ejecuta:
```bash
docker-compose up -d --build
```

Este comando se encargará de:
* Descargar las imágenes oficiales de Node.js, OpenJDK y MongoDB.
* Construir el código fuente empaquetando las configuraciones correspondientes.
* Levantar y orquestar los tres servicios de forma segura en una red virtual interna aislada.

**3. Acceder a la plataforma:**
Al finalizar el proceso, los servicios estarán completamente operativos en:
* **Frontend (Interfaz de Usuario):** `http://localhost:9003`
* **Backend (API REST):** `http://localhost:8085`
