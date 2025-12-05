import { useAuth } from '../../context/AuthContext';
import { useBooks } from '../../context/BooksContext';

function BookCard({ book, onSelect, isSelected }) {
  const { user } = useAuth();
  const { deleteBook } = useBooks();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book.id);
    }
  };

  return (
    <div
      onClick={() => onSelect?.(book)}
      className={`group cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-[1.02]' : 'hover:scale-[1.02]'
      }`}
    >
      <div
        className={`relative aspect-3/4 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-blue-500 shadow-xl'
            : 'hover:shadow-lg'
        }`}
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Action buttons */}
        {user && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDelete}
              className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Book Info */}
      <div className="mt-3 px-1">
        <h3 className="text-sm font-semibold text-slate-900 truncate">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
      </div>
    </div>
  );
}

export default BookCard;
