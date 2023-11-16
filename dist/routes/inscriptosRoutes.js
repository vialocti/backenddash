"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _inscriptosControllers = require("../controllers/inscriptosControllers");

var router = (0, _express.Router)();
router.get('/inscrTotalIngreso/:anio', _inscriptosControllers.getInscriptosTotal);
router.get('/inscriptosperiodo/:anio', _inscriptosControllers.getInscriptosPeriodos);
router.get('/inscriptTanios/:anioi/:aniof', _inscriptosControllers.getInscriptosTanios);
router.get('/inscriptosSedeanio/:anio', _inscriptosControllers.getInscriptosSedeAnio);
router.get('/inscrPorPropuesta/:anio/:sede/:propuesta', _inscriptosControllers.getInscriptosPorPropuestaSede);
router.get('/inscriptosSedeProTiSexoanio/:anio', _inscriptosControllers.getInscriptosSedeCarreraTipoSexo);
router.get('/totalsedepropuesta/:anio', _inscriptosControllers.getInscriptosTotalSede);
router.get('/totalsedetisexo/:anio/:sede/:tipoI/:sexo', _inscriptosControllers.getIscriptosTipoIngresoSedeSexo);
router.get('/totalsedetisexocarrera/:anio/:sede/:tipoI/:sexo/:carrera', _inscriptosControllers.getIscriptosTipoIngresoSedeSexoCarrera);
var _default = router;
exports["default"] = _default;