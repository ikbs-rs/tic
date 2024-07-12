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
    SELECT  nextval('iis.tic_table_id_seq') id, s.site, $1 event, s.att, s.value, s.valid, s.text, s.color, s.icon, s.condition, s.link, s.minfee,
            a.inputtp, a.ddlist, a.code
    FROM tic_eventatts s, tic_eventatt a
    WHERE s.event = $2
    and s.att = a.id
  `,
      [eventId, tmpId]
    );

    for (const row of eventAttsRows.rows) {
      let pValue = row.value
      let pText = row.text
      if (row.inputtp == 5) {
        pValue = begda
      }
      if (row.inputtp == 8) {
        pValue = begda
        pText = endda
      }
      await db.query(`
        INSERT INTO tic_eventatts (id, site, event, att, value, valid, text, color, icon, "condition", link, minfee )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [row.id, row.site, row.event, row.att, pValue, row.valid, pText, row.color, row.icon, row.condition, row.link, row.minfee]);
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
    await client.query("UPDATE tic_event set status = 1 WHERE event = $1", [eventId]);
    console.log("***********************00****************************")

    // Create row for tic_doc
    const docRows = await db.query(`
      SELECT nextval('tic_table_id_seq') id , null site, to_char(NOW(), 'YYYYMMDD') "date", to_char(NOW(), 'YYYYMMDDHH24MISS') tm, 1 curr, 1 currrate, 
      a.par usr, 1 status, 1 docobj, a.id broj, $1 obj2, '$$NADREDJENI$$ ' opis, to_char(NOW(), 'YYYYMMDDHH24MISS') timecreation, 0 storno, to_char(NOW(), 'YYYY') "year", a.status currStatus
      FROM tic_event a
      WHERE a.id = $2
    `,
      [eventId, eventId]);
    if (docRows.rows.currStatus == 1) {
      throw new Error(
        `Dogadjaj već aktiviran: ${rows}`
      );
    }
    console.log("***********************01*************************** eventId = ", eventId)
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
            and b.code  in ('00.01.', '00.02.')
          ) 
        `,
        [row.id, eventId, eventId]);
      console.log(eventId, "***********************03****************************", docId)
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
const copyGrpEventloc = async (eventId, par1, loc, tploc, begda, endda, requestBody) => {

  try {
    console.log(par1, "***************************copyGrpEvent*******************************")
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");

    if (par1 == 'true') {
      console.log(par1, "***************************copyGrpEvent - delete *******************************")
      await db.query(
        `
      delete from tic_eventloc
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
        console.log(obj, "***************************copyGrpEvent 01 *******************************")
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
          eventId, "@@@@@@@@@@@@@@@ BMV @@@@@@@@@@@@@@@")

        await db.query(`
            INSERT INTO tic_eventloc (id, site, event, loc, begda, endda, color, icon)
            VALUES ($1, NULL, $2, $3, $4, $5, $6, $7)
        `, [uId, eventId, obj.id, begda, endda, obj.color, obj.icon]);
      }
    }
    console.log(
      eventId, "@@@@@@@@@@@@@ BMV @@@@@@@@@@@@@@@@@")

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


