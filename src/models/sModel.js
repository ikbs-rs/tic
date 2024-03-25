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
      SELECT id, code, text, link
      FROM tic_eventatt
      WHERE valid = 1
    `);
    //for (let i = 0; i < 1000; i++) {
    for (const row of eventAttRows.rows) {
      uId = await uniqueId()
      //console.log("***", uId)
      // Insert rows into tic_eventatts
      await db.query(`
        INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, link)
        VALUES ($1, NULL, $2, $3, '', 1, '', $4)
      `, [uId, eventId, row.id, row.link]);
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

  console.log(tmpId, "*********copyEvent*******", eventId)
  const client = await db.connect(); // Povežite se s bazom podataka koristeći klijenta

  try {
    await client.query("BEGIN"); // Početak transakcije
    let ok = false;

    // Prvo obrišite podatke
    console.log("Brisem tic_eventst")
    await client.query("DELETE FROM tic_eventst WHERE event = $1", [eventId]);
    console.log("Brisem tic_eventartcena")
    await client.query("DELETE FROM tic_eventartcena WHERE event = $1", [eventId]);
    console.log("Brisem tic_eventart")
    await client.query("DELETE FROM tic_eventart WHERE event = $1", [eventId]);
    console.log("Brisem tic_eventobj")
    await client.query("DELETE FROM tic_eventobj WHERE event = $1", [eventId]);
    await client.query("DELETE FROM tic_eventatts WHERE event = $1", [eventId]);

    // Zatim umetnite nove podatke koristeći SELECT INTO
    console.log("Inser  tic_eventatts")
    await client.query(
      `
      INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, link)
      SELECT nextval('iis.tic_table_id_seq'), site, $1, att, value, valid, text, link
      FROM tic_eventatts
      WHERE event = $2
    `,
      [eventId, tmpId]
    );

    console.log("Inser  tic_eventobj")
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
      SELECT nextval('tic_table_id_seq') id , site, $1 event, art, descript, $3 begda, $4 endda, nart, discount, id idold
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
        and eventart = $6    
        `,
        [eventId, tmpId, begda, endda, row.id, row.idold]);
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

/*  copyEventSettings *********************************************************************************************/

