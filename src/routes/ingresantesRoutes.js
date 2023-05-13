import { Router } from 'express'
import { getIngresantesAnioSedePropuesta, getIngresantesAnioSedePropuestaTI, getIngresantesAnioUbi } from '../controllers/ingresantesControllers'

const router = Router()

router.get('/ingresantesTotalIngresoAnioUbi/:anio', getIngresantesAnioUbi)

router.get('/ingresoPorPropuestaSede/:anio', getIngresantesAnioSedePropuesta)
router.get('/ingresoPorPropuestaSedeTI/:anio', getIngresantesAnioSedePropuestaTI)

export default router