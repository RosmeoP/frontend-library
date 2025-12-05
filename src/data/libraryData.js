// --- CATÁLOGO BIBLIOGRÁFICO ---

export const autores = [
  { id_autor: 1, nombres: 'Francis Scott', apellidos: 'Fitzgerald', nacionalidad: 'Estados Unidos' },
  { id_autor: 2, nombres: 'Harper', apellidos: 'Lee', nacionalidad: 'Estados Unidos' },
  { id_autor: 3, nombres: 'George', apellidos: 'Orwell', nacionalidad: 'Reino Unido' },
  { id_autor: 4, nombres: 'Jane', apellidos: 'Austen', nacionalidad: 'Reino Unido' },
  { id_autor: 5, nombres: 'Jerome David', apellidos: 'Salinger', nacionalidad: 'Estados Unidos' },
  { id_autor: 6, nombres: 'Gabriel', apellidos: 'García Márquez', nacionalidad: 'Colombia' },
  { id_autor: 7, nombres: 'John Ronald Reuel', apellidos: 'Tolkien', nacionalidad: 'Reino Unido' },
  { id_autor: 8, nombres: 'Aldous', apellidos: 'Huxley', nacionalidad: 'Reino Unido' },
];

export const editoriales = [
  { id_editorial: 1, nombre: 'Scribner', pais: 'Estados Unidos', email_contacto: 'contact@scribner.com' },
  { id_editorial: 2, nombre: 'J.B. Lippincott & Co.', pais: 'Estados Unidos', email_contacto: 'info@lippincott.com' },
  { id_editorial: 3, nombre: 'Secker & Warburg', pais: 'Reino Unido', email_contacto: 'contact@seckerwarburg.co.uk' },
  { id_editorial: 4, nombre: 'T. Egerton', pais: 'Reino Unido', email_contacto: 'info@tegerton.co.uk' },
  { id_editorial: 5, nombre: 'Little, Brown and Company', pais: 'Estados Unidos', email_contacto: 'contact@littlebrown.com' },
  { id_editorial: 6, nombre: 'Editorial Sudamericana', pais: 'Argentina', email_contacto: 'contacto@sudamericana.com' },
  { id_editorial: 7, nombre: 'Allen & Unwin', pais: 'Reino Unido', email_contacto: 'info@allenunwin.co.uk' },
  { id_editorial: 8, nombre: 'Chatto & Windus', pais: 'Reino Unido', email_contacto: 'contact@chattowindus.co.uk' },
];

export const categorias = [
  { id_categoria: 1, nombre: 'Classic', descripcion: 'Timeless masterpieces of literature that have stood the test of time.' },
  { id_categoria: 2, nombre: 'Dystopian', descripcion: 'Dark visions of possible futures and cautionary tales about society.' },
  { id_categoria: 3, nombre: 'Romance', descripcion: 'Love stories that touch the heart and explore human relationships.' },
  { id_categoria: 4, nombre: 'Fiction', descripcion: 'Imaginative stories and narratives that explore the human condition.' },
  { id_categoria: 5, nombre: 'Magical Realism', descripcion: 'Where reality meets the magical in everyday life.' },
  { id_categoria: 6, nombre: 'Fantasy', descripcion: 'Magical worlds and epic adventures beyond imagination.' },
];

