import db from "../db/db.js"
import { uniqueId } from "../middleware/utility.js"
import moment from 'moment'
 
// Function to insert a new token into the blacklist
const insertToken = async (token) => {
  const uId = await uniqueId()
  const expiration = moment().format('YYYYMMDDHHmmss');
    const result = await db.query(
      'INSERT INTO adm_blacklist_token VALUES ($1, $2, $3)',
      [uId, token, expiration]
    );
    return result;
};

// Function to check if a token exists in the blacklist
const findAll = async (token) => {
  const result = await db.query(
      'SELECT * FROM adm_blacklist_tokens WHERE token = $1',
      [token])
  return result;
};

// Function to check if a token exists in the blacklist
const checkToken = async (token) => {
  const result = await db.query(
      'SELECT * FROM adm_blacklist_tokens WHERE token = $1',
      [token])
  return result      
};

// Function to delete a token from the blacklist
const deleteToken = async (token) => {
  const result = await db.query(
      'DELETE FROM adm_blacklist_tokens WHERE token = $1',
      [token])
  return result
};

export default {
  insertToken,
  checkToken,
  deleteToken,
  findAll
};