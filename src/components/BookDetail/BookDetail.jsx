import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function BookDetail({ book, onClose }) {
  const { user, isAdmin } = useAuth();

  if (!book) return null;

  // Support both old and new data structure
  const title = book.titulo || book.title;
  const author = book.autorNombre || book.author;
  const cover = book.portada || book.cover;
  const description = book.sinopsis || book.description;
  const id = book.id_libro || book.id;
  const disponible = book.disponible ?? book.available;
  const ejemplaresDisponibles = book.ejemplaresDisponibles ?? (book.available ? 1 : 0);
  const totalEjemplares = book.totalEjemplares ?? 1;
  const categoria = book.categoriaNombre || book.categoria_nombre || book.genre;
  const editorial = book.editorialNombre || book.editorial_nombre || 'Unknown';
  const anio = book.anio_edicion || book.anoedicion || book.year;
  const isbn = book.ISBN || book.isbn || 'N/A';

  return (
    <div className="w-80 bg-linear-to-b from-slate-800 to-slate-900 rounded-3xl p-6 text-white flex flex-col h-full overflow-y-auto shrink-0">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Book Cover */}
      <div className="relative mx-auto mb-6">
        <div className="w-44 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Availability badge */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
          disponible 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {disponible ? 'Disponible' : 'No disponible'}
        </div>
      </div>

      {/* Book Title & Author */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-slate-400 text-sm">{author}</p>
      </div>

      {/* Category Badge */}
      <div className="flex justify-center mb-4">
        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">
          {categoria}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-700">
        <div className="text-center">
          <p className="text-lg font-bold">{anio}</p>
          <p className="text-xs text-slate-400">Año</p>
        </div>
        <div className="text-center border-x border-slate-700">
          <p className="text-lg font-bold">{ejemplaresDisponibles}/{totalEjemplares}</p>
          <p className="text-xs text-slate-400">Ejemplares</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{disponible ? 'Sí' : 'No'}</p>
          <p className="text-xs text-slate-400">Disponible</p>
        </div>
      </div>

      {/* Book Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Editorial</span>
          <span className="text-slate-200">{editorial}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">ISBN</span>
          <span className="text-slate-200 text-xs">{isbn}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 flex-1">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Sinopsis</h4>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {user ? (
          <>
            <button
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                disponible
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              disabled={!disponible}
            >
              {disponible ? (
                <>
                  Solicitar Préstamo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              ) : (
                'No Disponible'
              )}
            </button>
            {isAdmin() && (
              <Link
                to={`/books/edit/${id}`}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Libro
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-all"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
