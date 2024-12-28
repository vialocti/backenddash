import {Router} from 'express'
import { getActasExamenTotalResu, getMesasExamen, getResultadosPorActa, traerAprobadasAnioPropuesta, traerAprobadasPorAlumnoSedePropuestaAnio, traerdatosHistoricoAprobadasporAlumno } from '../controllers/examenesControllers.js'

const router = Router()

router.get('/mesasAnio/:anio',getMesasExamen)
router.get('/mesasAnioARU/:anio',getActasExamenTotalResu)
router.get('/datosActa/:idacta',getResultadosPorActa)
router.get('/mataprobaluanio/:anio/:sede/:propuesta/:tipoO', traerAprobadasPorAlumnoSedePropuestaAnio)
router.get('/aproactividadPsede/:anio/:sede/:propuesta/', traerAprobadasAnioPropuesta)
router.get('/histaprobadaluanio/:sede/:propuesta/:anioi/:aniof', traerdatosHistoricoAprobadasporAlumno)


export default router;  