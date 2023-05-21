import { Router } from 'express'
import { getIngresantesAnioSedePropTing, getIngresantesAnioSedePropuesta, getIngresantesAnioSedePropuestaTI, getIngresantesAnioUbi, getIngresantesTotal, getIngresosTanios } from '../controllers/ingresantesControllers'

const router = Router()


router.get('/ingreTotalAnio/:anio', getIngresantesTotal)
router.get('/ingreTotalTanio/:anioi/:aniof', getIngresosTanios)

router.get('/ingresantesTotalIngresoAnioUbi/:anio', getIngresantesAnioUbi)
router.get('/ingresoPorPropuestaSede/:anio', getIngresantesAnioSedePropuesta)
router.get('/ingresoPorPropuestaSedeTI/:anio', getIngresantesAnioSedePropuestaTI)
router.get('/ingresantesaspi/:anio/:sede/:carrera/:tipoI', getIngresantesAnioSedePropTing)

export default router