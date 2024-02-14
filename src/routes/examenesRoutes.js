import {Router} from 'express'
import { getActasExamenTotalResu, getMesasExamen, getResultadosPorActa } from '../controllers/examenesControllers.js'

const router = Router()

router.get('/mesasAnio/:anio',getMesasExamen)
router.get('/mesasAnioARU/:anio',getActasExamenTotalResu)
router.get('/datosActa/:idacta',getResultadosPorActa)


export default router;