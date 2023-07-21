import db from "../db/db.js";
import entities from "./entitis/entitis.js";

const saltRounds = 10;

//# add function
const add = async (sqlQuery) => {
  const result = await db.query(sqlQuery);
  return result.rowCount;
};

//# find function
const find = async (objName) => {
  const sqlRecenic = `SELECT * FROM ${objName}`;
  //const [rows] = await db.query(sqlRecenic);
  const result = await db.query(sqlRecenic);
  const rows = result.rows;
  if (Array.isArray(rows)) {
    return rows;
  } else {
    throw new Error(`Greška pri dohvatanju slogova iz baze - abs find: ${rows}`);
  }
};

//# find by id function
const findById = async (objName, id) => {
  //const result = await db.query(`SELECT * FROM ${objName} WHERE id = ?`, [id]);
  const result = await db.query(`SELECT * FROM ${objName} WHERE id = ${id}`);
  return result.rows[0];
};

//# update function
const update = async (sqlQuery) => {
  const result = await db.query(sqlQuery);
  return result.rowCount;
};

//# delete function
const remove = async (objName, id) => {
  try {
    const result = await db.query(`DELETE FROM ${objName} WHERE id = ${id}`);
    return result.rowCount;
  } catch (err) {
    throw new Error(err);
  }
};

//# find Item by id function
const findItem = async (objName, item, id) => {
  const sqlString = `SELECT ${item} FROM ${objName} WHERE id = ${id}`;
  const result = await db.query(sqlString);
  return result.rows[0];
};

//find id by Item function
const findIdbyItem = async (objName, item, itemValue) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${itemValue}'` : itemValue;
  const sqlString = `SELECT id FROM ${objName} WHERE ${item} = ${value}`;
  const {rows} = await db.query(sqlString);
  return rows[0];
};

//# set Item by id and value
const setItem = async (objName, item, items) => {
  const attributeType = entities.entitiesInfo[objName].attributes[item];
  const value = attributeType === 'string' ? `'${items.value}'` : items.value;
  const sqlString = `UPDATE ${objName} set ${item} = ${value}  WHERE id = ${items.id}`;
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
  setItem,
};
