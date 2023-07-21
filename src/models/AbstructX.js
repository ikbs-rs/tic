import db from "../db/db.js";
import { uniqueId } from "../middleware/utility.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;

//# add function
const add = async (sqlQuery1, sqlQuery2) => {
  console.log(sqlQuery1, sqlQuery2, "********************************");
  try {
    await db.query("BEGIN");
    const result1 = await db.query(sqlQuery1);
    const rowCount1 = result1.rowCount;

    if (rowCount1 === 0) {
      throw new Error("Prvi upit nije uspeo");
    }

    const result2 = await db.query(sqlQuery2);
    const rowCount2 = result2.rowCount;

    if (rowCount2 === 0) {
      throw new Error("Drugi upit nije uspeo");
    }

    await db.query("COMMIT"); // Potvrda transakcije

    
    return result1.rowCount;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Otkazivanje transakcije u slučaju greške
    }
    throw error;
  } 

};

//# find function
const find = async (objName, lang) => {
  const sqlRecenica =  `SELECT a.*, coalesce(b.text, a.text) textx, b.lang  
                        FROM ${objName} a left 
                        JOIN ${objName}x b 
                        ON a.id = b.tableid  
                        and b.lang = '${lang||'en'}'`
  //const [rows] = await db.query(sqlRecenic);
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

//# find by id function
const findById = async (objName, lang, id) => {
  //const result = await db.query(`SELECT * FROM ${objName} WHERE id = ?`, [id]);

  const result = await db.query(
    `SELECT a.*, coalesce(b.text, a.text) textx, b.lang  
    FROM ${objName} a 
    left JOIN ( SELECT * FROM ${objName}x where lang = '${lang||'en'}') b
    ON a.id = b.tableid   
    where a.id = ${id}`
    );
  return result.rows;
};

//# update function
const update = async (sqlQuery, objName, objData, lang) => {
  try {
    const sqlQuery1 = `select count(*) from ${objName}x  WHERE tableid = ${objData.id} and lang = '${lang||'en'}'`
    await db.query("BEGIN");
    const result1 = await db.query(sqlQuery);
    const result = await db.query(sqlQuery1);
    if (result.rows[0].count == 0) {
      const objDataX = {}
      objDataX.id = await uniqueId();
      objDataX.site = objData.site||null
      objDataX.lang = lang
      objDataX.tableid = objData.id
      objDataX.grammcase = objData.grammcase||1
      objDataX.text = objData.text
      const result2 = await db.query(
        `insert into ${objName}x (id, site, tableid, lang, grammcase, text) 
        values (${objDataX.id}, ${objDataX.site}, ${objDataX.tableid}, '${objDataX.lang}', ${objDataX.grammcase}, '${objDataX.text}')`
        );
    } else {
      const result2 = await db.query(`UPDATE ${objName}x set text = '${objData.text}'  WHERE tableid = ${objData.id} and lang = '${lang||'en'}'`);
    }
    await db.query("COMMIT"); // Potvrda transakcije
    return result1.rowCount;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Otkazivanje transakcije u slučaju greške
    }
    throw error;
  }   
};

//# delete function
const remove = async (objName, lang,  id) => {
  try {
    await db.query("BEGIN");

    const result1 = await db.query(`DELETE FROM ${objName}x WHERE tableid = ${id}`);

    const result2 = await db.query(`DELETE FROM ${objName} WHERE id = ${id}`);
    await db.query("COMMIT"); // Potvrda transakcije

    return result2.rowCount;
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK"); // Otkazivanje transakcije u slučaju greške
    }
    throw error;
  } 
};

//# find Item by id function
const findItem = async (objName, lang, item, id) => {
  let sqlString = `SELECT ${item} FROM ${objName} WHERE id = ${id}`;
  if (item === "text") {
    sqlString = `SELECT coalesce(b.text, a.text) text 
                FROM ${objName} a 
                left JOIN ( SELECT * FROM ${objName}x where lang = ${lang}) b
                ON a.id = b.tableid  
                where a.id = ${id}`;    
  } 
  const result = await db.query(sqlString);
  return result.rows[0];
};

//find id by Item function
const findIdbyItem = async (objName, lang, item, itemValue) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === "string" ? `'${itemValue}'` : itemValue;
  let sqlString = `SELECT id FROM ${objName} WHERE ${item} = ${value}`;
  if (item === "text") {
    sqlString = `SELECT a.id 
                  FROM ${objName} a  
                  JOIN ${objName}x b 
                  ON a.id = b.tableid  
                  and b.lang = '${lang||'en'}' 
                  and b.text = ${value}`;      
  }
  const { rows } = await db.query(sqlString);
  return rows[0];
};

//find id by Item function
const findAllbyItem = async (objName, lang, item, itemValue) => {
  const _objName1 = objName.replace(/_v.*/, "");
  const attributeType = entities.entitiesInfo[_objName1].attributes[item];
  const value = attributeType === "string" ? `'${itemValue}'` : itemValue;
  let sqlString = `SELECT o.*, coalesce(b.text, o.text) textx, b.lang
                    FROM ${objName} o
                    left JOIN (
                        SELECT *
                        FROM  ${objName}x ar
                        where lang = '${lang||'en'}'
                        ) b
                    ON o.id = b.tableid 
                    where o.${item} = ${value}`;                    
  const result = await db.query(sqlString);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(
      `Greška pri dohvatanju slogova iz baze - abs find: ${rows}`
    );
  }
};

//# set Item by id and value
const setItem = async (objName, lang, item, items) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === "string" ? `'${items.value}'` : items.value;
  let sqlString = `UPDATE ${objName} set ${item} = ${value}  WHERE id = ${items.id}`;
  if (item === "text") { 
    sqlString = `UPDATE ${objName}x set text = ${value}  WHERE tableid = ${items.id} and lang = '${lang||'en'}'`;
  }
  const result = await db.query(sqlString);
  return result.rowCount;
};

export default {
  find,
  findById,
  add,
  update,
  remove,
  findItem,
  findIdbyItem,
  findAllbyItem,
  setItem,
};
