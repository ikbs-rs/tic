import db from "../db/db.js";
import { uniqueId } from "../middleware/utility.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;

const moveAndCopy = async (objName, lang, uId1, uId2, id) => {
  try {
    await db.query("BEGIN");

    // First, delete from one table
    const deleteResult = await db.query(`DELETE FROM ${objName} WHERE tableid = $1`, [id]);

    // Create a temporary table in PostgreSQL
    await db.query(`
      CREATE TEMP TABLE tmp_eventtpatt AS
      SELECT *
      FROM tic_eventtpatt
      WHERE eventtp = $1
    `, [uId1]);

    // Update the temporary table
    await db.query(`
      UPDATE tmp_eventtpatt
      SET eventtp = $1
    `, [uId2]);

    // Insert data from the temporary table into tic_eventtpatt
    await db.query(`
      INSERT INTO tic_eventtpatt (id, some_column_name, eventtp, att, text)
      SELECT $1, null, eventtp, att, text
      FROM tmp_eventtpatt
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

//# find function
const getListaC = async (objName, sqlstmt, lang) => {

  let result = await db.query(sqlstmt);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getAgendaL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, text textx, aa.begtm, aa.endtm, aa.valid, aa.lang, aa.grammcase,
        aa.tg, getValueById(aa.tg, 'tic_agendatpx_v', 'code', '${lang || 'sr_cyr'}') ctp, getValueById(aa.tg, 'tic_agendatpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_agendax_v aa
  where aa.lang = '${lang || 'sr_cyr'}'`

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
    `select aa.id, aa.site, aa.code, aa.text,  aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase, color, icon,
        aa.tp, p.code ctp, p."text" ntp, 
        aa.um, u.code cum, u.text num,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.grp, g.code cgrp, g.text ngrp,
        aa.amount, aa.combining
  from tic_artx_v aa, tic_arttpx_v p, cmn_umx_v u, cmn_tgpx_v t, tic_artgrpx_v g
  where aa.lang = '${lang || 'sr_cyr'}'
  and aa.tp = p.id 
  and aa.um = u.id 
  and aa.tgp = t.id 
  and aa.grp = g.id
  and	p.lang = '${lang || 'sr_cyr'}'
  and	u.lang = '${lang || 'sr_cyr'}'
  and	t.lang = '${lang || 'sr_cyr'}'
  and	g.lang = '${lang || 'sr_cyr'}'
  `
  console.log("****************getArtL*****************", sqlRecenica)
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

const getLocartL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.loc , aa.begda, aa.endda, 
        aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart
  from	tic_artloc aa
  where aa.loc = ${objId}
  `
  console.log(sqlRecenica, "*******************sqlRecenica*********************")
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

const getEventartL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select ea.id, ea.site, ea."event", ea.discount, ea.descript, ea.begda, ea.endda , aa.site, aa.code, aa.text, aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
        ea.art, aa.code cart, ea.nart, ea.color,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.code||' '||aa.text cnart,
        aa.combining, ea.maxkol
  from tic_eventart ea, tic_artx_v aa, cmn_tgpx_v t
  where ea.event = ${objId}
  and ea.art = aa.id
  and aa.tgp = t.id  
  and aa.lang = '${lang || 'sr_cyr'}'  
  and	t.lang = '${lang || 'sr_cyr'}'
  `
  console.log(sqlRecenica, "*************getEventartL*************")
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

// const getEventartlinkL = async (objName, objId, lang) => {
//   const sqlRecenica =
//     `
//   select ea.id, ea.site, ea.eventart1, ea.tp, aa.site, aa.code, aa.text, aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
//         t.art, aa.code cart, aa.text nart,
//         ea.eventart2, t.event, 
//         aa.code||' '||aa.text cnart
//   from tic_eventartlink ea, tic_artx_v aa, tic_eventart t
//   where ea.eventart2 = ${objId}
//   and t.art = aa.id
//   and ea.eventart1 = t.id   
//   and aa.lang = '${lang || 'sr_cyr'}'  
//   `
//   console.log(sqlRecenica, "*************getEventartL*************")
//   let result = await db.query(sqlRecenica);
//   let rows = result.rows;
//   if (Array.isArray(rows)) {
//     return rows;
//   } else {
//     throw new Error(
//       `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
//     );
//   }
// };

const getArtlocL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.art , aa.begda, aa.endda, 
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc
  from	tic_artloc aa
  where aa.art = ${objId}
  `
  console.log(sqlRecenica, "*******************sqlRecenica*********************")
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

const getArtcenaL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.art , aa.begda, aa.endda, aa.value, aa.event,
        aa.cena, getValueById(aa.cena, 'tic_cenax_v', 'code', '${lang || 'sr_cyr'}') ccena, getValueById(aa.cena, 'tic_cenax_v', 'text', '${lang || 'sr_cyr'}') ncena,
        aa.terr, getValueById(aa.terr, 'cmn_terrx_v', 'code', '${lang || 'sr_cyr'}') cterr, getValueById(aa.terr, 'cmn_terrx_v', 'text', '${lang || 'sr_cyr'}') nterr,
        aa.curr, getValueById(aa.curr, 'cmn_currx_v', 'code', '${lang || 'sr_cyr'}') ccurr, getValueById(aa.curr, 'cmn_currx_v', 'text', '${lang || 'sr_cyr'}') ncurr
  from	tic_artcena aa
  where aa.art = ${objId}
  `
  //console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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

const getEventartcenaL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.eventart , aa.art, aa.begda, aa.endda, aa.value, aa.event,
        aa.cena, getValueById(aa.cena, 'tic_cenax_v', 'code', '${lang || 'sr_cyr'}') ccena, getValueById(aa.cena, 'tic_cenax_v', 'text', '${lang || 'sr_cyr'}') ncena,
        aa.terr, getValueById(aa.terr, 'cmn_terrx_v', 'code', '${lang || 'sr_cyr'}') cterr, getValueById(aa.terr, 'cmn_terrx_v', 'text', '${lang || 'sr_cyr'}') nterr,
        aa.curr, getValueById(aa.curr, 'cmn_currx_v', 'code', '${lang || 'sr_cyr'}') ccurr, getValueById(aa.curr, 'cmn_currx_v', 'text', '${lang || 'sr_cyr'}') ncurr
  from	tic_eventartcena aa
  where aa.eventart = ${objId}
  `
  //console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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

const getEventartlinkL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.eventart , aa.value,
        aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, 
        getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart
  from	tic_eventartlink aa
  where aa.eventart = ${objId}
  `
  console.log(sqlRecenica, "*******************getArtlinkL*********************"  )    
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

const getEventartcenaTL = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.att, aa.value, aa.text, a2.code catt, a2.text natt, aa.condition textx
  from	tic_eventatts aa, tic_eventattx_v a2
  where a2.code = '${par1}'
  and aa.att = a2.id
  and aa.event = ${objId}
  `
  console.log(sqlRecenica, "*******************getEventartcenaTL*********************")
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

const getArtlinkL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.tp, aa.art2,
        aa.art1, getValueById(aa.art1, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart1, getValueById(aa.art1, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart1
  from	tic_artlink aa
  where aa.art2 = ${objId}
  `
  //console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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
const getDocById = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select	aa.*,
      p.code cpar,
      p."text" npar,
      o.code cchanell,
      o.text nchanell,
      t.code cpaymenttp,
      t."text" npaymenttp
  from	tic_doc aa
  join  cmn_parx_v p on p.id = aa.usr
  left  join cmn_objx_v o on o.id = aa.channel
  left  join cmn_paymenttp t on t.id = aa.paymenttp
  where aa.id = ${objId}
  `
  //console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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

const getDocsuidProdajaLista = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select u.*, aa.id::text docsid, aa.doc, aa.tickettp, aa.delivery, a.text nartikal, aa.nart, aa.discount, aa.row, 
          aa.seat, aa.price, e.text nevent, aa.price, c.code ccurr, aa.event
    from	tic_docs aa
    join  tic_artx_v a on a.id = aa.art
    join  tic_arttp p on p.id = a.tp and p.code!='Н'
    join  tic_eventx_v e on aa.event = e.id
    join  cmn_curr c on aa.curr = c.id
    left  join  tic_docsuid u on aa.id = u.docs
    where aa.doc = ${objId}
    `
  console.log(sqlRecenica, "*******************getDocsuidProdajaLista*********************")
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

const getDocpaymentL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.amount, aa.doc, aa.tm, a.username,
        aa.paymenttp, getValueById(aa.paymenttp, 'cmn_paymenttpx_v', 'code', '${lang || 'sr_cyr'}') cpaymenttp, 
        getValueById(aa.paymenttp, 'cmn_paymenttpx_v', 'text', '${lang || 'sr_cyr'}') npaymenttp,
        aa.bcontent
  from	tic_docpayment aa
  join  adm_user a on a.id = aa.usr
  where aa.doc = ${objId}
  `
  //console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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

const getStampaL = async (objId, lang) => {
  const sqlRecenica =
    `
    select aa.*, 
        u.username
    from	tic_stampa aa
    join  adm_user u on u.id = aa.usr
    where aa.doc = ${objId}
    `
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

const getCenaL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase, aa.color, aa.icon,
	      aa.tp, getValueById(aa.tp, 'tic_cenatpx_v', 'code', '${lang || 'sr_cyr'}') ctp , getValueById(aa.tp, 'tic_cenatpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_cenax_v aa
  where aa.lang = '${lang || 'sr_cyr'}'`
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

const getDocsL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat,
      aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
      aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
      aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
      aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart
  from tic_docs aa, tic_doc d
  where aa.doc = ${objId}
  and aa.doc = d.id
  `
  console.log(objId, "*-*-*-*-*-*-*-*-*-@@@@@@@@@ getDocsL @@@@@@@@@@@", sqlRecenica)
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

const getDocsArtikliL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat, aa.row,
      aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
      aa.cena, aa.reztm, aa.storno, aa.nart, aa."row", aa."label", aa.vreme, aa.ticket, aa.services, aa.tickettp, aa.delivery,
      aa.ulaz, aa.sector, aa.barcode, aa.online, aa.print, aa.pm, aa.rez, aa.sysuser,
      aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
      aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
      aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart,
      0 del
      from tic_docs aa
      join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
      join tic_artx_v a on aa.art = a.id and a.lang = 'sr_cyr'
      join tic_arttp t on t.id = a.tp and t.code != 'Н'
      and aa.doc = d.id
  `
  console.log(objId, "*-*-*-*-*-*-*-*-*-@@@@@@@@@ getDocsL @@@@@@@@@@@", sqlRecenica)
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
const getDocsArtikliPrintL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc, aa.seat, aa.row,
      aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
      aa.cena, aa.reztm, aa.storno, aa.nart, aa."row", aa."label", aa.vreme, aa.ticket, aa.services, aa.tickettp, aa.delivery,
      aa.ulaz, aa.sector, aa.barcode, aa.online, aa.print, aa.pm, aa.rez, aa.sysuser,
      aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
      aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc,
      aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'sr_cyr'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'sr_cyr'}') nart,
      0 del
      from tic_docs aa
      join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
      join tic_artx_v a on aa.art = a.id and a.lang = 'sr_cyr'
      join tic_arttp t on t.id = a.tp and t.code != 'Н'
      and aa.doc = d.id
      where aa.print = 1
  `
  console.log(objId, "*-*-*-*-*-*-*-*-*-@@@@@@@@@ getDocsL @@@@@@@@@@@", sqlRecenica)
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

const getDocsNaknadeL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select aa.doc id, aa.tgp, aa.taxrate, aa.art, a.code cart, a.text nart, e.text nevent, 
          sum(aa."output") "output" , sum(aa."potrazuje") "potrazuje" , sum(aa.rightcurr) rightcurr, sum(aa.discount) discount
    from tic_docs aa
    join tic_doc d on aa.doc = d.id and aa.doc = ${objId}
    join tic_artx_v a on aa.art = a.id and a.lang = 'sr_cyr'
    join tic_arttp t on t.id = a.tp and t.code = 'Н'
    join tic_eventx_v e on e.id = aa.event
    group by aa.doc, aa.tgp, aa.taxrate, aa.art, a.code, a.text, e.text
  `
  console.log(objId, "*-*-*-*-*-*-*-*-*-@@@@@@@@@ getDocsL @@@@@@@@@@@", sqlRecenica)
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
const getTransactionL = async (objName, lang, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) => {
  //   const sqlRecenica =
  //     `
  //     SELECT 
  //       a.id, a.tm, a.docvr, d."text" AS ndocvr, a.usr, p.code AS cpar, p."text" AS npar, b.event, e."text" AS nevent, 
  //       e.begda, 'web' AS sal_ch, COUNT(*) AS no_tick, 0 AS ticket, SUM(b.potrazuje) AS amount, a.status, b.status, 
  //       b.curr, c.code AS ccurr, 
  //       CASE 
  //           WHEN d.code = 'RC' THEN '01'
  //           ELSE '02'
  //       END AS trtp,
  //       b.event
  //     FROM 
  //       tic_doc a
  //     JOIN 
  //       tic_docs b ON a.id = b.doc
  //     left OUTER JOIN 
  //       tic_eventx_v e ON b.event = e.id
  //     JOIN 
  //       cmn_parx_v p ON a.usr = p.id
  //     left OUTER JOIN 
  //       cmn_currx_v c ON b.curr = c.id
  //     JOIN 
  //       tic_docvrx_v d ON a.docvr = d.id
  //     WHERE e.lang = '${lang || 'sr_cyr'}'
  //     and p.lang = '${lang || 'sr_cyr'}'
  //     and c.lang = '${lang || 'sr_cyr'}'
  //     and d.lang = '${lang || 'sr_cyr'}'
  //     GROUP BY a.id, a.tm, a.docvr, a.usr, p.code, p."text", b.event, e."text", e.begda, a.status, b.status, b.curr, c.code, d."text", trtp
  // ORDER BY  a.tm DESC
  //   `
  console.log(par6, "PAR6 ================================================")
  let and1 = ''
  if (par1 == `true`) {
    and1 = ` and canceled = '0'`
  }
  let and2 = ''
  if (par2 == `true`) {
    and2 = ` and canceled = '0'`
  }
  let and3 = ''
  if (par3 == `true`) {
    and3 = ` and canceled = '0'`
  }
  let and4 = ''
  if (par4 == `true`) {
    and4 = ` and istekla = true`
  }
  let and5 = ''
  if (par5 == `true`) {
    and5 = ` and paid = 'true'`
  }
  let and6 = ''
  if (par6 == `true`) {
    and6 = ` and canceled = '0'`
  }

  const sqlRecenica =
    // select * from ( 
    // select e.id event, du.id, e.code, c."text" ctgevent, te.text tpevent, e.text nevent, l.text hall,  e.endda, e.endtm tmpocetak,
    // es.art, es.ulaz, es.kapija, es.pool, es.sector, es.blok, es.rownum, es."label", es.code1 sediste,
    // ds.art , ds.nart, ds."output" , ds.price, ds.taxrate, ds.discount, ds.potrazuje ,
    // du.text npar, du.address addrpar, du.tel telpar, du.pib pipar, du.idnum idpar, du.place plpar, 
    // di."first" , di."last" , di.uid, di.pib, di.adress , di.city, di.country , di.email , di.phon,
    // du.username, du.firstname, du.lastname,
    // ds.ticket obj_karta,
    // to_timestamp(ds.endtm, 'YYYYMMDDHH24MISS') < now() istekla,
    // (
    // select 
    //       CASE 
    //       WHEN count(*) = 0 THEN false
    //       ELSE true
    //       END AS broj
    //     from	tic_docpayment dp
    //     where dp.status = 1
    //     and dp.doc = du.id
    //     ) paid,
    //     nodelivery, fordelivery, indelivery,
    //     to_char(
    //     (
    //     select sum(ds.potrazuje) potrazuje
    //     from	tic_docs ds
    //     where ds.doc = du.id
    //     ), 'FM999,999,990.00') iznos,
    //     to_timestamp((
    //     select min(ds.endtm) potrazuje
    //     from	tic_docs ds
    //     where ds.doc = du.id
    //     ), 'YYYYMMDDHH24MISS') < now() isteklo,
    //     (
    //     select count(*) broj
    //     from	tic_docs ds, tic_art ar, tic_artgrp g
    //     where ds.doc = du.id
    //     and ds.art = ar.id
    //     and ar.grp = g.id
    //     ) brojkarti
    // from tic_eventx_v e
    // left join cmn_locx_v l on e.loc = l.id and l.lang = '${lang || 'sr_cyr'}'
    // left join tic_eventctgx_v c on e.ctg = c.id and c.lang = '${lang || 'sr_cyr'}'
    // left join tic_eventtpx_v te on e.tp = te.id and te.lang = '${lang || 'sr_cyr'}'
    // join tic_docs ds on e.id = ds."event" 
    // left join (
    //   select p.text, p.address, p.site , p.tel , p.pib , p.idnum , p.place,
    // 	      u.username, u.firstname, u.lastname,
    //       COALESCE(LENGTH(dd.tmrec), 0) nodelivery, LENGTH(dd.tmcour) fordelivery, LENGTH(dd.datdelivery) indelivery, 
    //       d.*
    //   from tic_doc d
    //   left join cmn_parx_v p  on d.usr = p.id and p.lang = '${lang || 'sr_cyr'}'
    //   left join adm_user u on d.usersys = u.id
    //   left join tic_docdelivery dd on dd.doc = d.id
    //   ) as du on du.id = ds.doc
    // join tic_eventst es on ds.loc = es.loc1 and ds.event = es.event
    // left join tic_docsuid di on ds.id = di.docs 
    // where e.lang = '${lang || 'sr_cyr'}'
    // ) x
    // where 1=1
    `
    select *
    from (
      select a.id, a.tm, a.kanal, a.cpar, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar, 		
            a.username, a.firstname, a.lastname, a.canceled, a.broj, a.storno,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            '['||string_agg(distinct '{"id": "'||a.event||'", "code": "'||a.cevent||'", "startda": "'||a.startda||'", "starttm":"'||a.starttm
            ||'", "text":"'||a.nevent||'", "venue":"'||a.venue
            ||'", "count":"'||a.output||'"}', ',')||']' nevent,
             sum(a.tax) tax, sum(a.discount) discount, a.opis, 
            sum(a."output") "output", sum(a.potrazuje) potrazuje,  max(a.tmreserv) tmreserv,
            sum(
            CASE
                WHEN trim(a.atp) IN ('K', 'CK') THEN a.potrazuje
                ELSE 0
            END
            ) tickettotal,
            sum(
            CASE
                WHEN trim(a.atp) IN ('K', 'CK') THEN a.output
                ELSE 0
            END
            ) ticketcount,
            (select 
              CASE 
              WHEN count(*) = 0 THEN false
              ELSE true
              END AS broj
            from	tic_docpayment dp
            where dp.status = 1
            and dp.doc = a.id
            ) paid,	  
            to_timestamp(max(a.tmreserv), 'YYYYMMDDHH24MISS') < now() istekla,
            coalesce((select dl.status
            from	tic_docdelivery dl
            where 	dl.doc = a.id
            ), '0') delivery_st,	    
            sum(a.tax) tax, sum(a.discount) discount, sum(a."output") "output", sum(a.potrazuje) potrazuje
      from (
      select 	a.id, a.tm, a.kanal, a.cpar, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar, 		
            a.username, a.firstname, a.lastname, a.canceled, a.startda, a.starttm, a.event, a.atp, a.venue, a.nevent, a.cevent, a.broj, a.storno,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            a.opis,
            sum(a.tax) tax, sum(a.discount) discount, sum(a."output") "output", sum(a.potrazuje) potrazuje, max(a.tmreserv) tmreserv
      from  (			
          select 	du.id, du.tm, o."text" kanal, du.cpar, du.text npar, du.address addrpar, du.tel telpar, du.pib pipar, du.idnum, du.idpar, du.place plpar, 		
                du.username, du.firstname, du.lastname, du.status canceled, du.delivery, du.reservation, du.paymenttp, du.services, 
                du.printfiskal,
                du.broj, du.storno, 
                e.id event, e."text" nevent, e.code cevent, 
                ds.tax, ds.discount, ds."output", ds.potrazuje, ds.endtm tmreserv, e.endda startda, e.endtm starttm, 
                ds.carttp atp, ll.text venue, du.opis
          from (
                select p.code cpar, p.text, p.address, p.site , p.tel , p.pib , p.idnum , p.place, p.id idpar,
                    u.username, u.firstname, u.lastname,
                      COALESCE(LENGTH(dd.tmrec), 0) nodelivery, LENGTH(dd.tmcour) fordelivery, LENGTH(dd.datdelivery) indelivery, 
                      d.*
                from tic_doc d
                join cmn_parx_v p  on d.usr = p.id 
                		and p.lang = '${lang || 'sr_cyr'}'
                left join adm_user u on d.usersys = u.id
                left join tic_docdelivery dd on dd.doc = d.id
                ) as du
                join tic_docs ds on du.id = ds.doc
                join tic_eventx_v e on ds.event = e.id 
                		and e.lang = '${lang || 'sr_cyr'}'
                join cmn_locx_v ll on e.loc = ll.id 
                		and ll.lang = '${lang || 'sr_cyr'}'
                join cmn_objx_v o on du.channel = o.id 
                		and o.lang = '${lang || 'sr_cyr'}'
          where       
              ds.tgp is not null
              and ds.taxrate is not null
              and ds.price is not null
              and ds.tax is not null 
              and ds.discount is not null 
              and ds."input" is not null 
              and ds."output" is not null 
              and ds.curr is not null 
              and ds.currrate is not null 
              and ds.duguje is not null
              and ds.potrazuje is not null
              and ds.leftcurr is not null
              and ds.rightcurr is not null
              and ds.status is not null
              and ds.fee is not null 
              and ds.nart is not null 
        ) a
      group by a.id, a.tm, a.kanal, a.cpar, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar, a.broj, a.storno,		
            a.username, a.firstname, a.lastname, a.canceled, a.startda, a.starttm, a.event, a.atp, a.venue, a.nevent, a.nevent, a.cevent,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            a.opis
      ) a	
      group by a.id, a.tm, a.kanal, a.cpar, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar,  a.broj, a.storno,	
            a.username, a.firstname, a.lastname, a.canceled,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            a.opis
    ) where 1=1		  
        ` + and1 + and2 + and3 + and4 + and5 + and6
  console.log("*-*-*-*-*-*-*-*-*-1111111 objId 111111111", sqlRecenica)
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

/******************************************************************************************************************** */
const getTransactionFL = async (objName, lang, par1, par2, par3, par4, par5, par6, par7, par8, par9, par10) => {

  console.log(par6, "PAR6 ================================================")
  let and1 = ''
  if (par1 == `true`) {
    and1 = ` and canceled = '0'`
  }
  let and2 = ''
  if (par2 == `true`) {
    and2 = ` and canceled = '0'`
  }
  let and3 = ''
  if (par3 == `true`) {
    and3 = ` and canceled = '0'`
  }
  let and4 = ''
  if (par4 == `true`) {
    and4 = ` and istekla = true`
  }
  let and5 = ''
  if (par5 == `true`) {
    and5 = ` and paid = 'true'`
  }
  let and6 = ''
  if (par6 == `true`) {
    and6 = ` and canceled = '0'`
  }

  const sqlRecenica =
    `
select *
    from (
      select a.id, to_char( a.id, '0000000000000000000')||to_char( a.event, '0000000000000000000') ide, a.tm, a.kanal, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar, 		
            a.username, a.firstname, a.lastname, a.canceled, a.broj, a.storno,
		    a.event, a.startda, a.starttm,
		    a.cevent code, a.nevent text, a.venue,
		    getTransactionstavke(a.id) nevent,
        a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
        a.opis,	
        a.cchannel, a.nchannel,
		    sum(a.output) output,
             sum(a.tax) tax, sum(a.discount) discount, 
            sum(a."output") "output", sum(a.potrazuje) potrazuje,  max(a.tmreserv) tmreserv,
            sum(
            CASE
                WHEN trim(a.atp) IN ('K', 'CK') THEN a.potrazuje
                ELSE 0
            END
            ) tickettotal,
            sum(
            CASE
                WHEN trim(a.atp) IN ('K', 'CK') THEN a.output
                ELSE 0
            END
            ) ticketcount,
            (select 
              CASE 
              WHEN count(*) = 0 THEN false
              ELSE true
              END AS broj
            from	tic_docpayment dp
            where dp.status = 1
            and dp.doc = a.id
            ) paid,	  
            now()>to_timestamp(max(a.tmreserv), 'YYYYMMDDHH24MISS') istekla,
            now()-to_timestamp(max(a.tmreserv), 'YYYYMMDDHH24MISS') raz,
            coalesce((select max(dl.status) status
            from	tic_docdelivery dl
            where 	dl.doc = a.id
            ), '0') delivery_st,	    
            sum(a.tax) tax, sum(a.discount) discount, sum(a."output") "output", sum(a.potrazuje) potrazuje
      from (
      select 	a.id, a.tm, a.kanal, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar,  a.broj, a.storno,
            a.username, a.firstname, a.lastname, a.canceled, a.startda, a.starttm, a.event, a.atp, a.venue, a.nevent, a.cevent,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            a.opis, a.cchannel, a.nchannel,
            sum(a.tax) tax, sum(a.discount) discount, sum(a."output") "output", sum(a.potrazuje) potrazuje, max(a.tmreserv) tmreserv
      from  (			
          select 	du.id, du.tm, o."text" kanal, du.text npar, du.address addrpar, du.tel telpar, du.pib pipar, du.idnum, du.idpar, du.place plpar, 		
                du.username, du.firstname, du.lastname, du.status canceled, du.broj, du.storno,
                du.delivery, du.reservation, du.paymenttp, du.services, du.printfiskal,
                e.id event, e."text" nevent, e.code cevent, 
                ds.tax, ds.discount, ds."output", ds.potrazuje, ds.endtm tmreserv, e.endda startda, e.endtm starttm, 
                atp.code atp, ll.text venue, du.opis,
                du.cchannel, du.nnchannel nchannel
          from (
                select p.text, p.address, p.site , p.tel , p.pib , p.idnum , p.place, p.id idpar,
                    u.username, u.firstname, u.lastname,
                      COALESCE(LENGTH(dd.tmrec), 0) nodelivery, LENGTH(dd.tmcour) fordelivery, LENGTH(dd.datdelivery) indelivery, 
                      d.*, oo.code cchannel, oo.text nnchannel
                from tic_doc d
                join cmn_parx_v p  on d.usr = p.id 
                		and p.lang = '${lang || 'sr_cyr'}'
                left join adm_user u on d.usersys = u.id
                left join tic_docdelivery dd on dd.doc = d.id
                left join (
                	select o.*
                	from	cmn_objx_v o
                	join 	cmn_objtp tp on tp.id = o.tp and tp.code = 'XPK'
                ) oo on oo.id = d.channel
                ) as du
                join tic_docs ds on du.id = ds.doc
                join tic_artx_v ar on ds.art = ar.id 
                		and ar.lang = '${lang || 'sr_cyr'}'
                join tic_arttp atp on ar.tp = atp.id
                join tic_eventx_v e on ds.event = e.id 
                		and e.lang = '${lang || 'sr_cyr'}'
                join cmn_locx_v ll on e.loc = ll.id 
                		and ll.lang = '${lang || 'sr_cyr'}'
                join cmn_objx_v o on du.channel = o.id 
                		and o.lang = '${lang || 'sr_cyr'}'
          where       
              ds.tgp is not null
              and ds.taxrate is not null
              and ds.price is not null
              and ds.tax is not null 
              and ds.discount is not null 
              and ds."input" is not null 
              and ds."output" is not null 
              and ds.curr is not null 
              and ds.currrate is not null 
              and ds.duguje is not null
              and ds.potrazuje is not null
              and ds.leftcurr is not null
              and ds.rightcurr is not null
              and ds.status is not null
              and ds.fee is not null 
              and ds.nart is not null 
        ) a
      group by a.id, a.tm, a.kanal, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar,
            a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
            a.broj, a.storno, a.opis,	
            a.username, a.firstname, a.lastname, a.canceled, a.startda, a.starttm, a.event, a.atp, a.venue, a.nevent, a.nevent, a.cevent,
            a.cchannel, a.nchannel
      ) a	
group by a.id, a.tm, a.kanal, a.npar, a.addrpar, a.telpar, a.pipar, a.idnum, a.idpar, a.plpar, 		
            a.username, a.firstname, a.lastname, a.canceled, a.broj, a.storno,
		    a.event, a.startda, a.starttm,
        a.delivery, a.reservation, a.paymenttp, a.services, a.printfiskal,
		    a.cevent, a.nevent, a.venue, a.opis,
		    a.cchannel, a.nchannel
    ) where 1=1	  
        ` 
        // + and1 + and2 + and3 + and4 + and5 + and6
  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB TRANSAKCIJA BBBBBBBBBBBBBBBBB", sqlRecenica)
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

/******************************************************************************************************************** */

const getDocvrL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_doctpx_v', 'code', '${lang || 'sr_cyr'}') ctp , getValueById(aa.tp, 'tic_doctpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_docvrx_v aa
  where aa.lang = '${lang || 'sr_cyr'}'`
  //console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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


const getPrivilegeL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.limitirano, aa.valid, aa.lang, aa.popust, aa.domen, aa.uslov, aa.vrednost, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_privilegetpx_v', 'code', '${lang || 'sr_cyr'}') ctp , getValueById(aa.tp, 'tic_privilegetpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_privilegex_v aa
  where aa.lang = '${lang || 'sr_cyr'}'`
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getPrivilegediscountL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.privilege , aa.begda, aa.endda, aa.value, 
	      aa.discount, getValueById(aa.discount, 'tic_discountx_v', 'code', '${lang || 'sr_cyr'}') cdiscount , getValueById(aa.discount, 'tic_discountx_v', 'text', '${lang || 'sr_cyr'}') ndiscount
  from	tic_privilegediscount aa
  where aa.privilege = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getPrivilegelinkL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.privilege2 , aa.begda, aa.endda, 
	      aa.privilege1, getValueById(aa.privilege1, 'tic_privilegex_v', 'code', '${lang || 'sr_cyr'}') cprivilege , getValueById(aa.privilege1, 'tic_privilegex_v', 'text', '${lang || 'sr_cyr'}') nprivilege
  from	tic_privilegelink aa
  where aa.privilege2 = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getPrivilegecondL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.privilege , aa.begda, aa.endda, 
	      aa.begcondtp, getValueById(aa.begcondtp, 'tic_condtpx_v', 'code', '${lang || 'sr_cyr'}') cbegcondtp , getValueById(aa.begcondtp, 'tic_condtpx_v', 'text', '${lang || 'sr_cyr'}') nbegcondtp,
	      aa.begcondition, aa.begvalue,
	      aa.endcondtp, getValueById(aa.endcondtp, 'tic_condtpx_v', 'code', '${lang || 'sr_cyr'}') cendcondtp , getValueById(aa.endcondtp, 'tic_condtpx_v', 'text', '${lang || 'sr_cyr'}') nendcondtp,
	      aa.endcondition, aa.endvalue
  from	tic_privilegecond aa
  where aa.privilege = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-getPrivilegecondL", sqlRecenica)
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

const getParprivilegeL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.par , aa.begda, aa.endda, maxprc, maxval,
	      aa.privilege, getValueById(aa.privilege, 'tic_privilegex_v', 'code', '${lang || 'sr_cyr'}') cprivilege , getValueById(aa.privilege, 'tic_privilegex_v', 'text', '${lang || 'sr_cyr'}') nprivilege
  from	tic_parprivilege aa
  where aa.par = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getDiscountL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , aa.text, aa.tp, aa.valid, aa.lang, aa.grammcase,
  aa.tp, getValueById(aa.tp, 'tic_discounttpx_v', 'code', '${lang || 'sr_cyr'}') ctp , getValueById(aa.tp, 'tic_discounttpx_v', 'text', '${lang || 'sr_cyr'}') ntp
from	tic_discountx_v aa
where aa.lang = '${lang || 'sr_cyr'}'`
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getTicDocByNumV = async (item, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.site, aa.date, aa.tm , aa.status, aa.docobj , aa.broj , aa.storno, aa.obj2 , aa.opis, aa.timecreation, aa.storno, aa.year, aa.currrate, aa.channel,
	aa.usersys, aa.endtm, aa.reservation, aa.delivery, aa.paymenttp, aa.services,
  aa.usr , p.code cpar, p.text npar,
	aa.curr, c.code ccurr, c.text ncurr,
	aa.docvr, v.code cdocvr, v.text ndocvr
from tic_doc aa, cmn_parx_v p, cmn_currx_v c, tic_docvrx_v v
where aa.usr = p.id
and aa.curr  = c.id 
and aa.docvr  = v.id 
and ${item} = ${objId}
and p.lang = '${lang || 'sr_cyr'}'
and c.lang = '${lang || 'sr_cyr'}'
and v.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

  let result = await db.query(sqlRecenica);
  let rows = result.rows
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getTicDocByNumV2 = async (item1, objId1, item2, objId2, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.date, aa.tm , aa.status, aa.docobj , aa.broj , aa.storno, aa.obj , aa.obj2 , aa.opis, timecreation, storno, year,
	aa.usersys, aa.endtm, aa.reservation, aa.delivery, aa.paymenttp, aa.services,
  aa.usr , p.code cpar, p.text npar,
	aa.curr, c.code ccurr, c.text ncurr,
	aa.docvr, c.code cdocvr, c.text ndocvr
from tic_doc aa, cmn_parx_v p, cmn_currx_v c, tic_docvrx_v v
where aa.usr = p.id
and aa.curr  = c.id 
and aa.docvr  = v.id 
and ${item1} = ${objId1}
and ${item2} = ${objId2}
and p.lang = '${lang || 'sr_cyr'}'
and c.lang = '${lang || 'sr_cyr'}'
and v.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-getTicDocByNumV21111111", sqlRecenica)

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

const getTicDocsByNumV = async (item, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.site, aa.doc, aa.event , aa.tgp , aa.taxrate, aa.price , aa.input , aa.output, discount, curr, currrate,
    aa.left , aa.right, aa.leftcurr , aa.rightcurr , aa.begtm, endtm, status, fee,
    aa.loc , p.code cloc, p.text nloc,
    aa.curr, c.code ccurr, c.text ncurr,
    aa.art, a.code cart, a.text nart
  from tic_docs aa, cmn_locx_v p, tic_artx_v a, cmn_currx_v c
  where aa.loc = p.id
  and aa.art  = a.id 
  and aa.curr  = c.id 
  and ${item} = ${objId}
  and p.lang = '${lang || 'sr_cyr'}'
  and c.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getTicDocdeliveryByNumV = async (item, objId, lang) => {
  const sqlRecenica =
    `
  select aa.*
  from  tic_docdelivery aa
  where  ${item} = ${objId}
  `
  console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHgetTicDocdeliveryByNumVH", sqlRecenica)

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows[0];
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};
const getTransactionsByNumV = async (item, objId, lang) => {
  const sqlRecenica =
    `
  select aa.*
  from  tic_docs aa
  where  ${item} = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getTicDocpaymentByNumV = async (item, objId, lang) => {
  const sqlRecenica =
    `
  select aa.*
  from  tic_docpayment aa
  where  ${item} = ${objId}
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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


const getChannelByTxtV = async (objName, item, objId, lang) => {
  const sqlRecenica =
    `
  select a.*
  from  cmn_objtp aa, cmn_objx_v a
  where  aa.id = a.tp
  and ${item} = '${objId}'
  and a.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-getCmnSpedicijaByTxtV-1111111111111111", sqlRecenica)

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju channel-a iz baze - abs find: ${rows}`
    );
  }
};

const getCmnSpedicijaByTxtV = async (objName, item, objId, lang) => {
  const sqlRecenica =
    `
  select a.*
  from  cmn_partp aa, cmn_parx_v a
  where  aa.id = a.tp
  and ${item} = '${objId}'
  and a.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-getCmnSpedicijaByTxtV-1111111111111111", sqlRecenica)

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

const getEventL = async (objName, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
        aa.lang, aa.grammcase, aa.loc, aa.tmp, aa.season,
        aa.tp, tp.code ctp, tp.text ntp, aa.tm, 
        aa.mesto, l1.code cmesto, l1.text nmesto,
        aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent , getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.par, getValueById(aa.par, 'cmn_parx_v', 'code', '${lang || 'sr_cyr'}') cpar , getValueById(aa.par, 'cmn_parx_v', 'text', '${lang || 'sr_cyr'}') npar,
        aa.loc, l.code cloc , l.text nloc, l.tp tploc, aa.mapa
  from	tic_eventx_v aa, tic_eventtpx_v tp, tic_eventctgx_v ctg, cmn_locx_v l, cmn_locx_v l1
  where aa.lang = '${lang || 'sr_cyr'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and aa.loc = l.id
  and aa.mesto = l1.id
  and tp.lang = '${lang || 'sr_cyr'}'
  and ctg.lang = '${lang || 'sr_cyr'}'
  and l.lang = '${lang || 'sr_cyr'}'
  `
  console.log("**************************getEventL******************************", sqlRecenica)
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

const getEventTmpL = async (objName, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
        aa.lang, aa.grammcase, aa.loc, aa.tmp,
        aa.tp, tp.code ctp, tp.text ntp,
        aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'sr_cyr'}') cevent , getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'sr_cyr'}') nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.par, getValueById(aa.par, 'cmn_parx_v', 'code', '${lang || 'sr_cyr'}') cpar , getValueById(aa.par, 'cmn_parx_v', 'text', '${lang || 'sr_cyr'}') npar
  from	tic_eventx_v aa, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang || 'sr_cyr'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and aa.tmp = 1
  and tp.lang = '${lang || 'sr_cyr'}'
  and ctg.lang = '${lang || 'sr_cyr'}'
  `
  console.log("**************************getEventL******************************", sqlRecenica)
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

const getEventProdajaL = async (objName, lang) => {
  const sqlRecenica =
    `
    select aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
          aa.lang, aa.grammcase,
          aa.tp, tp.code ctp, tp.text ntp,
          aa.event, 
          aa.ctg, ctg.code cctg, ctg.text nctg,
          aa.loc, l.code cloc, l.text nloc,
          aa.mesto, l1.code cmesto, l1.text nmesto,
          aa.par, p.text npar, p.code cpar
    from	tic_eventx_v aa 
    join tic_eventtpx_v tp on aa.tp = tp.id 
    and tp.lang = '${lang || 'sr_cyr'}'
    join tic_eventctgx_v ctg on aa.ctg = ctg.id
    and ctg.lang = '${lang || 'sr_cyr'}'
    join cmn_parx_v p on aa.par = p.id 
    and p.lang = '${lang || 'sr_cyr'}'
    join cmn_locx_v l on aa.loc = l.id 
    and l.lang = '${lang || 'sr_cyr'}'  
    join cmn_locx_v l1 on aa.mesto = l1.id 
    and l1.lang = '${lang || 'sr_cyr'}' 
    where aa.lang = '${lang || 'sr_cyr'}'
    `
  console.log("**************************getEventProdajaL******************************", sqlRecenica)
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

const getEventAttsDDL = async (objName, objId, par1, lang) => {
  //console.log(objName, "**************************getEventAttsDDL 00 ******************************", objId)
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
        aa.lang, aa.grammcase,
        aa.tp, t.code ctp, t.text ntp,
        aa.event, aa.ctg, aa.loc
  from	tic_eventx_v aa, tic_event e, tic_eventtp t
  where aa.lang = '${lang || 'sr_cyr'}'
  and e.id = ${objId}
  and aa.par = e.par
  and aa.tp = t.id
  and t.code = '${par1}'
  and aa.status = 1
  `
  console.log("@@@@@@@@**************************getEventAttsDDL 01 ******************************@@@@@@", sqlRecenica)
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

const getEventlinkL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event1, aa.event2 , aa.note, aa2.code, aa2.text, aa2.begda
  from (
    select *
    from	tic_eventlink a
    where	a.event2 = ${objId}
  ) aa
  left join (
    select *
    from	tic_eventx_v a2
    where 	a2.lang = '${lang || 'sr_cyr'}'
  ) aa2
  on aa.event1 = aa2.id`
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

const getEventCena = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    SELECT c.id, c.code, c."text", c.textx, c.lang, c.grammcase 
    FROM tic_eventatts a, tic_cenax_v c
    WHERE CASE 
      WHEN a.value ~ E'^\\d+\\.?\\d*$' 
      THEN a.value::numeric
      ELSE -1
    END = c.id
    and c.lang = '${lang || 'sr_cyr'}'
    and a.art = ${objId}
    `
  console.log(sqlRecenica, "#######################getEventCena###########################")
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



const getEventattL = async (objName, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.code , aa.text, aa.valid, aa.ddlist, aa.link, aa.linktp, aa.description,
        aa.lang, aa.grammcase,
        aa.inputtp, getValueById(aa.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'sr_cyr'}') cinputtp, getValueById(aa.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'sr_cyr'}') ninputtp,
        aa.tp, getValueById(aa.tp, 'tic_eventatttpx_v', 'code', '${lang || 'sr_cyr'}') ctp, getValueById(aa.tp, 'tic_eventatttpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_eventattx_v aa
  where aa.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getEventattsL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event , aa.value, aa.valid, a2.ddlist, aa.text, aa.color, aa.icon,aa.condition, aa.link, aa.minfee,
        a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'sr_cyr'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'sr_cyr'}') ninputtp,
        a2.tp, getValueById(a2.tp, 'tic_eventatttpx_v', 'code', '${lang || 'sr_cyr'}') cttp, getValueById(a2.tp, 'tic_eventatttpx_v', 'text', '${lang || 'sr_cyr'}') nttp,
        aa.att, a2.code ctp, a2.text ntp
  from	tic_eventatts aa, tic_eventattx_v a2
  where aa.event = ${objId}
  and   aa.att = a2.id
  and   a2.lang = '${lang || 'sr_cyr'}'
  order by a2.code
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getEventattstpL = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event , aa.value, aa.valid, a2.ddlist, aa.text, aa.color, aa.icon,aa.condition, aa.link, aa.minfee,
        a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'sr_cyr'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'sr_cyr'}') ninputtp,
        a2.tp, getValueById(a2.tp, 'tic_eventatttpx_v', 'code', '${lang || 'sr_cyr'}') cttp, getValueById(a2.tp, 'tic_eventatttpx_v', 'text', '${lang || 'sr_cyr'}') nttp,
        aa.att, a2.code ctp, a2.text ntp, a2.description
  from	tic_eventatts aa, tic_eventattx_v a2
  where aa.event = ${objId}
  and   case ${par1} when '-1' then a2.tp else ${par1} end = a2.tp
  and   aa.att = a2.id
  and   a2.lang = '${lang || 'sr_cyr'}'
  order by a2.code
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getEventobjL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.event , aa.begda, aa.endda, aa.begtm, aa.endtm, a2.lang , a2.grammcase , aa.color, aa.icon,
        aa.objtp, getValueById(aa.objtp, 'cmn_objtpx_v', 'code', '${lang || 'sr_cyr'}') cobjtp, getValueById(aa.objtp, 'cmn_objtpx_v', 'text', '${lang || 'sr_cyr'}') nobjtp,
        aa.obj, a2.code cobj, a2.text nobj
  from	tic_eventobj aa, cmn_objx_v a2
  where aa.event = ${objId}
  and   aa.obj = a2.id
  and   a2.lang = '${lang || 'sr_cyr'}'
  `
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)

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

const getEventtpsL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.eventtp , aa.value, aa.begda, aa.endda, 
        aa.att, getValueById(aa.att, 'tic_eventattx_v', 'code', '${lang || 'sr_cyr'}') catt, getValueById(aa.att, 'tic_eventattx_v', 'text', '${lang || 'sr_cyr'}') natt
  from	tic_eventtps aa
  where aa.eventtp = ${objId}`
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

const getEventagendaL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event, aa.agenda, aa.date , aa2.code, aa2.text, aa2.begtm, aa2.endtm
  from (
    select *
    from	tic_eventagenda a
    where	a.event = ${objId}
  ) aa
  left join (
    select *
    from	tic_agendax_v a2
    where 	a2.lang = '${lang || 'sr_cyr'}'
  ) aa2
  on aa.agenda = aa2.id`
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

const getEventlocL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event , aa.begda, aa.endda, 
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc
  from	tic_eventloc aa
  where aa.event = ${objId}`
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

const getEventlocTpL = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event , aa.begda, aa.endda, aa.loc,
        b.code cloc, b.text nloc, b.valid, b.graftp, b.latlongs, b.radius, aa.color, b.fillcolor, b.originfillcolor, b.rownum, b.grammcase, b.text textx,
        b.tp loctp, getValueById(b.tp, 'cmn_loctpx_v', 'code', '${lang || 'sr_cyr'}') cloctp, getValueById(b.tp, 'cmn_loctpx_v', 'text', '${lang || 'sr_cyr'}') nloctp
  from  tic_eventloc aa, cmn_locx_v b
  where aa.event = ${objId}
  and aa.loc = b.id
  and ( b.tp = CASE WHEN ${par1} = -1 THEN b.tp  ELSE ${par1}  END )
  and b.lang = '${lang || 'sr_cyr'}'`

  console.log("*-*-*-*-*-*-*-*-*- getEventstL @@@@@@@@@@@@@@@@@", sqlRecenica)
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

const getEventcenatpL = async (objName, objId, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.event , aa.begda, aa.endda, 
        aa.cenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'code', '${lang || 'sr_cyr'}') ccenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'text', '${lang || 'sr_cyr'}') ncenatp
  from	tic_eventcenatp aa
  where aa.event = ${objId}`
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getSeatL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_seattpx_v', 'code', '${lang || 'sr_cyr'}') ctp , getValueById(aa.tp, 'tic_seattpx_v', 'text', '${lang || 'sr_cyr'}') ntp
  from	tic_seatx_v aa
  where aa.lang = '${lang || 'sr_cyr'}'`
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

const getEventstL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select 
	   aa.id, aa.site, aa.loc1, aa.code1 , aa.text1 , aa.ntp1, aa.loc2, aa.code2, aa.text2 , aa.ntp2 ,
	   aa.event, aa.graftp, aa.latlongs , aa.radius, aa.color, aa.fillcolor, aa.originfillcolor,
	   aa.rownum , aa.art, aa.cart, aa.nart, aa.longtext, getTicartpricecurrF(aa.event, aa.art) cena
   from	tic_eventst aa
   where aa.event = 1697215466579562496
  `
  // where aa.event = ${objId}
  // `      
  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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

const getDocdeliveryL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select a.id, a.site , a.doc , a.courier , p."text" ncourier , a.adress , a.amount , a.dat , a.datdelivery ,
  		a.status , a.note , a.parent , b.code cpar, b."text" npar, sum(s.potrazuje) potrazuje
  from  tic_docdelivery a, tic_doc d, tic_docs s, cmn_parx_v b, cmn_parx_v p
  where  a.doc = d.id 
  and d.usr = b.id 
  and a.courier = p.id 
  and b.lang = '${lang || 'sr_cyr'}'
  and p.lang = '${lang || 'sr_cyr'}'
  group by a.id, a.site , a.doc , a.courier , p."text", a.adress , a.amount , a.dat , a.datdelivery ,
  		a.status , a.note , a.parent , b.code, b."text"
  `
  // where aa.event = ${objId}
  // `      
  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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


const getDocdiscounttpL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select 	max(s.id) id, e.text nevent, a."text" natt, tp."text" nprivilige, min(s."condition") condition, s.minfee, s.text, s.value, tp.code cprivilege,
            e.text ||', '|| a."text" ||', '|| tp."text" ||'- val: '|| coalesce(min(s."condition"), ' ')||', '||coalesce(s.minfee::text, ' ') text
    from 	tic_eventx_v e
    join 	tic_eventatts s on s.event = e.id 
    join 	tic_eventattx_v a on a.id = s.att and a.code like '09.01%'
          and a.lang = '${lang || 'sr_cyr'}'
    left join 	tic_privilegex_v tp on trim(s.value) = tp.id::text
          and tp.lang = '${lang || 'sr_cyr'}'    
    where 	e.id in (
        select s.event
        from	tic_docs s
        where 	s.doc = ${objId}
    )
    and e.lang = '${lang || 'sr_cyr'}'
    group by e."text" , a."text" , tp."text", s.minfee, s.text, s.value, tp.code
  `

  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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

const getDocsdiscounttpL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select 	max(s.id) id, e.text nevent, a."text" natt, tp."text" nprivilige, min(s."condition") condition, s.minfee, s.text, s.value, 
            tp.code cprivilege,
            e.text ||', '|| a."text" ||', ' text1,
            tp."text" ||'- val: '|| coalesce(min(s."condition"), ' ')||', '||coalesce(s.minfee::text, ' ') text
    from 	tic_eventx_v e
    join 	tic_eventatts s on s.event = e.id 
    join 	tic_eventattx_v a on a.id = s.att and a.code like '09.01%'
          and a.lang = '${lang || 'sr_cyr'}'
    left join 	tic_privilegex_v tp on trim(s.value) = tp.id::text
          and tp.lang = '${lang || 'sr_cyr'}'    
    where 	e.id in (
        select s.event
        from	tic_docs s
        where 	s.id = ${objId}
    )
    and e.lang = '${lang || 'sr_cyr'}'
    group by e."text" , a."text" , tp."text", s.minfee, s.text, s.value, tp.code
  `

  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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

const getDocdiscountL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select *
    from tic_docdiscount d
    join (
      select 	max(s.id) aid, e.text ||', '|| a."text" ||', '|| tp."text" ||'- val: '|| coalesce(min(s."condition"), ' ')||', '||coalesce(s.minfee::text, ' ') text
      from 	tic_eventx_v e
      join 	tic_eventatts s on s.event = e.id 
      join 	tic_eventattx_v a on a.id = s.att and a.code like '09.01%'
      left join 	tic_privilegex_v tp on trim(s.value) = tp.id::text
      where 	e.id in (
          select s.event
          from	tic_docs s
          where 	s.doc = ${objId}
      )
      group by e."text" , a."text" , tp."text", s.minfee, s.text, s.value, tp.code
      ) a on d.discount = a.aid
    and d.doc = ${objId}
  `

  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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

const getDocdeliveryLL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
    select a.id, a.site , a.doc , a.courier ,  a.adress , a.amount , a.dat , a.datdelivery ,
          a.status , a.note , a.parent , a.country, a.zip , a.city, a.tmrec, a.tmship, a.tmcour, a.tmbck, a.usr,
          p.code cpar, p."text" npar, p1."text" ncourier, d.broj
    from  tic_docdelivery a
    join	tic_doc d on a.doc = d.id
    join 	cmn_parx_v p on d.usr = p.id and p.lang = '${lang || 'sr_cyr'}'
    left join 	cmn_parx_v p1 on a.courier = p1.id and p1.lang = '${lang || 'sr_cyr'}'
  `
  // where aa.event = ${objId}
  // `      
  console.log("*-*-*-*-*-*-*-*-*- getEventstL 1111111111111111", sqlRecenica)
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

const getObjTree = async (objName, lang) => {
  const sqlRecenica =
    ` select tree
  from (
  WITH RECURSIVE d2 AS (
           SELECT b.id,
            b.parentid,
            b.site,
            b.code,
            b.text,
            b.tp,
            b.ctp,
            b.ntp,
            b.lang, 
            b.grammcase,
            b.valid,
              0 AS level
             FROM (
          SELECT co.id,
                  null::numeric AS parentid,
                  co.site,
                  co.code,
                  co.text,
                  co.tp,
                  getValueById(co.tp, 'cmn_objtpx_v', 'code', 'sr_cyr') ctp,
                  getValueById(co.tp, 'cmn_objtpx_v', 'text', 'sr_cyr') ntp,
                  co.lang,
                  co.grammcase,
                  co."valid" 
                 FROM cmn_objx_v co
                WHERE co.id = '1681750967634497536'::bigint::numeric             
             ) b
            WHERE b.parentid IS NULL
          UNION ALL
         SELECT b.id,
            b.parentid,
            b.site,
            b.code,
            b.text,
            b.tp,
            b.ctp,
            b.ntp,
            b.lang, 
            b.grammcase,
            b.valid,
            d2.level + 1
           FROM (
               SELECT co.obj1 AS id,
                  co.obj2 AS parentid,
                  o.site ,
                  o.code,
                  o.text,
                  o.tp,
                  getValueById(o.tp, 'cmn_objtpx_v', 'code', 'sr_cyr') ctp,
                  getValueById(o.tp, 'cmn_objtpx_v', 'text', 'sr_cyr') ntp,
                  o.lang,
                  o.grammcase,
                  o."valid" 
                 FROM cmn_objlink co,
                  cmn_objx_v o
                WHERE co.obj1 = o.id           
             ) b
               JOIN d2 ON d2.id = b.parentid
          ), d3 AS (
           SELECT d2.id,
            d2.parentid,
            d2.site,
            d2.code,
            d2.text,
            d2.tp,
            d2.ctp,
            d2.ntp,
            d2.lang, 
            d2.grammcase,
            d2.valid,
              d2.level,
              NULL::jsonb AS children
             FROM d2
            WHERE d2.level = (( SELECT max(d2_1.level) AS max
                     FROM d2 d2_1))
          UNION
           SELECT (branch.branch_parent).id AS id,
              (branch.branch_parent).parentid AS parentid,
              (branch.branch_parent).site AS site,
              (branch.branch_parent).code AS code,
              (branch.branch_parent).text AS text,
              (branch.branch_parent).tp AS tp,
              (branch.branch_parent).ctp AS ctp,
              (branch.branch_parent).ntp AS ntp,
              (branch.branch_parent).lang AS lang,
              (branch.branch_parent).grammcase AS grammcase,
              (branch.branch_parent).valid AS valid,
              (branch.branch_parent).level AS level,
              jsonb_strip_nulls(jsonb_agg(branch.branch_child - 'parentid'::text - 'level'::text ORDER BY (branch.branch_child ->> 'text'::text)) FILTER (WHERE (branch.branch_child ->> 'parentid'::text) = (branch.branch_parent).id::text)) AS jsonb_strip_nulls
             FROM ( SELECT branch_parent.*::record AS branch_parent,
                      to_jsonb(branch_child.*) AS branch_child
                     FROM d2 branch_parent
                       JOIN d3 branch_child ON branch_child.level = (branch_parent.level + 1)) branch
            GROUP BY branch.branch_parent
          )
   SELECT jsonb_pretty(jsonb_agg(to_jsonb(d3.*) - 'parentid'::text - 'level'::text)) AS tree
     FROM d3
    WHERE d3.level = 0) x `;

  let result = await db.query(sqlRecenica);
  let rows = result.rows;

  if (Array.isArray(rows) && rows.length > 0) {
    // Pretpostavljamo da je 'tree' kolona u vašem view-u tipa JSONB
    // Ako je tip kolone JSON, možete koristiti rows[0].tree::json umesto rows[0].tree
    const jsonString = rows[0].tree;
    const formattedJson = JSON.parse(jsonString);
    return formattedJson;
  } else {
    throw new Error(
      `Greška pri dohvatanju hijerarhijskog JSON-a iz baze - abs find: ${rows}`
    );
  }
};

const getTicartpricecurrF = async (objName, eventid, objid, lang) => {
  const sqlRecenica =
    `
    select ac.value
    from  tic_artcena ac
    where ac.event = ${eventid}
    and   ac.art = ${objid}
    and   ac.begda <= to_char(current_date, 'yyyymmdd')
    and   ac.endda >= to_char(current_date, 'yyyymmdd')
  `
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getTicarttgpratecurrF = async (objName, eventid, objid, lang) => {
  const sqlRecenica =
    `
    select sum(tr.rate) rate
    from  cmn_tgp g, cmn_tgptax tt, cmn_taxrate tr, tic_art a
    where a.id = ${objid}
    and   a.tgp = g.id     
    and   g.id = tt.tgp 
    and   tt.tax = tr.tax 
    and   tt.begda <= to_char(current_date, 'yyyymmdd')
    and   tt.endda >= to_char(current_date, 'yyyymmdd')
    and   tr.begda <= to_char(current_date, 'yyyymmdd')
    and   tr.endda >= to_char(current_date, 'yyyymmdd')
  `
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getTicpardiscountcurrF = async (objName, eventid, objid, lang) => {
  const sqlRecenica =
    `
    select 	sum(pd.value) value, min(pp.maxprc) maxprc, min(pp.maxval) maxval
    from 	  tic_parprivilege pp, tic_privilege pg, tic_privilegediscount pd
    where 	pp.par = ${objid}
    and     pp.privilege = pg.id 
    and     pd.privilege = pg.id     
  `
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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


const getLocLLV = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `
    select l.id, l.site, l.code, l.text , l.valid, l.longtext, l.lang, l.grammcase, l.text textx, l.color, l.icon, 
            l.tp, getValueById(l.tp, 'cmn_loctpx_v', 'code', '${lang || 'sr_cyr'}') ctp, getValueById(l.tp, 'cmn_loctpx_v', 'text', '${lang || 'sr_cyr'}') ntp
      from	cmn_locx_v l, cmn_loclink ll
      where l.lang = '${lang || 'sr_cyr'}'
      and l.tp = (CASE WHEN ${objId} = -1 then l.tp else ${objId} end)
      and l.id = ll.loc1
      and ll.loc2 = ${par1}
    `
  console.log(sqlRecenica, "@@@@@@@@@@@@@*****************getLocLLV***********/////////@@@@@@@@@@@@@@")
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

const getTicLoclinkV = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `select  l.id, l.site, l.loctp2, l.loc2, l.tp,
            l.loctp1, getValueById(l.loctp1, 'cmn_loctpx_v', 'code', '${lang || 'sr_cyr'}') cloctp1, getValueById(l.loctp1, 'cmn_loctpx_v', 'text', '${lang || 'sr_cyr'}') nloctp1,
            l.loc1, getValueById(l.loc1, 'cmn_locx_v', 'code', '${lang || 'sr_cyr'}') cloc1, getValueById(l.loc1, 'cmn_locx_v', 'text', '${lang || 'sr_cyr'}') nloc1,   		 
            l.begda, l.endda, l.val, l.hijerarhija, l.onoff
    from    tic_loclink l
    where 	l.loc2  = ${objId}
    and   l.event = ${par1}
    `
  console.log(sqlRecenica, "***********************getCmnLoclinkV***********************")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getTicEventchpermissV = async (objName, objId, par1, lang) => {
  const sqlRecenica =
    `
      select o.id, o.code, o."text", e."event" 
      from tic_eventobj e, cmn_objx_v o
      where e.obj = o.id
      and e.event = ${objId}
      and o.id in (
        select s.obj
        from adm_userpermiss p, adm_rollx_v r, adm_rollstr s, cmn_objx_v o, adm_user u
        where r.id = p.roll
        and r.strukturna = 'D'
        and r.xparam = 'X'
        and r.id = s.roll
        and s.obj = o.id
        and p.usr = u.id
        AND u.id = CASE WHEN ${par1} = 1 THEN u.id ELSE ${par1} END
        )
      `
  console.log(sqlRecenica, "!!!!!!!!!!!***********************getTicEventpermiss***********************!!!!!!!!!!!!!!!!!!!!!!!!!")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getTicPrintgrpV = async (objId, par1, lang) => {
  const sqlRecenica =
    `
      select  s.id, e.text event, ulaz, l."text" sektor, s.rownum::numeric red, s.code1::numeric, a."text", tc.code, tc."text" tp, c.value, cc.code curr, 
          to_char(to_date(c.begda, 'YYYYMMDD'), 'DD.MM.YYYY') begda , to_char(to_date(c.endda, 'YYYYMMDD'), 'DD.MM.YYYY') endda, 
          to_char(to_date(e.endda, 'YYYYMMDD'), 'DD.MM.YYYY') startda, substring(e.endtm from 1 for 2) || ':' || substring(e.endtm from 3 for 2) starttm
      from tic_eventst s
      join tic_eventx_v e on e.id = s.event and e.lang = '${lang || 'sr_cyr'}'
      join cmn_locx_v l on l.id = s.sector and l.lang = '${lang || 'sr_cyr'}'
      join tic_artx_v a on a.id = s.art and a.lang = '${lang || 'sr_cyr'}'
      join tic_eventart ea on ea.event = e.id
      join tic_eventartcena c on ea.id = c.eventart 
      join tic_cenax_v  tc on c.cena = tc.id and tc.lang = '${lang || 'sr_cyr'}'
            and   ( case  when ${par1} = '-1' then c.cena else ${par1} end = c.cena)
      join cmn_curr cc on c.curr = cc.id
      where e.id = ${objId}
      and ea.art = s.art 
      order by l."text", s.rownum::numeric, s.code1::numeric
      `
  console.log(sqlRecenica, "!!!!!!!!!!!***********************getTicEventpermiss***********************!!!!!!!!!!!!!!!!!!!!!!!!!")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};


const getTicChpermissV = async (par1, lang) => {
  const sqlRecenica =
    `
      select o.id, o.code, o."text"
      from cmn_objx_v o
      where o.id in (
        select distinct s.obj
        from adm_userpermiss p, adm_rollx_v r, adm_rollstr s, cmn_objx_v o, adm_user u
        where r.id = p.roll
        and r.strukturna = 'D'
        and r.xparam = 'X'
        and r.id = s.roll
        and s.obj = o.id
        and p.usr = u.id
        AND u.id = CASE WHEN ${par1} = 1 THEN u.id ELSE ${par1} END
        )
      `
  console.log(sqlRecenica, "55555555555555***********************getTicEventpermiss***********************555555555555")
  const result = await db.query(sqlRecenica);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};



const getTicDocActivUser = async (objName, objid, lang) => {
  const sqlRecenica =
    `
      select 	d.*
      from 	  tic_doc d
      where 	to_timestamp(d.endtm, 'YYYYMMDDHH24MISS') > now()
      and 		d.status = '0'
      and     d.usersys = ${objid}    
    `
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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

const getTicEventatts11V = async (objid, lang) => {
  const sqlRecenica =
    `
      select t.code, t.text, o.text nvalue, o.code cvalue
      from tic_eventatts s
      join tic_eventatt t on t.id = s.att and t.code like '11.%'
      join cmn_obj o on o.id::text = s.value 
      where s.event =  ${objid}    
    `
  //const [rows] = await db.query(sqlRecenic);
  console.log("*-*-*-*-*-*-*-*-*-1111111111111111", sqlRecenica)
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
const getTicDocHaveDiscountV = async (objid, lang) => {
  const sqlRecenica =
    `
      select 	count(d.*)
      from 	  tic_docsdiscount d
      where 	d.docs = ${objid}    
    `
  //const [rows] = await db.query(sqlRecenic);
  // console.log("HHHHHHHHHH1111111111111111######################################################HHHHHHHHHHHHHHH", sqlRecenica)
  try {
    let result = await db.query(sqlRecenica);
    let row = result.rows[0];
    return row;
  } catch (error) {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getTicDocsdiscountL = async (objid, lang) => {
  const sqlRecenica =
    `
      select 	d.*, s.event, s.price, s."output"
      from 	  tic_docsdiscount d
      join    tic_docs s on s.id = d.docs
      where 	d.docs = ${objid}    
    `
  //const [rows] = await db.query(sqlRecenic);
  console.log("HHHHHHHHHH2222222222222######################################################HHHHHHHHHHHHHHH", sqlRecenica)
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

const getEventattsobjcodeL = async (objId, par1, id, lang) => {
  const sqlRecenica =
    `
      select  a2.code catt, a2.text natt, o.code cobj, o.text nobj, aa.* 
      from	tic_eventatts aa 
      join 	tic_eventattx_v a2 on aa.att = a2.id and a2.code = '${par1}'
      join 	cmn_objx_v o on o.id::"text" = aa.value and o.lang = '${lang || 'sr_cyr'}'
      join 	cmn_objtp ot on ot.id = o.tp and ot.code = '${id}'
      where aa.event = ${objId}
    `
  console.log(sqlRecenica, "*******************getEventartcenaTL*********************")
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

const getDocPaymentS = async (objId, lang) => {
  const sqlRecenica =
    `
      select  t.code , t."text", aa.*
      from	tic_docpayment aa 
      join 	cmn_paymenttpx_v t on aa.paymenttp = t.id 
      where aa.doc = ${objId}
    `
  console.log(sqlRecenica, "*******************getEventartcenaTL*********************")
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


const getCountPrint = async (objId, lang) => {
  const sqlRecenica =
    `
      select max(broj) broj, max(username) username 
      from (
      select  count(aa.*) broj, '' username
      from	tic_stampa aa 
      join 	adm_user a on aa.usr = a.id 
      where aa.doc = ${objId}
      union 
      select *
      from (
      select  0 broj, a.username
      from	tic_stampa aa 
      join 	adm_user a on aa.usr = a.id 
      where aa.doc = ${objId}
      order by aa.time desc
      LIMIT 1
      )
      )
    `
  console.log(sqlRecenica, "*******************getCountPrint*********************")
  //const [rows] = await db.query(sqlRecenic);

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
    return rows[0];
};

const getCountPay = async (objId, lang) => {
  const sqlRecenica =
    `
      select max(broj) broj, max(username) username 
      from (
      select  count(aa.*) broj, '' username
      from	tic_docpayment aa 
      join 	adm_user a on aa.usr = a.id 
      where aa.doc = ${objId}
      union 
      select *
      from (
      select  0 broj, a.username
      from	tic_docpayment aa 
      join 	adm_user a on aa.usr = a.id 
      where aa.doc = ${objId}
      order by aa.tm desc
      LIMIT 1
      )
      )
    `
  console.log(sqlRecenica, "*******************getCountPrint*********************")
  //const [rows] = await db.query(sqlRecenic);

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
    return rows[0];
};

const getTicDocsdiscountvalue = async (objId) => {
  const sqlRecenica =
    `
      SELECT sum(s.discount) iznos
      FROM tic_docs s
      WHERE  s.doc = ${objId}
  `
  console.log(sqlRecenica, "*******************getDocZbirniiznosL*********************")
  //const [rows] = await db.query(sqlRecenic);

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  if (Array.isArray(rows)) {
    return rows[0];
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

const getDocZbirniiznosL = async (objId) => {
  const sqlRecenica =
    `
      SELECT sum(s.potrazuje) iznos
      FROM tic_docs s
      WHERE  s.doc = ${objId}
  `
  console.log(sqlRecenica, "*******************getDocZbirniiznosL*********************")
  //const [rows] = await db.query(sqlRecenic);

  let result = await db.query(sqlRecenica);
  let rows = result.rows;
  return rows[0];

};

export default {
  getListaC,
  getAgendaL,
  getArtL,
  getArtlocL,
  getEventartL,
  getEventartlinkL,
  getEventartcenaL,
  getEventartcenaTL,
  getLocartL,
  getArtcenaL,
  getArtlinkL,
  getCenaL,
  getDocsL,
  getTransactionL,
  getDocvrL,
  getDocpaymentL,
  getTicDocByNumV,
  getTicDocByNumV2,
  getTicDocsByNumV,
  getEventL,
  getEventTmpL,
  getEventProdajaL,
  getEventlinkL,
  getEventobjL,
  getEventattL,
  getEventattsL,
  getEventattstpL,
  getEventtpsL,
  getEventagendaL,
  getEventlocL,
  getEventlocTpL,
  getEventcenatpL,
  getObjTree,
  getPrivilegeL,
  getPrivilegediscountL,
  getPrivilegelinkL,
  getParprivilegeL,
  getDiscountL,
  getSeatL,
  getEventstL,
  getTicartpricecurrF,
  getTicarttgpratecurrF,
  getTicpardiscountcurrF,
  getEventCena,
  getPrivilegecondL,
  getTicDocdeliveryByNumV,
  getTicDocpaymentByNumV,
  getCmnSpedicijaByTxtV,
  getDocdeliveryL,
  getDocdiscounttpL,
  getDocdiscountL,
  getDocdeliveryLL,
  getEventAttsDDL,
  getLocLLV,
  getTicLoclinkV,
  getTransactionsByNumV,
  getTicEventchpermissV,
  getTransactionFL,
  getTicDocActivUser,
  getTicChpermissV,
  getChannelByTxtV,
  getTicPrintgrpV,
  getDocsuidProdajaLista,
  getDocById,
  getDocsNaknadeL,
  getDocsArtikliL,
  getEventattsobjcodeL,
  getDocZbirniiznosL,
  getDocsArtikliPrintL,
  getTicDocHaveDiscountV,
  getTicDocsdiscountL,
  getDocsdiscounttpL,
  getTicEventatts11V,
  getTicDocsdiscountvalue,
  getStampaL,
  getDocPaymentS,
  getCountPrint,
  getCountPay,
};
