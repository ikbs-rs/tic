import userHelper from "../helpers/userHelper.js";

const signin = async (req, res) => {
  try {
    const result = await userHelper.signin(req.body);
    res.status(200).json(result)
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const signout = async (req, res) => {
  try {
    const result = await userHelper.signout(req.headers.authorization);
    res.status(204).json({ message: "Korisnik uspesno odjavljen" });
  } catch (err) {
    res.status(500).json({ message: "Doslo je do greske", error: err.message });
  }
};

const signup = async (req, res) => {
  try {
    const result = await userHelper.signup(req.body);
    res.status(200).json(result)
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export default {
  signin,
  signout,
  signup,
};