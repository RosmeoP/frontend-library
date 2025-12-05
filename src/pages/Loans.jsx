import { useState, useMemo } from 'react';
import { useBooks } from '../context/BooksContext';

function Loans() {
  const { 
    prestamosCompletos, 
    usuarios, 
    ejemplares, 
    books,
    addPrestamo, 
    returnPrestamo 
  } = useBooks();
  
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'overdue', 'returned'
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Filter loans by status
  const filteredLoans = useMemo(() => {
    const today = new Date();
    
    return prestamosCompletos.filter(loan => {
      if (activeTab === 'active') {
        return loan.estado_prestamo === 'Activo' && new Date(loan.fecha_devolucion_esperada) >= today;
      }
      if (activeTab === 'overdue') {
        return loan.estado_prestamo === 'Activo' && new Date(loan.fecha_devolucion_esperada) < today;
      }
      if (activeTab === 'returned') {
        return loan.estado_prestamo === 'Finalizado';
      }
      return true;
    });
  }, [prestamosCompletos, activeTab]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    const active = prestamosCompletos.filter(l => l.estado_prestamo === 'Activo');
    const overdue = active.filter(l => new Date(l.fecha_devolucion_esperada) < today);
    const returned = prestamosCompletos.filter(l => l.estado_prestamo === 'Finalizado');
    
    return {
      active: active.length,
      overdue: overdue.length,
      returned: returned.length,
      total: prestamosCompletos.length,
    };
  }, [prestamosCompletos]);

  const handleReturn = (loanId) => {
    if (window.confirm('¿Confirmar devolución de este préstamo?')) {
      returnPrestamo(loanId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="p-6 pl-8 h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Préstamos</h1>
            <p className="text-slate-500">Gestiona los préstamos de la biblioteca</p>
          </div>
          <button
            onClick={() => setShowNewLoanModal(true)}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Préstamo
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-sm text-slate-500">Activos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.overdue}</p>
                <p className="text-sm text-slate-500">Vencidos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.returned}</p>
                <p className="text-sm text-slate-500">Devueltos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Activos ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overdue'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Vencidos ({stats.overdue})
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'returned'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Devueltos ({stats.returned})
          </button>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Libro</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Usuario</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Código</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Préstamo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Devolución</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-slate-500">No hay préstamos en esta categoría</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan.fecha_devolucion_esperada);
                  const isOverdue = daysRemaining < 0 && loan.estado_prestamo === 'Activo';
                  
                  return (
                    <tr key={loan.id_prestamo} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-slate-200 rounded-lg overflow-hidden">
                            {loan.libro?.portada && (
                              <img src={loan.libro.portada} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{loan.libroTitulo}</p>
                            <p className="text-xs text-slate-500">ID: {loan.id_prestamo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{loan.usuarioNombre}</p>
                        <p className="text-xs text-slate-500">{loan.usuario?.carnet}</p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{loan.codigoBarras}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(loan.fecha_prestamo)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-600">
                            {loan.fecha_devuelto ? formatDate(loan.fecha_devuelto) : formatDate(loan.fecha_devolucion_esperada)}
                          </p>
                          {!loan.fecha_devuelto && (
                            <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {isOverdue ? `${Math.abs(daysRemaining)} días de retraso` : `${daysRemaining} días restantes`}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {loan.estado_prestamo === 'Finalizado' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Devuelto
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Vencido
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Activo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {loan.estado_prestamo === 'Activo' && (
                          <button
                            onClick={() => handleReturn(loan.id_prestamo)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            Devolver
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Loan Modal */}
      {showNewLoanModal && (
        <NewLoanModal
          onClose={() => setShowNewLoanModal(false)}
          usuarios={usuarios}
          ejemplares={ejemplares}
          books={books}
          onSubmit={addPrestamo}
        />
      )}
    </div>
  );
}

// New Loan Modal Component
function NewLoanModal({ onClose, usuarios, ejemplares, books, onSubmit }) {
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_ejemplar: '',
    dias_prestamo: 14,
  });
  const [error, setError] = useState('');

  // Get available copies (only 'Disponible' status)
  const availableCopies = ejemplares.filter(e => e.estado === 'Disponible');

  // Get book info for an ejemplar
  const getBookForCopy = (idEjemplar) => {
    const copy = ejemplares.find(e => e.id_ejemplar === Number(idEjemplar));
    if (!copy) return null;
    return books.find(b => b.id_libro === copy.id_libro);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.id_usuario || !formData.id_ejemplar) {
      setError('Por favor selecciona un usuario y un ejemplar');
      return;
    }

    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + formData.dias_prestamo);

    onSubmit({
      id_usuario: Number(formData.id_usuario),
      id_ejemplar: Number(formData.id_ejemplar),
      fecha_devolucion_esperada: fechaDevolucion.toISOString().split('T')[0],
    });

    onClose();
  };

  const selectedBook = formData.id_ejemplar ? getBookForCopy(formData.id_ejemplar) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Nuevo Préstamo</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Usuario
            </label>
            <select
              value={formData.id_usuario}
              onChange={(e) => setFormData(prev => ({ ...prev, id_usuario: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.filter(u => u.estado === 'Activo').map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>
                  {user.nombre} {user.apellido} ({user.carnet})
                </option>
              ))}
            </select>
          </div>

          {/* Copy Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ejemplar Disponible
            </label>
            <select
              value={formData.id_ejemplar}
              onChange={(e) => setFormData(prev => ({ ...prev, id_ejemplar: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            >
              <option value="">Selecciona un ejemplar</option>
              {availableCopies.map(copy => {
                const book = books.find(b => b.id_libro === copy.id_libro);
                return (
                  <option key={copy.id_ejemplar} value={copy.id_ejemplar}>
                    {copy.codigo_barras} - {book?.titulo || 'Libro desconocido'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selected Book Preview */}
          {selectedBook && (
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                {selectedBook.portada && (
                  <img src={selectedBook.portada} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">{selectedBook.titulo}</p>
                <p className="text-sm text-slate-500">{selectedBook.autorNombre}</p>
              </div>
            </div>
          )}

          {/* Loan Duration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Días de Préstamo
            </label>
            <select
              value={formData.dias_prestamo}
              onChange={(e) => setFormData(prev => ({ ...prev, dias_prestamo: Number(e.target.value) }))}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            >
              <option value={7}>7 días</option>
              <option value={14}>14 días</option>
              <option value={21}>21 días</option>
              <option value={30}>30 días</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              Crear Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Loans;
