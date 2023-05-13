"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIscriptosTipoIngresoSedeSexoCarrera = exports.getIscriptosTipoIngresoSedeSexo = exports.getInscriptosTotalSede = exports.getInscriptosTotal = exports.getInscriptosPorPropuestaSede = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//inscriptos total anio
var getInscriptosTotal = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            anio = req.params.anio;
            _context.next = 3;
            return _database["default"].query("SELECT COUNT(*)as catidad FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio));

          case 3:
            resu = _context.sent;
            res.send(resu.rows[0]);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getInscriptosTotal(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // total por año carrera sede


exports.getInscriptosTotal = getInscriptosTotal;

var getInscriptosPorPropuestaSede = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$params, anio, sede, propuesta, strq, resu;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$params = req.params, anio = _req$params.anio, sede = _req$params.sede, propuesta = _req$params.propuesta;
            strq = "SELECT COUNT(*)as nro FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND propuesta=").concat(propuesta);
            _context2.next = 4;
            return _database["default"].query(strq);

          case 4:
            resu = _context2.sent;
            res.send(resu.rows[0]);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getInscriptosPorPropuestaSede(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //total propuesta por año sede y carrera agrupados 


exports.getInscriptosPorPropuestaSede = getInscriptosPorPropuestaSede;

var getInscriptosTotalSede = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            anio = req.params.anio;
            _context3.next = 3;
            return _database["default"].query("SELECT ubicacion ,propuesta,tipo_ingreso ,COUNT(*) as nro FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " Group by ubicacion,propuesta,tipo_ingreso order by ubicacion,propuesta"));

          case 3:
            resu = _context3.sent;
            res.send(resu.rows);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getInscriptosTotalSede(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // total por sede, sexo, tipo inscripcion


exports.getInscriptosTotalSede = getInscriptosTotalSede;

var getIscriptosTipoIngresoSedeSexo = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$params2, anio, sede, tipoI, sexo, tipoIngreso, cabeza, injoin, condi, strquery, resu;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params2 = req.params, anio = _req$params2.anio, sede = _req$params2.sede, tipoI = _req$params2.tipoI, sexo = _req$params2.sexo;
            tipoIngreso = '';

            if (tipoI === '1') {
              tipoIngreso = 'tipo_ingreso in (1,3)';
            } else {
              tipoIngreso = 'tipo_ingreso in (4,6)';
            }

            cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas ';
            injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona ';
            condi = "WHERE anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND ").concat(tipoIngreso, " AND per.sexo='").concat(sexo, "'");
            strquery = "".concat(cabeza).concat(injoin).concat(condi);
            console.log(strquery);
            _context4.prev = 8;
            _context4.next = 11;
            return _database["default"].query(strquery);

          case 11:
            resu = _context4.sent;
            res.send(resu.rows);
            _context4.next = 18;
            break;

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4["catch"](8);
            console.log(_context4.t0);

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[8, 15]]);
  }));

  return function getIscriptosTipoIngresoSedeSexo(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); // total por sede, sexo, tipo inscripcion


exports.getIscriptosTipoIngresoSedeSexo = getIscriptosTipoIngresoSedeSexo;

var getIscriptosTipoIngresoSedeSexoCarrera = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$params3, anio, sede, tipoI, sexo, carrera, tipoIngreso, cabeza, injoin, condi, strquery, resu;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params3 = req.params, anio = _req$params3.anio, sede = _req$params3.sede, tipoI = _req$params3.tipoI, sexo = _req$params3.sexo, carrera = _req$params3.carrera;
            tipoIngreso = '';

            if (tipoI === '1') {
              tipoIngreso = 'tipo_ingreso in (1,3)';
            } else {
              tipoIngreso = 'tipo_ingreso in (4,6)';
            }

            cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas ';
            injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona ';
            condi = "WHERE anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND ").concat(tipoIngreso, " AND per.sexo='").concat(sexo, "' and propuesta=").concat(carrera);
            strquery = "".concat(cabeza).concat(injoin).concat(condi);
            console.log(strquery);
            _context5.prev = 8;
            _context5.next = 11;
            return _database["default"].query(strquery);

          case 11:
            resu = _context5.sent;
            res.send(resu.rows);
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](8);
            console.log(_context5.t0);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[8, 15]]);
  }));

  return function getIscriptosTipoIngresoSedeSexoCarrera(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getIscriptosTipoIngresoSedeSexoCarrera = getIscriptosTipoIngresoSedeSexoCarrera;