# FooTalent-03

## Información acerca del proyecto
FooTalent-03 es una aplicación web que [agregar breve descripción del proyecto y su objetivo]. Cuenta con un backend desarrollado en Spring Boot y un frontend [indicar tecnología si aplica].

## Estructura del proyecto
```
/backend         # Código fuente backend (Spring Boot)
/frontend        # Código fuente frontend (si aplica)
README.md        # Documentación general del proyecto
```

## 🔧 Pasos para instalar el proyecto en forma local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ivanSegal/FooTalent-03.git
   cd FooTalent-03
   ```

2. Levantar los servicios Docker necesarios (incluyendo la base de datos en el puerto 5435):
   ```bash
   docker-compose up -d
   ```
   > **Nota:** La base de datos PostgreSQL se expone en el puerto local `5435`.

3. Ejecutar el backend con Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

4. (Opcional) Ejecutar el frontend (si existe):
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. Acceder a la aplicación en:
   - Backend: `http://localhost:8080` (o el puerto configurado)
   - Frontend: `http://localhost:3000` (o el puerto configurado)

## 🌐 Enlaces finales (producción)

- Frontend: [https://tu-dominio-frontend.com](https://tu-dominio-frontend.com)
- Backend: [https://tu-dominio-backend.com](https://tu-dominio-backend.com)

## ⚙ Detalles técnicos

- Dominio personalizado: `tudominio.com`
- Puertos abiertos:
  - Backend: 8080
  - Frontend: 3000 (si aplica)
  - Base de datos PostgreSQL: 5435 (local, via Docker)
- Comandos build:
  - Backend: `./mvnw clean package`
  - Frontend: `npm run build`
- Configuración HTTPS:
  - Certificados SSL gestionados con Let's Encrypt (si aplica)
  - Redirección HTTP a HTTPS configurada (si aplica)
- Otros detalles:
  - Docker-compose levanta servicios necesarios para la aplicación, incluyendo la base de datos PostgreSQL expuesta en el puerto 5435.

---

## 📤 Entregable

- 🌐 Link deploy backend + frontend (producción):

  - Backend: https://api.tu-dominio.com
  - Frontend: https://www.tu-dominio.com
