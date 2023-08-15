import db from "../db/db.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;


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


export default {
  getAgendaL,
  getArtL,
};
