import { Router } from 'express'
import { getInscriptosPorPropuestaSede, getInscriptosTanios, getInscriptosTotal, getInscriptosTotalSede, getIscriptosTipoIngresoSedeSexo, getIscriptosTipoIngresoSedeSexoCarrera } from '../controllers/inscriptosControllers'

const router = Router()

router.get('/inscrTotalIngreso/:anio', getInscriptosTotal)
router.get('/inscriptTanios/:anioi/:aniof', getInscriptosTanios)
router.get('/inscrPorPropuesta/:anio/:sede/:propuesta', getInscriptosPorPropuestaSede)
router.get('/totalsedepropuesta/:anio', getInscriptosTotalSede)
router.get('/totalsedetisexo/:anio/:sede/:tipoI/:sexo', getIscriptosTipoIngresoSedeSexo)
router.get('/totalsedetisexocarrera/:anio/:sede/:tipoI/:sexo/:carrera', getIscriptosTipoIngresoSedeSexoCarrera)

export default router