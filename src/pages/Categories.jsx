import { useState, useMemo } from 'react';
import { useBooks } from '../context/BooksContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard/BookCard';
import BookDetail from '../components/BookDetail/BookDetail';
import CategoryModal from '../components/CategoryModal/CategoryModal';

// Category styling config based on id_categoria
const categoryStyles = {
  1: { // Ficción
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  2: { // No Ficción
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  3: { // Ciencia Ficción
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
  },
  4: { // Fantasía
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100',
  },
  5: { // Historia
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  6: { // Tecnología
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    iconColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
  },
};

const defaultStyle = {
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  iconColor: 'text-slate-600',
  bgColor: 'bg-slate-100',
  borderColor: 'border-slate-200',
};

function Categories() {
  const { books, categorias, ejemplares, addCategoria, updateCategoria, deleteCategoria } = useBooks();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Get books for selected category (books already have author info from context)
  const categoryBooks = useMemo(() => {
    if (!selectedCategory) return [];
    return books.filter((book) => book.id_categoria === selectedCategory.id_categoria);
  }, [books, selectedCategory]);

  // Get book count per category
  const getBookCount = (categoryId) => {
    return books.filter((book) => book.id_categoria === categoryId).length;
  };

  // Get available copies count
  const getAvailableCopies = () => {
    return ejemplares.filter(e => e.estado === 'Disponible').length;
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (categoria) => {
    setEditingCategory(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (categoryData) => {
    if (editingCategory) {
      await updateCategoria(editingCategory.id_categoria, categoryData);
    } else {
      await addCategoria(categoryData);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      await deleteCategoria(id);
    }
  };

  return (
    <div className="flex gap-6 p-6 pl-8 h-[calc(100vh-5rem)] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 transition-all overflow-y-auto pr-2 max-w-5xl">
        {!selectedCategory ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
                {isAdmin() && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Categoría
                  </button>
                )}
              </div>
              <p className="text-slate-500">Explora libros por categoría</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categorias.map((categoria) => {
                const style = categoryStyles[categoria.id_categoria] || defaultStyle;
                const bookCount = getBookCount(categoria.id_categoria);

                return (
                  <div key={categoria.id_categoria} className="relative group">
                    <button
                      onClick={() => setSelectedCategory(categoria)}
                      className={`w-full p-5 rounded-2xl text-left transition-all duration-200 bg-white border ${style.borderColor} hover:shadow-md hover:border-slate-200`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${style.bgColor} flex items-center justify-center mb-4 ${style.iconColor} group-hover:scale-105 transition-transform`}>
                        {style.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{categoria.nombre}</h3>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{categoria.descripcion}</p>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {bookCount} {bookCount === 1 ? 'libro' : 'libros'}
                      </span>
                    </button>
                    
                    {/* Admin Actions */}
                    {isAdmin() && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(categoria);
                          }}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                          title="Editar categoría"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(categoria.id_categoria);
                          }}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                          title="Eliminar categoría"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats Section */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen de la Biblioteca</h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{books.length}</div>
                  <div className="text-sm text-slate-500">Total Libros</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{categorias.length}</div>
                  <div className="text-sm text-slate-500">Categorías</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{ejemplares.length}</div>
                  <div className="text-sm text-slate-500">Ejemplares</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{getAvailableCopies()}</div>
                  <div className="text-sm text-slate-500">Disponibles</div>
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
                <h4 className="font-medium text-slate-900 mb-1">Explora por categoría</h4>
                <p className="text-sm text-slate-600">Haz clic en cualquier categoría para ver los libros disponibles. También puedes agregar nuevos libros desde la página principal.</p>
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
                Volver a Categorías
              </button>
              
              {/* Category Header */}
              {(() => {
                const style = categoryStyles[selectedCategory.id_categoria] || defaultStyle;
                return (
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${style.bgColor} flex items-center justify-center ${style.iconColor}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{selectedCategory.nombre}</h1>
                      <p className="text-slate-500">{categoryBooks.length} {categoryBooks.length === 1 ? 'libro' : 'libros'} en esta categoría</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-1">
              {categoryBooks.map((book) => (
                <BookCard
                  key={book.id_libro}
                  book={book}
                  onSelect={setSelectedBook}
                  isSelected={selectedBook?.id_libro === book.id_libro}
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
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No hay libros en esta categoría</h3>
                <p className="text-slate-500">Agrega algunos libros para verlos aquí</p>
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
          <h3 className="text-slate-400 font-medium mb-1">Ningún libro seleccionado</h3>
          <p className="text-slate-300 text-sm text-center">Haz clic en un libro para ver sus detalles</p>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
}

export default Categories;
