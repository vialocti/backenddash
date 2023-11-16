"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _cursadasControllers = require("../controllers/cursadasControllers");

var router = (0, _express.Router)();
router.get('/periodoslectivos/:anio', _cursadasControllers.getPeriodosLectivosAnio); //periodos lectivos

router.get('/listcomisionesanio/:anio', _cursadasControllers.getListComisionesAnio); //listado comisiones

router.get('/comisionesanio/:anio', _cursadasControllers.getComisionesAnio); //cantidad de comisiones por sede

router.get('/comisionesperlect/:anio', _cursadasControllers.getComisionesSedePL); //cantidad de comisiones por sede periodo

router.get('/cantiInsccomisiones/:anio', _cursadasControllers.getComisionesCantiInscriptos);
router.get('/cantiinscriptosComiplan/:anio', _cursadasControllers.getComisionesCantiInscriptosPlan);
router.get('/detalleactasCur/:anio/:origen/:periodo', _cursadasControllers.resultadoActaDetallesporPeriodo);
router.get('/detalleporcomision/:anio/:ncomision', _cursadasControllers.resultadoActaDetallesporComision);
var _default = router;
exports["default"] = _default;