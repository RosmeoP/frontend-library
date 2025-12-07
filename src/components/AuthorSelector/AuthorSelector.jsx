import { useState, useEffect, useRef } from 'react';

function AuthorSelector({ selectedAuthors = [], onChange, availableAuthors = [], onCreateAuthor, onRefreshAuthors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ nombres: '', apellidos: '', nacionalidad: '' });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter authors based on search term
  const filteredAuthors = availableAuthors.filter(author => {
    const fullName = `${author.nombres} ${author.apellidos}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleToggleAuthor = (authorId) => {
    if (selectedAuthors.includes(authorId)) {
      onChange(selectedAuthors.filter(id => id !== authorId));
    } else {
      onChange([...selectedAuthors, authorId]);
    }
  };

  const handleRemoveAuthor = (authorId, e) => {
    e.stopPropagation();
    onChange(selectedAuthors.filter(id => id !== authorId));
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    if (!newAuthor.nombres.trim() || !newAuthor.apellidos.trim()) {
      return;
    }

    try {
      const createdAuthor = await onCreateAuthor(newAuthor);
      
      // Refresh the authors list to include the newly created author
      if (onRefreshAuthors) {
        await onRefreshAuthors();
      }
      
      // Add the newly created author to selected authors
      onChange([...selectedAuthors, createdAuthor.id_autor]);
      
      // Reset form
      setNewAuthor({ nombres: '', apellidos: '', nacionalidad: '' });
      setShowCreateForm(false);
      setSearchTerm('');
    } catch (err) {
      console.error('Error creating author:', err);
      alert('Error al crear el autor. Por favor intenta de nuevo.');
    }
  };

  const getSelectedAuthorsDetails = () => {
    return selectedAuthors
      .map(id => availableAuthors.find(a => a.id_autor === id))
      .filter(Boolean);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Autores
      </label>

      {/* Selected Authors Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[48px] px-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl focus-within:bg-white focus-within:border-blue-500 transition-all cursor-pointer hover:bg-white"
      >
        {selectedAuthors.length === 0 ? (
          <span className="text-slate-400 text-sm">Selecciona autores...</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {getSelectedAuthorsDetails().map(author => (
              <span
                key={author.id_autor}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {author.nombres} {author.apellidos}
                <button
                  onClick={(e) => handleRemoveAuthor(author.id_autor, e)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
          {!showCreateForm ? (
            <>
              {/* Search */}
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar autor..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Authors List */}
              <div className="max-h-52 overflow-y-auto">
                {filteredAuthors.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No se encontraron autores
                  </div>
                ) : (
                  filteredAuthors.map(author => (
                    <label
                      key={author.id_autor}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(author.id_autor)}
                        onChange={() => handleToggleAuthor(author.id_autor)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {author.nombres} {author.apellidos}
                        </div>
                        {author.nacionalidad && (
                          <div className="text-xs text-slate-500">{author.nacionalidad}</div>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>

              {/* Create New Button */}
              <div className="p-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nuevo Autor
                </button>
              </div>
            </>
          ) : (
            /* Create Author Form */
            <form onSubmit={handleCreateAuthor} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Crear Nuevo Autor</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAuthor.nombres}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, nombres: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gabriel García"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAuthor.apellidos}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, apellidos: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Márquez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nacionalidad
                  </label>
                  <input
                    type="text"
                    value={newAuthor.nacionalidad}
                    onChange={(e) => setNewAuthor(prev => ({ ...prev, nacionalidad: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Colombia"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Crear
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthorSelector;

