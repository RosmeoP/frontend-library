import { useState } from 'react';
import { useBooks } from '../context/BooksContext';

function Fines() {
  const { multas, setMultas, prestamos, usuarios, libros, ejemplares } = useBooks();
  const [activeTab, setActiveTab] = useState('unpaid');

  // Get fine details with related data
  const getFineDetails = (fine) => {
    const prestamo = prestamos.find(p => p.id_prestamo === fine.id_prestamo);
    const usuario = prestamo ? usuarios.find(u => u.id_usuario === prestamo.id_usuario) : null;
    const ejemplar = prestamo ? ejemplares.find(e => e.id_ejemplar === prestamo.id_ejemplar) : null;
    const libro = ejemplar ? libros.find(l => l.id_libro === ejemplar.id_libro) : null;

    return {
      ...fine,
      prestamo,
      usuario,
      libro,
      userName: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido',
      userEmail: usuario?.email || '',
      bookTitle: libro?.titulo || 'Desconocido',
      loanDate: prestamo?.fecha_prestamo,
      returnDate: prestamo?.fecha_devuelto,
      expectedDate: prestamo?.fecha_devolucion_esperada,
    };
  };

  const finesWithDetails = multas.map(getFineDetails);

  // Filter by payment status
  const unpaidFines = finesWithDetails.filter(f => !f.pagado);
  const paidFines = finesWithDetails.filter(f => f.pagado);

  const displayedFines = activeTab === 'unpaid' ? unpaidFines : paidFines;

  // Stats
  const stats = {
    unpaid: unpaidFines.length,
    paid: paidFines.length,
    totalUnpaid: unpaidFines.reduce((sum, f) => sum + f.monto, 0),
    totalCollected: paidFines.reduce((sum, f) => sum + f.monto, 0),
  };

  // Mark fine as paid
  const markAsPaid = (fineId) => {
    setMultas(prev => prev.map(m =>
      m.id_multa === fineId
        ? { ...m, pagado: true, fecha_pago: new Date().toISOString().split('T')[0] }
        : m
    ));
  };

  // Delete fine
  const deleteFine = (fineId) => {
    if (confirm('¿Está seguro de que desea eliminar esta multa?')) {
      setMultas(prev => prev.filter(m => m.id_multa !== fineId));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Multas</h1>
          <p className="text-slate-500 mt-1">Gestionar penalizaciones por retraso</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.unpaid}</p>
              <p className="text-sm text-slate-500">Multas Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">${stats.totalUnpaid.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Pendiente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.paid}</p>
              <p className="text-sm text-slate-500">Multas Pagadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${stats.totalCollected.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Recaudado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'unpaid', label: 'Pendientes', count: stats.unpaid },
          { id: 'paid', label: 'Pagadas', count: stats.paid },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Usuario</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Libro</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Fecha Límite</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Devuelto</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Monto</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Estado</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedFines.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No se encontraron multas
                </td>
              </tr>
            ) : (
              displayedFines.map(fine => (
                <tr key={fine.id_multa} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm text-slate-600">#{fine.id_multa}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{fine.userName}</p>
                      <p className="text-xs text-slate-500">{fine.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-900">{fine.bookTitle}</p>
                    <p className="text-xs text-slate-500">Préstamo #{fine.id_prestamo}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {formatDate(fine.expectedDate)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {formatDate(fine.returnDate)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-bold ${fine.pagado ? 'text-slate-600' : 'text-red-600'}`}>
                      ${fine.monto.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fine.pagado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {fine.pagado ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {!fine.pagado && (
                        <button
                          onClick={() => markAsPaid(fine.id_multa)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Marcar Pagada
                        </button>
                      )}
                      <button
                        onClick={() => deleteFine(fine.id_multa)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Cómo Funcionan las Multas</h3>
            <p className="text-sm text-amber-700 mt-1">
              Las multas se generan automáticamente cuando un libro se devuelve después de su fecha límite. 
              La tarifa es de <strong>$2.00 por día</strong> de retraso. Los usuarios pueden pagar sus multas en 
              el mostrador de la biblioteca o mediante pago en línea.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fines;
