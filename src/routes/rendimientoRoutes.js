import { actualizarAniosCursada, actualizarPerdidaRegularidad, exportComisionesCSV, getAlumnosInfoSedePropuestaplanversion, getAnalisisAlumnos, getIndicesAlumnos, getplanesVersion, procesarIndicesTot, traerCantidadInscriptosTotalfceper, traerDatosHistoricosIndicesTotalPeriodo, traerIndiceTotalAnios, traerReinscripciones } from '../controllers/rendimientoControllers.js';

/*
const { Router } = require('express');
const {
  actualizarAniosCursada,
  actualizarPerdidaRegularidad,
  exportComisionesCSV,
  getAlumnosInfoSedePropuestaplanversion,
  getAnalisisAlumnos,
  getIndicesAlumnos,
  getplanesVersion,
  procesarIndicesTot,
  traerCantidadInscriptosTotalfceper,
  traerDatosHistoricosIndicesTotalPeriodo,
  traerIndiceTotalAnios,
  traerReinscripciones
} = require('../controllers/rendimientoControllers');

const router = Router();

router.get('/aluinfouno/:ubicacion/:propuesta/:plan/:planversion/:anioipro', getAlumnosInfoSedePropuestaplanversion);
router.get('/aluindices', getIndicesAlumnos);
router.get('/planversion', getplanesVersion);
router.get('/reinscripciones/:anios', traerReinscripciones);
router.get('/cantidadInscripaniosede/:sede/:anio', traerCantidadInscriptosTotalfceper);
router.get('/indicestotales/:anioI/:anioF/:sede', traerDatosHistoricosIndicesTotalPeriodo);
router.get('/indicestotalesFac/:anioI/:anioF', traerIndiceTotalAnios);

router.get('/procesoindiceT/:anio/:sede', procesarIndicesTot);

// anuario
router.get('/anuario/:anio/', exportComisionesCSV);

router.get('/anuariocursada', actualizarAniosCursada);
router.get('/anuariopereg/:aniop', actualizarPerdidaRegularidad);
router.get('/anuaricohorte/:anioI/:anioF/:sede/:propuesta', getAnalisisAlumnos);

module.exports = router;

*/
import { Router } from 'express'

const router = Router()

router.get('/aluinfouno/:ubicacion/:propuesta/:plan/:planversion/:anioipro',getAlumnosInfoSedePropuestaplanversion)
router.get('/aluindices',getIndicesAlumnos)
router.get('/planversion',getplanesVersion)
router.get('/reinscripciones/:anios', traerReinscripciones)
router.get('/cantidadInscripaniosede/:sede/:anio', traerCantidadInscriptosTotalfceper)
router.get('/indicestotales/:anioI/:anioF/:sede', traerDatosHistoricosIndicesTotalPeriodo)
router.get('/indicestotalesFac/:anioI/:anioF',traerIndiceTotalAnios)

router.get('/procesoindiceT/:anio/:sede', procesarIndicesTot)


//anuario
router.get('/anuario/:anio/',exportComisionesCSV)

router.get('/anuariocursada',actualizarAniosCursada)
router.get('/anuariopereg/:aniop',actualizarPerdidaRegularidad)
router.get('/anuaricohorte/:anioI/:anioF/:sede/:propuesta',getAnalisisAlumnos)

export default router;