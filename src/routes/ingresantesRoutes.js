import { Router } from 'express'
import { getIngresantesAnioSedePropTing, getIngresantesAnioSedePropuesta, getIngresantesAnioSedePropuestaTIsexo, getIngresantesAnioUbi, getIngresantesTotal, getIngresosTanios } from '../controllers/ingresantesControllers'

const router = Router()


router.get('/ingreTotalAnio/:anio', getIngresantesTotal)
router.get('/ingreTotalTanio/:anioi/:aniof', getIngresosTanios)

router.get('/ingresantesTotalIngresoAnioUbi/:anio', getIngresantesAnioUbi)
router.get('/ingresoPorPropuestaSede/:anio', getIngresantesAnioSedePropuesta)
router.get('/ingresoPorPropuestaSedeTIsexo/:anio', getIngresantesAnioSedePropuestaTIsexo)
router.get('/ingresantesaspi/:anio/:sede/:carrera/:tipoI', getIngresantesAnioSedePropTing)

export default router