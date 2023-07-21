import abstructHelper from "./abstructHelper.js";
import userModel from "../models/User.js";
import { getToken } from "../security/jwt/tokenJWT.js";
import blacklistTokenModel from "../models/Blacklist_token.js";

const checkUser = async (username, password) => {
  const user = await userModel.findByUsername(username);
  if (!user) {
    throw new Error("Korisnik nije pronađen");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Pogrešna lozinka");
  }

  return user;
};

const signup = async (objData) => {
    try {
      const objName = "adm_user";
      // Provera da li postoji mail
      const userMail = await abstructHelper.getIdByItem(
        objName,
        "mail",
        objData.mail
      );
      if (userMail) {
        throw new Error(`Korisnik sa mejlom ${req.body.mail} postoji!`);
      }
      // Provera da li postoji username
      const userId = await abstructHelper.getIdByItem(
        objName,
        "username",
        objData.username
      );
      if (userId) {
        throw new Error(`Korisnik sa nalogom ${req.body.username} postoji!`);
      }
      // Add the user
      const result = await abstructHelper.signup(objName, objData);
      return result;
    } catch (err) {
      throw new Error(`Greška pri registraciji korisnika uH_singup: ${err.message}`);
    }
  };

const signin = async (objData) => {
    try {
        const objName = "adm_user";
        const userId = await abstructHelper.getIdByItem(objName, "username", objData.username);
        const result = await getToken(userId, objData.username);
        return result;
    } catch (err) {
        throw new Error(`Greška pri logovanju korisnika uH_singin: ${err.message}`);
    }
};

const signout = async (authorization) => {
    try {
        const token = authorization.split(" ")[1];
        const result = await blacklistTokenModel.insertToken(token);
        return result;
    } catch (err) {
        throw new Error(`Greška pri odjavi korisnika uH_singout: ${err.message}`);
    }
};

export default {
  checkUser,
  signup,  
  signin,
  signout,
};
