import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../../context/BooksContext';

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBook, updateBook, getBook } = useBooks();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    description: '',
    cover: '',
    available: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const book = getBook(Number(id));
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          year: book.year,
          genre: book.genre,
          description: book.description,
          cover: book.cover,
          available: book.available,
        });
      } else {
        navigate('/');
      }
    }
  }, [id, isEditing, getBook, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.year || !formData.genre) {
      setError('Please fill in all required fields');
      return;
    }

    const bookData = {
      ...formData,
      year: Number(formData.year),
      cover: formData.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    };

    if (isEditing) {
      updateBook(Number(id), bookData);
    } else {
      addBook(bookData);
    }

    navigate('/');
  };

  const genres = ['Classic', 'Fiction', 'Fantasy', 'Romance', 'Dystopian', 'Magical Realism', 'Science Fiction', 'Mystery', 'Thriller', 'Biography'];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Update the book details' : 'Fill in the details to add a new book'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Book title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Publication year"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="">Select a genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
              placeholder="Brief description of the book"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              id="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="available" className="ml-3 text-sm font-medium text-slate-700">
              Available for borrowing
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-slate-100 text-slate-700 py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              {isEditing ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
