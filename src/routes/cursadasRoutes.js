import { Router } from 'express'
import { getComisionesAnio, getComisionesSedePL, getListComisionesAnio } from '../controllers/cursadasControllers'

const router = Router()

router.get('/liscomisionesanio/:anio', getListComisionesAnio)
router.get('/comisionesanio/:anio', getComisionesAnio)
router.get('/comisionesperlect/:anio', getComisionesSedePL)


export default router