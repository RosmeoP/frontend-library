import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const [books, users, activeLoans, overdueLoans, unpaidFines] = await Promise.all([
      query('SELECT COUNT(*) as count FROM libros'),
      query('SELECT COUNT(*) as count FROM usuario'),
      query('SELECT COUNT(*) as count FROM prestamos WHERE estado_prestamo = $1', ['Activo']),
      query('SELECT COUNT(*) as count FROM vw_prestamos_vencidos'),
      query('SELECT COUNT(*) as count, COALESCE(SUM(monto), 0) as total FROM multas WHERE pagado = false')
    ]);

    res.json({
      totalBooks: parseInt(books.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      activeLoans: parseInt(activeLoans.rows[0].count),
      overdueLoans: parseInt(overdueLoans.rows[0].count),
      unpaidFines: parseInt(unpaidFines.rows[0].count),
      unpaidFinesTotal: parseFloat(unpaidFines.rows[0].total)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
});

router.get('/loans', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vw_estadisticas_prestamos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching loan statistics' });
  }
});

router.get('/books-by-category', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.nombre as category, COUNT(l.id_libro) as count
      FROM categoria c
      LEFT JOIN libros l ON c.id_categoria = l.id_categoria
      GROUP BY c.id_categoria, c.nombre
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching books by category' });
  }
});

router.get('/users-by-type', async (req, res) => {
  try {
    const result = await query(`
      SELECT tipo_usuario as type, COUNT(*) as count
      FROM usuario
      GROUP BY tipo_usuario
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users by type' });
  }
});

router.get('/recent-loans', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, u.nombre, u.apellido, l.titulo
      FROM prestamos p
      JOIN usuario u ON p.id_usuario = u.id_usuario
      JOIN ejemplar ej ON p.id_ejemplar = ej.id_ejemplar
      JOIN libros l ON ej.id_libro = l.id_libro
      ORDER BY p.fecha_prestamo DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching recent loans' });
  }
});

export default router;