const copyGrpEventlocl = async (eventId, par1, loc, tploc, begda, endda, requestBody, eventloc) => {

  try {
    console.log(eventloc, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ copyGrpEventlocl  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let ok = false;
    let uId = '11111111111111111111'
    await db.query("BEGIN");
    console.log(par1, "@@****************copyGrpEventlocl - PRE delete ****************@@", eventId, "@@@@", loc)
    if (par1 == 'true') {
      console.log(par1, "***************************copyGrpEventlocl - delete *******************************")
      await db.query(
        `
      delete from tic_loclink
      where loc2 = $1
      and event = $2
    `, [eventloc, eventId]);
    }

    // Iteriramo kroz objekte u requestBody
    // Pretvorite string u niz objekata
    const parsedBody = JSON.parse(requestBody.jsonObj);
    // Provera da li parsedBody ima svojstvo koje sadrži niz objekata
    console.log(parsedBody, "***************************copyGrpEventlocl - PRE IF *******************************")
    if (parsedBody && Array.isArray(parsedBody)) {
      console.log(parsedBody, "***************************copyGrpEventlocl - IF *******************************")
      // Iteriramo kroz objekte u parsedBody
      for (const obj of parsedBody) {
        console.log(obj, "***************************copyGrpEventlocl - FOR *******************************")
        uId = await uniqueId();
        await db.query(
          `
          INSERT INTO tic_loclink (
            id, site, event, tp, loctp1, loc1, loctp2, loc2, val, begda, endda, hijerarhija, onoff, color, icon)
          VALUES 
            ($1, NULL, $2, $3, $4, $5, $6, $7, '', $8, $9, 1, 0, $10, $11)
          `,
          [uId, eventId, tploc, obj.tp, obj.id, tploc, eventloc, begda, endda, obj.color, obj.icon]
        );
        console.log(eventId, "@@@*******copyGrpEventlocl - END FOR **********@@@", loc, "@@+@@", tploc, "@@+@@")
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

const ticSetItem = async (objName, item, items) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${items.usr}'` : items.usr;
  const sqlString = `UPDATE ${objName} set ${item} = ${value}  WHERE id = ${items.id}`;
  console.log(sqlString, "55555555555555555555555555555555555555555555555555555", items)
  const result = await db.query(sqlString);
  return result.rowCount;
}

const ticSetValue = async (objName, item, itemValue, objId) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = `UPDATE ${objName} set ${item} = ${value}  WHERE id = ${objId}`;
  console.log(sqlString, "55555555555555555555555555555555555555555555555555555", item)
  const result = await db.query(sqlString);
  return result.rowCount;
}

const obradaProdaja = async (par1, par2, requestBody) => {
  let ok = true
  try {

    /* proveravam  PAR1
      par1 = 'RZV' izmena rezervacije
      par1 = 'ISP' izmena isporuke
      par1 = 'ONL' nacin placanja 
      par1 = 'CSH' nacin placanja
      par1 = 'CRT' nacin placanja

      par2 = CREATE/UPDATE
      [ { id : 'RZV', ...}, { id : 'ISP', ...}, { id : 'ONL', ...}, { id : 'MPL', ...} ]

    ticDoc
    ticDocOld
    */
    const parsedBody = requestBody //JSON.parse(requestBody);
    const { ..._ticDoc } = parsedBody

    // return ok


    await db.query("BEGIN");

    if (par1 == 'RZV') {
      const docsRows = await db.query(`
          SELECT *
          FROM tic_docs
          WHERE doc = $1
        `,
        [_ticDoc.id]);

      for (const row of docsRows.rows) {

        let _services = row.services || '[]'
        if (typeof _services !== 'object') {
          try {
            _services = JSON.parse(_services);
          } catch (e) {
            _services = [];
          }
        }

        _services = _services.filter(service => service.id !== 'RZV');
        console.log(_ticDoc, par2, row, "## 1111 ####################################################################")
        if (_ticDoc.reservation == '1') {
          const sqlUpit = `
          SELECT a.id, a.tgp, a."text", r.rate, b.event, b.condition, b.minfee
          FROM tic_artx_v a   
          JOIN cmn_tgptax g ON a.tgp = g.tgp
          JOIN cmn_taxrate r ON r.tax = g.tax
          JOIN (
              SELECT s.value, s."text", s.condition, s.minfee, s.event
              FROM tic_eventatts s
              JOIN tic_eventatt a ON a.id = s.att AND a.code = '08.00.'
              where  s."text" ~ '^[0-9]+(\.[0-9]+)?$' 
              and s.event = ${row.event}
          ) b ON b."text" = to_char(a.id, 'FM999999999999999999999')
          WHERE a.code = 'Н4'     
          `
          const artRow = await db.query(sqlUpit);
          const item = artRow.rows[0]

          let bruto = row.output * row.price * parseFloat(item.condition) * 0.01
          if (bruto < parseFloat(item.minfee)) {
            bruto = parseFloat(item.minfee)
          }
          let neto = bruto / (1 + parseFloat(item.rate) * 0.01)

          const newService = {
            id: 'RZV',
            text: item.text,
            art: item.id,
            tgp: item.tgp,
            tax: bruto - neto,
            curr: 1,
            currrate: 1,
            output: row.output,
            price: bruto / row.output,
            discount: 0,
            potrazuje: bruto,
            leftcurr: bruto
          };

          _services.push(newService);

        }

        row.services = JSON.stringify(_services);

        const sqlDocs = `
        UPDATE tic_docs
        SET services = '${row.services}'
        WHERE id = ${row.id}
      `
        await db.query(sqlDocs);
      }
      await db.query(`
      UPDATE tic_doc
      SET reservation = $1,
        status = $2
      WHERE id = $3
      `, [_ticDoc.reservation, _ticDoc.reservation, _ticDoc.id]);

    }

    if (par1 == 'ISP') {
      const docsRows = await db.query(`
          SELECT *
          FROM tic_docs a
          left join (
            select o.id, o.code ccart, o.text ncart, t.code ctp
            from cmn_obj o
            join cmn_objtp t on t.id = o.tp and t.code = 'XTCTP'
          ) b on a.tickettp = b.id 
          WHERE doc = $1
        `,
        [_ticDoc.id]);

      for (const row of docsRows.rows) {
        if (row.ccart == 'TCTP1') {
          let _services = row.services || '[]'
          if (typeof _services !== 'object') {
            try {
              _services = JSON.parse(_services);
            } catch (e) {
              _services = [];
            }
          }

          _services = _services.filter(service => service.id !== 'RZV');
          console.log(_ticDoc, par2, row, "## 1111 ####################################################################")
          if (_ticDoc.reservation == '1') {
            const sqlUpit = `
            SELECT a.id, a.tgp, a."text", r.rate, b.event, b.value, b.condition, b.minfee
            FROM tic_artx_v a   
            JOIN cmn_tgptax g ON a.tgp = g.tgp
            JOIN cmn_taxrate r ON r.tax = g.tax
            JOIN (
                SELECT s.value, s."text", s.condition, s.minfee, s.event
                FROM tic_eventatts s
                JOIN tic_eventatt a ON a.id = s.att AND a.code = '08.04.'
                where  s."text" ~ '^[0-9]+(\.[0-9]+)?$' 
                and s.event = ${row.event}
            ) b ON b."text" = to_char(a.id, 'FM999999999999999999999')
            WHERE a.code = 'Н5'      
          `
            const artRow = await db.query(sqlUpit);
            const item = artRow.rows[0]

            let bruto = row.output * row.price * parseFloat(item.condition) * 0.01
            if (bruto < parseFloat(item.minfee)) {
              bruto = parseFloat(item.minfee)
            }
            let neto = bruto / (1 + parseFloat(item.rate) * 0.01)

            const newService = {
              id: 'RZV',
              text: item.text,
              art: item.id,
              tgp: item.tgp,
              tax: bruto - neto,
              curr: 1,
              currrate: 1,
              output: row.output,
              price: bruto / row.output,
              discount: 0,
              potrazuje: bruto,
              leftcurr: bruto
            };

            _services.push(newService);

          }

          row.services = JSON.stringify(_services);

          const sqlDocs = `
            UPDATE tic_docs
            SET services = '${row.services}'
            WHERE id = ${row.id}
            `
          await db.query(sqlDocs);
        }
      }
      await db.query(`
      UPDATE tic_doc
      SET delivery = $1
      WHERE id = $2
      `, [_ticDoc.delivery, _ticDoc.id]);


    }

    if (par1 == 'ONL') {
      //dohvati stavke

      //del naknadu za koriscenje online usluge
      //push naknadu  za koriscenje online usluge

      //azuriraj zaglavlje

      //ayuriraj zaglavlje

    }

    if (par1 == 'CSH' || par1 == 'CRT') {
      //dohvati stavke

      //del naknadu za usluge na prodajnom mestu
      //push naknadu  za usluge na prodajnom mestu

      //azuriraj zaglavlje

      //ayuriraj zaglavlje      
    }
    console.log("*************** COMMIT ************************")
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


const obradaProdajas = async (par1, par2) => {

  try {

    let isporuka = '-1'
    let rezervacija = '-1'
    let placanje = '-1'

    const parsedBody = JSON.parse(requestBody.jsonObj);
    const _ticDoc = parsedBody.doc
    const _ticDocs = parsedBody.docs
    /* proveravam  PAR1
      par1 = 'ISP' izmena isporuke
      par1 = 'CTP' za tip karte podesiti naknadu izmena isporuke

      par2 = CREATE/UPDATE
    */

    /*
    ticDoc    
    ticDocs
    ticDocsOld
    */

    if (par1 == 'ISP') {
      // dohvati stavku
      // ako stavi isporuku a nije regular postaviti na regular

      //del naknadu za isporuku
      //push naknadu  za isporuku

      // azuriraj stavku za sve karete regular
    }


    if (par1 == 'CTP') {
      // dohvati stavku

      //proveri tp karte
      // ako nije regular skinuti isporuku
      //del naknadu za isporuku
      //push naknadu  za isporuku

      // azuriraj stavku 
    }
    await db.query("BEGIN");

  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Rollback the transaction in case of an error
    }
    throw error;
  }
};

const docSetService = async (requestBody) => {

  try {
    await db.query('BEGIN');
    // await client.query('SET search_path TO iis,public;'); // Add this line
    const ticDocRow = requestBody;
    console.log('ticDocRow=================================:', ticDocRow);
    const query = {
      name: 'call-tic_docs_setservices',
      text: `SELECT tic_docs_setservices(
          u_id := $1, 
          u_site := $2, 
          u_docvr := $3, 
          u_date := $4, 
          u_tm := $5, 
          u_curr := $6, 
          u_currrate := $7, 
          u_usr := $8, 
          u_status := $9, 
          u_docobj := $10, 
          u_broj := $11, 
          u_obj2 := $12, 
          u_opis := $13, 
          u_timecreation := $14, 
          u_storno := $15, 
          u_year := $16, 
          u_channel := $17, 
          u_usersys := $18, 
          u_endtm := $19, 
          u_reservation := $20, 
          u_delivery := $21, 
          u_paymenttp := $22, 
          action_tp := $23
      )`,
      values: [
        ticDocRow.id,
        ticDocRow.site,
        ticDocRow.docvr,
        ticDocRow.date,
        ticDocRow.tm,
        ticDocRow.curr,
        ticDocRow.currrate,
        ticDocRow.usr,
        ticDocRow.status,
        ticDocRow.docobj,
        ticDocRow.broj,
        ticDocRow.obj2,
        ticDocRow.opis,
        ticDocRow.timecreation,
        ticDocRow.storno,
        ticDocRow.year,
        ticDocRow.channel,
        ticDocRow.usersys,
        ticDocRow.endtm,
        ticDocRow.reservation,
        ticDocRow.delivery,
        ticDocRow.paymenttp,
        ticDocRow.actiontp
      ]
    };

    try {
      client.on('notice', (msg) => {
        console.log(msg);
      });

      console.log('Executing query:', query);
      const result = await client.query(query);
      // await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('Query result:', result);
      await client.query('COMMIT');
      console.log('tic_docs_setservices function executed successfully');
    } catch (err) {
      console.error(err.stack);
    }

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of error
    console.error(`Error updating sectors: ${error}`);
    res.status(500).json({ error: 'Failed to update sectors' });

    // await client.query('COMMIT'); 
  } finally {
    client.end();
    client.release(); // Release the database connection back to the pool
  }

};

const ticEventCopy = async (requestBody) => {

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // await client.query('SET search_path TO iis,public;'); // Add this line
    const ticEventRow = requestBody;
    console.log('ticEventRow=================================:', ticEventRow);
    const query = {
      name: 'call-tic_event_copy',
      text: `SELECT tic_event_copy(
        u_id := $1,
        u_site := $2,
        u_code := $3,
        u_text := $4,
        u_tp := $5,
        u_begda := $6,
        u_endda := $7,
        u_begtm := $8,
        u_endtm := $9,
        u_status := $10,
        u_descript := $11,
        u_note := $12,
        u_event := $13,
        u_ctg := $14,
        u_loc := $15,
        u_par := $16,
        u_tmp := $17,
        u_season := $18,
        u_map_extent := $19,
        u_map_min_zoom := $20,
        u_map_max_zoom := $21,
        u_map_max_resolution := $22,
        u_tile_extent := $23,
        u_tile_size := $24,
        u_venue_id := $25,
        u_enable_tiles := $26,
        u_map_zoom_level := $27,
        u_have_background := $28,
        u_background_image := $29,
        u_loc_id := $30,
        u_auto_scale := $31,
        u_auto_zoom := $32
    )`,
      values: [
        ticEventRow.id,
        ticEventRow.site,
        ticEventRow.code,
        ticEventRow.text,
        ticEventRow.tp,
        ticEventRow.begda,
        ticEventRow.endda,
        ticEventRow.begtm,
        ticEventRow.endtm,
        ticEventRow.status,
        ticEventRow.descript,
        ticEventRow.note,
        ticEventRow.event,
        ticEventRow.ctg,
        ticEventRow.loc,
        ticEventRow.par,
        ticEventRow.tmp,
        ticEventRow.season,
        ticEventRow.map_extent,
        ticEventRow.map_min_zoom,
        ticEventRow.map_max_zoom,
        ticEventRow.map_max_resolution,
        ticEventRow.tile_extent,
        ticEventRow.tile_size,
        ticEventRow.venue_id,
        ticEventRow.enable_tiles,
        ticEventRow.map_zoom_level,
        ticEventRow.have_background,
        ticEventRow.background_image,
        ticEventRow.loc_id,
        ticEventRow.auto_scale,
        ticEventRow.auto_zoom
      ]
    };

    try {
      client.on('notice', (msg) => {
        console.log(msg);
      });

      console.log('Executing query:', query);
      const result = await client.query(query);
      console.log('Query result:', result);
      await client.query('COMMIT');
      console.log('tic_docs_setservices function executed successfully', result.rows[0]);
      return result.rows[0]
    } catch (err) {
      console.error(err.stack);
      await client.query('ROLLBACK'); // Rollback the transaction in case of error
      throw err;
    }
  } catch (error) {
    console.error(`Error updating sectors: ${error}`);
    res.status(500).json({ error: 'Failed to update sectors' });
  } finally {
    client.release(); // Release the database connection back to the pool
  }

};

const ticEventSaveDate = async (requestBody) => {

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // await client.query('SET search_path TO iis,public;'); // Add this line
    const ticEventRow = requestBody;
    console.log('ticEventRow=================================:', ticEventRow);
    const query = {
      name: 'call-tic_event_savedate',
      text: `SELECT tic_event_savedate(
        u_id := $1,
        u_site := $2,
        u_code := $3,
        u_text := $4,
        u_tp := $5,
        u_begda := $6,
        u_endda := $7,
        u_begtm := $8,
        u_endtm := $9,
        u_status := $10,
        u_descript := $11,
        u_note := $12,
        u_event := $13,
        u_ctg := $14,
        u_loc := $15,
        u_par := $16,
        u_tmp := $17,
        u_season := $18,
        u_map_extent := $19,
        u_map_min_zoom := $20,
        u_map_max_zoom := $21,
        u_map_max_resolution := $22,
        u_tile_extent := $23,
        u_tile_size := $24,
        u_venue_id := $25,
        u_enable_tiles := $26,
        u_map_zoom_level := $27,
        u_have_background := $28,
        u_background_image := $29,
        u_loc_id := $30,
        u_auto_scale := $31,
        u_auto_zoom := $32
    )`,
      values: [
        ticEventRow.id,
        ticEventRow.site,
        ticEventRow.code,
        ticEventRow.text,
        ticEventRow.tp,
        ticEventRow.begda,
        ticEventRow.endda,
        ticEventRow.begtm,
        ticEventRow.endtm,
        ticEventRow.status,
        ticEventRow.descript,
        ticEventRow.note,
        ticEventRow.event,
        ticEventRow.ctg,
        ticEventRow.loc,
        ticEventRow.par,
        ticEventRow.tmp,
        ticEventRow.season,
        ticEventRow.map_extent,
        ticEventRow.map_min_zoom,
        ticEventRow.map_max_zoom,
        ticEventRow.map_max_resolution,
        ticEventRow.tile_extent,
        ticEventRow.tile_size,
        ticEventRow.venue_id,
        ticEventRow.enable_tiles,
        ticEventRow.map_zoom_level,
        ticEventRow.have_background,
        ticEventRow.background_image,
        ticEventRow.loc_id,
        ticEventRow.auto_scale,
        ticEventRow.auto_zoom
      ]
    };

    try {
      client.on('notice', (msg) => {
        console.log(msg);
      });

      console.log('Executing query:', query);
      const result = await client.query(query);
      console.log('Query result:', result);
      await client.query('COMMIT');
      console.log('tic_event_savedate function executed successfully', result.rows[0]);
      return result.rows[0]
    } catch (err) {
      console.error(err.stack);
      await client.query('ROLLBACK'); // Rollback the transaction in case of error
      throw err;
    }
  } catch (error) {
    console.error(`Error updating sectors: ${error}`);
    res.status(500).json({ error: 'Failed to update sectors' });
  } finally {
    client.release(); // Release the database connection back to the pool
  }

};

const ticEventDeleteAll = async (uId) => {

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const query = {
      name: 'call-tic_event_copy',
      text: `SELECT tic_eventdeleteall(
        u_id := $1
    )`,
      values: [uId]
    };

    try {
      client.on('notice', (msg) => {
        console.log(msg);
      });

      console.log('Executing query:', query);
      const result = await client.query(query);
      console.log('Query result:', result);
      await client.query('COMMIT');
      console.log('tic_eventdeleteall function executed successfully', result.rows[0]);
      return { id: uId }
    } catch (err) {
      console.error(err.stack);
      await client.query('ROLLBACK'); // Rollback the transaction in case of error
      throw err;
    }
  } catch (error) {
    console.error(`Error updating sectors: ${error}`);
    res.status(500).json({ error: 'Failed to update sectors' });
  } finally {
    client.release(); // Release the database connection back to the pool
  }

};

const ticDocstorno = async (par1, par2, objId1, requestBody, lang) => {
  const client = await db.connect();

  try {
    console.log(par1, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ copyGrpEventlocl  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let ok = false;
    let uId = '11111111111111111111'
    let sId = '11111111111111111111'
    uId = await uniqueId();
    await client.query(
      `
      INSERT INTO tic_doc
      SELECT $1 id, site, docvr, "date", to_char(now(), 'YYYYMMDDHH24MISS') tm, curr, currrate, usr, status, docobj, broj, obj2, opis, timecreation,
	           1 storno, "year", channel, $2 sysusr,  endtm, reservation, 	delivery, paymenttp, services 
      FROM tic_doc
      WHERE id = $3
    `,
      [uId, par2, objId1]
    );

    if (par1 == 'DOC') {
      await client.query(
        `
        INSERT INTO tic_docs(
            id, site, doc, event, loc, art, tgp, taxrate, price, input, output, discount, curr, currrate, tax, 
            duguje, potrazuje, leftcurr, rightcurr, begtm, endtm, status, fee, par, descript, cena, reztm, 
            storno, nart, row, label, seat, vreme,ticket, services, tickettp, delivery, 
            ulaz, sector, barcode, online, print, pm, rez, sysuser
            )
        SELECT 	nextval('iis.tic_table_id_seq') id, site, $1, event, loc, art, tgp, taxrate, price, input, -output, discount, curr, currrate, -tax, 
	              duguje, -potrazuje, leftcurr, -rightcurr, null, null, status, fee, par, descript, cena, reztm, 
	              1, nart, row, label, seat, now() vreme, ticket, services, tickettp, delivery,
                ulaz, sector, barcode, online, print, pm, rez, sysuser
        FROM tic_docs
        WHERE doc = $2
      `,
        [uId, objId1]
      );
    } else {
      console.log(requestBody, "***************************copyGrpEventlocl - PRE IF *******************************", requestBody.jsonObj)      
      const parsedBody = requestBody; //JSON.parse(requestBody.jsonObj);
      if (parsedBody && Array.isArray(parsedBody)) {
        console.log(parsedBody, "***************************copyGrpEventlocl - IF *******************************")
        // Iteriramo kroz objekte u parsedBody
        for (const obj of parsedBody) {
          console.log(obj, "***************************copyGrpEventlocl - FOR *******************************")
          sId = await uniqueId();
          await db.query(
            `
          INSERT INTO tic_docs (
            id, site, doc, event, loc, art, tgp, taxrate, price, input, output, discount, curr, currrate, tax, 
            duguje, potrazuje, leftcurr, rightcurr, begtm, endtm, status, fee, par, descript, cena, reztm, 
            storno, nart, row, label, seat,  ticket, services, tickettp, delivery,
            ulaz, sector, barcode, online, print, pm, rez, sysuser
            )
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
          `,
            [sId, obj.site, obj.doc, obj.event, obj.loc, obj.art, obj.tgp, obj.taxrate, obj.price, obj.input, -obj.output, 
              obj.discount, obj.curr, obj.currrate, -obj.tax, obj.duguje, -obj.potrazuje, obj.leftcurr, obj.rightcurr, 
              obj.begtm, obj.endtm, obj.status, obj.fee, obj.par, obj.descript, obj.cena, obj.reztm, obj.storno, obj.nart, obj.row, 
              obj.label, obj.seat,  obj.ticket, obj.services, obj.tickettp, obj.delivery,
              obj.ulaz, obj.sector, obj.barcode, obj.online, obj.print, obj.pm, obj.rez, obj.sysuser]
          );
          console.log(sId, "@@@*******copyGrpEventlocl - END FOR **********@@@", -obj.output, "@@+@@", uId, "@@+@@")
        }
      }
    }

    await db.query("COMMIT"); 
    ok = true;
    return ok;
  }
  catch (error) {
    if (db) {
      await db.query("ROLLBACK"); 
    }
    throw error;
  }
};
/****************************************************************************** */


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
  copyGrpEventlocl,
  obradaProdaja,
  obradaProdajas,
  docSetService,
  ticEventCopy,
  ticEventSaveDate,
  ticEventDeleteAll,
  ticSetItem,
  ticSetValue,
  ticDocstorno,
};
