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
  `select aa.id, aa.site, aa.code, aa.text, aa."event", aa.eancode, aa.qrcode, aa.valid, aa.lang, aa.grammcase,
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

//# find function
const getEventL = async (objName, lang) => {
  const sqlRecenica =  
  `select aa.id , aa.site , aa.code , text, text textx, aa.begda, aa.endda, aa.begtm, aa.endtm, aa.status, aa.descript, aa.note, aa.lang, aa.grammcase,
        aa.tp, getValueById(aa.tp, 'tic_eventtpx_v', 'code', '${lang||'en'}') ctp, getValueById(aa.tp, 'tic_eventtpx_v', 'text', '${lang||'en'}') ntp
  from	tic_eventx_v aa
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
  `select aa.id , aa.site , aa.event , aa.value, aa.begda, aa.endda, 
        aa.att, getValueById(aa.att, 'tic_eventattx_v', 'code', '${lang||'en'}') ctp, getValueById(aa.att, 'tic_eventattx_v', 'text', '${lang||'en'}') ntp
  from	tic_eventatts aa
  where aa.event = ${objId}`      
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
        aa.loc, getValueById(aa.loc, 'cmn_objx_v', 'code', '${lang||'en'}') cloc, getValueById(aa.loc, 'cmn_objx_v', 'text', '${lang||'en'}') nloc
  from	tic_eventloc aa
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



export default {
  getListaC,
  getAgendaL,
  getArtL,
  getCenaL,
  getDocvrL,
  getEventL,
  getEventlinkL,
  getEventattsL,
  getEventagendaL,
  getEventlocL,
  getObjTree,
  getPrivilegeL,
  getDiscountL,
  getSeatL,
};