export const libros = [
  {
    id_libro: 1,
    titulo: 'The Great Gatsby',
    ISBN: '978-0-7432-7356-5',
    anio_edicion: 1925,
    codigo_editorial: 1,
    id_categoria: 1,
    sinopsis: 'A story of decadence and excess, Gatsby explores the American Dream in the Jazz Age.',
    portada: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
  },
  {
    id_libro: 2,
    titulo: 'To Kill a Mockingbird',
    ISBN: '978-0-06-112008-4',
    anio_edicion: 1960,
    codigo_editorial: 2,
    id_categoria: 1,
    sinopsis: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    portada: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
  },
  {
    id_libro: 3,
    titulo: '1984',
    ISBN: '978-0-451-52493-5',
    anio_edicion: 1949,
    codigo_editorial: 3,
    id_categoria: 2,
    sinopsis: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    portada: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
  },
  {
    id_libro: 4,
    titulo: 'Pride and Prejudice',
    ISBN: '978-0-14-143951-8',
    anio_edicion: 1813,
    codigo_editorial: 4,
    id_categoria: 3,
    sinopsis: 'A romantic novel following the emotional development of Elizabeth Bennet.',
    portada: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop',
  },
  {
    id_libro: 5,
    titulo: 'The Catcher in the Rye',
    ISBN: '978-0-316-76948-0',
    anio_edicion: 1951,
    codigo_editorial: 5,
    id_categoria: 4,
    sinopsis: 'A story about teenage alienation and loss of innocence in post-war America.',
    portada: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
  },
  {
    id_libro: 6,
    titulo: 'One Hundred Years of Solitude',
    ISBN: '978-0-06-088328-7',
    anio_edicion: 1967,
    codigo_editorial: 6,
    id_categoria: 5,
    sinopsis: 'A landmark of magical realism, chronicling the Buendía family over seven generations.',
    portada: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop',
  },
  {
    id_libro: 7,
    titulo: 'The Hobbit',
    ISBN: '978-0-618-00221-3',
    anio_edicion: 1937,
    codigo_editorial: 7,
    id_categoria: 6,
    sinopsis: 'A fantasy adventure following Bilbo Baggins on an unexpected journey.',
    portada: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop',
  },
  {
    id_libro: 8,
    titulo: 'Brave New World',
    ISBN: '978-0-06-085052-4',
    anio_edicion: 1932,
    codigo_editorial: 8,
    id_categoria: 2,
    sinopsis: 'A dystopian novel set in a futuristic World State of genetically modified citizens.',
    portada: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
  },
];

// Relación muchos a muchos: AUTOR_LIBRO
export const autorLibro = [
  { id_autor: 1, id_libro: 1 },
  { id_autor: 2, id_libro: 2 },
  { id_autor: 3, id_libro: 3 },
  { id_autor: 4, id_libro: 4 },
  { id_autor: 5, id_libro: 5 },
  { id_autor: 6, id_libro: 6 },
  { id_autor: 7, id_libro: 7 },
  { id_autor: 8, id_libro: 8 },
];

// --- GESTIÓN DE INVENTARIO ---

export const ejemplares = [
  { id_ejemplar: 1, id_libro: 1, codigo_barras: 'LIB-001-001', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 2, id_libro: 1, codigo_barras: 'LIB-001-002', estado: 'Prestado', nota_estado: null },
  { id_ejemplar: 3, id_libro: 2, codigo_barras: 'LIB-002-001', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 4, id_libro: 2, codigo_barras: 'LIB-002-002', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 5, id_libro: 3, codigo_barras: 'LIB-003-001', estado: 'Prestado', nota_estado: null },
  { id_ejemplar: 6, id_libro: 4, codigo_barras: 'LIB-004-001', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 7, id_libro: 5, codigo_barras: 'LIB-005-001', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 8, id_libro: 5, codigo_barras: 'LIB-005-002', estado: 'Reparacion', nota_estado: 'Lomo dañado' },
  { id_ejemplar: 9, id_libro: 6, codigo_barras: 'LIB-006-001', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 10, id_libro: 7, codigo_barras: 'LIB-007-001', estado: 'Perdido', nota_estado: 'Reportado perdido 2024-01-15' },
  { id_ejemplar: 11, id_libro: 7, codigo_barras: 'LIB-007-002', estado: 'Disponible', nota_estado: null },
  { id_ejemplar: 12, id_libro: 8, codigo_barras: 'LIB-008-001', estado: 'Disponible', nota_estado: null },
];

// --- USUARIOS ---

