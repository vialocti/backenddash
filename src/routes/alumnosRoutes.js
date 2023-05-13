import { Router } from 'express'
import { getAlumnosActivos, getAlumnosPerActivos, getAlumnosPorPropuesta, getAlumnosPorUbiPropuesta, getReinscriptosUbiProp } from '../controllers/alumnosControllers'

const router = Router()

router.get('/alumsact', getAlumnosActivos)
router.get('/alumsactper', getAlumnosPerActivos)
router.get('/alumsactpro', getAlumnosPorPropuesta)
router.get('/alumsactubipro', getAlumnosPorUbiPropuesta)
router.get('/reinscriptos/:anio', getReinscriptosUbiProp)

export default router