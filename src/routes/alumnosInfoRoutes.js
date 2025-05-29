import { aniocursada19, aniocursada98, calcularAproAnio, calculoVelocidad, controlCalidadAluinfo, controlMatricula, controlPorcentaje, getReinscriptos, insertAlumnoInfo, processInfo_One, processReinscriptos, traerDatosAlumnosInfo } from "../controllers/alumnosInfoControllers.js";

import { Router } from "express";

const router = Router();

router.get('/traerReinscriptos/:anio', getReinscriptos )
router.post('/grabarReinscripto', insertAlumnoInfo)
router.get('/procReinscriptos/:anio', processReinscriptos)
router.get('/procinfoOne/:tp', processInfo_One)
router.get('/aprobadasanio/:tipoO',calcularAproAnio)
router.get('/calculoanioplan19/:tipo/:tipoO', aniocursada19)
router.get('/calculoanioplan98/:tipo/:tipoO',aniocursada98)
router.get('/calcularCoeft/:anio/:epoca/:tipoO',calculoVelocidad)
router.get('/traerdatosalu',traerDatosAlumnosInfo)

//controles adicionales
router.get('/controlCalidad', controlCalidadAluinfo)
router.get('/calcularporcentaje/:tipoO', controlPorcentaje)
router.get('/controlMatricula', controlMatricula)

export default router;
/*
const { Router } = require('express');
const router = Router();

// Requiere los controladores necesarios
const {
  getReinscriptos,
  insertAlumnoInfo,
  processReinscriptos,
  processInfo_One,
  calcularAproAnio,
  aniocursada19,
  aniocursada98,
  calculoVelocidad,
  traerDatosAlumnosInfo,
  controlCalidadAluinfo,
  controlPorcentaje,
  controlMatricula
} = require('../controllers/alumnosInfoControllers'); // 🔁 Ajusta esta ruta

router.get('/traerReinscriptos/:anio', getReinscriptos);
router.post('/grabarReinscripto', insertAlumnoInfo);
router.get('/procReinscriptos/:anio', processReinscriptos);
router.get('/procinfoOne/:tp', processInfo_One);
router.get('/aprobadasanio/:tipoO', calcularAproAnio);
router.get('/calculoanioplan19/:tipo/:tipoO', aniocursada19);
router.get('/calculoanioplan98/:tipo/:tipoO', aniocursada98);
router.get('/calcularCoeft/:anio/:epoca/:tipoO', calculoVelocidad);
router.get('/traerdatosalu', traerDatosAlumnosInfo);

// controles adicionales
router.get('/controlCalidad', controlCalidadAluinfo);
router.get('/calcularporcentaje/:tipoO', controlPorcentaje);
router.get('/controlMatricula', controlMatricula);

module.exports = router;*/
