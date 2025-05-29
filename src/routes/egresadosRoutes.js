/*
const { Router } = require('express');
const {
  cantidadEresadosaniosPropuesta,
  getCantidadEgreSedeCarreraAnio,
  getCantidadEgreSedesAnio,
  getEgresadoSedeCarreraAnio,
  getEgresadosPromedios,
  getListadoEgreSedeCarreraAnio,
  obtenerCertificadosPorAnio
} = require('../controllers/egresadosControllers');

const router = Router();

router.get('/egreanio/:anio/:lapso', getEgresadoSedeCarreraAnio); // promedios por carrera anio
router.get('/egreaniolista/:anio/:lapso/:sede/:car', getListadoEgreSedeCarreraAnio); // listado sede, carrera
router.get('/egresadosaniosede/:anio/:lapso/:sede', getCantidadEgreSedeCarreraAnio); // cantidades por sede
router.get('/egresadosanio/:anio/:lapso', getCantidadEgreSedesAnio); // cantidad total por sede
router.get('/egrepromcaranio/:anio/:car/:lapso/:ficola/:ffcola', getEgresadosPromedios);
router.get('/egreenteanios/:anioI/:anioF/:lapso', cantidadEresadosaniosPropuesta);
router.get('/egresadosaniosfecha', obtenerCertificadosPorAnio);

module.exports = router;

*/

import { cantidadEresadosaniosPropuesta, getCantidadEgreSedeCarreraAnio, getCantidadEgreSedesAnio, getEgresadoSedeCarreraAnio, getEgresadosPromedios, getListadoEgreSedeCarreraAnio, obtenerCertificadosPorAnio } from '../controllers/egresadosControllers.js'

import { Router } from 'express'

const router = Router()

router.get('/egreanio/:anio/:lapso', getEgresadoSedeCarreraAnio)//promedios por carrera anio
router.get('/egreaniolista/:anio/:lapso/:sede/:car', getListadoEgreSedeCarreraAnio)//listado sede,carrera
router.get('/egresadosaniosede/:anio/:lapso/:sede', getCantidadEgreSedeCarreraAnio)//cantidades por sede
router.get('/egresadosanio/:anio/:lapso', getCantidadEgreSedesAnio)//cantidad total por sede
router.get('/egrepromcaranio/:anio/:car/:lapso/:ficola/:ffcola', getEgresadosPromedios)
router.get('/egreenteanios/:anioI/:anioF/:lapso', cantidadEresadosaniosPropuesta)

router.get('/egresadosaniosfecha', obtenerCertificadosPorAnio)
export default router
