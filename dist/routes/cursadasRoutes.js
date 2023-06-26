"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _cursadasControllers = require("../controllers/cursadasControllers");

var router = (0, _express.Router)();
router.get('/liscomisionesanio/:anio', _cursadasControllers.getListComisionesAnio);
router.get('/comisionesanio/:anio', _cursadasControllers.getComisionesAnio);
router.get('/comisionesperlect/:anio', _cursadasControllers.getComisionesSedePL);
var _default = router;
exports["default"] = _default;