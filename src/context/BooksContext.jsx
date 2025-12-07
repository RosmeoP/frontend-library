import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [books, setBooks] = useState([]);
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ejemplares, setEjemplares] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [multas, setMultas] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const safeApiCall = async (apiCall, defaultValue = []) => {
        try {
          return await apiCall();
        } catch (err) {
          console.warn('API call failed, using default:', err.message);
          return defaultValue;
        }
      };
      
      const [
        booksData,
        authorsData,
        publishersData,
        categoriesData,
        usersData,
        loansData,
        reservationsData,
        finesData,
        copiesData
      ] = await Promise.all([
        safeApiCall(api.books.getAll),
        safeApiCall(api.authors.getAll),
        safeApiCall(api.publishers.getAll),
        safeApiCall(api.categories.getAll),
        safeApiCall(api.users.getAll),
        safeApiCall(api.loans.getAll),
        safeApiCall(api.reservations.getAll),
        safeApiCall(api.fines.getAll),
        safeApiCall(api.books.getAllCopies)
      ]);
      
      setBooks(booksData);
      setLibros(booksData);
      setAutores(authorsData);
      setEditoriales(publishersData);
      setCategorias(categoriesData);
      setUsuarios(usersData);
      setPrestamos(loansData);
      setReservas(reservationsData);
      setMultas(finesData);
      setEjemplares(copiesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addBook = async (bookData) => {
    try {
      const newBook = await api.books.create({
        titulo: bookData.titulo,
        isbn: bookData.isbn,
        anoedicion: bookData.anoedicion,
        codigoeditorial: bookData.codigoeditorial,
        id_categoria: bookData.id_categoria,
        sinopsis: bookData.sinopsis,
        portada: bookData.portada,
        cantidad: bookData.cantidad
      });
      await fetchAllData();
      return newBook;
    } catch (err) {
      console.error('Error adding book:', err);
      throw err;
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      await api.books.update(id, {
        titulo: updatedData.titulo,
        isbn: updatedData.isbn,
        anoedicion: updatedData.anoedicion,
        codigoeditorial: updatedData.codigoeditorial,
        id_categoria: updatedData.id_categoria,
        sinopsis: updatedData.sinopsis,
        portada: updatedData.portada,
        cantidad: updatedData.cantidad
      });
      await fetchAllData();
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.books.delete(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err;
    }
  };

  const getBook = (id) => {
    return books.find(b => b.id_libro === id);
  };

  const addEjemplar = async (idLibro, ubicacion) => {
    try {
      const newCopy = await api.books.addCopy(idLibro, { ubicacion, estado: 'Disponible' });
      await fetchAllData();
      return newCopy;
    } catch (err) {
      console.error('Error adding copy:', err);
      throw err;
    }
  };

  const addPrestamo = async (prestamoData) => {
    try {
      const result = await api.loans.create({
        id_usuario: prestamoData.id_usuario,
        id_ejemplar: prestamoData.id_ejemplar,
        dias_prestamo: prestamoData.dias_prestamo || 14
      });
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error creating loan:', err);
      throw err;
    }
  };

  const returnPrestamo = async (idPrestamo) => {
    try {
      const result = await api.loans.return(idPrestamo);
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error returning loan:', err);
      throw err;
    }
  };

  const renewPrestamo = async (idPrestamo, diasAdicionales = 7) => {
    try {
      const result = await api.loans.renew(idPrestamo, diasAdicionales);
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error renewing loan:', err);
      throw err;
    }
  };

  const addReserva = async (reservaData) => {
    try {
      const result = await api.reservations.create(reservaData);
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  const completeReserva = async (id) => {
    try {
      await api.reservations.complete(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error completing reservation:', err);
      throw err;
    }
  };

  const cancelReserva = async (id) => {
    try {
      await api.reservations.cancel(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      throw err;
    }
  };

  const payMulta = async (id) => {
    try {
      await api.fines.pay(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error paying fine:', err);
      throw err;
    }
  };

  const deleteMulta = async (id) => {
    try {
      await api.fines.delete(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting fine:', err);
      throw err;
    }
  };

  const addUsuario = async (userData) => {
    try {
      const result = await api.users.create(userData);
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUsuario = async (id, userData) => {
    try {
      await api.users.update(id, userData);
      await fetchAllData();
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await api.users.delete(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  const addCategoria = async (catData) => {
    try {
      const result = await api.categories.create(catData);
      await fetchAllData();
      return result;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategoria = async (id, catData) => {
    try {
      await api.categories.update(id, catData);
      await fetchAllData();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategoria = async (id) => {
    try {
      await api.categories.delete(id);
      await fetchAllData();
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const prestamosCompletos = prestamos.map(p => ({
    ...p,
    libroTitulo: p.titulo || 'Desconocido',
    usuarioNombre: p.nombre && p.apellido ? `${p.nombre} ${p.apellido}` : 'Desconocido',
  }));

  const value = {
    loading,
    error,
    books,
    libros,
    autores,
    editoriales,
    categorias,
    ejemplares,
    usuarios,
    prestamos,
    reservas,
    multas,
    prestamosCompletos,
    refetch: fetchAllData,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    addEjemplar,
    addPrestamo,
    returnPrestamo,
    renewPrestamo,
    addReserva,
    completeReserva,
    cancelReserva,
    payMulta,
    deleteMulta,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    setUsuarios,
    setPrestamos,
    setReservas,
    setMultas,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
