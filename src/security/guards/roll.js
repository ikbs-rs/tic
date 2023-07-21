import rollAct from "../../helpers/rollActHelper.js";
import { checkUserPermissions } from "../../helpers/userpermissHelper.js";
import abstructHelper from "../../helpers/abstructHelper.js";

// funkcija za proveru dozvola korisnika
const proveraDozvola = async (userId, objName, par1, par2, callback) => {
    try {
      let OK = false;
      let role = [];

      // Postoji samo jedan admin user za koga se ne proveravaju prava, on sluzi za inicijalizaciju
      const admin = await abstructHelper.getItem('adm_user', 'admin', userId)
      if (admin.admin==1) return true
      
      // Dohvatam prvo sve role dodeljene toj akciji i tim pravima CRUDX
      const rollPermission = await rollAct.getRollPermissions(objName, par1, par2);
      if (rollPermission) {
        OK = true;
        role = rollPermission;
      }
      if (OK) {
        // Ako postoji rola onda se proverava da li je data trenutnom korisniku
        const userPermission = await checkUserPermissions(userId, role);
        if (userPermission) {
          if (callback) {
            callback(null, true);
            next()
          }
          return true;
        } else {
          if (callback) {
            callback(null, false);
            next()
          }
          return false;
        }
      } else {
        if (callback) {
          callback(null, false);
          next()
        }
        return false;
      }
    } catch (error) {
      throw new Error(`Sistemska greska prilikom provere dozvola -roll: ${error.message}`);
    }
  };

export default {
  proveraDozvola,
}
