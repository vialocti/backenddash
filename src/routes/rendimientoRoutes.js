import { Router } from 'express'
import { getAlumnosInfoSedePropuestaplanversion, getplanesVersion } from '../controllers/rendimientoControllers';

const router = Router()

router.get('/aluinfouno/:ubicacion/:propuesta/:plan/:planversion/:anioipro',getAlumnosInfoSedePropuestaplanversion)
router.get('/planversion',getplanesVersion)

export default router;