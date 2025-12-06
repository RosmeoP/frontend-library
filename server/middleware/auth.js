import { query } from '../db/index.js';

export const requireAuth = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'No autorizado. Inicie sesión para continuar.' });
  }

  try {
    const result = await query('SELECT * FROM usuario WHERE id_usuario = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de autenticación.' });
  }
};

export const requireAdmin = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'No autorizado. Inicie sesión para continuar.' });
  }

  try {
    const result = await query('SELECT * FROM usuario WHERE id_usuario = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }
    
    const user = result.rows[0];
    const adminRoles = ['Administrativo', 'Bibliotecario'];
    
    if (!adminRoles.includes(user.tipo_usuario)) {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de autenticación.' });
  }
};
