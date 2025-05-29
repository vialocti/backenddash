import {
  calcularAniosCursada,
  consultaQuery,
  getAlumnosActivos,
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

/*
const { Router } = require("express");
const {
  calcularAniosCursada,
  consultaQuery,
  getAlumnos_Info,
  getAlumnosActivos,
  getAlumnosAnioCursada,
  getAlumnosPerActivos,
  getAlumnosPorPropuesta,
  getAlumnosPorUbi,
  getAlumnosPorUbiPropuesta,
  getAlumnosPorUbiPropuestaProvisorios,
  getAlumnosPorUbiProvisorios,
  getDatosAlumnoApp,
  getEvolucionCohorte,
  getPlanesVersionActivos,
  getReinscriptosUbiProp,
  getResumenAlumnos
} = require("../controllers/alumnosControllers");

const router = Router();

router.get("/controlaluinfo", getAlumnos_Info);
router.post("/alumnologapp", getDatosAlumnoApp);
router.get("/alumsact", getAlumnosActivos);
router.get("/planesversion", getPlanesVersionActivos);
router.get("/alumsactper", getAlumnosPerActivos);
router.get("/alumsactpro", getAlumnosPorPropuesta);
router.get("/alumnosSede", getAlumnosPorUbi);
router.get("/alumsactubipro", getAlumnosPorUbiPropuesta);
router.get("/alumnosaniocursada", getAlumnosAnioCursada);
router.get("/aluprovisoriosSProp", getAlumnosPorUbiPropuestaProvisorios);
router.get("/aluprovisoriosSede/:anioac", getAlumnosPorUbiProvisorios);
router.get("/reinscriptos/:anio", getReinscriptosUbiProp);
router.get(
  "/cohorteevol/:anioI/:sede/:carrera/:anioFC/:tipoI",
  getEvolucionCohorte
);
router.get("/resumenalumnos", getResumenAlumnos);
router.get("/query/:sqlstr", consultaQuery);
router.get("/alumnosingresantes/:fecha/:anio", calcularAniosCursada);

module.exports = router;

*/
import { Router } from "express";

const router = Router();
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
