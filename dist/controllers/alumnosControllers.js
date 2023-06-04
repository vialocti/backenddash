"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReinscriptosUbiProp = exports.getEvolucionCohorte = exports.getAlumnosPorUbiPropuesta = exports.getAlumnosPorPropuesta = exports.getAlumnosPerActivos = exports.getAlumnosActivos = void 0;

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
    var sqlqy, resu;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sqlqy = " select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, \n    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) \n    group by ubicacion,propuesta order by ubicacion,propuesta";
            _context4.prev = 1;
            _context4.next = 4;
            return _database["default"].query(sqlqy);

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
}(); //desgranamiento cohorte reinscriptos por anio de una cohorte


exports.getReinscriptosUbiProp = getReinscriptosUbiProp;

var TreinscriptosPorAnioCohorte = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(anioI, sede, carrera, i, tipoI) {
    var sqlstr, resultado;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            sqlstr = "select count(*) as reinsc from negocio.sga_reinscripciones where anio_academico=".concat(i, " and\n        alumno in (select sa.alumno  from negocio.sga_propuestas_aspira spa \n        inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n        where anio_academico =").concat(anioI, " and spa.propuesta in (").concat(carrera, ") and sa.ubicacion=").concat(sede, " and spa.tipo_ingreso =").concat(tipoI, " \n        and situacion_asp in (1,2) and not sa.legajo is null \n        )");
            _context6.next = 4;
            return _database["default"].query(sqlstr);

          case 4:
            resultado = _context6.sent;
            return _context6.abrupt("return", resultado);

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 8]]);
  }));

  return function TreinscriptosPorAnioCohorte(_x11, _x12, _x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

var getEvolucionCohorte = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$params, anioI, sede, carrera, anioFC, tipoI, aniototal, i, totalI, objti;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$params = req.params, anioI = _req$params.anioI, sede = _req$params.sede, carrera = _req$params.carrera, anioFC = _req$params.anioFC, tipoI = _req$params.tipoI;
            aniototal = [];
            _context7.prev = 2;
            i = Number(anioI) + 1;

          case 4:
            if (!(i < Number(anioFC) + 1)) {
              _context7.next = 13;
              break;
            }

            _context7.next = 7;
            return TreinscriptosPorAnioCohorte(anioI, sede, carrera, i, tipoI);

          case 7:
            totalI = _context7.sent;
            objti = {
              anio: i,
              total: totalI.rows[0]
            };
            aniototal.push(objti);

          case 10:
            i++;
            _context7.next = 4;
            break;

          case 13:
            res.send(aniototal);
            _context7.next = 18;
            break;

          case 16:
            _context7.prev = 16;
            _context7.t0 = _context7["catch"](2);

          case 18:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 16]]);
  }));

  return function getEvolucionCohorte(_x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getEvolucionCohorte = getEvolucionCohorte;