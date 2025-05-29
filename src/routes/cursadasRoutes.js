import {
    getActividadCantiInscriptos,
    getActividadCantiInscriptosC,
    getActividadCantiInscriptosPorSede,
    getActividadComisionCantiInscriptos,
    getComisionesAnio,
    getComisionesAnioMateria,
    getComisionesCantiInscriptos,
    getComisionesCantiInscriptosPlan,
    getComisionesSedePL,
    getComparativasInscripcion,
    getComparativasInscripcionActividad,
    getInscriptosPropuestaAñoSede,
    getListComisionesAnio,
    getListMateriasComision,
    getPeriodosLectivosAnio,
    getPropuestaVersionactual,
    resultadoActaDetallesporComision,
    resultadoActaDetallesporComisiones,
    resultadoActaDetallesporPeriodo,
    traerActividadesHistoricas,
    traerComisionesporPeriodo,
    traerDatosHistoricosResultados,
    traerListadoCursadaComision,
    traerPeriodosgenCursadas
} from '../controllers/cursadasControllers.js'

/*
const { Router } = require('express');
const {
  getActividadCantiInscriptos,
  getActividadCantiInscriptosC,
  getActividadComisionCantiInscriptos,
  getComisionesAnio,
  getComisionesAnioMateria,
  getComisionesCantiInscriptos,
  getComisionesCantiInscriptosPlan,
  getComisionesSedePL,
  getComparativasInscripcion,
  getListComisionesAnio,
  getListMateriasComision,
  getPeriodosLectivosAnio,
  resultadoActaDetallesporComision,
  resultadoActaDetallesporComisiones,
  resultadoActaDetallesporPeriodo,
  traerActividadesHistoricas,
  traerDatosHistoricosResultados,
  getInscriptosPropuestaAñoSede,
  getPropuestaVersionactual,
  getActividadCantiInscriptosPorSede,
  traerPeriodosgenCursadas,
  traerComisionesporPeriodo,
  traerListadoCursadaComision,
  getComparativasInscripcionActividad
} = require('../controllers/cursadasControllers');

const router = Router();

router.get('/periodoslectivos/:anio', getPeriodosLectivosAnio);
router.get('/listcomisionesanio/:anio', getListComisionesAnio);
router.get('/comisionesanio/:anio', getComisionesAnio);
router.get('/comisionesperlect/:anio', getComisionesSedePL);
router.get('/comisionesnumero/:anio/:nmateria', getComisionesAnioMateria);
router.get('/materiascomision/:anio/:sede', getListMateriasComision);

router.get('/cantiInsccomisiones/:anio', getComisionesCantiInscriptos);
router.get('/cantiinscriptosComiplan/:anio', getComisionesCantiInscriptosPlan);
router.get('/cantiInscActividad/:anio/:sede', getActividadCantiInscriptos);
router.get('/cantiInscActividadComi/:anio/:sede', getActividadCantiInscriptosC);
router.get('/cantiInscActividadComi/:anio/:sede/:actividad', getActividadComisionCantiInscriptos);

router.get('/detalleactasCur/:anio/:origen/:periodo', resultadoActaDetallesporPeriodo);
router.get('/detalleporcomision/:anio/:ncomision', resultadoActaDetallesporComision);
router.get('/detalleporcomisiones/:anio/:ncomisiones/:codsede/:recursado/:propuesta', resultadoActaDetallesporComisiones);

router.get('/actividadeshistoricos/:sede/:anioI', traerActividadesHistoricas);
router.get('/historicoIndice/:sede/:anioI/:anioF/:actividad/:tcomi', traerDatosHistoricosResultados);

router.get('/comparativas/:anio/:sede', getComparativasInscripcion);
router.get('/comparativaActividad/:anio/:sede/:actividad/:pgenerico', getComparativasInscripcionActividad);

router.get('/propuestaversionact/:propuesta', getPropuestaVersionactual);
router.get('/inscriptospropuestasede/:anio/:sede/:versionact', getInscriptosPropuestaAñoSede);

router.get('/traerinscriptostotsede/:anio', getActividadCantiInscriptosPorSede);

router.get('/periodosgenericos', traerPeriodosgenCursadas);
router.get('/comisionesperiodo/:periodo', traerComisionesporPeriodo);
router.get('/listadoalumnoscomision/:comision/:anio/:sede/:actividad', traerListadoCursadaComision);

module.exports = router;


*/
import { Router } from 'express'

const router = Router()
router.get('/periodoslectivos/:anio', getPeriodosLectivosAnio)//periodos lectivos
router.get('/listcomisionesanio/:anio', getListComisionesAnio)//listado comisiones
router.get('/comisionesanio/:anio', getComisionesAnio)//cantidad de comisiones por sede
router.get('/comisionesperlect/:anio', getComisionesSedePL) //cantidad de comisiones por sede periodo
router.get('/comisionesnumero/:anio/:nmateria',getComisionesAnioMateria)
router.get('/materiascomision/:anio/:sede',getListMateriasComision)

router.get('/cantiInsccomisiones/:anio', getComisionesCantiInscriptos)
router.get('/cantiinscriptosComiplan/:anio',getComisionesCantiInscriptosPlan)
router.get('/cantiInscActividad/:anio/:sede', getActividadCantiInscriptos)
router.get('/cantiInscActividadComi/:anio/:sede', getActividadCantiInscriptosC)
router.get('/cantiInscActividadComi/:anio/:sede/:actividad', getActividadComisionCantiInscriptos)
router.get('/detalleactasCur/:anio/:origen/:periodo',resultadoActaDetallesporPeriodo)
router.get('/detalleporcomision/:anio/:ncomision',resultadoActaDetallesporComision)
router.get('/detalleporcomisiones/:anio/:ncomisiones/:codsede/:recursado/:propuesta',resultadoActaDetallesporComisiones)

router.get('/actividadeshistoricos/:sede/:anioI', traerActividadesHistoricas)

router.get('/historicoIndice/:sede/:anioI/:anioF/:actividad/:tcomi', traerDatosHistoricosResultados)


router.get('/comparativas/:anio/:sede', getComparativasInscripcion)
router.get('/comparativaActividad/:anio/:sede/:actividad/:pgenerico', getComparativasInscripcionActividad)

//

router.get('/propuestaversionact/:propuesta', getPropuestaVersionactual)
router.get('/inscriptospropuestasede/:anio/:sede/:versionact', getInscriptosPropuestaAñoSede)

router.get('/traerinscriptostotsede/:anio',getActividadCantiInscriptosPorSede)

router.get('/periodosgenericos', traerPeriodosgenCursadas)
router.get('/comisionesperiodo/:periodo', traerComisionesporPeriodo)
router.get('/listadoalumnoscomision/:comision/:anio/:sede/:actividad', traerListadoCursadaComision)
export default router

