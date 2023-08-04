import express from "express";
import fileController from "../../controllers/fileController.js";
import { checkPermissions } from "../../security/interceptors.js";

const router = express.Router();

router.use("/", (req, res, next) => {
    console.log("Dosao u fileRuter");
  const urlParts = req.url.split("/");
  req.objName2 = urlParts[1];
  router.post("/upload", checkPermissions("C"),fileController.uploadFile);
  router.delete("/delete/:filename", checkPermissions("D"), fileController.deleteFile);
  next();
});

export default router;

