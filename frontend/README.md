# Incacore – Frontend

Bienvenido al corazón visual de **Incacore**, la aplicación web del presente proyecto. Esta carpeta contiene todos los componentes, estructuras y módulos que dan vida a la interfaz de usuario.

---

## 🚀 Estructura del proyecto

- **`components/`**: Componentes reutilizables (botones, tarjetas, modales…).  
- **`layouts/`**: Plantillas de diseño y estructuras de página.  
- **`modules/`**: Lógica de dominio (registro de horas, mantenimiento, alertas…).  
- **`styles/`**: Temas, variables y utilidades de estilos (TailwindCSS, SASS…).  
- **`utils/`**: Helpers y funciones auxiliares.  
- **`assets/`**: Imágenes, fuentes y recursos estáticos.

---

## 🏷️ Guía de ramas

- **`main`**: Versión estable en producción.  
- **`develop`**: Integración continua de nuevas funcionalidades.  
- **`feature/<descripción>`**: Desarrollo de funcionalidades específicas.  
- **`hotfix/<descripción>`**: Correcciones críticas en producción.  
- **`release/<versión>`**: Preparación de versiones para `main`.

---

## ✍️ Convención de commits

Usamos **Conventional Commits** para estandarizar mensajes y facilitar el historial:

```bash
<tipo>(<scope opcional>): mensaje breve
```

- **feat**: nueva funcionalidad
- **fix**: corrección de errores
- **docs**: cambios en documentación
- **style**: formato, espaciado, sin lógica
- **refactor**: refactorización de código
- **test**: añadir o modificar tests
- **chore**: tareas de mantenimiento


**Ejemplos:**

```bash
feat(auth): implementar flujo de login
fix(user): corregir validación de email vacío
docs: actualizar sección de instalación en README
```

## 🔄 Flujo de trabajo

1. **Crear rama** desde `develop`  
```bash
   git checkout develop  
   git checkout -b feature/nombre-descriptivo  
```
2. Desarrollar con commits frecuentes siguiendo la convención.  
3. **Pull Request**: abrir PR a `develop`, etiquetar revisores y describir cambios.  
4. **Merge** tras aprobación y tests verdes.  
5. **Release**: cuando `develop` esté listo, crear `release/vX.Y.Z`, probar y merge a `main`.  
6. **Hotfix**: para bugs en producción, crear `hotfix/<descripción>`, corregir, merge a `main` y luego a `develop`.  


## 👥 Equipo Frontend

| Nombre                       | Rol                     |
|------------------------------|-------------------------|
| Alfredo Castillo             | Desarrollador Frontend  |
| Luis Angel Quispe Navarro    | Desarrollador Frontend  |
| Cecilia Suarez               | Desarrolladora Frontend |
| Ingrid Paola Chaves Barbosa  | Desarrolladora Frontend |

> _“Gracias por acompañarnos en esta travesía digital. ¡Naveguemos juntos hacia un producto impecable!”_

