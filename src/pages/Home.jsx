import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard/BookCard';
import BookDetail from '../components/BookDetail/BookDetail';
import { useBooks } from '../context/BooksContext';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { books } = useBooks();
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = useMemo(() => {
    return ['All', ...new Set(books.map((book) => book.genre))].sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!selectedGenre || selectedGenre === 'All') return books;
    return books.filter((book) => book.genre === selectedGenre);
  }, [books, selectedGenre]);

  // Split books for recommended section (first 4)
  const recommendedBooks = filteredBooks.slice(0, 4);
  const categoryBooks = filteredBooks;

  return (
    <div className="flex gap-6 p-6 pl-8 h-[calc(100vh-5rem)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 transition-all overflow-y-auto pr-2 max-w-5xl">
        {/* Recommended Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recommended</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              See All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-1">
            {recommendedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={setSelectedBook}
                isSelected={selectedBook?.id === book.id}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Categories</h2>
            {user && (
              <Link
                to="/books/new"
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Book
              </Link>
            )}
          </div>

          {/* Genre Chips */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === 'All' ? '' : genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (selectedGenre === genre) || (genre === 'All' && !selectedGenre)
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-1">
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
              <h3 className="text-lg font-semibold text-slate-800 mb-1">No books found</h3>
              <p className="text-slate-500">Try selecting a different category</p>
            </div>
          )}
        </section>
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

export default Home;
