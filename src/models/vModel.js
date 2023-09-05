import db from "../db/db.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;


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
        aa.tg, getValueById(aa.tg, 'tic_agendatpx_v', 'code', '${lang||'en'}') ctp, getValueById(aa.tg, 'tic_agendatpx_v', 'text', '${lang||'en'}') ntp
  from	tic_agendax_v aa
  where aa.lang = '${lang||'en'}'`    
    
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
  `select aa.id, aa.site, aa.code, aa.text,  aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
        aa.tp, p.code ctp, p."text" ntp, 
        aa.um, u.code cum, u.text num,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.grp, g.code cgrp, g.text ngrp
  from tic_artx_v aa, tic_arttpx_v p, cmn_umx_v u, cmn_tgpx_v t, tic_artgrpx_v g
  where aa.lang = '${lang||'en'}'
  and aa.tp = p.id 
  and aa.um = u.id 
  and aa.tgp = t.id 
  and aa.grp = g.id
  and	p.lang = '${lang||'en'}'
  and	u.lang = '${lang||'en'}'
  and	t.lang = '${lang||'en'}'
  and	g.lang = '${lang||'en'}'`      
 
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
        aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang||'en'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang||'en'}') nart
  from	tic_artloc aa
  where aa.loc = ${objId}
  `  
  console.log(sqlRecenica, "*******************sqlRecenica*********************"  )    
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
  select ea.id, ea.site, ea."event", ea.discount, ea.descript, ea.begda, ea.endda, aa.site, aa.code, aa.text, aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
        ea.art, aa.code cart, aa."text" nart,
        aa.um, u.code cum, u.text num,
        aa.tgp,t.code ctgp, t.text ntgp,
        aa.grp, g.code cgrp, g.text ngrp
  from tic_eventart ea, tic_artx_v aa, tic_arttpx_v p, cmn_umx_v u, cmn_tgpx_v t, tic_artgrpx_v g
  where ea.event = ${objId}
  and ea.art = aa.id   
  and aa.lang = '${lang||'en'}'
  and aa.tp = p.id 
  and aa.um = u.id 
  and aa.tgp = t.id 
  and aa.grp = g.id
  and	p.lang = '${lang||'en'}'
  and	u.lang = '${lang||'en'}'
  and	t.lang = '${lang||'en'}'
  and	g.lang = '${lang||'en'}'
  ` 
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
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang||'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang||'en'}') nloc
  from	tic_artloc aa
  where aa.art = ${objId}
  `  
  console.log(sqlRecenica, "*******************sqlRecenica*********************"  )    
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
        aa.cena, getValueById(aa.cena, 'tic_cenax_v', 'code', '${lang||'en'}') ccena, getValueById(aa.cena, 'tic_cenax_v', 'text', '${lang||'en'}') ncena,
        aa.terr, getValueById(aa.terr, 'cmn_terrx_v', 'code', '${lang||'en'}') cterr, getValueById(aa.terr, 'cmn_terrx_v', 'text', '${lang||'en'}') nterr,
        aa.curr, getValueById(aa.curr, 'cmn_currx_v', 'code', '${lang||'en'}') ccurr, getValueById(aa.curr, 'cmn_currx_v', 'text', '${lang||'en'}') ncurr
  from	tic_artcena aa
  where aa.art = ${objId}
  `  
  console.log(sqlRecenica, "*******************getArtcenaL*********************"  )    
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
  `select aa.id , aa.site , aa.code , text, aa.valid, aa.lang, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_cenatpx_v', 'code', '${lang||'en'}') ctp , getValueById(aa.tp, 'tic_cenatpx_v', 'text', '${lang||'en'}') ntp
  from	tic_cenax_v aa
  where aa.lang = '${lang||'en'}'`      
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
      aa.event, getValueById(aa.event, 'tic_eventx_v', 'code', '${lang||'en'}') cevent, getValueById(aa.event, 'tic_eventx_v', 'text', '${lang||'en'}') nevent,
      aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang||'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang||'en'}') nloc,
      aa.art, getValueById(aa.art, 'tic_artx_v', 'code', '${lang||'en'}') cart, getValueById(aa.art, 'tic_artx_v', 'text', '${lang||'en'}') nart
  from tic_docs aa, tic_doc d
  where aa.doc = ${objId}
  and aa.doc = d.id
  `     
  console.log(objId, "*-*-*-*-*-*-*-*-*-1111111 objId 111111111", sqlRecenica)
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
	      aa.tp, getValueById(aa.tp, 'tic_doctpx_v', 'code', '${lang||'en'}') ctp , getValueById(aa.tp, 'tic_doctpx_v', 'text', '${lang||'en'}') ntp
  from	tic_docvrx_v aa
  where aa.lang = '${lang||'en'}'`      
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
  `select aa.id , aa.site , aa.code , text, aa.limitirano, aa.valid, aa.lang, aa.grammcase,
	      aa.tp, getValueById(aa.tp, 'tic_privilegetpx_v', 'code', '${lang||'en'}') ctp , getValueById(aa.tp, 'tic_privilegetpx_v', 'text', '${lang||'en'}') ntp
  from	tic_privilegex_v aa
  where aa.lang = '${lang||'en'}'`     
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
	      aa.discount, getValueById(aa.discount, 'tic_discountx_v', 'code', '${lang||'en'}') cdiscount , getValueById(aa.discount, 'tic_discountx_v', 'text', '${lang||'en'}') ndiscount
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
	      aa.privilege1, getValueById(aa.privilege1, 'tic_privilegex_v', 'code', '${lang||'en'}') cprivilege , getValueById(aa.privilege1, 'tic_privilegex_v', 'text', '${lang||'en'}') nprivilege
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


const getParprivilegeL = async (objName, objId, lang) => {
  const sqlRecenica =  
  `
  select aa.id , aa.site , aa.par , aa.begda, aa.endda, maxprc, maxval,
	      aa.privilege, getValueById(aa.privilege, 'tic_privilegex_v', 'code', '${lang||'en'}') cprivilege , getValueById(aa.privilege, 'tic_privilegex_v', 'text', '${lang||'en'}') nprivilege
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
  aa.tp, getValueById(aa.tp, 'tic_discounttpx_v', 'code', '${lang||'en'}') ctp , getValueById(aa.tp, 'tic_discounttpx_v', 'text', '${lang||'en'}') ntp
