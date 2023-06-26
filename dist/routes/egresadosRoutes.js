"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _egresadosControllers = require("../controllers/egresadosControllers");

var router = (0, _express.Router)();
router.get('/egreanio/:anio/:lapso', _egresadosControllers.getEgresadoSedeCarreraAnio); //promedios por carrera

router.get('/egreaniolista/:anio/:lapso/:sede/:car', _egresadosControllers.getListadoEgreSedeCarreraAnio); //listado sede,carrera

router.get('/egresadosaniosede/:anio/:lapso/:sede', _egresadosControllers.getCantidadEgreSedeCarreraAnio); //cantidades por sede

router.get('/egresadosanio/:anio/:lapso', _egresadosControllers.getCantidadEgreSedesAnio); //cantidad total por sede

router.get('/egrepromcaranio/:anio/:car/:lapso', _egresadosControllers.getEgresadosPromedios);
var _default = router;
exports["default"] = _default;