import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const [nombre, ...apellidoParts] = name.split(' ');
    const apellido = apellidoParts.join(' ') || nombre;
    
    const result = await register({
      nombre,
      apellido,
      email,
      password,
      tipo_usuario: 'Estudiante'
    });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">BookBase</span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Comienza tu aventura de lectura hoy
          </h1>
          <p className="text-slate-400 text-lg">
            Únete a miles de lectores. Crea tu cuenta y descubre libros increíbles.
          </p>
        </div>
        <p className="text-slate-500 text-sm">© 2025 BookBase. Todos los derechos reservados.</p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📖</span>
              </div>
              <span className="text-xl font-bold text-slate-900">BookBase</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Crear cuenta</h2>
            <p className="text-slate-500 mt-2">Únete a nuestra comunidad de amantes de los libros</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all"
                placeholder="tu@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all"
                placeholder="Confirma tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all mt-2"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-slate-900 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
