import { Router } from 'express'
import { getAlumnosActivos, getAlumnosPerActivos, getAlumnosPorPropuesta, getAlumnosPorUbi, getAlumnosPorUbiPropuesta, getEvolucionCohorte, getPlanesVersionActivos, getReinscriptosUbiProp } from '../controllers/alumnosControllers.js'

const router = Router()

router.get('/alumsact', getAlumnosActivos) //alumnos activos
router.get('/planesversion', getPlanesVersionActivos) //alumnos
router.get('/alumsactper', getAlumnosPerActivos)
router.get('/alumsactpro', getAlumnosPorPropuesta)
router.get('/alumnosSede', getAlumnosPorUbi)
router.get('/alumsactubipro', getAlumnosPorUbiPropuesta)
router.get('/reinscriptos/:anio', getReinscriptosUbiProp)
router.get('/cohorteevol/:anioI/:sede/:carrera/:anioFC/:tipoI', getEvolucionCohorte)
    
export default router