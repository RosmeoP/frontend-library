# Library Management System

## Overview
A modern library management system built with React and Vite. This frontend-only application provides a complete interface for managing books, loans, reservations, users, and fines in a library setting.

## Recent Changes
- **December 6, 2025**: Initial project import and Replit environment setup
  - Configured Vite to run on port 5000 with proper Replit proxy support
  - Set up development workflow
  - Configured static deployment for production

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.10.1
- **Styling**: Tailwind CSS 4.1.17
- **Data Storage**: LocalStorage (no backend)

### Project Structure
```
frontend-library/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Auth/          # Login and Register components
│   │   ├── BookCard/      # Book display card
│   │   ├── BookDetail/    # Detailed book view
│   │   ├── BookForm/      # Add/Edit book form
│   │   ├── BookList/      # List of books
│   │   ├── Header/        # Page header
│   │   ├── SearchBar/     # Search functionality
│   │   ├── Sidebar/       # Navigation sidebar
│   │   └── TopBar/        # Top navigation bar
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state management
│   │   └── BooksContext.jsx   # Books and library data management
│   ├── data/              # Mock data and utilities
│   │   ├── books.js       # Book-related data
│   │   └── libraryData.js # Full library dataset
│   ├── pages/             # Main page components
│   │   ├── Categories.jsx
│   │   ├── Fines.jsx
│   │   ├── Home.jsx
│   │   ├── Loans.jsx
│   │   ├── Reservations.jsx
│   │   └── Users.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── public/                # Static assets
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

### Key Features
- **Book Management**: Add, edit, delete, and search books
- **User Authentication**: Login and registration with localStorage
- **Loan Tracking**: Manage book loans and returns
- **Reservations**: Handle book reservations
- **Fine Management**: Automatic fine calculation for overdue returns
- **Categories**: Organize books by categories
- **User Management**: Track library users

### Data Model
The application manages the following entities (all stored in localStorage):
- `libros` (books)
- `autores` (authors)
- `editoriales` (publishers)
- `categorias` (categories)
- `autorLibro` (author-book relationships)
- `ejemplares` (book copies/instances)
- `usuarios` (users)
- `prestamos` (loans)
- `reservas` (reservations)
- `multas` (fines)

## Development

### Running Locally
The application runs on port 5000 with Vite's dev server:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Deployment
This project is configured for static deployment on Replit:
- Build command: `npm run build`
- Public directory: `dist`
- Deployment type: Static

## Configuration Notes

### Vite Configuration
The Vite config is set up for Replit's environment:
- Host: `0.0.0.0` (allows external connections)
- Port: `5000` (Replit's exposed port for web previews)
- HMR clientPort: `443` (for Replit's proxy)

### Storage
All data is persisted to browser localStorage. No backend or database is required.

## User Preferences
None documented yet.
