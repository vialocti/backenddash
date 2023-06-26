import { Router } from 'express'
import { getAlumnosActivos, getAlumnosPerActivos, getAlumnosPorPropuesta, getAlumnosPorUbi, getAlumnosPorUbiPropuesta, getEvolucionCohorte, getReinscriptosUbiProp } from '../controllers/alumnosControllers'

const router = Router()

router.get('/alumsact', getAlumnosActivos)
router.get('/alumsactper', getAlumnosPerActivos)
router.get('/alumsactpro', getAlumnosPorPropuesta)
router.get('/alumnosSede', getAlumnosPorUbi)
router.get('/alumsactubipro', getAlumnosPorUbiPropuesta)
router.get('/reinscriptos/:anio', getReinscriptosUbiProp)
router.get('/cohorteevol/:anioI/:sede/:carrera/:anioFC/:tipoI', getEvolucionCohorte)

export default router