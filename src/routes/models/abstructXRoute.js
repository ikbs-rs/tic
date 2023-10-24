import express from "express";
import abstructController from "../../controllers/abstructXController.js";
import vRoute from './vRoute.js'
import sRoute from "./sRoute.js";
import { checkPermissions } from "../../security/interceptors.js";

const router = express.Router();

router.use((req, res, next) => {
  next();
})

router.use("/", (req, res, next) => {
  
  const urlParts = req.url.split("/");
  // const slParam = req.query.sl;
  req.objName2 = urlParts[1];

  if (req.objName2 == "services") {
    router.use(`/${req.objName2}`, (req, res, next) => {
      return res.status(403).send({ error: "Forbidden!!" });
    });
  } else {
    
    if (req.path.startsWith("/_v")) {
      router.use("/_v", vRoute);
    } else if (req.path.startsWith("/_s")) {
      router.use("/_s", sRoute);
    } else {
      router.get("/", abstructController.getAll);
      router.get("/:id", abstructController.getById);
      router.post("/", checkPermissions("C"), abstructController.add);
      router.put("/", checkPermissions("U"), abstructController.update);
      router.delete("/:id", checkPermissions("D"), abstructController.remove);

      req.objItem = urlParts[2];
      router.get(`/get/${req.objItem}/:id`, abstructController.getItem);
      router.get(`/getid/${req.objItem}/:value`, abstructController.getIdByItem);
      router.get(`/getall/${req.objItem}/:value`, abstructController.getAllByItem);
      router.put(`/set/${req.objItem}`, checkPermissions("U"), abstructController.setItem);
    }
  }

  next();
});

export default router;
