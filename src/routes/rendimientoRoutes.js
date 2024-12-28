import { Router } from 'express'
import { getAlumnosInfoSedePropuestaplanversion, getplanesVersion, traerCantidadInscriptosTotalfceper, traerDatosHistoricosIndicesTotalPeriodo, traerIndiceTotalAnios, traerReinscripciones } from '../controllers/rendimientoControllers.js';

const router = Router()

router.get('/aluinfouno/:ubicacion/:propuesta/:plan/:planversion/:anioipro',getAlumnosInfoSedePropuestaplanversion)
router.get('/planversion',getplanesVersion)
router.get('/reinscripciones/:anios', traerReinscripciones)
router.get('/cantidadInscripaniosede/:sede/:anio', traerCantidadInscriptosTotalfceper)
router.get('/indicestotales/:anioI/:anioF/:sede', traerDatosHistoricosIndicesTotalPeriodo)
router.get('/indicestotalesFac/:anioI/:anioF',traerIndiceTotalAnios)

export default router;