const copyEventSettings = async (eventId, tmpId, begda, endda) => {

  console.log(tmpId, "*********copyEvent*******", eventId)
  const client = await db.connect(); // Povežite se s bazom podataka koristeći klijenta

  try {
    await client.query("BEGIN"); // Početak transakcije
    let ok = false;

    // Prvo obrišite podatke
    console.log("Brisem tic_eventatts")
    // await client.query("DELETE FROM tic_eventatts WHERE event = $1", [eventId]);


    // Fetch rows from tic_eventatts
    const eventAttsRows = await db.query(`
    SELECT nextval('iis.tic_table_id_seq') id, site, $1 event, att, value, valid, text, color, icon, "condition", link, minfee 
    FROM tic_eventatts
    WHERE event = $2
  `,
      [eventId, tmpId]
    );

    for (const row of eventAttsRows.rows) {
      await db.query(`
        INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, color, icon, "condition", link, minfee )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [row.id, row.site, row.event, row.att, row.value, row.valid, row.text, row.color, row.icon, row.condition, row.link, row.minfee]);
    }

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

/*  activateEvent *********************************************************************************************/

const activateEvent = async (eventId) => {

  const client = await db.connect(); // Povežite se s bazom podataka koristeći klijenta

  try {
    await client.query("BEGIN"); // Početak transakcije
    let ok = false;
    console.log("***********************-00****************************")
    // Setuje se status 
    await client.query("UPDATE tic_event set status = 2 WHERE event = $1", [eventId]);
    console.log("***********************00****************************")

    // Create row for tic_doc
    const docRows = await db.query(`
      SELECT nextval('tic_table_id_seq') id , null site, to_char(NOW(), 'YYYYMMDD') "date", to_char(NOW(), 'YYYYMMDDHH24MISS') tm, 1 curr, 1 currrate, 
      a.par usr, 1 status, 1 docobj, a.id broj, $1 obj2, ' ' opis, to_char(NOW(), 'YYYYMMDDHH24MISS') timecreation, 0 storno, to_char(NOW(), 'YYYY') "year"
      FROM tic_event a
      WHERE a.id = $2
    `,
      [eventId, eventId]);
    console.log("***********************01****************************")
    let i = 0
    const docvr = "1683550594276921344"
    for (const row of docRows.rows) {
      console.log(eventId, "***********************02********************row********", row)
      // Insertuje se zaglavlje dokumenta - kupac organizator
      const docId = row.id
      await db.query(`
          INSERT INTO tic_doc (id , site, date, tm, curr, currrate, usr, status, docobj, broj, obj2, opis, timecreation, storno, year, docvr)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [docId, row.site, row.date, row.tm, row.curr, row.currrate, row.usr, row.status, row.docobj, row.broj, row.obj2, row.opis, row.timecreation, row.storno, row.year, docvr]);
      console.log(docId, "***********************02****************************", ++i)
      // Upit za sezonske doga]aje koji se primenjuju na pojedinacni
      // Ako se kupac prijavljuje onda je to rezervacija u suprotnom je odmah racun

      const docsRows = await db.query(`
          SELECT nextval('tic_table_id_seq') id, site, $1 doc, $2 event, loc, art, tgp, taxrate, 0 price, input, output, 0 discount, curr, currrate, 0 duguje, 0 potrazuje, 0 leftcurr,
          0 rightcurr, to_char(NOW(), 'YYYYMMDDHH24MISS') begtm, '99991231000000' endtm, 1 status, 0 fee, par, ' ' descript
          FROM tic_docs
          WHERE event in (
            select a.value::numeric 
            from	tic_eventatts a, tic_eventatt b
            where a.event = $3
            and a.att = b.id 
            and b.code  in ('SZN', 'XGRP')
          ) 
        `,
        [row.id, eventId, eventId]);
      console.log("***********************03****************************", docId)
      for (const row1 of docsRows.rows) {
        console.log("***********************04****************************", row.id)
        //Insert stavki sezonskih karti. Cena i iznos se neupisuju.
        await db.query(`
          INSERT INTO tic_docs (id, site, doc, event, loc, art, tgp, taxrate, price, input, output, discount, curr, currrate, duguje, potrazuje,
            leftcurr, rightcurr, begtm, endtm, status, fee, par, descript)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
          `, [row1.id, row1.site, row.id, row1.event, row1.loc, row1.art, row1.tgp, row1.taxrate, row1.price, row1.input,
        row1.output, row1.discount, row1.curr, row1.currrate, row1.duguje, row1.potrazuje,
        row1.leftcurr, row1.rightcurr, row1.begtm, row1.endtm, row1.status, row1.fee, row1.par, row1.descript]);
      }
    }

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

const copyTpEventloc = async (eventId, par1, lang) => {
  const client = await db.connect(); 
  try {

    console.log(par1, "*00**************************copyGrpEvent*******************************")
    let ok = false;
    let uId = '11111111111111111111'
    await client.query("BEGIN");

    if (!(par1 == 'true')) {
      await client.query(
        `
      delete from tic_eventloc
      where event = $1
      and loc in (
        select id
        from  cmn_loc l
        where ( l.tp = CASE WHEN ${par1} = -1 THEN l.tp  ELSE ${par1}  END )
      )
    `, [eventId]);
    }

    console.log(par1, "*02**************************DELETE*******************************", eventId)    
    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    await client.query(
    `
      INSERT INTO tic_eventloc (id, site, event, loc, begda, endda, color, icon)
      SELECT nextval('iis.tic_table_id_seq') id, null site, e.id event, l.id loc, e.begda, e.endda, ll.color, ll.icon
      FROM tic_event e, cmn_loclink ll, cmn_loc l
      WHERE e.id = $1
      and e.loc = ll.loc2
      and ll.loc1 = l.id 
      and ( l.tp = CASE WHEN ${par1} = -1 THEN l.tp  ELSE ${par1}  END )
    `,
      [eventId]
    );

    await client.query("COMMIT"); // Confirm the transaction
    ok = true;

    return ok;
  } catch (error) {
      await client.query("ROLLBACK"); // Rollback the transaction in case of an error
    throw error;
  } finally {
    client.release(); // Oslobodite klijenta
  }
};

/***************************************************************************************************** */
const copyGrpEventloc = async (eventId, par1, par2, par3, begda, endda, requestBody) => {

  try {
    console.log(par1, "***************************copyGrpEvent*******************************")
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");

    if (!(par1 == 'true')) {
      console.log(par1, "***************************copyGrpEvent - delete *******************************")
      await db.query(
        `
      delete from tic_eventatts
      where event = $1
    `, [eventId]);
    }

    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    const parsedBody = JSON.parse(requestBody.jsonObj);
    console.log(par1, "***************************copyGrpEvent 00 *******************************")
    // Provera da li parsedBody ima svojstvo koje sadrži niz objekata
    if (parsedBody && Array.isArray(parsedBody)) {
      // Iteriramo kroz objekte u parsedBody
      for (const obj of parsedBody) {
        uId = await uniqueId();
        // id numeric(20) NOT NULL,
        // site numeric(20) NULL,
        // "event" numeric(20) NULL,
        // tp numeric(20) NOT NULL,
        // loctp1 numeric(20) NOT NULL,
        // loc1 numeric(20) NOT NULL,
        // loctp2 numeric(20) NOT NULL,
        // loc2 numeric(20) NOT NULL,
        // val varchar(2500) NULL,
        // begda varchar(10) NOT NULL,
        // endda varchar(10) NOT NULL,
        // hijerarhija numeric(1) DEFAULT 0 NULL,
        // onoff numeric(1) DEFAULT 1 NULL,
        // color varchar(100) NULL,
        // icon varchar(100) NULL, 
        // Insert rows into tic_eventatts using obj.id
        console.log(
          eventId, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

        await db.query(`
          INSERT INTO tic_loclink (
            id, site, event, tp, loctp1, loc1, loctp2, loc2, val, begda, endda, hijerarhija, onoff, color, icon)
            VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, '', $8, $9, 1, 0, $10, $11)
        `, [uId, eventId, obj.tp, obj.tp, obj.id, par3, par2, begda, endda, obj.color, obj.icon]);
      }
    }
    console.log(
      eventId, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

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


const copyGrpLoclink = async (table, par1, par2, par3, begda, endda, requestBody) => {

  try {
    const tableObj = JSON.parse(table);
    
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");
    if (par1 == 'true') {
      await db.query(
        `
      delete from cmn_loclink
      where loc2 = $1
    `, [tableObj.id]);
    }

    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    const parsedBody = JSON.parse(requestBody.jsonObj);
    // Provera da li parsedBody ima svojstvo koje sadrži niz objekata
    if (parsedBody && Array.isArray(parsedBody)) {

      // Iteriramo kroz objekte u parsedBody
      for (const obj of parsedBody) {
        uId = await uniqueId();
        await db.query(
          `
          INSERT INTO cmn_loclink (
            id, site, tp, loctp1, loc1, loctp2, loc2, val, begda, endda, hijerarhija, onoff, color, icon)
          VALUES 
            ($1, NULL, $2, $3, $4, $5, $6, '', $7, $8, 1, 0, $9, $10)
          `, 
          [  uId, tableObj.tp, obj.tp, obj.id, tableObj.tp, tableObj.id,  begda, endda, obj.color, obj.icon]
          );
      }
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
/****************************************************************************** */


const copyGrpEvent = async (eventId, par1, requestBody) => {

  try {
    console.log(par1, "***************************copyGrpEvent*******************************")
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");

    if (!(par1 == 'true')) {
      await db.query(
        `
      delete from tic_eventatts
      where event = $1
    `, [eventId]);
    }

    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    const parsedBody = JSON.parse(requestBody.jsonObj);

    // Provera da li parsedBody ima svojstvo koje sadrži niz objekata
    if (parsedBody && Array.isArray(parsedBody)) {
      // Iteriramo kroz objekte u parsedBody
      for (const obj of parsedBody) {
        uId = await uniqueId();

        // Insert rows into tic_eventatts using obj.id
        await db.query(`
          INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, link)
          VALUES ($1, NULL, $2, $3, '', 1, '',$4)
        `, [uId, eventId, obj.id, obj.link]);
      }
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
const copyEventatts = async (eventId, requestBody) => {
  try {
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");
    const parsedBody = JSON.parse(requestBody.jsonObj);
    console.log(parsedBody, "***************************copyGrpEvent*******************************")
    uId = await uniqueId();
    // Insert rows into tic_eventatts using obj.id
    await db.query(`
          INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, link)
          VALUES ($1, NULL, $2, $3, '', 1, '', $4)
        `, [uId, parsedBody.event, parsedBody.att, parsedBody.link]);

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
  copyEvent,
  copyEventSettings,
  activateEvent,
  copyGrpEvent,
  copyGrpEventloc,
  copyEventatts,
  copyTpEventloc,
};
