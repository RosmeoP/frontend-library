# Library Management System

## Overview
A modern library management system built with React and Vite frontend, Express.js backend, and PostgreSQL database. The application provides a complete interface for managing books, loans, reservations, users, and fines in a library setting.

## Recent Changes
- **December 6, 2025**: Added Express.js backend with PostgreSQL integration
  - Created RESTful API endpoints for all entities (books, users, loans, reservations, fines, categories, authors, publishers)
  - Connected frontend to backend via Vite proxy
  - Backend uses stored procedures, triggers, and views from the PostgreSQL database
  - Updated BooksContext and AuthContext to use API calls instead of localStorage

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.10.1
- **Styling**: Tailwind CSS 4.1.17
- **Backend**: Express.js 5.2.1
- **Database**: PostgreSQL (via pg driver)
- **Authentication**: bcryptjs for password hashing

### Project Structure
```
frontend-library/
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state management (API-based)
│   │   └── BooksContext.jsx   # Books and library data management (API-based)
│   ├── services/           # API service layer
│   │   └── api.js          # API client for backend communication
│   ├── pages/              # Main page components
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Application entry point
├── server/
│   ├── index.js            # Express server entry point (port 3001)
│   ├── db/
│   │   └── index.js        # PostgreSQL connection pool
│   └── routes/             # API route handlers
│       ├── books.js        # Books CRUD + search via stored procedures
│       ├── users.js        # Users CRUD + history via sp_obtener_historial_usuario
│       ├── loans.js        # Loans using sp_registrar_prestamo, sp_devolver_libro, sp_renovar_prestamo
│       ├── reservations.js # Reservations CRUD
│       ├── fines.js        # Fines + sp_calcular_multa
│       ├── categories.js   # Categories CRUD
│       ├── authors.js      # Authors CRUD
│       ├── publishers.js   # Publishers CRUD
│       ├── stats.js        # Dashboard stats using database views
│       └── auth.js         # Login/register with bcrypt
├── vite.config.js          # Vite config with API proxy to localhost:3001
└── package.json            # Dependencies and scripts
```

### Database Schema
The PostgreSQL database includes:

**Tables:**
- `libros` (id_libro, titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis)
- `autor` (id_autor, nombres, apellidos, nacionalidad)
- `autor_libro` (id_autor, id_libro)
- `categoria` (id_categoria, nombre, descripcion)
- `editorial` (id_editorial, nombre, pais, email_contacto)
- `ejemplar` (id_ejemplar, id_libro, codigo_barras, estado, nota_estado)
- `usuario` (id_usuario, carnet, nombre, apellido, email, telefono, tipo_usuario, estado, password_hash, direccion, fecha_registro)
- `prestamos` (id_prestamo, id_ejemplar, id_usuario, fecha_prestamo, fecha_devolucion_esperada, fecha_devuelto, estado_prestamo)
- `reservas` (id_reserva, id_libro, id_usuario, fecha_solicitud, estado)
- `multas` (id_multa, id_prestamo, monto, pagado, fecha_pago)

**Stored Procedures:**
- `sp_registrar_prestamo(id_usuario, id_ejemplar, dias_prestamo)` - Create a new loan
- `sp_devolver_libro(id_prestamo)` - Return a book (triggers fine creation if overdue)
- `sp_renovar_prestamo(id_prestamo, dias_adicionales)` - Renew a loan
- `sp_calcular_multa(id_prestamo)` - Calculate fine for a loan
- `sp_buscar_libros_disponibles(term)` - Search available books
- `sp_obtener_historial_usuario(id_usuario)` - Get user's loan history

**Views:**
- `vw_libros_disponibles` - Available books
- `vw_prestamos_activos` - Active loans
- `vw_prestamos_vencidos` - Overdue loans
- `vw_usuarios_con_multas` - Users with unpaid fines
- `vw_estadisticas_prestamos` - Loan statistics
- `vw_catalogo_completo` - Complete catalog

**Triggers:**
- `trg_validar_disponibilidad` - Validates book copy availability
- `trg_validar_usuario_activo` - Validates user is active
- `trg_actualizar_estado_ejemplar_al_prestar` - Updates copy status when borrowed
- `trg_actualizar_estado_ejemplar_al_devolver` - Updates copy status when returned
- `trg_crear_multa_por_retraso` - Creates fine for overdue returns

### Key Features
- **Book Management**: Add, edit, delete, and search books via database
- **User Authentication**: API-based login and registration with bcrypt
- **Loan Tracking**: Manage book loans using stored procedures with automatic triggers
- **Reservations**: Handle book reservations
- **Fine Management**: Automatic fine creation via database triggers
- **Categories**: Organize books by categories
- **User Management**: Track library users

## Development

### Running Locally
Start both the backend API server and frontend:
```bash
npm run server  # Runs Express on port 3001
npm run dev     # Runs Vite on port 5000
```

### Workflows
- **API Server**: `npm run server` - Express backend on port 3001
- **Start application**: `npm run dev` - Vite frontend on port 5000

### API Endpoints
All endpoints are prefixed with `/api`:
- `GET/POST /api/books` - Books CRUD
- `GET /api/books/available` - Available books (uses view)
- `GET /api/books/search?term=` - Search (uses stored procedure)
- `GET/POST/PUT/DELETE /api/users` - Users CRUD
- `GET /api/users/:id/history` - User history (uses stored procedure)
- `GET/POST /api/loans` - Loans
- `POST /api/loans/:id/return` - Return book (uses stored procedure)
- `POST /api/loans/:id/renew` - Renew loan (uses stored procedure)
- `GET /api/loans/active` - Active loans (uses view)
- `GET /api/loans/overdue` - Overdue loans (uses view)
- `GET/POST /api/reservations` - Reservations
- `GET /api/fines` - Fines
- `PUT /api/fines/:id/pay` - Mark fine as paid
- `GET /api/stats/dashboard` - Dashboard statistics

## Configuration Notes

### Vite Configuration
- Host: `0.0.0.0`
- Port: `5000`
- Proxy: `/api` requests forwarded to `http://localhost:3001`
- HMR clientPort: `443`

### Database Connection
Uses `DATABASE_URL` environment variable for PostgreSQL connection.

## User Preferences
None documented yet.
