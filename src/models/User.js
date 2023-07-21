import db from "../db/db.js";

//find Menu function
const findByUsername = async (mail) => {
  const rows = await db.query(
    "SELECT * FROM adm_user WHERE mail = $1",
    [mail]
  );
  return rows.rows[0];
};

export default {
  findByUsername,
};
