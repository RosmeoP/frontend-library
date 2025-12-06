import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Loans from './pages/Loans';
import Reservations from './pages/Reservations';
import Users from './pages/Users';
import Fines from './pages/Fines';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookForm from './components/BookForm/BookForm';

function AppLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BooksProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/books/new" element={<AdminRoute><BookForm /></AdminRoute>} />
              <Route path="/books/edit/:id" element={<AdminRoute><BookForm /></AdminRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
              <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
              <Route path="/fines" element={<AdminRoute><Fines /></AdminRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </BooksProvider>
    </AuthProvider>
  );
}

export default App;