from	tic_discountx_v aa
where aa.lang = '${lang||'en'}'`     
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
  select aa.id, aa.site, aa.date, aa.tm , aa.status, aa.docobj , aa.broj , aa.storno, aa.obj2 , aa.opis, aa.timecreation, aa.storno, aa.year, aa.currrate,
	aa.usr , p.code cpar, p.text npar,
	aa.curr, c.code ccurr, c.text ncurr,
	aa.docvr, v.code cdocvr, v.text ndocvr
from tic_doc aa, cmn_parx_v p, cmn_currx_v c, tic_docvrx_v v
where aa.usr = p.id
and aa.curr  = c.id 
and aa.docvr  = v.id 
and ${item} = ${objId}
and p.lang = '${lang||'en'}'
and c.lang = '${lang||'en'}'
and v.lang = '${lang||'en'}'
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
and p.lang = '${lang||'en'}'
and c.lang = '${lang||'en'}'
and v.lang = '${lang||'en'}'
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
  and p.lang = '${lang||'en'}'
  and c.lang = '${lang||'en'}'
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

const getEventL = async (objName, lang) => {
  const sqlRecenica =  
  `
  select aa.id , aa.site , aa.code , aa.text, aa.text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, 
        aa.lang, aa.grammcase,
        aa.tp, tp.code ctp, tp.text ntp,
        aa.event, aa1.code cevent, aa1.text nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.loc
  from	tic_eventx_v aa, tic_eventx_v aa1, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang||'en'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and aa.event = aa1.id
  and tp.lang = '${lang||'en'}'
  and tp.lang = '${lang||'en'}'
  `      

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
        aa.event, aa1.code cevent, aa1.text nevent,
        aa.ctg, ctg.code cctg, ctg.text nctg,
        aa.loc
  from	tic_eventx_v aa, tic_eventx_v aa1, tic_eventtpx_v tp, tic_eventctgx_v ctg
  where aa.lang = '${lang||'en'}'
  and aa.ctg = ctg.id
  and aa.tp = tp.id
  and aa.event = aa1.id
  and tp.lang = '${lang||'en'}'
  and tp.lang = '${lang||'en'}'
  `      

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
    where 	a2.lang = '${lang||'en'}'
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

const getEventattsL = async (objName, objId, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.event , aa.value, aa.valid, a2.ddlist, aa.text,
        a2.inputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'code', '${lang||'en'}') cinputtp, getValueById(a2.inputtp, 'cmn_inputtpx_v', 'text', '${lang||'en'}') ninputtp,
        aa.att, a2.code ctp, a2.text ntp
  from	tic_eventatts aa, tic_eventattx_v a2
  where aa.event = ${objId}
  and   aa.att = a2.id
  and   a2.lang = '${lang||'en'}'
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
        aa.att, getValueById(aa.att, 'tic_eventattx_v', 'code', '${lang||'en'}') catt, getValueById(aa.att, 'tic_eventattx_v', 'text', '${lang||'en'}') natt
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
    where 	a2.lang = '${lang||'en'}'
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
        aa.loc, getValueById(aa.loc, 'cmn_locx_v', 'code', '${lang||'en'}') cloc, getValueById(aa.loc, 'cmn_locx_v', 'text', '${lang||'en'}') nloc
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

const getEventcenatpL = async (objName, objId, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.event , aa.begda, aa.endda, 
        aa.cenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'code', '${lang||'en'}') ccenatp, getValueById(aa.cenatp, 'tic_cenatpx_v', 'text', '${lang||'en'}') ncenatp
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
	      aa.tp, getValueById(aa.tp, 'tic_seattpx_v', 'code', '${lang||'en'}') ctp , getValueById(aa.tp, 'tic_seattpx_v', 'text', '${lang||'en'}') ntp
  from	tic_seatx_v aa
  where aa.lang = '${lang||'en'}'`      
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
  getLocartL,
  getArtcenaL,
  getCenaL,
  getDocsL,
  getDocvrL,
  getTicDocByNumV,
  getTicDocByNumV2,
  getTicDocsByNumV,
  getEventL,
  getEventProdajaL,
  getEventlinkL,
  getEventattsL,
  getEventtpsL,
  getEventagendaL,
  getEventlocL,
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
};
