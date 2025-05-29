import { calculoIndicesTotales, deleteTablesIndices, generarReporteAprobadasAnioUno, grabardatosCursadas, grabardatosCursadasExamenes, indicescomisionessede, obtenerDatosreporteAlumnosMat, reportAlumnosCoeficienteOptimo, traerReporteActividades } from '../controllers/utilesControllers.js'

/*
const express = require('express')
const {
  calculoIndicesTotales,
  deleteTablesIndices,
  generarReporteAprobadasAnioUno,
  grabardatosCursadas,
  grabardatosCursadasExamenes,
  indicescomisionessede,
  obtenerDatosreporteAlumnosMat,
  reportAlumnosCoeficienteOptimo,
  traerReporteActividades
} = require('../controllers/utilesControllers.js')

const router = express.Router()

router.get('/cursadas/:anio/:sede/:recursado', grabardatosCursadas)
router.get('/examenes/:anio/:sede', grabardatosCursadasExamenes)
router.get('/indices/:anio/:sede', calculoIndicesTotales)
router.get('/reporteAprobAnioUno/:anio/:sede/:fecha', generarReporteAprobadasAnioUno)
router.get('/reporteMateriasDatos/:anio/:fecha', traerReporteActividades)
router.get('/reportAlumnosMat/:anio/:matap', obtenerDatosreporteAlumnosMat)
router.get('/reportealuinfomatcompleto/:anio/:matap/:propuestas', reportAlumnosCoeficienteOptimo)

router.get('/indicescomisionesanio/:anio/:sede', indicescomisionessede)

// Cuidado: elimina datos importantes
router.get('/eliminardatos', deleteTablesIndices)

module.exports = router


*/
import { Router } from 'express'

const utilesRoutes=Router()
    utilesRoutes.get('/cursadas/:anio/:sede/:recursado', grabardatosCursadas)
    utilesRoutes.get('/examenes/:anio/:sede', grabardatosCursadasExamenes)
    utilesRoutes.get('/indices/:anio/:sede',calculoIndicesTotales)
    utilesRoutes.get('/reporteAprobAnioUno/:anio/:sede/:fecha', generarReporteAprobadasAnioUno)
    utilesRoutes.get('/reporteMateriasDatos/:anio/:fecha', traerReporteActividades)
    utilesRoutes.get('/reportAlumnosMat/:anio/:matap',obtenerDatosreporteAlumnosMat)
    utilesRoutes.get('/reportealuinfomatcompleto/:anio/:matap/:propuestas', reportAlumnosCoeficienteOptimo)

    utilesRoutes.get('/indicescomisionesanio/:anio/:sede',indicescomisionessede)

    ////cuidado peligroso
    utilesRoutes.get('/eliminardatos', deleteTablesIndices)
    

export default utilesRoutes