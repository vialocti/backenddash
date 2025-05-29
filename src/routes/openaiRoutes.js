/*
const { Router } = require('express');
const { getAnalizador_datos, consultasOpenaiNew } = require('../controllers/openAIControllers');

const router = Router();

router.post('/analizardatos', getAnalizador_datos);
// router.post('/assitanststadistics', analizarDatos);
// router.post('/consuopenai', consultasOpenai);
router.post('/cosusql', consultasOpenaiNew);

module.exports = router;
*/

import { consultasOpenaiNew, getAnalizador_datos } from "../controllers/openAIControllers.js";

import { Router } from "express";

const router = Router()

router.post('/analizardatos', getAnalizador_datos)
//router.post('/assitanststadistics', analizarDatos )
//router.post('/consuopenai',consultasOpenai)
router.post('/cosusql', consultasOpenaiNew)

export default router;