"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _rendimientoControllers = require("../controllers/rendimientoControllers");

var router = (0, _express.Router)();
router.get('/aluinfouno/:ubicacion/:propuesta/:plan/:planversion/:anioipro', _rendimientoControllers.getAlumnosInfoSedePropuestaplanversion);
router.get('/planversion', _rendimientoControllers.getplanesVersion);
var _default = router;
exports["default"] = _default;