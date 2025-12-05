import { useState } from 'react';
import { useBooks } from '../context/BooksContext';

function Reservations() {
  const { reservas, setReservas, usuarios, libros, ejemplares } = useBooks();
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [newReservation, setNewReservation] = useState({
    id_usuario: '',
    id_libro: '',
  });

  // Get reservation with full info
  const getReservationDetails = (reservation) => {
    const usuario = usuarios.find(u => u.id_usuario === reservation.id_usuario);
    const libro = libros.find(l => l.id_libro === reservation.id_libro);
    return {
      ...reservation,
      usuario,
      libro,
      userName: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Unknown',
      bookTitle: libro?.titulo || 'Unknown',
    };
  };

  const reservationsWithDetails = reservas.map(getReservationDetails);

  // Filter by status
  const pendingReservations = reservationsWithDetails.filter(r => r.estado_reserva === 'Pendiente');
  const completedReservations = reservationsWithDetails.filter(r => r.estado_reserva === 'Completada');
  const cancelledReservations = reservationsWithDetails.filter(r => r.estado_reserva === 'Cancelada');

  const displayedReservations = activeTab === 'pending' 
    ? pendingReservations 
    : activeTab === 'completed' 
      ? completedReservations 
      : cancelledReservations;

  // Stats
  const stats = {
    pending: pendingReservations.length,
    completed: completedReservations.length,
    cancelled: cancelledReservations.length,
    total: reservas.length,
  };

  // Handle new reservation
  const handleCreateReservation = () => {
    if (!newReservation.id_usuario || !newReservation.id_libro) return;

    const newId = Math.max(...reservas.map(r => r.id_reserva), 0) + 1;
    const newRes = {
      id_reserva: newId,
      id_usuario: parseInt(newReservation.id_usuario),
      id_libro: parseInt(newReservation.id_libro),
      fecha_reserva: new Date().toISOString().split('T')[0],
      estado_reserva: 'Pendiente',
    };

    setReservas(prev => [...prev, newRes]);
    setNewReservation({ id_usuario: '', id_libro: '' });
    setShowNewReservation(false);
  };

  // Complete reservation (book is now available for pickup)
  const completeReservation = (id) => {
    setReservas(prev => prev.map(r => 
      r.id_reserva === id 
        ? { ...r, estado_reserva: 'Completada' } 
        : r
    ));
  };

  // Cancel reservation
  const cancelReservation = (id) => {
    setReservas(prev => prev.map(r => 
      r.id_reserva === id 
        ? { ...r, estado_reserva: 'Cancelada' } 
        : r
    ));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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
          <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
          <p className="text-slate-500 mt-1">Manage book reservations</p>
        </div>
        <button
          onClick={() => setShowNewReservation(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              <p className="text-sm text-slate-500">Pending</p>
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
              <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              <p className="text-sm text-slate-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.cancelled}</p>
              <p className="text-sm text-slate-500">Cancelled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        {[
          { id: 'pending', label: 'Pending', count: stats.pending },
          { id: 'completed', label: 'Completed', count: stats.completed },
          { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
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

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">User</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Book</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedReservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              displayedReservations.map(reservation => (
                <tr key={reservation.id_reserva} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm text-slate-600">#{reservation.id_reserva}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{reservation.userName}</p>
                      <p className="text-xs text-slate-500">{reservation.usuario?.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-slate-900">{reservation.bookTitle}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {formatDate(reservation.fecha_reserva)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reservation.estado_reserva === 'Pendiente'
                        ? 'bg-amber-100 text-amber-800'
                        : reservation.estado_reserva === 'Completada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.estado_reserva === 'Pendiente' ? 'Pending' : 
                       reservation.estado_reserva === 'Completada' ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {reservation.estado_reserva === 'Pendiente' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => completeReservation(reservation.id_reserva)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => cancelReservation(reservation.id_reserva)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Reservation Modal */}
      {showNewReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">New Reservation</h2>
              <button
                onClick={() => setShowNewReservation(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select User
                </label>
                <select
                  value={newReservation.id_usuario}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, id_usuario: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Choose a user...</option>
                  {usuarios.map(user => (
                    <option key={user.id_usuario} value={user.id_usuario}>
                      {user.nombre} {user.apellido} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Book
                </label>
                <select
                  value={newReservation.id_libro}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, id_libro: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Choose a book...</option>
                  {libros.map(libro => (
                    <option key={libro.id_libro} value={libro.id_libro}>
                      {libro.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewReservation(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReservation}
                disabled={!newReservation.id_usuario || !newReservation.id_libro}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservations;
