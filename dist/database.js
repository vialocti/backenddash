"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _configdb = require("./configdb");

var coneccionDB = new _pg.Pool(_configdb.config);
var _default = coneccionDB;
exports["default"] = _default;