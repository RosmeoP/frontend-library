import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function BookDetail({ book, onClose }) {
  const { user } = useAuth();

  if (!book) return null;

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
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Book Title & Author */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">{book.title}</h2>
        <p className="text-slate-400 text-sm">{book.author}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= 4 ? 'text-amber-400' : 'text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-slate-400 ml-2">4.8</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-700">
        <div className="text-center">
          <p className="text-lg font-bold">320</p>
          <p className="text-xs text-slate-400">Pages</p>
        </div>
        <div className="text-center border-x border-slate-700">
          <p className="text-lg font-bold">643</p>
          <p className="text-xs text-slate-400">Ratings</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">110</p>
          <p className="text-xs text-slate-400">Reviews</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 flex-1">
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-4">
          {book.description}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {user ? (
          <>
            <button
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                book.available
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              disabled={!book.available}
            >
              {book.available ? (
                <>
                  Read Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              ) : (
                'Not Available'
              )}
            </button>
            <Link
              to={`/books/edit/${book.id}`}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Book
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-all"
          >
            Sign in to Read
          </Link>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
