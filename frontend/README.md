<a id="readme-top"></a>

<!--LOGO -->
<br />
<div align="center">
  <a href=#>
    <img src="src/assets/images/Logo.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">IncaCore - FrontEnd</h3>
</div>

<!-- Acerca del Proyecto -->
## Acerca de

Bienvenido al corazón visual de IncaCore, la aplicación web del presente proyecto. Esta carpeta contiene todos los componentes, estructuras y módulos que dan vida a la interfaz de usuario.

IncaCore es una aplicación que digitaliza y optimiza la gestión del mantenimiento preventivo y correctivo de la flota de embarcaciones, realiza el control de inventario de repuestos y el seguimiento de las horas de uso de los equipos.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



### Front-End construido con


* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript.org]][TypeScript-url]

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- Empezando -->
## Empezando

Estas instrucciones te guiarán para obtener una copia de este proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### 💾 Instalación

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clona el repositorio
   ```sh
   git clone https://github.com/ivanSegal/FooTalent-03.git
   ```
2. Cambiar a la carpeta frontend
   ```sh
   cd /frontend
   ```  
3. Instalar los paquetes NPM
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- ESTRUCTURA -->
## 🚀 Estructura del proyecto

- **`components/`**: Componentes reutilizables (botones, tarjetas, modales…).  
- **`layouts/`**: Plantillas de diseño y estructuras de página.  
- **`modules/`**: Lógica de dominio (registro de horas, mantenimiento, alertas…).  
- **`styles/`**: Temas, variables y utilidades de estilos (TailwindCSS, SASS…).  
- **`utils/`**: Helpers y funciones auxiliares.  
- **`assets/`**: Imágenes, fuentes y recursos estáticos.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>



<!-- RAMAS -->
## 🏷️ Guía de ramas

- **`main`**: Versión estable en producción.  
- **`develop`**: Integración continua de nuevas funcionalidades.  
- **`feature/<descripción>`**: Desarrollo de funcionalidades específicas.  
- **`hotfix/<descripción>`**: Correcciones críticas en producción.  
- **`release/<versión>`**: Preparación de versiones para `main`.

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- COMMITS -->

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
<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- FLUJO DE TRABAJO -->

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

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- DETALLES TÉCNICOS -->

## 🔄 Detalles Técnicos

**Dominio**: `https://incacore.vercel.app/`
**Puertos**: `3000`


<!-- EQUIPO -->
## 👥 Equipo Frontend

| Nombre                       | Rol                     |
|------------------------------|-------------------------|
| Alfredo Castillo             | Desarrollador Frontend  |
| Luis Angel Quispe Navarro    | Desarrollador Frontend  |
| Nataly Castañeda             | Desarrolladora Frontend |
| Massimo Boschetti            | Desarrollador Frontend |

> _“Gracias por acompañarnos en esta travesía digital. ¡Naveguemos juntos hacia un producto impecable!”_

[Next.js]: https://img.shields.io/badge/_-Next.js-black?style=flat-square&logo=nextdotjs
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/_-REACT-1F2229?style=flat-square&logo=react
[React-url]: https://reactjs.org/
[TypeScript.org]: https://img.shields.io/badge/_-TypeScript-blue?style=flat-square&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
