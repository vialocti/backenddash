import { Router } from 'express'
import { getEgresadoSedeCarreraAnio, getListadoEgreSedeCarreraAnio } from '../controllers/egresadosControllers'

const router = Router()

router.get('/egreanio/:anio/:lapso', getEgresadoSedeCarreraAnio)
router.get('/egreaniolista/:anio/:lapso/:sede/:car', getListadoEgreSedeCarreraAnio)
export default router