import express from 'express'
import abstruct from './models/abstructRoute.js'
import abstructX from "./models/abstructXRoute.js";
//import servicesRoute from './services/servicesRoute.js'
import { checkJwt, checkPermissions, checkPermissionsEx } from '../security/interceptors.js'

const router = express.Router();

//router.use(checkJwt); // provera JWT tokena na svakom zahtevu
router.use(express.json())

router.use("/", (req, res, next) => {
  const urlParts = req.url.split("/");
  // Dohvatam iz URL-a, koju tabelu obradjujen i setuje --- req.objName ****** TABELU
  // .../adm/menu/... adm je modul a menu je tabela
  if (!(urlParts[2] === "services")||!(urlParts[2] === "x")) {
    req.objName = urlParts[1] + "_" + urlParts[2];
  } 
  if (urlParts[2] === "x") { // za tebele koje imaju visejezicku podrsku
    req.objName = urlParts[1] + "_" + urlParts[3];
  }
  next();
});

router.use((req, res, next) => {
  if (req.path.startsWith("/adm/services/sign")) {
    return next();
  }
  checkJwt(req, res, next);
});

// Moze da se svede na jedan ruter ali volim da vidim sta je sve implementirano!!!


router.use('/tic/artcena', checkPermissions(), abstruct) 
router.use('/tic/artseat', checkPermissions(), abstruct) 


 
router.use('/tic/chanellseatloc', checkPermissions(), abstruct) 
router.use('/tic/channel', checkPermissions(), abstruct) 
router.use('/tic/channeleventpar', checkPermissions(), abstruct) 


router.use('/tic/doc', checkPermissions(), abstruct) 
router.use('/tic/docdocslink', checkPermissions(), abstruct) 
router.use('/tic/doclink', checkPermissions(), abstruct) 
router.use('/tic/docs', checkPermissions(), abstruct) 
router.use('/tic/docslink', checkPermissions(), abstruct) 

router.use('/tic/eventagenda', checkPermissions(), abstruct) 
router.use('/tic/eventatts', checkPermissions(), abstruct) 
router.use('/tic/eventcenatp', checkPermissions(), abstruct) 
router.use('/tic/eventlink', checkPermissions(), abstruct) 
router.use('/tic/eventloc', checkPermissions(), abstruct)  
router.use('/tic/naime', checkPermissions(), abstruct) 
router.use('/tic/parprivilege', checkPermissions(), abstruct) 

router.use('/tic/privilegecond', checkPermissions(), abstruct) 
router.use('/tic/privilegediscount', checkPermissions(), abstruct)
router.use('/tic/privilegelink', checkPermissions(), abstruct) 
 

router.use('/tic/seatloc', checkPermissions(), abstruct) 
router.use('/tic/seattpatts', checkPermissions(), abstruct) 
router.use('/tic/stampa', checkPermissions(), abstruct)

router.use('/tic/x/agenda', checkPermissions(), abstructX) 
router.use('/tic/x/agendatp', checkPermissions(), abstructX) 
router.use('/tic/x/art', checkPermissions(), abstructX) 
router.use('/tic/x/artgrp', checkPermissions(), abstructX) 
router.use('/tic/x/arttp', checkPermissions(), abstructX) 
router.use('/tic/x/cena', checkPermissions(), abstructX) 
router.use('/tic/x/cenatp', checkPermissions(), abstructX)
router.use('/tic/x/condtp', checkPermissions(), abstructX) 
router.use('/tic/x/discount', checkPermissions(), abstructX) 
router.use('/tic/x/discounttp', checkPermissions(), abstructX) 
router.use('/tic/x/doctp', checkPermissions(), abstructX) 
router.use('/tic/x/docvr', checkPermissions(), abstructX) 
router.use('/tic/x/grp', checkPermissions(), abstructX) 
router.use('/tic/x/event', checkPermissions(), abstructX) 
router.use('/tic/x/eventatt', checkPermissions(), abstructX)
router.use('/tic/x/eventtp', checkPermissions(), abstructX) 
router.use('/tic/x/privilege', checkPermissions(), abstructX) 
router.use('/tic/x/privilegetp', checkPermissions(), abstructX)
router.use('/tic/x/seat', checkPermissions(), abstructX) 
router.use('/tic/x/seattp', checkPermissions(), abstructX) 
router.use('/tic/x/seattpatt', checkPermissions(), abstructX) 

//router.use('/adm/services', servicesRoute)

router.use("/", (req, res, next) => {
  next();
  return res.status(403).send({ error: "Forbidden!! "+req.url });

})

export default router;
