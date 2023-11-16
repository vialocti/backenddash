"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIngresosTanios = exports.getIngresantesTotal = exports.getIngresantesAnioUbi = exports.getIngresantesAnioSedePropuestaTIsexo = exports.getIngresantesAnioSedePropuesta = exports.getIngresantesAnioSedePropTing = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//total ingresantes por tipo ingreso
var countIngresantesTI = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(anio) {
    var sqry, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sqry = "select tipo_ingreso, count(tipo_ingreso) as canti  from negocio.sga_propuestas_aspira spa\ninner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \nwhere anio_academico =".concat(anio, " and spa.propuesta in (1,2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null\nand not tipo_ingreso is null group by tipo_ingreso");
            _context.prev = 1;
            resu = _database["default"].query(sqry);
            return _context.abrupt("return", resu);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6]]);
  }));

  return function countIngresantesTI(_x) {
    return _ref.apply(this, arguments);
  };
}(); //total ingreso por año


var countIngresantes = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(anio) {
    var sqry, resultado;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            sqry = "select tipo_ingreso, count(tipo_ingreso) as canti  from negocio.sga_propuestas_aspira spa\n        inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n        where anio_academico =".concat(anio, " and spa.propuesta in (1,2,3,6,7,8) and not tipo_ingreso is null and situacion_asp in (1,2) and not sa.legajo is null \n         group by tipo_ingreso");
            _context2.next = 4;
            return _database["default"].query(sqry);

          case 4:
            resultado = _context2.sent;
            return _context2.abrupt("return", resultado.rows);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function countIngresantes(_x2) {
    return _ref2.apply(this, arguments);
  };
}(); //insgresos total anio


var getIngresantesTotal = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            anio = req.params.anio;
            _context3.prev = 1;
            _context3.next = 4;
            return countIngresantesTI(anio);

          case 4:
            resu = _context3.sent;
            //console.log(resu)
            res.send(resu.rows);
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function getIngresantesTotal(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}(); //ingresos entra años


exports.getIngresantesTotal = getIngresantesTotal;

var getIngresosTanios = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$params, anioi, aniof, aniototal, i, totalI, objti;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params = req.params, anioi = _req$params.anioi, aniof = _req$params.aniof;
            aniototal = [];
            _context4.prev = 2;
            i = Number(anioi);

          case 4:
            if (!(i < Number(aniof) + 1)) {
              _context4.next = 13;
              break;
            }

            _context4.next = 7;
            return countIngresantes(i);

          case 7:
            totalI = _context4.sent;
            objti = {
              anio: i,
              total: totalI
            };
            aniototal.push(objti);

          case 10:
            i++;
            _context4.next = 4;
            break;

          case 13:
            res.send(aniototal);
            _context4.next = 19;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 16]]);
  }));

  return function getIngresosTanios(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}(); //total por anio ubicacion


exports.getIngresosTanios = getIngresosTanios;

var getIngresantesAnioUbi = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, tipo_ingreso, count(spa.tipo_ingreso) as canti  from negocio.sga_propuestas_aspira spa\n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where anio_academico =".concat(anio, " and spa.propuesta in (1,2,3,6,7,8) and situacion_asp in (1,2) and not tipo_ingreso is null  and not sa.legajo is null \n    group by sa.ubicacion,tipo_ingreso");
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

  return function getIngresantesAnioUbi(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}(); //sede propuesta con tipo Ingreso y sexo


exports.getIngresantesAnioUbi = getIngresantesAnioUbi;

var getIngresantesAnioSedePropuestaTIsexo = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select  CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' WHEN 8 THEN 'CP' END as carrera\n    ,CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,spa.tipo_ingreso ,sexo ,count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa \n   inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n   inner join negocio.mdp_personas mp on mp.persona=spa.persona\n   where anio_academico =".concat(anio, " and spa.propuesta in (1,2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n   group by sede,carrera,sexo,tipo_ingreso");
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

  return function getIngresantesAnioSedePropuestaTIsexo(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}(); //sede propuesta sin TI 


exports.getIngresantesAnioSedePropuestaTIsexo = getIngresantesAnioSedePropuestaTIsexo;

var getIngresantesAnioSedePropuesta = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select CASE sa.propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n     CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa \n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where anio_academico =".concat(anio, " and spa.propuesta in (1,2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null \n    group by sa.ubicacion,sa.propuesta");
            _context7.prev = 2;
            _context7.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context7.sent;
            res.send(resu.rows);
            _context7.next = 12;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](2);
            console.log(_context7.t0);

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 9]]);
  }));

  return function getIngresantesAnioSedePropuesta(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}(); //ingresantes sede propuesta carrera anio tipoi=1 o 6


exports.getIngresantesAnioSedePropuesta = getIngresantesAnioSedePropuesta;

var getIngresantesAnioSedePropTing = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$params2, sede, carrera, anio, tipoI, sqlstr, resu;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$params2 = req.params, sede = _req$params2.sede, carrera = _req$params2.carrera, anio = _req$params2.anio, tipoI = _req$params2.tipoI;
            sqlstr = "select count(sa.alumno) as canti  from negocio.sga_propuestas_aspira spa \n    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta \n    where  sa.ubicacion=".concat(sede, " and anio_academico =").concat(anio, " and spa.propuesta= ").concat(carrera, "\n    and spa.tipo_ingreso=").concat(tipoI, " and situacion_asp in (1,2) and not sa.legajo is null "); // console.warn(sqlstr)

            _context8.prev = 2;
            _context8.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context8.sent;
            res.send(resu.rows);
            _context8.next = 12;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](2);
            console.log(_context8.t0);

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[2, 9]]);
  }));

  return function getIngresantesAnioSedePropTing(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getIngresantesAnioSedePropTing = getIngresantesAnioSedePropTing;