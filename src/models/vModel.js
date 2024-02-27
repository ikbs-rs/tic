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
    `select aa.id, aa.site, aa.code, aa.text,  aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase, color, icon,
        aa.tp, p.code ctp, p."text" ntp, 
        aa.um, u.code cum, u.text num,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.grp, g.code cgrp, g.text ngrp,
        aa.amount, aa.combining
  from tic_artx_v aa, tic_arttpx_v p, cmn_umx_v u, cmn_tgpx_v t, tic_artgrpx_v g
  where aa.lang = '${lang || 'en'}'
  and aa.tp = p.id 
  and aa.um = u.id 
  and aa.tgp = t.id 
  and aa.grp = g.id
  and	p.lang = '${lang || 'en'}'
  and	u.lang = '${lang || 'en'}'
  and	t.lang = '${lang || 'en'}'
  and	g.lang = '${lang || 'en'}'
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
        aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'en'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'en'}') nart
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
        ea.art, aa.code cart, ea.nart, aa.color,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.code||' '||aa.text cnart,
        aa.combining
  from tic_eventart ea, tic_artx_v aa, cmn_tgpx_v t
  where ea.event = ${objId}
  and ea.art = aa.id
  and aa.tgp = t.id  
  and aa.lang = '${lang || 'en'}'  
  and	t.lang = '${lang || 'en'}'
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

const getEventartlinkL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select ea.id, ea.site, ea.eventart1, ea.tp, aa.site, aa.code, aa.text, aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
        t.art, aa.code cart, aa.text nart,
        ea.eventart2, t.event, 
        aa.code||' '||aa.text cnart
  from tic_eventartlink ea, tic_artx_v aa, tic_eventart t
  where ea.eventart2 = ${objId}
  and t.art = aa.id
  and ea.eventart1 = t.id   
  and aa.lang = '${lang || 'en'}'  
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

const getArtlocL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.art , aa.begda, aa.endda, 
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'en'}') nloc
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
        aa.cena, getValueById(aa.cena, 'tic_cenax_v', 'code', '${lang || 'en'}') ccena, getValueById(aa.cena, 'tic_cenax_v', 'text', '${lang || 'en'}') ncena,
        aa.terr, getValueById(aa.terr, 'cmn_terrx_v', 'code', '${lang || 'en'}') cterr, getValueById(aa.terr, 'cmn_terrx_v', 'text', '${lang || 'en'}') nterr,
        aa.curr, getValueById(aa.curr, 'cmn_currx_v', 'code', '${lang || 'en'}') ccurr, getValueById(aa.curr, 'cmn_currx_v', 'text', '${lang || 'en'}') ncurr
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
        aa.cena, getValueById(aa.cena, 'tic_cenax_v', 'code', '${lang || 'en'}') ccena, getValueById(aa.cena, 'tic_cenax_v', 'text', '${lang || 'en'}') ncena,
        aa.terr, getValueById(aa.terr, 'cmn_terrx_v', 'code', '${lang || 'en'}') cterr, getValueById(aa.terr, 'cmn_terrx_v', 'text', '${lang || 'en'}') nterr,
        aa.curr, getValueById(aa.curr, 'cmn_currx_v', 'code', '${lang || 'en'}') ccurr, getValueById(aa.curr, 'cmn_currx_v', 'text', '${lang || 'en'}') ncurr
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
        aa.art1, getValueById(aa.art1, 'tic_artx_v', 'code', '${lang || 'en'}') cart1, getValueById(aa.art1, 'tic_artx_v', 'text', '${lang || 'en'}') nart1
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

const getDocpaymentL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id , aa.site , aa.amount, aa.doc,
        aa.paymenttp, getValueById(aa.paymenttp, 'cmn_paymenttpx_v', 'code', '${lang || 'en'}') cpaymenttp, getValueById(aa.paymenttp, 'cmn_paymenttpx_v', 'text', '${lang || 'en'}') npaymenttp,
        aa.bcontent
  from	tic_docpayment aa
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

const getCenaL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase, aa.color, aa.icon,
	      aa.tp, getValueById(aa.tp, 'tic_cenatpx_v', 'code', '${lang || 'en'}') ctp , getValueById(aa.tp, 'tic_cenatpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_cenax_v aa
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

const getDocsL = async (objName, objId, lang) => {
  const sqlRecenica =
    `
  select aa.id, aa.loc, aa.art, aa.tgp, aa.taxrate, aa.price , aa."input", aa."output" , aa.curr , aa.currrate, aa.site, aa.doc,
      aa."duguje" , aa."potrazuje" , aa.leftcurr , aa.rightcurr, aa.begtm , aa.endtm , aa.status , aa.fee , aa.par, aa.descript, aa.discount,
      aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'en'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'en'}') nevent,
      aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'en'}') nloc,
      aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang || 'en'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang || 'en'}') nart
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

