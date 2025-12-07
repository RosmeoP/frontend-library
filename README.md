# 📚 Frontend Library - Sistema de Gestión de Biblioteca

Sistema completo de gestión de biblioteca con frontend en React y backend en Node.js/Express con base de datos PostgreSQL.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **pnpm** (gestor de paquetes)
- **PostgreSQL** (versión 12 o superior)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd frontend-library
```

### 2. Instalar dependencias

```bash
npm install
```

O si usas pnpm:

```bash
pnpm install
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la URL de tu base de datos PostgreSQL:

```env
# Configuración de la base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/frontend_library

# Puerto del servidor (opcional, por defecto 5000)
PORT=5000

# Entorno (development o production)
NODE_ENV=development
```

**Ejemplo con credenciales por defecto:**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/frontend_library
PORT=5000
NODE_ENV=development
```

### 2. Inicializar la Base de Datos

Ejecuta el archivo `schema.sql` en tu base de datos PostgreSQL para crear las tablas necesarias:

```bash
psql -U postgres -d frontend_library -f schema.sql
```

## 🏃‍♂️ Cómo Ejecutar el Proyecto

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo, necesitas correr **dos terminales**:

#### Terminal 1 - Backend (Servidor API)

```bash
npm run server
```

El servidor backend estará disponible en: `http://localhost:5000`

#### Terminal 2 - Frontend (Interfaz de usuario)

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173` (puerto por defecto de Vite)

### Modo Producción

Para ejecutar el proyecto en producción:

#### 1. Construir el frontend

```bash
npm run build
```

#### 2. Iniciar el servidor en modo producción

```bash
npm start
```

El servidor servirá tanto el API como los archivos estáticos del frontend en el puerto configurado (por defecto 5000).

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo de Vite (frontend) |
| `npm run server` | Inicia el servidor backend (API) |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |
| `npm run preview` | Previsualiza la versión de producción localmente |

## 🏗️ Estructura del Proyecto

```
frontend-library/
├── server/              # Backend (Express + Node.js)
│   ├── db/             # Configuración de base de datos
│   ├── routes/         # Rutas del API
│   ├── middleware/     # Middlewares personalizados
│   └── index.js        # Punto de entrada del servidor
├── src/                # Frontend (React)
│   ├── components/     # Componentes de React
│   ├── pages/          # Páginas de la aplicación
│   └── ...
├── public/             # Archivos estáticos públicos
├── schema.sql          # Esquema de la base de datos
├── .env                # Variables de entorno (no incluido en git)
└── package.json        # Dependencias y scripts
```

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Herramienta de construcción
- **Tailwind CSS 4** - Framework de estilos CSS
- **React Router DOM** - Enrutamiento

### Backend
- **Express 5** - Framework web para Node.js
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente de PostgreSQL para Node.js
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Manejo de CORS
- **dotenv** - Gestión de variables de entorno

## ❗ Solución de Problemas

### Error: "DATABASE_URL not set"

Asegúrate de haber creado el archivo `.env` con la variable `DATABASE_URL` configurada correctamente.

### Error de conexión a PostgreSQL

Verifica que:
- PostgreSQL esté ejecutándose: `sudo service postgresql status` (Linux) o `brew services list` (macOS)
- La URL de conexión en `DATABASE_URL` sea correcta (usuario, contraseña, host, puerto y nombre de base de datos)
- Hayas ejecutado el archivo `schema.sql` para crear las tablas

### Puerto 5000 o 5173 ya en uso

Si algún puerto está ocupado, puedes:
- Cambiar el puerto del backend en el archivo `.env`: `PORT=3000`
- Vite te preguntará automáticamente si quieres usar otro puerto

### Errores al instalar dependencias

Intenta limpiar la caché y reinstalar:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Adicionales

- El proyecto usa **ESM** (ECMAScript Modules) - todos los imports usan la sintaxis `import/export`
- El servidor backend y el frontend se ejecutan en puertos separados en desarrollo
- En producción, Express sirve los archivos estáticos del frontend construido

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Ejecuta el linter: `npm run lint`
4. Haz commit de tus cambios: `git commit -m "Descripción del cambio"`
5. Push a la rama: `git push origin feature/nueva-funcionalidad`

---

¿Necesitas ayuda? Revisa la documentación o abre un issue en el repositorio.
