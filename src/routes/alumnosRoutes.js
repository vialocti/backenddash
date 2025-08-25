import {
  calcularAniosCursada,
  consultaQuery,
  getAlumnosActivos,
  getAlumnosActivos_Info,
  getAlumnosAnioCursada,
  getAlumnosPerActivos,
  getAlumnosPorPropuesta,
  getAlumnosPorUbi,
  getAlumnosPorUbiPropuesta,
  getAlumnosPorUbiPropuestaProvisorios,
  getAlumnosPorUbiProvisorios,
  getAlumnos_Info,
  getDatosAlumnoApp,
  getEvolucionCohorte,
  getPlanesVersionActivos,
  getReinscriptosUbiProp,
  getResumenAlumnos,
} from "../controllers/alumnosControllers.js";

import { Router } from "express";

const router = Router();

router.get('/alumnostuti', getAlumnosActivos_Info )
router.get('/controlaluinfo', getAlumnos_Info)
router.post('/alumnologapp', getDatosAlumnoApp)
router.get("/alumsact", getAlumnosActivos); //alumnos activos
router.get("/planesversion", getPlanesVersionActivos); //alumnos
router.get("/alumsactper", getAlumnosPerActivos);
router.get("/alumsactpro", getAlumnosPorPropuesta);
router.get("/alumnosSede", getAlumnosPorUbi);
router.get("/alumsactubipro", getAlumnosPorUbiPropuesta);
router.get('/alumnosaniocursada', getAlumnosAnioCursada)
router.get("/aluprovisoriosSProp", getAlumnosPorUbiPropuestaProvisorios);
router.get('/aluprovisoriosSede/:anioac',getAlumnosPorUbiProvisorios)
router.get("/reinscriptos/:anio", getReinscriptosUbiProp);
router.get(
  "/cohorteevol/:anioI/:sede/:carrera/:anioFC/:tipoI",
  getEvolucionCohorte
);

router.get("/resumenalumnos",getResumenAlumnos)

router.get("/query/:sqlstr",consultaQuery)

router.get("/alumnosingresantes/:fecha/:anio", calcularAniosCursada);

export default router;
