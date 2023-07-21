import blacklist_tokens from "../models/Blacklist_token.js";

const findAll = async () => {
  try {
    const tokens = await blacklist_tokens.findAll();
    res.status(200).json({ tokens });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving blacklisted tokens", error: err });
  }
};

const checkToken = async (req, res) => {
  try {
    const tokens = await blacklist_tokens.checkToken(req.body);
    res.status(200).json({ tokens });
  } catch (err) {
    res.status(500).json({ message: "Error checking tokens", error: err });
  }
};

const create = async (req, res) => {
  try {
    const token = await blacklist_tokens.create(req.body);
    res.status(201).json({ message: "Token blacklisted", token });
  } catch (err) {
    res.status(500).json({ message: "Error blacklisting token", error: err });
  }
};

const deleteOne = async (req, res) => {
  try {
    await blacklist_tokens.delete(req.params.id);
    res.status(200).json({ message: "Token removed from blacklist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing token from blacklist", error: err });
  }
};

export default { findAll, create, deleteOne, checkToken };