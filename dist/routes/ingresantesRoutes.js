"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _ingresantesControllers = require("../controllers/ingresantesControllers");

var router = (0, _express.Router)();
router.get('/ingreTotalAnio/:anio', _ingresantesControllers.getIngresantesTotal);
router.get('/ingreTotalTanio/:anioi/:aniof', _ingresantesControllers.getIngresosTanios);
router.get('/ingresantesTotalIngresoAnioUbi/:anio', _ingresantesControllers.getIngresantesAnioUbi);
router.get('/ingresoPorPropuestaSede/:anio', _ingresantesControllers.getIngresantesAnioSedePropuesta);
router.get('/ingresoPorPropuestaSedeTI/:anio', _ingresantesControllers.getIngresantesAnioSedePropuestaTI);
router.get('/ingresantesaspi/:anio/:sede/:carrera/:tipoI', _ingresantesControllers.getIngresantesAnioSedePropTing);
var _default = router;
exports["default"] = _default;