const getTransactionL = async (objName, lang) => {
  const sqlRecenica =
    `
    SELECT 
      a.id, 
      a.tm, 
      a.docvr, 
      d."text" AS ndocvr, 
      a.usr, 
      p.code AS cpar, 
      p."text" AS npar, 
      b.event, 
      e."text" AS nevent, 
      e.begda, 
      'web' AS sal_ch, 
      COUNT(*) AS no_tick, 
      0 AS ticket, 
      SUM(b.potrazuje) AS amount,
      a.status, 
      b.status, 
      b.curr, 
      c.code AS ccurr, 
      CASE 
          WHEN d.code = 'RC' THEN '01'
          ELSE '02'
      END AS trtp,
      b.event
    FROM 
      tic_doc a
    JOIN 
      tic_docs b ON a.id = b.doc
    left OUTER JOIN 
      tic_eventx_v e ON b.event = e.id
    JOIN 
      cmn_parx_v p ON a.usr = p.id
    left OUTER JOIN 
      cmn_currx_v c ON b.curr = c.id
    JOIN 
      tic_docvrx_v d ON a.docvr = d.id
    WHERE e.lang = '${lang || 'en'}'
    and p.lang = '${lang || 'en'}'
    and c.lang = '${lang || 'en'}'
    and d.lang = '${lang || 'en'}'
    GROUP BY 
    a.id, 
    a.tm, 
    a.docvr, 
    a.usr, 
    p.code, 
    p."text", 
    b.event, 
    e."text", 
    e.begda, 
    a.status, 
    b.status, 
    b.curr, 
    c.code, 
    d."text", 
    trtp
ORDER BY 
    a.tm DESC
  `
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

const getDocvrL = async (objName, lang) => {
  const sqlRecenica =
    `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_doctpx_v', 'code', '${lang || 'en'}') ctp , getValueById(aa.tp, 'tic_doctpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_docvrx_v aa
  where aa.lang = '${lang || 'en'}'`
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
	      aa.tp, getValueById(aa.tp, 'tic_privilegetpx_v', 'code', '${lang || 'en'}') ctp , getValueById(aa.tp, 'tic_privilegetpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_privilegex_v aa
  where aa.lang = '${lang || 'en'}'`
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
	      aa.discount, getValueById(aa.discount, 'tic_discountx_v', 'code', '${lang || 'en'}') cdiscount , getValueById(aa.discount, 'tic_discountx_v', 'text', '${lang || 'en'}') ndiscount
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
	      aa.privilege1, getValueById(aa.privilege1, 'tic_privilegex_v', 'code', '${lang || 'en'}') cprivilege , getValueById(aa.privilege1, 'tic_privilegex_v', 'text', '${lang || 'en'}') nprivilege
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
	      aa.begcondtp, getValueById(aa.begcondtp, 'tic_condtpx_v', 'code', '${lang || 'en'}') cbegcondtp , getValueById(aa.begcondtp, 'tic_condtpx_v', 'text', '${lang || 'en'}') nbegcondtp,
	      aa.begcondition, aa.begvalue,
	      aa.endcondtp, getValueById(aa.endcondtp, 'tic_condtpx_v', 'code', '${lang || 'en'}') cendcondtp , getValueById(aa.endcondtp, 'tic_condtpx_v', 'text', '${lang || 'en'}') nendcondtp,
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
	      aa.privilege, getValueById(aa.privilege, 'tic_privilegex_v', 'code', '${lang || 'en'}') cprivilege , getValueById(aa.privilege, 'tic_privilegex_v', 'text', '${lang || 'en'}') nprivilege
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
  aa.tp, getValueById(aa.tp, 'tic_discounttpx_v', 'code', '${lang || 'en'}') ctp , getValueById(aa.tp, 'tic_discounttpx_v', 'text', '${lang || 'en'}') ntp
from	tic_discountx_v aa
where aa.lang = '${lang || 'en'}'`
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
	aa.usr , p.code cpar, p.text npar,
	aa.curr, c.code ccurr, c.text ncurr,
	aa.docvr, v.code cdocvr, v.text ndocvr
from tic_doc aa, cmn_parx_v p, cmn_currx_v c, tic_docvrx_v v
where aa.usr = p.id
and aa.curr  = c.id 
and aa.docvr  = v.id 
and ${item} = ${objId}
and p.lang = '${lang || 'en'}'
and c.lang = '${lang || 'en'}'
and v.lang = '${lang || 'en'}'
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
	aa.usr , p.code cpar, p.text npar,
	aa.curr, c.code ccurr, c.text ncurr,
	aa.docvr, c.code cdocvr, c.text ndocvr
from tic_doc aa, cmn_parx_v p, cmn_currx_v c, tic_docvrx_v v
where aa.usr = p.id
and aa.curr  = c.id 
and aa.docvr  = v.id 
and ${item1} = ${objId1}
and ${item2} = ${objId2}
and p.lang = '${lang || 'en'}'
and c.lang = '${lang || 'en'}'
and v.lang = '${lang || 'en'}'
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
  and p.lang = '${lang || 'en'}'
  and c.lang = '${lang || 'en'}'
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

const getCmnSpedicijaByTxtV = async (objName, item, objId, lang) => {
  const sqlRecenica =
    `
  select a.*
  from  cmn_partp aa, cmn_parx_v a
  where  aa.id = a.tp
  and ${item} = '${objId}'
  and a.lang = '${lang || 'en'}'
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
        aa.tp, tp.code ctp, tp.text ntp,
        aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'en'}') cevent , getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'en'}') nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.par, getValueById(aa.par, 'cmn_parx_v', 'code', '${lang || 'en'}') cpar , getValueById(aa.par, 'cmn_parx_v', 'text', '${lang || 'en'}') npar,
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'en'}') cloc , getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'en'}') nloc
  from	tic_eventx_v aa, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang || 'en'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and tp.lang = '${lang || 'en'}'
  and ctg.lang = '${lang || 'en'}'
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
        aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang || 'en'}') cevent , getValueById(aa.event, 'tic_eventx_v', 'text', '${lang || 'en'}') nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.par, getValueById(aa.par, 'cmn_parx_v', 'code', '${lang || 'en'}') cpar , getValueById(aa.par, 'cmn_parx_v', 'text', '${lang || 'en'}') npar
  from	tic_eventx_v aa, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang || 'en'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and aa.tmp = 1
  and tp.lang = '${lang || 'en'}'
  and ctg.lang = '${lang || 'en'}'
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
        aa.loc
  from	tic_eventx_v aa, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang || 'en'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and ctg.lang = '${lang || 'en'}'
  and tp.lang = '${lang || 'en'}'
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
  where aa.lang = '${lang || 'en'}'
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
    where 	a2.lang = '${lang || 'en'}'
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
    and c.lang = '${lang || 'en'}'
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
  select aa.id , aa.site , aa.code , aa.text, aa.valid, aa.ddlist, aa.link, aa.linktp,
        aa.lang, aa.grammcase,
        aa.inputtp, getValueById(aa.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'en'}') cinputtp, getValueById(aa.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'en'}') ninputtp,
        aa.tp, getValueById(aa.tp, 'tic_eventatttpx_v', 'code', '${lang || 'en'}') ctp, getValueById(aa.tp, 'tic_eventatttpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_eventattx_v aa
  where aa.lang = '${lang || 'en'}'
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
        a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'en'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'en'}') ninputtp,
        a2.tp, getValueById(a2.tp, 'tic_eventatttpx_v', 'code', '${lang || 'en'}') cttp, getValueById(a2.tp, 'tic_eventatttpx_v', 'text', '${lang || 'en'}') nttp,
        aa.att, a2.code ctp, a2.text ntp
  from	tic_eventatts aa, tic_eventattx_v a2
  where aa.event = ${objId}
  and   aa.att = a2.id
  and   a2.lang = '${lang || 'en'}'
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
        a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang || 'en'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang || 'en'}') ninputtp,
        a2.tp, getValueById(a2.tp, 'tic_eventatttpx_v', 'code', '${lang || 'en'}') cttp, getValueById(a2.tp, 'tic_eventatttpx_v', 'text', '${lang || 'en'}') nttp,
        aa.att, a2.code ctp, a2.text ntp
  from	tic_eventatts aa, tic_eventattx_v a2
  where aa.event = ${objId}
  and   case ${par1} when '-1' then a2.tp else ${par1} end = a2.tp
  and   aa.att = a2.id
  and   a2.lang = '${lang || 'en'}'
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
        aa.objtp, getValueById(aa.objtp, 'cmn_objtpx_v', 'code', '${lang || 'en'}') cobjtp, getValueById(aa.objtp, 'cmn_objtpx_v', 'text', '${lang || 'en'}') nobjtp,
        aa.obj, a2.code cobj, a2.text nobj
  from	tic_eventobj aa, cmn_objx_v a2
  where aa.event = ${objId}
  and   aa.obj = a2.id
  and   a2.lang = '${lang || 'en'}'
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
        aa.att, getValueById(aa.att, 'tic_eventattx_v', 'code', '${lang || 'en'}') catt, getValueById(aa.att, 'tic_eventattx_v', 'text', '${lang || 'en'}') natt
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
    where 	a2.lang = '${lang || 'en'}'
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
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang || 'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang || 'en'}') nloc
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
        b.code cloc, b.text nloc, b.valid, b.graftp, b.latlongs, b.radius, b.color, b.fillcolor, b.originfillcolor, b.rownum, b.grammcase, b.text textx,
        b.tp loctp, getValueById(b.tp, 'cmn_loctpx_v', 'code', '${lang || 'en'}') cloctp, getValueById(b.tp, 'cmn_loctpx_v', 'text', '${lang || 'en'}') nloctp
  from  tic_eventloc aa, cmn_locx_v b
  where aa.event = ${objId}
  and aa.loc = b.id
  and ( b.tp = CASE WHEN ${par1} = -1 THEN b.tp  ELSE ${par1}  END )
  and b.lang = '${lang || 'en'}'`

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
        aa.cenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'code', '${lang || 'en'}') ccenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'text', '${lang || 'en'}') ncenatp
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
	      aa.tp, getValueById(aa.tp, 'tic_seattpx_v', 'code', '${lang || 'en'}') ctp , getValueById(aa.tp, 'tic_seattpx_v', 'text', '${lang || 'en'}') ntp
  from	tic_seatx_v aa
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
  and b.lang = '${lang || 'en'}'
  and p.lang = '${lang || 'en'}'
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
  getCmnSpedicijaByTxtV,
  getDocdeliveryL,
  getEventAttsDDL,
};
