import { Router } from 'express'
import { getInscriptosPorPropuestaSede, getInscriptosTotal, getInscriptosTotalSede, getIscriptosTipoIngresoSedeSexo, getIscriptosTipoIngresoSedeSexoCarrera } from '../controllers/inscriptosControllers'

const router = Router()

router.get('/inscrTotalIngreso/:anio', getInscriptosTotal)
router.get('/inscrPorPropuesta/:anio/:sede/:propuesta', getInscriptosPorPropuestaSede)
router.get('/totalsedepropuesta/:anio', getInscriptosTotalSede)
router.get('/totalsedetisexo/:anio/:sede/:tipoI/:sexo', getIscriptosTipoIngresoSedeSexo)
router.get('/totalsedetisexocarrera/:anio/:sede/:tipoI/:sexo/:carrera', getIscriptosTipoIngresoSedeSexoCarrera)
export default router