import { useState, useMemo } from 'react';
import { useBooks } from '../context/BooksContext';
import BookCard from '../components/BookCard/BookCard';
import BookDetail from '../components/BookDetail/BookDetail';

const categoryConfig = {
  'Classic': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
    description: 'Timeless masterpieces of literature'
  },
  'Fiction': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    description: 'Imaginative stories and narratives'
  },
  'Fantasy': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
    description: 'Magical worlds and epic adventures'
  },
  'Romance': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-100',
    description: 'Love stories that touch the heart'
  },
  'Dystopian': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    description: 'Dark visions of possible futures'
  },
  'Magical Realism': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    iconColor: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-100',
    description: 'Where reality meets the magical'
  },
  'Mystery': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    description: 'Thrilling puzzles and suspense'
  },
  'Sci-Fi': {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
    description: 'Exploring the frontiers of science'
  },
};

function Categories() {
  const { books } = useBooks();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Get unique genres from books
  const genres = useMemo(() => {
    return [...new Set(books.map((book) => book.genre))].sort();
  }, [books]);

  // Get books for selected category
  const categoryBooks = useMemo(() => {
    if (!selectedCategory) return [];
    return books.filter((book) => book.genre === selectedCategory);
  }, [books, selectedCategory]);

  // Get book count per genre
  const getBookCount = (genre) => {
    return books.filter((book) => book.genre === genre).length;
  };

  return (
    <div className="flex gap-6 p-6 pl-8 h-[calc(100vh-5rem)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 transition-all overflow-y-auto pr-2 max-w-5xl">
        {!selectedCategory ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Categories</h1>
              <p className="text-slate-500">Browse books by category</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((genre) => {
                const config = categoryConfig[genre] || {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                  iconColor: 'text-slate-600',
                  bgColor: 'bg-slate-100',
                  borderColor: 'border-slate-200',
                  description: 'Explore this collection'
                };

                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedCategory(genre)}
                    className={`group p-5 rounded-2xl text-left transition-all duration-200 bg-white border ${config.borderColor} hover:shadow-md hover:border-slate-200`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center mb-4 ${config.iconColor} group-hover:scale-105 transition-transform`}>
                      {config.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{genre}</h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{config.description}</p>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {getBookCount(genre)} {getBookCount(genre) === 1 ? 'book' : 'books'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stats Section */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Library Overview</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{books.length}</div>
                  <div className="text-sm text-slate-500">Total Books</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{genres.length}</div>
                  <div className="text-sm text-slate-500">Categories</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{books.filter(b => b.available).length}</div>
                  <div className="text-sm text-slate-500">Available</div>
                </div>
              </div>
            </div>

            {/* Tip Section */}
            <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Browse by category</h4>
                <p className="text-sm text-slate-600">Click on any category above to explore books in that genre. You can also add new books from the Discover page.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button & Header */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBook(null);
                }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </button>
              
              {/* Category Header */}
              {(() => {
                const config = categoryConfig[selectedCategory] || {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                  iconColor: 'text-slate-600',
                  bgColor: 'bg-slate-100',
                  description: 'Explore this collection'
                };
                return (
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${config.bgColor} flex items-center justify-center ${config.iconColor}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{selectedCategory}</h1>
                      <p className="text-slate-500">{categoryBooks.length} {categoryBooks.length === 1 ? 'book' : 'books'} in this category</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-1">
              {categoryBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={setSelectedBook}
                  isSelected={selectedBook?.id === book.id}
                />
              ))}
            </div>

            {categoryBooks.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No books in this category</h3>
                <p className="text-slate-500">Add some books to see them here</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Book Detail Panel */}
      {selectedBook ? (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      ) : (
        <div className="w-80 bg-slate-50 rounded-3xl p-6 flex flex-col items-center justify-center h-full shrink-0">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-slate-400 font-medium mb-1">No book selected</h3>
          <p className="text-slate-300 text-sm text-center">Click on a book to see its details</p>
        </div>
      )}
    </div>
  );
}

export default Categories;
