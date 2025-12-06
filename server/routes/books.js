import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT l.*, c.nombre as categoria_nombre, e.nombre as editorial_nombre
      FROM libros l
      LEFT JOIN categoria c ON l.id_categoria = c.id_categoria
      LEFT JOIN editorial e ON l.codigoeditorial = e.id_editorial
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

router.post('/', async (req, res) => {
  try {
    const { titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis } = req.body;
    const result = await query(
      `INSERT INTO libros (titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis } = req.body;
    const result = await query(
      `UPDATE libros SET titulo = $1, isbn = $2, anoedicion = $3, codigoeditorial = $4, 
       id_categoria = $5, sinopsis = $6 WHERE id_libro = $7 RETURNING *`,
      [titulo, isbn, anoedicion, codigoeditorial, id_categoria, sinopsis, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating book' });
  }
});

router.delete('/:id', async (req, res) => {
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

router.post('/:id/copies', async (req, res) => {
  try {
    const { id } = req.params;
    const { ubicacion, estado } = req.body;
    const result = await query(
      'INSERT INTO ejemplar (id_libro, ubicacion, estado) VALUES ($1, $2, $3) RETURNING *',
      [id, ubicacion || 'General', estado || 'Disponible']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating book copy' });
  }
});

export default router;
