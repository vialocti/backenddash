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

import { analyzeEquivalencies, askAssistant_R, consultasOpenaiNew, generateInformeIA_actividades_historicas, getAnalizador_datos } from "../controllers/openAIControllers.js";

import { Router } from "express";

const router = Router()

router.post('/analizardatos', getAnalizador_datos)
//router.post('/assitanststadistics', analizarDatos )
//router.post('/consuopenai',consultasOpenai)
router.post('/cosusql', consultasOpenaiNew)
router.post('/helpme', askAssistant_R)
//router.post('/preguntasfrecuentes', getAnalizador_datos_R)
//router.post('/consuagente', analyzeEquivalencies)
router.post('/generarInformeIA_actividades', generateInformeIA_actividades_historicas)

export default router;