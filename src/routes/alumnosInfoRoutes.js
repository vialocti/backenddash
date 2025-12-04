import { aniocursada19, aniocursada98, calcularAproAnio, calculoVelocidad, controlCalidadAluinfo, controlMatricula, controlPorcentaje, getReinscriptos, insertAlumnoInfo, processInfo_One, processReinscriptos, traerDatosAlumnosInfo } from "../controllers/alumnosInfoControllers.js";

import { Router } from "express";

const router = Router();

router.get('/traerReinscriptos/:anio', getReinscriptos )
router.post('/grabarReinscripto', insertAlumnoInfo)
router.get('/procReinscriptos/:anio', processReinscriptos)//reinscriptos año para alumnosinfo
router.get('/procinfoOne/:tp/:etapa', processInfo_One)//proceso de carga y actualizacion informacion alumnosInfo
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
