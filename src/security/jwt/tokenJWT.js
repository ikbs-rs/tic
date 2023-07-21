import jwt from "jsonwebtoken";
import jwtConfig from "../../config/jwtConfig.js";

const verifyToken = async (req, res, next) => {
  let token;
  const parts = req.body.split(" ");
  switch (parts.length) {
    case 1:
      token = parts;
      break;
    case 2:
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token malformed" });
      break;
    default:
      return res.status(401).send({ error: "Token error" });
  }
  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });
    req.userId = decoded.id;
    res.status(200).json({ message: "Data processed successfully", decoded });
    next();
  });
};

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  const parts = authHeader.split(" ");
  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformed" });

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });
    req.userId = decoded.id;
    res.status(200).json({ message: "Data processed successfully", decoded });
    next();
  });
};

const getToken = async (userId, userName) => {
  const payload = {
    userId: userId,
    username: userName,
    iat: Date.now(),
  };
  const token = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  const refreshToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

  return { "token" : token, "refreshToken" : refreshToken, "userId" : userId, "success" : true };
};

const decodeJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).send({ error: "No token provided" });

    const parts = authHeader.split(" ");
    if (!parts.length === 2)
      return res.status(401).send({ error: "Token error" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
      return res.status(401).send({ error: "Token malformed" });

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) return res.status(401).send({ error: "Token invalid" });
      req.userId = decoded.userId;
      res.status(200).json({ message: "Data processed successfully", decoded });
    });
  } catch (error) {
    // u slučaju greške, vraćamo objekat sa informacijama o grešci
    return res.status(error.response?.status || 500).json({
      message: error.message || "Internal Server Error",
      data: error.response?.data || {},
    });
  }
};

export { verifyToken, verifyJWT, getToken, decodeJWT };

