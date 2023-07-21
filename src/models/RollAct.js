import db from "../db/db.js";
import { uniqueId } from "../middleware/utility.js";
import abstractModel from "../models/Abstruct.js";
import abstructHelper from "../helpers/abstructHelper.js";

// funkcija koja vraća slog iz tabele rolepermiss
// za dati objName i par2
export const getRolls = async (objName, par1, par2) => {
  try {
    const value = objName;
    const params = [value];
    // Ovde dodati proveru da li postoji slog akcije ako ne insertovati novi
    const item = await abstructHelper.getIdByItem('adm_action', 'code', value)
    if (typeof item === "undefined") {
      try {
        const pId = await uniqueId()      
        let sqlQuery = `insert into adm_action values (${pId}, null, '${value}', '${value}', 1  )`
        const result = await abstractModel.add(sqlQuery)
      } catch (err) {
        console.log(err, `Greška pri dodavanju akcije u tabeli (rollAct): ${err}`)
      }
    } 

    let query =
      "SELECT ra.roll FROM adm_rollact ra, adm_action a WHERE ra.action = a.id and a.code=$1";
    if (par1 != 1 && par2 == 1) {
      switch (par1) {
        case "C":
          query = query + " and ra.cre_action = 1";
          break;
        case "U":
          query = query + " and ra.upd_action = 1";
          break;
        case "D":
          query = query + " and ra.del_action = 1";
          break;
        case "X":
          query = query + " and ra.del_action = 1";
          break;
      }
    } else if (par1 == "1" && par2 != "1") {
      console.log("RollAct",1.0);
      query = query;
      params.push(par2);
    } else if (par1 != "1" && par2 != "1") {
      console.log("RollAct",0.0);
      query = query;
      params.push(par1, par2);
    }
    
    const { rows } = await db.query(query, params);
    return rows;
  } catch (error) {
    throw new Error(
      `Greška pri dohvatanju sloga iz baze (rollAct): ${error.message}`
    );
  }
};
