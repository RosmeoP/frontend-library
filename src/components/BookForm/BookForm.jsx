import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../../context/BooksContext';
import { api } from '../../services/api';
import AuthorSelector from '../AuthorSelector/AuthorSelector';

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBook, updateBook, getBook, autores, editoriales, categorias, addAutor, refetch } = useBooks();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    anoedicion: '',
    codigoeditorial: '',
    id_categoria: '',
    sinopsis: '',
    portada: '',
    selectedAutores: [],
    cantidad: 1,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const libro = getBook(Number(id));
      if (libro) {
        setFormData({
          titulo: libro.titulo,
          isbn: libro.isbn,
          anoedicion: libro.anoedicion,
          codigoeditorial: libro.codigoeditorial,
          id_categoria: libro.id_categoria,
          sinopsis: libro.sinopsis || '',
          portada: libro.portada || '',
          selectedAutores: [],
          cantidad: libro.totalEjemplares || 0,
        });
        
        // Fetch existing authors for this book
        api.books.getAuthors(Number(id))
          .then(authors => {
            setFormData(prev => ({
              ...prev,
              selectedAutores: authors.map(a => a.id_autor)
            }));
          })
          .catch(err => console.error('Error fetching book authors:', err));
      } else {
        navigate('/');
      }
    }
  }, [id, isEditing, getBook, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAutoresChange = (selectedAutorIds) => {
    setFormData(prev => ({
      ...prev,
      selectedAutores: selectedAutorIds
    }));
  };

  const handleCreateAuthor = async (authorData) => {
    try {
      const newAuthor = await addAutor(authorData);
      return newAuthor;
    } catch (err) {
      console.error('Error creating author:', err);
      throw err;
    }
  };

  const handleRefreshAuthors = async () => {
    // Refresh all data to get the updated authors list
    await refetch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.titulo || !formData.isbn || !formData.anoedicion || !formData.id_categoria || !formData.codigoeditorial) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    const libroData = {
      titulo: formData.titulo,
      isbn: formData.isbn,
      anoedicion: Number(formData.anoedicion),
      codigoeditorial: Number(formData.codigoeditorial),
      id_categoria: Number(formData.id_categoria),
      sinopsis: formData.sinopsis,
      portada: formData.portada || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      autores: formData.selectedAutores,
      cantidad: Number(formData.cantidad) || 0,
    };

    try {
      if (isEditing) {
        await updateBook(Number(id), libroData);
      } else {
        await addBook(libroData);
      }
      navigate('/');
    } catch (err) {
      setError('Error al guardar el libro. Intenta de nuevo.');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h2>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Actualiza los detalles del libro' : 'Completa los detalles para agregar un nuevo libro'}
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
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Título del libro"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="978-3-16-148410-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Año de Edición <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="anoedicion"
                value={formData.anoedicion}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Año de publicación"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stock / Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Cantidad de ejemplares"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Editorial <span className="text-red-500">*</span>
              </label>
              <select
                name="codigoeditorial"
                value={formData.codigoeditorial}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="">Selecciona una editorial</option>
                {editoriales.map(editorial => (
                  <option key={editorial.id_editorial} value={editorial.id_editorial}>
                    {editorial.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Authors Selection */}
          <AuthorSelector
            selectedAuthors={formData.selectedAutores}
            onChange={handleAutoresChange}
            availableAuthors={autores}
            onCreateAuthor={handleCreateAuthor}
            onRefreshAuthors={handleRefreshAuthors}
          />

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              URL de Portada
            </label>
            <input
              type="url"
              name="portada"
              value={formData.portada}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              placeholder="https://ejemplo.com/portada.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sinopsis
            </label>
            <textarea
              name="sinopsis"
              value={formData.sinopsis}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
              placeholder="Breve descripción del libro"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-slate-100 text-slate-700 py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              {isEditing ? 'Actualizar Libro' : 'Agregar Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
