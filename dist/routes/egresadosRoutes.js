"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _egresadosControllers = require("../controllers/egresadosControllers");

var router = (0, _express.Router)();
router.get('/egreanio/:anio/:lapso', _egresadosControllers.getEgresadoSedeCarreraAnio);
router.get('/egreaniolista/:anio/:lapso/:sede/:car', _egresadosControllers.getListadoEgreSedeCarreraAnio);
var _default = router;
exports["default"] = _default;