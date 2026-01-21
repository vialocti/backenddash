import { calculoIndicesTotales, deleteTablesIndices, generarReporteAprobadasAnioUno, grabarMateriasAprobadasCiclo, grabardatosCursadas, indicescomisionessede, obtenerDatosreporteAlumnosMat, reportAlumnosCoeficienteOptimo, reportAlumnosCoeficienteOptimoCoef, traerReporteActividades } from '../controllers/utilesControllers.js'

import { Router } from 'express'

const utilesRoutes = Router()
utilesRoutes.get('/cursadas/:anio/:sede/:recursado', grabardatosCursadas)
utilesRoutes.get('/examenes/:anio/:sede', grabarMateriasAprobadasCiclo)
utilesRoutes.get('/indices/:anio/:sede', calculoIndicesTotales)
utilesRoutes.get('/reporteAprobAnioUno/:anio/:sede/:fecha', generarReporteAprobadasAnioUno)
utilesRoutes.get('/reporteMateriasDatos/:anio/:fecha', traerReporteActividades)
utilesRoutes.get('/reportAlumnosMat/:anio/:matap', obtenerDatosreporteAlumnosMat)
utilesRoutes.get('/reportealuinfomatcompleto/:anio/:matap/:propuestas', reportAlumnosCoeficienteOptimo)
utilesRoutes.get('/reportealuinfomatcompletoCoeficiente/:desde/:hasta/:propuestas', reportAlumnosCoeficienteOptimoCoef)
utilesRoutes.get('/indicescomisionesanio/:anio/:sede', indicescomisionessede)

////cuidado peligroso
utilesRoutes.get('/eliminardatos', deleteTablesIndices)


export default utilesRoutes