import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BooksProvider } from './context/BooksContext';
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
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main>{children}</main>
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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books/new" element={<BookForm />} />
              <Route path="/books/edit/:id" element={<BookForm />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/fines" element={<Fines />} />
              <Route path="/settings" element={<Home />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </BooksProvider>
    </AuthProvider>
  );
}

export default App;
