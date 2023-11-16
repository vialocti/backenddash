"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _examenesControllers = require("../controllers/examenesControllers");

var router = (0, _express.Router)();
router.get('/mesasAnio/:anio', _examenesControllers.getMesasExamen);
router.get('/mesasAnioARU/:anio', _examenesControllers.getActasExamenTotalResu);
router.get('/datosActa/:idacta', _examenesControllers.getResultadosPorActa);
var _default = router;
exports["default"] = _default;