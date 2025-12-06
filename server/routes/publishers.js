import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM editorial ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching publishers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM editorial WHERE id_editorial = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching publisher' });
  }
});

router.get('/:id/books', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM libros WHERE codigoeditorial = $1 ORDER BY titulo', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching publisher books' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, pais, email_contacto } = req.body;
    const result = await query(
      'INSERT INTO editorial (nombre, pais, email_contacto) VALUES ($1, $2, $3) RETURNING *',
      [nombre, pais, email_contacto]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating publisher' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, pais, email_contacto } = req.body;
    const result = await query(
      'UPDATE editorial SET nombre = $1, pais = $2, email_contacto = $3 WHERE id_editorial = $4 RETURNING *',
      [nombre, pais, email_contacto, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating publisher' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM editorial WHERE id_editorial = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }
    res.json({ message: 'Publisher deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting publisher' });
  }
});

export default router;
