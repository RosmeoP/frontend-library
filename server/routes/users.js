import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM usuario ORDER BY apellido, nombre');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/with-fines', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vw_usuarios_con_multas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users with fines' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM sp_obtener_historial_usuario($1)', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user history' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, tipo_usuario } = req.body;
    const result = await query(
      `INSERT INTO usuario (nombre, apellido, email, telefono, direccion, tipo_usuario, fecha_registro, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, 'Activo') RETURNING *`,
      [nombre, apellido, email, telefono, direccion, tipo_usuario || 'Estudiante']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion, tipo_usuario, estado } = req.body;
    const result = await query(
      `UPDATE usuario SET nombre = $1, apellido = $2, email = $3, telefono = $4, 
       direccion = $5, tipo_usuario = $6, estado = $7 WHERE id_usuario = $8 RETURNING *`,
      [nombre, apellido, email, telefono, direccion, tipo_usuario, estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
