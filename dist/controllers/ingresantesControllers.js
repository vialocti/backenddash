"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIngresosTanios = exports.getIngresantesTotal = exports.getIngresantesAnioUbi = exports.getIngresantesAnioSedePropuestaTI = exports.getIngresantesAnioSedePropuesta = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//total ingreso por año
var countIngresantes = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(anio) {
    var sqry, resultado;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sqry = "select count(*) as canti  from negocio.sga_propuestas_aspira spa\n        inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n        where anio_academico =".concat(anio, " and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n        ");
            _context.next = 4;
            return _database["default"].query(sqry);

          case 4:
            resultado = _context.sent;
            return _context.abrupt("return", resultado);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function countIngresantes(_x) {
    return _ref.apply(this, arguments);
  };
}(); //insgresos total anio


var getIngresantesTotal = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            anio = req.params.anio;
            _context2.prev = 1;
            _context2.next = 4;
            return countIngresantes(anio);

          case 4:
            resu = _context2.sent;
            //console.log(resu)
            res.send(resu.rows[0]);
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function getIngresantesTotal(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}(); //ingresos entra años


exports.getIngresantesTotal = getIngresantesTotal;

var getIngresosTanios = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$params, anioi, aniof, aniototal, i, totalI, objti;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$params = req.params, anioi = _req$params.anioi, aniof = _req$params.aniof;
            aniototal = [];
            _context3.prev = 2;
            i = Number(anioi);

          case 4:
            if (!(i < Number(aniof) + 1)) {
              _context3.next = 13;
              break;
            }

            _context3.next = 7;
            return countIngresantes(i);

          case 7:
            totalI = _context3.sent;
            objti = {
              anio: i,
              total: totalI.rows[0]
            };
            aniototal.push(objti);

          case 10:
            i++;
            _context3.next = 4;
            break;

          case 13:
            res.send(aniototal);
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](2);
            console.log(_context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 16]]);
  }));

  return function getIngresosTanios(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}(); //total por anio ubicacion


exports.getIngresosTanios = getIngresosTanios;

var getIngresantesAnioUbi = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, count(sa.ubicacion) as canti  from negocio.sga_propuestas_aspira spa\n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where anio_academico =".concat(anio, " and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n    group by sa.ubicacion");
            _context4.prev = 2;
            _context4.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context4.sent;
            res.send(resu.rows);
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function getIngresantesAnioUbi(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}(); //sede propuesta con tipo Ingreso 


exports.getIngresantesAnioUbi = getIngresantesAnioUbi;

var getIngresantesAnioSedePropuestaTI = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select  CASE sa.propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera\n     ,CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,spa.tipo_ingreso , count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa \n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where anio_academico =".concat(anio, " and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n    group by sede,carrera,tipo_ingreso");
            _context5.prev = 2;
            _context5.next = 5;
            return _database["default"].query(sqlstr);

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

  return function getIngresantesAnioSedePropuestaTI(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}(); //sede propuesta sin TI 


exports.getIngresantesAnioSedePropuestaTI = getIngresantesAnioSedePropuestaTI;

var getIngresantesAnioSedePropuesta = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select CASE sa.propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n     CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa \n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where anio_academico =".concat(anio, " and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n    group by sa.ubicacion,sa.propuesta");
            _context6.prev = 2;
            _context6.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context6.sent;
            res.send(resu.rows);
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](2);
            console.log(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 9]]);
  }));

  return function getIngresantesAnioSedePropuesta(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getIngresantesAnioSedePropuesta = getIngresantesAnioSedePropuesta;