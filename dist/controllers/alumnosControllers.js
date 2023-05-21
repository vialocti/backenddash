"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReinscriptosUbiProp = exports.getAlumnosPorUbiPropuesta = exports.getAlumnosPorPropuesta = exports.getAlumnosPerActivos = exports.getAlumnosActivos = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//cantidad de alumnos activos
var getAlumnosActivos = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var sql, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sql = "select count(legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)";
            _context.prev = 1;
            _context.next = 4;
            return _database["default"].query(sql);

          case 4:
            resu = _context.sent;
            res.send(resu.rows);
            _context.next = 10;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](1);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 8]]);
  }));

  return function getAlumnosActivos(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //cantidad de alumnos fijos


exports.getAlumnosActivos = getAlumnosActivos;

var getAlumnosPerActivos = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var sql, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sql = "select count(distinct legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)";
            _context2.prev = 1;
            _context2.next = 4;
            return _database["default"].query(sql);

          case 4:
            resu = _context2.sent;
            res.send(resu.rows);
            _context2.next = 10;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function getAlumnosPerActivos(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //alumnos por propuestas


exports.getAlumnosPerActivos = getAlumnosPerActivos;

var getAlumnosPorPropuesta = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var sql, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sql = "select CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) \n     group by propuesta order by propuesta";
            _context3.prev = 1;
            _context3.next = 4;
            return _database["default"].query(sql);

          case 4:
            resu = _context3.sent;
            res.send(resu.rows);
            _context3.next = 10;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function getAlumnosPorPropuesta(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); //alumnos por ubicacion - propuesta


exports.getAlumnosPorPropuesta = getAlumnosPorPropuesta;

var getAlumnosPorUbiPropuesta = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var sql, resu;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sql = " select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, \n    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) \n    group by ubicacion,propuesta order by ubicacion,propuesta";
            _context4.prev = 1;
            _context4.next = 4;
            return _database["default"].query(sql);

          case 4:
            resu = _context4.sent;
            res.send(resu.rows);
            _context4.next = 10;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 8]]);
  }));

  return function getAlumnosPorUbiPropuesta(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); //reinscripciones
//cantidad reinscripciones por anio, ubicacion,propuesta


exports.getAlumnosPorUbiPropuesta = getAlumnosPorUbiPropuesta;

var getReinscriptosUbiProp = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var anio, sql, resu;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            anio = req.params.anio;
            sql = "select CASE alu.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,\n     CASE alu.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n    count(alu.propuesta) from negocio.sga_reinscripciones as rei\n     inner join negocio.sga_alumnos as alu on alu.alumno=rei.alumno\n     where rei.anio_academico=".concat(anio, " and  not alu.legajo isnull and  alu.propuesta in (1,2,3,6,7,8)\n     group by alu.ubicacion,alu.propuesta order by alu.ubicacion,alu.propuesta ");
            _context5.prev = 2;
            _context5.next = 5;
            return _database["default"].query(sql);

          case 5:
            resu = _context5.sent;
            res.send(resu.rows);
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](2);
            console.log(_context5.t0);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 9]]);
  }));

  return function getReinscriptosUbiProp(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getReinscriptosUbiProp = getReinscriptosUbiProp;