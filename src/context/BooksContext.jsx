import { createContext, useContext, useState, useEffect } from 'react';
import {
  libros as initialLibros,
  autores as initialAutores,
  editoriales as initialEditoriales,
  categorias as initialCategorias,
  autorLibro as initialAutorLibro,
  ejemplares as initialEjemplares,
  usuarios as initialUsuarios,
  prestamos as initialPrestamos,
  reservas as initialReservas,
  multas as initialMultas,
  getLibroCompleto,
} from '../data/libraryData';

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  // Main data states
  const [libros, setLibros] = useState(() => {
    const saved = localStorage.getItem('libros');
    return saved ? JSON.parse(saved) : initialLibros;
  });

  const [autores, setAutores] = useState(() => {
    const saved = localStorage.getItem('autores');
    return saved ? JSON.parse(saved) : initialAutores;
  });

  const [editoriales, setEditoriales] = useState(() => {
    const saved = localStorage.getItem('editoriales');
    return saved ? JSON.parse(saved) : initialEditoriales;
  });

  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem('categorias');
    return saved ? JSON.parse(saved) : initialCategorias;
  });

  const [autorLibro, setAutorLibro] = useState(() => {
    const saved = localStorage.getItem('autorLibro');
    return saved ? JSON.parse(saved) : initialAutorLibro;
  });

  const [ejemplares, setEjemplares] = useState(() => {
    const saved = localStorage.getItem('ejemplares');
    return saved ? JSON.parse(saved) : initialEjemplares;
  });

  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem('usuarios');
    return saved ? JSON.parse(saved) : initialUsuarios;
  });

  const [prestamos, setPrestamos] = useState(() => {
    const saved = localStorage.getItem('prestamos');
    return saved ? JSON.parse(saved) : initialPrestamos;
  });

  const [reservas, setReservas] = useState(() => {
    const saved = localStorage.getItem('reservas');
    return saved ? JSON.parse(saved) : initialReservas;
  });

  const [multas, setMultas] = useState(() => {
    const saved = localStorage.getItem('multas');
    return saved ? JSON.parse(saved) : initialMultas;
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('libros', JSON.stringify(libros)); }, [libros]);
  useEffect(() => { localStorage.setItem('autores', JSON.stringify(autores)); }, [autores]);
  useEffect(() => { localStorage.setItem('editoriales', JSON.stringify(editoriales)); }, [editoriales]);
  useEffect(() => { localStorage.setItem('categorias', JSON.stringify(categorias)); }, [categorias]);
  useEffect(() => { localStorage.setItem('autorLibro', JSON.stringify(autorLibro)); }, [autorLibro]);
  useEffect(() => { localStorage.setItem('ejemplares', JSON.stringify(ejemplares)); }, [ejemplares]);
  useEffect(() => { localStorage.setItem('usuarios', JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem('prestamos', JSON.stringify(prestamos)); }, [prestamos]);
  useEffect(() => { localStorage.setItem('reservas', JSON.stringify(reservas)); }, [reservas]);
  useEffect(() => { localStorage.setItem('multas', JSON.stringify(multas)); }, [multas]);

  // Get books with all related data (for display)
  const books = libros.map(libro => getLibroCompleto(libro, {
    autores,
    editoriales,
    categorias,
    autorLibro,
    ejemplares,
  }));

  // CRUD Operations for LIBROS
  const addBook = (bookData) => {
    const newId = Math.max(...libros.map(l => l.id_libro), 0) + 1;
    const newLibro = {
      id_libro: newId,
      titulo: bookData.titulo,
      ISBN: bookData.ISBN,
      anio_edicion: bookData.anio_edicion,
      codigo_editorial: bookData.codigo_editorial,
      id_categoria: bookData.id_categoria,
      sinopsis: bookData.sinopsis,
      portada: bookData.portada || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    };
    setLibros(prev => [...prev, newLibro]);

    // Add autor-libro relationship
    if (bookData.id_autor) {
      setAutorLibro(prev => [...prev, { id_autor: bookData.id_autor, id_libro: newId }]);
    }

    // Add initial ejemplar
    const newEjemplarId = Math.max(...ejemplares.map(e => e.id_ejemplar), 0) + 1;
    setEjemplares(prev => [...prev, {
      id_ejemplar: newEjemplarId,
      id_libro: newId,
      codigo_barras: `LIB-${String(newId).padStart(3, '0')}-001`,
      estado: 'Disponible',
      nota_estado: null,
    }]);

    return newLibro;
  };

  const updateBook = (id, updatedData) => {
    setLibros(prev => prev.map(libro =>
      libro.id_libro === id ? { ...libro, ...updatedData } : libro
    ));

    // Update autor-libro relationship if changed
    if (updatedData.id_autor) {
      setAutorLibro(prev => {
        const filtered = prev.filter(al => al.id_libro !== id);
        return [...filtered, { id_autor: updatedData.id_autor, id_libro: id }];
      });
    }
  };

  const deleteBook = (id) => {
    setLibros(prev => prev.filter(libro => libro.id_libro !== id));
    setAutorLibro(prev => prev.filter(al => al.id_libro !== id));
    setEjemplares(prev => prev.filter(e => e.id_libro !== id));
  };

  const getBook = (id) => {
    const libro = libros.find(l => l.id_libro === id);
    if (!libro) return null;
    return getLibroCompleto(libro, { autores, editoriales, categorias, autorLibro, ejemplares });
  };

  // CRUD for EJEMPLARES
  const addEjemplar = (idLibro) => {
    const libroEjemplares = ejemplares.filter(e => e.id_libro === idLibro);
    const newId = Math.max(...ejemplares.map(e => e.id_ejemplar), 0) + 1;
    const newEjemplar = {
      id_ejemplar: newId,
      id_libro: idLibro,
      codigo_barras: `LIB-${String(idLibro).padStart(3, '0')}-${String(libroEjemplares.length + 1).padStart(3, '0')}`,
      estado: 'Disponible',
      nota_estado: null,
    };
    setEjemplares(prev => [...prev, newEjemplar]);
    return newEjemplar;
  };

  const updateEjemplar = (id, updatedData) => {
    setEjemplares(prev => prev.map(e =>
      e.id_ejemplar === id ? { ...e, ...updatedData } : e
    ));
  };

  // CRUD for AUTORES
  const addAutor = (autorData) => {
    const newId = Math.max(...autores.map(a => a.id_autor), 0) + 1;
    const newAutor = { id_autor: newId, ...autorData };
    setAutores(prev => [...prev, newAutor]);
    return newAutor;
  };

  // CRUD for CATEGORIAS
  const addCategoria = (catData) => {
    const newId = Math.max(...categorias.map(c => c.id_categoria), 0) + 1;
    const newCategoria = { id_categoria: newId, ...catData };
    setCategorias(prev => [...prev, newCategoria]);
    return newCategoria;
  };

  // CRUD for EDITORIALES
  const addEditorial = (editData) => {
    const newId = Math.max(...editoriales.map(e => e.id_editorial), 0) + 1;
    const newEditorial = { id_editorial: newId, ...editData };
    setEditoriales(prev => [...prev, newEditorial]);
    return newEditorial;
  };

  const value = {
    // Processed books (with relationships)
    books,
    // Raw data
    libros,
    autores,
    editoriales,
    categorias,
    autorLibro,
    ejemplares,
    usuarios,
    prestamos,
    reservas,
    multas,
    // Book operations
    addBook,
    updateBook,
    deleteBook,
    getBook,
    // Ejemplar operations
    addEjemplar,
    updateEjemplar,
    // Other operations
    addAutor,
    addCategoria,
    addEditorial,
    // Setters for direct updates
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
