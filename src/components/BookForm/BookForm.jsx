import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../../context/BooksContext';

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBook, updateBook, getBook, autores, editoriales, categorias } = useBooks();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: '',
    ISBN: '',
    anio_edicion: '',
    codigo_editorial: '',
    id_categoria: '',
    sinopsis: '',
    portada: '',
    selectedAutores: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const libro = getBook(Number(id));
      if (libro) {
        setFormData({
          titulo: libro.titulo,
          ISBN: libro.ISBN,
          anio_edicion: libro.anio_edicion,
          codigo_editorial: libro.codigo_editorial,
          id_categoria: libro.id_categoria,
          sinopsis: libro.sinopsis || '',
          portada: libro.portada || '',
          selectedAutores: [],
        });
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

  const handleAutorToggle = (autorId) => {
    setFormData(prev => ({
      ...prev,
      selectedAutores: prev.selectedAutores.includes(autorId)
        ? prev.selectedAutores.filter(id => id !== autorId)
        : [...prev.selectedAutores, autorId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.titulo || !formData.ISBN || !formData.anio_edicion || !formData.id_categoria || !formData.codigo_editorial) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    const libroData = {
      titulo: formData.titulo,
      ISBN: formData.ISBN,
      anio_edicion: Number(formData.anio_edicion),
      codigo_editorial: Number(formData.codigo_editorial),
      id_categoria: Number(formData.id_categoria),
      sinopsis: formData.sinopsis,
      portada: formData.portada || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      id_autor: formData.selectedAutores[0], // For simplicity, just use first selected author
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
                name="ISBN"
                value={formData.ISBN}
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
                name="anio_edicion"
                value={formData.anio_edicion}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Año de publicación"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Editorial <span className="text-red-500">*</span>
              </label>
              <select
                name="codigo_editorial"
                value={formData.codigo_editorial}
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
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Autores
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl">
              {autores.map(autor => (
                <button
                  key={autor.id_autor}
                  type="button"
                  onClick={() => handleAutorToggle(autor.id_autor)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    formData.selectedAutores.includes(autor.id_autor)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {autor.nombres} {autor.apellidos}
                </button>
              ))}
            </div>
          </div>

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
