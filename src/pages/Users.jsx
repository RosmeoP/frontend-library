import { useState } from 'react';
import { useBooks } from '../context/BooksContext';

function Users() {
  const { usuarios, setUsuarios, prestamos, reservas, multas } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo_usuario: 'Estudiante',
  });

  // Get user stats
  const getUserStats = (userId) => {
    const userLoans = prestamos.filter(p => p.id_usuario === userId);
    const userReservations = reservas.filter(r => r.id_usuario === userId);
    const userFines = multas.filter(m => {
      const prestamo = prestamos.find(p => p.id_prestamo === m.id_prestamo);
      return prestamo?.id_usuario === userId;
    });
    const unpaidFines = userFines.filter(f => !f.pagado);
    
    return {
      totalLoans: userLoans.length,
      activeLoans: userLoans.filter(l => l.estado_prestamo === 'Activo').length,
      reservations: userReservations.length,
      unpaidFines: unpaidFines.reduce((sum, f) => sum + f.monto, 0),
    };
  };

  // Filter users by search
  const filteredUsers = usuarios.filter(user => 
    `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overall stats
  const stats = {
    total: usuarios.length,
    students: usuarios.filter(u => u.tipo_usuario === 'Estudiante').length,
    professors: usuarios.filter(u => u.tipo_usuario === 'Profesor').length,
    external: usuarios.filter(u => u.tipo_usuario === 'Externo').length,
  };

  // Handle create user
  const handleCreateUser = () => {
    if (!newUser.nombre || !newUser.apellido || !newUser.email) return;

    const newId = Math.max(...usuarios.map(u => u.id_usuario), 0) + 1;
    const userToAdd = {
      id_usuario: newId,
      ...newUser,
      fecha_registro: new Date().toISOString().split('T')[0],
    };

    setUsuarios(prev => [...prev, userToAdd]);
    setNewUser({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      tipo_usuario: 'Estudiante',
    });
    setShowNewUser(false);
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsuarios(prev => prev.filter(u => u.id_usuario !== userId));
      setSelectedUser(null);
    }
  };

  const formatDate = (dateStr) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 mt-1">Gestiona los miembros de la biblioteca</p>
        </div>
        <button
          onClick={() => setShowNewUser(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Usuario
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.students}</p>
              <p className="text-sm text-slate-500">Estudiantes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.professors}</p>
              <p className="text-sm text-slate-500">Profesores</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.external}</p>
              <p className="text-sm text-slate-500">Externos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Usuario</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Contacto</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Registro</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Préstamos Activos</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Multas</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const userStats = getUserStats(user.id_usuario);
                return (
                  <tr key={user.id_usuario} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-slate-600">
                            {user.nombre[0]}{user.apellido[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.nombre} {user.apellido}
                          </p>
                          <p className="text-xs text-slate-500">ID: {user.id_usuario}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-900">{user.email}</p>
                      <p className="text-xs text-slate-500">{user.telefono}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tipo_usuario === 'Estudiante'
                          ? 'bg-green-100 text-green-800'
                          : user.tipo_usuario === 'Profesor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {user.tipo_usuario === 'Estudiante' ? 'Estudiante' :
                         user.tipo_usuario === 'Profesor' ? 'Profesor' : 'Externo'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {formatDate(user.fecha_registro)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${
                        userStats.activeLoans > 0 ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {userStats.activeLoans}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {userStats.unpaidFines > 0 ? (
                        <span className="text-sm font-medium text-red-600">
                          ${userStats.unpaidFines.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">$0.00</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id_usuario)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New User Modal */}
      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Agregar Nuevo Usuario</h2>
              <button
                onClick={() => setShowNewUser(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={newUser.apellido}
                  onChange={(e) => setNewUser(prev => ({ ...prev, apellido: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Pérez"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="juan.perez@correo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newUser.telefono}
                  onChange={(e) => setNewUser(prev => ({ ...prev, telefono: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Usuario
                </label>
                <select
                  value={newUser.tipo_usuario}
                  onChange={(e) => setNewUser(prev => ({ ...prev, tipo_usuario: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Profesor">Profesor</option>
                  <option value="Externo">Externo</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={newUser.direccion}
                  onChange={(e) => setNewUser(prev => ({ ...prev, direccion: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Calle Principal 123"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewUser(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUser.nombre || !newUser.apellido || !newUser.email}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Detalles del Usuario</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-slate-600">
                  {selectedUser.nombre[0]}{selectedUser.apellido[0]}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedUser.nombre} {selectedUser.apellido}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedUser.tipo_usuario === 'Estudiante'
                    ? 'bg-green-100 text-green-800'
                    : selectedUser.tipo_usuario === 'Profesor'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedUser.tipo_usuario === 'Estudiante' ? 'Estudiante' :
                   selectedUser.tipo_usuario === 'Profesor' ? 'Profesor' : 'Externo'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Correo</p>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.telefono || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dirección</p>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.direccion || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Registro</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(selectedUser.fecha_registro)}</p>
                </div>
              </div>

              {/* User Activity Stats */}
              {(() => {
                const stats = getUserStats(selectedUser.id_usuario);
                return (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm font-medium text-slate-700 mb-3">Actividad</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-slate-900">{stats.totalLoans}</p>
                        <p className="text-xs text-slate-500">Total Préstamos</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-blue-600">{stats.activeLoans}</p>
                        <p className="text-xs text-slate-500">Activos</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className={`text-lg font-bold ${stats.unpaidFines > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                          ${stats.unpaidFines.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Multas Pendientes</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
