import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white py-4 px-6 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-3xl">📚</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
              Biblioteca Virtual
            </h1>
            <p className="text-xs text-slate-400">Tu estantería digital</p>
          </div>
        </Link>
        
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/books/new"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <span>✨</span> Agregar Libro
              </Link>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-700">
                <div className="w-9 h-9 bg-linear-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 hidden sm:block">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-4 py-2 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Comenzar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
