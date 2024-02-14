import { Router } from 'express'
import { getActividadCantiInscriptos, getActividadComisionCantiInscriptos, getComisionesAnio, 
    getComisionesCantiInscriptos, getComisionesCantiInscriptosPlan, getComisionesSedePL, 
    getListComisionesAnio, getPeriodosLectivosAnio, resultadoActaDetallesporComision, 
    resultadoActaDetallesporPeriodo } from '../controllers/cursadasControllers.js'

const router = Router()
router.get('/periodoslectivos/:anio', getPeriodosLectivosAnio)//periodos lectivos
router.get('/listcomisionesanio/:anio', getListComisionesAnio)//listado comisiones
router.get('/comisionesanio/:anio', getComisionesAnio)//cantidad de comisiones por sede
router.get('/comisionesperlect/:anio', getComisionesSedePL) //cantidad de comisiones por sede periodo

router.get('/cantiInsccomisiones/:anio', getComisionesCantiInscriptos)
router.get('/cantiinscriptosComiplan/:anio',getComisionesCantiInscriptosPlan)
router.get('/cantiInscActividad/:anio/:sede', getActividadCantiInscriptos)
router.get('/cantiInscActividadComi/:anio/:sede/:actividad', getActividadComisionCantiInscriptos)
router.get('/detalleactasCur/:anio/:origen/:periodo',resultadoActaDetallesporPeriodo)
router.get('/detalleporcomision/:anio/:ncomision',resultadoActaDetallesporComision)


export default router