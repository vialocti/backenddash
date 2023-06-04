import { Router } from 'express'
import { getCantidadEgreSedeCarreraAnio, getCantidadEgreSedesAnio, getEgresadoSedeCarreraAnio, getListadoEgreSedeCarreraAnio } from '../controllers/egresadosControllers'

const router = Router()

router.get('/egreanio/:anio/:lapso', getEgresadoSedeCarreraAnio)
router.get('/egreaniolista/:anio/:lapso/:sede/:car', getListadoEgreSedeCarreraAnio)
router.get('/egresadosaniosede/:anio/:lapso/:sede', getCantidadEgreSedeCarreraAnio)
router.get('/egresadosanio/:anio/:lapso', getCantidadEgreSedesAnio)
export default router