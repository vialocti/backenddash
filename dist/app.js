"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _ingresantesRoutes = _interopRequireDefault(require("./routes/ingresantesRoutes"));

var _inscriptosRoutes = _interopRequireDefault(require("./routes/inscriptosRoutes"));

var _egresadosRoutes = _interopRequireDefault(require("./routes/egresadosRoutes"));

var _alumnosRoutes = _interopRequireDefault(require("./routes/alumnosRoutes"));

var _cursadasRoutes = _interopRequireDefault(require("./routes/cursadasRoutes"));

var _examenesRoutes = _interopRequireDefault(require("./routes/examenesRoutes"));

var _rendimientoRoutes = _interopRequireDefault(require("./routes/rendimientoRoutes"));

//
var app = (0, _express["default"])(); //

app.set('port', '5000'); //

app.use((0, _morgan["default"])('dev'));
app.use((0, _cors["default"])());
app.use(_express["default"].json()); //

app.use('/dbingreso', _ingresantesRoutes["default"]);
app.use('/dbinscriptos', _inscriptosRoutes["default"]);
app.use('/dbegresados', _egresadosRoutes["default"]);
app.use('/alutivos', _alumnosRoutes["default"]);
app.use('/cursadas', _cursadasRoutes["default"]);
app.use('/examenes', _examenesRoutes["default"]);
app.use('/rendimiento', _rendimientoRoutes["default"]);
var _default = app;
exports["default"] = _default;