export const usuarios = [
  { id_usuario: 1, carnet: 'EST-2024-001', nombre: 'Carlos', apellido: 'Mendoza', email: 'carlos.mendoza@universidad.edu', telefono: '555-0101', tipo_usuario: 'Estudiante', estado: 'Activo' },
  { id_usuario: 2, carnet: 'EST-2024-002', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@universidad.edu', telefono: '555-0102', tipo_usuario: 'Estudiante', estado: 'Activo' },
  { id_usuario: 3, carnet: 'PROF-2020-001', nombre: 'Roberto', apellido: 'Silva', email: 'roberto.silva@universidad.edu', telefono: '555-0201', tipo_usuario: 'Profesor', estado: 'Activo' },
  { id_usuario: 4, carnet: 'ADM-2019-001', nombre: 'Ana', apellido: 'Ramírez', email: 'ana.ramirez@universidad.edu', telefono: '555-0301', tipo_usuario: 'Administrativo', estado: 'Activo' },
  { id_usuario: 5, carnet: 'EST-2023-015', nombre: 'Luis', apellido: 'Torres', email: 'luis.torres@universidad.edu', telefono: '555-0103', tipo_usuario: 'Estudiante', estado: 'Suspendido' },
];

// --- TRANSACCIONES ---

export const prestamos = [
  { id_prestamo: 1, id_ejemplar: 2, id_usuario: 1, fecha_prestamo: '2024-11-20T10:30:00', fecha_devolucion_esperada: '2024-12-04', fecha_devuelto: null, estado_prestamo: 'Activo' },
  { id_prestamo: 2, id_ejemplar: 5, id_usuario: 3, fecha_prestamo: '2024-11-15T14:00:00', fecha_devolucion_esperada: '2024-11-29', fecha_devuelto: null, estado_prestamo: 'Vencido' },
  { id_prestamo: 3, id_ejemplar: 3, id_usuario: 2, fecha_prestamo: '2024-10-01T09:00:00', fecha_devolucion_esperada: '2024-10-15', fecha_devuelto: '2024-10-14', estado_prestamo: 'Finalizado' },
];

export const reservas = [
  { id_reserva: 1, id_libro: 3, id_usuario: 2, fecha_solicitud: '2024-11-25T16:45:00', estado: 'Pendiente' },
  { id_reserva: 2, id_libro: 1, id_usuario: 4, fecha_solicitud: '2024-11-28T11:20:00', estado: 'Listo para recoger' },
];

export const multas = [
  { id_multa: 1, id_prestamo: 2, monto: 15.00, pagado: false, fecha_pago: null },
];

// --- HELPER FUNCTIONS ---

export const getAutoresByLibro = (idLibro, autorLibroList, autoresList) => {
  const autorIds = autorLibroList.filter(al => al.id_libro === idLibro).map(al => al.id_autor);
  return autoresList.filter(a => autorIds.includes(a.id_autor));
};

export const getEditorialByLibro = (libro, editorialesList) => {
  return editorialesList.find(e => e.id_editorial === libro.codigo_editorial);
};

export const getCategoriaByLibro = (libro, categoriasList) => {
  return categoriasList.find(c => c.id_categoria === libro.id_categoria);
};

export const getEjemplaresByLibro = (idLibro, ejemplaresList) => {
  return ejemplaresList.filter(e => e.id_libro === idLibro);
};

export const getEjemplaresDisponibles = (idLibro, ejemplaresList) => {
  return ejemplaresList.filter(e => e.id_libro === idLibro && e.estado === 'Disponible');
};

export const getLibroCompleto = (libro, { autores, editoriales, categorias, autorLibro, ejemplares }) => {
  const autoresLibro = getAutoresByLibro(libro.id_libro, autorLibro, autores);
  const editorial = getEditorialByLibro(libro, editoriales);
  const categoria = getCategoriaByLibro(libro, categorias);
  const ejemplaresLibro = getEjemplaresByLibro(libro.id_libro, ejemplares);
  const disponibles = ejemplaresLibro.filter(e => e.estado === 'Disponible').length;
  
  return {
    ...libro,
    autores: autoresLibro,
    autorNombre: autoresLibro.map(a => `${a.nombres} ${a.apellidos}`).join(', '),
    editorial,
    editorialNombre: editorial?.nombre || 'Desconocida',
    categoria,
    categoriaNombre: categoria?.nombre || 'Sin categoría',
    ejemplares: ejemplaresLibro,
    totalEjemplares: ejemplaresLibro.length,
    ejemplaresDisponibles: disponibles,
    disponible: disponibles > 0,
  };
};
