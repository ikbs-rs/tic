// importujemo pool iz fajla za konekciju sa bazom
import pool from '../db/db.js';

// funkcija koja vraća slog iz tabele userpermiss - za dati userId i roleId

const getUserPermission = async (userId, role) => {
  try {
    const query = 'SELECT * FROM adm_userpermiss WHERE usr=$1 AND roll=$2';
    const params = [userId, role];
    const { rows } = await pool.query(query, params);
    return rows[0];
  } catch (error) {
    throw new Error(`Greška pri dohvatanju sloga iz baze: ${error.message}`);
  }
};

export default {
  getUserPermission,
}  