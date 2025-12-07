import express from 'express';
import { query } from '../db/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT l.*, c.nombre as categoria_nombre, ed.nombre as editorial_nombre,
        COUNT(e.id_ejemplar) as "totalEjemplares",
        COUNT(CASE WHEN e.estado = 'Disponible' THEN 1 END) as "ejemplaresDisponibles",
        CASE WHEN COUNT(CASE WHEN e.estado = 'Disponible' THEN 1 END) > 0 THEN true ELSE false END as disponible
      FROM libros l
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      LEFT JOIN editorial ed ON l.codigoeditorial = ed.id_editorial
      LEFT JOIN ejemplar e ON l.id_libro = e.id_libro
      GROUP BY l.id_libro, c.nombre, ed.nombre
      ORDER BY l.titulo
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

router.get('/available', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vw_libros_disponibles ORDER BY titulo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching available books' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    const result = await query('SELECT * FROM sp_buscar_libros_disponibles($1)', [term || '']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error searching books' });
  }
});

router.get('/copies/all', async (req, res) => {
  try {
    const result = await query(`
      SELECT e.*, l.titulo as libro_titulo
      FROM ejemplar e
      LEFT JOIN libros l ON e.id_libro = l.id_libro
      ORDER BY e.id_ejemplar
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching all copies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM libros WHERE id_libro = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching book' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, portada, cantidad, autores } = req.body;
    const result = await query(
      `INSERT INTO libros (titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, portada) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, portada]
    );
    const newBook = result.rows[0];
    
    // Associate authors with the book
    if (autores && Array.isArray(autores) && autores.length > 0) {
      for (const autorId of autores) {
        await query(
          'INSERT INTO autor_libro (id_autor, id_libro) VALUES ($1, $2)',
          [autorId, newBook.id_libro]
        );
      }
    }
    
    const stockCount = parseInt(cantidad) || 0;
    for (let i = 0; i < stockCount; i++) {
      const codigoBarras = `LIB-${newBook.id_libro.toString().padStart(3, '0')}-${(i + 1).toString().padStart(3, '0')}`;
      await query(
        'INSERT INTO ejemplar (id_libro, codigo_barras, estado) VALUES ($1, $2, $3)',
        [newBook.id_libro, codigoBarras, 'Disponible']
      );
    }
    
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating book' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, portada, cantidad, autores } = req.body;
    const result = await query(
      `UPDATE libros SET titulo = $1, isbn = $2, anoedicion = $3, codigoeditorial = $4, 
       id_categoria = $5, sinopsis = $6, portada = $7 WHERE id_libro = $8 RETURNING *`,
      [titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, portada, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Update author associations
    if (autores && Array.isArray(autores)) {
      // Remove existing associations
      await query('DELETE FROM autor_libro WHERE id_libro = $1', [id]);
      
      // Add new associations
      for (const autorId of autores) {
        await query(
          'INSERT INTO autor_libro (id_autor, id_libro) VALUES ($1, $2)',
          [autorId, id]
        );
      }
    }
    
    const desiredStock = parseInt(cantidad);
    if (!isNaN(desiredStock)) {
      const currentCopiesResult = await query(
        'SELECT COUNT(*) as count FROM ejemplar WHERE id_libro = $1',
        [id]
      );
      const currentStock = parseInt(currentCopiesResult.rows[0].count) || 0;
      
      if (desiredStock > currentStock) {
        const toAdd = desiredStock - currentStock;
        for (let i = 0; i < toAdd; i++) {
          const codigoBarras = `LIB-${id.toString().padStart(3, '0')}-${(currentStock + i + 1).toString().padStart(3, '0')}`;
          await query(
            'INSERT INTO ejemplar (id_libro, codigo_barras, estado) VALUES ($1, $2, $3)',
            [id, codigoBarras, 'Disponible']
          );
        }
      } else if (desiredStock < currentStock) {
        const toRemove = currentStock - desiredStock;
        const availableResult = await query(
          `SELECT COUNT(*) as count FROM ejemplar WHERE id_libro = $1 AND estado = 'Disponible'`,
          [id]
        );
        const availableCount = parseInt(availableResult.rows[0].count) || 0;
        
        if (availableCount < toRemove) {
          return res.status(400).json({ 
            error: `No se pueden eliminar ${toRemove} ejemplares. Solo hay ${availableCount} disponibles (los demás están prestados).` 
          });
        }
        
        await query(
          `DELETE FROM ejemplar WHERE id_ejemplar IN (
            SELECT id_ejemplar FROM ejemplar 
            WHERE id_libro = $1 AND estado = 'Disponible' 
            ORDER BY id_ejemplar DESC LIMIT $2
          )`,
          [id, toRemove]
        );
      }
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating book' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM libros WHERE id_libro = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

router.get('/:id/authors', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT a.* FROM autor a
      JOIN autor_libro al ON a.id_autor = al.id_autor
      WHERE al.id_libro = $1
      ORDER BY a.apellidos, a.nombres
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching book authors' });
  }
});

router.get('/:id/copies', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM ejemplar WHERE id_libro = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching book copies' });
  }
});

router.post('/:id/copies', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo_barras, estado, nota_estado } = req.body;
    
    // Generate barcode if not provided
    let codigoBarras = codigo_barras;
    if (!codigoBarras) {
      const countResult = await query('SELECT COUNT(*) as count FROM ejemplar WHERE id_libro = $1', [id]);
      const count = parseInt(countResult.rows[0].count) || 0;
      codigoBarras = `LIB-${id.toString().padStart(3, '0')}-${(count + 1).toString().padStart(3, '0')}`;
    }
    
    const result = await query(
      'INSERT INTO ejemplar (id_libro, codigo_barras, estado, nota_estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, codigoBarras, estado || 'Disponible', nota_estado || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating book copy' });
  }
});

export default router;
