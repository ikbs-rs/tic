import express from "express";
import vController from "../../controllers/vController.js";

const router = express.Router();

router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  router.get("/cmn_link_v", vController.getCmnLinkV);
  router.get("/fkey", vController.getListaById);
  router.get("/lista", vController.getLista);
  //router.get("/", vController.getLista);
  next();
});

export default router;

