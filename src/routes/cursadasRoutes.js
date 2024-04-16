import { Router } from 'express'
import { getActividadCantiInscriptos, getActividadCantiInscriptosC, getActividadComisionCantiInscriptos, getComisionesAnio, 
    getComisionesAnioMateria, 
    getComisionesCantiInscriptos, getComisionesCantiInscriptosPlan, getComisionesSedePL, 
    getComparativasInscripcion, 
    getListComisionesAnio, getListMateriasComision, getPeriodosLectivosAnio, resultadoActaDetallesporComision, 
    resultadoActaDetallesporComisiones, 
    resultadoActaDetallesporPeriodo, 
    traerDatosHistoricosResultados} from '../controllers/cursadasControllers.js'

const router = Router()
router.get('/periodoslectivos/:anio', getPeriodosLectivosAnio)//periodos lectivos
router.get('/listcomisionesanio/:anio', getListComisionesAnio)//listado comisiones
router.get('/comisionesanio/:anio', getComisionesAnio)//cantidad de comisiones por sede
router.get('/comisionesperlect/:anio', getComisionesSedePL) //cantidad de comisiones por sede periodo
router.get('/comisionesnumero/:anio/:nmateria',getComisionesAnioMateria)
router.get('/materiascomision/:anio',getListMateriasComision)

router.get('/cantiInsccomisiones/:anio', getComisionesCantiInscriptos)
router.get('/cantiinscriptosComiplan/:anio',getComisionesCantiInscriptosPlan)
router.get('/cantiInscActividad/:anio/:sede', getActividadCantiInscriptos)
router.get('/cantiInscActividadComi/:anio/:sede', getActividadCantiInscriptosC)
router.get('/cantiInscActividadComi/:anio/:sede/:actividad', getActividadComisionCantiInscriptos)
router.get('/detalleactasCur/:anio/:origen/:periodo',resultadoActaDetallesporPeriodo)
router.get('/detalleporcomision/:anio/:ncomision',resultadoActaDetallesporComision)
router.get('/detalleporcomisiones/:anio/:ncomisiones/:codsede',resultadoActaDetallesporComisiones)

router.get('/historicoIndice/:sede/:anios/:actividad', traerDatosHistoricosResultados)


router.get('/comparativas/:anio/:sede', getComparativasInscripcion)

export default router
