import { Router } from "express";
import {
  getAlumnosActivos,
  getAlumnosAnioCursada,
  getAlumnosPerActivos,
  getAlumnosPorPropuesta,
  getAlumnosPorUbi,
  getAlumnosPorUbiPropuesta,
  getAlumnosPorUbiPropuestaProvisorios,
  getAlumnosPorUbiProvisorios,
  getEvolucionCohorte,
  getPlanesVersionActivos,
  getReinscriptosUbiProp,
} from "../controllers/alumnosControllers.js";

const router = Router();

router.get("/alumsact", getAlumnosActivos); //alumnos activos
router.get("/planesversion", getPlanesVersionActivos); //alumnos
router.get("/alumsactper", getAlumnosPerActivos);
router.get("/alumsactpro", getAlumnosPorPropuesta);
router.get("/alumnosSede", getAlumnosPorUbi);
router.get("/alumsactubipro", getAlumnosPorUbiPropuesta);
router.get('/alumnosaniocursada', getAlumnosAnioCursada)
router.get("/aluprovisoriosSProp", getAlumnosPorUbiPropuestaProvisorios);
router.get('/aluprovisoriosSede',getAlumnosPorUbiProvisorios)
router.get("/reinscriptos/:anio", getReinscriptosUbiProp);
router.get(
  "/cohorteevol/:anioI/:sede/:carrera/:anioFC/:tipoI",
  getEvolucionCohorte
);

export default router;