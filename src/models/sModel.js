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
      //console.log("***", uId)
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

const copyEvent = async (eventId, tmpId, begda, endda) => {
  const client = await db.connect(); // Povežite se s bazom podataka koristeći klijenta

  try {
    await client.query("BEGIN"); // Početak transakcije
    let ok = false;

    // Prvo obrišite podatke
    await client.query("DELETE FROM tic_eventst WHERE event = $1", [eventId]);
    await client.query("DELETE FROM tic_eventartcena WHERE event = $1", [eventId]);
    await client.query("DELETE FROM tic_eventart WHERE event = $1", [eventId]);
    await client.query("DELETE FROM tic_eventobj WHERE event = $1", [eventId]);
    await client.query("DELETE FROM tic_eventatts WHERE event = $1", [eventId]);

    // Zatim umetnite nove podatke koristeći SELECT INTO
    await client.query(
      `
      INSERT INTO tic_eventatts (id, site, event, att, value, valid, text)
      SELECT nextval('tic_table_id_seq'), site, $1, att, value, valid, text
      FROM tic_eventatts
      WHERE event = $2
    `,
      [eventId, tmpId]
    );

    await client.query(
      `
      INSERT INTO tic_eventobj (id, site, event, objtp, obj, begda, endda)
      SELECT nextval('tic_table_id_seq'), site, $1, objtp, obj, $3, $4
      FROM tic_eventobj
      WHERE event = $2
    `,
      [eventId, tmpId, begda, endda]
    );

    // await client.tquery(
    //   `
    //   INSERT INTO tic_eventart (id, site, event, art, descript, begda, endda, nart, discount)
    //   SELECT nextval('tic_table_id_seq'), site, $1, art, descript, $3, $4, nart, discount
    //   FROM tic_eventart
    //   WHERE event = $2
    // `,
    //   [eventId, tmpId, begda, endda]
    // );

    // Fetch rows from tic_eventatt
    const eventArtRows = await db.query(`
      SELECT nextval('tic_table_id_seq') id , site, $1 event, art, descript, $3 begda, $4 endda, nart, discount
      FROM tic_eventart
      WHERE event = $2
    `,
      [eventId, tmpId, begda, endda]);

    for (const row of eventArtRows.rows) {
      await db.query(`
          INSERT INTO tic_eventart (id, site, event, art, descript, begda, endda, nart, discount)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [row.id, row.site, row.event, row.art, row.descript, row.begda, row.endda, row.nart, row.discount]);

      const eventArtCenaRows = await db.query(`
        SELECT nextval('tic_table_id_seq') id, site, $1 event, art, cena, value, terr, $3 begda, $4 endda, curr, $5 eventart
        FROM tic_eventartcena
        WHERE event = $2      
        `,
        [eventId, tmpId, begda, endda, row.id]);
      for (const row1 of eventArtCenaRows.rows) {
        await db.query(`
          INSERT INTO tic_eventartcena (id, site, event, art, cena, value, terr, begda, endda, curr, eventart)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [row1.id, row1.site, row1.event, row1.art, row1.cena, row1.value, row1.terr, row1.begda, row1.endda, row1.curr, row1.eventart]);
      }
    }


    // await client.query(
    //   `
    //   INSERT INTO tic_eventartcena (id, site, event, art, cena, value, terr, begda, endda, curr, eventarr)
    //   SELECT nextval('tic_table_id_seq'), site, $1, art, cena, value, terr, $3, $4, curr, eventarr
    //   FROM tic_eventartcena
    //   WHERE event = $2
    // `,
    //   [eventId, tmpId, begda, endda]
    // );

    await client.query(
      `
      INSERT INTO tic_eventst (id, site, loc1, code1, text1, ntp1, loc2, code2, text2, ntp2, event, graftp, latlongs, radius, color, fillcolor, originfillcolor, rownum, art, cart, nart, longtext, tp1, tp2, kol)
      SELECT nextval('tic_table_id_seq'), site, loc1, code1, text1, ntp1, loc2, code2, text2, ntp2, $1, graftp, latlongs, radius, color, fillcolor, originfillcolor, rownum, art, cart, nart, longtext, tp1, tp2, kol
      FROM tic_eventst
      WHERE event = $2
    `,
      [eventId, tmpId]
    );

    await client.query("COMMIT"); // Potvrdite transakciju
    ok = true;

    return ok;
  } catch (error) {
    await client.query("ROLLBACK"); // Poništite transakciju u slučaju greške
    throw error;
  } finally {
    client.release(); // Oslobodite klijenta
  }
};


export default {
  getAgendaL,
  getArtL,
  moveAndCopy,
  getEventartCena,
  autoEventatts,
  copyEvent,
};
