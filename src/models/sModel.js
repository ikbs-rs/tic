import db from "../db/db.js";
import entities from "./entitis/entitis.js";
import { uniqueId } from "../middleware/utility.js";

const saltRounds = 10;


const getAgendaL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, text textx, aa.begtm, aa.endtm, aa.valid, aa.lang, aa.grammcase,
        aa.tg, getValueById(aa.tg, 'tic_agendatpx_v', 'code', '${lang || 'en'}') ctp, getValueById(aa.tg, 'tic_agendatpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_agendax_v aa
  where aa.lang = '${lang || 'en'}'`

  //const [rows] = await db.query(sqlRecenic);
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getArtL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id, aa.site, aa.code, aa.text, aa."event", aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
        aa.tp, p.code ctp, p."text" ntp, 
        aa.um, u.code cum, u.text num,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.grp, g.code cgrp, g.text ngrp
  from tic_artx_v aa, tic_arttpx_v p, cmn_umx_v u, cmn_tgpx_v t, tic_artgrpx_v g
  where aa.lang = '${lang || 'en'}'
  and aa.tp = p.id 
  and aa.um = u.id 
  and aa.tgp = t.id 
  and aa.grp = g.id
  and	p.lang = '${lang || 'en'}'
  and	u.lang = '${lang || 'en'}'
  and	t.lang = '${lang || 'en'}'
  and	g.lang = '${lang || 'en'}'`

  //const [rows] = await db.query(sqlRecenic);
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const moveAndCopy = async (att, objName1, objName2, objId1, objId2, stm, lang) => {
  try {
    await db.query("BEGIN");

    // First, delete from one table
    const deleteResult = await db.query(`DELETE FROM ${objName1} WHERE ${att}  = $1`, [objId1]);

    // Create a temporary table in PostgreSQL
    await db.query(`
      CREATE TEMP TABLE ${objName2} AS
      SELECT *
      FROM ${objName1}
      WHERE ${att} = $1
    `, [objId2]);

    // Update the temporary table
    await db.query(`
      UPDATE ${objName2} 
      SET ${att} = $1
    `, [objId1]);

    // Insert data from the temporary table into tic_eventtpatt
    await db.query(`
      INSERT INTO ${objName1} (id, site, event, att, value, valid, text)
      SELECT $1, site, event, att, value, valid, text
      FROM ${objName2} 
    `, [uniqueId]); // Replace uniqueId with an actual value

    await db.query("COMMIT"); // Confirm the transaction

    return {
      deleteRowCount: deleteResult.rowCount,
      copyRowCount: result1.rowCount // Replace result1 with the correct value
    };
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Rollback the transaction in case of an error
    }
    throw error;
  }
}

const getEventartCena = async (objName, objId, objId1, lang) => {
  const sqlRecenica =
    `
    SELECT distinct c.id, c.code, c."text", c.lang, c.grammcase 
    FROM tic_eventartcena a, tic_cenax_v c
    where	a.event = ${objId}
    and a.art = ${objId1}
    and   a.cena = c.id
    and c.lang = '${lang || 'en'}'
    `
  console.log(sqlRecenica, "#######################getEventartCena###########################")
  //const [rows] = await db.query(sqlRecenic);
  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const autoEventatts = async (eventId) => {
  try {
    let uId = '11111111111111111111'
    await db.query("BEGIN");
    let ok = false;

    await db.query(
    `
      delete from tic_eventatts
      where event = $1
    `, [eventId]);

    // Fetch rows from tic_eventatt
    const eventAttRows = await db.query(`
      SELECT id, code, text
      FROM tic_eventatt
      WHERE valid = 1
    `);
    //for (let i = 0; i < 1000; i++) {
    for (const row of eventAttRows.rows) {
      uId = await uniqueId()
      console.log("***", uId)
      // Insert rows into tic_eventatts
      await db.query(`
        INSERT INTO tic_eventatts (id, site, event, att, value, valid, text)
        VALUES ($1, NULL, $2, $3, '', 1, '')
      `, [uId, eventId, row.id]);
    //}
  }
    await db.query("COMMIT"); // Confirm the transaction
    ok = true;

    return ok;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Rollback the transaction in case of an error
    }
    throw error;
  }
};

export default {
  getAgendaL,
  getArtL,
  moveAndCopy,
  getEventartCena,
  autoEventatts,
};
